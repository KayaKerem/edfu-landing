# Edfu Landing Page - Design Spec

## Overview

Clone of https://agent-magicui.vercel.app (SkyAgent) landing page for the Edfu product. Turkish content, design system inherited from ai-rag-ui-template project.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **Animations**: magic-ui (Marquee, BentoGrid, AnimatedBeam), Framer Motion
- **Dark mode**: next-themes
- **Fonts**: Inter (body), DM Sans (headings)
- **Icons**: Lucide React
- **Directory**: `src/` structure

## Design System (from ai-rag-ui-template)

### Colors (OKLCH)

**Light mode:**
- `--primary`: oklch(0.6723 0.1606 244.9955) — Blue
- `--primary-foreground`: oklch(1.0000 0 0) — White
- `--background`: oklch(1.0000 0 0) — White
- `--foreground`: oklch(0.1884 0.0128 248.5103) — Dark gray
- `--card`: oklch(0.9784 0.0011 197.1387) — Light gray
- `--muted`: oklch(0.9222 0.0013 286.3737) — Light gray
- `--muted-foreground`: oklch(0.5637 0.0078 247.9662) — Medium gray
- `--border`: oklch(0.9317 0.0118 231.6594) — Light border
- `--accent`: oklch(0.9392 0.0166 250.8453) — Light blue-gray
- `--ring`: oklch(0.6818 0.1584 243.3540) — Blue focus ring

**Dark mode:**
- `--background`: oklch(0 0 0) — Black
- `--foreground`: oklch(0.9328 0.0025 228.7857) — Near white
- `--card`: oklch(0.2097 0.0080 274.5332) — Dark gray
- `--muted`: oklch(0.2090 0 0) — Dark gray
- `--muted-foreground`: oklch(0.5637 0.0078 247.9662) — Medium gray
- `--border`: oklch(0.2674 0.0047 248.0045) — Dark border
- `--primary`: oklch(0.6692 0.1607 245.0110) — Light blue
- `--accent`: oklch(0.1928 0.0331 242.5459) — Dark blue

### Typography
- **Font sans**: Inter Variable
- **Font heading**: DM Sans Variable
- **Font mono**: Geist Mono

### Border Radius
- `--radius`: 0.5rem (8px) base
- `--radius-sm`: 4px
- `--radius-md`: 6px
- `--radius-lg`: 8px (buttons)
- `--radius-xl`: 12px (cards)

### Component Conventions
- **Button**: `rounded-lg h-8 text-sm`, focus ring `ring-3 ring-ring/50`
- **Card**: `rounded-xl ring-1 ring-foreground/10`
- **Input**: `rounded-lg h-8 border-input`

## Project Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── sections/
│   │   ├── navbar.tsx
│   │   ├── hero.tsx
│   │   ├── logos.tsx
│   │   ├── bento-features.tsx
│   │   ├── testimonial.tsx
│   │   ├── how-it-works.tsx
│   │   ├── security.tsx
│   │   ├── pricing.tsx
│   │   ├── marquee-testimonials.tsx
│   │   ├── faq.tsx
│   │   ├── cta.tsx
│   │   └── footer.tsx
│   ├── magicui/
│   │   ├── marquee.tsx
│   │   ├── bento-grid.tsx
│   │   └── animated-beam.tsx
│   └── ui/
│       ├── button.tsx
│       ├── badge.tsx
│       └── accordion.tsx
├── lib/
│   └── utils.ts
└── providers/
    └── theme-provider.tsx
