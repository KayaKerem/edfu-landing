# Meeting page — Attio Call Intelligence bento (ci-bento-3) adaptation

**Date:** 2026-04-17
**Page:** `/meeting` (`src/app/[lang]/meeting/page.tsx`)
**Source spec:** Attio `attio.com/platform/call-intelligence` — Block 2 (`ci-bento-3`), documented in `/Users/keremkaya/Desktop/firma/oil-mobile/attiomeet.md`

---

## 1. Goal

Replace the plain three-feature-card section on the meeting page (currently line 110-130, driven by `mp.featureCards` dictionary) with a pixel-faithful adaptation of Attio's `ci-bento-3` section: a 3-column bento with dotted-backdrop card art, a two-tone serif-less header, and three distinct animated visuals per card.

Localization (Turkish copy, Edfu brand swaps) is explicitly **deferred to a later pass**. V1 ships with Attio's English copy and content verbatim — including `Jamie Davies`, `Google Meet ↔ GreenLeaf`, and `Miro / Won / Outreach` — so the visual spec can be validated without copy fighting for attention.

Testimonial block (Attio Block 3, `ci-quote-a`) is **out of scope** — meeting page keeps its existing testimonial, which is shared with the main landing.

---

## 2. Context

The meeting page already follows a multi-section composition:

- `MeetingHero`
- **3 Feature Cards** (plain text cards) ← *target for replacement*
- `ScrollPinnedFeatures`
- `NumberedFeatures`
- Integration logos
- Templates
- Testimonial (shared with main screen, unchanged)
- `PageCTA`

The container in `meeting/page.tsx` already provides `max-w-7xl` side-rail borders (`border-x border-border`) and a vertical divider between sections. The new bento inherits this wrapper — it does not reintroduce its own outer border.

The existing `mp.featureCards` dictionary copy maps 1:1 to Attio's three card topics, so the dictionary content is not thrown away — it can be reinstated when localization resumes. For V1 we hardcode Attio English to match the spec precisely.

---

## 3. Scope

### In scope (V1)

- New section component `MeetingBento` with 3-card strip
- Three new mockup components, one per card
- One shared `useInView` hook
- CSS keyframe definitions in `globals.css`
- Replacement wiring in `meeting/page.tsx`
- `prefers-reduced-motion` fallback
- Responsive behavior per Attio spec §5.9

### Out of scope

- Localization / i18n (Turkish copy, brand swaps)
- Testimonial / Block 3 (`ci-quote-a`)
- Attio Blocks 4 through 10 (focus mode, connectors rail, SPICED tabs, signals, additional quote, platform grid, footer CTA)
- Attio raster backdrops (the soft "room" PNG behind Card 2) — dotted backdrop alone is sufficient
- New dictionary strings or translation work

---

## 4. Decisions

| # | Decision | Rationale |
|---|---|---|
| D1 | Replace existing 3 Feature Cards block, not append | Attio bento *is* the upgraded feature-cards experience |
| D2 | Full Attio fidelity (content + animation) for V1 | Localization is a separate pass — ship the visual target first |
| D3 | File decomposition: 1 section + 3 mockup components | Card 2's SVG alone is 100+ lines; inlining everything hurts readability |
| D4 | CSS keyframes + IntersectionObserver, no framer-motion | Matches Attio's own approach; zero new bundle weight |
| D5 | Pulse line animated as absolute overlay `<div>`, not SVG gradient | SVG `<linearGradient>` coordinates are not CSS-animatable — an overlay div with `translateY` is simpler and more performant |
| D6 | Skip raster backdrop asset for Card 2 | Dotted pattern is sufficient; no asset pipeline work |
| D7 | Dictionary `mp.featureCards` removed from page render temporarily | Copy is deferred; reintroduce during localization pass |

---

## 5. Architecture

### 5.1 Files

