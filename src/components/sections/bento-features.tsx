"use client";

import { useRef } from "react";
import {
  MessageSquare,
  Puzzle,
  BarChart3,
  CalendarClock,
} from "lucide-react";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { AnimatedBeam } from "@/components/ui/animated-beam";

/* ------------------------------------------------------------------ */
/*  Card 1 Background – Chat Mockup                                   */
/* ------------------------------------------------------------------ */
function ChatMockup() {
  return (
    <div className="flex flex-col gap-3 p-6 pt-8">
      {/* User message */}
      <div className="flex items-end justify-end gap-2">
        <div className="max-w-[70%] rounded-2xl bg-primary px-4 py-2.5 text-sm text-primary-foreground">
          Bu haftanın raporunu hazırlayabilir misin?
        </div>
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
          K
        </div>
      </div>

      {/* AI response */}
      <div className="flex items-end gap-2">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
          AI
        </div>
        <div className="max-w-[70%] rounded-2xl border border-border bg-card px-4 py-2.5 text-sm text-foreground">
          Tabii! Rapor hazırlanıyor... Veriler analiz edildi, 3 önemli bulgu var.
        </div>
      </div>

      {/* Typing indicator */}
      <div className="flex items-end gap-2">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
          AI
        </div>
        <div className="flex gap-1 rounded-2xl border border-border bg-card px-4 py-3">
          <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:0ms]" />
          <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:150ms]" />
          <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Card 2 Background – Animated Integration Beams                     */
