/**
 * Seed script for Item Categories and Items
 * This populates the database with common valuable items that users might carry
 */

const ItemCategory = require('../models/ItemCategory');
const Item = require('../models/Item');

// Item categories with their properties
const categories = [
  {
    name: 'Electronics',
    description: 'Electronic devices and gadgets',
    icon: '💻',
    color: '#3B82F6',
    riskLevel: 'high',
    insuranceMultiplier: 2.0,
    sortOrder: 1
  },
  {
    name: 'Jewelry & Accessories',
    description: 'Valuable jewelry, watches, and accessories',
    icon: '💎',
    color: '#F59E0B',
    riskLevel: 'critical',
    insuranceMultiplier: 3.0,
    sortOrder: 2
  },
  {
    name: 'Documents',
    description: 'Important documents and certificates',
    icon: '📄',
    color: '#10B981',
    riskLevel: 'critical',
    insuranceMultiplier: 1.5,
    sortOrder: 3
  },
  {
    name: 'Clothing & Fashion',
    description: 'Expensive clothing, shoes, and fashion items',
    icon: '👔',
    color: '#8B5CF6',
    riskLevel: 'medium',
    insuranceMultiplier: 1.2,
    sortOrder: 4
  },
  {
    name: 'Personal Care',
    description: 'Cosmetics, perfumes, and personal care items',
    icon: '💄',
    color: '#EC4899',
    riskLevel: 'low',
    insuranceMultiplier: 1.1,
    sortOrder: 5
  },
  {
    name: 'Sports & Recreation',
    description: 'Sports equipment and recreational items',
    icon: '🏃',
    color: '#EF4444',
    riskLevel: 'medium',
    insuranceMultiplier: 1.3,
    sortOrder: 6
  },
  {
    name: 'Books & Media',
    description: 'Books, CDs, DVDs, and other media',
    icon: '📚',
    color: '#6366F1',
    riskLevel: 'low',
    insuranceMultiplier: 1.0,
    sortOrder: 7
  },
  {
    name: 'Others',
    description: 'Other valuable items not categorized above',
    icon: '📦',
    color: '#6B7280',
    riskLevel: 'medium',
    insuranceMultiplier: 1.2,
    sortOrder: 8
  }
];

