import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from '../App';
import { ToastProvider } from '../components/ui/Toast';

// Mock fetch for API calls
global.fetch = jest.fn();

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef(({ children, ...props }, ref) => (
      <div ref={ref} {...props}>
        {children}
      </div>
    )),
    button: React.forwardRef(({ children, ...props }, ref) => (
      <button ref={ref} {...props}>
        {children}
      </button>
    )),
    h1: React.forwardRef(({ children, ...props }, ref) => (
      <h1 ref={ref} {...props}>
        {children}
      </h1>
    )),
    p: React.forwardRef(({ children, ...props }, ref) => (
      <p ref={ref} {...props}>
        {children}
      </p>
    )),
  },
  AnimatePresence: ({ children }) => children,
}));

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  ArrowRight: () => <span data-testid="arrow-right">→</span>,
  Package: () => <span data-testid="package-icon">📦</span>,
  Shield: () => <span data-testid="shield-icon">🛡</span>,
  Clock: () => <span data-testid="clock-icon">⏰</span>,
  MapPin: () => <span data-testid="mappin-icon">📍</span>,
  Users: () => <span data-testid="users-icon">👥</span>,
  Truck: () => <span data-testid="truck-icon">🚛</span>,
  CheckCircle: () => <span data-testid="check-icon">✓</span>,
  XCircle: () => <span data-testid="error-icon">✗</span>,
  AlertCircle: () => <span data-testid="warning-icon">⚠</span>,
  Info: () => <span data-testid="info-icon">ℹ</span>,
  X: () => <span data-testid="close-icon">×</span>,
  Calculator: () => <span data-testid="calculator-icon">🧮</span>,
  Phone: () => <span data-testid="phone-icon">📞</span>,
  Camera: () => <span data-testid="camera-icon">📷</span>,
  CreditCard: () => <span data-testid="credit-card-icon">💳</span>,
  Menu: () => <span data-testid="menu-icon">☰</span>,
  Sun: () => <span data-testid="sun-icon">☀</span>,
  Moon: () => <span data-testid="moon-icon">🌙</span>,
  User: () => <span data-testid="user-icon">👤</span>,
  Loader2: () => <span data-testid="loader-icon">⟳</span>,
}));

// Mock API responses
const mockApiResponses = {
  '/api/auth/register': {
    success: true,
    message: 'User registered successfully',
    data: {
      user: { id: '1', email: 'test@example.com', firstName: 'Test', lastName: 'User' },
      token: 'mock-jwt-token'
    }
  },
  '/api/auth/login': {
    success: true,
    message: 'Login successful',
    data: {
      user: { id: '1', email: 'test@example.com', firstName: 'Test', lastName: 'User' },
      token: 'mock-jwt-token'
    }
  },
  '/api/auth/profile': {
    success: true,
    data: {
      user: { id: '1', email: 'test@example.com', firstName: 'Test', lastName: 'User' }
    }
  },
  '/api/stations/popular': {
    success: true,
    data: {
      stations: [
        { id: '1', name: 'Mumbai Central', code: 'MUM', type: 'railway', city: 'Mumbai' },
        { id: '2', name: 'New Delhi', code: 'DEL', type: 'railway', city: 'Delhi' },
        { id: '3', name: 'Bengaluru City', code: 'BNG', type: 'railway', city: 'Bengaluru' }
      ]
    }
  },
  '/api/stations/distance/1/2': {
    success: true,
    data: {
      distance: 1384,
      sourceStation: { id: '1', name: 'Mumbai Central' },
      destinationStation: { id: '2', name: 'New Delhi' },
      estimatedTime: '16-20 hours'
    }
  },
  '/api/pricing/calculate': {
    success: true,
    data: {
      pricing: {
        basePrice: 500,
        distancePrice: 692,
        serviceFee: 50,
        taxes: 124.16,
        totalAmount: 1366.16,
        breakdown: {
          basePrice: 500,
          distancePrice: 692,
          serviceFee: 50,
          taxes: 124.16
        }
      }
    }
  },
  '/api/checklist/categories': {
    success: true,
    data: {
      categories: [
        { id: 'cat_1', name: 'Electronics', icon: 'Laptop' },
        { id: 'cat_2', name: 'Jewelry', icon: 'Diamond' },
        { id: 'cat_3', name: 'Documents', icon: 'FileText' }
      ]
    }
  },
  '/api/checklist/popular': {
    success: true,
    data: {
      items: [
        { id: 'item_1', name: 'Laptop', category: 'Electronics', estimatedValue: 50000 },
        { id: 'item_2', name: 'Mobile Phone', category: 'Electronics', estimatedValue: 25000 }
      ]
    }
  },
  '/api/checklist/categories/cat_1/items': {
    success: true,
    data: {
      items: [
        { id: 'item_1', name: 'Laptop', category: 'Electronics', estimatedValue: 50000 },
        { id: 'item_3', name: 'Tablet', category: 'Electronics', estimatedValue: 30000 }
      ]
    }
  },
  '/api/booking': {
    success: true,
    message: 'Booking created successfully',
    data: {
      booking: {
        bookingId: 'TL20241201ABCD',
        status: 'pending_payment',
        totalAmount: 1366.16
      }
    }
  }
};

