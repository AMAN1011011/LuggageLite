const express = require('express');
const bookingController = require('../controllers/bookingController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All booking routes require authentication
router.use(authenticate);

// Create new booking
router.post('/', bookingController.createBooking);

// Get user's bookings
router.get('/', bookingController.getUserBookings);

// Get booking statistics
router.get('/stats', bookingController.getBookingStats);

// Get specific booking
router.get('/:bookingId', bookingController.getBooking);

// Update booking status (admin/staff only in real implementation)
router.patch('/:bookingId/status', bookingController.updateBookingStatus);

// Cancel booking
router.patch('/:bookingId/cancel', bookingController.cancelBooking);

// Process payment
router.post('/:bookingId/payment', bookingController.processPayment);

module.exports = router;
