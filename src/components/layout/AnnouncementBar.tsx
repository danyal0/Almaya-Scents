import { almayaContent } from "@/content/almaya-content";

export function AnnouncementBar() {
  return (
    <aside
      aria-label="Announcement"
      className="flex min-h-[var(--announcement-height)] items-center justify-center bg-ink px-5 py-2.5 text-center"
    >
      <p className="max-w-[40rem] font-sans text-[0.6875rem] uppercase leading-snug tracking-[0.16em] text-ivory/90">
        {almayaContent.announcement}
      </p>
    </aside>
  );
}
