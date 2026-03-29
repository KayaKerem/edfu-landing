import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 pt-20 pb-16 text-center">
        {/* Badge */}
        <Badge
          variant="outline"
          className="mb-6 inline-flex h-auto rounded-full px-4 py-1.5 text-sm"
        >
          <span className="mr-1">👋</span> Özel otomasyonları keşfedin
        </Badge>

        {/* Heading */}
        <h1 className="font-heading text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
          AI Asistanınızla Tanışın
          <br />
          İş Akışınızı Kolaylaştırın
        </h1>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Dijital iş akışlarınızı kolaylaştırmak ve sıradan görevleri halletmek
          için tasarlanan yapay zeka asistanı, böylece gerçekten önemli olana
          odaklanabilirsiniz
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button size="lg" className="rounded-full px-8">
            Ücretsiz Dene
          </Button>
          <Button variant="outline" size="lg" className="rounded-full px-8">
            Giriş Yap
          </Button>
        </div>

        {/* Browser Mockup */}
        <div className="relative mt-16">
          {/* Gradient blur background */}
          <div className="pointer-events-none absolute inset-0 -top-10">
            <div className="absolute inset-x-0 top-0 h-full rounded-full bg-gradient-to-b from-primary/10 via-primary/5 to-transparent blur-3xl" />
          </div>

          {/* Browser frame */}
          <div className="relative rounded-xl border border-border bg-card shadow-2xl">
            {/* Top bar */}
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <div className="flex gap-1.5">
                <span className="block size-3 rounded-full bg-red-400" />
                <span className="block size-3 rounded-full bg-yellow-400" />
                <span className="block size-3 rounded-full bg-green-400" />
              </div>
              <div className="mx-auto flex h-6 w-full max-w-sm items-center justify-center rounded-md bg-muted px-3 text-xs text-muted-foreground">
                edfu.ai
              </div>
              <div className="w-[52px]" />
            </div>

            {/* Content area */}
            <div className="h-[300px] rounded-b-xl bg-gradient-to-br from-primary/10 via-primary/5 to-background sm:h-[400px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
