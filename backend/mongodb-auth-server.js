const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Configuration
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/travellite';
const JWT_SECRET = process.env.JWT_SECRET || '34144872fecc102808461b95b340c370374933ea3d4e5637be54a64555a1b336e2964753591f7f5292d238ad2dbbbe66a0cc6dd881e34b89c02b14ef56a10';

// CORS configuration
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://your-app-name.vercel.app' // Replace with your actual Vercel domain
];

function getCorsHeaders(origin) {
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': true
  };
}

// MongoDB connection
let db;
let client;

async function connectToMongoDB() {
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db();
    console.log('✅ Connected to MongoDB successfully');
    
    // Create indexes for better performance
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ phone: 1 });
    await db.collection('stations').createIndex({ name: 1 });
    await db.collection('stations').createIndex({ code: 1 });
    await db.collection('stations').createIndex({ city: 1 });
    await db.collection('stations').createIndex({ state: 1 });
    
    console.log('✅ Database indexes created');
    
    // Seed stations data if collection is empty
    await seedStationsData();
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// Seed stations data
async function seedStationsData() {
  try {
    const stationsCount = await db.collection('stations').countDocuments();
    
    // Clear existing stations and reseed with comprehensive data
    if (stationsCount > 0) {
      console.log(`🗑️ Clearing existing ${stationsCount} stations...`);
      await db.collection('stations').deleteMany({});
    }
    
    if (stationsCount === 0 || stationsCount > 0) {
      console.log('📊 Seeding stations data...');
      
      const stationsData = [
        // Railway Stations
        {
          name: "Mumbai Central",
          code: "MMCT",
          type: "railway",
          city: "Mumbai",
          state: "Maharashtra",
          displayName: "Mumbai Central Railway Station",
          displayWithType: "Mumbai Central Railway Station, Mumbai",
          coordinates: { latitude: 18.969, longitude: 72.8205 },
          isActive: true,
          popularity: 95
        },
        {
          name: "New Delhi",
          code: "NDLS",
          type: "railway",
          city: "New Delhi",
          state: "Delhi",
          displayName: "New Delhi Railway Station",
          displayWithType: "New Delhi Railway Station, Delhi",
          coordinates: { latitude: 28.6448, longitude: 77.2167 },
          isActive: true,
          popularity: 98
        },
        {
          name: "Chennai Central",
          code: "MAS",
          type: "railway",
          city: "Chennai",
          state: "Tamil Nadu",
          displayName: "Chennai Central Railway Station",
          displayWithType: "Chennai Central Railway Station, Chennai",
          coordinates: { latitude: 13.0827, longitude: 80.2707 },
          isActive: true,
          popularity: 90
        },
        {
          name: "Kolkata",
          code: "KOAA",
          type: "railway",
          city: "Kolkata",
          state: "West Bengal",
          displayName: "Kolkata Railway Station",
          displayWithType: "Kolkata Railway Station, Kolkata",
          coordinates: { latitude: 22.5726, longitude: 88.3639 },
          isActive: true,
          popularity: 88
        },
        {
          name: "Bangalore City",
          code: "SBC",
          type: "railway",
          city: "Bangalore",
          state: "Karnataka",
          displayName: "Bangalore City Railway Station",
          displayWithType: "Bangalore City Railway Station, Bangalore",
          coordinates: { latitude: 12.9716, longitude: 77.5946 },
          isActive: true,
          popularity: 85
        },
        {
          name: "Hyderabad Deccan",
          code: "HYB",
          type: "railway",
          city: "Hyderabad",
          state: "Telangana",
          displayName: "Hyderabad Deccan Railway Station",
          displayWithType: "Hyderabad Deccan Railway Station, Hyderabad",
          coordinates: { latitude: 17.3850, longitude: 78.4867 },
          isActive: true,
          popularity: 82
        },
        {
          name: "Pune",
          code: "PUNE",
          type: "railway",
          city: "Pune",
          state: "Maharashtra",
          displayName: "Pune Railway Station",
          displayWithType: "Pune Railway Station, Pune",
          coordinates: { latitude: 18.5204, longitude: 73.8567 },
          isActive: true,
          popularity: 78
        },
        {
          name: "Ahmedabad",
          code: "ADI",
          type: "railway",
          city: "Ahmedabad",
          state: "Gujarat",
          displayName: "Ahmedabad Railway Station",
          displayWithType: "Ahmedabad Railway Station, Ahmedabad",
          coordinates: { latitude: 23.0225, longitude: 72.5714 },
          isActive: true,
          popularity: 75
        },
        {
          name: "Jaipur",
          code: "JP",
          type: "railway",
          city: "Jaipur",
          state: "Rajasthan",
          displayName: "Jaipur Railway Station",
          displayWithType: "Jaipur Railway Station, Jaipur",
          coordinates: { latitude: 26.9124, longitude: 75.7873 },
          isActive: true,
          popularity: 72
        },
        {
          name: "Lucknow",
          code: "LKO",
          type: "railway",
          city: "Lucknow",
          state: "Uttar Pradesh",
          displayName: "Lucknow Railway Station",
          displayWithType: "Lucknow Railway Station, Lucknow",
          coordinates: { latitude: 26.8467, longitude: 80.9462 },
          isActive: true,
          popularity: 70
        },
        
        // Airports (matching cities with railway stations)
        {
          name: "Chhatrapati Shivaji Maharaj International Airport",
          code: "BOM",
          type: "airport",
          city: "Mumbai",
          state: "Maharashtra",
          displayName: "Chhatrapati Shivaji Maharaj International Airport",
          displayWithType: "Chhatrapati Shivaji Maharaj International Airport, Mumbai",
          coordinates: { latitude: 19.0896, longitude: 72.8656 },
          isActive: true,
          popularity: 90
        },
        {
          name: "Indira Gandhi International Airport",
          code: "DEL",
          type: "airport",
          city: "New Delhi",
          state: "Delhi",
          displayName: "Indira Gandhi International Airport",
          displayWithType: "Indira Gandhi International Airport, Delhi",
          coordinates: { latitude: 28.5562, longitude: 77.1000 },
          isActive: true,
          popularity: 92
        },
        {
          name: "Chennai International Airport",
          code: "MAA",
          type: "airport",
          city: "Chennai",
          state: "Tamil Nadu",
          displayName: "Chennai International Airport",
          displayWithType: "Chennai International Airport, Chennai",
          coordinates: { latitude: 12.9941, longitude: 80.1709 },
          isActive: true,
          popularity: 85
        },
        {
          name: "Netaji Subhas Chandra Bose International Airport",
          code: "CCU",
          type: "airport",
          city: "Kolkata",
          state: "West Bengal",
          displayName: "Netaji Subhas Chandra Bose International Airport",
          displayWithType: "Netaji Subhas Chandra Bose International Airport, Kolkata",
          coordinates: { latitude: 22.6546, longitude: 88.4467 },
          isActive: true,
          popularity: 80
        },
        {
          name: "Kempegowda International Airport",
          code: "BLR",
          type: "airport",
          city: "Bangalore",
          state: "Karnataka",
          displayName: "Kempegowda International Airport",
          displayWithType: "Kempegowda International Airport, Bangalore",
          coordinates: { latitude: 13.1979, longitude: 77.7063 },
          isActive: true,
          popularity: 80
        },
        {
          name: "Rajiv Gandhi International Airport",
          code: "HYD",
          type: "airport",
          city: "Hyderabad",
          state: "Telangana",
          displayName: "Rajiv Gandhi International Airport",
          displayWithType: "Rajiv Gandhi International Airport, Hyderabad",
          coordinates: { latitude: 17.2403, longitude: 78.4294 },
          isActive: true,
          popularity: 75
        },
        {
          name: "Pune Airport",
          code: "PNQ",
          type: "airport",
          city: "Pune",
          state: "Maharashtra",
          displayName: "Pune Airport",
          displayWithType: "Pune Airport, Pune",
          coordinates: { latitude: 18.5821, longitude: 73.9197 },
          isActive: true,
          popularity: 65
        },
        {
          name: "Sardar Vallabhbhai Patel International Airport",
          code: "AMD",
          type: "airport",
          city: "Ahmedabad",
          state: "Gujarat",
          displayName: "Sardar Vallabhbhai Patel International Airport",
          displayWithType: "Sardar Vallabhbhai Patel International Airport, Ahmedabad",
          coordinates: { latitude: 23.0772, longitude: 72.6347 },
          isActive: true,
          popularity: 70
        },
        {
          name: "Jaipur International Airport",
          code: "JAI",
          type: "airport",
          city: "Jaipur",
          state: "Rajasthan",
          displayName: "Jaipur International Airport",
          displayWithType: "Jaipur International Airport, Jaipur",
          coordinates: { latitude: 26.8242, longitude: 75.8012 },
          isActive: true,
          popularity: 60
        },
        {
          name: "Chaudhary Charan Singh International Airport",
          code: "LKO",
          type: "airport",
          city: "Lucknow",
          state: "Uttar Pradesh",
          displayName: "Chaudhary Charan Singh International Airport",
          displayWithType: "Chaudhary Charan Singh International Airport, Lucknow",
          coordinates: { latitude: 26.7606, longitude: 80.8893 },
          isActive: true,
          popularity: 55
        }
      ];
      
      await db.collection('stations').insertMany(stationsData);
      console.log(`✅ Seeded ${stationsData.length} stations`);
    } else {
      console.log(`✅ Stations collection already has ${stationsCount} documents`);
    }
  } catch (error) {
    console.error('❌ Error seeding stations data:', error);
  }
}

