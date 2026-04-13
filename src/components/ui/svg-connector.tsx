"use client";

import { useEffect, useRef, useState } from "react";

interface SvgConnectorProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  animated?: boolean;
  delay?: number;
  className?: string;
}

export function SvgConnector({
  from,
  to,
  animated = true,
  delay = 0,
  className,
}: SvgConnectorProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const [length, setLength] = useState(0);

  // Calculate cubic bezier path
  const midX = (from.x + to.x) / 2;
  const d = `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`;

  useEffect(() => {
    if (pathRef.current) {
      setLength(pathRef.current.getTotalLength());
    }
  }, [from, to]);

  return (
    <path
      ref={pathRef}
      d={d}
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeDasharray={animated && length ? length : undefined}
      strokeDashoffset={animated && length ? length : undefined}
      style={
        animated && length
          ? {
              animation: `drawLine 1s ease-out ${delay}s forwards`,
            }
          : undefined
      }
    />
  );
}
