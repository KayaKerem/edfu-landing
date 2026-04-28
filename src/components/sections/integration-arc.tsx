"use client";

import * as React from "react";
import { useRef, useEffect } from "react";
import { motion, useAnimation, useReducedMotion } from "framer-motion";

type IconProps = { className?: string };

const ZoomIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <rect x="6" y="10" width="15" height="12" rx="3" fill="#2D8CFF" />
    <path d="M21 14.5 26 12v8l-5-2.5v-3Z" fill="#2D8CFF" />
    <rect x="10" y="14" width="7" height="4" rx="1.4" fill="white" />
  </svg>
);

const GoogleMeetIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <path d="M5 10.5A2.5 2.5 0 0 1 7.5 8H17v8H5v-5.5Z" fill="#1A73E8" />
    <path d="M5 16h12v8H7.5A2.5 2.5 0 0 1 5 21.5V16Z" fill="#34A853" />
    <path d="M17 8l5 4v8l-5 4V8Z" fill="#FBBC05" />
    <path d="M22 12.5 27 10v12l-5-2.5v-7Z" fill="#EA4335" />
  </svg>
);

const TeamsIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <circle cx="21.5" cy="10" r="3" fill="#7B83EB" />
    <circle cx="13" cy="9.5" r="3.5" fill="#5059C9" />
    <rect x="14" y="14" width="13" height="9" rx="3" fill="#7B83EB" />
    <rect x="5" y="12" width="14" height="13" rx="2.5" fill="#5059C9" />
    <path d="M9 16h7v2h-2.4v5h-2.2v-5H9v-2Z" fill="white" />
  </svg>
);

// Attio circle params (1280px reference)
const CIRCLE_R = 680;
const CIRCLE_CY = 700;
const SVG_TOP_PX = 12;
const REF_W = 1280;

function getIconTopPx(xFrac: number): number {
  const cx = REF_W / 2;
  const x = xFrac * REF_W;
  const dy = Math.sqrt(Math.max(0, CIRCLE_R ** 2 - (x - cx) ** 2));
  return CIRCLE_CY - dy + SVG_TOP_PX;
}

// Arc-following start offset: icons begin at a lower point on the circle (svg_y=55)
// and slide diagonally up-inward to their final position on the arc
function getArcOffset(xFrac: number): { x: number; y: number } {
  const cx = REF_W / 2;
  const finalX = xFrac * REF_W;
  const finalSvgY = CIRCLE_CY - Math.sqrt(Math.max(0, CIRCLE_R ** 2 - (finalX - cx) ** 2));
  const startSvgY = 55;
  const startDx = Math.sqrt(Math.max(0, CIRCLE_R ** 2 - (startSvgY - CIRCLE_CY) ** 2));
  const startX = finalX < cx ? cx - startDx : finalX > cx ? cx + startDx : cx;
  return {
    x: Math.round(startX - finalX),
    y: Math.round(startSvgY - finalSvgY),
  };
}

const integrations = [
  { label: "Zoom", Icon: ZoomIcon, xFrac: 0.42, delay: 0 },
  { label: "Google Meet", Icon: GoogleMeetIcon, xFrac: 0.50, delay: 0.10 },
  { label: "Microsoft Teams", Icon: TeamsIcon, xFrac: 0.58, delay: 0.20 },
];

const HATCH_STYLE = {
  backgroundImage:
    "repeating-linear-gradient(125deg, transparent, transparent 6px, currentColor 6px, currentColor 7px)",
} as const;

export default function IntegrationSection() {
  const reduceMotion = useReducedMotion();
  const arcRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  useEffect(() => {
    if (reduceMotion) {
      controls.start("visible");
      return;
    }
    const el = arcRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          controls.start("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [controls, reduceMotion]);

  return (
    <section className="relative w-full overflow-hidden bg-[#FBFBFC] dark:bg-[#18181B]">
      {/* Left hatched strip */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-15 text-border/40 dark:text-[#72767A]/20" style={HATCH_STYLE} />
      {/* Right hatched strip */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-15 text-border/40 dark:text-[#72767A]/20" style={HATCH_STYLE} />

      {/* Header */}
      <div className="flex flex-col items-center px-6 pt-12 pb-8 text-center max-sm:pt-10 max-sm:pb-6">
        <motion.h2
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-balance font-semibold text-[20px] leading-[1.15] tracking-[-0.03em] text-foreground"
        >
          Instant sync. Zero setup friction.
        </motion.h2>

        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="mt-1 text-balance text-[20px] leading-[1.15] tracking-[-0.03em] text-muted-foreground"
        >
          Edfu connects with Zoom, Google Meet, and Microsoft Teams.
        </motion.p>
      </div>

      {/* Arc + icons */}
      <div ref={arcRef} className="relative h-[150px]">
        {/* Circle arc SVG */}
        <svg
          aria-hidden="true"
          width="100%"
          height="180"
          className="text-border"
          style={{ position: "absolute", top: SVG_TOP_PX, left: 0, overflow: "visible" }}
        >
          <circle
            cx="50%"
            cy={CIRCLE_CY}
            r={CIRCLE_R}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="6 6"
            strokeLinecap="round"
            className="dark:text-[#72767A]/20"
          />
        </svg>

        {/* Icons slide along arc from lower point upward to final position */}
        {integrations.map(({ label, Icon, xFrac, delay }) => {
          const topPx = getIconTopPx(xFrac);
          const offset = getArcOffset(xFrac);

          return (
            <motion.div
              key={label}
              aria-label={label}
              custom={delay}
              variants={{
                hidden: { opacity: 0, x: offset.x, y: offset.y },
                visible: (d: number) => ({
                  opacity: 1,
                  x: 0,
                  y: 0,
                  transition: { duration: 0.75, delay: d, ease: [0.22, 1, 0.36, 1] },
                }),
              }}
              initial={reduceMotion ? "visible" : "hidden"}
              animate={controls}
              style={{
                position: "absolute",
                left: `${xFrac * 100}%`,
                top: `${topPx}px`,
                translate: "-50% -50%",
              }}
              className="z-10 flex size-14 items-center justify-center rounded-full border border-border dark:text-[#72767A]/20 bg-card shadow-[0_16px_32px_rgba(31,35,41,0.08),0_2px_4px_rgba(31,35,41,0.07)] dark:shadow-[0_16px_32px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.2)]"
            >
              <Icon className="size-6" />
            </motion.div>
          );
        })}
      </div>

    </section>
  );
}
