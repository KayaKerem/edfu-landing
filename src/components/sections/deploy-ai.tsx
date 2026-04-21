"use client";

import type { CSSProperties, ReactElement } from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import styles from "./deploy-ai.module.css";
import { SectionFrame } from "./section-frame";

/* ─────────────────────────────────────────────────────────────
 * Deploy AI section — Attio-style agent workflow flow diagram.
 * Follows the full spec in deploy-ai-flow-spec.md (layout, timing,
 * colors, a11y). Sits on the shared SectionFrame skeleton so the
 * hatched gutters + rules + ambient dot grid match surrounding
 * sections.
 * ───────────────────────────────────────────────────────────── */

export type DeployAiToken = { value: string };

export type DeployAiAnswerSegment = { type: "text"; value: string } | { type: "token"; value: string };

export type DeployAiTaskDict = {
  title: string;
  question: string;
  badge: string;
  answer: DeployAiAnswerSegment[];
  /** If true, the answer pill truncates with an ellipsis (e.g. stakeholder list). */
  truncate?: boolean;
};

export type DeployAiResponseFieldIcon =
  | "link"
  | "tag"
  | "dollar"
  | "pin"
  | "grid"
  | "coin"
  | "users";

export type DeployAiResponseFieldChip = "blue" | "green" | "purple";

export type DeployAiResponseFieldChipItem = {
  value: string;
  chip: DeployAiResponseFieldChip;
};

export type DeployAiResponseField = {
  label: string;
  icon: DeployAiResponseFieldIcon;
  value?: string;
  /** If set, the value renders as a colored chip (Attio parity). */
  chip?: DeployAiResponseFieldChip;
  /** Some rows render multiple chips instead of a single plain string. */
  chips?: DeployAiResponseFieldChipItem[];
};

export type DeployAiResponseDict = {
  title: string;
  domain: string;
  fields: DeployAiResponseField[];
};

export type DeployAiDict = {
  title: string;
  description: string;
  cta: string;
  ariaLabel: string;
  srText: string;
  trigger: {
    title: string;
  };
  tasks: DeployAiTaskDict[];
  response: DeployAiResponseDict;
};

/* ───────── Icons (lucide-style stroke, 14x14 drawn within 20x20 chip) ───────── */

function FileSparkleIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M8.4 1.5H3.7a1.2 1.2 0 0 0-1.2 1.2v8.6a1.2 1.2 0 0 0 1.2 1.2h6.6a1.2 1.2 0 0 0 1.2-1.2V4.6L8.4 1.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M8.4 1.5v3.1h3.1" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path
        d="m6.2 7.2.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6.6-1.4Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FileSearchIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M8.4 1.5H3.7a1.2 1.2 0 0 0-1.2 1.2v8.6a1.2 1.2 0 0 0 1.2 1.2h6.6a1.2 1.2 0 0 0 1.2-1.2V4.6L8.4 1.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M8.4 1.5v3.1h3.1" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="6.8" cy="8.4" r="1.5" stroke="currentColor" strokeWidth="1.1" />
      <path d="m8 9.6 1.2 1.2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

function SparkleGlyph() {
  // 4-point filled sparkle (14x14)
  return (
    <svg viewBox="0 0 14 14" fill="currentColor" aria-hidden="true" width={14} height={14}>
      <path d="M7 0.8 8.1 5.4 12.7 6.5 8.1 7.6 7 12.2 5.9 7.6 1.3 6.5 5.9 5.4 7 0.8Z" />
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

function BasepointMarkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width={14} height={14}>
      <path
        d="M11.9 3.7c-2.4 0-4.5.6-5.9 1.6-1.3 1-2 2.4-2 3.9s.7 2.9 2 3.9c1.4 1 3.5 1.6 5.9 1.6s4.5-.6 5.9-1.6c1.3-1 2-2.4 2-3.9s-.7-2.9-2-3.9c-1.4-1-3.5-1.6-5.9-1.6Z"
        fill="currentColor"
        opacity="0.94"
      />
      <path
        d="M7.3 8.2h9.1M7.3 11.9h9.1M7.3 15.6h6.1"
        stroke="#111111"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M7.3 8.2h9.1M7.3 11.9h9.1M7.3 15.6h6.1"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ───────── Response row icons (12×12, stroke #75777C) — Attio parity ─────── */

function RowLinkIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" width={12} height={12}>
      <path
        d="M5.1 6.9a1.7 1.7 0 0 0 2.4 0l1.8-1.8a1.7 1.7 0 0 0-2.4-2.4l-.4.4M6.9 5.1a1.7 1.7 0 0 0-2.4 0L2.7 6.9a1.7 1.7 0 0 0 2.4 2.4l.4-.4"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RowTagIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" width={12} height={12}>
      <path
        d="M10 6.2 6.2 10a.9.9 0 0 1-1.3 0L2 7.1V2h5.1l2.9 2.9a.9.9 0 0 1 0 1.3Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <circle cx="4.4" cy="4.4" r="0.6" fill="currentColor" />
    </svg>
  );
}

function RowDollarIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" width={12} height={12}>
      <path
        d="M6 1.8v8.4M8.3 3.9c-.4-.6-1.3-1-2.3-1-1.3 0-2.3.7-2.3 1.6 0 .9 1 1.4 2.3 1.4 1.3 0 2.3.5 2.3 1.4 0 .9-1 1.6-2.3 1.6-1 0-1.9-.4-2.3-1"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RowPinIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" width={12} height={12}>
      <path
        d="M6 10.5s3.4-3.1 3.4-5.6a3.4 3.4 0 0 0-6.8 0C2.6 7.4 6 10.5 6 10.5Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <circle cx="6" cy="4.9" r="1.1" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

function RowGridIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" width={12} height={12}>
      <rect x="1.8" y="1.8" width="3.4" height="3.4" rx="0.7" stroke="currentColor" strokeWidth="1.1" />
      <rect x="6.8" y="1.8" width="3.4" height="3.4" rx="0.7" stroke="currentColor" strokeWidth="1.1" />
      <rect x="1.8" y="6.8" width="3.4" height="3.4" rx="0.7" stroke="currentColor" strokeWidth="1.1" />
      <rect x="6.8" y="6.8" width="3.4" height="3.4" rx="0.7" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

function RowCoinIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" width={12} height={12}>
      <ellipse cx="6" cy="3.4" rx="3.6" ry="1.4" stroke="currentColor" strokeWidth="1.1" />
      <path
        d="M2.4 3.4v5.2c0 .8 1.6 1.4 3.6 1.4s3.6-.6 3.6-1.4V3.4M2.4 6c0 .8 1.6 1.4 3.6 1.4S9.6 6.8 9.6 6"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RowUsersIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" width={12} height={12}>
      <circle cx="4.4" cy="4.2" r="1.6" stroke="currentColor" strokeWidth="1.1" />
      <path
        d="M1.4 10c0-1.7 1.3-3 3-3s3 1.3 3 3"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M8 4.2a1.5 1.5 0 0 1 0 2.9M10.6 10c0-1.5-1-2.6-2.3-2.9"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

const ROW_ICONS: Record<DeployAiResponseFieldIcon, () => ReactElement> = {
  link: RowLinkIcon,
  tag: RowTagIcon,
  dollar: RowDollarIcon,
  pin: RowPinIcon,
  grid: RowGridIcon,
  coin: RowCoinIcon,
  users: RowUsersIcon,
};

/* Planet / orbit glyph — mirrors the cubes motif in automate-everything,
 * shown below the response card in the right column. */
function OrbitGlyph() {
  return (
    <svg
      width="122"
      height="120"
      viewBox="0 0 122 120"
      fill="none"
      className="overflow-visible"
      aria-hidden="true"
    >
      <path
        d="M60 100C82.0914 100 100 82.0914 100 60C100 37.9086 82.0914 20 60 20C37.9086 20 20 37.9086 20 60C20 82.0914 37.9086 100 60 100Z"
        fill="#FAFAFB"
        stroke="#505967"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        opacity="0.6"
        d="M70.5009 16.5804C91.4394 2.34847 109.934 -3.10875 117.412 4.31397C128.23 15.0534 111.888 48.6878 80.9114 79.4386C49.9344 110.189 16.0525 126.412 5.23413 115.672C-2.1514 108.341 3.12116 90.3388 17.0668 69.8685L20 65.5M68 102C89.2605 116.631 109.305 123.188 116.875 115.672C127.694 104.933 109.977 73.2508 79 42.5C48.023 11.7492 15.5161 -6.42545 4.69772 4.31397C-2.77032 11.7275 2.70414 30.051 17.001 50.8048L20 55"
        stroke="#505967"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="5 5"
      />
    </svg>
  );
}

