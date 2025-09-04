// Custom Cypress commands

// Command to clear local storage and session storage
Cypress.Commands.add('clearStorage', () => {
  cy.clearLocalStorage();
  cy.clearCookies();
  cy.window().then((win) => {
    win.sessionStorage.clear();
  });
});

// Command to set authentication token
Cypress.Commands.add('setAuthToken', (token) => {
  cy.window().then((win) => {
    win.localStorage.setItem('token', token);
    win.localStorage.setItem('user', JSON.stringify({
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User'
    }));
  });
});

// Command to check if element is in viewport
Cypress.Commands.add('isInViewport', { prevSubject: true }, (subject) => {
  const bottom = Cypress.$(cy.state('window')).height();
  const right = Cypress.$(cy.state('window')).width();
  const rect = subject[0].getBoundingClientRect();

  expect(rect.top).to.be.lessThan(bottom);
  expect(rect.bottom).to.be.greaterThan(0);
  expect(rect.right).to.be.greaterThan(0);
  expect(rect.left).to.be.lessThan(right);

  return subject;
});

// Command to wait for element to be stable (stop moving)
Cypress.Commands.add('waitForStable', { prevSubject: true }, (subject, timeout = 1000) => {
  let previousPosition = null;
  
  return cy.wrap(subject).then(($el) => {
    return new Cypress.Promise((resolve) => {
      const checkStability = () => {
        const currentPosition = $el[0].getBoundingClientRect();
        
        if (previousPosition && 
            currentPosition.top === previousPosition.top && 
            currentPosition.left === previousPosition.left) {
          resolve($el);
        } else {
          previousPosition = currentPosition;
          setTimeout(checkStability, 100);
        }
      };
      
      setTimeout(() => resolve($el), timeout); // Fallback timeout
      checkStability();
    });
  });
});

// Command to drag and drop elements
Cypress.Commands.add('dragAndDrop', (dragSelector, dropSelector) => {
  cy.get(dragSelector).should('be.visible');
  cy.get(dropSelector).should('be.visible');
  
  cy.get(dragSelector).trigger('mousedown', { which: 1 });
  cy.get(dropSelector).trigger('mousemove').trigger('mouseup');
});

// Command to type with realistic delays
Cypress.Commands.add('typeRealistic', { prevSubject: true }, (subject, text, options = {}) => {
  const delay = options.delay || 100;
  
  cy.wrap(subject).then(($el) => {
    for (let i = 0; i < text.length; i++) {
      cy.wrap($el).type(text[i], { delay });
    }
  });
});

// Command to scroll element into view smoothly
Cypress.Commands.add('scrollIntoViewSmooth', { prevSubject: true }, (subject) => {
  cy.wrap(subject).then(($el) => {
    $el[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
  return cy.wrap(subject);
});

// Command to wait for animation to complete
Cypress.Commands.add('waitForAnimation', { prevSubject: true }, (subject, duration = 1000) => {
  cy.wrap(subject).should('be.visible');
  cy.wait(duration);
  return cy.wrap(subject);
});

// Command to check loading states
Cypress.Commands.add('shouldBeLoading', { prevSubject: true }, (subject) => {
  cy.wrap(subject).should('have.attr', 'disabled');
  cy.wrap(subject).find('[data-testid="loader-icon"]').should('be.visible');
  return cy.wrap(subject);
});

Cypress.Commands.add('shouldNotBeLoading', { prevSubject: true }, (subject) => {
  cy.wrap(subject).should('not.have.attr', 'disabled');
  cy.wrap(subject).find('[data-testid="loader-icon"]').should('not.exist');
  return cy.wrap(subject);
});

// Command to verify toast notifications
Cypress.Commands.add('verifyToast', (type, message) => {
  cy.get(`[data-testid="${type}-toast"]`).should('be.visible');
  if (message) {
    cy.get(`[data-testid="${type}-toast"]`).should('contain', message);
  }
});

// Command to dismiss toast
Cypress.Commands.add('dismissToast', (type) => {
  cy.get(`[data-testid="${type}-toast"] [data-testid="close-icon"]`).click();
  cy.get(`[data-testid="${type}-toast"]`).should('not.exist');
});

// Command to check form validation
Cypress.Commands.add('checkFormValidation', (fieldSelector, errorMessage) => {
  cy.get(fieldSelector).focus().blur();
  cy.get(`${fieldSelector}-error`).should('be.visible').and('contain', errorMessage);
});

// Command to fill form field with validation check
Cypress.Commands.add('fillFieldWithValidation', (fieldSelector, value, shouldBeValid = true) => {
  cy.get(fieldSelector).clear().type(value);
  
  if (shouldBeValid) {
    cy.get(`${fieldSelector}-error`).should('not.exist');
    cy.get(fieldSelector).should('not.have.class', 'error');
  } else {
    cy.get(`${fieldSelector}-error`).should('be.visible');
    cy.get(fieldSelector).should('have.class', 'error');
  }
});

// Command to test responsive behavior
Cypress.Commands.add('testResponsive', (callback) => {
  const viewports = [
    { width: 375, height: 667, name: 'mobile' },
    { width: 768, height: 1024, name: 'tablet' },
    { width: 1280, height: 720, name: 'desktop' }
  ];
  
  viewports.forEach(viewport => {
    cy.viewport(viewport.width, viewport.height);
    callback(viewport);
  });
});

// Command to simulate slow network
Cypress.Commands.add('simulateSlowNetwork', () => {
  cy.intercept('**/*', (req) => {
    req.reply((res) => {
      // Add delay to simulate slow network
      return new Promise(resolve => {
        setTimeout(() => resolve(res), 2000);
      });
    });
  });
});

// Command to check page performance
Cypress.Commands.add('checkPagePerformance', (thresholds = {}) => {
  const defaultThresholds = {
    loadTime: 3000,
    domContentLoaded: 2000,
    firstContentfulPaint: 1500
  };
  
  const finalThresholds = { ...defaultThresholds, ...thresholds };
  
  cy.window().then((win) => {
    const perfData = win.performance.getEntriesByType('navigation')[0];
    
    expect(perfData.loadEventEnd - perfData.navigationStart)
      .to.be.lessThan(finalThresholds.loadTime);
    expect(perfData.domContentLoadedEventEnd - perfData.navigationStart)
      .to.be.lessThan(finalThresholds.domContentLoaded);
  });
});
