"use client";

import { useEffect, useRef, useState } from "react";

interface SvgConnectorProps {
  /** Either provide from/to for auto-bezier, or d for a custom path */
  from?: { x: number; y: number };
  to?: { x: number; y: number };
  d?: string;
  animated?: boolean;
  delay?: number;
  duration?: number;
  className?: string;
}

export function SvgConnector({
  from,
  to,
  d: customPath,
  animated = true,
  delay = 0,
  duration = 1.2,
  className,
}: SvgConnectorProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const [length, setLength] = useState(0);

  const d =
    customPath ??
    (from && to
      ? `M ${from.x} ${from.y} C ${(from.x + to.x) / 2} ${from.y}, ${(from.x + to.x) / 2} ${to.y}, ${to.x} ${to.y}`
      : "");

  useEffect(() => {
    if (pathRef.current) {
      setLength(pathRef.current.getTotalLength());
    }
  }, [d]);

  return (
    <path
      ref={pathRef}
      d={d}
      fill="none"
      className={className}
      stroke="#E4E7EC"
      strokeWidth="1"
      strokeDasharray={animated && length ? length : undefined}
      strokeDashoffset={animated && length ? length : undefined}
      style={
        animated && length
          ? {
              animation: `svg-connector-draw ${duration}s cubic-bezier(0.2,0,0,1) ${delay}s forwards`,
            }
          : undefined
      }
    />
  );
}
