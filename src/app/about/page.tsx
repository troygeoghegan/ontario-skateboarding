import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/PageHeader";
import { SectionLabel } from "@/components/SectionLabel";
import { coverImage, ownImages, topics } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Ontario Skateboarding — community roots in Halton Region, building Canadian skate culture.",
};

export default function AboutPage() {
  const heroImg = coverImage(topics.theBoard) ?? coverImage(topics.shredCentral);
  const boardPhotos = ownImages(topics.theBoard).slice(0, 6);

  return (
    <>
      <PageHeader
        label="About"
        title="Built in the streets & parks of Ontario"
        description="We’re a volunteer-led crew and network of skaters, filmers, and families who believe public skate spaces and grassroots events keep cities alive."
        image={heroImg}
      />

      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-6 font-body text-lg leading-relaxed text-zinc-400">
          <p>
            Ontario Skateboarding started as weekend sessions in{" "}
            <strong className="font-semibold text-zinc-200">Halton Region</strong>
            — linking Burlington, Oakville, Milton, and Halton Hills — and grew
            into a hub for news, video, and meetups across the province.
          </p>
          <p>
            We support{" "}
            <strong className="font-semibold text-zinc-200">
              inclusive skate culture
            </strong>
            : all ages, all genders, all setups. Whether you&apos;re learning
            kickturns or filming full parts, you belong in the session.
          </p>
          <p>
            This site is a home for{" "}
            <strong className="font-semibold text-zinc-200">
              Canadian skateboarding
            </strong>
            : event listings, local shop drops, and stories from crews who make
            Ontario roll.
          </p>
        </div>
      </article>

      {boardPhotos.length > 0 && (
        <section className="border-t border-zinc-800 bg-zinc-950 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionLabel>The board</SectionLabel>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl">
              Faces behind OSB
            </h2>
            <p className="mt-3 max-w-2xl font-body text-zinc-500">
              Volunteers, filmers, and organizers keeping the scene rolling.
            </p>
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {boardPhotos.map((src, i) => (
                <li
                  key={src}
                  className="relative aspect-[4/3] overflow-hidden border border-zinc-800"
                >
                  <Image
                    src={src}
                    alt={`OSB board member ${i + 1}`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