// JWT functions
function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Helper function to send JSON response
function sendResponse(res, statusCode, data, message = '', origin = '') {
  const corsHeaders = getCorsHeaders(origin);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    ...corsHeaders
  });
  
  const response = {
    success: statusCode >= 200 && statusCode < 300,
    message: message || (statusCode >= 200 && statusCode < 300 ? 'Success' : 'Error'),
    data: data || null
  };
  
  res.end(JSON.stringify(response));
}

// Parse JSON body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
}

// Authentication middleware
function authenticateToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  
  const token = authHeader.split(' ')[1];
  if (!token) return null;
  
  return verifyToken(token);
}

// User registration
async function handleRegister(req, res) {
  try {
    const userData = await parseBody(req);
    
    // Validation
    if (!userData.email || !userData.password || !userData.firstName || !userData.lastName || !userData.phone) {
      return sendResponse(res, 400, null, 'Missing required fields');
    }
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email: userData.email.toLowerCase() });
    if (existingUser) {
      return sendResponse(res, 409, null, 'User with this email already exists');
    }
    
    // Check if phone already exists
    const existingPhone = await db.collection('users').findOne({ phone: userData.phone });
    if (existingPhone) {
      return sendResponse(res, 409, null, 'User with this phone number already exists');
    }
    
    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    
    // Create user object
    const newUser = {
      firstName: userData.firstName.trim(),
      lastName: userData.lastName.trim(),
      email: userData.email.toLowerCase().trim(),
      password: hashedPassword,
      phone: userData.phone.trim(),
      address: {
        street: userData.address?.street?.trim() || '',
        city: userData.address?.city?.trim() || '',
        state: userData.address?.state?.trim() || '',
        pincode: userData.address?.pincode?.trim() || '',
        country: userData.address?.country || 'India'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Insert user into database
    const result = await db.collection('users').insertOne(newUser);
    
    // Generate JWT token
    const token = generateToken(result.insertedId);
    
    // Remove password from response
    const userResponse = { ...newUser };
    delete userResponse.password;
    userResponse._id = result.insertedId;
    
    console.log('✅ User registered successfully:', userData.email);
    
    sendResponse(res, 201, {
      user: userResponse,
      tokens: {
        accessToken: token,
        refreshToken: token // For simplicity, using same token as refresh
      }
    }, 'User registered successfully');
    
  } catch (error) {
    console.error('❌ Registration error:', error);
    sendResponse(res, 500, null, 'Internal server error');
  }
}

