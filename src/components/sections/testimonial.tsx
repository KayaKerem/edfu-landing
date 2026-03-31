import Image from "next/image";

export function Testimonial() {
  return (
    <section className="relative z-20 bg-white dark:bg-[oklch(0.14_0.005_250)] py-16 sm:py-20 px-4 sm:px-12 lg:px-20">
      <div className="mx-auto max-w-3xl">
        <blockquote className="text-xl sm:text-2xl font-medium leading-relaxed tracking-tight" style={{ fontFamily: "var(--font-geist)" }}>
          Ekibe yeni katılan biri eskiden haftalarca adaptasyon sürecinden geçerdi. Edfu&apos;dan sonra ilk gününde şirketin tüm bilgi birikimine erişip sorularını sorabiliyor. Bilgi kaybı ve tekrar eden açıklamalar tarihe karıştı.
        </blockquote>

        <div className="mt-8 flex items-center gap-4">
          <Image
            src="https://randomuser.me/api/portraits/men/52.jpg"
            alt="Mehmet K."
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover"
          />
          <div>
            <p className="font-medium text-foreground">Mehmet K.</p>
            <p className="text-sm text-muted-foreground">Kurucu Ortak, Teknoloji Şirketi</p>
          </div>
        </div>
      </div>
    </section>
  );
}
