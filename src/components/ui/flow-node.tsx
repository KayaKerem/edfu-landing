import { cn } from "@/lib/utils";

interface FlowNodeProps {
  icon?: React.ReactNode;
  label: string;
  sublabel?: string;
  variant?: "default" | "trigger" | "condition" | "action";
  className?: string;
}

export function FlowNode({
  icon,
  label,
  sublabel,
  variant = "default",
  className,
}: FlowNodeProps) {
  const variantStyles = {
    default:
      "bg-white dark:bg-[#27272A] border-[rgba(46,50,56,0.07)] dark:border-border",
    trigger:
      "bg-white dark:bg-[#27272A] border-primary/30 dark:border-primary/40",
    condition:
      "bg-white dark:bg-[#27272A] border-amber-300/50 dark:border-amber-400/40",
    action:
      "bg-white dark:bg-[#27272A] border-emerald-300/50 dark:border-emerald-400/40",
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border px-4 py-3 shadow-[0px_1px_3px_rgba(0,0,0,0.04),0px_1px_2px_rgba(0,0,0,0.06)]",
        variantStyles[variant],
        className
      )}
    >
      {icon && (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{label}</p>
        {sublabel && (
          <p className="text-xs text-muted-foreground truncate">{sublabel}</p>
        )}
      </div>
    </div>
  );
}
