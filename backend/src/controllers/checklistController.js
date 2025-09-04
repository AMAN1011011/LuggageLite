const ItemCategory = require('../models/ItemCategory');
const Item = require('../models/Item');
const BookingItem = require('../models/BookingItem');

/**
 * Get all item categories with their items
 */
const getCategories = async (req, res) => {
  try {
    const { includeItems = 'true' } = req.query;
    
    const categories = await ItemCategory.find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 });

    if (includeItems === 'true') {
      // Get items for each category
      const categoriesWithItems = await Promise.all(
        categories.map(async (category) => {
          const items = await Item.find({ 
            category: category._id, 
            isActive: true 
          })
          .sort({ popularity: -1, name: 1 })
          .select('-__v');

          return {
            ...category.toObject(),
            items: items,
            itemCount: items.length
          };
        })
      );

      res.json({
        success: true,
        data: {
          categories: categoriesWithItems,
          totalCategories: categoriesWithItems.length,
          totalItems: categoriesWithItems.reduce((sum, cat) => sum + cat.itemCount, 0)
        }
      });
    } else {
      res.json({
        success: true,
        data: {
          categories: categories,
          totalCategories: categories.length
        }
      });
    }

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
};

/**
 * Get items by category
 */
const getItemsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { limit = 50, search = '', sortBy = 'popularity' } = req.query;

    // Build query
    const query = { 
      category: categoryId, 
      isActive: true 
    };

    // Add search filter if provided
    if (search.trim()) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
        { commonBrands: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort criteria
    let sortCriteria = {};
    switch (sortBy) {
      case 'name':
        sortCriteria = { name: 1 };
        break;
      case 'value_low':
        sortCriteria = { 'estimatedValue.min': 1 };
        break;
      case 'value_high':
        sortCriteria = { 'estimatedValue.max': -1 };
        break;
      case 'risk':
        sortCriteria = { riskLevel: -1, popularity: -1 };
        break;
      default: // popularity
        sortCriteria = { popularity: -1, name: 1 };
    }

    const items = await Item.find(query)
      .populate('category', 'name icon color')
      .sort(sortCriteria)
      .limit(parseInt(limit))
      .select('-__v');

    res.json({
      success: true,
      data: {
        items: items,
        count: items.length,
        filters: {
          categoryId,
          search,
          sortBy,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get items by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch items',
      error: error.message
    });
  }
};

/**
 * Search items across all categories
 */
const searchItems = async (req, res) => {
  try {
    const { q: searchQuery, category, riskLevel, limit = 20 } = req.query;

    if (!searchQuery || searchQuery.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    // Build query
    const query = { isActive: true };

    // Add search criteria
    query.$or = [
      { name: { $regex: searchQuery, $options: 'i' } },
      { description: { $regex: searchQuery, $options: 'i' } },
      { tags: { $in: [new RegExp(searchQuery, 'i')] } },
      { commonBrands: { $in: [new RegExp(searchQuery, 'i')] } }
    ];

    // Add filters
    if (category) {
      query.category = category;
    }
    if (riskLevel) {
      query.riskLevel = riskLevel;
    }

    const items = await Item.find(query)
      .populate('category', 'name icon color')
      .sort({ popularity: -1, name: 1 })
      .limit(parseInt(limit))
      .select('-__v');

    res.json({
      success: true,
      data: {
        items: items,
        count: items.length,
        query: searchQuery,
        filters: {
          category,
          riskLevel,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Search items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search items',
      error: error.message
    });
  }
};

/**
 * Get popular/recommended items
 */
const getPopularItems = async (req, res) => {
  try {
    const { limit = 10, category } = req.query;

    const query = { isActive: true };
    if (category) {
      query.category = category;
    }

    const items = await Item.find(query)
      .populate('category', 'name icon color')
      .sort({ popularity: -1, name: 1 })
      .limit(parseInt(limit))
      .select('-__v');

    res.json({
      success: true,
      data: {
        items: items,
        count: items.length
      }
    });

  } catch (error) {
    console.error('Get popular items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch popular items',
      error: error.message
    });
  }
};

/**
 * Get item details by ID
 */
const getItemById = async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await Item.findById(itemId)
      .populate('category', 'name description icon color riskLevel')
      .select('-__v');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.json({
      success: true,
      data: { item }
    });

  } catch (error) {
    console.error('Get item by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch item details',
      error: error.message
    });
  }
};

/**
 * Create a custom item (for items not in predefined list)
 */
const createCustomItem = async (req, res) => {
  try {
    const {
      name,
      description,
      categoryId,
      estimatedValue,
      riskLevel = 'medium',
      fragile = false,
      brand,
      tags = []
    } = req.body;

    // Validate required fields
    if (!name || !description || !categoryId || !estimatedValue) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, category, and estimated value are required'
      });
    }

    // Verify category exists
    const category = await ItemCategory.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Create custom item
    const customItem = new Item({
      name: name.trim(),
      description: description.trim(),
      category: categoryId,
      estimatedValue: {
        min: estimatedValue,
        max: estimatedValue,
        currency: 'INR'
      },
      riskLevel,
      fragile,
      commonBrands: brand ? [brand.trim()] : [],
      tags: tags.map(tag => tag.toLowerCase().trim()),
      customizable: true,
      popularity: 0 // Custom items start with 0 popularity
    });

    await customItem.save();

    // Populate category info
    await customItem.populate('category', 'name icon color');

    res.status(201).json({
      success: true,
      message: 'Custom item created successfully',
      data: { item: customItem }
    });

  } catch (error) {
    console.error('Create custom item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create custom item',
      error: error.message
    });
  }
};

/**
 * Get checklist statistics
 */
const getChecklistStats = async (req, res) => {
  try {
    const [
      totalCategories,
      totalItems,
      totalBookingItems,
      riskStats
    ] = await Promise.all([
      ItemCategory.countDocuments({ isActive: true }),
      Item.countDocuments({ isActive: true }),
      BookingItem.countDocuments(),
      Item.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$riskLevel', count: { $sum: 1 } } }
      ])
    ]);

    const riskDistribution = {};
    riskStats.forEach(stat => {
      riskDistribution[stat._id] = stat.count;
    });

    res.json({
      success: true,
      data: {
        totalCategories,
        totalItems,
        totalBookingItems,
        riskDistribution
      }
    });

  } catch (error) {
    console.error('Get checklist stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch checklist statistics',
      error: error.message
    });
  }
};

module.exports = {
  getCategories,
  getItemsByCategory,
  searchItems,
  getPopularItems,
  getItemById,
  createCustomItem,
  getChecklistStats
};
