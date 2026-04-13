"use client";

import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { motion } from "motion/react";

interface MeetingHeroProps {
  dict: {
    badge: string;
    title: string;
    description: string;
  };
}

export function MeetingHero({ dict }: MeetingHeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10 h-[600px] md:h-[700px] rounded-b-2xl border-b border-border"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 10%, var(--background) 40%, oklch(0.55 0.15 155) 100%)",
        }}
      />
      <div className="mx-auto max-w-4xl px-4 pt-32 sm:pt-40 pb-16 text-center">
        <motion.div
          className="mb-8 flex justify-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] as [number, number, number, number], delay: 0.1 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 shadow-sm">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <AnimatedShinyText className="text-xs font-medium">
              {dict.badge}
            </AnimatedShinyText>
          </div>
        </motion.div>

        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-medium text-foreground leading-none"
          style={{ letterSpacing: "-0.05em", fontFamily: "var(--font-geist)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] as [number, number, number, number], delay: 0.2 }}
        >
          {dict.title}
        </motion.h1>

        <motion.p
          className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-muted-foreground font-medium text-balance tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] as [number, number, number, number], delay: 0.3 }}
        >
          {dict.description}
        </motion.p>

        <motion.div
          className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.2, 0, 0, 1] as [number, number, number, number], delay: 0.4 }}
        >
          <div className="rounded-xl border border-border bg-card shadow-lg p-6 min-h-[250px] flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Meeting list mockup</p>
          </div>
          <div className="rounded-xl border border-border bg-card shadow-lg p-6 min-h-[250px] flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Call player mockup</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
