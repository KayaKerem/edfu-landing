"use client";

import { useRef, useState, useEffect } from "react";
import { AnimatedBeam } from "@/components/ui/animated-beam";

const AI_RESPONSE = "Takvim kalıplarınıza ve tercihlerinize dayanarak, ekip toplantısını Salı saat 14:00'e planlamanızı öneririm. Bu zaman dilimi geçmişte en yüksek katılım oranına sahipti ve diğer tekrarlayan toplantılarla çakışmıyor.";

/* ------------------------------------------------------------------ */
/*  Card 1 – Chat Mockup with streaming animation                     */
/* ------------------------------------------------------------------ */
function ChatMockup() {
  const [displayedText, setDisplayedText] = useState("");
  const [showResponse, setShowResponse] = useState(false);

  useEffect(() => {
    // Show user message first, then start streaming after delay
    const startTimer = setTimeout(() => {
      setShowResponse(true);
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setDisplayedText(AI_RESPONSE.slice(0, i));
        if (i >= AI_RESPONSE.length) {
          clearInterval(interval);
          // Reset after a pause and replay
          setTimeout(() => {
            setDisplayedText("");
            setShowResponse(false);
            setTimeout(() => {
              setShowResponse(true);
              let j = 0;
              const interval2 = setInterval(() => {
                j++;
                setDisplayedText(AI_RESPONSE.slice(0, j));
                if (j >= AI_RESPONSE.length) clearInterval(interval2);
              }, 30);
            }, 1000);
          }, 4000);
        }
      }, 30);
      return () => clearInterval(interval);
    }, 1500);
    return () => clearTimeout(startTimer);
  }, []);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center p-4">
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
          <div className="flex items-start gap-2">
            {/* AI icon */}
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-background shadow-[0_0_10px_rgba(0,0,0,0.05)]">
              <svg width="42" height="24" viewBox="0 0 42 24" fill="none" className="size-4 fill-primary">
                <path d="M22.3546 0.96832C22.9097 0.390834 23.6636 0.0664062 24.4487 0.0664062C27.9806 0.0664062 31.3091 0.066408 34.587 0.0664146C41.1797 0.0664284 44.481 8.35854 39.8193 13.2082L29.6649 23.7718C29.1987 24.2568 28.4016 23.9133 28.4016 23.2274V13.9234L29.5751 12.7025C30.5075 11.7326 29.8472 10.0742 28.5286 10.0742H13.6016L22.3546 0.96832Z" />
                <path d="M19.6469 23.0305C19.0919 23.608 18.338 23.9324 17.5529 23.9324C14.021 23.9324 10.6925 23.9324 7.41462 23.9324C0.821896 23.9324 -2.47942 15.6403 2.18232 10.7906L12.3367 0.227022C12.8029 -0.257945 13.6 0.0855283 13.6 0.771372L13.6 10.0754L12.4265 11.2963C11.4941 12.2662 12.1544 13.9246 13.473 13.9246L28.4001 13.9246L19.6469 23.0305Z" />
              </svg>
            </div>
            {/* Response bubble with streaming text */}
            <div className="max-w-[280px] rounded-xl border border-border bg-accent p-4 shadow-[0_0_10px_rgba(0,0,0,0.05)]">
              <div className="overflow-hidden transition-[max-height] duration-300 ease-out" style={{ maxHeight: displayedText ? 200 : 0 }}>
                <p className="text-sm text-muted-foreground">{displayedText}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Card 2 – Animated Integration Beams                                */
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
      {icons.map((icon, i) => {
        const angle = (i * 360) / 6 - 90;
        const radius = 38;
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
      <div
        ref={centerRef}
        className="relative z-10 flex size-14 items-center justify-center rounded-xl border border-border bg-primary text-lg font-bold text-primary-foreground shadow-lg"
      >
        E
      </div>
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
    visual: <IntegrationBeams />,
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
