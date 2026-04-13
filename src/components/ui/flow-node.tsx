import { cn } from "@/lib/utils";

interface FlowNodeProps {
  icon?: React.ReactNode;
  label: string;
  sublabel?: string;
  variant?: "default" | "trigger" | "condition" | "action";
  status?: string;
  statusColor?: string;
  statusPulse?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const outerStyles = {
  default: "bg-muted/40 dark:bg-[#1E1E21]",
  trigger: "bg-primary/5 dark:bg-primary/10",
  condition: "bg-amber-50 dark:bg-amber-900/10",
  action: "bg-emerald-50 dark:bg-emerald-900/10",
};

const innerBorderStyles = {
  default: "border-[rgba(46,50,56,0.07)] dark:border-border",
  trigger: "border-primary/20 dark:border-primary/30",
  condition: "border-amber-200/60 dark:border-amber-400/30",
  action: "border-emerald-200/60 dark:border-emerald-400/30",
};

export function FlowNode({
  icon,
  label,
  sublabel,
  variant = "default",
  status,
  statusColor = "bg-emerald-500",
  statusPulse = false,
  children,
  className,
}: FlowNodeProps) {
  return (
    <div
      className={cn(
        "rounded-xl p-1.5",
        outerStyles[variant],
        className
      )}
    >
      <div
        className={cn(
          "rounded-[10px] border bg-white dark:bg-[#27272A] px-4 py-3 shadow-[0px_1px_3px_rgba(0,0,0,0.04),0px_1px_2px_rgba(0,0,0,0.06)]",
          innerBorderStyles[variant]
        )}
      >
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
              {icon}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground truncate">
              {label}
            </p>
            {sublabel && (
              <p className="text-xs text-muted-foreground truncate">
                {sublabel}
              </p>
            )}
          </div>
          {status && (
            <div className="flex shrink-0 items-center gap-1.5">
              <span className={cn("size-1.5 rounded-full", statusColor, statusPulse && "animate-pulse")} />
              <span className="text-[11px] font-medium text-muted-foreground">
                {status}
              </span>
            </div>
          )}
        </div>

        {children && (
          <div className="mt-3 border-t pt-3">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