```
src/components/sections/meeting-bento.tsx        (new — section shell + 3 card slots)
src/components/mockups/transcript-mini.tsx       (new — Card 1 visual)
src/components/mockups/meet-crm-connector.tsx    (new — Card 2 SVG + overlay)
src/components/mockups/status-feed-mini.tsx      (new — Card 3 feed)
src/hooks/use-in-view.ts                          (new — shared IntersectionObserver hook)
src/app/globals.css                               (edit — append animation keyframes block)
src/app/[lang]/meeting/page.tsx                  (edit — swap feature-cards section for <MeetingBento />)
```

### 5.2 `MeetingBento` (section shell)

```tsx
<section className="relative">
  <header className="mx-auto max-w-7xl px-4 md:px-6 pt-16 pb-10 md:pt-20 md:pb-12 lg:pt-32 lg:pb-16 xl:pt-40 xl:pb-20">
    <h2 className="max-w-[820px] text-[32px] md:text-[48px] leading-[1.1] font-semibold tracking-[-0.015em]">
      <span className="text-foreground">From hello to handoff, every word lives in Attio.</span>{" "}
      <span className="text-muted-foreground">Search, replay, or uncover insights from any conversation.</span>
    </h2>
  </header>

  {/* Divider trick: gap-px over bg-border, cards paint bg-card */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-border p-px">
    <Card><CardArt><TranscriptMini /></CardArt><CardCopy title="Every call, every detail." body="Our native AI records, transcribes, and logs every call as you talk." /></Card>
    <Card><CardArt><MeetCrmConnector /></CardArt><CardCopy title="No more lost call notes." body="Call recordings and meeting details are automatically linked to relevant records." /></Card>
    <Card><CardArt><StatusFeedMini /></CardArt><CardCopy title="Context, not just content." body="Every conversation is instantly structured and searchable." /></Card>
  </div>
</section>
```

`Card` / `CardArt` / `CardCopy` are **file-local helpers**, not exported — they exist only to keep the section shell readable.

- `Card`: `bg-card relative` + 12-col sub-grid; content in `col-[2/-2]` with `py-16 lg:py-20 xl:py-28`
- `CardArt`: `relative aspect-square md:max-lg:aspect-[1.618] w-full mb-6` + dotted backdrop SVG pattern (unique `id="dotP-{n}"` per card)
- `CardCopy`: `flex flex-col justify-between gap-2`; `h3` uses `text-lg font-semibold tracking-tight`, `p` uses `text-sm text-muted-foreground leading-relaxed`

### 5.3 Dotted backdrop

A single inline SVG per card, `width=100% height=100%`, absolute `inset-0`, unique pattern id (`dotP-1`, `dotP-2`, `dotP-3` — SVG `<defs>` are document-scoped, duplicate ids collide). Rect fill uses `text-border/60` via `fill="currentColor"` so the pattern inherits semantic colour and adapts to dark mode automatically.

### 5.4 Integration

In `src/app/[lang]/meeting/page.tsx`:

- Delete the `<section>` spanning lines 110-130 (the 3 feature cards)
- Replace with `<MeetingBento />`
- Remove now-unused imports: no imports are currently added only for that block, so no import changes required
- `mp.featureCards` reads are removed along with the block

---

## 6. Component specs

### 6.1 `TranscriptMini` (Card 1)

A miniature "Transcript" card floating top-left inside the dotted square, occupying ~60% of the width.

**DOM:**