/* ------------------------------------------------------------------ */
function IntegrationBeams() {
  const containerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const icon1Ref = useRef<HTMLDivElement>(null);
  const icon2Ref = useRef<HTMLDivElement>(null);
  const icon3Ref = useRef<HTMLDivElement>(null);
  const icon4Ref = useRef<HTMLDivElement>(null);
  const icon5Ref = useRef<HTMLDivElement>(null);
  const icon6Ref = useRef<HTMLDivElement>(null);

  const icons = [
    { ref: icon1Ref, emoji: "📊" },
    { ref: icon2Ref, emoji: "💬" },
    { ref: icon3Ref, emoji: "🎨" },
    { ref: icon4Ref, emoji: "☁️" },
    { ref: icon5Ref, emoji: "📁" },
    { ref: icon6Ref, emoji: "📧" },
  ];

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full items-center justify-center p-8"
    >
      {/* Surrounding icons – positioned in a circle */}
      {icons.map((icon, i) => {
        // 6 items spread around 360°
        const angle = (i * 360) / 6 - 90; // start from top
        const radius = 38; // % from center
        const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
        const y = 50 + radius * Math.sin((angle * Math.PI) / 180);
        return (
          <div
            key={i}
            ref={icon.ref}
            className="absolute z-10 flex size-10 items-center justify-center rounded-lg border border-border bg-card text-lg shadow-sm"
            style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
          >
            {icon.emoji}
          </div>
        );
      })}

      {/* Center node – Edfu logo */}
      <div
        ref={centerRef}
        className="relative z-10 flex size-14 items-center justify-center rounded-xl border border-border bg-primary text-lg font-bold text-primary-foreground shadow-lg"
      >
        E
      </div>

      {/* Beams */}
      {icons.map((icon, i) => (
        <AnimatedBeam
          key={i}
          containerRef={containerRef}
          fromRef={icon.ref}
          toRef={centerRef}
          duration={4 + i * 0.5}
          delay={i * 0.3}
          pathColor="oklch(0.7 0.05 260)"
          gradientStartColor="oklch(0.72 0.19 155)"
          gradientStopColor="oklch(0.62 0.19 260)"
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Card 3 Background – Line Chart Mockup                              */
/* ------------------------------------------------------------------ */
function ChartMockup() {
  return (
    <div className="flex h-full w-full items-end px-6 pt-8 pb-4">
      <svg
        viewBox="0 0 400 200"
        className="h-full w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.72 0.19 155)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="oklch(0.72 0.19 155)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[50, 100, 150].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="400"
            y2={y}
            stroke="currentColor"
            className="text-border"
            strokeWidth="0.5"
          />
        ))}

        {/* Gradient fill below polyline */}
        <polygon
          points="0,180 40,160 80,140 130,150 180,110 220,90 270,100 320,60 360,40 400,50 400,200 0,200"
          fill="url(#chartFill)"
        />

        {/* Line */}
        <polyline
          points="0,180 40,160 80,140 130,150 180,110 220,90 270,100 320,60 360,40 400,50"
          fill="none"
          stroke="oklch(0.72 0.19 155)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Highlighted data point */}
        <circle cx="360" cy="40" r="5" fill="oklch(0.72 0.19 155)" />
        <circle cx="360" cy="40" r="8" fill="oklch(0.72 0.19 155)" fillOpacity="0.2" />

        {/* Label */}
        <rect x="330" y="10" width="60" height="22" rx="6" fill="oklch(0.72 0.19 155)" />
        <text
          x="360"
          y="25"
          textAnchor="middle"
          fill="white"
          fontSize="11"
          fontWeight="600"
        >
          4.377
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Card 4 Background – Calendar / Task Timeline                       */
/* ------------------------------------------------------------------ */
function CalendarMockup() {
  const days = ["Sal", "Çar", "Per", "Cum", "Cts"];

  return (
    <div className="flex flex-col gap-3 p-6 pt-8">
      {/* Day headers */}
      <div className="grid grid-cols-5 gap-2 text-center text-xs font-medium text-muted-foreground">
        {days.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative mt-2 flex flex-col gap-2">
        {/* Block 1 */}
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
          <div className="h-8 flex-1 rounded-lg bg-primary px-3 text-xs font-medium leading-8 text-primary-foreground">
            Bento Grid
          </div>
        </div>

        {/* Block 2 */}
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary/70" />
          <div className="h-8 w-4/5 rounded-lg bg-primary/70 px-3 text-xs font-medium leading-8 text-primary-foreground/90">
            Landing Page
          </div>
        </div>

        {/* Block 3 – dashed "Add task" */}
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 shrink-0 rounded-full border border-dashed border-muted-foreground/40" />
          <div className="h-8 w-3/5 rounded-lg border border-dashed border-muted-foreground/30 px-3 text-xs font-medium leading-8 text-muted-foreground">
            + Görev Ekle
          </div>
        </div>

        {/* Vertical timeline connector */}
        <div className="absolute top-1 left-[0.3125rem] -z-10 h-[calc(100%-0.5rem)] w-px bg-border" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Features Array                                                     */
/* ------------------------------------------------------------------ */
const features = [
  {
    name: "Gerçek Zamanlı AI İş Birliği",
    description:
      "Gerçek zamanlı yardım deneyimi. AI Asistanınızdan görevleri koordine etmesini, soruları yanıtlamasını ve ekip uyumunu sağlamasını isteyin.",
    Icon: MessageSquare,
    href: "#",
    cta: "Daha Fazla",
    background: (
      <div className="absolute inset-0 [mask-image:linear-gradient(to_top,transparent_10%,#000_50%)]">
        <ChatMockup />
      </div>
    ),
    className: "col-span-3 md:col-span-1",
  },
  {
    name: "Sorunsuz Entegrasyonlar",
    description:
      "Zahmetsiz bağlantı için favori araçlarınızı birleştirin. Birbirine bağlı iş akışlarıyla üretkenliği artırın.",
    Icon: Puzzle,
    href: "#",
    cta: "Daha Fazla",
    background: (
      <div className="absolute inset-0 [mask-image:linear-gradient(to_top,transparent_10%,#000_50%)]">
        <IntegrationBeams />
      </div>
    ),
    className: "col-span-3 md:col-span-1",
  },
  {
    name: "Anlık İçgörü Raporlama",
    description:
      "Ham verileri saniyeler içinde net içgörülere dönüştürün. Gerçek zamanlı, sürekli öğrenen zekayla daha akıllı kararlar alın.",
    Icon: BarChart3,
    href: "#",
    cta: "Daha Fazla",
    background: (
      <div className="absolute inset-0 [mask-image:linear-gradient(to_top,transparent_10%,#000_50%)]">
        <ChartMockup />
      </div>
    ),
    className: "col-span-3 md:col-span-1",
  },
  {
    name: "Akıllı Otomasyon",
    description:
      "Kurun, unutun. AI Asistanınız tekrarlayan görevleri üstlenir, böylece strateji, yenilik ve büyümeye odaklanabilirsiniz.",
    Icon: CalendarClock,
    href: "#",
    cta: "Daha Fazla",
    background: (
      <div className="absolute inset-0 [mask-image:linear-gradient(to_top,transparent_10%,#000_50%)]">
        <CalendarMockup />
      </div>
    ),
    className: "col-span-3 md:col-span-1",
  },
];

/* ------------------------------------------------------------------ */
/*  Section Component                                                  */
/* ------------------------------------------------------------------ */
export function BentoFeatures() {
  return (
    <section id="features" className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-[36px] font-medium text-balance text-foreground leading-none" style={{ letterSpacing: "-0.05em", fontFamily: "var(--font-geist)" }}>
            İş Akışınızı Yapay Zeka ile Güçlendirin
          </h2>
          <p className="mt-4 text-base text-muted-foreground font-medium text-balance tracking-tight">
            Yapay zeka destekli araçlarla üretkenliğinizi artırın, tekrarlayan
            görevleri otomatikleştirin ve ekibinizle daha akıllı çalışın.
          </p>
        </div>

        {/* Grid – 2x2 on md+, single column on mobile */}
        <BentoGrid className="grid-cols-1 md:grid-cols-2 auto-rows-[22rem]">
          {features.map((feature) => (
            <BentoCard key={feature.name} {...feature} />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}