/* ───────── Sub-components ───────── */

function TaskCard({
  idx,
  title,
  question,
  badge,
  onHoverChange,
}: {
  idx: number;
  title: string;
  question: string;
  badge: string;
  onHoverChange?: (hovered: boolean) => void;
}) {
  const titleId = `deploy-ai-task-${idx}-title`;
  return (
    <article
      className={styles.taskCard}
      data-idx={idx}
      aria-labelledby={titleId}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
      onFocus={() => onHoverChange?.(true)}
      onBlur={() => onHoverChange?.(false)}
      tabIndex={0}
    >
      {/* Attio pattern: outer wrapper = halo border, inner = white card */}
      <div className={styles.taskCardInner}>
        <header className={styles.taskHeader}>
          <span className={styles.iconChip} aria-hidden="true">
            <FileSearchIcon />
          </span>

          <h3 id={titleId} className={styles.taskTitle}>{title}</h3>
          <span className={styles.aiBadge} aria-label="AI generated step">{badge}</span>
        </header>
        <div className={styles.hairline} aria-hidden="true" />
        <p className={styles.taskQuestion}>{question}</p>
      </div>
    </article>
  );
}

function AnswerPill({
  idx,
  segments,
  truncate,
}: {
  idx: number;
  segments: DeployAiAnswerSegment[];
  truncate?: boolean;
}) {
  return (
    <div
      className={cn(styles.answerPill, truncate && styles.truncate)}
      data-idx={idx}
      role="group"
      aria-label="AI answer"
    >
      <span className={styles.sparkle} aria-hidden="true">
        <SparkleGlyph />
      </span>
      <span className={styles.answerText}>
        {segments.map((seg, i) =>
          seg.type === "token" ? (
            <span key={i} className={styles.token}>{seg.value}</span>
          ) : (
            <span key={i}>{seg.value}</span>
          )
        )}
      </span>
    </div>
  );
}

/* ───────── Geometry helpers ─────────
 * Canvas is fluid. Positions are absolute inside a fixed-aspect stage so SVG
 * coordinates line up with DOM cards. Compressed to match the center column
 * of automate-everything (~500px wide, ~540px tall — section min-height 620).
 */
const STAGE_W = 500;
const STAGE_H = 540;
const ROOT_X = 8;
const ROOT_Y = 22;
const ROOT_H = 38;
const CARD_LEFT = 106; // left edge of task cards
const CARD_W = 362;

type CardLayout = { top: number; height: number };
const CARD_LAYOUTS: CardLayout[] = [
  { top: 98,  height: 86 },  // card 1
  { top: 242, height: 88 },  // card 2
  { top: 390, height: 86 },  // card 3
];
const ANSWER_OFFSET_X = 24; // from card left
const ANSWER_TOP_OFFSET = 94; // card-height + spacing

