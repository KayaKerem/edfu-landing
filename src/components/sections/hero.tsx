export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 pt-28 pb-16 text-center">
        {/* Badge */}
        <div className="mb-8 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-sm font-medium text-foreground shadow-sm">
            <span>👋</span>
            Özel otomasyonları keşfedin
          </span>
        </div>

        {/* Heading */}
        <h1 className="font-heading text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
          AI Asistanınızla Tanışın
          <br />
          İş Akışınızı Kolaylaştırın
        </h1>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Dijital iş akışlarınızı kolaylaştırmak ve sıradan görevleri halletmek
          için tasarlanan yapay zeka asistanı, böylece gerçekten önemli olana
          odaklanabilirsiniz
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <a
            href="#pricing"
            className="inline-flex h-10 w-32 items-center justify-center rounded-full border border-white/[0.12] bg-primary text-sm font-normal tracking-wide text-primary-foreground shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_3px_3px_-1.5px_rgba(16,24,40,0.06),0_1px_1px_rgba(16,24,40,0.08)] transition-all hover:bg-primary/90 active:scale-95"
          >
            Ücretsiz Dene
          </a>
          <a
            href="#"
            className="inline-flex h-10 w-32 items-center justify-center rounded-full border border-border bg-background text-sm font-normal tracking-wide text-foreground transition-all hover:bg-accent active:scale-95"
          >
            Giriş Yap
          </a>
        </div>

        {/* Browser Mockup */}
        <div className="relative mt-16">
          {/* Gradient blur background */}
          <div className="pointer-events-none absolute inset-0 -top-10">
            <div className="absolute inset-x-0 top-0 h-full rounded-full bg-gradient-to-b from-primary/10 via-primary/5 to-transparent blur-3xl" />
          </div>

          {/* Browser frame */}
          <div className="relative rounded-xl border border-border bg-card shadow-2xl">
            {/* Top bar */}
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <div className="flex gap-1.5">
                <span className="block size-3 rounded-full bg-red-400" />
                <span className="block size-3 rounded-full bg-yellow-400" />
                <span className="block size-3 rounded-full bg-green-400" />
              </div>
              <div className="mx-auto flex h-6 w-full max-w-sm items-center justify-center rounded-md bg-muted px-3 text-xs text-muted-foreground">
                edfu.ai
              </div>
              <div className="w-[52px]" />
            </div>

            {/* Content area */}
            <div className="h-[300px] rounded-b-xl bg-gradient-to-br from-primary/10 via-primary/5 to-background sm:h-[400px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
