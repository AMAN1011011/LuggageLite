const express = require('express');
const router = express.Router();
const {
  getCategories,
  getItemsByCategory,
  searchItems,
  getPopularItems,
  getItemById,
  createCustomItem,
  getChecklistStats
} = require('../controllers/checklistController');

// @route   GET /api/checklist/categories
// @desc    Get all item categories with optional items
// @access  Public
// @query   includeItems (boolean)
router.get('/categories', getCategories);

// @route   GET /api/checklist/categories/:categoryId/items
// @desc    Get items by category
// @access  Public
// @query   limit, search, sortBy
router.get('/categories/:categoryId/items', getItemsByCategory);

// @route   GET /api/checklist/search
// @desc    Search items across all categories
// @access  Public
// @query   q (search query), category, riskLevel, limit
router.get('/search', searchItems);

// @route   GET /api/checklist/popular
// @desc    Get popular/recommended items
// @access  Public
// @query   limit, category
router.get('/popular', getPopularItems);

// @route   GET /api/checklist/items/:itemId
// @desc    Get item details by ID
// @access  Public
router.get('/items/:itemId', getItemById);

// @route   POST /api/checklist/custom-item
// @desc    Create a custom item
// @access  Public (could be protected later)
router.post('/custom-item', createCustomItem);

// @route   GET /api/checklist/stats
// @desc    Get checklist statistics
// @access  Public
router.get('/stats', getChecklistStats);

module.exports = router;
