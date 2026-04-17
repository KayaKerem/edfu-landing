import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./connect-data.module.css";

type ConnectDataSource = {
  id: string;
  label: string;
};

type ConnectDataRecord = {
  id: string;
  title: string;
  badge: string;
  records: number;
  recordLabel: string;
tone: "blue" | "green" | "orange";
};

export type ConnectDataDict = {
  title: string;
  description: string;
  cta: string;
  ctaHref?: string;
  ariaLabel: string;
  srText: string;
  sources: ConnectDataSource[];
  records: ConnectDataRecord[];
  integrationsLabel: string;
};

const SOURCE_ICONS: Record<string, ReactNode> = {
  sales_engagement: "S",
  email_calendar: "E",
  data_warehouses: "D",
  customer_support: "C",
  billing_invoicing: "B",
  product_data: "P",
};

function SourcePill({ label, id }: { label: string; id: string }) {
  return (
    <div className="flex items-center gap-2 rounded-[12px] border border-[#E8EBEF] bg-white px-3 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <span className="flex size-7 items-center justify-center rounded-[8px] bg-[#F3F5F7] text-[12px] font-semibold text-[#64748B]">
        {SOURCE_ICONS[id] ?? "•"}
      </span>
      <span className="text-[13px] font-medium text-[#0F1720]">{label}</span>
    </div>
  );
}

function RecordCard({
  record,
}: {
  record: ConnectDataRecord;
}) {
  const tones: Record<string, { bg: string; color: string }> = {
    blue: { bg: "#EAF1FF", color: "#2F6BFF" },
    green: { bg: "#E8F7EE", color: "#16A34A" },
    orange: { bg: "#FFF3E4", color: "#F59E53" },
  };

  const tone = tones[record.tone] ?? tones.blue;

  return (
    <div className="rounded-[18px] border border-[#E8EBEF] bg-white p-4 shadow-[0_6px_18px_rgba(15,23,42,0.06)]">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-[12px]" style={{ background: tone.bg, color: tone.color }}>
          <span className="text-[11px] font-semibold">{record.badge.slice(0, 1)}</span>
        </span>
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold text-[#0F1720]">{record.title}</p>
          <p className="text-[12px] text-[#64748B]">{record.records.toLocaleString()} {record.recordLabel}</p>
        </div>
      </div>
    </div>
  );
}

export function ConnectData({ dict }: { dict: ConnectDataDict }) {
  return (
    <section className={cn(styles.root, "py-20 sm:py-24")}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Data</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl" style={{ fontFamily: "var(--font-geist)" }}>
              {dict.title}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              {dict.description}
            </p>
            <span className="sr-only">{dict.srText}</span>
            <div className="mt-8">
              <Link href={dict.ctaHref ?? "#"} className="inline-flex items-center rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                {dict.cta}
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {dict.sources.map((source) => (
                <SourcePill key={source.id} id={source.id} label={source.label} />
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {dict.records.map((record) => (
              <RecordCard key={record.id} record={record} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
