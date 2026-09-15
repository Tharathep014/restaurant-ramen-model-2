export function BowlMark({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path
        d="M15 10c-1 2 1 3 0 5M20 8c-1 2 1 3 0 5M25 10c-1 2 1 3 0 5"
        stroke="var(--accent)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M6 20h28c0 7.7-6.3 14-14 14S6 27.7 6 20Z"
        fill="var(--accent)"
        opacity="0.9"
      />
      <path d="M6 20h28" stroke="var(--accent-dark)" strokeWidth="1.4" />
    </svg>
  )
}

export function RippleDivider({ className = 'ripple-divider' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 28"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0 14 Q 25 0 50 14 T 100 14 T 150 14 T 200 14 T 250 14 T 300 14 T 350 14 T 400 14 V28 H0 Z"
        fill="currentColor"
      />
    </svg>
  )
}
