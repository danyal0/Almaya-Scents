import type { CmsSection, ContentOverrides } from "@/lib/edit-overrides";
import { pageKeysMatch } from "@/lib/edit-overrides";

/** Move a section to a new index and renumber order fields. */
export function moveSectionInList(
  sections: CmsSection[],
  sectionId: string,
  toIndex: number,
): CmsSection[] {
  const fromIndex = sections.findIndex((section) => section.id === sectionId);
  if (fromIndex < 0) return sections;

  const clamped = Math.max(0, Math.min(sections.length - 1, toIndex));
  if (fromIndex === clamped) return sections;

  const next = [...sections];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(clamped, 0, moved);

  return next.map((section, index) => ({ ...section, order: index }));
}

/** Reorder ids list like moveSectionInList, returning the new id order. */
export function moveIdInList(ids: string[], sectionId: string, toIndex: number): string[] {
  const fromIndex = ids.indexOf(sectionId);
  if (fromIndex < 0) return ids;

  const clamped = Math.max(0, Math.min(ids.length - 1, toIndex));
  if (fromIndex === clamped) return ids;

  const next = [...ids];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(clamped, 0, moved);
  return next;
}

/**
 * Apply a visible-page ordered id list onto the full draft.
 * Also normalizes matching sections onto `pageKey` so mixed legacy keys stop breaking moves.
 */
export function applyVisibleSectionOrder(
  current: ContentOverrides,
  orderedIds: string[],
  pageKey: string,
): ContentOverrides {
  if (orderedIds.length === 0) return current;

  const orderMap = new Map(orderedIds.map((id, index) => [id, index]));
  let changed = false;

  const sections = current.sections.map((section) => {
    const nextOrder = orderMap.get(section.id);
    if (nextOrder === undefined) return section;

    const needsPageKey = section.pageKey !== pageKey;
    const needsOrder = section.order !== nextOrder;
    if (!needsPageKey && !needsOrder) return section;

    changed = true;
    return {
      ...section,
      pageKey,
      order: nextOrder,
    };
  });

  return changed ? { ...current, sections } : current;
}

/** Sections visible on the current page, sorted by order. */
export function getVisiblePageSections(
  sections: CmsSection[],
  pageKey: string,
): CmsSection[] {
  return sections
    .filter((section) => pageKeysMatch(section.pageKey, pageKey))
    .sort((a, b) => a.order - b.order);
}

export function findSectionIndexAtPoint(
  clientX: number,
  clientY: number,
  sectionIds: string[],
): number | null {
  const el = document.elementFromPoint(clientX, clientY);
  const card = el?.closest("[data-cms-section-id]");
  if (!(card instanceof HTMLElement)) return null;
  const targetId = card.dataset.cmsSectionId;
  if (!targetId) return null;
  const index = sectionIds.indexOf(targetId);
  return index >= 0 ? index : null;
}
