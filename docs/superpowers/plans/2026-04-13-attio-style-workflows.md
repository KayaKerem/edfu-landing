# Attio-Style Workflow Redesign Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign all workflow/data-model visualizations (FlowNode, FlowDiagram, DataModelViz, SvgConnector) to match Attio.com's exact design language — card style, colors, fonts, connector lines, dot-grid backgrounds.

**Architecture:** Replace current shadcn-inspired flow cards with Attio's DataModelCard pattern (white bg, `#EDEFF3` borders, `rounded-[10px]`, attribute rows with small icons, badges). Replace hub-and-spoke DataModelViz with a 2×2 grid of data-model cards connected by SVG bezier paths. Add dot-grid backgrounds to all visualization sections.

**Tech Stack:** Next.js 16, Tailwind CSS 4, React 19, `motion/react` for animations

---

## Attio Design Tokens Reference

| Token | Light | Dark |
|-------|-------|------|
| Card border | `#EDEFF3` | `#2E3238` |
| Card shadow | `0px 2px 3px -2px rgba(16,24,40,0.08)` | `0px 2px 3px -2px rgba(0,0,0,0.3)` |
| Card radius | `rounded-[10px]` lg:`rounded-xl` | same |
| Card bg | `#FFFFFF` | `#1C1C1F` |
| Primary text | `#0F172A` | `#F1F5F9` |
| Secondary text | `#475467` | `#94A3B8` |
| Tertiary/muted | `#98A2B3` | `#64748B` |
| Connector stroke | `#E4E7EC` | `#334155` |
| Connector width | `1` | `1` |
| Connector easing | `cubic-bezier(0.2,0,0,1)` | same |
| Dot grid | `radial-gradient(#E4E7EC 1px, transparent 1px)` 16px | `radial-gradient(#334155 1px, transparent 1px)` 16px |
| Dashed border | `#D0D5DD` | `#475569` |
| Badge standard bg | `#F9FAFB` | `#27272A` |
| Badge standard text | `#475467` | `#94A3B8` |
| Badge standard border | `#EDEFF3` | `#2E3238` |
| Badge custom bg | `#F9F5FF` | `#2D1B69` |
| Badge custom text | `#6941C6` | `#A78BFA` |
| Attr icon stroke | `#98A2B3` | `#64748B` |
| Section bg | `#FFFFFF` | `#09090B` |

---

## File Structure

| File | Action | Purpose |
|------|--------|---------|
| `src/components/ui/svg-connector.tsx` | Rewrite | Attio connector style: `#E4E7EC` stroke, width 1, animated dash-offset, cubic-bezier easing |
| `src/components/ui/flow-node.tsx` | Rewrite | Attio card: white bg, `#EDEFF3` border, `rounded-[10px]`, attribute rows, badges, dark mode |
| `src/components/sections/flow-diagram.tsx` | Rewrite | SVG path connectors between nodes, dot-grid bg, Attio colors |
| `src/components/sections/data-model-viz.tsx` | Rewrite | 2×2 grid of DataModelCards, SVG bezier connectors, dot-grid bg, data table |
| `src/app/[lang]/agents/page.tsx` | Modify | Update DataModelViz props for new API |
| `src/app/[lang]/integrations/page.tsx` | Modify | Update DataModelViz props for new API |
| `src/dictionaries/tr.json` | Modify | Add data model card attributes dict keys |
| `src/dictionaries/en.json` | Modify | Add data model card attributes dict keys |

---

### Task 1: Rewrite SvgConnector to Attio Style

**Files:**
- Rewrite: `src/components/ui/svg-connector.tsx`

- [ ] **Step 1: Rewrite SvgConnector component**

Replace the current implementation with Attio's connector pattern:
- Stroke color: `#E4E7EC` (light) / `#334155` (dark)
- Stroke width: 1
- Animation: stroke-dasharray + stroke-dashoffset with `cubic-bezier(0.2,0,0,1)` easing
- Accept `from`/`to` points OR a raw `d` path string
- Duration: 1.2s default
- Support `delay` prop

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

