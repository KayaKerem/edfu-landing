# Meeting Bento (ci-bento-3) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the plain 3-feature-card block on `/meeting` with a pixel-faithful adaptation of Attio's `ci-bento-3` — three animated cards (transcript mini, Meet↔GreenLeaf connector, status feed) inside a 12-column bento with dotted backdrops.

**Architecture:** One section shell component (`MeetingBento`) composes three independent mockup components via file-local `Card / CardArt / CardCopy` helpers. A shared `useInView` hook toggles a `data-visible` attribute per mockup; CSS keyframes in `globals.css` animate any descendant carrying `data-animate="..."`. Looped animations (pulse rings, bead flow) run on class selectors and ignore the visibility gate. No new runtime dependencies.

**Tech Stack:** Next 16.2.1 (App Router), React 19, TypeScript, Tailwind v4, CSS keyframes, `IntersectionObserver`.

**Spec reference:** `docs/superpowers/specs/2026-04-17-meeting-ci-bento-design.md`

**Project conventions (read before starting):**
- `AGENTS.md` warns: "This is NOT the Next.js you know." If an API surprises you, check `node_modules/next/dist/docs/` first.
- Mockup components follow the pattern in `src/components/mockups/*.tsx` — server components by default; add `"use client"` only when the component uses hooks (we will, because of `useInView`).
- Colour tokens: use `bg-card`, `text-foreground`, `border-border`, etc. Hardcoded hex is acceptable only when matching the Attio spec's brand-specific colours (pill backgrounds, avatar dots) — all listed verbatim in §6 of the spec.
- "Tests" in this repo = `npx tsc --noEmit` + `npm run lint` + `npm run build` + manual dev-server visual check. There is no unit-test framework.

---

## File Structure

**New files:**
- `src/hooks/use-in-view.ts` — shared IntersectionObserver hook
- `src/components/ui/svgs/green-leaf.tsx` — GreenLeaf brand icon (leaf + lock badge)
- `src/components/mockups/transcript-mini.tsx` — Card 1 visual
- `src/components/mockups/status-feed-mini.tsx` — Card 3 visual
- `src/components/mockups/meet-crm-connector.tsx` — Card 2 visual (SVG + overlay nodes)
- `src/components/sections/meeting-bento.tsx` — section shell with 3 card slots

**Modified files:**
- `src/app/globals.css` — append 5 keyframes + gating selectors + reduced-motion rule
- `src/app/[lang]/meeting/page.tsx` — delete old 3-feature-card `<section>`, insert `<MeetingBento />`

---

## Task 0: Orientation (2 min, no code)

**Files:** none

- [ ] **Step 1: Read Next.js 16 App Router client-component guidance**

Run: `ls node_modules/next/dist/docs/01-app/01-getting-started/ && cat node_modules/next/dist/docs/01-app/01-getting-started/*client*.md 2>/dev/null | head -60`

Purpose: confirm `"use client"` directive is still the way to opt into client components in Next 16. If the directive has changed, adapt subsequent tasks accordingly.

- [ ] **Step 2: Sanity-check existing mockup conventions**

Run: `head -1 src/components/mockups/call-player.tsx src/components/mockups/meeting-list.tsx src/components/mockups/meeting-transcript.tsx`

Expected: server components (no `"use client"`) unless they use hooks. You'll add `"use client"` to the new mockups in this plan because they all use `useInView`.

- [ ] **Step 3: Verify current page renders cleanly before modifying**

Run: `npx tsc --noEmit && npm run lint`

Expected: zero errors. If there are errors unrelated to this plan, stop and ask before proceeding.

---

## Task 1: `useInView` hook

**Files:**
- Create: `src/hooks/use-in-view.ts`

- [ ] **Step 1: Create the hook**

```ts
"use client";

import { useEffect, useRef, useState } from "react";

export function useInView<T extends HTMLElement>(threshold = 0.4) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, visible };
}
```

- [ ] **Step 2: Verify it type-checks**

Run: `npx tsc --noEmit`

Expected: PASS (no errors).

- [ ] **Step 3: Commit**

```bash
git add src/hooks/use-in-view.ts
git commit -m "feat: add useInView hook for scroll-triggered animations"
```