```tsx
<div ref={ref} data-visible={visible} className="absolute inset-0">
  <div data-animate="rise" className="absolute left-[8%] top-[10%] w-[60%] rounded-xl border border-border bg-card shadow-md">
    <div className="flex gap-4 border-b border-border px-4 pt-3">
      <button className="relative pb-2 text-[13px] font-medium text-foreground">
        ✧ Insights
        <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-foreground" />
      </button>
      <button className="pb-2 text-[13px] text-muted-foreground">│ Transcript</button>
    </div>

    <div className="space-y-1.5 p-4">
      <div className="flex items-center gap-2">
        <span className="size-5 rounded-full bg-[#8FD5A6]" aria-hidden />
        <span className="text-[13px] font-semibold">Jamie Davies</span>
      </div>
      <p className="text-[12px] leading-relaxed">
        Honestly, this looks like exactly what we need, what are{" "}
        <span data-animate="chip-pop" className="rounded px-1 py-0.5 bg-[rgba(184,169,255,0.18)] text-[#5b4cc9]">
          the next steps?
        </span>
      </p>
    </div>

    <div className="space-y-1.5 px-4 pb-4">
      <div className="flex items-center gap-2">
        <span className="size-5 rounded-full bg-[#F0B37E]" aria-hidden />
        <span className="text-[13px] font-semibold">Guy Hawkins</span>
      </div>
      <span className="block h-2 w-[96%] rounded-sm bg-[#EFEEEC]" />
      <span className="block h-2 w-[80%] rounded-sm bg-[#EFEEEC]" />
      <span className="block h-2 w-[60%] rounded-sm bg-[#EFEEEC]" />
    </div>
  </div>
</div>
```

**Animation:**
- Card root: `rise-fade` 540ms at 0ms
- Lavender pill (`the next steps?`): `chip-pop` 220ms at 120ms delay

### 6.2 `MeetCrmConnector` (Card 2)

Inline SVG, `viewBox="0 0 321 321"`, centre-anchored. Layers (bottom up):

1. Vignette gradient: `paint0_linear` — vertical white fade (`y=149.7 → y=254.95`), stops white/0 → white/1. Paints soft fade under rings so they dissolve into the dotted backdrop.
2. Outer dashed ring: `cx=160 cy=197 r=76.84`, `stroke="#CAD0D9" stroke-width="0.97" stroke-dasharray="5.84 5.84"`, fill `radial-gradient paint1_radial` (white 52% → 100%). Class: `pulse-ring-outer`.
3. Inner dashed ring: `cx=160 cy=197 r=54.47`, same stroke spec, fill `paint2_radial`. Class: `pulse-ring-inner` (runs 180° out of phase via `-1.4s` delay).
4. Base connector line: `x1=159.8 y1=118 x2=159.8 y2=165.85`, `stroke="#E4E7EC" stroke-width="1.3"`. Static.
5. **Pulse line overlay** — rendered as an absolute `<div>` *outside* the SVG but inside the same relative parent. Vertical CSS linear-gradient (stops matching `pulseGradient` spec: `#E4E7EC 0%, #94B9FF 25%, #94B9FF 75%, #E4E7EC 100%`), width `1.3px`, parent clip `overflow: hidden` sized to the line's bounding box, animation `bead-flow 2.6s linear infinite` (`translateY(-100% → 100%)`).
6. Top node (Google Meet): rendered as an **HTML overlay** (not part of the SVG) — absolute 40px white rounded square (`rounded-lg`, `shadow-md`), centred at `left: 49.8% top: 30.5%` (SVG coords `(160, 98)` expressed as % of the 321 viewBox). Icon: existing `<GoogleMeet />` from `src/components/ui/svgs/google-meet.tsx`. `data-animate="rise"`, 0ms delay.
7. Centre node (GreenLeaf): HTML overlay, absolute 44px white rounded square at `left: 49.8% top: 61.4%` (SVG coords `(160, 197)`). Icon: **new** `<GreenLeaf />` in `src/components/ui/svgs/green-leaf.tsx` — green leaf path (two simple curves) + mini lock badge overlay bottom-right. `data-animate="rise"`, 160ms delay.

> **Layout note:** Nodes and the bead overlay are HTML siblings of the SVG, not SVG children. They're positioned in percent relative to the SVG's `aspect-square` container so they track the SVG no matter the rendered size. The bead line sits at `left: 49.8%`, `top: 36.75%` (y=118/321), `height: 14.85%` (47.85/321), `width: 1.3px`, `overflow: hidden`; its child div carries the linear-gradient and `bead-flow` animation.

