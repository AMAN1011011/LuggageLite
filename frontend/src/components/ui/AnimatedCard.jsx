import { motion } from 'framer-motion';
import { cardInteractive } from '../../utils/animations';

const AnimatedCard = ({
  children,
  variant = 'default',
  size = 'medium',
  interactive = false,
  hoverable = true,
  clickable = false,
  loading = false,
  className = '',
  onClick,
  animationType = 'default',
  delay = 0,
  ...props
}) => {
  // Base styles
  const baseStyles = 'bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-200';

  // Variant styles
  const variants = {
    default: 'shadow-sm',
    elevated: 'shadow-md',
    floating: 'shadow-lg',
    outlined: 'border-2 shadow-none',
    gradient: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-blue-200 dark:border-gray-600',
    glass: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 dark:border-gray-700/20 shadow-xl',
    minimal: 'shadow-none border-0 bg-transparent'
  };

  // Size styles
  const sizes = {
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8',
    xl: 'p-10'
  };

  // Animation variants
  const animationVariants = {
    default: {
      initial: { opacity: 0, y: 20 },
      animate: { 
        opacity: 1, 
        y: 0,
        transition: { 
          duration: 0.4, 
          ease: "easeOut",
          delay 
        }
      }
    },
    slideUp: {
      initial: { opacity: 0, y: 30 },
      animate: { 
        opacity: 1, 
        y: 0,
        transition: { 
          duration: 0.5, 
          ease: "easeOut",
          delay 
        }
      }
    },
    slideLeft: {
      initial: { opacity: 0, x: 30 },
      animate: { 
        opacity: 1, 
        x: 0,
        transition: { 
          duration: 0.5, 
          ease: "easeOut",
          delay 
        }
      }
    },
    slideRight: {
      initial: { opacity: 0, x: -30 },
      animate: { 
        opacity: 1, 
        x: 0,
        transition: { 
          duration: 0.5, 
          ease: "easeOut",
          delay 
        }
      }
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { 
        opacity: 1, 
        scale: 1,
        transition: { 
          duration: 0.4, 
          ease: "easeOut",
          delay 
        }
      }
    },
    flip: {
      initial: { opacity: 0, rotateY: -90 },
      animate: { 
        opacity: 1, 
        rotateY: 0,
        transition: { 
          duration: 0.6, 
          ease: "easeOut",
          delay 
        }
      }
    },
    bounce: {
      initial: { opacity: 0, y: -30 },
      animate: { 
        opacity: 1, 
        y: 0,
        transition: { 
          type: "spring",
          stiffness: 400,
          damping: 10,
          delay 
        }
      }
    },
    elastic: {
      initial: { opacity: 0, scale: 0.3 },
      animate: { 
        opacity: 1, 
        scale: 1,
        transition: { 
          type: "spring",
          stiffness: 400,
          damping: 10,
          delay 
        }
      }
    }
  };

  // Hover animations
  const hoverVariants = {
    default: hoverable ? {
      whileHover: { 
        y: -2,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: { duration: 0.2, ease: "easeOut" }
      }
    } : {},
    lift: hoverable ? {
      whileHover: { 
        y: -5,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: { duration: 0.2, ease: "easeOut" }
      }
    } : {},
    scale: hoverable ? {
      whileHover: { 
        scale: 1.02,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: { duration: 0.2, ease: "easeOut" }
      }
    } : {},
    glow: hoverable ? {
      whileHover: { 
        boxShadow: "0 0 20px rgba(59, 130, 246, 0.3), 0 10px 25px -5px rgba(0, 0, 0, 0.1)",
        borderColor: "rgba(59, 130, 246, 0.5)",
        transition: { duration: 0.2, ease: "easeOut" }
      }
    } : {},
    tilt: hoverable ? {
      whileHover: { 
        rotateY: 5,
        rotateX: 5,
        y: -2,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: { duration: 0.2, ease: "easeOut" }
      }
    } : {}
  };

  // Click animations
  const clickVariants = clickable || onClick ? {
    whileTap: { 
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  } : {};

  // Loading animation
  const loadingAnimation = loading ? {
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  } : {};

  // Combine all styles
  const cardClasses = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${clickable || onClick ? 'cursor-pointer' : ''}
    ${loading ? 'pointer-events-none' : ''}
    ${className}
  `.trim();

  // Shimmer effect for loading
  const ShimmerEffect = () => (
    <motion.div
      className="absolute inset-0 rounded-xl overflow-hidden"
      animate={loading ? {
        background: [
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)"
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

  return (
    <motion.div
      className={`relative ${cardClasses}`}
      onClick={onClick}
      {...animationVariants[animationType]}
      {...(interactive ? cardInteractive : hoverVariants.default)}
      {...clickVariants}
      {...loadingAnimation}
      {...props}
    >
      {/* Loading shimmer effect */}
      {loading && <ShimmerEffect />}
      
      {/* Content */}
      <div className={`relative z-10 ${loading ? 'opacity-50' : ''}`}>
        {children}
      </div>
    </motion.div>
  );
};

// Specialized card components
export const FeatureCard = ({ icon: Icon, title, description, ...props }) => (
  <AnimatedCard 
    variant="elevated" 
    hoverable 
    animationType="slideUp" 
    className="text-center"
    {...props}
  >
    {Icon && (
      <motion.div
        className="mx-auto mb-4 p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full w-fit"
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
      </motion.div>
    )}
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-400">
      {description}
    </p>
  </AnimatedCard>
);

export const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = "blue", ...props }) => (
  <AnimatedCard 
    variant="elevated" 
    hoverable 
    animationType="scaleIn"
    {...props}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
        <motion.p 
          className={`text-2xl font-bold text-${color}-600`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 400 }}
        >
          {value}
        </motion.p>
        {trend && (
          <motion.div
            className={`flex items-center text-sm ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span>{trendValue}</span>
          </motion.div>
        )}
      </div>
      {Icon && (
        <motion.div
          className={`p-3 bg-${color}-100 dark:bg-${color}-900/20 rounded-lg`}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </motion.div>
      )}
    </div>
  </AnimatedCard>
);

