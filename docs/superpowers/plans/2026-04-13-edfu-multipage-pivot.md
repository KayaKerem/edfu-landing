# Edfu Multi-Page Pivot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform Edfu from a single-page landing site to a 5-page multi-page site reflecting the pivot to a multi-channel AI customer communication and automation platform.

**Architecture:** Next.js 16 App Router with `[lang]` dynamic segments. Shared layout with refactored navbar (route links replacing hash links). New pages at `/agents`, `/meeting`, `/integrations`, `/pricing`. Shared reusable components for numbered features, CTA banners, and data model visualizations.

**Tech Stack:** Next.js 16.2.1, Tailwind CSS 4 (oklch), motion library, Geist + Geist Mono fonts, next-themes, shadcn/ui, TypeScript.

**Spec:** `docs/superpowers/specs/2026-04-13-edfu-multipage-pivot-design.md`

**Codebase conventions observed:**
- All section components receive `dict` props typed from `Dictionary`
- Client components use `"use client"` directive
- Font applied via `style={{ fontFamily: "var(--font-geist)" }}`
- Geist Mono available as `font-mono` via `--font-mono: "Geist Mono"` in globals.css
- Section headers use `text-[28px] sm:text-[32px] md:text-[36px] font-medium` with `letterSpacing: "-0.05em"`
- Dark mode uses `dark:bg-[#27272A]` for card backgrounds, `dark:bg-[oklch(...)]` for section backgrounds
- motion library imported from `"motion/react"` (NOT framer-motion)
- Animations: `motion.div` with `initial/animate/transition`
- Proxy (middleware) at `src/proxy.ts` exports `proxy` function + `config`
- Dictionary loader at `src/dictionaries/index.ts` uses dynamic imports with `server-only`
- Layout at `src/app/[lang]/layout.tsx` has `generateStaticParams` and `generateMetadata`

---

## Phase 1 — Infrastructure (No Visual Changes)

### Task 1: Refactor Navbar — Hash Links to Route Links

**Files:**
- Edit: `src/components/sections/navbar.tsx`
- Edit: `src/dictionaries/tr.json`
- Edit: `src/dictionaries/en.json`

- [ ] **Step 1: Update dictionary navbar keys**

Edit `src/dictionaries/tr.json` — replace the `navbar` object:

```json
"navbar": {
  "home": "Ana Sayfa",
  "agents": "Agent'lar",
  "meeting": "Toplanti",
  "integrations": "Entegrasyonlar",
  "pricing": "Fiyatlandirma",
  "cta": "Ucretsiz Deneyin",
  "menuOpen": "Menuyu ac",
  "menuClose": "Menuyu kapat"
}
```

Edit `src/dictionaries/en.json` — replace the `navbar` object:

```json
"navbar": {
  "home": "Home",
  "agents": "Agents",
  "meeting": "Meeting",
  "integrations": "Integrations",
  "pricing": "Pricing",
  "cta": "Try Free",
  "menuOpen": "Open menu",
  "menuClose": "Close menu"
}
```

Note: Removed `features` and `howItWorks` keys, added `agents`, `meeting`, `integrations`.

- [ ] **Step 2: Rewrite navbar.tsx with route-based navigation**

Replace the entire `src/components/sections/navbar.tsx` with:

```tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Lottie from "lottie-react";
import navbarCatAnimation from "@/../public/navbar-cat.json";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { motion, AnimatePresence } from "motion/react";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { Dictionary } from "@/dictionaries";

function NavbarCatLogo() {
  const lottieRef = useRef<any>(null);

  const handleComplete = useCallback(() => {
    setTimeout(() => {
      lottieRef.current?.goToAndPlay(0);
    }, 4000);
  }, []);

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={navbarCatAnimation}
      loop={false}
      autoplay
      onComplete={handleComplete}
      className="size-8"
    />
  );
}

interface NavLink {
  label: string;
  href: string;
  routeId: string;
}

interface NavbarProps {
  dict: Dictionary["navbar"];
  lang: string;
}

export function Navbar({ dict, lang }: NavbarProps) {
  const prefix = lang === "tr" ? "" : `/${lang}`;

  const navLinks: NavLink[] = [
    { label: dict.home, href: `${prefix}/`, routeId: "/" },
    { label: dict.agents, href: `${prefix}/agents`, routeId: "/agents" },
    { label: dict.meeting, href: `${prefix}/meeting`, routeId: "/meeting" },
    { label: dict.integrations, href: `${prefix}/integrations`, routeId: "/integrations" },
    { label: dict.pricing, href: `${prefix}/pricing`, routeId: "/pricing" },
  ];

  const pathname = usePathname();
  // Strip locale prefix to get the route part
  const currentRoute = pathname.replace(/^\/(tr|en)/, "") || "/";

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLUListElement>(null);
  const linkRefs = useRef<Map<string, HTMLLIElement>>(new Map());

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update pill position based on active route
  const updatePill = useCallback(() => {
    const activeLi = linkRefs.current.get(currentRoute);
    const nav = navRef.current;
    if (!activeLi || !nav) return;
    const navRect = nav.getBoundingClientRect();
    const liRect = activeLi.getBoundingClientRect();
    setPillStyle({
      left: liRect.left - navRect.left,
      width: liRect.width,
    });
  }, [currentRoute]);

  useEffect(() => {
    updatePill();
    window.addEventListener("resize", updatePill);
    return () => window.removeEventListener("resize", updatePill);
  }, [updatePill]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4">
      <motion.nav
        initial={false}
        animate={{
          maxWidth: isScrolled ? 960 : 1120,
          marginTop: isScrolled ? 20 : 16,
        }}
        transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
        className="w-full"
      >
        <div
          className={`rounded-2xl transition-all duration-300 ${
            isScrolled
              ? "border border-border bg-background/75 shadow-sm backdrop-blur-lg"
              : "bg-transparent"
          }`}
        >
          <div className="relative flex h-14 items-center justify-between px-4 sm:px-5">
            {/* Logo */}
            <Link href={`${prefix}/`} className="flex items-end gap-2">
              <NavbarCatLogo />
              <span
                className="text-xl leading-none -translate-y-[1px] font-semibold tracking-tight"
                style={{ fontFamily: "var(--font-geist)" }}
              >
                Edfu
              </span>
            </Link>

            {/* Desktop nav links - absolute center */}
            <ul
              ref={navRef}
              className="absolute left-1/2 -translate-x-1/2 hidden h-11 items-center justify-center rounded-full px-2 md:flex whitespace-nowrap"
            >
              {/* Animated pill indicator */}
              {pillStyle.width > 0 && (
                <motion.li
                  className="absolute inset-y-0 my-1.5 rounded-full border border-border bg-background"
                  animate={{ left: pillStyle.left, width: pillStyle.width }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  style={{ listStyle: "none" }}
                  aria-hidden
                />
              )}
              {navLinks.map((link) => (
                <li
                  key={link.routeId}
                  ref={(el) => {
                    if (el) linkRefs.current.set(link.routeId, el);
                  }}
                  style={{ listStyle: "none" }}
                >
                  <Link
                    href={link.href}
                    style={{ fontFamily: "var(--font-geist)" }}
                    className={`relative z-10 flex h-full cursor-pointer items-center justify-center px-3 py-2 text-sm font-medium tracking-tight transition-colors duration-200 ${
                      currentRoute === link.routeId
                        ? "text-foreground"
                        : "text-foreground/60 hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Right: CTA + Theme toggle */}
            <div className="hidden items-center gap-2 md:flex">
              <Link
                href={`${prefix}/pricing`}
                className="bg-primary h-8 flex items-center justify-center text-sm font-normal tracking-wide rounded-full text-primary-foreground dark:text-primary-foreground w-fit px-4 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_3px_3px_-1.5px_rgba(16,24,40,0.06),0_1px_1px_rgba(16,24,40,0.08)] border border-white/[0.12]"
              >
                {dict.cta}
              </Link>
              <LanguageSwitcher lang={lang} />
              <AnimatedThemeToggler className="size-8 cursor-pointer rounded-full border border-border text-muted-foreground" />
            </div>

            {/* Mobile */}
            <div className="flex items-center gap-2 md:hidden">
              <LanguageSwitcher lang={lang} />
              <AnimatedThemeToggler className="size-8 cursor-pointer rounded-full border border-border text-muted-foreground" />
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? dict.menuClose : dict.menuOpen}
                className="inline-flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground"
              >
                {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mt-2 rounded-2xl border border-border bg-background/95 backdrop-blur-lg md:hidden"
            >
              <nav className="flex flex-col gap-1 p-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.routeId}
                    href={link.href}
                    className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                      currentRoute === link.routeId
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href={`${prefix}/pricing`}
                  className="mt-2 flex h-10 items-center justify-center rounded-full bg-primary text-sm font-normal tracking-wide text-primary-foreground shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_3px_3px_-1.5px_rgba(16,24,40,0.06),0_1px_1px_rgba(16,24,40,0.08)] border border-white/[0.12] transition-all ease-out active:scale-95"
                >
                  {dict.cta}
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
}
```

Key changes:
- `navLinks` uses route-based `href` (e.g. `/agents`) and `routeId` instead of `#hash` and `sectionId`
- `usePathname()` replaces `IntersectionObserver` for active detection
- `<Link>` replaces `<a>` for all navigation
- `isClickScrolling` ref removed entirely
- Mobile menu auto-closes on route change via `useEffect` on `pathname`
- Locale prefix computed from `lang` prop

- [ ] **Step 3: Verify navbar renders without errors**

Run: `npm run dev`

Open `http://localhost:3000` — navbar should render with new link labels. Clicking "Agent'lar" etc. will 404 until pages are created, which is expected.

---

### Task 2: Fix Language Switcher Path Preservation

**Files:**
- Edit: `src/components/language-switcher.tsx`

- [ ] **Step 1: Update language switcher to preserve current path**

Replace the entire `src/components/language-switcher.tsx` with:

```tsx
"use client";

import { usePathname } from "next/navigation";

export function LanguageSwitcher({ lang }: { lang: string }) {
  const isEn = lang === "en";
  const pathname = usePathname();

  function handleSwitch(targetLocale: string) {
    document.cookie = `NEXT_LOCALE=${targetLocale};path=/;max-age=31536000`;
    // Strip existing locale prefix to get the path
    const currentPath = pathname.replace(/^\/(en|tr)/, "") || "/";
    window.location.href =
      targetLocale === "en" ? `/en${currentPath}` : currentPath;
  }

  return (
    <button
      onClick={() => handleSwitch(isEn ? "tr" : "en")}
      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      {isEn ? "TR" : "EN"}
    </button>
  );
}
```

