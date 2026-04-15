import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/shop", label: "Shop" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-asphalt/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-display text-lg font-bold uppercase tracking-tight text-white sm:text-xl"
        >
          Ontario<span className="text-hazard">Skate</span>
        </Link>
        <nav
          className="flex flex-wrap items-center justify-end gap-x-1 gap-y-2 font-display text-xs font-semibold uppercase tracking-wider sm:gap-x-2 sm:text-sm"
          aria-label="Main"
        >
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded px-2 py-1 text-zinc-300 transition hover:bg-zinc-800 hover:text-white sm:px-3"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
