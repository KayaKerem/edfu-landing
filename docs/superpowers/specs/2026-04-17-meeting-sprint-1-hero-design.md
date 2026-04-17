# Meeting Sprint 1 — Hero + shared primitives design

**Date:** 2026-04-17
**Sprint:** 1 of 3 (see `docs/superpowers/specs/2026-04-17-meeting-redesign-roadmap.md`)
**Page:** `/meeting` (`src/app/[lang]/meeting/page.tsx`)
**Reference:** Attio Call Intelligence hero (`attio.com/platform/call-intelligence`) — extracted via Claude Chrome during implementation for pixel-perfect parity
**Branch strategy:** `feat/meeting-redesign-sprint-1` branched off `feat/multipage-pivot`

---

## 1. Goal

Replace the current centered single-column meeting hero with a 60/40 two-column layout (CRM-table backdrop + floating product-demo widget on the right, headline + multi-CTA group on the left) that matches Attio's Call Intelligence hero 1:1. Ship the shared primitives (`DottedBackdrop` component + full CSS token set) that Sprints 2 and 3 will consume.

V1 ships with Attio's English placeholder copy; Turkish / Edfu brand swap is deferred to the post-Sprint-3 brand and localization pass. All placeholder strings are tagged `// TODO(brand):` per project convention.

---

## 2. Context

### 2.1 Current meeting hero

`src/components/sections/meeting-hero.tsx` is a centered, single-column hero: badge → `<h1>` → subhead → two mockups side-by-side (`MeetingList`, `CallPlayer`). No CTA buttons — the only CTAs on `/meeting` are at the `PageCTA` section far below. The hero has a radial green-tinted gradient backdrop (`oklch(0.55 0.15 155)`), rounded bottom corners, and a border line.

### 2.2 Why this sprint exists

Per the redesign roadmap, Sprint 1's job is to ship the above-fold experience plus the shared visual primitives that Sprints 2 and 3 depend on. Hero and bento sit in the same visual band; extracting the dotted-backdrop utility while we only have two consumers (bento today, hero shortly) prevents drift once Sprints 2 and 3 each introduce new sections that want the same pattern.

### 2.3 What is NOT in scope

- `MeetingBento` polish (diagonal-stripe decorative edges, divider weight tuning) — deferred indefinitely; bento reads as intended today.
- Dark-mode removal from the landing — other developers are concurrently editing non-meeting pages; cross-cutting changes risk merge conflicts. Decision deferred to post-Sprint-3 brand/polish pass.
- Turkish copy / Edfu brand swap — deferred to brand pass. V1 uses Attio English placeholders tagged `// TODO(brand):`.
- Any change to `ScrollPinnedFeatures`, `NumberedFeatures`, integration logos section, templates section, testimonial, or `PageCTA`.
- Changes to any page other than `/meeting`.
- Content changes to `MeetingBento` (the shipped component). Bento is modified only to import the extracted `DottedBackdrop` instead of defining its own.

---

## 3. Scope

### 3.1 In scope (V1)

- New `MeetingHero` internal layout (60/40 two-column at `md`+, single-column at `<md`).
- New mockup component: `CallWidget` — the floating product-demo widget; final composition comes from Chrome extraction of Attio CI hero during implementation.
- New shared primitive: `DottedBackdrop` in `src/components/ui/dotted-backdrop.tsx`; `MeetingBento` migrates to import it.
- New CSS tokens in `src/app/globals.css` (full list below, even tokens Sprint 1 does not consume).
- Hero CTA button group: one primary + two ghost buttons. Labels are Attio English placeholders with `// TODO(brand):` markers.
- Dictionary updates to `src/dictionaries/tr.json` and `src/dictionaries/en.json` adding `meetingPage.hero` keys for the new strings, plus a new `src/dictionaries/brand-pending.ts` companion file listing keys awaiting brand-pass swap (see §5.6).
- `prefers-reduced-motion` respect for spring-mount (via `motion/react`) and shimmer (via `@media` in `globals.css`).
- Responsive pass: 320 / 768 / 1024 / 1280 / 1920 px.
- A11y pass: keyboard tab order, focus rings, widget `aria-hidden`, Lighthouse ≥ baseline.

### 3.2 Out of scope

See §2.3. Also explicitly not in scope:

