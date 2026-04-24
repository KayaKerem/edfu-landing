# UI Mockup & Visual Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all placeholder text with realistic UI mockup components, enrich the flow diagram with Attio-inspired double-layer cards and a context panel, polish the gradient card with glow effects and warmer colors, and add a meeting template section.

**Architecture:** Create a library of pure-presentational mockup components (`src/components/mockups/`) that render fake but realistic UI (WhatsApp chat, CRM table, call player, proposal PDF, etc.) using only Tailwind + design tokens. Each mockup is a self-contained server component with no props — content is hardcoded since it's decorative. Then wire these mockups into the existing section components that currently show placeholder text.

**Tech Stack:** Next.js 16, Tailwind CSS 4, motion/react for animations, oklch colors, Geist/Geist Mono fonts.

**CRITICAL RULES:**
- Use proper Turkish diacritical characters (İ, ş, ü, ç, ö, ı, ğ, Ş, Ö, Ü, Ç, Ğ) for ALL Turkish text in mockups
- Use `var(--font-geist)` for headings, `var(--font-mono)` for monospace
- Dark mode: cards `dark:bg-[#27272A]`, borders `dark:border-border`, page bg is CSS variable
- All mockup components go in `src/components/mockups/` directory
- Run `npm run build` after every task to verify

---

## File Structure

### New files (mockups):
| File | Responsibility |
|------|---------------|
| `src/components/mockups/whatsapp-chat.tsx` | Fake WhatsApp conversation with 4-5 messages, green/white bubbles, timestamps, read receipts |
| `src/components/mockups/proposal-doc.tsx` | Fake proposal PDF preview — header, table rows, total, signature area |
| `src/components/mockups/crm-table.tsx` | Fake CRM lead table with columns (name, company, status badge, score), 4-5 rows |
| `src/components/mockups/call-player.tsx` | Fake meeting recording UI — waveform bars, speaker timeline, transcript snippet |
| `src/components/mockups/meeting-list.tsx` | Fake meeting list — 3-4 rows with date, participants, duration, status |
| `src/components/mockups/research-report.tsx` | Fake company research card — company info, score, bullet findings |
| `src/components/mockups/rag-search.tsx` | Fake search-and-answer UI — search bar, result cards with source badges |
| `src/components/mockups/meeting-transcript.tsx` | Fake transcript with speaker labels, timestamps, highlighted action items |

### Modified files:
| File | Change |
|------|--------|
| `src/components/ui/flow-node.tsx` | Double-layer card design, optional status badge, optional `children` slot for inner content |
| `src/components/sections/flow-diagram.tsx` | Wider layout (max-w-5xl, 2-col on md+), context panel on right, richer node content |
| `src/components/ui/gradient-border.tsx` | Warmer color palette, glow shadow |
| `src/components/sections/ai-gradient-card.tsx` | More compact, remove outer section title (card is self-explanatory) |
| `src/components/sections/agent-tabs.tsx` | Replace placeholder div with per-tab mockup component |
| `src/components/sections/meeting-hero.tsx` | Replace placeholders with MeetingList + CallPlayer mockups |
| `src/components/sections/scroll-pinned-features.tsx` | Accept `visuals` prop, render matching mockup per active feature |
| `src/app/[lang]/meeting/page.tsx` | Pass visuals to ScrollPinnedFeatures, add template section |
| `src/dictionaries/tr.json` | Add `meetingPage.templates` dictionary keys |
| `src/dictionaries/en.json` | Add `meetingPage.templates` dictionary keys |

---

## Phase 1 — Mockup Components

### Task 1: WhatsApp Chat Mockup

**Files:**
- Create: `src/components/mockups/whatsapp-chat.tsx`

- [ ] **Step 1: Create the WhatsApp chat mockup**

```tsx
import { cn } from "@/lib/utils";

const messages = [
  { from: "customer", text: "Merhaba, kurumsal yazılım çözümleriniz hakkında bilgi almak istiyorum.", time: "14:22", name: "Ahmet Y." },
  { from: "ai", text: "Merhaba Ahmet Bey! Size yardımcı olmaktan mutluluk duyarım. Şirketinizin büyüklüğü ve sektörü hakkında bilgi alabilir miyim?", time: "14:22" },
  { from: "customer", text: "SaaS sektöründe 85 kişilik bir ekibiz. CRM entegrasyonu arıyoruz.", time: "14:23", name: "Ahmet Y." },
  { from: "ai", text: "Harika! Tam size uygun paketlerimiz var. Şirketinizi kısaca araştırıp size özel bir teklif hazırlıyorum.", time: "14:23" },
];

export function WhatsAppChat({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border bg-card overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border bg-[#075E54] dark:bg-[#1F2C34] px-4 py-3">
        <div className="size-8 rounded-full bg-white/20 flex items-center justify-center">
          <span className="text-xs font-bold text-white">AY</span>
        </div>
        <div>
          <p className="text-sm font-medium text-white">Ahmet Yılmaz</p>
          <p className="text-[10px] text-white/60">çevrimiçi</p>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-white/60">AI Aktif</span>
        </div>
      </div>

      {/* Messages */}
      <div className="p-3 space-y-2 bg-[#ECE5DD] dark:bg-[#0B141A]">
        {messages.map((msg, i) => (
          <div key={i} className={cn("flex", msg.from === "ai" ? "justify-start" : "justify-end")}>
            <div
              className={cn(
                "max-w-[80%] rounded-lg px-3 py-2 text-xs leading-relaxed shadow-sm",
                msg.from === "ai"
                  ? "bg-white dark:bg-[#202C33] text-foreground"
                  : "bg-[#DCF8C6] dark:bg-[#005C4B] text-foreground"
              )}
            >
              {msg.name && (
                <p className="text-[10px] font-semibold text-primary mb-0.5">{msg.name}</p>
              )}
              <p>{msg.text}</p>
              <p className={cn(
                "text-[9px] text-right mt-1",
                msg.from === "ai" ? "text-muted-foreground" : "text-muted-foreground/80"
              )}>
                {msg.time} {msg.from === "ai" && "✓✓"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/components/mockups/whatsapp-chat.tsx
git commit -m "feat: add WhatsApp chat mockup component"
```

