import { cn } from "@/lib/utils";

const meetings = [
  {
    title: "TechVista — Satış Demo",
    date: "13 Nis, 14:00",
    participants: "Mehmet K., Ahmet Y.",
    duration: "45 dk",
    status: "Kaydedildi" as const,
  },
  {
    title: "DataFlow — Onboarding",
    date: "13 Nis, 11:00",
    participants: "Elif D., Zeynep A.",
    duration: "30 dk",
    status: "İşleniyor" as const,
  },
  {
    title: "NovaRetail — Kick-off",
    date: "12 Nis, 16:00",
    participants: "Murat Ç., Can Y.",
    duration: "60 dk",
    status: "Kaydedildi" as const,
  },
  {
    title: "FinEdge — İhtiyaç Analizi",
    date: "12 Nis, 10:30",
    participants: "Selin T., Burak Ö.",
    duration: "25 dk",
    status: "Kaydedildi" as const,
  },
];

export function MeetingList({ className }: { className?: string }) {
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
          className="text-sm font-semibold text-foreground"
          style={{ fontFamily: "var(--font-geist)" }}
        >
          Son Toplantılar
        </h3>
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
          4
        </span>
      </div>

      {/* Meeting rows */}
      <div className="divide-y divide-border">
        {meetings.map((meeting, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-3 px-4 py-2.5 transition-colors hover:bg-muted/50"
          >
            {/* Left */}
            <div className="min-w-0 flex-1">
              <p
                className="truncate text-xs font-medium text-foreground"
                style={{ fontFamily: "var(--font-geist)" }}
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
                  meeting.status === "Kaydedildi"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                    : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                )}
              >
                {meeting.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
