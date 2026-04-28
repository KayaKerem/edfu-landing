"use client";

import { cn } from "@/lib/utils";
import { AudioLines, Camera, ChevronDown, NotebookPen, Sparkles } from "lucide-react";

interface CallWidgetDict {
  meetingTitle: string;
  tabActive: string;
  tabInactive: string;
  summaryTitle: string;
  highlightPillLabel: string;
  insightsTitle: string;
  timeElapsed: string;
  timeTotal: string;
}

interface CallWidgetProps {
  dict: CallWidgetDict;
  className?: string;
}

const BAR_WIDTHS = ["75%", "100%", "90%", "80%"] as const;
const SEGMENT_GROW = [1, 0.37, 0.63, 0.37, 0.63, 0.25] as const;

export function CallWidget({ dict, className }: CallWidgetProps) {
  return (
    <div
      className={cn(
        "relative w-[min(816px,100%)] rounded-2xl border-4 border-[color:oklch(0_0_0_/_0.03)] p-0 backdrop-blur-xs",
        className
      )}
    >
      <div className="overflow-hidden rounded-xl bg-card shadow-float">
        {/* Header */}
        <div className="flex items-center gap-x-2 border-b border-border px-3.5 py-3">
          <Camera className="size-3.5 text-foreground" aria-hidden="true" />
          <span className="text-[15px] font-semibold text-foreground">
            {/* TODO(brand): placeholder meeting title */}
            {dict.meetingTitle}
          </span>
        </div>

        {/* Video thumbnail */}
        <div className="px-1.5 py-2">
          <div className="relative aspect-video w-full overflow-hidden rounded-[10px] bg-neutral-800">
            {/* Poster background. V1 does not ship a real video file; the
                progress bar is decorative static markup. */}
            <div
              className="absolute inset-0 bg-neutral-900"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
            <div className="absolute inset-x-0 bottom-0 flex h-12 flex-col justify-center gap-y-1.5 px-2.5">
              <div className="flex w-full justify-between text-[10px] font-medium leading-[10px] text-white">
                <span>{dict.timeElapsed}</span>
                <span>{dict.timeTotal}</span>
              </div>
              <div className="flex w-full items-center gap-x-1">
                {SEGMENT_GROW.map((grow, i) => {
                  if (i === 0) {
                    return (
                      <div
                        key={i}
                        className="h-1 rounded-full bg-white"
                        style={{ flexGrow: grow }}
                      />
                    );
                  }
                  if (i === 1) {
                    return (
                      <div
                        key={i}
                        className="relative flex h-1 items-center rounded-full bg-white/40"
                        style={{ flexGrow: grow }}
                      >
                        <div className="absolute inset-y-0 left-0 w-1/2 rounded-full bg-white" />
                        <div className="absolute left-1/2 size-2 -translate-x-1/2 rounded-full border-[1.5px] border-white bg-neutral-800" />
                      </div>
                    );
                  }
                  return (
                    <div
                      key={i}
                      className="h-1 rounded-full bg-white/40"
                      style={{ flexGrow: grow }}
                    />
                  );
                })}
              </div>
            </div>
            <div
              className="absolute inset-0 bg-white/20 mix-blend-soft-light"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Tab chips */}
        <div className="flex gap-x-1 border-b border-border px-2.5 py-2">
          <div className="relative flex items-center gap-x-1.5 rounded-lg border border-border bg-muted px-1.5 py-1">
            <Sparkles className="size-3.5 text-foreground" aria-hidden="true" />
            <span className="text-sm text-foreground">
              {/* TODO(brand): visual tab label */}
              {dict.tabActive}
            </span>
          </div>
          <div className="flex items-center gap-x-1.5 px-1.5 py-1">
            <AudioLines className="size-3.5 text-muted-foreground" aria-hidden="true" />
            <span className="text-sm text-muted-foreground">
              {/* TODO(brand): visual tab label */}
              {dict.tabInactive}
            </span>
          </div>
        </div>

        {/* Summary */}
        <div className="flex flex-col gap-y-[1.125rem] px-4 pt-4 pb-3">
          <div className="flex items-end justify-between">
            <span className="text-[15px] font-semibold text-foreground">
              {/* TODO(brand): placeholder section title */}
              {dict.summaryTitle}
            </span>
            <div className="flex items-center gap-x-1.5 rounded-lg border border-border bg-card px-1.5 py-1">
              <NotebookPen className="size-3.5 text-foreground" aria-hidden="true" />
              <span className="text-sm text-foreground">
                {/* TODO(brand): placeholder meeting type label */}
                {dict.highlightPillLabel}
              </span>
              <ChevronDown className="size-3.5 text-muted-foreground" aria-hidden="true" />
            </div>
          </div>
          <p className="text-[15px] leading-[145%] text-foreground/80">
            {/* TODO(brand): placeholder summary prose with 4 blue-accent keywords */}
            <span className="text-primary">Ashley</span> is the decision maker
            at <span className="text-primary">GreenLeaf</span>, looking to
            migrate from spreadsheets to Basepoint by{" "}
            <span className="text-primary">Monday</span>, with plans{" "}
            <span className="text-primary">to purchase</span> 6 seats on the
            Pro plan.
          </p>
        </div>

        {/* Insights — static bars */}
        <div className="mb-3 flex flex-col gap-y-[1.125rem] px-4 pt-4 pb-3">
          <span className="text-[15px] font-semibold text-foreground">
            {/* TODO(brand): placeholder section title */}
            {dict.insightsTitle}
          </span>
          <div className="flex w-full flex-col gap-y-2">
            {BAR_WIDTHS.map((width, i) => (
              <div
                key={i}
                className="h-[9px] rounded-full bg-muted"
                style={{ width }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
