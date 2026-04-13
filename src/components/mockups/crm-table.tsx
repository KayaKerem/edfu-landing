import { cn } from "@/lib/utils";

const leads = [
  {
    name: "Ahmet Yılmaz",
    company: "TechVista SaaS",
    status: "Nitelikli",
    statusColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    score: 92,
  },
  {
    name: "Elif Korkmaz",
    company: "DataFlow A.Ş.",
    status: "Görüşmede",
    statusColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    score: 78,
  },
  {
    name: "Murat Çelik",
    company: "NovaRetail",
    status: "Yeni",
    statusColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    score: 65,
  },
  {
    name: "Zeynep Arslan",
    company: "FinEdge Ltd.",
    status: "Nitelikli",
    statusColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    score: 88,
  },
] as const;

export function CrmTable({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-white shadow-lg dark:bg-[#27272A]",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2.5">
          <h3
            className="text-sm font-semibold text-foreground"
            style={{ fontFamily: "var(--font-geist)" }}
          >
            Aktif Lead&apos;ler
          </h3>
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
            4
          </span>
        </div>
        <span
          className="text-[11px] text-muted-foreground"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          AI tarafından güncellendi
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                İsim
              </th>
              <th className="px-5 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Şirket
              </th>
              <th className="px-5 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Durum
              </th>
              <th className="px-5 py-2.5 text-right text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Skor
              </th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead.name}
                className="border-b border-border last:border-0 hover:bg-muted/50"
              >
                <td className="px-5 py-3 text-sm font-medium text-foreground">
                  {lead.name}
                </td>
                <td className="px-5 py-3 text-sm text-muted-foreground">
                  {lead.company}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
                      lead.statusColor
                    )}
                  >
                    {lead.status}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${lead.score}%` }}
                      />
                    </div>
                    <span
                      className="text-sm font-medium text-foreground"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {lead.score}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
