import type { Metadata } from "next";
import { MediaCard } from "@/components/MediaCard";
import { PageHeader } from "@/components/PageHeader";
import { productItems, topics, coverImage } from "@/lib/content";

export const metadata: Metadata = {
  title: "Shop",
  description: "Decks, apparel, and OSB merch — support Ontario skateboarding.",
};

export default function ShopPage() {
  const heroImg = coverImage(topics.theBoard) ?? coverImage(topics.shredCentral);

  return (
    <>
      <PageHeader
        label="Shop"
        title="Gear up"
        description="Every purchase helps fund community events and spot maintenance in Halton and beyond."
        image={heroImg}
      />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {productItems.map((item) => (
            <li key={item.slug}>
              <MediaCard
                href={item.href}
                title={item.title}
                image={item.cover}
                eyebrow="OSB Shop"
                caption={
                  item.images.length > 1
                    ? `${item.images.length} images`
                    : "View product"
                }
                aspect="aspect-[4/3]"
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
