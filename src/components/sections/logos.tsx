"use client";

import type { Dictionary } from "@/dictionaries";
import { ArrowRight } from "lucide-react";
import { WhatsApp } from "@/components/ui/svgs/whatsapp";
import { Instagram } from "@/components/ui/svgs/instagram";
import { Telegram } from "@/components/ui/svgs/telegram";
import { Slack } from "@/components/ui/svgs/slack";
import { Zoom } from "@/components/ui/svgs/zoom";
import { GoogleMeet } from "@/components/ui/svgs/google-meet";
import { MsTeams } from "@/components/ui/svgs/ms-teams";

const logos = [
  { name: "WhatsApp", svg: <WhatsApp className="size-6" /> },
  { name: "Instagram", svg: <Instagram className="size-6" /> },
  { name: "Telegram", svg: <Telegram className="size-6" /> },
  { name: "Slack", svg: <Slack className="size-6" /> },
  { name: "Teams", svg: <MsTeams className="size-6" /> },
  { name: "Meet", svg: <GoogleMeet className="size-6" /> },
  { name: "Zoom", svg: <Zoom className="size-6" /> },
];

interface LogosProps {
  dict: Dictionary["logos"];
}

export function Logos({ dict }: LogosProps) {
  return (
    <section className="w-full">
      <div className="py-12 px-4 sm:px-6">
        <p className="text-center text-base text-muted-foreground font-medium" style={{ fontFamily: "var(--font-geist)" }}>
          {dict.subtitle}
        </p>
      </div>

      <div className="mx-4 sm:mx-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 border border-border">
          {logos.map((logo, i) => {
            // Mobile (2 cols): right border on even indices, bottom border on all except last row
            // Desktop (4 cols): right border on all except last in row, bottom border on first row
            const isLastRow2 = i >= logos.length - 2;
            const isRightInRow2 = i % 2 === 1;
            const isLastRow4 = i >= logos.length - (logos.length % 4 || 4);
            const isRightInRow4 = i % 4 === 3;
            return (
            <div
              key={logo.name}
              className={`group relative flex flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-10 overflow-hidden ${
                !isRightInRow2 ? "border-r border-border" : ""
              } ${!isLastRow2 ? "border-b border-border" : ""} ${
                !isRightInRow4 ? "sm:border-r" : "sm:border-r-0"
              } ${isLastRow2 && !isLastRow4 ? "sm:border-b" : ""} ${
                isLastRow4 ? "sm:border-b-0" : ""
              }`}
            >
              <div className="flex items-center gap-1.5 sm:gap-2 text-foreground transition-transform duration-300 group-hover:-translate-y-2">
                {logo.svg}
                <span className="text-base sm:text-xl font-bold">{logo.name}</span>
              </div>
              <span style={{ fontFamily: "var(--font-geist)" }} className="absolute bottom-4 flex items-center gap-1 text-sm font-medium text-foreground/80 opacity-0 transition-all duration-300 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0">
                {dict.learnMore} <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
            </div>
            );
          })}
        </div>
      </div>

      <div className="h-12" />
    </section>
  );
}