interface SvgConnectorProps {
  /** Either provide from/to for auto-bezier, or d for a custom path */
  from?: { x: number; y: number };
  to?: { x: number; y: number };
  d?: string;
  animated?: boolean;
  delay?: number;
  duration?: number;
  className?: string;
}

export function SvgConnector({
  from,
  to,
  d: customPath,
  animated = true,
  delay = 0,
  duration = 1.2,
  className,
}: SvgConnectorProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const [length, setLength] = useState(0);

  const d =
    customPath ??
    (from && to
      ? `M ${from.x} ${from.y} C ${(from.x + to.x) / 2} ${from.y}, ${(from.x + to.x) / 2} ${to.y}, ${to.x} ${to.y}`
      : "");

  useEffect(() => {
    if (pathRef.current) {
      setLength(pathRef.current.getTotalLength());
    }
  }, [d]);

  return (
    <path
      ref={pathRef}
      d={d}
      fill="none"
      className={className}
      stroke="#E4E7EC"
      strokeWidth="1"
      strokeDasharray={animated && length ? length : undefined}
      strokeDashoffset={animated && length ? length : undefined}
      style={
        animated && length
          ? {
              animation: `svg-connector-draw ${duration}s cubic-bezier(0.2,0,0,1) ${delay}s forwards`,
            }
          : undefined
      }
    />
  );
}
```

- [ ] **Step 2: Add the keyframe animation to globals.css**

Add after existing keyframes in `src/app/globals.css`:

```css
@keyframes svg-connector-draw {
  from { stroke-dashoffset: var(--dashoffset, 300); }
  to   { stroke-dashoffset: 0; }
}
```

Wait — the stroke-dashoffset is set inline, not via CSS variable. The animation should work with the inline value as the starting point. Use:

```css
@keyframes svg-connector-draw {
  to { stroke-dashoffset: 0; }
}
```

- [ ] **Step 3: Verify build**

Run: `npm run build 2>&1 | tail -20`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/svg-connector.tsx src/app/globals.css
git commit -m "refactor: rewrite SvgConnector to Attio connector style"
```

---

### Task 2: Rewrite FlowNode to Attio Card Style

**Files:**
- Rewrite: `src/components/ui/flow-node.tsx`

- [ ] **Step 1: Rewrite FlowNode**

Replace current double-layer card with Attio's DataModelCard pattern. Key changes:
- Single card: white bg, `#EDEFF3` border, `rounded-[10px]`, subtle shadow
- Title row: colored square icon (14×14) + label + optional badge
- Optional attribute rows with small monochrome icons
- Status indicator remains (pulse dot + text)
- Dark mode support via Tailwind dark: prefixes
- Keep props backward-compatible where possible: `icon`, `label`, `sublabel`, `variant`, `status`, `statusColor`, `statusPulse`, `children`, `className`
- Add new optional props: `badge?: "Standard" | "Custom" | string`, `attrs?: string[]`, `moreCount?: number`

Variant maps to icon background color (NOT outer card tint):
- default → `#98A2B3` (gray)
- trigger → `#0FC27B` (green)
- condition → `#F59E0B` (amber)
- action → `#266DF0` (blue)

