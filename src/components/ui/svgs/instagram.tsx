"use client";

import { useId } from "react";

export function Instagram({ className }: { className?: string }) {
  const gradId = useId();
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none">
      <defs>
        <linearGradient id={gradId} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FEDA75"/>
          <stop offset="25%" stopColor="#FA7E1E"/>
          <stop offset="50%" stopColor="#D62976"/>
          <stop offset="75%" stopColor="#962FBF"/>
          <stop offset="100%" stopColor="#4F5BD5"/>
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5" stroke={`url(#${gradId})`} strokeWidth="1.5"/>
      <circle cx="12" cy="12" r="5" stroke={`url(#${gradId})`} strokeWidth="1.5"/>
      <circle cx="17.5" cy="6.5" r="1" fill={`url(#${gradId})`}/>
    </svg>
  );
}
