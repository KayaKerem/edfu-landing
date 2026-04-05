"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Globe } from "@/components/ui/globe";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import type { Dictionary } from "@/dictionaries";

interface SecurityProps {
  dict: Dictionary["security"];
}

/* ------------------------------------------------------------------ */
/*  Shield + Lock Visual                                               */
/* ------------------------------------------------------------------ */
function ShieldLockVisual() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Shield */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="245"
        height="282"
        viewBox="0 0 245 282"
        className="relative z-10 h-[280px] w-auto drop-shadow-xl -translate-y-4"
      >
        <g filter="url(#filter0_dddd_2_33)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M113.664 7.33065C116.025 5.21236 119.082 4.04126 122.25 4.04126C125.418 4.04126 128.475 5.21236 130.836 7.33065C154.045 28.2076 183.028 41.5233 213.948 45.5151C216.984 45.9065 219.781 47.3695 221.839 49.6419C223.897 51.9144 225.081 54.8476 225.178 57.916C226.339 92.0322 217.849 125.781 200.689 155.261C183.529 184.74 158.4 208.746 128.209 224.501C126.368 225.462 124.323 225.962 122.248 225.959C120.173 225.956 118.13 225.45 116.291 224.484C86.0997 208.728 60.971 184.723 43.811 155.244C26.6511 125.764 18.1608 92.015 19.322 57.8988C19.4235 54.8334 20.6091 51.9043 22.6666 49.6354C24.7242 47.3665 27.5195 45.906 30.5524 45.5151C61.4706 41.5281 90.4531 28.2186 113.664 7.34787V7.33065Z"
            className="fill-white dark:fill-[#27272A]"
          />
        </g>
        <defs>
          <filter id="filter0_dddd_2_33" x="0.217041" y="0.0412598" width="244.066" height="292.917" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset dy="3" />
            <feGaussianBlur stdDeviation="3.5" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2_33" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset dy="12" />
            <feGaussianBlur stdDeviation="6" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0" />
            <feBlend mode="normal" in2="effect1_dropShadow_2_33" result="effect2_dropShadow_2_33" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset dy="27" />
            <feGaussianBlur stdDeviation="8" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.02 0" />
            <feBlend mode="normal" in2="effect2_dropShadow_2_33" result="effect3_dropShadow_2_33" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset dy="48" />
            <feGaussianBlur stdDeviation="9.5" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.01 0" />
            <feBlend mode="normal" in2="effect3_dropShadow_2_33" result="effect4_dropShadow_2_33" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect4_dropShadow_2_33" result="shape" />
          </filter>
        </defs>
      </svg>

      {/* Lock icon centered on shield */}
      <svg xmlns="http://www.w3.org/2000/svg" width="81" height="80" viewBox="0 0 81 80" className="absolute z-20 h-[72px] w-auto -translate-y-8 fill-background">
        <g filter="url(#filter0_iiii_2_34)">
          <path fillRule="evenodd" clipRule="evenodd" d="M20.5 36V28C20.5 22.6957 22.6071 17.6086 26.3579 13.8579C30.1086 10.1071 35.1957 8 40.5 8C45.8043 8 50.8914 10.1071 54.6421 13.8579C58.3929 17.6086 60.5 22.6957 60.5 28V36C62.6217 36 64.6566 36.8429 66.1569 38.3431C67.6571 39.8434 68.5 41.8783 68.5 44V64C68.5 66.1217 67.6571 68.1566 66.1569 69.6569C64.6566 71.1571 62.6217 72 60.5 72H20.5C18.3783 72 16.3434 71.1571 14.8431 69.6569C13.3429 68.1566 12.5 66.1217 12.5 64V44C12.5 41.8783 13.3429 39.8434 14.8431 38.3431C16.3434 36.8429 18.3783 36 20.5 36ZM52.5 28V36H28.5V28C28.5 24.8174 29.7643 21.7652 32.0147 19.5147C34.2652 17.2643 37.3174 16 40.5 16C43.6826 16 46.7348 17.2643 48.9853 19.5147C51.2357 21.7652 52.5 24.8174 52.5 28Z" />
        </g>
        <defs>
          <filter id="filter0_iiii_2_34" x="12.5" y="8" width="56" height="70" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset dy="1" />
            <feGaussianBlur stdDeviation="1" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow_2_34" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset dy="3" />
            <feGaussianBlur stdDeviation="1.5" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0" />
            <feBlend mode="normal" in2="effect1_innerShadow_2_34" result="effect2_innerShadow_2_34" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset dy="8" />
            <feGaussianBlur stdDeviation="2.5" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0" />
            <feBlend mode="normal" in2="effect2_innerShadow_2_34" result="effect3_innerShadow_2_34" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset dy="14" />
            <feGaussianBlur stdDeviation="3" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.01 0" />
            <feBlend mode="normal" in2="effect3_innerShadow_2_34" result="effect4_innerShadow_2_34" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

