import Image from "next/image";
import type { Dictionary } from "@/dictionaries";

interface TestimonialProps {
  dict: Dictionary["testimonial"];
}

export function Testimonial({ dict }: TestimonialProps) {
  return (
    <section className="relative z-20 bg-white dark:bg-[oklch(0.14_0.005_250)] py-16 sm:py-20 px-4 sm:px-12 lg:px-20">
      <div className="mx-auto max-w-3xl">
        <blockquote className="text-xl sm:text-2xl font-medium leading-relaxed tracking-tight">
          {dict.quote}
        </blockquote>

        <div className="mt-8 flex items-center gap-4">
          <Image
            src="https://randomuser.me/api/portraits/men/52.jpg"
            alt={dict.authorAlt}
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover"
          />
          <div>
            <p className="font-medium text-foreground">{dict.authorName}</p>
            <p className="text-sm text-muted-foreground">{dict.authorTitle}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
