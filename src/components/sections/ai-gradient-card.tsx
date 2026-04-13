"use client";

import { GradientBorder } from "@/components/ui/gradient-border";

interface AiGradientCardProps {
  dict: {
    title: string;
    description: string;
    question: string;
    answer: string;
    label: string;
  };
}

export function AiGradientCard({ dict }: AiGradientCardProps) {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <h2
            className="text-[28px] sm:text-[32px] md:text-[36px] font-medium leading-none text-foreground"
            style={{ letterSpacing: "-0.05em", fontFamily: "var(--font-geist)" }}
          >
            {dict.title}
          </h2>
          <p className="mt-4 text-base text-muted-foreground font-medium text-balance">
            {dict.description}
          </p>
        </div>

        <div className="mx-auto max-w-2xl">
          <GradientBorder animated borderWidth={2}>
            <div className="p-6 sm:p-8">
              <div className="flex items-start gap-3 mb-6">
                <div className="size-8 shrink-0 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                  ?
                </div>
                <p className="text-sm font-medium text-foreground pt-1.5">
                  {dict.question}
                </p>
              </div>

              <div className="border-t border-border my-4" />

              <div className="flex items-start gap-3">
                <div className="size-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">AI</span>
                </div>
                <div className="pt-1">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary mb-2">
                    {dict.label}
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {dict.answer}
                  </p>
                </div>
              </div>
            </div>
          </GradientBorder>
        </div>
      </div>
    </section>
  );
}
