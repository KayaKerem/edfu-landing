"use client";

import { useState } from "react";

/* ------------------------------------------------------------------ */
/*  Steps Data                                                         */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  Section Component                                                  */
/* ------------------------------------------------------------------ */
export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="font-heading text-4xl font-bold sm:text-5xl">
            Basit. Sorunsuz. Akıllı.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Edfu&apos;nun komutlarınızı dört kolay adımda nasıl eyleme
            dönüştürdüğünü keşfedin
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          {/* Left column – Steps accordion */}
          <div className="flex flex-col gap-3">
            {steps.map((step, index) => {
              const isActive = activeStep === index;
              return (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={[
                    "w-full rounded-xl border-l-4 p-6 text-left transition-all",
                    isActive
                      ? "border-l-primary bg-card"
                      : "border-l-transparent hover:bg-accent/50",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {index + 1}
                    </span>
                    <span className="font-heading text-base font-semibold">
                      {step.title}
                    </span>
                  </div>
                  {isActive && (
                    <p className="mt-3 pl-10 text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right column – Visual placeholder */}
          <div className="rounded-xl border border-border bg-card aspect-[4/3] overflow-hidden">
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-background">
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
