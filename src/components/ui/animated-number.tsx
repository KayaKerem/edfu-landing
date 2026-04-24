"use client";

import { useEffect, useRef, useState } from "react";

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

const defaultFormat = (num: number) => num.toLocaleString("tr-TR");

/**
 * A counter that springs to `value`. Keeps its own long-lived RAF loop
 * that runs whenever the spring hasn't settled, and updates its target
 * on every render. Survives React 19 StrictMode double-invoke by never
 * cancelling mid-flight on the reactive effect cleanup — the RAF itself
 * decides when to stop (on settle or true unmount).
 */
export function AnimatedNumber({
  value,
  mass = 0.8,
  stiffness = 150,
  damping = 20,
  precision = 0,
  format = defaultFormat,
  onAnimationStart,
  onAnimationComplete,
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(() =>
    format(parseFloat(value.toFixed(precision))),
  );

  // Mutable refs that the single long-running RAF loop reads.
  const targetRef = useRef(value);
  const currentRef = useRef(value);
  const velocityRef = useRef(0);
  const springRef = useRef({ mass, stiffness, damping, precision });
  springRef.current = { mass, stiffness, damping, precision };
  const formatRef = useRef(format);
  formatRef.current = format;
  const startRef = useRef(onAnimationStart);
  startRef.current = onAnimationStart;
  const completeRef = useRef(onAnimationComplete);
  completeRef.current = onAnimationComplete;

  const rafRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const unmountedRef = useRef(false);
  const startedRef = useRef(false);

  // Runs every render: updates target, kicks the RAF loop if not running.
  useEffect(() => {
    if (targetRef.current !== value) {
      targetRef.current = value;
      startedRef.current = false;
    }

    const settled =
      currentRef.current === value && Math.abs(velocityRef.current) < 0.01;
    if (settled) {
      // Guarantee the exact formatted target text even with no animation.
      setDisplay(formatRef.current(parseFloat(value.toFixed(precision))));
      return;
    }
    if (rafRef.current != null) return; // loop already running

    const tick = (ts: number) => {
      if (unmountedRef.current) {
        rafRef.current = null;
        return;
      }
      if (lastTsRef.current == null) lastTsRef.current = ts;
      // Clamp dt so tab-switches don't blow up the integration.
      const dt = Math.min((ts - lastTsRef.current) / 1000, 1 / 30);
      lastTsRef.current = ts;

      if (!startedRef.current) {
        startedRef.current = true;
        startRef.current?.();
      }

      const { mass: m, stiffness: k, damping: c, precision: p } =
        springRef.current;
      const target = targetRef.current;
      const displacement = currentRef.current - target;
      const accel = (-k * displacement - c * velocityRef.current) / m;
      velocityRef.current += accel * dt;
      currentRef.current += velocityRef.current * dt;

      // Settled? Snap, notify, stop.
      if (
        Math.abs(currentRef.current - target) < 0.5 &&
        Math.abs(velocityRef.current) < 0.5
      ) {
        currentRef.current = target;
        velocityRef.current = 0;
        setDisplay(
          formatRef.current(parseFloat(target.toFixed(p))),
        );
        rafRef.current = null;
        lastTsRef.current = null;
        completeRef.current?.();
        return;
      }

      setDisplay(
        formatRef.current(parseFloat(currentRef.current.toFixed(p))),
      );
      rafRef.current = setTimeout(() => tick(performance.now()), 16);
    };

    lastTsRef.current = null;
    rafRef.current = setTimeout(() => tick(performance.now()), 16);
    // No cleanup here — StrictMode would cancel the animation we just
    // started. True teardown happens in the [] effect below.
  }, [value, precision]);

  // Cancel the RAF exactly once, on real unmount.
  useEffect(() => {
    return () => {
      unmountedRef.current = true;
      if (rafRef.current != null) {
        clearTimeout(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  return <span>{display}</span>;
}
