import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { eventItems, findEvent } from "@/lib/content";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return eventItems.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const ev = findEvent(slug);
  if (!ev) return { title: "Event not found" };
  return {
    title: ev.title,
    description: `${ev.title} — Ontario Skateboarding event.`,
    openGraph: { images: ev.cover ? [ev.cover] : undefined },
  };
}

export default async function EventDetailPage({ params }: Params) {
  const { slug } = await params;
  const ev = findEvent(slug);
  if (!ev) notFound();

  return (
    <>
      <PageHeader
        label="Event"
        title={ev.title}
        description="From the Ontario Skateboarding events archive."
        image={ev.cover}
      />
      <article className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        {ev.images.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ev.images.map((src, i) => (
              <li key={src} className="relative aspect-[4/3] overflow-hidden border border-zinc-800 bg-zinc-900/40">
                <Image
                  src={src}
                  alt={`${ev.title} — image ${i + 1}`}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="font-body text-zinc-500">
            No imagery imported for this event.
          </p>
        )}

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-800 pt-8">
          <Link
            href="/events"
            className="font-display text-sm font-bold uppercase tracking-wider text-zinc-400 hover:text-hazard"
          >
            ← All events
          </Link>
          <a
            href={ev.externalHref}
            target="_blank"
            rel="noreferrer"
            className="font-display text-xs font-bold uppercase tracking-widest text-hazard hover:underline"
          >
            View original event page ↗
          </a>
        </div>
      </article>
    </>
  );
}
