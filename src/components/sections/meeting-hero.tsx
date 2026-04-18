"use client";

import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { motion } from "motion/react";
import { MeetingList } from "@/components/mockups/meeting-list";
import { CallPlayer } from "@/components/mockups/call-player";

interface MeetingHeroProps {
  dict: {
    badge: string;
    title: string;
    description: string;
  };
  mockupsDict: {
    meetingList: Parameters<typeof MeetingList>[0]["dict"];
    callPlayer: Parameters<typeof CallPlayer>[0]["dict"];
  };
}

export function MeetingHero({ dict, mockupsDict }: MeetingHeroProps) {
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
          className="text-[36px] sm:text-[48px] md:text-[56px] font-medium text-foreground leading-none"
          style={{ letterSpacing: "-0.05em" }}
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
          <MeetingList className="shadow-lg" dict={mockupsDict.meetingList} />
          <CallPlayer className="shadow-lg" dict={mockupsDict.callPlayer} />
        </motion.div>
      </div>
    </section>
  );
}
