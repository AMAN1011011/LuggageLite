const http = require('http');
const url = require('url');
const querystring = require('querystring');

const PORT = 5000;
const HOST = 'localhost';

// Mock data
let mockStaff = [
  {
    _id: 'staff_001',
    staffId: 'CSMUM001234AB',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    email: 'rajesh@travellite.com',
    phone: '+91-9876543210',
    password: 'staff123', // In real app, this would be hashed
    role: 'counter_staff',
    permissions: ['booking_lookup', 'luggage_accept', 'status_update'],
    assignedStation: {
      id: '1',
      name: 'Mumbai Central',
      code: 'MUM',
      type: 'railway'
    },
    shift: 'morning',
    isActive: true,
    isOnDuty: false,
    stats: {
      totalBookingsProcessed: 45,
      totalLuggageAccepted: 32,
      totalLuggageDelivered: 28,
      averageProcessingTime: 8,
      customerRating: 4.7,
      lastActivityDate: new Date()
    },
    lastLogin: new Date(),
    loginHistory: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'staff_002',
    staffId: 'SVDEL002345CD',
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya@travellite.com',
    phone: '+91-9876543211',
    password: 'staff123',
    role: 'supervisor',
    permissions: ['booking_lookup', 'luggage_accept', 'status_update', 'customer_support', 'reports_view'],
    assignedStation: {
      id: '2',
      name: 'New Delhi',
      code: 'DEL',
      type: 'railway'
    },
    shift: 'full_day',
    isActive: true,
    isOnDuty: false,
    stats: {
      totalBookingsProcessed: 78,
      totalLuggageAccepted: 56,
      totalLuggageDelivered: 52,
      averageProcessingTime: 6,
      customerRating: 4.9,
      lastActivityDate: new Date()
    },
    lastLogin: new Date(),
    loginHistory: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

let mockUsers = [
  // Pre-seeded test user for easy testing
  {
    _id: 'user_test_123',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    password: 'password123',
    phone: '+91-9876543210',
    address: {
      street: '123 Test Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India'
    },
    emergencyContact: {
      name: 'Emergency Contact',
      phone: '+91-9876543211',
      relationship: 'family',
      address: {
        street: '456 Emergency Street',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        country: 'India'
      }
    },
    fullName: 'Test User',
    isActive: true,
    role: 'customer',
    bookingCount: 3,
    createdAt: new Date().toISOString()
  }
];
// Mock checklist data
const mockCategories = [
  {
    _id: 'cat_1',
    name: 'Electronics',
    description: 'Electronic devices and gadgets',
    icon: '💻',
    color: '#3B82F6',
    riskLevel: 'high',
    insuranceMultiplier: 2.0,
    sortOrder: 1,
    isActive: true
  },
  {
    _id: 'cat_2',
    name: 'Jewelry & Accessories',
    description: 'Valuable jewelry, watches, and accessories',
    icon: '💎',
    color: '#F59E0B',
    riskLevel: 'critical',
    insuranceMultiplier: 3.0,
    sortOrder: 2,
    isActive: true
  },
  {
    _id: 'cat_3',
    name: 'Documents',
    description: 'Important documents and certificates',
    icon: '📄',
    color: '#10B981',
    riskLevel: 'critical',
    insuranceMultiplier: 1.5,
    sortOrder: 3,
    isActive: true
  }
];

const mockItems = [
  {
    _id: 'item_1',
    name: 'Laptop Computer',
    description: 'Personal or work laptop computer',
    category: 'cat_1',
    estimatedValue: { min: 25000, max: 150000, currency: 'INR' },
    riskLevel: 'high',
    fragile: true,
    requiresSpecialHandling: true,
    commonBrands: ['Apple', 'Dell', 'HP', 'Lenovo', 'Asus'],
    tags: ['computer', 'work', 'portable'],
    insuranceRequired: true,
    popularity: 100,
    isActive: true
  },
  {
    _id: 'item_2',
    name: 'Smartphone',
    description: 'Mobile phone or smartphone',
    category: 'cat_1',
    estimatedValue: { min: 10000, max: 120000, currency: 'INR' },
    riskLevel: 'high',
    fragile: true,
    commonBrands: ['Apple', 'Samsung', 'OnePlus', 'Xiaomi'],
    tags: ['phone', 'mobile', 'communication'],
    insuranceRequired: true,
    popularity: 95,
    isActive: true
  },
  {
    _id: 'item_3',
    name: 'Gold Jewelry',
    description: 'Gold rings, necklaces, bracelets, or earrings',
    category: 'cat_2',
    estimatedValue: { min: 10000, max: 500000, currency: 'INR' },
    riskLevel: 'critical',
    requiresSpecialHandling: true,
    tags: ['gold', 'precious', 'traditional'],
    insuranceRequired: true,
    popularity: 85,
    isActive: true
  },
  {
    _id: 'item_4',
    name: 'Passport',
    description: 'Travel passport document',
    category: 'cat_3',
    estimatedValue: { min: 5000, max: 10000, currency: 'INR' },
    riskLevel: 'critical',
    requiresSpecialHandling: true,
    tags: ['travel', 'identity', 'government'],
    insuranceRequired: false,
    popularity: 90,
    isActive: true
  }
];

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

console.log('🚀 Starting TravelLite API Server...');

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

function calculatePricing(params) {
  const {
    distance,
    sourceType = 'railway',
    destinationType = 'railway',
    pickupTime = new Date(),
    userType = 'new',
    bookingCount = 0
  } = params;

  // Pricing configuration
  const config = {
    basePrice: 50,
    pricePerKm: 2.5,
    minimumCharge: 100,
    maximumCharge: 2000,
    stationMultipliers: {
      'railway-railway': 1.0,
      'railway-airport': 1.2,
      'airport-railway': 1.2,
      'airport-airport': 1.4
    },
    serviceFees: {
      handlingFee: 25,
      insuranceFee: 15,
      packagingFee: 20,
      trackingFee: 10
    },
    taxes: {
      gst: 0.18,
      serviceTax: 0.05
    }
  };

  // Base calculation
  const basePrice = config.basePrice;
  const distancePrice = distance * config.pricePerKm;
  const subtotal = basePrice + distancePrice;

  // Station type multiplier
  const stationKey = `${sourceType}-${destinationType}`;
  const stationMultiplier = config.stationMultipliers[stationKey] || 1.0;
  const stationAdjustedPrice = subtotal * stationMultiplier;

  // Distance tier multiplier
  let distanceMultiplier = 1.0;
  if (distance > 500) distanceMultiplier = 1.3;
  else if (distance > 200) distanceMultiplier = 1.2;
  else if (distance > 50) distanceMultiplier = 1.1;

  const distanceAdjustedPrice = stationAdjustedPrice * distanceMultiplier;

  // Time-based surcharge
  const hour = pickupTime.getHours();
  let timeMultiplier = 1.0;
  if ((hour >= 22 || hour < 6)) timeMultiplier = 1.15; // Night service
  else if ((hour >= 6 && hour < 10) || (hour >= 17 && hour < 21)) timeMultiplier = 1.05; // Rush hours

  const timeAdjustedPrice = distanceAdjustedPrice * timeMultiplier;

  // Service fees
  const totalFees = Object.values(config.serviceFees).reduce((sum, fee) => sum + fee, 0);
  const preTaxTotal = timeAdjustedPrice + totalFees;

  // Apply discounts
  let discountAmount = 0;
  if (userType === 'new') discountAmount = preTaxTotal * 0.1;
  else if (userType === 'returning' && bookingCount >= 5) discountAmount = preTaxTotal * 0.05;
  else if (userType === 'premium') discountAmount = preTaxTotal * 0.15;

  const discountedTotal = preTaxTotal - discountAmount;

  // Calculate taxes
  const gstAmount = discountedTotal * config.taxes.gst;
  const serviceTaxAmount = discountedTotal * config.taxes.serviceTax;
  const totalTaxes = gstAmount + serviceTaxAmount;

  // Final total
  let finalTotal = discountedTotal + totalTaxes;
  
  // Apply limits
  if (finalTotal < config.minimumCharge) finalTotal = config.minimumCharge;
  if (finalTotal > config.maximumCharge) finalTotal = config.maximumCharge;

  return {
    distance: Math.round(distance * 100) / 100,
    sourceType,
    destinationType,
    calculations: {
      basePrice: Math.round(basePrice * 100) / 100,
      distancePrice: Math.round(distancePrice * 100) / 100,
      subtotal: Math.round(subtotal * 100) / 100,
      stationMultiplier,
      distanceMultiplier,
      timeMultiplier,
      adjustedPrice: Math.round(timeAdjustedPrice * 100) / 100
    },
    fees: {
      handlingFee: config.serviceFees.handlingFee,
      insuranceFee: config.serviceFees.insuranceFee,
      packagingFee: config.serviceFees.packagingFee,
      trackingFee: config.serviceFees.trackingFee,
      total: totalFees
    },
    discounts: {
      type: userType,
      amount: Math.round(discountAmount * 100) / 100
    },
    taxes: {
      gst: {
        percentage: 18,
        amount: Math.round(gstAmount * 100) / 100
      },
      serviceTax: {
        percentage: 5,
        amount: Math.round(serviceTaxAmount * 100) / 100
      },
      total: Math.round(totalTaxes * 100) / 100
    },
    total: Math.round(finalTotal * 100) / 100,
    currency: 'INR'
  };
}

function sendResponse(res, statusCode, data) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:5173',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true'
  };
  
  res.writeHead(statusCode, headers);
  res.end(JSON.stringify(data));
}

