import { cn } from "@/lib/utils";

interface CrmTableLead {
  name: string;
  company: string;
  status: string;
}

interface CrmTableDict {
  title: string;
  updatedByAi: string;
  colName: string;
  colCompany: string;
  colStatus: string;
  colScore: string;
  leads: CrmTableLead[];
}

const SCORES = [92, 78, 65, 88] as const;

const STATUS_COLORS: Record<number, string> = {
  0: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  1: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  2: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  3: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
};

export function CrmTable({
  className,
  dict,
}: {
  className?: string;
  dict: CrmTableDict;
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
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-semibold text-foreground">
            {dict.title}
          </h3>
          <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-semibold text-primary-foreground">
            {dict.leads.length}
          </span>
        </div>
        <span
          className="text-[9px] text-muted-foreground"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {dict.updatedByAi}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-3 py-1.5 text-left text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
                {dict.colName}
              </th>
              <th className="px-3 py-1.5 text-left text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
                {dict.colCompany}
              </th>
              <th className="px-3 py-1.5 text-left text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
                {dict.colStatus}
              </th>
              <th className="px-3 py-1.5 text-right text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
                {dict.colScore}
              </th>
            </tr>
          </thead>
          <tbody>
            {dict.leads.map((lead, i) => {
              const score = SCORES[i] ?? 50;
              return (
                <tr
                  key={lead.name}
                  className="border-b border-border last:border-0 hover:bg-muted/50"
                >
                  <td className="px-3 py-1.5 text-[10px] font-medium text-foreground">
                    {lead.name}
                  </td>
                  <td className="px-3 py-1.5 text-[10px] text-muted-foreground">
                    {lead.company}
                  </td>
                  <td className="px-3 py-1.5">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-1.5 py-0 text-[9px] font-medium",
                        STATUS_COLORS[i] ?? STATUS_COLORS[0]
                      )}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-3 py-1.5">
                    <div className="flex items-center justify-end gap-1.5">
                      <div className="h-1 w-10 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      <span
                        className="text-[10px] font-medium text-foreground"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {score}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