// Predefined items for each category
const itemsData = {
  'Electronics': [
    {
      name: 'Laptop Computer',
      description: 'Personal or work laptop computer',
      estimatedValue: { min: 25000, max: 150000 },
      riskLevel: 'high',
      fragile: true,
      requiresSpecialHandling: true,
      commonBrands: ['Apple', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer'],
      tags: ['computer', 'work', 'portable'],
      insuranceRequired: true,
      popularity: 100
    },
    {
      name: 'Smartphone',
      description: 'Mobile phone or smartphone',
      estimatedValue: { min: 10000, max: 120000 },
      riskLevel: 'high',
      fragile: true,
      commonBrands: ['Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Google'],
      tags: ['phone', 'mobile', 'communication'],
      insuranceRequired: true,
      popularity: 95
    },
    {
      name: 'Tablet',
      description: 'Tablet computer or iPad',
      estimatedValue: { min: 15000, max: 80000 },
      riskLevel: 'high',
      fragile: true,
      commonBrands: ['Apple', 'Samsung', 'Microsoft', 'Lenovo'],
      tags: ['tablet', 'portable', 'touchscreen'],
      popularity: 70
    },
    {
      name: 'Digital Camera',
      description: 'Digital camera or DSLR',
      estimatedValue: { min: 20000, max: 200000 },
      riskLevel: 'high',
      fragile: true,
      requiresSpecialHandling: true,
      commonBrands: ['Canon', 'Nikon', 'Sony', 'Fujifilm'],
      tags: ['photography', 'camera', 'professional'],
      popularity: 60
    },
    {
      name: 'Gaming Console',
      description: 'Video game console',
      estimatedValue: { min: 25000, max: 60000 },
      riskLevel: 'medium',
      commonBrands: ['Sony PlayStation', 'Microsoft Xbox', 'Nintendo'],
      tags: ['gaming', 'entertainment', 'console'],
      popularity: 40
    },
    {
      name: 'Headphones/Earphones',
      description: 'Premium headphones or wireless earphones',
      estimatedValue: { min: 2000, max: 40000 },
      riskLevel: 'medium',
      fragile: true,
      commonBrands: ['Apple', 'Sony', 'Bose', 'Sennheiser', 'JBL'],
      tags: ['audio', 'music', 'wireless'],
      popularity: 80
    }
  ],
  'Jewelry & Accessories': [
    {
      name: 'Gold Jewelry',
      description: 'Gold rings, necklaces, bracelets, or earrings',
      estimatedValue: { min: 10000, max: 500000 },
      riskLevel: 'critical',
      requiresSpecialHandling: true,
      tags: ['gold', 'precious', 'traditional'],
      insuranceRequired: true,
      popularity: 85
    },
    {
      name: 'Diamond Jewelry',
      description: 'Diamond rings, necklaces, or other diamond jewelry',
      estimatedValue: { min: 25000, max: 1000000 },
      riskLevel: 'critical',
      requiresSpecialHandling: true,
      tags: ['diamond', 'precious', 'luxury'],
      insuranceRequired: true,
      popularity: 60
    },
    {
      name: 'Luxury Watch',
      description: 'High-end wristwatch or smartwatch',
      estimatedValue: { min: 15000, max: 500000 },
      riskLevel: 'high',
      commonBrands: ['Rolex', 'Apple', 'Samsung', 'Omega', 'Tissot'],
      tags: ['watch', 'timepiece', 'luxury'],
      insuranceRequired: true,
      popularity: 70
    },
    {
      name: 'Silver Jewelry',
      description: 'Silver rings, necklaces, bracelets, or earrings',
      estimatedValue: { min: 2000, max: 50000 },
      riskLevel: 'high',
      tags: ['silver', 'jewelry', 'accessories'],
      popularity: 60
    }
  ],
  'Documents': [
    {
      name: 'Passport',
      description: 'Travel passport document',
      estimatedValue: { min: 5000, max: 10000 },
      riskLevel: 'critical',
      requiresSpecialHandling: true,
      tags: ['travel', 'identity', 'government'],
      insuranceRequired: false,
      customizable: false,
      popularity: 90
    },
    {
      name: 'Educational Certificates',
      description: 'Degree certificates, mark sheets, or diplomas',
      estimatedValue: { min: 1000, max: 5000 },
      riskLevel: 'critical',
      tags: ['education', 'certificates', 'academic'],
      customizable: false,
      popularity: 75
    },
    {
      name: 'Property Documents',
      description: 'Property deeds, agreements, or legal documents',
      estimatedValue: { min: 2000, max: 10000 },
      riskLevel: 'critical',
      requiresSpecialHandling: true,
      tags: ['legal', 'property', 'important'],
      customizable: false,
      popularity: 40
    },
    {
      name: 'Financial Documents',
      description: 'Bank statements, insurance papers, or financial records',
      estimatedValue: { min: 500, max: 2000 },
      riskLevel: 'high',
      tags: ['financial', 'banking', 'records'],
      popularity: 50
    }
  ],
  'Clothing & Fashion': [
    {
      name: 'Designer Clothing',
      description: 'High-end or designer brand clothing',
      estimatedValue: { min: 5000, max: 100000 },
      riskLevel: 'medium',
      commonBrands: ['Gucci', 'Louis Vuitton', 'Prada', 'Armani'],
      tags: ['designer', 'luxury', 'fashion'],
      popularity: 30
    },
    {
      name: 'Leather Goods',
      description: 'Leather bags, wallets, or accessories',
      estimatedValue: { min: 2000, max: 50000 },
      riskLevel: 'medium',
      commonBrands: ['Coach', 'Michael Kors', 'Fossil', 'Hidesign'],
      tags: ['leather', 'accessories', 'bags'],
      popularity: 60
    },
    {
      name: 'Branded Shoes',
      description: 'Designer or premium brand footwear',
      estimatedValue: { min: 3000, max: 75000 },
      riskLevel: 'low',
      commonBrands: ['Nike', 'Adidas', 'Puma', 'Reebok', 'Jordan'],
      tags: ['shoes', 'footwear', 'sports'],
      popularity: 70
    }
  ],
  'Personal Care': [
    {
      name: 'Premium Cosmetics',
      description: 'High-end makeup or skincare products',
      estimatedValue: { min: 1000, max: 20000 },
      riskLevel: 'low',
      fragile: true,
      commonBrands: ['MAC', 'Urban Decay', 'Chanel', 'Dior'],
      tags: ['makeup', 'skincare', 'beauty'],
      popularity: 50
    },
    {
      name: 'Luxury Perfume',
      description: 'Designer perfume or cologne',
      estimatedValue: { min: 2000, max: 30000 },
      riskLevel: 'medium',
      fragile: true,
      commonBrands: ['Chanel', 'Dior', 'Tom Ford', 'Creed'],
      tags: ['fragrance', 'perfume', 'luxury'],
      popularity: 60
    }
  ],
  'Sports & Recreation': [
    {
      name: 'Sports Equipment',
      description: 'Professional sports gear or equipment',
      estimatedValue: { min: 5000, max: 50000 },
      riskLevel: 'medium',
      tags: ['sports', 'equipment', 'professional'],
      popularity: 40
    },
    {
      name: 'Musical Instrument',
      description: 'Guitar, keyboard, or other musical instruments',
      estimatedValue: { min: 10000, max: 200000 },
      riskLevel: 'high',
      fragile: true,
      requiresSpecialHandling: true,
      tags: ['music', 'instrument', 'creative'],
      popularity: 25
    }
  ],
  'Books & Media': [
    {
      name: 'Rare Books',
      description: 'Collectible or rare books',
      estimatedValue: { min: 1000, max: 50000 },
      riskLevel: 'medium',
      tags: ['books', 'collectible', 'rare'],
      popularity: 15
    },
    {
      name: 'Art Supplies',
      description: 'Professional art materials and supplies',
      estimatedValue: { min: 2000, max: 25000 },
      riskLevel: 'low',
      tags: ['art', 'creative', 'supplies'],
      popularity: 20
    }
  ]
};

async function seedItemsAndCategories() {
  try {
    console.log('🌱 Starting to seed item categories and items...');

    // Clear existing data (optional - comment out for production)
    // await ItemCategory.deleteMany({});
    // await Item.deleteMany({});
    // console.log('🗑️ Cleared existing data');

    // Create categories
    const createdCategories = {};
    for (const categoryData of categories) {
      try {
        let category = await ItemCategory.findOne({ name: categoryData.name });
        if (!category) {
          category = new ItemCategory(categoryData);
          await category.save();
          console.log(`✅ Created category: ${category.name}`);
        } else {
          console.log(`⏭️ Category already exists: ${category.name}`);
        }
        createdCategories[categoryData.name] = category;
      } catch (error) {
        console.log(`⚠️ Error creating category ${categoryData.name}:`, error.message);
      }
    }

    // Create items for each category
    let totalItemsCreated = 0;
    for (const [categoryName, items] of Object.entries(itemsData)) {
      const category = createdCategories[categoryName];
      if (!category) {
        console.log(`❌ Category not found: ${categoryName}`);
        continue;
      }

      for (const itemData of items) {
        try {
          const existingItem = await Item.findOne({ 
            name: itemData.name, 
            category: category._id 
          });
          
          if (!existingItem) {
            const item = new Item({
              ...itemData,
              category: category._id
            });
            await item.save();
            console.log(`  ✅ Created item: ${item.name}`);
            totalItemsCreated++;
          } else {
            console.log(`  ⏭️ Item already exists: ${itemData.name}`);
          }
        } catch (error) {
          console.log(`  ❌ Error creating item ${itemData.name}:`, error.message);
        }
      }
    }

    console.log(`\n🎉 Seeding completed!`);
    console.log(`📊 Categories: ${Object.keys(createdCategories).length}`);
    console.log(`📦 New items created: ${totalItemsCreated}`);
    
    return {
      categories: Object.values(createdCategories),
      itemsCreated: totalItemsCreated
    };

  } catch (error) {
    console.error('❌ Error seeding items and categories:', error);
    throw error;
  }
}

module.exports = {
  seedItemsAndCategories,
  categories,
  itemsData
};
