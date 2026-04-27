"use client";

import { useInView } from "@/hooks/use-in-view";
import { GoogleMeet } from "@/components/ui/svgs/google-meet";

function LeafGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 16C5 10 10 5 16 5C18 5 19.5 5.4 20.4 5.8C20.4 11.2 15.4 16 9.6 16C7.6 16 6 15.6 5 16Z"
        fill="#7CC992"
      />
      <path
        d="M5 16C8 13.5 11 11 15 8.5"
        stroke="#1F5F3D"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MeetCrmConnector() {
  const { ref, visible } = useInView<HTMLDivElement>(0.4);

  return (
    <div
      ref={ref}
      data-visible={visible}
      className="absolute inset-0"
      aria-hidden="true"
    >
      {/* Backdrop SVG: dashed orbital rings + connector base + pulse gradient overlay */}
      <svg
        viewBox="0 0 321 321"
        className="absolute inset-0 h-full w-full"
        role="presentation"
        aria-hidden="true"
      >
        <defs>
          {/* Pulse gradient on connector — Attio's exact stops */}
          <linearGradient
            id="mcc-pulse-gradient"
            x1="0"
            y1="0"
            x2="0"
            y2="165.85"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#E4E7EC" />
            <stop offset="25%" stopColor="#94B9FF" />
            <stop offset="75%" stopColor="#94B9FF" />
            <stop offset="100%" stopColor="#E4E7EC" />
          </linearGradient>

          {/* Vertical fade gradient — top half transparent, bottom half opaque */}
          <linearGradient
            id="mcc-ring-fade-grad"
            x1="0"
            y1="120"
            x2="0"
            y2="220"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="black" />
            <stop offset="100%" stopColor="white" />
          </linearGradient>
          <mask id="mcc-ring-fade">
            <rect x="0" y="0" width="321" height="321" fill="url(#mcc-ring-fade-grad)" />
          </mask>
        </defs>

        {/* Outer dashed ring — centered around bottom (leaf) node.
            Outer <g> handles position; inner <g> handles rotation animation
            (CSS animation transform would otherwise overwrite the translate).
            Mask fades the upper half of the ring. */}
        <g mask="url(#mcc-ring-fade)" transform="translate(160.175 197.46)">
          <g className="pulse-ring-outer">
            <circle
              cx="0"
              cy="0"
              r="76.84"
              stroke="#CAD0D9"
              strokeWidth="0.97"
              strokeDasharray="5.84 5.84"
              fill="none"
            />
          </g>
        </g>
        {/* Inner dashed ring */}
        <g mask="url(#mcc-ring-fade)" transform="translate(160.175 197.46)">
          <g className="pulse-ring-inner">
            <circle
              cx="0"
              cy="0"
              r="54.47"
              stroke="#CAD0D9"
              strokeWidth="0.97"
              strokeDasharray="5.84 5.84"
              fill="none"
            />
          </g>
        </g>

        {/* Base connector line (greyed) */}
        <line
          x1="160.175"
          y1="108.19"
          x2="160.175"
          y2="185.85"
          stroke="#E4E7EC"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        {/* Pulse-gradient connector overlay (Attio's #94B9FF mid stops) */}
        <line
          x1="160.175"
          y1="108.19"
          x2="160.175"
          y2="185.85"
          stroke="url(#mcc-pulse-gradient)"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>

      {/* Top node — Google Meet icon in white card */}
      <div
        data-animate="rise"
        style={{ left: "49.9%", top: "30.5%", animationDelay: "0ms" }}
        className="absolute -translate-x-1/2 -translate-y-1/2 flex size-10 items-center justify-center rounded-[10px] border border-border bg-background shadow-[0_4px_12px_rgba(31,35,41,0.06),0_1px_2px_rgba(31,35,41,0.04)]"
      >
        <GoogleMeet className="size-5" />
      </div>

      {/* Bottom node — dark squircle with leaf + avatar overlay */}
      <div
        data-animate="rise"
        style={{ left: "49.9%", top: "61.4%", animationDelay: "160ms" }}
        className="absolute -translate-x-1/2 -translate-y-1/2"
      >
        <div className="relative flex size-11 items-center justify-center rounded-[11px] bg-[#1F2329] shadow-[0_4px_12px_rgba(31,35,41,0.12),0_1px_2px_rgba(31,35,41,0.06)]">
          <LeafGlyph className="size-6" />
          {/* Small avatar overlay at bottom-right */}
          <span className="absolute -bottom-1 -right-1 flex size-[14px] items-center justify-center rounded-full border-[1.5px] border-card bg-[#F0B37E] overflow-hidden">
            <svg
              viewBox="0 0 16 16"
              className="size-[10px]"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="8" cy="6.4" r="2" fill="white" />
              <path
                d="M3.5 13c0-2 2-3.6 4.5-3.6S12.5 11 12.5 13"
                stroke="white"
                strokeWidth="1.2"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}