- Introducing `MotionConfig` globally in `src/app/[lang]/layout.tsx`. Hero-local `MotionConfig reducedMotion="user"` wrapping is sufficient for Sprint 1.
- `--accent-blue-hover` token. YAGNI; Sprint 1 does not consume it, Sprint 2 can introduce if needed.
- IntersectionObserver for widget mount animation. Widget is above-fold; `motion/react` `initial/animate` is enough. IntersectionObserver is still used inside `CallWidget` if internal pieces (shimmer) need viewport-gated timing, but not for the widget-level mount.
- Modifying `CrmTable` to eliminate its hardcoded `bg-white dark:bg-[#27272A]` shell. The hero backdrop may override the shell's decorations via a local wrapper (`[&>*]:…` utilities) without touching `CrmTable` itself (§5.2), which avoids the cross-page risk of editing a shared mockup.
- Bento §3.2 "tidy" items (diagonal-stripe edge detail, divider weight tuning). Roadmap §Sprint 1 `⚠️ Tidy` bullet marks these as optional, conditional on the current bento not reading as intended. Current bento renders correctly at 1440px+; tidy dropped per the roadmap's own "if inspection shows the current … already reads as intended, the tidy is dropped" clause.

---

## 4. Decisions

### 4.1 Hero layout — 60/40 two-column at `md`+, inside the container side-rails

`/meeting` wraps its main column in `<div className="relative mx-auto max-w-7xl border-x border-border">` with two 1-pixel side-rails at `left-4 md:left-6` and `right-4 md:right-6`. Hero lives inside that container and respects the rail inset — content does not sit flush against the rails.

**Structural rule:** the hero `<section>` has its own horizontal padding (`px-4 md:px-6`) matching the rail inset. The 60/40 grid is declared inside a wrapper that already has that padding, so the 60/40 split percentages are of the padded inner width, not the outer container. This matches the bento's `mx-auto max-w-[calc(100%-32px)] md:max-w-[calc(100%-48px)]` inset pattern in spirit (clear of the rails) while using the simpler `px-*` shorthand because the hero is a single grid, not a multi-card strip.

**Breakpoint rules:**

- `<md` (<768 px): single column, full-width within padding. Left-column content stacks on top, widget below. Below 360 px the widget stage is hidden (see §4.1.1) — narrow-phone treatment is headline + subhead + CTAs only.
- `≥md`: `grid grid-cols-[60%_40%] gap-8 md:gap-12` inside the padded wrapper. Left content + CTA group on the left, `HeroWidgetStage` on the right.

**Why `md` and not `lg`:** the widget + CRM-table layered composition does not read cleanly at 768–1023 px; squeezing both into a narrow split degrades the layered effect. Mobile and tablet share the single-column treatment; laptop and up get the two-column experience.

### 4.1.1 Narrow-phone widget hide (<360 px)

At viewports narrower than 360 px the floating widget does not scale legibly — shimmer bars crowd, speaker row truncates. Rule: hide the entire `HeroWidgetStage` with `hidden xs:block` (where `xs` is defined at 360 px via a Tailwind `screens` extension, OR via an inline media query if that extension feels heavy). Hero keeps headline + subhead + CTAs so the page still communicates. No a11y content loss because the widget is `aria-hidden`.

### 4.2 Floating widget — new `CallWidget` mockup

Sprint 1 creates a new mockup component rather than reusing `CallPlayer` or `TranscriptMini`. Reason: 1:1 parity with Attio CI hero is the sprint's goal, and the existing mockups are composed for other contexts. Exact internal composition (speaker row, ✦ Insights chip, shimmer bars count and widths, avatar placement) is frozen during implementation via Chrome extraction. The component accepts a dictionary prop so brand-pass copy swaps land in one place.

### 4.3 CTA button group — one primary + two ghost, Attio English placeholders

Three buttons arranged left-to-right in the tab order. Primary uses shadcn `<Button>` default variant; secondary and tertiary use `variant="ghost"`. Hrefs are live production targets (`https://app.edfu.ai`, `/pricing`, `#contact`), only the labels are placeholders. Every label string carries `// TODO(brand):` so the brand pass can grep.

### 4.4 Dark mode — semantic tokens + acceptance-gated verify, no hero-specific fork

