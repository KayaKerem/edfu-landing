# i18n / Localization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add English language support to the Edfu landing page with automatic locale detection, prefix-less Turkish default, and `/en` English route.

**Architecture:** Next.js 16 `[lang]` dynamic segment with `proxy.ts` for locale detection/routing. Dictionary JSON files hold all translatable strings. Server components load dictionaries and pass them as props to client components.

**Tech Stack:** Next.js 16 App Router, `proxy.ts` (replaces middleware), JSON dictionaries, `server-only` package, TypeScript.

**Spec:** `docs/superpowers/specs/2026-04-05-i18n-localization-design.md`

---

### Task 1: Create dictionary files and loader

**Files:**
- Create: `src/dictionaries/tr.json`
- Create: `src/dictionaries/en.json`
- Create: `src/dictionaries/index.ts`

- [ ] **Step 1: Install `server-only` package**

Run: `npm install server-only`

- [ ] **Step 2: Create `src/dictionaries/tr.json`**

This file contains ALL translatable Turkish strings extracted from the existing components. Create the file with the full content below:

```json
{
  "metadata": {
    "title": "Edfu - Şirketinizin AI Bilgi Tabanı | Dokümanlardan Anında Cevap",
    "description": "Şirketinizin bilgi birikimini yapay zekaya dönüştürün. Dokümanlarınızı yükleyin, 300+ AI modeli ile ekibiniz Türkçe sorular sorsun, anında doğru cevap alsın. 14 gün ücretsiz deneyin.",
    "keywords": [
      "yapay zeka bilgi tabanı",
      "AI bilgi yönetimi",
      "kurumsal yapay zeka",
      "doküman analizi",
      "RAG platformu",
      "Türkçe AI asistan",
      "şirket bilgi tabanı",
      "AI destekli arama",
      "kurumsal chatbot",
      "doküman sorgulama",
      "KVKK uyumlu AI",
      "OpenRouter",
      "Claude",
      "GPT-4",
      "Edfu"
    ],
    "ogTitle": "Edfu - Şirketinizin AI Bilgi Tabanı",
    "ogDescription": "Dokümanlarınızı yükleyin, 300+ AI modeli ile ekibiniz Türkçe sorular sorsun, anında doğru cevap alsın. KVKK uyumlu, kurumsal düzeyde altyapı.",
    "twitterTitle": "Edfu - Şirketinizin AI Bilgi Tabanı",
    "twitterDescription": "Dokümanlarınızı yükleyin, 300+ AI modeli ile ekibiniz Türkçe sorular sorsun, anında doğru cevap alsın."
  },
  "navbar": {
    "home": "Ana Sayfa",
    "features": "Özellikler",
    "howItWorks": "Nasıl Çalışır",
    "pricing": "Fiyatlandırma",
    "cta": "Ücretsiz Deneyin",
    "menuOpen": "Menüyü aç",
    "menuClose": "Menüyü kapat"
  },
  "hero": {
    "badge": "300+ AI modeli, tek platform",
    "titleLine1Before": "Her Sorunun ",
    "titleLine1Highlight": "Cevabı",
    "titleLine2Highlight": "Sizde",
    "titleLine2After": " Zaten Var.",
    "description": "Dokümanlarınızı yükleyin, kaynaklarınızı bağlayın, ekibiniz sorusunu sorsun.\nEdfu şirketinizin tüm bilgi birikiminden doğru cevabı anında bulsun.",
    "ctaPrimary": "Ücretsiz Deneyin",
    "ctaSecondary": "Giriş Yap"
  },
  "logos": {
    "subtitle": "300'den fazla yapay zeka modeline tek platformdan erişin",
    "learnMore": "Daha Fazla"
  },
  "features": {
    "title": "Şirketinizin Dijital Hafızasını Oluşturun",
    "description": "Edfu, şirketinizdeki tüm bilgiyi tek bir platformda toplar. Ekibiniz ihtiyaç duyduğu bilgiye saniyeler içinde ulaşır.",
    "items": [
      {
        "title": "Dokümanlarınızla Konuşun",
        "description": "Sözleşmelerinizi, yönetmeliklerinizi, toplantı notlarınızı yükleyin. Edfu içeriklerini analiz eder, sorularınıza dokümanlarınıza dayalı cevaplar verir."
      },
      {
        "title": "Kaynaklarınızı Bağlayın",
        "description": "Drive, Notion, Slack, CRM, ERP ve daha fazlası. Mevcut araçlarınızı Edfu'ya bağlayın, tüm kaynaklarınız otomatik senkronize olsun."
      },
      {
        "title": "Dokümanlarınızı Yükleyin, Anında Hazır",
        "description": "PDF, Word, Excel — dokümanlarınızı sürükleyip bırakın. Edfu içerikleri otomatik parçalar, indeksler ve sorguya hazır hale getirir."
      },
      {
        "title": "Siz Konuşun, AI Yazsın",
        "description": "Toplantı notları, müşteri görüşmeleri, finansal kararlar — AI dinler, yazar, etiketler. Ekibiniz arar, anında bulur."
      }
    ],
    "chatResponse": "2023 Mart'taki Bursa projesinde NNF ile çalışıldı. Toplantı notlarına göre teslim süresi ve çıktı kalitesinden memnun kalındı, sonraki projede tekrar değerlendirileceği belirtilmiş.",
    "indexing": "İndeksleniyor...",
    "indexed": "İndekslendi",
    "fileProcessed": "İşlendi",
    "fileProcessing": "İşleniyor",
    "saved": "Kaydedildi",
    "noteTitle": "Q3 Satış Toplantısı",
    "noteTags": ["satış", "toplantı", "Q3"]
  },
  "testimonial": {
    "quote": "Ekibe yeni katılan biri eskiden haftalarca adaptasyon sürecinden geçerdi. Edfu'dan sonra ilk gününde şirketin tüm bilgi birikimine erişip sorularını sorabiliyor. Bilgi kaybı ve tekrar eden açıklamalar tarihe karıştı.",
    "authorName": "Mehmet K.",
    "authorTitle": "Kurucu Ortak, Teknoloji Şirketi",
    "authorAlt": "Mehmet K. profil fotoğrafı - Kurucu Ortak, Teknoloji Şirketi"
  },
  "howItWorks": {
    "title": "Üç Adımda Başlayın",
    "description": "Teknik bilgi gerekmez. Dokümanlarınızı yükleyin, dakikalar içinde şirketinizin AI destekli bilgi tabanı hazır.",
    "steps": [
      {
        "title": "Dokümanlarınızı Yükleyin",
        "description": "PDF, Word, Excel — mevcut dokümanlarınızı sürükleyip bırakın. Edfu içerikleri otomatik olarak parçalar, indeksler ve sorguya hazır hale getirir.",
        "emoji": "💬"
      },
      {
        "title": "Kaynaklarınızı Bağlayın",
        "description": "Web sitenizi, Google Drive'ınızı, Notion'ınızı bağlayın. Edfu içeriklerinizi otomatik senkronize eder ve bilgi tabanınızı güncel tutar.",
        "emoji": "⚙️"
      },
      {
        "title": "Sorun, Cevap Alın",
        "description": "Ekibiniz Türkçe sorular sorsun, Edfu bilgi tabanınızdan kaynaklı, doğru ve güvenilir cevapları anında versin.",
        "emoji": "📊"
      },
      {
        "title": "Ekip Olarak Büyüyün",
        "description": "Her yeni doküman, her yeni sohbet şirketinizin bilgi birikimini zenginleştirir. Edfu kullandıkça daha akıllı hale gelir — ekibinizin ortak hafızası sürekli büyür.",
        "emoji": "🚀"
      }
    ]
  },
  "security": {
    "title": "Kurumsal Düzeyde Altyapı",
    "description": "Yüksek performans, kesintisiz erişim ve tam veri kontrolü için optimize edilmiş altyapı.",
    "cards": [
      {
        "title": "Tam Gizlilik ve Kontrol",
        "description": "Verileriniz yalnızca size ait. Hiçbir üçüncü tarafla paylaşılmaz, tamamen sizin kontrolünüzde."
      },
      {
        "title": "Bugün 2 Kişi, Yarın 50",
        "description": "Ekibiniz büyüdükçe şirket hafızası da büyür. Yeni gelen ilk günden her şeye erişir, eski bilgi kaybolmaz."
      }
    ]
  },
  "pricing": {
    "title": "İhtiyacınıza Uygun Plan Seçin",
    "description": "Tüm planlar 14 gün ücretsiz deneme ile başlar. Aylık veya yıllık ödeme seçeneği ile bütçenize uygun başlayın.",
    "monthly": "Aylık",
    "yearly": "Yıllık",
    "discount": "%20 İndirim",
    "perMonth": "/ay",
    "comingSoon": "Yakında",
    "contactUs": "İletişime Geçin",
    "mostPopular": "En Popüler",
    "plans": [
      {
        "name": "Başlangıç",
        "description": "kişi başı, KDV hariç",
        "cta": "14 Gün Ücretsiz Deneyin",
        "inheritLabel": "Pro planın tüm özellikleri +",
        "features": [
          "5 kullanıcıya kadar",
          "Kişi başı aylık 10M token",
          "Claude Sonnet sabit model",
          "50 GB depolama",
          "5 entegrasyon",
          "Ayda 200 URL crawl",
          "10.000 sayfa RAG limiti",
          "E-posta desteği"
        ]
      },
      {
        "name": "Profesyonel",
        "description": "kişi başı, KDV hariç",
        "cta": "Beni Bilgilendir",
        "inheritLabel": "Başlangıç planının tüm özellikleri +",
        "features": [
          "300+ AI model erişimi (OpenRouter)",
          "Kişi başı aylık 25M token",
          "200 GB depolama",
          "20 entegrasyon",
          "Ayda 1.000 URL crawl",
          "50.000 sayfa RAG limiti",
          "Özel şablonlar",
          "Öncelikli destek"
        ]
      },
      {
        "name": "Kurumsal",
        "description": "Özel ihtiyaçlarınıza göre fiyatlandırma",
        "cta": "Satış Ekibiyle Görüşün",
        "inheritLabel": "Profesyonel planın tüm özellikleri +",
        "features": [
          "Sınırsız kullanıcı",
          "Dedicated altyapı",
          "White-label seçeneği",
          "SLA garantisi",
          "Özel entegrasyon geliştirme",
          "Birebir onboarding"
        ]
      }
    ]
  },
  "marqueeTestimonials": {
    "title": "Edfu Kullanan Ekiplerin Deneyimleri",
    "description": "Farklı sektörlerden ekipler, Edfu ile bilgiye erişim süreçlerini nasıl dönüştürdüklerini anlatıyor.",
    "columns": [
      [
        {
          "body": "Sözleşme incelemesi için eskiden her seferinde mevzuat kitaplarını karıştırıyorduk. Edfu'ya dokümanlarımızı yükledik, artık herhangi bir maddeyi saniyeler içinde bulup karşılaştırabiliyoruz. Müvekkillerimize dönüş süremiz yarıya indi.",
          "highlightStart": 124,
          "highlightEnd": 190,
          "name": "Mehmet Aydın",
          "title": "Kurucu, Dijital Hukuk Danışmanlık"
        },
        {
          "body": "Ekibe yeni katılan biri eskiden haftalarca sorular sorarak öğrenirdi. Şimdi şirketin tüm prosedürlerini, politikalarını Edfu'ya sorabiliyor. Oryantasyon süreci 3 haftadan 3 güne düştü.",
          "highlightStart": 76,
          "highlightEnd": 140,
          "name": "Ayşe Korkmaz",
          "title": "İK Müdürü, Orta Ölçekli Üretim Firması"
        }
      ],
      [
        {
          "body": "300'den fazla AI modeline tek platformdan erişmek büyük avantaj. İşe göre model seçebiliyoruz — kod için Claude, müşteri metinleri için GPT. Her model için ayrı abonelik derdi bitti.",
          "highlightStart": 65,
          "highlightEnd": 140,
          "name": "Can Yılmaz",
          "title": "CTO, SaaS Girişimi"
        },
        {
          "body": "İhale şartnamelerini analiz etmek günler alıyordu. Edfu'ya yüklediğimiz tüm geçmiş ihaleleri karşılaştırmalı analiz edip riskli maddeleri otomatik tespit edebiliyoruz. Teklif hazırlama sürecimiz çok hızlandı.",
          "highlightStart": 93,
          "highlightEnd": 167,
          "name": "Zeynep Demir",
          "title": "Operasyon Müdürü, Lojistik Firması"
        }
      ],
      [
        {
          "body": "Her departmanın kendi bilgi silosu vardı. Edfu ile tüm departmanların dokümanlarını tek bir bilgi havuzunda birleştirdik. Finans ekibi hukuk dokümanlarına, hukuk ekibi finans raporlarına anında erişebiliyor.",
          "highlightStart": 51,
          "highlightEnd": 121,
          "name": "Burak Özkan",
          "title": "Finans Direktörü, Holding Şirketi"
        },
        {
          "body": "Ürün bilgilerimizi güncelleyip web sitemizi Edfu'ya bağladık. Artık müşteri destek ekibimiz her ürün sorusunu AI'a soruyor, ürün ekibini meşgul etmiyor. Doğru bilgi, doğru zamanda.",
          "highlightStart": 68,
          "highlightEnd": 122,
          "name": "Elif Şahin",
          "title": "Pazarlama Müdürü, E-Ticaret Şirketi"
        }
      ],
      [
        {
          "body": "KVKK uyumluluk sürecimiz Edfu ile tamamen değişti. Mevzuat değişikliklerini yükleyip mevcut prosedürlerimizle karşılaştırabiliyoruz. Uyum raporlarını manuel hazırlamak yerine AI'dan özet alıyoruz.",
          "highlightStart": 51,
          "highlightEnd": 132,
          "name": "Ahmet Kaya",
          "title": "Genel Müdür, Danışmanlık Firması"
        },
        {
          "body": "Satış ekibimiz müşteri toplantılarına hazırlanırken eskiden onlarca dosya karıştırırdı. Şimdi müşteri hakkındaki tüm geçmiş notları ve teklifleri Edfu'ya sorup 2 dakikada brifingi alıyorlar. Kapanış oranımız gözle görülür arttı.",
          "highlightStart": 94,
          "highlightEnd": 190,
          "name": "Selin Tunç",
          "title": "Satış Direktörü, Yazılım Şirketi"
        }
      ],
      [
        {
          "body": "Küçük ekibiz ama müşteri portföyümüz büyük. Her müşterinin brief'ini, geri bildirimlerini ve marka kılavuzunu Edfu'ya yükledik. Hangi müşteri için çalışıyorsak bilgiye anında ulaşıyoruz, hiçbir detay kaybolmuyor.",
          "highlightStart": 128,
          "highlightEnd": 185,
          "name": "İrem Başaran",
          "title": "Kurucu, Dijital Ajans"
        }
      ]
    ]
  },
  "faq": {
    "title": "Sıkça Sorulan Sorular",
    "description": "Edfu hakkında merak edilenleri bir araya getirdik. Burada bulamadığınız bir soru varsa bize ulaşın.",
    "items": [
      {
        "question": "Edfu tam olarak ne işe yarar?",
        "answer": "Edfu, şirketinizin dokümanlarını, web sitesini ve bilgi kaynaklarını yapay zeka destekli bir bilgi tabanına dönüştüren bir platformdur. Ekibiniz Türkçe sorular sorarak bu bilgi tabanından anında cevap alır. Sözleşme analizi, mevzuat kontrolü, ürün bilgisi sorgulama gibi her türlü iş sürecinde kullanılabilir."
      },
      {
        "question": "Edfu'yu kullanmaya başlamak için teknik bilgi gerekiyor mu?",
        "answer": "Hayır. Dokümanlarınızı sürükle-bırak ile yükleyin, web sitenizi URL vererek bağlayın — gerisini Edfu halleder. Dokümanlar otomatik olarak işlenir, indekslenir ve sorguya hazır hale gelir. Kurulum dakikalar sürer, herhangi bir yazılım yüklemenize gerek yoktur."
      },
      {
        "question": "Verilerime kim erişebilir?",
        "answer": "Yalnızca siz. Her organizasyonun verileri birbirinden tamamen izole edilmiştir. Verileriniz üçüncü taraflarla paylaşılmaz ve KVKK uyumlu altyapı ile Avrupa veri merkezlerinde barındırılır."
      },
      {
        "question": "Hangi araçlarla entegre çalışıyor?",
        "answer": "Edfu; Google Drive, Notion, Dropbox ve Slack ile entegre çalışır. Ayrıca Website Crawler özelliği ile herhangi bir web sitesini otomatik olarak tarayıp bilgi tabanınıza ekleyebilirsiniz. Entegrasyon sayısı planınıza göre değişir."
      },
      {
        "question": "Ücretsiz deneme süreci nasıl işliyor?",
        "answer": "Tüm planları 14 gün boyunca ücretsiz deneyebilirsiniz. Deneme süresince tüm özellikler aktiftir. Süre sonunda memnun kalmazsanız herhangi bir ücret tahsil edilmez."
      },
      {
        "question": "300+ AI modeli ne demek, hangisini seçmeliyim?",
        "answer": "Edfu, OpenRouter entegrasyonu sayesinde Claude, GPT-4, Gemini, Llama ve yüzlerce farklı AI modeline tek platformdan erişim sunar. Her model farklı görevlerde öne çıkar. Başlangıç planında Claude Sonnet sabit model olarak sunulur, Profesyonel planda tüm modellere erişim açılır."
      }
    ]
  },
  "cta": {
    "line1": "Yükleyin.",
    "line2": "Sorun.",
    "line3": "Cevap Alın.",
    "button": "14 Gün Ücretsiz Deneyin",
    "subtext": "İstediğiniz zaman iptal edin, taahhüt yok."
  },
  "footer": {
    "description": "Şirketinizin bilgi birikimini yapay zekaya dönüştüren platform. Dokümanlarınızı yükleyin, ekibiniz sorusunu sorsun.",
    "columns": [
      {
        "heading": "Şirket",
        "links": ["Hakkımızda", "İletişim", "Blog", "Kariyer"]
      },
      {
        "heading": "Ürün",
        "links": ["Özellikler", "Fiyatlandırma", "Entegrasyonlar", "API Dokümantasyonu"]
      },
      {
        "heading": "Kaynaklar",
        "links": ["Yardım Merkezi", "Kullanım Kılavuzu", "Durum Sayfası", "Gizlilik Politikası"]
      }
    ]
  },
  "jsonLd": {
    "orgDescription": "Şirketinizin bilgi birikimini yapay zekaya dönüştüren platform.",
    "contactLanguage": "Turkish",
    "softwareDescription": "Şirketinizin bilgi birikimini yapay zekaya dönüştüren platform. Dokümanlarınızı yükleyin, 300+ AI modeli ile ekibiniz Türkçe sorular sorsun, anında doğru cevap alsın.",
    "planStarterName": "Başlangıç",
    "planStarterDesc": "5 kullanıcıya kadar, kişi başı aylık 10M token, Claude Sonnet sabit model, 50 GB depolama",
    "planStarterUnit": "kişi başı / ay",
    "planEnterpriseName": "Kurumsal",
    "planEnterpriseDesc": "Sınırsız kullanıcı, dedicated altyapı, white-label seçeneği, SLA garantisi",
    "websiteDescription": "Şirketinizin bilgi birikimini yapay zekaya dönüştüren platform."
  }
}
```

