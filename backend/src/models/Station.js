const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Station name is required'],
    trim: true,
    index: 'text'
  },
  code: {
    type: String,
    required: [true, 'Station code is required'],
    unique: true,
    uppercase: true,
    trim: true,
    index: true
  },
  type: {
    type: String,
    enum: ['railway', 'airport'],
    required: [true, 'Station type is required'],
    index: true
  },
  
  // Location Information
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
    index: 'text'
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true,
    index: true
  },
  country: {
    type: String,
    default: 'India',
    trim: true
  },
  
  // Geographical Coordinates
  coordinates: {
    latitude: {
      type: Number,
      required: [true, 'Latitude is required'],
      min: [-90, 'Invalid latitude'],
      max: [90, 'Invalid latitude']
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required'],
      min: [-180, 'Invalid longitude'],
      max: [180, 'Invalid longitude']
    }
  },
  
  // Additional Information
  zone: {
    type: String,
    trim: true,
    // For railways: Central, Western, Eastern, etc.
    // For airports: Domestic, International
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  isOperational: {
    type: Boolean,
    default: true
  },
  
  // Service Information
  services: {
    luggageService: {
      type: Boolean,
      default: true
    },
    counterLocation: {
      type: String,
      trim: true
    },
    operatingHours: {
      start: {
        type: String, // Format: "HH:MM"
        default: "06:00"
      },
      end: {
        type: String, // Format: "HH:MM"
        default: "22:00"
      }
    },
    contactInfo: {
      phone: String,
      email: String
    }
  },
  
  // Railway specific information
  railwayInfo: {
    division: String,
    zone: String,
    platforms: Number,
    majorStation: {
      type: Boolean,
      default: false
    }
  },
  
  // Airport specific information
  airportInfo: {
    iataCode: {
      type: String,
      uppercase: true,
      sparse: true // Allows multiple null values
    },
    icaoCode: {
      type: String,
      uppercase: true,
      sparse: true
    },
    terminals: Number,
    international: {
      type: Boolean,
      default: false
    }
  },
  
  // Search and Display
  searchTerms: [{
    type: String,
    lowercase: true
  }],
  displayName: String, // Formatted name for display
  
  // Metadata
  popularity: {
    type: Number,
    default: 0,
    min: 0
  },
  bookingCount: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better search performance
stationSchema.index({ name: 'text', city: 'text', searchTerms: 'text' });
stationSchema.index({ 'coordinates.latitude': 1, 'coordinates.longitude': 1 });
stationSchema.index({ type: 1, isActive: 1, isOperational: 1 });
stationSchema.index({ state: 1, city: 1 });
stationSchema.index({ code: 1, type: 1 });

// Virtual for full location name
stationSchema.virtual('fullLocation').get(function() {
  return `${this.city}, ${this.state}`;
});

// Virtual for display with type
stationSchema.virtual('displayWithType').get(function() {
  const typeLabel = this.type === 'railway' ? 'Railway Station' : 'Airport';
  return `${this.name} ${typeLabel}, ${this.city}`;
});

// Pre-save middleware to generate search terms and display name
stationSchema.pre('save', function(next) {
  // Generate search terms for better searchability
  const searchTerms = new Set();
  
  // Add name variations
  searchTerms.add(this.name.toLowerCase());
  searchTerms.add(this.city.toLowerCase());
  searchTerms.add(this.state.toLowerCase());
  searchTerms.add(this.code.toLowerCase());
  
  // Add name words
  this.name.split(' ').forEach(word => {
    if (word.length > 2) {
      searchTerms.add(word.toLowerCase());
    }
  });
  
  // Add city words
  this.city.split(' ').forEach(word => {
    if (word.length > 2) {
      searchTerms.add(word.toLowerCase());
    }
  });
  
  // Add airport codes if available
  if (this.type === 'airport') {
    if (this.airportInfo?.iataCode) {
      searchTerms.add(this.airportInfo.iataCode.toLowerCase());
    }
    if (this.airportInfo?.icaoCode) {
      searchTerms.add(this.airportInfo.icaoCode.toLowerCase());
    }
  }
  
  this.searchTerms = Array.from(searchTerms);
  
  // Generate display name
  if (this.type === 'railway') {
    this.displayName = `${this.name} Railway Station`;
  } else {
    this.displayName = `${this.name} Airport`;
  }
  
  next();
});

// Static method to search stations
stationSchema.statics.searchStations = function(query, options = {}) {
  const {
    type = null,
    limit = 10,
    state = null,
    activeOnly = true
  } = options;
  
  const searchQuery = {
    $text: { $search: query }
  };
  
  // Add filters
  if (activeOnly) {
    searchQuery.isActive = true;
    searchQuery.isOperational = true;
  }
  
  if (type) {
    searchQuery.type = type;
  }
  
  if (state) {
    searchQuery.state = new RegExp(state, 'i');
  }
  
  return this.find(searchQuery)
    .select('name code type city state displayName coordinates services popularity')
    .sort({ score: { $meta: 'textScore' }, popularity: -1 })
    .limit(limit);
};

// Static method to find nearby stations
stationSchema.statics.findNearby = function(latitude, longitude, maxDistance = 100000, options = {}) {
  const {
    type = null,
    limit = 10,
    activeOnly = true
  } = options;
  
  const query = {
    coordinates: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance // in meters
      }
    }
  };
  
  if (activeOnly) {
    query.isActive = true;
    query.isOperational = true;
  }
  
  if (type) {
    query.type = type;
  }
  
  return this.find(query)
    .select('name code type city state displayName coordinates services')
    .limit(limit);
};

// Static method to get popular stations
stationSchema.statics.getPopularStations = function(options = {}) {
  const {
    type = null,
    limit = 20,
    state = null
  } = options;
  
  const query = {
    isActive: true,
    isOperational: true
  };
  
  if (type) {
    query.type = type;
  }
  
  if (state) {
    query.state = new RegExp(state, 'i');
  }
  
  return this.find(query)
    .select('name code type city state displayName coordinates services popularity bookingCount')
    .sort({ popularity: -1, bookingCount: -1 })
    .limit(limit);
};

// Instance method to calculate distance to another station
stationSchema.methods.distanceTo = function(otherStation) {
  const R = 6371; // Earth's radius in kilometers
  const lat1 = this.coordinates.latitude * Math.PI / 180;
  const lat2 = otherStation.coordinates.latitude * Math.PI / 180;
  const deltaLat = (otherStation.coordinates.latitude - this.coordinates.latitude) * Math.PI / 180;
  const deltaLng = (otherStation.coordinates.longitude - this.coordinates.longitude) * Math.PI / 180;
  
  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c; // Distance in kilometers
};

// Instance method to increment booking count
stationSchema.methods.incrementBooking = function() {
  this.bookingCount += 1;
  this.popularity = Math.floor(this.bookingCount / 10); // Simple popularity calculation
  return this.save();
};

module.exports = mongoose.model('Station', stationSchema);