Hero relies on existing semantic tokens (`bg-card`, `bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`) for automatic dark-mode adaptation. New tokens that need a dark fork (`--pattern-dot`, `--pattern-dash-border`, `--accent-blue`, `--shadow-float`) get explicit `.dark { ... }` overrides in `globals.css`. Hero does not introduce any `dark:` Tailwind prefix. Final dark-mode fidelity is a sprint-close visual walkthrough gate, not a per-component QA task.

Rationale: other developers are editing non-meeting pages in parallel; removing dark mode project-wide would conflict with their in-flight work. Per-hero dark fork adds surface area for little gain. Semantic-token discipline is the existing project convention.

### 4.5 Shared primitive — `DottedBackdrop` component with `useId` internally

Extracted from `MeetingBento` to `src/components/ui/dotted-backdrop.tsx`. API:

```tsx
interface DottedBackdropProps {
  className?: string;
  tileSize?: number; // px, default 10
}
```

`patternId` is generated internally via `useId()` so callers don't need to coordinate. Color is driven by the CSS variable `--pattern-dot` (dark-mode-aware). `MeetingBento` migrates in the same sprint — its local `DottedBackdrop` function is deleted, the new component is imported, and the `patternId` prop is removed from call sites.

### 4.6 CSS tokens — full roadmap set in Sprint 1

All roadmap-specified tokens are defined in Sprint 1, even those no Sprint 1 component consumes. This satisfies the roadmap's acceptance gate ("all PRD-specified CSS tokens are present and referenced by the hero [even if some are consumed later]") and prevents Sprint 2 and Sprint 3 brainstorms from relitigating naming.

**Two-step declaration pattern** (matches existing `globals.css` convention):

1. Declare raw OKLCH / shadow values in `:root` and `.dark` blocks.
2. For tokens that should also generate Tailwind utilities (`bg-*`, `shadow-*`), re-export inside the `@theme inline` block with the required prefix (`--color-*` for colors, `--shadow-*` for shadows).

Motion tokens (`--dur-*`, `--ease-*`) stay as raw vars only — they are consumed via `var()` in CSS animation shorthands and via inline `style` props in framer JSX, so no Tailwind utility is needed.

| Token | Type | Dark fork | `@theme inline` alias | Generates utility | Sprint 1 consumer |
| --- | --- | --- | --- | --- | --- |
| `--pattern-dot` | color | yes | `--color-pattern-dot` | `bg-pattern-dot`, `text-pattern-dot` | `DottedBackdrop` (via `text-pattern-dot` + `currentColor` fill) |
| `--pattern-dash-border` | color | yes | `--color-pattern-dash-border` | `border-pattern-dash-border` | none (Sprint 3 reserve) |
| `--surface-hero` | color (alias of `--card`) | via `--card` | `--color-surface-hero` | `bg-surface-hero` | hero section background |
| `--text-fade` | color | no (neutral) | `--color-text-fade` | `text-text-fade` | none (Sprint 2/3 reserve) |
| `--accent-blue` | color | yes | `--color-accent-blue` | `bg-accent-blue`, `text-accent-blue` | none (Sprint 2 reserve) |
| `--shadow-float` | shadow | yes | `--shadow-float` (already prefixed) | `shadow-float` | `CallWidget` |
| `--dur-xs` / `--dur-sm` / `--dur-md` / `--dur-lg` | duration | no | no alias (raw var only) | no utility | hero animations |
| `--ease-out` / `--ease-spring` | easing | no | no alias (raw var only) | no utility | hero animations |

**`--pattern-dot` initial value** is tuned so the `MeetingBento` migration is visually no-op. The bento today uses `text-border/60` (border color at 60% alpha). Initial `--pattern-dot` light-mode value is therefore `oklch(0.9317 0.0118 231.6594 / 0.6)` (matches `--border` at 60% alpha); dark-mode is `oklch(0.269 0 0 / 0.6)`. Any further visual tuning comes after bento parity is confirmed.

Remaining placeholder OKLCH values are sane defaults; final values are tuned during implementation from Chrome extraction. Value tuning later is a pure CSS edit with no component impact.

### 4.7 Motion — framer-motion spring-mount, CSS play-once shimmer

**Widget mount:** `motion/react` `<motion.div>` with `initial={{ opacity: 0, scale: 0.94, y: 12 }}` and a spring transition (`stiffness: 220, damping: 24, mass: 0.9` as starting values; tuned during implementation). Triggered by mount, not IntersectionObserver — hero is above-fold.