// User login
async function handleLogin(req, res) {
  try {
    const { email, password } = await parseBody(req);
    
    // Validation
    if (!email || !password) {
      return sendResponse(res, 400, null, 'Email and password are required');
    }
    
    // Find user by email
    const user = await db.collection('users').findOne({ email: email.toLowerCase() });
    if (!user) {
      return sendResponse(res, 401, null, 'Invalid email or password');
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return sendResponse(res, 401, null, 'Invalid email or password');
    }
    
    // Generate JWT token
    const token = generateToken(user._id);
    
    // Remove password from response
    const userResponse = { ...user };
    delete userResponse.password;
    
    console.log('✅ User logged in successfully:', user.email);
    
    sendResponse(res, 200, {
      user: userResponse,
      tokens: {
        accessToken: token,
        refreshToken: token
      }
    }, 'Login successful');
    
  } catch (error) {
    console.error('❌ Login error:', error);
    sendResponse(res, 500, null, 'Internal server error');
  }
}

// Get user profile
async function handleGetProfile(req, res) {
  try {
    const tokenData = authenticateToken(req);
    if (!tokenData) {
      return sendResponse(res, 401, null, 'Unauthorized');
    }
    
    const user = await db.collection('users').findOne({ _id: new require('mongodb').ObjectId(tokenData.userId) });
    if (!user) {
      return sendResponse(res, 404, null, 'User not found');
    }
    
    // Remove password from response
    const userResponse = { ...user };
    delete userResponse.password;
    
    sendResponse(res, 200, { user: userResponse }, 'Profile retrieved successfully');
    
  } catch (error) {
    console.error('❌ Get profile error:', error);
    sendResponse(res, 500, null, 'Internal server error');
  }
}

// Update user profile
async function handleUpdateProfile(req, res) {
  try {
    const tokenData = authenticateToken(req);
    if (!tokenData) {
      return sendResponse(res, 401, null, 'Unauthorized');
    }
    
    const updateData = await parseBody(req);
    
    // Remove sensitive fields that shouldn't be updated
    delete updateData.password;
    delete updateData.email; // Email shouldn't be changed via profile update
    delete updateData._id;
    
    // Add updated timestamp
    updateData.updatedAt = new Date();
    
    const result = await db.collection('users').updateOne(
      { _id: new require('mongodb').ObjectId(tokenData.userId) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return sendResponse(res, 404, null, 'User not found');
    }
    
    console.log('✅ Profile updated successfully for user ID:', tokenData.userId);
    
    sendResponse(res, 200, null, 'Profile updated successfully');
    
  } catch (error) {
    console.error('❌ Update profile error:', error);
    sendResponse(res, 500, null, 'Internal server error');
  }
}

// Change password
async function handleChangePassword(req, res) {
  try {
    const tokenData = authenticateToken(req);
    if (!tokenData) {
      return sendResponse(res, 401, null, 'Unauthorized');
    }
    
    const { currentPassword, newPassword } = await parseBody(req);
    
    if (!currentPassword || !newPassword) {
      return sendResponse(res, 400, null, 'Current password and new password are required');
    }
    
    // Get user to verify current password
    const user = await db.collection('users').findOne({ _id: new require('mongodb').ObjectId(tokenData.userId) });
    if (!user) {
      return sendResponse(res, 404, null, 'User not found');
    }
    
    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return sendResponse(res, 401, null, 'Current password is incorrect');
    }
    
    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    
    // Update password
    await db.collection('users').updateOne(
      { _id: new require('mongodb').ObjectId(tokenData.userId) },
      { 
        $set: { 
          password: hashedNewPassword,
          updatedAt: new Date()
        } 
      }
    );
    
    console.log('✅ Password changed successfully for user ID:', tokenData.userId);
    
    sendResponse(res, 200, null, 'Password changed successfully');
    
  } catch (error) {
    console.error('❌ Change password error:', error);
    sendResponse(res, 500, null, 'Internal server error');
  }
}