export function Security({ dict }: SecurityProps) {
  const { resolvedTheme } = useTheme();
  const [globeKey, setGlobeKey] = useState(0);

  useEffect(() => {
    setGlobeKey((k) => k + 1);
  }, [resolvedTheme]);

  return (
    <section id="security" className="relative">
      {/* Hatched areas */}
      <div className="pointer-events-none absolute inset-y-0 left-6 hidden md:block w-14 text-foreground/5 bg-[size:10px_10px] [background-image:repeating-linear-gradient(315deg,currentColor_0_1px,#0000_0_50%)]" />
      <div className="pointer-events-none absolute inset-y-0 right-6 hidden md:block w-14 text-foreground/5 bg-[size:10px_10px] [background-image:repeating-linear-gradient(315deg,currentColor_0_1px,#0000_0_50%)]" />
      {/* Inner vertical lines */}
      <div className="pointer-events-none absolute inset-y-0 left-4 md:left-20 w-px bg-border" />
      <div className="pointer-events-none absolute inset-y-0 right-4 md:right-20 w-px bg-border" />

      <div className="pt-12">
        {/* Header */}
        <div className="mx-auto mb-10 max-w-2xl px-4 text-center">
          <h2 className="text-[28px] sm:text-[32px] md:text-[36px] font-medium text-balance text-foreground leading-none" style={{ letterSpacing: "-0.05em", fontFamily: "var(--font-geist)" }}>
            {dict.title}
          </h2>
          <p className="mt-4 text-base text-muted-foreground font-medium text-balance tracking-tight">
            {dict.description}
          </p>
        </div>

        {/* Grid - same structure as bento-features */}
        <div className="relative mx-4 md:mx-20">
          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-x border-border">
            {/* Card 1 */}
            <div className="relative flex flex-col overflow-hidden aspect-auto min-h-[380px] sm:min-h-[420px] md:aspect-[554/496] md:min-h-0 md:border-r border-border">
              {/* Flickering grid - fills entire card */}
              <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black_20%,transparent_70%)]">
                <FlickeringGrid
                  squareSize={3}
                  gridGap={5}
                  flickerChance={0.3}
                  color="rgb(0, 0, 0)"
                  maxOpacity={0.3}
                  className="h-full w-full dark:hidden"
                />
                <FlickeringGrid
                  squareSize={3}
                  gridGap={5}
                  flickerChance={0.3}
                  color="rgb(255, 255, 255)"
                  maxOpacity={0.3}
                  className="h-full w-full hidden dark:block"
                />
              </div>
              <div className="relative z-10 flex-1 flex items-center justify-center pt-6 md:pt-0">
                <ShieldLockVisual />
                <div className="pointer-events-none absolute bottom-0 left-0 z-20 h-24 w-full bg-gradient-to-t from-background to-transparent" />
              </div>
              <div className="relative z-20 px-4 sm:px-6 pb-6 sm:pb-8 -mt-4">
                <h3 className="text-lg font-semibold tracking-tighter text-foreground" style={{ fontFamily: "var(--font-geist)" }}>{dict.cards[0].title}</h3>
                <p className="mt-1.5 text-base text-muted-foreground">{dict.cards[0].description}</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="relative flex flex-col overflow-hidden aspect-auto min-h-[320px] sm:min-h-[380px] md:aspect-[554/496] md:min-h-0 border-t md:border-t-0 border-border">
              <div className="relative flex-1 overflow-hidden">
                <div className="relative flex size-full items-center justify-center [mask-image:linear-gradient(to_top,transparent,black_50%)] -translate-y-8 md:-translate-y-20">
                  <Globe key={globeKey} dark={resolvedTheme === "dark"} className="top-12 md:top-28" />
                </div>
              </div>
              <div className="relative z-20 px-4 sm:px-6 pb-6 sm:pb-8 -mt-4">
                <h3 className="text-lg font-semibold tracking-tighter text-foreground" style={{ fontFamily: "var(--font-geist)" }}>{dict.cards[1].title}</h3>
                <p className="mt-1.5 text-base text-muted-foreground">{dict.cards[1].description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
