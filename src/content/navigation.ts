export type NavItem = {
  label: string;
  href: string;
};

export const primaryNavigation: NavItem[] = [
  { label: "Collection", href: "/products/" },
  { label: "About", href: "/about/" },
  { label: "Journal", href: "/journal/" },
  { label: "Contact", href: "/contact/" },
];

export const footerNavigation: NavItem[] = [
  { label: "Collection", href: "/products/" },
  { label: "About", href: "/about/" },
  { label: "Journal", href: "/journal/" },
  { label: "Contact", href: "/contact/" },
];

export const legalNavigation: NavItem[] = [
  { label: "Privacy", href: "/privacy/" },
  { label: "Terms", href: "/terms/" },
];