Key change: Uses `usePathname()` to get the current path and preserves it when switching locale. `/en/agents` -> TR sends to `/agents` (not `/`).

- [ ] **Step 2: Verify language switcher**

Navigate to `http://localhost:3000` and click the language toggle. Confirm:
- From `/` (TR) -> switches to `/en` (EN) 
- From `/en` -> switches back to `/`

---

### Task 3: Update Proxy (Middleware) for New Routes

**Files:**
- Edit: `src/proxy.ts`

- [ ] **Step 1: Verify proxy already handles new routes**

Read `src/proxy.ts`. The current implementation already handles arbitrary paths:
- No-prefix paths: rewrites to `/tr${pathname}` (e.g. `/agents` -> `/tr/agents`)
- `/en/*` paths: passes through as-is
- `/tr/*` paths: redirects to prefix-less

**No changes needed.** The proxy uses `pathname` generically, not hardcoded routes. New routes like `/agents`, `/meeting`, `/integrations`, `/pricing` will be handled automatically.

Verify by running `npm run dev` and confirming:
- `http://localhost:3000/agents` rewrites to `/tr/agents` internally
- `http://localhost:3000/en/agents` serves as-is

---

### Task 4: Update Sitemap with New Pages

**Files:**
- Edit: `src/app/sitemap.ts`

- [ ] **Step 1: Add all new pages to sitemap**

Replace the entire `src/app/sitemap.ts` with:

```ts
import type { MetadataRoute } from "next";

const BASE_URL = "https://edfu.ai";

const pages = [
  { path: "", priority: 1 },
  { path: "/agents", priority: 0.9 },
  { path: "/meeting", priority: 0.9 },
  { path: "/integrations", priority: 0.8 },
  { path: "/pricing", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((page) => ({
    url: `${BASE_URL}${page.path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: page.priority,
    alternates: {
      languages: {
        tr: `${BASE_URL}${page.path}`,
        en: `${BASE_URL}/en${page.path}`,
      },
    },
  }));
}
```

- [ ] **Step 2: Verify sitemap**

Run: `npm run build && npm run start`

Open `http://localhost:3000/sitemap.xml` — verify it lists all 5 URLs with hreflang alternates.

---

### Task 5: Scaffold New Page Routes (Empty Pages)

**Files:**
- Create: `src/app/[lang]/agents/page.tsx`
- Create: `src/app/[lang]/meeting/page.tsx`
- Create: `src/app/[lang]/integrations/page.tsx`
- Create: `src/app/[lang]/pricing/page.tsx`

- [ ] **Step 1: Create `/agents` page scaffold**

Create `src/app/[lang]/agents/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/dictionaries";
import type { Locale } from "@/dictionaries";
import type { Metadata } from "next";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";

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
  const dict = await getDictionary(lang as Locale);
  const isEn = lang === "en";

  return {
    title: isEn
      ? "AI Agents - Automate, Research, Sell | Edfu"
      : "AI Agent'lar - Otomatiklestirin, Arastirin, Satin | Edfu",
    description: isEn
      ? "5 AI agents working together: Conversation, Proposal, Research, Meeting, and RAG agents."
      : "Birlikte calisan 5 AI agent: Konusma, Teklif, Arastirma, Toplanti ve RAG agentlari.",
    alternates: {
      canonical: isEn ? "/en/agents" : "/agents",
      languages: {
        tr: "/agents",
        en: "/en/agents",
        "x-default": "/agents",
      },
    },
    openGraph: {
      title: isEn
        ? "AI Agents | Edfu"
        : "AI Agent'lar | Edfu",
      description: isEn
        ? "5 AI agents working together to automate your customer communication."
        : "Musteri iletisiminizi otomatiklestiren 5 AI agent.",
      url: isEn ? `${BASE_URL}/en/agents` : `${BASE_URL}/agents`,
    },
  };
}

export default async function AgentsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);

  return (
    <>
      <Navbar dict={dict.navbar} lang={lang} />
      <div className="relative mx-auto max-w-7xl border-x border-border">
        <div className="pointer-events-none absolute inset-y-0 left-4 md:left-6 z-10 w-px bg-border" />
        <div className="pointer-events-none absolute inset-y-0 right-4 md:right-6 z-10 w-px bg-border" />
        <main className="divide-y divide-border">
          <div className="flex items-center justify-center min-h-[60vh] pt-20">
            <p className="text-muted-foreground">Agents page — coming soon</p>
          </div>
        </main>
        <Footer dict={dict.footer} />
      </div>
    </>
  );
}
```

- [ ] **Step 2: Create `/meeting` page scaffold**

Create `src/app/[lang]/meeting/page.tsx` — same pattern as agents but with meeting metadata:

```tsx
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/dictionaries";
import type { Locale } from "@/dictionaries";
import type { Metadata } from "next";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";

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
      : "Toplanti Agenti - Daha Akilli Toplantilar | Edfu",
    description: isEn
      ? "Automatic recording, transcription, action items. Meetings that feed your company memory."
      : "Otomatik kayit, transkript, aksiyon maddeleri. Sirket hafizanizi besleyen toplantilar.",
    alternates: {
      canonical: isEn ? "/en/meeting" : "/meeting",
      languages: { tr: "/meeting", en: "/en/meeting", "x-default": "/meeting" },
    },
    openGraph: {
      title: isEn ? "Meeting Agent | Edfu" : "Toplanti Agenti | Edfu",
      url: isEn ? `${BASE_URL}/en/meeting` : `${BASE_URL}/meeting`,
    },
  };
}

export default async function MeetingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);

  return (
    <>
      <Navbar dict={dict.navbar} lang={lang} />
      <div className="relative mx-auto max-w-7xl border-x border-border">
        <div className="pointer-events-none absolute inset-y-0 left-4 md:left-6 z-10 w-px bg-border" />
        <div className="pointer-events-none absolute inset-y-0 right-4 md:right-6 z-10 w-px bg-border" />
        <main className="divide-y divide-border">
          <div className="flex items-center justify-center min-h-[60vh] pt-20">
            <p className="text-muted-foreground">Meeting page — coming soon</p>
          </div>
        </main>
        <Footer dict={dict.footer} />
      </div>
    </>
  );
}
```

- [ ] **Step 3: Create `/integrations` page scaffold**

Create `src/app/[lang]/integrations/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/dictionaries";
import type { Locale } from "@/dictionaries";
import type { Metadata } from "next";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";

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
      ? "Integrations - All Channels, One Platform | Edfu"
      : "Entegrasyonlar - Tum Kanallariniz, Tek Platform | Edfu",
    description: isEn
      ? "WhatsApp, Instagram, Telegram, Zoom, Meet, Teams and more. Connect all your channels."
      : "WhatsApp, Instagram, Telegram, Zoom, Meet, Teams ve dahasi. Tum kanallarinizi baglayin.",
    alternates: {
      canonical: isEn ? "/en/integrations" : "/integrations",
      languages: { tr: "/integrations", en: "/en/integrations", "x-default": "/integrations" },
    },
    openGraph: {
      title: isEn ? "Integrations | Edfu" : "Entegrasyonlar | Edfu",
      url: isEn ? `${BASE_URL}/en/integrations` : `${BASE_URL}/integrations`,
    },
  };
}

export default async function IntegrationsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);

  return (
    <>
      <Navbar dict={dict.navbar} lang={lang} />
      <div className="relative mx-auto max-w-7xl border-x border-border">
        <div className="pointer-events-none absolute inset-y-0 left-4 md:left-6 z-10 w-px bg-border" />
        <div className="pointer-events-none absolute inset-y-0 right-4 md:right-6 z-10 w-px bg-border" />
        <main className="divide-y divide-border">
          <div className="flex items-center justify-center min-h-[60vh] pt-20">
            <p className="text-muted-foreground">Integrations page — coming soon</p>
          </div>
        </main>
        <Footer dict={dict.footer} />
      </div>
    </>
  );
}
```

- [ ] **Step 4: Create `/pricing` page scaffold**

Create `src/app/[lang]/pricing/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/dictionaries";
import type { Locale } from "@/dictionaries";
import type { Metadata } from "next";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";

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
  const dict = await getDictionary(lang as Locale);
  const isEn = lang === "en";

  return {
    title: isEn
      ? "Pricing - Choose the Right Plan | Edfu"
      : "Fiyatlandirma - Isletmenize Uygun Plan | Edfu",
    description: isEn
      ? "Starter, Professional, and Enterprise plans. All with 14-day free trial."
      : "Baslangic, Profesyonel ve Kurumsal planlar. Tumunde 14 gun ucretsiz deneme.",
    alternates: {
      canonical: isEn ? "/en/pricing" : "/pricing",
      languages: { tr: "/pricing", en: "/en/pricing", "x-default": "/pricing" },
    },
    openGraph: {
      title: isEn ? "Pricing | Edfu" : "Fiyatlandirma | Edfu",
      url: isEn ? `${BASE_URL}/en/pricing` : `${BASE_URL}/pricing`,
    },
  };
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);

  return (
    <>
      <Navbar dict={dict.navbar} lang={lang} />
      <div className="relative mx-auto max-w-7xl border-x border-border">
        <div className="pointer-events-none absolute inset-y-0 left-4 md:left-6 z-10 w-px bg-border" />
        <div className="pointer-events-none absolute inset-y-0 right-4 md:right-6 z-10 w-px bg-border" />
        <main className="divide-y divide-border">
          <div className="flex items-center justify-center min-h-[60vh] pt-20">
            <p className="text-muted-foreground">Pricing page — coming soon</p>
          </div>
        </main>
        <Footer dict={dict.footer} />
      </div>
    </>
  );
}
```

- [ ] **Step 5: Verify all scaffolded pages**

Run: `npm run dev`

Navigate to each page and confirm they render the placeholder text with navbar + footer:
- `http://localhost:3000/` — homepage (existing)
- `http://localhost:3000/agents` — "Agents page — coming soon"
- `http://localhost:3000/meeting` — "Meeting page — coming soon"
- `http://localhost:3000/integrations` — "Integrations page — coming soon"
- `http://localhost:3000/pricing` — "Pricing page — coming soon"
- `http://localhost:3000/en/agents` — English version

Confirm navbar pill indicator highlights the correct link on each page.

---

### Task 6: Update Footer with New Page Links

