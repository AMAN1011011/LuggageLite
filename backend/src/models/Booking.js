const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // Unique booking identifier
  bookingId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // User information
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Station information
  sourceStation: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    code: { type: String, required: true },
    type: { type: String, enum: ['railway', 'airport'], required: true }
  },
  
  destinationStation: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    code: { type: String, required: true },
    type: { type: String, enum: ['railway', 'airport'], required: true }
  },
  
  // Journey information
  distance: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Pricing information
  pricing: {
    baseFare: { type: Number, required: true, min: 0 },
    distanceCharge: { type: Number, required: true, min: 0 },
    serviceFee: { type: Number, required: true, min: 0 },
    taxes: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 }
  },
  
  // Security checklist items
  securityItems: [{
    itemId: { type: String, required: true },
    categoryId: { type: String, required: true },
    name: { type: String, required: true },
    estimatedValue: { type: Number, default: 0 },
    riskLevel: { type: String, enum: ['low', 'medium', 'high'], default: 'low' }
  }],
  
  // Contact information
  contactInfo: {
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, default: 'India' }
    },
    emergencyContact: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      relationship: { type: String, required: true },
      address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        country: { type: String, default: 'India' }
      }
    }
  },
  
  // Luggage images
  luggageImages: [{
    id: { type: String, required: true },
    angle: { type: String, enum: ['front', 'back', 'left', 'right'], required: true },
    url: { type: String, required: true },
    filename: { type: String, required: true },
    size: { type: Number, required: true },
    format: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  // Booking status
  status: {
    type: String,
    enum: [
      'pending_payment',
      'payment_confirmed', 
      'luggage_collected',
      'in_transit',
      'delivered',
      'cancelled'
    ],
    default: 'pending_payment'
  },
  
  // Payment information
  payment: {
    method: { type: String, enum: ['card', 'upi', 'netbanking', 'wallet'] },
    transactionId: { type: String },
    paymentDate: { type: Date },
    amount: { type: Number },
    status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' }
  },
  
  // Confirmation details
  confirmation: {
    emailSent: { type: Boolean, default: false },
    smsSent: { type: Boolean, default: false },
    emailSentAt: { type: Date },
    smsSentAt: { type: Date }
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  // Pickup and delivery tracking
  tracking: {
    pickupScheduled: { type: Date },
    pickupCompleted: { type: Date },
    deliveryScheduled: { type: Date },
    deliveryCompleted: { type: Date },
    currentLocation: { type: String },
    trackingHistory: [{
      status: { type: String, required: true },
      location: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
      notes: { type: String }
    }]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ 'sourceStation.id': 1 });
bookingSchema.index({ 'destinationStation.id': 1 });
bookingSchema.index({ createdAt: -1 });

// Virtual for total security items count
bookingSchema.virtual('securityItemsCount').get(function() {
  return this.securityItems.length;
});

// Virtual for total estimated value of security items
bookingSchema.virtual('totalEstimatedValue').get(function() {
  return this.securityItems.reduce((total, item) => total + (item.estimatedValue || 0), 0);
});

// Method to generate tracking history entry
bookingSchema.methods.addTrackingEntry = function(status, location, notes = '') {
  this.tracking.trackingHistory.push({
    status,
    location,
    notes,
    timestamp: new Date()
  });
  this.tracking.currentLocation = location;
  return this.save();
};

// Method to update booking status
bookingSchema.methods.updateStatus = function(newStatus, location = '', notes = '') {
  this.status = newStatus;
  this.updatedAt = new Date();
  
  if (location) {
    this.addTrackingEntry(newStatus, location, notes);
  }
  
  return this.save();
};

// Static method to generate unique booking ID
bookingSchema.statics.generateBookingId = function() {
  const prefix = 'TL';
  const timestamp = Date.now().toString().slice(-8); // Last 8 digits of timestamp
  const random = Math.random().toString(36).substring(2, 6).toUpperCase(); // 4 random chars
  return `${prefix}${timestamp}${random}`;
};

// Pre-save middleware to update timestamps
bookingSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
