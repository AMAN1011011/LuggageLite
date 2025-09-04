const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = 5000; // Use port 5000 to match frontend configuration

// Middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: 'Mock - Not Connected'
  });
});

// Mock authentication endpoints for testing frontend
app.post('/api/auth/register', (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;
  
  // Basic validation
  if (!firstName || !lastName || !email || !password || !phone) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }
  
  // Mock successful registration
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        _id: 'mock-user-id-123',
        firstName,
        lastName,
        email,
        phone,
        fullName: `${firstName} ${lastName}`,
        isActive: true,
        isEmailVerified: false,
        role: 'customer',
        createdAt: new Date().toISOString()
      },
      tokens: {
        accessToken: 'mock-access-token-123',
        refreshToken: 'mock-refresh-token-123'
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
  
  // Mock successful login
  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        _id: 'mock-user-id-123',
        firstName: 'John',
        lastName: 'Doe',
        email,
        phone: '9876543210',
        fullName: 'John Doe',
        isActive: true,
        isEmailVerified: false,
        role: 'customer',
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString()
      },
      tokens: {
        accessToken: 'mock-access-token-123',
        refreshToken: 'mock-refresh-token-123'
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
  
  // Mock profile response
  res.status(200).json({
    success: true,
    data: {
      user: {
        _id: 'mock-user-id-123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '9876543210',
        fullName: 'John Doe',
        isActive: true,
        isEmailVerified: false,
        role: 'customer',
        address: {
          street: '123 Test Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          country: 'India'
        },
        createdAt: new Date().toISOString()
      }
    }
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 TravelLite Mock API Server running on port ${PORT}`);
  console.log(`📱 Frontend URL: http://localhost:5173`);
  console.log(`🌍 Environment: development (mock mode)`);
  console.log('');
  console.log('📋 Available Mock Endpoints:');
  console.log('   GET /api/health - Health check');
  console.log('   POST /api/auth/register - User registration');
  console.log('   POST /api/auth/login - User login');
  console.log('   GET /api/auth/profile - Get user profile');
  console.log('   POST /api/auth/logout - User logout');
});

module.exports = app;
