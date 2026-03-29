import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "@fontsource-variable/inter";
import "@fontsource-variable/dm-sans";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";

export const metadata: Metadata = {
  title: "Edfu - AI Asistanınız",
  description:
    "Dijital iş akışlarınızı kolaylaştırmak ve sıradan görevleri halletmek için tasarlanan yapay zeka asistanı.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`min-h-screen font-sans antialiased ${GeistSans.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
