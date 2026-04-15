import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-asphalt-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p className="font-display text-lg font-bold uppercase tracking-tight text-white">
            Ontario Skateboarding
          </p>
          <p className="mt-1 max-w-md font-body text-sm text-zinc-500">
            Halton Region, Ontario — Canadian skate community. Ride local. Film
            everything.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 font-display text-xs font-semibold uppercase tracking-wider text-zinc-400">
          <Link href="/about" className="hover:text-hazard">
            About
          </Link>
          <Link href="/events" className="hover:text-hazard">
            Events
          </Link>
          <Link href="/shop" className="hover:text-hazard">
            Shop
          </Link>
          <Link href="/blog" className="hover:text-hazard">
            Blog
          </Link>
          <a
            href="https://ontarioskateboarding.ca"
            className="hover:text-hazard"
            rel="noopener noreferrer"
            target="_blank"
          >
            ontarioskateboarding.ca
          </a>
        </div>
      </div>
      <div className="border-t border-zinc-800/80 py-4 text-center font-body text-xs text-zinc-600">
        © {new Date().getFullYear()} Ontario Skateboarding. All rights reserved.
      </div>
    </footer>
  );
}
