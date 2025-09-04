// Test setup for backend tests

// Increase timeout for integration tests
jest.setTimeout(30000);

// Mock console methods to reduce noise during tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock process.env for tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.API_PORT = '5001'; // Use different port for tests

// Global test utilities
global.testUtils = {
  // Helper to create test user
  createTestUser: () => ({
    firstName: 'Test',
    lastName: 'User',
    email: `test${Date.now()}@example.com`,
    phone: '+91-9876543210',
    password: 'testPassword123'
  }),

  // Helper to create test booking data
  createTestBooking: () => ({
    sourceStation: {
      id: '1',
      name: 'Mumbai Central',
      code: 'MUM',
      type: 'railway'
    },
    destinationStation: {
      id: '2',
      name: 'New Delhi',
      code: 'DEL',
      type: 'railway'
    },
    distance: 1384,
    pricing: {
      basePrice: 500,
      distancePrice: 692,
      serviceFee: 50,
      taxes: 124.16,
      totalAmount: 1366.16
    },
    securityItems: [
      {
        id: 'item_1',
        name: 'Laptop',
        category: 'Electronics',
        estimatedValue: 50000
      }
    ],
    contactInfo: {
      phone: '+91-9876543211',
      alternatePhone: '+91-9876543212',
      address: {
        street: '123 Test Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      },
      emergencyContact: {
        name: 'John Smith',
        phone: '+91-9876543213',
        address: {
          street: '456 Emergency Street',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110001'
        }
      }
    },
    luggageImages: [
      {
        angle: 'front',
        url: 'mock://image1.jpg',
        size: 1024000,
        type: 'image/jpeg'
      },
      {
        angle: 'back',
        url: 'mock://image2.jpg',
        size: 1024000,
        type: 'image/jpeg'
      },
      {
        angle: 'left',
        url: 'mock://image3.jpg',
        size: 1024000,
        type: 'image/jpeg'
      },
      {
        angle: 'right',
        url: 'mock://image4.jpg',
        size: 1024000,
        type: 'image/jpeg'
      }
    ],
    paymentMethod: 'credit_card'
  }),

  // Helper to generate random booking ID
  generateBookingId: () => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `TL${date}${random}`;
  },

  // Helper to wait for async operations
  delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

  // Helper to validate email format
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Helper to validate phone format
  isValidPhone: (phone) => {
    const phoneRegex = /^\+91-\d{10}$/;
    return phoneRegex.test(phone);
  }
};

// Setup and teardown
beforeAll(async () => {
  // Any global setup needed before all tests
});

afterAll(async () => {
  // Any global cleanup needed after all tests
});

beforeEach(() => {
  // Reset any global state before each test
  jest.clearAllMocks();
});

afterEach(() => {
  // Clean up after each test
});
