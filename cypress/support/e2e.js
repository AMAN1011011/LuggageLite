// Cypress E2E support file

import './commands';
import '@cypress/code-coverage/support';

// Global configuration
Cypress.on('uncaught:exception', (err, runnable) => {
  // Prevent Cypress from failing on uncaught exceptions
  // Return false to prevent the error from failing the test
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  if (err.message.includes('Non-Error promise rejection captured')) {
    return false;
  }
  return true;
});

// Custom commands for common operations
Cypress.Commands.add('loginUser', (email = 'test@example.com', password = 'testPassword123') => {
  cy.visit('/#booking');
  cy.get('[data-testid="login-tab"]').click();
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="login-button"]').click();
  cy.url().should('include', '#booking');
});

Cypress.Commands.add('registerUser', (userData = {}) => {
  const defaultUser = {
    firstName: 'Test',
    lastName: 'User',
    email: `test${Date.now()}@example.com`,
    phone: '+91-9876543210',
    password: 'testPassword123'
  };
  
  const user = { ...defaultUser, ...userData };
  
  cy.visit('/#booking');
  cy.get('[data-testid="register-tab"]').click();
  cy.get('[data-testid="firstname-input"]').type(user.firstName);
  cy.get('[data-testid="lastname-input"]').type(user.lastName);
  cy.get('[data-testid="email-input"]').type(user.email);
  cy.get('[data-testid="phone-input"]').type(user.phone);
  cy.get('[data-testid="password-input"]').type(user.password);
  cy.get('[data-testid="register-button"]').click();
  cy.url().should('include', '#booking');
  
  return cy.wrap(user);
});

Cypress.Commands.add('selectStations', (from = 'Mumbai', to = 'Delhi') => {
  // Select source station
  cy.get('[data-testid="from-station-input"]').type(from);
  cy.get('[data-testid="station-option"]').contains(from).click();
  
  // Select destination station
  cy.get('[data-testid="to-station-input"]').type(to);
  cy.get('[data-testid="station-option"]').contains(to).click();
  
  // Wait for pricing to load
  cy.get('[data-testid="pricing-display"]').should('be.visible');
  cy.get('[data-testid="continue-button"]').should('be.enabled');
});

Cypress.Commands.add('fillContactInfo', (contactData = {}) => {
  const defaultContact = {
    phone: '+91-9876543210',
    address: '123 Test Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    emergencyName: 'Emergency Contact',
    emergencyPhone: '+91-9876543211'
  };
  
  const contact = { ...defaultContact, ...contactData };
  
  cy.get('[data-testid="phone-input"]').type(contact.phone);
  cy.get('[data-testid="address-input"]').type(contact.address);
  cy.get('[data-testid="city-input"]').type(contact.city);
  cy.get('[data-testid="state-input"]').type(contact.state);
  cy.get('[data-testid="pincode-input"]').type(contact.pincode);
  cy.get('[data-testid="emergency-name-input"]').type(contact.emergencyName);
  cy.get('[data-testid="emergency-phone-input"]').type(contact.emergencyPhone);
});

Cypress.Commands.add('uploadLuggageImages', () => {
  const fileName = 'test-image.jpg';
  
  // Create a test image file
  cy.fixture(fileName, 'base64').then((fileContent) => {
    const blob = Cypress.Blob.base64StringToBlob(fileContent, 'image/jpeg');
    const file = new File([blob], fileName, { type: 'image/jpeg' });
    
    // Upload to all 4 angles
    ['front', 'back', 'left', 'right'].forEach(angle => {
      cy.get(`[data-testid="${angle}-upload-input"]`).selectFile(file, { force: true });
      cy.get(`[data-testid="${angle}-upload-preview"]`).should('be.visible');
    });
  });
});

Cypress.Commands.add('completeBookingFlow', () => {
  // Step 1: Station selection and pricing
  cy.selectStations();
  cy.get('[data-testid="continue-button"]').click();
  
  // Step 2: Security checklist (optional)
  cy.get('[data-testid="security-item"]').first().click();
  cy.get('[data-testid="continue-button"]').click();
  
  // Step 3: Contact information
  cy.fillContactInfo();
  cy.get('[data-testid="continue-button"]').click();
  
  // Step 4: Luggage photos
  cy.uploadLuggageImages();
  cy.get('[data-testid="continue-button"]').click();
  
  // Step 5: Review and payment
  cy.get('[data-testid="booking-summary"]').should('be.visible');
  cy.get('[data-testid="pay-button"]').click();
  
  // Verify booking success
  cy.get('[data-testid="booking-success"]').should('be.visible');
  cy.get('[data-testid="booking-id"]').should('contain', 'TL');
});

Cypress.Commands.add('mockApiResponse', (method, url, response, statusCode = 200) => {
  cy.intercept(method, url, {
    statusCode,
    body: response
  }).as(`api${method}${url.replace(/[^a-zA-Z0-9]/g, '')}`);
});

Cypress.Commands.add('waitForApiCall', (alias) => {
  cy.wait(`@${alias}`);
});

// Dark mode toggle command
Cypress.Commands.add('toggleDarkMode', () => {
  cy.get('[data-testid="theme-toggle"]').click();
});

// Mobile viewport command
Cypress.Commands.add('setMobileViewport', () => {
  cy.viewport(375, 667);
});

// Desktop viewport command
Cypress.Commands.add('setDesktopViewport', () => {
  cy.viewport(1280, 720);
});

// Check accessibility
Cypress.Commands.add('checkA11y', () => {
  cy.injectAxe();
  cy.checkA11y();
});

// Take screenshot with timestamp
Cypress.Commands.add('screenshotWithTimestamp', (name) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  cy.screenshot(`${name}-${timestamp}`);
});
