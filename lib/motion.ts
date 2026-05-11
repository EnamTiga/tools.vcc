/**
 * Shared motion variants and easings for consistent page-wide animations.
 */

import type { Transition, Variants } from "motion/react";

// ─── Easings ────────────────────────────────────────────────────────────────

export const easeOutExpo: Transition["ease"] = [0.16, 1, 0.3, 1];
export const easeOutBack: Transition["ease"] = [0.34, 1.56, 0.64, 1];
export const easeInOutSmooth: Transition["ease"] = [0.65, 0, 0.35, 1];

// ─── Reusable variants ──────────────────────────────────────────────────────

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOutExpo },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: easeInOutSmooth },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: easeOutBack },
  },
};

export const stagger = (delayChildren = 0.1, stagger = 0.08): Variants => ({
  hidden: {},
  visible: {
    transition: {
      delayChildren,
      staggerChildren: stagger,
    },
  },
});

export const cardHover = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -4,
    scale: 1.01,
    transition: { duration: 0.3, ease: easeOutExpo },
  },
};

export const slideInFromRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      delay: i * 0.04,
      ease: easeOutExpo,
    },
  }),
};