---

## Task 2: Global animation keyframes + gating selectors

**Files:**
- Modify: `src/app/globals.css` (append block at EOF)

- [ ] **Step 1: Locate EOF of globals.css**

Run: `wc -l src/app/globals.css`

Note the line count; the new block goes at the bottom.

- [ ] **Step 2: Append the animation block**

Append this block verbatim to `src/app/globals.css`:

```css

/* === meeting-bento animations (ci-bento-3) === */

@keyframes rise-fade {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-right {
  from {
    opacity: 0;
    transform: translateX(16px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse-rings {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.04);
    opacity: 1;
  }
}

@keyframes bead-flow {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
}

@keyframes chip-pop {
  0% {
    transform: scale(0.9);
  }
  60% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

/* Initial hidden state for one-shot animations */
[data-animate="rise"],
[data-animate="slide-right"] {
  opacity: 0;
}

/* One-shot animations trigger only when the owning region reports data-visible="true" */
[data-visible="true"] [data-animate="rise"] {
  animation: rise-fade 540ms cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
}
[data-visible="true"] [data-animate="slide-right"] {
  animation: slide-right 420ms cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
}
[data-visible="true"] [data-animate="chip-pop"] {
  animation: chip-pop 220ms cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
}

/* Looped animations — run unconditionally in-DOM */
.pulse-ring-outer {
  transform-origin: center;
  animation: pulse-rings 2.8s ease-in-out infinite;
}
.pulse-ring-inner {
  transform-origin: center;
  animation: pulse-rings 2.8s ease-in-out -1.4s infinite;
}
.bead-flow-line {
  animation: bead-flow 2.6s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  [data-visible="true"] [data-animate],
  [data-animate] {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
  .pulse-ring-outer,
  .pulse-ring-inner,
  .bead-flow-line {
    animation: none !important;
  }
}
```

- [ ] **Step 3: Verify lint / type-check still pass**

