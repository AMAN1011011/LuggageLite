import { useState, useEffect, useCallback, useRef, memo } from 'react';
import { Phone, MapPin, User, AlertCircle } from 'lucide-react';
import { contactService } from '../../services/contactService';
import { useAuth } from '../../context/AuthContext';

const ContactInformationForm = ({ onContactChange, initialData = null }) => {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [contactInfo, setContactInfo] = useState({
    phone: '',
    email: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    emergencyContact: {
      name: '',
      phone: '',
      relationship: '',
      address: {
        street: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India'
      }
    }
  });



  useEffect(() => {
    if (initialData) {
      setContactInfo(prev => ({
        ...prev,
        ...initialData
      }));
    } else if (user) {
      // Load existing contact info
      loadContactInfo();
    }
  }, [initialData, user]);

  // Debounced contact change handler to prevent excessive re-renders
  const debouncedContactChange = useRef(null);
  const lastNotifiedContactInfo = useRef(null);
  
  const debouncedOnContactChange = useCallback((info) => {
    // Only notify if the data has actually changed
    if (JSON.stringify(lastNotifiedContactInfo.current) === JSON.stringify(info)) {
      return;
    }
    
    if (debouncedContactChange.current) {
      clearTimeout(debouncedContactChange.current);
    }
    debouncedContactChange.current = setTimeout(() => {
      lastNotifiedContactInfo.current = info;
      onContactChange?.(info);
    }, 500); // Increased to 500ms debounce
  }, [onContactChange]);

  // Only notify parent on blur or when form is submitted, not on every keystroke
  const notifyParent = useCallback(() => {
    onContactChange?.(contactInfo);
  }, [contactInfo, onContactChange]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debouncedContactChange.current) {
        clearTimeout(debouncedContactChange.current);
      }
    };
  }, []);

  const loadContactInfo = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await contactService.getContactInfo(token);
      if (response.success) {
        setContactInfo(prev => ({
          ...prev,
          ...response.data
        }));
      }
    } catch (error) {
      console.error('Error loading contact info:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateField = async (fieldName, value) => {
    const newErrors = { ...errors };
    let isValid = true;

    switch (fieldName) {
      case 'phone':
      case 'emergencyPhone':
        if (!value) {
          newErrors[fieldName] = 'Phone number is required';
          isValid = false;
        } else if (!contactService.validateIndianPhone(value)) {
          newErrors[fieldName] = 'Invalid Indian phone number format';
          isValid = false;
        } else {
          delete newErrors[fieldName];
        }
        break;

      case 'email':
        if (!value) {
          newErrors[fieldName] = 'Email address is required';
          isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors[fieldName] = 'Invalid email format';
          isValid = false;
        } else {
          delete newErrors[fieldName];
        }
        break;



      default:
        if (!value && ['street', 'city', 'state', 'emergencyName', 'email'].includes(fieldName)) {
          newErrors[fieldName] = 'This field is required';
          isValid = false;
        } else {
          delete newErrors[fieldName];
        }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (section, field, value) => {
    if (section) {
      setContactInfo(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setContactInfo(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Validate field (only for phone numbers, not addresses)
    if (field === 'phone' || (section === 'emergencyContact' && field === 'phone')) {
      const fieldKey = section ? `${section === 'emergencyContact' ? 'emergency' : section}${field.charAt(0).toUpperCase() + field.slice(1)}` : field;
      validateField(fieldKey, value);
    }
  };

  const handleInputBlur = () => {
    // Notify parent when user finishes editing a field
    notifyParent();
  };




  const indianStates = contactService.getIndianStates();
  const relationshipOptions = contactService.getRelationshipOptions();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading contact information...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">


      {/* General Error */}
      {errors.general && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-800 dark:text-red-200">{errors.general}</p>
          </div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Primary Contact Information */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Phone className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Primary Contact</h3>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number *
            </label>
                          <input
                type="tel"
                value={contactInfo.phone}
                onChange={(e) => handleInputChange(null, 'phone', e.target.value)}
                onBlur={handleInputBlur}
                placeholder="+91 98765 43210"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
            {errors.phone && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={contactInfo.email}
              onChange={(e) => handleInputChange(null, 'email', e.target.value)}
              onBlur={handleInputBlur}
              placeholder="your.email@example.com"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.email && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Primary Address */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium text-gray-900 dark:text-white">Primary Address</h4>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Street Address *
              </label>
              <textarea
                value={contactInfo.address.street}
                onChange={(e) => handleInputChange('address', 'street', e.target.value)}
                onBlur={handleInputBlur}
                placeholder="Enter your complete street address"
                rows={2}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.street ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.street && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.street}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={contactInfo.address.city}
                  onChange={(e) => handleInputChange('address', 'city', e.target.value)}
                  placeholder="City"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.city ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.city && (
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pincode *
                </label>
                <input
                  type="text"
                  value={contactInfo.address.pincode}
                  onChange={(e) => handleInputChange('address', 'pincode', e.target.value)}
                  placeholder="400001"
                  maxLength={6}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.pincode ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.pincode && (
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.pincode}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                State *
              </label>
              <select
                value={contactInfo.address.state}
                onChange={(e) => handleInputChange('address', 'state', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.state ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <option value="">Select State</option>
                {indianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              {errors.state && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.state}</p>
              )}
            </div>


          </div>
        </div>

        {/* Emergency Contact */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Emergency Contact</h3>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            This person will be contacted if there are any issues with your luggage delivery.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name *
              </label>
              <input
                type="text"
                value={contactInfo.emergencyContact.name}
                onChange={(e) => handleInputChange('emergencyContact', 'name', e.target.value)}
                placeholder="Emergency contact name"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.emergencyName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.emergencyName && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.emergencyName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Relationship
              </label>
              <select
                value={contactInfo.emergencyContact.relationship}
                onChange={(e) => handleInputChange('emergencyContact', 'relationship', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select relationship</option>
                {relationshipOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={contactInfo.emergencyContact.phone}
              onChange={(e) => handleInputChange('emergencyContact', 'phone', e.target.value)}
              placeholder="+91 98765 43210"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                errors.emergencyPhone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.emergencyPhone && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.emergencyPhone}</p>
            )}
          </div>

          {/* Emergency Address */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white">Emergency Delivery Address</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Address where luggage should be delivered if you're not available at destination.
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Street Address
              </label>
              <textarea
                value={contactInfo.emergencyContact.address.street}
                onChange={(e) => handleInputChange('emergencyContact', 'address', { ...contactInfo.emergencyContact.address, street: e.target.value })}
                placeholder="Emergency delivery address"
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={contactInfo.emergencyContact.address.city}
                  onChange={(e) => handleInputChange('emergencyContact', 'address', { ...contactInfo.emergencyContact.address, city: e.target.value })}
                  placeholder="City"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pincode
                </label>
                <input
                  type="text"
                  value={contactInfo.emergencyContact.address.pincode}
                  onChange={(e) => handleInputChange('emergencyContact', 'address', { ...contactInfo.emergencyContact.address, pincode: e.target.value })}
                  placeholder="400001"
                  maxLength={6}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.emergencyPincode ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.emergencyPincode && (
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.emergencyPincode}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                State
              </label>
              <select
                value={contactInfo.emergencyContact.address.state}
                onChange={(e) => handleInputChange('emergencyContact', 'address', { ...contactInfo.emergencyContact.address, state: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select State</option>
                {indianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>


          </div>
        </div>
      </div>

    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(ContactInformationForm);
