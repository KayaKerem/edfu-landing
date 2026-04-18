"use client";

import { motion, MotionConfig } from "motion/react";
import Link from "next/link";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { Button } from "@/components/ui/button";
import { CrmTable } from "@/components/mockups/crm-table";
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
    crmTable: Parameters<typeof CrmTable>[0]["dict"];
    callWidget: Parameters<typeof CallWidget>[0]["dict"];
  };
}

const EASE = [0.2, 0, 0, 1] as [number, number, number, number];

export function MeetingHero({ dict, mockupsDict }: MeetingHeroProps) {
  return (
    <section className="relative overflow-hidden px-4 md:px-6 pt-32 sm:pt-40 pb-16">
      <MotionConfig reducedMotion="user">
        <div className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-8 md:gap-12 items-center">
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
              <Button size="lg" render={<a href="https://app.edfu.ai" />}>
                {/* TODO(brand): placeholder CTA label */}
                {dict.ctaPrimary}
              </Button>
              <Button size="lg" variant="ghost" render={<a href="#contact" />}>
                {/* TODO(brand): placeholder CTA label */}
                {dict.ctaSecondary}
              </Button>
              <Button size="lg" variant="ghost" render={<Link href="/pricing" />}>
                {/* TODO(brand): placeholder CTA label */}
                {dict.ctaTertiary}
              </Button>
            </motion.div>
          </div>

          {/* Right column: widget stage (hidden on <360px phones) */}
          <div className="hidden [@media(min-width:360px)]:block">
            <HeroWidgetStage
              crmTableDict={mockupsDict.crmTable}
              callWidgetDict={mockupsDict.callWidget}
            />
          </div>
        </div>
      </MotionConfig>
    </section>
  );
}

interface HeroWidgetStageProps {
  crmTableDict: Parameters<typeof CrmTable>[0]["dict"];
  callWidgetDict: Parameters<typeof CallWidget>[0]["dict"];
}

function HeroWidgetStage({ crmTableDict, callWidgetDict }: HeroWidgetStageProps) {
  return (
    <div
      className="relative aspect-square md:aspect-[4/5] lg:aspect-[5/6] overflow-hidden"
      aria-hidden="true"
    >
      {/* Layer 1: CRM-table backdrop — NO blur, faded, masked. Strip the
          CrmTable card shell visually via child-selector overrides so it
          reads as a backdrop, not a floating card. */}
      <div
        className="absolute inset-0 opacity-55 [mask-image:linear-gradient(to_bottom,black_0%,black_60%,transparent_100%)] [&>*]:!shadow-none [&>*]:!border-0 [&>*]:!rounded-none"
      >
        <CrmTable dict={crmTableDict} />
      </div>

      {/* Layer 2: floating widget with spring mount per addendum §3 */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 24, mass: 0.9 }}
      >
        <CallWidget dict={callWidgetDict} />
      </motion.div>
    </div>
  );
}
