export function CTA() {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-2xl bg-primary px-8 py-16 sm:px-16 sm:py-24 text-center overflow-hidden">
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
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground tracking-tight leading-tight">
              Otomatikleştir.
              <br />
              Sadeleştir.
              <br />
              Başarı Yakala.
            </h2>

            <div className="mt-10">
              <a
                href="#"
                className="inline-flex h-12 items-center rounded-full bg-white px-8 text-base font-medium text-primary hover:scale-105 active:scale-95 transition-transform"
              >
                30 Günlük Ücretsiz Denemenizi Başlatın
              </a>
            </div>

            <p className="mt-4 text-sm text-primary-foreground/70">
              İstediğiniz zaman iptal edin, soru sorulmaz
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