- [ ] **Step 3: Create `src/dictionaries/en.json`**

Same structure, English translations:

```json
{
  "metadata": {
    "title": "Edfu - Your Company's AI Knowledge Base | Instant Answers from Documents",
    "description": "Transform your company's knowledge into AI. Upload your documents, let your team ask questions with 300+ AI models, get instant accurate answers. Try free for 14 days.",
    "keywords": [
      "AI knowledge base",
      "AI knowledge management",
      "enterprise AI",
      "document analysis",
      "RAG platform",
      "AI assistant",
      "company knowledge base",
      "AI-powered search",
      "enterprise chatbot",
      "document querying",
      "GDPR compliant AI",
      "OpenRouter",
      "Claude",
      "GPT-4",
      "Edfu"
    ],
    "ogTitle": "Edfu - Your Company's AI Knowledge Base",
    "ogDescription": "Upload your documents, let your team ask questions with 300+ AI models, get instant accurate answers. Enterprise-grade, GDPR compliant infrastructure.",
    "twitterTitle": "Edfu - Your Company's AI Knowledge Base",
    "twitterDescription": "Upload your documents, let your team ask questions with 300+ AI models, get instant accurate answers."
  },
  "navbar": {
    "home": "Home",
    "features": "Features",
    "howItWorks": "How It Works",
    "pricing": "Pricing",
    "cta": "Try Free",
    "menuOpen": "Open menu",
    "menuClose": "Close menu"
  },
  "hero": {
    "badge": "300+ AI models, one platform",
    "titleLine1Before": "Every Question's ",
    "titleLine1Highlight": "Answer",
    "titleLine2Highlight": "Is Already",
    "titleLine2After": " With You.",
    "description": "Upload your documents, connect your sources, let your team ask.\nEdfu instantly finds the right answer from your company's entire knowledge.",
    "ctaPrimary": "Try Free",
    "ctaSecondary": "Sign In"
  },
  "logos": {
    "subtitle": "Access 300+ AI models from a single platform",
    "learnMore": "Learn More"
  },
  "features": {
    "title": "Build Your Company's Digital Memory",
    "description": "Edfu brings all your company's knowledge together on one platform. Your team finds the information they need in seconds.",
    "items": [
      {
        "title": "Talk to Your Documents",
        "description": "Upload your contracts, regulations, meeting notes. Edfu analyzes the content and provides document-based answers to your questions."
      },
      {
        "title": "Connect Your Sources",
        "description": "Drive, Notion, Slack, CRM, ERP and more. Connect your existing tools to Edfu, all sources sync automatically."
      },
      {
        "title": "Upload Documents, Instantly Ready",
        "description": "PDF, Word, Excel — drag and drop your documents. Edfu automatically chunks, indexes, and prepares them for queries."
      },
      {
        "title": "You Talk, AI Writes",
        "description": "Meeting notes, client calls, financial decisions — AI listens, writes, tags. Your team searches and finds instantly."
      }
    ],
    "chatResponse": "In the March 2023 Bursa project, we worked with NNF. According to meeting notes, they were satisfied with delivery time and output quality, and it was noted they would be reconsidered for the next project.",
    "indexing": "Indexing...",
    "indexed": "Indexed",
    "fileProcessed": "Processed",
    "fileProcessing": "Processing",
    "saved": "Saved",
    "noteTitle": "Q3 Sales Meeting",
    "noteTags": ["sales", "meeting", "Q3"]
  },
  "testimonial": {
    "quote": "New team members used to go through weeks of adaptation. After Edfu, they can access the company's entire knowledge base and ask questions from day one. Knowledge loss and repetitive explanations are a thing of the past.",
    "authorName": "Mehmet K.",
    "authorTitle": "Co-Founder, Technology Company",
    "authorAlt": "Mehmet K. profile photo - Co-Founder, Technology Company"
  },
  "howItWorks": {
    "title": "Get Started in Three Steps",
    "description": "No technical knowledge required. Upload your documents, your company's AI-powered knowledge base is ready in minutes.",
    "steps": [
      {
        "title": "Upload Your Documents",
        "description": "PDF, Word, Excel — drag and drop your existing documents. Edfu automatically chunks, indexes, and prepares content for queries.",
        "emoji": "💬"
      },
      {
        "title": "Connect Your Sources",
        "description": "Connect your website, Google Drive, Notion. Edfu automatically syncs your content and keeps your knowledge base up to date.",
        "emoji": "⚙️"
      },
      {
        "title": "Ask, Get Answers",
        "description": "Your team asks questions, Edfu provides accurate and reliable answers sourced from your knowledge base instantly.",
        "emoji": "📊"
      },
      {
        "title": "Grow as a Team",
        "description": "Every new document, every new conversation enriches your company's knowledge. Edfu gets smarter as you use it — your team's shared memory keeps growing.",
        "emoji": "🚀"
      }
    ]
  },
  "security": {
    "title": "Enterprise-Grade Infrastructure",
    "description": "Optimized infrastructure for high performance, uninterrupted access, and full data control.",
    "cards": [
      {
        "title": "Full Privacy and Control",
        "description": "Your data belongs only to you. Never shared with third parties, completely under your control."
      },
      {
        "title": "2 People Today, 50 Tomorrow",
        "description": "As your team grows, so does the company memory. New members access everything from day one, no knowledge is ever lost."
      }
    ]
  },
  "pricing": {
    "title": "Choose the Right Plan for You",
    "description": "All plans start with a 14-day free trial. Start with monthly or yearly payment options to fit your budget.",
    "monthly": "Monthly",
    "yearly": "Yearly",
    "discount": "20% Off",
    "perMonth": "/mo",
    "comingSoon": "Coming Soon",
    "contactUs": "Contact Us",
    "mostPopular": "Most Popular",
    "plans": [
      {
        "name": "Starter",
        "description": "per user, excl. VAT",
        "cta": "Try Free for 14 Days",
        "inheritLabel": "Everything in Pro plan +",
        "features": [
          "Up to 5 users",
          "10M tokens per user/month",
          "Claude Sonnet fixed model",
          "50 GB storage",
          "5 integrations",
          "200 URL crawls/month",
          "10,000 page RAG limit",
          "Email support"
        ]
      },
      {
        "name": "Professional",
        "description": "per user, excl. VAT",
        "cta": "Notify Me",
        "inheritLabel": "Everything in Starter plan +",
        "features": [
          "300+ AI model access (OpenRouter)",
          "25M tokens per user/month",
          "200 GB storage",
          "20 integrations",
          "1,000 URL crawls/month",
          "50,000 page RAG limit",
          "Custom templates",
          "Priority support"
        ]
      },
      {
        "name": "Enterprise",
        "description": "Custom pricing for your needs",
        "cta": "Talk to Sales",
        "inheritLabel": "Everything in Professional plan +",
        "features": [
          "Unlimited users",
          "Dedicated infrastructure",
          "White-label option",
          "SLA guarantee",
          "Custom integration development",
          "1-on-1 onboarding"
        ]
      }
    ]
  },
  "marqueeTestimonials": {
    "title": "Experiences from Teams Using Edfu",
    "description": "Teams from different industries share how they transformed their knowledge access processes with Edfu.",
    "columns": [
      [
        {
          "body": "We used to go through regulation books every time for contract review. We uploaded our documents to Edfu, now we can find and compare any clause in seconds. Our response time to clients has been cut in half.",
          "highlightStart": 103,
          "highlightEnd": 163,
          "name": "Mehmet Aydin",
          "title": "Founder, Digital Legal Consulting"
        },
        {
          "body": "New team members used to spend weeks asking questions to learn. Now they can ask Edfu about all company procedures and policies. Onboarding dropped from 3 weeks to 3 days.",
          "highlightStart": 68,
          "highlightEnd": 128,
          "name": "Ayse Korkmaz",
          "title": "HR Manager, Mid-Size Manufacturing"
        }
      ],
      [
        {
          "body": "Having access to 300+ AI models from a single platform is a huge advantage. We can choose models per task — Claude for code, GPT for client copy. No more separate subscriptions for each model.",
          "highlightStart": 61,
          "highlightEnd": 131,
          "name": "Can Yilmaz",
          "title": "CTO, SaaS Startup"
        },
        {
          "body": "Analyzing tender specifications used to take days. We can now do comparative analysis of all past tenders uploaded to Edfu and automatically detect risky clauses. Our proposal preparation process sped up significantly.",
          "highlightStart": 85,
          "highlightEnd": 165,
          "name": "Zeynep Demir",
          "title": "Operations Manager, Logistics Company"
        }
      ],
      [
        {
          "body": "Every department had its own knowledge silo. With Edfu, we merged documents from all departments into a single knowledge pool. Finance can access legal docs, legal can access financial reports instantly.",
          "highlightStart": 49,
          "highlightEnd": 115,
          "name": "Burak Ozkan",
          "title": "Finance Director, Holding Company"
        },
        {
          "body": "We updated our product info and connected our website to Edfu. Now our customer support team asks AI every product question instead of bothering the product team. Right info, right time.",
          "highlightStart": 64,
          "highlightEnd": 118,
          "name": "Elif Sahin",
          "title": "Marketing Manager, E-Commerce Company"
        }
      ],
      [
        {
          "body": "Our GDPR compliance process completely changed with Edfu. We can upload regulatory changes and compare them with our current procedures. Instead of manually preparing compliance reports, we get AI summaries.",
          "highlightStart": 49,
          "highlightEnd": 130,
          "name": "Ahmet Kaya",
          "title": "General Manager, Consulting Firm"
        },
        {
          "body": "Our sales team used to dig through dozens of files to prepare for client meetings. Now they ask Edfu for all past notes and proposals about a client and get their briefing in 2 minutes. Our close rate visibly improved.",
          "highlightStart": 90,
          "highlightEnd": 186,
          "name": "Selin Tunc",
          "title": "Sales Director, Software Company"
        }
      ],
      [
        {
          "body": "We're a small team but our client portfolio is large. We uploaded every client's brief, feedback, and brand guidelines to Edfu. Whichever client we're working for, we access info instantly — no detail is ever lost.",
          "highlightStart": 122,
          "highlightEnd": 180,
          "name": "Irem Basaran",
          "title": "Founder, Digital Agency"
        }
      ]
    ]
  },
  "faq": {
    "title": "Frequently Asked Questions",
    "description": "We gathered the most common questions about Edfu. If you can't find your answer here, reach out to us.",
    "items": [
      {
        "question": "What exactly does Edfu do?",
        "answer": "Edfu is a platform that transforms your company's documents, website, and knowledge sources into an AI-powered knowledge base. Your team asks questions and gets instant answers from this knowledge base. It can be used in any business process — contract analysis, regulatory compliance, product information queries, and more."
      },
      {
        "question": "Do I need technical knowledge to start using Edfu?",
        "answer": "No. Drag and drop your documents, connect your website by providing a URL — Edfu handles the rest. Documents are automatically processed, indexed, and made query-ready. Setup takes minutes, no software installation required."
      },
      {
        "question": "Who can access my data?",
        "answer": "Only you. Each organization's data is completely isolated from others. Your data is never shared with third parties and is hosted in European data centers with GDPR-compliant infrastructure."
      },
      {
        "question": "Which tools does it integrate with?",
        "answer": "Edfu integrates with Google Drive, Notion, Dropbox, and Slack. The Website Crawler feature also lets you automatically scan any website and add it to your knowledge base. The number of integrations varies by plan."
      },
      {
        "question": "How does the free trial work?",
        "answer": "You can try all plans free for 14 days. All features are active during the trial. If you're not satisfied at the end, no charges are made."
      },
      {
        "question": "What does 300+ AI models mean, which one should I choose?",
        "answer": "Through OpenRouter integration, Edfu provides access to Claude, GPT-4, Gemini, Llama, and hundreds of different AI models from a single platform. Each model excels at different tasks. The Starter plan includes Claude Sonnet as a fixed model, while the Professional plan unlocks access to all models."
      }
    ]
  },
  "cta": {
    "line1": "Upload.",
    "line2": "Ask.",
    "line3": "Get Answers.",
    "button": "Try Free for 14 Days",
    "subtext": "Cancel anytime, no commitment."
  },
  "footer": {
    "description": "The platform that transforms your company's knowledge into AI. Upload your documents, let your team ask.",
    "columns": [
      {
        "heading": "Company",
        "links": ["About Us", "Contact", "Blog", "Careers"]
      },
      {
        "heading": "Product",
        "links": ["Features", "Pricing", "Integrations", "API Documentation"]
      },
      {
        "heading": "Resources",
        "links": ["Help Center", "User Guide", "Status Page", "Privacy Policy"]
      }
    ]
  },
  "jsonLd": {
    "orgDescription": "The platform that transforms your company's knowledge into AI.",
    "contactLanguage": "English",
    "softwareDescription": "The platform that transforms your company's knowledge into AI. Upload your documents, let your team ask questions with 300+ AI models, get instant accurate answers.",
    "planStarterName": "Starter",
    "planStarterDesc": "Up to 5 users, 10M tokens per user/month, Claude Sonnet fixed model, 50 GB storage",
    "planStarterUnit": "per user / month",
    "planEnterpriseName": "Enterprise",
    "planEnterpriseDesc": "Unlimited users, dedicated infrastructure, white-label option, SLA guarantee",
    "websiteDescription": "The platform that transforms your company's knowledge into AI."
  }
}
```

