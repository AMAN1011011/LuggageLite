import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Package, CreditCard, CheckCircle, Calculator, Shield, Phone } from 'lucide-react';
import { BookingStepIndicator } from '../ui/StepIndicator';
import AnimatedButton, { PrimaryButton, SecondaryButton } from '../ui/AnimatedButton';
import AnimatedCard from '../ui/AnimatedCard';
import LoadingSpinner, { PageLoader } from '../ui/LoadingSpinner';
import { useToast } from '../ui/Toast';
import StationSelector from '../stations/StationSelector';

import SecurityChecklist from '../checklist/SecurityChecklist';
import ContactInformationForm from '../contact/ContactInformationForm';
import ImageUploadComponent from '../images/ImageUploadComponent';
import BookingConfirmation from '../booking/BookingConfirmation';
import { useAuth } from '../../context/AuthContext';


const BookingPage = () => {
  const { isAuthenticated, user } = useAuth();
  const { showSuccess, showError, showWarning } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [stationSelection, setStationSelection] = useState(null);

  const [selectedItems, setSelectedItems] = useState([]);
  const [contactInfo, setContactInfo] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [completedBooking, setCompletedBooking] = useState(null);

  const steps = [
    { id: 1, title: 'Station Selection', icon: Calculator },
    { id: 2, title: 'Security Checklist', icon: Shield },
    { id: 3, title: 'Contact Information', icon: Phone },
    { id: 4, title: 'Luggage Photos', icon: Package },
    { id: 5, title: 'Confirmation & Payment', icon: CheckCircle }
  ];

  const handleStationSelectionChange = useCallback((selection) => {
    setStationSelection(prevSelection => {
      // Only update if the selection actually changed
      if (JSON.stringify(prevSelection) === JSON.stringify(selection)) {
        return prevSelection;
      }
      return selection;
    });
  }, []);



  const handleContinue = () => {
    if (currentStep === 1 && stationSelection?.isValid) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    } else if (currentStep === 4) {
      setCurrentStep(5);
    }
  };

  const handleBookingComplete = (booking) => {
    setCompletedBooking(booking);
    setBookingComplete(true);
  };

  const handleChecklistSelectionChange = useCallback((items) => {
    setSelectedItems(items);
  }, []);

  const handleContactInfoChange = useCallback((info) => {
    // Only update if the contact info has actually changed
    setContactInfo(prevInfo => {
      if (JSON.stringify(prevInfo) === JSON.stringify(info)) {
        return prevInfo; // Return same reference to prevent re-render
      }
      return info;
    });
  }, []);

  const handleImagesChange = useCallback((images) => {
    console.log('BookingPage - Images received:', images);
    setUploadedImages(images);
  }, []);

  const canProceed = () => {
    if (currentStep === 1) {
      return stationSelection?.isValid;
    } else if (currentStep === 2) {
      return true; // Can proceed from checklist step regardless of selections
    } else if (currentStep === 3) {
      return contactInfo && contactInfo.phone && contactInfo.address?.street; // Basic contact info required
    } else if (currentStep === 4) {
      return uploadedImages.length === 4 && uploadedImages.every(img => img.uploaded); // All 4 images uploaded
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <BookingStepIndicator 
            currentStep={currentStep}
            completedSteps={Array.from({ length: currentStep - 1 }, (_, i) => i)}
          />
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          {/* Authentication Check */}
          {!isAuthenticated && (
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-blue-600 dark:text-blue-400 text-sm">
                  <strong>Note:</strong> You'll need to sign in or create an account to complete your booking.
                </p>
              </div>
            </div>
          )}

          {/* Step Content */}
          <div className="p-6">
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <StationSelector
                  onSelectionChange={handleStationSelectionChange}
                />
                

              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <SecurityChecklist
                  selectedItems={selectedItems}
                  onSelectionChange={handleChecklistSelectionChange}
                />
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ContactInformationForm
                  onContactChange={handleContactInfoChange}
                />
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ImageUploadComponent
                  onImagesChange={handleImagesChange}
                />
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <BookingConfirmation
                  stationSelection={stationSelection}
                  selectedItems={selectedItems}
                  contactInfo={contactInfo}
                  uploadedImages={uploadedImages}
                  onBookingComplete={handleBookingComplete}
                />
              </motion.div>
            )}


          </div>

          {/* Navigation Buttons */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 rounded-b-xl border-t border-gray-200 dark:border-gray-600">
            <div className="flex justify-between items-center">
              <button
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Back
              </button>

              {currentStep < 5 && (
                <motion.button
                  onClick={handleContinue}
                  disabled={!canProceed()}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: canProceed() ? 1.02 : 1 }}
                  whileTap={{ scale: canProceed() ? 0.98 : 1 }}
                >
                  {currentStep === 1 ? 'Continue to Security Checklist' : 
                   currentStep === 2 ? 'Continue to Contact Information' :
                   currentStep === 3 ? 'Continue to Luggage Photos' :
                   currentStep === 4 ? 'Review & Pay' : 'Continue'}
                </motion.button>
              )}
            </div>
          </div>
        </div>





      </div>
    </div>
  );
};

export default BookingPage;
