"use client";

import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

interface AgentsHeroProps {
  dict: {
    badge: string;
    title: string;
    description: string;
  };
  ctaText: string;
  prefix: string;
}

export function AgentsHero({ dict, ctaText, prefix }: AgentsHeroProps) {
  const ease: [number, number, number, number] = [0.2, 0, 0, 1];

  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10 h-[600px] md:h-[700px] rounded-b-2xl border-b border-border"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 10%, var(--background) 40%, var(--primary) 100%)",
        }}
      />
      <div className="mx-auto max-w-4xl px-4 pt-32 sm:pt-40 pb-16 text-center">
        <motion.div
          className="group mb-8 flex justify-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.1 }}
        >
          <div className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 shadow-sm">
            <AnimatedShinyText className="text-xs font-medium">
              {dict.badge}
            </AnimatedShinyText>
            <ArrowRight className="ml-1.5 size-2.5 text-muted-foreground" />
          </div>
        </motion.div>

        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-medium text-foreground leading-none"
          style={{ letterSpacing: "-0.05em", fontFamily: "var(--font-geist)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.2 }}
        >
          {dict.title}
        </motion.h1>

        <motion.p
          className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-muted-foreground font-medium text-balance tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.3 }}
        >
          {dict.description}
        </motion.p>

        <motion.div
          className="mt-8 flex items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.4 }}
        >
          <Link
            href="https://app.edfu.ai"
            className="bg-primary h-9 flex items-center justify-center text-sm font-normal tracking-wide rounded-full text-primary-foreground w-fit px-6 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_3px_3px_-1.5px_rgba(16,24,40,0.06),0_1px_1px_rgba(16,24,40,0.08)] border border-white/[0.12] hover:bg-primary/80 transition-all ease-out active:scale-95"
          >
            {ctaText}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
