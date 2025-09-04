const express = require('express');
const counterController = require('../controllers/counterController');
const staffAuthMiddleware = require('../middleware/staffAuth');

const router = express.Router();

// Staff authentication routes (no middleware needed)
router.post('/auth/login', counterController.staffLogin);

// Protected routes (require staff authentication)
router.use(staffAuthMiddleware);

// Staff management
router.post('/auth/logout', counterController.staffLogout);

// Dashboard
router.get('/dashboard/stats', counterController.getDashboardStats);

// Booking operations
router.get('/bookings', counterController.getStationBookings);
router.get('/bookings/:bookingId/lookup', counterController.lookupBooking);
router.patch('/bookings/:bookingId/status', counterController.updateBookingStatus);

// Luggage operations
router.post('/bookings/:bookingId/accept', counterController.acceptLuggage);
router.post('/bookings/:bookingId/deliver', counterController.deliverLuggage);

module.exports = router;