export const ProductCard = ({ 
  image, 
  title, 
  description, 
  price, 
  originalPrice,
  badge,
  onAddToCart,
  ...props 
}) => (
  <AnimatedCard 
    variant="elevated" 
    hoverable 
    animationType="slideUp"
    className="overflow-hidden"
    {...props}
  >
    {/* Image */}
    <div className="relative mb-4 overflow-hidden rounded-lg">
      <motion.img
        src={image}
        alt={title}
        className="w-full h-48 object-cover"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      />
      {badge && (
        <motion.div
          className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium"
          initial={{ scale: 0, rotate: -12 }}
          animate={{ scale: 1, rotate: -12 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 400 }}
        >
          {badge}
        </motion.div>
      )}
    </div>

    {/* Content */}
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
      {description}
    </p>

    {/* Price and Action */}
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <span className="text-lg font-bold text-gray-900 dark:text-white">
          {price}
        </span>
        {originalPrice && (
          <span className="text-sm text-gray-500 line-through">
            {originalPrice}
          </span>
        )}
      </div>
      {onAddToCart && (
        <motion.button
          onClick={onAddToCart}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add to Cart
        </motion.button>
      )}
    </div>
  </AnimatedCard>
);

export const TestimonialCard = ({ quote, author, role, avatar, rating, ...props }) => (
  <AnimatedCard 
    variant="glass" 
    hoverable 
    animationType="slideUp"
    {...props}
  >
    {/* Quote */}
    <motion.div
      className="mb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <p className="text-gray-700 dark:text-gray-300 italic">
        "{quote}"
      </p>
    </motion.div>

    {/* Rating */}
    {rating && (
      <motion.div
        className="flex items-center mb-4"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        {[...Array(5)].map((_, i) => (
          <motion.span
            key={i}
            className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1 }}
          >
            ⭐
          </motion.span>
        ))}
      </motion.div>
    )}

    {/* Author */}
    <div className="flex items-center">
      {avatar && (
        <motion.img
          src={avatar}
          alt={author}
          className="w-10 h-10 rounded-full mr-3"
          whileHover={{ scale: 1.1 }}
        />
      )}
      <div>
        <p className="font-medium text-gray-900 dark:text-white">{author}</p>
        {role && (
          <p className="text-sm text-gray-600 dark:text-gray-400">{role}</p>
        )}
      </div>
    </div>
  </AnimatedCard>
);

export default AnimatedCard;
