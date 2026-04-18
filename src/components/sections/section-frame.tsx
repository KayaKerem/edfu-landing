"use client";

import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./section-frame.module.css";

export type SectionFrameProps = HTMLAttributes<HTMLElement> & {
  /** Children are rendered inside the inner grid container. */
  children: ReactNode;
  /** Tailwind-style classes for the inner grid (columns, divides, etc.). */
  gridClassName?: string;
  /** Accessible label for the section landmark. */
  ariaLabel?: string;
  /** Extra classes for the outer <section>. Useful to pass a CSS-module `.root` that holds design tokens / data-attribute selectors. */
  className?: string;
  /** Optional classes applied to the inner grid wrapper (overrides gridClassName defaults). */
  innerClassName?: string;
};

/**
 * SectionFrame — the shared "boxed + border + dot grid" skeleton used across
 * landing page feature sections. Extracted from the original AutomateEverything
 * block so it can be reused for new sections (e.g. DeployAi) while preserving
 * the diagonal side stripes, vertical rules, dotted background and inner grid.
 *
 * The outer <section> receives any native HTML / event props (ref is
 * forwarded) so callers can attach IntersectionObservers, data-* attributes
 * for animation state, and CSS modules that define design tokens on the root.
 */
export const SectionFrame = forwardRef<HTMLElement, SectionFrameProps>(
  function SectionFrame(
    {
      children,
      gridClassName,
      ariaLabel,
      className,
      innerClassName,
      ...rest
    },
    ref
  ) {
    return (
      <section
        ref={ref}
        aria-label={ariaLabel}
        className={cn(styles.frame, className)}
        {...rest}
      >
        <div className={styles.layout}>
          <div className={cn("mx-4 sm:mx-6", styles.inner)}>
            {/* Diagonal hatch stripes — left & right gutters */}
            <div
              className="pointer-events-none absolute inset-y-0 left-0 w-14 z-[1] text-foreground/5 bg-[size:10px_10px] [background-image:repeating-linear-gradient(315deg,currentColor_0_1px,#0000_0_50%)]"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 w-14 z-[1] text-foreground/5 bg-[size:10px_10px] [background-image:repeating-linear-gradient(315deg,currentColor_0_1px,#0000_0_50%)]"
              aria-hidden="true"
            />
            {/* Vertical rule lines just inside the hatched gutters */}
            <div
              className="pointer-events-none absolute inset-y-0 left-14 w-px z-[1] bg-border/70"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-14 w-px z-[1] bg-border/70"
              aria-hidden="true"
            />
            {/* Ambient dot grid background */}
            <div className={styles.dotGrid} aria-hidden="true" />
            {/* Inner grid — callers provide their column template via gridClassName */}
            <div
              className={cn(
                "h-full relative z-[1] grid",
                gridClassName,
                innerClassName
              )}
            >
              {children}
            </div>
          </div>
        </div>
      </section>
    );
  }
);
