import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "About",
  description:
    "Ontario Skateboarding — community roots in Halton Region, building Canadian skate culture.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        label="About"
        title="Built in the streets & parks of Ontario"
        description="We’re a volunteer-led crew and network of skaters, filmers, and families who believe public skate spaces and grassroots events keep cities alive."
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
    </>
  );
}
