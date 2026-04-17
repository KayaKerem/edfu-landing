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
      ? { bg: "rgba(140,224,154,0.14)", fg: "#1F7A33" }
      : { bg: "rgba(245,180,131,0.14)", fg: "#8A4A15" };

  return (
    <span
      data-animate={delayMs !== undefined ? "chip-pop" : undefined}
      style={{
        backgroundColor: palette.bg,
        color: palette.fg,
        animationDelay: delayMs !== undefined ? `${delayMs}ms` : undefined,
      }}
      className="inline-block rounded-full px-2 py-0.5 text-[12px] font-medium"
    >
      {children}
    </span>
  );
}

function MiroMark() {
  return (
    <span className="inline-flex size-5 items-center justify-center rounded border border-border bg-white">
      <span className="text-[10px] font-bold text-[#F8C95B]">M</span>
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
      <div className="absolute right-[8%] top-[18%] w-[62%] rounded-xl border border-border bg-card shadow-md divide-y divide-border overflow-hidden">
        {/* Row 1 — Won */}
        <div
          data-animate="slide-right"
          style={{ animationDelay: "0ms" }}
          className="flex items-center gap-3 px-4 py-3"
        >
          <span className="text-muted-foreground text-[13px]">✦</span>
          <MiroMark />
          <span className="text-[13px]">
            <strong className="font-semibold">Miro</strong>{" "}
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
          <span className="text-muted-foreground text-[13px]">◉</span>
          <MiroMark />
          <span className="text-[13px]">
            <strong className="font-semibold">Lisa</strong>{" "}
            <span className="text-muted-foreground">had a call with</span>{" "}
            <strong className="font-semibold">Miro</strong>
          </span>
        </div>

        {/* Row 3 — Outreach */}
        <div
          data-animate="slide-right"
          style={{ animationDelay: "240ms" }}
          className="flex items-center gap-3 px-4 py-3"
        >
          <span className="text-muted-foreground text-[13px]">↩︎</span>
          <MiroMark />
          <span className="text-[13px]">
            <strong className="font-semibold">Miro</strong>{" "}
            <span className="text-muted-foreground">status changed to</span>{" "}
            <Pill color="amber">Outreach</Pill>
          </span>
        </div>
      </div>
    </div>
  );
}
