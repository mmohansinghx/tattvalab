import Link from "next/link";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link className={`brand ${compact ? "brand--compact" : ""}`} href="/" aria-label="TattvaLab home">
      <svg className="brand__symbol" viewBox="0 0 42 42" role="img" aria-label="TattvaLab mark">
        <defs>
          <linearGradient id="brand-gradient" x1="4" y1="3" x2="37" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#283887" />
            <stop offset=".58" stopColor="#5e2c5e" />
            <stop offset="1" stopColor="#a21d2e" />
          </linearGradient>
        </defs>
        <rect x="1.5" y="1.5" width="39" height="39" rx="13" fill="url(#brand-gradient)" />
        <path d="M11 13h20M21 13v17M11 21h6m8 5h6" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="11" cy="21" r="2.2" fill="#e8eaf5" />
        <circle cx="31" cy="26" r="2.2" fill="#f2dfe2" />
        <circle cx="21" cy="30" r="2.2" fill="white" />
      </svg>
      {!compact && <span className="brand__wordmark">tattva<span>lab</span></span>}
    </Link>
  );
}
