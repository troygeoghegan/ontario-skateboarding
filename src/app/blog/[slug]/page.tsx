import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { blogPosts, findBlogPost } from "@/lib/content";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = findBlogPost(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: `A post from the Ontario Skateboarding archive — ${post.title}.`,
    openGraph: { images: post.cover ? [post.cover] : undefined },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = findBlogPost(slug);
  if (!post) notFound();

  const videos = post.page.videos;
  const galleryImages = post.images;

  return (
    <>
      <PageHeader
        label="Blog post"
        title={post.title}
        description="Imported from the Ontario Skateboarding archive."
        image={post.cover}
      />
      <article className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        {videos.length > 0 && (
          <div className="mb-12 space-y-6">
            {videos.map((src) => (
              <video
                key={src}
                src={src}
                controls
                preload="metadata"
                playsInline
                className="block aspect-video w-full border border-zinc-800 bg-black object-cover"
              />
            ))}
          </div>
        )}

        {galleryImages.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((src, i) => (
              <li key={src} className="relative aspect-[4/3] overflow-hidden border border-zinc-800 bg-zinc-900/40">
                <Image
                  src={src}
                  alt={`${post.title} — image ${i + 1}`}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="font-body text-zinc-500">
            This post doesn&apos;t have imagery imported yet.
          </p>
        )}

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-800 pt-8">
          <Link
            href="/blog"
            className="font-display text-sm font-bold uppercase tracking-wider text-zinc-400 hover:text-hazard"
          >
            ← All posts
          </Link>
          <a
            href={post.externalHref}
            target="_blank"
            rel="noreferrer"
            className="font-display text-xs font-bold uppercase tracking-widest text-hazard hover:underline"
          >
            Read the original post ↗
          </a>
        </div>
      </article>
    </>
  );
}