**Shimmer bars:** Play-once on mount via React `useState` + CSS `@keyframes shimmer` bound to a `data-shimmer="true"` attribute. After ~1.4s the attribute flips to `false` and the bars sit in a static `var(--muted)` state. CPU cost is bounded, no infinite loop.

**Hero text entry:** The current `motion.div` staggered rise-fade pattern (`0.1, 0.2, 0.3, 0.4` s delays with `[0.2, 0, 0, 1]` easing) is preserved verbatim. No new keyframe.

**Reduced motion:** `MotionConfig reducedMotion="user"` wraps the hero subtree so framer-motion honors the user's `prefers-reduced-motion` OS preference. When the preference is set, framer collapses transform / scale transitions to near-instant but preserves opacity transitions so nothing renders invisible. When the preference is NOT set, `reducedMotion="user"` is a passthrough — the spring runs at full strength. The existing global `@media (prefers-reduced-motion: reduce)` block in `globals.css` (lines 188–195) already forces `animation-duration: 0.01ms` on every element, so the shimmer keyframe is killed without a shimmer-specific override. No new `@media` block is required.

**No `@keyframes spring-mount` is added.** The roadmap's Sprint 1 primitive bullet suggested a new CSS keyframe might be needed if existing keyframes + IntersectionObserver didn't cover the widget mount; framer-motion's spring transition replaces that keyframe entirely. Hero-text staggered entry continues to use the existing `rise-fade` / motion `initial/animate` pattern.

### 4.8 A11y — widget is decorative, headline is one `<h1>`

The hero `<h1>` wraps two `<span>` children (primary + muted-fade split) to keep document outline clean. The entire `HeroWidgetStage` (backdrop + widget) carries `aria-hidden="true"` — it is a decorative visual, no information is lost to screen-reader users. CTA buttons are native elements with default focus-visible rings. Tab order is primary → secondary → tertiary, enforced by source order.

---

## 5. Component architecture

### 5.1 `MeetingHero` (rewrite)

`src/components/sections/meeting-hero.tsx`, `"use client"`.

```tsx
interface MeetingHeroProps {
  dict: {
    badge: string;
    headlinePrimary: string;
    headlineMuted: string;
    subhead: string;
    ctaPrimary: string;
    ctaSecondary: string;
    ctaTertiary: string;
  };
  mockupsDict: {
    crmTable: Parameters<typeof CrmTable>[0]["dict"];
    callWidget: Parameters<typeof CallWidget>[0]["dict"];
  };
}
```

Top-level structure:

```tsx
<section className="relative overflow-hidden px-4 md:px-6 pt-32 sm:pt-40 pb-16">
  <MotionConfig reducedMotion="user">
    <div className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-8 md:gap-12">
      {/* Left column */}
      <div>
        <motion.div>Badge</motion.div>
        <motion.h1>
          <span>{dict.headlinePrimary}</span>{" "}
          <span className="text-muted-foreground">{dict.headlineMuted}</span>
        </motion.h1>
        <motion.p>{dict.subhead}</motion.p>
        <motion.div className="cta-group">
          <Button>{dict.ctaPrimary}</Button>
          <Button variant="ghost">{dict.ctaSecondary}</Button>
          <Button variant="ghost">{dict.ctaTertiary}</Button>
        </motion.div>
      </div>
      {/* Right column */}
      <HeroWidgetStage crmTableDict={...} callWidgetDict={...} />
    </div>
  </MotionConfig>
</section>
```

### 5.2 `HeroWidgetStage` (new leaf component)

Kept separate from `MeetingHero` for two reasons: keeps the motion concerns co-located on the widget, and gives Sprint 2's scroll stage a pattern to copy. Internal to `meeting-hero.tsx` (not its own file) unless it grows past ~80 lines.

**Compositing treatment for the CRM-table backdrop:**

The backdrop is the existing `CrmTable` mockup rendered behind the widget and de-emphasized so the widget floats visually on top. The treatment uses three CSS techniques combined:

1. **`filter: blur(…)`** — initial value `blur(6px)` (tuned during extraction).
2. **`opacity: …`** — initial value `0.55` (tuned during extraction).
3. **`mask-image: linear-gradient(to bottom, black 0%, black 50%, transparent 100%)`** — vertical fade-to-transparent at the bottom, so the CRM-table does not collide with the page edge. Horizontal clipping is handled by the parent section's `overflow-hidden`.

