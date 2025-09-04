const request = require('supertest');
const app = require('../api-server');

describe('Booking API', () => {
  let userToken;
  let staffToken;
  let bookingId;

  const testUser = {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.booking@example.com',
    phone: '+91-9876543211',
    password: 'testPassword123'
  };

  const mockBookingData = {
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
  };

  beforeAll(async () => {
    // Register and login user
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

    // Login staff for counter tests
    const staffLoginResponse = await request(app)
      .post('/api/counter/auth/login')
      .send({
        email: 'rajesh@travellite.com',
        password: 'staff123'
      });

    staffToken = staffLoginResponse.body.data.token;
  });

  describe('POST /api/booking', () => {
    it('should create a booking successfully', async () => {
      const response = await request(app)
        .post('/api/booking')
        .set('Authorization', `Bearer ${userToken}`)
        .send(mockBookingData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Booking created successfully');
      expect(response.body.data.booking.bookingId).toBeDefined();
      expect(response.body.data.booking.bookingId).toMatch(/^TL\d{8}[A-Z]{2,4}$/);
      bookingId = response.body.data.booking.bookingId;
    });

    it('should not create booking without authentication', async () => {
      const response = await request(app)
        .post('/api/booking')
        .send(mockBookingData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access token required');
    });

    it('should not create booking with missing required fields', async () => {
      const incompleteBooking = {
        sourceStation: mockBookingData.sourceStation
        // Missing other required fields
      };

      const response = await request(app)
        .post('/api/booking')
        .set('Authorization', `Bearer ${userToken}`)
        .send(incompleteBooking)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Missing required booking information');
    });

    it('should not create booking with incorrect number of images', async () => {
      const invalidBooking = {
        ...mockBookingData,
        luggageImages: [mockBookingData.luggageImages[0]] // Only 1 image instead of 4
      };

      const response = await request(app)
        .post('/api/booking')
        .set('Authorization', `Bearer ${userToken}`)
        .send(invalidBooking)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Exactly 4 luggage images are required');
    });

    it('should not create booking with missing image angles', async () => {
      const invalidBooking = {
        ...mockBookingData,
        luggageImages: [
          { angle: 'front', url: 'mock://image1.jpg' },
          { angle: 'front', url: 'mock://image2.jpg' }, // Duplicate angle
          { angle: 'left', url: 'mock://image3.jpg' },
          { angle: 'right', url: 'mock://image4.jpg' }
        ]
      };

      const response = await request(app)
        .post('/api/booking')
        .set('Authorization', `Bearer ${userToken}`)
        .send(invalidBooking)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Missing required image angles');
    });
  });

  describe('GET /api/booking', () => {
    it('should get user bookings', async () => {
      const response = await request(app)
        .get('/api/booking')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.bookings).toBeDefined();
      expect(Array.isArray(response.body.data.bookings)).toBe(true);
      expect(response.body.data.bookings.length).toBeGreaterThan(0);
    });

    it('should filter bookings by status', async () => {
      const response = await request(app)
        .get('/api/booking?status=pending_payment')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.bookings).toBeDefined();
    });

    it('should not get bookings without authentication', async () => {
      const response = await request(app)
        .get('/api/booking')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/booking/:id', () => {
    it('should get specific booking by ID', async () => {
      const response = await request(app)
        .get(`/api/booking/${bookingId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.booking.bookingId).toBe(bookingId);
    });

    it('should not get booking that does not exist', async () => {
      const response = await request(app)
        .get('/api/booking/TL99999999XXXX')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Booking not found');
    });

    it('should not get booking without authentication', async () => {
      const response = await request(app)
        .get(`/api/booking/${bookingId}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/booking/:id/payment', () => {
    it('should process payment successfully', async () => {
      const paymentData = {
        paymentMethod: 'credit_card',
        cardDetails: {
          number: '4111111111111111',
          expiry: '12/25',
          cvv: '123',
          name: 'Jane Smith'
        }
      };

      const response = await request(app)
        .post(`/api/booking/${bookingId}/payment`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(paymentData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Payment processed successfully');
      expect(response.body.data.booking.status).toBe('payment_confirmed');
    });

    it('should not process payment for non-existent booking', async () => {
      const response = await request(app)
        .post('/api/booking/TL99999999XXXX/payment')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ paymentMethod: 'credit_card' })
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should not process payment without authentication', async () => {
      const response = await request(app)
        .post(`/api/booking/${bookingId}/payment`)
        .send({ paymentMethod: 'credit_card' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Counter Operations', () => {
    describe('GET /api/counter/bookings/:id/lookup', () => {
      it('should lookup booking for staff', async () => {
        const response = await request(app)
          .get(`/api/counter/bookings/${bookingId}/lookup`)
          .set('Authorization', `Bearer ${staffToken}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.booking.bookingId).toBe(bookingId);
        expect(response.body.data.operationType).toBeDefined();
      });

      it('should not lookup booking without staff authentication', async () => {
        const response = await request(app)
          .get(`/api/counter/bookings/${bookingId}/lookup`)
          .expect(401);

        expect(response.body.success).toBe(false);
      });

      it('should not lookup non-existent booking', async () => {
        const response = await request(app)
          .get('/api/counter/bookings/TL99999999XXXX/lookup')
          .set('Authorization', `Bearer ${staffToken}`)
          .expect(404);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Booking not found');
      });
    });

    describe('POST /api/counter/bookings/:id/accept', () => {
      it('should accept luggage at source station', async () => {
        const acceptanceData = {
          verificationNotes: 'Luggage verified and accepted',
          actualWeight: 15.5,
          actualDimensions: '60x40x25'
        };

        const response = await request(app)
          .post(`/api/counter/bookings/${bookingId}/accept`)
          .set('Authorization', `Bearer ${staffToken}`)
          .send(acceptanceData)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Luggage accepted successfully');
        expect(response.body.data.booking.status).toBe('luggage_collected');
      });

      it('should not accept luggage without staff authentication', async () => {
        const response = await request(app)
          .post(`/api/counter/bookings/${bookingId}/accept`)
          .send({ verificationNotes: 'Test' })
          .expect(401);

        expect(response.body.success).toBe(false);
      });

      it('should not accept luggage for non-existent booking', async () => {
        const response = await request(app)
          .post('/api/counter/bookings/TL99999999XXXX/accept')
          .set('Authorization', `Bearer ${staffToken}`)
          .send({ verificationNotes: 'Test' })
          .expect(404);

        expect(response.body.success).toBe(false);
      });
    });
  });

  describe('PATCH /api/booking/:id/cancel', () => {
    it('should cancel booking successfully', async () => {
      const response = await request(app)
        .patch(`/api/booking/${bookingId}/cancel`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ reason: 'Changed travel plans' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Booking cancelled successfully');
      expect(response.body.data.booking.status).toBe('cancelled');
    });

    it('should not cancel non-existent booking', async () => {
      const response = await request(app)
        .patch('/api/booking/TL99999999XXXX/cancel')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ reason: 'Test' })
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should not cancel booking without authentication', async () => {
      const response = await request(app)
        .patch(`/api/booking/${bookingId}/cancel`)
        .send({ reason: 'Test' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