- [ ] **Step 4: Create `src/dictionaries/index.ts`**

```ts
import "server-only";

const dictionaries = {
  tr: () => import("./tr.json").then((m) => m.default),
  en: () => import("./en.json").then((m) => m.default),
};

export type Locale = keyof typeof dictionaries;
export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

export const locales: Locale[] = ["tr", "en"];

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries;

export const getDictionary = async (locale: Locale) => dictionaries[locale]();
```

- [ ] **Step 5: Commit**

```bash
git add src/dictionaries/
git commit -m "feat(i18n): add dictionary files and loader for TR/EN"
```

---

### Task 2: Create proxy.ts for locale detection

**Files:**
- Create: `src/proxy.ts`

- [ ] **Step 1: Create `src/proxy.ts`**

```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["tr", "en"] as const;

function getLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && locales.includes(cookieLocale as (typeof locales)[number])) {
    return cookieLocale;
  }

  const acceptLang = request.headers.get("accept-language") ?? "";
  if (acceptLang.includes("tr")) return "tr";

  return "en";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /tr → redirect to prefix-less (canonical for Turkish)
  if (pathname === "/tr" || pathname.startsWith("/tr/")) {
    const newPath = pathname.replace(/^\/tr/, "") || "/";
    return NextResponse.redirect(new URL(newPath, request.url), 301);
  }

  // /en already has locale prefix — let it through
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return NextResponse.rewrite(new URL(pathname, request.url));
  }

  // No locale prefix — detect and route
  const locale = getLocale(request);

  if (locale === "en") {
    return NextResponse.redirect(new URL(`/en${pathname}`, request.url), 307);
  }

  // Turkish: rewrite internally to /tr (URL stays as /)
  return NextResponse.rewrite(new URL(`/tr${pathname}`, request.url));
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|ico|webp)$).*)",
  ],
};
```