The `CrmTable` component currently has its own card shell (`rounded-2xl border border-border bg-white dark:bg-[#27272A] shadow-lg`). In the hero backdrop context the shell styling shows through the blur as a slightly awkward floating card. Two acceptable approaches, to be decided during implementation after visual inspection:

- **Accept the card shell** — the blur softens edges enough that the card feel works as backdrop.
- **Wrap in a container that visually overrides** — apply `[&>*]:shadow-none [&>*]:border-0 [&>*]:rounded-none` to the backdrop wrapper to strip the CrmTable shell's decorations. This does not modify `CrmTable` itself (no cross-page impact) — it's a one-directional CSS override local to the hero stage.

**Extraction-time deliverables** (Chrome extraction of Attio CI hero must produce these values to replace the initial guesses):

- Exact `blur(…)` px value.
- Exact `opacity` value.
- `mask-image` gradient stops (may be different — top fade, bottom fade, both).
- Whether the card shell is stripped (decision between the two approaches above).
- Whether the backdrop extends full-height of the right column or crops at a specific offset.

Code sketch (initial structural stub — Chrome extraction finalizes values):

```tsx
function HeroWidgetStage({ crmTableDict, callWidgetDict }: HeroWidgetStageProps) {
  return (
    <div
      className="relative aspect-square md:aspect-[4/5] lg:aspect-[5/6] overflow-hidden"
      aria-hidden="true"
    >
      {/* Layer 1: CRM-table backdrop — blurred, faded, masked */}
      <div
        className="absolute inset-0 opacity-55 [filter:blur(6px)] [mask-image:linear-gradient(to_bottom,black_0%,black_50%,transparent_100%)]"
      >
        <CrmTable dict={crmTableDict} />
      </div>
      {/* Layer 2: floating widget */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center shadow-float"
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 24, mass: 0.9 }}
      >
        <CallWidget dict={callWidgetDict} />
      </motion.div>
    </div>
  );
}
```

**Current hero's radial-gradient backdrop is removed.** `src/components/sections/meeting-hero.tsx:23–29` today contains an absolutely-positioned `radial-gradient(... oklch(0.55 0.15 155) 100%)` backdrop with `rounded-b-2xl border-b`. The rewrite deletes that layer entirely — the new hero background is the standard `bg-background`. The `oklch(0.55 0.15 155)` raw-value usage on that old backdrop is the reason the grep-for-OKLCH-in-hero gate (§9) can reliably start from zero matches post-rewrite.

### 5.3 `CallWidget` (new)

`src/components/mockups/call-widget.tsx`.

```tsx
interface CallWidgetProps {
  dict: {
    tabActive: string;
    tabInactive: string;
    speakerName: string;
    highlightedPhrase: string;
    // additional fields as revealed by Chrome extraction — ALL added to BRAND_PENDING_KEYS
  };
  className?: string;
}
```

**Locked structural commitments** (independent of what Chrome extraction reveals for exact values):

- The widget **contains shimmer bars**. This is a contract with §4.7's motion mechanism — the shimmer play-once + `data-shimmer` attribute + CSS keyframe all exist because the widget has bars. Bar count and exact widths come from extraction; presence is fixed.
- The widget uses `shadow-float` (Tailwind utility generated from `--shadow-float`) as its outermost box-shadow.
- The widget is dictionary-driven — all user-facing strings come from `dict`, no hardcoded literals inside the JSX.
- The widget has a top-level `<div>` with `aria-hidden` omitted (the parent `HeroWidgetStage` already carries `aria-hidden="true"` at the boundary, so the widget internals inherit the hidden state).

**Deferred to Chrome extraction:**