```tsx
import { cn } from "@/lib/utils";

interface FlowNodeProps {
  icon?: React.ReactNode;
  label: string;
  sublabel?: string;
  variant?: "default" | "trigger" | "condition" | "action";
  status?: string;
  statusColor?: string;
  statusPulse?: boolean;
  badge?: string;
  attrs?: string[];
  moreCount?: number;
  children?: React.ReactNode;
  className?: string;
}

const AttrIcon = (
  <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
    <rect x="1.5" y="1.5" width="11" height="11" rx="3" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

export function FlowNode({
  icon,
  label,
  sublabel,
  variant = "default",
  status,
  statusColor = "bg-emerald-500",
  statusPulse = false,
  badge,
  attrs,
  moreCount,
  children,
  className,
}: FlowNodeProps) {
  return (
    <div
      className={cn(
        "rounded-[10px] border border-[#EDEFF3] bg-white p-[7px] lg:rounded-xl lg:p-[11px]",
        "shadow-[0px_2px_3px_-2px_rgba(16,24,40,0.08)]",
        "dark:border-[#2E3238] dark:bg-[#1C1C1F] dark:shadow-[0px_2px_3px_-2px_rgba(0,0,0,0.3)]",
        className
      )}
    >
      {/* Title row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-1.5 overflow-hidden pl-1 lg:pl-2">
          {icon && (
            <div className="flex size-[14px] shrink-0 items-center justify-center">
              {icon}
            </div>
          )}
          <span className="truncate text-[11px] font-medium text-[#0F172A] dark:text-[#F1F5F9] lg:text-[14px]">
            {label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {status && (
            <div className="flex shrink-0 items-center gap-1.5">
              <span className={cn("size-1.5 rounded-full", statusColor, statusPulse && "animate-pulse")} />
              <span className="text-[9px] font-medium text-[#98A2B3] dark:text-[#64748B] lg:text-[11px]">
                {status}
              </span>
            </div>
          )}
          {badge && (
            <span className="rounded-md border border-[#EDEFF3] bg-[#F9FAFB] px-[3px] py-[0.5px] text-[8px] font-medium leading-[11px] text-[#475467] dark:border-[#2E3238] dark:bg-[#27272A] dark:text-[#94A3B8] lg:rounded-lg lg:px-[5px] lg:py-px lg:text-[10px] lg:leading-[14px]">
              {badge}
            </span>
          )}
        </div>
      </div>

      {/* Sublabel */}
      {sublabel && (
        <p className="mt-0.5 truncate pl-1 text-[10px] text-[#475467] dark:text-[#94A3B8] lg:pl-2 lg:text-[12px]">
          {sublabel}
        </p>
      )}

      {/* Attribute rows */}
      {attrs && attrs.length > 0 && (
        <div className="mt-2 border-t border-[#EDEFF3] dark:border-[#2E3238] lg:mt-3">
          {attrs.map((a) => (
            <div
              key={a}
              className="overflow-hidden border-b border-[#EDEFF3] dark:border-[#2E3238] pt-1 pb-[3px] pl-2 lg:pt-1.5 lg:pb-[5px] lg:pl-3"
            >
              <div className="flex items-center gap-x-1.5 text-[#98A2B3] dark:text-[#64748B]">
                {AttrIcon}
                <span className="truncate text-[10px] text-[#475467] dark:text-[#94A3B8] lg:text-[12px]">{a}</span>
              </div>
            </div>
          ))}
          {typeof moreCount === "number" && moreCount > 0 && (
            <div className="flex items-center mt-1 gap-x-[6.5px] pl-[8.5px] lg:mt-1.5 lg:gap-x-[7px] lg:pl-[13px]">
              <span className="inline-block h-[3px] w-[3px] rounded-full bg-[#98A2B3] dark:bg-[#64748B]" />
              <span className="inline-block h-[3px] w-[3px] rounded-full bg-[#98A2B3] dark:bg-[#64748B]" />
              <span className="inline-block h-[3px] w-[3px] rounded-full bg-[#98A2B3] dark:bg-[#64748B]" />
              <span className="ml-1 text-[9px] text-[#98A2B3] dark:text-[#64748B] lg:text-[11px]">
                {moreCount} More Attributes
              </span>
            </div>
          )}
        </div>
      )}

      {/* Custom children */}
      {children && (
        <div className="mt-2 border-t border-[#EDEFF3] dark:border-[#2E3238] pt-2 lg:mt-3 lg:pt-3">
          {children}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build 2>&1 | tail -20`
