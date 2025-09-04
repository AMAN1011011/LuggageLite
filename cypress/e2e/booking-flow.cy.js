describe('TravelLite Booking Flow E2E Tests', () => {
  beforeEach(() => {
    cy.clearStorage();
    cy.visit('/');
  });

  describe('User Registration and Authentication', () => {
    it('should allow new user registration and login', () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: `test${Date.now()}@example.com`,
        phone: '+91-9876543210',
        password: 'testPassword123'
      };

      // Navigate to booking page (should prompt for auth)
      cy.get('[href="#booking"]').click();
      cy.url().should('include', '#booking');
      
      // Should show auth modal
      cy.get('[data-testid="auth-modal"]').should('be.visible');
      
      // Register new user
      cy.registerUser(userData);
      
      // Should be redirected to booking page
      cy.url().should('include', '#booking');
      cy.get('[data-testid="booking-step-1"]').should('be.visible');
      
      // User should be authenticated
      cy.get('[data-testid="user-profile"]').should('contain', userData.firstName);
    });

    it('should allow existing user login', () => {
      // First register a user
      const userData = {
        email: 'existing@example.com',
        password: 'testPassword123'
      };
      
      cy.visit('/#booking');
      cy.registerUser(userData);
      
      // Logout
      cy.get('[data-testid="logout-button"]').click();
      cy.clearStorage();
      
      // Login with existing credentials
      cy.visit('/#booking');
      cy.loginUser(userData.email, userData.password);
      
      // Should be on booking page
      cy.url().should('include', '#booking');
      cy.get('[data-testid="booking-step-1"]').should('be.visible');
    });

    it('should handle invalid login credentials', () => {
      cy.visit('/#booking');
      
      cy.get('[data-testid="login-tab"]').click();
      cy.get('[data-testid="email-input"]').type('invalid@example.com');
      cy.get('[data-testid="password-input"]').type('wrongpassword');
      cy.get('[data-testid="login-button"]').click();
      
      // Should show error message
      cy.verifyToast('error', 'Invalid credentials');
      
      // Should remain on auth modal
      cy.get('[data-testid="auth-modal"]').should('be.visible');
    });
  });

  describe('Complete Booking Flow', () => {
    beforeEach(() => {
      // Register and login user before each booking test
      cy.registerUser();
    });

    it('should complete full booking flow successfully', () => {
      // Step 1: Station Selection and Pricing
      cy.get('[data-testid="step-indicator"]').should('contain', 'Station & Pricing');
      
      cy.selectStations('Mumbai', 'Delhi');
      
      // Verify pricing is displayed
      cy.get('[data-testid="pricing-display"]').should('be.visible');
      cy.get('[data-testid="total-amount"]').should('contain', '₹');
      
      cy.get('[data-testid="continue-button"]').click();
      
      // Step 2: Security Checklist
      cy.get('[data-testid="step-indicator"]').should('contain', 'Security Checklist');
      
      // Select some security items
      cy.get('[data-testid="security-item"]').first().click();
      cy.get('[data-testid="security-item"]').eq(1).click();
      
      cy.get('[data-testid="continue-button"]').click();
      
      // Step 3: Contact Information
      cy.get('[data-testid="step-indicator"]').should('contain', 'Contact Information');
      
      cy.fillContactInfo();
      
      cy.get('[data-testid="continue-button"]').click();
      
      // Step 4: Luggage Photos
      cy.get('[data-testid="step-indicator"]').should('contain', 'Luggage Photos');
      
      cy.uploadLuggageImages();
      
      // Verify all images are uploaded
      ['front', 'back', 'left', 'right'].forEach(angle => {
        cy.get(`[data-testid="${angle}-upload-preview"]`).should('be.visible');
      });
      
      cy.get('[data-testid="continue-button"]').click();
      
      // Step 5: Booking Confirmation
      cy.get('[data-testid="step-indicator"]').should('contain', 'Confirmation');
      
      // Verify booking summary
      cy.get('[data-testid="booking-summary"]').should('be.visible');
      cy.get('[data-testid="source-station"]').should('contain', 'Mumbai');
      cy.get('[data-testid="destination-station"]').should('contain', 'Delhi');
      cy.get('[data-testid="total-amount"]').should('contain', '₹');
      
      // Complete payment
      cy.get('[data-testid="pay-button"]').click();
      
      // Verify booking success
      cy.get('[data-testid="booking-success"]').should('be.visible');
      cy.get('[data-testid="booking-id"]').should('match', /TL\d{8}[A-Z]{2,4}/);
      
      // Verify confirmation details
      cy.get('[data-testid="confirmation-email"]').should('be.visible');
      cy.get('[data-testid="confirmation-sms"]').should('be.visible');
    });

    it('should validate required fields in each step', () => {
      // Step 1: Try to continue without selecting stations
      cy.get('[data-testid="continue-button"]').should('be.disabled');
      
      // Select only source station
      cy.get('[data-testid="from-station-input"]').type('Mumbai');
      cy.get('[data-testid="station-option"]').contains('Mumbai').click();
      cy.get('[data-testid="continue-button"]').should('be.disabled');
      
      // Complete station selection
      cy.get('[data-testid="to-station-input"]').type('Delhi');
      cy.get('[data-testid="station-option"]').contains('Delhi').click();
      cy.get('[data-testid="continue-button"]').should('be.enabled');
      
      cy.get('[data-testid="continue-button"]').click();
      
      // Step 2: Security checklist (optional, should allow continue)
      cy.get('[data-testid="continue-button"]').should('be.enabled');
      cy.get('[data-testid="continue-button"]').click();
      
      // Step 3: Contact information validation
      cy.get('[data-testid="continue-button"]').should('be.disabled');
      
      // Fill required fields one by one
      cy.get('[data-testid="phone-input"]').type('+91-9876543210');
      cy.get('[data-testid="continue-button"]').should('be.disabled');
      
      cy.get('[data-testid="address-input"]').type('123 Test Street');
      cy.get('[data-testid="continue-button"]').should('be.disabled');
      
      cy.get('[data-testid="city-input"]').type('Mumbai');
      cy.get('[data-testid="continue-button"]').should('be.disabled');
      
      cy.get('[data-testid="state-input"]').type('Maharashtra');
      cy.get('[data-testid="continue-button"]').should('be.disabled');
      
      cy.get('[data-testid="pincode-input"]').type('400001');
      cy.get('[data-testid="continue-button"]').should('be.disabled');
      
      cy.get('[data-testid="emergency-name-input"]').type('Emergency Contact');
      cy.get('[data-testid="continue-button"]').should('be.disabled');
      
      cy.get('[data-testid="emergency-phone-input"]').type('+91-9876543211');
      cy.get('[data-testid="continue-button"]').should('be.enabled');
      
      cy.get('[data-testid="continue-button"]').click();
      
      // Step 4: Image upload validation
      cy.get('[data-testid="continue-button"]').should('be.disabled');
      
      // Upload images one by one
      cy.fixture('test-image.jpg', 'base64').then((fileContent) => {
        const blob = Cypress.Blob.base64StringToBlob(fileContent, 'image/jpeg');
        const file = new File([blob], 'test-image.jpg', { type: 'image/jpeg' });
        
        // Upload 3 images (should still be disabled)
        ['front', 'back', 'left'].forEach(angle => {
          cy.get(`[data-testid="${angle}-upload-input"]`).selectFile(file, { force: true });
        });
        
        cy.get('[data-testid="continue-button"]').should('be.disabled');
        
        // Upload 4th image (should enable continue)
        cy.get('[data-testid="right-upload-input"]').selectFile(file, { force: true });
        cy.get('[data-testid="continue-button"]').should('be.enabled');
      });
    });

    it('should handle API errors gracefully', () => {
      // Mock API failure for pricing
      cy.intercept('POST', '**/api/pricing/calculate', {
        statusCode: 500,
        body: { success: false, message: 'Pricing service unavailable' }
      }).as('pricingError');
      
      cy.selectStations('Mumbai', 'Delhi');
      
      // Should show error message
      cy.verifyToast('error', 'Pricing service unavailable');
      
      // Continue button should be disabled
      cy.get('[data-testid="continue-button"]').should('be.disabled');
      
      // Mock successful retry
      cy.intercept('POST', '**/api/pricing/calculate', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            pricing: {
              basePrice: 500,
              distancePrice: 692,
              serviceFee: 50,
              taxes: 124.16,
              totalAmount: 1366.16
            }
          }
        }
      }).as('pricingSuccess');
      
      // Retry pricing calculation
      cy.get('[data-testid="retry-pricing"]').click();
      cy.wait('@pricingSuccess');
      
      // Should now show pricing and enable continue
      cy.get('[data-testid="pricing-display"]').should('be.visible');
      cy.get('[data-testid="continue-button"]').should('be.enabled');
    });
  });

  describe('Staff Counter Interface', () => {
    it('should allow staff login and booking lookup', () => {
      cy.visit('/#counter');
      
      // Staff login
      cy.get('[data-testid="staff-email-input"]').type('rajesh@travellite.com');
      cy.get('[data-testid="staff-password-input"]').type('staff123');
      cy.get('[data-testid="staff-login-button"]').click();
      
      // Should show dashboard
      cy.get('[data-testid="counter-dashboard"]').should('be.visible');
      cy.get('[data-testid="dashboard-stats"]').should('be.visible');
      
      // Lookup booking
      cy.get('[data-testid="booking-lookup-input"]').type('TL20241201ABCD');
      cy.get('[data-testid="lookup-button"]').click();
      
      // Should show booking details
      cy.get('[data-testid="booking-details"]').should('be.visible');
      cy.get('[data-testid="accept-luggage-button"]').should('be.visible');
    });

    it('should handle luggage acceptance workflow', () => {
      // Login as staff
      cy.visit('/#counter');
      cy.get('[data-testid="staff-email-input"]').type('rajesh@travellite.com');
      cy.get('[data-testid="staff-password-input"]').type('staff123');
      cy.get('[data-testid="staff-login-button"]').click();
      
      // Lookup and accept luggage
      cy.get('[data-testid="booking-lookup-input"]').type('TL20241201ABCD');
      cy.get('[data-testid="lookup-button"]').click();
      cy.get('[data-testid="accept-luggage-button"]').click();
      
      // Fill acceptance form
      cy.get('[data-testid="verification-notes"]').type('Luggage verified and accepted');
      cy.get('[data-testid="actual-weight"]').type('15.5');
      cy.get('[data-testid="actual-dimensions"]').type('60x40x25');
      
      cy.get('[data-testid="confirm-acceptance"]').click();
      
      // Should show success message
      cy.verifyToast('success', 'Luggage accepted successfully');
      
      // Booking status should be updated
      cy.get('[data-testid="booking-status"]').should('contain', 'Luggage Collected');
    });
  });

  describe('Responsive Design and Accessibility', () => {
    beforeEach(() => {
      cy.registerUser();
    });

    it('should work on mobile devices', () => {
      cy.setMobileViewport();
      
      // Test mobile navigation
      cy.get('[data-testid="mobile-menu-button"]').click();
      cy.get('[data-testid="mobile-menu"]').should('be.visible');
      cy.get('[data-testid="mobile-menu"] [href="#booking"]').click();
      
      // Complete booking flow on mobile
      cy.selectStations();
      cy.get('[data-testid="continue-button"]').click();
      
      // Verify mobile-specific UI elements
      cy.get('[data-testid="mobile-step-indicator"]').should('be.visible');
      cy.get('[data-testid="mobile-continue-button"]').should('be.visible');
    });

    it('should be accessible', () => {
      cy.checkA11y();
      
      // Test keyboard navigation
      cy.get('body').tab();
      cy.focused().should('have.attr', 'href', '#home');
      
      cy.focused().tab();
      cy.focused().should('have.attr', 'href', '#booking');
      
      // Test screen reader support
      cy.get('[data-testid="booking-form"]').should('have.attr', 'role', 'form');
      cy.get('[data-testid="step-indicator"]').should('have.attr', 'aria-label');
    });

    it('should support dark mode', () => {
      cy.toggleDarkMode();
      
      // Verify dark mode classes
      cy.get('html').should('have.class', 'dark');
      cy.get('body').should('have.class', 'dark:bg-gray-900');
      
      // Complete booking in dark mode
      cy.selectStations();
      cy.get('[data-testid="pricing-display"]').should('be.visible');
      
      // Toggle back to light mode
      cy.toggleDarkMode();
      cy.get('html').should('not.have.class', 'dark');
    });
  });

  describe('Performance and Error Handling', () => {
    it('should load quickly and handle slow networks', () => {
      cy.checkPagePerformance({
        loadTime: 3000,
        domContentLoaded: 2000
      });
      
      // Test with slow network
      cy.simulateSlowNetwork();
      cy.visit('/');
      
      // Should show loading states
      cy.get('[data-testid="page-loader"]').should('be.visible');
      
      // Should eventually load
      cy.get('[data-testid="home-page"]').should('be.visible', { timeout: 10000 });
    });

    it('should handle network failures gracefully', () => {
      cy.registerUser();
      
      // Mock network failure
      cy.intercept('**/*', { forceNetworkError: true }).as('networkError');
      
      cy.selectStations();
      
      // Should show network error
      cy.verifyToast('error', 'Network error');
      
      // Should provide retry option
      cy.get('[data-testid="retry-button"]').should('be.visible');
    });

    it('should maintain state during navigation', () => {
      cy.registerUser();
      
      // Fill some form data
      cy.selectStations();
      cy.get('[data-testid="continue-button"]').click();
      
      // Navigate away and back
      cy.get('[href="#home"]').click();
      cy.get('[href="#booking"]').click();
      
      // Should maintain form state
      cy.get('[data-testid="from-station"]').should('contain', 'Mumbai');
      cy.get('[data-testid="to-station"]').should('contain', 'Delhi');
      cy.get('[data-testid="current-step"]').should('contain', '2');
    });
  });
});
