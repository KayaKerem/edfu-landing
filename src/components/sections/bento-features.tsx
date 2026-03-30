"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import { Notion } from "@/components/ui/svgs/notion";
import { Slack } from "@/components/ui/svgs/slack";
import { Figma } from "@/components/ui/svgs/figma";
import { Drive } from "@/components/ui/svgs/drive";
import { GithubDark } from "@/components/ui/svgs/githubDark";
import { Discord } from "@/components/ui/svgs/discord";
import { Linear } from "@/components/ui/svgs/linear";
import { Stripe } from "@/components/ui/svgs/stripe";
import { Vercel } from "@/components/ui/svgs/vercel";
import { Openai } from "@/components/ui/svgs/openai";

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
  const orbitRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = orbitRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={orbitRef} className="relative h-full w-full overflow-hidden">
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-[35%]">
        {/* Background gradient circles - ripple in from center */}
        <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] rounded-full bg-black/[0.02] transition-all duration-[1200ms] ease-out ${isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"}`} style={{ transitionDelay: "800ms" }} />
        <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[390px] rounded-full bg-black/[0.03] transition-all duration-1000 ease-out ${isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"}`} style={{ transitionDelay: "400ms" }} />
        <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[240px] rounded-full bg-black/[0.03] transition-all duration-700 ease-out ${isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"}`} style={{ transitionDelay: "100ms" }} />

        {/* Orbiting container - appears after gradient circles */}
        <div className={`relative flex items-center justify-center transition-all duration-[1200ms] ease-out ${isVisible ? "scale-100 opacity-100" : "scale-50 opacity-0"}`} style={{ width: 500, height: 500, transitionDelay: "1200ms" }}>
          <img src="/ai-icon-filled.svg" alt="Edfu" className="relative z-10 size-16 rounded-xl" />

          {/* Inner orbit - 2 icons, most space */}
          <OrbitingCircles iconSize={48} radius={120} speed={0.8}>
            <div className="flex size-12 items-center justify-center rounded-full border border-border bg-background shadow-sm p-2.5">
              <Slack className="size-7" />
            </div>
            <div className="flex size-12 items-center justify-center rounded-full border border-border bg-background shadow-sm p-2.5">
              <Figma className="size-7" />
            </div>
          </OrbitingCircles>

          {/* Middle orbit - 3 icons */}
          <OrbitingCircles iconSize={44} radius={195} speed={0.6} reverse>
            <div className="flex size-11 items-center justify-center rounded-full border border-border bg-background shadow-sm p-2">
              <Notion className="size-6" />
            </div>
            <div className="flex size-11 items-center justify-center rounded-full border border-border bg-background shadow-sm p-2">
              <Drive className="size-6" />
            </div>
            <div className="flex size-11 items-center justify-center rounded-full border border-border bg-background shadow-sm p-2">
              <Openai className="size-6" />
            </div>
          </OrbitingCircles>

          {/* Outer orbit - 3 icons */}
          <OrbitingCircles iconSize={40} radius={250} speed={0.5}>
            <div className="flex size-10 items-center justify-center rounded-full border border-border bg-background shadow-sm p-2">
              <GithubDark className="size-5" />
            </div>
            <div className="flex size-10 items-center justify-center rounded-full border border-border bg-background shadow-sm p-2">
              <Vercel className="size-5" />
            </div>
            <div className="flex size-10 items-center justify-center rounded-full border border-border bg-background shadow-sm p-2">
              <Stripe className="size-5" />
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
                {/* Bottom gradient fade into text area */}
                <div className="pointer-events-none absolute bottom-0 left-0 z-20 h-24 w-full bg-gradient-to-t from-background to-transparent" />
              </div>
              {/* Text area */}
              <div className="relative z-20 px-6 pb-8 -mt-4">
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
