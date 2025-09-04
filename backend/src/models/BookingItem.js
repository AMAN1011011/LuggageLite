const mongoose = require('mongoose');

const bookingItemSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: false // null for custom items
  },
  // Custom item details (when item is null)
  customItem: {
    name: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    estimatedValue: {
      type: Number,
      min: 0
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ItemCategory'
    }
  },
  // User-specific details
  userEstimatedValue: {
    type: Number,
    min: 0 // User can override estimated value
  },
  userDescription: {
    type: String,
    trim: true // Additional description from user
  },
  brand: {
    type: String,
    trim: true
  },
  model: {
    type: String,
    trim: true
  },
  serialNumber: {
    type: String,
    trim: true
  },
  purchaseDate: {
    type: Date
  },
  condition: {
    type: String,
    enum: ['new', 'excellent', 'good', 'fair', 'poor'],
    default: 'good'
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
    max: 10
  },
  // Insurance and handling
  insuranceRequested: {
    type: Boolean,
    default: false
  },
  insuranceValue: {
    type: Number,
    min: 0
  },
  specialHandlingRequested: {
    type: Boolean,
    default: false
  },
  specialInstructions: {
    type: String,
    trim: true,
    maxlength: 500
  },
  // Status tracking
  status: {
    type: String,
    enum: ['pending', 'verified', 'packed', 'in_transit', 'delivered', 'damaged', 'lost'],
    default: 'pending'
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Staff member who verified the item
  },
  verifiedAt: {
    type: Date
  },
  notes: [{
    text: {
      type: String,
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
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
bookingItemSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Indexes
bookingItemSchema.index({ booking: 1 });
bookingItemSchema.index({ item: 1 });
bookingItemSchema.index({ status: 1 });
bookingItemSchema.index({ createdAt: -1 });

// Virtual for effective value (user override or item estimated value)
bookingItemSchema.virtual('effectiveValue').get(function() {
  if (this.userEstimatedValue) {
    return this.userEstimatedValue;
  }
  if (this.customItem && this.customItem.estimatedValue) {
    return this.customItem.estimatedValue;
  }
  if (this.item && this.item.estimatedValue) {
    return Math.round((this.item.estimatedValue.min + this.item.estimatedValue.max) / 2);
  }
  return 0;
});

// Virtual for display name
bookingItemSchema.virtual('displayName').get(function() {
  if (this.customItem && this.customItem.name) {
    return this.customItem.name;
  }
  if (this.item && this.item.name) {
    return this.item.name;
  }
  return 'Unknown Item';
});

// Ensure virtual fields are serialized
bookingItemSchema.set('toJSON', { virtuals: true });

const BookingItem = mongoose.model('BookingItem', bookingItemSchema);

module.exports = BookingItem;
