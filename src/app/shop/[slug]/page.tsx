import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { productItems, findProduct } from "@/lib/content";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return productItems.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = findProduct(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.title,
    description: `${product.title} — Ontario Skateboarding shop.`,
    openGraph: { images: product.cover ? [product.cover] : undefined },
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = findProduct(slug);
  if (!product) notFound();

  const [primary, ...rest] = product.images;

  return (
    <>
      <PageHeader
        label="Product"
        title={product.title}
        description="Available in-store — contact us to arrange pickup or shipping."
      />
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4">
            {primary ? (
              <div className="relative aspect-square overflow-hidden border border-zinc-800 bg-zinc-900/40">
                <Image
                  src={primary}
                  alt={product.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="aspect-square border border-zinc-800 bg-gradient-to-br from-zinc-800 to-black" />
            )}
            {rest.length > 0 && (
              <ul className="grid grid-cols-4 gap-3">
                {rest.slice(0, 4).map((src, i) => (
                  <li
                    key={src}
                    className="relative aspect-square overflow-hidden border border-zinc-800"
                  >
                    <Image
                      src={src}
                      alt={`${product.title} — ${i + 2}`}
                      fill
                      sizes="25vw"
                      className="object-cover"
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <aside className="flex flex-col justify-center">
            <p className="font-display text-xs font-bold uppercase tracking-[0.4em] text-hazard">
              OSB Shop
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl">
              {product.title}
            </h2>
            <p className="mt-6 font-body text-zinc-400">
              Sourced and stocked by Ontario Skateboarding. Support a non-profit
              community helping Canadian skateboarding grow at the grassroots.
            </p>
            <button
              type="button"
              className="mt-8 w-full border-2 border-hazard bg-hazard px-6 py-3 font-display text-sm font-bold uppercase tracking-widest text-asphalt transition hover:bg-transparent hover:text-hazard sm:w-auto"
            >
              Enquire to purchase
            </button>
            <a
              href={product.externalHref}
              target="_blank"
              rel="noreferrer"
              className="mt-4 font-display text-xs font-bold uppercase tracking-widest text-hazard hover:underline"
            >
              View on ontarioskateboarding.ca ↗
            </a>
            <Link
              href="/shop"
              className="mt-6 font-display text-sm font-bold uppercase tracking-wider text-zinc-400 hover:text-white"
            >
              ← All products
            </Link>
          </aside>
        </div>
      </div>
    </>
  );
}