**Files:**
- Edit: `src/components/sections/footer.tsx`
- Edit: `src/dictionaries/tr.json`
- Edit: `src/dictionaries/en.json`

- [ ] **Step 1: Add `lang` prop to Footer and update links**

The footer currently uses `href="#"` for all links. Update it to use real routes for product links.

Edit `src/components/sections/footer.tsx`:

1. Add `lang` to the props interface:

```tsx
interface FooterProps {
  dict: Dictionary["footer"];
  lang: string;
}

export function Footer({ dict, lang }: FooterProps) {
```

2. Import `Link` from `next/link` at the top.

3. Add route prefix computation:

```tsx
const prefix = lang === "tr" ? "" : `/${lang}`;
```

4. Update the logo link from `<a href="#hero">` to `<Link href={`${prefix}/`}>`.

5. Update the product column links to use actual routes. Add a `footerLinks` map in the component:

```tsx
const footerRoutes: Record<string, string> = {
  "Fiyatlandirma": `${prefix}/pricing`,
  "Pricing": `${prefix}/pricing`,
  "Entegrasyonlar": `${prefix}/integrations`,
  "Integrations": `${prefix}/integrations`,
  "Ozellikler": `${prefix}/agents`,
  "Features": `${prefix}/agents`,
};
```

In the link rendering, check `footerRoutes[link]` and use `<Link>` if found, else keep `<a href="#">`.

- [ ] **Step 2: Update all page files to pass `lang` to Footer**

In every page file (`src/app/[lang]/page.tsx`, `src/app/[lang]/agents/page.tsx`, etc.), update:

```tsx
<Footer dict={dict.footer} lang={lang} />
```

- [ ] **Step 3: Verify footer links**

Click "Fiyatlandirma" in the footer — should navigate to `/pricing`. Click "Entegrasyonlar" — should navigate to `/integrations`.

---

## Phase 2 — Shared Components

### Task 7: Create SVG Icon Components for Channels and Meeting Tools

**Files:**
- Create: `src/components/ui/svgs/whatsapp.tsx`
- Create: `src/components/ui/svgs/instagram.tsx`
- Create: `src/components/ui/svgs/telegram.tsx`
- Create: `src/components/ui/svgs/zoom.tsx`
- Create: `src/components/ui/svgs/google-meet.tsx`
- Create: `src/components/ui/svgs/ms-teams.tsx`
- Create: `src/components/ui/svgs/hubspot.tsx`
- Create: `src/components/ui/svgs/jira.tsx`
- Create: `src/components/ui/svgs/email.tsx`
- Create: `src/components/ui/svgs/webhook.tsx`
- Create: `src/components/ui/svgs/web-form.tsx`
- Create: `src/components/ui/svgs/crm.tsx`
- Create: `src/components/ui/svgs/erp.tsx`
- Create: `src/components/ui/svgs/api.tsx`

- [ ] **Step 1: Create WhatsApp icon**

Create `src/components/ui/svgs/whatsapp.tsx`:

```tsx
export function WhatsApp({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
        fill="#25D366"
      />
      <path
        d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"
        stroke="#25D366"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}
```

- [ ] **Step 2: Create remaining channel icons**

Create each icon file following the same pattern (`export function IconName({ className })` with a branded SVG). Use official brand colors:

- `instagram.tsx` — gradient (purple/pink/orange)
- `telegram.tsx` — `#2AABEE`
- `zoom.tsx` — `#2D8CFF`
- `google-meet.tsx` — `#00897B`
- `ms-teams.tsx` — `#6264A7`
- `hubspot.tsx` — `#FF7A59`
- `jira.tsx` — `#0052CC`
- `email.tsx` — use `currentColor` (generic)
- `webhook.tsx` — use `currentColor` with dashed styling
- `web-form.tsx` — use `currentColor` (generic)
- `crm.tsx` — use `currentColor` (generic)
- `erp.tsx` — use `currentColor` (generic)
- `api.tsx` — use `currentColor` with code brackets styling

Each file follows the existing pattern in `src/components/ui/svgs/` (e.g., `notion.tsx`, `slack.tsx`).

- [ ] **Step 3: Verify icons render**

Import any icon in a scratch page or Storybook equivalent and confirm it renders correctly.

---

### Task 8: Create Flow Node UI Component

**Files:**
- Create: `src/components/ui/flow-node.tsx`

- [ ] **Step 1: Create flow-node.tsx**

```tsx
import { cn } from "@/lib/utils";

interface FlowNodeProps {
  icon?: React.ReactNode;
  label: string;
  sublabel?: string;
  variant?: "default" | "trigger" | "condition" | "action";
  className?: string;
}

export function FlowNode({
  icon,
  label,
  sublabel,
  variant = "default",
  className,
}: FlowNodeProps) {
  const variantStyles = {
    default:
      "bg-white dark:bg-[#27272A] border-[rgba(46,50,56,0.07)] dark:border-border",
    trigger:
      "bg-white dark:bg-[#27272A] border-primary/30 dark:border-primary/40",
    condition:
      "bg-white dark:bg-[#27272A] border-amber-300/50 dark:border-amber-400/40",
    action:
      "bg-white dark:bg-[#27272A] border-emerald-300/50 dark:border-emerald-400/40",
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border px-4 py-3 shadow-[0px_1px_3px_rgba(0,0,0,0.04),0px_1px_2px_rgba(0,0,0,0.06)]",
        variantStyles[variant],
        className
      )}
    >
      {icon && (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{label}</p>
        {sublabel && (
          <p className="text-xs text-muted-foreground truncate">{sublabel}</p>
        )}
      </div>
    </div>
  );
}
```

---

### Task 9: Create SVG Connector Component

**Files:**
- Create: `src/components/ui/svg-connector.tsx`

- [ ] **Step 1: Create svg-connector.tsx**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

interface SvgConnectorProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  animated?: boolean;
  delay?: number;
  className?: string;
}

export function SvgConnector({
  from,
  to,
  animated = true,
  delay = 0,
  className,
}: SvgConnectorProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const [length, setLength] = useState(0);

  // Calculate cubic bezier path
  const midX = (from.x + to.x) / 2;
  const d = `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`;

  useEffect(() => {
    if (pathRef.current) {
      setLength(pathRef.current.getTotalLength());
    }
  }, [from, to]);

  return (
    <path
      ref={pathRef}
      d={d}
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeDasharray={animated && length ? length : undefined}
      strokeDashoffset={animated && length ? length : undefined}
      style={
        animated && length
          ? {
              animation: `drawLine 1s ease-out ${delay}s forwards`,
            }
          : undefined
      }
    />
  );
}
```

Also add the `drawLine` keyframes to `src/app/globals.css`:

```css
@keyframes drawLine {
  to {
    stroke-dashoffset: 0;
  }
}
```

---

### Task 10: Create Gradient Border Wrapper Component

**Files:**
- Create: `src/components/ui/gradient-border.tsx`
- Edit: `src/app/globals.css`

- [ ] **Step 1: Add @property CSS and gradient spin keyframes to globals.css**

Add to `src/app/globals.css` (after the existing `@layer base` block):

```css
@property --gradient-angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

@keyframes gradient-spin {
  to {
    --gradient-angle: 360deg;
  }
}

@keyframes drawLine {
  to {
    stroke-dashoffset: 0;
  }
}
```

- [ ] **Step 2: Create gradient-border.tsx**

```tsx
"use client";

import { cn } from "@/lib/utils";
import { useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface GradientBorderProps {
  children: React.ReactNode;
  className?: string;
  borderWidth?: number;
  animated?: boolean;
}

export function GradientBorder({
  children,
  className,
  borderWidth = 2,
  animated = true,
}: GradientBorderProps) {
  const [supportsProperty, setSupportsProperty] = useState(false);
  const angle = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check @property support
  useEffect(() => {
    setSupportsProperty(CSS.supports("syntax", '"<angle>"'));
  }, []);

  // JS fallback animation for browsers without @property
  useEffect(() => {
    if (supportsProperty || !animated) return;
    const controls = animate(angle, 360, {
      duration: 4,
      repeat: Infinity,
      ease: "linear",
    });
    return () => controls.stop();
  }, [supportsProperty, animated, angle]);

  // Apply angle via JS when @property not supported
  const gradientAngle = useTransform(angle, (v) => `${v}deg`);

  useEffect(() => {
    if (supportsProperty || !animated) return;
    return gradientAngle.on("change", (v) => {
      if (containerRef.current) {
        containerRef.current.style.setProperty("--gradient-angle", v);
      }
    });
  }, [supportsProperty, animated, gradientAngle]);

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
        background: `conic-gradient(from var(--gradient-angle, 0deg), #ff4545, #00ff87, #00d4ff, #b344ff, #ff4545)`,
      }}
    >
      <div className="rounded-[calc(1rem-2px)] bg-white dark:bg-[#18181B] h-full w-full">
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify gradient border renders with spinning animation**

Import `GradientBorder` in any page temporarily and wrap some content. Confirm the conic gradient rotates smoothly.

---

### Task 11: Create Numbered Features Shared Component

**Files:**
- Create: `src/components/sections/numbered-features.tsx`

- [ ] **Step 1: Create numbered-features.tsx**

This reusable component is used on both `/agents` (section 3) and `/meeting` (section 4).

```tsx
interface Feature {
  title: string;
  description: string;
}

interface NumberedFeaturesProps {
  features: Feature[];
  className?: string;
}

export function NumberedFeatures({ features, className }: NumberedFeaturesProps) {
  return (
    <section className={className}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {features.map((feature, i) => (
            <div key={i} className="flex gap-6">
              {/* Number */}
              <span
                className="text-4xl font-bold text-muted-foreground/20 shrink-0 leading-none"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                [{String(i + 1).padStart(2, "0")}]
              </span>
              {/* Content */}
              <div>
                <h3
                  className="text-lg font-semibold text-foreground tracking-tight"
                  style={{ fontFamily: "var(--font-geist)" }}
                >
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

### Task 12: Create Page CTA Banner Shared Component

**Files:**
- Create: `src/components/sections/page-cta.tsx`

- [ ] **Step 1: Create page-cta.tsx**

This is a parametric CTA banner used on every page except homepage (which keeps its existing CTA).

```tsx
import Link from "next/link";

interface PageCTAProps {
  title: string;
  description?: string;
  buttonText: string;
  buttonHref: string;
  subtext?: string;
}

