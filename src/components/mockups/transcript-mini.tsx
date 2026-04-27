"use client";

import { useInView } from "@/hooks/use-in-view";

function WaveIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 8h1M5 5v6M8 3v10M11 5v6M14 8h-1"
        stroke="white"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PersonIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <circle cx="8" cy="6" r="2.4" fill="white" />
      <path
        d="M3.5 13c0-2.2 2-4 4.5-4s4.5 1.8 4.5 4"
        stroke="white"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function TranscriptMini() {
  const { ref, visible } = useInView<HTMLDivElement>(0.4);

  return (
    <div
      ref={ref}
      data-visible={visible}
      className="absolute inset-0"
      aria-hidden="true"
    >
      <div
        data-animate="rise"
        className="absolute left-1/2 top-[8%] w-[78%] -translate-x-1/2 rounded-xl border border-border bg-card shadow-[0_8px_24px_rgba(31,35,41,0.06),0_2px_4px_rgba(31,35,41,0.04)]"
      >
        {/* Tab header — Insights active (Attio target) */}
        <div className="flex gap-4 border-b border-border px-4 pt-3">
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            className="relative pb-2 text-[13px] font-medium text-foreground"
          >
            <span className="text-[#8B7DE8]">✦</span> Insights
            <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-foreground" />
          </button>
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            className="pb-2 text-[13px] text-muted-foreground/70"
          >
            <span className="text-muted-foreground/40">│</span> Transcript
          </button>
        </div>

        {/* Speaker 1 — Jamie Davies (green circle + waveform icon) */}
        <div className="space-y-1.5 p-4">
          <div className="flex items-center gap-2">
            <span className="flex size-5 items-center justify-center rounded-full bg-[#8FD5A6]">
              <WaveIcon className="size-3" />
            </span>
            <span className="text-[13px] font-semibold">Jamie Davies</span>
          </div>
          <p className="text-[12px] leading-[1.5] text-foreground">
            Honestly, this looks like exactly what we need, what are{" "}
            <a
              href="#"
              tabIndex={-1}
              data-animate="chip-pop"
              style={{ animationDelay: "120ms" }}
              className="text-[#3B6FE5] underline underline-offset-2 decoration-[#3B6FE5]/40"
            >
              the next steps?
            </a>
          </p>
        </div>

        {/* Speaker 2 — Guy Hawkins (orange circle + person icon) */}
        <div className="space-y-1.5 px-4 pb-4">
          <div className="flex items-center gap-2">
            <span className="flex size-5 items-center justify-center rounded-full bg-[#F0B37E]">
              <PersonIcon className="size-3" />
            </span>
            <span className="text-[13px] font-semibold">Guy Hawkins</span>
          </div>
          <span className="block h-2 w-[96%] rounded-sm bg-muted" />
          <span className="block h-2 w-[80%] rounded-sm bg-muted" />
          <span className="block h-2 w-[60%] rounded-sm bg-muted" />
        </div>
      </div>
    </div>
  );
}
