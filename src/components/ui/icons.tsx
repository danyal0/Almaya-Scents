type IconProps = {
  className?: string;
  size?: number;
};

export function InstagramIcon({ className, size = 18 }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      className={className}
    >
      <rect x="1.5" y="1.5" width="17" height="17" rx="4.5" />
      <circle cx="10" cy="10" r="4" />
      <circle cx="15" cy="5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ArrowRightIcon({ className, size = 22 }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={Math.round(size * 0.45)}
      viewBox="0 0 26 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      className={className}
    >
      <path d="M1 6h24m0 0l-5-5m5 5l-5 5" />
    </svg>
  );
}

export function MenuIcon({ className, size = 20 }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      className={className}
    >
      <path d="M2 6.25h16M2 13.75h16" />
    </svg>
  );
}

export function CloseIcon({ className, size = 18 }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      className={className}
    >
      <path d="M1 1l16 16M17 1L1 17" />
    </svg>
  );
}
