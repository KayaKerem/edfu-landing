import { TranscriptMini } from "@/components/mockups/transcript-mini";
import { MeetCrmConnector } from "@/components/mockups/meet-crm-connector";
import { StatusFeedMini } from "@/components/mockups/status-feed-mini";

interface BentoDict {
  headerTitle: string;
  headerSubtitle: string;
  cards: { title: string; body: string }[];
}

/* ── Dot pattern background (matches Attio's 10×10 dot lattice) ── */
function DotPattern({ id }: { id: string }) {
  return (
    <div className="text-[#D1D5DB] dark:text-[#72767A]/20">
    <svg
      width="100%"
      height="100%"
      className="absolute inset-0 text-[#D1D5DB] dark:opacity-20"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id={id}
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <rect x="5" y="5" width="1.2" height="1.2" fill="#D1D5DB"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
    </div>
  );
}

/* ── Top hatched gutter (diagonal stripes) ── */
function HatchedGutter() {
  return (
    <div className="relative h-5 max-xl:h-[18px] max-lg:h-4 dark:text-[#72767A]/20">
      {/* diagonal stripes */}
      {/* dashed horizontal bottom line */}
      <div
        className="absolute inset-x-0 bottom-0 h-px"
        // style={{
        //   backgroundImage:
        //     "repeating-linear-gradient(to right, hsl(var(--border)) 0 4px, transparent 4px 10px)",
        // }}
      />
    </div>
  );
}

interface BentoCardProps {
  patternId: string;
  visual: React.ReactNode;
  title: string;
  body: string;
  visualClass?: string;
}

function BentoCard({ patternId, visual, title, body, visualClass }: BentoCardProps) {
  return (
    <div className="grid grid-cols-12 bg-background">
      <div className="col-span-12 md:col-[2/-2] flex flex-col py-7 max-md:py-4 px-6 md:px-0">
        {/* Visual area: square on lg+, golden on md, fixed height on mobile */}
        <div className="relative mb-6 max-md:mb-3 aspect-square max-md:aspect-auto max-md:h-[175px] w-full md:max-lg:aspect-[1.618] overflow-hidden">
          <DotPattern id={patternId} />
          <div className={["absolute inset-0 size-full ", visualClass].filter(Boolean).join(" ")}>{visual}</div>
        </div>

        {/* Text */}
        <div className="flex flex-1 flex-col justify-between">
          <h3 className="text-balance text-lg font-semibold tracking-[-0.01em] text-foreground lg:max-xl:text-base max-md:text-base">
            {title}
          </h3>
          <p className="mt-1.5 text-balance text-[15px] leading-[1.5] text-muted-foreground lg:max-xl:text-sm max-md:text-sm">
            {body}
          </p>
        </div>
      </div>
    </div>
  );
}

export function MeetingBento({ dict }: { dict: BentoDict }) {
  return (
    <section className="relative">
      <div className="grid grid-cols-12">
        <header className="col-span-12 md:col-[2/-2] px-6 md:px-0 pt-[60px] pb-[40px] max-xl:pt-16 max-xl:pb-8 max-lg:pt-12 max-lg:pb-6 max-md:pt-8 max-md:pb-4">
          <div className="max-w-[36em]">
            <h2 className="inline text-pretty text-[24px] sm:text-[28px] lg:text-[32px] xl:text-[36px] font-semibold leading-snug tracking-[-0.045em] text-foreground">
              {dict.headerTitle}
            </h2>{" "}
            <p className="inline text-pretty text-[24px] sm:text-[28px] lg:text-[32px] xl:text-[36px] font-medium leading-snug tracking-[-0.045em] text-muted-foreground">
              {dict.headerSubtitle}
            </p>
          </div>
        </header>
      </div>

      {/* Top hatched gutter (full-bleed, diagonal stripes + dashed bottom line) */}
      <HatchedGutter />

      {/* Bento grid wrapper — col-[2/-2] inner column with hatched gutters on both sides */}
      <div className="relative grid grid-cols-12">
        {/* Left side hatched gutter */}
        <div
          className="hidden md:block md:col-[1/2] text-border/20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(125deg, transparent, transparent 6px, currentColor 6px, currentColor 7px)",
          }}
          aria-hidden="true"
        />

        <div className="col-span-12 md:col-[2/-2] relative">
          <div className="grid grid-cols-3 gap-px bg-border p-px max-lg:grid-cols-1">
            <BentoCard
              patternId="meetingBentoDots1"
              visual={<TranscriptMini />}
              title={dict.cards[0].title}
              body={dict.cards[0].body}
            />
            <BentoCard
              patternId="meetingBentoDots2"
              visual={<MeetCrmConnector />}
              title={dict.cards[1].title}
              body={dict.cards[1].body}
              visualClass="max-md:-translate-y-[12%]"
            />
            <BentoCard
              patternId="meetingBentoDots3"
              visual={<StatusFeedMini />}
              title={dict.cards[2].title}
              body={dict.cards[2].body}
            />
          </div>
        </div>

        {/* Right side hatched gutter */}
        <div
          className="hidden md:block md:col-[12/-1] text-border/20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(125deg, transparent, transparent 6px, currentColor 6px, currentColor 7px)",
          }}
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