- [ ] **Step 2: Commit**

```bash
git add src/proxy.ts
git commit -m "feat(i18n): add proxy.ts for locale detection and routing"
```

---

### Task 3: Move layout and page into `[lang]` dynamic segment

This is the core restructuring task. Move `app/layout.tsx` and `app/page.tsx` into `app/[lang]/`, update layout to use locale-aware metadata, and update page to load dictionary and pass it to components.

**Files:**
- Create: `src/app/[lang]/layout.tsx` (adapted from `src/app/layout.tsx`)
- Create: `src/app/[lang]/page.tsx` (adapted from `src/app/page.tsx`)
- Delete: `src/app/layout.tsx`
- Delete: `src/app/page.tsx`
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/robots.ts`

- [ ] **Step 1: Create `src/app/[lang]/layout.tsx`**

Adapted from the current `src/app/layout.tsx` (currently at lines 1-117). Key changes: accepts `lang` param, dynamic metadata based on locale, `<html lang={lang}>`, hreflang alternates, base URL → `edfu.ai`.

```tsx
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getDictionary, hasLocale } from "@/dictionaries";
import type { Locale } from "@/dictionaries";
import { notFound } from "next/navigation";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const BASE_URL = "https://edfu.ai";

export async function generateStaticParams() {
  return [{ lang: "tr" }, { lang: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang as Locale);
  const m = dict.metadata;

  return {
    metadataBase: new URL(BASE_URL),
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
    title: {
      default: m.title,
      template: "%s | Edfu",
    },
    description: m.description,
    keywords: m.keywords,
    authors: [{ name: "Edfu", url: BASE_URL }],
    creator: "Edfu",
    publisher: "Edfu",
    applicationName: "Edfu",
    referrer: "origin-when-cross-origin",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: lang === "tr" ? "/" : "/en",
      languages: {
        tr: "/",
        en: "/en",
        "x-default": "/",
      },
    },
    openGraph: {
      type: "website",
      locale: lang === "tr" ? "tr_TR" : "en_US",
      url: lang === "tr" ? BASE_URL : `${BASE_URL}/en`,
      siteName: "Edfu",
      title: m.ogTitle,
      description: m.ogDescription,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: m.ogTitle,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: m.twitterTitle,
      description: m.twitterDescription,
      images: ["/og-image.png"],
    },
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={`min-h-screen font-sans antialiased ${geist.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Create `src/app/[lang]/page.tsx`**

Loads dictionary, passes sections as props. JSON-LD is generated from dictionary. Components are not yet updated to accept props — that happens in Tasks 4-8. For now, pass the dict prop even though components will temporarily ignore it. This lets us verify the routing works before refactoring components.

```tsx
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/dictionaries";
import type { Locale, Dictionary } from "@/dictionaries";
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

const BASE_URL = "https://edfu.ai";

function JsonLd({ dict, lang }: { dict: Dictionary; lang: string }) {
  const j = dict.jsonLd;

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Edfu",
    url: BASE_URL,
    logo: `${BASE_URL}/logo.svg`,
    description: j.orgDescription,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: j.contactLanguage,
    },
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Edfu",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: j.softwareDescription,
    url: BASE_URL,
    offers: [
      {
        "@type": "Offer",
        name: j.planStarterName,
        price: "1592",
        priceCurrency: "TRY",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "1592",
          priceCurrency: "TRY",
          unitText: j.planStarterUnit,
          referenceQuantity: {
            "@type": "QuantitativeValue",
            value: "1",
            unitCode: "MON",
          },
        },
        description: j.planStarterDesc,
      },
      {
        "@type": "Offer",
        name: j.planEnterpriseName,
        price: "0",
        priceCurrency: "TRY",
        description: j.planEnterpriseDesc,
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
    mainEntity: dict.faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Edfu",
    url: BASE_URL,
    description: j.websiteDescription,
    inLanguage: lang,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);

  return (
    <>
      <JsonLd dict={dict} lang={lang} />
      <Navbar dict={dict.navbar} lang={lang} />
      <div className="relative mx-auto max-w-7xl border-x border-border">
        <div className="pointer-events-none absolute inset-y-0 left-4 md:left-6 z-10 w-px bg-border" />
        <div className="pointer-events-none absolute inset-y-0 right-4 md:right-6 z-10 w-px bg-border" />
        <main className="divide-y divide-border">
          <Hero dict={dict.hero} />
          <Logos dict={dict.logos} />
          <BentoFeatures dict={dict.features} />
          <Testimonial dict={dict.testimonial} />
          <HowItWorks dict={dict.howItWorks} />
          <Security dict={dict.security} />
          <Pricing dict={dict.pricing} />
          <MarqueeTestimonials dict={dict.marqueeTestimonials} />
          <FAQ dict={dict.faq} />
          <CTA dict={dict.cta} />
        </main>
        <Footer dict={dict.footer} />
      </div>
    </>
  );
}
```

- [ ] **Step 3: Delete old files**

```bash
rm src/app/layout.tsx src/app/page.tsx
```

- [ ] **Step 4: Update `src/app/sitemap.ts`**

Replace the current content (which uses `edfu.com.tr`) with URLs for both locales:

```ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://edfu.ai",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          tr: "https://edfu.ai",
          en: "https://edfu.ai/en",
        },
      },
    },
  ];
}
```

- [ ] **Step 5: Update `src/app/robots.ts`**

Update base URL from `edfu.com.tr` to `edfu.ai`:

```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://edfu.ai/sitemap.xml",
  };
}
```

- [ ] **Step 6: Verify the build compiles**

Run: `npm run build`

Expected: Build succeeds (components will show type errors for missing `dict` props — this is expected and will be resolved in subsequent tasks). If there are import path errors, fix those first.

> **Note:** This step may produce TypeScript errors because the components don't yet accept `dict` props. That's fine — the goal is to confirm routing and layout work. If there are breaking type errors, temporarily pass `dict` as `any` to unblock, then fix properly in Tasks 4-8.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(i18n): move layout/page to [lang] segment, update sitemap/robots"
```

