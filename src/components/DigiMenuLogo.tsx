import Link from "next/link";

type DigiMenuLogoProps = {
  href?: string;
  className?: string;
};

export function DigiMenuLogo({ href = "/", className = "" }: DigiMenuLogoProps) {
  // eslint-disable-next-line @next/next/no-img-element
  const logo = (
    <img
      src="/digimenu-logo.svg"
      alt="DigiMenu"
      width={152}
      height={29}
      className={`h-8 w-auto max-w-[min(100%,220px)] sm:h-9 ${className}`.trim()}
    />
  );

  if (!href) {
    return <span className="inline-flex shrink-0">{logo}</span>;
  }

  return (
    <Link href={href} className="inline-flex shrink-0">
      {logo}
    </Link>
  );
}
