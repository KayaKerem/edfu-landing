"use client";

import { useRef, useState } from "react";
import { Check } from "lucide-react";
import { motion } from "motion/react";

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: "Başlangıç",
      monthlyPrice: 1990,
      yearlyPrice: 1592,
      description: "kişi başı, KDV hariç",
      cta: "14 Gün Ücretsiz Deneyin",
      popular: false,
      inheritLabel: "Pro planın tüm özellikleri +",
      features: [
        "5 kullanıcıya kadar",
        "Kişi başı aylık 10M token",
        "Claude Sonnet sabit model",
        "50 GB depolama",
        "5 entegrasyon",
        "Ayda 200 URL crawl",
        "10.000 sayfa RAG limiti",
        "E-posta desteği",
      ],
    },
    {
      name: "Profesyonel",
      monthlyPrice: null,
      yearlyPrice: null,
      description: "kişi başı, KDV hariç",
      cta: "Beni Bilgilendir",
      popular: true,
      inheritLabel: "Başlangıç planının tüm özellikleri +",
      features: [
        "300+ AI model erişimi (OpenRouter)",
        "Kişi başı aylık 25M token",
        "200 GB depolama",
        "20 entegrasyon",
        "Ayda 1.000 URL crawl",
        "50.000 sayfa RAG limiti",
        "Özel şablonlar",
        "Öncelikli destek",
      ],
    },
    {
      name: "Kurumsal",
      monthlyPrice: null,
      yearlyPrice: null,
      description: "Özel ihtiyaçlarınıza göre fiyatlandırma",
      cta: "Satış Ekibiyle Görüşün",
      popular: false,
      inheritLabel: "Profesyonel planın tüm özellikleri +",
      features: [
        "Sınırsız kullanıcı",
        "Dedicated Hetzner altyapısı",
        "White-label seçeneği",
        "SLA garantisi",
        "Özel entegrasyon geliştirme",
        "Birebir onboarding",
      ],
    },
  ];

  return (
    <section
      id="pricing"
      className="flex flex-col items-center justify-center gap-10 pb-10 w-full relative"
    >
      {/* Header */}
      <div className="border-b w-full h-full px-4 py-10 md:p-14">
        <div className="max-w-xl mx-auto">
          <h2
            className="text-[28px] sm:text-[32px] md:text-[36px] font-medium leading-none text-foreground text-center"
            style={{
              letterSpacing: "-0.05em",
              fontFamily: "var(--font-geist)",
            }}
          >
            İhtiyacınıza Uygun Plan Seçin
          </h2>
          <p className="text-muted-foreground text-center text-balance font-medium mt-4">
            Tüm planlar 14 gün ücretsiz deneme ile başlar. Aylık veya yıllık ödeme seçeneği ile bütçenize uygun başlayın.
          </p>
        </div>
      </div>

      {/* Card Grid */}
      <div className="grid min-[650px]:grid-cols-2 min-[900px]:grid-cols-3 gap-4 w-full max-w-6xl mx-auto px-4 sm:px-6 relative">
        {/* Toggle - positioned above grid */}
        <div className="absolute -top-14 left-1/2 -translate-x-1/2">
          <div
            className="relative flex w-fit items-center rounded-full border p-0.5 backdrop-blur-sm cursor-pointer h-9 bg-muted mx-auto"
            onClick={() => setIsYearly(!isYearly)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsYearly(false);
              }}
              className="relative z-10 flex items-center justify-center rounded-full px-4 h-full text-sm font-medium cursor-pointer"
            >
              {!isYearly && (
                <motion.div
                  layoutId="pricingTogglePill"
                  className="absolute inset-0 rounded-full bg-white dark:bg-[#3F3F46] shadow-md border border-border"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <span className={`relative z-10 transition-colors duration-200 ${!isYearly ? "text-primary" : "text-muted-foreground"}`}>
                Aylık
              </span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsYearly(true);
              }}
              className="relative z-10 flex items-center justify-center rounded-full px-4 h-full text-sm font-medium cursor-pointer"
            >
              {isYearly && (
                <motion.div
                  layoutId="pricingTogglePill"
                  className="absolute inset-0 rounded-full bg-white dark:bg-[#3F3F46] shadow-md border border-border"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <span className={`relative z-10 flex items-center transition-colors duration-200 ${isYearly ? "text-primary" : "text-muted-foreground"}`}>
                Yıllık
                <span className="text-xs font-semibold text-primary bg-primary/15 py-0.5 px-1 rounded-full ml-2">
                  %20 İndirim
                </span>
              </span>
            </button>
          </div>
        </div>

        {/* Cards */}
        {plans.map((plan) => {
          const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;

          // Card 2 (popular) has unique styles
          const isPopular = plan.popular;
          const isEnterprise = plan.name === "Kurumsal";

          const cardClasses = isPopular
            ? "rounded-xl grid grid-rows-[180px_auto_1fr] relative h-fit min-[650px]:h-full min-[900px]:h-fit bg-white dark:bg-[#27272A] md:shadow-[0px_61px_24px_-10px_rgba(0,0,0,0.01),0px_34px_20px_-8px_rgba(0,0,0,0.05),0px_15px_15px_-6px_rgba(0,0,0,0.09),0px_4px_8px_-2px_rgba(0,0,0,0.10),0px_0px_0px_1px_rgba(0,0,0,0.08)]"
            : "rounded-xl grid grid-rows-[180px_auto_1fr] relative h-fit min-[650px]:h-full min-[900px]:h-fit bg-[#F3F4F6] dark:bg-[#F9FAFB]/[0.02] border border-border";

          return (
            <div key={plan.name} className={cardClasses}>
              {/* Upper section: plan info */}
              <div className="p-6 flex flex-col justify-center">
                {/* Plan name + badge */}
                <div className="flex items-center">
                  <span className="text-sm text-foreground">{plan.name}</span>
                  {isPopular && (
                    <span className="bg-gradient-to-b from-primary/50 to-primary text-white h-6 inline-flex w-fit items-center justify-center px-2 rounded-full text-sm ml-2 shadow-[0px_6px_6px_-3px_rgba(0,0,0,0.08),0px_3px_3px_-1.5px_rgba(0,0,0,0.08),0px_1px_1px_-0.5px_rgba(0,0,0,0.08),0px_0px_0px_1px_rgba(255,255,255,0.12)_inset,0px_1px_0px_0px_rgba(255,255,255,0.12)_inset]">
                      En Popüler
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="mt-3 flex items-end gap-1">
                  {price !== null ? (
                    <>
                      <span className="text-4xl font-semibold text-foreground">₺{price}</span>
                      <span className="mb-1 text-sm text-muted-foreground">/ay</span>
                    </>
                  ) : isPopular ? (
                    <span className="text-4xl font-semibold text-foreground">Yakında</span>
                  ) : (
                    <span className="text-4xl font-semibold text-foreground">İletişime Geçin</span>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm mt-2 text-muted-foreground">
                  {plan.description}
                </p>
              </div>

              {/* Button section */}
              <div className="px-6 pb-6">
                {isPopular ? (
                  <a
                    href="#"
                    className="flex h-10 w-full items-center justify-center rounded-full text-sm font-normal tracking-wide bg-primary text-primary-foreground shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_3px_3px_-1.5px_rgba(16,24,40,0.06),0_1px_1px_rgba(16,24,40,0.08)] active:scale-95 transition-all ease-out"
                  >
                    {plan.cta}
                  </a>
                ) : isEnterprise ? (
                  <a
                    href="#"
                    className="flex h-10 w-full items-center justify-center rounded-full text-sm font-normal tracking-wide bg-[#171717] text-white dark:bg-white dark:text-[#171717] shadow-[0px_1px_2px_0px_rgba(255,255,255,0.16)_inset,0px_3px_3px_-1.5px_rgba(16,24,40,0.24),0px_1px_1px_-0.5px_rgba(16,24,40,0.20)] active:scale-95 transition-all ease-out"
                  >
                    {plan.cta}
                  </a>
                ) : (
                  <a
                    href="#"
                    className="flex h-10 w-full items-center justify-center rounded-full text-sm font-normal tracking-wide bg-white dark:bg-[#27272A] text-foreground shadow-[0px_1px_2px_0px_rgba(255,255,255,0.16)_inset,0px_3px_3px_-1.5px_rgba(16,24,40,0.24),0px_1px_1px_-0.5px_rgba(16,24,40,0.20)] active:scale-95 transition-all ease-out"
                  >
                    {plan.cta}
                  </a>
                )}
              </div>

              {/* Features section */}
              <div className="px-6 pb-6">
                <hr className="border-border dark:border-white/20 mb-6" />

                {/* Inherit label */}
                <p className="mb-4 text-sm font-medium text-muted-foreground">
                  {plan.inheritLabel}
                </p>

                {/* Feature list */}
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-foreground"
                    >
                      {isPopular ? (
                        <span className="size-5 rounded-full border bg-muted-foreground/40 border-border flex items-center justify-center shrink-0">
                          <Check className="size-3 text-white" strokeWidth={2.5} />
                        </span>
                      ) : (
                        <span className="size-5 rounded-full border border-primary/20 flex items-center justify-center shrink-0">
                          <Check
                            className="size-3 text-foreground"
                            strokeWidth={2.5}
                          />
                        </span>
                      )}
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
