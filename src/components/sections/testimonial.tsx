export function Testimonial() {
  return (
    <section className="relative z-20 bg-white dark:bg-[oklch(0.14_0.005_250)] py-16 sm:py-20 px-4 sm:px-12 lg:px-20">
      <div className="mx-auto max-w-3xl">
        <blockquote className="text-xl sm:text-2xl font-medium leading-relaxed tracking-tight" style={{ fontFamily: "var(--font-geist)" }}>
          Edfu günlük operasyonlarımızı dönüştürdü. Eskiden saatler
          süren görevler artık anlar içinde tamamlanıyor, ekibimizin
          yaratıcılığa ve stratejik büyümeye odaklanmasını sağlıyor.
        </blockquote>

        <div className="mt-8 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-muted" />
          <div>
            <p className="font-medium text-foreground">Alex Johnson</p>
            <p className="text-sm text-muted-foreground">CTO, Innovatech</p>
          </div>
        </div>
      </div>
    </section>
  );
}
