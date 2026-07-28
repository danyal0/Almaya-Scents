export type ImageOverride = {
  src: string;
  alt?: string;
};

export type CmsSection = {
  id: string;
  pageKey: string;
  type: "text" | "image" | "text-image";
  title: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
  order: number;
};

export type CmsPage = {
  slug: string;
  title: string;
  intro: string;
};

export type PositionOverride = {
  x: number;
  y: number;
};

export type ContentOverrides = {
  texts: Record<string, string>;
  images: Record<string, ImageOverride>;
  positions: Record<string, PositionOverride>;
  sections: CmsSection[];
  pages: CmsPage[];
};

export const OVERRIDES_FILE_PATH = "/content-overrides.json";
export const OVERRIDES_STORAGE_KEY = "cms:overrides:v1";
export const GITHUB_SETTINGS_STORAGE_KEY = "cms:github:v1";

const PUBLIC_BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");

export const EMPTY_OVERRIDES: ContentOverrides = {
  texts: {},
  images: {},
  positions: {},
  sections: [],
  pages: [],
};

export function resolvePublicPath(path: string): string {
  if (!path.startsWith("/")) return path;
  if (!PUBLIC_BASE_PATH) return path;
  return `${PUBLIC_BASE_PATH}${path}`;
}

export function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getCurrentPageKey(): string {
  if (!isBrowser()) return "/";
  const path = window.location.pathname.replace(PUBLIC_BASE_PATH, "") || "/";
  const normalized = path.endsWith("/") ? path : `${path}/`;
  const params = new URLSearchParams(window.location.search);
  const customSlug = params.get("slug");
  if (normalized === "/custom/" && customSlug) {
    return `custom:${customSlug}`;
  }
  return normalized;
}

export function createId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function readStoredOverrides(): ContentOverrides {
  if (!isBrowser()) return EMPTY_OVERRIDES;
  const raw = window.localStorage.getItem(OVERRIDES_STORAGE_KEY);
  if (!raw) return EMPTY_OVERRIDES;
  try {
    return normalizeOverrides(JSON.parse(raw));
  } catch {
    return EMPTY_OVERRIDES;
  }
}

export function writeStoredOverrides(overrides: ContentOverrides): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(OVERRIDES_STORAGE_KEY, JSON.stringify(overrides));
}

export function clearStoredOverrides(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(OVERRIDES_STORAGE_KEY);
}

export function normalizeOverrides(input: unknown): ContentOverrides {
  if (!input || typeof input !== "object") return EMPTY_OVERRIDES;
  const candidate = input as Partial<ContentOverrides>;
  return {
    texts: normalizeTexts(candidate.texts),
    images: normalizeImages(candidate.images),
    positions: normalizePositions(candidate.positions),
    sections: normalizeSections(candidate.sections),
    pages: normalizePages(candidate.pages),
  };
}

function normalizeTexts(input: unknown): Record<string, string> {
  if (!input || typeof input !== "object") return {};
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(input)) {
    if (typeof value === "string") out[key] = value;
  }
  return out;
}

function normalizeImages(input: unknown): Record<string, ImageOverride> {
  if (!input || typeof input !== "object") return {};
  const out: Record<string, ImageOverride> = {};
  for (const [key, value] of Object.entries(input)) {
    if (!value || typeof value !== "object") continue;
    const image = value as Partial<ImageOverride>;
    if (typeof image.src !== "string") continue;
    out[key] = {
      src: image.src,
      ...(typeof image.alt === "string" ? { alt: image.alt } : {}),
    };
  }
  return out;
}

function normalizePositions(input: unknown): Record<string, PositionOverride> {
  if (!input || typeof input !== "object") return {};
  const out: Record<string, PositionOverride> = {};
  for (const [key, value] of Object.entries(input)) {
    if (!value || typeof value !== "object") continue;
    const position = value as Partial<PositionOverride>;
    if (typeof position.x !== "number" || typeof position.y !== "number") continue;
    out[key] = { x: position.x, y: position.y };
  }
  return out;
}

function normalizeSections(input: unknown): CmsSection[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const section = item as Partial<CmsSection>;
      if (typeof section.id !== "string") return null;
      if (typeof section.pageKey !== "string") return null;
      const type =
        section.type === "image" || section.type === "text-image" || section.type === "text"
          ? section.type
          : "text";
      return {
        id: section.id,
        pageKey: section.pageKey,
        type,
        title: typeof section.title === "string" ? section.title : "",
        body: typeof section.body === "string" ? section.body : "",
        imageSrc: typeof section.imageSrc === "string" ? section.imageSrc : "",
        imageAlt: typeof section.imageAlt === "string" ? section.imageAlt : "",
        order: typeof section.order === "number" ? section.order : index,
      } satisfies CmsSection;
    })
    .filter((section): section is CmsSection => Boolean(section))
    .sort((a, b) => a.order - b.order);
}

function normalizePages(input: unknown): CmsPage[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const page = item as Partial<CmsPage>;
      if (typeof page.slug !== "string" || !page.slug.trim()) return null;
      return {
        slug: page.slug.trim().replace(/^\/+|\/+$/g, ""),
        title: typeof page.title === "string" ? page.title : page.slug,
        intro: typeof page.intro === "string" ? page.intro : "",
      } satisfies CmsPage;
    })
    .filter((page): page is CmsPage => Boolean(page));
}
