import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { Logos } from "@/components/sections/logos";
import { BentoFeatures } from "@/components/sections/bento-features";
import { Testimonial } from "@/components/sections/testimonial";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Security } from "@/components/sections/security";
import { Pricing } from "@/components/sections/pricing";
import { MarqueeTestimonials } from "@/components/sections/marquee-testimonials";
import { FAQ } from "@/components/sections/faq";
import { CTA } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";

const BASE_URL = "https://edfu.com.tr";

function JsonLd() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Edfu",
    url: BASE_URL,
    logo: `${BASE_URL}/logo.svg`,
    description:
      "Şirketinizin bilgi birikimini yapay zekaya dönüştüren platform.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "Turkish",
    },
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Edfu",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Şirketinizin bilgi birikimini yapay zekaya dönüştüren platform. Dokümanlarınızı yükleyin, 300+ AI modeli ile ekibiniz Türkçe sorular sorsun, anında doğru cevap alsın.",
    url: BASE_URL,
    offers: [
      {
        "@type": "Offer",
        name: "Başlangıç",
        price: "1592",
        priceCurrency: "TRY",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "1592",
          priceCurrency: "TRY",
          unitText: "kişi başı / ay",
          referenceQuantity: {
            "@type": "QuantitativeValue",
            value: "1",
            unitCode: "MON",
          },
        },
        description: "5 kullanıcıya kadar, kişi başı aylık 10M token, Claude Sonnet sabit model, 50 GB depolama",
      },
      {
        "@type": "Offer",
        name: "Kurumsal",
        price: "0",
        priceCurrency: "TRY",
        description: "Sınırsız kullanıcı, dedicated altyapı, white-label seçeneği, SLA garantisi",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "50",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Edfu tam olarak ne işe yarar?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Edfu, şirketinizin dokümanlarını, web sitesini ve bilgi kaynaklarını yapay zeka destekli bir bilgi tabanına dönüştüren bir platformdur. Ekibiniz Türkçe sorular sorarak bu bilgi tabanından anında cevap alır. Sözleşme analizi, mevzuat kontrolü, ürün bilgisi sorgulama gibi her türlü iş sürecinde kullanılabilir.",
        },
      },
      {
        "@type": "Question",
        name: "Edfu'yu kullanmaya başlamak için teknik bilgi gerekiyor mu?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Hayır. Dokümanlarınızı sürükle-bırak ile yükleyin, web sitenizi URL vererek bağlayın — gerisini Edfu halleder. Dokümanlar otomatik olarak işlenir, indekslenir ve sorguya hazır hale gelir. Kurulum dakikalar sürer, herhangi bir yazılım yüklemenize gerek yoktur.",
        },
      },
      {
        "@type": "Question",
        name: "Verilerime kim erişebilir?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yalnızca siz. Her organizasyonun verileri birbirinden tamamen izole edilmiştir. Verileriniz üçüncü taraflarla paylaşılmaz ve KVKK uyumlu altyapı ile Avrupa veri merkezlerinde barındırılır.",
        },
      },
      {
        "@type": "Question",
        name: "Hangi araçlarla entegre çalışıyor?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Edfu; Google Drive, Notion, Dropbox ve Slack ile entegre çalışır. Ayrıca Website Crawler özelliği ile herhangi bir web sitesini otomatik olarak tarayıp bilgi tabanınıza ekleyebilirsiniz. Entegrasyon sayısı planınıza göre değişir.",
        },
      },
      {
        "@type": "Question",
        name: "Ücretsiz deneme süreci nasıl işliyor?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Tüm planları 14 gün boyunca ücretsiz deneyebilirsiniz. Deneme süresince tüm özellikler aktiftir. Süre sonunda memnun kalmazsanız herhangi bir ücret tahsil edilmez.",
        },
      },
      {
        "@type": "Question",
        name: "300+ AI modeli ne demek, hangisini seçmeliyim?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Edfu, OpenRouter entegrasyonu sayesinde Claude, GPT-4, Gemini, Llama ve yüzlerce farklı AI modeline tek platformdan erişim sunar. Her model farklı görevlerde öne çıkar. Başlangıç planında Claude Sonnet sabit model olarak sunulur, Profesyonel planda tüm modellere erişim açılır.",
        },
      },
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Edfu",
    url: BASE_URL,
    description:
      "Şirketinizin bilgi birikimini yapay zekaya dönüştüren platform.",
    inLanguage: "tr",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
    </>
  );
}

export default function Home() {
  return (
    <>
      <JsonLd />
      <Navbar />
      {/* Side borders */}
      <div className="relative mx-auto max-w-7xl border-x border-border">
        <div className="pointer-events-none absolute inset-y-0 left-4 md:left-6 z-10 w-px bg-border" />
        <div className="pointer-events-none absolute inset-y-0 right-4 md:right-6 z-10 w-px bg-border" />

        <main className="divide-y divide-border">
          <Hero />
          <Logos />
          <BentoFeatures />
          <Testimonial />
          <HowItWorks />
          <Security />
          <Pricing />
          <MarqueeTestimonials />
          <FAQ />
          <CTA />
        </main>
        <Footer />
      </div>
    </>
  );
}
