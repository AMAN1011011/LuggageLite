const mongoose = require('mongoose');

const pricingConfigSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  pricePerKm: {
    type: Number,
    required: true,
    min: 0
  },
  minimumDistance: {
    type: Number,
    default: 0,
    min: 0
  },
  maximumDistance: {
    type: Number,
    default: null
  },
  surcharges: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true
    },
    value: {
      type: Number,
      required: true,
      min: 0
    },
    conditions: {
      minDistance: Number,
      maxDistance: Number,
      stationType: {
        type: String,
        enum: ['railway', 'airport', 'both']
      },
      timeSlot: {
        start: String, // HH:MM format
        end: String    // HH:MM format
      }
    }
  }],
  discounts: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true
    },
    value: {
      type: Number,
      required: true,
      min: 0
    },
    conditions: {
      minDistance: Number,
      userType: {
        type: String,
        enum: ['new', 'returning', 'premium']
      },
      bookingCount: Number
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  validFrom: {
    type: Date,
    default: Date.now
  },
  validUntil: {
    type: Date,
    default: null
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
pricingConfigSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const PricingConfig = mongoose.model('PricingConfig', pricingConfigSchema);

module.exports = PricingConfig;
