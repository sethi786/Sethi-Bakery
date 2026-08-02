/** Sethi Bakery brand marks — pure SVG, no image assets needed. */

export function LogoRoundel({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="30" fill="#3E2A20" />
      <circle
        cx="32"
        cy="32"
        r="26.5"
        stroke="#C68A4B"
        strokeWidth="1.5"
        strokeDasharray="2 3"
      />
      {/* wheat sheaf */}
      <path
        d="M32 46V24"
        stroke="#E9D9B8"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <path
            d={`M32 ${27 + i * 5} C ${27 - i} ${25 + i * 5}, ${26 - i} ${29 + i * 5}, 32 ${31 + i * 5}`}
            fill="#C68A4B"
          />
          <path
            d={`M32 ${27 + i * 5} C ${37 + i} ${25 + i * 5}, ${38 + i} ${29 + i * 5}, 32 ${31 + i * 5}`}
            fill="#E9D9B8"
          />
        </g>
      ))}
      <path
        d="M28 20 C 30 16, 34 16, 36 20"
        stroke="#C68A4B"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function LogoWordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoRoundel size={compact ? 34 : 42} />
      <span className="leading-none">
        <span
          className="font-display block text-xl font-semibold tracking-wide text-cocoa"
          style={{ letterSpacing: "0.06em" }}
        >
          SETHI
        </span>
        <span className="block text-[0.6rem] font-medium uppercase tracking-[0.28em] text-caramel">
          Bakery
        </span>
      </span>
    </span>
  );
}
