import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { hasLocale, type Locale } from "@/dictionaries";

const COPY = {
  en: {
    title: "Automations",
    description:
      "This section is the visual showcase for Edfu's automation engine. It's intentionally lightweight so the landing CTA always resolves cleanly.",
    back: "Back to home",
  },
  tr: {
    title: "Otomasyonlar",
    description:
      "Bu sayfa, Edfu'nun otomasyon motoru için hafif bir geçiş alanıdır. Landing CTA'sinin her zaman çalıştığını garanti eder.",
    back: "Ana sayfaya dön",
  },
} as const;

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

  return {
    title: lang === "tr" ? "Otomasyonlar | Edfu" : "Automations | Edfu",
    description:
      lang === "tr"
        ? "Edfu otomasyon motorunun hafif giriş sayfası."
        : "Lightweight entry page for Edfu's automation engine.",
  };
}

export default async function AutomationsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const copy = COPY[lang as Locale];

  return (
    <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-4xl items-center px-4 py-16 sm:px-6">
      <div className="w-full rounded-2xl border border-border bg-card p-8 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Edfu
        </p>
        <h1
          className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-foreground"
          style={{ fontFamily: "var(--font-geist)" }}
        >
          {copy.title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
          {copy.description}
        </p>
        <div className="mt-8">
          <Link
            href={`/${lang}`}
            className="inline-flex items-center rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            {copy.back}
          </Link>
        </div>
      </div>
    </main>
  );
}