---

### Task 2: CRM Table Mockup

**Files:**
- Create: `src/components/mockups/crm-table.tsx`

- [ ] **Step 1: Create the CRM table mockup**

```tsx
import { cn } from "@/lib/utils";

const leads = [
  { name: "Ahmet Yılmaz", company: "TechVista SaaS", status: "Nitelikli", score: 92, statusColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  { name: "Elif Korkmaz", company: "DataFlow A.Ş.", status: "Görüşmede", score: 78, statusColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  { name: "Murat Çelik", company: "NovaRetail", status: "Yeni", score: 65, statusColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  { name: "Zeynep Arslan", company: "FinEdge Ltd.", status: "Nitelikli", score: 88, statusColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
];

export function CrmTable({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border bg-card overflow-hidden", className)}>
      {/* Header */}
      <div className="border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-primary" />
          <span className="text-sm font-semibold text-foreground" style={{ fontFamily: "var(--font-geist)" }}>
            Aktif Lead'ler
          </span>
          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
            {leads.length}
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>
          AI tarafından güncellendi
        </span>
      </div>

      {/* Table */}
      <div className="divide-y divide-border">
        {/* Column headers */}
        <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-4 px-4 py-2 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
          <span>İsim</span>
          <span>Şirket</span>
          <span>Durum</span>
          <span className="text-right">Skor</span>
        </div>
        {leads.map((lead, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_auto_auto] gap-4 items-center px-4 py-2.5 hover:bg-muted/50 transition-colors">
            <span className="text-xs font-medium text-foreground truncate">{lead.name}</span>
            <span className="text-xs text-muted-foreground truncate">{lead.company}</span>
            <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full", lead.statusColor)}>
              {lead.status}
            </span>
            <div className="flex items-center gap-1.5 justify-end">
              <div className="h-1.5 w-8 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${lead.score}%` }}
                />
              </div>
              <span className="text-[10px] font-medium text-foreground w-5 text-right" style={{ fontFamily: "var(--font-mono)" }}>
                {lead.score}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/components/mockups/crm-table.tsx
git commit -m "feat: add CRM table mockup component"
```

---

### Task 3: Proposal Document Mockup

**Files:**
- Create: `src/components/mockups/proposal-doc.tsx`

- [ ] **Step 1: Create the proposal document mockup**

```tsx
import { cn } from "@/lib/utils";

const lineItems = [
  { item: "Kurumsal AI Lisansı", qty: "85 kullanıcı", price: "₺135.320" },
  { item: "CRM Entegrasyonu", qty: "1 modül", price: "₺24.000" },
  { item: "Onboarding & Eğitim", qty: "1 paket", price: "₺18.500" },
];

