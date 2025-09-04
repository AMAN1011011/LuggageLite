const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ImageService {
  async uploadImages(token, images) {
    try {
      const response = await fetch(`${API_BASE_URL}/images/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ images }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  }

  async getUserImages(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/images/user`, {
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
      console.error('Error fetching user images:', error);
      throw error;
    }
  }

  async deleteImage(token, imageId) {
    try {
      const response = await fetch(`${API_BASE_URL}/images/delete/${imageId}`, {
        method: 'DELETE',
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
      console.error('Error deleting image:', error);
      throw error;
    }
  }

  async validateImage(imageData) {
    try {
      const response = await fetch(`${API_BASE_URL}/utils/validate-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(imageData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error validating image:', error);
      throw error;
    }
  }

  // Client-side image processing utilities
  async processImageFile(file, angle) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Create canvas for compression
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Calculate dimensions (max 1200px)
          const maxSize = 1200;
          let { width, height } = img;
          
          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => {
              resolve({
                angle,
                originalName: file.name,
                size: blob.size,
                format: file.type.split('/')[1],
                width,
                height,
                dataUrl: canvas.toDataURL('image/jpeg', 0.8),
                blob,
                file: new File([blob], `luggage_${angle}.jpg`, { type: 'image/jpeg' })
              });
            },
            'image/jpeg',
            0.8
          );
        };
        img.src = e.target.result;
      };
      
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Convert file to base64 for mock upload
  async fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Validate file before processing
  validateFile(file) {
    const errors = [];
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      errors.push('Invalid file format. Please use JPEG, PNG, or WebP');
    }
    
    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      errors.push('File size must be less than 5MB');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Get required angles for luggage photos
  getRequiredAngles() {
    return [
      { 
        id: 'front', 
        label: 'Front View', 
        description: 'Clear front view of your luggage',
        icon: '📦'
      },
      { 
        id: 'back', 
        label: 'Back View', 
        description: 'Back side of your luggage',
        icon: '📦'
      },
      { 
        id: 'left', 
        label: 'Left Side', 
        description: 'Left side view of your luggage',
        icon: '📦'
      },
      { 
        id: 'right', 
        label: 'Right Side', 
        description: 'Right side view of your luggage',
        icon: '📦'
      }
    ];
  }

  // Format file size for display
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Generate thumbnail URL (mock)
  generateThumbnail(imageUrl) {
    return imageUrl.replace('/images/', '/thumbs/').replace('.jpg', '_thumb.jpg');
  }
}

export const imageService = new ImageService();
