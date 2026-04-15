"use client";

import { useState, FormEvent } from "react";

type ContactFormProps = {
  id?: string;
  heading?: string;
  subheading?: string;
};

export function ContactForm({
  id = "contact",
  heading = "Get in touch",
  subheading = "Sponsorships, park days, or just say what’s up.",
}: ContactFormProps) {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <section
      id={id}
      className="border-t border-zinc-800 bg-gradient-to-b from-asphalt-50 to-asphalt py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl">
            {heading}
          </h2>
          <p className="mt-2 font-body text-zinc-500">{subheading}</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-10 max-w-xl space-y-5"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block sm:col-span-1">
              <span className="font-display text-xs font-bold uppercase tracking-wider text-zinc-400">
                Name
              </span>
              <input
                required
                name="name"
                type="text"
                autoComplete="name"
                className="mt-1.5 w-full border border-zinc-700 bg-zinc-900/80 px-4 py-3 font-body text-white placeholder-zinc-600 outline-none ring-hazard/0 transition focus:border-hazard focus:ring-2 focus:ring-hazard/30"
                placeholder="Your name"
              />
            </label>
            <label className="block sm:col-span-1">
              <span className="font-display text-xs font-bold uppercase tracking-wider text-zinc-400">
                Email
              </span>
              <input
                required
                name="email"
                type="email"
                autoComplete="email"
                className="mt-1.5 w-full border border-zinc-700 bg-zinc-900/80 px-4 py-3 font-body text-white placeholder-zinc-600 outline-none ring-hazard/0 transition focus:border-hazard focus:ring-2 focus:ring-hazard/30"
                placeholder="you@example.com"
              />
            </label>
          </div>
          <label className="block">
            <span className="font-display text-xs font-bold uppercase tracking-wider text-zinc-400">
              Message
            </span>
            <textarea
              required
              name="message"
              rows={4}
              className="mt-1.5 w-full resize-y border border-zinc-700 bg-zinc-900/80 px-4 py-3 font-body text-white placeholder-zinc-600 outline-none transition focus:border-hazard focus:ring-2 focus:ring-hazard/30"
              placeholder="What’s on your mind?"
            />
          </label>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <button
              type="submit"
              className="w-full border-2 border-hazard bg-hazard px-8 py-3 font-display text-sm font-bold uppercase tracking-widest text-asphalt transition hover:bg-transparent hover:text-hazard sm:w-auto"
            >
              Send message
            </button>
            {sent && (
              <p className="font-body text-sm text-hazard" role="status">
                Thanks — this demo doesn’t send mail yet. Wire it to your API
                when ready.
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
