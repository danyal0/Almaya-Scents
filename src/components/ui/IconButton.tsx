import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

const baseClasses =
  "inline-flex h-11 w-11 items-center justify-center text-current transition-opacity duration-[150ms] hover:opacity-60";

type CommonProps = {
  label: string;
  className?: string;
  children: ReactNode;
};

type IconButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type IconButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; external?: boolean };

export type IconButtonProps = IconButtonAsButton | IconButtonAsLink;

export function IconButton(props: IconButtonProps) {
  const { label, className, children } = props;
  const classes = cn(baseClasses, className);

  if (props.href !== undefined) {
    const { href, external, label: _l, className: _c, ...rest } = props;
    return (
      <a
        href={href}
        aria-label={label}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {children}
      </a>
    );
  }

  const { label: _l, className: _c, ...rest } = props;
  return (
    <button type="button" aria-label={label} className={classes} {...rest}>
      {children}
    </button>
  );
}
