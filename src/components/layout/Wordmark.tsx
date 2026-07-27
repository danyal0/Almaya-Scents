import Link from "next/link";

import { getAssetPath } from "@/lib/assets";
import { cn } from "@/lib/utils";

const LOGO_SRC = "/images/logo/almaya-logo.jpg";
const LOGO_DIMENSION = 1080;

type WordmarkProps = {
  /**
   * primary — header / footer logo mark.
   * compact — slightly smaller lockup for tight contexts (e.g. mobile menu).
   * text — plain accessible text fallback.
   */
  variant?: "primary" | "compact" | "text";
  /** Wrap in a link to the home page. */
  asLink?: boolean;
  className?: string;
};

function WordmarkContent({
  variant,
  decorative,
}: {
  variant: "primary" | "compact" | "text";
  decorative: boolean;
}) {
  if (variant === "text") {
    return <span>Almaya Scents</span>;
  }

  const sizeClass =
    variant === "compact"
      ? "h-11 w-11 sm:h-12 sm:w-12"
      : "h-12 w-12 sm:h-14 sm:w-14";

  return (
    // eslint-disable-next-line @next/next/no-img-element -- static export uses local logo asset
    <img
      src={getAssetPath(LOGO_SRC)}
      alt={decorative ? "" : "Almaya Scents"}
      width={LOGO_DIMENSION}
      height={LOGO_DIMENSION}
      decoding="async"
      className={cn(sizeClass, "object-contain")}
    />
  );
}

export function Wordmark({
  variant = "primary",
  asLink = true,
  className,
}: WordmarkProps) {
  const classes = cn("inline-flex select-none items-center text-current", className);

  if (!asLink) {
    return (
      <span className={classes}>
        <WordmarkContent variant={variant} decorative={false} />
      </span>
    );
  }

  return (
    <Link href="/" aria-label="Almaya Scents — home" className={classes}>
      <WordmarkContent variant={variant} decorative />
    </Link>
  );
}
