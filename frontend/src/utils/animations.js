// Animation utilities for Framer Motion
// Centralized animation configurations for consistency across the app

// Page transitions
export const pageTransitions = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: "easeInOut" }
};

export const slideUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" }
};

export const slideDown = {
  initial: { opacity: 0, y: -30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" }
};

export const slideLeft = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.4, ease: "easeOut" }
};

export const slideRight = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.4, ease: "easeOut" }
};

// Scale animations
export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3, ease: "easeOut" }
};

export const scaleOut = {
  initial: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  transition: { duration: 0.2, ease: "easeIn" }
};

// Fade animations
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3 }
};

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" }
};

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" }
};

// Stagger animations for lists
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

// Button animations
export const buttonHover = {
  scale: 1.02,
  transition: { duration: 0.2, ease: "easeInOut" }
};

export const buttonTap = {
  scale: 0.98,
  transition: { duration: 0.1 }
};

export const buttonPrimary = {
  whileHover: buttonHover,
  whileTap: buttonTap
};

// Card animations
export const cardHover = {
  y: -5,
  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  transition: { duration: 0.2, ease: "easeOut" }
};

export const cardTap = {
  scale: 0.98,
  transition: { duration: 0.1 }
};

export const cardInteractive = {
  whileHover: cardHover,
  whileTap: cardTap
};

// Modal animations
export const modalBackdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
};

export const modalContent = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 20 },
  transition: { duration: 0.3, ease: "easeOut" }
};

// Loading animations
export const spin = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

export const pulse = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const bounce = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Progress animations
export const progressBar = {
  initial: { width: 0 },
  animate: { width: "100%" },
  transition: { duration: 0.5, ease: "easeOut" }
};

export const slideProgress = (progress) => ({
  initial: { width: 0 },
  animate: { width: `${progress}%` },
  transition: { duration: 0.3, ease: "easeOut" }
});

// Text animations
export const typewriter = {
  initial: { width: 0 },
  animate: { width: "auto" },
  transition: { duration: 1, ease: "easeOut" }
};

export const textReveal = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

// Complex animations
export const floatingElement = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const rotatingElement = {
  animate: {
    rotate: [0, 360],
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// Form animations
export const formField = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.3, ease: "easeOut" }
};

export const formError = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: "auto" },
  exit: { opacity: 0, height: 0 },
  transition: { duration: 0.2 }
};

// Navigation animations
export const navItem = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: "easeOut" }
};

export const mobileMenuSlide = {
  initial: { x: "100%" },
  animate: { x: 0 },
  exit: { x: "100%" },
  transition: { duration: 0.3, ease: "easeInOut" }
};

// Custom easing functions
export const customEasing = {
  smooth: [0.25, 0.46, 0.45, 0.94],
  bounce: [0.68, -0.55, 0.265, 1.55],
  elastic: [0.175, 0.885, 0.32, 1.275]
};

// Utility functions
export const createStaggerDelay = (index, baseDelay = 0.1) => ({
  transition: { delay: index * baseDelay }
});

export const createSpringAnimation = (stiffness = 100, damping = 10) => ({
  type: "spring",
  stiffness,
  damping
});

export const createSlideAnimation = (direction = "up", distance = 20) => {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance }
  };

  return {
    initial: { opacity: 0, ...directions[direction] },
    animate: { opacity: 1, x: 0, y: 0 },
    transition: { duration: 0.4, ease: "easeOut" }
  };
};

// Page-specific animations
export const heroAnimation = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.8, ease: "easeOut" }
};

export const featureCardAnimation = (index) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { 
    duration: 0.5, 
    ease: "easeOut",
    delay: index * 0.1
  }
});

export const stepIndicatorAnimation = (isActive) => ({
  scale: isActive ? 1.1 : 1,
  backgroundColor: isActive ? "#3B82F6" : "#E5E7EB",
  transition: { duration: 0.3, ease: "easeInOut" }
});

// Counter/Dashboard specific animations
export const statCardAnimation = (index) => ({
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { 
    duration: 0.4, 
    ease: "easeOut",
    delay: index * 0.1
  }
});

export const dashboardGridAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { 
    duration: 0.6,
    staggerChildren: 0.1
  }
};

// Success/Error animations
export const successAnimation = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { 
    type: "spring",
    stiffness: 200,
    damping: 10
  }
};

export const errorShake = {
  animate: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.5 }
  }
};

export default {
  pageTransitions,
  slideUp,
  slideDown,
  slideLeft,
  slideRight,
  scaleIn,
  scaleOut,
  fadeIn,
  fadeInUp,
  fadeInDown,
  staggerContainer,
  staggerItem,
  buttonPrimary,
  cardInteractive,
  modalBackdrop,
  modalContent,
  spin,
  pulse,
  bounce,
  progressBar,
  slideProgress,
  typewriter,
  textReveal,
  floatingElement,
  rotatingElement,
  formField,
  formError,
  navItem,
  mobileMenuSlide,
  customEasing,
  createStaggerDelay,
  createSpringAnimation,
  createSlideAnimation,
  heroAnimation,
  featureCardAnimation,
  stepIndicatorAnimation,
  statCardAnimation,
  dashboardGridAnimation,
  successAnimation,
  errorShake
};
