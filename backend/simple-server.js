const http = require('http');
const url = require('url');

const PORT = 5000;

// Mock data
let mockUsers = [];
const mockStations = [
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
  },
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
  }
];

// Utility functions
function parseJSON(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function sendResponse(res, statusCode, data, req = null) {
  // Allow both ports 5173 and 5174 for development
  const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
  const requestOrigin = req ? req.headers.origin : null;
  const allowedOrigin = (requestOrigin && allowedOrigins.includes(requestOrigin)) ? requestOrigin : 'http://localhost:5173';
  
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true'
  });
  res.end(JSON.stringify(data));
}

function getRequestBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => resolve(parseJSON(body)));
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const query = parsedUrl.query;
  const method = req.method;
  const origin = req.headers.origin;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    sendResponse(res, 200, {}, req);
    return;
  }

  try {
    // Health check
    if (path === '/api/health') {
      sendResponse(res, 200, {
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: 'Mock - Connected'
      }, req);
      return;
    }

    // Auth endpoints
    if (path === '/api/auth/register' && method === 'POST') {
      const body = await getRequestBody(req);
      const { firstName, lastName, email, password, phone, address } = body || {};
      
      if (!firstName || !lastName || !email || !password || !phone) {
        sendResponse(res, 400, {
          success: false,
          message: 'All required fields must be provided'
        });
        return;
      }

      if (mockUsers.find(u => u.email === email)) {
        sendResponse(res, 400, {
          success: false,
          message: 'User with this email already exists'
        });
        return;
      }

      const user = {
        _id: `user_${Date.now()}`,
        firstName,
        lastName,
        email,
        phone,
        address: address || {},
        fullName: `${firstName} ${lastName}`,
        isActive: true,
        role: 'customer',
        createdAt: new Date().toISOString()
      };

      mockUsers.push({ ...user, password });

      sendResponse(res, 201, {
        success: true,
        message: 'User registered successfully',
        data: {
          user,
          tokens: {
            accessToken: `mock_token_${user._id}`,
            refreshToken: `mock_refresh_${user._id}`
          }
        }
      });
      return;
    }

    if (path === '/api/auth/login' && method === 'POST') {
      const body = await getRequestBody(req);
      const { email, password } = body || {};
      
      if (!email || !password) {
        sendResponse(res, 400, {
          success: false,
          message: 'Email and password are required'
        });
        return;
      }

      const user = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!user) {
        sendResponse(res, 401, {
          success: false,
          message: 'Invalid email or password'
        });
        return;
      }

      const userResponse = { ...user };
      delete userResponse.password;

      sendResponse(res, 200, {
        success: true,
        message: 'Login successful',
        data: {
          user: userResponse,
          tokens: {
            accessToken: `mock_token_${user._id}`,
            refreshToken: `mock_refresh_${user._id}`
          }
        }
      });
      return;
    }

    if (path === '/api/auth/profile' && method === 'GET') {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        sendResponse(res, 401, {
          success: false,
          message: 'Access denied. No token provided.'
        });
        return;
      }

      const token = authHeader.substring(7);
      const userId = token.replace('mock_token_', '');
      const user = mockUsers.find(u => u._id === userId);

      if (!user) {
        sendResponse(res, 401, {
          success: false,
          message: 'Invalid token'
        });
        return;
      }

      const userResponse = { ...user };
      delete userResponse.password;

      sendResponse(res, 200, {
        success: true,
        data: { user: userResponse }
      });
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
    if (path === '/api/stations/search') {
      const { q: searchQuery, type, limit = 10 } = query;
      
      if (!searchQuery || searchQuery.length < 2) {
        sendResponse(res, 400, {
          success: false,
          message: 'Search query must be at least 2 characters long'
        });
        return;
      }

      let filtered = mockStations.filter(station => {
        const matchesQuery = station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            station.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            station.code.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = !type || station.type === type;
        return matchesQuery && matchesType;
      });

      filtered = filtered.slice(0, parseInt(limit));

      sendResponse(res, 200, {
        success: true,
        data: {
          stations: filtered,
          query: searchQuery,
          count: filtered.length
        }
      });
      return;
    }

    if (path === '/api/stations/popular') {
      const { type, limit = 20 } = query;
      
      let filtered = mockStations;
      if (type) {
        filtered = filtered.filter(station => station.type === type);
      }
      
      filtered = filtered
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, parseInt(limit));

      sendResponse(res, 200, {
        success: true,
        data: {
          stations: filtered,
          count: filtered.length
        }
      });
      return;
    }

    // Distance calculation
    if (path.startsWith('/api/stations/distance/')) {
      const pathParts = path.split('/');
      const sourceId = pathParts[4];
      const destinationId = pathParts[5];
      
      const source = mockStations.find(s => s._id === sourceId);
      const destination = mockStations.find(s => s._id === destinationId);
      
      if (!source || !destination) {
        sendResponse(res, 404, {
          success: false,
          message: 'Station not found'
        });
        return;
      }

      const distance = calculateDistance(
        source.coordinates.latitude,
        source.coordinates.longitude,
        destination.coordinates.latitude,
        destination.coordinates.longitude
      );

      sendResponse(res, 200, {
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
      return;
    }

    // 404
    sendResponse(res, 404, {
      success: false,
      message: 'Route not found',
      path
    });

  } catch (error) {
    console.error('Server error:', error);
    sendResponse(res, 500, {
      success: false,
      message: 'Internal server error'
    });
  }
});

server.listen(PORT, () => {
  console.log(`🚀 TravelLite Simple API Server running on port ${PORT}`);
  console.log(`📱 Frontend URL: http://localhost:5173`);
  console.log(`🌍 API URL: http://localhost:${PORT}/api`);
  console.log('');
  console.log('✅ Ready to test authentication and station selection!');
});

module.exports = server;