// Logout (client-side token removal, but we can track if needed)
async function handleLogout(req, res) {
  try {
    const tokenData = authenticateToken(req);
    if (tokenData) {
      // In a production system, you might want to add the token to a blacklist
      console.log('✅ User logged out:', tokenData.userId);
    }
    
    sendResponse(res, 200, null, 'Logged out successfully');
    
  } catch (error) {
    console.error('❌ Logout error:', error);
    sendResponse(res, 500, null, 'Internal server error');
  }
}

// Get popular stations
async function handleGetPopularStations(req, res) {
  try {
    const parsedUrl = url.parse(req.url, true);
    const limit = parseInt(parsedUrl.query.limit) || 20;
    
    // Get popular stations (you can modify this query based on your data structure)
    const stations = await db.collection('stations').find({})
      .sort({ popularity: -1 }) // Sort by popularity descending
      .limit(limit)
      .toArray();
    
    // Format stations to include proper IDs
    const formattedStations = stations.map(station => ({
      id: station._id.toString(),
      name: station.name,
      code: station.code,
      type: station.type,
      city: station.city,
      state: station.state,
      displayName: station.displayName,
      displayWithType: station.displayWithType,
      coordinates: station.coordinates,
      isActive: station.isActive,
      popularity: station.popularity
    }));
    
    sendResponse(res, 200, { stations: formattedStations }, 'Popular stations retrieved successfully');
  } catch (error) {
    console.error('❌ Get popular stations error:', error);
    sendResponse(res, 500, null, 'Internal server error');
  }
}

// Search stations
async function handleSearchStations(req, res) {
  try {
    const parsedUrl = url.parse(req.url, true);
    const query = parsedUrl.query.q;
    const limit = parseInt(parsedUrl.query.limit) || 10;
    const activeOnly = parsedUrl.query.activeOnly === 'true';
    
    if (!query || query.trim().length < 2) {
      return sendResponse(res, 400, null, 'Search query must be at least 2 characters');
    }
    
    // Build search query
    const searchQuery = {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { code: { $regex: query, $options: 'i' } },
        { city: { $regex: query, $options: 'i' } },
        { state: { $regex: query, $options: 'i' } }
      ]
    };
    
    // Add active filter if requested
    if (activeOnly) {
      searchQuery.isActive = true;
    }
    
    const stations = await db.collection('stations').find(searchQuery)
      .limit(limit)
      .toArray();
    
    sendResponse(res, 200, { stations, query }, 'Stations search completed successfully');
  } catch (error) {
    console.error('❌ Search stations error:', error);
    sendResponse(res, 500, null, 'Internal server error');
  }
}

// Debug stations - show raw database data
async function handleDebugStations(req, res) {
  try {
    const stations = await db.collection('stations').find({}).limit(3).toArray();
    
    const debugData = stations.map(station => ({
      _id: station._id,
      _idString: station._id.toString(),
      name: station.name,
      code: station.code
    }));
    
    sendResponse(res, 200, { stations: debugData }, 'Debug stations data retrieved successfully');
  } catch (error) {
    console.error('Error in handleDebugStations:', error);
    sendResponse(res, 500, null, 'Internal server error');
  }
}

// Get stations (keeping existing functionality)
async function handleGetStations(req, res) {
  try {
    const stations = await db.collection('stations').find({}).toArray();
    
    // Format stations to include proper IDs
    const formattedStations = stations.map(station => ({
      id: station._id.toString(),
      name: station.name,
      code: station.code,
      type: station.type,
      city: station.city,
      state: station.state,
      displayName: station.displayName,
      displayWithType: station.displayWithType,
      coordinates: station.coordinates,
      isActive: station.isActive,
      popularity: station.popularity
    }));
    
    sendResponse(res, 200, { stations: formattedStations }, 'Stations retrieved successfully');
  } catch (error) {
    console.error('❌ Get stations error:', error);
    sendResponse(res, 500, null, 'Internal server error');
  }
}

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
}





// Handle checklist categories
async function handleGetChecklistCategories(req, res) {
  try {
    // Sample checklist categories data
    const categories = [
      {
        _id: 'cat1',
        name: 'Electronics',
        description: 'Electronic devices and gadgets',
        icon: '📱',
        itemCount: 15,
        isActive: true
      },
      {
        _id: 'cat2',
        name: 'Clothing',
        description: 'Clothes and accessories',
        icon: '👕',
        itemCount: 12,
        isActive: true
      },
      {
        _id: 'cat3',
        name: 'Documents',
        description: 'Important documents and papers',
        icon: '📄',
        itemCount: 8,
        isActive: true
      },
      {
        _id: 'cat4',
        name: 'Personal Care',
        description: 'Personal hygiene and care items',
        icon: '🧴',
        itemCount: 10,
        isActive: true
      },
      {
        _id: 'cat5',
        name: 'Miscellaneous',
        description: 'Other items',
        icon: '📦',
        itemCount: 20,
        isActive: true
      }
    ];
    
    sendResponse(res, 200, { categories }, 'Checklist categories retrieved successfully');
    
  } catch (error) {
    console.error('❌ Get checklist categories error:', error);
    sendResponse(res, 500, null, 'Internal server error');
  }
}

