"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

type MotionVariant = "fade-up" | "scale-in";

export interface MotionRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: MotionVariant;
}

function getVariant(variant: MotionVariant) {
  if (variant === "scale-in") {
    return {
      initial: { opacity: 0, scale: 0.98, y: 8 },
      whileInView: { opacity: 1, scale: 1, y: 0 },
    };
  }
  return {
    initial: { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
  };
}

export function MotionReveal({
  children,
  className,
  delay = 0,
  variant = "fade-up",
}: MotionRevealProps) {
  const v = getVariant(variant);
  return (
    <motion.div
      className={className}
      initial={v.initial}
      whileInView={v.whileInView}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
