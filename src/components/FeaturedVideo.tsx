import Link from "next/link";

type FeaturedVideoProps = {
  src: string;
  poster?: string;
  title: string;
  eyebrow?: string;
  description?: string;
  href?: string;
};

export function FeaturedVideo({
  src,
  poster,
  title,
  eyebrow = "Latest video",
  description,
  href,
}: FeaturedVideoProps) {
  return (
    <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-center">
      <div className="group relative overflow-hidden border border-zinc-800 bg-black">
        <video
          className="block aspect-video w-full object-cover"
          src={src}
          poster={poster}
          controls
          preload="metadata"
          playsInline
        />
      </div>
      <div>
        <p className="font-display text-xs font-bold uppercase tracking-[0.4em] text-hazard">
          {eyebrow}
        </p>
        <h3 className="mt-3 font-display text-3xl font-bold uppercase leading-tight tracking-tight text-white sm:text-4xl">
          {title}
        </h3>
        {description && (
          <p className="mt-4 font-body text-zinc-400">{description}</p>
        )}
        {href && (
          <Link
            href={href}
            className="mt-6 inline-flex border-2 border-hazard px-6 py-2.5 font-display text-xs font-bold uppercase tracking-widest text-hazard transition hover:bg-hazard hover:text-asphalt"
          >
            Read the story →
          </Link>
        )}
      </div>
    </div>
  );
}
