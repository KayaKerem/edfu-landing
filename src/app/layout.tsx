import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const BASE_URL = "https://edfu.com.tr";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  title: {
    default: "Edfu - Şirketinizin AI Bilgi Tabanı | Dokümanlardan Anında Cevap",
    template: "%s | Edfu",
  },
  description:
    "Şirketinizin bilgi birikimini yapay zekaya dönüştürün. Dokümanlarınızı yükleyin, 300+ AI modeli ile ekibiniz Türkçe sorular sorsun, anında doğru cevap alsın. 14 gün ücretsiz deneyin.",
  keywords: [
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
    "Edfu",
  ],
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
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: BASE_URL,
    siteName: "Edfu",
    title: "Edfu - Şirketinizin AI Bilgi Tabanı",
    description:
      "Dokümanlarınızı yükleyin, 300+ AI modeli ile ekibiniz Türkçe sorular sorsun, anında doğru cevap alsın. KVKK uyumlu, kurumsal düzeyde altyapı.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Edfu - Şirketinizin AI Bilgi Tabanı",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Edfu - Şirketinizin AI Bilgi Tabanı",
    description:
      "Dokümanlarınızı yükleyin, 300+ AI modeli ile ekibiniz Türkçe sorular sorsun, anında doğru cevap alsın.",
    images: ["/og-image.png"],
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
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
