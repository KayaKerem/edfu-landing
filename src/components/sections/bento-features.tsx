"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";

const AI_RESPONSE = "Takvim kalıplarınıza ve tercihlerinize dayanarak, ekip toplantısını Salı saat 14:00'e planlamanızı öneririm. Bu zaman dilimi geçmişte en yüksek katılım oranına sahipti ve diğer tekrarlayan toplantılarla çakışmıyor.";

/* ------------------------------------------------------------------ */
/*  Card 1 – Chat Mockup with streaming animation                     */
/* ------------------------------------------------------------------ */
function ChatMockup() {
  const [displayedText, setDisplayedText] = useState("");
  const [showResponse, setShowResponse] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer - start animation when visible
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isVisible]);

  const [isThinking, setIsThinking] = useState(false);

  const startStreaming = useCallback(() => {
    setShowResponse(true);
    setIsThinking(true);
    setDisplayedText("");
    // Thinking dots for a moment, then start typing
    setTimeout(() => {
      setIsThinking(false);
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setDisplayedText(AI_RESPONSE.slice(0, i));
        if (i >= AI_RESPONSE.length) {
          clearInterval(interval);
          setTimeout(() => {
            setDisplayedText("");
            setShowResponse(false);
            setIsThinking(false);
            setTimeout(() => startStreaming(), 1000);
          }, 5000);
        }
      }, 35);
    }, 1500);
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => startStreaming(), 1000);
    return () => clearTimeout(timer);
  }, [isVisible, startStreaming]);

  return (
    <div ref={containerRef} className="relative flex h-full w-full flex-col items-center justify-center p-4">
      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 z-20 h-8 w-full bg-gradient-to-t from-background to-transparent" />

      <div className="mx-auto flex w-full max-w-md flex-col gap-3" style={{ transform: "translateY(-15px)" }}>
        {/* User message */}
        <div className="flex items-end justify-end gap-3">
          <div className="ml-auto max-w-[280px] rounded-2xl bg-primary p-4 text-sm text-primary-foreground shadow-[0_0_10px_rgba(0,0,0,0.05)]">
            <p>Merhaba, herkes için uygun bir ekip toplantısı planlamam gerekiyor. Uygun zaman dilimi bulmak için öneriniz var mı?</p>
          </div>
          <div className="flex shrink-0 items-center rounded-full border border-border bg-background">
            <img
              src="https://randomuser.me/api/portraits/women/79.jpg"
              alt="Kullanıcı"
              className="size-8 rounded-full"
            />
          </div>
        </div>

        {/* AI response */}
        {showResponse && (
          <div className="flex items-start gap-2 animate-slide-up">
            {/* AI icon */}
            <img src="/ai-icon.svg" alt="AI" className="size-10 shrink-0 rounded-full" />
            {/* Response bubble with streaming text */}
            <div className="max-w-[280px] rounded-xl border border-border bg-accent shadow-[0_0_10px_rgba(0,0,0,0.05)] transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" style={{ padding: isThinking || displayedText ? "1rem" : "0.75rem 1rem" }}>
              {isThinking ? (
                <div className="flex gap-1 py-1">
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:0ms]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:150ms]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:300ms]" />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{displayedText}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Card 2 – Orbiting Circles Integration                             */
/* ------------------------------------------------------------------ */
function IntegrationOrbits() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Orbit center positioned at bottom-center, so only top half shows */}
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-[35%]">
        {/* Background gradient circles */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[480px] rounded-full bg-black/[0.02]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[360px] rounded-full bg-black/[0.03]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[240px] rounded-full bg-black/[0.03]" />

        {/* Orbiting container */}
        <div className="relative flex items-center justify-center" style={{ width: 500, height: 500 }}>
          <img src="/logo.svg" alt="Edfu" className="relative z-10 size-16 rounded-xl" />

          <OrbitingCircles iconSize={44} radius={120} speed={0.5}>
            <div className="flex size-11 items-center justify-center rounded-full border border-border bg-background shadow-sm">
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <div className="flex size-11 items-center justify-center rounded-full border border-border bg-background shadow-sm">
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
          </OrbitingCircles>

          <OrbitingCircles iconSize={40} radius={175} speed={0.4} reverse>
            <div className="flex size-10 items-center justify-center rounded-full border border-border bg-background shadow-sm">
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <div className="flex size-10 items-center justify-center rounded-full border border-border bg-background shadow-sm">
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </div>
            <div className="flex size-10 items-center justify-center rounded-full border border-border bg-background shadow-sm">
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
            </div>
          </OrbitingCircles>

          <OrbitingCircles iconSize={36} radius={230} speed={0.3}>
            <div className="flex size-9 items-center justify-center rounded-full border border-border bg-background shadow-sm">
              <svg viewBox="0 0 24 24" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>
            </div>
            <div className="flex size-9 items-center justify-center rounded-full border border-border bg-background shadow-sm">
              <svg viewBox="0 0 24 24" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
          </OrbitingCircles>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Card 3 – Line Chart Mockup                                        */
/* ------------------------------------------------------------------ */
function ChartMockup() {
  return (
    <div className="flex h-full w-full items-end px-6 pt-8 pb-4">
      <svg viewBox="0 0 400 200" className="h-full w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.72 0.19 155)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="oklch(0.72 0.19 155)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[50, 100, 150].map((y) => (
          <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="currentColor" className="text-border" strokeWidth="0.5" />
        ))}
        <polygon points="0,180 40,160 80,140 130,150 180,110 220,90 270,100 320,60 360,40 400,50 400,200 0,200" fill="url(#chartFill)" />
        <polyline points="0,180 40,160 80,140 130,150 180,110 220,90 270,100 320,60 360,40 400,50" fill="none" stroke="oklch(0.72 0.19 155)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="360" cy="40" r="5" fill="oklch(0.72 0.19 155)" />
        <circle cx="360" cy="40" r="8" fill="oklch(0.72 0.19 155)" fillOpacity="0.2" />
        <rect x="330" y="10" width="60" height="22" rx="6" fill="oklch(0.72 0.19 155)" />
        <text x="360" y="25" textAnchor="middle" fill="white" fontSize="11" fontWeight="600">4.377</text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Card 4 – Calendar / Task Timeline                                  */
/* ------------------------------------------------------------------ */
function CalendarMockup() {
  const days = ["Sal", "Çar", "Per", "Cum", "Cts"];
  return (
    <div className="flex flex-col gap-3 p-6 pt-8">
      <div className="grid grid-cols-5 gap-2 text-center text-xs font-medium text-muted-foreground">
        {days.map((d) => (<span key={d}>{d}</span>))}
      </div>
      <div className="relative mt-2 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
          <div className="h-8 flex-1 rounded-lg bg-primary px-3 text-xs font-medium leading-8 text-primary-foreground">Bento Grid</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary/70" />
          <div className="h-8 w-4/5 rounded-lg bg-primary/70 px-3 text-xs font-medium leading-8 text-primary-foreground/90">Landing Page</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 shrink-0 rounded-full border border-dashed border-muted-foreground/40" />
          <div className="h-8 w-3/5 rounded-lg border border-dashed border-muted-foreground/30 px-3 text-xs font-medium leading-8 text-muted-foreground">+ Görev Ekle</div>
        </div>
        <div className="absolute top-1 left-[0.3125rem] -z-10 h-[calc(100%-0.5rem)] w-px bg-border" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hatched pattern for between inner & outer lines                    */
/* ------------------------------------------------------------------ */
function HatchedEdge({ side }: { side: "left" | "right" }) {
  return (
    <div
      className={`absolute top-0 ${side === "left" ? "-left-4 md:-left-14" : "-right-4 md:-right-14"} h-full w-4 md:w-14 text-black/5 bg-[size:10px_10px] [background-image:repeating-linear-gradient(315deg,currentColor_0_1px,#0000_0_50%)]`}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Features data                                                      */
/* ------------------------------------------------------------------ */
const features = [
  {
    title: "Gerçek Zamanlı AI İş Birliği",
    description: "Gerçek zamanlı yardım deneyimi. AI Asistanınızdan görevleri koordine etmesini, soruları yanıtlamasını ve ekip uyumunu sağlamasını isteyin.",
    visual: <ChatMockup />,
  },
  {
    title: "Sorunsuz Entegrasyonlar",
    description: "Zahmetsiz bağlantı için favori araçlarınızı birleştirin. Birbirine bağlı iş akışlarıyla üretkenliği artırın.",
    visual: <IntegrationOrbits />,
  },
  {
    title: "Anlık İçgörü Raporlama",
    description: "Ham verileri saniyeler içinde net içgörülere dönüştürün. Gerçek zamanlı, sürekli öğrenen zekayla daha akıllı kararlar alın.",
    visual: <ChartMockup />,
  },
  {
    title: "Akıllı Otomasyon",
    description: "Kurun, unutun. AI Asistanınız tekrarlayan görevleri üstlenir, böylece strateji, yenilik ve büyümeye odaklanabilirsiniz.",
    visual: <CalendarMockup />,
  },
];

/* ------------------------------------------------------------------ */
/*  Section Component                                                  */
/* ------------------------------------------------------------------ */
export function BentoFeatures() {
  return (
    <section id="features" className="relative">
      {/* Hatched areas - full section height, positioned at inner line */}
      <div className="pointer-events-none absolute inset-y-0 left-6 w-4 md:w-14 text-black/5 bg-[size:10px_10px] [background-image:repeating-linear-gradient(315deg,currentColor_0_1px,#0000_0_50%)]" />
      <div className="pointer-events-none absolute inset-y-0 right-6 w-4 md:w-14 text-black/5 bg-[size:10px_10px] [background-image:repeating-linear-gradient(315deg,currentColor_0_1px,#0000_0_50%)]" />
      {/* Vertical lines at grid edges (3rd lines) - full section height */}
      <div className="pointer-events-none absolute inset-y-0 left-10 md:left-20 w-px bg-[oklch(.922_0_0)]" />
      <div className="pointer-events-none absolute inset-y-0 right-10 md:right-20 w-px bg-[oklch(.922_0_0)]" />

      <div className="pt-12">
        {/* Header */}
        <div className="mx-auto mb-10 max-w-2xl px-4 text-center">
          <h2 className="text-[36px] font-medium text-balance text-foreground leading-none" style={{ letterSpacing: "-0.05em", fontFamily: "var(--font-geist)" }}>
            İş Akışınızı Yapay Zeka ile Güçlendirin
          </h2>
          <p className="mt-4 text-base text-muted-foreground font-medium text-balance tracking-tight">
            Yapay zeka destekli araçlarla üretkenliğinizi artırın, tekrarlayan
            görevleri otomatikleştirin ve ekibinizle daha akıllı çalışın.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="relative mx-10 md:mx-20">

        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-x border-[oklch(.922_0_0)]">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`relative flex flex-col overflow-hidden aspect-[554/496] ${
                i % 2 === 0 && i < features.length - 1 ? "md:border-r border-[oklch(.922_0_0)]" : ""
              } ${i < 2 ? "border-b border-[oklch(.922_0_0)]" : ""}`}
            >
              {/* Visual area */}
              <div className="relative flex-1">
                {feature.visual}
              </div>
              {/* Text area */}
              <div className="px-6 pb-8">
                <h3 className="text-lg font-semibold tracking-tighter text-foreground" style={{ fontFamily: "var(--font-geist)" }}>{feature.title}</h3>
                <p className="mt-1.5 text-base text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
