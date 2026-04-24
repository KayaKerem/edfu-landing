"use client";

import { useRef, useState, useEffect } from "react";
import { DottedBackdrop } from "@/components/ui/dotted-backdrop";

interface StickyFeature {
  title: string;
  description: string;
}

interface ScrollPinnedFeaturesProps {
  title: string;
  features: StickyFeature[];
  visuals?: React.ReactNode[];
}

export function ScrollPinnedFeatures({
  title,
  features,
  visuals,
}: ScrollPinnedFeaturesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const mq = window.matchMedia("(min-width: 768px)");
    if (!mq.matches) return;

    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;
      const scrolled = Math.max(0, -rect.top);
      const progress = Math.min(1, scrolled / scrollable);
      const idx = Math.min(
        features.length - 1,
        Math.floor(progress * features.length)
      );
      setActiveIndex(idx);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [features.length]);

  return (
    <section
      ref={sectionRef}
      className="relative h-auto md:h-[var(--scroll-h)]"
      style={{ "--scroll-h": `${Math.max(features.length, 1) * 90}vh` } as React.CSSProperties}
    >
      {/* Desktop: sticky scroll-tied */}
      <div className="hidden md:block md:sticky md:top-0 md:h-screen md:overflow-hidden">
        <div className="mx-auto grid h-full max-w-6xl grid-cols-2 px-6 divide-x divide-dashed divide-border">
          <div className="flex flex-col justify-center gap-12 py-16 pr-12">
            <h2
              className="text-[28px] sm:text-[32px] md:text-[40px] font-medium leading-[1.1] text-foreground tracking-tight text-balance"
              style={{ letterSpacing: "-0.04em", fontFamily: "var(--font-geist)" }}
            >
              {title}
            </h2>
            <ul className="flex flex-col gap-8">
              {features.map((feature, i) => {
                const isActive = activeIndex === i;
                return (
                  <li
                    key={i}
                    className="transition-opacity duration-500"
                    style={{ opacity: isActive ? 1 : 0.35 }}
                  >
                    <h3
                      className="text-lg md:text-xl font-semibold text-foreground tracking-tight"
                      style={{ fontFamily: "var(--font-geist)" }}
                    >
                      {feature.title}
                    </h3>
                    {isActive && (
                      <p className="mt-2 text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
                        {feature.description}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div
            className="relative flex items-center justify-center pl-12"
            aria-hidden="true"
          >
            <DottedBackdrop />
            {visuals && (
              <div className="relative z-10">{visuals[activeIndex]}</div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile: linear stack, feature + matching visual */}
      <div className="md:hidden flex flex-col gap-12 px-4 py-12">
        <h2
          className="text-[28px] font-medium leading-[1.1] text-foreground tracking-tight text-balance"
          style={{ letterSpacing: "-0.04em", fontFamily: "var(--font-geist)" }}
        >
          {title}
        </h2>
        <ul className="flex flex-col gap-10">
          {features.map((feature, i) => (
            <li key={i} className="flex flex-col gap-4">
              <div>
                <h3
                  className="text-lg font-semibold text-foreground tracking-tight"
                  style={{ fontFamily: "var(--font-geist)" }}
                >
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
              {visuals && visuals[i] && (
                <div className="mt-2" aria-hidden="true">
                  {visuals[i]}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
