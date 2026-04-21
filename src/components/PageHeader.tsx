import Image from "next/image";
import { SectionLabel } from "@/components/SectionLabel";

type PageHeaderProps = {
  label: string;
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
};

export function PageHeader({
  label,
  title,
  description,
  image,
  imageAlt,
}: PageHeaderProps) {
  if (image) {
    return (
      <div className="relative overflow-hidden border-b border-zinc-800">
        <Image
          src={image}
          alt={imageAlt ?? title}
          width={1920}
          height={900}
          priority
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-asphalt" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-12deg, transparent, transparent 40px, rgba(250,204,21,0.03) 40px, rgba(250,204,21,0.03) 41px)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
          <SectionLabel>{label}</SectionLabel>
          <h1 className="mt-3 font-display text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {description && (
            <p className="mt-4 max-w-2xl font-body text-lg text-zinc-200/90">
              {description}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-zinc-800 bg-gradient-to-b from-zinc-900/50 to-asphalt py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionLabel>{label}</SectionLabel>
        <h1 className="mt-3 font-display text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl font-body text-lg text-zinc-500">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
