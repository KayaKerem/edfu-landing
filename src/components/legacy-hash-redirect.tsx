"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const hashRoutes: Record<string, string> = {
  "#pricing": "/pricing",
  "#how-it-works": "/agents",
  "#features": "/agents",
};

export function LegacyHashRedirect() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    const redirect = hashRoutes[hash];
    if (redirect) {
      router.replace(redirect);
    }
  }, [router]);

  return null;
}
