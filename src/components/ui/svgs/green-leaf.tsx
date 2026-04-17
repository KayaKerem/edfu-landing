export function GreenLeaf({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="presentation"
    >
      {/* Leaf — two simple curves forming a stylised teardrop */}
      <path
        d="M4 15.5C4 9.7 9 4.5 14.5 4.5C17 4.5 19 5 20 5.5C20 11.2 15 16.5 9.5 16.5C7 16.5 5 16 4 15.5Z"
        fill="#2E8B57"
      />
      <path
        d="M4 15.5C7 13 10 10.5 14 8"
        stroke="#1F5F3D"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* Lock badge — small shield in bottom-right */}
      <rect x="14" y="14" width="8" height="8" rx="2" fill="white" stroke="#CAD0D9" strokeWidth="0.6" />
      <path
        d="M16.5 17V16.2C16.5 15.3 17.2 14.6 18 14.6C18.8 14.6 19.5 15.3 19.5 16.2V17"
        stroke="#1F5F3D"
        strokeWidth="0.8"
        fill="none"
      />
      <rect x="16" y="17" width="4" height="3.2" rx="0.6" fill="#1F5F3D" />
    </svg>
  );
}
