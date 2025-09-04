import { useState, useEffect, useCallback } from 'react';
import { Upload, X, Camera, CheckCircle, AlertCircle, Loader2, RotateCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { imageService } from '../../services/imageService';
import { useAuth } from '../../context/AuthContext';

const ImageUploadComponent = ({ onImagesChange, initialImages = [] }) => {
  const { token } = useAuth();
  const [images, setImages] = useState({});
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [dragOver, setDragOver] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});

  const requiredAngles = imageService.getRequiredAngles();

  useEffect(() => {
    if (initialImages.length > 0) {
      const imageMap = {};
      initialImages.forEach(img => {
        imageMap[img.angle] = img;
      });
      setImages(imageMap);
    } else if (token) {
      loadUserImages();
    }
  }, [initialImages, token]);

  useEffect(() => {
    // Notify parent of changes
    const imageArray = Object.values(images).filter(img => img);
    onImagesChange?.(imageArray);
  }, [images, onImagesChange]);

  const loadUserImages = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await imageService.getUserImages(token);
      if (response.success && response.data.images.length > 0) {
        const imageMap = {};
        response.data.images.forEach(img => {
          imageMap[img.angle] = img;
        });
        setImages(imageMap);
      }
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = useCallback(async (files, angle) => {
    const file = files[0];
    if (!file) return;

    // Validate file
    const validation = imageService.validateFile(file);
    if (!validation.valid) {
      setErrors(prev => ({ ...prev, [angle]: validation.errors[0] }));
      return;
    }

    try {
      setUploadProgress(prev => ({ ...prev, [angle]: 0 }));
      setErrors(prev => ({ ...prev, [angle]: null }));

      // Process image
      const processedImage = await imageService.processImageFile(file, angle);
      
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(prev => ({ ...prev, [angle]: i }));
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Add to images
      setImages(prev => ({
        ...prev,
        [angle]: {
          ...processedImage,
          id: `temp_${angle}_${Date.now()}`,
          uploaded: false,
          url: processedImage.dataUrl
        }
      }));

      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[angle];
        return newProgress;
      });
    } catch (error) {
      setErrors(prev => ({ ...prev, [angle]: 'Failed to process image' }));
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[angle];
        return newProgress;
      });
    }
  }, []);

  const handleDrop = useCallback((e, angle) => {
    e.preventDefault();
    setDragOver(null);
    
    const files = Array.from(e.dataTransfer.files);
    handleFileSelect(files, angle);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e, angle) => {
    e.preventDefault();
    setDragOver(angle);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(null);
  }, []);

  const removeImage = useCallback(async (angle) => {
    const image = images[angle];
    
    if (image && image.uploaded && image.id) {
      try {
        await imageService.deleteImage(token, image.id);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    setImages(prev => {
      const newImages = { ...prev };
      delete newImages[angle];
      return newImages;
    });
    setErrors(prev => ({ ...prev, [angle]: null }));
  }, [images, token]);

  const uploadAllImages = async () => {
    const imagesToUpload = Object.values(images).filter(img => img && !img.uploaded);
    
    if (imagesToUpload.length !== 4) {
      setErrors(prev => ({ ...prev, general: 'Please add all 4 images before uploading' }));
      return;
    }

    try {
      setUploading(true);
      setErrors(prev => ({ ...prev, general: null }));

      // Convert images for upload
      const uploadData = imagesToUpload.map(img => ({
        angle: img.angle,
        originalName: img.originalName,
        size: img.size,
        format: img.format,
        width: img.width,
        height: img.height,
        data: img.dataUrl // In real app, this would be handled differently
      }));

      const response = await imageService.uploadImages(token, uploadData);
      
      if (response.success) {
        // Update images with server response but preserve original dataUrl
        const updatedImages = {};
        response.data.images.forEach(img => {
          // Find the original image to preserve its dataUrl
          const originalImage = images[img.angle];
          updatedImages[img.angle] = { 
            ...img, 
            uploaded: true,
            // Preserve the original dataUrl for display
            dataUrl: originalImage?.dataUrl || img.dataUrl
          };
        });
        setImages(updatedImages);
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, general: error.message }));
    } finally {
      setUploading(false);
    }
  };

  const getUploadedCount = () => {
    return Object.values(images).filter(img => img).length;
  };

  const isComplete = () => {
    return getUploadedCount() === 4;
  };

  const ImageSlot = ({ angle }) => {
    const angleInfo = requiredAngles.find(a => a.id === angle);
    const image = images[angle];
    const error = errors[angle];
    const progress = uploadProgress[angle];
    const isDragOver = dragOver === angle;
    const isProcessing = progress !== null && progress !== undefined;

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{angleInfo.icon}</span>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">{angleInfo.label}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{angleInfo.description}</p>
          </div>
        </div>

        <div
          className={`relative border-2 border-dashed rounded-lg transition-all duration-200 ${
            isDragOver
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : image
              ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
              : error
              ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
              : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800'
          } ${!image && !isProcessing ? 'hover:border-gray-400 dark:hover:border-gray-500' : ''}`}
          style={{ aspectRatio: '4/3', minHeight: '200px' }}
          onDrop={(e) => handleDrop(e, angle)}
          onDragOver={(e) => handleDragOver(e, angle)}
          onDragLeave={handleDragLeave}
        >
          {!image ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              {isProcessing ? (
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Processing... {progress}%</p>
                </div>
              ) : (
                <>
                  <Camera className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-center text-gray-600 dark:text-gray-400 mb-2">
                    Drag & drop or click to upload
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    JPEG, PNG, WebP (max 5MB)
                  </p>
                </>
              )}
              
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={(e) => handleFileSelect(e.target.files, angle)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isProcessing}
              />
            </div>
          ) : (
            <div className="relative h-full">
              <img
                src={image.url || image.dataUrl}
                alt={`Luggage ${angle} view`}
                className="w-full h-full object-cover rounded-lg"
              />
              
              {/* Remove button */}
              <button
                onClick={() => removeImage(angle)}
                className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              
              {/* Upload status */}
              <div className="absolute bottom-2 left-2">
                {image.uploaded ? (
                  <div className="flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded text-xs">
                    <CheckCircle className="w-3 h-3" />
                    Uploaded
                  </div>
                ) : (
                  <div className="flex items-center gap-1 bg-yellow-500 text-white px-2 py-1 rounded text-xs">
                    <Upload className="w-3 h-3" />
                    Ready
                  </div>
                )}
              </div>
              
              {/* Image info */}
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                {imageService.formatFileSize(image.size)}
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading images...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Luggage Photos</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Upload 4 clear photos of your luggage from different angles for transparency
        </p>
      </div>

      {/* Progress */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
            Upload Progress
          </span>
          <span className="text-sm text-blue-600 dark:text-blue-400">
            {getUploadedCount()}/4 photos
          </span>
        </div>
        <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(getUploadedCount() / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Error Message */}
      {errors.general && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-800 dark:text-red-200">{errors.general}</p>
          </div>
        </div>
      )}

      {/* Image Upload Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {requiredAngles.map((angle) => (
          <ImageSlot key={angle.id} angle={angle.id} />
        ))}
      </div>

      {/* Upload All Button */}
      {getUploadedCount() === 4 && !Object.values(images).every(img => img?.uploaded) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <button
            onClick={uploadAllImages}
            disabled={uploading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload All Images
              </>
            )}
          </button>
        </motion.div>
      )}

      {/* Completion Status */}
      {isComplete() && Object.values(images).every(img => img?.uploaded) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center"
        >
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
            All Photos Uploaded!
          </h3>
          <p className="text-green-700 dark:text-green-300">
            Your luggage photos have been successfully uploaded and are ready for booking.
          </p>
        </motion.div>
      )}

      {/* Guidelines */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Photo Guidelines:</h4>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Take clear, well-lit photos from each required angle</li>
          <li>• Ensure your luggage is the main subject in each photo</li>
          <li>• Use JPEG, PNG, or WebP format (max 5MB per image)</li>
          <li>• Photos will be used for verification at pickup/delivery</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageUploadComponent;
