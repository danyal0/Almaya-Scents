import { almayaContent } from "@/content/almaya-content";

export function AnnouncementBar() {
  return (
    <aside
      aria-label="Announcement"
      className="flex min-h-[var(--announcement-height)] items-center justify-center bg-ink px-4 py-2 text-center"
    >
      <p className="font-sans text-[0.6875rem] uppercase leading-snug tracking-[0.18em] text-ivory/90">
        {almayaContent.announcement}
      </p>
    </aside>
  );
}
