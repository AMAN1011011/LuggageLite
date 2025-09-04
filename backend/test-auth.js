// Simple test script to verify authentication endpoints
const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

// Test data
const testUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  password: 'securepassword123',
  phone: '9876543210',
  address: {
    street: '123 Test Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001'
  }
};

async function testAuthenticationFlow() {
  console.log('🧪 Testing TravelLite Authentication System\n');
  
  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data.status);
    console.log('📊 Database status:', healthResponse.data.database);
    console.log('');
    
    // Test 2: User Registration
    console.log('2️⃣ Testing User Registration...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
    console.log('✅ Registration successful');
    console.log('👤 User created:', registerResponse.data.data.user.fullName);
    console.log('🔑 Access token received:', registerResponse.data.data.tokens.accessToken ? 'Yes' : 'No');
    console.log('');
    
    const { accessToken } = registerResponse.data.data.tokens;
    
    // Test 3: Get Profile (Protected Route)
    console.log('3️⃣ Testing Get Profile (Protected Route)...');
    const profileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    console.log('✅ Profile fetch successful');
    console.log('👤 User profile:', profileResponse.data.data.user.fullName);
    console.log('📧 Email:', profileResponse.data.data.user.email);
    console.log('');
    
    // Test 4: User Login
    console.log('4️⃣ Testing User Login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ Login successful');
    console.log('👤 User logged in:', loginResponse.data.data.user.fullName);
    console.log('🕐 Last login:', loginResponse.data.data.user.lastLogin);
    console.log('');
    
    // Test 5: Update Profile
    console.log('5️⃣ Testing Profile Update...');
    const updateResponse = await axios.put(`${BASE_URL}/auth/profile`, {
      firstName: 'Johnny',
      address: {
        ...testUser.address,
        city: 'Delhi'
      }
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    console.log('✅ Profile update successful');
    console.log('👤 Updated name:', updateResponse.data.data.user.fullName);
    console.log('🏙️ Updated city:', updateResponse.data.data.user.address.city);
    console.log('');
    
    // Test 6: Invalid Token Test
    console.log('6️⃣ Testing Invalid Token...');
    try {
      await axios.get(`${BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': 'Bearer invalid-token'
        }
      });
    } catch (error) {
      console.log('✅ Invalid token correctly rejected');
      console.log('🚫 Error:', error.response.data.message);
    }
    console.log('');
    
    console.log('🎉 All authentication tests passed successfully!');
    console.log('');
    console.log('📋 Available Endpoints:');
    console.log('   POST /api/auth/register - User registration');
    console.log('   POST /api/auth/login - User login');
    console.log('   GET /api/auth/profile - Get user profile (protected)');
    console.log('   PUT /api/auth/profile - Update user profile (protected)');
    console.log('   PUT /api/auth/change-password - Change password (protected)');
    console.log('   POST /api/auth/logout - User logout (protected)');
    console.log('   POST /api/auth/refresh-token - Refresh access token');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.response?.data) {
      console.log('📝 Error details:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

// Run tests
testAuthenticationFlow();
