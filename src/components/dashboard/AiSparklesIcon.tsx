type AiSparklesIconProps = {
  className?: string;
};

export function AiSparklesIcon({ className }: AiSparklesIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M11 2.5 12.4 6.2 16 7.6 12.4 9 11 12.8 9.6 9 6 7.6 9.6 6.2 11 2.5Z" />
      <path d="M18.5 12.5 19.3 14.7 21.5 15.5 19.3 16.3 18.5 18.5 17.7 16.3 15.5 15.5 17.7 14.7 18.5 12.5Z" />
      <path d="M5.5 14.5 6.3 16.7 8.5 17.5 6.3 18.3 5.5 20.5 4.7 18.3 2.5 17.5 4.7 16.7 5.5 14.5Z" />
    </svg>
  );
}
