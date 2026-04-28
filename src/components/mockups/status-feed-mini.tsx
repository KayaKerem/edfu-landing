"use client";

import { useInView } from "@/hooks/use-in-view";

type PillColor = "green" | "amber";

function Pill({
  color,
  children,
  delayMs,
}: {
  color: PillColor;
  children: string;
  delayMs?: number;
}) {
  const palette =
    color === "green"
      ? { bg: "#DDF9E4", border: "#C7F4D3", fg: "#0E5C2D" }
      : { bg: "#FCE6CB", border: "#F6D2A8", fg: "#8A4A15" };

  return (
    <span
      data-animate={delayMs !== undefined ? "chip-pop" : undefined}
      style={{
        backgroundColor: palette.bg,
        borderColor: palette.border,
        color: palette.fg,
        animationDelay: delayMs !== undefined ? `${delayMs}ms` : undefined,
      }}
      className="inline-block rounded-md border px-1.5 py-px text-[11px] font-medium leading-[1.4]"
    >
      {children}
    </span>
  );
}

/* ── Tinted icon-square for left rail ────────────────────────── */
function LeftIcon({
  variant,
}: {
  variant: "check" | "video" | "return";
}) {
  if (variant === "check") {
    return (
      <span className="flex size-6 items-center justify-center rounded-md bg-[#E5F0FF] border border-[#D6E5FF]">
        <svg viewBox="0 0 14 14" className="size-3" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="5.5" stroke="#3B6FE5" strokeWidth="1.2" />
          <path
            d="M4.8 7.2l1.6 1.6 3-3"
            stroke="#3B6FE5"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </span>
    );
  }
  if (variant === "video") {
    return (
      <span className="flex size-6 items-center justify-center rounded-md bg-[#F2F3F5] border border-[#E4E7EC]">
        <svg viewBox="0 0 14 14" className="size-3" fill="none" aria-hidden="true">
          <rect
            x="2"
            y="4"
            width="7"
            height="6"
            rx="1.4"
            stroke="#5C5E63"
            strokeWidth="1.1"
          />
          <path d="M9 6.2L12 4.5v5L9 7.8" stroke="#5C5E63" strokeWidth="1.1" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }
  return (
    <span className="flex size-6 items-center justify-center rounded-md bg-[#F2F3F5] border border-[#E4E7EC]">
      <svg viewBox="0 0 14 14" className="size-3" fill="none" aria-hidden="true">
        <path
          d="M11 4v2.5a2.5 2.5 0 01-2.5 2.5H4M4 9l2 2M4 9l2-2"
          stroke="#5C5E63"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </span>
  );
}

/* ── Miro-style brand mark (yellow tinted square + bold M) ───── */
function MiroMark() {
  return (
    <span className="flex size-5 items-center justify-center rounded-[5px] bg-[#FFF1C7] border border-[#FBE39A]">
      <span
        className="text-[11px] font-bold leading-none text-[#B8860B]"
        style={{ fontFamily: "var(--font-geist-mono, ui-monospace, monospace)" }}
      >
        M
      </span>
    </span>
  );
}

export function StatusFeedMini() {
  const { ref, visible } = useInView<HTMLDivElement>(0.4);

  return (
    <div
      ref={ref}
      data-visible={visible}
      className="absolute inset-0"
      aria-hidden="true"
    >
      <div className="absolute left-1/2 top-[18%] max-md:top-[5%] w-[78%] -translate-x-1/2 rounded-xl border border-border bg-card shadow-[0_8px_24px_rgba(31,35,41,0.06),0_2px_4px_rgba(31,35,41,0.04)] divide-y divide-border overflow-hidden">
        {/* Row 1 — Won */}
        <div
          data-animate="slide-right"
          style={{ animationDelay: "0ms" }}
          className="flex items-center gap-3 px-4 py-3"
        >
          <LeftIcon variant="check" />
          <MiroMark />
          <span className="text-[12px] leading-[1.45]">
            <strong className="font-semibold text-foreground">Miro</strong>{" "}
            <span className="text-muted-foreground">status changed to</span>{" "}
            <Pill color="green" delayMs={500}>
              Won
            </Pill>
          </span>
        </div>

        {/* Row 2 — Lisa called Miro */}
        <div
          data-animate="slide-right"
          style={{ animationDelay: "120ms" }}
          className="flex items-center gap-3 px-4 py-3"
        >
          <LeftIcon variant="video" />
          <MiroMark />
          <span className="text-[12px] leading-[1.45]">
            <strong className="font-semibold text-foreground">Lisa</strong>{" "}
            <span className="text-muted-foreground">had a call with</span>{" "}
            <strong className="font-semibold text-foreground">Miro</strong>
          </span>
        </div>

        {/* Row 3 — Outreach */}
        <div
          data-animate="slide-right"
          style={{ animationDelay: "240ms" }}
          className="flex items-center gap-3 px-4 py-3"
        >
          <LeftIcon variant="return" />
          <MiroMark />
          <span className="text-[12px] leading-[1.45]">
            <strong className="font-semibold text-foreground">Miro</strong>{" "}
            <span className="text-muted-foreground">status changed to</span>{" "}
            <Pill color="amber">Outreach</Pill>
          </span>
        </div>
      </div>
    </div>
  );
}