// Handle category items
async function handleGetCategoryItems(req, res) {
  try {
    const parsedUrl = url.parse(req.url, true);
    const pathParts = parsedUrl.pathname.split('/');
    const categoryId = pathParts[pathParts.length - 2]; // Get categoryId from URL
    
    // Sample items for each category
    const categoryItems = {
      'cat1': [ // Electronics
        {
          _id: 'item1',
          name: 'Laptop',
          category: 'cat1',
          categoryName: 'Electronics',
          description: 'Portable computer',
          riskLevel: 'high',
          estimatedValue: 50000,
          minValue: 20000,
          maxValue: 200000,
          icon: '💻'
        },
        {
          _id: 'item2',
          name: 'Smartphone',
          category: 'cat1',
          categoryName: 'Electronics',
          description: 'Mobile phone',
          riskLevel: 'high',
          estimatedValue: 30000,
          minValue: 10000,
          maxValue: 200000,
          icon: '📱'
        },
        {
          _id: 'item3',
          name: 'Tablet',
          category: 'cat1',
          categoryName: 'Electronics',
          description: 'Portable tablet device',
          riskLevel: 'high',
          estimatedValue: 25000,
          minValue: 20000,
          maxValue: 300000,
          icon: '📱'
        },
        {
          _id: 'item4',
          name: 'Camera',
          category: 'cat1',
          categoryName: 'Electronics',
          description: 'Digital camera',
          riskLevel: 'high',
          estimatedValue: 40000,
          minValue: 50000,
          maxValue: 300000,
          icon: '📷'
        }
      ],
      'cat2': [ // Clothing
        {
          _id: 'item5',
          name: 'Designer Clothes',
          category: 'cat2',
          categoryName: 'Clothing',
          description: 'Expensive clothing items',
          riskLevel: 'medium',
          estimatedValue: 15000,
          minValue: 20000,
          maxValue: 300000,
          icon: '👕'
        },
        {
          _id: 'item6',
          name: 'Jewelry',
          category: 'cat2',
          categoryName: 'Clothing',
          description: 'Gold and silver jewelry',
          riskLevel: 'high',
          estimatedValue: 25000,
          minValue: 20000,
          maxValue: 300000,
          icon: '💍'
        },
        {
          _id: 'item7',
          name: 'Watches',
          category: 'cat2',
          categoryName: 'Clothing',
          description: 'Luxury watches',
          riskLevel: 'high',
          estimatedValue: 35000,
          minValue: 20000,
          maxValue: 300000,
          icon: '⌚'
        }
      ],
      'cat3': [ // Documents
        {
          _id: 'item8',
          name: 'Passport',
          category: 'cat3',
          categoryName: 'Documents',
          description: 'Travel document',
          riskLevel: 'critical',
          estimatedValue: 0,
          minValue: 'NA',
          maxValue: 'NA',
          icon: '📘'
        },
        {
          _id: 'item9',
          name: 'Visa Documents',
          category: 'cat3',
          categoryName: 'Documents',
          description: 'Important visa papers',
          riskLevel: 'critical',
          estimatedValue: 0,
          minValue: 20000,
          maxValue: 300000,
          icon: '📄'
        },
        {
          _id: 'item10',
          name: 'Insurance Papers',
          category: 'cat3',
          categoryName: 'Documents',
          description: 'Travel insurance documents',
          riskLevel: 'high',
          estimatedValue: 0,
          minValue: 20000,
          maxValue: 300000,
          icon: '📋'
        }
      ],
      'cat4': [ // Personal Care
        {
          _id: 'item11',
          name: 'Perfume',
          category: 'cat4',
          categoryName: 'Personal Care',
          description: 'Expensive perfume',
          riskLevel: 'medium',
          estimatedValue: 5000,
          minValue: 20000,
          maxValue: 300000,
          icon: '🧴'
        },
        {
          _id: 'item12',
          name: 'Cosmetics',
          category: 'cat4',
          categoryName: 'Personal Care',
          description: 'High-end cosmetics',
          riskLevel: 'low',
          estimatedValue: 3000,
          minValue: 20000,
          maxValue: 300000,
          icon: '💄'
        }
      ],
      'cat5': [ // Miscellaneous
        {
          _id: 'item13',
          name: 'Wallet',
          category: 'cat5',
          categoryName: 'Miscellaneous',
          description: 'Money and cards holder',
          riskLevel: 'high',
          estimatedValue: 5000,
          minValue: 20000,
          maxValue: 300000,
          icon: '👛'
        },
        {
          _id: 'item14',
          name: 'Keys',
          category: 'cat5',
          categoryName: 'Miscellaneous',
          description: 'House and car keys',
          riskLevel: 'medium',
          estimatedValue: 2000,
          minValue: 20000,
          maxValue: 300000,
          icon: '🔑'
        },
        {
          _id: 'item15',
          name: 'Books',
          category: 'cat5',
          categoryName: 'Miscellaneous',
          description: 'Important books',
          riskLevel: 'low',
          estimatedValue: 1000,
          minValue: 20000,
          maxValue: 300000,
          icon: '📚'
        }
      ]
    };
    
    const items = categoryItems[categoryId] || [];
    
    sendResponse(res, 200, { items }, 'Category items retrieved successfully');
    
  } catch (error) {
    console.error('❌ Get category items error:', error);
    sendResponse(res, 500, null, 'Internal server error');
  }
}