export function DeployAi({ dict }: { dict: DeployAiDict }) {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [visible, setVisible] = useState(false);
  const hasPlayedRef = useRef(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [phase, setPhase] = useState<"idle" | "revealing" | "ambient">("idle");

  // IntersectionObserver — fire once when the section enters viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let ambientTimer: number | undefined;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasPlayedRef.current) {
          hasPlayedRef.current = true;
          setVisible(true);
          setPhase("revealing");
          // Match the total timeline in spec §8.1 (~2.4s) before flipping to ambient
          ambientTimer = window.setTimeout(() => setPhase("ambient"), 2480);
          obs.unobserve(el);
        }
      },
      { threshold: 0.35, rootMargin: "-10% 0px -10% 0px" }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      if (ambientTimer) window.clearTimeout(ambientTimer);
    };
  }, []);

  // Measure spine path lengths so stroke-dashoffset animation knows its own
  // distance (getTotalLength is the canonical "self-drawing line" setup per
  // spec §13).
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const paths = svg.querySelectorAll<SVGPathElement>("path[data-segment]");
    paths.forEach((p) => {
      const len = Math.ceil(p.getTotalLength());
      p.style.setProperty("--len", String(len));
    });
  }, []);

  // Build three "L"-shaped spine segments: omurga goes down from root,
  // then takes a rounded 90° turn into each card's left edge at its
  // vertical ~55% point (spec §11 detail: spine connects slightly below
  // the card title, not dead center).
  const SPINE_X = ROOT_X + 32; // drops vertically from just inside root pill
  const R = 12; // rounded corner radius
  const SEGMENT_OVERLAP = 8;
  const segmentPath = (fromY: number, toY: number, landX: number) =>
    `M ${SPINE_X} ${fromY} L ${SPINE_X} ${toY - R} Q ${SPINE_X} ${toY} ${SPINE_X + R} ${toY} L ${landX} ${toY}`;
  const cardLandX = CARD_LEFT + 30; // extend branches deeper under the card so they visibly connect
  const cardSpineY = (i: number) => {
    const layout = CARD_LAYOUTS[i];
    return layout.top + Math.round(layout.height * 0.55);
  };
  const spinePaths = [
    segmentPath(ROOT_Y + ROOT_H / 2, cardSpineY(0) + SEGMENT_OVERLAP, cardLandX),
    segmentPath(cardSpineY(0) - SEGMENT_OVERLAP, cardSpineY(1) + SEGMENT_OVERLAP, cardLandX),
    segmentPath(cardSpineY(1) - SEGMENT_OVERLAP, cardSpineY(2), cardLandX),
  ];

  // Data-attribute for hover state → CSS highlights the matching segment
  const hoverAttr = hoveredCard != null ? String(hoveredCard + 1) : undefined;

  return (
    <SectionFrame
      ref={sectionRef}
      id="deploy-ai"
      ariaLabel={dict.ariaLabel}
      className={cn(styles.root)}
      gridClassName="grid-cols-1 lg:grid-cols-[minmax(220px,0.9fr)_minmax(500px,1.4fr)_minmax(360px,0.9fr)] divide-y divide-border lg:divide-y-0 lg:divide-x lg:divide-border"
      data-visible={visible ? "true" : "false"}
      data-phase={phase}
      data-hover-card={hoverAttr}
    >
      {/* ─── Left: headline + description + CTA ─── */}
      <div className={styles.textCol}>
        <div className="max-w-[320px] flex flex-col justify-start px-6">
          <h2 className={styles.title} style={{ fontFamily: "var(--font-geist)" }}>
            {dict.title}
          </h2>
          <p className={styles.description}>{dict.description}</p>
          <span className="sr-only">{dict.srText}</span>
        </div>
        <a className={styles.cta} href="#deploy-ai">
          <span>{dict.cta}</span>
          <span className={styles.arrow} aria-hidden="true"><ArrowRightIcon /></span>
        </a>
      </div>

      {/* ─── Right: flow canvas ─── */}
      <div className={styles.canvas} role="group" aria-label={dict.ariaLabel}>
        <div className={styles.canvasDots} aria-hidden="true" />
        <div
          className={styles.stage}
          style={{ aspectRatio: `${STAGE_W} / ${STAGE_H}` }}
        >
          {/* SVG spine — behind cards */}
          <svg
            ref={svgRef}
            className={styles.spine}
            viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {spinePaths.map((d, i) => (
              <path
                key={i}
                d={d}
                className={styles.spinePath}
                data-segment={i + 1}
              />
            ))}
          </svg>

          {/* Root trigger pill */}
          <div
            className={styles.triggerPill}
            style={{
              position: "absolute",
              top: `${(ROOT_Y / STAGE_H) * 100}%`,
              left: `${(ROOT_X / STAGE_W) * 100}%`,
            }}
            role="group"
            aria-label="Workflow trigger"
          >
            <div className={styles.triggerPillInner}>
              <span className={styles.iconChip} aria-hidden="true">
                <FileSparkleIcon />
              </span>
              <span>{dict.trigger.title}</span>
            </div>
          </div>

          {/* Task cards + answer pills */}
          {dict.tasks.slice(0, 3).map((task, i) => {
            const layout = CARD_LAYOUTS[i];
            const taskLeftPct = (CARD_LEFT / STAGE_W) * 100;
            const taskTopPct = (layout.top / STAGE_H) * 100;
            const taskWidthPct = (CARD_W / STAGE_W) * 100;
            const answerLeftPct = ((CARD_LEFT + ANSWER_OFFSET_X) / STAGE_W) * 100;
            const answerTopPct = ((layout.top + ANSWER_TOP_OFFSET) / STAGE_H) * 100;
            return (
              <div key={i}>
                <div
                  style={{
                    position: "absolute",
                    top: `${taskTopPct}%`,
                    left: `${taskLeftPct}%`,
                    width: `${taskWidthPct}%`,
                  }}
                >
                  <TaskCard
                    idx={i + 1}
                    title={task.title}
                    question={task.question}
                    badge={task.badge}
                    onHoverChange={(h) => setHoveredCard(h ? i : null)}
                  />
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: `${answerTopPct}%`,
                    left: `${answerLeftPct}%`,
                    maxWidth: `${taskWidthPct - (ANSWER_OFFSET_X / STAGE_W) * 100}%`,
                  }}
                >
                  <AnswerPill idx={i + 1} segments={task.answer} truncate={task.truncate} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Right: response card (top) + dashed grid + orbit glyph (bottom) ─── */}
      <div className={styles.responseCol}>
        <div className={styles.responseTop}>
          <article
            className={styles.responseCard}
            aria-labelledby="deploy-ai-response-title"
          >
            <header className={styles.responseHead}>
              <span className={styles.responseAvatar} aria-hidden="true">
                <BasepointMarkIcon />
              </span>
              <div className={styles.responseHeadText}>
                <h3 id="deploy-ai-response-title" className={styles.responseTitle}>
                  {dict.response.title}
                </h3>
              </div>
            </header>
            <div className={styles.responseHairline} aria-hidden="true" />
            <dl className={styles.responseFields}>
              {dict.response.fields.map((field, i) => {
                const Icon = ROW_ICONS[field.icon];
                const chipClass =
                  field.chip === "blue"
                    ? styles.responseChipBlue
                    : field.chip === "green"
                      ? styles.responseChipGreen
                      : field.chip === "purple"
                        ? styles.responseChipPurple
                        : undefined;
                return (
                  <div
                    key={i}
                    className={styles.responseRow}
                    style={{ "--row-delay": `${2500 + i * 70}ms` } as CSSProperties}
                  >
                    <dt className={styles.responseLabel}>
                      <span className={styles.responseRowIcon} aria-hidden="true">
                        <Icon />
                      </span>
                      <span>{field.label}</span>
                    </dt>
                    <dd className={styles.responseValue}>
                      {field.chips?.length ? (
                        <span className={styles.responseValueChips}>
                          {field.chips.map((chipItem) => {
                            const multiChipClass =
                              chipItem.chip === "blue"
                                ? styles.responseChipBlue
                                : chipItem.chip === "green"
                                  ? styles.responseChipGreen
                                  : styles.responseChipPurple;
                            return (
                              <span
                                key={`${field.label}-${chipItem.value}`}
                                className={cn(styles.responseChip, multiChipClass)}
                              >
                                {chipItem.value}
                              </span>
                            );
                          })}
                        </span>
                      ) : !field.value ? (
                        <span className={styles.responseValueEmpty} aria-hidden="true" />
                      ) : chipClass ? (
                        <span className={cn(styles.responseChip, chipClass)}>
                          {field.value}
                        </span>
                      ) : (
                        field.value
                      )}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </article>
        </div>

        {/* Dashed grid + orbit glyph (desktop only) — mirrors the cubes motif
            at the bottom of automate-everything's right column. */}
        <div className={styles.responseBottom}>
          <div className={styles.responseDashedGrid} aria-hidden="true">
            <div className={styles.dashedCell} />
            <div className={styles.dashedCell} />
            <div className={styles.dashedCell} />
            <div className={styles.dashedCell} />
            <div className={styles.dashedCell} />
            <div />
          </div>
          <div className={styles.responseOrbit} aria-hidden="true">
            <OrbitGlyph />
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}