Expected: Build succeeds (FlowDiagram still uses old props — that's fine, all existing props are kept)

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/flow-node.tsx
git commit -m "refactor: rewrite FlowNode to Attio card design"
```

---

### Task 3: Rewrite FlowDiagram with Attio Connectors and Dot-Grid

**Files:**
- Rewrite: `src/components/sections/flow-diagram.tsx`

- [ ] **Step 1: Rewrite FlowDiagram**

Key changes from current implementation:
1. Replace `ArrowDown` lucide icons between nodes with SVG path connectors (stroke `#E4E7EC`, animated)
2. Add dot-grid background behind the entire flow area
3. Use Attio text colors: `#0F172A` title, `#475467` description
4. Keep the 2-column layout (flow + context panel) but improve the flow column
5. Connector SVGs are inline `<svg>` elements between card rows, NOT the SvgConnector component (because these are simple vertical/branching lines)
6. Section heading should use Attio's `[01]` numbered style
7. Keep all existing dict props — no dictionary changes needed

The connector between nodes: a simple vertical line SVG, height ~24px, centered, stroke `#E4E7EC`, animated with stroke-dashoffset.

For the branch split: two angled paths diverging from the condition node.

```tsx
"use client";

import { useRef, useState, useEffect } from "react";
import { FlowNode } from "@/components/ui/flow-node";
import { MessageSquare, Search, FileText, GitBranch, Info } from "lucide-react";

// ... (keep the same FlowDiagramProps interface)

// Vertical connector line between nodes
function VerticalConnector({ delay = 0, height = 24 }: { delay?: number; height?: number }) {
  return (
    <div className="flex justify-center">
      <svg width="2" height={height} viewBox={`0 0 2 ${height}`} fill="none" className="overflow-visible">
        <line
          x1="1" y1="0" x2="1" y2={height}
          stroke="#E4E7EC"
          strokeWidth="1"
          className="dark:stroke-[#334155]"
          strokeDasharray={height}
          strokeDashoffset={height}
          style={{ animation: `svg-connector-draw 0.6s cubic-bezier(0.2,0,0,1) ${delay}s forwards` }}
        />
      </svg>
    </div>
  );
}

// Branch split connector
function BranchConnector({ delay = 0 }: { delay?: number }) {
  return (
    <div className="flex justify-center">
      <svg width="200" height="32" viewBox="0 0 200 32" fill="none" className="overflow-visible">
        {/* Left branch */}
        <path
          d="M100 0 C100 16, 50 16, 50 32"
          stroke="#E4E7EC"
          strokeWidth="1"
          className="dark:stroke-[#334155]"
          strokeDasharray="60"
          strokeDashoffset="60"
          style={{ animation: `svg-connector-draw 0.8s cubic-bezier(0.2,0,0,1) ${delay}s forwards` }}
        />
        {/* Right branch */}
        <path
          d="M100 0 C100 16, 150 16, 150 32"
          stroke="#E4E7EC"
          strokeWidth="1"
          className="dark:stroke-[#334155]"
          strokeDasharray="60"
          strokeDashoffset="60"
          style={{ animation: `svg-connector-draw 0.8s cubic-bezier(0.2,0,0,1) ${delay + 0.1}s forwards` }}
        />
      </svg>
    </div>
  );
}
```

The full component follows the same layout (grid-cols-[1fr_320px]) but with:
- SVG connectors instead of ArrowDown
- Dot-grid background
- Attio section heading style
- Attio card colors (via updated FlowNode)

- [ ] **Step 2: Verify build**

Run: `npm run build 2>&1 | tail -20`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/flow-diagram.tsx
git commit -m "refactor: rewrite FlowDiagram with Attio connectors and dot-grid"
```

---

### Task 4: Rewrite DataModelViz as Attio 2×2 Grid

**Files:**
- Rewrite: `src/components/sections/data-model-viz.tsx`

- [ ] **Step 1: Design new DataModelViz API**

Replace current hub-and-spoke (sources → center → outputs) with Attio's 2×2 grid of data model cards connected by SVG bezier paths.

New props:
```tsx
interface DataModelCard {
  icon: React.ReactNode;
  iconColor: string;        // e.g. "#0FC27B"
  title: string;
  badge?: "Standard" | "Custom" | string;
  attrs: string[];
  moreCount?: number;
}

interface DataModelVizProps {
  sectionNumber?: string;   // e.g. "[03]"
  sectionLabel?: string;    // e.g. "Adaptive model"
  cards: [DataModelCard, DataModelCard, DataModelCard]; // Top-left, top-right, bottom-left
  addObjectLabel?: string;  // "Obje ekle" / "Add object"
  className?: string;
}
```

Layout: `grid-cols-[1fr_64px_1fr] grid-rows-[auto_40px_auto]`
- cards[0] → col 1, row 1
- cards[1] → col 3, row 1
- cards[2] → col 1, row 3
- "Add object" dashed → col 3, row 3
- 4 SVG bezier connectors in the gutters (col 2, row 2 area)
- Dot-grid background behind everything

- [ ] **Step 2: Implement DataModelViz**

Full implementation with:
- DataModelCardComponent (internal, uses Attio's exact card pattern)
- AddObjectCard (dashed placeholder)
- 4 SVG connectors (copied from Attio reference, using `#E4E7EC` stroke)
- Dot-grid background
- IntersectionObserver for entrance animation
- Dark mode support

```tsx
"use client";

import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

// ... types as above

const AttrIcon = (
  <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
    <rect x="1.5" y="1.5" width="11" height="11" rx="3" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

function ModelCard({ card, className }: { card: DataModelCard; className?: string }) {
  return (
    <div className={cn(
      "w-full rounded-[10px] border border-[#EDEFF3] bg-white p-[7px] lg:rounded-xl lg:p-[11px]",
      "shadow-[0px_2px_3px_-2px_rgba(16,24,40,0.08)]",
      "dark:border-[#2E3238] dark:bg-[#1C1C1F] dark:shadow-[0px_2px_3px_-2px_rgba(0,0,0,0.3)]",
      className
    )}>
      {/* Title + badge row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-1.5 overflow-hidden pl-1 lg:pl-2">
          <div className="flex size-[14px] shrink-0 items-center justify-center">
            {card.icon}
          </div>
          <span className="truncate text-[11px] font-medium text-[#0F172A] dark:text-[#F1F5F9] lg:text-[14px]">
            {card.title}
          </span>
        </div>
        {card.badge && (
          <span className="rounded-md border border-[#EDEFF3] bg-[#F9FAFB] px-[3px] py-[0.5px] text-[8px] font-medium leading-[11px] text-[#475467] dark:border-[#2E3238] dark:bg-[#27272A] dark:text-[#94A3B8] lg:rounded-lg lg:px-[5px] lg:py-px lg:text-[10px] lg:leading-[14px]">
            {card.badge}
          </span>
        )}
      </div>

      {/* Attribute rows */}
      <div className="mt-2 border-t border-[#EDEFF3] dark:border-[#2E3238] lg:mt-3">
        {card.attrs.map((a) => (
          <div key={a} className="overflow-hidden border-b border-[#EDEFF3] dark:border-[#2E3238] pt-1 pb-[3px] pl-2 lg:pt-1.5 lg:pb-[5px] lg:pl-3">
            <div className="flex items-center gap-x-1.5 text-[#98A2B3] dark:text-[#64748B]">
              {AttrIcon}
              <span className="truncate text-[10px] text-[#475467] dark:text-[#94A3B8] lg:text-[12px]">{a}</span>
            </div>
          </div>
        ))}
        {card.moreCount && card.moreCount > 0 && (
          <div className="flex items-center mt-1 gap-x-[6.5px] pl-[8.5px] lg:mt-1.5 lg:gap-x-[7px] lg:pl-[13px]">
            {[0,1,2].map(i => <span key={i} className="inline-block h-[3px] w-[3px] rounded-full bg-[#98A2B3] dark:bg-[#64748B]" />)}
            <span className="ml-1 text-[9px] text-[#98A2B3] dark:text-[#64748B] lg:text-[11px]">
              {card.moreCount} More
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function AddObjectCard({ label = "Add object" }: { label?: string }) {
  return (
    <div className={cn(
      "flex w-full min-h-[140px] lg:min-h-[220px] items-center justify-center",
      "rounded-[10px] border border-dashed border-[#D0D5DD] lg:rounded-xl",
      "dark:border-[#475569]",
      "transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)] hover:scale-[1.01]"
    )}>
      <span className="flex items-center gap-x-1.5 text-[11px] text-[#98A2B3] dark:text-[#64748B] lg:text-[13px]">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 3v8M3 7h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        {label}
      </span>
    </div>
  );
}
```

Connectors: 4 SVG paths placed absolutely in the grid gutters, matching Attio's exact bezier curves. Animated with stroke-dashoffset.

- [ ] **Step 3: Verify build (component only)**

Run: `npm run build 2>&1 | tail -20`
Expected: May fail on consumer pages (agents, integrations) because API changed. That's OK — Task 5 fixes them.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/data-model-viz.tsx
git commit -m "refactor: rewrite DataModelViz as Attio 2×2 grid layout"
```

---

### Task 5: Update Consumer Pages for New DataModelViz API

**Files:**
- Modify: `src/app/[lang]/agents/page.tsx`
- Modify: `src/app/[lang]/integrations/page.tsx`
- Modify: `src/dictionaries/tr.json`
- Modify: `src/dictionaries/en.json`

- [ ] **Step 1: Add dictionary keys for data model cards**

In both `tr.json` and `en.json`, add under `agentsPage` and `integrationsPage`:

```json
"dataModel": {
  "sectionLabel": "Veri Modeli",
  "addObject": "Obje ekle",
  "cards": [
    {
      "title": "Müşteri",
      "attrs": ["İsim", "E-posta", "Şirket"],
      "moreCount": 8
    },
    {
      "title": "Konuşma",
      "attrs": ["Kanal", "Durum", "Agent"],
      "moreCount": 5
    },
    {
      "title": "Teklif",
      "attrs": ["Tutar", "Ürünler", "Tarih"],
      "moreCount": 4
    }
  ]
}
```

And English equivalents.

- [ ] **Step 2: Update agents/page.tsx**

Replace the old DataModelViz usage with the new API:

```tsx
<DataModelViz
  sectionNumber="[03]"
  sectionLabel={ap.dataModel.sectionLabel}
  cards={[
    { icon: <UserIcon />, iconColor: "#0FC27B", title: ap.dataModel.cards[0].title, badge: "Standard", attrs: ap.dataModel.cards[0].attrs, moreCount: ap.dataModel.cards[0].moreCount },
    { icon: <DealIcon />, iconColor: "#9162F9", title: ap.dataModel.cards[1].title, badge: "Standard", attrs: ap.dataModel.cards[1].attrs, moreCount: ap.dataModel.cards[1].moreCount },
    { icon: <PersonIcon />, iconColor: "#266DF0", title: ap.dataModel.cards[2].title, badge: "Custom", attrs: ap.dataModel.cards[2].attrs, moreCount: ap.dataModel.cards[2].moreCount },
  ]}
  addObjectLabel={ap.dataModel.addObject}
/>
```

Define small colored SVG icons (UserIcon, DealIcon, PersonIcon) inline in the page file, using Attio's colors (#0FC27B green, #9162F9 purple, #266DF0 blue).

- [ ] **Step 3: Update integrations/page.tsx**

Same pattern as agents page.

- [ ] **Step 4: Verify build**

Run: `npm run build 2>&1 | tail -20`
Expected: Build succeeds with 15 static pages, 0 errors

- [ ] **Step 5: Commit**

```bash
git add src/app/[lang]/agents/page.tsx src/app/[lang]/integrations/page.tsx src/dictionaries/tr.json src/dictionaries/en.json
git commit -m "feat: wire new Attio-style DataModelViz into agents and integrations pages"
```

---

### Task 6: Final Build Test and Cleanup

**Files:**
- Potentially: `src/components/ui/gradient-border.tsx` (remove if unused after DataModelViz rewrite)

- [ ] **Step 1: Check if GradientBorder is still used**

Run: `grep -r "GradientBorder" src/ --include="*.tsx" --include="*.ts"`

If only used in `data-model-viz.tsx` (which no longer imports it), check other usages. If still used elsewhere, keep. If unused anywhere, leave the file but don't import it.

- [ ] **Step 2: Full build test**

Run: `npm run build 2>&1 | tail -30`
Expected: Build succeeds, all pages render

- [ ] **Step 3: Final commit if any cleanup**

```bash
git add -A
git commit -m "chore: cleanup after Attio-style workflow redesign"
```
