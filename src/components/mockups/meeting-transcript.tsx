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
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <h3 className="text-xs font-semibold text-foreground">
          {dict.title}
        </h3>
        <span className="text-[9px] text-muted-foreground">
          {dict.subtitle}
        </span>
      </div>

      {/* Transcript lines */}
      <div className="divide-y divide-border">
        {dict.lines.map((line, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5",
              line.isAction && "bg-primary/5 dark:bg-primary/10"
            )}
          >
            {/* Timestamp or action icon */}
            <span
              className={cn(
                "shrink-0 text-[9px]",
                line.isAction
                  ? "w-6 text-center text-primary"
                  : "w-6 text-right text-muted-foreground"
              )}
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {line.isAction ? "⚡" : line.time}
            </span>

            {/* Speaker + text */}
            <div className="min-w-0 flex-1">
              <span
                className={cn(
                  "text-[9px] font-semibold",
                  line.isAction ? "text-primary" : "text-foreground"
                )}
              >
                {line.speaker}:
              </span>{" "}
              <span
                className={cn(
                  "text-[9px] leading-relaxed",
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
