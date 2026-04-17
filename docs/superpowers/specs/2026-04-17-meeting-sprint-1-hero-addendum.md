# Sprint 1 hero spec — Chrome extraction addendum

**Date:** 2026-04-18
**Source:** Attio Call Intelligence hero (`https://attio.com/platform/call-intelligence`) via Claude Chrome
**Parent spec:** `2026-04-17-meeting-sprint-1-hero-design.md`

This file holds the concrete values extracted from Attio's CI hero that the
parent spec left as "finalized during implementation." Tasks 7 and 8 in the
plan consume these values. Where this addendum conflicts with the parent
spec's stubs, this addendum wins.

## Material scope deltas from the parent spec

1. **Widget is substantially richer than the plan's Task 7 skeleton.** Not a simple "tabs + speaker + highlight pill + shimmer bars" card. Real structure has a video-player thumbnail, Summary section with inline keyword highlights, a "Discovery Call" dropdown pill, and a separate Insights section with static bars.
2. **No animated shimmer.** The bars are static `bg-muted` — no `shimmer` keyframe consumption. Task 1's shimmer keyframe lands in `globals.css` but stays unused for Sprint 1. Leave it in place for a future sprint.
3. **CRM backdrop has no `filter: blur()`.** Only a `mask-image` gradient fade. Parent spec §5.2 "blur(6px)" stub is overridden.
4. **Grid is 12-col with explicit column spans**, not 60/40 via `grid-cols-[60%_40%]`. Attio uses `grid-cols-12` with left column `col-[2/7]` (5 of 12 ≈ 42%) and right column `col-[7/-2]` (6 of 12 ≈ 50%) plus wide side-rail gutters. We keep the spec's 60/40 split as a simpler equivalent because our page container already bakes in `max-w-7xl` side-rails — exact 12-col mirroring is not required for parity.

## 1. CallWidget structure

### 1.1 Outer layout

