import { cn } from "@/lib/utils";

const BAR_COUNT = 60;
const PLAYED_RATIO = 0.28;

const speakerSegments = {
  mehmet: [0, 15, 35, 55, 80],
  ahmet: [10, 25, 45, 70],
} as const;

const transcript = [
  {
    time: "02:15",
    speaker: "Mehmet K.",
    text: "\u201CEkibiniz şu an kaç kişi kullanıyor?\u201D",
  },
  {
    time: "02:22",
    speaker: "Ahmet Y.",
    text: "\u201C85 kişilik bir ekibiz, CRM entegrasyonu en önemli ihtiyacımız.\u201D",
  },
  {
    time: "02:35",
    speaker: "Mehmet K.",
    text: "\u201CAnladım, size özel kurumsal paketimiz tam ihtiyacınıza uygun.\u201D",
  },
] as const;

export function CallPlayer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-white shadow-lg dark:bg-[#27272A]",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-5 py-4">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
        </span>
        <h3
          className="flex-1 text-sm font-semibold text-foreground"
          style={{ fontFamily: "var(--font-geist)" }}
        >
          Satış Görüşmesi — TechVista
        </h3>
        <span
          className="text-xs text-muted-foreground"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          12:34 / 45:00
        </span>
      </div>

      {/* Waveform */}
      <div className="flex items-end gap-[2px] px-5 py-4" style={{ height: 64 }}>
        {Array.from({ length: BAR_COUNT }, (_, i) => {
          const normalised = i / BAR_COUNT;
          const height =
            12 + 20 * Math.abs(Math.sin(normalised * Math.PI * 3));
          const played = normalised < PLAYED_RATIO;
          return (
            <div
              key={i}
              className={cn(
                "w-1 flex-shrink-0 rounded-full",
                played ? "bg-primary" : "bg-muted"
              )}
              style={{ height }}
            />
          );
        })}
      </div>

      {/* Speaker timeline */}
      <div className="space-y-2 border-t border-border px-5 py-3">
        {/* Mehmet */}
        <div className="flex items-center gap-3">
          <div className="w-20 flex-shrink-0">
            <p className="text-xs font-medium text-foreground">Mehmet K.</p>
            <p className="text-[10px] text-muted-foreground">Satış</p>
          </div>
          <div className="relative h-2 flex-1 rounded-full bg-muted">
            {speakerSegments.mehmet.map((pos) => (
              <div
                key={pos}
                className="absolute top-0 h-2 rounded-full bg-primary"
                style={{ left: `${pos}%`, width: "8%" }}
              />
            ))}
          </div>
        </div>
        {/* Ahmet */}
        <div className="flex items-center gap-3">
          <div className="w-20 flex-shrink-0">
            <p className="text-xs font-medium text-foreground">Ahmet Y.</p>
            <p className="text-[10px] text-muted-foreground">Müşteri</p>
          </div>
          <div className="relative h-2 flex-1 rounded-full bg-muted">
            {speakerSegments.ahmet.map((pos) => (
              <div
                key={pos}
                className="absolute top-0 h-2 rounded-full bg-emerald-500"
                style={{ left: `${pos}%`, width: "10%" }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Transcript */}
      <div className="border-t border-border px-5 py-3">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xs font-medium text-foreground">
            Transkript
          </span>
          <span className="inline-flex h-4 items-center rounded bg-primary/10 px-1.5 text-[10px] font-semibold text-primary">
            AI
          </span>
        </div>
        <div className="space-y-1.5">
          {transcript.map((line) => (
            <div key={line.time} className="flex gap-2 text-[12px] leading-relaxed">
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
