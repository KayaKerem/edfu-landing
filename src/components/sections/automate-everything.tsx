"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import styles from "./automate-everything.module.css";

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

type Phase = "idle" | "trigger" | "condition" | "branch" | "completed" | "resetting";

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

function NodesIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="4" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5.9 8h4.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
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

function IsoCubes() {
  return (
    <svg viewBox="0 0 160 130" fill="none" aria-hidden="true" className="h-full w-full">
      <path
        d="M28 86 56 70 84 86 56 102 28 86Z"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M56 70v32M84 86v32M28 86v32M28 118l28-16 28 16"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M78 48 102 34 126 48 102 62 78 48Z"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M102 34v28M126 48v28M78 48v28M78 76l24-14 24 14"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M96 92 120 78 144 92 120 106 96 92Z"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M120 78v28M144 92v28M96 92v28M96 120l24-14 24 14"
        stroke="currentColor"
        strokeWidth="1.25"
      />
    </svg>
  );
}

function NodeCard({
  title,
  description,
  badge,
  status,
  icon,
  iconBg,
  iconFg,
  active,
  muted,
  widthClass,
  className,
  style,
  ariaLabel,
}: {
  title: string;
  description: string;
  badge: string;
  status: string;
  icon: React.ReactNode;
  iconBg: string;
  iconFg: string;
  active?: boolean;
  muted?: boolean;
  widthClass: string;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel: string;
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        styles.nodeCard,
        "relative rounded-[12px] border bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]",
        widthClass,
        active && styles.nodeCardActive,
        muted && styles.nodeCardMuted,
        className
      )}
      style={style}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className="flex size-7 shrink-0 items-center justify-center rounded-[6px]"
            style={{ background: iconBg, color: iconFg }}
          >
            {icon}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate text-[15px] font-semibold leading-[20px] tracking-[-0.01em] text-[#0F1720]">
                {title}
              </span>
            </div>
            <p className="mt-2 max-w-[320px] text-[13px] leading-[18px] text-[#5B6472] line-clamp-2">
              {description}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <span
            className={cn(
              styles.badge,
              badge === "Upsell" && styles.badgeUpsell,
              badge === "Nurture" && styles.badgeNurture,
              badge === "Condition" && styles.badgeCondition,
              badge === "Trigger" && styles.badgeTrigger,
              "absolute -top-3 right-4"
            )}
          >
            {badge === "Trigger" ? (
              <span className="inline-flex items-center gap-1">
                <TargetIcon />
                {badge}
              </span>
            ) : (
              badge
            )}
          </span>
          <span className="inline-flex items-center gap-1 text-[12px] leading-[16px] font-medium text-[#16A34A]">
            <span className="inline-flex size-3 items-center justify-center rounded-full bg-[#E8F7EE] text-[#16A34A]">
              <CheckIcon />
            </span>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
}

function ListCard({
  item,
  active,
  muted,
  onClick,
}: {
  item: ListItem;
  active?: boolean;
  muted?: boolean;
  onClick: () => void;
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
    <li role="listitem" className="list-none">
      <button
        type="button"
        onClick={onClick}
        aria-current={active ? "true" : undefined}
        className={cn(
          styles.listCard,
          "flex h-12 w-[280px] items-center gap-3 rounded-[10px] border border-[#E6E8EC] bg-white px-3 text-left shadow-[0_1px_2px_rgba(0,0,0,0.04)] focus-visible:outline-none",
          active && styles.listCardActive,
          muted && styles.listCardMuted,
          styles.focusRing
        )}
      >
        <span
          className="flex size-4 shrink-0 items-center justify-center"
          style={{ background: swatch.bg, color: swatch.color }}
        >
          <NodesIcon />
        </span>
        <span className="min-w-0 truncate text-[13px] leading-[18px] text-[#0F1720]">
          {item.title}
        </span>
      </button>
    </li>
  );
}

