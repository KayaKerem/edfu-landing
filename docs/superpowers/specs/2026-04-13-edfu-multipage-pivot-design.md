# Edfu Multi-Page Pivot Design Spec

## Context

Edfu is pivoting from a pure AI knowledge base (RAG) platform to a **multi-channel AI customer communication and automation platform**. The product now includes:

- **Multi-channel inbox**: WhatsApp, Instagram, Telegram, Website Form, Email
- **AI Agents**: Conversation, Proposal, Research, Meeting, RAG
- **Workflow**: Customer message → AI conversation → Research → Proposal → Lead capture
- **Meeting Intelligence**: Meeting recording, transcription, action items → feeds RAG agent
- **Company Memory (RAG)**: Internal knowledge base for employees, fed by meetings and documents

Design patterns are adapted from [Attio.com](https://attio.com) — specifically their homepage, /platform/workflows, /platform/ai, and /platform/call-intelligence pages.

## Architecture: Single Page → Multi-Page

Current: Single landing page with all sections.
New: 5 pages with shared navbar and footer.

### Site Map

```
/                  → Ana Sayfa (Homepage)
/agents            → Agent Showcase (NEW)
/meeting           → Meeting Agent (NEW) — Attio Call Intelligence equivalent
/integrations      → Integration Grid + Data Flow (NEW)
/pricing           → Pricing (MOVED from homepage)
```

All routes use existing `[lang]` dynamic segment for TR/EN i18n support.

### Navbar Update

```
Current:  Ana Sayfa | Ozellikler | Nasil Calisir | Fiyatlandirma
New:      Ana Sayfa | Agent'lar  | Toplanti      | Entegrasyonlar | Fiyatlandirma
```

**BREAKING CHANGE: Full navbar refactor required.** Current navbar uses `#hash` links + `IntersectionObserver` for single-page scroll navigation. Must be rewritten to:
- Replace hash links (`#hero`, `#features`) with Next.js `<Link>` components (`/agents`, `/meeting`, etc.)
- Replace `IntersectionObserver`-based active section detection with `usePathname()` for active page detection
- Animated pill indicator preserved but repositioned based on active route instead of scroll position
- Mobile hamburger menu updated with new page links
- On homepage only: retain hash-based smooth scroll for in-page sections (Bento, Security, etc.)

---

## Page 1: Ana Sayfa (/)

### Sections (top to bottom)

1. **Navbar** — Updated links to new pages
2. **Hero** — Updated copy for pivot. Empty browser mockup placeholder filled with an animated mini flow diagram showing: channels (WhatsApp, IG, Telegram, Web) → Edfu AI → outputs (Conversation, Proposal, Lead)
3. **Logos** — Replace AI model logos with channel + meeting tool logos (WhatsApp, Instagram, Telegram, Slack, Teams, Meet, Zoom)
4. **Bento Features (RAG)** — KEPT AS-IS. "Sirketinizin Dijital Hafizasini Olusturun" section stays. It explains the RAG agent / company memory functionality which is still core to the pivot.
5. **Flow Diagram (NEW)** — Replaces "How It Works". Attio workflow node card pattern with SVG connectors. Shows: Trigger (customer message) → Conversation Agent → Condition (qualified?) → Branch: Yes (Research Agent → Proposal Agent) / No (inform & redirect)
6. **Testimonial** — KEPT AS-IS
7. **AI Gradient Feature Card (NEW)** — Attio AI hero card pattern. Rotating conic-gradient border with @property CSS animation. Shows AI decision-making mockup: "Does this customer match our ICP?" → AI response with qualification result.
8. **Security** — KEPT AS-IS. "Kurumsal Duzeyde Altyapi" with KVKK, GDPR badges.
9. **Marquee Testimonials** — KEPT AS-IS
10. **CTA** — KEPT AS-IS
11. **Footer** — Updated with new page links

### Removed from Homepage
- **How It Works ("Uc Adimda Baslayin")** — Replaced by Flow Diagram
- **Pricing** — Moved to /pricing
- **FAQ** — Moved to /pricing

---

## Page 2: /agents

Attio's /platform/workflows + /platform/ai combined. Showcases all 5 AI agents.

### Sections

1. **Hero** — "Otomatiklestirin. Arastirin. Satin." Badge: "AI Agent Ekosistemi". Staggered entry animation (badge 1.1s, h2 1.2s, p 1.3s, buttons 1.4s, cubic-bezier(0.2, 0, 0, 1)).

2. **Tab Navigation + Content Swap** — 5 tabs:
   - **Konusma Agenti**: Left text (features with checkmarks) + Right mockup (WhatsApp chat UI with AI responses, lead qualification badge)
   - **Teklif Agenti**: Left text + Right mockup (Proposal PDF preview, AI-generated content)
   - **Arastirma Agenti**: Left text + Right mockup (Company research card with web data, similar to Attio's "Deploy AI" card)
   - **Toplanti Agenti**: Left text + Right mockup (Meeting summary with action items)
   - **RAG Agenti**: Left text + Right mockup (Knowledge base search interface)
   
   Tab active state: bottom border 2px solid. Content transition: opacity 0→1, translateY 10px→0 with 0.3s ease.

3. **Numbered Features [01]-[04]** — Geist Mono numbering (already available in the project, no extra font dependency). Features:
   - [01] Instant customer response — 24/7 active
   - [02] Automatic lead qualification — AI analysis
   - [03] Deep research — Internet research before proposals
   - [04] Company memory creation — Meetings + docs feed RAG

4. **Agent Ecosystem Flow Diagram (Data Model Viz)** — Full data flow visualization. This is the same component as Data Model Viz on /integrations but with a different configuration: here it shows the agent ecosystem relationships, while on /integrations it shows the full source-to-output pipeline. Shared component: `data-model-viz.tsx` with configurable nodes and connections. Left column: input sources (channels + meeting tools). Center: 5 agents with gradient borders. Right column: outputs (Lead, Proposal PDF, Customer Report, Meeting Summary, Knowledge Base). Animated SVG connectors between columns.

5. **CTA Banner** — Dark background. "Agent'larinizi simdi olusturun."

---

## Page 3: /meeting

Direct equivalent of Attio's /platform/call-intelligence.

### Sections

1. **Hero** — Badge: "Toplanti Agenti" with green dot. "Daha akilli toplantilar, basindan sonuna." Dual mockup: left (meeting list with color-coded borders) + right (call player with progress bar, Ozet/Transkript/Aksiyonlar tabs, summary content).

2. **3 Feature Cards** — 3-column equal grid (Attio "From hello to handoff" pattern):
   - Automatic recording & transcription (Zoom, Meet, Teams)
   - No lost meeting notes (auto-linked to records)
   - Feeds company memory (RAG agent)

3. **Scroll-Pinned Sticky Section** — "Bir toplanti. Sinirsiz icerik." position: sticky, scroll-driven content change. Left: feature text with opacity transitions. Right: matching visual (action items, transcript, language options). Features:
   - Focus on decision-maker
   - Leave every meeting with a plan (action items with assignees)
   - 100+ language transcription
   
   Total scroll distance: ~2000px. Sticky top: navbar height + spacing.

4. **Numbered Features [01]-[04]** — Post-meeting automation:
   - [01] Automatic customer signal detection
   - [02] Coach team with context
   - [03] Seamless handoffs (clips, summaries)
   - [04] Auto-feed RAG agent

5. **Integration Logos** — "Aninda senkronizasyon. Sifir kurulum." Zoom, Google Meet, MS Teams cards.

6. **Testimonial** — Dark section quote about meeting agent.

---

## Page 4: /integrations

Integration Grid + Data Model Visualization combined.

### Sections

1. **Hero** — "Tum kanallariniz. Tek platform."

2. **[01] Messaging Channels Grid** — 6 cards (Attio integration card pattern: 40x40 icon + H3 + description, border 1px solid, border-radius 12px, padding 20px, hover shadow increase):
   - WhatsApp (green, Business API)
   - Instagram (gradient, DM + story replies)
   - Telegram (blue, bot integration)
   - Web Form (dark, embedded widget)
   - Email (red, AI classification)
   - Webhook (dashed border, custom integration)

3. **[02] Meeting Tools Grid** — 3 cards:
   - Zoom
   - Google Meet
   - MS Teams

4. **[03] Business Tools Grid** — 8 cards (4-column):
   - Drive (documents)
   - Notion (wiki & notes)
   - Slack (messaging)
   - CRM (customer data)
   - ERP (business processes)
   - Jira (project management)
   - HubSpot (marketing)
   - + API (custom, dashed border)

5. **Data Model Visualization** — 3-column flow diagram:
   - Left: Source cards (WhatsApp, Instagram, Telegram, Zoom/Meet, Drive/Notion, CRM/ERP)
   - Center: Edfu AI hub with rotating gradient border (conic-gradient), containing 5 agent badges
   - Right: Output cards (Qualified Lead, Proposal PDF, Customer Report, Meeting Summary, Knowledge Base)
   - Animated SVG connectors between columns (stroke-dashoffset animation)

6. **CTA Banner** — Dark. "Tum kanallarinizi baglayin."

---

## Page 5: /pricing

Existing pricing section moved to dedicated page.

### Sections

1. **Hero** — "Isletmenize uygun plan secin."
2. **Pricing Cards** — Existing 3-tier structure (Starter / Pro / Enterprise) with monthly/yearly toggle. KEPT AS-IS.
3. **FAQ** — Moved from homepage. Existing accordion component.
4. **CTA** — Standard CTA banner.

---

## Attio Design Patterns Used

### 1. Flow Diagram (Workflow Node Cards)
- **Source**: Attio homepage [01] Powerful Platform section + /platform/workflows hero
- **CSS**: `.flow-node-card` — white bg, border 1px solid rgba(46,50,56,0.07), border-radius 12px, subtle box-shadow
- **Connectors**: SVG paths with stroke #D1D3D6, animated via stroke-dasharray: 1 + stroke-dashoffset: 1→0
- **Animation**: Staggered entry — each node 0.2s delay, connectors draw after nodes appear
- **Used in**: Homepage (section 5), /agents (section 4)

### 2. Tab Navigation + Content Swap
- **Source**: Attio homepage hero tabs + /platform/workflows "Automate your way" section
- **Active tab**: bottom border 2px solid --color-black-100, text weight 500
- **Content transition**: opacity 0→1, translateY 10px→0, duration 0.3s
- **Tab transition**: color 0.3s cubic-bezier(0.2, 0, 0, 1)
- **Used in**: /agents (section 2)

### 3. AI Gradient Border
- **Source**: Attio /platform/ai hero card
- **Technique**: Dual background with background-clip — linear-gradient(white,white) padding-box + conic-gradient(...) border-box, border: 2px solid transparent
- **Animation**: @property --ai-hero-box-gradient-angle (syntax: "<angle>"), @keyframes spin 0→360deg, 4s linear infinite
- **Glow**: box-shadow rgba(255,255,255,0.74) 0px 0px 6px 12px
- **Used in**: Homepage (section 7), /integrations (Data Model center hub)

### 4. Integration Grid
- **Source**: Attio /platform/workflows integration section
- **Card structure**: Icon (40x40, border-radius 10px) + H3 (14px, weight 600) + P (11px, muted) — border 1px solid, border-radius 12px, padding 20px
- **Hover**: subtle shadow increase
- **Sections numbered**: [01] [02] [03] with Geist Mono
- **Used in**: /integrations (sections 2-4)

### 5. Data Model Visualization
- **Source**: Attio homepage [02] Adaptive Model section
- **Card connections**: SVG lines with animated drawing (stroke-dashoffset)
- **Card style**: white bg, border 1px solid, border-radius 12px
- **Flow**: left sources → center hub → right outputs
- **Used in**: /integrations (section 5), /agents (section 4)

### 6. Scroll-Pinned Sticky Section
- **Source**: Attio /platform/call-intelligence "One conversation. Limitless insights."
- **CSS**: position: sticky, top: navbar height + spacing
- **Implementation**: JS-based IntersectionObserver with opacity transitions (NOT CSS Scroll-Driven Animations API — limited browser support). Multiple sentinel elements trigger content changes as user scrolls through the tall container.
- **Behavior**: Scroll drives content change — left text opacity transitions, right visual swaps
- **Total scroll distance**: ~2000px
- **Used in**: /meeting (section 3)

---

## Technical Implementation Notes

### Infrastructure Updates (CRITICAL — must be done before page work)

#### 1. Navbar Refactor
Current `src/components/sections/navbar.tsx` is built entirely around single-page hash navigation:
- `navLinks` array uses `href: "#hero"`, `href: "#features"` etc.
- `IntersectionObserver` tracks scroll position for active section
- `isClickScrolling` state manages scroll-to-section behavior
- Pill indicator animates based on observed section

**Required changes:**
- Replace `navLinks` with route-based links using Next.js `<Link>` component
- Replace `IntersectionObserver` active detection with `usePathname()` hook
- Pill indicator positions based on active route, not scroll
- Homepage retains in-page smooth scroll for its own sections (dual behavior)
- Mobile menu updated with new page links + close-on-navigate

#### 2. Language Switcher Fix
Current `src/components/language-switcher.tsx` line 8-9 hardcodes:
```ts
window.location.href = targetLocale === "en" ? "/en" : "/"
```
This breaks on sub-pages: switching from `/en/agents` to TR sends user to `/` instead of `/agents`.

**Required change:** Preserve current pathname when switching locale:
```ts
const currentPath = window.location.pathname.replace(/^\/(en|tr)/, '')
window.location.href = targetLocale === "en" ? `/en${currentPath}` : currentPath || "/"
```

#### 3. Middleware/Proxy Update
Current `src/proxy.ts` only handles root path. New routes must work with locale detection:
- `/agents` → rewrite to `/tr/agents` (Turkish default)
- `/en/agents` → serve as-is
- Verify all new routes work with existing cookie-based locale detection

#### 4. Sitemap Update
Current `src/app/sitemap.ts` only lists root URL. Add all new pages:
- `/agents`, `/meeting`, `/integrations`, `/pricing`
- Each with TR and EN alternates (hreflang)

#### 5. SEO Metadata Per Page
Current `generateMetadata` in layout.tsx returns global metadata. Each new page needs:
- Unique title, description, OG image
- Page-specific JSON-LD schema (move FAQPage schema to /pricing)
- Canonical URLs with hreflang alternates

#### 6. Legacy URL Handling
Old hash-based URLs (`/#pricing`, `/#how-it-works`) may exist in shared links. Consider:
- Homepage script that checks hash on load and redirects (e.g., `/#pricing` → `/pricing`)
- Or accept that old links land on homepage (acceptable for a pivot)

### Routing
- New routes: `src/app/[lang]/agents/page.tsx`, `src/app/[lang]/meeting/page.tsx`, `src/app/[lang]/integrations/page.tsx`, `src/app/[lang]/pricing/page.tsx`
- Each page gets `generateStaticParams()` for TR/EN
- Layout shared via existing `[lang]/layout.tsx`

### i18n
- New keys added to `src/dictionaries/tr.json` and `en.json` for all new page content
- **Dictionary key structure** — top-level keys per page to keep things organized:
```
dict.agentsPage.hero.title
dict.agentsPage.hero.description
dict.agentsPage.tabs.conversation.title
dict.agentsPage.tabs.conversation.features
dict.meetingPage.hero.title
dict.meetingPage.stickySection.features
dict.integrationsPage.hero.title
dict.integrationsPage.channels.[name]
dict.pricingPage.hero.title
```
- Existing keys (`dict.hero`, `dict.pricing`, etc.) remain for homepage sections
- Consider splitting into per-page dictionary files if total exceeds ~800 keys (lazy load optimization)

### New Components

**Shared/Reusable:**
- `src/components/sections/numbered-features.tsx` — Reusable [01]-[04] numbered feature list (used in /agents AND /meeting)
- `src/components/sections/page-cta.tsx` — Parametric CTA banner (dark bg, configurable title/description/buttons, used on every page)
- `src/components/sections/data-model-viz.tsx` — Configurable source → hub → output flow (used in /agents AND /integrations with different node configs)
- `src/components/ui/flow-node.tsx` — Individual workflow node card
- `src/components/ui/svg-connector.tsx` — Animated SVG connector line
- `src/components/ui/gradient-border.tsx` — Reusable rotating gradient border wrapper

**Page-specific:**
- `src/components/sections/flow-diagram.tsx` — Homepage workflow visualization (vertical layout)
- `src/components/sections/agent-tabs.tsx` — Tab navigation with 5 agent content panels
- `src/components/sections/ai-gradient-card.tsx` — Rotating gradient border feature card
- `src/components/sections/integration-grid.tsx` — Categorized integration card grid
- `src/components/sections/scroll-pinned-features.tsx` — Sticky scroll-driven section (IntersectionObserver-based)
- `src/components/sections/meeting-hero.tsx` — Meeting list + call player mockup

**New SVG Icons needed** (in `src/components/ui/svgs/`):
- whatsapp.tsx, instagram.tsx, telegram.tsx, zoom.tsx, google-meet.tsx, ms-teams.tsx, hubspot.tsx, jira.tsx, email.tsx, webhook.tsx
- Light/dark variants following existing pattern (e.g., claude.tsx, chatgpt.tsx)

### Animation Stack
- **Framer Motion (motion)**: Entry animations, staggered reveals, layout transitions
- **CSS @keyframes**: Gradient spin (4s linear infinite), SVG connector drawing
- **CSS @property**: `--gradient-angle` for animatable conic-gradient rotation. **Fallback**: For browsers without @property support, use motion library's `useMotionValue` + `useTransform` to drive the angle via JS. Wrap in `@supports` check.
- **IntersectionObserver**: Scroll-pinned section content triggers, navbar active state (on homepage)

### Dark Mode Considerations
All Attio patterns reference light theme colors (white bg cards, light borders). Each new component needs dark mode variants using existing convention:
- Card backgrounds: `bg-white dark:bg-[oklch dark variant]`
- Borders: `border-[light] dark:border-[dark]`
- SVG connector strokes: adapt to dark theme
- Gradient border glow: adjust box-shadow for dark backgrounds
- Follow existing patterns in `bento-features.tsx` and `security.tsx` for reference

### Existing Stack Preserved
- Next.js 16.2.1 (App Router, Turbopack)
- Tailwind CSS 4 (oklch color palette, @theme)
- Geist font family + Geist Mono (for numbered sections)
- shadcn/ui components (accordion, badge, button)
- motion library for animations
- next-themes for dark/light mode
- Vercel Analytics + Speed Insights

### Pages Affected
- `src/app/[lang]/page.tsx` — Remove How It Works, Pricing, FAQ. Add Flow Diagram, AI Gradient Card.
- `src/components/sections/navbar.tsx` — **Full refactor**: hash links → route links, IntersectionObserver → usePathname()
- `src/components/sections/footer.tsx` — Update links
- `src/components/sections/hero.tsx` — Update copy + fill browser mockup with flow diagram
- `src/components/sections/logos.tsx` — Replace AI model logos with channel logos
- `src/components/language-switcher.tsx` — Preserve current path on locale switch
- `src/proxy.ts` — Support new routes with locale detection
- `src/app/sitemap.ts` — Add all new pages
- `src/app/[lang]/layout.tsx` — Refactor metadata to support per-page overrides

### Implementation Order (Dependency Graph)
```
Phase 1 — Infrastructure (no visual changes):
  ├── Navbar refactor (hash → routes)
  ├── Language switcher fix
  ├── Middleware/proxy update
  └── Sitemap + metadata scaffolding

Phase 2 — Shared components:
  ├── flow-node.tsx + svg-connector.tsx + gradient-border.tsx
  ├── numbered-features.tsx (reusable)
  ├── page-cta.tsx (reusable)
  └── data-model-viz.tsx (reusable)

Phase 3 — Pages (can be parallelized):
  ├── /pricing (simplest — move existing sections)
  ├── Homepage updates (hero, logos, flow diagram, AI gradient card)
  ├── /agents (agent-tabs, flow diagram config)
  ├── /meeting (meeting-hero, scroll-pinned, feature cards)
  └── /integrations (integration-grid, data-model-viz config)

Phase 4 — Polish:
  ├── Dark mode for all new components
  ├── i18n — EN translations
  ├── SEO metadata per page
  ├── Legacy URL handling
  └── SVG icon light/dark variants
```
