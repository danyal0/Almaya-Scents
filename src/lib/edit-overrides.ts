export type ImageOverride = {
  src: string;
  alt?: string;
};

export type ContentOverrides = {
  texts: Record<string, string>;
  images: Record<string, ImageOverride>;
};

export const OVERRIDES_FILE_PATH = "/content-overrides.json";
export const OVERRIDES_STORAGE_KEY = "cms:overrides:v1";
export const AUTH_STORAGE_KEY = "cms:auth:v1";
export const PASSWORD_STORAGE_KEY = "cms:password:v1";
export const GITHUB_SETTINGS_STORAGE_KEY = "cms:github:v1";

const PUBLIC_BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");

export const EMPTY_OVERRIDES: ContentOverrides = {
  texts: {},
  images: {},
};

export function resolvePublicPath(path: string): string {
  if (!path.startsWith("/")) return path;
  if (!PUBLIC_BASE_PATH) return path;
  return `${PUBLIC_BASE_PATH}${path}`;
}

export function isBrowser(): boolean {
  return typeof window !== "undefined";
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