export function PageCTA({
  title,
  description,
  buttonText,
  buttonHref,
  subtext,
}: PageCTAProps) {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative rounded-2xl bg-[#18181B] dark:bg-white/[0.03] dark:border dark:border-border px-6 py-14 sm:px-16 sm:py-24 text-center overflow-hidden">
          {/* Background decorative circles */}
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-white/5" />

          {/* Content */}
          <div className="relative z-10">
            <h2
              className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white dark:text-foreground tracking-tight leading-tight"
              style={{ fontFamily: "var(--font-geist)" }}
            >
              {title}
            </h2>
            {description && (
              <p className="mt-4 text-base text-white/70 dark:text-muted-foreground max-w-xl mx-auto">
                {description}
              </p>
            )}

            <div className="mt-10">
              <Link
                href={buttonHref}
                className="inline-flex h-12 items-center rounded-full bg-primary px-6 sm:px-8 text-sm sm:text-base font-normal tracking-wide text-primary-foreground shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_3px_3px_-1.5px_rgba(16,24,40,0.06),0_1px_1px_rgba(16,24,40,0.08)] border border-white/[0.12] transition-all ease-out hover:bg-primary/90 active:scale-95"
              >
                {buttonText}
              </Link>
            </div>

            {subtext && (
              <p className="mt-4 text-sm text-white/50 dark:text-muted-foreground/60">
                {subtext}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

### Task 13: Create Data Model Visualization Shared Component

**Files:**
- Create: `src/components/sections/data-model-viz.tsx`

- [ ] **Step 1: Create data-model-viz.tsx**

This configurable 3-column flow visualization is used on both `/agents` (agent ecosystem) and `/integrations` (full data pipeline).

```tsx
"use client";

import { useRef, useEffect, useState } from "react";
import { GradientBorder } from "@/components/ui/gradient-border";
import { cn } from "@/lib/utils";

interface VizNode {
  icon?: React.ReactNode;
  label: string;
  sublabel?: string;
}

interface DataModelVizProps {
  sources: VizNode[];
  centerLabel: string;
  centerBadges: string[];
  outputs: VizNode[];
  className?: string;
}

function NodeCard({ node }: { node: VizNode }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[rgba(46,50,56,0.07)] dark:border-border bg-white dark:bg-[#27272A] px-4 py-3 shadow-[0px_1px_3px_rgba(0,0,0,0.04)]">
      {node.icon && (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
          {node.icon}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{node.label}</p>
        {node.sublabel && (
          <p className="text-xs text-muted-foreground truncate">{node.sublabel}</p>
        )}
      </div>
    </div>
  );
}

export function DataModelViz({
  sources,
  centerLabel,
  centerBadges,
  outputs,
  className,
}: DataModelVizProps) {
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
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={cn("py-20 overflow-hidden", className)}>
      <div ref={containerRef} className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 md:gap-12 items-center">
          {/* Left: Sources */}
          <div className="flex flex-col gap-3">
            {sources.map((node, i) => (
              <div
                key={i}
                className="transition-all duration-500"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible
                    ? "translateX(0)"
                    : "translateX(-20px)",
                  transitionDelay: `${i * 100}ms`,
                }}
              >
                <NodeCard node={node} />
              </div>
            ))}
          </div>

          {/* Center: Hub */}
          <div
            className="flex justify-center"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "scale(1)" : "scale(0.9)",
              transition: "all 0.6s ease-out 0.4s",
            }}
          >
            <GradientBorder className="w-48 md:w-56">
              <div className="p-6 text-center">
                <p
                  className="text-lg font-bold text-foreground"
                  style={{ fontFamily: "var(--font-geist)" }}
                >
                  {centerLabel}
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {centerBadges.map((badge) => (
                    <span
                      key={badge}
                      className="inline-flex items-center rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </GradientBorder>
          </div>

          {/* Right: Outputs */}
          <div className="flex flex-col gap-3">
            {outputs.map((node, i) => (
              <div
                key={i}
                className="transition-all duration-500"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible
                    ? "translateX(0)"
                    : "translateX(20px)",
                  transitionDelay: `${(i * 100) + 600}ms`,
                }}
              >
                <NodeCard node={node} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

Note: SVG connectors between columns are complex to position responsively. Start with the staggered card layout without connectors, then add SVG connectors as a polish step in Phase 4 using absolute positioning and `useLayoutEffect` to measure positions.

---

## Phase 3 — Pages

### Task 14: Build /pricing Page (Simplest — Move Existing Sections)

**Files:**
- Edit: `src/app/[lang]/pricing/page.tsx`
- Edit: `src/dictionaries/tr.json`
- Edit: `src/dictionaries/en.json`

- [ ] **Step 1: Add pricingPage dictionary keys**

Add to `src/dictionaries/tr.json` (at root level, after existing keys):

```json
"pricingPage": {
  "hero": {
    "title": "Isletmenize uygun plan secin."
  },
  "cta": {
    "title": "Hemen baslayin.",
    "description": "14 gun ucretsiz deneyin, istediginiz zaman iptal edin.",
    "button": "Ucretsiz Deneyin"
  }
}
```

Add to `src/dictionaries/en.json`:

```json
"pricingPage": {
  "hero": {
    "title": "Choose the right plan for your business."
  },
  "cta": {
    "title": "Get started today.",
    "description": "Try free for 14 days, cancel anytime.",
    "button": "Try Free"
  }
}
```

- [ ] **Step 2: Build the pricing page with existing Pricing + FAQ components**

Replace `src/app/[lang]/pricing/page.tsx` with:

```tsx
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/dictionaries";
import type { Locale, Dictionary } from "@/dictionaries";
import type { Metadata } from "next";
import { Navbar } from "@/components/sections/navbar";
import { Pricing } from "@/components/sections/pricing";
import { FAQ } from "@/components/sections/faq";
import { PageCTA } from "@/components/sections/page-cta";
import { Footer } from "@/components/sections/footer";

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
      ? "Pricing - Choose the Right Plan | Edfu"
      : "Fiyatlandirma - Isletmenize Uygun Plan | Edfu",
    description: isEn
      ? "Starter, Professional, and Enterprise plans. All with 14-day free trial."
      : "Baslangic, Profesyonel ve Kurumsal planlar. Tumunde 14 gun ucretsiz deneme.",
    alternates: {
      canonical: isEn ? "/en/pricing" : "/pricing",
      languages: { tr: "/pricing", en: "/en/pricing", "x-default": "/pricing" },
    },
    openGraph: {
      title: isEn ? "Pricing | Edfu" : "Fiyatlandirma | Edfu",
      url: isEn ? `${BASE_URL}/en/pricing` : `${BASE_URL}/pricing`,
    },
  };
}

function PricingJsonLd({ dict }: { dict: Dictionary }) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: dict.faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  );
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const prefix = lang === "tr" ? "" : `/${lang}`;

  return (
    <>
      <PricingJsonLd dict={dict} />
      <Navbar dict={dict.navbar} lang={lang} />
      <div className="relative mx-auto max-w-7xl border-x border-border">
        <div className="pointer-events-none absolute inset-y-0 left-4 md:left-6 z-10 w-px bg-border" />
        <div className="pointer-events-none absolute inset-y-0 right-4 md:right-6 z-10 w-px bg-border" />
        <main className="pt-20">
          <Pricing dict={dict.pricing} />
          <div className="divide-y divide-border">
            <FAQ dict={dict.faq} />
            <PageCTA
              title={dict.pricingPage.cta.title}
              description={dict.pricingPage.cta.description}
              buttonText={dict.pricingPage.cta.button}
              buttonHref="https://app.edfu.ai"
            />
          </div>
        </main>
        <Footer dict={dict.footer} lang={lang} />
      </div>
    </>
  );
}
```

Note: The FAQPage JSON-LD schema moves from the homepage to the pricing page.

- [ ] **Step 3: Verify /pricing page**

Navigate to `http://localhost:3000/pricing`. Confirm:
- Pricing cards render with toggle
- FAQ accordion works
- CTA banner shows
- Navbar highlights "Fiyatlandirma"

---

### Task 15: Update Homepage — Remove Sections, Update Hero + Logos

**Files:**
- Edit: `src/app/[lang]/page.tsx`
- Edit: `src/components/sections/hero.tsx`
- Edit: `src/components/sections/logos.tsx`
- Edit: `src/dictionaries/tr.json`
- Edit: `src/dictionaries/en.json`

- [ ] **Step 1: Update homepage dictionary — hero + logos**

Update `hero` in `src/dictionaries/tr.json`:

```json
"hero": {
  "badge": "Cok Kanalli AI Iletisim Platformu",
  "titleLine1Before": "Musteri ",
  "titleLine1Highlight": "Iletisiminizi",
  "titleLine2Highlight": "Otomatiklestirin",
  "titleLine2After": ".",
  "description": "WhatsApp, Instagram, Telegram ve diger kanallardan gelen musterilerinizle AI agent'lar araciligiyla konusun.\nArastirma, teklif ve toplanti sureclerinizi tamamen otomatiklestirin.",
  "ctaPrimary": "Ucretsiz Deneyin",
  "ctaSecondary": "Giris Yap"
}
```

Update `logos` in `src/dictionaries/tr.json`:

```json
"logos": {
  "subtitle": "Tum kanallariniz ve toplanti araclariniz tek platformda",
  "learnMore": "Daha Fazla"
}
```

Do the same for `en.json` with English equivalents:

```json
"hero": {
  "badge": "Multi-Channel AI Communication Platform",
  "titleLine1Before": "Automate Your ",
  "titleLine1Highlight": "Customer",
  "titleLine2Highlight": "Communication",
  "titleLine2After": ".",
  "description": "Talk to your customers from WhatsApp, Instagram, Telegram and other channels through AI agents.\nFully automate your research, proposals, and meeting processes.",
  "ctaPrimary": "Try Free",
  "ctaSecondary": "Sign In"
}
```

```json
"logos": {
  "subtitle": "All your channels and meeting tools in one platform",
  "learnMore": "Learn More"
}
```

- [ ] **Step 2: Update logos.tsx — Replace AI model logos with channel logos**

Replace the `logos` array in `src/components/sections/logos.tsx` with channel + meeting tool logos:

