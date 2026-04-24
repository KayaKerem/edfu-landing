"use client";

import { useState } from "react";
import { Pricing, type Billing } from "@/components/sections/pricing";
import { PricingTable } from "@/components/sections/pricing-table";
import { FAQ } from "@/components/sections/faq";
import type { Dictionary } from "@/dictionaries";

interface PricingClientProps {
  pricingDict: Dictionary["pricing"];
  faqDict: Dictionary["faq"];
}

export function PricingClient({ pricingDict, faqDict }: PricingClientProps) {
  const [billing, setBilling] = useState<Billing>("annual");

  return (
    <>
      <Pricing dict={pricingDict} billing={billing} onBillingChange={setBilling} />
      <PricingTable dict={pricingDict} billing={billing} onBillingChange={setBilling} />
      <FAQ dict={faqDict} />
    </>
  );
}