export function AutomateEverything({ dict }: { dict: AutomateEverythingDict }) {
  const sectionRef = useRef<HTMLElement>(null);
  const loopTimers = useRef<number[]>([]);
  const params = useParams<{ lang?: string }>();
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [loopIteration, setLoopIteration] = useState(0);
  const [activeListIndex, setActiveListIndex] = useState(0);
  const [pageHidden, setPageHidden] = useState(false);

  const listItems = dict.list.items;
  const displayItems = useMemo(() => [...listItems, ...listItems], [listItems]);
  const locale = typeof params?.lang === "string" ? params.lang : "en";

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
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.45, rootMargin: "0px 0px -10% 0px" }
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

  useEffect(() => {
    if (!visible || reducedMotion) return;

    const clearTimers = () => {
      loopTimers.current.forEach((id) => window.clearTimeout(id));
      loopTimers.current = [];
    };

    clearTimers();

    const schedule = (delay: number, nextPhase: Phase | "restart") => {
      loopTimers.current.push(
        window.setTimeout(() => {
          if (nextPhase === "restart") {
            setLoopIteration((current) => current + 1);
            setPhase("idle");
            return;
          }
          setPhase(nextPhase);
        }, delay)
      );
    };

    schedule(0, "trigger");
    schedule(400, "condition");
    schedule(900, "condition");
    schedule(1100, "branch");
    schedule(1400, "branch");
    schedule(1600, "completed");
    schedule(7600, "resetting");
    schedule(8200, "idle");
    schedule(8600, "restart");

    return () => clearTimers();
  }, [visible, reducedMotion, loopIteration]);

  useEffect(() => {
    if (!visible || reducedMotion || paused || pageHidden) return;

    const start = window.performance.now();
    const interval = window.setInterval(() => {
      const elapsed = window.performance.now() - start;
      const cycle = 12000;
      const step = cycle / listItems.length;
      const index = Math.floor((elapsed % cycle) / step) % listItems.length;
      setActiveListIndex(index);
    }, 100);

    return () => window.clearInterval(interval);
  }, [visible, reducedMotion, paused, pageHidden, listItems.length]);

  const isPaused = paused || pageHidden;

  const renderPhase = !visible || reducedMotion ? "completed" : phase;

  const pathState = {
    first: renderPhase !== "idle" ? "active" : "idle",
    second:
      renderPhase === "condition" ||
      renderPhase === "branch" ||
      renderPhase === "completed" ||
      renderPhase === "resetting"
        ? "active"
        : "idle",
    branch:
      renderPhase === "branch" || renderPhase === "completed" || renderPhase === "resetting"
        ? "active"
        : "idle",
  } as const;

  const nodeActive = {
    trigger: renderPhase !== "idle",
    condition:
      renderPhase === "condition" ||
      renderPhase === "branch" ||
      renderPhase === "completed" ||
      renderPhase === "resetting",
    upsell: renderPhase === "branch" || renderPhase === "completed" || renderPhase === "resetting",
    nurture: renderPhase === "branch" || renderPhase === "completed" || renderPhase === "resetting",
  };

  const nodeMuted = {
    trigger: false,
    condition: false,
    upsell: false,
    nurture: renderPhase === "idle" || renderPhase === "resetting",
  };

  const diagramWidth = 720;
  const diagramHeight = 640;

  const path1 = "M360 152C360 173 360 179 360 206";
  const path2 = "M360 300C360 325 360 334 360 360";
  const path3 = "M360 398C360 430 320 446 190 470";
  const path4 = "M360 398C360 430 400 446 530 470";

  return (
    <section
      ref={sectionRef}
      aria-label={dict.ariaLabel}
      className={cn(styles.root, "py-0")}
      data-paused={isPaused ? "true" : "false"}
      data-reduced-motion={reducedMotion ? "true" : "false"}
      data-phase={renderPhase}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!sectionRef.current?.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div className={styles.edgeStripe + " " + styles.edgeLeft} aria-hidden="true" />
      <div className={styles.edgeStripe + " " + styles.edgeRight} aria-hidden="true" />
      <div className={styles.dotGrid} aria-hidden="true" />

      <div className={cn(styles.layout, "px-4 py-16 sm:px-6 sm:py-20")}>
        <div className="grid min-h-[760px] grid-cols-1 gap-10 lg:grid-cols-[minmax(240px,3fr)_minmax(0,5fr)_minmax(220px,2fr)] xl:grid-cols-[minmax(280px,3fr)_minmax(0,6fr)_minmax(280px,3fr)]">
          <div className="flex h-full flex-col justify-center pt-8 lg:pt-0 xl:pr-4">
            <div className="max-w-[360px]">
              <h2
                className="text-[32px] font-semibold leading-[36px] tracking-[-0.01em] text-[#0F1720]"
                style={{ fontFamily: "var(--font-geist)" }}
              >
                {dict.title}
              </h2>
              <p className="mt-4 max-w-[320px] text-[16px] leading-[24px] text-[#5B6472]">
                {dict.description}
              </p>

              <div className="mt-8 flex items-center gap-4">
                <Link
                  href={`/${locale}/automations`}
                  className="inline-flex items-center gap-2 text-[16px] font-semibold leading-[24px] text-[#0F1720] transition-opacity hover:opacity-70 focus-visible:outline-none"
                >
                  {dict.cta}
                  <span className="inline-block h-px w-8 bg-current transition-all duration-300 hover:w-10" />
                </Link>
              </div>
            </div>

            <p className="sr-only">{dict.srText}</p>
          </div>

          <div className="flex items-center justify-center">
            <div className={cn(styles.diagramFrame, "w-full max-w-[720px] overflow-x-auto xl:overflow-visible")}>
              <div className="relative mx-auto min-w-[720px] aspect-[720/640]">
                <svg
                  className="absolute inset-0 h-full w-full"
                  viewBox={`0 0 ${diagramWidth} ${diagramHeight}`}
                  aria-hidden="true"
                >
                  <path
                    d={path1}
                    className={cn(styles.flowPath, pathState.first === "active" ? styles.flowPathActive : styles.flowPathIdle)}
                    data-active={pathState.first === "active"}
                  />
                  <path
                    d={path2}
                    className={cn(styles.flowPath, pathState.second === "active" ? styles.flowPathActive : styles.flowPathIdle)}
                    data-active={pathState.second === "active"}
                  />
                  <path
                    d={path3}
                    className={cn(styles.flowPath, pathState.branch === "active" ? styles.flowPathActive : styles.flowPathIdle)}
                    data-active={pathState.branch === "active"}
                  />
                  <path
                    d={path4}
                    className={cn(styles.flowPath, pathState.branch === "active" ? styles.flowPathActive : styles.flowPathIdle)}
                    data-active={pathState.branch === "active"}
                  />

                  <circle cx="360" cy="152" r="3" fill="#ffffff" stroke={pathState.first === "active" ? "#22C55E" : "#D1D5DB"} strokeWidth="1.5" />
                  <circle cx="360" cy="206" r="3" fill="#ffffff" stroke={pathState.first === "active" ? "#22C55E" : "#D1D5DB"} strokeWidth="1.5" />
                  <circle cx="360" cy="300" r="3" fill="#ffffff" stroke={pathState.second === "active" ? "#22C55E" : "#D1D5DB"} strokeWidth="1.5" />
                  <circle cx="360" cy="360" r="3" fill="#ffffff" stroke={pathState.second === "active" ? "#22C55E" : "#D1D5DB"} strokeWidth="1.5" />
                  <circle cx="360" cy="398" r="3" fill="#ffffff" stroke={pathState.branch === "active" ? "#22C55E" : "#D1D5DB"} strokeWidth="1.5" />
                  <circle cx="190" cy="470" r="3" fill="#ffffff" stroke={pathState.branch === "active" ? "#22C55E" : "#D1D5DB"} strokeWidth="1.5" />
                  <circle cx="530" cy="470" r="3" fill="#ffffff" stroke={pathState.branch === "active" ? "#22C55E" : "#D1D5DB"} strokeWidth="1.5" />
                </svg>

                <div className="absolute left-1/2 top-[48px] -translate-x-1/2">
                  <NodeCard
                    ariaLabel={dict.trigger.title}
                    title={dict.trigger.title}
                    description={dict.trigger.description}
                    badge={dict.trigger.badge}
                    status={dict.trigger.status}
                    icon={<DealInvoiceIcon />}
                    iconBg="#EAF1FF"
                    iconFg="#2F6BFF"
                    active={nodeActive.trigger}
                    muted={false}
                    widthClass="w-[360px]"
                  />
                </div>

                <div className="absolute left-1/2 top-[200px] -translate-x-1/2">
                  <NodeCard
                    ariaLabel={dict.condition.title}
                    title={dict.condition.title}
                    description={dict.condition.description}
                    badge={dict.condition.badge}
                    status={dict.condition.status}
                    icon={<ForkSwitchIcon />}
                    iconBg="#FDECF4"
                    iconFg="#F472B6"
                    active={nodeActive.condition}
                    muted={false}
                    widthClass="w-[360px]"
                  />
                </div>

                <button
                  type="button"
                  aria-label="Add next step"
                  className={cn(
                    styles.focusRing,
                    "absolute left-1/2 top-[344px] flex size-10 -translate-x-1/2 items-center justify-center rounded-full bg-[#3B82F6] text-white shadow-[0_4px_14px_rgba(59,130,246,0.35)] transition-transform duration-300 hover:scale-105"
                  )}
                >
                  <span className={styles.pulseRing} aria-hidden="true" />
                  <span className="relative z-10 size-4">
                    <PlusIcon />
                  </span>
                </button>

                <div
                  className={cn(
                    "absolute top-[450px]",
                    "left-[calc(50%-182px)]"
                  )}
                >
                  <NodeCard
                    ariaLabel={dict.sequence.upsell.title}
                    title={dict.sequence.upsell.title}
                    description={dict.sequence.upsell.description}
                    badge={dict.condition.upsell}
                    status={dict.sequence.upsell.status}
                    icon={<PaperPlaneIcon />}
                    iconBg="#E8F1FE"
                    iconFg="#60A5FA"
                    active={nodeActive.upsell}
                    muted={false}
                    widthClass="w-[340px]"
                  />
                </div>

                <div
                  className={cn(
                    "absolute top-[450px]",
                    "left-[calc(50%+18px)]"
                  )}
                >
                  <NodeCard
                    ariaLabel={dict.sequence.nurture.title}
                    title={dict.sequence.nurture.title}
                    description={dict.sequence.nurture.description}
                    badge={dict.condition.nurture}
                    status={dict.sequence.nurture.status}
                    icon={<PaperPlaneIcon />}
                    iconBg="#E8F1FE"
                    iconFg="#60A5FA"
                    active={nodeActive.nurture}
                    muted={nodeMuted.nurture}
                    widthClass="w-[340px]"
                  />
                </div>

                {!reducedMotion && visible && renderPhase !== "idle" && (
                  <>
                    <span
                      className={styles.pathDot}
                      style={
                        {
                          left: "360px",
                          top: "160px",
                          offsetPath: `path("${path1}")`,
                          "--dot-delay": "120ms",
                        } as React.CSSProperties
                      }
                    />
                    <span
                      className={styles.pathDot}
                      style={
                        {
                          left: "360px",
                          top: "312px",
                          offsetPath: `path("${path2}")`,
                          "--dot-delay": "360ms",
                        } as React.CSSProperties
                      }
                    />
                    <span
                      className={styles.pathDot}
                      style={
                        {
                          left: "360px",
                          top: "408px",
                          offsetPath: `path("${path3}")`,
                          "--dot-delay": "760ms",
                        } as React.CSSProperties
                      }
                    />
                    <span
                      className={styles.pathDot}
                      style={
                        {
                          left: "360px",
                          top: "408px",
                          offsetPath: `path("${path4}")`,
                          "--dot-delay": "900ms",
                        } as React.CSSProperties
                      }
                    />
                  </>
                )}

                <div
                  className={cn(
                    "absolute",
                    styles.badge,
                    styles.badgeUpsell,
                    "left-[calc(50%-132px)] top-[404px]"
                  )}
                >
                  {dict.condition.upsell}
                </div>
                <div
                  className={cn(
                    "absolute",
                    styles.badge,
                    styles.badgeNurture,
                    "left-[calc(50%+76px)] top-[404px]"
                  )}
                >
                  {dict.condition.nurture}
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex h-full flex-col justify-center">
            <div className="hidden lg:block">
              <div className="max-w-[280px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_14%,black_86%,transparent)]">
                <ul
                  role="list"
                  aria-label={dict.list.title}
                  className={cn(styles.listTrack, "space-y-[10px]")}
                >
                  {displayItems.map((item, index) => {
                    const active = index % listItems.length === activeListIndex;
                    const muted = !active && index % listItems.length !== activeListIndex;
                    return (
                      <ListCard
                        key={`${item.id}-${index}`}
                        item={item}
                        active={active}
                        muted={muted}
                        onClick={() => setActiveListIndex(index % listItems.length)}
                      />
                    );
                  })}
                </ul>
              </div>
            </div>

            <div className="mt-2 lg:hidden">
              <div className="flex gap-3 overflow-x-auto pb-2 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
                {listItems.map((item, index) => (
                  <div key={item.id} className="shrink-0">
                    <ListCard
                      item={item}
                      active={index === activeListIndex}
                      muted={index !== activeListIndex}
                      onClick={() => setActiveListIndex(index)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className={cn(styles.cubes, "hidden xl:block")}>
              <IsoCubes />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
