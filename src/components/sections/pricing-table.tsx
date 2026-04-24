"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { TalkToSalesSheet } from "./talk-to-sales-sheet";
import { type Billing } from "./pricing";
import styles from "./pricing-table.module.css";
import type { Dictionary } from "@/dictionaries";

/* ── Feature value type ─────────────────────────────────────── */
type FeatureValue = boolean | string | null;
// true  → dark checkmark
// false → grey ×
// null  → dash (—)
// string → text value

interface FeatureRow {
  name: string;
  tooltip?: string;
  values: [FeatureValue, FeatureValue, FeatureValue];
  indent?: boolean;
}

interface Category {
  title: string;
  rows: FeatureRow[];
}

/* ── Feature table data (Edfu-adapted) ──────────────────────── */
const CATEGORIES: Category[] = [
  {
    title: "Knowledge Base",
    rows: [
      {
        name: "Knowledge bases",
        tooltip: "Number of separate knowledge bases you can create",
        values: ["1", "10", "Unlimited"],
      },
      {
        name: "Documents",
        tooltip: "Total documents stored across all knowledge bases",
        values: ["500", "10,000", "Unlimited"],
      },
      {
        name: "Max file size",
        values: ["25 MB", "100 MB", "500 MB"],
      },
      {
        name: "Supported formats",
        tooltip: "PDF, DOCX, TXT, MD, CSV, XLSX, PPTX, and more",
        values: [true, true, true],
      },
      {
        name: "Website crawling",
        tooltip: "Automatically crawl and index web pages",
        values: ["200/mo", "1,000/mo", "Unlimited"],
      },
      {
        name: "Auto-sync integrations",
        tooltip: "Automatically keep connected sources up to date",
        values: [false, true, true],
      },
      {
        name: "Custom data sources",
        values: [false, false, true],
      },
    ],
  },
  {
    title: "AI",
    rows: [
      {
        name: "AI queries per month",
        tooltip: "Number of questions you can ask across all knowledge bases",
        values: ["1,000", "10,000", "Unlimited"],
      },
      {
        name: "AI models",
        tooltip: "Available language models for answering queries",
        values: ["Claude Sonnet", "300+ models", "Custom models"],
      },
      {
        name: "AI agents",
        tooltip: "Autonomous agents that can research and synthesize across documents",
        values: [false, true, true],
      },
      {
        name: "Custom instructions",
        tooltip: "Set custom system prompts and behavior per knowledge base",
        values: [false, true, true],
      },
      {
        name: "Ask AI on any document",
        values: [true, true, true],
      },
      {
        name: "Answer citations",
        tooltip: "AI answers include source document references",
        values: [true, true, true],
      },
    ],
  },
  {
    title: "Integrations",
    rows: [
      {
        name: "Integrations",
        tooltip: "Number of third-party integrations available",
        values: ["5", "20", "Unlimited"],
      },
      {
        name: "API access",
        values: [false, true, true],
      },
      {
        name: "Webhooks",
        values: [false, true, true],
      },
      {
        name: "Embed widget",
        tooltip: "Embed Edfu directly into your own website or app",
        values: [true, true, true],
      },
      {
        name: "MCP server",
        tooltip: "Connect Edfu as an MCP tool in Claude, Cursor, etc.",
        values: [false, true, true],
      },
      {
        name: "Slack bot",
        values: [false, true, true],
      },
    ],
  },
  {
    title: "Team",
    rows: [
      {
        name: "Users",
        values: ["5", "Unlimited", "Unlimited"],
      },
      {
        name: "Role-based access",
        tooltip: "Assign Admin, Editor, or Viewer roles to team members",
        values: [false, true, true],
      },
      {
        name: "Teams & groups",
        values: [false, false, true],
      },
      {
        name: "SSO",
        tooltip: "Single sign-on via SAML 2.0 / OIDC",
        values: [false, false, true],
      },
      {
        name: "Audit logs",
        values: [false, false, true],
      },
      {
        name: "Payment by invoice",
        values: [false, false, true],
      },
    ],
  },
  {
    title: "Analytics",
    rows: [
      {
        name: "Usage dashboard",
        values: [false, true, true],
      },
      {
        name: "Query analytics",
        tooltip: "See what your team is asking and which topics are most queried",
        values: [false, true, true],
      },
      {
        name: "Response quality tracking",
        values: [false, false, true],
      },
      {
        name: "Custom reports",
        values: [false, false, true],
      },
    ],
  },
  {
    title: "Support",
    rows: [
      {
        name: "Help center",
        values: [true, true, true],
      },
      {
        name: "Email support",
        values: [true, true, true],
      },
      {
        name: "Priority support",
        values: [false, true, true],
      },
      {
        name: "Dedicated account manager",
        values: [false, false, true],
      },
      {
        name: "Custom onboarding",
        values: [false, false, true],
      },
      {
        name: "Migration service",
        values: [null, "Talk to sales", "Talk to sales"],
      },
    ],
  },
];

