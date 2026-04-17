# Meeting page redesign — 3-sprint roadmap

## Overview

This roadmap decomposes a 9-section PRD for an Attio-parity redesign of the `/meeting` page into three sprint-sized units of work. The decomposition is driven by coupling (what must ship together to be coherent) and by technical risk (the hardest thing first, in isolation). Sprint 1 ships the above-fold experience and extracts the shared visual primitives that Sprints 2 and 3 will consume. Sprint 2 is deliberately a single-section sprint — the sticky scroll-locked feature stage (PRD §3.3) is the crown-jewel interaction and carries most of the technical risk in the PRD. Sprint 3 is a parallelizable "rest of the page" batch that finishes the redesign.

The recently-shipped `MeetingBento` (PRD §3.2) is treated as already done; Sprint 1 only needs to verify the pattern matches the PRD and do a small visual tidy if needed.

**Brand and copy deferral (stated once):** The source PRD references Attio brand names, quotes, and illustrative content (speaker names, company names, testimonial attribution, template labels, etc.) as parity placeholders. These are V1 decoration only. A dedicated brand and localization pass is scheduled **after Sprint 3 closes** and will swap all placeholder strings for Edfu's own brand assets, Turkish copy, and real customer references. Implementers during Sprints 1–3 should leave `// TODO(brand):` markers next to every placeholder string so the later pass can grep them.

## Current state snapshot

### What is live on `/meeting` today

- Meeting-specific hero (centered, single-column, stat strip).
- `MeetingBento` — the new three-card animated section (ships PRD §3.2). Replaces the prior plain three-feature-cards component.
- `ScrollPinnedFeatures` — an existing sticky-pinned features component. Will be **replaced** by the new scroll-locked stage in Sprint 2.
- `NumberedFeatures` — current four-card numbered grid with bare text. Will be **replaced** by the illustrated grid in Sprint 3.
- `IntegrationGrid` — current logo grid. Will be **replaced** by the dashed-arc composition in Sprint 3.
- Static 2×2 templates section. Will be **replaced** by the split layout with live editor preview in Sprint 3.
- Card-wrapped `Testimonial` component. Will be **replaced** by a full-width serif block in Sprint 3.
- `CTA` and `Footer`. CTA gets a dark/charcoal redesign in Sprint 3; footer gets the dotted-wordmark fix in Sprint 3.

### Already-shipped primitives each sprint can reuse

- `src/hooks/use-in-view.ts` — IntersectionObserver hook returning `{ ref, visible }`.
- `src/app/globals.css` keyframes — `rise-fade`, `slide-right`, `pulse-rings`, `bead-flow`, `chip-pop`.
- Attribute-gated selectors — `[data-visible="true"] [data-animate="..."]` pattern.
- `@media (prefers-reduced-motion: reduce)` override scoped inside the same block — motion kill switch is already honored.
- Semantic tokens in `src/app/globals.css` via Tailwind v4 `@theme inline` — `bg-card`, `bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-muted`. No hardcoded light/dark pairs anywhere in the redesign.
- Dotted backdrop pattern (currently inlined inside `MeetingBento`). This is a prime candidate for extraction to a shared utility in Sprint 1.
- Geist font applied globally — no per-element `fontFamily` needed except where a serif display face is introduced (§3.4).

### ✅ Done / ⚠️ Tidy carried into Sprint 1

- ✅ PRD §3.2 three-column cards landed as `MeetingBento` with transcript mini, Meet↔CRM connector, and status feed.
- ⚠️ The PRD's "diagonal stripe" decorative edge detail and "cards touching with dashed vertical dividers, no gap" visual weight are subtler in the current build than in Attio's reference. These are tracked as **Sprint 1 tidy items**, not a fresh spec. If inspection during Sprint 1 shows the current `gap-px bg-border p-px` divider already reads as intended at 1440px+, the tidy is dropped.

## Sprint decomposition

### Sprint 1 — Hero and above-fold polish

**Scope**

- PRD §3.1 — new two-column hero (60/40) with layered CRM-table backdrop + floating product-demo widget, multi-CTA group, bridge headline.
- PRD §3.2 tidy — verify `MeetingBento` matches the PRD pattern; optionally apply the diagonal-stripe edge detail and tighten the divider visual weight.
- Extract shared **`DottedBackdrop`** utility from `MeetingBento` so later sprints can drop it in without re-implementing.
- Introduce global CSS tokens specified in the PRD: `--pattern-dot`, `--pattern-dash-border`, `--surface-hero`, `--text-fade`, `--accent-blue`, `--shadow-float`, motion duration vars. All added to `@theme inline` in `src/app/globals.css`.
- Establish the hero CTA button group pattern (primary + two ghost) that Sprint 3's §3.8 dark CTA will mirror.

