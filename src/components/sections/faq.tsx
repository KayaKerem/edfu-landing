"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "Edfu tam olarak ne işe yarar?",
    answer:
      "Edfu, şirketinizin dokümanlarını, web sitesini ve bilgi kaynaklarını yapay zeka destekli bir bilgi tabanına dönüştüren bir platformdur. Ekibiniz Türkçe sorular sorarak bu bilgi tabanından anında cevap alır. Sözleşme analizi, mevzuat kontrolü, ürün bilgisi sorgulama gibi her türlü iş sürecinde kullanılabilir.",
  },
  {
    question: "Edfu'yu kullanmaya başlamak için teknik bilgi gerekiyor mu?",
    answer:
      "Hayır. Dokümanlarınızı sürükle-bırak ile yükleyin, web sitenizi URL vererek bağlayın — gerisini Edfu halleder. Dokümanlar otomatik olarak işlenir, indekslenir ve sorguya hazır hale gelir. Kurulum dakikalar sürer, herhangi bir yazılım yüklemenize gerek yoktur.",
  },
  {
    question: "Verilerim nerede barındırılıyor ve ne kadar güvenli?",
    answer:
      "Tüm verileriniz Hetzner'in Avrupa (Almanya) veri merkezlerinde barındırılır. Her organizasyonun verileri birbirinden tamamen izole edilmiştir. S3 uyumlu nesne depolama ile dosyalarınız şifreli olarak saklanır. KVKK uyumlu altyapı ile verileriniz Türkiye dışına çıkmaz.",
  },
  {
    question: "Hangi araçlarla entegre çalışıyor?",
    answer:
      "Edfu; Google Drive, Notion, Dropbox ve Slack ile entegre çalışır. Ayrıca Website Crawler özelliği ile herhangi bir web sitesini otomatik olarak tarayıp bilgi tabanınıza ekleyebilirsiniz. Entegrasyon sayısı planınıza göre değişir.",
  },
  {
    question: "Ücretsiz deneme süreci nasıl işliyor?",
    answer:
      "Tüm planları 14 gün boyunca ücretsiz deneyebilirsiniz. Deneme süresince tüm özellikler aktiftir. Süre sonunda memnun kalmazsanız herhangi bir ücret tahsil edilmez.",
  },
  {
    question: "300+ AI modeli ne demek, hangisini seçmeliyim?",
    answer:
      "Edfu, OpenRouter entegrasyonu sayesinde Claude, GPT-4, Gemini, Llama ve yüzlerce farklı AI modeline tek platformdan erişim sunar. Her model farklı görevlerde öne çıkar. Başlangıç planında Claude Sonnet sabit model olarak sunulur, Profesyonel planda tüm modellere erişim açılır.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <section className="flex flex-col items-center justify-center gap-10 pb-10 w-full relative">
      <div className="border-b w-full h-full px-4 py-10 md:p-14">
        <div className="max-w-xl mx-auto flex flex-col items-center justify-center gap-2">
          <h2
            className="text-[28px] sm:text-[32px] md:text-[36px] font-medium leading-none text-foreground tracking-tighter text-center text-balance"
            style={{ fontFamily: "var(--font-geist)", letterSpacing: "-0.05em" }}
          >
            Sıkça Sorulan Sorular
          </h2>
          <p className="text-muted-foreground text-center text-balance font-medium">
            Edfu hakkında merak edilenleri bir araya getirdik. Burada bulamadığınız bir soru varsa bize ulaşın.
          </p>
        </div>
      </div>

      <div className="max-w-3xl w-full mx-auto px-4 sm:px-10">
        <div className="w-full grid gap-2">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index

            return (
              <div key={index} className="grid gap-2">
                <button
                  onClick={() => toggle(index)}
                  className={`flex flex-1 items-start justify-between gap-4 text-left text-sm font-medium transition-all w-full border bg-white dark:bg-[#27272A] border-border rounded-lg px-4 py-3.5 cursor-pointer ${
                    isOpen ? "ring ring-primary/20" : ""
                  }`}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className="grid transition-all duration-200 overflow-hidden text-sm"
                  style={{
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                  }}
                >
                  <div className="overflow-hidden">
                    <div className="p-3 border border-border text-foreground rounded-lg bg-white dark:bg-[#27272A]">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
