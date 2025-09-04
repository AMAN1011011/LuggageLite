const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ItemCategory',
    required: true
  },
  estimatedValue: {
    min: {
      type: Number,
      required: true,
      min: 0
    },
    max: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true
  },
  fragile: {
    type: Boolean,
    default: false
  },
  requiresSpecialHandling: {
    type: Boolean,
    default: false
  },
  commonBrands: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  insuranceRequired: {
    type: Boolean,
    default: false
  },
  customizable: {
    type: Boolean,
    default: true // Whether users can modify value/description
  },
  popularity: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
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
itemSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Indexes for performance
itemSchema.index({ category: 1, isActive: 1 });
itemSchema.index({ name: 'text', description: 'text', tags: 'text' });
itemSchema.index({ popularity: -1 });
itemSchema.index({ riskLevel: 1 });

// Virtual for formatted price range
itemSchema.virtual('priceRange').get(function() {
  if (this.estimatedValue.min === this.estimatedValue.max) {
    return `₹${this.estimatedValue.min.toLocaleString('en-IN')}`;
  }
  return `₹${this.estimatedValue.min.toLocaleString('en-IN')} - ₹${this.estimatedValue.max.toLocaleString('en-IN')}`;
});

// Ensure virtual fields are serialized
itemSchema.set('toJSON', { virtuals: true });

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
