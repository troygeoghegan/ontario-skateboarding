import type { Metadata } from "next";
import Link from "next/link";
import { MediaCard } from "@/components/MediaCard";
import { PageHeader } from "@/components/PageHeader";
import { eventItems, topics } from "@/lib/content";
import { coverImage } from "@/lib/content";

export const metadata: Metadata = {
  title: "Events",
  description: "Skate jams, clinics, and community events in Halton and Ontario.",
};

export default function EventsPage() {
  const heroImg = coverImage(topics.dunbat2022) ?? coverImage(topics.slurpeeOpen);

  return (
    <>
      <PageHeader
        label="Events"
        title="Calendar"
        description="Jams, clinics, and meetups from Ontario Skateboarding's running archive."
        image={heroImg}
      />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {eventItems.map((ev) => (
            <li key={ev.slug}>
              <MediaCard
                href={ev.href}
                title={ev.title}
                image={ev.cover}
                eyebrow="Event"
                caption={
                  ev.images.length
                    ? `${ev.images.length} photo${ev.images.length === 1 ? "" : "s"}`
                    : "Details"
                }
                aspect="aspect-[4/3]"
              />
            </li>
          ))}
        </ul>
        <p className="mt-12 border border-dashed border-zinc-700 p-6 text-center font-body text-sm text-zinc-500">
          Want your event listed?{" "}
          <Link href="/contact" className="text-hazard hover:underline">
            Contact us
          </Link>{" "}
          with date, location, and a one-line description.
        </p>
      </div>
    </>
  );
}
