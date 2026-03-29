import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { Logos } from "@/components/sections/logos";
import { BentoFeatures } from "@/components/sections/bento-features";
import { Testimonial } from "@/components/sections/testimonial";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Security } from "@/components/sections/security";
import { Pricing } from "@/components/sections/pricing";
import { MarqueeTestimonials } from "@/components/sections/marquee-testimonials";
import { FAQ } from "@/components/sections/faq";
import { CTA } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Logos />
        <BentoFeatures />
        <Testimonial />
        <HowItWorks />
        <Security />
        <Pricing />
        <MarqueeTestimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