// Handle search items
async function handleSearchItems(req, res) {
  try {
    const parsedUrl = url.parse(req.url, true);
    const query = parsedUrl.query.q || '';
    
    // Sample search results (simplified for demo)
    const allItems = [
      {
        _id: 'item1',
        name: 'Laptop',
        category: 'cat1',
        categoryName: 'Electronics',
        description: 'Portable computer',
        riskLevel: 'high',
        estimatedValue: 50000,
        minValue: 20000,
        maxValue: 200000,
        icon: '💻'
      },
      {
        _id: 'item2',
        name: 'Smartphone',
        category: 'cat1',
        categoryName: 'Electronics',
        description: 'Mobile phone',
        riskLevel: 'high',
        estimatedValue: 30000,
        minValue: 10000,
        maxValue: 200000,
        icon: '📱'
      },
      {
        _id: 'item8',
        name: 'Passport',
        category: 'cat3',
        categoryName: 'Documents',
        description: 'Travel document',
        riskLevel: 'critical',
        estimatedValue: 0,
        minValue: 'NA',
        maxValue: 'NA',
        icon: '📘'
      }
    ];
    
    // Simple search filter
    const filteredItems = allItems.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    );
    
    sendResponse(res, 200, { items: filteredItems }, 'Search results retrieved successfully');
    
  } catch (error) {
    console.error('❌ Search items error:', error);
    sendResponse(res, 500, null, 'Internal server error');
  }
}

// Handle get contact info
async function handleGetContactInfo(req, res) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return sendResponse(res, 401, null, 'Authentication required');
    }

    // Verify token and get user
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await db.collection('users').findOne({ _id: new require('mongodb').ObjectId(decoded.userId) });
    
    if (!user) {
      return sendResponse(res, 404, null, 'User not found');
    }

    // Return user's contact info
    const contactInfo = {
      phone: user.phone || '',
      email: user.email || '',
      address: user.address || {
        street: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India'
      },
      emergencyContact: user.emergencyContact || {
        name: '',
        phone: '',
        relationship: '',
        address: {
          street: '',
          city: '',
          state: '',
          pincode: '',
          country: 'India'
        }
      }
    };

    sendResponse(res, 200, contactInfo, 'Contact information retrieved successfully');
    
  } catch (error) {
    console.error('❌ Get contact info error:', error);
    if (error.name === 'JsonWebTokenError') {
      sendResponse(res, 401, null, 'Invalid token');
    } else {
      sendResponse(res, 500, null, 'Internal server error');
    }
  }
}

// Handle update contact info
async function handleUpdateContactInfo(req, res) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return sendResponse(res, 401, null, 'Authentication required');
    }

    // Verify token and get user
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await db.collection('users').findOne({ _id: new require('mongodb').ObjectId(decoded.userId) });
    
    if (!user) {
      return sendResponse(res, 404, null, 'User not found');
    }

    const requestData = await parseBody(req);
    const { phone, email, address, emergencyContact } = requestData;

    // Update user's contact information
    const updateData = {
      phone: phone || user.phone,
      email: email || user.email,
      address: address || user.address,
      emergencyContact: emergencyContact || user.emergencyContact,
      updatedAt: new Date()
    };

    await db.collection('users').updateOne(
      { _id: new require('mongodb').ObjectId(decoded.userId) },
      { $set: updateData }
    );

    console.log('✅ Contact information updated successfully for user:', user.email);

    sendResponse(res, 200, { 
      message: 'Contact information updated successfully',
      contactInfo: updateData
    }, 'Contact information updated successfully');
    
  } catch (error) {
    console.error('❌ Update contact info error:', error);
    if (error.name === 'JsonWebTokenError') {
      sendResponse(res, 401, null, 'Invalid token');
    } else {
      sendResponse(res, 500, null, 'Internal server error');
    }
  }
}

// Handle image upload
async function handleImageUpload(req, res) {
  try {
    const requestData = await parseBody(req);
    const { images } = requestData;
    
    if (!images || !Array.isArray(images)) {
      return sendResponse(res, 400, null, 'Images array is required');
    }
    
    // Mock image upload - in a real application, you would:
    // 1. Save files to disk or cloud storage
    // 2. Generate unique filenames
    // 3. Store metadata in database
    // 4. Return actual URLs
    
    const uploadedImages = images.map((image, index) => ({
      id: `img_${Date.now()}_${index}`,
      originalName: image.originalName || `image_${index + 1}.jpg`,
      filename: `uploaded_${Date.now()}_${index}.jpg`,
      url: image.data || `https://example.com/uploads/${Date.now()}_${index}.jpg`, // Use actual data or fallback to mock URL
      dataUrl: image.data, // Include the actual image data
      size: image.size || 1024 * 1024, // Default 1MB
      format: image.format || 'image/jpeg',
      angle: image.angle || 'front',
      uploadedAt: new Date().toISOString(),
      status: 'uploaded'
    }));
    
    console.log('✅ Images uploaded successfully:', uploadedImages.length);
    
    sendResponse(res, 200, { 
      images: uploadedImages,
      totalUploaded: uploadedImages.length,
      message: 'Images uploaded successfully'
    }, 'Images uploaded successfully');
    
  } catch (error) {
    console.error('❌ Image upload error:', error);
    sendResponse(res, 500, null, 'Internal server error');
  }
}