```tsx
import { WhatsApp } from "@/components/ui/svgs/whatsapp";
import { Instagram } from "@/components/ui/svgs/instagram";
import { Telegram } from "@/components/ui/svgs/telegram";
import { Slack } from "@/components/ui/svgs/slack";
import { Zoom } from "@/components/ui/svgs/zoom";
import { GoogleMeet } from "@/components/ui/svgs/google-meet";
import { MsTeams } from "@/components/ui/svgs/ms-teams";

const logos = [
  { name: "WhatsApp", svg: <WhatsApp className="size-6" /> },
  { name: "Instagram", svg: <Instagram className="size-6" /> },
  { name: "Telegram", svg: <Telegram className="size-6" /> },
  { name: "Slack", svg: <Slack className="size-6" /> },
  { name: "Teams", svg: <MsTeams className="size-6" /> },
  { name: "Meet", svg: <GoogleMeet className="size-6" /> },
  { name: "Zoom", svg: <Zoom className="size-6" /> },
];
```

Note: Slack SVG already exists. Update the grid layout to `sm:grid-cols-4` since 7 logos works well in that grid.

- [ ] **Step 3: Update homepage page.tsx — Remove HowItWorks, Pricing, FAQ**

Edit `src/app/[lang]/page.tsx`:

1. Remove imports for `HowItWorks`, `Pricing`, `FAQ`
2. Remove the `<HowItWorks>`, `<Pricing>`, `<FAQ>` components from the JSX
3. Remove the FAQ JSON-LD schema from the `JsonLd` component
4. Update the hero CTA link from `href="#pricing"` to use the pricing page route

The updated render should be:

```tsx
return (
  <>
    <JsonLd dict={dict} lang={lang} />
    <Navbar dict={dict.navbar} lang={lang} />
    <div className="relative mx-auto max-w-7xl border-x border-border">
      <div className="pointer-events-none absolute inset-y-0 left-4 md:left-6 z-10 w-px bg-border" />
      <div className="pointer-events-none absolute inset-y-0 right-4 md:right-6 z-10 w-px bg-border" />
      <main className="divide-y divide-border">
        <Hero dict={dict.hero} lang={lang} />
        <Logos dict={dict.logos} />
        <BentoFeatures dict={dict.features} />
        <Testimonial dict={dict.testimonial} />
        {/* Flow Diagram will be added in Task 16 */}
        <Security dict={dict.security} />
        {/* AI Gradient Card will be added in Task 17 */}
        <MarqueeTestimonials dict={dict.marqueeTestimonials} />
        <CTA dict={dict.cta} />
      </main>
      <Footer dict={dict.footer} lang={lang} />
    </div>
  </>
);
```

- [ ] **Step 4: Update hero.tsx — Add `lang` prop and update CTA links**

Add `lang` prop to `HeroProps`:

```tsx
interface HeroProps {
  dict: Dictionary["hero"];
  lang: string;
}

export function Hero({ dict, lang }: HeroProps) {
  const prefix = lang === "tr" ? "" : `/${lang}`;
```

Replace the pricing CTA `<a href="#pricing">` with:

```tsx
<Link href={`${prefix}/pricing`} className="...">
```

Import `Link` from `next/link`.

- [ ] **Step 5: Verify homepage updates**

Navigate to `http://localhost:3000`. Confirm:
- Hero shows new pivot copy
- Logos show channel/meeting tool logos (WhatsApp, Instagram, etc.)
- HowItWorks, Pricing, FAQ are removed
- BentoFeatures, Testimonial, Security, MarqueeTestimonials, CTA remain
- Hero CTA button navigates to `/pricing`

---

### Task 16: Build Homepage Flow Diagram Section

**Files:**
- Create: `src/components/sections/flow-diagram.tsx`
- Edit: `src/app/[lang]/page.tsx`
- Edit: `src/dictionaries/tr.json`
- Edit: `src/dictionaries/en.json`

- [ ] **Step 1: Add flow diagram dictionary keys**

Add to `src/dictionaries/tr.json`:

```json
"flowDiagram": {
  "title": "AI Nasil Calisir?",
  "description": "Musteri mesajindan teklif olusturmaya kadar tum surec otomatik.",
  "trigger": "Musteri Mesaji",
  "triggerSub": "WhatsApp, Instagram, Telegram",
  "conversation": "Konusma Agenti",
  "conversationSub": "Musteri ile AI gorisme",
  "condition": "Musteri uygun mu?",
  "conditionYes": "Evet",
  "conditionNo": "Hayir",
  "research": "Arastirma Agenti",
  "researchSub": "Sirket + internet aramalari",
  "proposal": "Teklif Agenti",
  "proposalSub": "Otomatik teklif olusturma",
  "inform": "Bilgilendir & Yonlendir",
  "informSub": "Uygun olmayan musteriyi yonlendir"
}
```

Add the same structure in English to `en.json`.

- [ ] **Step 2: Create flow-diagram.tsx**

```tsx
"use client";

import { useRef, useState, useEffect } from "react";
import { FlowNode } from "@/components/ui/flow-node";
import { MessageSquare, Search, FileText, ArrowDown, GitBranch, Info } from "lucide-react";

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
    { icon: <MessageSquare className="size-4" />, label: dict.trigger, sublabel: dict.triggerSub, variant: "trigger" as const, delay: 0 },
    { icon: <MessageSquare className="size-4" />, label: dict.conversation, sublabel: dict.conversationSub, variant: "action" as const, delay: 200 },
    { icon: <GitBranch className="size-4" />, label: dict.condition, variant: "condition" as const, delay: 400 },
  ];

  const yesBranch = [
    { icon: <Search className="size-4" />, label: dict.research, sublabel: dict.researchSub, variant: "action" as const, delay: 600 },
    { icon: <FileText className="size-4" />, label: dict.proposal, sublabel: dict.proposalSub, variant: "action" as const, delay: 800 },
  ];

  const noBranch = [
    { icon: <Info className="size-4" />, label: dict.inform, sublabel: dict.informSub, variant: "default" as const, delay: 600 },
  ];

  return (
    <section className="py-16 sm:py-20">
      {/* Header */}
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

      {/* Flow */}
      <div ref={containerRef} className="mx-auto max-w-md px-4">
        <div className="flex flex-col items-center gap-3">
          {/* Main flow nodes */}
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
                <FlowNode {...node} className="w-full" />
              </div>
              {i < nodes.length - 1 && (
                <ArrowDown className="size-4 text-muted-foreground/40" />
              )}
            </div>
          ))}

          {/* Branch */}
          <div
            className="grid grid-cols-2 gap-4 w-full mt-2"
            style={{
              opacity: isVisible ? 1 : 0,
              transition: "opacity 0.5s ease-out 0.5s",
            }}
          >
            {/* Yes branch */}
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
                    <FlowNode {...node} className="w-full" />
                  </div>
                  {i < yesBranch.length - 1 && (
                    <ArrowDown className="size-4 text-muted-foreground/40" />
                  )}
                </div>
              ))}
            </div>

            {/* No branch */}
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
                  <FlowNode {...node} className="w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Add FlowDiagram to homepage**

Edit `src/app/[lang]/page.tsx` — import and add after `<Testimonial>`:

```tsx
import { FlowDiagram } from "@/components/sections/flow-diagram";
// ...
<Testimonial dict={dict.testimonial} />
<FlowDiagram dict={dict.flowDiagram} />
<Security dict={dict.security} />
```

- [ ] **Step 4: Verify flow diagram on homepage**

Navigate to `http://localhost:3000`. Scroll to the flow diagram section. Confirm:
- Nodes appear with staggered animation
- Branching layout shows Yes/No paths
- Text is correct from dictionary

---

### Task 17: Build Homepage AI Gradient Card Section

**Files:**
- Create: `src/components/sections/ai-gradient-card.tsx`
- Edit: `src/app/[lang]/page.tsx`
- Edit: `src/dictionaries/tr.json`
- Edit: `src/dictionaries/en.json`

- [ ] **Step 1: Add AI gradient card dictionary keys**

Add to `src/dictionaries/tr.json`:

```json
"aiGradientCard": {
  "title": "AI Karar Mekanizmasi",
  "description": "Agent'lar her musteri icin akilli kararlar alir.",
  "question": "Bu musteri bizim ICP'mize uyuyor mu?",
  "answer": "Evet. Sirket: 50-200 calisan, SaaS sektoru, yillik gelir 5M+ TRY. Karar verici: CTO. Onceki etkilesimler: 3 toplanti, demo talep etti. Oneri: Hizli teklif gonderin.",
  "label": "AI Analiz"
}
```

Add English version to `en.json`.

- [ ] **Step 2: Create ai-gradient-card.tsx**

```tsx
"use client";

import { GradientBorder } from "@/components/ui/gradient-border";
import { motion } from "motion/react";

interface AiGradientCardProps {
  dict: {
    title: string;
    description: string;
    question: string;
    answer: string;
    label: string;
  };
}

export function AiGradientCard({ dict }: AiGradientCardProps) {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-xl text-center">
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

        {/* Card */}
        <div className="mx-auto max-w-2xl">
          <GradientBorder animated borderWidth={2}>
            <div className="p-6 sm:p-8">
              {/* Question */}
              <div className="flex items-start gap-3 mb-6">
                <div className="size-8 shrink-0 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                  ?
                </div>
                <p className="text-sm font-medium text-foreground pt-1.5">
                  {dict.question}
                </p>
              </div>

              {/* Divider */}
              <div className="border-t border-border my-4" />

              {/* Answer */}
              <div className="flex items-start gap-3">
                <div className="size-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">AI</span>
                </div>
                <div className="pt-1">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary mb-2">
                    {dict.label}
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {dict.answer}
                  </p>
                </div>
              </div>
            </div>
          </GradientBorder>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Add AiGradientCard to homepage**

Edit `src/app/[lang]/page.tsx` — import and add after `<Security>`:

```tsx
import { AiGradientCard } from "@/components/sections/ai-gradient-card";
// ...
<Security dict={dict.security} />
<AiGradientCard dict={dict.aiGradientCard} />
<MarqueeTestimonials dict={dict.marqueeTestimonials} />
```

- [ ] **Step 4: Verify AI gradient card**

Navigate to `http://localhost:3000`. Scroll to the AI gradient card section. Confirm:
- Rotating conic-gradient border animates
- Question/answer mockup renders correctly
- Dark mode works (toggle and verify)

---

### Task 18: Build /agents Page — Hero Section

**Files:**
- Edit: `src/app/[lang]/agents/page.tsx`
- Edit: `src/dictionaries/tr.json`
- Edit: `src/dictionaries/en.json`

- [ ] **Step 1: Add agentsPage dictionary keys (hero + tabs + features + cta)**

Add to `src/dictionaries/tr.json`:

