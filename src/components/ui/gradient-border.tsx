"use client";

import { cn } from "@/lib/utils";
import { useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface GradientBorderProps {
  children: React.ReactNode;
  className?: string;
  borderWidth?: number;
  animated?: boolean;
}

export function GradientBorder({
  children,
  className,
  borderWidth = 2,
  animated = true,
}: GradientBorderProps) {
  const [supportsProperty, setSupportsProperty] = useState(false);
  const angle = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check @property support
  useEffect(() => {
    setSupportsProperty(CSS.supports("syntax", '"<angle>"'));
  }, []);

  // JS fallback animation for browsers without @property
  useEffect(() => {
    if (supportsProperty || !animated) return;
    const controls = animate(angle, 360, {
      duration: 4,
      repeat: Infinity,
      ease: "linear",
    });
    return () => controls.stop();
  }, [supportsProperty, animated, angle]);

  // Apply angle via JS when @property not supported
  const gradientAngle = useTransform(angle, (v) => `${v}deg`);

  useEffect(() => {
    if (supportsProperty || !animated) return;
    return gradientAngle.on("change", (v) => {
      if (containerRef.current) {
        containerRef.current.style.setProperty("--gradient-angle", v);
      }
    });
  }, [supportsProperty, animated, gradientAngle]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative rounded-2xl",
        animated && supportsProperty && "animate-[gradient-spin_4s_linear_infinite]",
        className
      )}
      style={{
        padding: borderWidth,
        background: `conic-gradient(from var(--gradient-angle, 0deg), #f59e0b, #f97316, #ef4444, #8b5cf6, #06b6d4, #10b981, #f59e0b)`,
        boxShadow: "0 0 20px 4px rgba(245,158,11,0.08), 0 0 60px 12px rgba(139,92,246,0.06)",
      }}
    >
      <div className="rounded-[calc(1rem-2px)] bg-white dark:bg-[#18181B] h-full w-full">
        {children}
      </div>
    </div>
  );
}
