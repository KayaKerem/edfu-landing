import { useId } from "react";
import { cn } from "@/lib/utils";

interface DottedBackdropProps {
  /** Optional extra classes. Defaults apply absolute inset-0 sizing and pattern-dot color. */
  className?: string;
  /** Dot tile size in px. Default 10. */
  tileSize?: number;
}

export function DottedBackdrop({ className, tileSize = 10 }: DottedBackdropProps) {
  const patternId = useId();
  return (
    <svg
      aria-hidden="true"
      role="presentation"
      className={cn(
        "absolute inset-0 h-full w-full text-pattern-dot",
        className
      )}
    >
      <defs>
        <pattern
          id={patternId}
          width={tileSize}
          height={tileSize}
          patternUnits="userSpaceOnUse"
        >
          <rect width="1" height="1" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
