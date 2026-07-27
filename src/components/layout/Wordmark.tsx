import Link from "next/link";

import { cn } from "@/lib/utils";

type WordmarkProps = {
  /**
   * primary — two-line editorial lockup for the header.
   * compact — single-line lockup for tight contexts.
   * text — plain accessible text fallback.
   */
  variant?: "primary" | "compact" | "text";
  /** Wrap in a link to the home page. */
  asLink?: boolean;
  className?: string;
};

function WordmarkContent({ variant }: { variant: "primary" | "compact" | "text" }) {
  if (variant === "text") {
    return <span>Almaya Scents</span>;
  }

  if (variant === "compact") {
    return (
      <span className="font-serif text-[1.05rem] font-medium uppercase leading-none tracking-[0.32em]">
        Almaya&nbsp;Scents
      </span>
    );
  }

  return (
    <span className="flex flex-col items-center gap-[0.28rem]">
      <span className="font-serif text-[1.35rem] font-medium uppercase leading-none tracking-[0.42em] [text-indent:0.42em] sm:text-[1.5rem]">
        Almaya
      </span>
      <span className="font-sans text-[0.5rem] font-normal uppercase leading-none tracking-[0.62em] [text-indent:0.62em] text-current/70 sm:text-[0.55rem]">
        Scents
      </span>
    </span>
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
        <WordmarkContent variant={variant} />
      </span>
    );
  }

  return (
    <Link href="/" aria-label="Almaya Scents — home" className={classes}>
      <WordmarkContent variant={variant} />
    </Link>
  );
}
