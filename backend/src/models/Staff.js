const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  // Staff identification
  staffId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Personal information
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  
  phone: {
    type: String,
    required: true,
    trim: true
  },
  
  // Authentication
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  
  // Role and permissions
  role: {
    type: String,
    enum: ['counter_staff', 'supervisor', 'manager', 'admin'],
    default: 'counter_staff'
  },
  
  permissions: [{
    type: String,
    enum: [
      'booking_lookup',
      'luggage_accept',
      'status_update',
      'customer_support',
      'reports_view',
      'staff_manage',
      'system_admin'
    ]
  }],
  
  // Station assignment
  assignedStation: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    code: { type: String, required: true },
    type: { type: String, enum: ['railway', 'airport'], required: true }
  },
  
  // Work schedule
  shift: {
    type: String,
    enum: ['morning', 'afternoon', 'night', 'full_day'],
    default: 'full_day'
  },
  
  workingHours: {
    start: { type: String, default: '09:00' },
    end: { type: String, default: '18:00' }
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  isOnDuty: {
    type: Boolean,
    default: false
  },
  
  // Performance tracking
  stats: {
    totalBookingsProcessed: { type: Number, default: 0 },
    totalLuggageAccepted: { type: Number, default: 0 },
    totalLuggageDelivered: { type: Number, default: 0 },
    averageProcessingTime: { type: Number, default: 0 }, // in minutes
    customerRating: { type: Number, default: 5.0, min: 1, max: 5 },
    lastActivityDate: { type: Date, default: Date.now }
  },
  
  // Login tracking
  lastLogin: {
    type: Date,
    default: Date.now
  },
  
  loginHistory: [{
    loginTime: { type: Date, default: Date.now },
    logoutTime: { type: Date },
    ipAddress: { type: String },
    deviceInfo: { type: String }
  }],
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
staffSchema.index({ email: 1 });
staffSchema.index({ staffId: 1 });
staffSchema.index({ 'assignedStation.id': 1 });
staffSchema.index({ role: 1, isActive: 1 });
staffSchema.index({ isOnDuty: 1, 'assignedStation.id': 1 });

// Virtual for full name
staffSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for display role
staffSchema.virtual('displayRole').get(function() {
  const roleMap = {
    counter_staff: 'Counter Staff',
    supervisor: 'Supervisor',
    manager: 'Manager',
    admin: 'Administrator'
  };
  return roleMap[this.role] || this.role;
});

// Method to check if staff has specific permission
staffSchema.methods.hasPermission = function(permission) {
  return this.permissions.includes(permission) || this.role === 'admin';
};

// Method to update last activity
staffSchema.methods.updateActivity = function() {
  this.stats.lastActivityDate = new Date();
  return this.save();
};

// Method to clock in/out
staffSchema.methods.clockIn = function(ipAddress = '', deviceInfo = '') {
  this.isOnDuty = true;
  this.lastLogin = new Date();
  this.loginHistory.push({
    loginTime: new Date(),
    ipAddress,
    deviceInfo
  });
  return this.save();
};

staffSchema.methods.clockOut = function() {
  this.isOnDuty = false;
  // Update the latest login history entry with logout time
  if (this.loginHistory.length > 0) {
    const latestSession = this.loginHistory[this.loginHistory.length - 1];
    if (!latestSession.logoutTime) {
      latestSession.logoutTime = new Date();
    }
  }
  return this.save();
};

// Method to update stats
staffSchema.methods.updateStats = function(statUpdate) {
  Object.keys(statUpdate).forEach(key => {
    if (this.stats.hasOwnProperty(key)) {
      this.stats[key] = statUpdate[key];
    }
  });
  this.stats.lastActivityDate = new Date();
  return this.save();
};

// Static method to generate staff ID
staffSchema.statics.generateStaffId = function(stationCode, role) {
  const rolePrefix = {
    counter_staff: 'CS',
    supervisor: 'SV',
    manager: 'MG',
    admin: 'AD'
  };
  const prefix = rolePrefix[role] || 'ST';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 4).toUpperCase();
  return `${prefix}${stationCode}${timestamp}${random}`;
};

// Pre-save middleware to update timestamps
staffSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Static method to get staff by station
staffSchema.statics.getByStation = function(stationId, onDutyOnly = false) {
  const query = { 'assignedStation.id': stationId, isActive: true };
  if (onDutyOnly) {
    query.isOnDuty = true;
  }
  return this.find(query).sort({ role: 1, fullName: 1 });
};

module.exports = mongoose.model('Staff', staffSchema);
