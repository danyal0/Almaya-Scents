import type { Product } from "@/content/almaya-content";
import { hasScentNotes } from "@/content/almaya-content";

type ScentNotesProps = {
  product: Product;
};

const groups = [
  { key: "top", label: "Top" },
  { key: "heart", label: "Heart" },
  { key: "base", label: "Base" },
] as const;

/**
 * Renders the olfactory pyramid — only when verified notes exist.
 * Products without published notes show nothing (never "N/A").
 */
export function ScentNotes({ product }: ScentNotesProps) {
  if (!hasScentNotes(product)) return null;

  const notes = product.notes!;

  return (
    <section aria-label="Scent notes" className="border-t border-line pt-8">
      <h2 className="eyebrow">Notes</h2>
      <dl className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {groups.map(({ key, label }) => {
          const values = notes[key];
          if (!values || values.length === 0) return null;
          return (
            <div key={key} className="flex flex-col gap-2">
              <dt className="font-serif text-heading font-light text-ink">
                {label}
              </dt>
              <dd className="text-body-sm text-muted">{values.join(", ")}</dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
