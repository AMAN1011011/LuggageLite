import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Package, 
  User, 
  Phone, 
  MapPin, 
  CreditCard, 
  Shield,
  Camera,
  CheckCircle,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { counterService } from '../../services/counterService';

const LuggageAcceptanceModal = ({ booking, operationType, isOpen, onClose, onSuccess, staffToken }) => {
  const [formData, setFormData] = useState({
    verificationNotes: '',
    actualWeight: '',
    actualDimensions: '',
    customerPresent: true,
    idVerified: false,
    luggageInspected: false,
    photosVerified: false
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  if (!booking) return null;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError(null);
  };

  const handleAcceptLuggage = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      // Validate required checks
      if (!formData.idVerified || !formData.luggageInspected || !formData.photosVerified) {
        throw new Error('Please complete all verification steps before accepting luggage');
      }

      const acceptanceData = {
        verificationNotes: formData.verificationNotes,
        actualWeight: formData.actualWeight ? parseFloat(formData.actualWeight) : null,
        actualDimensions: formData.actualDimensions || null,
        customerPresent: formData.customerPresent,
        verificationChecks: {
          idVerified: formData.idVerified,
          luggageInspected: formData.luggageInspected,
          photosVerified: formData.photosVerified
        }
      };

      const response = await counterService.acceptLuggage(staffToken, booking.bookingId, acceptanceData);

      if (response.success) {
        onSuccess?.(response.data);
        onClose();
      } else {
        throw new Error(response.message || 'Failed to accept luggage');
      }
    } catch (error) {
      console.error('Error accepting luggage:', error);
      setError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const bookingSummary = counterService.generateBookingSummary(booking);
  const operationInfo = counterService.getOperationTypeInfo(operationType);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={onClose}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${operationInfo.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/20' : 'bg-green-100 dark:bg-green-900/20'}`}>
                    <Package className={`w-6 h-6 ${operationInfo.color === 'blue' ? 'text-blue-600' : 'text-green-600'}`} />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {operationInfo.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Booking ID: {booking.bookingId}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Booking Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Customer Information */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Customer Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Name:</span>
                      <span className="text-gray-900 dark:text-white">{bookingSummary.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                      <span className="text-gray-900 dark:text-white">{bookingSummary.customerPhone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Status:</span>
                      <span className={`font-medium ${bookingSummary.status.color === 'blue' ? 'text-blue-600' : 'text-green-600'}`}>
                        {bookingSummary.status.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Journey Information */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Journey Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Route:</span>
                      <span className="text-gray-900 dark:text-white">{bookingSummary.route}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Distance:</span>
                      <span className="text-gray-900 dark:text-white">{bookingSummary.distance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                      <span className="text-green-600 font-medium">{bookingSummary.totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Items */}
              {bookingSummary.securityItemsCount > 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2 flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Security Items ({bookingSummary.securityItemsCount})
                  </h4>
                  <div className="space-y-1">
                    {booking.securityItems.map((item, index) => (
                      <div key={index} className="text-sm text-yellow-800 dark:text-yellow-200">
                        • {item.name} {item.estimatedValue > 0 && `(₹${item.estimatedValue})`}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Luggage Images */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                  <Camera className="w-4 h-4 mr-2" />
                  Luggage Photos ({bookingSummary.imagesCount}/4)
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {booking.luggageImages?.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image.url || image.dataUrl}
                        alt={`Luggage ${image.angle} view`}
                        className="w-full h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                      />
                      <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                        {image.angle}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verification Form */}
              <form onSubmit={handleAcceptLuggage} className="space-y-4">
                {/* Verification Checklist */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3">
                    Verification Checklist
                  </h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="idVerified"
                        checked={formData.idVerified}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-blue-800 dark:text-blue-200">
                        Customer ID verified and matches booking
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="luggageInspected"
                        checked={formData.luggageInspected}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-blue-800 dark:text-blue-200">
                        Luggage physically inspected and matches photos
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="photosVerified"
                        checked={formData.photosVerified}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-blue-800 dark:text-blue-200">
                        All 4 angle photos verified against physical luggage
                      </span>
                    </label>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="actualWeight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Actual Weight (kg)
                    </label>
                    <input
                      type="number"
                      id="actualWeight"
                      name="actualWeight"
                      value={formData.actualWeight}
                      onChange={handleInputChange}
                      step="0.1"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <label htmlFor="actualDimensions" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Actual Dimensions
                    </label>
                    <input
                      type="text"
                      id="actualDimensions"
                      name="actualDimensions"
                      value={formData.actualDimensions}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="e.g., 60x40x25 cm"
                    />
                  </div>
                </div>

                {/* Verification Notes */}
                <div>
                  <label htmlFor="verificationNotes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Verification Notes
                  </label>
                  <textarea
                    id="verificationNotes"
                    name="verificationNotes"
                    value={formData.verificationNotes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Any additional notes about the luggage acceptance..."
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-center">
                    <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 mr-2 flex-shrink-0" />
                    <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing || !formData.idVerified || !formData.luggageInspected || !formData.photosVerified}
                    className="px-6 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400 rounded-lg transition-colors flex items-center"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Accept Luggage
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LuggageAcceptanceModal;
