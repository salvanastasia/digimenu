type IconProps = { className?: string };

export function GlobeIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 12h18M12 3c2.5 2.8 4 6 4 9s-1.5 6.2-4 9M12 3c-2.5 2.8-4 6-4 9s1.5 6.2 4 9" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function HeartMenuIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M12 20.5s-6.5-4.2-8.5-8.2C1.8 8.8 4.2 5 8 5c2 0 3.2 1.2 4 2.4.8-1.2 2-2.4 4-2.4 3.8 0 6.2 3.8 4.5 7.3-2 4-8.5 8.2-8.5 8.2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export function PaletteIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M12 3a9 9 0 1 0 8.5 11.8c-.5 1.5-2 2.2-3.5 1.5-.8-.4-1.4-.4-2.2 0-1.8 1-3.8-.2-3.8-2.2 0-1.2 1-2.2 2.2-2.2h1.5c2.2 0 4-1.8 4-4A7 7 0 0 0 5 12a7 7 0 0 0 7 7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="8.5" cy="11" r="1" fill="currentColor" />
      <circle cx="11.5" cy="8" r="1" fill="currentColor" />
      <circle cx="15" cy="10" r="1" fill="currentColor" />
    </svg>
  );
}

export function ShieldIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M12 3l7 3v6c0 4.2-2.8 7.8-7 9-4.2-1.2-7-4.8-7-9V6l7-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DashboardIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13" y="3" width="8" height="5" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13" y="10" width="8" height="11" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function SparklesIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M12 3l1.2 4.2L17.5 8.5 13.2 9.7 12 14l-1.2-4.3L6.5 8.5l4.3-1.3L12 3zM18 14l.8 2.8L21.5 17.5 19.3 18.3 18 21l-.8-2.7-2.7-.8 2.7-.8L18 14z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}
