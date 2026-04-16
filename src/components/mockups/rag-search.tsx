import { cn } from "@/lib/utils";

interface RagSearchDict {
  query: string;
  agentBadge: string;
  sourcesFound: string;
  answerPrefix: string;
  answerHighlight1: string;
  answerMid1: string;
  answerHighlight2: string;
  answerMid2: string;
  answerHighlight3: string;
  answerSuffix: string;
  sourceFile1: string;
  sourceFile2: string;
}

export function RagSearch({
  className,
  dict,
}: {
  className?: string;
  dict: RagSearchDict;
}) {
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
        <p className="flex-1 text-xs text-foreground">{dict.query}</p>
      </div>

      {/* Agent badge + source count */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <span className="inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
          {dict.agentBadge}
        </span>
        <span className="text-[11px] text-muted-foreground">
          {dict.sourcesFound}
        </span>
      </div>

      {/* Answer card */}
      <div className="px-4 py-3">
        <div className="rounded-lg border border-border bg-muted/30 px-3 py-2.5 dark:bg-muted/20">
          <p className="text-xs leading-relaxed text-foreground/80">
            {dict.answerPrefix}{" "}
            <span className="font-semibold text-foreground">
              {dict.answerHighlight1}
            </span>
            {dict.answerMid1}{" "}
            <span className="font-semibold text-foreground">
              {dict.answerHighlight2}
            </span>{" "}
            {dict.answerMid2}{" "}
            <span className="font-semibold text-foreground">
              {dict.answerHighlight3}
            </span>
            {dict.answerSuffix}
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
            {dict.sourceFile1}
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
            {dict.sourceFile2}
          </span>
        </div>
      </div>
    </div>
  );
}
