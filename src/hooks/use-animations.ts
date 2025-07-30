import { useMemo } from 'react';
import { Variants } from 'framer-motion';
import { usePreferencesStore } from '@/lib/stores';
import {
  useReducedMotion,
  getAnimationProps,
  animationUtils,
  type AnimationUtils,
} from '@/lib/animations';

// Animation hook that respects user preferences
function useAnimations() {
  const { settings } = usePreferencesStore();
  const prefersReducedMotion = useReducedMotion();

  // Check if animations should be disabled
  const animationsDisabled = useMemo(() => {
    return (
      prefersReducedMotion || settings.reduceMotion || !settings.showAnimations
    );
  }, [prefersReducedMotion, settings.reduceMotion, settings.showAnimations]);

  // Get animation props with user preference consideration
  const getProps = (variants: Variants) => {
    return getAnimationProps(variants, animationsDisabled);
  };

  // Enhanced animation utilities
  const utils: AnimationUtils & {
    getProps: (variants: Variants) => ReturnType<typeof getAnimationProps>;
    isDisabled: boolean;
  } = useMemo(
    () => ({
      ...animationUtils,
      getProps,
      isDisabled: animationsDisabled,
    }),
    [animationsDisabled, getProps]
  );

  return utils;
}

// Hook for page transitions
function usePageTransition() {
  const { getProps } = useAnimations();

  return {
    pageProps: getProps({
      initial: { opacity: 0, x: 20 },
      animate: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.3, ease: 'easeOut' },
      },
      exit: {
        opacity: 0,
        x: -20,
        transition: { duration: 0.2, ease: 'easeIn' },
      },
    }),
  };
}

// Hook for list animations with stagger
function useListAnimation(staggerDelay: number = 0.1) {
  const { getProps } = useAnimations();

  return {
    containerProps: getProps({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: staggerDelay },
      },
    }),
    itemProps: getProps({
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: 'easeOut' },
      },
    }),
  };
}

// Hook for modal animations
function useModalAnimation() {
  const { getProps } = useAnimations();

  return {
    backdropProps: getProps({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: 0.2, ease: 'easeOut' },
      },
    }),
    contentProps: getProps({
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
    }),
  };
}

// Hook for button animations
function useButtonAnimation() {
  const { isDisabled } = useAnimations();

  return {
    whileHover: isDisabled ? {} : { scale: 1.02 },
    whileTap: isDisabled ? {} : { scale: 0.98 },
    transition: { duration: 0.1, ease: 'easeOut' },
  };
}

// Hook for card animations
function useCardAnimation() {
  const { isDisabled } = useAnimations();

  return {
    whileHover: isDisabled
      ? {}
      : {
          y: -5,
          transition: { duration: 0.2, ease: 'easeOut' },
        },
    whileTap: isDisabled
      ? {}
      : {
          scale: 0.98,
          transition: { duration: 0.1 },
        },
  };
}

// Hook for ribbon animations
function useRibbonAnimation() {
  const { isDisabled } = useAnimations();

  return {
    whileHover: isDisabled
      ? {}
      : {
          scale: 1.1,
          rotate: 5,
          transition: { duration: 0.2, ease: 'easeOut' },
        },
    whileTap: isDisabled
      ? {}
      : {
          scale: 0.95,
          transition: { duration: 0.1 },
        },
    selected: {
      scale: 1.05,
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
      transition: { duration: 0.2, ease: 'easeOut' },
    },
    unselected: {
      scale: 1,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      transition: { duration: 0.2, ease: 'easeOut' },
    },
  };
}

// Hook for form animations
function useFormAnimation() {
  const { getProps } = useAnimations();

  return {
    fieldProps: getProps({
      hidden: { opacity: 0, y: 10 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: 'easeOut' },
      },
    }),
    errorProps: getProps({
      hidden: { opacity: 0, height: 0 },
      visible: {
        opacity: 1,
        height: 'auto',
        transition: { duration: 0.2, ease: 'easeOut' },
      },
    }),
  };
}

// Hook for notification animations
function useNotificationAnimation() {
  const { getProps } = useAnimations();

  return {
    notificationProps: getProps({
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
        transition: { duration: 0.2, ease: 'easeIn' },
      },
    }),
  };
}

// Hook for loading animations
function useLoadingAnimation() {
  const { isDisabled } = useAnimations();

  return {
    spinnerProps: {
      animate: isDisabled
        ? {}
        : {
            rotate: 360,
            transition: {
              duration: 1,
              repeat: Infinity,
              ease: 'linear',
            },
          },
    },
    pulseProps: {
      animate: isDisabled
        ? {}
        : {
            opacity: [0.5, 1, 0.5],
            transition: {
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          },
    },
  };
}

// Hook for sidebar animations
function useSidebarAnimation() {
  const { getProps } = useAnimations();

  return {
    sidebarProps: getProps({
      closed: {
        x: '-100%',
        transition: { duration: 0.3, ease: 'easeInOut' },
      },
      open: {
        x: 0,
        transition: { duration: 0.3, ease: 'easeInOut' },
      },
    }),
  };
}

// Export all hooks
export {
  useAnimations as default,
  usePageTransition,
  useListAnimation,
  useModalAnimation,
  useButtonAnimation,
  useCardAnimation,
  useRibbonAnimation,
  useFormAnimation,
  useNotificationAnimation,
  useLoadingAnimation,
  useSidebarAnimation,
};
