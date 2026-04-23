"use client";

import { useState, type ReactElement } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/components/ui/animated-number";
import styles from "./pricing.module.css";
import type { Dictionary } from "@/dictionaries";

export type Billing = "monthly" | "annual";

export interface PricingProps {
  dict: Dictionary["pricing"];
  billing?: Billing;
  onBillingChange?: (b: Billing) => void;
}

/* ── Billing toggle ─────────────────────────────────────────── */
export function BillingToggle({
  billing,
  setBilling,
  saveLabel,
}: {
  billing: Billing;
  setBilling: (b: Billing) => void;
  saveLabel: string;
}) {
  return (
    <div className={styles.toggle}>
      <button
        className={cn(styles.toggleBtn, billing === "monthly" && styles.toggleBtnActive)}
        onClick={() => setBilling("monthly")}
      >
        {billing === "monthly" && (
          <motion.div
            layoutId="pricing-pill"
            className={styles.togglePill}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
          />
        )}
        <span style={{ position: "relative", zIndex: 1 }}>Monthly</span>
      </button>
      <button
        className={cn(styles.toggleBtn, billing === "annual" && styles.toggleBtnActive)}
        onClick={() => setBilling("annual")}
      >
        {billing === "annual" && (
          <motion.div
            layoutId="pricing-pill"
            className={styles.togglePill}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
          />
        )}
        <span style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", gap: 6 }}>
          Annual
          <span className={styles.toggleSaveTag}>{saveLabel}</span>
        </span>
      </button>
    </div>
  );
}

/* ── Plan prices (hardcoded, only Standard has a price) ─────── */
const PLAN_PRICES = [
  { monthly: 1990, annual: 1592 },
  { monthly: null, annual: null },
  { monthly: null, annual: null },
];

