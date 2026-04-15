import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Blog",
  description: "News, video drops, and stories from the Ontario skate scene.",
};

const posts = [
  {
    slug: "halton-winter-spots",
    title: "Halton winter spot guide",
    date: "Mar 12, 2026",
    excerpt: "Where to ride when the plazas freeze — covered spots and courtesy rules.",
  },
  {
    slug: "filmer-toolkit",
    title: "The filmer’s roadside toolkit",
    date: "Feb 28, 2026",
    excerpt: "Batteries, fisheye, and backups so you never miss the make.",
  },
  {
    slug: "park-etiquette",
    title: "Park etiquette that actually matters",
    date: "Feb 02, 2026",
    excerpt: "Snaking, wax, and how to share a crowded ledge without heat.",
  },
];

export default function BlogPage() {
  return (
    <>
      <PageHeader
        label="Blog"
        title="Scene notes"
        description="Interviews, spot reports, and behind-the-scenes from Ontario crews."
      />
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <ul className="divide-y divide-zinc-800 border-t border-zinc-800">
          {posts.map((post) => (
            <li key={post.slug} className="py-8">
              <article>
                <time className="font-display text-xs font-bold uppercase tracking-widest text-hazard">
                  {post.date}
                </time>
                <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-white">
                  <Link
                    href={`/blog#${post.slug}`}
                    className="hover:text-hazard"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-2 font-body text-zinc-500">{post.excerpt}</p>
                <Link
                  href={`/blog#${post.slug}`}
                  className="mt-3 inline-block font-display text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white"
                >
                  Read more →
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