---

### Task 4: Create language switcher and update Navbar

**Files:**
- Create: `src/components/language-switcher.tsx`
- Modify: `src/components/sections/navbar.tsx`

- [ ] **Step 1: Create `src/components/language-switcher.tsx`**

```tsx
"use client";

import type { Locale } from "@/dictionaries";

export function LanguageSwitcher({ lang }: { lang: string }) {
  const isEn = lang === "en";

  function handleSwitch(targetLocale: Locale) {
    document.cookie = `NEXT_LOCALE=${targetLocale};path=/;max-age=31536000`;
    window.location.href = targetLocale === "en" ? "/en" : "/";
  }

  return (
    <div className="flex h-8 items-center rounded-full border border-border px-2 text-xs font-medium">
      <button
        onClick={() => handleSwitch("tr")}
        className={`cursor-pointer px-1.5 py-0.5 transition-colors ${
          !isEn ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        TR
      </button>
      <span className="text-border mx-0.5">|</span>
      <button
        onClick={() => handleSwitch("en")}
        className={`cursor-pointer px-1.5 py-0.5 transition-colors ${
          isEn ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        EN
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Update `src/components/sections/navbar.tsx`**

The navbar needs these changes:
1. Accept `dict` and `lang` props
2. Replace hardcoded `navLinks` labels with dictionary values
3. Replace hardcoded CTA text with dictionary value
4. Add `LanguageSwitcher` next to theme toggler
5. Replace aria-label strings with dictionary values

In `navbar.tsx`, change the component signature and replace hardcoded strings. The `navLinks` array should be built from props:

At the top of the file, **remove** the existing hardcoded `navLinks` const (lines 9-14).

Change the component export to:

```tsx
import { LanguageSwitcher } from "@/components/language-switcher";
import type { Dictionary } from "@/dictionaries";

interface NavbarProps {
  dict: Dictionary["navbar"];
  lang: string;
}

export function Navbar({ dict, lang }: NavbarProps) {
  const navLinks = [
    { label: dict.home, href: "#hero", sectionId: "hero" },
    { label: dict.features, href: "#features", sectionId: "features" },
    { label: dict.howItWorks, href: "#how-it-works", sectionId: "how-it-works" },
    { label: dict.pricing, href: "#pricing", sectionId: "pricing" },
  ] as const;
```

Replace every occurrence of the hardcoded text:
- `"Ücretsiz Deneyin"` (appears twice: desktop CTA line ~146 and mobile CTA line ~194) → `{dict.cta}`
- `aria-label={mobileOpen ? "Menüyü kapat" : "Menüyü aç"}` → `aria-label={mobileOpen ? dict.menuClose : dict.menuOpen}`

Add `<LanguageSwitcher lang={lang} />` in the desktop right section (after theme toggler, around line 148):

```tsx
<div className="hidden items-center gap-2 md:flex">
  <LanguageSwitcher lang={lang} />
  <a href="#pricing" ...>{dict.cta}</a>
  <AnimatedThemeToggler ... />
</div>
```

And in the mobile section (before the hamburger button, around line 152):

```tsx
<div className="flex items-center gap-2 md:hidden">
  <LanguageSwitcher lang={lang} />
  <AnimatedThemeToggler ... />
  <button ...>
```

- [ ] **Step 3: Verify it compiles**

Run: `npm run build`

- [ ] **Step 4: Commit**

```bash
git add src/components/language-switcher.tsx src/components/sections/navbar.tsx
git commit -m "feat(i18n): add language switcher, localize navbar"
```

---

### Task 5: Localize Hero, Logos, Testimonial, CTA sections

These are simpler sections with straightforward string replacements.

**Files:**
- Modify: `src/components/sections/hero.tsx`
- Modify: `src/components/sections/logos.tsx`
- Modify: `src/components/sections/testimonial.tsx`
- Modify: `src/components/sections/cta.tsx`

- [ ] **Step 1: Update `src/components/sections/hero.tsx`**

Add props interface and replace all hardcoded strings:

```tsx
import type { Dictionary } from "@/dictionaries";

interface HeroProps {
  dict: Dictionary["hero"];
}

export function Hero({ dict }: HeroProps) {
```

Replace inside the JSX:
- `"300+ AI modeli, tek platform"` → `{dict.badge}`
- The title section `Her Sorunun <Highlighter ...>Cevabı</Highlighter>` etc. → use `dict.titleLine1Before`, `dict.titleLine1Highlight`, `dict.titleLine2Highlight`, `dict.titleLine2After`:

```tsx
{dict.titleLine1Before}<Highlighter action="underline" color="#4AA4E0" strokeWidth={2} animationDuration={800} padding={4} delay={850}>{dict.titleLine1Highlight}</Highlighter>
<br />
<Highlighter action="highlight" color="#87CEFA" strokeWidth={2} animationDuration={800} padding={4} delay={1000}>{dict.titleLine2Highlight}</Highlighter>{dict.titleLine2After}
```

- The description paragraph: replace the hardcoded text with `{dict.description}`. Since it has `\n`, split on newlines:

```tsx
{dict.description.split("\n").map((line, i) => (
  <span key={i}>
    {i > 0 && <br />}
    {line}
  </span>
))}
```

- `"Ücretsiz Deneyin"` → `{dict.ctaPrimary}`
- `"Giriş Yap"` → `{dict.ctaSecondary}`

- [ ] **Step 2: Update `src/components/sections/logos.tsx`**

Add props and replace strings:

```tsx
import type { Dictionary } from "@/dictionaries";

interface LogosProps {
  dict: Dictionary["logos"];
}

export function Logos({ dict }: LogosProps) {
```

Replace:
- `"300'den fazla yapay zeka modeline tek platformdan erişin"` → `{dict.subtitle}`
- `"Daha Fazla"` → `{dict.learnMore}`

- [ ] **Step 3: Update `src/components/sections/testimonial.tsx`**

```tsx
import type { Dictionary } from "@/dictionaries";

interface TestimonialProps {
  dict: Dictionary["testimonial"];
}

export function Testimonial({ dict }: TestimonialProps) {
```

Replace:
- The blockquote text → `{dict.quote}`
- `alt="Mehmet K. profil fotoğrafı..."` → `alt={dict.authorAlt}`
- `"Mehmet K."` → `{dict.authorName}`
- `"Kurucu Ortak, Teknoloji Şirketi"` → `{dict.authorTitle}`

- [ ] **Step 4: Update `src/components/sections/cta.tsx`**

CTA is a server component (no `"use client"`), so just add the prop:

```tsx
import type { Dictionary } from "@/dictionaries";

interface CTAProps {
  dict: Dictionary["cta"];
}

export function CTA({ dict }: CTAProps) {
```

Replace:
- `"Yükleyin."` → `{dict.line1}`
- `"Sorun."` → `{dict.line2}`
- `"Cevap Alın."` → `{dict.line3}`
- `"14 Gün Ücretsiz Deneyin"` → `{dict.button}`
- `"İstediğiniz zaman iptal edin, taahhüt yok."` → `{dict.subtext}`

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/hero.tsx src/components/sections/logos.tsx src/components/sections/testimonial.tsx src/components/sections/cta.tsx
git commit -m "feat(i18n): localize hero, logos, testimonial, CTA sections"
```

---

### Task 6: Localize HowItWorks, Security, FAQ sections

**Files:**
- Modify: `src/components/sections/how-it-works.tsx`
- Modify: `src/components/sections/security.tsx`
- Modify: `src/components/sections/faq.tsx`

- [ ] **Step 1: Update `src/components/sections/how-it-works.tsx`**

Add props and replace the hardcoded `steps` array:

```tsx
import type { Dictionary } from "@/dictionaries";

interface HowItWorksProps {
  dict: Dictionary["howItWorks"];
}

export function HowItWorks({ dict }: HowItWorksProps) {
  const steps = dict.steps;
```

Remove the old hardcoded `steps` const (lines 5-30 in the current file).

Replace:
- `"Üç Adımda Başlayın"` → `{dict.title}`
- `"Teknik bilgi gerekmez..."` → `{dict.description}`
- All `step.title`, `step.description`, `step.emoji` references remain the same since we're now reading from `dict.steps` which has the same shape.

- [ ] **Step 2: Update `src/components/sections/security.tsx`**

```tsx
import type { Dictionary } from "@/dictionaries";

interface SecurityProps {
  dict: Dictionary["security"];
}

export function Security({ dict }: SecurityProps) {
```

Replace:
- `"Kurumsal Düzeyde Altyapı"` → `{dict.title}`
- `"Yüksek performans..."` → `{dict.description}`
- Card 1: `"Tam Gizlilik ve Kontrol"` → `{dict.cards[0].title}`, description → `{dict.cards[0].description}`
- Card 2: `"Bugün 2 Kişi, Yarın 50"` → `{dict.cards[1].title}`, description → `{dict.cards[1].description}`

- [ ] **Step 3: Update `src/components/sections/faq.tsx`**

```tsx
import type { Dictionary } from "@/dictionaries";

interface FAQProps {
  dict: Dictionary["faq"];
}

export function FAQ({ dict }: FAQProps) {
```

Remove the old hardcoded `faqs` const (lines 6-37 in the current file). Use `dict.items` instead:

Replace:
- `"Sıkça Sorulan Sorular"` → `{dict.title}`
- `"Edfu hakkında merak edilenleri..."` → `{dict.description}`
- Change `faqs.map(...)` to `dict.items.map(...)` — the item shape is `{ question, answer }` which matches.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/how-it-works.tsx src/components/sections/security.tsx src/components/sections/faq.tsx
git commit -m "feat(i18n): localize how-it-works, security, FAQ sections"
```

---

### Task 7: Localize Pricing section

**Files:**
- Modify: `src/components/sections/pricing.tsx`

- [ ] **Step 1: Update `src/components/sections/pricing.tsx`**

```tsx
import type { Dictionary } from "@/dictionaries";

interface PricingProps {
  dict: Dictionary["pricing"];
}

export function Pricing({ dict }: PricingProps) {
  const [isYearly, setIsYearly] = useState(true);
```

Remove the old hardcoded `plans` array (lines 11-67 in current file). Use `dict.plans` instead, but keep the price values hardcoded since they're numbers not in the dictionary:

```tsx
const planPrices = [
  { monthlyPrice: 1990, yearlyPrice: 1592 },
  { monthlyPrice: null, yearlyPrice: null },
  { monthlyPrice: null, yearlyPrice: null },
];
```

In the JSX, merge `dict.plans` with `planPrices`:

```tsx
{dict.plans.map((plan, idx) => {
  const prices = planPrices[idx];
  const price = isYearly ? prices.yearlyPrice : prices.monthlyPrice;
  const isPopular = idx === 1;
  const isEnterprise = idx === 2;
```

Replace all hardcoded strings:
- `"İhtiyacınıza Uygun Plan Seçin"` → `{dict.title}`
- `"Tüm planlar 14 gün ücretsiz..."` → `{dict.description}`
- `"Aylık"` → `{dict.monthly}`
- `"Yıllık"` → `{dict.yearly}`
- `"%20 İndirim"` → `{dict.discount}`
- `"/ay"` → `{dict.perMonth}`
- `"Yakında"` → `{dict.comingSoon}`
- `"İletişime Geçin"` → `{dict.contactUs}`
- `"En Popüler"` → `{dict.mostPopular}`
- `plan.name`, `plan.description`, `plan.cta`, `plan.inheritLabel`, `plan.features` — all come from `dict.plans[idx]`

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/pricing.tsx
git commit -m "feat(i18n): localize pricing section"
```

---

### Task 8: Localize BentoFeatures, MarqueeTestimonials, Footer

These are the most content-heavy sections.

**Files:**
- Modify: `src/components/sections/bento-features.tsx`
- Modify: `src/components/sections/marquee-testimonials.tsx`
- Modify: `src/components/sections/footer.tsx`

- [ ] **Step 1: Update `src/components/sections/bento-features.tsx`**

This is a large file with multiple sub-components. The main section receives `dict` and passes relevant parts to sub-components.

```tsx
import type { Dictionary } from "@/dictionaries";

interface BentoFeaturesProps {
  dict: Dictionary["features"];
}

export function BentoFeatures({ dict }: BentoFeaturesProps) {
```

Changes needed inside sub-components:

**ChatMockup:** Replace the hardcoded `AI_RESPONSE` const (line 19) — pass `dict.chatResponse` as a prop instead:

```tsx
function ChatMockup({ response }: { response: string }) {
  // Replace AI_RESPONSE usage with response prop
```

Remove the `AI_RESPONSE` const. Pass `response={dict.chatResponse}` from the features visual array.

**DriveUploadMockup:** Replace status text strings:
- `"İndeksleniyor..."` → use `dict.indexing`
- `"İndekslendi"` → use `dict.indexed`
- `"İşlendi"` → use `dict.fileProcessed`
- `"İşleniyor"` → use `dict.fileProcessing`

Pass these as props: `indexing`, `indexed`, `fileProcessed`, `fileProcessing`.

**NotesMockup:** Replace:
- `NOTE_TITLE` const (`"Q3 Satış Toplantısı"`) → pass as prop from `dict.noteTitle`
- `NOTE_TAGS` const → pass as prop from `dict.noteTags`
- `"Kaydedildi"` → pass as prop from `dict.saved`

**Section header:**
- `"Şirketinizin Dijital Hafızasını Oluşturun"` → `{dict.title}`
- `"Edfu, şirketinizdeki tüm bilgiyi..."` → `{dict.description}`

**Feature cards:** The `features` array (lines 695-716) should now come from `dict.items`, with the visual components built inline:

```tsx
const visuals = [
  <ChatMockup key="chat" response={dict.chatResponse} />,
  <IntegrationOrbits key="orbits" />,
  <DriveUploadMockup key="upload" indexing={dict.indexing} indexed={dict.indexed} fileProcessed={dict.fileProcessed} fileProcessing={dict.fileProcessing} />,
  <NotesMockup key="notes" noteTitle={dict.noteTitle} noteTags={dict.noteTags} saved={dict.saved} />,
];

// Then in the grid:
{dict.items.map((feature, i) => (
  <div key={feature.title} ...>
    <div className="relative flex-1">{visuals[i]}</div>
    <div ...>
      <h3 ...>{feature.title}</h3>
      <p ...>{feature.description}</p>
    </div>
  </div>
))}
```

- [ ] **Step 2: Update `src/components/sections/marquee-testimonials.tsx`**

```tsx
import type { Dictionary } from "@/dictionaries";

interface MarqueeTestimonialsProps {
  dict: Dictionary["marqueeTestimonials"];
}

export function MarqueeTestimonials({ dict }: MarqueeTestimonialsProps) {
```

Remove the old hardcoded `columns` const (lines 14-101). Use `dict.columns` instead.

Replace:
- `"Edfu Kullanan Ekiplerin Deneyimleri"` → `{dict.title}`
- `"Farklı sektörlerden ekipler..."` → `{dict.description}`
- The `columns` variable in the JSX → `dict.columns`
- Update `TestimonialCard` to use `dict.columns` item shape (same `body`, `highlightStart`, `highlightEnd`, `name`, `title`)

The `Testimonial` interface (lines 5-12) and `TestimonialCard` component stay the same shape — just change data source from hardcoded to `dict.columns`.

Update the avatar URLs: Since these are Turkish names but testimonials are translated, keep the same avatar URLs. Add avatars to the dictionary or hardcode them separately:

```tsx
const avatars = [
  ["https://randomuser.me/api/portraits/men/32.jpg", "https://randomuser.me/api/portraits/women/44.jpg"],
  ["https://randomuser.me/api/portraits/men/45.jpg", "https://randomuser.me/api/portraits/women/68.jpg"],
  ["https://randomuser.me/api/portraits/men/22.jpg", "https://randomuser.me/api/portraits/women/55.jpg"],
  ["https://randomuser.me/api/portraits/men/51.jpg", "https://randomuser.me/api/portraits/women/27.jpg"],
  ["https://randomuser.me/api/portraits/women/90.jpg"],
];
```

Merge avatars with dict columns when rendering.

- [ ] **Step 3: Update `src/components/sections/footer.tsx`**

```tsx
import type { Dictionary } from "@/dictionaries";

interface FooterProps {
  dict: Dictionary["footer"];
}

export function Footer({ dict }: FooterProps) {
```

Remove the old hardcoded `columns` const (lines 6-19). Use `dict.columns` instead.

Replace:
- `"Şirketinizin bilgi birikimini..."` → `{dict.description}`
- The footer columns `columns.map(...)` → `dict.columns.map(...)`
- Column headings and links come from `dict.columns[i].heading` and `dict.columns[i].links`

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/bento-features.tsx src/components/sections/marquee-testimonials.tsx src/components/sections/footer.tsx
git commit -m "feat(i18n): localize bento-features, marquee-testimonials, footer"
```

---

### Task 9: Full build verification and manual test

**Files:** None new — this is a verification task.

- [ ] **Step 1: Run the build**

Run: `npm run build`

Expected: Build succeeds with no TypeScript errors. Both `/tr` and `/en` static pages are generated.

- [ ] **Step 2: Start dev server and test Turkish (default)**

Run: `npm run dev`

Open `http://localhost:3000` in a browser with Turkish locale. Verify:
- Page loads with Turkish content
- URL stays as `/` (no prefix)
- All sections display Turkish text from dictionary
- Language switcher shows TR as active
- Theme toggler still works

- [ ] **Step 3: Test English route**

Open `http://localhost:3000/en`. Verify:
- Page loads with English content
- URL is `/en`
- Language switcher shows EN as active
- Clicking TR in language switcher navigates to `/` with Turkish content

- [ ] **Step 4: Test auto-redirect**

Open `http://localhost:3000` in a browser with English locale (or use curl):

```bash
curl -I -H "Accept-Language: en-US,en;q=0.9" http://localhost:3000
```

Expected: 307 redirect to `http://localhost:3000/en`

- [ ] **Step 5: Test /tr redirect**

```bash
curl -I http://localhost:3000/tr
```

Expected: 301 redirect to `http://localhost:3000/`

- [ ] **Step 6: Verify SEO metadata**

View page source for both `/` and `/en`. Check:
- `<html lang="tr">` vs `<html lang="en">`
- `<link rel="alternate" hreflang="tr" href="https://edfu.ai/" />`
- `<link rel="alternate" hreflang="en" href="https://edfu.ai/en" />`
- OpenGraph locale tags
- JSON-LD structured data in correct language

- [ ] **Step 7: Commit any fixes found during testing**

```bash
git add -A
git commit -m "fix(i18n): fixes from manual testing"
```

(Skip if no fixes needed.)
