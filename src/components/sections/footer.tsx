import { Zap } from "lucide-react";

const columns = [
  {
    heading: "Şirket",
    links: ["Hakkımızda", "İletişim", "Blog", "Basın", "Hikayemiz"],
  },
  {
    heading: "Ürünler",
    links: ["Şirket", "Ürün", "Basın", "Daha Fazla"],
  },
  {
    heading: "Kaynaklar",
    links: ["Basın", "Kariyer", "Bültenler", "Daha Fazla"],
  },
] as const;

const badges = ["SOC 2", "HIPAA", "GDPR"] as const;

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand section */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <a href="#hero" className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
                <Zap className="size-4.5 fill-primary-foreground text-primary-foreground" />
              </div>
              <span className="text-lg font-heading font-bold tracking-tight">
                Edfu
              </span>
            </a>

            {/* Description */}
            <p className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed">
              Dijital iş akışlarınızı kolaylaştırmak ve sıradan görevleri
              halletmek için tasarlanan yapay zeka asistanı, böylece gerçekten
              önemli olana odaklanabilirsiniz
            </p>

            {/* Compliance badges */}
            <div className="mt-6 flex items-center gap-3">
              {badges.map((badge) => (
                <div
                  key={badge}
                  className="h-10 w-10 rounded-full border border-border bg-card flex items-center justify-center"
                >
                  <span className="text-[10px] font-bold text-muted-foreground leading-tight text-center">
                    {badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.heading}>
              <h4 className="font-heading font-bold text-sm mb-4">
                {col.heading}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Dot grid decoration */}
      <div className="relative h-32 overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="w-full h-full opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle, currentColor 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>
      </div>
    </footer>
  );
}
