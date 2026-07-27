import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type AnimatedLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  external?: boolean;
  className?: string;
  children: ReactNode;
};

/** Text link with the editorial underline reveal. */
export function AnimatedLink({
  href,
  external,
  className,
  children,
  ...rest
}: AnimatedLinkProps) {
  const classes = cn(
    "link-underline font-sans text-meta uppercase tracking-[0.18em] text-ink",
    className,
  );

  if (external) {
    return (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}
