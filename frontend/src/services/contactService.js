const API_BASE_URL = 'http://localhost:5000/api';

class ContactService {
  async getContactInfo(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/contact`, {
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
      console.error('Error fetching contact info:', error);
      throw error;
    }
  }

  async updateContactInfo(token, contactData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/contact`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating contact info:', error);
      throw error;
    }
  }

  async validateAddress(addressData) {
    try {
      const response = await fetch(`${API_BASE_URL}/utils/validate-address`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error validating address:', error);
      throw error;
    }
  }

  // Indian states for dropdown
  getIndianStates() {
    return [
      'Andhra Pradesh',
      'Arunachal Pradesh',
      'Assam',
      'Bihar',
      'Chhattisgarh',
      'Goa',
      'Gujarat',
      'Haryana',
      'Himachal Pradesh',
      'Jharkhand',
      'Karnataka',
      'Kerala',
      'Madhya Pradesh',
      'Maharashtra',
      'Manipur',
      'Meghalaya',
      'Mizoram',
      'Nagaland',
      'Odisha',
      'Punjab',
      'Rajasthan',
      'Sikkim',
      'Tamil Nadu',
      'Telangana',
      'Tripura',
      'Uttar Pradesh',
      'Uttarakhand',
      'West Bengal',
      'Andaman and Nicobar Islands',
      'Chandigarh',
      'Dadra and Nagar Haveli and Daman and Diu',
      'Delhi',
      'Jammu and Kashmir',
      'Ladakh',
      'Lakshadweep',
      'Puducherry'
    ];
  }

  // Relationship options for emergency contact
  getRelationshipOptions() {
    return [
      { value: 'family', label: 'Family Member' },
      { value: 'friend', label: 'Friend' },
      { value: 'colleague', label: 'Colleague' },
      { value: 'neighbor', label: 'Neighbor' },
      { value: 'other', label: 'Other' }
    ];
  }

  // Validate Indian phone number
  validateIndianPhone(phone) {
    const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;
    return phoneRegex.test(phone.replace(/[\s\-]/g, ''));
  }

  // Validate Indian pincode
  validateIndianPincode(pincode) {
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    return pincodeRegex.test(pincode);
  }

  // Format phone number for display
  formatPhoneNumber(phone) {
    if (!phone) return '';
    
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');
    
    // Handle different formats
    if (cleaned.startsWith('91') && cleaned.length === 12) {
      // +91 XXXXX XXXXX format
      return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
    } else if (cleaned.length === 10) {
      // XXXXX XXXXX format
      return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    
    return phone; // Return original if format doesn't match
  }
}

export const contactService = new ContactService();
