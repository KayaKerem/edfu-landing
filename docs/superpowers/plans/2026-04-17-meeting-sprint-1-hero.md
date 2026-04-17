# Meeting Sprint 1 Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `/meeting` page's centered hero with a 60/40 two-column layout (layered CRM-table backdrop + floating `CallWidget` on the right, headline + 3 CTAs on the left), extract `DottedBackdrop` into a shared primitive the bento migrates onto, and add the full Sprint 1 CSS token set to `globals.css`.

**Architecture:** Hero is a client component wrapping framer-motion `MotionConfig`; it composes an internal `HeroWidgetStage` leaf that layers the existing `CrmTable` mockup (blurred + mask-faded + opacity) beneath a new `CallWidget` mockup built pixel-faithfully from Attio Call Intelligence hero via Chrome extraction. Motion uses `motion/react` spring transitions for mount and CSS `@keyframes shimmer` with a `data-shimmer` attribute flip for the widget's play-once loading bars. Tokens follow the repo's two-step pattern (raw OKLCH in `:root` / `.dark`, aliased via `--color-*` / `--shadow-*` inside `@theme inline` for Tailwind utilities).

**Tech Stack:** Next.js (non-standard version; heed `node_modules/next/dist/docs/` deprecations), React 18+, TypeScript, Tailwind CSS v4 with `@theme inline`, `motion/react` (framer-motion barrel), shadcn `Button` (base-ui primitives), existing `useInView` hook.

**Source spec:** `docs/superpowers/specs/2026-04-17-meeting-sprint-1-hero-design.md` (commit `03077f0`).

---

## Pre-requisites

- Implementation happens in a git worktree. Worktree base: `feat/multipage-pivot`. Sprint branch: `feat/meeting-redesign-sprint-1`.
- Before pushing at sprint close, pull the frontend team's latest commits from `feat/multipage-pivot` into the sprint branch and resolve any conflicts locally. Then push. This ordering avoids forcing teammates to rebase around the sprint branch.
- Chrome extraction is a **user-interactive** step — Task 6 pauses for the user to open Attio Call Intelligence in Claude Chrome and paste DOM / CSS / animation findings into the conversation. Do not fabricate extraction output.
- The existing spec self-reviewed `03077f0` is the source of truth; when a step shows stub values (e.g. `blur(6px)`), those are initial guesses tuned after extraction.

---

## Task 0: Worktree setup + baselines

**Files:** none created/modified — environment only.

- [ ] **Step 1: Create the worktree**

From the repo root (`/Users/keremkaya/Desktop/firma/edfu-landing`):

```bash
git fetch origin
git worktree add ../edfu-landing-sprint-1 -b feat/meeting-redesign-sprint-1 feat/multipage-pivot
cd ../edfu-landing-sprint-1
```

Expected: `git status` shows `On branch feat/meeting-redesign-sprint-1`, working tree clean. `git log -1 --oneline` matches the latest `feat/multipage-pivot` commit.

- [ ] **Step 2: Install dependencies**

```bash
npm install
```

(User preference: the user prefers to run `npm install` themselves. If this plan is executed by a subagent, ask the user to run it manually and confirm before continuing.)

Expected: `node_modules/` present, no postinstall errors.

- [ ] **Step 3: Capture bundle baseline**

```bash
npm run build 2>&1 | tee /tmp/sprint1-baseline-build.log
```

Record the `/meeting` line's First Load JS value in the log. This is the baseline for acceptance gate §9.9 (<8 KB gzipped increase).

- [ ] **Step 4: Capture Lighthouse a11y baseline**

```bash
npm run start &
SERVER_PID=$!
sleep 3
npx lighthouse http://localhost:3000/meeting --only-categories=accessibility --output=json --output-path=/tmp/sprint1-baseline-lighthouse.json --chrome-flags="--headless" --quiet
kill $SERVER_PID
jq '.categories.accessibility.score' /tmp/sprint1-baseline-lighthouse.json
```

Expected: a score (`1` or near-`1`). Record for acceptance gate §9.12.

- [ ] **Step 5: Commit a placeholder marker**

No files change in this task — proceed directly to Task 1. Do not create a commit yet.

---

## Task 1: Add CSS tokens + `shimmer` keyframe to `globals.css`

**Files:**
- Modify: `src/app/globals.css`

The token set lives in two places per the repo's convention: raw OKLCH / shadow values in the `:root` and `.dark` blocks (lines ~91–150), and Tailwind-utility aliases inside the `@theme inline` block (lines ~7–89). Motion tokens stay raw (no alias).

- [ ] **Step 1: Add raw token values to `:root` block**

Open `src/app/globals.css`. Inside the `:root { ... }` block that starts at line ~91, append (immediately before the closing brace at ~120):

```css
  /* Sprint 1 tokens */
  --pattern-dot: oklch(0.9317 0.0118 231.6594 / 0.6);
  --pattern-dash-border: oklch(0.78 0 0 / 0.6);
  --surface-hero: var(--card);
  --text-fade: oklch(0.55 0 0);
  --accent-blue: oklch(0.62 0.17 248);
  --shadow-float: 0 20px 40px -8px oklch(0 0 0 / 0.12), 0 4px 12px -2px oklch(0 0 0 / 0.08);
  --dur-xs: 120ms;
  --dur-sm: 240ms;
  --dur-md: 360ms;
  --dur-lg: 560ms;
  --ease-out: cubic-bezier(0.2, 0, 0, 1);
  --ease-spring: cubic-bezier(0.2, 1.2, 0.3, 1);
```

- [ ] **Step 2: Add dark-mode forks to `.dark` block**

Inside the `.dark { ... }` block (lines ~122–150), append before the closing brace:

```css
  /* Sprint 1 tokens */
  --pattern-dot: oklch(0.269 0 0 / 0.6);
  --pattern-dash-border: oklch(0.42 0 0 / 0.5);
  --text-fade: oklch(0.62 0 0);
  --accent-blue: oklch(0.68 0.17 248);
  --shadow-float: 0 20px 50px -8px oklch(0 0 0 / 0.4), 0 4px 16px -2px oklch(0 0 0 / 0.3);
```