**Pulse gradient (for the overlay div):**
```css
background: linear-gradient(
  to bottom,
  #E4E7EC 0%,
  #94B9FF 25%,
  #94B9FF 75%,
  #E4E7EC 100%
);
```

**Animations:**
- Rings: `pulse-rings 2.8s ease-in-out infinite` (outer), `pulse-rings 2.8s ease-in-out infinite -1.4s` (inner)
- Bead overlay: `bead-flow 2.6s linear infinite`
- Nodes: `rise-fade` on in-view entry

### 6.3 `StatusFeedMini` (Card 3)

Feed card floating centre-right inside the dotted square, ~62% width, 3 rows separated by 1px `border-border`.

**Row template:**

```tsx
<div data-animate="slide-right" style={{ animationDelay: `${i * 120}ms` }} className="flex items-center gap-3 px-4 py-3">
  <span className="text-muted-foreground text-[13px]">{glyph}</span>
  <span className="inline-flex size-5 items-center justify-center rounded border border-border bg-white">
    <span className="text-[10px] font-bold text-[#F8C95B]">M</span>
  </span>
  <span className="text-[13px]">
    <strong className="font-semibold">{name}</strong>{" "}
    <span className="text-muted-foreground">{action}</span>{" "}
    {tag}
  </span>
</div>
```

**Rows:**
1. `✦` · **Miro** · _Status changed to_ · `<Pill color="green">Won</Pill>` — has `data-animate="chip-pop"` on the pill, delay 500ms
2. `◉` · **Lisa** · _had a call with_ · **Miro**
3. `↩︎` · **Miro** · _status changed to_ · `<Pill color="amber">Outreach</Pill>`

**Pills:**
- `green` (Won): text `#1F7A33`, bg `rgba(140,224,154,0.14)`, `rounded-full px-2 py-0.5 text-[12px] font-medium`
- `amber` (Outreach): text `#8A4A15`, bg `rgba(245,180,131,0.14)`, same shape

**Animations:**
- Rows: `slide-right` 420ms, stagger 120ms (0 / 120 / 240ms)
- Won pill: `chip-pop` 220ms at 500ms

---

## 7. Animation system

### 7.1 `useInView` hook

`src/hooks/use-in-view.ts` — client-only, returns `{ ref, visible }`. Sets `visible = true` on first intersection above threshold (default 0.4) and disconnects the observer. Consumers set `data-visible={visible}` on the root of their visible region.

### 7.2 CSS keyframes

Appended to `src/app/globals.css`. See Brainstorm Section C2 for full listing. Keys:

- `rise-fade` — `translateY(12px) → 0` + `opacity 0 → 1`, 540ms `cubic-bezier(.22,.61,.36,1)`
- `slide-right` — `translateX(16px) → 0` + `opacity 0 → 1`, 420ms
- `pulse-rings` — `scale(1 → 1.04 → 1)` + `opacity(.8 → 1 → .8)`, 2.8s infinite
- `bead-flow` — `translateY(-100% → 100%)`, 2.6s linear infinite
- `chip-pop` — `scale(.9 → 1.05 → 1)`, 220ms

### 7.3 Gating

- One-shot animations (`rise-fade`, `slide-right`, `chip-pop`) are gated by `[data-visible="true"] [data-animate="..."]` selectors and run `forwards`.
- Looped animations (`pulse-rings`, `bead-flow`) run unconditionally on their carrier classes.
- `@media (prefers-reduced-motion: reduce)` cancels all of the above: sets `animation: none`, `opacity: 1`, `transform: none`.

### 7.4 Per-card timing

