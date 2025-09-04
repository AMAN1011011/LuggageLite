const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Mock user data store
let mockUsers = [];
let mockStations = [
  // Mumbai
  {
    _id: '1',
    name: 'Mumbai Central',
    code: 'MMCT',
    type: 'railway',
    city: 'Mumbai',
    state: 'Maharashtra',
    displayName: 'Mumbai Central Railway Station',
    displayWithType: 'Mumbai Central Railway Station, Mumbai',
    coordinates: { latitude: 18.9690, longitude: 72.8205 },
    services: { operatingHours: { start: '05:00', end: '23:00' } },
    popularity: 95
  },
  {
    _id: '2',
    name: 'Chhatrapati Shivaji Maharaj International Airport',
    code: 'BOM',
    type: 'airport',
    city: 'Mumbai',
    state: 'Maharashtra',
    displayName: 'Chhatrapati Shivaji Maharaj International Airport',
    displayWithType: 'Chhatrapati Shivaji Maharaj International Airport, Mumbai',
    coordinates: { latitude: 19.0896, longitude: 72.8656 },
    services: { operatingHours: { start: '04:00', end: '24:00' } },
    popularity: 95
  },
  // Delhi
  {
    _id: '3',
    name: 'New Delhi Railway Station',
    code: 'NDLS',
    type: 'railway',
    city: 'New Delhi',
    state: 'Delhi',
    displayName: 'New Delhi Railway Station',
    displayWithType: 'New Delhi Railway Station, New Delhi',
    coordinates: { latitude: 28.6434, longitude: 77.2197 },
    services: { operatingHours: { start: '04:00', end: '24:00' } },
    popularity: 100
  },
  {
    _id: '4',
    name: 'Indira Gandhi International Airport',
    code: 'DEL',
    type: 'airport',
    city: 'New Delhi',
    state: 'Delhi',
    displayName: 'Indira Gandhi International Airport',
    displayWithType: 'Indira Gandhi International Airport, New Delhi',
    coordinates: { latitude: 28.5562, longitude: 77.1000 },
    services: { operatingHours: { start: '03:00', end: '24:00' } },
    popularity: 100
  },
  // Bangalore
  {
    _id: '5',
    name: 'Bangalore City Railway Station',
    code: 'SBC',
    type: 'railway',
    city: 'Bangalore',
    state: 'Karnataka',
    displayName: 'Bangalore City Railway Station',
    displayWithType: 'Bangalore City Railway Station, Bangalore',
    coordinates: { latitude: 12.9762, longitude: 77.5993 },
    services: { operatingHours: { start: '05:00', end: '23:00' } },
    popularity: 85
  },
  {
    _id: '6',
    name: 'Kempegowda International Airport',
    code: 'BLR',
    type: 'airport',
    city: 'Bangalore',
    state: 'Karnataka',
    displayName: 'Kempegowda International Airport',
    displayWithType: 'Kempegowda International Airport, Bangalore',
    coordinates: { latitude: 13.1986, longitude: 77.7066 },
    services: { operatingHours: { start: '04:00', end: '24:00' } },
    popularity: 88
  },
  // Chennai
  {
    _id: '7',
    name: 'Chennai Central',
    code: 'MAS',
    type: 'railway',
    city: 'Chennai',
    state: 'Tamil Nadu',
    displayName: 'Chennai Central Railway Station',
    displayWithType: 'Chennai Central Railway Station, Chennai',
    coordinates: { latitude: 13.0836, longitude: 80.2751 },
    services: { operatingHours: { start: '04:30', end: '23:30' } },
    popularity: 88
  },
  {
    _id: '8',
    name: 'Chennai International Airport',
    code: 'MAA',
    type: 'airport',
    city: 'Chennai',
    state: 'Tamil Nadu',
    displayName: 'Chennai International Airport',
    displayWithType: 'Chennai International Airport, Chennai',
    coordinates: { latitude: 12.9941, longitude: 80.1709 },
    services: { operatingHours: { start: '04:00', end: '24:00' } },
    popularity: 85
  }
];

// Utility function to calculate distance
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'Mock - Connected'
  });
});

