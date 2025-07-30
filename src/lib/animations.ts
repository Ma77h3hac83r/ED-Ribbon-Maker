import { Variants } from 'framer-motion';

// Common animation variants
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

export const slideInUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

export const slideInDown: Variants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0 },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
};

// Stagger animations for lists
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Button animations
export const buttonTap: Variants = {
  tap: { scale: 0.95 },
  hover: { scale: 1.05 },
};

export const buttonHover: Variants = {
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

// Modal animations
export const modalBackdrop: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const modalContent: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300,
    },
  },
};

// Card animations
export const cardHover: Variants = {
  hover: {
    y: -5,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
};

export const cardTap: Variants = {
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
    },
  },
};

// Loading animations
export const loadingSpinner: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

export const loadingPulse: Variants = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Ribbon-specific animations
export const ribbonHover: Variants = {
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
    },
  },
};

export const ribbonSelect: Variants = {
  selected: {
    scale: 1.05,
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  unselected: {
    scale: 1,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
};

// Page transitions
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    x: 20,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

// Notification animations
export const notificationSlide: Variants = {
  hidden: {
    opacity: 0,
    x: 300,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    x: 300,
    scale: 0.8,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

// Form animations
export const formField: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

export const formError: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
};

// Sidebar animations
export const sidebarSlide: Variants = {
  closed: {
    x: '-100%',
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
  open: {
    x: 0,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
};

// Common transition configurations
export const transitions = {
  fast: { duration: 0.1, ease: 'easeOut' },
  normal: { duration: 0.2, ease: 'easeOut' },
  slow: { duration: 0.3, ease: 'easeOut' },
  spring: { type: 'spring', damping: 25, stiffness: 300 },
  bounce: { type: 'spring', damping: 10, stiffness: 300 },
};

// Animation utilities
export const animationUtils = {
  // Delay animation by a specific amount
  delay: (delay: number) => ({ delay }),

  // Create a staggered animation for children
  stagger: (staggerChildren: number = 0.1) => ({
    transition: { staggerChildren },
  }),

  // Create a spring animation
  spring: (damping: number = 25, stiffness: number = 300) => ({
    transition: { type: 'spring', damping, stiffness },
  }),

  // Create a bounce animation
  bounce: (damping: number = 10, stiffness: number = 300) => ({
    transition: { type: 'spring', damping, stiffness },
  }),

  // Create a custom ease animation
  ease: (duration: number = 0.2, ease: string = 'easeOut') => ({
    transition: { duration, ease },
  }),
};

// Hook for reduced motion preference
export const useReducedMotion = () => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  return false;
};

// Utility to disable animations for users who prefer reduced motion
export const getAnimationProps = (
  variants: Variants,
  reducedMotion: boolean = false
) => {
  if (reducedMotion) {
    return {
      initial: false,
      animate: false,
      exit: false,
      whileHover: {},
      whileTap: {},
    };
  }

  return {
    variants,
    initial: 'hidden',
    animate: 'visible',
    exit: 'hidden',
  };
};

const animations = {
  fadeIn,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  slideInUp,
  slideInDown,
  slideInLeft,
  slideInRight,
  staggerContainer,
  staggerItem,
  buttonTap,
  buttonHover,
  modalBackdrop,
  modalContent,
  cardHover,
  cardTap,
  loadingSpinner,
  loadingPulse,
  ribbonHover,
  ribbonSelect,
  pageTransition,
  notificationSlide,
  formField,
  formError,
  sidebarSlide,
  transitions,
  animationUtils,
  useReducedMotion,
  getAnimationProps,
};

export default animations;
