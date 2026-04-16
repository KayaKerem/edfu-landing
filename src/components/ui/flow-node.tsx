import { cn } from "@/lib/utils";

interface FlowNodeProps {
  icon?: React.ReactNode;
  label: string;
  sublabel?: string;
  variant?: "default" | "trigger" | "condition" | "action";
  status?: string;
  statusColor?: string;
  statusPulse?: boolean;
  badge?: string;
  attrs?: string[];
  moreCount?: number;
  moreLabel?: string;
  children?: React.ReactNode;
  className?: string;
}

const AttrIcon = (
  <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
    <rect x="1.5" y="1.5" width="11" height="11" rx="3" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

export function FlowNode({
  icon,
  label,
  sublabel,
  variant = "default",
  status,
  statusColor = "bg-emerald-500",
  statusPulse = false,
  badge,
  attrs,
  moreCount,
  moreLabel = "More Attributes",
  children,
  className,
}: FlowNodeProps) {
  return (
    <div
      className={cn(
        "rounded-[10px] border border-[#EDEFF3] bg-white p-[7px] lg:rounded-xl lg:p-[11px]",
        "shadow-[0px_2px_3px_-2px_rgba(16,24,40,0.08)]",
        "dark:border-[#2E3238] dark:bg-[#1C1C1F] dark:shadow-[0px_2px_3px_-2px_rgba(0,0,0,0.3)]",
        className
      )}
    >
      {/* Title row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-1.5 overflow-hidden pl-1 lg:pl-2">
          {icon && (
            <div className="flex size-[14px] shrink-0 items-center justify-center">
              {icon}
            </div>
          )}
          <span className="truncate text-[11px] font-medium text-[#0F172A] dark:text-[#F1F5F9] lg:text-[14px]">
            {label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {status && (
            <div className="flex shrink-0 items-center gap-1.5">
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  statusColor,
                  statusPulse && "animate-pulse"
                )}
              />
              <span className="text-[9px] font-medium text-[#98A2B3] dark:text-[#64748B] lg:text-[11px]">
                {status}
              </span>
            </div>
          )}
          {badge && (
            <span className="rounded-md border border-[#EDEFF3] bg-[#F9FAFB] px-[3px] py-[0.5px] text-[8px] font-medium leading-[11px] text-[#475467] dark:border-[#2E3238] dark:bg-[#27272A] dark:text-[#94A3B8] lg:rounded-lg lg:px-[5px] lg:py-px lg:text-[10px] lg:leading-[14px]">
              {badge}
            </span>
          )}
        </div>
      </div>

      {/* Sublabel */}
      {sublabel && (
        <p className="mt-0.5 truncate pl-1 text-[10px] text-[#475467] dark:text-[#94A3B8] lg:pl-2 lg:text-[12px]">
          {sublabel}
        </p>
      )}

      {/* Attribute rows */}
      {attrs && attrs.length > 0 && (
        <div className="mt-2 border-t border-[#EDEFF3] dark:border-[#2E3238] lg:mt-3">
          {attrs.map((a) => (
            <div
              key={a}
              className="overflow-hidden border-b border-[#EDEFF3] dark:border-[#2E3238] pt-1 pb-[3px] pl-2 lg:pt-1.5 lg:pb-[5px] lg:pl-3"
            >
              <div className="flex items-center gap-x-1.5 text-[#98A2B3] dark:text-[#64748B]">
                {AttrIcon}
                <span className="truncate text-[10px] text-[#475467] dark:text-[#94A3B8] lg:text-[12px]">
                  {a}
                </span>
              </div>
            </div>
          ))}
          {typeof moreCount === "number" && moreCount > 0 && (
            <div className="flex items-center mt-1 gap-x-[6.5px] pl-[8.5px] lg:mt-1.5 lg:gap-x-[7px] lg:pl-[13px]">
              <span className="inline-block h-[3px] w-[3px] rounded-full bg-[#98A2B3] dark:bg-[#64748B]" />
              <span className="inline-block h-[3px] w-[3px] rounded-full bg-[#98A2B3] dark:bg-[#64748B]" />
              <span className="inline-block h-[3px] w-[3px] rounded-full bg-[#98A2B3] dark:bg-[#64748B]" />
              <span className="ml-1 text-[9px] text-[#98A2B3] dark:text-[#64748B] lg:text-[11px]">
                {moreCount} {moreLabel}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Custom children */}
      {children && (
        <div className="mt-2 border-t border-[#EDEFF3] dark:border-[#2E3238] pt-2 lg:mt-3 lg:pt-3">
          {children}
        </div>
      )}
    </div>
  );
}