```

## Sections Detail

### 1. Navbar
- Sticky top, backdrop blur, border-bottom on scroll
- Left: Edfu logo (icon + text)
- Center: Nav links — Ana Sayfa, Nasil Calisir, Ozellikler, Fiyatlandirma
- Right: "Ucretsiz Dene" primary button + dark mode toggle
- Active link gets a pill/border style
- Mobile: hamburger menu

### 2. Hero
- Top badge: "Ozel otomasyonlari kesfet" with wave emoji
- Heading (DM Sans bold): "AI Asistaninizla Tanisin\nIs Akisinizi Kolaylastirin"
- Description (muted): "Dijital is akislarinizi kolaylastirmak ve sıradan gorevleri halletmek icin tasarlanan yapay zeka asistani, boylece gercekten onemli olana odaklanabilirsiniz"
- Two buttons: "Ucretsiz Dene" (primary), "Giris Yap" (outline)
- Below: Browser mockup frame with gradient background (light blue/purple)

### 3. Logos Section
- Text: "Hizla buyuyen startup'larin tercihi"
- 4x2 grid of company logos (OpenAI, Retool, Stripe, Wise, Loom, Medium, Cash App, Linear)
- Subtle borders between cells

### 4. BentoGrid Features (magic-ui BentoGrid)
- Heading: "Is Akisinizi Yapay Zeka ile Guclendirin"
- Description: "Gercek zamanli is birligi, sorunsuz entegrasyonlar ve eyleme donusturulebilir icgoruler icin AI Asistaniniza sorun."
- 2x2 grid:
  - **Top-left**: "Gercek Zamanli AI Is Birligi" — Chat UI mockup (user message + AI response)
  - **Top-right**: "Sorunsuz Entegrasyonlar" — AnimatedBeam with tool icons (Figma, Notion, Slack etc.)
  - **Bottom-left**: "Anlik Icerik Raporlama" — Line chart mockup
  - **Bottom-right**: "Akilli Otomasyon" — Calendar/task timeline mockup

### 5. Testimonial
- Large quote text (serif-like bold): Turkish translation of Alex Johnson quote
- Avatar + name + title: "Alex Johnson, CTO, Innovatech"
- Full-width card with subtle border

### 6. How it Works
- Heading: "Basit. Sorunsuz. Akilli."
- Subtext: "Edfu'nun komutlarinizi dort kolay adimda nasil eyleme donusturdugunu kesfet"
- Left: 4-step accordion
  1. "AI Asistaniniza Dogrudan Sorun"
  2. "Edfu'nun Islemesine Izin Verin"
  3. "Aninda Eyleme Donusturulebilir Sonuclar Alin"
  4. "Surekli Iyilestirme"
- Right: Image/visual that changes per step
- Active step has blue left border + expanded description

### 7. Security Section
- Heading: "Guvenli Buyume Icin Tasarlandi"
- Subtext about security + scalability
- 2-column:
  - **Left**: "Gelismis Gorev Guvenligi" — Shield/lock visual
  - **Right**: "Takimlar Icin Olceklenebilir" — Globe/dots visual

### 8. Pricing
- Heading: "Sizinle Birlikte Olceklenen Fiyatlandirma"
- Subtext: "Hangi plani secerseniz secin, belgelerinizi sevene kadar ucretsiz. Bu bizim sozumuz."
- Monthly/Yearly toggle (yearly shows -20%)
- 3 cards:
  - **Free** ($0): "Bireysel kullanicilar icin" — "Ucretsiz Basla" outline button
  - **Startup** ($12, Popular badge): "Profesyoneller ve kucuk takimlar" — "Pro'ya Yukselt" primary button
  - **Enterprise** ($24): "Buyuk takimlar ve kurumsal" — "Satisla Iletisim" dark button
- Feature lists with blue checkmarks

### 9. Marquee Testimonials (magic-ui Marquee)
- Section heading: "Is Akisinizi Yapay Zeka ile Guclendirin"
- 3-column marquee with testimonial cards
- Each card: quote text (with highlighted link text), avatar, name, title
- Vertical scrolling marquee effect

### 10. FAQ
- Heading: "Sikca Sorulan Sorular"
- Subtext: "Edfu ve ozellikleri hakkinda sik sorulan sorularin yanitlari."
- 6 accordion items with chevron toggle:
  1. AI Asistani nedir?
  2. Edfu nasil calisir?
  3. Verilerim ne kadar guvenli?
  4. Mevcut araclarimi entegre edebilir miyim?
  5. Ucretsiz deneme surumu var mi?
  6. Edfu bana nasil zaman kazandirir?

### 11. CTA Section
- Blue gradient background (primary color)
- Large heading: "Otomatiklestir.\nSadelelestir.\nBasari Yakala."
- White button: "30 Gunluk Ucretsiz Denemenizi Baslatin"
- Subtext: "Istediginiz zaman iptal edin, soru sorulmaz"

### 12. Footer
- Left: Edfu logo + description + compliance badges (SOC 2, HIPAA, GDPR)
- 3 link columns: Sirket, Urunler, Kaynaklar
- Dot-grid pattern background at bottom

## Implementation Order

1. Project setup (create-next-app, deps, tailwind config, globals.css)
2. Layout + providers (fonts, theme-provider, root layout)
3. Navbar
4. Hero
5. Logos
6. BentoGrid features (install magic-ui BentoGrid + AnimatedBeam)
7. Testimonial
8. How it Works
9. Security
10. Pricing
11. Marquee testimonials (install magic-ui Marquee)
12. FAQ
13. CTA
14. Footer
15. Dark mode pass
16. Responsive polish