```json
"agentsPage": {
  "hero": {
    "badge": "AI Agent Ekosistemi",
    "title": "Otomatiklestirin. Arastirin. Satin.",
    "description": "5 AI agent birlikte calisarak musteri iletisiminizi uctan uca yonetir."
  },
  "tabs": {
    "conversation": {
      "title": "Konusma Agenti",
      "description": "Musterilerinizle WhatsApp, Instagram ve Telegram uzerinden 7/24 AI destekli gorusmeler yapin.",
      "features": [
        "Dogal dil isleme ile akilli yanitlar",
        "Otomatik musteri nitelendirme",
        "Coklu kanal destegi",
        "Gorusme gecmisi ve analitik"
      ]
    },
    "proposal": {
      "title": "Teklif Agenti",
      "description": "Nitelikli musteriler icin otomatik teklif olusturun. AI, musteri ihtiyaclarina gore kisisellestirilmis teklifler hazirlar.",
      "features": [
        "Kisisellestirilmis teklif olusturma",
        "PDF ciktisi",
        "Sablonlar ve markalamasizlastirma",
        "Otomatik takip"
      ]
    },
    "research": {
      "title": "Arastirma Agenti",
      "description": "Musteri hakkinda internet ve sirket verilerinden derin arastirma yapin. Teklif oncesi tam bilgi.",
      "features": [
        "Internet aramalari",
        "Sirket verisi analizi",
        "Rakip karsilastirma",
        "Otomatik rapor olusturma"
      ]
    },
    "meeting": {
      "title": "Toplanti Agenti",
      "description": "Toplantilarinizi otomatik kaydedin, yaziya dokurun ve aksiyon maddelerini cikartin.",
      "features": [
        "Otomatik kayit ve transkripsiyon",
        "Aksiyon maddesi cikartma",
        "Toplanti ozeti olusturma",
        "RAG agentina besleme"
      ]
    },
    "rag": {
      "title": "RAG Agenti",
      "description": "Sirketinizin tum bilgi birikimini yapay zekaya donusturun. Ekibiniz istedigi bilgiye aninda ulassin.",
      "features": [
        "Dokuman yukleme ve indeksleme",
        "Dogal dil ile sorgulama",
        "Entegrasyon kaynaklari",
        "Otomatik guncelleme"
      ]
    }
  },
  "numberedFeatures": [
    {
      "title": "Aninda musteri yaniti",
      "description": "Agent'lariniz 7/24 aktif. Musteri mesajina saniyeler icinde yanitlar, hicbir firsat kacmaz."
    },
    {
      "title": "Otomatik musteri nitelendirme",
      "description": "AI, her musteriyi analiz eder ve satisa uygun olanlari otomatik belirler."
    },
    {
      "title": "Derin arastirma",
      "description": "Teklif gondermeden once internet ve sirket verilerinden kapsamli arastirma yapar."
    },
    {
      "title": "Sirket hafizasi olusturma",
      "description": "Toplantilar ve dokumanlar RAG agentini besler, sirketinizin bilgi birikimi surekli buyur."
    }
  ],
  "cta": {
    "title": "Agent'larinizi simdi olusturun.",
    "button": "Ucretsiz Deneyin"
  }
}
```

Add the same structure in English to `en.json`.

- [ ] **Step 2: Build the agents page hero**

Create a hero component inline in the agents page, or create `src/components/sections/agents-hero.tsx`:

```tsx
"use client";

import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

interface AgentsHeroProps {
  dict: {
    badge: string;
    title: string;
    description: string;
  };
  prefix: string;
}

export function AgentsHero({ dict, prefix }: AgentsHeroProps) {
  const ease = [0.2, 0, 0, 1];

  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10 h-[600px] md:h-[700px] rounded-b-2xl border-b border-border"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 10%, var(--background) 40%, var(--primary) 100%)",
        }}
      />
      <div className="mx-auto max-w-4xl px-4 pt-32 sm:pt-40 pb-16 text-center">
        {/* Badge */}
        <motion.div
          className="group mb-8 flex justify-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.1 }}
        >
          <div className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 shadow-sm">
            <AnimatedShinyText className="text-xs font-medium">
              {dict.badge}
            </AnimatedShinyText>
            <ArrowRight className="ml-1.5 size-2.5 text-muted-foreground" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-medium text-foreground leading-none"
          style={{ letterSpacing: "-0.05em", fontFamily: "var(--font-geist)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.2 }}
        >
          {dict.title}
        </motion.h1>

        {/* Description */}
        <motion.p
          className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-muted-foreground font-medium text-balance tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.3 }}
        >
          {dict.description}
        </motion.p>

        {/* CTA */}
        <motion.div
          className="mt-8 flex items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.4 }}
        >
          <Link
            href="https://app.edfu.ai"
            className="bg-primary h-9 flex items-center justify-center text-sm font-normal tracking-wide rounded-full text-primary-foreground w-fit px-6 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_3px_3px_-1.5px_rgba(16,24,40,0.06),0_1px_1px_rgba(16,24,40,0.08)] border border-white/[0.12] hover:bg-primary/80 transition-all ease-out active:scale-95"
          >
            {dict.badge === "AI Agent Ekosistemi" ? "Ucretsiz Deneyin" : "Try Free"}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
```

---

### Task 19: Build /agents Page — Tab Navigation + Content Swap

**Files:**
- Create: `src/components/sections/agent-tabs.tsx`

- [ ] **Step 1: Create agent-tabs.tsx**

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";

interface AgentTab {
  title: string;
  description: string;
  features: string[];
}

interface AgentTabsProps {
  tabs: AgentTab[];
}

export function AgentTabs({ tabs }: AgentTabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Tab navigation */}
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

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16"
          >
            {/* Left: Text content */}
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

            {/* Right: Mockup placeholder */}
            <div className="rounded-xl border border-border bg-card p-6 min-h-[300px] flex items-center justify-center">
              <p className="text-sm text-muted-foreground">
                {tabs[activeTab].title} mockup
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
```

---

### Task 20: Assemble /agents Page

**Files:**
- Edit: `src/app/[lang]/agents/page.tsx`

- [ ] **Step 1: Assemble the full agents page**

Replace the scaffold in `src/app/[lang]/agents/page.tsx` with the full page using all built components:

```tsx
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/dictionaries";
import type { Locale } from "@/dictionaries";
import type { Metadata } from "next";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { AgentsHero } from "@/components/sections/agents-hero";
import { AgentTabs } from "@/components/sections/agent-tabs";
import { NumberedFeatures } from "@/components/sections/numbered-features";
import { DataModelViz } from "@/components/sections/data-model-viz";
import { PageCTA } from "@/components/sections/page-cta";

// ... generateStaticParams + generateMetadata (keep from scaffold)

export default async function AgentsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const prefix = lang === "tr" ? "" : `/${lang}`;
  const ap = dict.agentsPage;

  const tabs = [
    ap.tabs.conversation,
    ap.tabs.proposal,
    ap.tabs.research,
    ap.tabs.meeting,
    ap.tabs.rag,
  ];

  return (
    <>
      <Navbar dict={dict.navbar} lang={lang} />
      <div className="relative mx-auto max-w-7xl border-x border-border">
        <div className="pointer-events-none absolute inset-y-0 left-4 md:left-6 z-10 w-px bg-border" />
        <div className="pointer-events-none absolute inset-y-0 right-4 md:right-6 z-10 w-px bg-border" />
        <main className="divide-y divide-border">
          <AgentsHero dict={ap.hero} prefix={prefix} />
          <AgentTabs tabs={tabs} />
          <NumberedFeatures features={ap.numberedFeatures} />
          <DataModelViz
            sources={[
              { label: "WhatsApp" },
              { label: "Instagram" },
              { label: "Telegram" },
              { label: "Zoom / Meet" },
              { label: "Drive / Notion" },
            ]}
            centerLabel="Edfu AI"
            centerBadges={["Konusma", "Teklif", "Arastirma", "Toplanti", "RAG"]}
            outputs={[
              { label: "Nitelikli Lead" },
              { label: "Teklif PDF" },
              { label: "Musteri Raporu" },
              { label: "Toplanti Ozeti" },
              { label: "Bilgi Tabani" },
            ]}
          />
          <PageCTA
            title={ap.cta.title}
            buttonText={ap.cta.button}
            buttonHref="https://app.edfu.ai"
          />
        </main>
        <Footer dict={dict.footer} lang={lang} />
      </div>
    </>
  );
}
```

- [ ] **Step 2: Verify /agents page**

Navigate to `http://localhost:3000/agents`. Confirm:
- Hero renders with badge, title, description
- 5 tabs switch content with animation
- Numbered features display [01]-[04]
- Data model viz shows 3-column layout
- CTA banner renders at bottom
- Navbar pill highlights "Agent'lar"

---

### Task 21: Build /meeting Page — Hero + Feature Cards

**Files:**
- Create: `src/components/sections/meeting-hero.tsx`
- Edit: `src/dictionaries/tr.json`
- Edit: `src/dictionaries/en.json`

- [ ] **Step 1: Add meetingPage dictionary keys**

Add to `src/dictionaries/tr.json`:

```json
"meetingPage": {
  "hero": {
    "badge": "Toplanti Agenti",
    "title": "Daha akilli toplantilar, basindan sonuna.",
    "description": "Toplantilarinizi kaydedin, yaziya dokurun, aksiyon maddelerini cikartin. Tum icerik sirket hafizanizi besler."
  },
  "featureCards": [
    {
      "title": "Otomatik kayit & transkripsiyon",
      "description": "Zoom, Meet ve Teams toplantilariniz otomatik kaydedilir ve yaziya dokulur."
    },
    {
      "title": "Hicbir toplanti notu kaybolmaz",
      "description": "Notlar otomatik olarak musteri kayitlarina baglagnir."
    },
    {
      "title": "Sirket hafizasini besler",
      "description": "Her toplanti RAG agentini gunceller, ekibiniz bilgiye aninda ulasir."
    }
  ],
  "stickySection": {
    "title": "Bir toplanti. Sinirsiz icerik.",
    "features": [
      {
        "title": "Karar vericiye odaklanin",
        "description": "AI, toplantidaki karar vericileri ve onemli anlari otomatik tespit eder."
      },
      {
        "title": "Her toplantidan bir planla cikin",
        "description": "Aksiyon maddeleri, sorumlular ve tarihler otomatik cikarilir."
      },
      {
        "title": "100+ dil transkripsiyonu",
        "description": "Uluslararasi ekipler icin coklu dil destegi."
      }
    ]
  },
  "numberedFeatures": [
    {
      "title": "Otomatik musteri sinyal tespiti",
      "description": "AI, toplanti iceriginden satin alma sinyallerini ve ihtiyaclari otomatik tespit eder."
    },
    {
      "title": "Ekibinizi baglamla yonlendirin",
      "description": "Toplanti ozetleri ve icerikler ekibinize tam baglam saglar."
    },
    {
      "title": "Kesintisiz devir teslim",
      "description": "Toplanti klipleri ve ozetlerle ekipler arasi gecisleri kolaylastirin."
    },
    {
      "title": "RAG agentini otomatik besleyin",
      "description": "Her toplanti icerigi otomatik olarak sirket bilgi tabanina eklenir."
    }
  ],
  "integrationLogos": {
    "title": "Aninda senkronizasyon. Sifir kurulum.",
    "tools": ["Zoom", "Google Meet", "Microsoft Teams"]
  },
  "testimonial": {
    "quote": "Toplanti notlari artik kaybolmuyor. AI her seyi yaziyor, ozetliyor ve ekibimize aksiyonlari atiyor. Verimliligimiz gozle gorulur artti.",
    "authorName": "Ayse B.",
    "authorTitle": "Operasyon Muduru, Teknoloji Sirketi",
    "authorAlt": "Ayse B. profil fotografi"
  },
  "cta": {
    "title": "Toplantilarinizi donusturun.",
    "button": "Ucretsiz Deneyin"
  }
}
```