**Why this sprint is this size**

The hero and the bento sit in the same visual band of the page; the handoff between them (background color, padding rhythm, CTA treatment) is one design decision, not two. Extracting the dotted-backdrop utility now — while we have two consumers already — prevents drift once Sprints 2 and 3 introduce four more sections that want the same pattern. Keeping it to the above-fold also makes the first visual review cheap: the user can approve everything they see without scrolling.

**Dependencies**

- No upstream sprint dependencies; this is the first sprint.
- Downstream: all later sprints consume the `DottedBackdrop` utility, the new CSS tokens, and the CTA button pattern.

**New shared primitives introduced**

- `DottedBackdrop` component / utility (exact API to be decided in spec).
- Global CSS tokens listed above, added to `src/app/globals.css`.
- Hero CTA button group pattern (primary + 2 ghost), likely a small wrapper or just a documented JSX composition.
- A new `"spring-mount"` keyframe for the floating widget's entry animation (if IntersectionObserver + existing keyframes don't cover it).

**Open design questions**

- How does the hero widget's blurred CRM-table backdrop interact with dark mode? A frosted-glass effect relies on a bright surface underneath — may need a dark-mode fork of the backdrop card.
- Should the "shimmer-loading" bars animate infinitely, pause when off-screen, or play once on mount and stop? Infinite loops bloat CPU and are killed by `prefers-reduced-motion`; a play-once-on-mount version may read more intentionally.
- Where does the bridge headline's two-tone split live — one `<span>` with a muted child, or a CSS gradient text fill? The second is more flexible but fights serif rendering if we ever swap the face.
- Does the widget's equalizer bar need to react to a real audio waveform source, or is a fixed deterministic SVG pattern sufficient? (Parity answer: fixed pattern is fine; confirm.)
- Hero grid split: PRD says 60/40. Does the right column wrap below at `md` or at `lg`? Mobile treatment for the widget is not specified.
- Which "diagonal stripe" pattern does the MeetingBento tidy use — an SVG repeat, a CSS `repeating-linear-gradient`, or a pre-generated PNG? Each trades bundle for fidelity.

**Rough task count and risk signal**

- **Tasks:** medium (roughly 6–9 implementer tasks — hero layout, widget composition, widget animations, CSS tokens, backdrop extraction, bento tidy, responsive pass, a11y pass).
- **Risk:** medium. Hero is mostly composition work; the widget's layered shimmer + spring mount is the only meaningfully new motion work.

**Acceptance gates**

- All animations respect `prefers-reduced-motion`; shimmer and spring-mount degrade to static states.
- Hero is laid out correctly at 320, 768, 1024, 1280, and 1920 px widths.
- No new hardcoded colors outside semantic tokens; all dark-mode states verified manually.
- `DottedBackdrop` is in a standalone module and `MeetingBento` consumes it (no duplicated pattern CSS).
- Bundle size increase under **8 KB gzipped** vs. HEAD of sprint start.
- Lighthouse a11y score on `/meeting` ≥ previous score; keyboard-tab order on hero CTAs is left-to-right.
- All PRD-specified CSS tokens are present in `src/app/globals.css` and referenced by the hero (even if some are consumed later).

---

### Sprint 2 — Sticky scroll-locked feature stage

**Scope**

- PRD §3.3 in isolation — the "One meeting. Unlimited insights." two-column scroll-locked stage with active progress bar, three-stage right panel (Focus Mode speaker rows, transcript with typewriter summary, five-language chat carousel).
- Replace the existing `ScrollPinnedFeatures` component.
- Extract a reusable **`ScrollStage`** primitive (hook + typed state) that could in principle be reused for other pages.

**Why this sprint is this size**

This one section carries more technical risk than the other six combined. The interaction requires scroll-driven stage state, sticky positioning with precise viewport math, cross-fading between three visually heterogeneous panels, and three distinct sub-animations (waveform + toast, typewriter + glow, bubble carousel) each with their own lifecycle. Doing it alongside other sections would either starve it of attention or force other sections to design around an unstable primitive. Pulling it out on its own also means the `ScrollStage` hook is fully designed and stable before Sprint 3 starts — and if Sprint 3 decides a section wants stage-like behavior, the primitive is available.

