/**
 * Thin-line SVG icon set — replaces every interface emoji. 24×24 viewBox,
 * stroke inherits currentColor so icons pick up text color automatically.
 */

type IconProps = { size?: number; className?: string; strokeWidth?: number };

function base(
  { size = 20, className = "", strokeWidth = 1.8 }: IconProps,
  children: React.ReactNode
) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const IconStore = (p: IconProps = {}) =>
  base(p, (
    <>
      <path d="M4 10v10h16V10" />
      <path d="M2 10l2-6h16l2 6" />
      <path d="M2 10c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3" />
      <path d="M9 20v-5h6v5" />
    </>
  ));

export const IconScooter = (p: IconProps = {}) =>
  base(p, (
    <>
      <circle cx="6" cy="17" r="2.5" />
      <circle cx="18" cy="17" r="2.5" />
      <path d="M6 17h7l2.5-6.5H19" />
      <path d="M13 6h2.5L18 14.5" />
      <path d="M4 9h5" />
    </>
  ));

export const IconBanknote = (p: IconProps = {}) =>
  base(p, (
    <>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M5.5 9.5h.01M18.5 14.5h.01" />
    </>
  ));

export const IconPhone = (p: IconProps = {}) =>
  base(p, (
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.13.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.27a2 2 0 0 1 2.1-.45c.9.34 1.84.57 2.8.7A2 2 0 0 1 22 16.9z" />
  ));

export const IconClock = (p: IconProps = {}) =>
  base(p, (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ));

export const IconPencil = (p: IconProps = {}) =>
  base(p, (
    <>
      <path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </>
  ));

export const IconBag = (p: IconProps = {}) =>
  base(p, (
    <>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </>
  ));

export const IconCheck = (p: IconProps = {}) =>
  base(p, <path d="m4 12.5 5.5 5.5L20 6.5" />);

export const IconStar = (p: IconProps = {}) =>
  base({ ...p, strokeWidth: 0 }, (
    <path
      fill="currentColor"
      d="M12 2.5l2.95 5.98 6.6.96-4.78 4.66 1.13 6.58L12 17.58l-5.9 3.1 1.13-6.58L2.45 9.44l6.6-.96L12 2.5z"
    />
  ));

export const IconMapPin = (p: IconProps = {}) =>
  base(p, (
    <>
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ));

export const IconWhatsApp = (p: IconProps = {}) =>
  base({ ...p, strokeWidth: 0 }, (
    <path
      fill="currentColor"
      d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.7.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.4-3c-.3-.4 0-.5.1-.7l.4-.5c.1-.2.2-.3.3-.5v-.5c0-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.9 2.9 4.6 4 .6.3 1.1.4 1.5.6.6.2 1.2.2 1.7.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.4z"
    />
  ));

export const IconShield = (p: IconProps = {}) =>
  base(p, (
    <>
      <path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10z" />
      <path d="m8.5 11.5 2.5 2.5 4.5-4.5" />
    </>
  ));

export const IconLeaf = (p: IconProps = {}) =>
  base(p, (
    <>
      <path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 16-9-1 12-5 16-9 16z" />
      <path d="M4 21c4-6 8-9 12-11" />
    </>
  ));

export const IconLock = (p: IconProps = {}) =>
  base(p, (
    <>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  ));

export const IconSearch = (p: IconProps = {}) =>
  base(p, (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </>
  ));

export const IconFlame = (p: IconProps = {}) =>
  base(p, (
    <path d="M12 22c4.4 0 7-2.8 7-6.5 0-2.5-1.4-4.6-3-6.5-.4 1.3-1.2 2.3-2.3 2.8C13.9 9 13 5.5 9.5 2c.3 3-1 5-2.6 6.8C5.4 10.5 5 12.3 5 15.5 5 19.2 7.6 22 12 22z" />
  ));

export const IconCake = (p: IconProps = {}) =>
  base(p, (
    <>
      <path d="M4 21h16v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8z" />
      <path d="M4 16c1.5 1 2.5 1 4 0s2.5-1 4 0 2.5 1 4 0 2.5-1 4 0" />
      <path d="M12 8v3M8 9v2M16 9v2" />
      <path d="M12 5.5a1.2 1.2 0 0 0 1.2-1.2C13.2 3.2 12 2 12 2s-1.2 1.2-1.2 2.3A1.2 1.2 0 0 0 12 5.5zM8 7a1 1 0 0 0 1-1c0-.9-1-1.9-1-1.9S7 5.1 7 6a1 1 0 0 0 1 1zM16 7a1 1 0 0 0 1-1c0-.9-1-1.9-1-1.9s-1 1-1 1.9a1 1 0 0 0 1 1z" />
    </>
  ));

/** Wheat-stalk flourish used beside section headings (echoes the logo). */
export const WheatFlourish = ({ className = "" }: { className?: string }) => (
  <svg
    width="52"
    height="14"
    viewBox="0 0 52 14"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <path d="M0 7h18M34 7h18" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    <path
      fill="currentColor"
      d="M26 1c-1.8 1.4-2.6 3-2.4 4.6C25.2 5.4 26 4 26 1zm0 0c1.8 1.4 2.6 3 2.4 4.6C26.8 5.4 26 4 26 1zM22 5c-.9 1.6-.9 3.1 0 4.4.9-1.3.9-2.8 0-4.4zm8 0c.9 1.6.9 3.1 0 4.4-.9-1.3-.9-2.8 0-4.4zM26 6.5c-1.2 1.8-1.2 3.7 0 5.5 1.2-1.8 1.2-3.7 0-5.5z"
    />
  </svg>
);

/** Payment method badges for the footer (simplified marks, not logos). */
export function PaymentBadges({ className = "" }: { className?: string }) {
  const label =
    "rounded border border-current/20 px-2 py-1 text-[0.6rem] font-bold tracking-wider";
  return (
    <div className={`flex flex-wrap items-center gap-1.5 opacity-80 ${className}`}>
      {["UPI", "VISA", "MASTERCARD", "RUPAY", "CASH ON DELIVERY"].map((m) => (
        <span key={m} className={label}>
          {m}
        </span>
      ))}
    </div>
  );
}
