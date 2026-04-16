export function Zoom({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none">
      <path d="M2 6.5A2.5 2.5 0 014.5 4h10A2.5 2.5 0 0117 6.5v6A2.5 2.5 0 0114.5 15h-10A2.5 2.5 0 012 12.5v-6z" fill="#2D8CFF"/>
      <path d="M17 8.5l4-2.5v7l-4-2.5" fill="#2D8CFF"/>
      <path d="M2 17h20v1a2 2 0 01-2 2H4a2 2 0 01-2-2v-1z" fill="#2D8CFF" opacity="0.3"/>
    </svg>
  );
}