**Dependencies**

- Sprint 1 must complete — this sprint consumes `DottedBackdrop`, the dashed-frame token, and the motion-duration tokens.
- Downstream: Sprint 3 may optionally consume `ScrollStage` if any of its sections benefit; not a hard dependency.

**New shared primitives introduced**

- `ScrollStage` hook or component (API to be decided in spec — could be a headless hook returning `activeStage: 1 | 2 | 3` given a scroll range, or a full component that accepts `children` for each stage).
- Typewriter utility (likely a small hook; the existing keyframes don't cover character-reveal).
- Per-stage slot components for speaker rows, transcript, and language carousel. These are *specific* to this section but documented as reusable if the patterns recur.

**Open design questions**

- **Scroll behavior:** smooth scroll-driven interpolation between stages, or snap-to-stage (discrete)? Smooth is more immersive; snap is more legible for screen-reader / keyboard users and avoids fractional stage state.
- **Scroll hijacking:** should the stage "capture" scroll so each stage holds for N pixels, or just track natural scroll position? Capturing is the Attio feel but is a known a11y irritant on trackpads and for users with vestibular issues.
- **Typewriter lifecycle:** if the user scrolls past stage 2 before the typewriter completes, does it fast-forward, cancel, or complete off-screen? Same question on reverse scroll: does re-entry restart from scratch or resume?
- **Sticky header collision:** the section uses `top: 120px`. Our navbar is sticky — does the 120px offset already account for it, or does the stage sit under the navbar edge?
- **Reduced-motion fallback:** is the reduced-motion version three stacked static cards (loses the narrative), or a tab-like control that the user clicks to switch (keeps the narrative, adds a control)?
- **Progress bar semantics:** is the 6s-per-stage progress bar purely decorative, or does it drive the underlying scroll position (autoplay)? Autoplay fights user scroll; decoration is safer.
- **Mobile treatment:** sticky two-column doesn't exist on mobile. Does this collapse to three stacked sections, or become a horizontal snap-scroll carousel?

**Rough task count and risk signal**

- **Tasks:** high (roughly 10–14 tasks — the primitive, three stage panels, the left rail with progress bars, scroll wiring, reduced-motion fallback, mobile layout, a11y wiring, responsive pass).
- **Risk:** high. This is the crown jewel; several of the open questions above can invalidate hours of work if decided wrong.

**Acceptance gates**

- All three stages are keyboard-reachable; `role="region"` and stage transitions are announced appropriately.
- Reduced-motion fallback is designed and verified — no infinite animations and the stage content is still consumable.
- Scroll behavior on trackpad, mouse wheel, and touch all feel acceptable (subjective but explicitly reviewed).
- Section is usable at 320 px width via the chosen mobile fallback (stacked or carousel).
- `ScrollStage` primitive is covered by at least one unit test (or a rendering smoke test) if feasible within the sprint.
- No new hardcoded colors; all motion kill-switched by `prefers-reduced-motion`.
- Bundle size increase under **14 KB gzipped** vs. HEAD of sprint start (motion code is heavier here).
- Removes or archives the old `ScrollPinnedFeatures` consumer on `/meeting`.

---

### Sprint 3 — Remaining sections

**Scope**

- PRD §3.4 — full-width serif testimonial.
- PRD §3.5 — dashed-arc integrations composition (Zoom / Meet / Teams → Edfu monogram).
- PRD §3.6 — templates split layout with chip tab bar and live editor preview.
- PRD §3.7 — numbered `[01]`–`[04]` feature cards with illustrated heads.
- PRD §3.8 — dark final CTA with trust row.
- PRD §3.9 — footer dotted-wordmark full-width fix and optional scroll parallax.

**Why this sprint is this size**

These six sections are largely independent: the arc doesn't share state with the templates, the templates don't share state with the CTA. They can be implemented in parallel within the sprint if we want to dispatch parallel subagents. They're batched together because each one is small-to-medium on its own and splitting the batch further would fragment review and waste context. The sprint is sized so that if we decide mid-sprint to split it (see "possible split" below), we can do so without having committed to irreversible coupling.

**Possible split (if Sprint 3 proves too heavy):**

- **Sprint 3.a** — §3.4 testimonial, §3.5 arc, §3.9 footer (three small decorative sections).
- **Sprint 3.b** — §3.6 templates, §3.7 numbered cards, §3.8 dark CTA (three content-heavy sections).

My recommendation is to start Sprint 3 as a single batch and split only if the actual implementation load during the plan phase signals it's too heavy to land in one review loop.

**Dependencies**

- Sprint 1 must complete — this sprint consumes `DottedBackdrop`, the dashed-border token, and the CTA button pattern.
- Sprint 2 is not strictly required but should merge first to keep the page coherent during review.
- Downstream: no further sprints. The brand and localization pass follows.

**New shared primitives introduced**

- Chip tab bar (used by §3.6; likely reusable for future pages).
- "Illustration card" layout shell for §3.7's four cards.
- Dashed-arc SVG primitive with traveling-pulse animation for §3.5.
- Dark section background with radial glow for §3.8 (may become a reusable dark-section utility).

**Open design questions**

- **Serif font choice (§3.4):** Canela and Tiempos are not licensed in the project. Do we self-host an open-source alternative (EB Garamond, Playfair Display, Fraunces), or accept a system serif stack as the V1 placeholder until the brand pass?
- **Arc path math (§3.5):** three logos → one monogram; is the arc a single SVG `path` with three pulses offset in phase, or three separate paths each with their own pulse? Former is cleaner; latter is easier to stagger independently.
- **Live editor preview (§3.6):** is the "editor" real content (with real section bodies for each template) or stylized lorem? Real content bloats the bundle by the number of templates × size; stylized lorem is cheaper but is placeholder-y.
- **Chip tab behavior (§3.6):** on tab change, does the editor slide-fade or hard-cross-fade? Slide is showier; fade is calmer and matches the rest of the page.
- **Numbered card illustrations (§3.7):** four distinct mini-mocks at ~300 px. Are these inlined JSX or pre-rendered SVG assets? JSX keeps them stylable by tokens; SVG is lighter.
- **Dark CTA gradient (§3.8):** do we introduce new `--surface-dark-cta` tokens, or reuse an existing muted token at reduced alpha? Introducing new tokens risks dark-mode interaction.
- **Footer parallax (§3.9):** is parallax on the dotted "Edfu" wordmark worth the motion cost, or does full-width alone satisfy the PRD? Parallax on scroll is noticeable on mobile battery.
- **Per-section ordering:** final on-page order of §3.4 through §3.9 relative to §3.3. PRD implies §3.4 follows §3.3, but the testimonial could also sit lower.

**Rough task count and risk signal**

- **Tasks:** high (roughly 14–20 tasks across six sections; smaller individually but many of them).
- **Risk:** medium. Each section is low-risk on its own; the risk is cumulative review burden and the serif-font licensing gap.

**Acceptance gates**

- Every new section consumes `DottedBackdrop` and CSS tokens from Sprint 1 rather than re-implementing.
- Serif font fallback is documented even if the final face is deferred to the brand pass.
- All arc/pulse/orbital animations respect `prefers-reduced-motion`.
- Every section is laid out correctly at 320, 768, 1024, 1280, 1920 px.
- Dark CTA section passes contrast on all text/trust-row content.
- Chip tab bar is a proper `role="tablist"` with correct `aria-controls` and `aria-selected`.
- All placeholder copy is marked with `// TODO(brand):` so the brand pass can grep them.
- Bundle size increase under **20 KB gzipped** vs. HEAD of sprint start.
- Lighthouse a11y score on `/meeting` ≥ previous score.
- No new hardcoded colors outside semantic tokens.

## Risks and mitigations

- **Bundle size creep from motion code.** Three sprints of new keyframes, hooks, and animated SVGs add up. **Mitigation:** per-sprint gzipped-size budget (stated in each acceptance gate), plus a shared primitive policy — if a pattern appears twice, extract it.
- **Scroll-hijacking a11y concerns (Sprint 2).** The scroll-locked stage is the most accessibility-sensitive piece of the redesign. **Mitigation:** reduced-motion fallback is a gate, not a nice-to-have; Sprint 2 spec must answer the "smooth vs. snap" question before the plan phase.
- **Dark-mode audit burden.** Six new sections and a hero all need dark-mode verification. **Mitigation:** per-sprint dark-mode pass is part of acceptance gates; no hardcoded colors policy keeps the surface area small.
- **Brand/IP swap burden at end.** Every placeholder string left un-marked risks being missed in the brand pass. **Mitigation:** convention — every placeholder is flagged with `// TODO(brand):`. Sprint close review checks `git grep 'TODO(brand):'` count against expected.
- **Serif font licensing gap (§3.4).** Canela / Tiempos are not in the project. **Mitigation:** Sprint 3 spec proposes an open-source fallback (Fraunces or EB Garamond) and self-hosts it via `next/font/google`; real licensed face lands in the brand pass.
- **`"use client"` proliferation.** Hero widget shimmer/typewriter, scroll stage, chip tabs, and pulsing arcs all require client components. **Mitigation:** keep each interactive piece as a small leaf client component so the RSC boundary is as deep in the tree as possible. Server-rendered parents stay server components.
- **Reduced-motion coverage drift.** With this many animations it's easy to miss one. **Mitigation:** each sprint's acceptance gate explicitly lists reduced-motion verification; code review checklist includes a grep for unguarded `animation-*` usage.
- **Mobile parity.** The PRD is desktop-first. **Mitigation:** each sprint spec must include a "mobile design" section before the plan phase — not an afterthought during implementation.

## Execution model

**Workflow per sprint.** Each sprint follows the superpowers pipeline: `brainstorming` to resolve the open design questions → `writing-plans` to produce the implementation plan → `subagent-driven-development` (or `executing-plans` if a single agent is preferred) for the build → `requesting-code-review` before merge. Sprint 2 will likely need a longer brainstorming phase given the density of open questions.

**Branch strategy.** One branch per sprint, branched off `feat/multipage-pivot`: `feat/meeting-redesign-sprint-1`, `feat/meeting-redesign-sprint-2`, `feat/meeting-redesign-sprint-3`. Each sprint merges back into `feat/multipage-pivot` on close (squash or merge is author's choice). After all three sprints close and the brand pass completes, `feat/multipage-pivot` → `main`.

**Review cadence.** Spec review before plan, plan review before execution, per-task code review during execution — all as per existing project conventions. Between sprints, the user performs a visual walkthrough of the live `/meeting` page before approving sprint close. The walkthrough is the non-negotiable inter-sprint checkpoint.

**Memory and context management.** Once this roadmap is approved, project memory gets a `redesign-in-progress` entry noting "Sprint 1 active" and the current roadmap path. Memory is updated at each sprint close (including the output of the visual walkthrough). `/compact` is expected between sprints to keep the working context lean, since each sprint will accumulate substantial tool output.

## Timeline estimate

Based on the `MeetingBento` pace (9 commits over roughly 4 hours of focused work plus thinking time), the following are coarse estimates only. Real time will depend on how many brainstorming loops each sprint needs and how much parallel subagent work we do.

| Sprint | Scope summary | Calendar-day estimate | Confidence |
|---|---|---|---|
| Sprint 1 | Hero + bento tidy + shared primitives | 1.5 – 3 days | Medium — composition-heavy, low motion risk |
| Sprint 2 | Sticky scroll-locked stage | 3 – 6 days | Low — crown-jewel interaction with the most open questions |
| Sprint 3 | 6 remaining sections | 3 – 5 days | Medium — many sections but low per-section risk |
| Brand pass (post-Sprint 3, not covered here) | Placeholder swap + i18n | Separate effort | N/A |
| **Total** | **Sprint 1 → Sprint 3 close** | **~8 – 14 days** | Coarse; do not treat as commitment |

The estimate includes spec and plan writing, review cycles, and visual walkthrough checkpoints — not just implementation time.

## Out of scope

- Full Turkish localization of `/meeting` (deferred to the brand and localization pass after Sprint 3).
- Replacement of placeholder brand names, quotes, speaker identities, or company references (same deferral).
- Changes to other pages — `/integrations`, `/pricing`, `/agents`, landing — are explicitly not touched by this roadmap.
- Backend, CMS, or content-source changes. All copy and content remain in the existing page source files.
- A/B testing infrastructure for the redesign.
- Analytics or event instrumentation for the new interactions.
- Dark-mode palette refinements beyond "existing semantic tokens must keep working." Token-level redesign is a separate effort.
- Replacing the existing Geist font with the licensed serif faces (Canela / Tiempos); see the Risks section for the fallback plan.
- Any animation tooling beyond what's already in place (no new motion library, no Framer Motion introduction unless a sprint spec explicitly justifies it).

## Next steps

1. User reviews this roadmap and the proposed sprint boundaries.
2. User approves the cut as-is, or requests a different boundary (e.g. pre-emptively splitting Sprint 3 into 3.a / 3.b).
3. On approval: update project memory (`redesign in progress, Sprint 1 active, roadmap at docs/superpowers/specs/2026-04-17-meeting-redesign-roadmap.md`), `/compact`, then begin Sprint 1 with `superpowers:brainstorming` against PRD §3.1.
