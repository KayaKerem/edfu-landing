"use client";

import Link from "next/link";
import type { CSSProperties, ReactElement } from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/components/ui/animated-number";
import styles from "./connect-data.module.css";
import { SectionFrame } from "./section-frame";

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

const RECORD_NUMBER_FORMATTER = new Intl.NumberFormat("en-US");

const SOURCE_ROWS: ConnectDataSource["id"][][] = [
  ["sales_engagement", "email_calendar"],
  ["data_warehouses", "customer_support"],
  ["billing_invoicing", "product_data"],
];

const CONNECTOR_SEGMENTS = [
  {
    id: "left",
    className: "connectorLeft",
    width: 132,
    height: 120,
    viewBox: "0 0 132 120",
    path: "M6 120V16C6 10.4772 10.4772 6 16 6H120C123.3137 6 126 3.3137 126 0",
  },
  {
    id: "center",
    className: "connectorCenter",
    width: 1,
    height: 215,
    viewBox: "0 0 1 215",
    path: "M0.5 215V0",
  },
  {
    id: "right",
    className: "connectorRight",
    width: 132,
    height: 120,
    viewBox: "0 0 132 120",
    path: "M126 120V16C126 10.4772 121.5228 6 116 6H12C8.6863 6 6 3.3137 6 0",
  },
] as const;

const PASSIVE_GUIDES = [
  {
    id: "right-lower",
    width: 108,
    height: 72,
    viewBox: "0 0 108 72",
    path: "M0.5 0V71.5 H72",
    className: "guideRightLower",
  },
  {
    id: "right-upper",
    width: 108,
    height: 109,
    viewBox: "0 0 108 109",
    path: "M0 0.5H36 V108.5 H72",
    className: "guideRightUpper",
  },
  {
    id: "right-long",
    width: 72,
    height: 181,
    viewBox: "0 0 72 181",
    path: "M0 0.5H72 V180.5",
    className: "guideRightLong",
  },
  {
    id: "left-long",
    width: 72,
    height: 181,
    viewBox: "0 0 72 181",
    path: "M0.5 180V0.5 H72",
    className: "guideLeftLong",
  },
  {
    id: "left-upper",
    width: 108,
    height: 109,
    viewBox: "0 0 108 109",
    path: "M0 108.5H72 V0.5 H108",
    className: "guideLeftUpper",
  },
  {
    id: "left-lower",
    width: 108,
    height: 72,
    viewBox: "0 0 108 72",
    path: "M0.5 71.5H107.5 V0",
    className: "guideLeftLower",
  },
] as const;

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" aria-hidden="true" width={14} height={14}>
      <path
        d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SourceArrowIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" width={12} height={12}>
      <path
        d="M3.2 8.8 8.8 3.2M4.8 3.2h4v4"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="2" y="2" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.1" opacity="0.45" />
    </svg>
  );
}

function SourceMailIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" width={12} height={12}>
      <rect x="1.8" y="2.6" width="8.4" height="6.8" rx="1.7" stroke="currentColor" strokeWidth="1.1" />
      <path
        d="m2.8 4 2.5 2 1.2.8 1.2-.8 2.5-2"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SourceDatabaseIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" width={12} height={12}>
      <ellipse cx="6" cy="3" rx="3.5" ry="1.5" stroke="currentColor" strokeWidth="1.1" />
      <path
        d="M2.5 3v5.5c0 .8 1.6 1.5 3.5 1.5s3.5-.7 3.5-1.5V3M2.5 5.7c0 .8 1.6 1.5 3.5 1.5s3.5-.7 3.5-1.5"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SourceUsersIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" width={12} height={12}>
      <circle cx="4.3" cy="4.3" r="1.4" stroke="currentColor" strokeWidth="1.1" />
      <path d="M1.9 9.5c0-1.3 1-2.3 2.4-2.3s2.4 1 2.4 2.3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M8.2 4a1.4 1.4 0 0 1 0 2.7M10.1 9.5c0-1.2-.8-2.1-1.9-2.3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

function SourceCoinIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" width={12} height={12}>
      <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.1" />
      <path
        d="M6 3.7v4.6M7.6 4.9c-.3-.5-.9-.8-1.6-.8-.9 0-1.6.5-1.6 1.1 0 .6.7 1 1.6 1 .9 0 1.6.4 1.6 1 0 .6-.7 1.1-1.6 1.1-.7 0-1.3-.3-1.6-.8"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SourceMonitorIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" width={12} height={12}>
      <rect x="2" y="2.2" width="8" height="5.6" rx="1.4" stroke="currentColor" strokeWidth="1.1" />
      <path d="M4.6 9.8h2.8M6 7.8v2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

const SOURCE_ICONS: Record<string, () => ReactElement> = {
  sales_engagement: SourceArrowIcon,
  email_calendar: SourceMailIcon,
  data_warehouses: SourceDatabaseIcon,
  customer_support: SourceUsersIcon,
  billing_invoicing: SourceCoinIcon,
  product_data: SourceMonitorIcon,
};

function WorkspaceIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" width={16} height={16}>
      <rect x="2" y="2" width="5.2" height="5.2" rx="1.4" fill="currentColor" />
      <rect x="8.8" y="2" width="5.2" height="5.2" rx="1.4" fill="currentColor" opacity="0.8" />
      <rect x="2" y="8.8" width="5.2" height="5.2" rx="1.4" fill="currentColor" opacity="0.8" />
      <rect x="8.8" y="8.8" width="5.2" height="5.2" rx="1.4" fill="currentColor" />
    </svg>
  );
}

function CompanyIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" width={16} height={16}>
      <rect x="3" y="2" width="10" height="12" rx="2.2" fill="currentColor" />
      <path d="M6 6.1h4M6 8.8h4M6 11.5h2.5" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function DealIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" width={16} height={16}>
      <rect x="2.5" y="2.5" width="11" height="11" rx="2.6" fill="currentColor" />
      <path d="M8 5.2v5.6M10 6.7c-.3-.5-1-.9-2-.9-1.1 0-1.9.5-1.9 1.2 0 .7.8 1.1 1.9 1.1 1.1 0 1.9.4 1.9 1.1 0 .7-.8 1.2-1.9 1.2-1 0-1.7-.4-2-.9" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

const RECORD_ICONS: Record<string, () => ReactElement> = {
  workspace: WorkspaceIcon,
  company: CompanyIcon,
  deal: DealIcon,
};

function HubMarkIcon() {
  return (
    <svg viewBox="0 0 28 28" fill="none" aria-hidden="true" width={28} height={28}>
      <path d="M8.4 6.3 15 17.5 11.2 22.8 4.6 11.7 8.4 6.3Z" fill="currentColor" />
      <path d="m16.2 17.4 4-5.8 3.2 5.4-4 5.8-3.2-5.4Z" fill="currentColor" opacity="0.9" />
      <path d="m9.2 5.2 4.4-1.7 6.6 11.1-4.5 1.8L9.2 5.2Z" fill="currentColor" opacity="0.78" />
    </svg>
  );
}

