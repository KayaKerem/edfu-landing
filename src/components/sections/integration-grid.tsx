import { cn } from "@/lib/utils";
import { WhatsApp } from "@/components/ui/svgs/whatsapp";
import { Instagram } from "@/components/ui/svgs/instagram";
import { Telegram } from "@/components/ui/svgs/telegram";
import { WebForm } from "@/components/ui/svgs/web-form";
import { Email } from "@/components/ui/svgs/email";
import { Webhook } from "@/components/ui/svgs/webhook";
import { Zoom } from "@/components/ui/svgs/zoom";
import { GoogleMeet } from "@/components/ui/svgs/google-meet";
import { MsTeams } from "@/components/ui/svgs/ms-teams";
import { Drive } from "@/components/ui/svgs/drive";
import { Notion } from "@/components/ui/svgs/notion";
import { Slack } from "@/components/ui/svgs/slack";
import { CRM } from "@/components/ui/svgs/crm";
import { ERP } from "@/components/ui/svgs/erp";
import { Jira } from "@/components/ui/svgs/jira";
import { HubSpot } from "@/components/ui/svgs/hubspot";
import { API } from "@/components/ui/svgs/api";

export interface IntegrationGridItem {
  name: string;
  description: string;
  color?: string;
}

export interface IntegrationGridSection {
  title: string;
  items: IntegrationGridItem[];
  columns?: number;
}

// Both { className?: string } and SVGProps<SVGSVGElement> accept className
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ICON_MAP: Record<string, React.ComponentType<any>> = {
  WhatsApp,
  Instagram,
  Telegram,
  "Web Form": WebForm,
  "E-posta": Email,
  Email,
  Webhook,
  Zoom,
  "Google Meet": GoogleMeet,
  "Microsoft Teams": MsTeams,
  Drive,
  Notion,
  Slack,
  CRM,
  ERP,
  Jira,
  HubSpot,
  "+ API": API,
};

const DASHED_ITEMS = new Set(["Webhook", "+ API"]);

function IntegrationCard({ item, index }: { item: IntegrationGridItem; index: number }) {
  const Icon = ICON_MAP[item.name];
  const isDashed = DASHED_ITEMS.has(item.name);
  const hasColor = !!item.color && item.color !== "currentColor";

  return (
    <div
      className={cn(
        "rounded-xl p-5 transition-all duration-200 hover:shadow-md",
        isDashed
          ? "border-2 border-dashed border-border bg-transparent"
          : "border border-[rgba(46,50,56,0.07)] dark:border-border bg-white dark:bg-[#27272A]"
      )}
    >
      <div className="flex items-start gap-3">
        {Icon && (
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-[10px]",
              !hasColor && "bg-muted"
            )}
            style={hasColor ? { backgroundColor: item.color } : undefined}
          >
            <Icon
              className={cn(
                "size-5",
                hasColor ? "text-white" : "text-foreground"
              )}
            />
          </div>
        )}
        <div className="min-w-0 pt-0.5">
          <p className="text-sm font-semibold text-foreground leading-tight">
            {item.name}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground leading-snug">
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ index, title }: { index: number; title: string }) {
  const num = String(index + 1).padStart(2, "0");
  return (
    <div className="mb-5 flex items-center gap-3">
      <span
        className="text-sm font-medium text-muted-foreground"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        [{num}]
      </span>
      <h3 className="text-base font-semibold text-foreground" style={{ fontFamily: "var(--font-geist)" }}>
        {title}
      </h3>
    </div>
  );
}

interface IntegrationGridProps {
  sections: IntegrationGridSection[];
  className?: string;
}

export function IntegrationGrid({ sections, className }: IntegrationGridProps) {
  return (
    <section className={cn("py-16 px-4 sm:px-6", className)}>
      <div className="space-y-12">
        {sections.map((section, sectionIndex) => {
          const cols = section.columns ?? (section.items.length > 4 ? 4 : section.items.length);
          const gridCols =
            cols === 4
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              : cols === 3
              ? "grid-cols-1 sm:grid-cols-3"
              : cols === 2
              ? "grid-cols-1 sm:grid-cols-2"
              : "grid-cols-1";

          return (
            <div key={sectionIndex}>
              <SectionHeader index={sectionIndex} title={section.title} />
              <div className={cn("grid gap-4", gridCols)}>
                {section.items.map((item, itemIndex) => (
                  <IntegrationCard key={itemIndex} item={item} index={itemIndex} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
