const Booking = require('../models/Booking');
const User = require('../models/User');

class BookingController {
  // Create a new booking
  async createBooking(req, res) {
    try {
      const {
        sourceStation,
        destinationStation,
        distance,
        pricing,
        securityItems,
        contactInfo,
        luggageImages,
        paymentMethod
      } = req.body;

      const userId = req.user.id; // From auth middleware

      // Validate required fields
      if (!sourceStation || !destinationStation || !distance || !pricing || !contactInfo || !luggageImages) {
        return res.status(400).json({
          success: false,
          message: 'Missing required booking information'
        });
      }

      // Validate luggage images (must be exactly 4)
      if (!luggageImages || luggageImages.length !== 4) {
        return res.status(400).json({
          success: false,
          message: 'Exactly 4 luggage images are required'
        });
      }

      // Check if all required angles are present
      const requiredAngles = ['front', 'back', 'left', 'right'];
      const providedAngles = luggageImages.map(img => img.angle);
      const missingAngles = requiredAngles.filter(angle => !providedAngles.includes(angle));
      
      if (missingAngles.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Missing required image angles: ${missingAngles.join(', ')}`
        });
      }

      // Generate unique booking ID
      const bookingId = Booking.generateBookingId();

      // Create booking object
      const bookingData = {
        bookingId,
        userId,
        sourceStation,
        destinationStation,
        distance,
        pricing,
        securityItems: securityItems || [],
        contactInfo,
        luggageImages,
        payment: {
          method: paymentMethod,
          amount: pricing.totalAmount,
          status: 'pending'
        }
      };

      const booking = new Booking(bookingData);
      await booking.save();

      // Add initial tracking entry
      await booking.addTrackingEntry('booking_created', sourceStation.name, 'Booking created successfully');

      res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: {
          booking: {
            id: booking._id,
            bookingId: booking.bookingId,
            status: booking.status,
            totalAmount: booking.pricing.totalAmount,
            createdAt: booking.createdAt
          }
        }
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create booking',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // Get booking by ID
  async getBooking(req, res) {
    try {
      const { bookingId } = req.params;
      const userId = req.user.id;

      const booking = await Booking.findOne({
        $or: [
          { bookingId },
          { _id: bookingId }
        ]
      }).populate('userId', 'name email');

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      // Check if user owns this booking (unless admin)
      if (booking.userId._id.toString() !== userId && !req.user.isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      res.json({
        success: true,
        data: { booking }
      });
    } catch (error) {
      console.error('Error fetching booking:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch booking',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // Get user's bookings
  async getUserBookings(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, status } = req.query;

      const query = { userId };
      if (status) {
        query.status = status;
      }

      const bookings = await Booking.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select('-luggageImages -tracking.trackingHistory'); // Exclude large fields for list view

      const total = await Booking.countDocuments(query);

      res.json({
        success: true,
        data: {
          bookings,
          pagination: {
            current: page,
            pages: Math.ceil(total / limit),
            total
          }
        }
      });
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch bookings',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // Update booking status
  async updateBookingStatus(req, res) {
    try {
      const { bookingId } = req.params;
      const { status, location, notes } = req.body;

      const booking = await Booking.findOne({
        $or: [
          { bookingId },
          { _id: bookingId }
        ]
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      await booking.updateStatus(status, location, notes);

      res.json({
        success: true,
        message: 'Booking status updated successfully',
        data: {
          booking: {
            id: booking._id,
            bookingId: booking.bookingId,
            status: booking.status,
            updatedAt: booking.updatedAt
          }
        }
      });
    } catch (error) {
      console.error('Error updating booking status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update booking status',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // Cancel booking
  async cancelBooking(req, res) {
    try {
      const { bookingId } = req.params;
      const userId = req.user.id;
      const { reason } = req.body;

      const booking = await Booking.findOne({
        $or: [
          { bookingId },
          { _id: bookingId }
        ]
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      // Check if user owns this booking
      if (booking.userId.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      // Check if booking can be cancelled
      if (['luggage_collected', 'in_transit', 'delivered'].includes(booking.status)) {
        return res.status(400).json({
          success: false,
          message: 'Booking cannot be cancelled at this stage'
        });
      }

      await booking.updateStatus('cancelled', booking.tracking.currentLocation || 'User Request', reason || 'Cancelled by user');

      res.json({
        success: true,
        message: 'Booking cancelled successfully',
        data: {
          booking: {
            id: booking._id,
            bookingId: booking.bookingId,
            status: booking.status,
            updatedAt: booking.updatedAt
          }
        }
      });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to cancel booking',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // Get booking statistics
  async getBookingStats(req, res) {
    try {
      const userId = req.user.id;

      const stats = await Booking.aggregate([
        { $match: { userId: mongoose.Types.ObjectId(userId) } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$pricing.totalAmount' }
          }
        }
      ]);

      const totalBookings = await Booking.countDocuments({ userId });
      const totalSpent = await Booking.aggregate([
        { $match: { userId: mongoose.Types.ObjectId(userId), 'payment.status': 'completed' } },
        { $group: { _id: null, total: { $sum: '$pricing.totalAmount' } } }
      ]);

      res.json({
        success: true,
        data: {
          stats,
          summary: {
            totalBookings,
            totalSpent: totalSpent.length > 0 ? totalSpent[0].total : 0
          }
        }
      });
    } catch (error) {
      console.error('Error fetching booking stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch booking statistics',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // Process payment (mock implementation)
  async processPayment(req, res) {
    try {
      const { bookingId } = req.params;
      const { paymentMethod, paymentDetails } = req.body;

      const booking = await Booking.findOne({
        $or: [
          { bookingId },
          { _id: bookingId }
        ]
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      // Mock payment processing
      const transactionId = `TXN${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update payment information
      booking.payment = {
        method: paymentMethod,
        transactionId,
        paymentDate: new Date(),
        amount: booking.pricing.totalAmount,
        status: 'completed'
      };

      // Update booking status
      await booking.updateStatus('payment_confirmed', booking.sourceStation.name, 'Payment completed successfully');

      res.json({
        success: true,
        message: 'Payment processed successfully',
        data: {
          transactionId,
          amount: booking.pricing.totalAmount,
          status: 'completed'
        }
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process payment',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
}

module.exports = new BookingController();
