"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "AI Asistanı nedir?",
    answer:
      "AI Asistanı, yapay zeka teknolojisi kullanan ve çeşitli görevleri otomatikleştirmenize, iş akışlarınızı kolaylaştırmanıza ve daha bilinçli kararlar almanıza yardımcı olan akıllı bir yazılım aracıdır.",
  },
  {
    question: "Edfu nasıl çalışır?",
    answer:
      "Edfu, doğal dil işleme kullanarak komutlarınızı anlar ve uygular. Sorularınızı sorun, görevlerinizi tanımlayın — Edfu gerisini halleder.",
  },
  {
    question: "Verilerim ne kadar güvenli?",
    answer:
      "Veri güvenliği en büyük önceliğimizdir. Edfu, endüstri standardı şifreleme protokolleri kullanır ve SOC 2, HIPAA ve GDPR uyumluluğuna sahiptir.",
  },
  {
    question: "Mevcut araçlarımı entegre edebilir miyim?",
    answer:
      "Evet! Edfu, Slack, Notion, Google Workspace, Microsoft 365 ve daha birçok popüler araçla sorunsuz bir şekilde entegre olur.",
  },
  {
    question: "Ücretsiz deneme sürümü var mı?",
    answer:
      "Evet, Edfu'yu 30 gün boyunca ücretsiz deneyebilirsiniz. Kredi kartı gerekmez, istediğiniz zaman iptal edebilirsiniz.",
  },
  {
    question: "Edfu bana nasıl zaman kazandırır?",
    answer:
      "Edfu, tekrarlayan görevleri otomatikleştirir, verilerinizi anında analiz eder ve ekip iş birliğini kolaylaştırır. Kullanıcılarımız ortalama olarak haftada 10+ saat tasarruf ettiklerini bildirmektedir.",
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
            Edfu ve özellikleri hakkında sık sorulan soruların yanıtları. Başka
            sorularınız varsa, lütfen bizimle iletişime geçmekten çekinmeyin.
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
