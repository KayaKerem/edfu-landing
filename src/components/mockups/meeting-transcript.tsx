import { cn } from "@/lib/utils";

interface TranscriptLine {
  time: string;
  speaker: string;
  text: string;
  isAction: boolean;
}

interface MeetingTranscriptDict {
  title: string;
  subtitle: string;
  aiSummaryLabel: string;
  lines: TranscriptLine[];
}

export function MeetingTranscript({
  className,
  dict,
}: {
  className?: string;
  dict: MeetingTranscriptDict;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-white shadow-lg dark:bg-[#27272A]",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3
          className="text-sm font-semibold text-foreground"        >
          {dict.title}
        </h3>
        <span className="text-[11px] text-muted-foreground">
          {dict.subtitle}
        </span>
      </div>

      {/* Transcript lines */}
      <div className="divide-y divide-border">
        {dict.lines.map((line, i) => (
          <div
            key={i}
            className={cn(
              "flex items-start gap-3 px-4 py-2.5",
              line.isAction && "bg-primary/5 dark:bg-primary/10"
            )}
          >
            {/* Timestamp or action icon */}
            <span
              className={cn(
                "mt-0.5 shrink-0 text-[10px]",
                line.isAction
                  ? "w-8 text-center text-primary"
                  : "w-8 text-right text-muted-foreground"
              )}
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {line.isAction ? "\u26A1" : line.time}
            </span>

            {/* Speaker + text */}
            <div className="min-w-0 flex-1">
              <span
                className={cn(
                  "text-xs font-semibold",
                  line.isAction ? "text-primary" : "text-foreground"
                )}
              >
                {line.speaker}:
              </span>{" "}
              <span
                className={cn(
                  "text-xs leading-relaxed",
                  line.isAction
                    ? "font-medium text-primary"
                    : "text-foreground/80"
                )}
              >
                {line.text}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
