const API_BASE_URL = import.meta.env.VITE_API_URL;

class CounterService {
  // Staff authentication
  async staffLogin(email, password, stationId = null) {
    try {
      const response = await fetch(`${API_BASE_URL}/counter/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, stationId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in staff login:', error);
      throw error;
    }
  }

  async staffLogout(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/counter/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in staff logout:', error);
      throw error;
    }
  }

  // Dashboard operations
  async getDashboardStats(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/counter/dashboard/stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  // Booking operations
  async lookupBooking(token, bookingId) {
    try {
      const response = await fetch(`${API_BASE_URL}/counter/bookings/${bookingId}/lookup`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error looking up booking:', error);
      throw error;
    }
  }

  async acceptLuggage(token, bookingId, acceptanceData) {
    try {
      const response = await fetch(`${API_BASE_URL}/counter/bookings/${bookingId}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(acceptanceData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error accepting luggage:', error);
      throw error;
    }
  }

  async deliverLuggage(token, bookingId, deliveryData) {
    try {
      const response = await fetch(`${API_BASE_URL}/counter/bookings/${bookingId}/deliver`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deliveryData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error delivering luggage:', error);
      throw error;
    }
  }

  async updateBookingStatus(token, bookingId, statusData) {
    try {
      const response = await fetch(`${API_BASE_URL}/counter/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(statusData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }

  // Utility methods
  getOperationTypeInfo(operationType) {
    const operationMap = {
      pickup: {
        title: 'Luggage Pickup',
        description: 'Accept customer luggage at source station',
        icon: '📦',
        color: 'blue',
        action: 'Accept Luggage'
      },
      delivery: {
        title: 'Luggage Delivery',
        description: 'Deliver luggage to customer at destination',
        icon: '🚚',
        color: 'green',
        action: 'Mark as Delivered'
      }
    };

    return operationMap[operationType] || {
      title: 'Unknown Operation',
      description: 'Unknown operation type',
      icon: '❓',
      color: 'gray',
      action: 'Process'
    };
  }

  getBookingStatusInfo(status) {
    const statusMap = {
      pending_payment: {
        label: 'Pending Payment',
        color: 'yellow',
        description: 'Waiting for customer payment',
        allowedActions: []
      },
      payment_confirmed: {
        label: 'Payment Confirmed',
        color: 'blue',
        description: 'Ready for luggage pickup',
        allowedActions: ['accept']
      },
      luggage_collected: {
        label: 'Luggage Collected',
        color: 'purple',
        description: 'Luggage collected, in processing',
        allowedActions: ['update_status']
      },
      in_transit: {
        label: 'In Transit',
        color: 'orange',
        description: 'Luggage is being transported',
        allowedActions: ['deliver', 'update_status']
      },
      delivered: {
        label: 'Delivered',
        color: 'green',
        description: 'Luggage delivered successfully',
        allowedActions: []
      },
      cancelled: {
        label: 'Cancelled',
        color: 'red',
        description: 'Booking has been cancelled',
        allowedActions: []
      }
    };

    return statusMap[status] || {
      label: status,
      color: 'gray',
      description: 'Unknown status',
      allowedActions: []
    };
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }

  formatDateTime(dateString) {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatTime(dateString) {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Validation helpers
  validateBookingId(bookingId) {
    // TravelLite booking ID format: TL + 8 digits + 2-4 uppercase letters
    const regex = /^TL\d{8}[A-Z]{2,4}$/;
    return regex.test(bookingId);
  }

  validateStaffCredentials(email, password) {
    const errors = [];

    if (!email || !email.includes('@')) {
      errors.push('Valid email address is required');
    }

    if (!password || password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Local storage helpers for staff session
  saveStaffSession(staffData, token) {
    try {
      localStorage.setItem('staff_session', JSON.stringify({
        staff: staffData,
        token,
        loginTime: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error saving staff session:', error);
    }
  }

  getStaffSession() {
    try {
      const session = localStorage.getItem('staff_session');
      return session ? JSON.parse(session) : null;
    } catch (error) {
      console.error('Error getting staff session:', error);
      return null;
    }
  }

  clearStaffSession() {
    try {
      localStorage.removeItem('staff_session');
    } catch (error) {
      console.error('Error clearing staff session:', error);
    }
  }

  isStaffAuthenticated() {
    const session = this.getStaffSession();
    return !!(session && session.token && session.staff);
  }

  // Generate booking summary for counter display
  generateBookingSummary(booking) {
    return {
      bookingId: booking.bookingId,
      customerName: `${booking.userId.firstName} ${booking.userId.lastName}`,
      customerPhone: booking.userId.phone,
      route: `${booking.sourceStation.name} → ${booking.destinationStation.name}`,
      distance: `${booking.distance} km`,
      totalAmount: this.formatCurrency(booking.pricing.totalAmount),
      status: this.getBookingStatusInfo(booking.status),
      createdAt: this.formatDateTime(booking.createdAt),
      securityItemsCount: booking.securityItems?.length || 0,
      imagesCount: booking.luggageImages?.length || 0
    };
  }
}

export const counterService = new CounterService();
