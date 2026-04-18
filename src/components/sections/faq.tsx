"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import type { Dictionary } from "@/dictionaries"

interface FAQProps {
  dict: Dictionary["faq"];
}

export function FAQ({ dict }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <section className="flex flex-col items-center justify-center gap-10 pb-10 w-full relative">
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

      <div className="max-w-3xl w-full mx-auto px-4 sm:px-10">
        <div className="w-full grid gap-2">
          {dict.items.map((faq, index) => {
            const isOpen = openIndex === index

            return (
              <div key={index} className="grid gap-2">
                <button
                  onClick={() => toggle(index)}
                  className={`flex flex-1 items-start justify-between gap-4 text-left text-sm font-medium transition-all w-full border bg-card border-border rounded-lg px-4 py-3.5 cursor-pointer ${
                    isOpen ? "ring ring-primary/20" : ""
                  }`}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className="grid transition-all duration-300 overflow-hidden text-sm"
                  style={{
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                  }}
                >
                  <div className="overflow-hidden">
                    <div className="p-3 border border-border text-foreground rounded-lg bg-card">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
