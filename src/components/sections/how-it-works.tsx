"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

const STEP_DURATION = 5; // seconds

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
  // Key to force re-mount the progress bar on step change
  const [animKey, setAnimKey] = useState(0);

  const goNext = useCallback(() => {
    setActiveStep((prev) => (prev + 1) % steps.length);
    setAnimKey((k) => k + 1);
  }, []);

  const handleClick = (index: number) => {
    setActiveStep(index);
    setAnimKey((k) => k + 1);
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
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-stretch gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[2fr_3fr]">
          {/* Left column – Steps */}
          <div className="flex flex-col justify-between">
            {steps.map((step, index) => {
              const isActive = activeStep === index;
              return (
                <button
                  key={index}
                  onClick={() => handleClick(index)}
                  className="w-full cursor-pointer text-left"
                >
                  <div className={`rounded-xl p-6 transition-all duration-300 ${isActive ? "border border-border bg-white dark:bg-card pb-4" : ""}`}>
                    <h3 className="text-lg font-semibold text-foreground" style={{ fontFamily: "var(--font-geist)" }}>
                      {step.title}
                    </h3>
                    <div
                      className="grid transition-all duration-300 ease-in-out"
                      style={{ gridTemplateRows: isActive ? "1fr" : "0fr" }}
                    >
                      <div className="overflow-hidden">
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                        <div className="mt-4 h-1 w-full rounded-full bg-primary/10 overflow-hidden">
                          {isActive && (
                            <div
                              key={animKey}
                              className="h-full rounded-full bg-primary"
                              style={{
                                animation: `progressFill ${STEP_DURATION}s linear forwards`,
                              }}
                              onAnimationEnd={goNext}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right column – Visual */}
          <div className="rounded-xl border border-border bg-white dark:bg-card overflow-hidden">
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

      <style jsx>{`
        @keyframes progressFill {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}
