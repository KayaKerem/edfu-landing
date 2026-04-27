"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

type IconProps = {
  className?: string;
};

const ZoomIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <rect x="6" y="10" width="15" height="12" rx="3" fill="#2D8CFF" />
    <path d="M21 14.5 26 12v8l-5-2.5v-3Z" fill="#2D8CFF" />
    <rect x="10" y="14" width="7" height="4" rx="1.4" fill="white" />
  </svg>
);

const GoogleMeetIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <path d="M5 10.5A2.5 2.5 0 0 1 7.5 8H17v8H5v-5.5Z" fill="#1A73E8" />
    <path d="M5 16h12v8H7.5A2.5 2.5 0 0 1 5 21.5V16Z" fill="#34A853" />
    <path d="M17 8l5 4v8l-5 4V8Z" fill="#FBBC05" />
    <path d="M22 12.5 27 10v12l-5-2.5v-7Z" fill="#EA4335" />
  </svg>
);

const TeamsIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <circle cx="21.5" cy="10" r="3" fill="#7B83EB" />
    <circle cx="13" cy="9.5" r="3.5" fill="#5059C9" />
    <rect x="14" y="14" width="13" height="9" rx="3" fill="#7B83EB" />
    <rect x="5" y="12" width="14" height="13" rx="2.5" fill="#5059C9" />
    <path d="M9 16h7v2h-2.4v5h-2.2v-5H9v-2Z" fill="white" />
  </svg>
);

const integrations = [
  { label: "Zoom", Icon: ZoomIcon, x: 0.38, delay: 0 },
  { label: "Google Meet", Icon: GoogleMeetIcon, x: 0.5, delay: 0.12 },
  { label: "Microsoft Teams", Icon: TeamsIcon, x: 0.62, delay: 0.24 },
];

function getArcY(x: number) {
  const t = x;
  const p0 = 230;
  const p1 = 72;
  const p2 = 72;
  const p3 = 230;

  return (
    Math.pow(1 - t, 3) * p0 +
    3 * Math.pow(1 - t, 2) * t * p1 +
    3 * (1 - t) * Math.pow(t, 2) * p2 +
    Math.pow(t, 3) * p3
  );
}

export default function AttioIntegrationSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative w-full overflow-hidden bg-[#FBFBFC]">
      <div className="relative mx-auto h-[360px] max-w-[1440px] overflow-hidden sm:h-[390px] lg:h-[420px]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.38]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #EEF1F5 1px, transparent 1px), linear-gradient(to bottom, #EEF1F5 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative z-10 flex flex-col items-center px-6 pt-16 text-center sm:pt-18 lg:pt-20">
          <motion.h2
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-[18px] font-semibold leading-[1.12] tracking-[-0.035em] text-[#1F2329] sm:text-[22px] md:text-[26px]"
          >
            Instant sync. Zero setup friction.
          </motion.h2>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{
              duration: 0.5,
              delay: 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-3 max-w-[780px] text-[21px] font-semibold leading-[1.14] tracking-[-0.04em] text-[#7D8794] sm:text-[26px] md:text-[31px]"
          >
            Attio connects with Zoom, Google Meet, and Microsoft Teams.
          </motion.p>
        </div>

        <div className="absolute inset-x-0 bottom-[-54px] h-[255px]">
          <svg
            className="absolute inset-x-0 bottom-0 mx-auto h-full w-[78%] overflow-visible"
            viewBox="0 0 1000 260"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
<motion.path
  d="M0 230C260 72 740 72 1000 230"
  strokeLinecap="round"
stroke="#C9D1DD"
strokeWidth="1.5"
strokeDasharray="7 10"
              initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
              whileInView={
                reduceMotion ? undefined : { pathLength: 1, opacity: 1 }
              }
              viewport={{ once: true, amount: 0.45 }}
              transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>

          {integrations.map(({ label, Icon, x, delay }, index) => {
            const y = getArcY(x);

            return (
              <motion.div
                key={label}
                initial={
                  reduceMotion
                    ? false
                    : {
                        opacity: 0,
                        x: index === 0 ? -80 : index === 2 ? 80 : 0,
                        y: 0,
                        scale: 0.94,
                      }
                }
                whileInView={
                  reduceMotion
                    ? undefined
                    : {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        scale: 1,
                      }
                }
                viewport={{ once: true, amount: 0.45 }}
                transition={{
                  duration: 0.75,
                  delay,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute z-10 flex size-[58px] items-center justify-center rounded-full border border-[#E1E6EE] bg-white shadow-[0_16px_32px_rgba(31,35,41,0.08),0_2px_4px_rgba(31,35,41,0.07)] sm:size-[68px] lg:size-[76px]"
                style={{
                  left: `${x * 100}%`,
                  top: `${(y / 260) * 100}%`,
                  translate: "-50% -50%",
                }}
                aria-label={label}
              >
                <Icon className="size-6 sm:size-7 lg:size-8" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}