// Handle popular items
async function handleGetPopularItems(req, res) {
  try {
    // Sample popular items data
    const popularItems = [
      {
        _id: 'item1',
        name: 'Laptop',
        category: 'cat1',
        categoryName: 'Electronics',
        description: 'Portable computer',
        riskLevel: 'high',
        estimatedValue: 50000,
        minValue: 20000,
        maxValue: 200000,
        isPopular: true,
        icon: '💻'
      },
      {
        _id: 'item2',
        name: 'Smartphone',
        category: 'cat1',
        categoryName: 'Electronics',
        description: 'Mobile phone',
        riskLevel: 'high',
        estimatedValue: 30000,
        minValue: 10000,
        maxValue: 200000,
        isPopular: true,
        icon: '📱'
      },
      {
        _id: 'item3',
        name: 'Passport',
        category: 'cat3',
        categoryName: 'Documents',
        description: 'Travel document',
        riskLevel: 'critical',
        estimatedValue: 0,
        minValue: 'NA',
        maxValue: 'NA',
        isPopular: true,
        icon: '📘'
      },
      {
        _id: 'item4',
        name: 'Wallet',
        category: 'cat5',
        categoryName: 'Miscellaneous',
        description: 'Money and cards holder',
        riskLevel: 'high',
        estimatedValue: 5000,
        minValue: 20000,
        maxValue: 300000,
        isPopular: true,
        icon: '👛'
      },
      {
        _id: 'item5',
        name: 'Jewelry',
        category: 'cat5',
        categoryName: 'Miscellaneous',
        description: 'Gold and silver items',
        riskLevel: 'high',
        estimatedValue: 25000,
        minValue: 20000,
        maxValue: 300000,
        isPopular: true,
        icon: '💍'
      }
    ];
    
    sendResponse(res, 200, { items: popularItems }, 'Popular items retrieved successfully');
    
  } catch (error) {
    console.error('❌ Get popular items error:', error);
    sendResponse(res, 500, null, 'Internal server error');
  }
}

// Handle distance calculation
async function handleCalculateDistance(req, res) {
  try {
    const parsedUrl = url.parse(req.url, true);
    let sourceId, destinationId;
    
    // Check if IDs are in query parameters
    if (parsedUrl.query.sourceId && parsedUrl.query.destinationId) {
      sourceId = parsedUrl.query.sourceId;
      destinationId = parsedUrl.query.destinationId;
    } else {
      // Extract IDs from URL path (e.g., /api/stations/distance/sourceId/destinationId)
      const pathParts = parsedUrl.pathname.split('/');
      const distanceIndex = pathParts.indexOf('distance');
      if (distanceIndex !== -1 && pathParts.length > distanceIndex + 2) {
        sourceId = pathParts[distanceIndex + 1];
        destinationId = pathParts[distanceIndex + 2];
      }
    }
    
    if (!sourceId || !destinationId) {
      return sendResponse(res, 400, null, 'Source and destination IDs are required');
    }
    
    console.log('Distance calculation request:', { sourceId, destinationId });
    
    // Get source and destination stations
    let sourceStation, destinationStation;
    
    try {
      // Convert string IDs back to MongoDB ObjectIds for database lookup
      sourceStation = await db.collection('stations').findOne({ _id: new require('mongodb').ObjectId(sourceId) });
      destinationStation = await db.collection('stations').findOne({ _id: new require('mongodb').ObjectId(destinationId) });
    } catch (error) {
      console.error('Error converting station IDs to ObjectId:', error);
      return sendResponse(res, 400, null, 'Invalid station ID format');
    }
    
    if (!sourceStation || !destinationStation) {
      console.log('Station lookup failed:', { 
        sourceFound: !!sourceStation, 
        destinationFound: !!destinationStation,
        sourceId, 
        destinationId 
      });
      return sendResponse(res, 404, null, 'Source or destination station not found');
    }
    
    console.log('Stations found:', { 
      sourceStation: sourceStation.name, 
      destinationStation: destinationStation.name 
    });
    
    // Calculate distance
    const distance = calculateDistance(
      sourceStation.coordinates.latitude,
      sourceStation.coordinates.longitude,
      destinationStation.coordinates.latitude,
      destinationStation.coordinates.longitude
    );
    
    const distanceData = {
      source: {
        id: sourceStation._id.toString(),
        name: sourceStation.name,
        city: sourceStation.city,
        type: sourceStation.type
      },
      destination: {
        id: destinationStation._id.toString(),
        name: destinationStation.name,
        city: destinationStation.city,
        type: destinationStation.type
      },
      distance: Math.round(distance * 10) / 10, // Round to 1 decimal place
      unit: 'km'
    };
    
    sendResponse(res, 200, distanceData, 'Distance calculated successfully');
    
  } catch (error) {
    console.error('❌ Calculate distance error:', error);
    sendResponse(res, 500, null, 'Internal server error');
  }
}

