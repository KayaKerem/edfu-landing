interface Feature {
  title: string;
  description: string;
}

interface NumberedFeaturesProps {
  features: Feature[];
  className?: string;
}

export function NumberedFeatures({ features, className }: NumberedFeaturesProps) {
  return (
    <section className={className}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {features.map((feature, i) => (
            <div key={i} className="flex gap-5">
              {/* Mono numeric prefix — matches // style + tracking from Edfu app. */}
              <span
                className="font-mono text-[28px] font-medium text-ds-muted-2 shrink-0 leading-none tracking-[0.04em]"
              >
                [{String(i + 1).padStart(2, "0")}]
              </span>
              {/* Content */}
              <div>
                <h3 className="text-lg font-semibold text-foreground tracking-tight">
                  {feature.title}
                </h3>
                <p className="mt-2 text-[13px] text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
