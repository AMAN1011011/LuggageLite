import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  CreditCard, 
  Smartphone, 
  Mail, 
  MapPin, 
  Calendar,
  Package,
  Shield,
  Clock,
  ArrowRight,
  Copy,
  ExternalLink
} from 'lucide-react';
import { bookingService } from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';

const BookingConfirmation = ({ 
  stationSelection, 
  selectedItems, 
  contactInfo, 
  uploadedImages, 
  onBookingComplete 
}) => {
  const { token } = useAuth();
  const [currentStep, setCurrentStep] = useState('review'); // review, payment, processing, success
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [error, setError] = useState(null);

  // Debug logging
  console.log('BookingConfirmation props:', {
    stationSelection,
    selectedItems,
    contactInfo,
    uploadedImages
  });
  

  // Check if required data is available
  if (!stationSelection || !stationSelection.sourceStation || !stationSelection.destinationStation) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 dark:text-red-400 mb-4">
          <Package className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Missing Station Information</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Please go back and select your source and destination stations.
          </p>
        </div>
      </div>
    );
  }

  const bookingSummary = bookingService.generateBookingSummary({
    sourceStation: stationSelection.sourceStation,
    destinationStation: stationSelection.destinationStation,
    distance: stationSelection.distance,
    securityItems: selectedItems || [],
    luggageImages: uploadedImages || []
  });

  const handleCreateBooking = async () => {
    try {
      setIsProcessing(true);
      setError(null);
      setCurrentStep('processing');
      
      console.log('Starting booking creation...');

      // Format booking data
          const bookingData = bookingService.formatBookingData(
      stationSelection,
      selectedItems,
      contactInfo,
      uploadedImages,
      paymentMethod
    );

      // Validate booking data
      const validation = bookingService.validateBookingData(bookingData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Create booking
      const bookingResponse = await bookingService.createBooking(token, bookingData);
      
      if (!bookingResponse.success) {
        throw new Error(bookingResponse.message || 'Failed to create booking');
      }

      // Process payment
      const paymentResponse = await bookingService.processPayment(
        token,
        bookingResponse.data.booking.bookingId,
        {
          paymentMethod,
          paymentDetails: {
            // Mock payment details
            cardNumber: '****-****-****-1234',
            expiryDate: '12/26',
            cvv: '***'
          }
        }
      );

      if (!paymentResponse.success) {
        throw new Error(paymentResponse.message || 'Payment failed');
      }

      setBookingResult({
        booking: bookingResponse.data.booking,
        payment: paymentResponse.data
      });
      setCurrentStep('success');

      // Notify parent component
      onBookingComplete?.(bookingResponse.data.booking);

    } catch (error) {
      console.error('Booking creation failed:', error);
      setError(error.message || 'An unexpected error occurred');
      setCurrentStep('review');
    } finally {
      setIsProcessing(false);
      console.log('Booking creation process completed');
    }
  };

  const copyBookingId = () => {
    if (bookingResult?.booking?.bookingId) {
      navigator.clipboard.writeText(bookingResult.booking.bookingId);
      // Could add a toast notification here
    }
  };

  const BookingReview = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Review Your Booking</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please review all details before proceeding with payment
        </p>
      </div>

      {/* Route Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-blue-600" />
          Journey Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">From</div>
            <div className="font-medium text-gray-900 dark:text-white">{stationSelection.sourceStation.name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">({stationSelection.sourceStation.code})</div>
          </div>
          <div className="text-center flex items-center justify-center">
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">To</div>
            <div className="font-medium text-gray-900 dark:text-white">{stationSelection.destinationStation.name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">({stationSelection.destinationStation.code})</div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <div className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4 mr-1" />
            Estimated delivery: {bookingSummary.deliveryTime}
          </div>
        </div>
      </div>



      {/* Security Items */}
      {selectedItems.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-yellow-600" />
            Security Checklist ({bookingSummary.securityItemsCount} items)
          </h3>
          <div className="space-y-2">
            {selectedItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2">
                <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
                {item.estimatedValue > 0 && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {bookingService.formatCurrency(item.estimatedValue)}
                  </span>
                )}
              </div>
            ))}
          </div>
          {bookingSummary.totalEstimatedValue > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
              <div className="flex justify-between font-medium">
                <span className="text-gray-700 dark:text-gray-300">Total Estimated Value</span>
                <span className="text-gray-900 dark:text-white">
                  {bookingService.formatCurrency(bookingSummary.totalEstimatedValue)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Contact Information */}
      {contactInfo && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Mail className="w-5 h-5 mr-2 text-purple-600" />
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Phone</div>
            <div className="font-medium text-gray-900 dark:text-white">{contactInfo.phone}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Email</div>
            <div className="font-medium text-gray-900 dark:text-white">{contactInfo.email}</div>
          </div>
          <div className="md:col-span-2">
            <div className="text-sm text-gray-500 dark:text-gray-400">Address</div>
            <div className="font-medium text-gray-900 dark:text-white">
              {[
                contactInfo.address.street,
                contactInfo.address.city,
                contactInfo.address.state,
                contactInfo.address.pincode
              ].filter(Boolean).join(', ')}
            </div>
          </div>
        </div>
        </div>
      )}


      {/* Payment Method Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: 'card', label: 'Credit/Debit Card', icon: '💳' },
            { id: 'upi', label: 'UPI', icon: '📱' },
            { id: 'netbanking', label: 'Net Banking', icon: '🏦' }
          ].map((method) => (
            <button
              key={method.id}
              onClick={() => setPaymentMethod(method.id)}
              className={`p-4 rounded-lg border text-center transition-all ${
                paymentMethod === method.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-900 dark:text-white'
              }`}
            >
              <div className="text-2xl mb-2">{method.icon}</div>
              <div className="text-sm font-medium">{method.label}</div>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="text-red-800 dark:text-red-200">{error}</div>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-end">
          <button
            onClick={handleCreateBooking}
            disabled={isProcessing}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Pay/Book'}
          </button>
        </div>
      </div>
    </div>
  );

  const ProcessingStep = () => (
    <div className="text-center py-12">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6"
      />
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Processing Your Booking</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-2">Please wait while we process your payment...</p>
      <p className="text-sm text-gray-500 dark:text-gray-500">This may take a few moments</p>
    </div>
  );

  const SuccessStep = () => (
    <div className="text-center space-y-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
      </motion.div>

      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Your luggage booking has been successfully created and payment processed.
        </p>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-blue-800 dark:text-blue-200 font-medium">
            📍 Please visit TravelLite store 30 minutes prior to your journey at the nearest store point
          </p>
        </div>
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
        <div className="text-center">
          <div className="text-sm text-green-700 dark:text-green-300 mb-2">Booking ID</div>
          <div className="text-2xl font-bold text-green-900 dark:text-green-100 mb-3 flex items-center justify-center">
            {bookingResult?.booking?.bookingId}
            <button
              onClick={copyBookingId}
              className="ml-2 p-1 hover:bg-green-200 dark:hover:bg-green-800 rounded"
              title="Copy Booking ID"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <div className="text-sm text-green-700 dark:text-green-300">
            Transaction ID: {bookingResult?.payment?.transactionId}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Package className="w-5 h-5 mr-2 text-blue-600" />
            Next Steps
          </h3>
          <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium mr-3">1</span>
              Visit TravelLite counter at {stationSelection.sourceStation.name}
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium mr-3">2</span>
              Show your booking ID: {bookingResult?.booking?.bookingId}
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium mr-3">3</span>
              Our staff will verify and pack your luggage
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium mr-3">4</span>
              Collect at {stationSelection.destination.name}
            </li>
          </ol>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Mail className="w-5 h-5 mr-2 text-green-600" />
            Confirmations Sent
          </h3>
          <div className="space-y-3">
            {bookingResult?.payment?.confirmationSent?.email && (
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="w-4 h-4 mr-2" />
                Email sent to {contactInfo.email}
              </div>
            )}
            {bookingResult?.payment?.confirmationSent?.sms && (
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="w-4 h-4 mr-2" />
                SMS sent to {contactInfo.phone}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={() => window.open(`/track/${bookingResult?.booking?.bookingId}`, '_blank')}
          className="btn-secondary flex items-center"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Track Booking
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="btn-primary"
        >
          Book Another Trip
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {currentStep === 'review' && <BookingReview />}
      {currentStep === 'processing' && <ProcessingStep />}
      {currentStep === 'success' && <SuccessStep />}
    </div>
  );
};

export default BookingConfirmation;
