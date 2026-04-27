"use client";

import { motion, MotionConfig } from "motion/react";
import Link from "next/link";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { Button } from "@/components/ui/button";
import { CallWidget } from "@/components/mockups/call-widget";

interface MeetingHeroProps {
  dict: {
    badge: string;
    headlinePrimary: string;
    headlineMuted: string;
    subhead: string;
    ctaPrimary: string;
    ctaSecondary: string;
    ctaTertiary: string;
  };
  mockupsDict: {
    callWidget: Parameters<typeof CallWidget>[0]["dict"];
  };
}

const EASE = [0.2, 0, 0, 1] as [number, number, number, number];

export function MeetingHero({ dict, mockupsDict }: MeetingHeroProps) {
  return (
    <section className="relative overflow-hidden">
      <MotionConfig reducedMotion="user">
        <div className="grid grid-cols-12">
          <div className="col-span-12 md:col-[2/-2] grid grid-cols-1 gap-10 px-6 pt-24 pb-16 sm:pt-28 md:grid-cols-[60%_40%] md:gap-12 md:px-0 md:pt-[116px] md:pb-20 lg:pt-32 items-center">
          {/* Left column: badge + headline + subhead + CTAs */}
          <div className="flex flex-col items-start">
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 shadow-sm">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <AnimatedShinyText className="text-xs font-medium">
                  {/* TODO(brand): placeholder badge copy */}
                  {dict.badge}
                </AnimatedShinyText>
              </div>
            </motion.div>

            <motion.h1
              className="text-[36px] sm:text-[48px] md:text-[56px] font-medium text-foreground leading-none text-balance"
              style={{ letterSpacing: "-0.05em" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
            >
              {/* TODO(brand): placeholder headline copy (two-tone split) */}
              <span>{dict.headlinePrimary}</span>{" "}
              <span className="text-muted-foreground">{dict.headlineMuted}</span>
            </motion.h1>

            <motion.p
              className="mt-6 max-w-xl text-base md:text-lg text-muted-foreground font-medium tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
            >
              {/* TODO(brand): placeholder subhead copy */}
              {dict.subhead}
            </motion.p>

            <motion.div
              className="mt-10 flex flex-wrap items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.4 }}
            >
              <Button size="lg" nativeButton={false} render={<a href="https://app.edfu.ai" />} className="bg-black">
                {/* TODO(brand): placeholder CTA label */}
                {dict.ctaPrimary}
              </Button>
              <Button size="lg" variant="ghost" nativeButton={false} render={<a href="#contact" />}>
                {/* TODO(brand): placeholder CTA label */}
                {dict.ctaSecondary}
              </Button>
              <Button size="lg" variant="ghost" nativeButton={false} render={<Link href="/pricing" />}>
                {/* TODO(brand): placeholder CTA label */}
                {dict.ctaTertiary}
              </Button>
            </motion.div>
          </div>

          {/* Right column: floating CallWidget on dotted backdrop (hidden on <360px phones) */}
          <div className="relative hidden [@media(min-width:360px)]:flex items-center justify-center overflow-hidden">
            {/* Dot pattern backdrop */}
            <svg
              width="100%"
              height="100%"
              className="absolute inset-0"
              aria-hidden="true"
            >
              <defs>
                <pattern
                  id="meetingHeroDots"
                  width="10"
                  height="10"
                  patternUnits="userSpaceOnUse"
                >
                  <rect x="5" y="5" width="1.2" height="1.2" fill="#D1D5DB" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#meetingHeroDots)" />
            </svg>

            <motion.div
              className="relative w-full max-w-[68%] mx-auto"
              aria-hidden="true"
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 24, mass: 0.9 }}
            >
              <CallWidget dict={mockupsDict.callWidget} />
            </motion.div>
          </div>
          </div>
        </div>
      </MotionConfig>
    </section>
  );
}