Add English version to `en.json`.

- [ ] **Step 2: Create meeting-hero.tsx**

```tsx
"use client";

import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { motion } from "motion/react";

interface MeetingHeroProps {
  dict: {
    badge: string;
    title: string;
    description: string;
  };
}

export function MeetingHero({ dict }: MeetingHeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10 h-[600px] md:h-[700px] rounded-b-2xl border-b border-border"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 10%, var(--background) 40%, oklch(0.55 0.15 155) 100%)",
        }}
      />
      <div className="mx-auto max-w-4xl px-4 pt-32 sm:pt-40 pb-16 text-center">
        {/* Badge with green dot */}
        <motion.div
          className="mb-8 flex justify-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.2, 0, 0, 1], delay: 0.1 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 shadow-sm">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <AnimatedShinyText className="text-xs font-medium">
              {dict.badge}
            </AnimatedShinyText>
          </div>
        </motion.div>

        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-medium text-foreground leading-none"
          style={{ letterSpacing: "-0.05em", fontFamily: "var(--font-geist)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0, 0, 1], delay: 0.2 }}
        >
          {dict.title}
        </motion.h1>

        <motion.p
          className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-muted-foreground font-medium text-balance tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0, 0, 1], delay: 0.3 }}
        >
          {dict.description}
        </motion.p>

        {/* Dual mockup placeholder */}
        <motion.div
          className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.2, 0, 0, 1], delay: 0.4 }}
        >
          <div className="rounded-xl border border-border bg-card shadow-lg p-6 min-h-[250px] flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Meeting list mockup</p>
          </div>
          <div className="rounded-xl border border-border bg-card shadow-lg p-6 min-h-[250px] flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Call player mockup</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

---

### Task 22: Build /meeting Page — Scroll-Pinned Sticky Section

**Files:**
- Create: `src/components/sections/scroll-pinned-features.tsx`

- [ ] **Step 1: Create scroll-pinned-features.tsx**

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
}

export function ScrollPinnedFeatures({
  title,
  features,
}: ScrollPinnedFeaturesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
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

        <div ref={containerRef} className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            {/* Left: Scrolling text features */}
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

            {/* Right: Sticky visual */}
            <div className="hidden md:block">
              <div className="sticky top-28">
                <div className="rounded-xl border border-border bg-card p-8 min-h-[400px] flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    {features[activeIndex]?.title} visual
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

### Task 23: Assemble /meeting Page

**Files:**
- Edit: `src/app/[lang]/meeting/page.tsx`

- [ ] **Step 1: Assemble the full meeting page**

Replace the scaffold with the full page:

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

// ... generateStaticParams + generateMetadata (keep from scaffold)

export default async function MeetingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const prefix = lang === "tr" ? "" : `/${lang}`;
  const mp = dict.meetingPage;

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
          />
          <NumberedFeatures features={mp.numberedFeatures} />

          {/* Integration Logos */}
          <section className="py-16 sm:py-20">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
              <h2
                className="text-[28px] sm:text-[32px] md:text-[36px] font-medium leading-none text-foreground mb-10"
                style={{ letterSpacing: "-0.05em", fontFamily: "var(--font-geist)" }}
              >
                {mp.integrationLogos.title}
              </h2>
              <div className="flex items-center justify-center gap-8 sm:gap-12">
                {mp.integrationLogos.tools.map((tool: string) => (
                  <div
                    key={tool}
                    className="flex flex-col items-center gap-2 rounded-xl border border-border bg-white dark:bg-[#27272A] p-6 shadow-sm"
                  >
                    <div className="size-12 rounded-xl bg-muted flex items-center justify-center">
                      <span className="text-xs font-bold text-muted-foreground">
                        {tool.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-foreground">{tool}</span>
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
                {mp.testimonial.quote}
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

- [ ] **Step 2: Verify /meeting page**

Navigate to `http://localhost:3000/meeting`. Confirm all sections render, scroll-pinned section transitions on scroll, navbar highlights "Toplanti".

---

### Task 24: Build /integrations Page — Integration Grid

**Files:**
- Create: `src/components/sections/integration-grid.tsx`
- Edit: `src/dictionaries/tr.json`
- Edit: `src/dictionaries/en.json`

- [ ] **Step 1: Add integrationsPage dictionary keys**

Add to `src/dictionaries/tr.json`:

```json
"integrationsPage": {
  "hero": {
    "title": "Tum kanallariniz. Tek platform.",
    "description": "Mesajlasma kanallari, toplanti araclari ve is uygulamalarinizi tek bir platformdan yonetin."
  },
  "channels": {
    "title": "Mesajlasma Kanallari",
    "items": [
      { "name": "WhatsApp", "description": "Business API ile gelen mesajlari yonetin", "color": "#25D366" },
      { "name": "Instagram", "description": "DM ve story yanitlarini otomatiklestirin", "color": "#E4405F" },
      { "name": "Telegram", "description": "Bot entegrasyonu ile musteri iletisimi", "color": "#2AABEE" },
      { "name": "Web Form", "description": "Web sitenize gomulu iletisim widgeti", "color": "#18181B" },
      { "name": "E-posta", "description": "AI ile e-posta siniflandirma ve yonlendirme", "color": "#EA4335" },
      { "name": "Webhook", "description": "Ozel entegrasyon ve API baglantisi", "color": "currentColor" }
    ]
  },
  "meetingTools": {
    "title": "Toplanti Araclari",
    "items": [
      { "name": "Zoom", "description": "Toplanti kayit ve transkripsiyon", "color": "#2D8CFF" },
      { "name": "Google Meet", "description": "Otomatik kayit ve ozet", "color": "#00897B" },
      { "name": "Microsoft Teams", "description": "Kurum ici toplantilar", "color": "#6264A7" }
    ]
  },
  "businessTools": {
    "title": "Is Uygulamalari",
    "items": [
      { "name": "Drive", "description": "Dokumanlar" },
      { "name": "Notion", "description": "Wiki & notlar" },
      { "name": "Slack", "description": "Mesajlasma" },
      { "name": "CRM", "description": "Musteri verileri" },
      { "name": "ERP", "description": "Is surecleri" },
      { "name": "Jira", "description": "Proje yonetimi" },
      { "name": "HubSpot", "description": "Pazarlama" },
      { "name": "+ API", "description": "Ozel entegrasyon" }
    ]
  },
  "dataModelTitle": "Veri Akisi",
  "cta": {
    "title": "Tum kanallarinizi baglayin.",
    "button": "Ucretsiz Deneyin"
  }
}
```

Add English version to `en.json`.

- [ ] **Step 2: Create integration-grid.tsx**

```tsx
interface IntegrationItem {
  name: string;
  description: string;
  color?: string;
}

interface IntegrationGridSection {
  title: string;
  items: IntegrationItem[];
  columns?: number;
}

interface IntegrationGridProps {
  sections: IntegrationGridSection[];
}

export function IntegrationGrid({ sections }: IntegrationGridProps) {
  return (
    <div className="space-y-16">
      {sections.map((section, sectionIdx) => (
        <div key={sectionIdx}>
          {/* Section header with number */}
          <div className="flex items-center gap-3 mb-8">
            <span
              className="text-sm font-bold text-muted-foreground/40"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              [{String(sectionIdx + 1).padStart(2, "0")}]
            </span>
            <h3
              className="text-xl font-semibold text-foreground tracking-tight"
              style={{ fontFamily: "var(--font-geist)" }}
            >
              {section.title}
            </h3>
          </div>

          {/* Grid */}
          <div
            className={`grid gap-4 ${
              section.columns === 4 || section.items.length > 4
                ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
                : section.items.length === 3
                ? "grid-cols-1 sm:grid-cols-3"
                : "grid-cols-2 sm:grid-cols-3"
            }`}
          >
            {section.items.map((item) => {
              const isDashed = item.name === "Webhook" || item.name === "+ API";
              return (
                <div
                  key={item.name}
                  className={`group rounded-xl p-5 transition-shadow hover:shadow-md ${
                    isDashed
                      ? "border-2 border-dashed border-border bg-transparent"
                      : "border border-[rgba(46,50,56,0.07)] dark:border-border bg-white dark:bg-[#27272A]"
                  }`}
                >
                  {/* Icon placeholder */}
                  <div
                    className="size-10 rounded-[10px] mb-3 flex items-center justify-center text-white text-xs font-bold"
                    style={{
                      backgroundColor: item.color === "currentColor" ? undefined : item.color,
                      border: item.color === "currentColor" ? "1px solid var(--border)" : undefined,
                      color: item.color === "currentColor" ? "var(--foreground)" : undefined,
                    }}
                  >
                    {item.name.charAt(0)}
                  </div>
                  <h4
                    className="text-sm font-semibold text-foreground"
                    style={{ fontFamily: "var(--font-geist)" }}
                  >
                    {item.name}
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

### Task 25: Assemble /integrations Page

**Files:**
- Edit: `src/app/[lang]/integrations/page.tsx`

- [ ] **Step 1: Assemble the full integrations page**

Replace the scaffold:

```tsx
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/dictionaries";
import type { Locale } from "@/dictionaries";
import type { Metadata } from "next";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { IntegrationGrid } from "@/components/sections/integration-grid";
import { DataModelViz } from "@/components/sections/data-model-viz";
import { PageCTA } from "@/components/sections/page-cta";

