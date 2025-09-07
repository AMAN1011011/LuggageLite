const API_BASE_URL = import.meta.env.VITE_API_URL;
console.log(API_BASE_URL);
class BookingService {
  async createBooking(token, bookingData) {
    try {
      const response = await fetch(`${API_BASE_URL}/booking`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  async getUserBookings(token, status = null) {
    try {
      const url = new URL(`${API_BASE_URL}/booking`);
      if (status) {
        url.searchParams.append('status', status);
      }

      const response = await fetch(url, {
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
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  }

  async getBookingById(token, bookingId) {
    try {
      const response = await fetch(`${API_BASE_URL}/booking/${bookingId}`, {
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
      console.error('Error fetching booking:', error);
      throw error;
    }
  }

  async processPayment(token, bookingId, paymentData) {
    try {
      const response = await fetch(`${API_BASE_URL}/booking/${bookingId}/payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }

  async cancelBooking(token, bookingId, reason = '') {
    try {
      const response = await fetch(`${API_BASE_URL}/booking/${bookingId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  }

  // Validate booking data before submission
  validateBookingData(bookingData) {
    const errors = [];

    // Required fields validation
    if (!bookingData.sourceStation || !bookingData.destinationStation) {
      errors.push('Source and destination stations are required');
    }

    // Distance validation - make it optional since we disabled distance calculation
    if (bookingData.distance && bookingData.distance <= 0) {
      errors.push('Invalid distance value');
    }

    // Contact info validation - make email optional
    if (!bookingData.contactInfo || !bookingData.contactInfo.phone) {
      errors.push('Contact phone number is required');
    }

    // Luggage images validation - make it flexible
    if (!bookingData.luggageImages || bookingData.luggageImages.length === 0) {
      errors.push('At least one luggage image is required');
    }

    // Validate image angles - make it optional
    if (bookingData.luggageImages && bookingData.luggageImages.length > 0) {
      // Just check that images have some angle information
      const imagesWithoutAngles = bookingData.luggageImages.filter(img => !img.angle);
      if (imagesWithoutAngles.length > 0) {
        console.warn('Some images are missing angle information');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Format booking data for API submission
  formatBookingData(stationSelection, selectedItems, contactInfo, uploadedImages, paymentMethod = 'card') {
    return {
      sourceStation: {
        id: stationSelection.sourceStation.id,
        name: stationSelection.sourceStation.name,
        code: stationSelection.sourceStation.code,
        type: stationSelection.sourceStation.type
      },
      destinationStation: {
        id: stationSelection.destinationStation.id,
        name: stationSelection.destinationStation.name,
        code: stationSelection.destinationStation.code,
        type: stationSelection.destinationStation.type
      },
      distance: stationSelection.distance,

      securityItems: selectedItems.map(item => ({
        itemId: item._id,
        categoryId: item.categoryId,
        name: item.name,
        estimatedValue: item.estimatedValue || 0,
        riskLevel: item.riskLevel || 'low'
      })),
      contactInfo: {
        phone: contactInfo.phone,
        email: contactInfo.email,
        address: contactInfo.address,
        emergencyContact: contactInfo.emergencyContact
      },
      luggageImages: uploadedImages.map(img => ({
        id: img.id,
        angle: img.angle,
        url: img.url || img.dataUrl,
        filename: img.filename || img.originalName,
        size: img.size,
        format: img.format
      })),
      paymentMethod
    };
  }

  // Calculate estimated delivery time
  calculateDeliveryTime(distance) {
    let hours = 24; // Minimum 24 hours
    
    if (distance > 500) {
      hours += Math.ceil(distance / 500) * 12;
    } else if (distance > 200) {
      hours += 12;
    }

    return hours;
  }

  // Format currency
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }

  // Get booking status display info
  getStatusInfo(status) {
    const statusMap = {
      pending_payment: {
        label: 'Pending Payment',
        color: 'yellow',
        description: 'Waiting for payment confirmation',
        icon: '💳'
      },
      payment_confirmed: {
        label: 'Payment Confirmed',
        color: 'blue',
        description: 'Payment received, ready for pickup',
        icon: '✅'
      },
      luggage_collected: {
        label: 'Luggage Collected',
        color: 'purple',
        description: 'Luggage collected from source station',
        icon: '📦'
      },
      in_transit: {
        label: 'In Transit',
        color: 'orange',
        description: 'Luggage is being transported',
        icon: '🚚'
      },
      delivered: {
        label: 'Delivered',
        color: 'green',
        description: 'Luggage delivered successfully',
        icon: '🎉'
      },
      cancelled: {
        label: 'Cancelled',
        color: 'red',
        description: 'Booking has been cancelled',
        icon: '❌'
      }
    };

    return statusMap[status] || {
      label: status,
      color: 'gray',
      description: 'Unknown status',
      icon: '❓'
    };
  }

  // Generate booking summary for display
  generateBookingSummary(bookingData) {
    console.log('generateBookingSummary input:', bookingData);
    
    // Handle missing or invalid data
    if (!bookingData) {
      return {
        route: 'No route selected',
        distance: '0 km',
        totalAmount: 'Contact for pricing',
        securityItemsCount: 0,
        totalEstimatedValue: 0,
        estimatedDelivery: 'N/A',
        deliveryTime: 'N/A',
        imagesCount: 0
      };
    }

    const distance = bookingData.distance || 0;
    const deliveryHours = this.calculateDeliveryTime(distance);
    const estimatedDelivery = new Date(Date.now() + deliveryHours * 60 * 60 * 1000);
    
    return {
      route: bookingData.sourceStation && bookingData.destinationStation 
        ? `${bookingData.sourceStation.name} → ${bookingData.destinationStation.name}`
        : 'No route selected',
      distance: `${distance}`,
      totalAmount: 'Contact for pricing',
      securityItemsCount: bookingData.securityItems?.length || 0,
      totalEstimatedValue: bookingData.securityItems?.reduce((sum, item) => sum + (item.estimatedValue || 0), 0) || 0,
      estimatedDelivery: estimatedDelivery.toDateString(),
      deliveryTime: `${deliveryHours} hours`,
      imagesCount: bookingData.luggageImages?.length || 0
    };
  }
}

export const bookingService = new BookingService();