// Auth endpoints
app.post('/api/auth/register', (req, res) => {
  const { firstName, lastName, email, password, phone, address } = req.body;
  
  // Basic validation
  if (!firstName || !lastName || !email || !password || !phone) {
    return res.status(400).json({
      success: false,
      message: 'All required fields must be provided',
      errors: ['First name, last name, email, password, and phone are required']
    });
  }

  // Check if user exists
  if (mockUsers.find(u => u.email === email)) {
    return res.status(400).json({
      success: false,
      message: 'User with this email already exists'
    });
  }

  // Create user
  const user = {
    _id: `user_${Date.now()}`,
    firstName,
    lastName,
    email,
    phone,
    address: address || {},
    fullName: `${firstName} ${lastName}`,
    isActive: true,
    isEmailVerified: false,
    role: 'customer',
    createdAt: new Date().toISOString()
  };

  mockUsers.push({ ...user, password });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user,
      tokens: {
        accessToken: `mock_access_token_${user._id}`,
        refreshToken: `mock_refresh_token_${user._id}`
      }
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  const userResponse = { ...user };
  delete userResponse.password;
  userResponse.lastLogin = new Date().toISOString();

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: userResponse,
      tokens: {
        accessToken: `mock_access_token_${user._id}`,
        refreshToken: `mock_refresh_token_${user._id}`
      }
    }
  });
});

app.get('/api/auth/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  const token = authHeader.substring(7);
  const userId = token.replace('mock_access_token_', '');
  const user = mockUsers.find(u => u._id === userId);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  const userResponse = { ...user };
  delete userResponse.password;

  res.json({
    success: true,
    data: { user: userResponse }
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

// Station endpoints
app.get('/api/stations/search', (req, res) => {
  const { q: query, type, limit = 10 } = req.query;
  
  if (!query || query.length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Search query must be at least 2 characters long'
    });
  }

  let filtered = mockStations.filter(station => {
    const matchesQuery = station.name.toLowerCase().includes(query.toLowerCase()) ||
                        station.city.toLowerCase().includes(query.toLowerCase()) ||
                        station.code.toLowerCase().includes(query.toLowerCase());
    const matchesType = !type || station.type === type;
    return matchesQuery && matchesType;
  });

  filtered = filtered.slice(0, parseInt(limit));

  res.json({
    success: true,
    data: {
      stations: filtered,
      query,
      count: filtered.length
    }
  });
});

app.get('/api/stations/popular', (req, res) => {
  const { type, limit = 20 } = req.query;
  
  let filtered = mockStations;
  if (type) {
    filtered = filtered.filter(station => station.type === type);
  }
  
  filtered = filtered
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, parseInt(limit));

  res.json({
    success: true,
    data: {
      stations: filtered,
      count: filtered.length
    }
  });
});

app.get('/api/stations/distance/:sourceId/:destinationId', (req, res) => {
  const { sourceId, destinationId } = req.params;
  
  const source = mockStations.find(s => s._id === sourceId);
  const destination = mockStations.find(s => s._id === destinationId);
  
  if (!source || !destination) {
    return res.status(404).json({
      success: false,
      message: 'Station not found'
    });
  }

  const distance = calculateDistance(
    source.coordinates.latitude,
    source.coordinates.longitude,
    destination.coordinates.latitude,
    destination.coordinates.longitude
  );

  res.json({
    success: true,
    data: {
      sourceStation: {
        id: source._id,
        name: source.name,
        code: source.code,
        city: source.city,
        state: source.state
      },
      destinationStation: {
        id: destination._id,
        name: destination.name,
        code: destination.code,
        city: destination.city,
        state: destination.state
      },
      distance: Math.round(distance * 100) / 100,
      unit: 'kilometers'
    }
  });
});

app.get('/api/stations/:identifier', (req, res) => {
  const { identifier } = req.params;
  const station = mockStations.find(s => s._id === identifier || s.code === identifier.toUpperCase());
  
  if (!station) {
    return res.status(404).json({
      success: false,
      message: 'Station not found'
    });
  }

  res.json({
    success: true,
    data: { station }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 TravelLite Mock API Server running on port ${PORT}`);
  console.log(`📱 Frontend URL: http://localhost:5173`);
  console.log(`🌍 API URL: http://localhost:${PORT}/api`);
  console.log('');
  console.log('📋 Available Endpoints:');
  console.log('   POST /api/auth/register - User registration');
  console.log('   POST /api/auth/login - User login');
  console.log('   GET /api/auth/profile - Get user profile');
  console.log('   POST /api/auth/logout - User logout');
  console.log('   GET /api/stations/search - Search stations');
  console.log('   GET /api/stations/popular - Get popular stations');
  console.log('   GET /api/stations/distance/:id1/:id2 - Calculate distance');
  console.log('   GET /api/health - Health check');
  console.log('');
  console.log('✅ Ready to test authentication and station selection!');
});

module.exports = app;
