import { cn } from "@/lib/utils";

interface ProposalLineItem {
  item: string;
  quantity: string;
  amount: string;
}

interface ProposalDocDict {
  title: string;
  aiBadge: string;
  colItem: string;
  colQuantity: string;
  colAmount: string;
  lineItems: ProposalLineItem[];
  totalLabel: string;
  totalAmount: string;
  validity: string;
}

export function ProposalDoc({
  className,
  dict,
}: {
  className?: string;
  dict: ProposalDocDict;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-white shadow-lg dark:bg-[#27272A]",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
          <svg
            className="h-5 w-5 text-red-600 dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3
            className="text-sm font-semibold text-foreground"
            style={{ fontFamily: "var(--font-geist)" }}
          >
            {dict.title}
          </h3>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 12.75 6 6 9-13.5"
            />
          </svg>
          {dict.aiBadge}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {dict.colItem}
              </th>
              <th className="px-5 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {dict.colQuantity}
              </th>
              <th className="px-5 py-2.5 text-right text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {dict.colAmount}
              </th>
            </tr>
          </thead>
          <tbody>
            {dict.lineItems.map((row) => (
              <tr key={row.item} className="border-b border-border">
                <td className="px-5 py-3 text-sm text-foreground">
                  {row.item}
                </td>
                <td className="px-5 py-3 text-sm text-muted-foreground">
                  {row.quantity}
                </td>
                <td
                  className="px-5 py-3 text-right text-sm text-foreground"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {row.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between border-t border-border bg-muted/30 px-5 py-3">
        <span className="text-sm font-medium text-foreground">
          {dict.totalLabel}
        </span>
        <span
          className="text-sm font-bold text-foreground"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {dict.totalAmount}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-xs text-muted-foreground">
            {dict.validity}
          </span>
        </div>
        <div className="h-5 w-24 rounded bg-muted" />
      </div>
    </div>
  );
}
