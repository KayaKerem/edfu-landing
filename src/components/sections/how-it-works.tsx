"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const STEP_DURATION = 5000; // 5 seconds per step

const steps = [
  {
    title: "AI Asistanınıza Doğrudan Sorun",
    description:
      "Komutunuzu söyleyin veya yazın — Edfu niyetinizi anlar. İsteğiniz anında süreci başlatır.",
    emoji: "💬",
  },
  {
    title: "Edfu'nun İşlemesine İzin Verin",
    description:
      "Edfu isteğinizi analiz eder, gerekli bağlamı toplar ve en uygun çözümü hazırlar.",
    emoji: "⚙️",
  },
  {
    title: "Anında Eyleme Dönüştürülebilir Sonuçlar Alın",
    description:
      "Saniyeler içinde net, uygulanabilir sonuçlar alın. Verileriniz yapılandırılmış ve kullanıma hazır.",
    emoji: "📊",
  },
  {
    title: "Sürekli İyileştirme",
    description:
      "Edfu her etkileşimden öğrenir, zamanla daha akıllı ve daha verimli hale gelir.",
    emoji: "🚀",
  },
];

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef(Date.now());
  const rafRef = useRef<number>(0);

  const animate = useCallback(() => {
    const elapsed = Date.now() - startTimeRef.current;
    const pct = Math.min(elapsed / STEP_DURATION, 1);
    setProgress(pct);

    if (pct >= 1) {
      setActiveStep((prev) => (prev + 1) % steps.length);
      startTimeRef.current = Date.now();
      setProgress(0);
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    startTimeRef.current = Date.now();
    setProgress(0);
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  // Reset timer on manual click
  const handleClick = (index: number) => {
    setActiveStep(index);
    setProgress(0);
    startTimeRef.current = Date.now();
  };

  return (
    <section id="how-it-works" className="py-0">
      <div>
        {/* Header */}
        <div className="border-b border-border py-14 text-center">
          <h2 className="text-[36px] font-medium leading-none text-foreground" style={{ letterSpacing: "-0.05em", fontFamily: "var(--font-geist)" }}>
            Basit. Sorunsuz. Akıllı.
          </h2>
          <p className="mt-4 text-base text-muted-foreground font-medium tracking-tight" style={{ fontFamily: "var(--font-geist)" }}>
            Edfu&apos;nun komutlarınızı dört kolay adımda nasıl eyleme
            dönüştürdüğünü keşfedin
          </p>
        </div>

        {/* Two-column layout */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2">
          {/* Left column – Steps */}
          <div className="flex flex-col">
            {steps.map((step, index) => {
              const isActive = activeStep === index;
              return (
                <button
                  key={index}
                  onClick={() => handleClick(index)}
                  className="w-full text-left"
                >
                  {isActive ? (
                    <div className="rounded-xl border border-border bg-white dark:bg-card p-6 pb-4 transition-all">
                      <h3 className="text-base font-semibold text-foreground" style={{ fontFamily: "var(--font-geist)" }}>
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                      {/* Progress bar */}
                      <div className="mt-4 h-1 w-full rounded-full bg-primary/10">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${progress * 100}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="px-6 py-5">
                      <h3 className="text-base font-semibold text-foreground" style={{ fontFamily: "var(--font-geist)" }}>
                        {step.title}
                      </h3>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right column – Visual */}
          <div className="rounded-xl border border-border bg-white dark:bg-card aspect-[4/3] overflow-hidden">
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/5 via-transparent to-transparent">
              <span
                className="text-8xl transition-all duration-300"
                key={activeStep}
              >
                {steps[activeStep].emoji}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
