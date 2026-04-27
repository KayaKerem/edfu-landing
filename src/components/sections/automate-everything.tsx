"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import styles from "./automate-everything.module.css";
import { SectionFrame } from "./section-frame";
import Link from "next/link";

type ListItem = {
  id: string;
  title: string;
  color: string;
};

type AutomateEverythingDict = {
  title: string;
  description: string;
  cta: string;
  ariaLabel: string;
  srText: string;
  trigger: {
    badge: string;
    tabBadge: string;
    title: string;
    description: string;
    status: string;
  };
  condition: {
    badge: string;
    title: string;
    description: string;
    status: string;
    upsell: string;
    nurture: string;
  };
  sequence: {
    upsell: {
      badge: string;
      title: string;
      description: string;
      status: string;
    };
    nurture: {
      badge: string;
      title: string;
      description: string;
      status: string;
    };
  };
  list: {
    title: string;
    items: ListItem[];
  };
};

type Phase =
  | "idle"      // all nodes visible but gray/neutral
  | "trigger"   // trigger activates
  | "condition" // switch activates
  | "branch"    // branch edges turn green + labels
  | "leaves"    // upsell activates
  | "plus"      // + button appears
  | "resetting";

function DealInvoiceIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4 2.5h6l2 2V13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M10 2.5V5h2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M8 5.1v6.8M6.1 6.7c0-.8.9-1.4 1.9-1.4s1.9.6 1.9 1.4-.9 1.4-1.9 1.4-1.9.6-1.9 1.4.9 1.4 1.9 1.4 1.9-.6 1.9-1.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ForkSwitchIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4 4.5h3.4c1.2 0 2.2.4 2.9 1.3l1.7 2.2M4 11.5h3.4c1.2 0 2.2-.4 2.9-1.3l1.7-2.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 4.5h1.8v1.8M10.5 11.5h1.8v-1.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PaperPlaneIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M13.5 2.5 7 8.2 3.4 7.4a.7.7 0 0 0-.7.2l-.2.2c-.2.3-.1.8.2 1l2.9 1.8 1.8 2.9c.2.3.7.4 1 .2l.2-.2a.7.7 0 0 0 .2-.7L8.6 9 14.3 2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ListItemIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="4" cy="8" r="1.6" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="8" r="1.6" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5.7 8h4.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}


function TargetIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="6" cy="6" r="1.1" fill="currentColor" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M2.2 6.3 4.7 8.8 9.8 3.7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 4v8M4 8h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
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

/* ─────────── Node border trace: draws clockwise from top-center ─────────── */
function NodeBorderTrace({ width, height, active }: { width: number; height: number; active: boolean }) {
  const R = 14;
  const perimeter = 2 * (width - 2 * R) + 2 * (height - 2 * R) + 2 * Math.PI * R;
  // Rounded-rect path starting at top-center, going clockwise
  const d = `M${width / 2} 0 H${width - R} Q${width} 0 ${width} ${R} V${height - R} Q${width} ${height} ${width - R} ${height} H${R} Q0 ${height} 0 ${height - R} V${R} Q0 0 ${R} 0 H${width / 2}`;
  return (
    <svg
      aria-hidden="true"
      style={{
        position: "absolute",
        top: -0.75,
        left: -0.75,
        width: width + 1.5,
        height: height + 1.5,
        pointerEvents: "none",
        zIndex: 1,
        overflow: "visible",
      }}
      viewBox={`-0.75 -0.75 ${width + 1.5} ${height + 1.5}`}
    >
      <path
        d={d}
        fill="none"
        stroke="var(--trace-color, #34c77b)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: perimeter,
          strokeDashoffset: active ? 0 : perimeter,
          transition: active ? "stroke-dashoffset 600ms linear" : "none",
        }}
      />
    </svg>
  );
}

/* ─────────── Status badge (slides up when it appears) ─────────── */