(`--surface-hero` inherits from `--card` which is already dark-responsive; motion tokens don't fork.)

- [ ] **Step 3: Add `@theme inline` aliases**

Inside the `@theme inline { ... }` block near the top of the file, append *immediately before* the `--font-sans` line (around line 36):

```css
  --color-pattern-dot: var(--pattern-dot);
  --color-pattern-dash-border: var(--pattern-dash-border);
  --color-surface-hero: var(--surface-hero);
  --color-text-fade: var(--text-fade);
  --color-accent-blue: var(--accent-blue);
  --shadow-float: var(--shadow-float);
```

- [ ] **Step 4: Add `shimmer` keyframe**

Append to the end of `globals.css` (after the existing reduced-motion block at line ~195):

```css
/* === Sprint 1 hero shimmer === */

@keyframes shimmer {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}
```

No reduced-motion override is added — the existing global rule (`globals.css:188-195`, `animation-duration: 0.01ms !important`) already neutralizes this keyframe when the user prefers reduced motion.

- [ ] **Step 5: Verify dev server still boots and CSS parses**

```bash
npm run dev
```

Open `http://localhost:3000/meeting` in a browser. Confirm (a) the page loads with no console errors, (b) existing bento renders normally (token addition did not break anything), (c) DevTools Computed Styles on `<body>` shows `--pattern-dot`, `--shadow-float`, `--dur-md` as defined custom properties. Kill the dev server.

- [ ] **Step 6: Verify lint + typecheck**

```bash
npm run lint && npx tsc --noEmit
```

Expected: both clean, zero errors.

- [ ] **Step 7: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(meeting-sprint-1): add hero tokens + shimmer keyframe to globals.css"
```

---

## Task 2: Create `brand-pending.ts` companion file

**Files:**
- Create: `src/dictionaries/brand-pending.ts`

This file is pure bookkeeping — it lists dot-path keys whose values in `en.json` / `tr.json` hold Attio English placeholder copy pending brand-pass swap. No runtime consumer yet.

- [ ] **Step 1: Create the file**

```bash
touch src/dictionaries/brand-pending.ts
```

- [ ] **Step 2: Write the file contents**

Contents of `src/dictionaries/brand-pending.ts`:

```ts
/**
 * Keys listed here hold Attio English placeholder copy that will be swapped
 * during the post-Sprint-3 brand/localization pass. Both en.json and tr.json
 * carry the English placeholder for V1; the brand pass translates both files.
 *
 * Append CallWidget dict keys here as Chrome extraction (Task 6) finalizes
 * the widget's dictionary shape.
 */
export const BRAND_PENDING_KEYS = [
  "meetingPage.hero.badge",
  "meetingPage.hero.headlinePrimary",
  "meetingPage.hero.headlineMuted",
  "meetingPage.hero.subhead",
  "meetingPage.hero.ctaPrimary",
  "meetingPage.hero.ctaSecondary",
  "meetingPage.hero.ctaTertiary",
] as const;

export type BrandPendingKey = (typeof BRAND_PENDING_KEYS)[number];
```

- [ ] **Step 3: Verify typecheck**

```bash
npx tsc --noEmit
```

Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add src/dictionaries/brand-pending.ts
git commit -m "feat(meeting-sprint-1): add brand-pending keys companion file"
```

---

## Task 3: Extract `DottedBackdrop` into `src/components/ui/`

**Files:**
- Create: `src/components/ui/dotted-backdrop.tsx`

The component is a server component (no `"use client"`). `useId` is SSR-safe in React 18+; the existing `MeetingBento` already calls `useId` server-side. Color is driven by the `text-pattern-dot` Tailwind utility (generated by the `--color-pattern-dot` alias added in Task 1), so `<rect fill="currentColor" />` picks up the token.

- [ ] **Step 1: Create the file**

```bash
touch src/components/ui/dotted-backdrop.tsx
```

- [ ] **Step 2: Write the component**

Contents of `src/components/ui/dotted-backdrop.tsx`:

```tsx
import { useId } from "react";
import { cn } from "@/lib/utils";

interface DottedBackdropProps {
  /** Optional extra classes. Defaults apply absolute inset-0 sizing and pattern-dot color. */
  className?: string;
  /** Dot tile size in px. Default 10. */
  tileSize?: number;
}

export function DottedBackdrop({ className, tileSize = 10 }: DottedBackdropProps) {
  const patternId = useId();
  return (
    <svg
      aria-hidden="true"
      role="presentation"
      className={cn(
        "absolute inset-0 h-full w-full text-pattern-dot",
        className
      )}
    >
      <defs>
        <pattern
          id={patternId}
          width={tileSize}
          height={tileSize}
          patternUnits="userSpaceOnUse"
        >
          <rect width="1" height="1" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
```

- [ ] **Step 3: Verify lint + typecheck**

```bash
npm run lint && npx tsc --noEmit
```

Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/dotted-backdrop.tsx
git commit -m "feat(meeting-sprint-1): extract DottedBackdrop into shared ui primitive"
```

---

## Task 4: Migrate `MeetingBento` to consume shared `DottedBackdrop`

**Files:**
- Modify: `src/components/sections/meeting-bento.tsx`

Current bento has a local `function DottedBackdrop({ patternId })` at lines ~6–26 and passes `patternId` into its `CardArt` component. Migration strips both: the local function is deleted, the shared component is imported, and `patternId` prop is removed from `CardArt`.

- [ ] **Step 1: Take a "before" screenshot for visual no-op verification**

```bash
npm run dev
```

Open `http://localhost:3000/meeting` in a browser. Scroll to the `MeetingBento` section (three cards with dotted backdrop art). Take a screenshot of all three cards at 1280 px width, save as `/tmp/bento-before.png`. Kill the dev server.

- [ ] **Step 2: Remove the local `DottedBackdrop` function**

Open `src/components/sections/meeting-bento.tsx`. Delete the local `function DottedBackdrop({ patternId }: { patternId: string }) { ... }` block (lines ~6–26, the SVG-pattern implementation).

- [ ] **Step 3: Add the import**

At the top of `src/components/sections/meeting-bento.tsx`, add to the existing import block:

```tsx
import { DottedBackdrop } from "@/components/ui/dotted-backdrop";
```

- [ ] **Step 4: Remove `patternId` prop from `CardArt`**

Find the `CardArt` function declaration (originally around line 38–51). Change:

```tsx
function CardArt({
  children,
  patternId,
}: {
  children: React.ReactNode;
  patternId: string;
}) {
  return (
    <div className="relative mb-6 aspect-square md:aspect-[1.618] lg:aspect-square w-full overflow-hidden">
      <DottedBackdrop patternId={patternId} />
      {children}
    </div>
  );
}
```

to:

```tsx
function CardArt({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative mb-6 aspect-square md:aspect-[1.618] lg:aspect-square w-full overflow-hidden">
      <DottedBackdrop />
      {children}
    </div>
  );
}
```

- [ ] **Step 5: Remove `patternId={...}` from every `CardArt` call site**

Grep the file for every `<CardArt patternId=`:

```bash
grep -n 'CardArt patternId' src/components/sections/meeting-bento.tsx
```

For each match, remove only the `patternId={...}` prop. Example — change:

```tsx
<CardArt patternId={id1}>
```

to:

```tsx
<CardArt>
```

Also remove any now-unused `const id1 = useId();` / `id2` / `id3` declarations at the top of the `MeetingBento` component. Run the grep again to confirm zero matches.

- [ ] **Step 6: Remove stale `useId` import if no other consumer remains**

```bash
grep -n 'useId' src/components/sections/meeting-bento.tsx
```

If zero matches (all `useId` calls were only for the deleted `patternId`s), remove `useId` from the `import { ... } from "react"` line at the top. If `useId` is still used elsewhere (unlikely), leave it.

- [ ] **Step 7: Dev-server visual no-op check**

```bash
npm run dev
```

Reload `http://localhost:3000/meeting`. Scroll to the bento. Take a screenshot at 1280 px, save as `/tmp/bento-after.png`. Compare side-by-side with `/tmp/bento-before.png`:

```bash
open /tmp/bento-before.png /tmp/bento-after.png
```

**Acceptance:** visual match — dot density, dot color, dot spacing identical. If the dots appear lighter / darker / different color, the `--pattern-dot` initial value in Task 1 does not match `text-border/60`. Tune the OKLCH lightness / alpha in `globals.css:--pattern-dot` until match is pixel-confirmed.

Kill the dev server.

- [ ] **Step 8: Verify grep gates**

```bash
grep -n 'function DottedBackdrop' src/
```

Expected: exactly one match — in `src/components/ui/dotted-backdrop.tsx`. No match in `meeting-bento.tsx`.

- [ ] **Step 9: Lint + typecheck**

```bash
npm run lint && npx tsc --noEmit
```

Expected: clean.

- [ ] **Step 10: Commit**

```bash
git add src/components/sections/meeting-bento.tsx
git commit -m "refactor(meeting-bento): consume shared DottedBackdrop primitive"
```

---

## Task 5: Update dictionaries with new `meetingPage.hero` keys

**Files:**
- Modify: `src/dictionaries/en.json`
- Modify: `src/dictionaries/tr.json`

The existing `meetingPage.hero` object has three keys: `badge`, `title`, `description`. The new layout needs seven: `badge`, `headlinePrimary`, `headlineMuted`, `subhead`, `ctaPrimary`, `ctaSecondary`, `ctaTertiary`. Both locale files get the same English placeholders for V1 (brand pass will translate later).

Also add placeholder `mockups.callWidget` dict skeleton so the types compile before Task 6 extraction populates real keys.

- [ ] **Step 1: Locate the existing `meetingPage.hero` block in `en.json`**

```bash
grep -n '"meetingPage"' src/dictionaries/en.json
```

Read the block starting at the matched line. The current shape is roughly:

```json
"meetingPage": {
  "hero": {
    "badge": "Meeting Agent",
    "title": "Smarter meetings, start to finish.",
    "description": "Record, transcribe, and extract action items from your meetings. All content feeds your company memory."
  },
  ...
}
```

- [ ] **Step 2: Replace the `hero` block in `en.json`**

Change the `hero` object to:

```json
    "hero": {
      "badge": "Live",
      "headlinePrimary": "Smarter meetings,",
      "headlineMuted": "from start to finish.",
      "subhead": "Automatic recording, transcription, action items.",
      "ctaPrimary": "Start for free",
      "ctaSecondary": "Book a demo",
      "ctaTertiary": "View pricing"
    },
```

- [ ] **Step 3: Apply the same replacement to `tr.json`**

Open `src/dictionaries/tr.json`. The Turkish file currently has its own Turkish values for `hero.title` and `hero.description`. Replace the `hero` block with the **same English** placeholder above (V1 is English for both; brand pass translates the Turkish file):

```json
    "hero": {
      "badge": "Live",
      "headlinePrimary": "Smarter meetings,",
      "headlineMuted": "from start to finish.",
      "subhead": "Automatic recording, transcription, action items.",
      "ctaPrimary": "Start for free",
      "ctaSecondary": "Book a demo",
      "ctaTertiary": "View pricing"
    },
```

- [ ] **Step 4: Add `callWidget` skeleton to `mockups` in both locales**

Find the `"mockups"` top-level key in `en.json`. It likely already contains `crmTable`, `meetingList`, `callPlayer`, etc. Append a `callWidget` entry with four initial keys that match the spec §5.3 interface (values tuned by extraction in Task 6):

```json
    "callWidget": {
      "tabActive": "Insights",
      "tabInactive": "Transcript",
      "speakerName": "Jamie Davies",
      "highlightedPhrase": "the next steps?"
    }
```

Apply the same addition to `tr.json` (same English values for V1).

- [ ] **Step 5: Validate JSON parses**

```bash
jq . src/dictionaries/en.json > /dev/null && jq . src/dictionaries/tr.json > /dev/null
echo $?
```

Expected: `0`. If `jq` reports a parse error, fix the trailing-comma or brace mismatch it names.

- [ ] **Step 6: Typecheck (dictionaries flow through `Dictionary` type)**

```bash
npx tsc --noEmit
```

Expected: may fail in `src/components/sections/meeting-hero.tsx` and `src/app/[lang]/meeting/page.tsx` because old `title` / `description` keys are still being read. That's expected — Tasks 8 and 10 rewrite those files. **Do not fix the tsc errors here; leave them failing and proceed.** Record the error count so Task 10 can close them.

If the typecheck fails in any OTHER file (not `meeting-hero.tsx` or `meeting/page.tsx`), that's an unexpected failure — diagnose before continuing.

- [ ] **Step 7: Commit**

```bash
git add src/dictionaries/en.json src/dictionaries/tr.json
git commit -m "feat(meeting-sprint-1): update hero dict keys + add callWidget skeleton"
```

---

## Task 6: [USER-INTERACTIVE] Chrome extraction of Attio CI hero

**Files:**
- Create (after extraction): `docs/superpowers/specs/2026-04-17-meeting-sprint-1-hero-addendum.md`

This task cannot be automated. The user opens Attio Call Intelligence (`https://attio.com/platform/call-intelligence`) in Claude Chrome and extracts the hero section structurally. The extraction output is committed as a spec addendum that Tasks 7 and 8 consume.

- [ ] **Step 1: Prompt the user to open Attio CI hero in Claude Chrome**

Pause execution and surface this exact prompt to the user:

> "Sprint 1 için Attio Call Intelligence hero extraction'ı yapman lazım. Claude Chrome'da `https://attio.com/platform/call-intelligence` aç. Sayfanın EN ÜSTÜNDEKİ hero bloğunu (2-column: headline+CTAs solda, layered CRM-table+floating widget sağda) incele ve şunları paste et:
>
> **Widget (floating card)** için:
> 1. Tam DOM iskeleti (hero right-column widget'ın kapsamlı JSX/HTML'i)
> 2. Header: chip'ler ne (tab isimleri, active/inactive styling)? Underline mı pill mi?
> 3. Speaker row: avatar (renk/initial/image), isim, hangi font weight
> 4. Highlight pill: hangi renk, hangi font, padding
> 5. Shimmer bars: kaç tane? Yüzde genişlikleri? Border-radius? Arka plan rengi?
> 6. Widget'ın outer `box-shadow` (exact değer)
> 7. Widget width + height (aspect-ratio veya exact px)
>
> **CRM-table backdrop** için:
> 1. Blur radius (`filter: blur(?px)`)
> 2. Opacity
> 3. Mask-image gradient stops (top fade, bottom fade, both?)
> 4. Backdrop'un widget'a göre positioning (behind/left/right offset)
>
> **Animations** için:
> 1. Widget entry animation: spring stiffness / damping / duration
> 2. Shimmer animation: duration, easing, infinite veya one-shot
> 3. Highlight pill entry: var mı? Nasıl?
>
> **Colors** için OKLCH / hex değerleri — özellikle:
> - Accent-blue (CTA bg)
> - Highlight pill bg ve text color
> - Bars bg color
>
> Paste'i bu mesaja verdiğinde devam edeceğim."

- [ ] **Step 2: Wait for user input**

Do not proceed until the user responds with extraction data. If the user says "extraction tamam, devam et" without data, re-prompt specifying what's missing.

- [ ] **Step 3: Structure the extraction into a markdown addendum**

Create `docs/superpowers/specs/2026-04-17-meeting-sprint-1-hero-addendum.md` with this structure (fill in the user's extraction):

```markdown
# Sprint 1 hero spec — Chrome extraction addendum

**Date:** <today's date>
**Source:** Attio Call Intelligence hero (`https://attio.com/platform/call-intelligence`) via Claude Chrome
**Parent spec:** `2026-04-17-meeting-sprint-1-hero-design.md`

This file holds the concrete values extracted from Attio's CI hero that the
parent spec left as "finalized during implementation." Tasks 7 and 8 in the
plan consume these values verbatim. If any value here conflicts with the
parent spec's stubs, this addendum wins.

## 1. CallWidget structure

### 1.1 DOM skeleton
<paste exact DOM>

### 1.2 Header (tabs)
- Active tab: <name> — styling: <e.g. 2-px underline in --fg-primary>
- Inactive tab: <name> — styling: <e.g. muted text, no underline>

### 1.3 Speaker row
- Avatar: <colored dot / initial / image>
- Name: <value> — font-weight: <N>
- Placement: <left-aligned, 20px avatar>

### 1.4 Highlight pill
- Copy: "<phrase>"
- Background: <color>
- Text color: <color>
- Padding: <value>
- Border-radius: <value>

### 1.5 Shimmer bars
- Count: <N>
- Widths: <e.g. 96% / 80% / 60%>
- Height: <px>
- Border-radius: <px>
- Base color: <--muted / exact value>

### 1.6 Outer shadow
<exact box-shadow value>

### 1.7 Dimensions
<width + height + aspect-ratio>

## 2. CRM-table backdrop
- `filter: blur(<N>px)`
- `opacity: <N>`
- `mask-image`: <gradient stops>
- Positioning: <offsets relative to widget>

## 3. Animations
- Widget mount: `type: "spring", stiffness: <N>, damping: <N>, mass: <N>`
- Shimmer: `duration: <ms>, easing: <curve>, iteration: <once|infinite>`
- Highlight pill entry: <if present>

## 4. Colors (OKLCH or hex)
- `--accent-blue`: <value>
- Highlight pill bg: <value>
- Highlight pill text: <value>
- Shimmer base: <value>

## 5. Additional dict keys for CallWidget

If extraction revealed more user-facing strings than the skeleton (`tabActive`,
`tabInactive`, `speakerName`, `highlightedPhrase`), list them:

- `<key>`: "<English placeholder>"
```

- [ ] **Step 4: If extraction adds dict keys, update dicts + BRAND_PENDING_KEYS**

If the addendum §5 lists new keys beyond the 4 skeleton ones, add each to:
1. `src/dictionaries/en.json` → `mockups.callWidget.<key>`
2. `src/dictionaries/tr.json` → same key and value (English for V1)
3. `src/dictionaries/brand-pending.ts` → append `"mockups.callWidget.<key>"` to `BRAND_PENDING_KEYS`

- [ ] **Step 5: If extraction changes `--pattern-dot` color or token values, update `globals.css`**

If the addendum §4 lists a different `--accent-blue` OKLCH (almost certain — Task 1's value is a guess), edit `globals.css` accordingly. Bento-parity constraint on `--pattern-dot` still applies; do not change that value based on Attio's hero dots.

- [ ] **Step 6: Commit the addendum (and any dict / css updates it triggered)**

```bash
git add docs/superpowers/specs/2026-04-17-meeting-sprint-1-hero-addendum.md
git add -u src/dictionaries/ src/app/globals.css 2>/dev/null || true
git commit -m "docs(meeting-sprint-1): Attio CI hero extraction addendum

Captures widget DOM, CRM-backdrop treatment, animation values, and colors
for Tasks 7-8 to consume verbatim.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 7: Build `CallWidget` mockup component

**Files:**
- Create: `src/components/mockups/call-widget.tsx`

Implementation is driven by Task 6 addendum. The code below is a **reference skeleton** showing the locked structural commitments (dictionary-driven, `shadow-float`, `data-shimmer` attribute pattern, aria-hidden inherited from parent). Replace concrete values (bar count, bar widths, exact DOM) with Task 6 addendum specifics.

- [ ] **Step 1: Create the file**

```bash
touch src/components/mockups/call-widget.tsx
```

- [ ] **Step 2: Write the component**

Contents of `src/components/mockups/call-widget.tsx`. Treat the DOM shape, bar widths, and class list as **slots to overwrite** using Task 6 addendum values. Do not deviate from: the `"use client"` directive, the `useState` + `useEffect` shimmer flip, the `data-shimmer` attribute approach, or the `shadow-float` utility application.

```tsx
"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CallWidgetDict {
  tabActive: string;
  tabInactive: string;
  speakerName: string;
  highlightedPhrase: string;
  // If extraction (Task 6) revealed additional keys, add them here and keep
  // this interface in sync with mockups.callWidget in en.json / tr.json.
}

interface CallWidgetProps {
  dict: CallWidgetDict;
  className?: string;
}

/**
 * Shimmer flip duration. If Task 6 addendum §3 specifies a different shimmer
 * duration, update this constant. 1400ms is the spec's initial value.
 */
const SHIMMER_FLIP_MS = 1400;

export function CallWidget({ dict, className }: CallWidgetProps) {
  const [shimmering, setShimmering] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShimmering(false), SHIMMER_FLIP_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={cn(
        "relative w-[min(360px,100%)] rounded-2xl border border-border bg-card shadow-float",
        className
      )}
    >
      {/* Header: tabs */}
      <div className="flex items-center gap-4 border-b border-border px-4 py-2.5">
        <span className="relative text-xs font-medium text-foreground">
          {/* TODO(brand): visual tab label */}
          {dict.tabActive}
          <span className="absolute -bottom-2.5 left-0 right-0 h-0.5 bg-foreground" />
        </span>
        <span className="text-xs font-medium text-muted-foreground">
          {/* TODO(brand): visual tab label */}
          {dict.tabInactive}
        </span>
      </div>

      {/* Body: speaker row + highlight */}
      <div className="flex flex-col gap-3 px-4 py-4">
        <div className="flex items-center gap-2">
          <span
            className="size-5 rounded-full bg-[color:var(--accent-blue)]"
            aria-hidden="true"
          />
          <span className="text-sm font-semibold text-foreground">
            {/* TODO(brand): placeholder speaker name */}
            {dict.speakerName}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-foreground">
          {/* TODO(brand): placeholder quote — values per Task 6 extraction */}
          Honestly, this looks like exactly what we need, what are{" "}
          <span className="rounded-[4px] bg-[oklch(0.78_0.08_295_/_0.18)] px-1 py-0.5 text-[color:oklch(0.45_0.14_295)]">
            {dict.highlightedPhrase}
          </span>
        </p>

        {/* Shimmer bars. Count + widths per Task 6 addendum §1.5. */}
        <div className="mt-2 flex flex-col gap-1.5" data-shimmer={shimmering}>
          <div className="call-widget-bar h-2 w-[96%] rounded-sm bg-muted" />
          <div className="call-widget-bar h-2 w-[80%] rounded-sm bg-muted" />
          <div className="call-widget-bar h-2 w-[60%] rounded-sm bg-muted" />
        </div>
      </div>
    </div>
  );
}
```

**Note on the lavender highlight pill:** the `oklch(0.78 0.08 295 / 0.18)` + `oklch(0.45 0.14 295)` values above are raw — they match the bento Card 1 lavender pill. §9.3 allows raw OKLCH inside `*.tsx` only via `text-[...]`/`bg-[...]` arbitrary-value utilities **if** the addendum does not name a semantic token. If Task 6 extraction produced Attio-specific lavender values or a reusable token (`--highlight-bg` etc), prefer the token. If no token surfaces, add a spec-follow-up issue to introduce one in Sprint 2. For now, leaving as arbitrary values with a spec note is acceptable because the values match the already-shipped bento.

**IMPORTANT:** the raw `oklch(...)` values above will fail acceptance gate §9.3 as written. Before committing, either (a) introduce a new pair of tokens (`--highlight-pill-bg` / `--highlight-pill-fg`) in `globals.css` and Task 1, and reference them via `bg-[color:var(--highlight-pill-bg)]`, or (b) decide in Task 6 that the widget does not need a highlight pill (if extraction reveals Attio's widget has none). This is a plan-phase decision the implementer makes once extraction data is in hand.

- [ ] **Step 3: Add CSS `data-shimmer` rule to `globals.css`**

Append to the end of `src/app/globals.css` (after the `shimmer` `@keyframes` block from Task 1):

```css
/* Shimmer plays once, then the attribute flips to false and bars sit in solid --muted. */
[data-shimmer="true"] .call-widget-bar {
  background-image: linear-gradient(
    90deg,
    var(--muted) 0%,
    var(--background) 50%,
    var(--muted) 100%
  );
  background-size: 200% 100%;
  background-repeat: no-repeat;
  animation: shimmer var(--dur-lg) var(--ease-out) forwards;
}
```

Reduced-motion is already covered by the existing global rule at `globals.css:188–195` — no per-widget override needed.

- [ ] **Step 4: Lint + typecheck**

```bash
npm run lint && npx tsc --noEmit
```

Expected: `meeting-hero.tsx` and `meeting/page.tsx` still failing (fixed in Tasks 8–10); no new errors in `call-widget.tsx` or `globals.css`.

- [ ] **Step 5: Commit**

```bash
git add src/components/mockups/call-widget.tsx src/app/globals.css
git commit -m "feat(meeting-sprint-1): add CallWidget mockup with play-once shimmer"
```

---

## Task 8: Rewrite `MeetingHero` (layout + CTAs + `HeroWidgetStage`)

**Files:**
- Modify: `src/components/sections/meeting-hero.tsx` (full rewrite)

This is the largest task. Rewrite replaces the current centered hero with the 60/40 layout, 3-CTA group, and the layered `HeroWidgetStage` internal component.

- [ ] **Step 1: Overwrite the file**

Replace the entire contents of `src/components/sections/meeting-hero.tsx` with:

```tsx
"use client";

import { motion, MotionConfig } from "motion/react";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { Button } from "@/components/ui/button";
import { CrmTable } from "@/components/mockups/crm-table";
import { CallWidget } from "@/components/mockups/call-widget";

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

const EASE = [0.2, 0, 0, 1] as [number, number, number, number];

export function MeetingHero({ dict, mockupsDict }: MeetingHeroProps) {
  return (
    <section className="relative overflow-hidden px-4 md:px-6 pt-32 sm:pt-40 pb-16">
      <MotionConfig reducedMotion="user">
        <div className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-8 md:gap-12 items-center">
          {/* Left column: badge + headline + subhead + CTAs */}
          <div className="flex flex-col items-start">
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 shadow-sm">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <AnimatedShinyText className="text-xs font-medium">
                  {/* TODO(brand): placeholder badge copy */}
                  {dict.badge}
                </AnimatedShinyText>
              </div>
            </motion.div>

            <motion.h1
              className="text-[36px] sm:text-[48px] md:text-[56px] font-medium text-foreground leading-none"
              style={{ letterSpacing: "-0.05em" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
            >
              {/* TODO(brand): placeholder headline copy (two-tone split) */}
              <span>{dict.headlinePrimary}</span>{" "}
              <span className="text-muted-foreground">{dict.headlineMuted}</span>
            </motion.h1>

            <motion.p
              className="mt-6 max-w-xl text-base md:text-lg text-muted-foreground font-medium tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
            >
              {/* TODO(brand): placeholder subhead copy */}
              {dict.subhead}
            </motion.p>

            <motion.div
              className="mt-10 flex flex-wrap items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.4 }}
            >
              <Button
                size="lg"
                render={<a href="https://app.edfu.ai" />}
              >
                {/* TODO(brand): placeholder CTA label */}
                {dict.ctaPrimary}
              </Button>
              <Button
                size="lg"
                variant="ghost"
                render={<a href="#contact" />}
              >
                {/* TODO(brand): placeholder CTA label */}
                {dict.ctaSecondary}
              </Button>
              <Button
                size="lg"
                variant="ghost"
                render={<a href="/pricing" />}
              >
                {/* TODO(brand): placeholder CTA label */}
                {dict.ctaTertiary}
              </Button>
            </motion.div>
          </div>

          {/* Right column: widget stage (hidden on narrow phones) */}
          <div className="hidden [@media(min-width:360px)]:block">
            <HeroWidgetStage
              crmTableDict={mockupsDict.crmTable}
              callWidgetDict={mockupsDict.callWidget}
            />
          </div>
        </div>
      </MotionConfig>
    </section>
  );
}

interface HeroWidgetStageProps {
  crmTableDict: Parameters<typeof CrmTable>[0]["dict"];
  callWidgetDict: Parameters<typeof CallWidget>[0]["dict"];
}

function HeroWidgetStage({ crmTableDict, callWidgetDict }: HeroWidgetStageProps) {
  return (
    <div
      className="relative aspect-square md:aspect-[4/5] lg:aspect-[5/6] overflow-hidden"
      aria-hidden="true"
    >
      {/* Layer 1: CRM-table backdrop — blurred, faded, masked. Strip the
          CrmTable card shell visually via child-selector overrides so it
          reads as a backdrop, not a floating card. Final values per
          Task 6 addendum §2. */}
      <div
        className="absolute inset-0 opacity-55 [filter:blur(6px)] [mask-image:linear-gradient(to_bottom,black_0%,black_50%,transparent_100%)] [&>*]:!shadow-none [&>*]:!border-0 [&>*]:!rounded-none"
      >
        <CrmTable dict={crmTableDict} />
      </div>

      {/* Layer 2: floating widget. Spring values per Task 6 addendum §3. */}
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

**Note on `<Button render={<a href="..." />}>`:** the shadcn `Button` wraps base-ui's `Button` primitive which accepts a `render` prop for slot-style rendering. Confirm this API works by reading `src/components/ui/button.tsx` and `node_modules/@base-ui/react/button` documentation. If `render` doesn't exist in this project's button wrapper, substitute with `asChild`-style composition or `onClick={() => (window.location.href = "...")}`. Do not use `<a><Button /></a>` wrapping — that creates nested interactive elements.

- [ ] **Step 2: Lint + typecheck**

```bash
npm run lint && npx tsc --noEmit
```

Expected: `meeting/page.tsx` still failing (calls `MeetingHero` with old prop shape). `meeting-hero.tsx` itself clean. If `meeting-hero.tsx` has errors, they're real — fix before continuing.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/meeting-hero.tsx
git commit -m "feat(meeting-sprint-1): rewrite MeetingHero with 60/40 layout and 3-CTA group"
```

---

## Task 9: Wire `meeting/page.tsx` to new `MeetingHero` props

**Files:**
- Modify: `src/app/[lang]/meeting/page.tsx`

The page currently passes `mockupsDict={{ meetingList, callPlayer }}` to `MeetingHero`. The new hero takes `{ crmTable, callWidget }` instead.

- [ ] **Step 1: Inspect the current wiring**

```bash
grep -n 'MeetingHero\|mockupsDict' src/app/[lang]/meeting/page.tsx
```

Confirm the current `<MeetingHero>` call passes `meetingList` and `callPlayer` mockup dicts. Note any other usages of `m.meetingList` and `m.callPlayer` elsewhere on the page (e.g. in `stickyVisuals`).

- [ ] **Step 2: Update the `<MeetingHero>` call**

Change the existing call from:

```tsx
<MeetingHero
  dict={mp.hero}
  mockupsDict={{
    meetingList: m.meetingList,
    callPlayer: m.callPlayer,
  }}
/>
```

to:

```tsx
<MeetingHero
  dict={mp.hero}
  mockupsDict={{
    crmTable: m.crmTable,
    callWidget: m.callWidget,
  }}
/>
```

- [ ] **Step 3: Remove unused imports**

Run:

```bash
grep -n 'MeetingList\|CallPlayer' src/app/[lang]/meeting/page.tsx
```

If `MeetingList` is only imported for the hero's old mockup layout and no longer used elsewhere on the page, remove its import line. If `CallPlayer` is still used (e.g. inside `stickyVisuals`), leave it. Typically: `MeetingList` is removed, `CallPlayer` stays.

- [ ] **Step 4: Lint + typecheck**

```bash
npm run lint && npx tsc --noEmit
```

Expected: **clean**. All the errors surfaced in Tasks 5 and 8 should now close.

- [ ] **Step 5: Dev-server smoke test**

```bash
npm run dev
```

Open `http://localhost:3000/meeting`. Confirm (a) page loads, (b) hero shows the new 60/40 layout with headline + 3 CTAs on left, widget stage on right, (c) rest of the page (bento, sticky section, footer CTA) still renders. Check console for errors. Kill dev server.

If the hero layout is broken (e.g. widget overlapping, CTAs cut off, mobile stacking wrong), pause here and fix — don't defer to Task 10. Most likely culprits: `max-w-7xl` container padding mismatch, widget `aspect-[*]` value too tall/short, forgotten `overflow-hidden` on the stage.

- [ ] **Step 6: Commit**

```bash
git add src/app/[lang]/meeting/page.tsx
git commit -m "feat(meeting-sprint-1): wire MeetingHero to crmTable + callWidget dicts"
```

---

## Task 10: Responsive pass (320 / 360 / 768 / 1024 / 1280 / 1920)

**Files:**
- Modify (as needed): `src/components/sections/meeting-hero.tsx`, `src/components/mockups/call-widget.tsx`, `src/app/globals.css`

Acceptance gate §9.1. Widget hidden below 360 px; two-column at ≥768; clean layout at all widths.

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Test at each width in Chrome DevTools**

Open `http://localhost:3000/meeting`. In DevTools → Toggle device toolbar → Responsive mode. For each width, set the viewport and inspect the hero:

- **320 px:** widget stage HIDDEN. Hero shows badge + headline + subhead + 3 CTAs stacked. Text wraps without horizontal scroll. CTAs wrap to new line(s) as needed.
- **360 px:** widget stage becomes VISIBLE. Single column (below `md`). Widget sits below the CTAs at full width.
- **768 px:** single column still (below `md` boundary — check `grid-cols-1 md:grid-cols-[60%_40%]` breakpoint). Widget full-width below CTAs.
- **1024 px:** two column. Left column ~60%, right column ~40%. Widget aspect-ratio reads correctly.
- **1280 px:** two column. Layout matches the 1024 presentation scaled up. Side-rails of `max-w-7xl` container visible but hero content clears them.
- **1920 px:** two column. Container centers, hero content does not bleed into the side rails.

- [ ] **Step 3: Fix any breakpoint issues**

Common fixes:
- Widget overflowing right rail at 1280: check `overflow-hidden` on the stage container, and the widget's `w-[min(360px,100%)]`.
- Mobile CTAs crowding: ensure `flex-wrap` is active and `gap-3` is enough breathing room.
- Widget aspect too tall on narrow tablets: revise the responsive `aspect-[*]` values in `HeroWidgetStage`.
- Headline clipping at 320 px: `text-balance` not applied — add `text-balance` class to the `<motion.h1>`.

Commit fixes as small incremental commits (`fix(meeting-sprint-1): adjust <what>`).

- [ ] **Step 4: Verify narrow-phone widget hide**

In DevTools responsive mode at exactly 359 × 640 px, the widget must be hidden (`display: none`). Confirm via `HeroWidgetStage` parent element missing or having `display: none` in computed styles.

At 360 × 640 px, the widget appears.

- [ ] **Step 5: Kill dev server and commit any fixes**

If no fixes were needed in Steps 3–4, skip. Otherwise:

```bash
git add -u
git commit -m "fix(meeting-sprint-1): responsive adjustments for hero at <viewport> breakpoints"
```

---

## Task 11: Accessibility + reduced-motion + Lighthouse pass

**Files:** may modify `src/components/sections/meeting-hero.tsx` if a11y issues surface.

Acceptance gates §9.2, §9.11, §9.12. Also §9.4 (`dark:` grep) and §9.3 (raw-value grep) run here as pre-commit sanity checks.

- [ ] **Step 1: Keyboard tab-order verification**

Start dev server, open `http://localhost:3000/meeting`, click somewhere above the hero to focus the page, then press `Tab` repeatedly:

1. First focus lands on (likely) navbar's skip link or first interactive element above the hero.
2. After navbar elements, focus should enter the hero CTAs in order: **primary → secondary → tertiary**.
3. Focus-visible ring appears on each button.

If tab order is wrong (e.g. secondary focused before primary), check source order in `meeting-hero.tsx` JSX. Fix and recheck.

- [ ] **Step 2: Reduced-motion verification**

In Chrome DevTools:
1. Cmd+Shift+P → type "emulate" → select "Emulate CSS media feature prefers-reduced-motion" → choose "reduce".
2. Full reload the page (Cmd+Shift+R).
3. Confirm: (a) widget is fully visible (opacity 1) at first paint — NOT stuck at opacity 0, (b) shimmer bars do not animate; they're solid `--muted` color, (c) headline, subhead, CTAs all visible (motion staggers degraded).

If the widget is invisible on reduced-motion, the framer `initial={{ opacity: 0 }}` → `animate={{ opacity: 1 }}` transition is being killed faster than it runs. Fix by wrapping the `motion.div` inside `MotionConfig reducedMotion="user"` (already done in `MeetingHero`) and ensuring the `transition` is a spring (framer preserves opacity through a spring even when reduced-motion kills transforms).

- [ ] **Step 3: Run Lighthouse accessibility audit**

```bash
npm run build && npm run start &
SERVER_PID=$!
sleep 3
npx lighthouse http://localhost:3000/meeting --only-categories=accessibility --output=json --output-path=/tmp/sprint1-after-lighthouse.json --chrome-flags="--headless" --quiet
kill $SERVER_PID
jq '.categories.accessibility.score' /tmp/sprint1-after-lighthouse.json
```

Compare to baseline from Task 0:

```bash
echo "Baseline: $(jq '.categories.accessibility.score' /tmp/sprint1-baseline-lighthouse.json)"
echo "After:    $(jq '.categories.accessibility.score' /tmp/sprint1-after-lighthouse.json)"
```

Expected: `After ≥ Baseline` (both should be `1` if baseline was 100). If `After < Baseline`, inspect the Lighthouse report for specific audit failures and fix.

- [ ] **Step 4: Run the grep gates from §9**

```bash
# §9.3 — no hardcoded raw color values in new hero files
grep -nE '#[0-9a-fA-F]{3,8}|rgb\(|oklch\(' \
  src/components/sections/meeting-hero.tsx \
  src/components/mockups/call-widget.tsx \
  src/components/ui/dotted-backdrop.tsx

# §9.4 — no `dark:` Tailwind prefix in new hero files
grep -n 'dark:' \
  src/components/sections/meeting-hero.tsx \
  src/components/mockups/call-widget.tsx \
  src/components/ui/dotted-backdrop.tsx

# §9.6 — DottedBackdrop exists in exactly one place
grep -rn 'function DottedBackdrop' src/
```

Expected:
- §9.3 grep: zero matches **EXCEPT** the highlight-pill arbitrary-value classes in `call-widget.tsx` if they were not tokenized in Task 7. If matches exist, tokenize per the Task 7 note (introduce `--highlight-pill-*` tokens) or accept and document a spec exception in the sprint-close walkthrough.
- §9.4 grep: zero matches.
- §9.6 grep: exactly one match in `src/components/ui/dotted-backdrop.tsx`.

If any gate fails, fix and rerun.

- [ ] **Step 5: Dark-mode visual walkthrough**

Dev server running. Toggle the app's dark mode (navbar theme toggler, if present, or manually set `html` class to `dark` in DevTools). Scroll through `/meeting`:
- Hero badge visible against `bg-background`.
- Headline primary span `text-foreground` reads clearly; muted span `text-muted-foreground` visible but subordinate.
- CTAs: primary visible on dark; ghosts show `hover:bg-muted/50` on hover.
- Widget: backdrop blur visible (CrmTable's inherited `dark:bg-[#27272A]` cells may show through — per §9.5 that's pre-existing debt, not a blocker).
- Shimmer plays (refresh to re-trigger) in dark; bars should be `--muted` dark color.

Expected: hero reads acceptably in dark. No "white flash" from incorrectly-tokenized elements. No `--pattern-dot` regression in bento.

- [ ] **Step 6: Commit any a11y fixes**

If Steps 1–5 required fixes, commit:

```bash
git add -u
git commit -m "fix(meeting-sprint-1): a11y and reduced-motion corrections"
```

Otherwise no commit needed.

---

## Task 12: Bundle-size check + sprint-close walkthrough prep

**Files:** none modified (measurement and handoff).

Acceptance gate §9.9. Also captures the before/after comparison the user needs for the sprint-close visual walkthrough.

- [ ] **Step 1: Rebuild and capture after-bundle size**

```bash
npm run build 2>&1 | tee /tmp/sprint1-after-build.log
```

Record the `/meeting` line's First Load JS value.

- [ ] **Step 2: Compute the delta**

Read both log files and compute:

```bash
BASELINE_KB=$(grep -E '/meeting\b' /tmp/sprint1-baseline-build.log | awk '{print $NF}')
AFTER_KB=$(grep -E '/meeting\b' /tmp/sprint1-after-build.log | awk '{print $NF}')
echo "Baseline: $BASELINE_KB"
echo "After:    $AFTER_KB"
```

Next.js reports First Load JS in `kB`. The acceptance gate is **< 8 KB gzipped** increase. If First Load shows a delta larger than ~8 KB, investigate:
- `motion/react` adds a few KB on first use — but hero already imports it, so no net add.
- `CallWidget`'s shimmer + JSX is ~1–2 KB.
- `DottedBackdrop` extraction is a net neutral (moved, not added).
- `CrmTable` is already in the hero bundle via the backdrop consumption.

If over budget, the most likely culprit is a heavy imported mockup or an unintended dependency pulled in via CallWidget.

- [ ] **Step 3: Capture hero screenshots for the walkthrough**

Start dev server. At 1280 × 800 px, capture full-page screenshot of `/meeting` in light mode (`/tmp/sprint1-hero-light.png`) and dark mode (`/tmp/sprint1-hero-dark.png`). Kill dev server.

- [ ] **Step 4: Prepare sprint-close summary for the user**

Compose a summary message listing:
- Branch: `feat/meeting-redesign-sprint-1`
- Worktree path: `../edfu-landing-sprint-1`
- Commits on branch: `git log feat/multipage-pivot..HEAD --oneline`
- Bundle size delta: from Step 2
- Lighthouse a11y delta: baseline vs after, from Task 11
- Chrome extraction addendum: link to `docs/superpowers/specs/2026-04-17-meeting-sprint-1-hero-addendum.md`
- Screenshots: light + dark PNGs
- Outstanding acceptance gates that still require human sign-off: §9.5 (dark-mode walkthrough), §9.7 (bento visual no-op confirmation)

Pause and ask the user to perform the visual walkthrough and confirm sprint close before proceeding to Task 13.

- [ ] **Step 5: User approval gate**

Do not continue to Task 13 until the user says "sprint-1 approved" / "walkthrough tamam" / equivalent. If the user flags visual regressions, commit fixes and re-run Task 10 / 11 as needed.

---

## Task 13: Pull frontend team's changes, resolve conflicts, push

**Files:** none modified (integration).

Per the project team-context memory, the frontend team is concurrently editing non-meeting pages on `feat/multipage-pivot`. Before pushing the sprint branch, pull their commits in so we push a branch that already contains their work.

- [ ] **Step 1: Fetch latest from remote**

```bash
git fetch origin
```

- [ ] **Step 2: Merge `origin/feat/multipage-pivot` into the sprint branch**

```bash
git merge origin/feat/multipage-pivot
```

Expected outcomes:
- **Clean merge:** no conflicts, merge commit created. Continue to Step 4.
- **Conflicts:** git lists conflicted files.

- [ ] **Step 3: Resolve any conflicts**

For each conflicted file:
1. Open the file and locate `<<<<<<<` markers.
2. Inspect both sides. The sprint branch's changes should be in `src/components/sections/meeting-hero.tsx`, `src/components/mockups/call-widget.tsx`, `src/components/ui/dotted-backdrop.tsx`, `src/app/[lang]/meeting/page.tsx`, `src/app/globals.css`, `src/dictionaries/en.json`, `src/dictionaries/tr.json`, `src/dictionaries/brand-pending.ts`, `src/components/sections/meeting-bento.tsx`, and `docs/superpowers/specs/2026-04-17-meeting-sprint-1-hero-addendum.md`.
3. For conflicts in those files: prefer the sprint branch's version, but carefully integrate any non-overlapping changes the frontend team made (e.g., if they added a new dict key in `en.json`, keep it alongside the sprint branch's new keys).
4. For conflicts in files NOT owned by the sprint (navbar, footer, landing, agents pages, etc.): prefer the frontend team's version (they own that surface).
5. After resolving a file: `git add <file>`.

Run `git status` after each file to track progress. When all conflicts are resolved:

```bash
git merge --continue
```

If conflicts are unresolvable without user judgment, pause and ask the user which side wins.

- [ ] **Step 4: Smoke-test after merge**

```bash
npm run lint && npx tsc --noEmit && npm run build
```

Expected: all clean, build succeeds. If any step fails, investigate — the merge may have introduced a regression from the team's changes that interacts with sprint code.

- [ ] **Step 5: Dev-server regression check**

```bash
npm run dev
```

Open `http://localhost:3000/meeting` — confirm hero still renders correctly. Also spot-check other pages the team may have changed (`/`, `/pricing`, `/integrations`, `/agents`) to confirm nothing is broken globally. Kill dev server.

- [ ] **Step 6: Push the branch**

```bash
git push -u origin feat/meeting-redesign-sprint-1
```

Expected: branch published on origin, tracking set up.

- [ ] **Step 7: Sprint-close wrap-up**

Ask the user whether to open a pull request now (`gh pr create ...`) or leave the branch pushed for manual PR creation. Do not open a PR without explicit user consent — refer to the project's global git-safety protocol.

---

## Self-review checklist

**Spec coverage:**

| Spec section | Task(s) that implement it |
| --- | --- |
| §3.1 In scope — new `MeetingHero` | Task 8 |
| §3.1 — `CallWidget` mockup | Task 7 |
| §3.1 — `DottedBackdrop` shared primitive | Task 3 |
| §3.1 — New CSS tokens | Task 1 |
| §3.1 — Hero CTA button group | Task 8 |
| §3.1 — Dictionary updates + `brand-pending.ts` | Tasks 2, 5, 6 |
| §3.1 — `prefers-reduced-motion` respect | Tasks 1, 7, 11 |
| §3.1 — Responsive pass | Task 10 |
| §3.1 — A11y pass | Task 11 |
| §4.1 — 60/40 grid inside side-rails | Task 8 |
| §4.1.1 — Narrow-phone widget hide | Tasks 8, 10 |
| §4.6 — Two-step token declaration | Task 1 |
| §4.6 — `--pattern-dot` bento parity | Tasks 1, 4 |
| §4.7 — Spring-mount via framer | Task 8 |
| §4.7 — Play-once shimmer | Task 7 |
| §4.7 — `MotionConfig reducedMotion="user"` wrap | Task 8 |
| §5.1 — `MeetingHero` structure | Task 8 |
| §5.2 — `HeroWidgetStage` + CRM backdrop treatment | Task 8 (with Task 6 addendum values) |
| §5.3 — `CallWidget` locked commitments | Task 7 |
| §5.4 — `DottedBackdrop` API | Task 3 |
| §5.5 — Bento migration | Task 4 |
| §5.6 — Dictionary mechanism | Tasks 2, 5 |
| §6 Data flow | Task 9 |
| §9.1 Responsive | Task 10 |
| §9.2 Reduced-motion + widget visibility | Task 11 |
| §9.3 Raw-value grep | Task 11 |
| §9.4 `dark:` grep | Task 11 |
| §9.5 Dark-mode walkthrough | Tasks 11, 12 |
| §9.6 `DottedBackdrop` single source | Task 11 |
| §9.7 Bento visual no-op | Task 4 |
| §9.8 All tokens present | Task 1 |
| §9.9 Bundle size | Tasks 0, 12 |
| §9.10 `BRAND_PENDING_KEYS` | Tasks 2, 6 |
| §9.11 Keyboard tab order | Task 11 |
| §9.12 Lighthouse | Tasks 0, 11 |
| §9.13 Lint | Every task |
| §9.14 Typecheck | Every task |
| §10 Open risk: widget content delta | Task 6 |
| §10 Open risk: mobile legibility | Tasks 8 (widget hide), 10 |
| §10 Open risk: container side-rail | Task 8 (resolved) |
| §10 Open risk: bento migration regression | Task 4 (visual no-op gate) |

**Placeholder scan:** no "TBD" / "fill in later" / "similar to Task N" / "add appropriate error handling" strings. Every step has concrete code or a concrete command. Task 6 and Task 7 explicitly depend on Task 6 extraction output — that's a known data dependency, documented clearly, not a placeholder.

**Type consistency:**
- `MeetingHeroProps.dict` keys (Task 8) match `meetingPage.hero` JSON keys (Task 5).
- `MeetingHeroProps.mockupsDict` shape (Task 8) matches page.tsx call-site (Task 9).
- `CallWidgetDict` interface (Task 7) matches `mockups.callWidget` JSON keys (Task 5).
- `DottedBackdropProps` (Task 3) matches consumer in `MeetingBento` (Task 4).
- `BRAND_PENDING_KEYS` strings (Task 2) are the same keys as JSON paths (Task 5).

**Known plan gaps the implementer must resolve live:**
- Task 7 highlight-pill tokenization decision (introduce tokens vs accept arbitrary values) — spec §9.3 forces a decision once Task 6 addendum data is in hand.
- Task 8 `<Button render={...}>` API confirmation — verify against actual shadcn wrapper before commit.
- Task 10 breakpoint-specific fixes are open-ended because they depend on extraction-driven widget dimensions.

These are documented gaps, not plan failures — they are judgment calls the implementer makes with real data at hand.
