export function HydricLogo({ size = 28 }: { size?: number }) {
  return (
    <svg viewBox="0 0 128 128" width={size} height={size} xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="64" cy="64" r="62" fill="#8B9D87" />
      <g fill="#F4F1EA">
        <rect x="34" y="30" width="14" height="68" rx="1" />
        <rect x="80" y="30" width="14" height="68" rx="1" />
        <rect x="28" y="28" width="26" height="5" />
        <rect x="28" y="95" width="26" height="5" />
        <rect x="74" y="28" width="26" height="5" />
        <rect x="74" y="95" width="26" height="5" />
        <rect x="48" y="58" width="32" height="8" />
      </g>
      <path
        d="M48 62 Q56 50 64 62 T80 62"
        stroke="#F4F1EA"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