| Card | Element | Animation | Delay |
|---|---|---|---|
| 1 | Transcript card | `rise-fade` | 0 |
| 1 | Lavender pill | `chip-pop` | 120ms |
| 2 | Google Meet node | `rise-fade` | 0 |
| 2 | Centre node | `rise-fade` | 160ms |
| 2 | Bead line | `bead-flow` | infinite |
| 2 | Outer ring | `pulse-rings` | infinite |
| 2 | Inner ring | `pulse-rings` | infinite (−1.4s) |
| 3 | Row 1 | `slide-right` | 0 |
| 3 | Row 2 | `slide-right` | 120ms |
| 3 | Row 3 | `slide-right` | 240ms |
| 3 | Won pill | `chip-pop` | 500ms |

---

## 8. Responsive

Per Attio spec §5.9:

| Breakpoint | Grid | Card art aspect | Header padding |
|---|---|---|---|
| `xl` (≥1280) | 3 col | 1 : 1 | `pt-40 pb-20` |
| `lg` (1024-1279) | 3 col | 1 : 1 | `pt-30 pb-16` |
| `md` (768-1023) | 1 col | golden (1.618) | `pt-20 pb-12` |
| `sm` (<768) | 1 col | 1 : 1 | `pt-16 pb-10` |

Dividers: vertical when `grid-cols-3`, horizontal when `grid-cols-1` — the `gap-px + bg-border` trick handles both automatically.

---

## 9. Accessibility

- Every card art container uses `aria-hidden="true"` for the decorative dotted backdrop SVG.
- Transcript mini tabs are non-interactive `<button>`s for visual fidelity — marked `tabIndex={-1}` and `aria-hidden` so they don't pollute focus or screen-reader output.
- Coloured avatar dots and placeholder row glyphs carry `aria-hidden`.
- Every decorative SVG receives `role="presentation"`.
- Real content (headlines, quote text, feed row text) is rendered in readable DOM order and is not role-hidden.
- `prefers-reduced-motion` is respected (see §7.3).

---

## 10. Open items / follow-ups

- **Localization pass:** swap Attio English copy for `mp.featureCards` Turkish content + Edfu brand adjustments (ikonlar, firma/kişi isimleri). New sub-spec when we pick this up.
- **Dark-mode sampling:** hardcoded hex colours (`#8FD5A6`, `#F0B37E`, `#EFEEEC`, `#5b4cc9`, `#F8C95B`, pill colours) preserve Attio's look exactly — acceptable for V1. During localization, migrate to semantic tokens where possible.
- **Card 2 raster backdrop:** Attio's soft grey "room" PNG is skipped. If it's missed in visual review, we can add it later as a `next/image` underneath the SVG.
- **Re-enter animations:** V1 plays animations once per page load (observer disconnects on first entry). If stakeholders want replay on re-scroll, change `useInView` to not disconnect.

---

## 11. Acceptance criteria

- `/meeting` renders 3 bento cards with dotted backdrops, header copy, and divider lines between cards at `lg`+
- Card 1: mini transcript card appears with Jamie/Guy content, lavender highlight pill visible
- Card 2: Google Meet and GreenLeaf nodes connected by a line with a visible travelling blue band; two dashed rings breathing around the bottom node
- Card 3: three feed rows with Miro logo, "Won" green pill and "Outreach" amber pill visible
- Section replaces (not stacks on top of) the previous 3 feature cards — old block no longer in DOM
- Desktop ≥1280 matches Attio reference screenshot at headline / card spacing / pill colours within 2-3px
- Mobile <768 stacks to 1 column, dividers become horizontal, golden ratio *not* used (goes back to 1:1)
- On systems with `prefers-reduced-motion: reduce`, no animation runs; content is visible immediately
- No regressions on other sections of `/meeting` (MeetingHero, ScrollPinnedFeatures, NumberedFeatures, integration logos, templates, testimonial, PageCTA)
- Type-check and lint clean; no new runtime warnings in browser console
