const express = require('express');
const router = express.Router();
const {
  calculatePrice,
  getQuickQuote,
  getPricingTiers,
  getPricingConfig
} = require('../controllers/pricingController');

// @route   POST /api/pricing/calculate
// @desc    Calculate detailed pricing for luggage transportation
// @access  Public
router.post('/calculate', calculatePrice);

// @route   GET /api/pricing/quote
// @desc    Get quick price quote for distance estimation
// @access  Public
// @query   distance, sourceType, destinationType
router.get('/quote', getQuickQuote);

// @route   GET /api/pricing/tiers
// @desc    Get pricing tier information
// @access  Public
// @query   distance (optional)
router.get('/tiers', getPricingTiers);

// @route   GET /api/pricing/config
// @desc    Get current pricing configuration
// @access  Public
router.get('/config', getPricingConfig);

module.exports = router;
