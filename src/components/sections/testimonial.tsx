export function Testimonial() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-xl border border-border bg-card p-8 sm:p-12 lg:p-16">
          <blockquote className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold leading-relaxed tracking-tight">
            &ldquo;Edfu günlük operasyonlarımızı dönüştürdü. Eskiden saatler
            süren görevler artık anlar içinde tamamlanıyor, ekibimizin
            yaratıcılığa ve stratejik büyümeye odaklanmasını sağlıyor.&rdquo;
          </blockquote>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-muted" />
            <div>
              <p className="font-medium text-foreground">Alex Johnson</p>
              <p className="text-sm text-muted-foreground">CTO, Innovatech</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
