import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { SectionLabel } from "@/components/SectionLabel";

const videos = [
  {
    title: "Halton night session",
    duration: "4:12",
    slug: "night-session",
    grad: "from-zinc-700 via-zinc-900 to-black",
  },
  {
    title: "DIY spot check — spring",
    duration: "6:48",
    slug: "diy-spot",
    grad: "from-neutral-800 via-stone-950 to-black",
  },
  {
    title: "Street comp highlights",
    duration: "8:01",
    slug: "street-comp",
    grad: "from-zinc-600 via-zinc-900 to-asphalt",
  },
];

const products = [
  {
    name: "OSB Deck — natural",
    price: "$74.99 CAD",
    accent: "from-zinc-700 to-zinc-900",
  },
  {
    name: "Concrete crew hoodie",
    price: "$89.99 CAD",
    accent: "from-zinc-800 to-black",
  },
  {
    name: "Hazard stripe beanie",
    price: "$32.00 CAD",
    accent: "from-red-900/40 to-zinc-900",
  },
  {
    name: "Halton locals tee — black",
    price: "$42.00 CAD",
    accent: "from-neutral-900 to-zinc-950",
  },
];

const upcomingEvents = [
  {
    day: "26",
    month: "Apr",
    title: "Park clean-up & jam",
    where: "Acton skate plaza",
  },
  {
    day: "03",
    month: "May",
    title: "Beginner clinic",
    where: "Milton bowl",
  },
  {
    day: "17",
    month: "May",
    title: "Filmer’s night",
    where: "Oakville waterfront",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero — full width */}
      <section className="relative min-h-[85vh] w-full overflow-hidden border-b border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-br from-asphalt via-zinc-950 to-black" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-12deg, transparent, transparent 40px, rgba(250,204,21,0.03) 40px, rgba(250,204,21,0.03) 41px)",
          }}
        />
        <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-24 lg:px-8 lg:pb-32">
          <p className="font-display text-xs font-bold uppercase tracking-[0.4em] text-hazard sm:text-sm">
            Halton region · Ontario · Canada
          </p>
          <h1 className="mt-4 max-w-5xl font-display text-5xl font-bold uppercase leading-[0.9] tracking-tight text-white sm:text-7xl lg:text-8xl">
            Concrete
            <span className="block text-zinc-500">is our</span>
            <span className="block text-hazard">canvas</span>
          </h1>
          <p className="mt-8 max-w-xl font-body text-lg text-zinc-400 sm:text-xl">
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
              className="inline-flex items-center justify-center border-2 border-zinc-600 px-8 py-3 font-display text-sm font-bold uppercase tracking-widest text-white transition hover:border-white"
            >
              Shop gear
            </Link>
          </div>
        </div>
      </section>

      {/* Featured videos */}
      <section className="border-b border-zinc-800 bg-asphalt py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <SectionLabel>Featured videos</SectionLabel>
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
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((v) => (
              <li key={v.slug}>
                <article className="group border border-zinc-800 bg-zinc-900/40 transition hover:border-hazard/50">
                  <Link href="/blog" className="block">
                    <div
                      className={`relative aspect-video overflow-hidden bg-gradient-to-br ${v.grad}`}
                    >
                      <div
                        className="absolute inset-0 opacity-40 mix-blend-overlay"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 3px)",
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                      <span className="absolute bottom-3 right-3 rounded bg-black/80 px-2 py-0.5 font-mono text-xs text-hazard">
                        {v.duration}
                      </span>
                      <div className="absolute inset-0 flex items-center justify-center opacity-90 transition group-hover:opacity-100">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-white/10 backdrop-blur-sm">
                          <span className="ml-1 h-0 w-0 border-y-[10px] border-l-[16px] border-y-transparent border-l-white" />
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-display text-lg font-bold uppercase tracking-tight text-white group-hover:text-hazard">
                        {v.title}
                      </h3>
                      <p className="mt-1 font-body text-sm text-zinc-500">
                        Watch full cut + B-roll
                      </p>
                    </div>
                  </Link>
                </article>
              </li>
            ))}
          </ul>
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
            {products.map((p) => (
              <li key={p.name}>
                <Link
                  href="/shop"
                  className="group block border border-zinc-800 bg-asphalt-50 transition hover:border-hazard/60"
                >
                  <div
                    className={`relative aspect-square bg-gradient-to-br ${p.accent}`}
                  >
                    <div className="absolute inset-4 border border-white/10" />
                    <span className="absolute left-3 top-3 font-display text-[10px] font-bold uppercase tracking-widest text-white/60">
                      OSB
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-base font-bold uppercase tracking-tight text-white group-hover:text-hazard">
                      {p.name}
                    </h3>
                    <p className="mt-1 font-body text-sm text-zinc-400">
                      {p.price}
                    </p>
                  </div>
                </Link>
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
                What&apos;s coming up
              </h2>
              <p className="mt-3 max-w-xl font-body text-zinc-500">
                Jams, clinics, and meetups across Halton and beyond. Roll through.
              </p>
            </div>
            <Link
              href="/events"
              className="shrink-0 font-display text-sm font-bold uppercase tracking-wider text-hazard hover:underline"
            >
              Full calendar →
            </Link>
          </div>
          <ul className="mt-12 space-y-4">
            {upcomingEvents.map((ev) => (
              <li
                key={ev.title}
                className="flex flex-col gap-4 border border-zinc-800 bg-zinc-900/30 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                <div className="flex items-center gap-6">
                  <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center border-2 border-hazard bg-hazard/10 font-display">
                    <span className="text-2xl font-bold leading-none text-white">
                      {ev.day}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-hazard">
                      {ev.month}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold uppercase tracking-tight text-white">
                      {ev.title}
                    </h3>
                    <p className="mt-0.5 font-body text-sm text-zinc-500">
                      {ev.where}
                    </p>
                  </div>
                </div>
                <Link
                  href="/events"
                  className="font-display text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white"
                >
                  Details
                </Link>
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