// ... generateStaticParams + generateMetadata (keep from scaffold)

export default async function IntegrationsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const prefix = lang === "tr" ? "" : `/${lang}`;
  const ip = dict.integrationsPage;

  const gridSections = [
    { title: ip.channels.title, items: ip.channels.items },
    { title: ip.meetingTools.title, items: ip.meetingTools.items },
    { title: ip.businessTools.title, items: ip.businessTools.items, columns: 4 },
  ];

  return (
    <>
      <Navbar dict={dict.navbar} lang={lang} />
      <div className="relative mx-auto max-w-7xl border-x border-border">
        <div className="pointer-events-none absolute inset-y-0 left-4 md:left-6 z-10 w-px bg-border" />
        <div className="pointer-events-none absolute inset-y-0 right-4 md:right-6 z-10 w-px bg-border" />
        <main className="divide-y divide-border">
          {/* Hero */}
          <section className="relative overflow-hidden">
            <div
              className="absolute inset-0 -z-10 h-[400px] md:h-[500px] rounded-b-2xl border-b border-border"
              style={{
                background:
                  "radial-gradient(125% 125% at 50% 10%, var(--background) 40%, var(--primary) 100%)",
              }}
            />
            <div className="mx-auto max-w-4xl px-4 pt-32 sm:pt-40 pb-16 text-center">
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-medium text-foreground leading-none"
                style={{ letterSpacing: "-0.05em", fontFamily: "var(--font-geist)" }}
              >
                {ip.hero.title}
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-muted-foreground font-medium text-balance tracking-tight">
                {ip.hero.description}
              </p>
            </div>
          </section>

          {/* Integration Grids */}
          <section className="py-16 sm:py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <IntegrationGrid sections={gridSections} />
            </div>
          </section>

          {/* Data Model Viz */}
          <DataModelViz
            sources={[
              { label: "WhatsApp" },
              { label: "Instagram" },
              { label: "Telegram" },
              { label: "Zoom / Meet" },
              { label: "Drive / Notion" },
              { label: "CRM / ERP" },
            ]}
            centerLabel="Edfu AI"
            centerBadges={["Konusma", "Teklif", "Arastirma", "Toplanti", "RAG"]}
            outputs={[
              { label: "Nitelikli Lead" },
              { label: "Teklif PDF" },
              { label: "Musteri Raporu" },
              { label: "Toplanti Ozeti" },
              { label: "Bilgi Tabani" },
            ]}
          />

          <PageCTA
            title={ip.cta.title}
            buttonText={ip.cta.button}
            buttonHref="https://app.edfu.ai"
          />
        </main>
        <Footer dict={dict.footer} lang={lang} />
      </div>
    </>
  );
}
```

- [ ] **Step 2: Verify /integrations page**

Navigate to `http://localhost:3000/integrations`. Confirm:
- Hero renders
- 3 numbered integration grids display
- Webhook and +API cards have dashed borders
- Data model viz shows 3-column layout
- CTA renders at bottom

---

## Phase 4 — Polish

### Task 26: Dark Mode Verification and Fixes

**Files:**
- Edit: various new component files as needed

- [ ] **Step 1: Systematic dark mode check**

Toggle dark mode on each page and verify:

1. **Homepage**: Flow diagram nodes have proper dark borders, AI gradient card background works
2. **/agents**: Tab indicator visible in dark mode, tab content cards have dark bg
3. **/meeting**: Hero gradient works in dark, feature cards have dark bg, sticky section readable
4. **/integrations**: Grid cards have dark bg, icon backgrounds adapt, dashed borders visible
5. **/pricing**: Already working (existing component)

For each issue found, apply the existing convention:
- Card backgrounds: `dark:bg-[#27272A]`
- Borders: `dark:border-border`
- Text: already handled by `text-foreground` and `text-muted-foreground`
- Gradient backgrounds: adjust oklch values for dark

- [ ] **Step 2: Fix any dark mode issues found**

Apply fixes to each component. Common patterns:
- Flow node: add `dark:border-border dark:bg-[#27272A]`
- Gradient border inner: use `dark:bg-[#18181B]`
- Section backgrounds: use `dark:bg-[oklch(0.14_0.005_250)]` for dark sections

---

### Task 27: EN Translation — Complete All New Dictionary Keys

**Files:**
- Edit: `src/dictionaries/en.json`

- [ ] **Step 1: Review and complete all English translations**

Verify that `en.json` has complete translations for every key added in earlier tasks:
- `navbar` (already done in Task 1)
- `hero` (already done in Task 15)
- `logos` (already done in Task 15)
- `flowDiagram` (Task 16)
- `aiGradientCard` (Task 17)
- `agentsPage` (Task 18)
- `meetingPage` (Task 21)
- `integrationsPage` (Task 24)
- `pricingPage` (Task 14)

- [ ] **Step 2: Test EN locale**

Navigate to `http://localhost:3000/en` and verify all 5 pages display English content correctly. Check:
- `/en` — homepage
- `/en/agents`
- `/en/meeting`
- `/en/integrations`
- `/en/pricing`

---

### Task 28: SEO — Per-Page Metadata + JSON-LD

**Files:**
- Edit: `src/app/[lang]/page.tsx` (update homepage JSON-LD)
- Edit: `src/app/[lang]/agents/page.tsx` (already has metadata)
- Edit: `src/app/[lang]/meeting/page.tsx` (already has metadata)
- Edit: `src/app/[lang]/integrations/page.tsx` (already has metadata)
- Edit: `src/app/[lang]/pricing/page.tsx` (already has metadata + FAQ JSON-LD)

- [ ] **Step 1: Update homepage JSON-LD — remove FAQ schema**

In `src/app/[lang]/page.tsx`, the `JsonLd` component currently includes a FAQPage schema. Remove it since FAQ has moved to `/pricing`:

Remove the `faqSchema` object and its `<script>` tag from the `JsonLd` component.

- [ ] **Step 2: Update homepage metadata for pivot**

The homepage `generateMetadata` in `layout.tsx` uses `dict.metadata` which still references the old "AI Knowledge Base" copy. Update `metadata` in both dictionaries:

`tr.json`:
```json
"metadata": {
  "title": "Edfu - Cok Kanalli AI Musteri Iletisim Platformu",
  "description": "WhatsApp, Instagram, Telegram ve diger kanallardan gelen musterilerinizle AI agent'lar araciligiyla konusun. Arastirma, teklif ve toplanti sureclerinizi otomatiklestirin.",
  ...
}
```

`en.json`:
```json
"metadata": {
  "title": "Edfu - Multi-Channel AI Customer Communication Platform",
  "description": "Talk to customers from WhatsApp, Instagram, Telegram through AI agents. Automate research, proposals, and meeting processes.",
  ...
}
```

- [ ] **Step 3: Verify SEO output**

Run: `npm run build`

Check the built HTML for each page's `<title>` and `<meta name="description">` tags. Verify they match the per-page metadata defined in each page's `generateMetadata`.

---

### Task 29: Legacy URL Handling

**Files:**
- Edit: `src/app/[lang]/page.tsx`

- [ ] **Step 1: Add client-side hash redirect on homepage**

Add a small client component that checks for legacy hashes on mount:

Create `src/components/legacy-hash-redirect.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const hashRoutes: Record<string, string> = {
  "#pricing": "/pricing",
  "#how-it-works": "/agents",
  "#features": "/agents",
};

export function LegacyHashRedirect() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    const redirect = hashRoutes[hash];
    if (redirect) {
      router.replace(redirect);
    }
  }, [router]);

  return null;
}
```

- [ ] **Step 2: Add LegacyHashRedirect to homepage**

In `src/app/[lang]/page.tsx`, import and add as the first child:

```tsx
import { LegacyHashRedirect } from "@/components/legacy-hash-redirect";
// ...
return (
  <>
    <LegacyHashRedirect />
    <JsonLd dict={dict} lang={lang} />
    ...
  </>
);
```

- [ ] **Step 3: Verify legacy URLs**

Navigate to `http://localhost:3000/#pricing` — should redirect to `/pricing`.
Navigate to `http://localhost:3000/#how-it-works` — should redirect to `/agents`.

---

### Task 30: SVG Connector Animation Polish for Data Model Viz

**Files:**
- Edit: `src/components/sections/data-model-viz.tsx`

- [ ] **Step 1: Add SVG connectors between columns on desktop**

This is an enhancement to the existing data-model-viz component. Use `useLayoutEffect` to measure node positions and draw SVG connectors between them.

The implementation requires:
1. Add refs to each source node, center hub, and output node
2. In a `useLayoutEffect`, measure bounding rects
3. Render an absolutely positioned SVG overlay with curved paths
4. Apply `stroke-dasharray` + `stroke-dashoffset` animation with `drawLine` keyframes

This is a visual polish step. The core layout from Task 13 works without connectors. Add connectors only on `md:` and above viewports (hidden on mobile).

- [ ] **Step 2: Verify connectors render on /agents and /integrations**

Navigate to both pages on desktop. Confirm:
- SVG lines draw from source cards to center hub
- SVG lines draw from center hub to output cards
- Lines animate on scroll-trigger (when section becomes visible)
- Lines are hidden on mobile

---

### Task 31: Final Integration Test

- [ ] **Step 1: Full navigation test**

Test every navigation path:
1. Homepage -> each navbar link
2. Each page -> language switcher (preserves path)
3. Each page -> footer links
4. Mobile hamburger menu on each page
5. Back/forward browser buttons

- [ ] **Step 2: Build verification**

Run: `npm run build`

Confirm:
- No TypeScript errors
- No missing dictionary keys
- All pages generate static params for TR and EN
- Build completes successfully

- [ ] **Step 3: Lighthouse check**

Run Lighthouse on each page:
- Performance: check for layout shifts from animations
- SEO: verify metadata, canonical URLs, hreflang
- Accessibility: verify keyboard navigation, ARIA labels

---

## Summary

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| Phase 1: Infrastructure | Tasks 1-6 | ~45 min |
| Phase 2: Shared Components | Tasks 7-13 | ~60 min |
| Phase 3: Pages | Tasks 14-25 | ~120 min |
| Phase 4: Polish | Tasks 26-31 | ~60 min |
| **Total** | **31 tasks** | **~285 min** |

Each task produces a working, committable increment. Tasks within a phase can be committed individually or grouped. Phase 3 tasks are parallelizable (each page is independent once shared components exist).
