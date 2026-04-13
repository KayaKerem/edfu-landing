import { cn } from "@/lib/utils";

const findings = [
  {
    color: "bg-emerald-500",
    text: "Yıllık gelir: ~₺12M, son 2 yılda %40 büyüme",
  },
  {
    color: "bg-emerald-500",
    text: "CRM çözümü aktif olarak arıyor (LinkedIn paylaşımları)",
  },
  {
    color: "bg-amber-500",
    text: "Mevcut rakip: HubSpot Free — ölçeklenme sorunu yaşıyor",
  },
  {
    color: "bg-emerald-500",
    text: "Karar verici: CTO (Ahmet Yılmaz) — 3 demo talep etti",
  },
];

export function ResearchReport({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-white shadow-lg dark:bg-[#27272A]",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
        <h3
          className="flex-1 text-sm font-semibold text-foreground"
          style={{ fontFamily: "var(--font-geist)" }}
        >
          Şirket Araştırması
        </h3>
        <span className="inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
          Araştırma Agenti
        </span>
      </div>

      {/* Company info */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-bold text-muted-foreground">
          TV
        </div>
        <div className="min-w-0 flex-1">
          <p
            className="text-sm font-semibold text-foreground"
            style={{ fontFamily: "var(--font-geist)" }}
          >
            TechVista SaaS A.Ş.
          </p>
          <p className="text-[11px] text-muted-foreground">
            B2B SaaS • İstanbul • 85 çalışan
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-medium text-muted-foreground">
            ICP Score
          </p>
          <p
            className="text-xl font-bold text-primary"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            92
          </p>
        </div>
      </div>

      {/* Findings */}
      <div className="flex flex-col gap-2 px-4 py-3">
        {findings.map((finding, i) => (
          <div key={i} className="flex items-start gap-2">
            <span
              className={cn(
                "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                finding.color
              )}
            />
            <p className="text-xs leading-relaxed text-foreground/80">
              {finding.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
