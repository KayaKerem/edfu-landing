import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { ArrowRight } from "lucide-react";

function LayersIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M7.62758 1.09876C7.74088 1.03404 7.8691 1 7.99958 1C8.13006 1 8.25828 1.03404 8.37158 1.09876L13.6216 4.09876C13.7363 4.16438 13.8316 4.25915 13.8979 4.37347C13.9642 4.48779 13.9992 4.6176 13.9992 4.74976C13.9992 4.88191 13.9642 5.01172 13.8979 5.12604C13.8316 5.24036 13.7363 5.33513 13.6216 5.40076L8.37158 8.40076C8.25828 8.46548 8.13006 8.49952 7.99958 8.49952C7.8691 8.49952 7.74088 8.46548 7.62758 8.40076L2.37758 5.40076C2.26287 5.33513 2.16753 5.24036 2.10123 5.12604C2.03492 5.01172 2 4.88191 2 4.74976C2 4.6176 2.03492 4.48779 2.10123 4.37347C2.16753 4.25915 2.26287 4.16438 2.37758 4.09876L7.62758 1.09876Z" fill="currentColor"/>
      <path d="M2.56958 7.23928L2.37758 7.34928C2.26287 7.41491 2.16753 7.50968 2.10123 7.624C2.03492 7.73831 2 7.86813 2 8.00028C2 8.13244 2.03492 8.26225 2.10123 8.37657C2.16753 8.49089 2.26287 8.58566 2.37758 8.65128L7.62758 11.6513C7.74088 11.716 7.8691 11.75 7.99958 11.75C8.13006 11.75 8.25828 11.716 8.37158 11.6513L13.6216 8.65128C13.7365 8.58573 13.8321 8.49093 13.8986 8.3765C13.965 8.26208 14 8.13211 14 7.99978C14 7.86745 13.965 7.73748 13.8986 7.62306C13.8321 7.50864 13.7365 7.41384 13.6216 7.34828L13.4296 7.23828L9.11558 9.70328C8.77568 9.89744 8.39102 9.99956 7.99958 9.99956C7.60814 9.99956 7.22347 9.89744 6.88358 9.70328L2.56958 7.23928Z" fill="currentColor"/>
      <path d="M2.37845 10.5993L2.57045 10.4893L6.88445 12.9533C7.22435 13.1474 7.60901 13.2496 8.00045 13.2496C8.39189 13.2496 8.77656 13.1474 9.11645 12.9533L13.4305 10.4883L13.6225 10.5983C13.7374 10.6638 13.833 10.7586 13.8994 10.8731C13.9659 10.9875 14.0009 11.1175 14.0009 11.2498C14.0009 11.3821 13.9659 11.5121 13.8994 11.6265C13.833 11.7409 13.7374 11.8357 13.6225 11.9013L8.37245 14.9013C8.25915 14.966 8.13093 15 8.00045 15C7.86997 15 7.74175 14.966 7.62845 14.9013L2.37845 11.9013C2.2635 11.8357 2.16795 11.7409 2.10148 11.6265C2.03501 11.5121 2 11.3821 2 11.2498C2 11.1175 2.03501 10.9875 2.10148 10.8731C2.16795 10.7586 2.2635 10.6638 2.37845 10.5983V10.5993Z" fill="currentColor"/>
    </svg>
  );
}

export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden">
      {/* Radial gradient background */}
      <div
        className="absolute inset-0 -z-10 h-[750px] md:h-[950px] rounded-b-2xl border-b border-border"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 10%, var(--background) 40%, var(--primary) 100%)",
        }}
      />
      <div className="mx-auto max-w-6xl px-4 pt-40 pb-16 text-center">
        {/* Badge */}
        <div className="group mb-8 flex justify-center">
          <div className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 shadow-sm transition-all hover:border-border/80 hover:bg-accent/30">
            <LayersIcon className="mr-1.5 size-3.5 text-foreground dark:text-white" />
            <AnimatedShinyText className="text-xs font-medium">
              Özel otomasyonları keşfedin
            </AnimatedShinyText>
            <ArrowRight className="ml-1.5 size-2.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-[3rem] xl:text-6xl font-medium text-balance text-center text-foreground leading-none" style={{ letterSpacing: "-0.05em", fontFamily: "var(--font-geist)" }}>
          AI Asistanınızla Tanışın
          <br />
          İş Akışınızı Kolaylaştırın
        </h1>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-center text-muted-foreground font-medium text-balance tracking-tight" style={{ lineHeight: "calc(1.75 / 1.125)" }}>
          Dijital iş akışlarınızı kolaylaştırmak ve sıradan görevleri halletmek
          için tasarlanan yapay zeka asistanı, böylece gerçekten önemli olana
          odaklanabilirsiniz
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <a
            href="#pricing"
            className="bg-primary h-9 flex items-center justify-center text-sm font-normal tracking-wide rounded-full text-primary-foreground whitespace-nowrap w-32 px-4 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_3px_3px_-1.5px_rgba(16,24,40,0.06),0_1px_1px_rgba(16,24,40,0.08)] border border-white/[0.12] hover:bg-primary/80 transition-all ease-out active:scale-95"
          >
            Ücretsiz Dene
          </a>
          <a
            href="#"
            className="h-10 flex items-center justify-center whitespace-nowrap w-32 px-5 text-sm font-normal tracking-wide text-foreground rounded-full transition-all ease-out active:scale-95 bg-background border border-border hover:bg-accent"
          >
            Giriş Yap
          </a>
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