- Right-column grid cell: `col-[7/-2]` inside `grid-cols-12`.
- Tablet/mobile: `max-md:h-100 max-lg:col-[2/-2] max-lg:h-120` — column spans the full width at `<lg`.
- Absolute offset wrapper inside the cell:
  - `lg:absolute lg:-top-[309px] lg:-right-12` — widget floats up and right of the nominal cell origin.
  - `max-lg:scale-90 max-md:scale-75` — downscale on narrow viewports (we'll use this for our responsive handling).

For our implementation we simplify: widget is `w-[min(416px,100%)]` placed at the top-right of the hero stage, centered on its column at `<lg`. `HeroWidgetStage` still uses `aspect-[*]` sizing to reserve layout space.

### 1.2 Soft halo frame

```tsx
<div className="relative w-[26.5rem] max-w-full rounded-2xl border-4 border-black/[0.03] p-0 backdrop-blur-xs">
  {/* inner card */}
</div>
```

- Width: `w-106` = `26.5rem` = **424 px** nominal; `w-106` is actually 424px in Tailwind v4 (`26.5rem * 16`). We use 416 px (`w-104` = `26rem`) because the halo's 4 px border absorbs the difference in Attio's DOM; verify after first render and tune if needed.
- Border: `border-4` in `oklch(0 0 0 / 0.03)` → use `border-[color:oklch(0_0_0_/_0.03)]` arbitrary utility OR add a `--halo-border` token. **Decision:** use the arbitrary utility; this is a one-off and doesn't warrant a token.
- `backdrop-blur-xs` — extremely subtle, probably imperceptible; include for fidelity.

### 1.3 Inner card

```tsx
<div className="overflow-hidden rounded-xl bg-card shadow-float">
  {/* header → video → tabs → summary → insights */}
</div>
```

- `bg-card` (maps to our `--card` token — white in light, `#27272A` in dark).
- `shadow-float` (Task 1 token) replaces Attio's 5-layer custom shadow.
- `rounded-xl`.

### 1.4 Header row

```tsx
<div className="flex items-center gap-x-2 border-b border-border px-3.5 py-3">
  <CameraIcon className="size-3.5" />
  <span className="text-[15px] font-semibold text-foreground">
    Product Demo w/ GreenLeaf
  </span>
</div>
```

- Camera icon: 14 px outline SVG, `stroke="currentColor"`. Use a simple `<svg>` inline or `lucide-react`'s `Camera` if already in deps.

### 1.5 Video player

```tsx
<div className="px-1.5 py-2">
  <div className="relative aspect-video w-full overflow-hidden rounded-[10px]">
    <video
      className="absolute inset-0 h-full w-full object-cover"
      autoPlay loop muted playsInline
      poster="/meeting-poster.jpg"
    >
      {/* optional: <source src="/meeting.mp4" type="video/mp4" /> */}
    </video>

    {/* Dark tint overlay */}
    <div className="absolute inset-0 bg-black/20" />

    {/* Timecodes + progress bar */}
    <div className="absolute inset-x-0 bottom-0 flex h-12 flex-col justify-center gap-y-1.5 px-2.5">
      <div className="flex w-full justify-between text-[10px] font-medium leading-[10px] text-white">
        <span>10:15</span>
        <span>28:14</span>
      </div>
      <div className="flex w-full items-center gap-x-1">
        {/* Segment 1 — played */}
        <div className="h-1 grow-[1] rounded-full bg-white" />
        {/* Segment 2 — current chapter with scrubber */}
        <div className="relative flex h-1 grow-[0.37] items-center rounded-full bg-white/40">
          <div className="absolute inset-y-0 left-0 w-1/2 rounded-full bg-white" />
          <div className="absolute left-1/2 size-2 -translate-x-1/2 rounded-full border-[1.5px] border-white bg-neutral-800" />
        </div>
        {/* Segments 3–6 — upcoming */}
        <div className="h-1 grow-[0.63] rounded-full bg-white/40" />
        <div className="h-1 grow-[0.37] rounded-full bg-white/40" />
        <div className="h-1 grow-[0.63] rounded-full bg-white/40" />
        <div className="h-1 grow-[0.25] rounded-full bg-white/40" />
      </div>
    </div>

    {/* Cinematic highlight wash */}
    <div className="absolute inset-0 bg-white/20 mix-blend-soft-light" />
  </div>
</div>
```

**Decision on video source:** V1 ships WITHOUT an actual video file. The `<video>` element holds a `poster` attribute pointing to a placeholder image (`/public/meeting-poster.jpg`) that we add in Task 7. Real video content is a Sprint 2+ content task. The progress bar is **purely decorative static markup** — no playback state wiring.

For V1, we may even skip the `<video>` tag entirely and render a static `<div>` with the poster as `background-image`. Implementer's call — whichever renders cleaner without layout shift.

**Segment grow ratios:** `1, 0.37, 0.63, 0.37, 0.63, 0.25`.

### 1.6 Tab chips row

```tsx
<div className="flex gap-x-1 border-b border-border px-2.5 py-2">
  {/* Active pill */}
  <div className="relative flex items-center gap-x-1.5 rounded-lg border border-border bg-muted px-1.5 py-1">
    <SparkleIcon className="size-3.5" />
    <span className="text-sm text-foreground">Insights</span>
  </div>
  {/* Inactive ghost */}
  <div className="flex items-center gap-x-1.5 px-1.5 py-1">
    <WaveformIcon className="size-3.5" />
    <span className="text-sm text-muted-foreground">Transcript</span>
  </div>
</div>
```

- Active is a pill (`rounded-lg` + bg + border), NOT an underline. Parent spec §5.3 assumed underline — overridden here.
- Icons: sparkle + waveform; use `lucide-react` equivalents (`Sparkles`, `AudioLines`) if available, else inline minimal SVGs.

### 1.7 Summary section

```tsx
<div className="flex flex-col gap-y-[1.125rem] px-4 pt-4 pb-3">
  <div className="flex items-end justify-between">
    <span className="text-[15px] font-semibold text-foreground">Summary</span>
    {/* Discovery Call pill */}
    <div className="flex items-center gap-x-1.5 rounded-lg border border-border bg-card px-1.5 py-1">
      <NoteIcon className="size-3.5" />
      <span className="text-sm text-foreground">Discovery Call</span>
      <ChevronDownIcon className="size-3.5" />
    </div>
  </div>

  <p className="text-[15px] leading-[145%] text-foreground/80">
    <span className="text-primary">Ashley</span> is the decision maker at{" "}
    <span className="text-primary">GreenLeaf</span>, looking to migrate from
    spreadsheets to Basepoint by{" "}
    <span className="text-primary">Monday</span>, with plans{" "}
    <span className="text-primary">to purchase</span> 6 seats on the Pro plan.
  </p>
</div>
```

- Blue-accented keywords use `text-primary` (our existing primary blue token).
- Summary body uses `text-foreground/80` to approximate Attio's `text-black-700` (slightly muted from full foreground).

### 1.8 Insights section (static bars, NOT shimmer)

```tsx
<div className="mb-3 flex flex-col gap-y-[1.125rem] px-4 pt-4 pb-3">
  <span className="text-[15px] font-semibold text-foreground">Insights</span>
  <div className="flex w-full flex-col gap-y-2">
    <div className="h-[9px] rounded-full bg-muted" style={{ width: "75%" }} />
    <div className="h-[9px] rounded-full bg-muted" style={{ width: "100%" }} />
    <div className="h-[9px] rounded-full bg-muted" style={{ width: "90%" }} />
    <div className="h-[9px] rounded-full bg-muted" style={{ width: "80%" }} />
  </div>
</div>
```

- **4 bars**, widths `75% / 100% / 90% / 80%`.
- `h-[9px]`, `rounded-full`, `bg-muted`.
- **No animation.** The `shimmer` keyframe + `data-shimmer` pattern from parent spec §5.3 is dropped. Task 1's keyframe stays in `globals.css` for a future sprint.

## 2. CRM-table backdrop

- **No `filter: blur()`.** Parent spec stub overridden.
- `mask-image: linear-gradient(to bottom, black 0%, black 60%, transparent 100%)` — fade the bottom third.
- Optional right-edge fade: `mask-image` composed with `linear-gradient(to right, black 0%, black 80%, transparent 100%)` via `mask-composite: intersect` (Tailwind arbitrary). Skip for V1 — single-axis fade only.
- `opacity: 0.55`.
- Positioning: absolute, behind the widget, offset so the widget's top-right overlaps the table's top-right region. Specific offsets tuned during Task 8 responsive pass.

## 3. Animations

- **Widget mount:** `type: "spring", stiffness: 220, damping: 24, mass: 0.9` — parent spec value, unchanged.
- **Video:** native `autoplay loop muted playsInline`. No framer motion on the video element itself.
- **Progress bar:** static — no animation in V1.
- **Highlight pill ("Discovery Call"):** no entry animation. Static placement.
- **Shimmer bars:** not applicable — bars are static.

## 4. Colors — mapped to landing site tokens

| Attio class | Hex | Our semantic token |
| --- | --- | --- |
| `bg-primary-background` | `#FFFFFF` | `bg-card` |
| `bg-white-300` | `#F3F4F6` | `bg-muted` |
| `border-subtle-stroke` | `#E4E7EC` | `border-border` |
| `text-primary-foreground` | `#0A0A0A` | `text-foreground` |
| `text-caption-foreground` | `#6B7280` | `text-muted-foreground` |
| `text-black-700` | `#374151` | `text-foreground/80` |
| `text-blue-450` | `#2563EB` | `text-primary` |

All rendering uses our semantic tokens — no Attio hex values leak into `.tsx` files. §9.3 grep gate satisfied.

## 5. Dictionary keys

The parent spec's `mockups.callWidget` skeleton (4 keys: `tabActive`, `tabInactive`, `speakerName`, `highlightedPhrase`) is replaced by an expanded shape. Summary copy stays inline in JSX with `TODO(brand):` markers (it's long prose with markup, dict would bloat).

