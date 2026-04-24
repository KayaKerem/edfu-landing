"use client"

import Image from "next/image"
import type { Dictionary } from "@/dictionaries"

interface Testimonial {
  body: string
  highlightStart: number
  highlightEnd: number
  name: string
  title: string
  avatar: string
}

const avatars = [
  ["https://randomuser.me/api/portraits/men/32.jpg", "https://randomuser.me/api/portraits/women/44.jpg"],
  ["https://randomuser.me/api/portraits/men/45.jpg", "https://randomuser.me/api/portraits/women/68.jpg"],
  ["https://randomuser.me/api/portraits/men/22.jpg", "https://randomuser.me/api/portraits/women/55.jpg"],
  ["https://randomuser.me/api/portraits/men/51.jpg", "https://randomuser.me/api/portraits/women/27.jpg"],
  ["https://randomuser.me/api/portraits/women/90.jpg"],
];

const durations = [40, 60, 30, 50, 45]

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const before = testimonial.body.slice(0, testimonial.highlightStart)
  const highlight = testimonial.body.slice(
    testimonial.highlightStart,
    testimonial.highlightEnd
  )
  const after = testimonial.body.slice(testimonial.highlightEnd)

  return (
    <div className="flex w-full cursor-pointer break-inside-avoid flex-col items-center justify-between gap-6 rounded-xl bg-white p-4 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.04),0px_8px_12px_-4px_rgba(15,12,12,0.08),0px_1px_2px_0px_rgba(15,12,12,0.10)] dark:bg-[#27272A] dark:shadow-[0px_0px_0px_1px_rgba(250,250,250,0.1),0px_0px_0px_1px_#18181B,0px_8px_12px_-4px_rgba(15,12,12,0.3),0px_1px_2px_0px_rgba(15,12,12,0.3)]">
      <p className="select-none leading-relaxed font-normal text-foreground/90">
        {before}
        <span className="p-1 py-0.5 font-medium dark:font-semibold text-primary">
          {highlight}
        </span>
        {after}
      </p>
      <div className="flex w-full select-none items-center justify-start gap-3.5">
        <Image
          src={testimonial.avatar}
          alt={testimonial.name}
          width={32}
          height={32}
          className="size-8 rounded-full"
        />
        <div>
          <p className="font-medium text-foreground/90">{testimonial.name}</p>
          <p className="text-xs font-normal text-foreground/50">
            {testimonial.title}
          </p>
        </div>
      </div>
    </div>
  )
}

interface MarqueeTestimonialsProps {
  dict: Dictionary["marqueeTestimonials"];
}

export function MarqueeTestimonials({ dict }: MarqueeTestimonialsProps) {
  return (
    <section className="flex flex-col items-center justify-center w-full">
      <div className="border-b w-full h-full px-4 py-10 md:p-14">
        <div className="max-w-xl mx-auto flex flex-col items-center justify-center gap-2">
          <h2
            className="text-[28px] sm:text-[32px] md:text-[36px] font-medium leading-none text-foreground tracking-tighter text-center text-balance"
            style={{ letterSpacing: "-0.05em" }}
          >
            {dict.title}
          </h2>
          <p className="text-muted-foreground text-center text-balance font-medium">
            {dict.description}
          </p>
        </div>
      </div>

      <div className="h-full">
        <div className="px-4 sm:px-10">
          <div className="relative max-h-[600px] sm:max-h-[750px] overflow-hidden">
            <div className="gap-0 columns-1 md:columns-2 xl:columns-3">
              {dict.columns.map((col, i) => (
                <div
                  key={i}
                  className="group flex overflow-hidden p-2 [--gap:1rem] [gap:var(--gap)] flex-col"
                  style={
                    {
                      "--duration": `${durations[i]}s`,
                    } as React.CSSProperties
                  }
                >
                  {[0, 1, 2, 3].map((copy) => (
                    <div
                      key={copy}
                      className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee-vertical flex-col"
                    >
                      {col.map((testimonial, j) => (
                        <TestimonialCard
                          key={`${i}-${j}-${copy}`}
                          testimonial={{ ...testimonial, avatar: avatars[i][j] }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="pointer-events-none absolute inset-x-0 top-0 h-1/6 md:h-1/5 w-full bg-gradient-to-b from-background from-20%" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/6 md:h-1/5 w-full bg-gradient-to-t from-background from-20%" />
          </div>
        </div>
      </div>
    </section>
  )
}
