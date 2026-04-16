export function WebForm({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M3 9h18"/>
      <rect x="6" y="12" width="12" height="2" rx="0.5"/>
      <rect x="6" y="16" width="8" height="2" rx="0.5"/>
    </svg>
  );
}