function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const parsed = body ? JSON.parse(body) : {};
        resolve(parsed);
      } catch (error) {
        resolve({});
      }
    });
    
    req.on('error', (error) => {
      reject(error);
    });
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const query = parsedUrl.query;
    const method = req.method;

    console.log(`${method} ${path}`);

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      sendResponse(res, 200, { message: 'CORS preflight successful' });
      return;
    }

    // Health check
    if (path === '/api/health') {
      sendResponse(res, 200, {
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: 'Mock - Connected',
        server: 'TravelLite API'
      });
      return;
    }

    // Auth routes
    if (path === '/api/auth/register' && method === 'POST') {
      const body = await getRequestBody(req);
      const { firstName, lastName, email, password, phone, address } = body;
      
      console.log(`Registration attempt for email: ${email}`);
      
      if (!firstName || !lastName || !email || !password || !phone) {
        sendResponse(res, 400, {
          success: false,
          message: 'All required fields must be provided'
        });
        return;
      }

      if (mockUsers.find(u => u.email === email)) {
        console.log(`Registration failed: User already exists with email: ${email}`);
        sendResponse(res, 400, {
          success: false,
          message: 'User with this email already exists. Please try logging in instead.'
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
      console.log(`Registration successful for user: ${email}`);
      console.log(`Total users now: ${mockUsers.length}`);

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
      const { email, password } = body;
      
      console.log(`Login attempt for email: ${email}`);
      console.log(`Total users in database: ${mockUsers.length}`);
      
      if (!email || !password) {
        sendResponse(res, 400, {
          success: false,
          message: 'Email and password are required'
        });
        return;
      }

      // Check if user exists by email first
      const userByEmail = mockUsers.find(u => u.email === email);
      if (!userByEmail) {
        console.log(`User not found with email: ${email}`);
        console.log(`Available emails: ${mockUsers.map(u => u.email).join(', ')}`);
        sendResponse(res, 401, {
          success: false,
          message: 'User not found. Please check your email or sign up first.'
        });
        return;
      }

      // Check password
      if (userByEmail.password !== password) {
        console.log(`Password mismatch for user: ${email}`);
        sendResponse(res, 401, {
          success: false,
          message: 'Incorrect password. Please try again.'
        });
        return;
      }

      console.log(`Login successful for user: ${email}`);
      const userResponse = { ...userByEmail };
      delete userResponse.password;

      sendResponse(res, 200, {
        success: true,
        message: 'Login successful',
        data: {
          user: userResponse,
          tokens: {
            accessToken: `mock_token_${userByEmail._id}`,
            refreshToken: `mock_refresh_${userByEmail._id}`
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

    // Contact Information routes
    if (path === '/api/auth/contact' && method === 'PUT') {
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
      const userIndex = mockUsers.findIndex(u => u._id === userId);

      if (userIndex === -1) {
        sendResponse(res, 401, {
          success: false,
          message: 'Invalid token'
        });
        return;
      }

      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const contactData = JSON.parse(body);
          
          // Validate required fields
          const requiredFields = ['phone'];
          const missingFields = requiredFields.filter(field => !contactData[field]);
          
          if (missingFields.length > 0) {
            sendResponse(res, 400, {
              success: false,
              message: `Missing required fields: ${missingFields.join(', ')}`
            });
            return;
          }

          // Validate Indian phone number format
          const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;
          if (!phoneRegex.test(contactData.phone.replace(/[\s\-]/g, ''))) {
            sendResponse(res, 400, {
              success: false,
              message: 'Invalid Indian phone number format'
            });
            return;
          }

          // Validate pincode if address is provided
          if (contactData.address && contactData.address.pincode) {
            const pincodeRegex = /^[1-9][0-9]{5}$/;
            if (!pincodeRegex.test(contactData.address.pincode)) {
              sendResponse(res, 400, {
                success: false,
                message: 'Invalid Indian pincode format'
              });
              return;
            }
          }

          // Validate emergency contact phone if provided
          if (contactData.emergencyContact && contactData.emergencyContact.phone) {
            if (!phoneRegex.test(contactData.emergencyContact.phone.replace(/[\s\-]/g, ''))) {
              sendResponse(res, 400, {
                success: false,
                message: 'Invalid emergency contact phone number format'
              });
              return;
            }
          }

          // Validate emergency contact pincode if provided
          if (contactData.emergencyContact && contactData.emergencyContact.address && contactData.emergencyContact.address.pincode) {
            const pincodeRegex = /^[1-9][0-9]{5}$/;
            if (!pincodeRegex.test(contactData.emergencyContact.address.pincode)) {
              sendResponse(res, 400, {
                success: false,
                message: 'Invalid emergency contact pincode format'
              });
              return;
            }
          }

          // Update user contact information
          const user = mockUsers[userIndex];
          if (contactData.phone) user.phone = contactData.phone;
          if (contactData.address) {
            user.address = { ...user.address, ...contactData.address };
          }
          if (contactData.emergencyContact) {
            user.emergencyContact = { ...user.emergencyContact, ...contactData.emergencyContact };
          }

          user.updatedAt = new Date().toISOString();

          const userResponse = { ...user };
          delete userResponse.password;

          sendResponse(res, 200, {
            success: true,
            message: 'Contact information updated successfully',
            data: { user: userResponse }
          });
        } catch (error) {
          sendResponse(res, 400, {
            success: false,
            message: 'Invalid JSON format'
          });
        }
      });
      return;
    }

    if (path === '/api/auth/contact' && method === 'GET') {
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

      sendResponse(res, 200, {
        success: true,
        data: {
          phone: user.phone,
          address: user.address,
          emergencyContact: user.emergencyContact
        }
      });
      return;
    }

    // Address validation utility endpoint
    if (path === '/api/utils/validate-address' && method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const addressData = JSON.parse(body);
          const errors = [];

          // Validate pincode
          if (addressData.pincode) {
            const pincodeRegex = /^[1-9][0-9]{5}$/;
            if (!pincodeRegex.test(addressData.pincode)) {
              errors.push('Invalid Indian pincode format');
            }
          }

          // Validate required fields
          const requiredFields = ['street', 'city', 'state', 'pincode'];
          requiredFields.forEach(field => {
            if (!addressData[field] || addressData[field].trim() === '') {
              errors.push(`${field} is required`);
            }
          });

          sendResponse(res, 200, {
            success: errors.length === 0,
            valid: errors.length === 0,
            errors: errors,
            message: errors.length === 0 ? 'Address is valid' : 'Address validation failed'
          });
        } catch (error) {
          sendResponse(res, 400, {
            success: false,
            message: 'Invalid JSON format'
          });
        }
      });
      return;
    }

    // Image Upload routes
    if (path === '/api/images/upload' && method === 'POST') {
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

      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const uploadData = JSON.parse(body);
          
          // Validate image data
          if (!uploadData.images || !Array.isArray(uploadData.images)) {
            sendResponse(res, 400, {
              success: false,
              message: 'Images array is required'
            });
            return;
          }

          if (uploadData.images.length !== 4) {
            sendResponse(res, 400, {
              success: false,
              message: 'Exactly 4 images are required (front, back, left, right)'
            });
            return;
          }

          // Validate each image
          const requiredAngles = ['front', 'back', 'left', 'right'];
          const providedAngles = uploadData.images.map(img => img.angle);
          const missingAngles = requiredAngles.filter(angle => !providedAngles.includes(angle));
          
          if (missingAngles.length > 0) {
            sendResponse(res, 400, {
              success: false,
              message: `Missing required angles: ${missingAngles.join(', ')}`
            });
            return;
          }

          // Mock image processing and storage
          const processedImages = uploadData.images.map((image, index) => ({
            id: `img_${userId}_${Date.now()}_${index}`,
            angle: image.angle,
            originalName: image.originalName || `luggage_${image.angle}.jpg`,
            size: image.size || Math.floor(Math.random() * 2000000) + 500000, // Mock size
            format: image.format || 'jpeg',
            url: `https://mock-storage.travellite.com/images/${userId}/${image.angle}_${Date.now()}.jpg`,
            thumbnailUrl: `https://mock-storage.travellite.com/thumbs/${userId}/${image.angle}_${Date.now()}_thumb.jpg`,
            uploadedAt: new Date().toISOString(),
            processed: true
          }));

          // Store images in user data (mock)
          if (!user.luggageImages) {
            user.luggageImages = [];
          }
          user.luggageImages = processedImages;
          user.updatedAt = new Date().toISOString();

          sendResponse(res, 200, {
            success: true,
            message: 'Images uploaded successfully',
            data: {
              images: processedImages,
              totalCount: processedImages.length,
              uploadId: `upload_${userId}_${Date.now()}`
            }
          });
        } catch (error) {
          sendResponse(res, 400, {
            success: false,
            message: 'Invalid JSON format'
          });
        }
      });
      return;
    }

    if (path === '/api/images/user' && method === 'GET') {
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

      sendResponse(res, 200, {
        success: true,
        data: {
          images: user.luggageImages || [],
          count: user.luggageImages ? user.luggageImages.length : 0
        }
      });
      return;
    }

    if (path.startsWith('/api/images/delete/') && method === 'DELETE') {
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

      const imageId = path.split('/').pop();
      
      if (!user.luggageImages) {
        sendResponse(res, 404, {
          success: false,
          message: 'No images found'
        });
        return;
      }

      const imageIndex = user.luggageImages.findIndex(img => img.id === imageId);
      
      if (imageIndex === -1) {
        sendResponse(res, 404, {
          success: false,
          message: 'Image not found'
        });
        return;
      }

      user.luggageImages.splice(imageIndex, 1);
      user.updatedAt = new Date().toISOString();

      sendResponse(res, 200, {
        success: true,
        message: 'Image deleted successfully',
        data: {
          images: user.luggageImages,
          count: user.luggageImages.length
        }
      });
      return;
    }

    // Image validation utility
    if (path === '/api/utils/validate-image' && method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const imageData = JSON.parse(body);
          const errors = [];

          // Validate file size (max 5MB)
          const maxSize = 5 * 1024 * 1024; // 5MB
          if (imageData.size > maxSize) {
            errors.push('Image size must be less than 5MB');
          }

          // Validate file format
          const allowedFormats = ['jpeg', 'jpg', 'png', 'webp'];
          if (!allowedFormats.includes(imageData.format?.toLowerCase())) {
            errors.push('Invalid image format. Allowed formats: JPEG, PNG, WebP');
          }

          // Validate dimensions (optional)
          if (imageData.width && imageData.height) {
            if (imageData.width < 400 || imageData.height < 400) {
              errors.push('Image dimensions must be at least 400x400 pixels');
            }
          }

          sendResponse(res, 200, {
            success: errors.length === 0,
            valid: errors.length === 0,
            errors: errors,
            message: errors.length === 0 ? 'Image is valid' : 'Image validation failed'
          });
        } catch (error) {
          sendResponse(res, 400, {
            success: false,
            message: 'Invalid JSON format'
          });
        }
      });
      return;
    }

    // Station routes
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

    // Pricing endpoints
    if (path === '/api/pricing/calculate' && method === 'POST') {
      const body = await getRequestBody(req);
      const {
        sourceStationId,
        destinationStationId,
        pickupTime,
        userType = 'new',
        bookingCount = 0
      } = body;

      if (!sourceStationId || !destinationStationId) {
        sendResponse(res, 400, {
          success: false,
          message: 'Source and destination station IDs are required'
        });
        return;
      }

      if (sourceStationId === destinationStationId) {
        sendResponse(res, 400, {
          success: false,
          message: 'Source and destination stations cannot be the same'
        });
        return;
      }

      const source = mockStations.find(s => s._id === sourceStationId);
      const destination = mockStations.find(s => s._id === destinationStationId);

      if (!source || !destination) {
        sendResponse(res, 404, {
          success: false,
          message: 'One or both stations not found'
        });
        return;
      }

      const distance = calculateDistance(
        source.coordinates.latitude,
        source.coordinates.longitude,
        destination.coordinates.latitude,
        destination.coordinates.longitude
      );

      // Calculate pricing using simplified logic
      const pricing = calculatePricing({
        distance,
        sourceType: source.type,
        destinationType: destination.type,
        pickupTime: pickupTime ? new Date(pickupTime) : new Date(),
        userType,
        bookingCount: parseInt(bookingCount) || 0
      });

      sendResponse(res, 200, {
        success: true,
        data: {
          pricing,
          route: {
            source: {
              id: source._id,
              name: source.name,
              code: source.code,
              type: source.type,
              city: source.city,
              state: source.state
            },
            destination: {
              id: destination._id,
              name: destination.name,
              code: destination.code,
              type: destination.type,
              city: destination.city,
              state: destination.state
            },
            distance: Math.round(distance * 100) / 100
          }
        }
      });
      return;
    }

    if (path === '/api/pricing/quote') {
      const { distance, sourceType = 'railway', destinationType = 'railway' } = query;

      if (!distance || isNaN(distance) || distance <= 0) {
        sendResponse(res, 400, {
          success: false,
          message: 'Valid distance is required'
        });
        return;
      }

      const pricing = calculatePricing({
        distance: parseFloat(distance),
        sourceType,
        destinationType
      });

      sendResponse(res, 200, {
        success: true,
        data: {
          distance: parseFloat(distance),
          estimatedPrice: pricing.total,
          priceRange: {
            min: Math.round(pricing.total * 0.9 * 100) / 100,
            max: Math.round(pricing.total * 1.1 * 100) / 100
          },
          currency: 'INR'
        }
      });
      return;
    }

    if (path === '/api/pricing/config') {
      sendResponse(res, 200, {
        success: true,
        data: {
          config: {
            basePrice: 50,
            pricePerKm: 2.5,
            minimumCharge: 100,
            maximumCharge: 2000,
            currency: 'INR',
            stationMultipliers: {
              'railway-railway': 1.0,
              'railway-airport': 1.2,
              'airport-railway': 1.2,
              'airport-airport': 1.4
            },
            serviceFees: {
              handlingFee: 25,
              insuranceFee: 15,
              packagingFee: 20,
              trackingFee: 10
            },
            taxes: {
              gst: 18,
              serviceTax: 5
            },
            discounts: {
              newUser: 10,
              returning: 5,
              premium: 15
            }
          }
        }
      });
      return;
    }

    // Checklist endpoints
    if (path === '/api/checklist/categories') {
      const { includeItems = 'true' } = query;
      
      if (includeItems === 'true') {
        const categoriesWithItems = mockCategories.map(category => {
          const categoryItems = mockItems.filter(item => item.category === category._id);
          return {
            ...category,
            items: categoryItems,
            itemCount: categoryItems.length
          };
        });

        sendResponse(res, 200, {
          success: true,
          data: {
            categories: categoriesWithItems,
            totalCategories: categoriesWithItems.length,
            totalItems: mockItems.length
          }
        });
      } else {
        sendResponse(res, 200, {
          success: true,
          data: {
            categories: mockCategories,
            totalCategories: mockCategories.length
          }
        });
      }
      return;
    }

    if (path.startsWith('/api/checklist/categories/') && path.endsWith('/items')) {
      const pathParts = path.split('/');
      const categoryId = pathParts[4];
      const { limit = 50, search = '', sortBy = 'popularity' } = query;

      let categoryItems = mockItems.filter(item => item.category === categoryId);

      // Apply search filter
      if (search.trim()) {
        const searchLower = search.toLowerCase();
        categoryItems = categoryItems.filter(item =>
          item.name.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
          (item.commonBrands && item.commonBrands.some(brand => brand.toLowerCase().includes(searchLower)))
        );
      }

      // Apply sorting
      categoryItems.sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'value_low':
            return a.estimatedValue.min - b.estimatedValue.min;
          case 'value_high':
            return b.estimatedValue.max - a.estimatedValue.max;
          case 'risk':
            const riskOrder = { critical: 4, high: 3, medium: 2, low: 1 };
            return (riskOrder[b.riskLevel] || 0) - (riskOrder[a.riskLevel] || 0);
          default: // popularity
            return b.popularity - a.popularity;
        }
      });

      // Apply limit
      categoryItems = categoryItems.slice(0, parseInt(limit));

      sendResponse(res, 200, {
        success: true,
        data: {
          items: categoryItems,
          count: categoryItems.length,
          filters: { categoryId, search, sortBy, limit: parseInt(limit) }
        }
      });
      return;
    }

    if (path === '/api/checklist/search') {
      const { q: searchQuery, category, riskLevel, limit = 20 } = query;

      if (!searchQuery || searchQuery.trim().length < 2) {
        sendResponse(res, 400, {
          success: false,
          message: 'Search query must be at least 2 characters long'
        });
        return;
      }

      const searchLower = searchQuery.toLowerCase();
      let filteredItems = mockItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
          (item.commonBrands && item.commonBrands.some(brand => brand.toLowerCase().includes(searchLower)));

        const matchesCategory = !category || item.category === category;
        const matchesRisk = !riskLevel || item.riskLevel === riskLevel;

        return matchesSearch && matchesCategory && matchesRisk;
      });

      // Sort by popularity and limit
      filteredItems = filteredItems
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, parseInt(limit));

      sendResponse(res, 200, {
        success: true,
        data: {
          items: filteredItems,
          count: filteredItems.length,
          query: searchQuery,
          filters: { category, riskLevel, limit: parseInt(limit) }
        }
      });
      return;
    }

    if (path === '/api/checklist/popular') {
      const { limit = 10, category } = query;

      let popularItems = mockItems;
      if (category) {
        popularItems = popularItems.filter(item => item.category === category);
      }

      popularItems = popularItems
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, parseInt(limit));

      sendResponse(res, 200, {
        success: true,
        data: {
          items: popularItems,
          count: popularItems.length
        }
      });
      return;
    }

    if (path.startsWith('/api/checklist/items/')) {
      const pathParts = path.split('/');
      const itemId = pathParts[4];

      const item = mockItems.find(i => i._id === itemId);
      if (!item) {
        sendResponse(res, 404, {
          success: false,
          message: 'Item not found'
        });
        return;
      }

      // Add category info
      const category = mockCategories.find(c => c._id === item.category);
      const itemWithCategory = {
        ...item,
        category: category
      };

      sendResponse(res, 200, {
        success: true,
        data: { item: itemWithCategory }
      });
      return;
    }

    if (path === '/api/checklist/stats') {
      const riskDistribution = mockItems.reduce((acc, item) => {
        acc[item.riskLevel] = (acc[item.riskLevel] || 0) + 1;
        return acc;
      }, {});

      sendResponse(res, 200, {
        success: true,
        data: {
          totalCategories: mockCategories.length,
          totalItems: mockItems.length,
          totalBookingItems: 0, // Mock value
          riskDistribution
        }
      });
      return;
    }

    // Booking routes
    if (path === '/api/booking' && method === 'POST') {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        sendResponse(res, 401, { success: false, message: 'Access token required' });
        return;
      }

      const user = mockUsers.find(u => `mock_token_${u._id}` === token);
      if (!user) {
        sendResponse(res, 401, { success: false, message: 'Invalid token' });
        return;
      }

      try {
        const body = await getRequestBody(req);
        const {
          sourceStation,
          destinationStation,
          distance,
          pricing,
          securityItems,
          contactInfo,
          luggageImages,
          paymentMethod
        } = body;

        // Validate required fields
        if (!sourceStation || !destinationStation || !distance || !pricing || !contactInfo || !luggageImages) {
          sendResponse(res, 400, {
            success: false,
            message: 'Missing required booking information'
          });
          return;
        }

        // Validate luggage images (must be exactly 4)
        if (!luggageImages || luggageImages.length !== 4) {
          sendResponse(res, 400, {
            success: false,
            message: 'Exactly 4 luggage images are required'
          });
          return;
        }

        // Check if all required angles are present
        const requiredAngles = ['front', 'back', 'left', 'right'];
        const providedAngles = luggageImages.map(img => img.angle);
        const missingAngles = requiredAngles.filter(angle => !providedAngles.includes(angle));
        
        if (missingAngles.length > 0) {
          sendResponse(res, 400, {
            success: false,
            message: `Missing required image angles: ${missingAngles.join(', ')}`
          });
          return;
        }

        // Generate unique booking ID
        const bookingId = `TL${Date.now().toString().slice(-8)}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

        // Create booking object
        const booking = {
          _id: `booking_${Date.now()}`,
          bookingId,
          userId: user._id,
          sourceStation,
          destinationStation,
          distance,
          pricing,
          securityItems: securityItems || [],
          contactInfo,
          luggageImages,
          status: 'pending_payment',
          payment: {
            method: paymentMethod,
            amount: pricing.totalAmount,
            status: 'pending'
          },
          confirmation: {
            emailSent: false,
            smsSent: false
          },
          tracking: {
            currentLocation: sourceStation.name,
            trackingHistory: [{
              status: 'booking_created',
              location: sourceStation.name,
              timestamp: new Date(),
              notes: 'Booking created successfully'
            }]
          },
          createdAt: new Date(),
          updatedAt: new Date()
        };

        // Store booking (in real app, this would be in database)
        if (!user.bookings) user.bookings = [];
        user.bookings.push(booking);

        console.log(`📦 Booking created: ${bookingId} for user: ${user.email}`);

        sendResponse(res, 201, {
          success: true,
          message: 'Booking created successfully',
          data: {
            booking: {
              id: booking._id,
              bookingId: booking.bookingId,
              status: booking.status,
              totalAmount: booking.pricing.totalAmount,
              createdAt: booking.createdAt
            }
          }
        });
      } catch (error) {
        sendResponse(res, 400, {
          success: false,
          message: 'Invalid JSON format'
        });
      }
      return;
    }

    if (path === '/api/booking' && method === 'GET') {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        sendResponse(res, 401, { success: false, message: 'Access token required' });
        return;
      }

      const user = mockUsers.find(u => `mock_token_${u._id}` === token);
      if (!user) {
        sendResponse(res, 401, { success: false, message: 'Invalid token' });
        return;
      }

      const bookings = user.bookings || [];
      const { status } = query;

      let filteredBookings = bookings;
      if (status) {
        filteredBookings = bookings.filter(b => b.status === status);
      }

      // Sort by creation date (newest first)
      filteredBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      sendResponse(res, 200, {
        success: true,
        data: {
          bookings: filteredBookings.map(b => ({
            id: b._id,
            bookingId: b.bookingId,
            sourceStation: b.sourceStation,
            destinationStation: b.destinationStation,
            status: b.status,
            totalAmount: b.pricing.totalAmount,
            createdAt: b.createdAt,
            updatedAt: b.updatedAt
          })),
          total: filteredBookings.length
        }
      });
      return;
    }

    // Get specific booking
    if (path.startsWith('/api/booking/') && method === 'GET') {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        sendResponse(res, 401, { success: false, message: 'Access token required' });
        return;
      }

      const user = mockUsers.find(u => `mock_token_${u._id}` === token);
      if (!user) {
        sendResponse(res, 401, { success: false, message: 'Invalid token' });
        return;
      }

      const bookingId = path.split('/')[3];
      const booking = user.bookings?.find(b => b.bookingId === bookingId || b._id === bookingId);

      if (!booking) {
        sendResponse(res, 404, {
          success: false,
          message: 'Booking not found'
        });
        return;
      }

      sendResponse(res, 200, {
        success: true,
        data: { booking }
      });
      return;
    }

    // Process payment
    if (path.startsWith('/api/booking/') && path.endsWith('/payment') && method === 'POST') {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        sendResponse(res, 401, { success: false, message: 'Access token required' });
        return;
      }

      const user = mockUsers.find(u => `mock_token_${u._id}` === token);
      if (!user) {
        sendResponse(res, 401, { success: false, message: 'Invalid token' });
        return;
      }

      const bookingId = path.split('/')[3];
      const booking = user.bookings?.find(b => b.bookingId === bookingId || b._id === bookingId);

      if (!booking) {
        sendResponse(res, 404, {
          success: false,
          message: 'Booking not found'
        });
        return;
      }

      try {
        const body = await getRequestBody(req);
        const { paymentMethod, paymentDetails } = body;

        // Mock payment processing
        const transactionId = `TXN${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        
        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Update payment information
        booking.payment = {
          method: paymentMethod,
          transactionId,
          paymentDate: new Date(),
          amount: booking.pricing.totalAmount,
          status: 'completed'
        };

        // Update booking status
        booking.status = 'payment_confirmed';
        booking.updatedAt = new Date();
        booking.tracking.trackingHistory.push({
          status: 'payment_confirmed',
          location: booking.sourceStation.name,
          timestamp: new Date(),
          notes: 'Payment completed successfully'
        });

        // Mock sending confirmations
        console.log(`📧 Sending email confirmation to: ${booking.contactInfo.email}`);
        console.log(`📱 Sending SMS confirmation to: ${booking.contactInfo.phone}`);
        
        booking.confirmation.emailSent = true;
        booking.confirmation.smsSent = true;
        booking.confirmation.emailSentAt = new Date();
        booking.confirmation.smsSentAt = new Date();

        console.log(`💳 Payment processed for booking: ${bookingId}`);
        console.log(`📦 Transaction ID: ${transactionId}`);

        sendResponse(res, 200, {
          success: true,
          message: 'Payment processed successfully',
          data: {
            transactionId,
            amount: booking.pricing.totalAmount,
            status: 'completed',
            bookingId: booking.bookingId,
            confirmationSent: {
              email: booking.confirmation.emailSent,
              sms: booking.confirmation.smsSent
            }
          }
        });
      } catch (error) {
        sendResponse(res, 400, {
          success: false,
          message: 'Invalid JSON format'
        });
      }
      return;
    }

    // Counter/Staff routes
    if (path === '/api/counter/auth/login' && method === 'POST') {
      try {
        const body = await getRequestBody(req);
        const { email, password, stationId } = body;

        if (!email || !password) {
          sendResponse(res, 400, {
            success: false,
            message: 'Email and password are required'
          });
          return;
        }

        // Find staff member
        const staff = mockStaff.find(s => s.email.toLowerCase() === email.toLowerCase() && s.isActive);

        if (!staff || staff.password !== password) {
          sendResponse(res, 401, {
            success: false,
            message: 'Invalid credentials'
          });
          return;
        }

        // Check station assignment if provided
        if (stationId && staff.assignedStation.id !== stationId) {
          sendResponse(res, 403, {
            success: false,
            message: 'Access denied for this station'
          });
          return;
        }

        // Clock in
        staff.isOnDuty = true;
        staff.lastLogin = new Date();
        staff.loginHistory.push({
          loginTime: new Date(),
          ipAddress: 'localhost',
          deviceInfo: 'Mock Device'
        });

        const token = `staff_token_${staff._id}_${Date.now()}`;

        console.log(`👮‍♂️ Staff login: ${staff.firstName} ${staff.lastName} (${staff.role})`);

        sendResponse(res, 200, {
          success: true,
          message: 'Staff login successful',
          data: {
            staff: {
              id: staff._id,
              staffId: staff.staffId,
              fullName: `${staff.firstName} ${staff.lastName}`,
              role: staff.role,
              displayRole: staff.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
              assignedStation: staff.assignedStation,
              permissions: staff.permissions,
              isOnDuty: staff.isOnDuty
            },
            token
          }
        });
      } catch (error) {
        sendResponse(res, 400, {
          success: false,
          message: 'Invalid JSON format'
        });
      }
      return;
    }

    if (path === '/api/counter/auth/logout' && method === 'POST') {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token || !token.startsWith('staff_token_')) {
        sendResponse(res, 401, { success: false, message: 'Invalid staff token' });
        return;
      }

      const staffId = token.split('_')[2];
      const staff = mockStaff.find(s => s._id === staffId);

      if (staff) {
        staff.isOnDuty = false;
        // Update latest login history
        if (staff.loginHistory.length > 0) {
          const latestSession = staff.loginHistory[staff.loginHistory.length - 1];
          if (!latestSession.logoutTime) {
            latestSession.logoutTime = new Date();
          }
        }
        console.log(`👮‍♂️ Staff logout: ${staff.firstName} ${staff.lastName}`);
      }

      sendResponse(res, 200, {
        success: true,
        message: 'Staff logout successful'
      });
      return;
    }

    // Staff dashboard stats
    if (path === '/api/counter/dashboard/stats' && method === 'GET') {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token || !token.startsWith('staff_token_')) {
        sendResponse(res, 401, { success: false, message: 'Invalid staff token' });
        return;
      }

      const staffId = token.split('_')[2];
      const staff = mockStaff.find(s => s._id === staffId);

      if (!staff) {
        sendResponse(res, 401, { success: false, message: 'Staff not found' });
        return;
      }

      const stationId = staff.assignedStation.id;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get booking counts (mock data)
      const todayPickups = 5;
      const todayDeliveries = 3;
      const todayCompleted = 8;
      const pendingPickups = 12;
      const pendingDeliveries = 7;
      const staffOnDuty = mockStaff.filter(s => s.assignedStation.id === stationId && s.isOnDuty).length;

      sendResponse(res, 200, {
        success: true,
        data: {
          todayStats: {
            pickups: todayPickups,
            deliveries: todayDeliveries,
            completed: todayCompleted
          },
          pendingWork: {
            pickups: pendingPickups,
            deliveries: pendingDeliveries
          },
          stationInfo: {
            staffOnDuty,
            currentStaff: {
              name: `${staff.firstName} ${staff.lastName}`,
              role: staff.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
              onDutySince: staff.lastLogin
            }
          },
          personalStats: staff.stats
        }
      });
      return;
    }

    // Lookup booking by ID
    if (path.startsWith('/api/counter/bookings/') && path.endsWith('/lookup') && method === 'GET') {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token || !token.startsWith('staff_token_')) {
        sendResponse(res, 401, { success: false, message: 'Invalid staff token' });
        return;
      }

      const staffId = token.split('_')[2];
      const staff = mockStaff.find(s => s._id === staffId);

      if (!staff) {
        sendResponse(res, 401, { success: false, message: 'Staff not found' });
        return;
      }

      const bookingId = path.split('/')[3];
      
      // Find booking in user bookings
      let booking = null;
      let bookingUser = null;

      for (const user of mockUsers) {
        if (user.bookings) {
          const foundBooking = user.bookings.find(b => b.bookingId === bookingId || b._id === bookingId);
          if (foundBooking) {
            booking = foundBooking;
            bookingUser = user;
            break;
          }
        }
      }

      if (!booking) {
        sendResponse(res, 404, {
          success: false,
          message: 'Booking not found'
        });
        return;
      }

      // Check if booking is related to staff's station
      const isSourceStation = booking.sourceStation.id === staff.assignedStation.id;
      const isDestinationStation = booking.destinationStation.id === staff.assignedStation.id;

      if (!isSourceStation && !isDestinationStation) {
        sendResponse(res, 403, {
          success: false,
          message: 'Booking not associated with your station'
        });
        return;
      }

      const operationType = isSourceStation ? 'pickup' : 'delivery';

      sendResponse(res, 200, {
        success: true,
        data: {
          booking: {
            ...booking,
            userId: {
              firstName: bookingUser.firstName,
              lastName: bookingUser.lastName,
              email: bookingUser.email,
              phone: bookingUser.phone
            }
          },
          operationType,
          stationRole: isSourceStation ? 'source' : 'destination'
        }
      });
      return;
    }

    // Accept luggage
    if (path.startsWith('/api/counter/bookings/') && path.endsWith('/accept') && method === 'POST') {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token || !token.startsWith('staff_token_')) {
        sendResponse(res, 401, { success: false, message: 'Invalid staff token' });
        return;
      }

      const staffId = token.split('_')[2];
      const staff = mockStaff.find(s => s._id === staffId);

      if (!staff) {
        sendResponse(res, 401, { success: false, message: 'Staff not found' });
        return;
      }

      try {
        const body = await getRequestBody(req);
        const { verificationNotes, actualWeight, actualDimensions } = body;
        const bookingId = path.split('/')[3];

        // Find booking
        let booking = null;
        let bookingUser = null;

        for (const user of mockUsers) {
          if (user.bookings) {
            const foundBooking = user.bookings.find(b => b.bookingId === bookingId || b._id === bookingId);
            if (foundBooking) {
              booking = foundBooking;
              bookingUser = user;
              break;
            }
          }
        }

        if (!booking) {
          sendResponse(res, 404, { success: false, message: 'Booking not found' });
          return;
        }

        // Verify this is the source station
        if (booking.sourceStation.id !== staff.assignedStation.id) {
          sendResponse(res, 403, { success: false, message: 'This booking is not for luggage pickup at your station' });
          return;
        }

        // Check status
        if (booking.status !== 'payment_confirmed') {
          sendResponse(res, 400, { success: false, message: 'Booking is not ready for luggage acceptance' });
          return;
        }

        // Update booking
        booking.status = 'luggage_collected';
        booking.updatedAt = new Date();
        booking.tracking.pickupCompleted = new Date();
        booking.tracking.trackingHistory.push({
          status: 'luggage_collected',
          location: staff.assignedStation.name,
          timestamp: new Date(),
          notes: `Luggage collected by ${staff.firstName} ${staff.lastName}. ${verificationNotes || ''}`
        });

        // Update staff stats
        staff.stats.totalLuggageAccepted += 1;
        staff.stats.totalBookingsProcessed += 1;
        staff.stats.lastActivityDate = new Date();

        console.log(`📦 Luggage accepted: ${bookingId} by ${staff.firstName} ${staff.lastName}`);

        sendResponse(res, 200, {
          success: true,
          message: 'Luggage accepted successfully',
          data: {
            booking: {
              id: booking._id,
              bookingId: booking.bookingId,
              status: booking.status,
              updatedAt: booking.updatedAt
            }
          }
        });
      } catch (error) {
        sendResponse(res, 400, { success: false, message: 'Invalid JSON format' });
      }
      return;
    }

    // Cancel booking
    if (path.startsWith('/api/booking/') && path.endsWith('/cancel') && method === 'PATCH') {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        sendResponse(res, 401, { success: false, message: 'Access token required' });
        return;
      }

      const user = mockUsers.find(u => `mock_token_${u._id}` === token);
      if (!user) {
        sendResponse(res, 401, { success: false, message: 'Invalid token' });
        return;
      }

      const bookingId = path.split('/')[3];
      const booking = user.bookings?.find(b => b.bookingId === bookingId || b._id === bookingId);

      if (!booking) {
        sendResponse(res, 404, {
          success: false,
          message: 'Booking not found'
        });
        return;
      }

      // Check if booking can be cancelled
      if (['luggage_collected', 'in_transit', 'delivered'].includes(booking.status)) {
        sendResponse(res, 400, {
          success: false,
          message: 'Booking cannot be cancelled at this stage'
        });
        return;
      }

      try {
        const body = await getRequestBody(req);
        const { reason } = body;

        booking.status = 'cancelled';
        booking.updatedAt = new Date();
        booking.tracking.trackingHistory.push({
          status: 'cancelled',
          location: booking.tracking.currentLocation || 'User Request',
          timestamp: new Date(),
          notes: reason || 'Cancelled by user'
        });

        console.log(`❌ Booking cancelled: ${bookingId}`);

        sendResponse(res, 200, {
          success: true,
          message: 'Booking cancelled successfully',
          data: {
            booking: {
              id: booking._id,
              bookingId: booking.bookingId,
              status: booking.status,
              updatedAt: booking.updatedAt
            }
          }
        });
      } catch (error) {
        sendResponse(res, 400, {
          success: false,
          message: 'Invalid JSON format'
        });
      }
      return;
    }

    // 404 for unknown routes
    sendResponse(res, 404, {
      success: false,
      message: 'Route not found',
      path,
      method
    });

  } catch (error) {
    console.error('❌ Server error:', error);
    sendResponse(res, 500, {
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Error handling
server.on('error', (error) => {
  console.error('❌ Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    process.exit(1);
  }
});

// Start server
server.listen(PORT, HOST, () => {
  console.log('');
  console.log('🎉 TravelLite API Server Started Successfully!');
  console.log('─'.repeat(50));
  console.log(`🌍 Server URL: http://${HOST}:${PORT}`);
  console.log(`📱 Frontend URL: http://localhost:5173`);
  console.log(`🔗 Health Check: http://${HOST}:${PORT}/api/health`);
  console.log('─'.repeat(50));
  console.log('📊 Available Endpoints:');
  console.log('  • POST /api/auth/register');
  console.log('  • POST /api/auth/login');
  console.log('  • GET  /api/auth/profile');
  console.log('  • PUT  /api/auth/contact');
  console.log('  • GET  /api/auth/contact');
  console.log('  • POST /api/auth/logout');
  console.log('  • POST /api/booking');
  console.log('  • GET  /api/booking');
  console.log('  • GET  /api/booking/:id');
  console.log('  • POST /api/booking/:id/payment');
  console.log('  • PATCH /api/booking/:id/cancel');
  console.log('  • POST /api/counter/auth/login');
  console.log('  • POST /api/counter/auth/logout');
  console.log('  • GET  /api/counter/dashboard/stats');
  console.log('  • GET  /api/counter/bookings/:id/lookup');
  console.log('  • POST /api/counter/bookings/:id/accept');
  console.log('  • POST /api/images/upload');
  console.log('  • GET  /api/images/user');
  console.log('  • DELETE /api/images/delete/:id');
  console.log('  • GET  /api/stations/search');
  console.log('  • GET  /api/stations/popular');
  console.log('  • GET  /api/stations/distance/:id1/:id2');
  console.log('  • POST /api/utils/validate-address');
  console.log('  • POST /api/utils/validate-image');
  console.log('─'.repeat(50));
  console.log('✅ Ready to test full booking system with counter interface!');
  console.log('');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});