/* ── Icons ─────────────────────────────────────────────────────  */
function CheckMark() {
  return (
    <span className={styles.checkMark} aria-label="Included">
      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
        <path d="M1 4l3 3 5-6" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function XMark() {
  return (
    <span className={styles.xMark} aria-label="Not included">
      ×
    </span>
  );
}

function DashMark() {
  return <span className={styles.xMark} aria-label="Not available">—</span>;
}

function FeatureValueCell({ value }: { value: FeatureValue }) {
  if (value === true) return <CheckMark />;
  if (value === false) return <XMark />;
  if (value === null) return <DashMark />;
  return <span className={styles.textValue}>{value}</span>;
}

function getStickyPlanDescription({
  idx,
  billing,
  plan,
}: {
  idx: number;
  billing: Billing;
  plan: Dictionary["pricing"]["plans"][number];
}) {
  if (idx === 0) {
    const price = billing === "annual" ? "₺1,592" : "₺1,990";
    return `${price} ${plan.description}`;
  }

  return plan.description;
}

/* ── Sticky header ──────────────────────────────────────────── */
function StickyHeader({
  billing,
  setBilling,
  dict,
  headerRef,
  isPinned,
}: {
  billing: Billing;
  setBilling: (b: Billing) => void;
  dict: Dictionary["pricing"];
  headerRef?: React.RefObject<HTMLDivElement | null>;
  isPinned?: boolean;
}) {
  return (
    <div ref={headerRef} className={cn(styles.stickyHeader, isPinned && styles.stickyHeaderPinned)}>
      <div className={styles.stickyInner}>
        {/* Left column: billing toggle */}
        <div className={styles.stickyLabel}>
          <p className={styles.stickyLabelText}>{dict.billingCycleLabel}</p>
          <div className={styles.stickyToggle}>
            <button
              className={cn(styles.stickyToggleBtn, billing === "monthly" && styles.stickyToggleBtnActive)}
              onClick={() => setBilling("monthly")}
            >
              {billing === "monthly" && (
                <motion.div
                  layoutId="sticky-pricing-pill"
                  className={styles.stickyTogglePill}
                  transition={{ type: "spring", stiffness: 420, damping: 30 }}
                />
              )}
              <span style={{ position: "relative", zIndex: 1 }}>{dict.monthly}</span>
            </button>
            <button
              className={cn(styles.stickyToggleBtn, billing === "annual" && styles.stickyToggleBtnActive)}
              onClick={() => setBilling("annual")}
            >
              {billing === "annual" && (
                <motion.div
                  layoutId="sticky-pricing-pill"
                  className={styles.stickyTogglePill}
                  transition={{ type: "spring", stiffness: 420, damping: 30 }}
                />
              )}
              <span style={{ position: "relative", zIndex: 1 }}>{dict.yearly}</span>
            </button>
          </div>
        </div>

        {/* Plan columns — driven by dict */}
        {dict.plans.map((plan, idx) => {
          const isPro = idx === 1;
          const summary = getStickyPlanDescription({ idx, billing, plan });
          return (
            <div key={plan.name} className={styles.stickyPlanCol}>
              <span className={styles.stickyPlanName}>
                {plan.name}
                {isPro && <span className={styles.popularBadge}>{dict.popularLabel}</span>}
              </span>
              <span className={styles.stickyPlanPrice}>{summary}</span>
              {plan.ctaHref ? (
                <Link
                  href={plan.ctaHref}
                  className={cn(styles.stickyCta, isPro ? styles.stickyCtaPro : styles.stickyCtaRegular)}
                >
                  {plan.cta}
                </Link>
              ) : idx === 2 ? (
                <TalkToSalesSheet
                  layoutId={`talk-to-sales-sticky-${plan.name.toLowerCase()}`}
                  dict={plan.salesForm!}
                  trigger={
                    <button
                      type="button"
                      className={cn(styles.stickyCta, isPro ? styles.stickyCtaPro : styles.stickyCtaRegular)}
                    >
                      {plan.cta}
                    </button>
                  }
                />
              ) : (
                <button
                  type="button"
                  className={cn(styles.stickyCta, isPro ? styles.stickyCtaPro : styles.stickyCtaRegular)}
                >
                  {plan.cta}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Feature row ────────────────────────────────────────────── */
function FeatureTableRow({ row }: { row: FeatureRow }) {
  const rowClass = row.indent ? styles.subRow : styles.tableRow;
  const featureClass = row.indent ? styles.subRowFeature : styles.rowFeature;

  return (
    <div className={rowClass} role="row">
      <div className={featureClass}>
        <span>{row.name}</span>
        {row.tooltip && (
          <abbr title={row.tooltip} className={styles.infoBtn} style={{ textDecoration: "none" }}>
            i
          </abbr>
        )}
      </div>
      {row.values.map((val, i) => (
        <div key={i} className={styles.rowValue} role="cell">
          <FeatureValueCell value={val} />
        </div>
      ))}
    </div>
  );
}

/* ── Main export ─────────────────────────────────────────────── */
export interface PricingTableProps {
  dict: Dictionary["pricing"];
  billing: Billing;
  onBillingChange: (b: Billing) => void;
}

export function PricingTable({ dict, billing, onBillingChange }: PricingTableProps) {
  const tableRootRef = useRef<HTMLDivElement | null>(null);
  const stickyHeaderRef = useRef<HTMLDivElement | null>(null);
  const [stickyHeaderHeight, setStickyHeaderHeight] = useState(0);
  const [isStickyHeaderPinned, setIsStickyHeaderPinned] = useState(false);

  useEffect(() => {
    const header = stickyHeaderRef.current;
    if (!header) return;

    const updateHeight = () => {
      setStickyHeaderHeight(header.getBoundingClientRect().height);
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(header);

    window.addEventListener("resize", updateHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  useEffect(() => {
    const root = tableRootRef.current;
    const header = stickyHeaderRef.current;
    if (!root || !header) return;

    const navbarOffset = 60;

    const updatePinnedState = () => {
      const rootRect = root.getBoundingClientRect();
      const headerHeight = header.getBoundingClientRect().height;
      const shouldPin =
        rootRect.top <= navbarOffset &&
        rootRect.bottom - headerHeight > navbarOffset;

      setIsStickyHeaderPinned(shouldPin);
    };

    updatePinnedState();

    window.addEventListener("scroll", updatePinnedState, { passive: true });
    window.addEventListener("resize", updatePinnedState);

    return () => {
      window.removeEventListener("scroll", updatePinnedState);
      window.removeEventListener("resize", updatePinnedState);
    };
  }, [stickyHeaderHeight]);

  // Broadcast pinned state to the document root so the navbar can react.
  useEffect(() => {
    const root = document.documentElement;
    if (isStickyHeaderPinned) {
      root.dataset.pricingStickyPinned = "true";
    } else {
      delete root.dataset.pricingStickyPinned;
    }
    return () => {
      delete root.dataset.pricingStickyPinned;
    };
  }, [isStickyHeaderPinned]);

  return (
    <div
      ref={tableRootRef}
      className={styles.tableRoot}
      style={{ "--pricing-sticky-header-height": `${stickyHeaderHeight}px` } as CSSProperties}
    >
      {/* Sticky header */}
      <div
        className={styles.stickyHeaderShell}
        style={{ height: stickyHeaderHeight ? `${stickyHeaderHeight}px` : undefined }}
      >
        <StickyHeader
          billing={billing}
          setBilling={onBillingChange}
          dict={dict}
          headerRef={stickyHeaderRef}
          isPinned={isStickyHeaderPinned}
        />
      </div>

      {/* Table body */}
      <div className={styles.tableBody} role="table" aria-label="Feature comparison">
        {CATEGORIES.map((cat) => (
          <div key={cat.title} className={styles.categorySection}>
            <div className={styles.categoryHeading}>
              <h3 className={styles.categoryTitle}>{cat.title}</h3>
            </div>
            {cat.rows.map((row) => (
              <FeatureTableRow key={row.name} row={row} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
