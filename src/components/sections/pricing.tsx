"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const FREE_FEATURES = [
  "Özel alan adı",
  "SEO optimizasyonları",
  "Otomatik API belgeleri",
  "Dahili bileşen kütüphanesi",
];

const STARTUP_EXTRA_FEATURES = [
  "E-ticaret entegrasyonu",
  "Kullanıcı kimlik doğrulama",
  "Çoklu dil desteği",
  "Gerçek zamanlı iş birliği",
];

const ENTERPRISE_EXTRA_FEATURES = ["Gerçek zamanlı iş birliği"];

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="font-heading text-4xl font-bold sm:text-5xl">
            Sizinle Birlikte Ölçeklenen Fiyatlandırma
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Hangi planı seçerseniz seçin, belgelerinizi sevene kadar ücretsiz.
            Bu bizim sözümüz.
          </p>
        </div>

        {/* Monthly / Yearly toggle */}
        <div className="mb-12 flex items-center justify-center gap-3">
          <button
            onClick={() => setIsYearly(false)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              !isYearly
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Aylık
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              isYearly
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Yıllık
            <Badge className="rounded-full bg-primary/10 text-primary border-0">
              -20%
            </Badge>
          </button>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Free plan */}
          <div className="rounded-xl border border-border bg-card p-8">
            <div className="mb-6">
              <p className="text-sm font-medium text-muted-foreground">
                Ücretsiz
              </p>
              <div className="mt-2 flex items-end gap-1">
                <span className="font-heading text-5xl font-bold">$0</span>
                <span className="mb-1 text-muted-foreground">/ay</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Bireysel kullanıcılar için
              </p>
            </div>

            <a
              href="#"
              className="mb-6 flex h-10 w-full items-center justify-center rounded-full border border-border bg-background text-sm font-normal tracking-wide text-foreground transition-all ease-out hover:bg-accent active:scale-95"
            >
              Ücretsiz Başla
            </a>

            <ul className="space-y-3">
              {FREE_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 shrink-0 text-muted-foreground" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Startup plan (popular) */}
          <div className="rounded-xl border border-primary/50 bg-card p-8 shadow-lg">
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Startup
                </p>
                <Badge variant="default">Popüler</Badge>
              </div>
              <div className="mt-2 flex items-end gap-1">
                <span className="font-heading text-5xl font-bold">
                  {isYearly ? "$10" : "$12"}
                </span>
                <span className="mb-1 text-muted-foreground">/ay</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Profesyoneller ve küçük takımlar
              </p>
            </div>

            <a
              href="#"
              className="mb-6 flex h-10 w-full items-center justify-center rounded-full bg-primary text-sm font-normal tracking-wide text-primary-foreground shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_3px_3px_-1.5px_rgba(16,24,40,0.06),0_1px_1px_rgba(16,24,40,0.08)] border border-white/[0.12] transition-all ease-out hover:bg-primary/80 active:scale-95"
            >
              Pro&apos;ya Yükselt
            </a>

            <ul className="space-y-3">
              {FREE_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                  {feature}
                </li>
              ))}
              {STARTUP_EXTRA_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Enterprise plan */}
          <div className="rounded-xl border border-border bg-card p-8">
            <div className="mb-6">
              <p className="text-sm font-medium text-muted-foreground">
                Kurumsal
              </p>
              <div className="mt-2 flex items-end gap-1">
                <span className="font-heading text-5xl font-bold">
                  {isYearly ? "$19" : "$24"}
                </span>
                <span className="mb-1 text-muted-foreground">/ay</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Büyük takımlar ve kurumsal organizasyonlar
              </p>
            </div>

            <a
              href="#"
              className="mb-6 flex h-10 w-full items-center justify-center rounded-full bg-foreground text-sm font-normal tracking-wide text-background shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),0_3px_3px_-1.5px_rgba(16,24,40,0.06),0_1px_1px_rgba(16,24,40,0.08)] border border-white/[0.06] transition-all ease-out hover:bg-foreground/90 active:scale-95"
            >
              Satışla İletişim
            </a>

            <ul className="space-y-3">
              {FREE_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 shrink-0 text-muted-foreground" />
                  {feature}
                </li>
              ))}
              {ENTERPRISE_EXTRA_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 shrink-0 text-muted-foreground" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
