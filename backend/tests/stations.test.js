const request = require('supertest');
const app = require('../api-server');

describe('Stations API', () => {
  describe('GET /api/stations/popular', () => {
    it('should get popular stations', async () => {
      const response = await request(app)
        .get('/api/stations/popular')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.stations).toBeDefined();
      expect(Array.isArray(response.body.data.stations)).toBe(true);
      expect(response.body.data.stations.length).toBeGreaterThan(0);
      
      // Check station structure
      const station = response.body.data.stations[0];
      expect(station.id).toBeDefined();
      expect(station.name).toBeDefined();
      expect(station.code).toBeDefined();
      expect(station.type).toBeDefined();
      expect(['railway', 'airport'].includes(station.type)).toBe(true);
    });

    it('should limit results when limit parameter is provided', async () => {
      const response = await request(app)
        .get('/api/stations/popular?limit=3')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.stations.length).toBeLessThanOrEqual(3);
    });
  });

  describe('GET /api/stations/search', () => {
    it('should search stations by query', async () => {
      const response = await request(app)
        .get('/api/stations/search?q=mumbai')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.stations).toBeDefined();
      expect(Array.isArray(response.body.data.stations)).toBe(true);
      
      // Check if results contain Mumbai stations
      if (response.body.data.stations.length > 0) {
        const mumbaiStations = response.body.data.stations.filter(station => 
          station.name.toLowerCase().includes('mumbai') || 
          station.city.toLowerCase().includes('mumbai')
        );
        expect(mumbaiStations.length).toBeGreaterThan(0);
      }
    });

    it('should filter stations by type', async () => {
      const response = await request(app)
        .get('/api/stations/search?type=railway')
        .expect(200);

      expect(response.body.success).toBe(true);
      if (response.body.data.stations.length > 0) {
        response.body.data.stations.forEach(station => {
          expect(station.type).toBe('railway');
        });
      }
    });

    it('should filter stations by city', async () => {
      const response = await request(app)
        .get('/api/stations/search?city=Delhi')
        .expect(200);

      expect(response.body.success).toBe(true);
      if (response.body.data.stations.length > 0) {
        response.body.data.stations.forEach(station => {
          expect(station.city.toLowerCase()).toContain('delhi');
        });
      }
    });

    it('should return empty results for non-existent stations', async () => {
      const response = await request(app)
        .get('/api/stations/search?q=nonexistentstation')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.stations).toBeDefined();
      expect(response.body.data.stations.length).toBe(0);
    });

    it('should handle search without query parameter', async () => {
      const response = await request(app)
        .get('/api/stations/search')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Search query is required');
    });
  });

  describe('GET /api/stations/distance/:id1/:id2', () => {
    it('should calculate distance between two stations', async () => {
      const response = await request(app)
        .get('/api/stations/distance/1/2')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.distance).toBeDefined();
      expect(typeof response.body.data.distance).toBe('number');
      expect(response.body.data.distance).toBeGreaterThan(0);
      expect(response.body.data.sourceStation).toBeDefined();
      expect(response.body.data.destinationStation).toBeDefined();
      expect(response.body.data.estimatedTime).toBeDefined();
    });

    it('should return error for same source and destination', async () => {
      const response = await request(app)
        .get('/api/stations/distance/1/1')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Source and destination stations cannot be the same');
    });

    it('should return error for non-existent stations', async () => {
      const response = await request(app)
        .get('/api/stations/distance/999/1000')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });

    it('should handle invalid station IDs', async () => {
      const response = await request(app)
        .get('/api/stations/distance/invalid/alsoinvalid')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});

describe('Pricing API', () => {
  let userToken;

  beforeAll(async () => {
    // Register and login user for pricing tests
    const testUser = {
      firstName: 'Price',
      lastName: 'Tester',
      email: 'price.test@example.com',
      phone: '+91-9876543212',
      password: 'testPassword123'
    };

    await request(app)
      .post('/api/auth/register')
      .send(testUser);

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    userToken = loginResponse.body.data.token;
  });

  describe('POST /api/pricing/calculate', () => {
    it('should calculate pricing for valid route', async () => {
      const pricingRequest = {
        sourceStationId: '1',
        destinationStationId: '2',
        distance: 1384,
        serviceType: 'standard',
        urgency: 'regular'
      };

      const response = await request(app)
        .post('/api/pricing/calculate')
        .set('Authorization', `Bearer ${userToken}`)
        .send(pricingRequest)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.pricing).toBeDefined();
      expect(response.body.data.pricing.basePrice).toBeDefined();
      expect(response.body.data.pricing.distancePrice).toBeDefined();
      expect(response.body.data.pricing.serviceFee).toBeDefined();
      expect(response.body.data.pricing.taxes).toBeDefined();
      expect(response.body.data.pricing.totalAmount).toBeDefined();
      expect(typeof response.body.data.pricing.totalAmount).toBe('number');
      expect(response.body.data.pricing.totalAmount).toBeGreaterThan(0);
    });

    it('should calculate different pricing for express service', async () => {
      const standardRequest = {
        sourceStationId: '1',
        destinationStationId: '2',
        distance: 1384,
        serviceType: 'standard',
        urgency: 'regular'
      };

      const expressRequest = {
        ...standardRequest,
        serviceType: 'express'
      };

      const standardResponse = await request(app)
        .post('/api/pricing/calculate')
        .set('Authorization', `Bearer ${userToken}`)
        .send(standardRequest);

      const expressResponse = await request(app)
        .post('/api/pricing/calculate')
        .set('Authorization', `Bearer ${userToken}`)
        .send(expressRequest);

      expect(expressResponse.body.data.pricing.totalAmount).toBeGreaterThan(
        standardResponse.body.data.pricing.totalAmount
      );
    });

    it('should calculate different pricing for urgent delivery', async () => {
      const regularRequest = {
        sourceStationId: '1',
        destinationStationId: '2',
        distance: 1384,
        serviceType: 'standard',
        urgency: 'regular'
      };

      const urgentRequest = {
        ...regularRequest,
        urgency: 'urgent'
      };

      const regularResponse = await request(app)
        .post('/api/pricing/calculate')
        .set('Authorization', `Bearer ${userToken}`)
        .send(regularRequest);

      const urgentResponse = await request(app)
        .post('/api/pricing/calculate')
        .set('Authorization', `Bearer ${userToken}`)
        .send(urgentRequest);

      expect(urgentResponse.body.data.pricing.totalAmount).toBeGreaterThan(
        regularResponse.body.data.pricing.totalAmount
      );
    });

    it('should not calculate pricing without authentication', async () => {
      const pricingRequest = {
        sourceStationId: '1',
        destinationStationId: '2',
        distance: 1384
      };

      const response = await request(app)
        .post('/api/pricing/calculate')
        .send(pricingRequest)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access token required');
    });

    it('should not calculate pricing with missing required fields', async () => {
      const incompleteRequest = {
        sourceStationId: '1'
        // Missing other required fields
      };

      const response = await request(app)
        .post('/api/pricing/calculate')
        .set('Authorization', `Bearer ${userToken}`)
        .send(incompleteRequest)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('required');
    });

    it('should validate distance parameter', async () => {
      const invalidRequest = {
        sourceStationId: '1',
        destinationStationId: '2',
        distance: -100 // Invalid negative distance
      };

      const response = await request(app)
        .post('/api/pricing/calculate')
        .set('Authorization', `Bearer ${userToken}`)
        .send(invalidRequest)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should handle very long distances', async () => {
      const longDistanceRequest = {
        sourceStationId: '1',
        destinationStationId: '2',
        distance: 5000, // Very long distance
        serviceType: 'standard',
        urgency: 'regular'
      };

      const response = await request(app)
        .post('/api/pricing/calculate')
        .set('Authorization', `Bearer ${userToken}`)
        .send(longDistanceRequest)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.pricing.totalAmount).toBeGreaterThan(1000);
    });
  });
});