// Setup fetch mock
const setupFetchMock = () => {
  fetch.mockImplementation((url, options) => {
    // Use environment variable for base URL
    const baseUrl = import.meta.env.VITE_API_URL;
    const endpoint = url.replace(baseUrl, '');
    const response = mockApiResponses[endpoint];
    
    if (response) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(response),
      });
    }
    
    return Promise.resolve({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ success: false, message: 'Not found' }),
    });
  });
};

describe('Booking Flow Integration', () => {
  beforeEach(() => {
    setupFetchMock();
    // Mock localStorage
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    global.localStorage = localStorageMock;
    
    // Mock window.location.hash
    delete window.location;
    window.location = { hash: '#home' };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('completes full booking flow for authenticated user', async () => {
    const user = userEvent.setup();
    
    // Mock authenticated state
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'token') return 'mock-jwt-token';
      if (key === 'user') return JSON.stringify({ 
        id: '1', 
        email: 'test@example.com', 
        firstName: 'Test', 
        lastName: 'User' 
      });
      return null;
    });

    render(<App />);

    // Navigate to booking page
    window.location.hash = '#booking';
    
    // Re-render to trigger hash change
    render(<App />);

    // Wait for the booking page to load
    await waitFor(() => {
      expect(screen.getByText(/Station & Pricing/)).toBeInTheDocument();
    });

    // Step 1: Select stations and get pricing
    const fromStationInput = screen.getByPlaceholderText(/from station/i);
    await user.type(fromStationInput, 'Mumbai');
    
    // Wait for and select Mumbai Central
    await waitFor(() => {
      expect(screen.getByText('Mumbai Central')).toBeInTheDocument();
    });
    await user.click(screen.getByText('Mumbai Central'));

    const toStationInput = screen.getByPlaceholderText(/to station/i);
    await user.type(toStationInput, 'Delhi');
    
    // Wait for and select New Delhi
    await waitFor(() => {
      expect(screen.getByText('New Delhi')).toBeInTheDocument();
    });
    await user.click(screen.getByText('New Delhi'));

    // Wait for pricing to load and continue
    await waitFor(() => {
      expect(screen.getByText(/₹1,366.16/)).toBeInTheDocument();
    });
    
    const continueButton = screen.getByText(/Continue to Security Checklist/);
    await user.click(continueButton);

    // Step 2: Security Checklist
    await waitFor(() => {
      expect(screen.getByText(/Security Checklist/)).toBeInTheDocument();
    });

    // Select an item from the checklist
    const laptopCheckbox = screen.getByLabelText(/Laptop/);
    await user.click(laptopCheckbox);

    const continueToContactButton = screen.getByText(/Continue to Contact Information/);
    await user.click(continueToContactButton);

    // Step 3: Contact Information
    await waitFor(() => {
      expect(screen.getByText(/Contact Information/)).toBeInTheDocument();
    });

    // Fill contact form
    const phoneInput = screen.getByLabelText(/Phone Number/);
    await user.type(phoneInput, '+91-9876543210');

    const addressInput = screen.getByLabelText(/Street Address/);
    await user.type(addressInput, '123 Test Street');

    const cityInput = screen.getByLabelText(/City/);
    await user.type(cityInput, 'Mumbai');

    const stateInput = screen.getByLabelText(/State/);
    await user.type(stateInput, 'Maharashtra');

    const pincodeInput = screen.getByLabelText(/Pincode/);
    await user.type(pincodeInput, '400001');

    // Emergency contact
    const emergencyNameInput = screen.getByLabelText(/Emergency Contact Name/);
    await user.type(emergencyNameInput, 'Emergency Contact');

    const emergencyPhoneInput = screen.getByLabelText(/Emergency Contact Phone/);
    await user.type(emergencyPhoneInput, '+91-9876543211');

    const continueToPhotosButton = screen.getByText(/Continue to Luggage Photos/);
    await user.click(continueToPhotosButton);

    // Step 4: Luggage Photos
    await waitFor(() => {
      expect(screen.getByText(/Luggage Photos/)).toBeInTheDocument();
    });

    // Mock file upload for all 4 angles
    const frontUpload = screen.getByLabelText(/Front View/);
    const backUpload = screen.getByLabelText(/Back View/);
    const leftUpload = screen.getByLabelText(/Left View/);
    const rightUpload = screen.getByLabelText(/Right View/);

    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    await user.upload(frontUpload, mockFile);
    await user.upload(backUpload, mockFile);
    await user.upload(leftUpload, mockFile);
    await user.upload(rightUpload, mockFile);

    // Wait for uploads to complete
    await waitFor(() => {
      expect(screen.getByText(/Review & Pay/)).toBeInTheDocument();
    });

    const reviewPayButton = screen.getByText(/Review & Pay/);
    await user.click(reviewPayButton);

    // Step 5: Booking Confirmation
    await waitFor(() => {
      expect(screen.getByText(/Booking Confirmation/)).toBeInTheDocument();
    });

    // Verify booking details are displayed
    expect(screen.getByText(/Mumbai Central/)).toBeInTheDocument();
    expect(screen.getByText(/New Delhi/)).toBeInTheDocument();
    expect(screen.getByText(/₹1,366.16/)).toBeInTheDocument();

    // Complete payment
    const payNowButton = screen.getByText(/Pay Now/);
    await user.click(payNowButton);

    // Verify booking success
    await waitFor(() => {
      expect(screen.getByText(/Booking Successful/)).toBeInTheDocument();
      expect(screen.getByText(/TL20241201ABCD/)).toBeInTheDocument();
    });
  });

  it('requires authentication before allowing booking', async () => {
    const user = userEvent.setup();
    
    // Mock unauthenticated state
    localStorage.getItem.mockReturnValue(null);

    render(<App />);

    // Navigate to booking page
    window.location.hash = '#booking';
    render(<App />);

    // Should show authentication prompt
    await waitFor(() => {
      expect(screen.getByText(/Please log in to continue/)).toBeInTheDocument();
    });

    // Try to register
    const registerTab = screen.getByText(/Register/);
    await user.click(registerTab);

    const firstNameInput = screen.getByLabelText(/First Name/);
    await user.type(firstNameInput, 'Test');

    const lastNameInput = screen.getByLabelText(/Last Name/);
    await user.type(lastNameInput, 'User');

    const emailInput = screen.getByLabelText(/Email/);
    await user.type(emailInput, 'test@example.com');

    const phoneInput = screen.getByLabelText(/Phone/);
    await user.type(phoneInput, '+91-9876543210');

    const passwordInput = screen.getByLabelText(/Password/);
    await user.type(passwordInput, 'password123');

    const registerButton = screen.getByText(/Create Account/);
    await user.click(registerButton);

    // Should proceed to booking after successful registration
    await waitFor(() => {
      expect(screen.getByText(/Station & Pricing/)).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    const user = userEvent.setup();
    
    // Mock authenticated state
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'token') return 'mock-jwt-token';
      if (key === 'user') return JSON.stringify({ 
        id: '1', 
        email: 'test@example.com', 
        firstName: 'Test', 
        lastName: 'User' 
      });
      return null;
    });

    // Mock API failure for pricing
    fetch.mockImplementation((url) => {
      if (url.includes('/api/pricing/calculate')) {
        return Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ 
            success: false, 
            message: 'Pricing service unavailable' 
          }),
        });
      }
      
      const baseUrl = import.meta.env.VITE_API_URL;
      const endpoint = url.replace(baseUrl, '');
      const response = mockApiResponses[endpoint];
      
      if (response) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(response),
        });
      }
      
      return Promise.resolve({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ success: false, message: 'Not found' }),
      });
    });

    render(<App />);

    // Navigate to booking page
    window.location.hash = '#booking';
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Station & Pricing/)).toBeInTheDocument();
    });

    // Try to select stations
    const fromStationInput = screen.getByPlaceholderText(/from station/i);
    await user.type(fromStationInput, 'Mumbai');
    
    await waitFor(() => {
      expect(screen.getByText('Mumbai Central')).toBeInTheDocument();
    });
    await user.click(screen.getByText('Mumbai Central'));

    const toStationInput = screen.getByPlaceholderText(/to station/i);
    await user.type(toStationInput, 'Delhi');
    
    await waitFor(() => {
      expect(screen.getByText('New Delhi')).toBeInTheDocument();
    });
    await user.click(screen.getByText('New Delhi'));

    // Should show error message when pricing fails
    await waitFor(() => {
      expect(screen.getByText(/Pricing service unavailable/)).toBeInTheDocument();
    });

    // Continue button should be disabled
    const continueButton = screen.getByText(/Continue to Security Checklist/);
    expect(continueButton).toBeDisabled();
  });

  it('validates required fields in each step', async () => {
    const user = userEvent.setup();
    
    // Mock authenticated state
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'token') return 'mock-jwt-token';
      if (key === 'user') return JSON.stringify({ 
        id: '1', 
        email: 'test@example.com', 
        firstName: 'Test', 
        lastName: 'User' 
      });
      return null;
    });

    render(<App />);

    // Navigate to booking page
    window.location.hash = '#booking';
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Station & Pricing/)).toBeInTheDocument();
    });

    // Try to continue without selecting stations
    const continueButton = screen.getByText(/Continue to Security Checklist/);
    expect(continueButton).toBeDisabled();

    // Complete step 1 properly
    const fromStationInput = screen.getByPlaceholderText(/from station/i);
    await user.type(fromStationInput, 'Mumbai');
    
    await waitFor(() => {
      expect(screen.getByText('Mumbai Central')).toBeInTheDocument();
    });
    await user.click(screen.getByText('Mumbai Central'));

    const toStationInput = screen.getByPlaceholderText(/to station/i);
    await user.type(toStationInput, 'Delhi');
    
    await waitFor(() => {
      expect(screen.getByText('New Delhi')).toBeInTheDocument();
    });
    await user.click(screen.getByText('New Delhi'));

    await waitFor(() => {
      expect(continueButton).toBeEnabled();
    });
    
    await user.click(continueButton);

    // Step 2: Try to continue without selecting any items
    await waitFor(() => {
      expect(screen.getByText(/Security Checklist/)).toBeInTheDocument();
    });

    const continueToContactButton = screen.getByText(/Continue to Contact Information/);
    expect(continueToContactButton).toBeEnabled(); // Should allow empty checklist

    await user.click(continueToContactButton);

    // Step 3: Try to continue without filling required contact fields
    await waitFor(() => {
      expect(screen.getByText(/Contact Information/)).toBeInTheDocument();
    });

    const continueToPhotosButton = screen.getByText(/Continue to Luggage Photos/);
    expect(continueToPhotosButton).toBeDisabled(); // Should be disabled without required fields

    // Fill required fields
    const phoneInput = screen.getByLabelText(/Phone Number/);
    await user.type(phoneInput, '+91-9876543210');

    const addressInput = screen.getByLabelText(/Street Address/);
    await user.type(addressInput, '123 Test Street');

    await waitFor(() => {
      expect(continueToPhotosButton).toBeEnabled();
    });
  });
});
