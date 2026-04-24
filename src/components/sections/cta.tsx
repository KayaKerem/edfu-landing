import type { Dictionary } from "@/dictionaries";

interface CTAProps {
  dict: Dictionary["cta"];
}

export function CTA({ dict }: CTAProps) {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-2xl bg-primary px-6 py-14 sm:px-16 sm:py-24 text-center overflow-hidden">
          {/* Background decorative circles */}
          <div
            className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5"
            style={{ transform: "rotate(12deg)" }}
          />
          <div
            className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-white/5"
            style={{ transform: "rotate(-12deg)" }}
          />

          {/* Content */}
          <div className="relative z-10">
            <h2
              className="text-[30px] sm:text-[48px] lg:text-[60px] font-medium text-primary-foreground leading-tight"
              style={{ letterSpacing: "-0.05em" }}
            >
              {dict.line1}
              <br />
              {dict.line2}
              <br />
              {dict.line3}
            </h2>

            <div className="mt-10">
              <a
                href="#"
                className="inline-flex h-12 items-center rounded-full bg-white px-6 sm:px-8 text-sm sm:text-base font-normal tracking-wide text-primary shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_3px_3px_-1.5px_rgba(16,24,40,0.06),0_1px_1px_rgba(16,24,40,0.08)] border border-white/[0.12] transition-all ease-out hover:bg-white/90 active:scale-95"
              >
                {dict.button}
              </a>
            </div>

            <p className="mt-4 text-sm text-primary-foreground/70">
              {dict.subtext}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
