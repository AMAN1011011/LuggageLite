const BookingUtils = require('../utils/bookingUtils');

class SMSService {
  constructor() {
    // In a real implementation, this would initialize Twilio client
    this.isConfigured = true;
    this.accountSid = process.env.TWILIO_ACCOUNT_SID || 'mock_account_sid';
    this.authToken = process.env.TWILIO_AUTH_TOKEN || 'mock_auth_token';
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER || '+1234567890';
  }

  // Send booking confirmation SMS
  async sendBookingConfirmation(booking, phoneNumber) {
    try {
      // Generate SMS content
      const message = BookingUtils.formatConfirmationMessage(booking, 'sms');
      
      console.log(`📱 Sending booking confirmation SMS to: ${phoneNumber}`);
      console.log(`Message: ${message}`);
      
      // Simulate SMS sending delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful response
      const result = {
        success: true,
        sid: `SM${Date.now()}${Math.random().toString(36).substring(2, 8)}`,
        to: phoneNumber,
        from: this.fromNumber,
        body: message,
        status: 'sent',
        sentAt: new Date()
      };

      console.log(`✅ SMS sent successfully: ${result.sid}`);
      return result;
      
    } catch (error) {
      console.error('❌ Failed to send SMS:', error);
      throw new Error('Failed to send confirmation SMS');
    }
  }

  // Send booking status update SMS
  async sendStatusUpdate(booking, phoneNumber, newStatus) {
    try {
      const statusMessages = {
        payment_confirmed: `✅ Payment confirmed for booking ${booking.bookingId}. Your luggage service is now active.`,
        luggage_collected: `📦 Your luggage has been collected at ${booking.sourceStation.name}. Booking: ${booking.bookingId}`,
        in_transit: `🚚 Your luggage is in transit to ${booking.destinationStation.name}. Track: ${booking.bookingId}`,
        delivered: `🎉 Your luggage has been delivered at ${booking.destinationStation.name}. Booking: ${booking.bookingId}`,
        cancelled: `❌ Your booking ${booking.bookingId} has been cancelled. Refund will be processed if applicable.`
      };

      const message = statusMessages[newStatus] || `Status update for booking ${booking.bookingId}: ${newStatus}`;

      console.log(`📱 Sending status update SMS to: ${phoneNumber}`);
      console.log(`Status: ${newStatus}`);
      console.log(`Message: ${message}`);
      
      // Simulate SMS sending delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const result = {
        success: true,
        sid: `SM${Date.now()}${Math.random().toString(36).substring(2, 8)}`,
        to: phoneNumber,
        from: this.fromNumber,
        body: message,
        status: 'sent',
        sentAt: new Date()
      };

      console.log(`✅ Status update SMS sent: ${result.sid}`);
      return result;
      
    } catch (error) {
      console.error('❌ Failed to send status update SMS:', error);
      throw new Error('Failed to send status update SMS');
    }
  }

  // Send payment confirmation SMS
  async sendPaymentConfirmation(booking, phoneNumber, transactionDetails) {
    try {
      const message = `💳 Payment of ₹${transactionDetails.amount} confirmed for TravelLite booking ${booking.bookingId}. Transaction ID: ${transactionDetails.transactionId}. Thank you!`;

      console.log(`📱 Sending payment confirmation SMS to: ${phoneNumber}`);
      console.log(`Transaction: ${transactionDetails.transactionId}`);
      
      // Simulate SMS sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = {
        success: true,
        sid: `SM${Date.now()}${Math.random().toString(36).substring(2, 8)}`,
        to: phoneNumber,
        from: this.fromNumber,
        body: message,
        status: 'sent',
        sentAt: new Date()
      };

      console.log(`✅ Payment confirmation SMS sent: ${result.sid}`);
      return result;
      
    } catch (error) {
      console.error('❌ Failed to send payment confirmation SMS:', error);
      throw new Error('Failed to send payment confirmation SMS');
    }
  }

  // Send pickup reminder SMS
  async sendPickupReminder(booking, phoneNumber) {
    try {
      const message = `⏰ Reminder: Please visit TravelLite counter at ${booking.sourceStation.name} to drop off your luggage. Booking: ${booking.bookingId}`;

      console.log(`📱 Sending pickup reminder SMS to: ${phoneNumber}`);
      
      // Simulate SMS sending delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const result = {
        success: true,
        sid: `SM${Date.now()}${Math.random().toString(36).substring(2, 8)}`,
        to: phoneNumber,
        from: this.fromNumber,
        body: message,
        status: 'sent',
        sentAt: new Date()
      };

      console.log(`✅ Pickup reminder SMS sent: ${result.sid}`);
      return result;
      
    } catch (error) {
      console.error('❌ Failed to send pickup reminder SMS:', error);
      throw new Error('Failed to send pickup reminder SMS');
    }
  }

  // Send delivery notification SMS
  async sendDeliveryNotification(booking, phoneNumber) {
    try {
      const message = `📍 Your luggage is ready for pickup at ${booking.destinationStation.name}! Please visit the TravelLite counter with ID: ${booking.bookingId}`;

      console.log(`📱 Sending delivery notification SMS to: ${phoneNumber}`);
      
      // Simulate SMS sending delay
      await new Promise(resolve => setTimeout(resolve, 1100));
      
      const result = {
        success: true,
        sid: `SM${Date.now()}${Math.random().toString(36).substring(2, 8)}`,
        to: phoneNumber,
        from: this.fromNumber,
        body: message,
        status: 'sent',
        sentAt: new Date()
      };

      console.log(`✅ Delivery notification SMS sent: ${result.sid}`);
      return result;
      
    } catch (error) {
      console.error('❌ Failed to send delivery notification SMS:', error);
      throw new Error('Failed to send delivery notification SMS');
    }
  }

  // Format phone number for SMS (ensure proper format)
  formatPhoneNumber(phoneNumber) {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Add country code if not present (assuming Indian numbers)
    if (cleaned.length === 10) {
      return `+91${cleaned}`;
    } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
      return `+${cleaned}`;
    } else if (cleaned.length === 13 && cleaned.startsWith('+91')) {
      return cleaned;
    }
    
    return phoneNumber; // Return as-is if format is unclear
  }

  // Validate SMS configuration
  async validateConfiguration() {
    try {
      // In real implementation, test Twilio credentials
      console.log('✅ SMS service configuration is valid');
      return { success: true, message: 'SMS service is properly configured' };
    } catch (error) {
      console.error('❌ SMS service configuration error:', error);
      return { success: false, message: 'SMS service configuration error' };
    }
  }

  // Get SMS delivery status (mock implementation)
  async getDeliveryStatus(messageSid) {
    try {
      // Mock status check
      const statuses = ['sent', 'delivered', 'failed', 'undelivered'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      return {
        success: true,
        sid: messageSid,
        status: randomStatus,
        checkedAt: new Date()
      };
    } catch (error) {
      console.error('❌ Failed to check SMS status:', error);
      throw new Error('Failed to check SMS delivery status');
    }
  }
}

module.exports = new SMSService();