New `mockups.callWidget` shape:

```json
{
  "meetingTitle": "Product Demo w/ GreenLeaf",
  "tabActive": "Insights",
  "tabInactive": "Transcript",
  "summaryTitle": "Summary",
  "highlightPillLabel": "Discovery Call",
  "insightsTitle": "Insights",
  "timeElapsed": "10:15",
  "timeTotal": "28:14"
}
```

Removed from skeleton: `speakerName`, `highlightedPhrase` (not applicable to the real widget).

### Updated `BRAND_PENDING_KEYS`

Append to `src/dictionaries/brand-pending.ts`:

```ts
"mockups.callWidget.meetingTitle",
"mockups.callWidget.tabActive",
"mockups.callWidget.tabInactive",
"mockups.callWidget.summaryTitle",
"mockups.callWidget.highlightPillLabel",
"mockups.callWidget.insightsTitle",
"mockups.callWidget.timeElapsed",
"mockups.callWidget.timeTotal",
```

Summary prose (4 blue-accent keywords + surrounding copy) stays inline as JSX with `TODO(brand):` markers — not in dict.

## 6. Consequences for the plan

- **Task 7** implementer uses this addendum's §1.3–1.8 structure, NOT the plan's skeleton code block. Implementer drops the `useState`/`useEffect` shimmer flip and the `data-shimmer` attribute. Implementer adds `meetingTitle`, progress-bar segmented markup, summary prose with inline `<span className="text-primary">` keywords, and the Discovery Call pill.
- **Task 5** dictionary shape is obsolete — `callWidget` needs to be re-updated with the 8-key shape above. This happens in Task 6 (this task) as a follow-up commit.
- **Task 1** shimmer keyframe stays in `globals.css` unused for Sprint 1.
- **Task 8** `CallWidgetDict` interface matches the 8-key shape.
