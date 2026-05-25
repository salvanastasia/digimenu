type WifiIconProps = {
  className?: string;
};

export function WifiIcon({ className = "size-6" }: WifiIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`block shrink-0 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 8.82a15 15 0 0 1 20 0" />
      <path d="M5 12.86a10 10 0 0 1 14 0" />
      <path d="M8.5 16.43a5 5 0 0 1 7 0" />
      <circle cx="12" cy="19.5" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  );
}
