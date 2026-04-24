import { cn } from "@/lib/utils";

interface MeetingItem {
  title: string;
  date: string;
  participants: string;
  duration: string;
}

interface MeetingListDict {
  title: string;
  statusRecorded: string;
  statusProcessing: string;
  meetings: MeetingItem[];
}

/* Index-based status assignment to match original layout:
   meetings[0] = Recorded, [1] = Processing, [2] = Recorded, [3] = Recorded */
const STATUS_MAP = [true, false, true, true] as const;

export function MeetingList({
  className,
  dict,
}: {
  className?: string;
  dict: MeetingListDict;
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
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
          {dict.meetings.length}
        </span>
      </div>

      {/* Meeting rows */}
      <div className="divide-y divide-border">
        {dict.meetings.map((meeting, i) => {
          const isRecorded = STATUS_MAP[i] ?? true;
          const statusLabel = isRecorded
            ? dict.statusRecorded
            : dict.statusProcessing;
          return (
            <div
              key={i}
              className="flex items-center justify-between gap-3 px-4 py-2.5 transition-colors hover:bg-muted/50"
            >
              {/* Left */}
              <div className="min-w-0 flex-1">
                <p
                  className="truncate text-xs font-medium text-foreground"
                >
                  {meeting.title}
                </p>
                <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                  {meeting.participants}
                </p>
              </div>

              {/* Right */}
              <div className="flex shrink-0 items-center gap-2.5">
                <span
                  className="text-[10px] text-muted-foreground"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {meeting.date}
                </span>
                <span
                  className="text-[10px] text-muted-foreground"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {meeting.duration}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
                    isRecorded
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                  )}
                >
                  {statusLabel}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
