import { cn } from "@/lib/utils";

const BAR_COUNT = 50;
const PLAYED_RATIO = 0.28;

const speakerSegments = {
  speaker1: [0, 15, 35, 55, 80],
  speaker2: [10, 25, 45, 70],
} as const;

interface CallPlayerLine {
  time: string;
  speaker: string;
  text: string;
}

interface CallPlayerDict {
  title: string;
  speaker1Name: string;
  speaker1Role: string;
  speaker2Name: string;
  speaker2Role: string;
  transcriptLabel: string;
  lines: CallPlayerLine[];
}

export function CallPlayer({
  className,
  dict,
}: {
  className?: string;
  dict: CallPlayerDict;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-white shadow-lg dark:bg-[#27272A]",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
        </span>
        <h3 className="flex-1 text-xs font-semibold text-foreground">
          {dict.title}
        </h3>
        <span
          className="text-[10px] text-muted-foreground"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          12:34 / 45:00
        </span>
      </div>

      {/* Waveform */}
      <div
        className="flex items-end gap-[1.5px] px-3 py-2.5"
        style={{ height: 44 }}
      >
        {Array.from({ length: BAR_COUNT }, (_, i) => {
          const normalised = i / BAR_COUNT;
          const height =
            6 + 14 * Math.abs(Math.sin(normalised * Math.PI * 3));
          const played = normalised < PLAYED_RATIO;
          return (
            <div
              key={i}
              className={cn(
                "w-[3px] flex-shrink-0 rounded-full",
                played ? "bg-primary" : "bg-muted"
              )}
              style={{ height }}
            />
          );
        })}
      </div>

      {/* Speaker timeline */}
      <div className="space-y-1.5 border-t border-border px-3 py-2">
        {/* Speaker 1 */}
        <div className="flex items-center gap-2">
          <div className="w-14 flex-shrink-0">
            <p className="text-[10px] font-medium text-foreground">
              {dict.speaker1Name}
            </p>
            <p className="text-[9px] text-muted-foreground">
              {dict.speaker1Role}
            </p>
          </div>
          <div className="relative h-1.5 flex-1 rounded-full bg-muted">
            {speakerSegments.speaker1.map((pos) => (
              <div
                key={pos}
                className="absolute top-0 h-1.5 rounded-full bg-primary"
                style={{ left: `${pos}%`, width: "8%" }}
              />
            ))}
          </div>
        </div>
        {/* Speaker 2 */}
        <div className="flex items-center gap-2">
          <div className="w-14 flex-shrink-0">
            <p className="text-[10px] font-medium text-foreground">
              {dict.speaker2Name}
            </p>
            <p className="text-[9px] text-muted-foreground">
              {dict.speaker2Role}
            </p>
          </div>
          <div className="relative h-1.5 flex-1 rounded-full bg-muted">
            {speakerSegments.speaker2.map((pos) => (
              <div
                key={pos}
                className="absolute top-0 h-1.5 rounded-full bg-emerald-500"
                style={{ left: `${pos}%`, width: "10%" }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Transcript */}
      <div className="border-t border-border px-3 py-2">
        <div className="mb-1.5 flex items-center gap-1.5">
          <span className="text-[10px] font-medium text-foreground">
            {dict.transcriptLabel}
          </span>
          <span className="inline-flex h-3.5 items-center rounded bg-primary/10 px-1 text-[9px] font-semibold text-primary">
            AI
          </span>
        </div>
        <div className="space-y-1">
          {dict.lines.map((line) => (
            <div
              key={line.time}
              className="flex gap-1.5 text-[9px] leading-relaxed"
            >
              <span
                className="flex-shrink-0 text-muted-foreground"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {line.time}
              </span>
              <span className="font-medium text-foreground">
                {line.speaker}:
              </span>
              <span className="text-muted-foreground">{line.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
