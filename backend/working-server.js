const http = require('http');
const url = require('url');
const querystring = require('querystring');
const fs = require('fs');
const path = require('path');

const PORT = 5000;
const HOST = 'localhost';

// Data file paths
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const STATIONS_FILE = path.join(DATA_DIR, 'stations.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize mock data
let mockUsers = [];
let mockStations = [
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
  }
];

// Load data from files
function loadData() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const usersData = fs.readFileSync(USERS_FILE, 'utf8');
      mockUsers = JSON.parse(usersData);
      console.log(`✅ Loaded ${mockUsers.length} users from storage`);
    }
    
    if (fs.existsSync(STATIONS_FILE)) {
      const stationsData = fs.readFileSync(STATIONS_FILE, 'utf8');
      mockStations = JSON.parse(stationsData);
      console.log(`✅ Loaded ${mockStations.length} stations from storage`);
    }
  } catch (error) {
    console.error('❌ Error loading data:', error.message);
  }
}

// Save data to files
function saveData() {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(mockUsers, null, 2));
    fs.writeFileSync(STATIONS_FILE, JSON.stringify(mockStations, null, 2));
    console.log('💾 Data saved to storage');
  } catch (error) {
    console.error('❌ Error saving data:', error.message);
  }
}

// Load data on startup
loadData();

// Save data periodically and on exit
setInterval(saveData, 30000); // Save every 30 seconds
process.on('SIGINT', () => {
  console.log('\n💾 Saving data before exit...');
  saveData();
  process.exit(0);
});

// Utility functions
function parseJSON(str) {
  try {
    return JSON.parse(str);
  } catch (error) {
    console.error('❌ JSON parse error:', error.message);
    return null;
  }
}

function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:5176',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true'
  });
  res.end(JSON.stringify(data));
}

