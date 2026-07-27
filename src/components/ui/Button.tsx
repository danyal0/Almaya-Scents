import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type Variant = "solid" | "outline" | "ghost";
type Tone = "ink" | "ivory";

const baseClasses =
  "inline-flex min-h-11 items-center justify-center gap-3 px-8 py-3 font-sans text-meta uppercase tracking-[0.18em] transition-colors duration-[250ms] ease-[var(--ease-standard)]";

const variantClasses: Record<Tone, Record<Variant, string>> = {
  ink: {
    solid: "bg-ink text-ivory hover:bg-charcoal",
    outline:
      "border border-line-strong text-ink hover:border-ink hover:bg-ink hover:text-ivory",
    ghost: "text-ink hover:text-muted",
  },
  ivory: {
    solid: "bg-ivory text-ink hover:bg-paper",
    outline:
      "border border-ivory/60 text-ivory hover:border-ivory hover:bg-ivory hover:text-ink",
    ghost: "text-ivory hover:text-ivory/70",
  },
};

type CommonProps = {
  variant?: Variant;
  tone?: Tone;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; external?: boolean };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const { variant = "solid", tone = "ink", className, children } = props;
  const classes = cn(baseClasses, variantClasses[tone][variant], className);

  if (props.href !== undefined) {
    const { href, external, variant: _v, tone: _t, className: _c, ...rest } = props;
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

  const { variant: _v, tone: _t, className: _c, ...rest } = props;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
