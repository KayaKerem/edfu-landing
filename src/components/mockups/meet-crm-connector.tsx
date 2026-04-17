"use client";

import { useInView } from "@/hooks/use-in-view";
import { GoogleMeet } from "@/components/ui/svgs/google-meet";
import { GreenLeaf } from "@/components/ui/svgs/green-leaf";

export function MeetCrmConnector() {
  const { ref, visible } = useInView<HTMLDivElement>(0.4);

  return (
    <div
      ref={ref}
      data-visible={visible}
      className="absolute inset-0"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 321 321"
        className="absolute inset-0 h-full w-full text-card"
        role="presentation"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="mcc-vignette"
            x1="160.66"
            y1="149.7"
            x2="160.66"
            y2="254.95"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="1" />
          </linearGradient>
          <radialGradient id="mcc-ring-fill" cx="0.5" cy="0.5" r="0.5">
            <stop offset="52%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="1" />
          </radialGradient>
        </defs>

        {/* Outer dashed ring — class drives pulse animation */}
        <circle
          cx="160.175"
          cy="197.46"
          r="76.84"
          stroke="#CAD0D9"
          strokeWidth="0.97"
          strokeDasharray="5.84 5.84"
          fill="url(#mcc-ring-fill)"
          className="pulse-ring-outer"
          style={{ transformBox: "fill-box" as const, transformOrigin: "center" }}
        />
        {/* Inner dashed ring */}
        <circle
          cx="160.175"
          cy="197.461"
          r="54.47"
          stroke="#CAD0D9"
          strokeWidth="0.97"
          strokeDasharray="5.84 5.84"
          fill="url(#mcc-ring-fill)"
          className="pulse-ring-inner"
          style={{ transformBox: "fill-box" as const, transformOrigin: "center" }}
        />

        {/* Base connector line */}
        <line
          x1="159.8"
          y1="118.19"
          x2="159.8"
          y2="165.85"
          stroke="#E4E7EC"
          strokeWidth="1.3"
        />

        {/* Vignette fades rings into dotted backdrop */}
        <rect
          x="72"
          y="120"
          width="176"
          height="160"
          fill="url(#mcc-vignette)"
        />
      </svg>

      {/* Animated bead overlay — CSS gradient inside a clipped container */}
      {/* Positioned at SVG coords (160, 118) → (160, 165.85) in a 321×321 viewBox */}
      <div
        className="pointer-events-none absolute overflow-hidden"
        style={{
          left: "49.8%",
          top: "36.75%",
          width: "1.3px",
          height: "14.85%",
        }}
      >
        <div
          className="bead-flow-line"
          style={{
            width: "100%",
            height: "200%",
            background:
              "linear-gradient(to bottom, #E4E7EC 0%, #94B9FF 25%, #94B9FF 75%, #E4E7EC 100%)",
          }}
        />
      </div>

      {/* Top node — Google Meet icon */}
      <div
        data-animate="rise"
        style={{ left: "49.8%", top: "30.5%", animationDelay: "0ms" }}
        className="absolute -translate-x-1/2 -translate-y-1/2 flex size-10 items-center justify-center rounded-lg border border-border bg-background shadow-md"
      >
        <GoogleMeet className="size-5" />
      </div>

      {/* Centre node — GreenLeaf icon */}
      <div
        data-animate="rise"
        style={{ left: "49.8%", top: "61.4%", animationDelay: "160ms" }}
        className="absolute -translate-x-1/2 -translate-y-1/2 flex size-11 items-center justify-center rounded-lg border border-border bg-background shadow-md"
      >
        <GreenLeaf className="size-6" />
      </div>
    </div>
  );
}
