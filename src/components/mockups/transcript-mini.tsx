"use client";

import { useInView } from "@/hooks/use-in-view";

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
        className="absolute left-[8%] top-[10%] w-[60%] rounded-xl border border-border bg-card shadow-md"
      >
        {/* Tab header */}
        <div className="flex gap-4 border-b border-border px-4 pt-3">
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            className="relative pb-2 text-[13px] font-medium text-foreground"
          >
            ✧ Insights
            <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-foreground" />
          </button>
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            className="pb-2 text-[13px] text-muted-foreground"
          >
            │ Transcript
          </button>
        </div>

        {/* Speaker 1 — Jamie */}
        <div className="space-y-1.5 p-4">
          <div className="flex items-center gap-2">
            <span className="size-5 rounded-full bg-[#8FD5A6]" />
            <span className="text-[13px] font-semibold">Jamie Davies</span>
          </div>
          <p className="text-[12px] leading-relaxed text-foreground">
            Honestly, this looks like exactly what we need, what are{" "}
            <span
              data-animate="chip-pop"
              style={{ animationDelay: "120ms" }}
              className="inline-block rounded px-1 py-0.5 bg-[rgba(184,169,255,0.18)] text-[#5b4cc9]"
            >
              the next steps?
            </span>
          </p>
        </div>

        {/* Speaker 2 — Guy */}
        <div className="space-y-1.5 px-4 pb-4">
          <div className="flex items-center gap-2">
            <span className="size-5 rounded-full bg-[#F0B37E]" />
            <span className="text-[13px] font-semibold">Guy Hawkins</span>
          </div>
          <span className="block h-2 w-[96%] rounded-sm bg-[#EFEEEC]" />
          <span className="block h-2 w-[80%] rounded-sm bg-[#EFEEEC]" />
          <span className="block h-2 w-[60%] rounded-sm bg-[#EFEEEC]" />
        </div>
      </div>
    </div>
  );
}
