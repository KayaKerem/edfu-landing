"use client"

interface Testimonial {
  body: string
  highlightStart: number
  highlightEnd: number
  name: string
  title: string
  avatar: string
}

const columns: Testimonial[][] = [
  // Column 1 — 40s
  [
    {
      body: "Sözleşme incelemesi için eskiden her seferinde mevzuat kitaplarını karıştırıyorduk. Edfu'ya dokümanlarımızı yükledik, artık herhangi bir maddeyi saniyeler içinde bulup karşılaştırabiliyoruz. Müvekkillerimize dönüş süremiz yarıya indi.",
      highlightStart: 124,
      highlightEnd: 190,
      name: "Mehmet Aydın",
      title: "Kurucu, Dijital Hukuk Danışmanlık",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      body: "Ekibe yeni katılan biri eskiden haftalarca sorular sorarak öğrenirdi. Şimdi şirketin tüm prosedürlerini, politikalarını Edfu'ya sorabiliyor. Oryantasyon süreci 3 haftadan 3 güne düştü.",
      highlightStart: 76,
      highlightEnd: 140,
      name: "Ayşe Korkmaz",
      title: "İK Müdürü, Orta Ölçekli Üretim Firması",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
  ],
  // Column 2 — 60s
  [
    {
      body: "300'den fazla AI modeline tek platformdan erişmek büyük avantaj. İşe göre model seçebiliyoruz — kod için Claude, müşteri metinleri için GPT. Her model için ayrı abonelik derdi bitti.",
      highlightStart: 65,
      highlightEnd: 140,
      name: "Can Yılmaz",
      title: "CTO, SaaS Girişimi",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    {
      body: "İhale şartnamelerini analiz etmek günler alıyordu. Edfu'ya yüklediğimiz tüm geçmiş ihaleleri karşılaştırmalı analiz edip riskli maddeleri otomatik tespit edebiliyoruz. Teklif hazırlama sürecimiz çok hızlandı.",
      highlightStart: 93,
      highlightEnd: 167,
      name: "Zeynep Demir",
      title: "Operasyon Müdürü, Lojistik Firması",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
  ],
  // Column 3 — 30s
  [
    {
      body: "Her departmanın kendi bilgi silosu vardı. Edfu ile tüm departmanların dokümanlarını tek bir bilgi havuzunda birleştirdik. Finans ekibi hukuk dokümanlarına, hukuk ekibi finans raporlarına anında erişebiliyor.",
      highlightStart: 51,
      highlightEnd: 121,
      name: "Burak Özkan",
      title: "Finans Direktörü, Holding Şirketi",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    },
    {
      body: "Ürün bilgilerimizi güncelleyip web sitemizi Edfu'ya bağladık. Artık müşteri destek ekibimiz her ürün sorusunu AI'a soruyor, ürün ekibini meşgul etmiyor. Doğru bilgi, doğru zamanda.",
      highlightStart: 68,
      highlightEnd: 122,
      name: "Elif Şahin",
      title: "Pazarlama Müdürü, E-Ticaret Şirketi",
      avatar: "https://randomuser.me/api/portraits/women/55.jpg",
    },
  ],
  // Column 4 — 50s
  [
    {
      body: "KVKK uyumluluk sürecimiz Edfu ile tamamen değişti. Mevzuat değişikliklerini yükleyip mevcut prosedürlerimizle karşılaştırabiliyoruz. Uyum raporlarını manuel hazırlamak yerine AI'dan özet alıyoruz.",
      highlightStart: 51,
      highlightEnd: 132,
      name: "Ahmet Kaya",
      title: "Genel Müdür, Danışmanlık Firması",
      avatar: "https://randomuser.me/api/portraits/men/51.jpg",
    },
    {
      body: "Satış ekibimiz müşteri toplantılarına hazırlanırken eskiden onlarca dosya karıştırırdı. Şimdi müşteri hakkındaki tüm geçmiş notları ve teklifleri Edfu'ya sorup 2 dakikada brifingi alıyorlar. Kapanış oranımız gözle görülür arttı.",
      highlightStart: 94,
      highlightEnd: 190,
      name: "Selin Tunç",
      title: "Satış Direktörü, Yazılım Şirketi",
      avatar: "https://randomuser.me/api/portraits/women/27.jpg",
    },
  ],
  // Column 5 — 45s
  [
    {
      body: "Küçük ekibiz ama müşteri portföyümüz büyük. Her müşterinin brief'ini, geri bildirimlerini ve marka kılavuzunu Edfu'ya yükledik. Hangi müşteri için çalışıyorsak bilgiye anında ulaşıyoruz, hiçbir detay kaybolmuyor.",
      highlightStart: 128,
      highlightEnd: 185,
      name: "İrem Başaran",
      title: "Kurucu, Dijital Ajans",
      avatar: "https://randomuser.me/api/portraits/women/90.jpg",
    },
  ],
]

const durations = [40, 60, 30, 50, 45]

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const before = testimonial.body.slice(0, testimonial.highlightStart)
  const highlight = testimonial.body.slice(
    testimonial.highlightStart,
    testimonial.highlightEnd
  )
  const after = testimonial.body.slice(testimonial.highlightEnd)

  return (
    <div className="flex w-full cursor-pointer break-inside-avoid flex-col items-center justify-between gap-6 rounded-xl bg-white p-4 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.04),0px_8px_12px_-4px_rgba(15,12,12,0.08),0px_1px_2px_0px_rgba(15,12,12,0.10)] dark:bg-[#27272A] dark:shadow-[0px_0px_0px_1px_rgba(250,250,250,0.1),0px_0px_0px_1px_#18181B,0px_8px_12px_-4px_rgba(15,12,12,0.3),0px_1px_2px_0px_rgba(15,12,12,0.3)]">
      <p className="select-none leading-relaxed font-normal text-foreground/90">
        {before}
        <span className="p-1 py-0.5 font-medium dark:font-semibold text-primary">
          {highlight}
        </span>
        {after}
      </p>
      <div className="flex w-full select-none items-center justify-start gap-3.5">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="size-8 rounded-full"
        />
        <div>
          <p className="font-medium text-foreground/90">{testimonial.name}</p>
          <p className="text-xs font-normal text-foreground/50">
            {testimonial.title}
          </p>
        </div>
      </div>
    </div>
  )
}

export function MarqueeTestimonials() {
  return (
    <section className="flex flex-col items-center justify-center w-full">
      <div className="border-b w-full h-full px-4 py-10 md:p-14">
        <div className="max-w-xl mx-auto flex flex-col items-center justify-center gap-2">
          <h2
            className="text-[28px] sm:text-[32px] md:text-[36px] font-medium leading-none text-foreground tracking-tighter text-center text-balance"
            style={{
              fontFamily: "var(--font-geist)",
              letterSpacing: "-0.05em",
            }}
          >
            Edfu Kullanan Ekiplerin Deneyimleri
          </h2>
          <p className="text-muted-foreground text-center text-balance font-medium">
            Farklı sektörlerden ekipler, Edfu ile bilgiye erişim süreçlerini nasıl dönüştürdüklerini anlatıyor.
          </p>
        </div>
      </div>

      <div className="h-full">
        <div className="px-4 sm:px-10">
          <div className="relative max-h-[600px] sm:max-h-[750px] overflow-hidden">
            <div className="gap-0 columns-1 md:columns-2 xl:columns-3">
              {columns.map((col, i) => (
                <div
                  key={i}
                  className="group flex overflow-hidden p-2 [--gap:1rem] [gap:var(--gap)] flex-col"
                  style={
                    {
                      "--duration": `${durations[i]}s`,
                    } as React.CSSProperties
                  }
                >
                  {[0, 1, 2, 3].map((copy) => (
                    <div
                      key={copy}
                      className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee-vertical flex-col"
                    >
                      {col.map((testimonial, j) => (
                        <TestimonialCard
                          key={`${i}-${j}-${copy}`}
                          testimonial={testimonial}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="pointer-events-none absolute inset-x-0 top-0 h-1/6 md:h-1/5 w-full bg-gradient-to-b from-background from-20%" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/6 md:h-1/5 w-full bg-gradient-to-t from-background from-20%" />
          </div>
        </div>
      </div>
    </section>
  )
}
