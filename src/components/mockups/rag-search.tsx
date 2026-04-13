import { cn } from "@/lib/utils";

export function RagSearch({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-white shadow-lg dark:bg-[#27272A]",
        className
      )}
    >
      {/* Search bar */}
      <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
        {/* Magnifying glass icon */}
        <svg
          className="h-4 w-4 shrink-0 text-muted-foreground"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx={11} cy={11} r={8} />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <p className="flex-1 text-xs text-foreground">
          Tedarikçi sözleşme şartları nelerdir?
        </p>
      </div>

      {/* Agent badge + source count */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <span className="inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
          RAG Agenti
        </span>
        <span className="text-[11px] text-muted-foreground">
          3 kaynak bulundu
        </span>
      </div>

      {/* Answer card */}
      <div className="px-4 py-3">
        <div className="rounded-lg border border-border bg-muted/30 px-3 py-2.5 dark:bg-muted/20">
          <p className="text-xs leading-relaxed text-foreground/80">
            Tedarikçi sözleşmesine göre ödeme vadesi{" "}
            <span className="font-semibold text-foreground">45 gün</span>
            &apos;dür. Gecikme durumunda aylık{" "}
            <span className="font-semibold text-foreground">%2</span> faiz
            uygulanır. Minimum sipariş tutarı{" "}
            <span className="font-semibold text-foreground">₺50.000</span>
            &apos;dir.
          </p>
        </div>

        {/* Source badges */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-700 dark:bg-red-950 dark:text-red-400">
            <svg
              className="h-3 w-3"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            Tedarikçi_Sözleşme.pdf
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-400">
            <svg
              className="h-3 w-3"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            Satın_Alma_Politikası.docx
          </span>
        </div>
      </div>
    </div>
  );
}
