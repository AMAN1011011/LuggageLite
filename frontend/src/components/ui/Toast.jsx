import { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react';

// Toast Context
const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast Provider
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      type: 'info',
      duration: 5000,
      dismissible: true,
      ...toast
    };
    
    setToasts(prev => [...prev, newToast]);

    // Auto remove toast after duration
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const removeAllToasts = () => {
    setToasts([]);
  };

  // Convenience methods
  const success = (message, options = {}) => 
    addToast({ ...options, type: 'success', message });
  
  const error = (message, options = {}) => 
    addToast({ ...options, type: 'error', message, duration: 7000 });
  
  const warning = (message, options = {}) => 
    addToast({ ...options, type: 'warning', message });
  
  const info = (message, options = {}) => 
    addToast({ ...options, type: 'info', message });

  const promise = async (promiseFunc, messages) => {
    const loadingId = addToast({
      type: 'loading',
      message: messages.loading || 'Loading...',
      duration: 0,
      dismissible: false
    });

    try {
      const result = await promiseFunc();
      removeToast(loadingId);
      success(messages.success || 'Success!');
      return result;
    } catch (err) {
      removeToast(loadingId);
      error(messages.error || 'Something went wrong!');
      throw err;
    }
  };

  return (
    <ToastContext.Provider value={{
      toasts,
      addToast,
      removeToast,
      removeAllToasts,
      success,
      error,
      warning,
      info,
      promise
    }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

// Individual Toast Component
const Toast = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (toast.duration > 0) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (toast.duration / 100));
          return newProgress <= 0 ? 0 : newProgress;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [toast.duration]);

  const handleRemove = () => {
    setIsVisible(false);
    setTimeout(() => onRemove(toast.id), 300);
  };

  // Toast type configurations
  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      iconColor: 'text-green-600 dark:text-green-400',
      textColor: 'text-green-800 dark:text-green-200',
      progressColor: 'bg-green-500'
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
      iconColor: 'text-red-600 dark:text-red-400',
      textColor: 'text-red-800 dark:text-red-200',
      progressColor: 'bg-red-500'
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      textColor: 'text-yellow-800 dark:text-yellow-200',
      progressColor: 'bg-yellow-500'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      iconColor: 'text-blue-600 dark:text-blue-400',
      textColor: 'text-blue-800 dark:text-blue-200',
      progressColor: 'bg-blue-500'
    },
    loading: {
      icon: motion.div,
      bgColor: 'bg-gray-50 dark:bg-gray-800',
      borderColor: 'border-gray-200 dark:border-gray-700',
      iconColor: 'text-gray-600 dark:text-gray-400',
      textColor: 'text-gray-800 dark:text-gray-200',
      progressColor: 'bg-gray-500'
    }
  };

  const config = typeConfig[toast.type];
  const Icon = config.icon;

  // Animation variants
  const toastVariants = {
    initial: { opacity: 0, x: 300, scale: 0.9 },
    animate: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    exit: { 
      opacity: 0, 
      x: 300, 
      scale: 0.9,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const iconVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15,
        delay: 0.2
      }
    }
  };

  const progressVariants = {
    initial: { width: '100%' },
    animate: { 
      width: `${progress}%`,
      transition: { duration: 0.1, ease: "linear" }
    }
  };

  const LoadingSpinner = () => (
    <motion.div
      className={config.iconColor}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
    </motion.div>
  );

  return (
    <motion.div
      variants={toastVariants}
      initial="initial"
      animate={isVisible ? "animate" : "exit"}
      exit="exit"
      className={`
        relative max-w-sm w-full rounded-lg border p-4 shadow-lg backdrop-blur-sm
        ${config.bgColor} ${config.borderColor}
      `}
      whileHover={{ scale: 1.02 }}
      layout
    >
      {/* Progress bar */}
      {toast.duration > 0 && (
        <motion.div
          className="absolute top-0 left-0 h-1 rounded-t-lg"
          variants={progressVariants}
          animate="animate"
          style={{ width: `${progress}%` }}
        >
          <div className={`h-full rounded-t-lg ${config.progressColor}`} />
        </motion.div>
      )}

      <div className="flex items-start">
        {/* Icon */}
        <motion.div
          className="flex-shrink-0 mr-3 mt-0.5"
          variants={iconVariants}
          initial="initial"
          animate="animate"
        >
          {toast.type === 'loading' ? (
            <LoadingSpinner />
          ) : (
            <Icon className={`w-5 h-5 ${config.iconColor}`} />
          )}
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {toast.title && (
            <motion.h4
              className={`font-medium ${config.textColor} mb-1`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {toast.title}
            </motion.h4>
          )}
          <motion.p
            className={`text-sm ${config.textColor}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {toast.message}
          </motion.p>

          {/* Action button */}
          {toast.action && (
            <motion.button
              onClick={toast.action.onClick}
              className={`mt-2 text-sm font-medium ${config.iconColor} hover:underline`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {toast.action.label}
            </motion.button>
          )}
        </div>

        {/* Close button */}
        {toast.dismissible && (
          <motion.button
            onClick={handleRemove}
            className={`flex-shrink-0 ml-3 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 ${config.iconColor} transition-colors`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <X className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

// Toast Container
const ToastContainer = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onRemove={() => {}} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Preset toast components
export const SuccessToast = ({ message, ...props }) => {
  const { success } = useToast();
  
  useEffect(() => {
    success(message, props);
  }, [message, success]);

  return null;
};

export const ErrorToast = ({ message, ...props }) => {
  const { error } = useToast();
  
  useEffect(() => {
    error(message, props);
  }, [message, error]);

  return null;
};

export const WarningToast = ({ message, ...props }) => {
  const { warning } = useToast();
  
  useEffect(() => {
    warning(message, props);
  }, [message, warning]);

  return null;
};

export const InfoToast = ({ message, ...props }) => {
  const { info } = useToast();
  
  useEffect(() => {
    info(message, props);
  }, [message, info]);

  return null;
};

// Custom hook for common toast patterns
export const useToastActions = () => {
  const toast = useToast();

  const showSuccess = (message, options) => toast.success(message, options);
  const showError = (message, options) => toast.error(message, options);
  const showWarning = (message, options) => toast.warning(message, options);
  const showInfo = (message, options) => toast.info(message, options);

  const showPromise = (promise, messages) => toast.promise(promise, messages);

  const showConfirmation = (message, onConfirm, options = {}) => {
    return toast.warning(message, {
      ...options,
      duration: 0,
      action: {
        label: 'Confirm',
        onClick: onConfirm
      }
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showPromise,
    showConfirmation
  };
};

export default Toast;
