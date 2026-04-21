import type { Metadata } from "next";
import { MediaCard } from "@/components/MediaCard";
import { PageHeader } from "@/components/PageHeader";
import { blogPosts, heroImage } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description: "News, video drops, and stories from the Ontario skate scene.",
};

export default function BlogPage() {
  return (
    <>
      <PageHeader
        label="Blog"
        title="Scene notes"
        description="Interviews, spot reports, and behind-the-scenes from Ontario crews."
        image={heroImage}
      />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <li key={post.slug}>
              <MediaCard
                href={post.href}
                title={post.title}
                image={post.cover}
                eyebrow={post.hasVideo ? "Video drop" : "Story"}
                caption={
                  post.images.length > 1
                    ? `${post.images.length} photos`
                    : "Read the post"
                }
                aspect="aspect-video"
                showPlay={post.hasVideo}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
