import { cn } from "@/lib/utils";

const lines = [
  {
    time: "14:22",
    speaker: "Mehmet K.",
    text: "\u201cBu çeyrekte hedefimiz 200 yeni müşteri.\u201d",
    isAction: false,
  },
  {
    time: "14:25",
    speaker: "Elif D.",
    text: "\u201cPazarlama bütçesini %30 artırmamız gerekecek.\u201d",
    isAction: false,
  },
  {
    time: "",
    speaker: "AI Özet",
    text: "Aksiyon: Pazarlama bütçe artışı onayı \u2192 Elif D. \u2014 18 Nis\u2019e kadar",
    isAction: true,
  },
  {
    time: "14:31",
    speaker: "Can Y.",
    text: "\u201cDemo ortamını önümüzdeki haftaya hazırlayalım.\u201d",
    isAction: false,
  },
  {
    time: "",
    speaker: "AI Özet",
    text: "Aksiyon: Demo ortamı hazırlığı \u2192 Can Y. \u2014 20 Nis\u2019e kadar",
    isAction: true,
  },
];

export function MeetingTranscript({ className }: { className?: string }) {
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
          Toplantı Transkripti
        </h3>
        <span className="text-[11px] text-muted-foreground">
          Q3 Satış Toplantısı
        </span>
      </div>

      {/* Transcript lines */}
      <div className="divide-y divide-border">
        {lines.map((line, i) => (
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
