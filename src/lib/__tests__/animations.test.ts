import { describe, it, expect, vi } from 'vitest';
import {
  useReducedMotion,
  getAnimationProps,
  fadeIn,
  fadeInUp,
  scaleIn,
  staggerContainer,
  buttonHover,
  modalContent,
  ribbonHover,
  transitions,
  animationUtils,
} from '../animations';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('Animations', () => {
  describe('useReducedMotion', () => {
    it('should return false when reduced motion is not preferred', () => {
      const result = useReducedMotion();
      expect(result).toBe(false);
    });

    it('should return true when reduced motion is preferred', () => {
      // Mock matchMedia to return true for reduced motion
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      const result = useReducedMotion();
      expect(result).toBe(true);
    });
  });

  describe('getAnimationProps', () => {
    const mockVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    };

    it('should return animation props when reduced motion is false', () => {
      const result = getAnimationProps(mockVariants, false);

      expect(result).toEqual({
        variants: mockVariants,
        initial: 'hidden',
        animate: 'visible',
        exit: 'hidden',
      });
    });

    it('should return disabled animation props when reduced motion is true', () => {
      const result = getAnimationProps(mockVariants, true);

      expect(result).toEqual({
        initial: false,
        animate: false,
        exit: false,
        whileHover: {},
        whileTap: {},
      });
    });
  });

  describe('Animation variants', () => {
    it('should have correct fadeIn variants', () => {
      expect(fadeIn.hidden).toEqual({ opacity: 0 });
      expect(fadeIn.visible).toEqual({ opacity: 1 });
    });

    it('should have correct fadeInUp variants', () => {
      expect(fadeInUp.hidden).toEqual({ opacity: 0, y: 20 });
      expect(fadeInUp.visible).toEqual({ opacity: 1, y: 0 });
    });

    it('should have correct scaleIn variants', () => {
      expect(scaleIn.hidden).toEqual({ opacity: 0, scale: 0.8 });
      expect(scaleIn.visible).toEqual({ opacity: 1, scale: 1 });
    });

    it('should have correct staggerContainer variants', () => {
      expect(staggerContainer.hidden).toEqual({ opacity: 0 });
      expect(staggerContainer.visible).toEqual({
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
        },
      });
    });

    it('should have correct buttonHover variants', () => {
      expect(buttonHover.hover).toEqual({
        scale: 1.02,
        transition: { duration: 0.2 },
      });
      expect(buttonHover.tap).toEqual({
        scale: 0.98,
        transition: { duration: 0.1 },
      });
    });

    it('should have correct modalContent variants', () => {
      expect(modalContent.hidden).toEqual({
        opacity: 0,
        scale: 0.8,
        y: 20,
      });
      expect(modalContent.visible).toEqual({
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          type: 'spring',
          damping: 25,
          stiffness: 300,
        },
      });
    });

    it('should have correct ribbonHover variants', () => {
      expect(ribbonHover.hover).toEqual({
        scale: 1.1,
        rotate: 5,
        transition: {
          duration: 0.2,
          ease: 'easeOut',
        },
      });
      expect(ribbonHover.tap).toEqual({
        scale: 0.95,
        transition: {
          duration: 0.1,
        },
      });
    });
  });

  describe('Transitions', () => {
    it('should have correct transition configurations', () => {
      expect(transitions.fast).toEqual({ duration: 0.1, ease: 'easeOut' });
      expect(transitions.normal).toEqual({ duration: 0.2, ease: 'easeOut' });
      expect(transitions.slow).toEqual({ duration: 0.3, ease: 'easeOut' });
      expect(transitions.spring).toEqual({
        type: 'spring',
        damping: 25,
        stiffness: 300,
      });
      expect(transitions.bounce).toEqual({
        type: 'spring',
        damping: 10,
        stiffness: 300,
      });
    });
  });

  describe('Animation utilities', () => {
    it('should have correct utility functions', () => {
      expect(animationUtils.delay(0.5)).toEqual({ delay: 0.5 });
      expect(animationUtils.stagger(0.2)).toEqual({
        transition: { staggerChildren: 0.2 },
      });
      expect(animationUtils.spring(20, 250)).toEqual({
        transition: { type: 'spring', damping: 20, stiffness: 250 },
      });
      expect(animationUtils.bounce(15, 350)).toEqual({
        transition: { type: 'spring', damping: 15, stiffness: 350 },
      });
      expect(animationUtils.ease(0.5, 'easeIn')).toEqual({
        transition: { duration: 0.5, ease: 'easeIn' },
      });
    });
  });
});
