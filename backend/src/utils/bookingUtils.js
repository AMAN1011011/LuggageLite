const crypto = require('crypto');

class BookingUtils {
  // Generate unique booking ID
  static generateBookingId() {
    const prefix = 'TL';
    const timestamp = Date.now().toString().slice(-8);
    const random = crypto.randomBytes(2).toString('hex').toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }

  // Generate transaction ID
  static generateTransactionId() {
    const prefix = 'TXN';
    const timestamp = Date.now().toString().slice(-8);
    const random = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }

  // Calculate estimated delivery time
  static calculateDeliveryTime(distance) {
    // Base delivery time calculation (in hours)
    let hours = 24; // Minimum 24 hours
    
    if (distance > 500) {
      hours += Math.ceil(distance / 500) * 12; // Additional 12 hours per 500km
    } else if (distance > 200) {
      hours += 12; // Additional 12 hours for medium distance
    }

    return hours;
  }

  // Format booking confirmation message
  static formatConfirmationMessage(booking, type = 'email') {
    const deliveryHours = this.calculateDeliveryTime(booking.distance);
    const estimatedDelivery = new Date(Date.now() + deliveryHours * 60 * 60 * 1000);

    if (type === 'sms') {
      return `TravelLite Booking Confirmed! 
ID: ${booking.bookingId}
From: ${booking.sourceStation.name}
To: ${booking.destinationStation.name}
Amount: ₹${booking.pricing.totalAmount}
Est. Delivery: ${estimatedDelivery.toDateString()}
Track: https://travellite.com/track/${booking.bookingId}`;
    }

    // Email format
    return {
      subject: `TravelLite Booking Confirmation - ${booking.bookingId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🧳 TravelLite</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Travel Light, Arrive Happy</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Booking Confirmed!</h2>
            <p style="color: #666; font-size: 16px;">Your luggage booking has been successfully confirmed. Here are your booking details:</p>
            
            <div style="background: white; padding: 25px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #333;">Booking ID:</td>
                  <td style="padding: 8px 0; color: #667eea; font-weight: bold; font-size: 18px;">${booking.bookingId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #333;">From:</td>
                  <td style="padding: 8px 0; color: #666;">${booking.sourceStation.name} (${booking.sourceStation.code})</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #333;">To:</td>
                  <td style="padding: 8px 0; color: #666;">${booking.destinationStation.name} (${booking.destinationStation.code})</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #333;">Distance:</td>
                  <td style="padding: 8px 0; color: #666;">${booking.distance} km</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #333;">Total Amount:</td>
                  <td style="padding: 8px 0; color: #28a745; font-weight: bold; font-size: 18px;">₹${booking.pricing.totalAmount}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #333;">Estimated Delivery:</td>
                  <td style="padding: 8px 0; color: #666;">${estimatedDelivery.toDateString()}</td>
                </tr>
              </table>
            </div>
            
            ${booking.securityItems.length > 0 ? `
            <div style="background: white; padding: 25px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-bottom: 15px;">Security Checklist Items:</h3>
              <ul style="color: #666; margin: 0; padding-left: 20px;">
                ${booking.securityItems.map(item => `<li style="margin-bottom: 5px;">${item.name} ${item.estimatedValue ? `(₹${item.estimatedValue})` : ''}</li>`).join('')}
              </ul>
            </div>
            ` : ''}
            
            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1976d2; margin-bottom: 15px;">📱 Track Your Luggage</h3>
              <p style="color: #666; margin-bottom: 15px;">Stay updated with real-time tracking:</p>
              <a href="https://travellite.com/track/${booking.bookingId}" 
                 style="display: inline-block; background: #1976d2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Track Now
              </a>
            </div>
            
            <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #856404; margin-bottom: 15px;">📋 Next Steps</h3>
              <ol style="color: #856404; margin: 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">Visit the TravelLite counter at ${booking.sourceStation.name}</li>
                <li style="margin-bottom: 8px;">Show this booking confirmation (ID: ${booking.bookingId})</li>
                <li style="margin-bottom: 8px;">Our staff will verify and securely pack your luggage</li>
                <li style="margin-bottom: 8px;">Collect your luggage at ${booking.destinationStation.name}</li>
              </ol>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #666; margin-bottom: 10px;">Need help? Contact us:</p>
              <p style="color: #667eea; font-weight: bold;">📞 1800-TRAVEL-LITE | 📧 support@travellite.com</p>
            </div>
          </div>
          
          <div style="background: #333; color: #ccc; padding: 20px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">© 2024 TravelLite. All rights reserved.</p>
            <p style="margin: 5px 0 0 0;">This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      `
    };
  }

  // Validate booking data
  static validateBookingData(bookingData) {
    const errors = [];

    // Required fields validation
    if (!bookingData.sourceStation || !bookingData.destinationStation) {
      errors.push('Source and destination stations are required');
    }

    if (!bookingData.distance || bookingData.distance <= 0) {
      errors.push('Valid distance is required');
    }

    if (!bookingData.pricing || !bookingData.pricing.totalAmount) {
      errors.push('Pricing information is required');
    }

    if (!bookingData.contactInfo || !bookingData.contactInfo.phone || !bookingData.contactInfo.email) {
      errors.push('Contact information is required');
    }

    if (!bookingData.luggageImages || bookingData.luggageImages.length !== 4) {
      errors.push('Exactly 4 luggage images are required');
    }

    // Validate image angles
    if (bookingData.luggageImages) {
      const requiredAngles = ['front', 'back', 'left', 'right'];
      const providedAngles = bookingData.luggageImages.map(img => img.angle);
      const missingAngles = requiredAngles.filter(angle => !providedAngles.includes(angle));
      
      if (missingAngles.length > 0) {
        errors.push(`Missing required image angles: ${missingAngles.join(', ')}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Format currency
  static formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }

  // Calculate booking summary
  static calculateBookingSummary(booking) {
    const deliveryHours = this.calculateDeliveryTime(booking.distance);
    const estimatedDelivery = new Date(Date.now() + deliveryHours * 60 * 60 * 1000);
    
    return {
      bookingId: booking.bookingId,
      route: `${booking.sourceStation.name} → ${booking.destinationStation.name}`,
      distance: `${booking.distance} km`,
      totalAmount: this.formatCurrency(booking.pricing.totalAmount),
      securityItemsCount: booking.securityItems.length,
      totalEstimatedValue: booking.securityItems.reduce((sum, item) => sum + (item.estimatedValue || 0), 0),
      estimatedDelivery: estimatedDelivery.toDateString(),
      deliveryTime: `${deliveryHours} hours`,
      status: booking.status,
      createdAt: booking.createdAt
    };
  }
}

module.exports = BookingUtils;
