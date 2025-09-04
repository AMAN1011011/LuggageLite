const Booking = require('../models/Booking');
const Staff = require('../models/Staff');
const User = require('../models/User');

class CounterController {
  // Staff authentication
  async staffLogin(req, res) {
    try {
      const { email, password, stationId } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      // Find staff member
      const staff = await Staff.findOne({ 
        email: email.toLowerCase(), 
        isActive: true 
      });

      if (!staff) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // In a real implementation, you would hash and compare passwords
      // For now, we'll do a simple comparison
      if (staff.password !== password) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check if staff is assigned to the station (if stationId provided)
      if (stationId && staff.assignedStation.id !== stationId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied for this station'
        });
      }

      // Clock in the staff member
      await staff.clockIn(req.ip, req.headers['user-agent']);

      // Generate token (mock)
      const token = `staff_token_${staff._id}_${Date.now()}`;

      res.json({
        success: true,
        message: 'Staff login successful',
        data: {
          staff: {
            id: staff._id,
            staffId: staff.staffId,
            fullName: staff.fullName,
            role: staff.role,
            displayRole: staff.displayRole,
            assignedStation: staff.assignedStation,
            permissions: staff.permissions,
            isOnDuty: staff.isOnDuty
          },
          token
        }
      });
    } catch (error) {
      console.error('Error in staff login:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to authenticate staff',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // Staff logout
  async staffLogout(req, res) {
    try {
      const staffId = req.staff.id;
      const staff = await Staff.findById(staffId);

      if (staff) {
        await staff.clockOut();
      }

      res.json({
        success: true,
        message: 'Staff logout successful'
      });
    } catch (error) {
      console.error('Error in staff logout:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to logout staff',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // Lookup booking by UID
  async lookupBooking(req, res) {
    try {
      const { bookingId } = req.params;
      const staffMember = req.staff;

      if (!staffMember.hasPermission('booking_lookup')) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions'
        });
      }

      // Find booking
      const booking = await Booking.findOne({
        $or: [
          { bookingId },
          { _id: bookingId }
        ]
      }).populate('userId', 'firstName lastName email phone');

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      // Check if booking is related to staff's station
      const isSourceStation = booking.sourceStation.id === staffMember.assignedStation.id;
      const isDestinationStation = booking.destinationStation.id === staffMember.assignedStation.id;

      if (!isSourceStation && !isDestinationStation) {
        return res.status(403).json({
          success: false,
          message: 'Booking not associated with your station'
        });
      }

      // Determine the operation type based on station
      const operationType = isSourceStation ? 'pickup' : 'delivery';

      res.json({
        success: true,
        data: {
          booking,
          operationType,
          stationRole: isSourceStation ? 'source' : 'destination'
        }
      });
    } catch (error) {
      console.error('Error looking up booking:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to lookup booking',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // Accept luggage at source station
  async acceptLuggage(req, res) {
    try {
      const { bookingId } = req.params;
      const { verificationNotes, actualWeight, actualDimensions } = req.body;
      const staffMember = req.staff;

      if (!staffMember.hasPermission('luggage_accept')) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions'
        });
      }

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

      // Verify this is the source station
      if (booking.sourceStation.id !== staffMember.assignedStation.id) {
        return res.status(403).json({
          success: false,
          message: 'This booking is not for luggage pickup at your station'
        });
      }

      // Check if booking is in correct status
      if (!['payment_confirmed'].includes(booking.status)) {
        return res.status(400).json({
          success: false,
          message: 'Booking is not ready for luggage acceptance'
        });
      }

      // Update booking status and add tracking
      booking.status = 'luggage_collected';
      booking.tracking.pickupCompleted = new Date();
      
      // Add luggage details if provided
      if (actualWeight) booking.luggageDetails = { ...booking.luggageDetails, actualWeight };
      if (actualDimensions) booking.luggageDetails = { ...booking.luggageDetails, actualDimensions };

      await booking.addTrackingEntry(
        'luggage_collected',
        staffMember.assignedStation.name,
        `Luggage collected by ${staffMember.fullName}. ${verificationNotes || ''}`
      );

      // Update staff stats
      await staffMember.updateStats({
        totalLuggageAccepted: staffMember.stats.totalLuggageAccepted + 1,
        totalBookingsProcessed: staffMember.stats.totalBookingsProcessed + 1
      });

      res.json({
        success: true,
        message: 'Luggage accepted successfully',
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
      console.error('Error accepting luggage:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to accept luggage',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // Deliver luggage at destination station
  async deliverLuggage(req, res) {
    try {
      const { bookingId } = req.params;
      const { customerVerification, deliveryNotes } = req.body;
      const staffMember = req.staff;

      if (!staffMember.hasPermission('luggage_accept')) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions'
        });
      }

      const booking = await Booking.findOne({
        $or: [
          { bookingId },
          { _id: bookingId }
        ]
      }).populate('userId', 'firstName lastName email phone');

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      // Verify this is the destination station
      if (booking.destinationStation.id !== staffMember.assignedStation.id) {
        return res.status(403).json({
          success: false,
          message: 'This booking is not for luggage delivery at your station'
        });
      }

      // Check if booking is ready for delivery
      if (!['in_transit'].includes(booking.status)) {
        return res.status(400).json({
          success: false,
          message: 'Booking is not ready for delivery'
        });
      }

      // Update booking status
      booking.status = 'delivered';
      booking.tracking.deliveryCompleted = new Date();

      await booking.addTrackingEntry(
        'delivered',
        staffMember.assignedStation.name,
        `Luggage delivered by ${staffMember.fullName}. Customer: ${customerVerification}. ${deliveryNotes || ''}`
      );

      // Update staff stats
      await staffMember.updateStats({
        totalLuggageDelivered: staffMember.stats.totalLuggageDelivered + 1,
        totalBookingsProcessed: staffMember.stats.totalBookingsProcessed + 1
      });

      res.json({
        success: true,
        message: 'Luggage delivered successfully',
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
      console.error('Error delivering luggage:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to deliver luggage',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // Update booking status
  async updateBookingStatus(req, res) {
    try {
      const { bookingId } = req.params;
      const { status, location, notes } = req.body;
      const staffMember = req.staff;

      if (!staffMember.hasPermission('status_update')) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions'
        });
      }

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

      // Update status
      await booking.updateStatus(status, location || staffMember.assignedStation.name, notes);

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

  // Get bookings for staff's station
  async getStationBookings(req, res) {
    try {
      const staffMember = req.staff;
      const { status, operationType, page = 1, limit = 20 } = req.query;

      const stationId = staffMember.assignedStation.id;
      let query = {};

      // Build query based on operation type
      if (operationType === 'pickup') {
        query['sourceStation.id'] = stationId;
      } else if (operationType === 'delivery') {
        query['destinationStation.id'] = stationId;
      } else {
        // Show all bookings related to this station
        query.$or = [
          { 'sourceStation.id': stationId },
          { 'destinationStation.id': stationId }
        ];
      }

      // Filter by status if provided
      if (status) {
        query.status = status;
      }

      const bookings = await Booking.find(query)
        .populate('userId', 'firstName lastName email phone')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select('-luggageImages -tracking.trackingHistory');

      const total = await Booking.countDocuments(query);

      // Add operation type to each booking
      const bookingsWithOperationType = bookings.map(booking => ({
        ...booking.toObject(),
        operationType: booking.sourceStation.id === stationId ? 'pickup' : 'delivery'
      }));

      res.json({
        success: true,
        data: {
          bookings: bookingsWithOperationType,
          pagination: {
            current: parseInt(page),
            pages: Math.ceil(total / limit),
            total
          }
        }
      });
    } catch (error) {
      console.error('Error fetching station bookings:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch bookings',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // Get staff dashboard stats
  async getDashboardStats(req, res) {
    try {
      const staffMember = req.staff;
      const stationId = staffMember.assignedStation.id;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get booking counts for today
      const todayPickups = await Booking.countDocuments({
        'sourceStation.id': stationId,
        status: 'payment_confirmed',
        createdAt: { $gte: today }
      });

      const todayDeliveries = await Booking.countDocuments({
        'destinationStation.id': stationId,
        status: 'in_transit',
        createdAt: { $gte: today }
      });

      const todayCompleted = await Booking.countDocuments({
        $or: [
          { 'sourceStation.id': stationId, status: 'luggage_collected' },
          { 'destinationStation.id': stationId, status: 'delivered' }
        ],
        updatedAt: { $gte: today }
      });

      // Get pending bookings
      const pendingPickups = await Booking.countDocuments({
        'sourceStation.id': stationId,
        status: 'payment_confirmed'
      });

      const pendingDeliveries = await Booking.countDocuments({
        'destinationStation.id': stationId,
        status: 'in_transit'
      });

      // Get staff on duty at this station
      const staffOnDuty = await Staff.countDocuments({
        'assignedStation.id': stationId,
        isOnDuty: true,
        isActive: true
      });

      res.json({
        success: true,
        data: {
          todayStats: {
            pickups: todayPickups,
            deliveries: todayDeliveries,
            completed: todayCompleted
          },
          pendingWork: {
            pickups: pendingPickups,
            deliveries: pendingDeliveries
          },
          stationInfo: {
            staffOnDuty,
            currentStaff: {
              name: staffMember.fullName,
              role: staffMember.displayRole,
              onDutySince: staffMember.lastLogin
            }
          },
          personalStats: staffMember.stats
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard stats',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
}

module.exports = new CounterController();