- Exact DOM structure (how many chips, ordering of speaker row vs. bars, presence of a secondary footer / chip stack).
- Bar count, bar widths (e.g. 96% / 80% / 60% à la bento Card 1, or different percentages), bar heights, bar corner radius.
- Chip styling (tabs with underline, or pill-shaped toggles).
- Avatar treatment (colored dot, initial, image).
- Highlight pill color and copy (may match bento's lavender `rgba(184,169,255,.18)` or be different).
- Precise typography sizes of the inner strings.
- Whether the widget has a header, footer, or both.

Extraction output is committed as a short addendum to this spec (or inline in the implementation PR) before the widget is built — so the plan phase can see the final structure.

### 5.4 `DottedBackdrop` (new shared primitive)

`src/components/ui/dotted-backdrop.tsx`.

`DottedBackdrop` is a server component by default — `useId` is SSR-safe in React 18+, and the existing `MeetingBento` already calls `useId` as a server component. No `"use client"` directive is needed.

```tsx
interface DottedBackdropProps {
  className?: string;
  tileSize?: number;
}
export function DottedBackdrop({ className, tileSize = 10 }: DottedBackdropProps) {
  const patternId = useId();
  return (
    <svg aria-hidden="true" role="presentation" className={cn("absolute inset-0 h-full w-full text-[var(--pattern-dot)]", className)}>
      <defs>
        <pattern id={patternId} width={tileSize} height={tileSize} patternUnits="userSpaceOnUse">
          <rect width="1" height="1" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
```

### 5.5 `MeetingBento` migration

Delete the local `function DottedBackdrop` (`src/components/sections/meeting-bento.tsx` lines ~6–26). Import the new shared component. Remove the `patternId` prop from every `CardArt` call site — the shared component generates its own id via `useId`.

### 5.6 Dictionary shape

Dictionaries are **JSON files** (`src/dictionaries/en.json`, `src/dictionaries/tr.json`), loaded via dynamic import in `src/dictionaries/index.ts`. JSON does not permit inline comments, so `// TODO(brand):` markers cannot be inlined in the value. Instead we use a **hybrid convention:**

**Where brand-pending strings live:**

- Keys whose values swap during the brand pass (hero copy, CTA labels, any Attio placeholder string we own) stay in `en.json` / `tr.json` as regular string values. Both files carry the English placeholder for V1 — no Turkish translation yet.
- A new companion file `src/dictionaries/brand-pending.ts` exports a typed list of dot-path keys that need swapping. Brand pass uses this file as the single source of truth for what to translate.

```ts
// src/dictionaries/brand-pending.ts
// Keys listed here hold Attio English placeholder copy that will be swapped
// during the post-Sprint-3 brand/localization pass.
export const BRAND_PENDING_KEYS = [
  "meetingPage.hero.badge",
  "meetingPage.hero.headlinePrimary",
  "meetingPage.hero.headlineMuted",
  "meetingPage.hero.subhead",
  "meetingPage.hero.ctaPrimary",
  "meetingPage.hero.ctaSecondary",
  "meetingPage.hero.ctaTertiary",
  // CallWidget dict keys added here once extraction finalizes
] as const;
```

**JSON update shape** for both `en.json` and `tr.json` under `meetingPage.hero`:

```json
"hero": {
  "badge": "Live",
  "headlinePrimary": "Smarter meetings,",
  "headlineMuted": "from start to finish.",
  "subhead": "Automatic recording, transcription, action items.",
  "ctaPrimary": "Start for free",
  "ctaSecondary": "Book a demo",
  "ctaTertiary": "View pricing"
}
```

**For hardcoded placeholder copy inside JSX** (for example, `CallWidget` mockup strings that are visual-only and not locale-aware), continue to use the existing inline `// TODO(brand):` comment convention next to the literal.

**Migration for existing `meetingPage.hero` keys:** The current `hero` object has `badge`, `title`, `description`. These are replaced by the new shape above. `title` becomes `headlinePrimary` + `headlineMuted`, `description` becomes `subhead`. Old key-reading code in `meeting-hero.tsx` disappears with the rewrite.

---

## 6. Data flow

Pure dictionary-driven, no state outside component boundaries.

- `/meeting/page.tsx` loads `dict = getDictionary(lang)`, passes `dict.meetingPage.hero` and `dict.mockups.{crmTable, callWidget}` into `<MeetingHero>`.
- `MeetingHero` destructures into `HeroWidgetStage` → `CrmTable` + `CallWidget`.
- Motion state is component-local (`useInView` ref for shimmer, framer's internal state for spring-mount). No shared context.

---

## 7. Error handling

Not applicable. This is a server-rendered marketing surface with no runtime data fetching, no user input, no network calls. The only runtime concerns are:

- Missing dictionary key → caught at build time by TypeScript.
- `useId` SSR mismatch → prevented by keeping `DottedBackdrop` a `"use client"` component (or by relying on React 18's `useId` being SSR-safe, which it is).

---

## 8. Testing

No new unit tests. Verification is manual + automated project-wide checks:

- `npm run lint` clean.
- `npm run build` succeeds; `/meeting` bundle size increases by less than 8 KB gzipped versus the `feat/meeting-redesign-sprint-1` branch-start baseline.
- TypeScript (`tsc --noEmit`) clean.
- Manual: 320 / 768 / 1024 / 1280 / 1920 px responsive pass in Chrome DevTools.
- Manual: dark-mode toggle round-trip; hero + widget read correctly.
- Manual: reduced-motion via DevTools Rendering panel; shimmer static, spring-mount degrades.
- Manual: keyboard-tab order hits primary → secondary → tertiary.
- Manual: Lighthouse accessibility on `/meeting` ≥ baseline (target: 100).

---

## 9. Acceptance gates

1. `MeetingHero` layout correct at 320, 768, 1024, 1280, 1920 px. Column wrap at `md` (768). At <360 px the widget stage is hidden; hero still shows headline + subhead + CTAs.
2. `prefers-reduced-motion: reduce` kills shimmer (existing global `animation-duration: 0.01ms` override in `globals.css:188-195` is sufficient; no shimmer-specific `@media` block is added). Framer's `reducedMotion="user"` wrapper degrades transforms; **widget is visible (opacity 1) at first paint when reduced-motion is enabled** — explicitly verified in Chrome DevTools Rendering panel.
3. No hardcoded hex / rgb / oklch **raw values** in new hero files. Grep: `grep -nE '#[0-9a-fA-F]{3,8}|rgb\(|oklch\(' src/components/sections/meeting-hero.tsx src/components/mockups/call-widget.tsx src/components/ui/dotted-backdrop.tsx` returns zero matches. Token references via `var(--…)` and Tailwind utility classes (`bg-*`, `text-*`) are allowed.
4. No `dark:` Tailwind prefix usage in new hero files. Grep: `grep -n 'dark:' src/components/sections/meeting-hero.tsx src/components/mockups/call-widget.tsx src/components/ui/dotted-backdrop.tsx` returns zero matches.
5. Dark-mode hero + widget visually acceptable at sprint-close walkthrough. **Note:** inherited dark-mode hardcoded pairs in `CrmTable` (`bg-white dark:bg-[#27272A]` at `src/components/mockups/crm-table.tsx:21`) may show through the blurred backdrop; this is pre-existing debt, not a Sprint 1 blocker.
6. `DottedBackdrop` lives at `src/components/ui/dotted-backdrop.tsx`; `MeetingBento` imports it; no `function DottedBackdrop` remains in `meeting-bento.tsx`. Grep: `grep -n 'function DottedBackdrop' src/` returns exactly one match (inside `src/components/ui/dotted-backdrop.tsx`).
7. `MeetingBento` rendering is a visual no-op after migration — before/after comparison in dev server shows pixel-identical bento. `--pattern-dot` initial value tuned to match the old `text-border/60` appearance (see §4.6).
8. All roadmap tokens present in `globals.css`: `--pattern-dot`, `--pattern-dash-border`, `--surface-hero`, `--text-fade`, `--accent-blue`, `--shadow-float`, `--dur-xs`, `--dur-sm`, `--dur-md`, `--dur-lg`, `--ease-out`, `--ease-spring`. Corresponding `@theme inline` aliases exist for tokens that should generate Tailwind utilities (see §4.6 table).
9. `/meeting` bundle size increase under 8 KB gzipped vs branch-start baseline. Measure via `npm run build` output (Next.js default reports First Load JS; gzipped size is shown alongside). If extraction inflates the widget beyond budget, flag in sprint-close review.
10. `BRAND_PENDING_KEYS` in `src/dictionaries/brand-pending.ts` lists every new hero key + every new `CallWidget` key that holds placeholder copy. Count range: 7–15 entries (7 locked hero keys; CallWidget contributes 0–8 more depending on extraction). Every listed key has the same English placeholder value in both `en.json` and `tr.json`.
11. Keyboard tab order on hero CTAs is primary → secondary → tertiary.
12. Lighthouse accessibility score on `/meeting` ≥ baseline (target: 100).
13. `npm run lint` clean.
14. `tsc --noEmit` clean. New `meetingPage.hero` keys are typed-reachable from `meeting/page.tsx` call sites via the `Dictionary` type.

---

## 10. Open risks

- **Widget content delta.** The widget composition in this spec (Jamie-style speaker row + ✦ Insights chip + shimmer bars) is indicative. Chrome extraction may reveal a different Attio CI hero widget (live caption carousel, audio waveform, action-item list). Plan-phase first task is the extraction; this spec's widget internals are non-binding.
- **Mobile widget legibility.** At 320 px the widget + CRM backdrop composition may not read. If extraction reveals the widget can't scale below 360 px cleanly, the plan can add a mobile-hidden fallback (hero shows text + CTAs only on `<sm`).
- **`--accent-blue` OKLCH placeholder.** The value `oklch(0.62 0.17 248)` is a sane default, not extracted. When Sprint 2 consumes it, tone mismatch is a one-line CSS change.
- **Container side-rail interaction** — resolved in §4.1. Hero uses `px-4 md:px-6` inset matching the container rails; 60/40 grid is of the padded inner width. Implementation verifies at 320 / 768 / 1024 / 1280 / 1920 px; no further design decision pending.
- **Bento migration regression.** `DottedBackdrop` extraction touches `meeting-bento.tsx`. Migration commit is atomic and reversible via `git revert` if visual regression is found in the walkthrough.

---

## 11. Implementation order (suggested for plan phase)

The writing-plans skill decides the final decomposition. This is a preview. Task count has grown from the roadmap's original 6–9 estimate to ~12–14 because the spec locks decisions (JSON dictionary mechanism, `@theme inline` aliasing, CRM-backdrop treatment) that the roadmap left open. This may push the sprint toward the upper end of the roadmap's 1.5–3 day estimate.

1. Add CSS tokens to `globals.css` — raw values in `:root` / `.dark`, aliases in `@theme inline`. Includes the bento-parity `--pattern-dot` value.
2. Create `src/dictionaries/brand-pending.ts` with initial key list (hero keys only; widget keys appended after extraction).
3. Extract `DottedBackdrop` to `src/components/ui/dotted-backdrop.tsx`.
4. Migrate `MeetingBento` to consume the shared `DottedBackdrop`; dev-server before/after check for bento visual no-op.
5. Chrome extraction: Attio CI hero widget composition, colors, animation details, CRM-backdrop treatment values. Commit extraction notes as a spec addendum.
6. Implement `CallWidget` mockup from extraction.
7. Add new `meetingPage.hero` keys to `en.json` and `tr.json` (Attio English placeholder in both). Append any new CallWidget dict keys. Update `BRAND_PENDING_KEYS`.
8. Rewrite `MeetingHero` layout (60/40 grid inside rail-inset padding + CTA group + existing badge/headline/subhead motion).
9. Compose `HeroWidgetStage` inside `MeetingHero` (CRM-table backdrop + floating widget + `MotionConfig` wrapper).
10. Wire motion: spring-mount on widget, play-once shimmer via `data-shimmer` attribute + `setTimeout` flip + CSS `@keyframes shimmer`.
11. Wire page: update `src/app/[lang]/meeting/page.tsx` to pass `crmTable` + `callWidget` mockup dicts into `MeetingHero` (currently passes `meetingList` + `callPlayer`).
12. Responsive pass at 320 / 360 / 768 / 1024 / 1280 / 1920 px. Confirm widget hides below 360 px.
13. A11y pass (keyboard tab order, widget `aria-hidden`, `<h1>` structure) + Lighthouse.
14. Bundle-size check; sprint-close visual walkthrough with user (light + dark).

---

## 12. Post-sprint follow-ups (not part of Sprint 1)

- Decide dark-mode fate (kept or removed from landing) — consolidated into the post-Sprint-3 brand/polish pass to avoid teammate merge conflicts.
- Sprint 2 brainstorm against PRD §3.3 (sticky scroll-locked stage). Sprint 2 consumes `DottedBackdrop`, `--shadow-float`, `--dur-*`, `--ease-*`.
- Sprint 3 brainstorm against PRD §3.4–§3.9. Sprint 3 consumes `--pattern-dash-border`, `--accent-blue`, `--text-fade`.
- Brand and localization pass after Sprint 3 closes: grep for `TODO(brand):`, swap all placeholder copy for Edfu/Turkish assets.