function CubeGlyph() {
  return (
    <svg
      width="120"
      height="122"
      viewBox="0 0 120 122"
      fill="none"
      className="overflow-visible"
      aria-hidden="true"
    >
      <path
        d="M87.1271 16.0359V20.9825L61.3409 34.057C60.5268 34.4699 59.5647 34.4694 58.7508 34.056L32.9642 20.9585V16.0357C32.9642 14.9538 33.5741 13.9645 34.5408 13.4786L58.7603 1.30485C59.569 0.898384 60.5221 0.898384 61.3307 1.30485L85.5503 13.4786C86.5169 13.9645 87.1271 14.9541 87.1271 16.0359Z"
        fill="var(--cd-cube-surface)"
        stroke="var(--cd-cube-stroke)"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M119.085 65.6369V89.7095C119.085 90.7745 118.494 91.7514 117.55 92.2452L95.2908 103.892C94.4676 104.323 93.4869 104.327 92.66 103.903L85.9824 100.485V74.0949C85.9824 73.014 86.5914 72.0254 87.5566 71.539L110.97 59.7432L117.524 63.0875C118.482 63.5763 119.085 64.5613 119.085 65.6369Z"
        fill="var(--cd-cube-surface)"
        stroke="var(--cd-cube-stroke)"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M34.1025 74.1096V100.493L27.4249 103.912C26.5979 104.335 25.6172 104.331 24.7941 103.9L2.53517 92.2538C1.59161 91.7599 1 90.783 1 89.7181V65.6453C1 64.5698 1.60303 63.5851 2.56087 63.0963L9.01973 59.7998L32.5202 71.5499C33.4897 72.0347 34.1025 73.0256 34.1025 74.1096Z"
        fill="var(--cd-cube-surface)"
        stroke="var(--cd-cube-stroke)"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g opacity={0.3}>
        <path
          d="M118.637 64.1123L93.9709 76.4322V104.226"
          stroke="var(--cd-cube-stroke)"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M33.4058 14.4998L60.0339 28.0136L86.6773 14.4922"
          stroke="var(--cd-cube-stroke)"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M60.0424 28.0156V34.3684"
          stroke="var(--cd-cube-stroke)"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M86.427 72.5791L93.972 76.4324"
          stroke="#505967"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1.46802 64.1279L26.1033 76.4323V104.13"
          stroke="#505967"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M33.648 72.5742L26.0978 76.4302"
          stroke="#505967"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <path
        d="M119.091 32.067V53.8972C119.091 54.9776 118.483 55.9659 117.518 56.4523L110.976 59.7521L87.5631 71.5479C86.5979 72.0341 85.9889 73.0229 85.9889 74.1038V106.534C85.9889 107.616 85.379 108.605 84.4126 109.091L61.3324 120.696C60.5254 121.102 59.574 121.102 58.7668 120.696L35.6866 109.092C34.7202 108.606 34.1103 107.617 34.1103 106.535V74.1098C34.1103 73.0258 33.4978 72.0349 32.5283 71.5501L9.02782 59.7999L2.7296 56.641C1.76176 56.1556 1.15088 55.1656 1.15088 54.083V31.9946C1.15088 30.9197 1.75319 29.9354 2.71056 29.4461L24.8174 18.1503C25.6322 17.7338 26.5972 17.7324 27.4135 18.1463L32.968 20.962L58.7547 34.0596C59.5686 34.4729 60.5307 34.4732 61.3448 34.0605L87.131 20.986L92.6869 18.1696C93.5025 17.7562 94.4665 17.7574 95.2809 18.1727L117.529 29.5183C118.487 30.0071 119.091 30.9911 119.091 32.067Z"
        fill="white"
        stroke="#505967"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g opacity={0.6}>
        <path
          d="M60.1206 120.884V60.2871"
          stroke="#505967"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M118.648 30.5433L60.042 60.2858L1.62817 30.4912"
          stroke="#505967"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

function SlackLogo() {
  return (
    <svg viewBox="0 0 28 28" fill="none" aria-hidden="true" width={28} height={28}>
      <rect x="3" y="11.6" width="7.1" height="4.8" rx="2.4" fill="#36C5F0" />
      <rect x="6.1" y="3" width="4.8" height="7.1" rx="2.4" fill="#2EB67D" />
      <rect x="11.6" y="3" width="4.8" height="7.1" rx="2.4" fill="#ECB22E" />
      <rect x="17" y="6.1" width="7.1" height="4.8" rx="2.4" fill="#ECB22E" />
      <rect x="17" y="11.6" width="7.1" height="4.8" rx="2.4" fill="#E01E5A" />
      <rect x="17" y="17" width="4.8" height="7.1" rx="2.4" fill="#36C5F0" />
      <rect x="11.6" y="17" width="4.8" height="7.1" rx="2.4" fill="#2EB67D" />
      <rect x="3" y="17" width="7.1" height="4.8" rx="2.4" fill="#E01E5A" />
    </svg>
  );
}

function ZapierLogo() {
  return (
    <svg viewBox="0 0 28 28" fill="none" aria-hidden="true" width={28} height={28}>
      <path d="M14 4.4v19.2M4.4 14h19.2M7.2 7.2l13.6 13.6M20.8 7.2 7.2 20.8" stroke="#FF5A1F" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function GmailLogo() {
  return (
    <svg viewBox="0 0 28 28" fill="none" aria-hidden="true" width={28} height={28}>
      <path d="M4 8.7 14 16l10-7.3v11.1c0 1.2-.9 2.2-2.1 2.2H6.1C4.9 22 4 21 4 19.8V8.7Z" fill="#EA4335" />
      <path d="M4 8.7v11.1c0 1.2.9 2.2 2.1 2.2h2.5V11.5L4 8.7Z" fill="#4285F4" />
      <path d="M24 8.7v11.1c0 1.2-.9 2.2-2.1 2.2h-2.5V11.5L24 8.7Z" fill="#34A853" />
      <path d="M4 8.7 8.6 12V6.9c0-1 .8-1.8 1.8-1.8h.5L14 8l3.1-2.9h.5c1 0 1.8.8 1.8 1.8V12L24 8.7 17.4 3H10.6L4 8.7Z" fill="#FBBC04" />
    </svg>
  );
}

function OutlookLogo() {
  return (
    <svg viewBox="0 0 28 28" fill="none" aria-hidden="true" width={28} height={28}>
      <path d="M11 7h12a1.5 1.5 0 0 1 1.5 1.5v11A1.5 1.5 0 0 1 23 21H11V7Z" fill="#2D7DCC" />
      <path d="M11 9.1 17.5 14 24 9.1" stroke="#B9D8FF" strokeWidth="1.3" />
      <path d="M4.5 8.5h10v11h-10z" fill="#0A5FB8" />
      <circle cx="9.5" cy="14" r="3" fill="#FFFFFF" />
      <circle cx="9.5" cy="14" r="1.6" fill="#0A5FB8" />
    </svg>
  );
}

function StripeLogo() {
  return (
    <svg viewBox="0 0 28 28" fill="none" aria-hidden="true" width={28} height={28}>
      <path d="M7.5 17.7c1.2.9 2.7 1.4 4.2 1.4 2 0 3.4-.8 3.4-2.2 0-3.1-8.1-1.8-8.1-6.4 0-2.6 2.1-4.3 5.3-4.3 1.5 0 3 .4 4.2 1.1l-1 2.6c-1-.6-2.1-1-3.3-1-1.6 0-2.5.7-2.5 1.8 0 2.9 8.1 1.7 8.1 6.3 0 2.6-2.2 4.7-6.1 4.7-1.8 0-3.6-.5-5-1.5l.8-2.5Z" fill="#63C38C" />
    </svg>
  );
}

function NotionLogo() {
  return (
    <svg viewBox="0 0 28 28" fill="none" aria-hidden="true" width={28} height={28}>
      <rect x="4.5" y="5.5" width="19" height="17" rx="3.2" fill="#18181B" />
      <path d="M10 10v8M10 10h5.7l2.3 8V10" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LinearLogo() {
  return (
    <svg viewBox="0 0 28 28" fill="none" aria-hidden="true" width={28} height={28}>
      <path d="M7 21V7h3.4v14H7Zm5.5 0L19.8 7h3.4L16 21h-3.5Zm8.1 0V7H24v14h-3.4Z" fill="#B64DFF" />
    </svg>
  );
}

function LoomLogo() {
  return (
    <svg viewBox="0 0 28 28" fill="none" aria-hidden="true" width={28} height={28}>
      <circle cx="14" cy="14" r="9" fill="#5D52F3" />
      <circle cx="14" cy="14" r="3.2" fill="#FFFFFF" />
    </svg>
  );
}

const INTEGRATION_LOGOS: Array<{ id: string; render: () => ReactElement }> = [
  { id: "zapier", render: ZapierLogo },
  { id: "slack", render: SlackLogo },
  { id: "gmail", render: GmailLogo },
  { id: "outlook", render: OutlookLogo },
  { id: "stripe", render: StripeLogo },
  { id: "notion", render: NotionLogo },
  { id: "loom", render: LoomLogo },
  { id: "linear", render: LinearLogo },
];

function SourceChip({ source, idx }: { source: ConnectDataSource; idx: number }) {
  const Icon = SOURCE_ICONS[source.id] ?? SourceArrowIcon;
  return (
    <div className={styles.sourceRow} style={{ "--delay": `${120 + idx * 90}ms` } as CSSProperties}>
      <span className={styles.sourceIcon} aria-hidden="true">
        <Icon />
      </span>
      <span className={styles.sourceLabel}>{source.label}</span>
    </div>
  );
}

function SourcePair({ sources, rowIndex }: { sources: ConnectDataSource[]; rowIndex: number }) {
  return (
    <div className={cn(styles.sourcePair, styles[`sourcePair${rowIndex + 1}`])}>
      {sources.map((source, idx) => (
        <SourceChip key={source.id} source={source} idx={rowIndex * 2 + idx} />
      ))}
    </div>
  );
}

function RecordCard({
  record,
  idx,
  visible,
}: {
  record: ConnectDataRecord;
  idx: number;
  visible: boolean;
}) {
  const tones: Record<ConnectDataRecord["tone"], { bg: string; border: string; color: string }> = {
    blue: { bg: "#E8F6FF", border: "#D7EDFF", color: "#4CB4EA" },
    green: { bg: "#EEF5FF", border: "#DEE9FF", color: "#4A73E8" },
    orange: { bg: "#FFF3E7", border: "#FFE6CF", color: "#F3A24A" },
  };
  const Icon = RECORD_ICONS[record.id];
  const tone = tones[record.tone];

  return (
    <article
      className={cn(styles.recordCard, styles[`record${record.id[0].toUpperCase()}${record.id.slice(1)}`])}
      style={{ "--card-delay": `${720 + idx * 110}ms` } as CSSProperties}
    >
      <header className={styles.recordHeader}>
        <span className={styles.recordMark} style={{ background: tone.bg, borderColor: tone.border, color: tone.color }} aria-hidden="true">
          <Icon />
        </span>
        <span className={styles.recordTitle}>{record.title}</span>
        <span className={styles.recordBadge}>{record.badge}</span>
      </header>
      <div className={styles.recordHairline} aria-hidden="true" />
      <p className={styles.recordMeta}>
        <AnimatedNumber
          value={visible ? record.records : 0}
          mass={0.7}
          stiffness={90}
          damping={16}
          format={(num) => RECORD_NUMBER_FORMATTER.format(num)}
        />{" "}
        <span>{record.recordLabel}</span>
      </p>
    </article>
  );
}

function IntegrationBadge({ idx, render: RenderIcon }: { idx: number; render: () => ReactElement }) {
  return (
    <div className={styles.integrationBadge} style={{ "--logo-delay": `${220 + idx * 80}ms` } as CSSProperties}>
      <RenderIcon />
    </div>
  );
}

export function ConnectData({ dict }: { dict: ConnectDataDict }) {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const trigger = () => {
      if (hasPlayedRef.current) return;
      hasPlayedRef.current = true;
      setVisible(true);
    };
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < vh * 0.9 && rect.bottom > vh * 0.1) {
      trigger();
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            trigger();
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: [0, 0.1, 0.25], rootMargin: "0px 0px -80px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const paths = svg.querySelectorAll<SVGPathElement>("path[data-connector]");
    paths.forEach((path) => {
      const len = Math.ceil(path.getTotalLength());
      path.style.setProperty("--len", String(len));
    });
  }, []);

  return (
    <SectionFrame
      ref={sectionRef}
      ariaLabel={dict.ariaLabel}
      className={styles.root}
      gridClassName="grid-cols-1 lg:grid-cols-[minmax(220px,0.9fr)_minmax(500px,1.4fr)_minmax(360px,0.9fr)] divide-y divide-border lg:divide-y-0 lg:divide-x lg:divide-border"
      data-visible={visible ? "true" : "false"}
    >
      <div className={styles.textCol}>
        <div className="max-w-[320px] flex flex-col justify-start px-6">
          <h2 className={styles.title} style={{ fontFamily: "var(--font-geist)" }}>
            {dict.title}
          </h2>
          <p className={styles.description}>{dict.description}</p>
          <span className="sr-only">{dict.srText}</span>
        </div>
        <Link href={dict.ctaHref ?? "#"} className={styles.cta}>
          <span>{dict.cta}</span>
          <span className={styles.arrow} aria-hidden="true">
            <ArrowRightIcon />
          </span>
        </Link>
      </div>

      <div className={styles.canvas}>
        <div className={styles.sourceGrid} aria-hidden="true" />
        {/* <div className={cn(styles.sourceAccent, styles.sourceAccentTop)} aria-hidden="true" /> */}
        {/* <div className={cn(styles.sourceAccent, styles.sourceAccentBottom)} aria-hidden="true" /> */}
        <div className={styles.sourceRows}>
          {SOURCE_ROWS.map((row, rowIndex) => (
            <SourcePair
              key={row.join("-")}
              rowIndex={rowIndex}
              sources={row.map((id) => dict.sources.find((source) => source.id === id)).filter(Boolean) as ConnectDataSource[]}
            />
          ))}
        </div>

        <div className={styles.modelStage}>
          <div className={styles.modelDots} aria-hidden="true" />
          <div className={styles.connectorGuides} aria-hidden="true">
            {PASSIVE_GUIDES.map((guide) => (
              <svg
                key={guide.id}
                className={cn(styles.guideSvg, styles[guide.className])}
                width={guide.width}
                height={guide.height}
                viewBox={guide.viewBox}
                fill="none"
              >
                <path className={styles.guidePath} d={guide.path} />
              </svg>
            ))}
          </div>

          <div ref={svgRef} className={styles.lowerChart} aria-hidden="true">
            {CONNECTOR_SEGMENTS.map((segment) => (
              <svg
                key={segment.id}
                className={cn(styles.connectorSvg, styles[segment.className])}
                width={segment.width}
                height={segment.height}
                viewBox={segment.viewBox}
                fill="none"
              >
                <path className={styles.connectorBase} d={segment.path} />
                <path
                  className={cn(styles.connectorPulse, styles[`${segment.className}Pulse`])}
                  d={segment.path}
                  data-connector={segment.id}
                />
              </svg>
            ))}
          </div>

          <div className={styles.hubCard}>
            <span className={styles.hubMark} aria-hidden="true">
              <HubMarkIcon />
            </span>
          </div>

          <div className={styles.recordGrid}>
            {dict.records.slice(0, 3).map((record, idx) => (
              <RecordCard key={record.id} record={record} idx={idx} visible={visible} />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.sideCol}>
        <div className={styles.integrationsTop} aria-label={dict.integrationsLabel}>
          <div className={styles.integrationGrid}>
            {INTEGRATION_LOGOS.map((logo, idx) => (
              <IntegrationBadge key={logo.id} idx={idx} render={logo.render} />
            ))}
          </div>
        </div>
        <div className={styles.cubeWrap}>
          <div className={styles.cubeGrid} aria-hidden="true">
            <div className={styles.cubeCell} />
            <div className={styles.cubeCell} />
            <div className={styles.cubeCell} />
            <div className={styles.cubeCell} />
            <div className={styles.cubeCell} />
            <div />
          </div>
          <div className={styles.cubeGlyph} aria-hidden="true">
            <CubeGlyph />
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}
