import { DottedBackdrop } from "@/components/ui/dotted-backdrop";
import { TranscriptMini } from "@/components/mockups/transcript-mini";
import { MeetCrmConnector } from "@/components/mockups/meet-crm-connector";
import { StatusFeedMini } from "@/components/mockups/status-feed-mini";

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative bg-card">
      <div className="mx-auto max-w-[calc(100%-32px)] md:max-w-[calc(100%-48px)] py-16 lg:py-20 xl:py-28">
        {children}
      </div>
    </div>
  );
}

function CardArt({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative mb-6 aspect-[1.4] md:aspect-[1.618] lg:aspect-square w-full overflow-hidden">
      <DottedBackdrop />
      {children}
    </div>
  );
}

function CardCopy({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

export function MeetingBento() {
  return (
    <section className="relative">
      <header className="mx-auto max-w-7xl px-4 md:px-6 pt-16 pb-10 md:pt-20 md:pb-12 lg:pt-32 lg:pb-16 xl:pt-40 xl:pb-20">
        <h2 className="max-w-[820px] text-[32px] md:text-[48px] leading-[1.1] font-semibold tracking-[-0.015em]">
          <span className="text-foreground">
            From hello to handoff, every word lives in Attio.
          </span>{" "}
          <span className="text-muted-foreground">
            Search, replay, or uncover insights from any conversation.
          </span>
        </h2>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-border p-px">
        <Card>
          <CardArt>
            <TranscriptMini />
          </CardArt>
          <CardCopy
            title="Every call, every detail."
            body="Our native AI records, transcribes, and logs every call as you talk."
          />
        </Card>
        <Card>
          <CardArt>
            <MeetCrmConnector />
          </CardArt>
          <CardCopy
            title="No more lost call notes."
            body="Call recordings and meeting details are automatically linked to relevant records."
          />
        </Card>
        <Card>
          <CardArt>
            <StatusFeedMini />
          </CardArt>
          <CardCopy
            title="Context, not just content."
            body="Every conversation is instantly structured and searchable."
          />
        </Card>
      </div>
    </section>
  );
}