Run: `npx tsc --noEmit && npm run lint`

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add ci-bento-3 animation keyframes and gating selectors"
```

---

## Task 3: `GreenLeaf` brand icon

**Files:**
- Create: `src/components/ui/svgs/green-leaf.tsx`

- [ ] **Step 1: Create the icon**

Reference existing SVG components at `src/components/ui/svgs/google-meet.tsx` and copy the prop-shape convention.

```tsx
export function GreenLeaf({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="presentation"
    >
      {/* Leaf — two simple curves forming a stylised teardrop */}
      <path
        d="M4 15.5C4 9.7 9 4.5 14.5 4.5C17 4.5 19 5 20 5.5C20 11.2 15 16.5 9.5 16.5C7 16.5 5 16 4 15.5Z"
        fill="#2E8B57"
      />
      <path
        d="M4 15.5C7 13 10 10.5 14 8"
        stroke="#1F5F3D"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* Lock badge — small shield in bottom-right */}
      <rect x="14" y="14" width="8" height="8" rx="2" fill="white" stroke="#CAD0D9" strokeWidth="0.6" />
      <path
        d="M16.5 17V16.2C16.5 15.3 17.2 14.6 18 14.6C18.8 14.6 19.5 15.3 19.5 16.2V17"
        stroke="#1F5F3D"
        strokeWidth="0.8"
        fill="none"
      />
      <rect x="16" y="17" width="4" height="3.2" rx="0.6" fill="#1F5F3D" />
    </svg>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/svgs/green-leaf.tsx
git commit -m "feat: add GreenLeaf brand icon for meeting-bento card 2"
```

---

## Task 4: `TranscriptMini` mockup (Card 1)

**Files:**
- Create: `src/components/mockups/transcript-mini.tsx`

- [ ] **Step 1: Scaffold the client component with hook wiring**

```tsx
"use client";

import { useInView } from "@/hooks/use-in-view";

export function TranscriptMini() {
  const { ref, visible } = useInView<HTMLDivElement>(0.4);

  return (
    <div
      ref={ref}
      data-visible={visible}
      className="absolute inset-0"
      aria-hidden="true"
    >
      <div
        data-animate="rise"
        className="absolute left-[8%] top-[10%] w-[60%] rounded-xl border border-border bg-card shadow-md"
      >
        {/* Tab header */}
        <div className="flex gap-4 border-b border-border px-4 pt-3">
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            className="relative pb-2 text-[13px] font-medium text-foreground"
          >
            ✧ Insights
            <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-foreground" />
          </button>
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            className="pb-2 text-[13px] text-muted-foreground"
          >
            │ Transcript
          </button>
        </div>

        {/* Speaker 1 — Jamie */}
        <div className="space-y-1.5 p-4">
          <div className="flex items-center gap-2">
            <span className="size-5 rounded-full bg-[#8FD5A6]" />
            <span className="text-[13px] font-semibold">Jamie Davies</span>
          </div>
          <p className="text-[12px] leading-relaxed text-foreground">
            Honestly, this looks like exactly what we need, what are{" "}
            <span
              data-animate="chip-pop"
              style={{ animationDelay: "120ms" }}
              className="inline-block rounded px-1 py-0.5 bg-[rgba(184,169,255,0.18)] text-[#5b4cc9]"
            >
              the next steps?
            </span>
          </p>
        </div>

        {/* Speaker 2 — Guy */}
        <div className="space-y-1.5 px-4 pb-4">
          <div className="flex items-center gap-2">
            <span className="size-5 rounded-full bg-[#F0B37E]" />
            <span className="text-[13px] font-semibold">Guy Hawkins</span>
          </div>
          <span className="block h-2 w-[96%] rounded-sm bg-[#EFEEEC]" />
          <span className="block h-2 w-[80%] rounded-sm bg-[#EFEEEC]" />
          <span className="block h-2 w-[60%] rounded-sm bg-[#EFEEEC]" />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type-check + lint**

Run: `npx tsc --noEmit && npm run lint`

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/mockups/transcript-mini.tsx
git commit -m "feat: add TranscriptMini mockup for meeting bento card 1"
```

---

## Task 5: `StatusFeedMini` mockup (Card 3)

**Files:**
- Create: `src/components/mockups/status-feed-mini.tsx`

- [ ] **Step 1: Scaffold the client component**

```tsx
"use client";

import { useInView } from "@/hooks/use-in-view";

type PillColor = "green" | "amber";

function Pill({
  color,
  children,
  delayMs,
}: {
  color: PillColor;
  children: string;
  delayMs?: number;
}) {
  const palette =
    color === "green"
      ? { bg: "rgba(140,224,154,0.14)", fg: "#1F7A33" }
      : { bg: "rgba(245,180,131,0.14)", fg: "#8A4A15" };

  return (
    <span
      data-animate={delayMs !== undefined ? "chip-pop" : undefined}
      style={{
        backgroundColor: palette.bg,
        color: palette.fg,
        animationDelay: delayMs !== undefined ? `${delayMs}ms` : undefined,
      }}
      className="inline-block rounded-full px-2 py-0.5 text-[12px] font-medium"
    >
      {children}
    </span>
  );
}

function MiroMark() {
  return (
    <span className="inline-flex size-5 items-center justify-center rounded border border-border bg-white">
      <span className="text-[10px] font-bold text-[#F8C95B]">M</span>
    </span>
  );
}

export function StatusFeedMini() {
  const { ref, visible } = useInView<HTMLDivElement>(0.4);

  return (
    <div
      ref={ref}
      data-visible={visible}
      className="absolute inset-0"
      aria-hidden="true"
    >
      <div className="absolute right-[8%] top-[18%] w-[62%] rounded-xl border border-border bg-card shadow-md divide-y divide-border overflow-hidden">
        {/* Row 1 — Won */}
        <div
          data-animate="slide-right"
          style={{ animationDelay: "0ms" }}
          className="flex items-center gap-3 px-4 py-3"
        >
          <span className="text-muted-foreground text-[13px]">✦</span>
          <MiroMark />
          <span className="text-[13px]">
            <strong className="font-semibold">Miro</strong>{" "}
            <span className="text-muted-foreground">status changed to</span>{" "}
            <Pill color="green" delayMs={500}>
              Won
            </Pill>
          </span>
        </div>

        {/* Row 2 — Lisa called Miro */}
        <div
          data-animate="slide-right"
          style={{ animationDelay: "120ms" }}
          className="flex items-center gap-3 px-4 py-3"
        >
          <span className="text-muted-foreground text-[13px]">◉</span>
          <MiroMark />
          <span className="text-[13px]">
            <strong className="font-semibold">Lisa</strong>{" "}
            <span className="text-muted-foreground">had a call with</span>{" "}
            <strong className="font-semibold">Miro</strong>
          </span>
        </div>

        {/* Row 3 — Outreach */}
        <div
          data-animate="slide-right"
          style={{ animationDelay: "240ms" }}
          className="flex items-center gap-3 px-4 py-3"
        >
          <span className="text-muted-foreground text-[13px]">↩︎</span>
          <MiroMark />
          <span className="text-[13px]">
            <strong className="font-semibold">Miro</strong>{" "}
            <span className="text-muted-foreground">status changed to</span>{" "}
            <Pill color="amber">Outreach</Pill>
          </span>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type-check + lint**

Run: `npx tsc --noEmit && npm run lint`

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/mockups/status-feed-mini.tsx
git commit -m "feat: add StatusFeedMini mockup for meeting bento card 3"
```

---

## Task 6: `MeetCrmConnector` mockup (Card 2)

**Files:**
- Create: `src/components/mockups/meet-crm-connector.tsx`

This component has three visual layers: background SVG (vignette + dashed rings + base line), HTML overlay for the animated bead line, HTML overlays for the two icon nodes.

- [ ] **Step 1: Scaffold with SVG layer only (no nodes, no bead)**

```tsx
"use client";

import { useInView } from "@/hooks/use-in-view";
import { GoogleMeet } from "@/components/ui/svgs/google-meet";
import { GreenLeaf } from "@/components/ui/svgs/green-leaf";

export function MeetCrmConnector() {
  const { ref, visible } = useInView<HTMLDivElement>(0.4);

  return (
    <div
      ref={ref}
      data-visible={visible}
      className="absolute inset-0"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 321 321"
        className="absolute inset-0 h-full w-full"
        role="presentation"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="mcc-vignette"
            x1="160.66"
            y1="149.7"
            x2="160.66"
            y2="254.95"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="100%" stopColor="white" stopOpacity="1" />
          </linearGradient>
          <radialGradient id="mcc-ring-fill" cx="0.5" cy="0.5" r="0.5">
            <stop offset="52%" stopColor="white" stopOpacity="0" />
            <stop offset="100%" stopColor="white" stopOpacity="1" />
          </radialGradient>
        </defs>

        {/* Outer dashed ring — class drives pulse animation */}
        <circle
          cx="160.175"
          cy="197.46"
          r="76.84"
          stroke="#CAD0D9"
          strokeWidth="0.97"
          strokeDasharray="5.84 5.84"
          fill="url(#mcc-ring-fill)"
          className="pulse-ring-outer"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
        {/* Inner dashed ring */}
        <circle
          cx="160.175"
          cy="197.461"
          r="54.47"
          stroke="#CAD0D9"
          strokeWidth="0.97"
          strokeDasharray="5.84 5.84"
          fill="url(#mcc-ring-fill)"
          className="pulse-ring-inner"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />

        {/* Base connector line */}
        <line
          x1="159.8"
          y1="118.19"
          x2="159.8"
          y2="165.85"
          stroke="#E4E7EC"
          strokeWidth="1.3"
        />

        {/* Vignette fades rings into dotted backdrop */}
        <rect
          x="72"
          y="120"
          width="176"
          height="160"
          fill="url(#mcc-vignette)"
        />
      </svg>
    </div>
  );
}
```

- [ ] **Step 2: Type-check to verify SVG props are accepted by React 19 types**

Run: `npx tsc --noEmit`

Expected: PASS. If `transformBox` errors, cast the style object: `style={{ transformBox: "fill-box" as const, transformOrigin: "center" }}`.

- [ ] **Step 3: Add the animated bead overlay**

Insert immediately **after** the closing `</svg>` tag, before the closing `</div>`:

```tsx
      {/* Animated bead overlay — CSS gradient inside a clipped container */}
      {/* Positioned at SVG coords (160, 118) → (160, 165.85) in a 321×321 viewBox */}
      <div
        className="pointer-events-none absolute overflow-hidden"
        style={{
          left: "49.8%",
          top: "36.75%",
          width: "1.3px",
          height: "14.85%",
        }}
      >
        <div
          className="bead-flow-line"
          style={{
            width: "100%",
            height: "200%",
            background:
              "linear-gradient(to bottom, #E4E7EC 0%, #94B9FF 25%, #94B9FF 75%, #E4E7EC 100%)",
          }}
        />
      </div>
```

- [ ] **Step 4: Add the two HTML node overlays**

Insert immediately **after** the bead overlay block:

```tsx
      {/* Top node — Google Meet icon */}
      <div
        data-animate="rise"
        style={{ left: "49.8%", top: "30.5%", animationDelay: "0ms" }}
        className="absolute -translate-x-1/2 -translate-y-1/2 flex size-10 items-center justify-center rounded-lg border border-border bg-white shadow-md"
      >
        <GoogleMeet className="size-5" />
      </div>

      {/* Centre node — GreenLeaf icon */}
      <div
        data-animate="rise"
        style={{ left: "49.8%", top: "61.4%", animationDelay: "160ms" }}
        className="absolute -translate-x-1/2 -translate-y-1/2 flex size-11 items-center justify-center rounded-lg border border-border bg-white shadow-md"
      >
        <GreenLeaf className="size-6" />
      </div>
```

- [ ] **Step 5: Type-check + lint after full component**

Run: `npx tsc --noEmit && npm run lint`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/mockups/meet-crm-connector.tsx
git commit -m "feat: add MeetCrmConnector mockup for meeting bento card 2"
```

---

## Task 7: `MeetingBento` section shell

**Files:**
- Create: `src/components/sections/meeting-bento.tsx`

This file defines three local helpers (`Card`, `CardArt`, `CardCopy`) and composes them with the three mockups.

- [ ] **Step 1: Write the full section**

```tsx
import { TranscriptMini } from "@/components/mockups/transcript-mini";
import { MeetCrmConnector } from "@/components/mockups/meet-crm-connector";
import { StatusFeedMini } from "@/components/mockups/status-feed-mini";

function DottedBackdrop({ patternId }: { patternId: string }) {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 h-full w-full text-border/60"
      role="presentation"
    >
      <defs>
        <pattern
          id={patternId}
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <rect width="1" height="1" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative bg-card">
      <div className="mx-auto max-w-[calc(100%-32px)] md:max-w-[calc(100%-48px)] py-16 lg:py-20 xl:py-28">
        {children}
      </div>
    </div>
  );
}

function CardArt({
  children,
  patternId,
}: {
  children: React.ReactNode;
  patternId: string;
}) {
  return (
    <div className="relative mb-6 aspect-square md:max-lg:aspect-[1.618] w-full overflow-hidden">
      <DottedBackdrop patternId={patternId} />
      {children}
    </div>
  );
}

function CardCopy({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

export function MeetingBento() {
  return (
    <section className="relative">
      <header className="mx-auto max-w-7xl px-4 md:px-6 pt-16 pb-10 md:pt-20 md:pb-12 lg:pt-32 lg:pb-16 xl:pt-40 xl:pb-20">
        <h2 className="max-w-[820px] text-[32px] md:text-[48px] leading-[1.1] font-semibold tracking-[-0.015em]">
          <span className="text-foreground">
            From hello to handoff, every word lives in Attio.
          </span>{" "}
          <span className="text-muted-foreground">
            Search, replay, or uncover insights from any conversation.
          </span>
        </h2>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-border p-px">
        <Card>
          <CardArt patternId="dotP-1">
            <TranscriptMini />
          </CardArt>
          <CardCopy
            title="Every call, every detail."
            body="Our native AI records, transcribes, and logs every call as you talk."
          />
        </Card>
        <Card>
          <CardArt patternId="dotP-2">
            <MeetCrmConnector />
          </CardArt>
          <CardCopy
            title="No more lost call notes."
            body="Call recordings and meeting details are automatically linked to relevant records."
          />
        </Card>
        <Card>
          <CardArt patternId="dotP-3">
            <StatusFeedMini />
          </CardArt>
          <CardCopy
            title="Context, not just content."
            body="Every conversation is instantly structured and searchable."
          />
        </Card>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Type-check + lint**

Run: `npx tsc --noEmit && npm run lint`

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/meeting-bento.tsx
git commit -m "feat: add MeetingBento section shell with 3 card slots"
```

---

## Task 8: Wire `MeetingBento` into `/meeting` page

**Files:**
- Modify: `src/app/[lang]/meeting/page.tsx` (delete lines 110-130, insert new component, clean unused dictionary read)

- [ ] **Step 1: Read the page to confirm current state**

Read `src/app/[lang]/meeting/page.tsx`. Locate the `{/* 3 Feature Cards */}` section (starts ~line 110) and the import block at the top.

- [ ] **Step 2: Add the import**

At the top of the file, after the existing `import { MeetingHero } from ...` line, add:

```tsx
import { MeetingBento } from "@/components/sections/meeting-bento";
```

- [ ] **Step 3: Replace the old section**

Delete the entire block starting at `{/* 3 Feature Cards */}` and ending with the closing `</section>` that matches it (the one that iterates `mp.featureCards.map(...)`). Replace with exactly:

```tsx
          <MeetingBento />
```

(keep the existing indentation level — it sits as a direct child of `<main className="divide-y divide-border">`, same level as `<MeetingHero>`).

- [ ] **Step 4: Verify `mp.featureCards` is no longer read anywhere in this file**

Run: `grep -n "featureCards" 'src/app/[lang]/meeting/page.tsx'`

Expected: no matches. If any remain, remove them. The dictionary key itself stays in `tr.json` / `en.json` — we don't modify dictionaries in this task (localization is a separate pass per the spec).

- [ ] **Step 5: Type-check + lint**

Run: `npx tsc --noEmit && npm run lint`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add 'src/app/[lang]/meeting/page.tsx'
git commit -m "feat: swap meeting feature cards for ci-bento-3 MeetingBento"
```

---

## Task 9: Build + dev-server visual verification

**Files:** none modified — verification only.

- [ ] **Step 1: Build the app**

Run: `npm run build`

Expected: build succeeds, no new warnings or errors.

- [ ] **Step 2: Ask the user to start the dev server and check visually**

Tell the user:
> "Run `npm run dev` and open `http://localhost:3000/meeting`. Confirm:
> 1. The three Feature Cards block is gone; a new bento with 3 cards replaces it.
> 2. Card 1 (left): Jamie/Guy transcript card slides in, lavender 'the next steps?' pill pops.
> 3. Card 2 (middle): Google Meet icon on top, GreenLeaf icon in centre of two dashed rings; a blue bead travels down the line; rings breathe softly out of phase.
> 4. Card 3 (right): three feed rows slide in from the right; 'Won' pill pops in green; 'Outreach' pill is amber.
> 5. Resize to mobile width (<768px): cards stack vertically, dividers become horizontal.
> 6. Toggle OS `prefers-reduced-motion: reduce`: no animation plays, content is visible immediately."

- [ ] **Step 3: Address any visual regressions the user reports**

If the user flags issues, iterate on the specific mockup file, re-run `npx tsc --noEmit && npm run lint` after each fix, and commit each fix separately with a descriptive message (e.g., `fix: transcript mini pill alignment on mobile`).

- [ ] **Step 4: Final commit or none**

If no issues: nothing to commit here. If issues were fixed, they were committed in Step 3 per fix.

---

## Verification checklist (end of plan)

- [ ] `npx tsc --noEmit` clean
- [ ] `npm run lint` clean
- [ ] `npm run build` clean
- [ ] `/meeting` renders 3 bento cards replacing the old 3 feature cards
- [ ] Each card's animation triggers once on scroll into view
- [ ] Card 2's rings + bead line loop continuously
- [ ] `prefers-reduced-motion: reduce` disables all motion, content still visible
- [ ] Mobile <768: 1-col stack, horizontal dividers
- [ ] Desktop ≥1280: 3-col strip with vertical dividers
- [ ] No regressions to MeetingHero / ScrollPinnedFeatures / NumberedFeatures / integration logos / templates / testimonial / PageCTA
- [ ] All commits are small (one task = one commit, or per-fix in Task 9)
