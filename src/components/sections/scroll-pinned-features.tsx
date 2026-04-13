"use client";

import { useRef, useState, useEffect } from "react";

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
  const sentinelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sentinelRefs.current.forEach((sentinel, i) => {
      if (!sentinel) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveIndex(i);
          }
        },
        { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
      );
      observer.observe(sentinel);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2
          className="text-[28px] sm:text-[32px] md:text-[36px] font-medium leading-none text-foreground text-center mb-16"
          style={{ letterSpacing: "-0.05em", fontFamily: "var(--font-geist)" }}
        >
          {title}
        </h2>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            <div className="space-y-0">
              {features.map((feature, i) => (
                <div
                  key={i}
                  ref={(el) => { sentinelRefs.current[i] = el; }}
                  className="min-h-[400px] flex items-center"
                >
                  <div
                    className="transition-opacity duration-500"
                    style={{ opacity: activeIndex === i ? 1 : 0.2 }}
                  >
                    <h3
                      className="text-xl font-semibold text-foreground tracking-tight"
                      style={{ fontFamily: "var(--font-geist)" }}
                    >
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden md:block">
              <div className="sticky top-28">
                {visuals ? (
                  visuals[activeIndex]
                ) : (
                  <div className="rounded-xl border border-border bg-card p-8 min-h-[400px] flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">
                      {features[activeIndex]?.title}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
