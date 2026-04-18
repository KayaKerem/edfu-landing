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
  const sectionRef = useRef<HTMLElement>(null);
  const sentinelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hasCompletedRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const sentinels = sentinelRefs.current.filter(
      (sentinel): sentinel is HTMLDivElement => sentinel !== null
    );
    if (!sentinels.length) return;

    let frameId = 0;
    const updateActiveIndex = () => {
      const viewportCenter = window.innerHeight / 2;
      const bandTop = window.innerHeight * 0.1;
      const bandBottom = window.innerHeight * 0.9;

      let bestIndex: number | null = null;
      let bestDistance = Infinity;

      sentinels.forEach((sentinel, index) => {
        const rect = sentinel.getBoundingClientRect();
        const intersectsBand = rect.bottom > bandTop && rect.top < bandBottom;
        if (!intersectsBand) return;

        const sentinelCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sentinelCenter - viewportCenter);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = index;
        }
      });

      if (bestIndex !== null) {
        if (bestIndex === sentinels.length - 1) {
          hasCompletedRef.current = true;
        }
        setActiveIndex((current) => (current === bestIndex ? current : bestIndex));
        return;
      }

      const sectionRect = section.getBoundingClientRect();
      const sectionHasPassed = sectionRect.bottom <= window.innerHeight * 0.45;

      if (sectionHasPassed || hasCompletedRef.current) {
        hasCompletedRef.current = true;
        const lastIndex = sentinels.length - 1;
        setActiveIndex((current) => (current === lastIndex ? current : lastIndex));
      }
    };

    const observer = new IntersectionObserver(() => {
      cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(updateActiveIndex);
    });

    sentinels.forEach((sentinel) => observer.observe(sentinel));

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, []);

  const hasActiveIndex = activeIndex !== null;

  return (
    <section ref={sectionRef} className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2
          className="text-[28px] sm:text-[32px] md:text-[36px] font-medium leading-none text-foreground text-center mb-16"
          style={{ letterSpacing: "-0.05em" }}
        >
          {title}
        </h2>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            <div className="space-y-0">
              {features.map((feature, i) => (
                <div
                  key={i}
                  ref={(el) => {
                    sentinelRefs.current[i] = el;
                  }}
                  className="min-h-[400px] flex items-center"
                >
                  <div
                    className="transition-opacity duration-500"
                    style={{
                      opacity:
                        activeIndex === i
                          ? 1
                          : !hasActiveIndex
                            ? 0.45
                            : 0.2,
                    }}
                  >
                    <h3
                      className="text-xl font-semibold text-foreground tracking-tight"                    >
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: sticky visual panel */}
            <div className="hidden md:block">
              <div className="sticky top-28">
                {activeIndex !== null && visuals ? (
                  visuals[activeIndex]
                ) : (
                  <div className="rounded-xl border border-border bg-card p-8 min-h-[400px] flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">
                        Scroll to explore
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        The visual panel will lock onto the current feature as you move down the page.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile: show active visual inline below features */}
            {visuals && activeIndex !== null && (
              <div className="md:hidden mt-8">
                {visuals[activeIndex]}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