function generateToken() {
  return 'mock-token-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// Create HTTP server
const server = http.createServer((req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    sendResponse(res, 200, {});
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;
  const query = parsedUrl.query;

  console.log(`📡 ${method} ${path}`);

  // Health check endpoint
  if (path === '/api/health' && method === 'GET') {
    sendResponse(res, 200, {
      success: true,
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      database: 'Mock - File Storage',
      usersCount: mockUsers.length,
      stationsCount: mockStations.length
    });
    return;
  }

  // Authentication endpoints
  if (path === '/api/auth/register' && method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const userData = parseJSON(body);
      
      console.log('📝 Registration attempt:', { email: userData?.email, firstName: userData?.firstName });
      
      if (!userData || !userData.firstName || !userData.lastName || !userData.email || !userData.password || !userData.phone) {
        console.log('❌ Registration failed: Missing required fields');
        sendResponse(res, 400, {
          success: false,
          message: 'All fields are required'
        });
        return;
      }

      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === userData.email);
      if (existingUser) {
        console.log('❌ Registration failed: User already exists');
        sendResponse(res, 400, {
          success: false,
          message: 'User with this email already exists'
        });
        return;
      }

      // Create new user
      const newUser = {
        _id: 'user_' + Date.now(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password, // In real app, this would be hashed
        phone: userData.phone,
        fullName: `${userData.firstName} ${userData.lastName}`,
        isActive: true,
        isEmailVerified: false,
        role: 'customer',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      mockUsers.push(newUser);
      saveData(); // Save immediately after user creation

      const token = generateToken();

      console.log('✅ User registered successfully:', newUser.email);

      sendResponse(res, 201, {
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            _id: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            phone: newUser.phone,
            fullName: newUser.fullName,
            isActive: newUser.isActive,
            isEmailVerified: newUser.isEmailVerified,
            role: newUser.role,
            createdAt: newUser.createdAt
          },
          tokens: {
            accessToken: token,
            refreshToken: 'mock-refresh-token-' + Date.now()
          }
        }
      });
    });
    return;
  }

  if (path === '/api/auth/login' && method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const loginData = parseJSON(body);
      
      console.log('🔐 Login attempt:', { email: loginData?.email });
      
      if (!loginData || !loginData.email || !loginData.password) {
        console.log('❌ Login failed: Missing email or password');
        sendResponse(res, 400, {
          success: false,
          message: 'Email and password are required'
        });
        return;
      }

      // Find user
      const user = mockUsers.find(u => u.email === loginData.email && u.password === loginData.password);
      
      if (!user) {
        console.log('❌ Login failed: Invalid credentials for', loginData.email);
        console.log('📊 Available users:', mockUsers.map(u => ({ email: u.email, password: u.password })));
        sendResponse(res, 401, {
          success: false,
          message: 'Invalid email or password'
        });
        return;
      }

      const token = generateToken();

      console.log('✅ User logged in successfully:', user.email);

      sendResponse(res, 200, {
        success: true,
        message: 'Login successful',
        data: {
          user: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            fullName: user.fullName,
            isActive: user.isActive,
            isEmailVerified: user.isEmailVerified,
            role: user.role,
            lastLogin: new Date().toISOString(),
            createdAt: user.createdAt
          },
          tokens: {
            accessToken: token,
            refreshToken: 'mock-refresh-token-' + Date.now()
          }
        }
      });
    });
    return;
  }

  if (path === '/api/auth/profile' && method === 'GET') {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendResponse(res, 401, {
        success: false,
        message: 'Access token required'
      });
      return;
    }

    // For mock purposes, return the first user
    if (mockUsers.length > 0) {
      const user = mockUsers[0];
      sendResponse(res, 200, {
        success: true,
        data: {
          user: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            fullName: user.fullName,
            isActive: user.isActive,
            isEmailVerified: user.isEmailVerified,
            role: user.role,
            createdAt: user.createdAt
          }
        }
      });
    } else {
      sendResponse(res, 404, {
        success: false,
        message: 'User not found'
      });
    }
    return;
  }

  if (path === '/api/auth/logout' && method === 'POST') {
    sendResponse(res, 200, {
      success: true,
      message: 'Logout successful'
    });
    return;
  }

  // Station endpoints
  if (path === '/api/stations/search' && method === 'GET') {
    const { q = '', type = '', limit = 20 } = query;
    
    let filtered = mockStations;
    
    // Filter by search query
    if (q) {
      const queryLower = q.toLowerCase();
      filtered = filtered.filter(station => 
        station.name.toLowerCase().includes(queryLower) ||
        station.city.toLowerCase().includes(queryLower) ||
        station.code.toLowerCase().includes(queryLower)
      );
    }
    
    // Filter by type
    if (type) {
      filtered = filtered.filter(station => station.type === type);
    }
    
    // Apply limit
    filtered = filtered.slice(0, parseInt(limit));
    
    sendResponse(res, 200, {
      success: true,
      data: {
        stations: filtered,
        total: filtered.length,
        query: q,
        type: type
      }
    });
    return;
  }

  // 404 for unknown endpoints
  sendResponse(res, 404, {
    success: false,
    message: 'Endpoint not found'
  });
});

// Start server
server.listen(PORT, HOST, () => {
  console.log(`🚀 TravelLite Mock Server running at http://${HOST}:${PORT}`);
  console.log(`📊 Loaded ${mockUsers.length} users and ${mockStations.length} stations`);
  console.log('\n📋 Available endpoints:');
  console.log('  • GET  /api/health - Server health check');
  console.log('  • POST /api/auth/register - User registration');
  console.log('  • POST /api/auth/login - User login');
  console.log('  • GET  /api/auth/profile - User profile (requires auth)');
  console.log('  • POST /api/auth/logout - User logout');
  console.log('  • GET  /api/stations/search - Search stations');
  console.log('\n💡 Data is now persisted to files in the data/ directory');
  console.log('💾 Auto-save every 30 seconds');
});
