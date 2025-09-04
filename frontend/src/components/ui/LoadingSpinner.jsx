import { motion } from 'framer-motion';
import { Loader2, Package, Plane } from 'lucide-react';

const LoadingSpinner = ({ 
  size = 'medium', 
  type = 'spinner', 
  text = 'Loading...', 
  showText = true,
  color = 'blue' 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xl: 'text-xl'
  };

  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    orange: 'text-orange-600',
    purple: 'text-purple-600',
    gray: 'text-gray-600'
  };

  // Spinner animation
  const spinnerAnimation = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  // Dots animation
  const dotsContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2,
        repeat: Infinity,
        repeatDelay: 0.5
      }
    }
  };

  const dotAnimation = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 0.6,
        ease: "easeInOut"
      }
    }
  };

  // Pulse animation
  const pulseAnimation = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [1, 0.7, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Travel-themed animations
  const packageAnimation = {
    animate: {
      y: [0, -8, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const planeAnimation = {
    animate: {
      x: [0, 10, 0],
      y: [0, -5, 0],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Wave animation
  const waveContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
        repeat: Infinity,
        repeatDelay: 0.3
      }
    }
  };

  const waveBar = {
    animate: {
      scaleY: [1, 2, 1],
      transition: {
        duration: 0.8,
        ease: "easeInOut"
      }
    }
  };

  const renderSpinner = () => {
    switch (type) {
      case 'dots':
        return (
          <motion.div
            className="flex space-x-1"
            variants={dotsContainer}
            animate="animate"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={`w-2 h-2 rounded-full bg-current ${colorClasses[color]}`}
                variants={dotAnimation}
              />
            ))}
          </motion.div>
        );

      case 'pulse':
        return (
          <motion.div
            className={`${sizeClasses[size]} rounded-full border-2 border-current ${colorClasses[color]}`}
            variants={pulseAnimation}
            animate="animate"
          />
        );

      case 'package':
        return (
          <motion.div
            className={`${colorClasses[color]}`}
            variants={packageAnimation}
            animate="animate"
          >
            <Package className={sizeClasses[size]} />
          </motion.div>
        );

      case 'plane':
        return (
          <motion.div
            className={`${colorClasses[color]}`}
            variants={planeAnimation}
            animate="animate"
          >
            <Plane className={sizeClasses[size]} />
          </motion.div>
        );

      case 'wave':
        return (
          <motion.div
            className="flex items-end space-x-1"
            variants={waveContainer}
            animate="animate"
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className={`w-1 h-4 bg-current rounded-full ${colorClasses[color]}`}
                variants={waveBar}
              />
            ))}
          </motion.div>
        );

      case 'travel':
        return (
          <div className="relative">
            <motion.div
              className={`${colorClasses[color]} absolute`}
              variants={packageAnimation}
              animate="animate"
            >
              <Package className={sizeClasses[size]} />
            </motion.div>
            <motion.div
              className={`${colorClasses[color]} ml-8`}
              variants={planeAnimation}
              animate="animate"
            >
              <Plane className={sizeClasses[size]} />
            </motion.div>
          </div>
        );

      default:
        return (
          <motion.div
            className={`${colorClasses[color]}`}
            variants={spinnerAnimation}
            animate="animate"
          >
            <Loader2 className={sizeClasses[size]} />
          </motion.div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      {renderSpinner()}
      {showText && (
        <motion.p
          className={`${textSizeClasses[size]} text-gray-600 dark:text-gray-400 font-medium`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

// Skeleton loading component
export const SkeletonLoader = ({ 
  type = 'text', 
  count = 1, 
  className = '',
  animate = true 
}) => {
  const skeletonAnimation = animate ? {
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  } : {};

  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <motion.div
            className={`bg-gray-200 dark:bg-gray-700 rounded-lg p-4 ${className}`}
            {...skeletonAnimation}
          >
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
          </motion.div>
        );

      case 'circle':
        return (
          <motion.div
            className={`bg-gray-200 dark:bg-gray-700 rounded-full w-12 h-12 ${className}`}
            {...skeletonAnimation}
          />
        );

      case 'button':
        return (
          <motion.div
            className={`bg-gray-200 dark:bg-gray-700 rounded-lg h-10 w-24 ${className}`}
            {...skeletonAnimation}
          />
        );

      case 'image':
        return (
          <motion.div
            className={`bg-gray-200 dark:bg-gray-700 rounded-lg aspect-video ${className}`}
            {...skeletonAnimation}
          />
        );

      default:
        return (
          <motion.div
            className={`bg-gray-200 dark:bg-gray-700 rounded h-4 ${className}`}
            {...skeletonAnimation}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

// Page loading component
export const PageLoader = ({ message = "Loading TravelLite..." }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <LoadingSpinner 
            size="xl" 
            type="travel" 
            text={message}
            color="blue"
          />
        </div>
        
        {/* Progress bar */}
        <motion.div
          className="w-64 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="h-full bg-blue-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

// Button loading state
export const ButtonLoader = ({ size = 'medium', color = 'white' }) => {
  const sizeMap = {
    small: 'w-3 h-3',
    medium: 'w-4 h-4',
    large: 'w-5 h-5'
  };

  const colorMap = {
    white: 'text-white',
    blue: 'text-blue-600',
    gray: 'text-gray-600'
  };

  return (
    <motion.div
      className={`${colorMap[color]}`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      <Loader2 className={sizeMap[size]} />
    </motion.div>
  );
};

export default LoadingSpinner;
