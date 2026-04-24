import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/dictionaries";
import type { Locale } from "@/dictionaries";
import type { Metadata } from "next";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";

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
  const isEn = lang === "en";

  return {
    title: isEn ? "Subprocessors | Edfu" : "Alt İşleyiciler | Edfu",
    description: isEn
      ? "Know exactly where your data is and how it is being used. Edfu's subprocessors."
      : "Verilerinizin nerede ve nasıl kullanıldığını tam olarak bilin. Edfu'nun alt işleyicileri.",
    alternates: {
      canonical: isEn ? "/en/subprocessors" : "/subprocessors",
      languages: {
        tr: "/subprocessors",
        en: "/en/subprocessors",
        "x-default": "/subprocessors",
      },
    },
    openGraph: {
      title: isEn ? "Subprocessors | Edfu" : "Alt İşleyiciler | Edfu",
      url: isEn
        ? `${BASE_URL}/en/subprocessors`
        : `${BASE_URL}/subprocessors`,
    },
  };
}

const subprocessors = [
  {
    name: "AWS",
    purpose: "Cloud infrastructure and hosting services",
    location: "United States",
    website: "https://aws.amazon.com",
  },
  {
    name: "Deepgram",
    purpose: "Speech-to-text and audio processing",
    location: "United States",
    website: "https://deepgram.com",
  },
  {
    name: "OpenAI",
    purpose: "AI language model services",
    location: "United States",
    website: "https://openai.com",
  },
  {
    name: "Grok",
    purpose: "AI language model services",
    location: "United States",
    website: "https://grok.x.ai",
  },
  {
    name: "Stripe",
    purpose: "Payment processing and billing",
    location: "United States",
    website: "https://stripe.com",
  },
  {
    name: "Intercom",
    purpose: "Customer support and messaging",
    location: "Ireland",
    website: "https://intercom.com",
  },
  {
    name: "Cloudflare",
    purpose: "CDN and security services",
    location: "United States",
    website: "https://cloudflare.com",
  },
  {
    name: "WorkOS",
    purpose: "Enterprise authentication and SSO",
    location: "United States",
    website: "https://workos.com",
  },
  {
    name: "Anthropic",
    purpose: "AI language model services",
    location: "United States",
    website: "https://anthropic.com",
  },
  {
    name: "Vercel",
    purpose: "Frontend hosting and deployment",
    location: "United States",
    website: "https://vercel.com",
  },
  {
    name: "Pusher",
    purpose: "Real-time messaging and notifications",
    location: "United Kingdom",
    website: "https://pusher.com",
  },
  {
    name: "Pinecone",
    purpose: "Vector database and search",
    location: "United States",
    website: "https://pinecone.io",
  },
  {
    name: "Neon",
    purpose: "Serverless PostgreSQL database",
    location: "United States",
    website: "https://neon.tech",
  },
  {
    name: "Slack",
    purpose: "Team communication and notifications",
    location: "United States",
    website: "https://slack.com",
  },
  {
    name: "PostHog",
    purpose: "Product analytics and event tracking",
    location: "United Kingdom",
    website: "https://posthog.com",
  },
  {
    name: "AssemblyAI",
    purpose: "Speech recognition and audio intelligence",
    location: "United States",
    website: "https://assemblyai.com",
  },
];

export default async function SubprocessorsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);

  return (
    <>
      <Navbar dict={dict.navbar} lang={lang} />
      <main style={{ paddingTop: 60 }}>
        <article
          style={{
            maxWidth: 832,
            margin: "0 auto",
            padding: "80px 24px 120px",
          }}
        >
          {/* Hero */}
          <header style={{ marginBottom: 48, textAlign: "center" }}>
            <h1
              className="text-[rgb(28,29,34)] dark:text-white"
              style={{
                fontFamily: "var(--font-heading), Arial, Helvetica, sans-serif",
                fontSize: 60,
                fontWeight: 500,
                lineHeight: "67.5px",
                margin: 0,
                padding: 0,
              }}
            >
              {dict.subprocessors.title}
            </h1>
            <p
              className="text-[rgb(145,148,161)] dark:text-[rgb(110,113,126)]"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                fontWeight: 500,
                lineHeight: "20px",
                margin: "12px 0 0",
              }}
            >
              {dict.subprocessors.date}
            </p>
            <p
              className="text-[rgb(113,113,122)] dark:text-[rgb(145,148,161)]"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 20,
                fontWeight: 400,
                lineHeight: "27.5px",
                letterSpacing: "-0.5px",
                margin: "32px 0 0",
              }}
            >
              {dict.subprocessors.description}
            </p>
          </header>

          {/* Table */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                {([
                  dict.subprocessors.colName,
                  dict.subprocessors.colPurpose,
                  dict.subprocessors.colLocation,
                  dict.subprocessors.colWebsite,
                ]).map((col) => (
                  <th
                    key={col}
                    className="text-[rgb(145,148,161)] dark:text-[rgb(110,113,126)] border-b border-[#EFEFF1] dark:border-[#2a2a35]"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 14,
                      fontWeight: 600,
                      lineHeight: "20px",
                      letterSpacing: "0.35px",
                      textTransform: "uppercase",
                      padding: "12px 16px",
                      textAlign: "left",
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subprocessors.map((row) => (
                <tr
                  key={row.name}
                  className="group border-b border-[#EFEFF1] dark:border-[#2a2a35]"
                >
                  <td
                    className="group-hover:bg-blue-50 dark:group-hover:bg-blue-950/40 transition-colors text-[#1F2937] dark:text-[#e2e4eb]"
                    style={{
                      padding: 16,
                      fontSize: 14,
                      lineHeight: "20px",
                      fontWeight: 500,
                    }}
                  >
                    {row.name}
                  </td>
                  <td
                    className="group-hover:bg-blue-50 dark:group-hover:bg-blue-950/40 transition-colors text-[#3F4756] dark:text-[#9194a1]"
                    style={{
                      padding: 16,
                      fontSize: 14,
                      lineHeight: "20px",
                      fontWeight: 400,
                    }}
                  >
                    {row.purpose}
                  </td>
                  <td
                    className="group-hover:bg-blue-50 dark:group-hover:bg-blue-950/40 transition-colors text-[#3F4756] dark:text-[#9194a1]"
                    style={{
                      padding: 16,
                      fontSize: 14,
                      lineHeight: "20px",
                      fontWeight: 400,
                    }}
                  >
                    {row.location}
                  </td>
                  <td
                    className="group-hover:bg-blue-50 dark:group-hover:bg-blue-950/40 transition-colors"
                    style={{
                      padding: 16,
                      fontSize: 14,
                      lineHeight: "20px",
                      fontWeight: 400,
                    }}
                  >
                    <a
                      href={row.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2563EB] dark:text-[#60a5fa] underline"
                    >
                      {row.website}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </main>
      <Footer dict={dict.footer} lang={lang} />
    </>
  );
}