/* ── Check icon (Attio-style small circle) ─────────────────── */
function CheckIcon() {
  return (
    <span className={styles.featureCheck} aria-hidden="true">
      <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
        <path d="M1 3l2 2 4-4" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/* ── Single plan card ─────────────────────────────────────────  */
interface PlanCardProps {
  plan: Dictionary["pricing"]["plans"][number];
  billing: Billing;
  idx: number;
}

function PlanCard({ plan, billing, idx }: PlanCardProps) {
  const prices = PLAN_PRICES[idx];
  const isHighlighted = idx === 1; // Pro is highlighted
  const isEnterprise = idx === 2;
  const price = billing === "annual" ? prices.annual : prices.monthly;
  const showSaveBadge = billing === "annual" && prices.monthly !== null;

  return (
    <article className={cn(styles.card, isHighlighted && styles.cardHighlighted)}>
      {/* Plan name + save badge */}
      <div className={styles.planNameRow}>
        <span className={styles.planName}>{plan.name}</span>
        {showSaveBadge && (
          <span className={styles.planSaveBadge}>Save 20%</span>
        )}
      </div>

      {/* Price */}
      <div className={styles.priceRow}>
        {price !== null ? (
          <>
            <span className={styles.priceCurrency}>₺</span>
            <span className={styles.priceAmount}>
              <AnimatedNumber value={price} mass={0.8} stiffness={80} damping={16} />
            </span>
            <span className={styles.billingPeriod}>/mo</span>
          </>
        ) : isEnterprise ? (
          <span className={styles.priceWord}>Custom</span>
        ) : (
          <span className={styles.priceWord}>{plan.comingSoonLabel ?? "Coming Soon"}</span>
        )}
      </div>

      {/* Billing note */}
      <p className={styles.billingNote}>
        {price !== null
          ? `Per user/month, billed ${billing === "annual" ? "annually" : "monthly"}`
          : isEnterprise
          ? "Billed annually"
          : ""}
      </p>

      {/* Description */}
      <p className={styles.planDesc}>{plan.tagline}</p>

      {/* Features */}
      <ul className={styles.featureList}>
        {plan.highlights.map((f) => (
          <li key={f} className={styles.featureItem}>
            <CheckIcon />
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className={styles.ctaWrap}>
        {plan.ctaHref ? (
          <Link
            href={plan.ctaHref}
            className={cn(styles.ctaBtn, isHighlighted ? styles.ctaBtnPro : styles.ctaBtnRegular)}
          >
            {plan.cta}
          </Link>
        ) : (
          <button
            className={cn(styles.ctaBtn, isHighlighted ? styles.ctaBtnPro : styles.ctaBtnRegular)}
          >
            {plan.cta}
          </button>
        )}
      </div>
    </article>
  );
}

/* ── Logo strip ─────────────────────────────────────────────── */
function LogoItem({ children }: { children: ReactElement }) {
  return <span className={styles.logoItem}>{children}</span>;
}

function LogoStrip() {
  return (
    <div className={styles.logoStrip} aria-hidden="true">
      <div className={styles.logoRow}>
        <LogoItem>
          {/* Google Drive */}
          <svg width="90" height="20" viewBox="0 0 90 20" fill="none">
            <text x="0" y="15" fontFamily="inherit" fontSize="15" fontWeight="600" fill="#9ca3af" letterSpacing="-0.3">Google Drive</text>
          </svg>
        </LogoItem>
        <LogoItem>
          {/* Notion */}
          <svg width="56" height="20" viewBox="0 0 56 20" fill="none">
            <text x="0" y="15" fontFamily="inherit" fontSize="15" fontWeight="600" fill="#9ca3af" letterSpacing="-0.3">notion</text>
          </svg>
        </LogoItem>
        <LogoItem>
          {/* Slack */}
          <svg width="44" height="20" viewBox="0 0 44 20" fill="none">
            <text x="0" y="15" fontFamily="inherit" fontSize="15" fontWeight="600" fill="#9ca3af" letterSpacing="-0.3">Slack</text>
          </svg>
        </LogoItem>
        <LogoItem>
          {/* Dropbox */}
          <svg width="64" height="20" viewBox="0 0 64 20" fill="none">
            <text x="0" y="15" fontFamily="inherit" fontSize="15" fontWeight="600" fill="#9ca3af" letterSpacing="-0.3">Dropbox</text>
          </svg>
        </LogoItem>
        <LogoItem>
          {/* Confluence */}
          <svg width="80" height="20" viewBox="0 0 80 20" fill="none">
            <text x="0" y="15" fontFamily="inherit" fontSize="15" fontWeight="600" fill="#9ca3af" letterSpacing="-0.3">Confluence</text>
          </svg>
        </LogoItem>
        <LogoItem>
          {/* HubSpot */}
          <svg width="62" height="20" viewBox="0 0 62 20" fill="none">
            <text x="0" y="15" fontFamily="inherit" fontSize="15" fontWeight="600" fill="#9ca3af" letterSpacing="-0.3">HubSpot</text>
          </svg>
        </LogoItem>
      </div>
      <div className={styles.logoRow}>
        <LogoItem>
          <svg width="56" height="20" viewBox="0 0 56 20" fill="none">
            <text x="0" y="15" fontFamily="inherit" fontSize="15" fontWeight="600" fill="#9ca3af" letterSpacing="-0.3">GitHub</text>
          </svg>
        </LogoItem>
        <LogoItem>
          <svg width="46" height="20" viewBox="0 0 46 20" fill="none">
            <text x="0" y="15" fontFamily="inherit" fontSize="15" fontWeight="600" fill="#9ca3af" letterSpacing="-0.3">Jira</text>
          </svg>
        </LogoItem>
        <LogoItem>
          <svg width="66" height="20" viewBox="0 0 66 20" fill="none">
            <text x="0" y="15" fontFamily="inherit" fontSize="15" fontWeight="600" fill="#9ca3af" letterSpacing="-0.3">Salesforce</text>
          </svg>
        </LogoItem>
        <LogoItem>
          <svg width="60" height="20" viewBox="0 0 60 20" fill="none">
            <text x="0" y="15" fontFamily="inherit" fontSize="15" fontWeight="600" fill="#9ca3af" letterSpacing="-0.3">Intercom</text>
          </svg>
        </LogoItem>
        <LogoItem>
          <svg width="52" height="20" viewBox="0 0 52 20" fill="none">
            <text x="0" y="15" fontFamily="inherit" fontSize="15" fontWeight="600" fill="#9ca3af" letterSpacing="-0.3">Linear</text>
          </svg>
        </LogoItem>
        <LogoItem>
          <svg width="76" height="20" viewBox="0 0 76 20" fill="none">
            <text x="0" y="15" fontFamily="inherit" fontSize="15" fontWeight="600" fill="#9ca3af" letterSpacing="-0.3">OneDrive</text>
          </svg>
        </LogoItem>
      </div>
    </div>
  );
}

/* ── Main export ─────────────────────────────────────────────── */
export function Pricing({ dict, billing: externalBilling, onBillingChange }: PricingProps) {
  const [internalBilling, setInternalBilling] = useState<Billing>("annual");
  const billing = externalBilling ?? internalBilling;
  const setBilling = onBillingChange ?? setInternalBilling;

  return (
    <div className={styles.root}>
      {/* Hero */}
      <div className={styles.hero}>
        <h1 className={styles.headline}>{dict.title}</h1>
        <p className={styles.subtitle}>{dict.description}</p>
        <BillingToggle billing={billing} setBilling={setBilling} saveLabel={dict.discount} />
      </div>

      {/* Cards */}
      <div className={styles.cardsSection}>
        <div className={styles.cardsGrid}>
          {dict.plans.map((plan, idx) => (
            <PlanCard key={plan.name} plan={plan} billing={billing} idx={idx} />
          ))}
        </div>
      </div>

      {/* Logo strip */}
      <LogoStrip />
    </div>
  );
}
