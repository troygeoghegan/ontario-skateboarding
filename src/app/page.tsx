import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { FeaturedVideo } from "@/components/FeaturedVideo";
import { MediaCard } from "@/components/MediaCard";
import { SectionLabel } from "@/components/SectionLabel";
import {
  blogPosts,
  eventItems,
  heroImage,
  productItems,
} from "@/lib/content";
import { allVideos } from "@/lib/imported-media";

export default function HomePage() {
  const featuredVideoSrc = allVideos[0];
  const featuredVideoPost = blogPosts.find((p) => p.hasVideo);

  const featuredPosts = blogPosts
    .filter((p) => p.slug !== featuredVideoPost?.slug)
    .filter((p) => p.cover)
    .slice(0, 6);

  const featuredProducts = productItems.slice(0, 4);
  const upcomingEvents = eventItems.slice(0, 3);

  return (
    <>
      {/* Hero — full-width imagery */}
      <section className="relative min-h-[85vh] w-full overflow-hidden border-b border-zinc-800">
        <Image
          src={heroImage}
          alt="Ontario Skateboarding"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-asphalt via-asphalt/70 to-black/50" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-12deg, transparent, transparent 40px, rgba(250,204,21,0.03) 40px, rgba(250,204,21,0.03) 41px)",
          }}
        />
        <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-24 lg:px-8 lg:pb-32">
          <p className="font-display text-xs font-bold uppercase tracking-[0.4em] text-hazard sm:text-sm">
            Halton Region · Ontario · Canada
          </p>
          <h1 className="mt-4 max-w-5xl font-display text-5xl font-bold uppercase leading-[0.9] tracking-tight text-white sm:text-7xl lg:text-8xl">
            Concrete
            <span className="block text-zinc-300">is our</span>
            <span className="block text-hazard">canvas</span>
          </h1>
          <p className="mt-8 max-w-xl font-body text-lg text-zinc-200 sm:text-xl">
            Ontario Skateboarding brings together crews, filmers, and park rats
            across the province — rooted in Halton, open to everyone who rolls.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/events"
              className="inline-flex items-center justify-center border-2 border-hazard bg-hazard px-8 py-3 font-display text-sm font-bold uppercase tracking-widest text-asphalt transition hover:bg-transparent hover:text-hazard"
            >
              Upcoming events
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center border-2 border-zinc-300 px-8 py-3 font-display text-sm font-bold uppercase tracking-widest text-white transition hover:border-hazard hover:text-hazard"
            >
              Shop gear
            </Link>
          </div>
        </div>
      </section>

      {/* Featured video + latest stories */}
      <section className="border-b border-zinc-800 bg-asphalt py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <SectionLabel>Featured video</SectionLabel>
              <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl">
                Latest from the scene
              </h2>
            </div>
            <Link
              href="/blog"
              className="font-display text-sm font-bold uppercase tracking-wider text-hazard hover:underline"
            >
              More on the blog →
            </Link>
          </div>
          {featuredVideoSrc && featuredVideoPost && (
            <div className="mt-12">
              <FeaturedVideo
                src={featuredVideoSrc}
                poster={featuredVideoPost.cover}
                title={featuredVideoPost.title}
                description="A new part from the Ontario Skateboarding archive — filmed across the province."
                href={featuredVideoPost.href}
              />
            </div>
          )}

          <div className="mt-16">
            <SectionLabel>Latest posts</SectionLabel>
            <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredPosts.slice(0, 3).map((post) => (
                <li key={post.slug}>
                  <MediaCard
                    href={post.href}
                    title={post.title}
                    image={post.cover}
                    eyebrow="Story"
                    caption={
                      post.images.length > 1
                        ? `${post.images.length} photos`
                        : "Read the post"
                    }
                    aspect="aspect-video"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="border-b border-zinc-800 bg-zinc-950 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionLabel>Shop</SectionLabel>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl">
            Featured products
          </h2>
          <p className="mt-3 max-w-2xl font-body text-zinc-500">
            Decks, apparel, and small-run drops — support the community that
            builds the spots you skate.
          </p>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((p) => (
              <li key={p.slug}>
                <MediaCard
                  href={p.href}
                  title={p.title}
                  image={p.cover}
                  eyebrow="OSB Shop"
                  aspect="aspect-square"
                />
              </li>
            ))}
          </ul>
          <div className="mt-10 text-center">
            <Link
              href="/shop"
              className="inline-flex border-2 border-zinc-600 px-8 py-3 font-display text-sm font-bold uppercase tracking-widest text-white transition hover:border-hazard hover:text-hazard"
            >
              View all products
            </Link>
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="border-b border-zinc-800 bg-asphalt py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <SectionLabel>Events</SectionLabel>
              <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl">
                Jams &amp; meetups
              </h2>
              <p className="mt-3 max-w-xl font-body text-zinc-500">
                Past and upcoming events from across Halton and Ontario.
              </p>
            </div>
            <Link
              href="/events"
              className="shrink-0 font-display text-sm font-bold uppercase tracking-wider text-hazard hover:underline"
            >
              Full calendar →
            </Link>
          </div>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((ev) => (
              <li key={ev.slug}>
                <MediaCard
                  href={ev.href}
                  title={ev.title}
                  image={ev.cover}
                  eyebrow="Event"
                  caption={
                    ev.images.length
                      ? `${ev.images.length} photo${ev.images.length === 1 ? "" : "s"}`
                      : undefined
                  }
                  aspect="aspect-[4/3]"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ContactForm
        id="home-contact"
        heading="Hit us up"
        subheading="Questions about events, collabs, or carrying OSB in your shop."
      />
    </>
  );
}
