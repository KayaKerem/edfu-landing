import { cn } from "@/lib/utils";

interface ResearchReportDict {
  title: string;
  agentBadge: string;
  companyName: string;
  companyMeta: string;
  scoreLabel: string;
  findings: string[];
}

const FINDING_COLORS = [
  "bg-emerald-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-emerald-500",
] as const;

export function ResearchReport({
  className,
  dict,
}: {
  className?: string;
  dict: ResearchReportDict;
}) {
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
          className="flex-1 text-sm font-semibold text-foreground"        >
          {dict.title}
        </h3>
        <span className="inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
          {dict.agentBadge}
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
          >
            {dict.companyName}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {dict.companyMeta}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-medium text-muted-foreground">
            {dict.scoreLabel}
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
        {dict.findings.map((text, i) => (
          <div key={i} className="flex items-start gap-2">
            <span
              className={cn(
                "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                FINDING_COLORS[i] ?? "bg-emerald-500"
              )}
            />
            <p className="text-xs leading-relaxed text-foreground/80">
              {text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