// Create server
const server = http.createServer(async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    const origin = req.headers.origin || '';
    const corsHeaders = getCorsHeaders(origin);
    res.writeHead(200, corsHeaders);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;
  const origin = req.headers.origin || '';

  // Create a response wrapper that includes origin
  const sendResponseWithOrigin = (statusCode, data, message = '') => {
    sendResponse(res, statusCode, data, message, origin);
  };

  console.log(`${method} ${pathname}`);

  try {
    // API routes
    if (pathname.startsWith('/api/')) {
      const route = pathname.substring(5); // Remove '/api/' prefix
      
      // Handle dynamic routes first
      if (route.startsWith('stations/distance')) {
        if (method === 'GET') {
          await handleCalculateDistance(req, res);
        } else {
          sendResponse(res, 405, null, 'Method not allowed');
        }
        return;
      }
      
      // Handle category items dynamic route
      if (route.startsWith('checklist/categories/') && route.endsWith('/items')) {
        if (method === 'GET') {
          await handleGetCategoryItems(req, res);
        } else {
          sendResponse(res, 405, null, 'Method not allowed');
        }
        return;
      }
      
      switch (route) {
        case 'health':
          sendResponseWithOrigin(200, { status: 'OK', timestamp: new Date().toISOString() }, 'Server is healthy');
          break;
          
        case 'auth/register':
          if (method === 'POST') {
            await handleRegister(req, res);
          } else {
            sendResponse(res, 405, null, 'Method not allowed');
          }
          break;
          
        case 'auth/login':
          if (method === 'POST') {
            await handleLogin(req, res);
          } else {
            sendResponse(res, 405, null, 'Method not allowed');
          }
          break;
          
        case 'auth/profile':
          if (method === 'GET') {
            await handleGetProfile(req, res);
          } else if (method === 'PUT') {
            await handleUpdateProfile(req, res);
          } else {
            sendResponse(res, 405, null, 'Method not allowed');
          }
          break;
          
        case 'auth/change-password':
          if (method === 'POST') {
            await handleChangePassword(req, res);
          } else {
            sendResponse(res, 405, null, 'Method not allowed');
          }
          break;
          
        case 'auth/logout':
          if (method === 'POST') {
            await handleLogout(req, res);
          } else {
            sendResponse(res, 405, null, 'Method not allowed');
          }
          break;
          
        case 'auth/contact':
          if (method === 'GET') {
            await handleGetContactInfo(req, res);
          } else if (method === 'PUT') {
            await handleUpdateContactInfo(req, res);
          } else {
            sendResponse(res, 405, null, 'Method not allowed');
          }
          break;
          
        case 'stations/popular':
          if (method === 'GET') {
            await handleGetPopularStations(req, res);
          } else {
            sendResponse(res, 405, null, 'Method not allowed');
          }
          break;
          
        case 'stations/search':
          if (method === 'GET') {
            await handleSearchStations(req, res);
          } else {
            sendResponse(res, 405, null, 'Method not allowed');
          }
          break;
          
        case 'stations':
          if (method === 'GET') {
            await handleGetStations(req, res);
          } else {
            sendResponse(res, 405, null, 'Method not allowed');
          }
          break;
          
        case 'stations/debug':
          if (method === 'GET') {
            await handleDebugStations(req, res);
          } else {
            sendResponse(res, 405, null, 'Method not allowed');
          }
          break;
          
        case 'checklist/categories':
          if (method === 'GET') {
            await handleGetChecklistCategories(req, res);
          } else {
            sendResponse(res, 405, null, 'Method not allowed');
          }
          break;
          
        case 'checklist/popular':
          if (method === 'GET') {
            await handleGetPopularItems(req, res);
          } else {
            sendResponse(res, 405, null, 'Method not allowed');
          }
          break;
          
        case 'checklist/search':
          if (method === 'GET') {
            await handleSearchItems(req, res);
          } else {
            sendResponse(res, 405, null, 'Method not allowed');
          }
          break;
          
        case 'images/upload':
          if (method === 'POST') {
            await handleImageUpload(req, res);
          } else {
            sendResponse(res, 405, null, 'Method not allowed');
          }
          break;
           
         default:
           sendResponse(res, 404, null, 'Route not found');
           break;
      }
    } else {
      sendResponse(res, 404, null, 'Route not found');
    }
    
  } catch (error) {
    console.error('❌ Server error:', error);
    sendResponse(res, 500, null, 'Internal server error');
  }
});

// Start server
async function startServer() {
  try {
    await connectToMongoDB();
    
    server.listen(PORT, () => {
      console.log(`🚀 MongoDB Authentication Server running on port ${PORT}`);
      console.log(`📊 Database: ${MONGODB_URI}`);
      console.log(`🔐 JWT Secret: ${JWT_SECRET.substring(0, 20)}...`);
    });
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n🛑 Shutting down server...');
      if (client) {
        await client.close();
        console.log('✅ MongoDB connection closed');
      }
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
