import { Marquee } from "@/components/ui/marquee"

interface Testimonial {
  name: string
  title: string
  quote: string
  highlight: string
}

const testimonials: Testimonial[] = [
  {
    name: "Samantha Lee",
    title: "Pazarlama Direktörü, NextGen Solutions",
    quote:
      "Edfu'yu entegre ettikten sonra kampanyalarımızı yapay zeka destekli analizlerle optimize ettik ve ",
    highlight: "Dönüşüm oranlarında %50 artış gördük!",
  },
  {
    name: "Raj Patel",
    title: "Kurucu & CEO, StartUp Grid",
    quote:
      "Tekrarlayan görevleri otomatikleştirerek ekibimizin yaratıcı işlere odaklanmasını sağladık; sonuç olarak ",
    highlight: "Geliştirme hızımız iki katına çıktı.",
  },
  {
    name: "Priya Sharma",
    title: "Ürün Geliştirme Müdürü, TechVision",
    quote:
      "Yapay zeka destekli raporlama sayesinde karar alma süreçlerimiz çok daha güvenilir hale geldi; ",
    highlight: "İçgörüler her zamankinden daha doğru ve hızlı.",
  },
  {
    name: "Carlos Gomez",
    title: "Ar-Ge Başkanı, EcoInnovate",
    quote:
      "Edfu ile sürdürülebilirlik hedeflerimizi veri odaklı bir yaklaşımla yönetiyoruz; artık ",
    highlight: "Çevre dostu iş uygulamalarında öncü",
  },
  {
    name: "Aisha Khan",
    title: "Pazarlama Müdürü, Fashion Forward",
    quote:
      "Müşteri davranışlarını gerçek zamanlı izleyerek stratejilerimizi anında güncelliyoruz; ",
    highlight: "Kampanyalarımız artık veri odaklı",
  },
  {
    name: "Nadia Ali",
    title: "Ürün Müdürü, Creative Solutions",
    quote:
      "Ekibimizin yaratıcı potansiyelini akıllı araçlarla birleştirerek özgün ürünler üretiyoruz; ",
    highlight: "Yaratıcılık ve teknolojiyi bir araya getiriyoruz.",
  },
  {
    name: "Sofia Patel",
    title: "CEO, EduTech Innovations",
    quote:
      "Öğrenme analitiği sayesinde müfredatı bireysel ihtiyaçlara göre şekillendiriyoruz; ",
    highlight: "Her öğrencinin ihtiyaçlarına göre uyarlanmış eğitim.",
  },
]

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="w-[350px] rounded-xl border border-border bg-card p-6 mx-3 flex flex-col gap-4">
      <p className="text-sm text-muted-foreground leading-relaxed">
        &ldquo;{testimonial.quote}
        <span className="text-primary font-medium">{testimonial.highlight}</span>
        &rdquo;
      </p>
      <div className="flex items-center gap-3 mt-auto">
        <div className="h-10 w-10 rounded-full bg-muted shrink-0" />
        <div>
          <p className="text-sm font-medium">{testimonial.name}</p>
          <p className="text-xs text-muted-foreground">{testimonial.title}</p>
        </div>
      </div>
    </div>
  )
}

const firstRow = testimonials.slice(0, 4)
const secondRow = testimonials.slice(4)

export function MarqueeTestimonials() {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4 text-center mb-12">
        <h2 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight">
          İş Akışınızı Yapay Zeka ile Güçlendirin
        </h2>
        <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
          Dünyanın dört bir yanındaki ekipler, Edfu'nun yapay zeka destekli
          araçlarıyla iş akışlarını dönüştürüyor, daha hızlı karar alıyor ve
          anlamlı sonuçlar elde ediyor.
        </p>
      </div>

      <div className="relative">
        <Marquee pauseOnHover className="[--duration:40s]">
          {firstRow.map((t) => (
            <TestimonialCard key={t.name} testimonial={t} />
          ))}
        </Marquee>

        <Marquee reverse pauseOnHover className="mt-4 [--duration:40s]">
          {secondRow.map((t) => (
            <TestimonialCard key={t.name} testimonial={t} />
          ))}
        </Marquee>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent" />
      </div>
    </section>
  )
}
