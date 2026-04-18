"use client";

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

export type DeployAiResponseField = {
  label: string;
  value: string;
  /** If true, the value renders as a pill/token (indigo accent). */
  accent?: boolean;
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
      <header className={styles.taskHeader}>
        <span className={styles.iconChip} aria-hidden="true">
          <FileSearchIcon />
        </span>
        <h3 id={titleId} className={styles.taskTitle}>{title}</h3>
        <span className={styles.aiBadge} aria-label="AI generated step">{badge}</span>
      </header>
      <div className={styles.hairline} aria-hidden="true" />
      <p className={styles.taskQuestion}>{question}</p>
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
const ROOT_Y = 20;
const ROOT_H = 36;
const CARD_LEFT = 108; // left edge of task cards
const CARD_W = 360;

type CardLayout = { top: number; height: number };
const CARD_LAYOUTS: CardLayout[] = [
  { top: 96,  height: 84 },  // card 1
  { top: 240, height: 88 },  // card 2
  { top: 388, height: 84 },  // card 3
];
const ANSWER_OFFSET_X = 24; // from card left
const ANSWER_TOP_OFFSET = 92; // card-height + spacing

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
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasPlayedRef.current) {
          hasPlayedRef.current = true;
          setVisible(true);
          setPhase("revealing");
          // Match the total timeline in spec §8.1 (~2.4s) before flipping to ambient
          window.setTimeout(() => setPhase("ambient"), 2480);
          obs.unobserve(el);
        }
      },
      { threshold: 0.35, rootMargin: "-10% 0px -10% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
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
  const segmentPath = (fromY: number, toY: number, landX: number) => {
    // Vertical down, then rounded corner, then horizontal into card.
    return `M ${SPINE_X} ${fromY} L ${SPINE_X} ${toY - R} Q ${SPINE_X} ${toY} ${SPINE_X + R} ${toY} L ${landX} ${toY}`;
  };
  const cardLandX = CARD_LEFT - 6; // overlap card border by 1px (spec §11)
  const cardSpineY = (i: number) => {
    const layout = CARD_LAYOUTS[i];
    return layout.top + Math.round(layout.height * 0.55);
  };
  const spinePaths = [
    segmentPath(ROOT_Y + ROOT_H / 2, cardSpineY(0), cardLandX),
    segmentPath(cardSpineY(0), cardSpineY(1), cardLandX),
    segmentPath(cardSpineY(1), cardSpineY(2), cardLandX),
  ];

  // Data-attribute for hover state → CSS highlights the matching segment
  const hoverAttr = hoveredCard != null ? String(hoveredCard + 1) : undefined;

  return (
    <SectionFrame
      ref={sectionRef}
      ariaLabel={dict.ariaLabel}
      className={cn(styles.root)}
      gridClassName="grid-cols-1 lg:grid-cols-[minmax(220px,0.9fr)_minmax(500px,1.4fr)_minmax(360px,0.9fr)] divide-y divide-border lg:divide-y-0 lg:divide-x lg:divide-border"
      data-visible={visible ? "true" : "false"}
      data-phase={phase}
      data-hover-card={hoverAttr}
    >
      {/* ─── Left: headline + description + CTA ─── */}
      <div className={styles.textCol}>
        <div>
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
              <path key={i} d={d} className={styles.spinePath} data-segment={i + 1} />
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
            <span className={styles.iconChip} aria-hidden="true">
              <FileSparkleIcon />
            </span>
            <span>{dict.trigger.title}</span>
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

      {/* ─── Right: response / Basepoint-style data card ─── */}
      <div className={styles.responseCol}>
        <article
          className={styles.responseCard}
          aria-labelledby="deploy-ai-response-title"
        >
          <header className={styles.responseHead}>
            <span className={styles.responseAvatar} aria-hidden="true">
              {dict.response.title.slice(0, 1)}
            </span>
            <div className={styles.responseHeadText}>
              <h3 id="deploy-ai-response-title" className={styles.responseTitle}>
                {dict.response.title}
              </h3>
              <span className={styles.responseDomain}>{dict.response.domain}</span>
            </div>
            <span className={styles.responseSparkle} aria-hidden="true">
              <SparkleGlyph />
            </span>
          </header>
          <div className={styles.responseHairline} aria-hidden="true" />
          <dl className={styles.responseFields}>
            {dict.response.fields.map((field, i) => (
              <div key={i} className={styles.responseRow}>
                <dt className={styles.responseLabel}>{field.label}</dt>
                <dd className={styles.responseValue}>
                  {field.accent ? (
                    <span className={styles.responseToken}>{field.value}</span>
                  ) : (
                    field.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </article>
      </div>
    </SectionFrame>
  );
}
