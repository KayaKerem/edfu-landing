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
      className="relative h-[var(--scroll-h)]"
      style={
        {
          "--scroll-h": `${Math.max(features.length, 1) * 100}vh`,
        } as React.CSSProperties
      }
    >
      {/* Desktop (lg+) */}
      <div className="hidden lg:sticky lg:top-0 lg:block lg:h-screen lg:overflow-hidden">
        <div className="mx-auto grid h-full max-w-[1440px] grid-cols-[48%_52%]">
          {/* Left */}
          <div className="flex h-full flex-col justify-between px-12 py-16 lg:px-20 lg:py-24 xl:px-28 xl:py-28 ">
            <h2
              className="max-w-[560px] text-[20px] sm:text-[24px] lg:text-[28px] xl:text-[32px] font-semibold leading-snug tracking-[-0.045em]"
              style={{ fontFamily: "var(--font-geist)" }}
            >
              <span className="text-foreground">{titleDark}</span>{" "}
              <span className="text-[#98A1AF]">{titleMuted}</span>
            </h2>

            <ul className=" flex max-w-[520px] flex-col 3 ">
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

                      <div className="mt-5 lg:mt-6 h-[2px] w-full overflow-hidden rounded-full bg-[#E1E5EA] dark:bg-[#72767A]">
                        <motion.div
                          className="h-full origin-left bg-black dark:bg-white"
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

            <div className="absolute inset-x-0 top-[72px] border-t border-dashed lg:top-[88px] xl:top-[102px]" />
            <div className="absolute inset-x-0 bottom-[72px] border-t border-dashed lg:bottom-[88px] xl:bottom-[102px]" />

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

      {/* Mobile / Tablet (< lg) — Attio's pinned 3-bar pattern */}
      <div className="lg:hidden sticky top-0 flex h-screen w-full flex-col items-stretch py-[clamp(40px,5svh,160px)]">
        {/* Title — scrolls with section */}
        <header className="grid grid-cols-12">
          <div className="col-[2/-2]">
            <h2
              className="max-w-[20em] text-pretty text-[24px] sm:text-[28px] font-semibold leading-[1.1] tracking-[-0.04em]"
              style={{ fontFamily: "var(--font-geist)" }}
            >
              <span className="text-foreground">{titleDark}</span>{" "}
              <span className="text-[#98A1AF]">{titleMuted}</span>
            </h2>
          </div>
        </header>

        {/* Top divider */}
        <div className="mt-8 h-px w-full bg-border" />

        {/* Visual area — square, dot-grid bg, fades between steps */}
        <div className="relative aspect-square w-full flex-1 overflow-hidden">
          <DottedBackdrop />

          <div className="absolute inset-0 flex items-center justify-center px-6">
            <AnimatePresence mode="wait">
              {visuals?.[activeIndex] && (
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, filter: "blur(8px)", scale: 0.985 }}
                  animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                  exit={{ opacity: 0, filter: "blur(8px)", scale: 0.985 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full max-w-[520px]"
                  aria-hidden="true"
                >
                  {visuals[activeIndex]}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom divider */}
        <div className="h-px w-full bg-border" />

        {/* Bars + active title — col-[2/-2] to align with header */}
        <div className="relative grid w-full grid-cols-12">
          <div className="relative col-[2/-2] h-32">
            {/* Progress bars row */}
            <div className="absolute inset-x-0 top-8 flex gap-1.5">
              {features.map((_, i) => {
                const progress = progresses[i] ?? 0;
                const filled = i < activeIndex ? 1 : i > activeIndex ? 0 : progress;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    aria-label={`Go to step ${i + 1}`}
                    className="h-0.5 w-full cursor-pointer overflow-hidden rounded-full bg-[#E1E5EA]"
                  >
                    <motion.div
                      className="size-full bg-foreground"
                      animate={{ x: `${(filled - 1) * 100}%` }}
                      transition={{ duration: 0.15, ease: "linear" }}
                    />
                  </button>
                );
              })}
            </div>

            {/* Active title + description below the bars */}
            <div className="absolute inset-x-0 top-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ filter: "blur(8px)", opacity: 0 }}
                  animate={{ filter: "blur(0px)", opacity: 1 }}
                  exit={{ filter: "blur(8px)", opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h3
                    className="text-[16px] sm:text-[18px] font-semibold tracking-[-0.02em] text-foreground"
                    style={{ fontFamily: "var(--font-geist)" }}
                  >
                    {features[activeIndex]?.title}
                  </h3>
                  <p className="mt-2 text-pretty text-[13px] sm:text-[14px] leading-[1.5] text-muted-foreground">
                    {features[activeIndex]?.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
