import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    value: "item-1",
    question: "AI Asistanı nedir?",
    answer:
      "AI Asistanı, yapay zeka teknolojisi kullanan ve çeşitli görevleri otomatikleştirmenize, iş akışlarınızı kolaylaştırmanıza ve daha bilinçli kararlar almanıza yardımcı olan akıllı bir yazılım aracıdır.",
  },
  {
    value: "item-2",
    question: "Edfu nasıl çalışır?",
    answer:
      "Edfu, doğal dil işleme kullanarak komutlarınızı anlar ve uygular. Sorularınızı sorun, görevlerinizi tanımlayın — Edfu gerisini halleder.",
  },
  {
    value: "item-3",
    question: "Verilerim ne kadar güvenli?",
    answer:
      "Veri güvenliği en büyük önceliğimizdir. Edfu, endüstri standardı şifreleme protokolleri kullanır ve SOC 2, HIPAA ve GDPR uyumluluğuna sahiptir.",
  },
  {
    value: "item-4",
    question: "Mevcut araçlarımı entegre edebilir miyim?",
    answer:
      "Evet! Edfu, Slack, Notion, Google Workspace, Microsoft 365 ve daha birçok popüler araçla sorunsuz bir şekilde entegre olur.",
  },
  {
    value: "item-5",
    question: "Ücretsiz deneme sürümü var mı?",
    answer:
      "Evet, Edfu'yu 30 gün boyunca ücretsiz deneyebilirsiniz. Kredi kartı gerekmez, istediğiniz zaman iptal edebilirsiniz.",
  },
  {
    value: "item-6",
    question: "Edfu bana nasıl zaman kazandırır?",
    answer:
      "Edfu, tekrarlayan görevleri otomatikleştirir, verilerinizi anında analiz eder ve ekip iş birliğini kolaylaştırır. Kullanıcılarımız ortalama olarak haftada 10+ saat tasarruf ettiklerini bildirmektedir.",
  },
]

export function FAQ() {
  return (
    <section className="py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl sm:text-5xl font-bold">
            Sıkça Sorulan Sorular
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Edfu ve özellikleri hakkında sık sorulan soruların yanıtları.
            Başka sorularınız varsa, lütfen bizimle iletişime geçmekten
            çekinmeyin.
          </p>
        </div>

        <Accordion>
          {faqs.map((faq) => (
            <AccordionItem key={faq.value} value={faq.value}>
              <AccordionTrigger className="text-left font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
