import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const StepIndicator = ({ 
  steps, 
  currentStep, 
  completedSteps = [],
  variant = 'default',
  size = 'medium',
  orientation = 'horizontal',
  showLabels = true,
  showConnectors = true,
  className = ''
}) => {
  // Size configurations
  const sizeConfig = {
    small: {
      circle: 'w-8 h-8',
      text: 'text-xs',
      spacing: 'space-x-4'
    },
    medium: {
      circle: 'w-10 h-10',
      text: 'text-sm',
      spacing: 'space-x-6'
    },
    large: {
      circle: 'w-12 h-12',
      text: 'text-base',
      spacing: 'space-x-8'
    }
  };

  const config = sizeConfig[size];

  // Step state helper
  const getStepState = (stepIndex) => {
    if (completedSteps.includes(stepIndex) || stepIndex < currentStep - 1) {
      return 'completed';
    } else if (stepIndex === currentStep - 1) {
      return 'current';
    } else {
      return 'pending';
    }
  };

  // Animation variants
  const stepVariants = {
    pending: {
      backgroundColor: '#E5E7EB',
      color: '#6B7280',
      scale: 1,
      transition: { duration: 0.3 }
    },
    current: {
      backgroundColor: '#3B82F6',
      color: '#FFFFFF',
      scale: 1.1,
      transition: { duration: 0.3, type: 'spring', stiffness: 400 }
    },
    completed: {
      backgroundColor: '#10B981',
      color: '#FFFFFF',
      scale: 1,
      transition: { duration: 0.3 }
    }
  };

  const connectorVariants = {
    pending: {
      backgroundColor: '#E5E7EB',
      transition: { duration: 0.5 }
    },
    completed: {
      backgroundColor: '#10B981',
      transition: { duration: 0.5 }
    }
  };

  const labelVariants = {
    pending: {
      color: '#6B7280',
      fontWeight: 400,
      transition: { duration: 0.3 }
    },
    current: {
      color: '#3B82F6',
      fontWeight: 600,
      transition: { duration: 0.3 }
    },
    completed: {
      color: '#10B981',
      fontWeight: 500,
      transition: { duration: 0.3 }
    }
  };

  const checkmarkVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: 'spring',
        stiffness: 400,
        damping: 15
      }
    },
    exit: { scale: 0, opacity: 0 }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  const StepCircle = ({ step, index, state }) => (
    <div className="relative flex items-center justify-center">
      {/* Pulse effect for current step */}
      {state === 'current' && (
        <motion.div
          className={`absolute ${config.circle} rounded-full bg-blue-400`}
          variants={pulseVariants}
          animate="animate"
        />
      )}
      
      {/* Main circle */}
      <motion.div
        className={`
          ${config.circle} rounded-full flex items-center justify-center
          border-2 border-transparent relative z-10 cursor-pointer
          ${variant === 'outlined' ? 'border-current' : ''}
        `}
        variants={stepVariants}
        animate={state}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {state === 'completed' ? (
          <motion.div
            variants={checkmarkVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Check className="w-5 h-5" />
          </motion.div>
        ) : (
          <motion.span
            className={`${config.text} font-medium`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {step.number || index + 1}
          </motion.span>
        )}
      </motion.div>

      {/* Glow effect for current step */}
      {state === 'current' && variant === 'glow' && (
        <motion.div
          className={`absolute ${config.circle} rounded-full bg-blue-400 opacity-20 blur-md`}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      )}
    </div>
  );

  const StepConnector = ({ isCompleted, isNext }) => {
    if (!showConnectors) return null;

    return (
      <motion.div
        className={`
          flex-1 h-0.5 mx-4 rounded-full
          ${orientation === 'vertical' ? 'w-0.5 h-8 mx-0 my-2' : ''}
        `}
        variants={connectorVariants}
        animate={isCompleted ? 'completed' : 'pending'}
      >
        {/* Animated progress line */}
        {isNext && (
          <motion.div
            className="h-full bg-blue-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
        )}
      </motion.div>
    );
  };

  const StepLabel = ({ step, state }) => {
    if (!showLabels) return null;

    return (
      <motion.div
        className="text-center mt-2"
        variants={labelVariants}
        animate={state}
      >
        <div className={`${config.text} font-medium`}>
          {step.title}
        </div>
        {step.description && (
          <motion.div
            className="text-xs text-gray-500 dark:text-gray-400 mt-1"
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: state === 'current' ? 1 : 0.7,
              height: 'auto'
            }}
            transition={{ duration: 0.3 }}
          >
            {step.description}
          </motion.div>
        )}
      </motion.div>
    );
  };

  if (orientation === 'vertical') {
    return (
      <div className={`flex flex-col ${className}`}>
        {steps.map((step, index) => {
          const state = getStepState(index);
          const isLast = index === steps.length - 1;
          
          return (
            <motion.div
              key={step.id || index}
              className="flex items-start"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <div className="flex flex-col items-center">
                <StepCircle step={step} index={index} state={state} />
                {!isLast && (
                  <StepConnector 
                    isCompleted={state === 'completed'} 
                    isNext={index === currentStep - 1}
                  />
                )}
              </div>
              <div className="ml-4 flex-1">
                <StepLabel step={step} state={state} />
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {steps.map((step, index) => {
        const state = getStepState(index);
        const isLast = index === steps.length - 1;
        
        return (
          <motion.div
            key={step.id || index}
            className="flex flex-col items-center flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <div className="flex items-center w-full">
              <div className="flex-shrink-0">
                <StepCircle step={step} index={index} state={state} />
              </div>
              {!isLast && (
                <StepConnector 
                  isCompleted={state === 'completed'} 
                  isNext={index === currentStep - 1}
                />
              )}
            </div>
            <StepLabel step={step} state={state} />
          </motion.div>
        );
      })}
    </div>
  );
};

// Preset step indicator components
export const BookingStepIndicator = ({ currentStep, completedSteps = [] }) => {
  const steps = [
    {
      id: 1,
      title: 'Station & Pricing',
      description: 'Select route and view pricing'
    },
    {
      id: 2,
      title: 'Security Checklist',
      description: 'Declare valuable items'
    },
    {
      id: 3,
      title: 'Contact Information',
      description: 'Provide contact details'
    },
    {
      id: 4,
      title: 'Luggage Photos',
      description: 'Upload 4-angle photos'
    },
    {
      id: 5,
      title: 'Confirmation',
      description: 'Review and pay'
    }
  ];

  return (
    <StepIndicator
      steps={steps}
      currentStep={currentStep}
      completedSteps={completedSteps}
      variant="glow"
      size="medium"
      showLabels={true}
      showConnectors={true}
    />
  );
};

export const ProgressStepIndicator = ({ 
  steps, 
  currentStep, 
  variant = 'minimal',
  className = '' 
}) => (
  <StepIndicator
    steps={steps}
    currentStep={currentStep}
    variant={variant}
    size="small"
    showLabels={false}
    showConnectors={true}
    className={className}
  />
);

export default StepIndicator;
