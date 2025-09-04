const mongoose = require('mongoose');

const itemCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String, // Icon name or emoji for UI display
    default: '📦'
  },
  color: {
    type: String, // Color code for UI theming
    default: '#6B7280'
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  insuranceMultiplier: {
    type: Number,
    default: 1.0,
    min: 0.5,
    max: 5.0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
itemCategorySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for performance
itemCategorySchema.index({ name: 1 });
itemCategorySchema.index({ isActive: 1, sortOrder: 1 });

const ItemCategory = mongoose.model('ItemCategory', itemCategorySchema);

module.exports = ItemCategory;
