import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Events",
  description: "Skate jams, clinics, and community events in Halton and Ontario.",
};

const events = [
  {
    day: "26",
    month: "Apr 2026",
    title: "Park clean-up & jam",
    where: "Acton skate plaza",
    body: "Bring gloves; BBQ after. All wheels welcome.",
  },
  {
    day: "03",
    month: "May 2026",
    title: "Beginner clinic",
    where: "Milton bowl",
    body: "Pads encouraged. Loaner boards on request.",
  },
  {
    day: "17",
    month: "May 2026",
    title: "Filmer’s night",
    where: "Oakville waterfront",
    body: "Long lens, low light — clip swap at midnight.",
  },
  {
    day: "07",
    month: "Jun 2026",
    title: "Go Skate Day Ontario",
    where: "Multiple Halton spots",
    body: "Route TBA — follow for live map.",
  },
];

export default function EventsPage() {
  return (
    <>
      <PageHeader
        label="Events"
        title="Calendar"
        description="Halton-heavy lineup with road trips and collabs across Ontario. Times are local unless noted."
      />
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <ul className="space-y-6">
          {events.map((ev) => (
            <li
              key={ev.title}
              className="border border-zinc-800 bg-zinc-900/20 p-6 sm:flex sm:gap-8"
            >
              <div className="mb-4 flex h-20 w-20 shrink-0 flex-col items-center justify-center border-2 border-hazard bg-hazard/5 font-display sm:mb-0">
                <span className="text-3xl font-bold text-white">{ev.day}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-hazard">
                  {ev.month}
                </span>
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-white">
                  {ev.title}
                </h2>
                <p className="mt-1 font-display text-sm font-semibold uppercase tracking-wider text-zinc-500">
                  {ev.where}
                </p>
                <p className="mt-3 font-body text-zinc-400">{ev.body}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-12 border border-dashed border-zinc-700 p-6 text-center font-body text-sm text-zinc-500">
          Want your event listed?{" "}
          <Link href="/contact" className="text-hazard hover:underline">
            Contact us
          </Link>{" "}
          with date, location, and a one-line description.
        </p>
      </div>
    </>
  );
}
