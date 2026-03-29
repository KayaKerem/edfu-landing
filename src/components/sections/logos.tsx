const LOGOS = [
  "OpenAI",
  "Retool",
  "Stripe",
  "Wise",
  "Loom",
  "Medium",
  "Cash App",
  "Linear",
];

export function Logos() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="mb-8 text-center text-sm text-muted-foreground">
          Hızla büyüyen startup&apos;ların tercihi
        </p>

        <div className="overflow-hidden rounded-xl border border-border">
          <div className="grid grid-cols-2 divide-x divide-y divide-border sm:grid-cols-4">
            {LOGOS.map((name) => (
              <div
                key={name}
                className="flex items-center justify-center px-6 py-8 transition hover:bg-accent/50"
              >
                <span className="font-bold text-foreground">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
