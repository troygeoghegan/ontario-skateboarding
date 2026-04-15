import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Shop",
  description: "Decks, apparel, and OSB merch — support Ontario skateboarding.",
};

const catalog = [
  { name: "OSB Deck — natural", price: "$74.99", tag: "8.25 / 8.5" },
  { name: "OSB Deck — stain black", price: "$74.99", tag: "8.0 / 8.25" },
  { name: "Concrete crew hoodie", price: "$89.99", tag: "Unisex" },
  { name: "Halton locals tee", price: "$42.00", tag: "S–XXL" },
  { name: "Hazard stripe beanie", price: "$32.00", tag: "OSB woven label" },
  { name: "Sticker slab (10-pack)", price: "$15.00", tag: "Assorted" },
];

export default function ShopPage() {
  return (
    <>
      <PageHeader
        label="Shop"
        title="Gear up"
        description="Every purchase helps fund community events and spot maintenance in Halton and beyond."
      />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {catalog.map((item) => (
            <li
              key={item.name}
              className="border border-zinc-800 bg-asphalt-50 transition hover:border-hazard/50"
            >
              <div className="relative aspect-[4/3] bg-gradient-to-br from-zinc-800 to-black">
                <span className="absolute left-3 top-3 font-display text-[10px] font-bold uppercase tracking-widest text-white/50">
                  {item.tag}
                </span>
              </div>
              <div className="p-5">
                <h2 className="font-display text-lg font-bold uppercase tracking-tight text-white">
                  {item.name}
                </h2>
                <p className="mt-2 font-body text-hazard">{item.price} CAD</p>
                <button
                  type="button"
                  className="mt-4 w-full border border-zinc-600 py-2.5 font-display text-xs font-bold uppercase tracking-widest text-zinc-300 transition hover:border-hazard hover:text-hazard"
                >
                  Add to cart (demo)
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
