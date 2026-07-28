import type { CmsSection } from "@/lib/edit-overrides";

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
