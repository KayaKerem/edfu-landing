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
- Dictionary updates to `src/dictionaries/tr.ts` and `src/dictionaries/en.ts` adding `meetingPage.hero` keys for the new strings.
- `prefers-reduced-motion` respect for spring-mount (via `motion/react`) and shimmer (via `@media` in `globals.css`).
- Responsive pass: 320 / 768 / 1024 / 1280 / 1920 px.
- A11y pass: keyboard tab order, focus rings, widget `aria-hidden`, Lighthouse ≥ baseline.

### 3.2 Out of scope

See §2.3. Also explicitly not in scope:

- Introducing `MotionConfig` globally in `src/app/[lang]/layout.tsx`. Hero-local `MotionConfig reducedMotion="user"` wrapping is sufficient for Sprint 1.
- `--accent-blue-hover` token. YAGNI; Sprint 1 does not consume it, Sprint 2 can introduce if needed.
- IntersectionObserver for widget mount animation. Widget is above-fold; `motion/react` `initial/animate` is enough. IntersectionObserver is still used inside `CallWidget` if internal pieces (shimmer) need viewport-gated timing, but not for the widget-level mount.

---

## 4. Decisions

### 4.1 Hero layout — 60/40 two-column at `md`+

At `<md` (<768px): single column, full-width. Left-column content stacks on top, widget below.
At `≥md`: `grid grid-cols-[60%_40%]` with gap. Left content + CTA group on the left, `HeroWidgetStage` (CRM-table backdrop + floating `CallWidget`) on the right.

**Why `md` and not `lg`:** The widget + CRM-table layered composition does not read cleanly at 768–1023 px; squeezing both into a narrow split degrades the layered effect. Mobile and tablet share the single-column treatment; laptop and up get the two-column experience.

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

| Token | Type | Dark fork | Sprint 1 consumer |
| --- | --- | --- | --- |
| `--pattern-dot` | color | yes | `DottedBackdrop` |
| `--pattern-dash-border` | color | yes | none (Sprint 3 reserve) |
| `--surface-hero` | alias of `--card` | via `--card` | hero section |
| `--text-fade` | color | no (neutral) | none (Sprint 2/3 reserve) |
| `--accent-blue` | color | yes | none (Sprint 2 reserve) |
| `--shadow-float` | shadow | yes | `CallWidget` |
| `--dur-xs` / `--dur-sm` / `--dur-md` / `--dur-lg` | duration | no | hero animations |
| `--ease-out` / `--ease-spring` | easing | no | hero animations |

Placeholder OKLCH values are sane defaults; exact values are tuned during implementation from Chrome extraction. Value tuning later is pure CSS edit with no component impact.

### 4.7 Motion — framer-motion spring-mount, CSS play-once shimmer

**Widget mount:** `motion/react` `<motion.div>` with `initial={{ opacity: 0, scale: 0.94, y: 12 }}` and a spring transition (`stiffness: 220, damping: 24, mass: 0.9` as starting values; tuned during implementation). Triggered by mount, not IntersectionObserver — hero is above-fold.

**Shimmer bars:** Play-once on mount via React `useState` + CSS `@keyframes shimmer` bound to a `data-shimmer="true"` attribute. After ~1.4s the attribute flips to `false` and the bars sit in a static `var(--muted)` state. CPU cost is bounded, no infinite loop.

**Hero text entry:** The current `motion.div` staggered rise-fade pattern (`0.1, 0.2, 0.3, 0.4` s delays with `[0.2, 0, 0, 1]` easing) is preserved verbatim. No new keyframe.

**Reduced motion:** `MotionConfig reducedMotion="user"` wraps the hero subtree, forcing framer to degrade all motion to a 120 ms fade. A CSS `@media (prefers-reduced-motion: reduce)` block in `globals.css` kills shimmer by overriding the `data-shimmer="true"` rule to `animation: none`.

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
<section className="relative overflow-hidden">
  <MotionConfig reducedMotion="user">
    <div className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-8 md:gap-12 ...">
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

```tsx
"use client";
function HeroWidgetStage({ crmTableDict, callWidgetDict }) {
  return (
    <div className="relative aspect-square md:aspect-auto" aria-hidden="true">
      {/* Layer 1: blurred / faded CRM-table */}
      <div className="absolute inset-0 blur-sm opacity-60">
        <CrmTable dict={crmTableDict} />
      </div>
      {/* Layer 2: floating widget */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
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

### 5.3 `CallWidget` (new)

`src/components/mockups/call-widget.tsx`.

```tsx
interface CallWidgetProps {
  dict: {
    tabActive: string;
    tabInactive: string;
    speakerName: string;
    highlightedPhrase: string;
    // additional fields as revealed by Chrome extraction
  };
  className?: string;
}
```

Exact DOM structure, bar widths, chip styling, avatar color, highlight pill color — all come from Chrome extraction during implementation. This spec only declares the component exists, is dictionary-driven, applies `var(--shadow-float)`, and contains the shimmer bars.

### 5.4 `DottedBackdrop` (new shared primitive)

`src/components/ui/dotted-backdrop.tsx`.

```tsx
"use client"; // useId requirement
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

