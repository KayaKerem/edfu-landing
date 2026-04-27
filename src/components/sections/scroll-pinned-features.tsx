"use client";

import * as React from "react";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { DottedBackdrop } from "@/components/ui/dotted-backdrop";

interface StickyFeature {
  title: string;
  description: string;
}

interface ScrollPinnedFeaturesProps {
  titleDark: string;
  titleMuted: string;
  features: StickyFeature[];
  visuals?: React.ReactNode[];
}

export function ScrollPinnedFeatures({
  titleDark,
  titleMuted,
  features,
  visuals,
}: ScrollPinnedFeaturesProps) {
  const sectionRef = React.useRef<HTMLElement>(null);

  const [activeIndex, setActiveIndex] = React.useState(0);
  const [progresses, setProgresses] = React.useState<number[]>([]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  React.useEffect(() => {
    setProgresses(features.map(() => 0));
  }, [features.length]);

  React.useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      if (!features.length) return;

      const raw = latest * features.length;
      const index = Math.min(features.length - 1, Math.floor(raw));

      setActiveIndex(index);

      setProgresses(
        features.map((_, i) => {
          if (i < index) return 1;
          if (i > index) return 0;
          return Math.min(1, Math.max(0, raw - i));
        })
      );
    });
  }, [scrollYProgress, features]);

  return (
    <section
      ref={sectionRef}
      className="relative h-auto border-x border-border md:h-[var(--scroll-h)]"
      style={
        {
          "--scroll-h": `${Math.max(features.length, 1) * 100}vh`,
        } as React.CSSProperties
      }
    >
      {/* Desktop */}
      <div className="hidden md:sticky md:top-0 md:block md:h-screen md:overflow-hidden">
        <div className="mx-auto grid h-full max-w-[1440px] grid-cols-[48%_52%]">
          {/* Left */}
          <div className="flex h-full flex-col justify-around px-12 py-16 lg:px-20 lg:py-20 xl:px-28 xl:py-24">
            <h2
              className="max-w-[560px] text-[20px] sm:text-[24px] lg:text-[28px] xl:text-[32px] font-semibold leading-snug tracking-[-0.045em]"
              style={{ fontFamily: "var(--font-geist)" }}
            >
              <span className="text-foreground">{titleDark}</span>{" "}
              <span className="text-[#98A1AF]">{titleMuted}</span>
            </h2>

            <ul className="mb-6 flex max-w-[520px] flex-col gap-6 lg:mb-8">
              {features.map((feature, i) => {
                const isActive = activeIndex === i;
                const progress = progresses[i] ?? 0;

                return (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => setActiveIndex(i)}
                      className="w-full text-left"
                    >
                      <h3
                        className="text-[12px] sm:text-[14px] lg:text-[16px] font-semibold tracking-[-0.02em] text-foreground"
                        style={{ fontFamily: "var(--font-geist)" }}
                      >
                        {feature.title}
                      </h3>

                      <div
                        className={[
                          "grid transition-[grid-template-rows,opacity,margin] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                          isActive
                            ? "mt-3 grid-rows-[1fr] opacity-100"
                            : "mt-0 grid-rows-[0fr] opacity-0",
                        ].join(" ")}
                      >
                        <p className="overflow-hidden text-[8px] sm:text-[10px] lg:text-[12px] leading-[1.5] text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>

                      <div className="mt-5 lg:mt-6 h-[2px] w-full overflow-hidden rounded-full bg-[#E1E5EA]">
                        <motion.div
                          className="h-full origin-left bg-black"
                          animate={{
                            scaleX: isActive
                              ? progress
                              : i < activeIndex
                              ? 1
                              : 0,
                          }}
                          transition={{ duration: 0.15, ease: "linear" }}
                          style={{ scaleX: 0 }}
                        />
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right */}
          <div className="relative flex h-full items-center justify-center overflow-hidden border-l border-dashed border-border px-10 py-16 lg:px-16 lg:py-20 xl:px-24 xl:py-24">
            <div className="absolute inset-0">
              <DottedBackdrop />
            </div>

            <div className="absolute inset-x-0 top-[72px] border-t border-border lg:top-[88px] xl:top-[102px]" />
            <div className="absolute inset-x-0 bottom-[72px] border-t border-border lg:bottom-[88px] xl:bottom-[102px]" />

            <div className="relative z-10 flex h-full w-full items-center justify-center">
              <AnimatePresence mode="wait">
                {visuals?.[activeIndex] && (
                  <motion.div
                    key={activeIndex}
                    initial={{
                      opacity: 0,
                      y: 72,
                      scale: 0.985,
                      filter: "blur(8px)",
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      filter: "blur(0px)",
                    }}
                    exit={{
                      opacity: 0,
                      y: -48,
                      scale: 0.985,
                      filter: "blur(8px)",
                    }}
                    transition={{
                      duration: 0.65,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="w-full max-w-[620px] lg:max-w-[680px] xl:max-w-[720px]"
                    aria-hidden="true"
                  >
                    {visuals[activeIndex]}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex flex-col gap-10 px-5 py-14">
        <h2
          className="text-[24px] sm:text-[28px] font-semibold leading-[1.1] tracking-[-0.04em]"
          style={{ fontFamily: "var(--font-geist)" }}
        >
          <span className="text-foreground">{titleDark}</span>{" "}
          <span className="text-[#98A1AF]">{titleMuted}</span>
        </h2>

        <ul className="flex flex-col gap-4">
          {features.map((feature, i) => (
            <li key={i}>
              <h3
                className="text-[12px] sm:text-[14px] font-semibold text-foreground"
                style={{ fontFamily: "var(--font-geist)" }}
              >
                {feature.title}
              </h3>

              <p className="mt-1 py-0 text-[10px] sm:text-[12px] leading-relaxed text-muted-foreground">
                {feature.description}
              </p>

              <div className="mt-5 h-[2px] w-full bg-black" />

              {visuals?.[i] && (
                <motion.div
                  initial={{ opacity: 0, y: 48 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="mt-8"
                  aria-hidden="true"
                >
                  {visuals[i]}
                </motion.div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}