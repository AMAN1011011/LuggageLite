import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { buttonPrimary } from '../../utils/animations';

const AnimatedButton = ({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  onClick,
  type = 'button',
  animationType = 'default',
  ...props
}) => {
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  // Variant styles
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-sm hover:shadow-md',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500 dark:border-blue-400 dark:text-blue-400',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-800',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 shadow-sm hover:shadow-md',
    warning: 'bg-orange-600 hover:bg-orange-700 text-white focus:ring-orange-500 shadow-sm hover:shadow-md',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-sm hover:shadow-md',
    gradient: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white focus:ring-blue-500 shadow-sm hover:shadow-md'
  };

  // Size styles
  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  // Animation variants
  const animationVariants = {
    default: buttonPrimary,
    bounce: {
      whileHover: { 
        scale: 1.05,
        y: -2,
        transition: { type: "spring", stiffness: 400, damping: 10 }
      },
      whileTap: { scale: 0.95, y: 0 }
    },
    glow: {
      whileHover: {
        boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
        scale: 1.02,
        transition: { duration: 0.2 }
      },
      whileTap: { scale: 0.98 }
    },
    slide: {
      whileHover: {
        x: 5,
        transition: { type: "spring", stiffness: 400 }
      },
      whileTap: { x: 0, scale: 0.98 }
    },
    rotate: {
      whileHover: {
        rotate: 2,
        scale: 1.02,
        transition: { type: "spring", stiffness: 400 }
      },
      whileTap: { rotate: 0, scale: 0.98 }
    },
    float: {
      whileHover: {
        y: -3,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: { type: "spring", stiffness: 400, damping: 10 }
      },
      whileTap: { y: 0, scale: 0.98 }
    },
    pulse: {
      animate: loading ? {
        scale: [1, 1.05, 1],
        transition: { duration: 1.5, repeat: Infinity }
      } : {},
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 }
    }
  };

  // Loading animation
  const loadingSpinner = (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
      className="mr-2"
    >
      <Loader2 className="w-4 h-4" />
    </motion.div>
  );

  // Icon with animation
  const renderIcon = () => {
    if (loading) return loadingSpinner;
    if (!Icon) return null;

    return (
      <motion.div
        className={iconPosition === 'left' ? 'mr-2' : 'ml-2'}
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <Icon className="w-4 h-4" />
      </motion.div>
    );
  };

  // Ripple effect
  const RippleEffect = () => (
    <motion.div
      className="absolute inset-0 rounded-lg overflow-hidden"
      whileTap={{
        background: "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)"
      }}
      transition={{ duration: 0.3 }}
    />
  );

  // Shimmer effect for loading state
  const ShimmerEffect = () => (
    <motion.div
      className="absolute inset-0 rounded-lg overflow-hidden"
      animate={loading ? {
        background: [
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)"
        ],
        backgroundPosition: ["-200px 0", "200px 0"]
      } : {}}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );

  const buttonClasses = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${loading ? 'cursor-wait' : ''}
    ${className}
  `.trim();

  return (
    <motion.button
      type={type}
      className={`relative ${buttonClasses}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...animationVariants[animationType]}
      {...props}
    >
      {/* Background effects */}
      <RippleEffect />
      {loading && <ShimmerEffect />}
      
      {/* Content */}
      <div className="flex items-center justify-center relative z-10">
        {iconPosition === 'left' && renderIcon()}
        
        <motion.span
          animate={loading ? { opacity: 0.7 } : { opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.span>
        
        {iconPosition === 'right' && renderIcon()}
      </div>

      {/* Loading overlay */}
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Loader2 className="w-4 h-4" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </motion.button>
  );
};

// Specialized button components
export const PrimaryButton = (props) => (
  <AnimatedButton variant="primary" {...props} />
);

export const SecondaryButton = (props) => (
  <AnimatedButton variant="secondary" {...props} />
);

export const OutlineButton = (props) => (
  <AnimatedButton variant="outline" {...props} />
);

export const GhostButton = (props) => (
  <AnimatedButton variant="ghost" {...props} />
);

export const SuccessButton = (props) => (
  <AnimatedButton variant="success" {...props} />
);

export const DangerButton = (props) => (
  <AnimatedButton variant="danger" {...props} />
);

export const GradientButton = (props) => (
  <AnimatedButton variant="gradient" animationType="glow" {...props} />
);

export const FloatingActionButton = ({ icon: Icon, onClick, className = '', ...props }) => (
  <motion.button
    onClick={onClick}
    className={`fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center z-50 ${className}`}
    whileHover={{ 
      scale: 1.1,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
    }}
    whileTap={{ scale: 0.95 }}
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0, opacity: 0 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
    {...props}
  >
    <Icon className="w-6 h-6" />
  </motion.button>
);

export default AnimatedButton;
