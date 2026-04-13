export function Webhook({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="6" cy="18" r="3"/>
      <path d="M9 18h6a3 3 0 003-3v0" strokeDasharray="3 2"/>
      <circle cx="18" cy="6" r="3"/>
      <path d="M15 6H9a3 3 0 00-3 3v0" strokeDasharray="3 2"/>
    </svg>
  );
}
