# i18n / Localization Design Spec

## Overview

Add English language support to the Edfu landing page using Next.js 16 App Router's built-in i18n pattern with `[lang]` dynamic segment, dictionary JSON files, and `proxy.ts` for locale detection.

## Routing

- **`edfu.ai/`** — Turkish (default, prefix-less)
- **`edfu.ai/en`** — English

Turkish is the default locale and has no URL prefix. English uses the `/en` prefix.

### How prefix-less default works

Internal route structure uses `app/[lang]/` for both locales. The `proxy.ts` file handles the mapping:

1. Request to `/en` or `/en/...` → passes through, `lang = "en"`
2. Request to `/` (no locale prefix):
   - Check `Accept-Language` header
   - If browser language is NOT Turkish → **redirect 307** to `/en`
   - If Turkish (or no preference) → **rewrite** to `/tr` internally (URL stays as `/`)
3. Request to `/tr` → **redirect 301** to `/` (canonical URL for Turkish is prefix-less)
4. A `NEXT_LOCALE` cookie allows users to override auto-detection (set when using the language switcher)

## File Structure Changes

```
src/
  proxy.ts                          # NEW — locale detection & routing
  dictionaries/
    tr.json                         # NEW — all Turkish strings
    en.json                         # NEW — all English strings
    index.ts                        # NEW — getDictionary loader
  app/
    globals.css                     # STAYS at app/ root (imported by [lang]/layout.tsx)
    robots.ts                       # STAYS at app/ root (not locale-dependent)
    sitemap.ts                      # MODIFIED — generates URLs for both locales
    [lang]/
      layout.tsx                    # MOVED from app/layout.tsx
      page.tsx                      # MOVED from app/page.tsx
    layout.tsx                      # REMOVED (moves into [lang])
    page.tsx                        # REMOVED (moves into [lang])
  components/
    sections/*.tsx                  # MODIFIED — accept dictionary props instead of hardcoded strings
    language-switcher.tsx           # NEW — TR | EN toggle component
```

## proxy.ts (locale detection)

Next.js 16 renamed `middleware.ts` to `proxy.ts` and the export from `middleware` to `proxy`.

```ts
// src/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["tr", "en"] as const;
const defaultLocale = "tr";

function getLocale(request: NextRequest): string {
  // 1. Check cookie override
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && locales.includes(cookieLocale as any)) return cookieLocale;

  // 2. Check Accept-Language header
  const acceptLang = request.headers.get("accept-language") ?? "";
  if (acceptLang.includes("tr")) return "tr";

  return "en";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files
  // matcher handles this, but belt-and-suspenders

  // If path starts with /tr, redirect to prefix-less
  if (pathname === "/tr" || pathname.startsWith("/tr/")) {
    const newPath = pathname.replace(/^\/tr/, "") || "/";
    return NextResponse.redirect(new URL(newPath, request.url), 301);
  }

  // If path already has /en prefix, let it through
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return NextResponse.rewrite(new URL(pathname, request.url));
  }

  // No locale prefix — detect and handle
  const locale = getLocale(request);

  if (locale === "en") {
    // Redirect non-Turkish users to /en
    return NextResponse.redirect(new URL(`/en${pathname}`, request.url), 307);
  }

  // Turkish: rewrite internally to /tr (URL stays as /)
  return NextResponse.rewrite(new URL(`/tr${pathname}`, request.url));
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|ico|webp)$).*)",
  ],
};
```

## Dictionary Structure

### `src/dictionaries/index.ts`

```ts
import "server-only";

const dictionaries = {
  tr: () => import("./tr.json").then((m) => m.default),
  en: () => import("./en.json").then((m) => m.default),
};

export type Locale = keyof typeof dictionaries;
export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

export const locales: Locale[] = ["tr", "en"];

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries;

export const getDictionary = async (locale: Locale) => dictionaries[locale]();
```

### Dictionary JSON shape (section-based keys)

```json
{
  "metadata": {
    "title": "Edfu - Your Company's AI Knowledge Base | Instant Answers from Documents",
    "description": "Transform your company's knowledge into AI. Upload documents, let your team ask questions with 300+ AI models, get instant accurate answers. Try free for 14 days."
  },
  "navbar": {
    "home": "Home",
    "features": "Features",
    "howItWorks": "How It Works",
    "pricing": "Pricing",
    "cta": "Try Free",
    "menuOpen": "Open menu",
    "menuClose": "Close menu"
  },
  "hero": {
    "badge": "300+ AI models, one platform",
    "titleLine1Before": "Every Question's ",
    "titleLine1Highlight": "Answer",
    "titleLine2Highlight": "Is Already",
    "titleLine2After": " With You.",
    "description": "Upload your documents, connect your sources, let your team ask.\nEdfu instantly finds the right answer from your company's entire knowledge.",
    "ctaPrimary": "Try Free",
    "ctaSecondary": "Sign In"
  },
  "logos": {
    "subtitle": "Access 300+ AI models from a single platform",
    "learnMore": "Learn More"
  },
  "features": {
    "title": "Build Your Company's Digital Memory",
    "description": "Edfu brings all your company's knowledge together on one platform. Your team finds the information they need in seconds.",
    "items": [
      {
        "title": "Talk to Your Documents",
        "description": "Upload your contracts, regulations, meeting notes. Edfu analyzes the content and provides document-based answers to your questions."
      },
      {
        "title": "Connect Your Sources",
        "description": "Drive, Notion, Slack, CRM, ERP and more. Connect your existing tools to Edfu, all sources sync automatically."
      },
      {
        "title": "Upload Documents, Instantly Ready",
        "description": "PDF, Word, Excel \u2014 drag and drop your documents. Edfu automatically chunks, indexes, and prepares them for queries."
      },
      {
        "title": "You Talk, AI Writes",
        "description": "Meeting notes, client calls, financial decisions \u2014 AI listens, writes, tags. Your team searches and finds instantly."
      }
    ]
  },
  "testimonial": { ... },
  "howItWorks": { ... },
  "security": { ... },
  "pricing": { ... },
  "marqueeTestimonials": { ... },
  "faq": { ... },
  "cta": { ... },
  "footer": { ... },
  "jsonLd": { ... }
}
```

