"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BRAND_LOGOS as LOCAL_BRAND_LOGOS } from "./brand-logos";
import { TalkToSalesSheet } from "./talk-to-sales-sheet";
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
      {/* Sliding thumb — translates right when Annual is active */}
      <div
        className={styles.toggleThumb}
        style={{
          transform:
            billing === "annual"
              ? "translateX(calc(100% + 2px))"
              : "translateX(0)",
        }}
      />
      <button
        type="button"
        className={cn(styles.toggleBtn, billing === "monthly" && styles.toggleBtnActive)}
        onClick={() => setBilling("monthly")}
      >
        Monthly
      </button>
      <button
        type="button"
        className={cn(styles.toggleBtn, billing === "annual" && styles.toggleBtnActive)}
        onClick={() => setBilling("annual")}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          Annual
          <span className={styles.toggleSaveTag}>{saveLabel}</span>
        </span>
      </button>
    </div>
  );
}

/* ── Slot-machine price display ─────────────────────────────── */
function PriceSlot({
  monthly,
  annual,
  billing,
}: {
  monthly: number;
  annual: number;
  billing: Billing;
}) {
  const fmtMonthly = monthly.toLocaleString("tr-TR");
  const fmtAnnual = annual.toLocaleString("tr-TR");

  return (
    <>
      <span className={styles.priceCurrency}>₺</span>
      {/*
        Two digits stacked in the same grid cell; overflow-y-hidden clips them.
        Monthly rests BELOW (translateY 100%) when inactive →
          Annual→Monthly: comes up from below ✓
        Annual rests ABOVE (translateY -100%) when inactive →
          Monthly→Annual: comes down from above ✓
      */}
      <span className={styles.priceSlotGrid}>
        <span
          className={cn(
            styles.priceSlotDigit,
            billing === "monthly" ? styles.priceSlotActive : styles.priceSlotBelowHidden,
          )}
        >
          {fmtMonthly}
        </span>
        <span
          className={cn(
            styles.priceSlotDigit,
            billing === "annual" ? styles.priceSlotActive : styles.priceSlotAboveHidden,
          )}
        >
          {fmtAnnual}
        </span>
      </span>
    </>
  );
}

/* ── Plan prices ─────────────────────────────────────────────── */
const PLAN_PRICES = [
  { monthly: 1990, annual: 1592 },
  { monthly: null, annual: null },
  { monthly: null, annual: null },
];

/* ── Check icon (Attio-style small circle) ─────────────────── */
const CheckIcon = () => {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.2649 3.07601C11.4991 3.22236 11.5703 3.53084 11.4239 3.76501L8.27903 8.79686L8.26603 8.81766C7.96584 9.29798 7.72247 9.68737 7.50209 9.9779C7.27756 10.2739 7.03718 10.5228 6.72175 10.6676C6.24572 10.8861 5.70298 10.9091 5.21014 10.7318C4.88356 10.6142 4.62295 10.3867 4.37412 10.1108C4.1299 9.83997 3.85439 9.47262 3.51455 9.01949L3.49983 8.99986L2.59994 7.80001C2.43425 7.57909 2.47902 7.26569 2.69994 7.10001C2.92085 6.93432 3.23425 6.97909 3.39994 7.20001L4.29983 8.39986C4.65789 8.87728 4.90647 9.2079 5.11672 9.44102C5.32588 9.67294 5.45274 9.75629 5.54875 9.79084C5.79517 9.87952 6.06655 9.868 6.30456 9.75874C6.3973 9.71616 6.51663 9.62236 6.70538 9.37354C6.8951 9.12343 7.11474 8.77292 7.43103 8.26686L10.5759 3.23501C10.7223 3.00084 11.0308 2.92965 11.2649 3.07601Z"
        fill="currentColor"
      />
    </svg>
  );
};

/* ── Single plan card ─────────────────────────────────────────  */
interface PlanCardProps {
  plan: Dictionary["pricing"]["plans"][number];
  billing: Billing;
  idx: number;
}

function PlanCard({ plan, billing, idx }: PlanCardProps) {
  const prices = PLAN_PRICES[idx];
  const isHighlighted = idx === 1;
  const isEnterprise = idx === 2;
  const showPrice = prices.monthly !== null;

  return (
    <article className={cn(styles.card, isHighlighted && styles.cardHighlighted)}>
      {/* Plan name + save badge */}
      <div className={styles.planNameRow}>
        <span className={styles.planName}>{plan.name}</span>
        {showPrice && (
          <span
            className={cn(
              styles.planSaveBadge,
              billing === "annual" ? styles.planSaveBadgeVisible : styles.planSaveBadgeHidden,
            )}
            style={
              billing === "annual"
                ? {
                    transition:
                      "opacity 300ms cubic-bezier(0,0,0,1), translate 600ms cubic-bezier(0,0,0,1)",
                  }
                : {
                    transition:
                      "opacity 300ms 150ms cubic-bezier(0,0,0,1), translate 500ms 100ms cubic-bezier(0,0,0,1)",
                  }
            }
          >
            Save 20%
          </span>
        )}
      </div>

      {/* Price */}
      <div className={styles.priceRow}>
        {showPrice ? (
          <>
            <PriceSlot monthly={prices.monthly!} annual={prices.annual!} billing={billing} />
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
        {showPrice
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
            <span className={styles.featureCheck}>
              <CheckIcon />
            </span>
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
        ) : isEnterprise ? (
          <TalkToSalesSheet
            layoutId={`talk-to-sales-card-${plan.name.toLowerCase()}`}
            dict={plan.salesForm!}
            trigger={
              <button
                type="button"
                className={cn(styles.ctaBtn, isHighlighted ? styles.ctaBtnPro : styles.ctaBtnRegular)}
              >
                {plan.cta}
              </button>
            }
          />
        ) : (
          <button
            type="button"
            className={cn(styles.ctaBtn, isHighlighted ? styles.ctaBtnPro : styles.ctaBtnRegular)}
          >
            {plan.cta}
          </button>
        )}
      </div>
    </article>
  );
}

function LogoStrip() {
  return (
    <div className={styles.logoStrip}>
      <div className={styles.logoGrid} aria-label="Integrations">
        {LOCAL_BRAND_LOGOS.map(({ name, path }) => (
          <span key={name} className={styles.logoItem} aria-label={name}>
            <svg
              className={styles.logoMark}
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              {path}
            </svg>
            <span className={styles.logoLabel}>{name}</span>
          </span>
        ))}
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