export function ProposalDoc({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border bg-card overflow-hidden", className)}>
      {/* Header bar */}
      <div className="border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-md bg-primary/10 flex items-center justify-center">
            <span className="text-[10px] font-bold text-primary">PDF</span>
          </div>
          <span className="text-sm font-semibold text-foreground" style={{ fontFamily: "var(--font-geist)" }}>
            Teklif — TechVista SaaS
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium">
          AI Oluşturdu
        </span>
      </div>

      {/* Document body */}
      <div className="p-4 space-y-4">
        {/* Line items */}
        <div className="space-y-0 divide-y divide-border rounded-lg border border-border overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-3 py-2 bg-muted/50 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
            <span>Kalem</span>
            <span>Miktar</span>
            <span className="text-right">Tutar</span>
          </div>
          {lineItems.map((item, i) => (
            <div key={i} className="grid grid-cols-[1fr_auto_auto] gap-4 px-3 py-2.5">
              <span className="text-xs font-medium text-foreground">{item.item}</span>
              <span className="text-xs text-muted-foreground">{item.qty}</span>
              <span className="text-xs font-medium text-foreground text-right" style={{ fontFamily: "var(--font-mono)" }}>
                {item.price}
              </span>
            </div>
          ))}
          {/* Total row */}
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-3 py-2.5 bg-muted/30">
            <span className="text-xs font-semibold text-foreground">Toplam (KDV Hariç)</span>
            <span />
            <span className="text-xs font-bold text-foreground text-right" style={{ fontFamily: "var(--font-mono)" }}>
              ₺177.820
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <div className="size-3 rounded-full border border-primary/30 flex items-center justify-center">
              <div className="size-1.5 rounded-full bg-primary" />
            </div>
            Geçerlilik: 30 gün
          </div>
          <div className="h-4 w-16 rounded bg-muted/50" /> {/* Signature placeholder */}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/components/mockups/proposal-doc.tsx
git commit -m "feat: add proposal document mockup component"
```

---

### Task 4: Call Player Mockup

**Files:**
- Create: `src/components/mockups/call-player.tsx`

- [ ] **Step 1: Create the call player mockup**

```tsx
import { cn } from "@/lib/utils";

const speakers = [
  { name: "Mehmet K.", role: "Satış", segments: [0, 15, 35, 55, 80], color: "bg-primary" },
  { name: "Ahmet Y.", role: "Müşteri", segments: [10, 25, 45, 70], color: "bg-emerald-500" },
];

const transcriptLines = [
  { speaker: "Mehmet K.", time: "02:15", text: "Ekibiniz şu an kaç kişi kullanıyor?" },
  { speaker: "Ahmet Y.", time: "02:22", text: "85 kişilik bir ekibiz, CRM entegrasyonu en önemli ihtiyacımız." },
  { speaker: "Mehmet K.", time: "02:35", text: "Anladım, size özel kurumsal paketimiz tam ihtiyacınıza uygun." },
];

export function CallPlayer({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border bg-card overflow-hidden", className)}>
      {/* Player header */}
      <div className="border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-red-500" />
          <span className="text-sm font-semibold text-foreground" style={{ fontFamily: "var(--font-geist)" }}>
            Satış Görüşmesi — TechVista
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>
          12:34 / 45:00
        </span>
      </div>

      {/* Waveform */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-end gap-[2px] h-8">
          {Array.from({ length: 60 }, (_, i) => {
            const height = Math.sin(i * 0.3) * 0.5 + 0.5;
            const isPlayed = i < 17; // ~28% played
            return (
              <div
                key={i}
                className={cn(
                  "flex-1 rounded-full min-w-[2px]",
                  isPlayed ? "bg-primary" : "bg-muted"
                )}
                style={{ height: `${Math.max(15, height * 100)}%` }}
              />
            );
          })}
        </div>

        {/* Speaker timeline */}
        <div className="mt-2 space-y-1">
          {speakers.map((s) => (
            <div key={s.name} className="flex items-center gap-2">
              <span className="text-[9px] text-muted-foreground w-16 truncate">{s.name}</span>
              <div className="flex-1 h-1.5 rounded-full bg-muted relative overflow-hidden">
                {s.segments.map((pos, i) => (
                  <div
                    key={i}
                    className={cn("absolute h-full rounded-full", s.color)}
                    style={{ left: `${pos}%`, width: "8%" }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transcript snippet */}
      <div className="px-4 py-3 space-y-2">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-[10px] font-semibold text-foreground uppercase tracking-wider">Transkript</span>
          <span className="text-[9px] text-primary bg-primary/10 px-1.5 py-0.5 rounded-full font-medium">AI</span>
        </div>
        {transcriptLines.map((line, i) => (
          <div key={i} className="flex gap-2">
            <span className="text-[9px] text-muted-foreground shrink-0 pt-0.5 w-8" style={{ fontFamily: "var(--font-mono)" }}>
              {line.time}
            </span>
            <div>
              <span className="text-[10px] font-semibold text-foreground">{line.speaker}: </span>
              <span className="text-[10px] text-muted-foreground">{line.text}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/components/mockups/call-player.tsx
git commit -m "feat: add call player mockup component"
```

---

### Task 5: Meeting List Mockup

**Files:**
- Create: `src/components/mockups/meeting-list.tsx`

- [ ] **Step 1: Create the meeting list mockup**

```tsx
import { cn } from "@/lib/utils";

const meetings = [
  { title: "TechVista — Satış Demo", date: "13 Nis, 14:00", participants: "Mehmet K., Ahmet Y.", duration: "45 dk", status: "Kaydedildi", statusColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  { title: "DataFlow — Onboarding", date: "13 Nis, 11:00", participants: "Elif D., Zeynep A.", duration: "30 dk", status: "İşleniyor", statusColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  { title: "NovaRetail — Kick-off", date: "12 Nis, 16:00", participants: "Murat Ç., Can Y.", duration: "60 dk", status: "Kaydedildi", statusColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  { title: "FinEdge — İhtiyaç Analizi", date: "12 Nis, 10:30", participants: "Selin T., Burak Ö.", duration: "25 dk", status: "Kaydedildi", statusColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
];

export function MeetingList({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border bg-card overflow-hidden", className)}>
      <div className="border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground" style={{ fontFamily: "var(--font-geist)" }}>
            Son Toplantılar
          </span>
          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
            {meetings.length}
          </span>
        </div>
      </div>

      <div className="divide-y divide-border">
        {meetings.map((m, i) => (
          <div key={i} className="px-4 py-3 flex items-center gap-4 hover:bg-muted/50 transition-colors">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-foreground truncate">{m.title}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{m.participants}</p>
            </div>
            <div className="text-right shrink-0 space-y-0.5">
              <p className="text-[10px] text-muted-foreground">{m.date}</p>
              <div className="flex items-center gap-2 justify-end">
                <span className="text-[10px] text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>
                  {m.duration}
                </span>
                <span className={cn("text-[9px] font-medium px-1.5 py-0.5 rounded-full", m.statusColor)}>
                  {m.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/components/mockups/meeting-list.tsx
git commit -m "feat: add meeting list mockup component"
```

---

### Task 6: Research Report + RAG Search Mockups

**Files:**
- Create: `src/components/mockups/research-report.tsx`
- Create: `src/components/mockups/rag-search.tsx`

- [ ] **Step 1: Create the research report mockup**

```tsx
import { cn } from "@/lib/utils";

export function ResearchReport({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border bg-card overflow-hidden", className)}>
      <div className="border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-blue-500" />
          <span className="text-sm font-semibold text-foreground" style={{ fontFamily: "var(--font-geist)" }}>
            Şirket Araştırması
          </span>
        </div>
        <span className="text-[9px] text-primary bg-primary/10 px-1.5 py-0.5 rounded-full font-medium">Araştırma Agenti</span>
      </div>

      <div className="p-4 space-y-3">
        {/* Company header */}
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-muted flex items-center justify-center">
            <span className="text-xs font-bold text-muted-foreground">TV</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">TechVista SaaS A.Ş.</p>
            <p className="text-[10px] text-muted-foreground">B2B SaaS • İstanbul • 85 çalışan</p>
          </div>
          <div className="ml-auto text-right">
            <div className="text-lg font-bold text-primary" style={{ fontFamily: "var(--font-mono)" }}>92</div>
            <p className="text-[9px] text-muted-foreground">ICP Skoru</p>
          </div>
        </div>

        <div className="border-t border-border pt-3 space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-emerald-500 text-xs mt-0.5">●</span>
            <p className="text-[11px] text-muted-foreground">Yıllık gelir: ~₺12M, son 2 yılda %40 büyüme</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-emerald-500 text-xs mt-0.5">●</span>
            <p className="text-[11px] text-muted-foreground">CRM çözümü aktif olarak arıyor (LinkedIn paylaşımları)</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-500 text-xs mt-0.5">●</span>
            <p className="text-[11px] text-muted-foreground">Mevcut rakip: HubSpot Free — ölçeklenme sorunu yaşıyor</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-emerald-500 text-xs mt-0.5">●</span>
            <p className="text-[11px] text-muted-foreground">Karar verici: CTO (Ahmet Yılmaz) — 3 demo talep etti</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create the RAG search mockup**

```tsx
import { cn } from "@/lib/utils";

export function RagSearch({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border bg-card overflow-hidden", className)}>
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
          <svg className="size-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <span className="text-xs text-foreground">Tedarikçi sözleşme şartları nelerdir?</span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-[9px] text-primary bg-primary/10 px-1.5 py-0.5 rounded-full font-medium">RAG Agenti</span>
          <span className="text-[10px] text-muted-foreground">3 kaynak bulundu</span>
        </div>

        <div className="rounded-lg border border-border p-3 space-y-2">
          <p className="text-xs text-foreground leading-relaxed">
            Tedarikçi sözleşmelerinde standart ödeme vadesi <strong>45 gün</strong>, cezai şart oranı <strong>%2/ay</strong> olarak belirlenmiştir. Minimum sipariş tutarı ₺50.000'dir.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[9px] bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-1.5 py-0.5 rounded font-medium">Tedarikçi_Sözleşme.pdf</span>
            <span className="text-[9px] bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-1.5 py-0.5 rounded font-medium">Satın_Alma_Politikası.docx</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

Run: `npm run build`

- [ ] **Step 4: Commit**

```bash
git add src/components/mockups/research-report.tsx src/components/mockups/rag-search.tsx
git commit -m "feat: add research report and RAG search mockup components"
```

---

### Task 7: Meeting Transcript Mockup

**Files:**
- Create: `src/components/mockups/meeting-transcript.tsx`

- [ ] **Step 1: Create the meeting transcript mockup**

```tsx
import { cn } from "@/lib/utils";

const lines = [
  { speaker: "Mehmet K.", time: "14:22", text: "Bu çeyrekte hedefimiz 200 yeni müşteri.", isAction: false },
  { speaker: "Elif D.", time: "14:25", text: "Pazarlama bütçesini %30 artırmamız gerekecek.", isAction: false },
  { speaker: "AI Özet", time: "", text: "Aksiyon: Pazarlama bütçe artışı onayı → Elif D. — 18 Nis'e kadar", isAction: true },
  { speaker: "Can Y.", time: "14:31", text: "Demo ortamını önümüzdeki haftaya hazırlayalım.", isAction: false },
  { speaker: "AI Özet", time: "", text: "Aksiyon: Demo ortamı hazırlığı → Can Y. — 20 Nis'e kadar", isAction: true },
];

export function MeetingTranscript({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border bg-card overflow-hidden", className)}>
      <div className="border-b border-border px-4 py-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground" style={{ fontFamily: "var(--font-geist)" }}>
          Toplantı Transkripti
        </span>
        <span className="text-[10px] text-muted-foreground">Q3 Satış Toplantısı</span>
      </div>

      <div className="divide-y divide-border">
        {lines.map((line, i) => (
          <div
            key={i}
            className={cn(
              "px-4 py-2.5 flex gap-3",
              line.isAction && "bg-primary/5 dark:bg-primary/10"
            )}
          >
            {!line.isAction ? (
              <span className="text-[9px] text-muted-foreground shrink-0 pt-0.5 w-8" style={{ fontFamily: "var(--font-mono)" }}>
                {line.time}
              </span>
            ) : (
              <span className="text-[9px] text-primary shrink-0 pt-0.5 w-8">⚡</span>
            )}
            <div>
              <span className={cn(
                "text-[10px] font-semibold",
                line.isAction ? "text-primary" : "text-foreground"
              )}>
                {line.speaker}:{" "}
              </span>
              <span className={cn(
                "text-[10px]",
                line.isAction ? "text-primary font-medium" : "text-muted-foreground"
              )}>
                {line.text}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/components/mockups/meeting-transcript.tsx
git commit -m "feat: add meeting transcript mockup component"
```

---

## Phase 2 — Component Upgrades

### Task 8: Upgrade FlowNode — Double-Layer Cards + Status Badge + Children Slot

**Files:**
- Modify: `src/components/ui/flow-node.tsx`

- [ ] **Step 1: Upgrade FlowNode with double-layer card, status badge, and children slot**

Replace the full file content. The new design has an outer surface wrapper and an inner white card (Attio double-layer pattern), an optional status badge with optional pulse animation, and a `children` slot for embedding mini-UI inside the node.

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
  children?: React.ReactNode;
  className?: string;
}

export function FlowNode({
  icon,
  label,
  sublabel,
  variant = "default",
  status,
  statusColor = "bg-emerald-500",
  statusPulse = false,
  children,
  className,
}: FlowNodeProps) {
  const outerStyles = {
    default: "bg-muted/40 dark:bg-[#1E1E21]",
    trigger: "bg-primary/5 dark:bg-primary/10",
    condition: "bg-amber-50 dark:bg-amber-900/10",
    action: "bg-emerald-50 dark:bg-emerald-900/10",
  };

  const innerBorder = {
    default: "border-[rgba(46,50,56,0.07)] dark:border-border",
    trigger: "border-primary/20 dark:border-primary/30",
    condition: "border-amber-200/60 dark:border-amber-400/30",
    action: "border-emerald-200/60 dark:border-emerald-400/30",
  };

  return (
    <div
      className={cn(
        "rounded-xl p-1.5",
        outerStyles[variant],
        className
      )}
    >
      <div
        className={cn(
          "rounded-[10px] border bg-white dark:bg-[#27272A] px-4 py-3 shadow-[0px_1px_3px_rgba(0,0,0,0.04),0px_1px_2px_rgba(0,0,0,0.06)]",
          innerBorder[variant]
        )}
      >
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
              {icon}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground truncate">{label}</p>
            {sublabel && (
              <p className="text-xs text-muted-foreground truncate">{sublabel}</p>
            )}
          </div>
          {status && (
            <div className="flex items-center gap-1.5 shrink-0">
              <span className={cn("size-1.5 rounded-full", statusColor, statusPulse && "animate-pulse")} />
              <span className="text-[10px] font-medium text-muted-foreground">{status}</span>
            </div>
          )}
        </div>
        {children && (
          <div className="mt-3 border-t border-border pt-3">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/flow-node.tsx
git commit -m "feat: upgrade FlowNode — double-layer card, status badge, children slot"
```

---

### Task 9: Upgrade Flow Diagram — Wider Layout + Context Panel + Richer Nodes

**Files:**
- Modify: `src/components/sections/flow-diagram.tsx`
- Modify: `src/dictionaries/tr.json` (add `flowDiagram.contextChat` keys)
- Modify: `src/dictionaries/en.json` (add `flowDiagram.contextChat` keys)

- [ ] **Step 1: Add context panel dictionary keys**

Add to `flowDiagram` in `tr.json` (after `"informSub"` line):

```json
"contextPanel": {
  "title": "Canlı Görüşme",
  "messages": [
    { "from": "customer", "text": "CRM entegrasyonu arıyoruz, 85 kişilik ekibiz." },
    { "from": "ai", "text": "Size özel bir teklif hazırlıyorum. Şirketinizi kısaca araştırıp dönüyorum." }
  ]
}
```

Add to `flowDiagram` in `en.json`:

```json
"contextPanel": {
  "title": "Live Conversation",
  "messages": [
    { "from": "customer", "text": "We're looking for CRM integration, team of 85." },
    { "from": "ai", "text": "I'll prepare a custom proposal. Let me quickly research your company." }
  ]
}
```

- [ ] **Step 2: Rewrite the FlowDiagram component**

Replace the full content of `src/components/sections/flow-diagram.tsx`:

```tsx
"use client";

import { useRef, useState, useEffect } from "react";
import { FlowNode } from "@/components/ui/flow-node";
import { MessageSquare, Search, FileText, ArrowDown, GitBranch, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContextMessage {
  from: string;
  text: string;
}

interface FlowDiagramProps {
  dict: {
    title: string;
    description: string;
    trigger: string;
    triggerSub: string;
    conversation: string;
    conversationSub: string;
    condition: string;
    conditionYes: string;
    conditionNo: string;
    research: string;
    researchSub: string;
    proposal: string;
    proposalSub: string;
    inform: string;
    informSub: string;
    contextPanel: {
      title: string;
      messages: ContextMessage[];
    };
  };
}

export function FlowDiagram({ dict }: FlowDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const nodes = [
    { icon: <MessageSquare className="size-4" />, label: dict.trigger, sublabel: dict.triggerSub, variant: "trigger" as const, delay: 0, status: "Running", statusPulse: true },
    { icon: <MessageSquare className="size-4" />, label: dict.conversation, sublabel: dict.conversationSub, variant: "action" as const, delay: 200, status: "Completed" },
    { icon: <GitBranch className="size-4" />, label: dict.condition, variant: "condition" as const, delay: 400 },
  ];

  const yesBranch = [
    { icon: <Search className="size-4" />, label: dict.research, sublabel: dict.researchSub, variant: "action" as const, delay: 600, status: "Running", statusPulse: true },
    { icon: <FileText className="size-4" />, label: dict.proposal, sublabel: dict.proposalSub, variant: "action" as const, delay: 800 },
  ];

  const noBranch = [
    { icon: <Info className="size-4" />, label: dict.inform, sublabel: dict.informSub, variant: "default" as const, delay: 600 },
  ];

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto mb-12 max-w-xl px-4 text-center">
        <h2
          className="text-[28px] sm:text-[32px] md:text-[36px] font-medium leading-none text-foreground"
          style={{ letterSpacing: "-0.05em", fontFamily: "var(--font-geist)" }}
        >
          {dict.title}
        </h2>
        <p className="mt-4 text-base text-muted-foreground font-medium text-balance">
          {dict.description}
        </p>
      </div>

      <div ref={containerRef} className="mx-auto max-w-5xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-8 md:gap-10">
          {/* Flow column */}
          <div className="flex flex-col items-center gap-3 max-w-md mx-auto md:mx-0 w-full">
            {nodes.map((node, i) => (
              <div key={i} className="w-full flex flex-col items-center gap-3">
                <div
                  className="w-full transition-all duration-500"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0)" : "translateY(10px)",
                    transitionDelay: `${node.delay}ms`,
                  }}
                >
                  <FlowNode
                    icon={node.icon}
                    label={node.label}
                    sublabel={node.sublabel}
                    variant={node.variant}
                    status={node.status}
                    statusPulse={node.statusPulse}
                    className="w-full"
                  />
                </div>
                {i < nodes.length - 1 && (
                  <ArrowDown className="size-4 text-muted-foreground/40" />
                )}
              </div>
            ))}

            <div
              className="grid grid-cols-2 gap-4 w-full mt-2"
              style={{
                opacity: isVisible ? 1 : 0,
                transition: "opacity 0.5s ease-out 0.5s",
              }}
            >
              <div className="flex flex-col items-center gap-3">
                <span className="text-xs font-medium text-emerald-600">{dict.conditionYes}</span>
                {yesBranch.map((node, i) => (
                  <div key={i} className="w-full flex flex-col items-center gap-3">
                    <div
                      className="w-full transition-all duration-500"
                      style={{
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? "translateY(0)" : "translateY(10px)",
                        transitionDelay: `${node.delay}ms`,
                      }}
                    >
                      <FlowNode
                        icon={node.icon}
                        label={node.label}
                        sublabel={node.sublabel}
                        variant={node.variant}
                        status={node.status}
                        statusPulse={node.statusPulse}
                        className="w-full"
                      />
                    </div>
                    {i < yesBranch.length - 1 && (
                      <ArrowDown className="size-4 text-muted-foreground/40" />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center gap-3">
                <span className="text-xs font-medium text-red-500">{dict.conditionNo}</span>
                {noBranch.map((node, i) => (
                  <div
                    key={i}
                    className="w-full transition-all duration-500"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? "translateY(0)" : "translateY(10px)",
                      transitionDelay: `${node.delay}ms`,
                    }}
                  >
                    <FlowNode
                      icon={node.icon}
                      label={node.label}
                      sublabel={node.sublabel}
                      variant={node.variant}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Context panel — desktop only */}
          <div
            className="hidden md:block transition-all duration-700"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(20px)",
              transitionDelay: "400ms",
            }}
          >
            <div className="sticky top-28 rounded-xl border border-border bg-card overflow-hidden">
              <div className="border-b border-border px-4 py-3 flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-semibold text-foreground" style={{ fontFamily: "var(--font-geist)" }}>
                  {dict.contextPanel.title}
                </span>
              </div>
              <div className="p-3 space-y-2 bg-[#ECE5DD] dark:bg-[#0B141A]">
                {dict.contextPanel.messages.map((msg, i) => (
                  <div key={i} className={cn("flex", msg.from === "ai" ? "justify-start" : "justify-end")}>
                    <div
                      className={cn(
                        "max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed shadow-sm",
                        msg.from === "ai"
                          ? "bg-white dark:bg-[#202C33] text-foreground"
                          : "bg-[#DCF8C6] dark:bg-[#005C4B] text-foreground"
                      )}
                    >
                      <p>{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify build**

Run: `npm run build`

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/flow-diagram.tsx src/dictionaries/tr.json src/dictionaries/en.json
git commit -m "feat: upgrade flow diagram — wider layout, context panel, status badges"
```

---

### Task 10: Upgrade Gradient Border — Warmer Colors + Glow Effect

**Files:**
- Modify: `src/components/ui/gradient-border.tsx`

- [ ] **Step 1: Update the gradient colors and add glow shadow**

In `src/components/ui/gradient-border.tsx`, make two changes:

1. Replace the conic-gradient color stops from vivid (`#ff4545, #00ff87, #00d4ff, #b344ff, #ff4545`) to warmer/pastel:
   New: `#f59e0b, #f97316, #ef4444, #8b5cf6, #06b6d4, #10b981, #f59e0b`
   (amber → orange → red → violet → cyan → emerald → amber loop)

2. Add a subtle glow `box-shadow` to the outer container:
   `boxShadow: "0 0 20px 4px rgba(245,158,11,0.08), 0 0 60px 12px rgba(139,92,246,0.06)"`

The full updated return JSX:

```tsx
return (
  <div
    ref={containerRef}
    className={cn(
      "relative rounded-2xl",
      animated && supportsProperty && "animate-[gradient-spin_4s_linear_infinite]",
      className
    )}
    style={{
      padding: borderWidth,
      background: `conic-gradient(from var(--gradient-angle, 0deg), #f59e0b, #f97316, #ef4444, #8b5cf6, #06b6d4, #10b981, #f59e0b)`,
      boxShadow: "0 0 20px 4px rgba(245,158,11,0.08), 0 0 60px 12px rgba(139,92,246,0.06)",
    }}
  >
    <div className="rounded-[calc(1rem-2px)] bg-white dark:bg-[#18181B] h-full w-full">
      {children}
    </div>
  </div>
);
```

- [ ] **Step 2: Verify build**

Run: `npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/gradient-border.tsx
git commit -m "feat: gradient border — warmer colors, glow shadow"
```

---

### Task 11: Wire Mockups into Agent Tabs

**Files:**
- Modify: `src/components/sections/agent-tabs.tsx`

- [ ] **Step 1: Replace placeholder div with per-tab mockup**

Import all 5 mockup components that match the 5 agent tabs (Conversation → WhatsAppChat, Proposal → ProposalDoc, Research → ResearchReport, Meeting → CallPlayer, RAG → RagSearch). Map tab index to component.

Replace the full content of `src/components/sections/agent-tabs.tsx`:

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";
import { WhatsAppChat } from "@/components/mockups/whatsapp-chat";
import { ProposalDoc } from "@/components/mockups/proposal-doc";
import { ResearchReport } from "@/components/mockups/research-report";
import { CallPlayer } from "@/components/mockups/call-player";
import { RagSearch } from "@/components/mockups/rag-search";

interface AgentTab {
  title: string;
  description: string;
  features: string[];
}

interface AgentTabsProps {
  tabs: AgentTab[];
}

const TAB_MOCKUPS = [
  WhatsAppChat,
  ProposalDoc,
  ResearchReport,
  CallPlayer,
  RagSearch,
];

export function AgentTabs({ tabs }: AgentTabsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const Mockup = TAB_MOCKUPS[activeTab];

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex overflow-x-auto border-b border-border [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`relative whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors duration-300 cursor-pointer ${
                activeTab === i
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={{ fontFamily: "var(--font-geist)" }}
            >
              {tab.title}
              {activeTab === i && (
                <motion.div
                  layoutId="agentTabIndicator"
                  className="absolute inset-x-0 -bottom-px h-0.5 bg-foreground"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start"
          >
            <div>
              <h3
                className="text-2xl font-semibold text-foreground tracking-tight"
                style={{ fontFamily: "var(--font-geist)" }}
              >
                {tabs[activeTab].title}
              </h3>
              <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                {tabs[activeTab].description}
              </p>
              <ul className="mt-6 space-y-3">
                {tabs[activeTab].features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-foreground">
                    <span className="size-5 rounded-full border border-primary/20 flex items-center justify-center shrink-0">
                      <Check className="size-3 text-primary" strokeWidth={2.5} />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {Mockup && <Mockup />}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/agent-tabs.tsx
git commit -m "feat: agent tabs — replace placeholder with per-tab UI mockups"
```

---

### Task 12: Wire Mockups into Meeting Hero

**Files:**
- Modify: `src/components/sections/meeting-hero.tsx`

- [ ] **Step 1: Replace placeholder divs with MeetingList and CallPlayer**

Import `MeetingList` from `@/components/mockups/meeting-list` and `CallPlayer` from `@/components/mockups/call-player`. Replace the two placeholder `<div>` elements inside the `motion.div` grid:

In `src/components/sections/meeting-hero.tsx`, replace lines 63-69 (the two placeholder divs) with:

```tsx
<MeetingList className="shadow-lg" />
<CallPlayer className="shadow-lg" />
```

Add the imports at the top:

```tsx
import { MeetingList } from "@/components/mockups/meeting-list";
import { CallPlayer } from "@/components/mockups/call-player";
```

- [ ] **Step 2: Verify build**

Run: `npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/meeting-hero.tsx
git commit -m "feat: meeting hero — real mockups instead of placeholders"
```

---

### Task 13: Upgrade ScrollPinnedFeatures — Accept Visuals Prop

**Files:**
- Modify: `src/components/sections/scroll-pinned-features.tsx`

- [ ] **Step 1: Add a `visuals` prop that maps feature index to a React node**

The component currently shows `{features[activeIndex]?.title} visual` placeholder text. Add an optional `visuals` prop that is an array of `React.ReactNode`. If provided, render `visuals[activeIndex]` instead of the placeholder.

Replace the full content of `src/components/sections/scroll-pinned-features.tsx`:

```tsx
"use client";

import { useRef, useState, useEffect } from "react";

interface StickyFeature {
  title: string;
  description: string;
}

interface ScrollPinnedFeaturesProps {
  title: string;
  features: StickyFeature[];
  visuals?: React.ReactNode[];
}

export function ScrollPinnedFeatures({
  title,
  features,
  visuals,
}: ScrollPinnedFeaturesProps) {
  const sentinelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sentinelRefs.current.forEach((sentinel, i) => {
      if (!sentinel) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveIndex(i);
          }
        },
        { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
      );
      observer.observe(sentinel);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2
          className="text-[28px] sm:text-[32px] md:text-[36px] font-medium leading-none text-foreground text-center mb-16"
          style={{ letterSpacing: "-0.05em", fontFamily: "var(--font-geist)" }}
        >
          {title}
        </h2>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            <div className="space-y-0">
              {features.map((feature, i) => (
                <div
                  key={i}
                  ref={(el) => { sentinelRefs.current[i] = el; }}
                  className="min-h-[400px] flex items-center"
                >
                  <div
                    className="transition-opacity duration-500"
                    style={{ opacity: activeIndex === i ? 1 : 0.2 }}
                  >
                    <h3
                      className="text-xl font-semibold text-foreground tracking-tight"
                      style={{ fontFamily: "var(--font-geist)" }}
                    >
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden md:block">
              <div className="sticky top-28">
                {visuals ? (
                  visuals[activeIndex]
                ) : (
                  <div className="rounded-xl border border-border bg-card p-8 min-h-[400px] flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">
                      {features[activeIndex]?.title}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/scroll-pinned-features.tsx
git commit -m "feat: scroll-pinned features — accept visuals prop for real mockups"
```

---

## Phase 3 — Page Assembly

### Task 14: Wire Meeting Page — Visuals + Template Section

**Files:**
- Modify: `src/app/[lang]/meeting/page.tsx`
- Modify: `src/dictionaries/tr.json` (add `meetingPage.templates`)
- Modify: `src/dictionaries/en.json` (add `meetingPage.templates`)

- [ ] **Step 1: Add template dictionary keys**

Add to `meetingPage` in `tr.json` (after the `"cta"` object):

```json
"templates": {
  "title": "Hazır toplantı şablonları",
  "items": [
    { "name": "SPICED", "description": "Durum, Sorun, Etki, Kritik Olay, Karar — satış toplantıları için ideal." },
    { "name": "Müşteri Keşif", "description": "İhtiyaç analizi, bütçe, zaman çizelgesi ve karar süreci keşfi." },
    { "name": "Sprint Retrospektif", "description": "Neler iyi gitti, neler kötü gitti, aksiyonlar — ürün ekipleri için." },
    { "name": "Kick-off", "description": "Proje kapsamı, rolleri, zaman çizelgesi ve başarı kriterleri belirleme." }
  ]
}
```

Add English version to `en.json`:

```json
"templates": {
  "title": "Ready-made meeting templates",
  "items": [
    { "name": "SPICED", "description": "Situation, Pain, Impact, Critical Event, Decision — ideal for sales meetings." },
    { "name": "Customer Discovery", "description": "Needs analysis, budget, timeline, and decision process discovery." },
    { "name": "Sprint Retrospective", "description": "What went well, what went wrong, actions — for product teams." },
    { "name": "Kick-off", "description": "Project scope, roles, timeline, and success criteria definition." }
  ]
}
```

- [ ] **Step 2: Update meeting page to pass visuals and add template section**

Replace the full content of `src/app/[lang]/meeting/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/dictionaries";
import type { Locale } from "@/dictionaries";
import type { Metadata } from "next";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { MeetingHero } from "@/components/sections/meeting-hero";
import { ScrollPinnedFeatures } from "@/components/sections/scroll-pinned-features";
import { NumberedFeatures } from "@/components/sections/numbered-features";
import { PageCTA } from "@/components/sections/page-cta";
import { CrmTable } from "@/components/mockups/crm-table";
import { MeetingTranscript } from "@/components/mockups/meeting-transcript";
import { CallPlayer } from "@/components/mockups/call-player";
import { Zoom } from "@/components/ui/svgs/zoom";
import { GoogleMeet } from "@/components/ui/svgs/google-meet";
import { MsTeams } from "@/components/ui/svgs/ms-teams";

const BASE_URL = "https://edfu.ai";

export async function generateStaticParams() {
  return [{ lang: "tr" }, { lang: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const isEn = lang === "en";

  return {
    title: isEn
      ? "Meeting Agent - Smarter Meetings, Start to Finish | Edfu"
      : "Toplantı Agenti - Daha Akıllı Toplantılar | Edfu",
    description: isEn
      ? "Automatic recording, transcription, action items. Meetings that feed your company memory."
      : "Otomatik kayıt, transkript, aksiyon maddeleri. Şirket hafızanızı besleyen toplantılar.",
    alternates: {
      canonical: isEn ? "/en/meeting" : "/meeting",
      languages: { tr: "/meeting", en: "/en/meeting", "x-default": "/meeting" },
    },
    openGraph: {
      title: isEn ? "Meeting Agent | Edfu" : "Toplantı Agenti | Edfu",
      url: isEn ? `${BASE_URL}/en/meeting` : `${BASE_URL}/meeting`,
    },
  };
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Zoom,
  "Google Meet": GoogleMeet,
  "Microsoft Teams": MsTeams,
};

export default async function MeetingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const mp = dict.meetingPage;

  const stickyVisuals = [
    <CrmTable key="crm" />,
    <MeetingTranscript key="transcript" />,
    <CallPlayer key="player" />,
  ];

  return (
    <>
      <Navbar dict={dict.navbar} lang={lang} />
      <div className="relative mx-auto max-w-7xl border-x border-border">
        <div className="pointer-events-none absolute inset-y-0 left-4 md:left-6 z-10 w-px bg-border" />
        <div className="pointer-events-none absolute inset-y-0 right-4 md:right-6 z-10 w-px bg-border" />
        <main className="divide-y divide-border">
          <MeetingHero dict={mp.hero} />

          {/* 3 Feature Cards */}
          <section className="py-16 sm:py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mp.featureCards.map((card: { title: string; description: string }, i: number) => (
                  <div
                    key={i}
                    className="rounded-xl border border-border bg-white dark:bg-[#27272A] p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.04)]"
                  >
                    <h3
                      className="text-base font-semibold text-foreground tracking-tight"
                      style={{ fontFamily: "var(--font-geist)" }}
                    >
                      {card.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <ScrollPinnedFeatures
            title={mp.stickySection.title}
            features={mp.stickySection.features}
            visuals={stickyVisuals}
          />
          <NumberedFeatures features={mp.numberedFeatures} />

          {/* Integration Logos — with real SVGs */}
          <section className="py-16 sm:py-20">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
              <h2
                className="text-[28px] sm:text-[32px] md:text-[36px] font-medium leading-none text-foreground mb-10"
                style={{ letterSpacing: "-0.05em", fontFamily: "var(--font-geist)" }}
              >
                {mp.integrationLogos.title}
              </h2>
              <div className="flex items-center justify-center gap-8 sm:gap-12">
                {mp.integrationLogos.tools.map((tool: string) => {
                  const Icon = ICON_MAP[tool];
                  return (
                    <div
                      key={tool}
                      className="flex flex-col items-center gap-2 rounded-xl border border-border bg-white dark:bg-[#27272A] p-6 shadow-sm"
                    >
                      <div className="size-12 rounded-xl bg-muted flex items-center justify-center">
                        {Icon ? (
                          <Icon className="size-6" />
                        ) : (
                          <span className="text-xs font-bold text-muted-foreground">{tool.charAt(0)}</span>
                        )}
                      </div>
                      <span className="text-sm font-medium text-foreground">{tool}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Templates section */}
          <section className="py-16 sm:py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <h2
                className="text-[28px] sm:text-[32px] md:text-[36px] font-medium leading-none text-foreground text-center mb-12"
                style={{ letterSpacing: "-0.05em", fontFamily: "var(--font-geist)" }}
              >
                {mp.templates.title}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mp.templates.items.map((tpl: { name: string; description: string }, i: number) => (
                  <div
                    key={i}
                    className="rounded-xl border border-border bg-white dark:bg-[#27272A] p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className="text-xs font-bold text-muted-foreground/40"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        [{String(i + 1).padStart(2, "0")}]
                      </span>
                      <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: "var(--font-geist)" }}>
                        {tpl.name}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed pl-9">
                      {tpl.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonial */}
          <section className="relative z-20 bg-white dark:bg-[oklch(0.14_0.005_250)] py-16 sm:py-20 px-4 sm:px-12 lg:px-20">
            <div className="mx-auto max-w-3xl">
              <blockquote
                className="text-xl sm:text-2xl font-medium leading-relaxed tracking-tight"
                style={{ fontFamily: "var(--font-geist)" }}
              >
                &ldquo;{mp.testimonial.quote}&rdquo;
              </blockquote>
              <div className="mt-8">
                <p className="font-medium text-foreground">{mp.testimonial.authorName}</p>
                <p className="text-sm text-muted-foreground">{mp.testimonial.authorTitle}</p>
              </div>
            </div>
          </section>

          <PageCTA
            title={mp.cta.title}
            buttonText={mp.cta.button}
            buttonHref="https://app.edfu.ai"
          />
        </main>
        <Footer dict={dict.footer} lang={lang} />
      </div>
    </>
  );
}
```

- [ ] **Step 3: Verify build**

Run: `npm run build`

- [ ] **Step 4: Commit**

```bash
git add src/app/[lang]/meeting/page.tsx src/dictionaries/tr.json src/dictionaries/en.json
git commit -m "feat: meeting page — real mockup visuals, SVG logos, template section"
```

---

### Task 15: Final Build Verification

**Files:** None (verification only)

- [ ] **Step 1: Full build**

Run: `npm run build`

Confirm all 15 static pages generate successfully with 0 TypeScript errors.

- [ ] **Step 2: TypeScript check**

Run: `npx tsc --noEmit`

Confirm zero errors.

---

## Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| Phase 1 | Tasks 1-7 | Create 8 mockup components (WhatsApp, CRM, Proposal, CallPlayer, MeetingList, ResearchReport, RagSearch, MeetingTranscript) |
| Phase 2 | Tasks 8-13 | Upgrade FlowNode, FlowDiagram, GradientBorder, AgentTabs, MeetingHero, ScrollPinnedFeatures |
| Phase 3 | Tasks 14-15 | Wire meeting page with visuals + templates, final verification |

Each task produces a working, committable increment. Tasks 1-7 are independent and can be parallelized.