(Full JSON files will be created during implementation with all sections.)

## Layout & Page Changes

### `app/[lang]/layout.tsx`

- Accepts `params.lang` via `LayoutProps<'/[lang]'>`
- Loads dictionary for metadata generation
- Sets `<html lang={lang}>`
- Adds `hreflang` alternate links
- Updates `metadataBase` to `https://edfu.ai`
- Passes dictionary and locale to children via props (server components) or context (client components)

### `app/[lang]/page.tsx`

- Loads dictionary via `getDictionary(lang)`
- Passes relevant dictionary sections to each component as props
- Validates locale with `hasLocale()`, returns `notFound()` if invalid

### Static generation

```ts
export async function generateStaticParams() {
  return [{ lang: "tr" }, { lang: "en" }];
}
```

## Component Changes

All section components will receive their dictionary section as a prop. Since most components are client components (`"use client"`), the dictionary is passed as a serializable prop from the server page.

### Pattern for server → client data flow

```tsx
// app/[lang]/page.tsx (server component)
const dict = await getDictionary(lang);
<Hero dict={dict.hero} />
<Navbar dict={dict.navbar} lang={lang} />
```

```tsx
// components/sections/hero.tsx (client component)
"use client";
interface HeroProps {
  dict: Dictionary["hero"];
}
export function Hero({ dict }: HeroProps) {
  // Use dict.badge, dict.titleLine1Before, etc.
}
```

### Components requiring locale context

- **Navbar** — needs `lang` for language switcher and link generation
- **Footer** — needs `lang` for links
- **Pricing** — currency formatting may differ (TRY vs USD — future consideration, keep TRY for now)

## Language Switcher

A simple `TR | EN` text toggle placed in the navbar next to the theme toggler.

Behavior:
- Shows current language as active (bold/highlighted)
- On click: sets `NEXT_LOCALE` cookie and navigates to the equivalent path
  - From `/` (TR) clicking EN → navigates to `/en`
  - From `/en` (EN) clicking TR → navigates to `/`
- Uses `<a>` tags (full navigation) to ensure proxy runs on the new request

Visual:
- Inline with theme toggler: `[TR | EN] [theme-toggle]`
- Active language: `text-foreground font-medium`
- Inactive language: `text-muted-foreground`
- Separator: `text-border`
- Same height as theme toggler (h-8)
- Rounded border matching theme toggler style

## SEO

### hreflang tags

In layout.tsx metadata:
```ts
alternates: {
  canonical: lang === "tr" ? "/" : "/en",
  languages: {
    "tr": "/",
    "en": "/en",
    "x-default": "/",
  },
}
```

### OpenGraph locale

- Turkish: `locale: "tr_TR"`
- English: `locale: "en_US"`, `locale_alternate: ["tr_TR"]`

### JSON-LD structured data

- Localized per language (titles, descriptions, FAQ questions/answers)
- `inLanguage` field set to current locale
- `availableLanguage` includes both languages

### Base URL update

All instances of `edfu.com.tr` changed to `edfu.ai`.

## Translatable Content Inventory

| Section | Translatable elements |
|---------|----------------------|
| **Layout metadata** | title, description, keywords, OG tags, Twitter cards |
| **Navbar** | 4 nav links, CTA button, mobile menu labels |
| **Hero** | badge, heading (2 lines with highlights), description, 2 CTA buttons |
| **Logos** | subtitle text, "Daha Fazla" hover label |
| **Bento Features** | section title, description, 4 feature cards (title + desc), chat mockup text, file names in upload mockup, notes mockup text |
| **Testimonial** | quote text, author name/title |
| **How It Works** | section title, description, 4 step cards (title + desc) |
| **Security** | section title, description, 2 card titles + descriptions |
| **Pricing** | section title, description, toggle labels, 3 plan cards (name, price label, description, CTA, features list), "En Populer" badge |
| **Marquee Testimonials** | section title, description, 11 testimonial cards (body, name, title) |
| **FAQ** | section title, description, 6 Q&A pairs |
| **CTA** | heading (3 lines), CTA button, subtext |
| **Footer** | description, 3 column headings + links |
| **JSON-LD** | organization, software, FAQ, website schemas |

## Non-translatable elements

- Logo (`Edfu` brand name stays the same)
- AI model names (Claude, ChatGPT, Gemini, etc.)
- Compliance badges (KVKK, EU Data, GDPR)
- File names in upload mockup (keep Turkish names as realistic demo content)
- Chat mockup AI response text and note mockup text (localize these for consistency)
- Flickering grid "Edfu" text in footer

## Out of Scope

- Multiple currency support (keep TRY for all locales for now)
- RTL support
- More than 2 languages
- Translation management service integration
- Automatic translation API
