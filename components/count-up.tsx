"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";

interface CountUpProps {
  value: number;
  className?: string;
  duration?: number;
}

/**
 * Smoothly animates a number towards the given value using a spring.
 */
export function CountUp({ value, className, duration = 0.8 }: CountUpProps) {
  const motionValue = useMotionValue(value);
  const spring = useSpring(motionValue, {
    stiffness: 120,
    damping: 22,
    mass: 1,
  });
  const display = useTransform(spring, (v) => Math.round(v).toString());

  useEffect(() => {
    motionValue.set(value);
  }, [motionValue, value]);
  void duration;

  return <motion.span className={className}>{display}</motion.span>;
}
