"use client";

import { useState, useCallback, useRef, useEffect } from "react";

const steps = [
  {
    title: "Dokümanlarınızı Yükleyin",
    description:
      "PDF, Word, Excel — mevcut dokümanlarınızı sürükleyip bırakın. Edfu içerikleri otomatik olarak parçalar, indeksler ve sorguya hazır hale getirir.",
    emoji: "💬",
  },
  {
    title: "Kaynaklarınızı Bağlayın",
    description:
      "Web sitenizi, Google Drive'ınızı, Notion'ınızı bağlayın. Edfu içeriklerinizi otomatik senkronize eder ve bilgi tabanınızı güncel tutar.",
    emoji: "⚙️",
  },
  {
    title: "Sorun, Cevap Alın",
    description:
      "Ekibiniz Türkçe sorular sorsun, Edfu bilgi tabanınızdan kaynaklı, doğru ve güvenilir cevapları anında versin.",
    emoji: "📊",
  },
  {
    title: "Ekip Olarak Büyüyün",
    description:
      "Her yeni doküman, her yeni sohbet şirketinizin bilgi birikimini zenginleştirir. Edfu kullandıkça daha akıllı hale gelir — ekibinizin ortak hafızası sürekli büyür.",
    emoji: "🚀",
  },
];

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  const goNext = useCallback(() => {
    setActiveStep((prev) => (prev + 1) % steps.length);
    setAnimKey((k) => k + 1);
  }, []);

  // Auto-scroll mobile container to active card
  useEffect(() => {
    const container = mobileScrollRef.current;
    if (!container) return;
    const card = container.children[activeStep] as HTMLElement | undefined;
    if (!card) return;
    container.scrollTo({
      left: card.offsetLeft - container.offsetLeft - 16,
      behavior: "smooth",
    });
  }, [activeStep]);

  const handleClick = useCallback((index: number) => {
    setActiveStep(index);
    setAnimKey((k) => k + 1);
  }, []);

  return (
    <section
      id="how-it-works"
      className="flex flex-col items-center justify-center gap-5 w-full relative"
    >
      {/* Header */}
      <div className="border-b w-full h-full px-4 py-10 md:p-14">
        <div className="max-w-xl mx-auto flex flex-col items-center justify-center gap-2">
          <h2
            className="text-[28px] sm:text-[32px] md:text-[36px] font-medium leading-none text-foreground text-center"
            style={{ letterSpacing: "-0.05em", fontFamily: "var(--font-geist)" }}
          >
            Üç Adımda Başlayın
          </h2>
          <p className="text-muted-foreground text-center text-balance font-medium">
            Teknik bilgi gerekmez. Dokümanlarınızı yükleyin, dakikalar içinde şirketinizin AI destekli bilgi tabanı hazır.
          </p>
        </div>
      </div>

      {/* Content area */}
      <div className="w-full h-full lg:h-[450px] flex items-center justify-center">
        <div className="grid h-full grid-cols-1 lg:grid-cols-5 gap-x-10 px-4 md:px-20 items-center w-full max-w-7xl mx-auto">
          {/* Left accordion (desktop only) */}
          <div className="col-span-2 w-full hidden lg:flex items-stretch justify-start">
            <div className="w-full flex flex-col justify-between">
              {steps.map((step, index) => {
                const isActive = activeStep === index;
                return (
                  <div
                    key={index}
                    className={`relative transition-all duration-300 ${
                      isActive
                        ? "bg-white dark:bg-[#27272A] rounded-lg shadow-[0px_0px_1px_0px_rgba(0,0,0,0.16),0px_1px_2px_-0.5px_rgba(0,0,0,0.16)] dark:shadow-[0px_0px_0px_1px_rgba(249,250,251,0.06),0px_0px_0px_1px_#27272A,0px_1px_2px_-0.5px_rgba(0,0,0,0.24),0px_2px_4px_-1px_rgba(0,0,0,0.24)]"
                        : ""
                    }`}
                  >
                    {/* Title button */}
                    <button
                      onClick={() => handleClick(index)}
                      className="flex h-[45px] flex-1 w-full cursor-pointer items-center justify-between p-3 font-semibold text-lg tracking-tight text-left"
                      style={{ fontFamily: "var(--font-geist)" }}
                    >
                      {step.title}
                    </button>

                    {/* Content (description) with grid-template-rows trick */}
                    <div
                      className="grid transition-all duration-300 ease-in-out"
                      style={{
                        gridTemplateRows: isActive ? "1fr" : "0fr",
                      }}
                    >
                      <div className="overflow-hidden">
                        <p className="text-sm font-medium p-3 pt-0">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div
                      className="absolute left-0 right-0 bottom-0 h-0.5 w-full bg-neutral-300/50 dark:bg-neutral-300/30 rounded-lg overflow-hidden transition-opacity duration-300"
                      style={{ opacity: isActive ? 1 : 0 }}
                    >
                      {isActive && (
                        <div
                          key={`progress-${animKey}`}
                          className="absolute left-0 top-0 h-full bg-primary progress-fill"
                          onAnimationEnd={goNext}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right visual */}
          <div className="col-span-1 h-[280px] sm:h-[350px] min-h-[200px] w-auto lg:col-span-3">
            <div className="relative h-full w-full overflow-hidden rounded-xl border border-neutral-300/50 p-1">
              <div className="flex h-full w-full items-center justify-center">
                {steps.map((step, index) => (
                  <span
                    key={index}
                    className="absolute text-8xl transition-all duration-300"
                    style={{
                      opacity: activeStep === index ? 1 : 0,
                      filter:
                        activeStep === index ? "blur(0px)" : "blur(8px)",
                    }}
                  >
                    {step.emoji}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile horizontal scroll */}
          <div ref={mobileScrollRef} className="col-span-1 lg:col-span-5 flex snap-x flex-nowrap overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [-webkit-mask-image:linear-gradient(90deg,transparent,black_10%,white_90%,transparent)] [mask-image:linear-gradient(90deg,transparent,black_10%,white_90%,transparent)] snap-mandatory lg:hidden mt-4">
            {steps.map((step, index) => {
              const isActive = activeStep === index;
              return (
                <button
                  key={index}
                  onClick={() => handleClick(index)}
                  className="relative grid h-full min-w-[280px] max-w-[300px] shrink-0 items-start justify-center p-4 bg-background border-l last:border-r border-t border-b border-border first:rounded-tl-xl last:rounded-tr-xl snap-start cursor-pointer text-left"
                >
                  <h3 className="text-base font-bold" style={{ fontFamily: "var(--font-geist)" }}>{step.title}</h3>
                  <p className="text-sm font-medium leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>

                  {/* Progress bar */}
                  <div
                    className="absolute left-0 right-0 bottom-0 h-0.5 w-full bg-neutral-300/50 dark:bg-neutral-300/30 rounded-lg overflow-hidden transition-opacity duration-300"
                    style={{ opacity: isActive ? 1 : 0 }}
                  >
                    {isActive && (
                      <div
                        key={`mobile-progress-${animKey}`}
                        className="absolute left-0 top-0 h-full bg-primary progress-fill"
                        onAnimationEnd={goNext}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progressFill {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
        .progress-fill {
          animation: progressFill 5s linear forwards;
        }
      `}</style>
    </section>
  );
}