function StatusBadge({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={cn(styles.badge, styles.badgeGreen, styles.statusBadge, className)}
      role="status"
      style={style}
    >
      {children}
      </span>
  );
}


function NodeCard({
  title,
  description,
  inlinePill,
  icon,
  iconBg,
  iconFg,
  active,
  muted,
  width,
  ariaLabel,
}: {
  title: string;
  description: string;
  inlinePill: string;
  icon: React.ReactNode;
  iconBg: string;
  iconFg: string;
  active?: boolean;
  muted?: boolean;
  width: number;
  ariaLabel: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardSize, setCardSize] = useState({ width, height: 110 });
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new ResizeObserver(() =>
      setCardSize({ width: el.offsetWidth, height: el.offsetHeight })
    );
    obs.observe(el);
    setCardSize({ width: el.offsetWidth, height: el.offsetHeight });
    return () => obs.disconnect();
  }, [width]);

  return (
    <div
      ref={cardRef}
      role="group"
      aria-label={ariaLabel}
      className={cn(
        styles.nodeCard,
        "relative rounded-[14px] border",
        active && styles.nodeCardActive,
        muted && !active && styles.nodeCardMuted
      )}
      style={{ width }}
    >
      <NodeBorderTrace width={cardSize.width} height={cardSize.height} active={active ?? false} />
      <div className="relative" style={{ zIndex: 2 }}>
        <div className="flex items-center gap-2.5" style={{ height: 28 }}>
          <span
            className={cn(styles.nodeIcon, "flex size-7 shrink-0 items-center justify-center rounded-[8px]")}
            style={{ background: iconBg, color: iconFg }}
          >
            <span className="size-4 inline-flex">{icon}</span>
          </span>
          <span
            className="flex-1 min-w-0 whitespace-nowrap text-[15px] font-semibold leading-[20px] tracking-[-0.1px]"
            style={{ color: "var(--text-strong)" }}
          >
            {title}
          </span>
          <span className={styles.inlinePill}>{inlinePill}</span>
        </div>
        <p
          className="mt-2 line-clamp-2 text-[13px] leading-[18px]"
          style={{ color: "var(--text-muted)" }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

/* ─────────── List card ─────────── */


function ListCard({
  item,
  active,
  muted,
  opacity,
  scale = 1,
  stackOffset = 0,
}: {
  item: ListItem;
  active?: boolean;
  muted?: boolean;
  opacity?: number;
  scale?: number;
  stackOffset?: number;
}) {
  const palette: Record<string, { bg: string; color: string }> = {
    green: { bg: "#E8F7EE", color: "#16A34A" },
    blue: { bg: "#EAF1FF", color: "#2F6BFF" },
    amber: { bg: "#FFF4DB", color: "#B45309" },
    violet: { bg: "#F3E8FF", color: "#6366F1" },
    rose: { bg: "#FDECF4", color: "#E11D48" },
    cyan: { bg: "#E8F9FF", color: "#0EA5E9" },
    lime: { bg: "#F0FDF4", color: "#65A30D" },
  };

  const swatch = palette[item.color] ?? palette.blue;

  return (
    <li
      role="listitem"
      className="list-none h-auto"
      style={{
        opacity,
        marginTop: stackOffset ? `${stackOffset}px` : undefined,
        transition: "opacity 320ms ease, margin-top 320ms ease",
      }}
    >
      <div
        aria-current={active ? "true" : undefined}
        className={cn(
          styles.listCard,
          "flex h-8 w-full items-center gap-1.5 rounded-[11px] border px-2.5 text-left",
          active && styles.listCardActive,
          muted && !active && opacity === undefined && styles.listCardMuted
        )}
        style={
          {
            "--list-card-scale": scale,
            background: "var(--surface-card)",
            borderColor: "var(--list-card-border)",
            boxShadow: "var(--list-card-shadow)",
          } as React.CSSProperties
        }
      >
        <span
          className="flex size-[15px] shrink-0 items-center justify-center rounded-[5px]"
          style={{ background: swatch.bg, color: swatch.color }}
        >
          <span className="inline-flex size-[9px]"><ListItemIcon /></span>
        </span>
        <span
          className={cn(styles.listCardTitle, "min-w-0 flex-1 truncate text-[12px] leading-[15px]")}
          style={{ color: "var(--text-strong)" }}
        >
          {item.title}
        </span>
      </div>
    </li>
  );
}
/* ─────────── Main component ─────────── */

export function AutomateEverything({ dict }: { dict: AutomateEverythingDict }) {
  const sectionRef = useRef<HTMLElement>(null);
  const loopTimers = useRef<number[]>([]);
  const hasPlayedRef = useRef(false);
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);

  // E5 (upsell→+) draw-in animation: measure path length on mount so the
  // stroke-dashoffset animation knows how far to travel.
  // Initialize large enough that dasharray doesn't repeat and leak a visible
  // segment before useEffect runs the real measurement.
  const path5Ref = useRef<SVGPathElement>(null);
  const [path5Len, setPath5Len] = useState(2000);
  useEffect(() => {
    if (path5Ref.current) {
      setPath5Len(Math.ceil(path5Ref.current.getTotalLength()));
    }
  }, []);

  const listItems = dict.list.items;
  const activeListIndex = 3;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.35, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onVisibility = () => setPageHidden(document.visibilityState !== "visible");
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", onVisibility);
    window.addEventListener("focus", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onVisibility);
      window.removeEventListener("focus", onVisibility);
    };
  }, []);

  // Attio-style execution pulse timeline:
  // All nodes visible from the start (idle = gray border).
  // Phases drive "activation" (green border + badge slide-up), not node visibility.
  useEffect(() => {
    if (!visible || reducedMotion || hasPlayedRef.current) return;
    hasPlayedRef.current = true;

    const clearTimers = () => {
      loopTimers.current.forEach((id) => window.clearTimeout(id));
      loopTimers.current = [];
    };
    clearTimers();

    const schedule = (delay: number, next: Phase) => {
      loopTimers.current.push(
        window.setTimeout(() => {
          setPhase(next);
        }, delay)
      );
    };

    // t=0     Trigger node activates (green border + "Triggered" badge slides up)
    // t=1400  Switch activates (E1 already green, "Completed" badge slides up)
    // t=2400  Branch edges turn green; "Upsell"/"Nurture" labels appear
    // t=3120  Upsell activates; Nurture fades in (muted)
    // t=4200  + button appears with halo pulse
    // Animation plays once and stays at "plus" final state (no reset to idle).
    schedule(0,    "trigger");
    schedule(1400, "condition");
    schedule(2400, "branch");
    schedule(3120, "leaves");
    schedule(4200, "plus");

    return () => clearTimers();
  }, [visible, reducedMotion]);

  const isPaused = paused || pageHidden;
  // Not visible / reduced-motion → show final activated state
  const renderPhase = !visible || reducedMotion ? "plus" : phase;

  // ── Node active states (NOT visibility — all nodes always rendered) ──
  const triggerActive  = renderPhase !== "idle";
  const switchActive   = !["idle", "trigger"].includes(renderPhase);
  const upsellActive   = ["branch", "leaves", "plus", "resetting"].includes(renderPhase);
  // nurture: always muted/idle (gray), never activates in this demo
  const showPlus       = ["plus", "resetting"].includes(renderPhase);

  // ── Edge green states (edges always drawn; color transitions gray → green) ──
  const e1Green  = triggerActive;   // Trigger → Switch
  const e2Green  = switchActive;    // Switch trunk
  const e3Green  = upsellActive;    // upsell branch
  // e4 (nurture branch) and e5 (upsell→+) stay gray always
  // Branch labels visible once branches exist
  const branchVisible = ["branch", "leaves", "plus", "resetting"].includes(renderPhase);

  // ── Canvas geometry ──────────────────────────────────────────────
  const W = 560;
  const H = 600;
  const cx = W / 2; // 280

  // Card widths
  const topCardW = 300;    // trigger + switch
  const leafCardW = 300;   // upsell + nurture

  // Arrow-head overshoot: paths end 6px above card top so the ▼ arrow tip
  // lands neatly on the card border instead of underneath it.
  const ARROW_GAP = 6;

  const n1Top = 36,  n1H = 80,  n1Bottom = n1Top + n1H; // 116
  const n2Top = 200, n2H = 80,  n2Bottom = n2Top + n2H; // 280
  const branchY  = 320;
  const n34Top   = 392, n34H = 92;

  const upsellCardCx  = 150; // card: 0–300px (no overlap with nurture)
  // Nurture centered at 470 → card 320–620; canvas clips at 560 so the right
  // ~60px is cut off — leaves the "Sequences" pill roughly half-visible
  // (Attio-style peek effect, prevents overlap with upsell card).
  const nurtureCardCx = 470;
  const R = 14; // orthogonal corner radius

  // Arrow tips land ARROW_GAP above the card top (so marker-end ▼ sits on border)
  const path1 = `M${cx} ${n1Bottom} V${n2Top - ARROW_GAP}`;
  const path2 = `M${cx} ${n2Bottom} V${branchY}`;
  const path3 = `M${cx} ${branchY} Q${cx} ${branchY+R} ${cx-R} ${branchY+R} H${upsellCardCx+R} Q${upsellCardCx} ${branchY+R} ${upsellCardCx} ${branchY+2*R} V${n34Top - ARROW_GAP}`;
  const path4 = `M${cx} ${branchY} Q${cx} ${branchY+R} ${cx+R} ${branchY+R} H${nurtureCardCx-R} Q${nurtureCardCx} ${branchY+R} ${nurtureCardCx} ${branchY+2*R} V${n34Top - ARROW_GAP}`;

  const upsellBottom = n34Top + n34H; // 484
  const plusY = 556;
  const path5 = `M${upsellCardCx} ${upsellBottom} V${plusY-R} Q${upsellCardCx} ${plusY} ${upsellCardCx+R} ${plusY} H${cx}`;

  const upsellLabelX  = Math.round((cx + upsellCardCx)  / 2); // 165
  const nurtureLabelX = Math.round((cx + nurtureCardCx) / 2); // 285
  const branchLabelY  = branchY + R;
  return (
    <SectionFrame
      ref={sectionRef}
      ariaLabel={dict.ariaLabel}
      className={cn(styles.root)}
      gridClassName="grid-cols-1 lg:grid-cols-[minmax(220px,0.9fr)_minmax(500px,1.4fr)_minmax(360px,0.9fr)] divide-y divide-border lg:divide-y-0 lg:divide-x lg:divide-border"
      data-paused={isPaused ? "true" : "false"}
      data-reduced-motion={reducedMotion ? "true" : "false"}
      data-phase={renderPhase}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!sectionRef.current?.contains(e.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      {/* ─── Left: text ─── */}
            <div className="flex flex-col justify-between pl-6 py-6 sm:pl-10 sm:py-7 lg:pl-16 lg:py-8 xl:pl-20 gap-6">
              <div className="max-w-[320px] flex flex-col justify-start">
                <h2
                  className="text-[26px] sm:text-[30px] font-semibold leading-[32px] tracking-[-0.02em] text-[#0F1720] dark:text-[#F1F5F9]"
                  style={{ fontFamily: "var(--font-geist)" }}
                >
                  {dict.title}
                </h2>
                <p className="mt-4 text-[14.5px] leading-[22px] text-[#5B6472] dark:text-[#94A3B8]">
                  {dict.description}
                </p>
                <span className="sr-only">{dict.srText}</span>
              </div>
    
            <Link href="#automate-everything" className={styles.cta}>
          <span>{dict.cta}</span>
          <span className={styles.arrow} aria-hidden="true">
            <ArrowRightIcon />
          </span>
        </Link>
            </div>
            {/* ─── Center: diagram ─── */}
            <div className="flex items-center justify-center min-h-auto lg:pl-6">
              <div className={cn(styles.diagramFrame, "relative w-full max-w-[560px] overflow-visible lg:overflow-hidden")}>
                <div className={cn("relative pt-0 mt-0", styles.diagramScaler)} style={{ width: W, height: H, minWidth: W }}>

                  {/* SVG edges — always drawn, color transitions gray↔green */}
                  <svg
                    className="absolute inset-0 h-full w-full pointer-events-none"
                    viewBox={`0 0 ${W} ${H}`}
                    aria-hidden="true"
                  >
                    <defs>
                      {/* Arrow-head markers — one per color so the tip matches the stroke */}
                      <marker id="ae-arrow-green" viewBox="0 0 10 10" refX="5" refY="5"
                        markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M0 0 L10 5 L0 10 Z" fill="var(--edge-active, #34c77b)" />
                      </marker>
                      <marker id="ae-arrow-gray" viewBox="0 0 10 10" refX="5" refY="5"
                        markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M0 0 L10 5 L0 10 Z" fill="var(--edge-idle, #d0d5dd)" />
                      </marker>
                    </defs>
                    {/* E1: Trigger → Switch */}
                    <path d={path1} className={cn(styles.flowPath, e1Green ? styles.flowPathGreen : styles.flowPathGray)}
                      markerEnd={`url(#${e1Green ? "ae-arrow-green" : "ae-arrow-gray"})`} />
                    {/* E2 trunk: Switch → branch (no arrow — joins branch) */}
                    <path d={path2} className={cn(styles.flowPath, e2Green ? styles.flowPathGreen : styles.flowPathGray)} />
                    {/* E3 upsell branch */}
                    <path d={path3} className={cn(styles.flowPath, e3Green ? styles.flowPathGreen : styles.flowPathGray)}
                      markerEnd={`url(#${e3Green ? "ae-arrow-green" : "ae-arrow-gray"})`} />
                    {/* E4 nurture branch — always gray */}
                    <path d={path4} className={cn(styles.flowPath, styles.flowPathGray)}
                      markerEnd="url(#ae-arrow-gray)" />
                    {/* E5: Upsell → + — draws in from the top (upsell side)
                        when the plus phase begins. Before plus, the path is
                        completely hidden via stroke-dashoffset = length. */}
                    <path
                      ref={path5Ref}
                      d={path5}
                      className={cn(styles.flowPath, styles.flowPathGreen)}
                      style={{
                        strokeDasharray: path5Len,
                        strokeDashoffset: showPlus ? 0 : path5Len,
                        transition: showPlus ? "stroke-dashoffset 700ms ease-out" : "none",
                      }}
                    />

                    {/* Connection port dots */}
                    {([
                      [cx,            n1Bottom,    e1Green],
                      [cx,            n2Top,       e1Green],
                      [cx,            n2Bottom,    e2Green],
                      [cx,            branchY,     e2Green],
                      [upsellCardCx,  n34Top,      e3Green],
                      [nurtureCardCx, n34Top,      false],
                    ] as [number, number, boolean][]).map(([x, y, on], i) => (
                      <circle key={i} cx={x} cy={y} r={3} fill="var(--port-fill)"
                        stroke={on ? "var(--edge-active)" : "var(--edge-idle)"} strokeWidth={1.4}
                        style={{ transition: "stroke 400ms ease" }}
                      />
                    ))}
                  </svg>

                  {/* ── N1: Trigger (ALWAYS RENDERED) ── */}
                  <div className="absolute" style={{ top: n1Top, left: cx, transform: "translateX(-50%)" }}>
                    <div className="relative">
                      {/* Static "Trigger" tab — always visible */}
                      <span className={cn(styles.badge, styles.nodeTriggerTab)}>
                        <TargetIcon />
                        {dict.trigger.tabBadge}
                      </span>
                      {/* "Triggered" status badge — slides in when active */}
                      {triggerActive && (
                        <StatusBadge className={styles.badgeTopRight}>
                          <CheckIcon />
                          {dict.trigger.status}
                        </StatusBadge>
                      )}
                      <NodeCard
                        ariaLabel={`Trigger: ${dict.trigger.title}`}
                        title={dict.trigger.title}
                        description={dict.trigger.description}
                        inlinePill={dict.trigger.badge}
                        icon={<DealInvoiceIcon />}
                        iconBg={triggerActive ? "#EEF0FE" : "#F2F4F7"}
                        iconFg={triggerActive ? "#6E78F7" : "#98A2B3"}
                        active={triggerActive}
                        width={topCardW}
                      />
                    </div>
                  </div>

                  {/* ── N2: Switch (ALWAYS RENDERED) ── */}
                  <div className="absolute" style={{ top: n2Top, left: cx, transform: "translateX(-50%)" }}>
                    <div className="relative">
                      {switchActive && (
                        <StatusBadge className={styles.badgeTopRight}>
                          <CheckIcon />
                          {dict.condition.status}
                        </StatusBadge>
                      )}
                      <NodeCard
                        ariaLabel={dict.condition.title}
                        title={dict.condition.title}
                        description={dict.condition.description}
                        inlinePill={dict.condition.badge}
                        icon={<ForkSwitchIcon />}
                        iconBg={switchActive ? "#EEF0FE" : "#F2F4F7"}
                        iconFg={switchActive ? "#6E78F7" : "#98A2B3"}
                        active={switchActive}
                        width={topCardW}
                      />
                    </div>
                  </div>

                  {/* Branch labels — always rendered, styling changes with state */}
                  <span
                    className={cn(
                      styles.badge,
                      styles.badgeFloating,
                      branchVisible ? styles.badgeUpsell : styles.badgeLabelIdle,
                      "absolute"
                    )}
                    style={{ top: branchLabelY - 11, left: upsellLabelX, transform: "translateX(-50%)" }}
                  >
                    {dict.condition.upsell}
                  </span>
                  <span
                    className={cn(styles.badge, styles.badgeNurture, styles.badgeFloating, "absolute")}
                    style={{ top: branchLabelY - 11, left: nurtureLabelX, transform: "translateX(-50%)" }}
                  >
                    {dict.condition.nurture}
                  </span>

                  {/* ── N3: Upsell (ALWAYS RENDERED) ── */}
                  <div className="absolute" style={{ top: n34Top, left: upsellCardCx, transform: "translateX(-50%)" }}>
                    <div className="relative">
                      {upsellActive && (
                        <StatusBadge className={styles.badgeTopLeft}>
                          <CheckIcon />
                          {dict.sequence.upsell.status}
                        </StatusBadge>
                      )}
                      <NodeCard
                        ariaLabel={dict.sequence.upsell.title}
                        title={dict.sequence.upsell.title}
                        description={dict.sequence.upsell.description}
                        inlinePill={dict.sequence.upsell.badge}
                        icon={<PaperPlaneIcon />}
                        iconBg={upsellActive ? "#EEF0FE" : "#F2F4F7"}
                        iconFg={upsellActive ? "#6E78F7" : "#98A2B3"}
                        active={upsellActive}
                        width={leafCardW}
                      />
                    </div>
                  </div>

                  {/* ── N4: Nurture (ALWAYS RENDERED, always muted) ── */}
                  <div className="absolute" style={{ top: n34Top, left: nurtureCardCx, transform: "translateX(-50%)" }}>
                    <NodeCard
                      ariaLabel={dict.sequence.nurture.title}
                      title={dict.sequence.nurture.title}
                      description={dict.sequence.nurture.description}
                      inlinePill={dict.sequence.nurture.badge}
                      icon={<PaperPlaneIcon />}
                      iconBg="#F2F4F7"
                      iconFg="#98A2B3"
                      muted
                      width={leafCardW}
                    />
                  </div>

                  {/* ── + button (appears at plus phase) ── */}
                  {showPlus && (
                    <div
                      className="absolute border-none"
                      style={{ top: plusY, left: cx, transform: "translate(-50%, -50%)" }}
                    >
                      <button
                        type="button"
                        aria-label="Add next step"
                        className={cn(styles.focusRing, styles.plusButton, styles.plusPopIn,
                          "relative flex size-9 items-center justify-center rounded-full text-white border-none"
                        )}
                      >
                        <span className={styles.pulseRing} aria-hidden="true" />
                        <span className="relative z-10 inline-flex size-4 border-none">
                          <PlusIcon />
                        </span>
                      </button>
                    </div>
                  )}

                  {/* Flow dots — travel on green (active) edges only */}
                  {!reducedMotion && visible && renderPhase !== "idle" && (
                    <>
                      {/* E1: delayed 600ms so it starts after trigger border finishes drawing */}
                      <span className={styles.pathDot}
                        style={{ offsetPath: `path("${path1}")`, "--dot-delay": "600ms" } as React.CSSProperties}
                      />
                      {/* E2 trunk: delayed 600ms after condition border finishes */}
                      {switchActive && (
                        <span className={styles.pathDot}
                          style={{ offsetPath: `path("${path2}")`, "--dot-delay": "600ms" } as React.CSSProperties}
                        />
                      )}
                      {/* E3 upsell branch: no delay, travels to upsell card as its border draws */}
                      {e3Green && (
                        <span className={styles.pathDot}
                          style={{ offsetPath: `path("${path3}")`, "--dot-delay": "0ms" } as React.CSSProperties}
                        />
                      )}
                      {/* E5 upsell→plus: dot starts once the draw-in finishes */}
                      {showPlus && (
                        <span className={styles.pathDot}
                          style={{ offsetPath: `path("${path5}")`, "--dot-delay": "700ms" } as React.CSSProperties}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* ─── Right: list + cubes (desktop only) ─── */}
            <div className="hidden lg:flex flex-col relative lg:min-h-[560px]">
              {/* List section */}
              <div className="pl-[0.5rem] pt-[1rem]">
                <div className="relative mx-auto flex min-h-[240px] overflow-visible lg:min-w-[360px]">
                  <ul
                    role="list"
                    aria-label={dict.list.title}
                    className={cn(
                      styles.listMask,
                      "ml-[0.25rem] grid w-[72%] max-w-[320px] grid-cols-1 gap-0 sm:max-w-[332px] lg:max-w-[344px]"
                    )}
                    style={{
                      transform: "translateY(6px) scale(0.93)",
                      transformOrigin: "top center",
                    }}
                  >
                    {listItems.map((item, index) => {
                      const distance = Math.abs(index - activeListIndex);
                      const scaleByDistance = [1.02, 0.95, 0.88, 0.8];
                      const opacityByDistance = [1, 0.84, 0.62, 0.4];
                      const stackOffsetByDistance = [0, -6, -12, -18];

                      return (
                      <ListCard
                          key={item.id}
                          item={item}
                          active={index === activeListIndex}
                          muted={index !== activeListIndex}
                          scale={scaleByDistance[distance] ?? 0.81}
                          opacity={opacityByDistance[distance] ?? 0.7}
                          stackOffset={stackOffsetByDistance[distance] ?? -24}
                        />
                      );
                    })}
                  </ul>
                </div>
              </div>

              {/* Dashed grid + cubes (desktop only) */}
              <div className="hidden lg:block relative flex-1 min-h-[180px] border-t border-border">
                {/* 3-column x 2-row dashed grid */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 pointer-events-none" aria-hidden="true">
                  <div className={cn(styles.dashedCell, "border-b border-r border-dashed")} />
                  <div className={cn(styles.dashedCell, "border-b border-r border-dashed")} />
                  <div className={cn(styles.dashedCell, "border-b border-dashed")} />
                  <div className={cn(styles.dashedCell, "border-r border-dashed")} />
                  <div className={cn(styles.dashedCell, "border-r border-dashed")} />
                  <div />
                </div>
                {/* Cubes centered in grid */}
                <div className={cn(styles.cubes, "absolute inset-0 flex items-center justify-center")} aria-hidden="true">
                  <svg width="140" height="120" viewBox="0 0 120 120" fill="none" className="overflow-visible">
                    <path d="M53.2944 38.3421L83.0481 23.4418C84.224 22.8527 85.6105 22.8527 86.7864 23.4418L116.54 38.3421C117.947 39.0465 118.835 40.4814 118.835 42.0509V72.0653C118.835 73.6344 117.947 75.0698 116.54 75.7741L86.7864 90.6745C85.6105 91.2635 84.224 91.2635 83.0481 90.6745L53.2944 75.7741C51.888 75.0698 51 73.6348 51 72.0653V42.0509C51 40.4818 51.888 39.0465 53.2944 38.3421Z" fill="var(--cube-surface-secondary)" stroke="var(--cube-stroke)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3.29443 67.1331L33.0481 52.2328C34.224 51.6438 35.6105 51.6438 36.7864 52.2328L66.5401 67.1331C67.9466 67.8375 68.8345 69.2725 68.8345 70.8419V99.8563C68.8345 101.425 67.9466 102.861 66.5401 103.565L36.7864 118.465C35.6105 119.055 34.224 119.055 33.0481 118.465L3.29443 103.565C1.88795 102.861 1 101.426 1 99.8563V70.8419C1 69.2728 1.88795 67.8375 3.29443 67.1331Z" fill="var(--cube-surface-tertiary)" stroke="var(--cube-stroke)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path opacity="0.6" d="M1.65625 67.627L34.9181 84.4541L67.5 68M34.9167 118.914V84.4473" stroke="var(--cube-stroke)" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3.29443 16.3421L33.0481 1.44179C34.224 0.852738 35.6105 0.852738 36.7864 1.44179L66.5401 16.3421C67.9466 17.0465 68.8345 18.4814 68.8345 20.0509V49.0653C68.8345 50.6344 67.9466 52.0698 66.5401 52.7741L36.7864 67.6745C35.6105 68.2635 34.224 68.2635 33.0481 67.6745L3.29443 52.7741C1.88795 52.0698 1 50.6348 1 49.0653V20.0509C1 18.4818 1.88795 17.0465 3.29443 16.3421Z" fill="var(--cube-surface-primary)" stroke="var(--cube-stroke)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path opacity="0.6" d="M1.65625 17.8359L34.9181 34.663L68.1803 17.8359M34.9167 68.1227V34.6563" stroke="var(--cube-stroke)" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M53.2944 38.8421L83.0481 23.9418C84.224 23.3527 85.6105 23.3527 86.7864 23.9418L116.54 38.8421C117.947 39.5465 118.835 40.9814 118.835 42.5509V58.5653L85.0481 75.1745L51 58.5653V42.5509C51 40.9818 51.888 39.5465 53.2944 38.8421Z" fill="var(--cube-surface-secondary)"/>
                    <path d="M116.54 75.7741C117.947 75.0698 118.835 73.6344 118.835 72.0653V42.0509C118.835 40.4814 117.947 39.0465 116.54 38.3421L86.7864 23.4418C85.6105 22.8527 84.224 22.8527 83.0481 23.4418L53.2944 38.3421C51.888 39.0465 51 40.4818 51 42.0509V59.35L66 66.85" stroke="var(--cube-stroke)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path opacity="0.6" d="M51.6562 39.8359L84.9181 56.663L118.18 39.8359M84.9167 91.1227V56.6563" stroke="var(--cube-stroke)" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
    </SectionFrame>
  );
}
