import { useId } from "react";
import type { FlagSpec } from "@/lib/languages";

export function FlagIcon({ flag }: { flag: FlagSpec }) {
  if (flag.kind === "union-jack") {
    return <UnionJackIcon />;
  }

  return (
    <span className="flex h-full w-full">
      <span className="w-1/3" style={{ backgroundColor: flag.colors[0] }} />
      <span className="w-1/3" style={{ backgroundColor: flag.colors[1] }} />
      <span className="w-1/3" style={{ backgroundColor: flag.colors[2] }} />
    </span>
  );
}

function UnionJackIcon() {
  const id = useId().replace(/:/g, "");
  const clipId = `union-jack-clip-${id}`;
  const tId = `union-jack-t-${id}`;

  return (
    <svg
      className="block h-full w-full"
      viewBox="0 0 60 30"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <clipPath id={clipId}>
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <clipPath id={tId}>
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path
          d="M0,0 L60,30 M60,0 L0,30"
          clipPath={`url(#${tId})`}
          stroke="#C8102E"
          strokeWidth="4"
        />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}
