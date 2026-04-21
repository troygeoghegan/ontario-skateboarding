import Image from "next/image";
import Link from "next/link";

type MediaCardProps = {
  href: string;
  title: string;
  image?: string;
  eyebrow?: string;
  caption?: string;
  /** Tailwind aspect-ratio utility, defaults to 4/3. */
  aspect?: string;
  /** Corner ribbon, e.g. duration or category. */
  ribbon?: string;
  /** Optional placeholder gradient shown when no image is available. */
  fallbackGradient?: string;
  /** Show a circular play button overlay — for video posts. */
  showPlay?: boolean;
};

export function MediaCard({
  href,
  title,
  image,
  eyebrow,
  caption,
  aspect = "aspect-[4/3]",
  ribbon,
  fallbackGradient = "from-zinc-700 via-zinc-900 to-black",
  showPlay = false,
}: MediaCardProps) {
  return (
    <article className="group border border-zinc-800 bg-zinc-900/40 transition hover:border-hazard/60">
      <Link href={href} className="block">
        <div className={`relative overflow-hidden ${aspect}`}>
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div
              className={`absolute inset-0 bg-gradient-to-br ${fallbackGradient}`}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          {ribbon && (
            <span className="absolute bottom-3 right-3 rounded bg-black/80 px-2 py-0.5 font-mono text-xs text-hazard">
              {ribbon}
            </span>
          )}
          {showPlay && (
            <div className="absolute inset-0 flex items-center justify-center opacity-90 transition group-hover:opacity-100">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-white/10 backdrop-blur-sm">
                <span className="ml-1 h-0 w-0 border-y-[10px] border-l-[16px] border-y-transparent border-l-white" />
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          {eyebrow && (
            <p className="font-display text-[10px] font-bold uppercase tracking-widest text-hazard">
              {eyebrow}
            </p>
          )}
          <h3 className="mt-1 font-display text-lg font-bold uppercase leading-tight tracking-tight text-white group-hover:text-hazard">
            {title}
          </h3>
          {caption && (
            <p className="mt-1 font-body text-sm text-zinc-500">{caption}</p>
          )}
        </div>
      </Link>
    </article>
  );
}
