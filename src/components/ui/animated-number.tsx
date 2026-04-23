"use client";

import { useEffect, useState } from "react";
import { useSpring, useMotionValueEvent } from "motion/react";

interface AnimatedNumberProps {
  value: number;
  mass?: number;
  stiffness?: number;
  damping?: number;
  precision?: number;
  format?: (value: number) => string;
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
}

export function AnimatedNumber({
  value,
  mass = 0.8,
  stiffness = 75,
  damping = 15,
  precision = 0,
  format = (num) => num.toLocaleString("tr-TR"),
  onAnimationStart,
  onAnimationComplete,
}: AnimatedNumberProps) {
  const spring = useSpring(value, { mass, stiffness, damping });
  const [display, setDisplay] = useState(() => format(value));

  useEffect(() => {
    spring.set(value);
    if (onAnimationStart) onAnimationStart();
  }, [spring, value, onAnimationStart]);

  useMotionValueEvent(spring, "change", (current) => {
    setDisplay(format(parseFloat(current.toFixed(precision))));
    if (current === value && onAnimationComplete) onAnimationComplete();
  });

  return <span>{display}</span>;
}