`src/dictionaries/en.ts` and `tr.ts` both gain the same English placeholder strings under `meetingPage.hero`:

```ts
meetingPage: {
  hero: {
    badge: "Live", // TODO(brand):
    headlinePrimary: "Smarter meetings,", // TODO(brand):
    headlineMuted: "from start to finish.", // TODO(brand):
    subhead: "Automatic recording...", // TODO(brand):
    ctaPrimary: "Start for free", // TODO(brand):
    ctaSecondary: "Book a demo", // TODO(brand):
    ctaTertiary: "View pricing", // TODO(brand):
  },
  // existing keys unchanged
}
```

Turkish file gets the same English strings for V1. Brand pass translates both files together.

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

1. `MeetingHero` layout correct at 320, 768, 1024, 1280, 1920 px. Column wrap at `md` (768).
2. `prefers-reduced-motion: reduce` kills shimmer and degrades spring-mount; verified in Chrome DevTools.
3. No hardcoded hex / rgb / oklch colors in `meeting-hero.tsx`, `call-widget.tsx`, `dotted-backdrop.tsx`. Grep: `grep -nE '(text|bg|border)-\[#|rgb\(|oklch\(' src/components/sections/meeting-hero.tsx src/components/mockups/call-widget.tsx src/components/ui/dotted-backdrop.tsx` returns zero matches (token references are fine, raw values are not).
4. Dark-mode hero + widget visually acceptable at sprint-close walkthrough.
5. `DottedBackdrop` lives at `src/components/ui/dotted-backdrop.tsx`; `MeetingBento` imports it; no `function DottedBackdrop` remains in `meeting-bento.tsx`.
6. All roadmap tokens present in `globals.css`: `--pattern-dot`, `--pattern-dash-border`, `--surface-hero`, `--text-fade`, `--accent-blue`, `--shadow-float`, `--dur-xs`, `--dur-sm`, `--dur-md`, `--dur-lg`, `--ease-out`, `--ease-spring`.
7. `/meeting` bundle size increase under 8 KB gzipped vs branch-start.
8. `// TODO(brand):` markers present next to every Attio-English placeholder string (estimate: 8–12 markers total across hero + widget).
9. Keyboard tab order on hero CTAs is primary → secondary → tertiary.
10. Lighthouse accessibility score on `/meeting` ≥ baseline.
11. `npm run lint` clean.
12. `tsc --noEmit` clean.

---

## 10. Open risks

- **Widget content delta.** The widget composition in this spec (Jamie-style speaker row + ✦ Insights chip + shimmer bars) is indicative. Chrome extraction may reveal a different Attio CI hero widget (live caption carousel, audio waveform, action-item list). Plan-phase first task is the extraction; this spec's widget internals are non-binding.
- **Mobile widget legibility.** At 320 px the widget + CRM backdrop composition may not read. If extraction reveals the widget can't scale below 360 px cleanly, the plan can add a mobile-hidden fallback (hero shows text + CTAs only on `<sm`).
- **`--accent-blue` OKLCH placeholder.** The value `oklch(0.62 0.17 248)` is a sane default, not extracted. When Sprint 2 consumes it, tone mismatch is a one-line CSS change.
- **Container side-rail interaction.** `meeting/page.tsx` wraps everything in `max-w-7xl border-x`; implementation must verify the 60/40 grid respects the container's left/right rail positioning at every breakpoint.
- **Bento migration regression.** `DottedBackdrop` extraction touches `meeting-bento.tsx`. Migration commit is atomic and reversible via `git revert` if visual regression is found in the walkthrough.

---

## 11. Implementation order (suggested for plan phase)

The writing-plans skill will decide the final decomposition. This is a preview:

1. Add CSS tokens to `globals.css` (independent, lowest-risk, can go first).
2. Extract `DottedBackdrop` component; migrate `MeetingBento` to consume it; verify bento visual parity.
3. Chrome extraction: Attio CI hero widget composition, colors, animation details.
4. Implement `CallWidget` mockup from extraction.
5. Rewrite `MeetingHero` layout + CTA group; compose `HeroWidgetStage`.
6. Wire motion (spring-mount + shimmer + `MotionConfig` reduced-motion wrapper).
7. Update dictionaries (`tr.ts`, `en.ts`) with new `meetingPage.hero` keys + `// TODO(brand):` markers.
8. Responsive pass at 320 / 768 / 1024 / 1280 / 1920 px.
9. A11y + Lighthouse pass.
10. Bundle-size check; sprint-close visual walkthrough with user.

---

## 12. Post-sprint follow-ups (not part of Sprint 1)

- Decide dark-mode fate (kept or removed from landing) — consolidated into the post-Sprint-3 brand/polish pass to avoid teammate merge conflicts.
- Sprint 2 brainstorm against PRD §3.3 (sticky scroll-locked stage). Sprint 2 consumes `DottedBackdrop`, `--shadow-float`, `--dur-*`, `--ease-*`.
- Sprint 3 brainstorm against PRD §3.4–§3.9. Sprint 3 consumes `--pattern-dash-border`, `--accent-blue`, `--text-fade`.
- Brand and localization pass after Sprint 3 closes: grep for `TODO(brand):`, swap all placeholder copy for Edfu/Turkish assets.
