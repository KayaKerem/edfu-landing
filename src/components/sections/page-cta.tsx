import Link from "next/link";

interface PageCTAProps {
  title: string;
  description?: string;
  buttonText: string;
  buttonHref: string;
  subtext?: string;
}

export function PageCTA({
  title,
  description,
  buttonText,
  buttonHref,
  subtext,
}: PageCTAProps) {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative rounded-2xl bg-[#18181B] dark:bg-white/[0.06] dark:border dark:border-border px-6 py-14 sm:px-16 sm:py-24 text-center overflow-hidden">
          {/* Background decorative circles */}
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-white/5" />

          {/* Content */}
          <div className="relative z-10">
            <h2
              className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white dark:text-foreground tracking-tight leading-tight"
              style={{ fontFamily: "var(--font-geist)" }}
            >
              {title}
            </h2>
            {description && (
              <p className="mt-4 text-base text-white/70 dark:text-muted-foreground max-w-xl mx-auto">
                {description}
              </p>
            )}

            <div className="mt-10">
              <Link
                href={buttonHref}
                className="inline-flex h-12 items-center rounded-full bg-primary px-6 sm:px-8 text-sm sm:text-base font-normal tracking-wide text-primary-foreground shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_3px_3px_-1.5px_rgba(16,24,40,0.06),0_1px_1px_rgba(16,24,40,0.08)] border border-white/[0.12] transition-all ease-out hover:bg-primary/90 active:scale-95"
              >
                {buttonText}
              </Link>
            </div>

            {subtext && (
              <p className="mt-4 text-sm text-white/50 dark:text-muted-foreground/60">
                {subtext}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
