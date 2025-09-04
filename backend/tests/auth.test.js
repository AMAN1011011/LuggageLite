const request = require('supertest');
const app = require('../api-server');

describe('Authentication API', () => {
  let testUserToken;
  const testUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.test@example.com',
    phone: '+91-9876543210',
    password: 'testPassword123'
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.token).toBeDefined();
    });

    it('should not register user with existing email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User already exists');
    });

    it('should not register user with invalid email', async () => {
      const invalidUser = { ...testUser, email: 'invalid-email' };
      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should not register user with missing required fields', async () => {
      const incompleteUser = { email: 'test@example.com' };
      const response = await request(app)
        .post('/api/auth/register')
        .send(incompleteUser)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('All fields are required');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeAll(async () => {
      // Ensure user exists for login tests
      await request(app)
        .post('/api/auth/register')
        .send({
          ...testUser,
          email: 'login.test@example.com'
        });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login.test@example.com',
          password: testUser.password
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.data.token).toBeDefined();
      testUserToken = response.body.data.token;
    });

    it('should not login with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: testUser.password
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should not login with invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login.test@example.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should not login with missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Email and password are required');
    });
  });

  describe('GET /api/auth/profile', () => {
    it('should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${testUserToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('login.test@example.com');
    });

    it('should not get profile without token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access token required');
    });

    it('should not get profile with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid_token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid token');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully with valid token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${testUserToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Logout successful');
    });

    it('should not logout without token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});

describe('Staff Authentication API', () => {
  let staffToken;

  describe('POST /api/counter/auth/login', () => {
    it('should login staff with valid credentials', async () => {
      const response = await request(app)
        .post('/api/counter/auth/login')
        .send({
          email: 'rajesh@travellite.com',
          password: 'staff123'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.staff.role).toBe('counter_staff');
      expect(response.body.data.token).toBeDefined();
      staffToken = response.body.data.token;
    });

    it('should not login staff with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/counter/auth/login')
        .send({
          email: 'invalid@travellite.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should not allow staff access to wrong station', async () => {
      const response = await request(app)
        .post('/api/counter/auth/login')
        .send({
          email: 'rajesh@travellite.com',
          password: 'staff123',
          stationId: '999' // Wrong station
        })
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access denied for this station');
    });
  });

  describe('GET /api/counter/dashboard/stats', () => {
    it('should get dashboard stats with valid staff token', async () => {
      const response = await request(app)
        .get('/api/counter/dashboard/stats')
        .set('Authorization', `Bearer ${staffToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.todayStats).toBeDefined();
      expect(response.body.data.pendingWork).toBeDefined();
      expect(response.body.data.stationInfo).toBeDefined();
    });

    it('should not get stats without staff token', async () => {
      const response = await request(app)
        .get('/api/counter/dashboard/stats')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/counter/auth/logout', () => {
    it('should logout staff successfully', async () => {
      const response = await request(app)
        .post('/api/counter/auth/logout')
        .set('Authorization', `Bearer ${staffToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Staff logout successful');
    });
  });
});
