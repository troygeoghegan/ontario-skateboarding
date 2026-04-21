import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ContactForm } from "@/components/ContactForm";
import { coverImage, topics } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach Ontario Skateboarding — events, media, and partnerships.",
};

export default function ContactPage() {
  const heroImg = coverImage(topics.slurpeeOpen) ?? coverImage(topics.dunbat2018);
  return (
    <>
      <PageHeader
        label="Contact"
        title="Let’s talk"
        description="Event submissions, shop wholesale, media requests, or general stoke — we read everything."
        image={heroImg}
      />
      <div className="mx-auto max-w-3xl px-4 pb-8 pt-4 sm:px-6 lg:px-8">
        <div className="border border-zinc-800 bg-zinc-900/20 p-6 font-body text-zinc-400">
          <p>
            <strong className="text-zinc-200">Email (placeholder):</strong>{" "}
            hello@ontarioskateboarding.ca
          </p>
          <p className="mt-2">
            <strong className="text-zinc-200">Region:</strong> Halton Region,
            Ontario, Canada
          </p>
        </div>
      </div>
      <ContactForm
        id="contact-form"
        heading="Send a message"
        subheading="We typically reply within a few days."
      />
    </>
  );
}
