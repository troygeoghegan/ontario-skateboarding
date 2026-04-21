import {
  allPages,
  blogPages,
  eventsPages,
  shopPages,
  sitePages,
  home,
  type PageMedia,
} from "@/lib/imported-media";

/** The subset of a page's images that were actually uploaded to / for that
 *  page (assets living in its own folder).  Filters out shared decorative
 *  assets (site-wide logos etc.) that happen to appear on every page. */
export function ownImages(page: PageMedia): readonly string[] {
  const prefix = `/imported/${page.slug}/`;
  return page.images.filter((i) => i.startsWith(prefix));
}

/** The best "cover" image for a page — its own first image if it has any,
 *  otherwise the first shared image as a fallback. */
export function coverImage(page: PageMedia): string | undefined {
  return ownImages(page)[0] ?? page.images[0];
}

/** Trailing slug segment of a page's URL path, e.g. /post/foo -> "foo". */
export function tailSlug(page: PageMedia): string {
  const parts = page.path.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? page.slug;
}

// ---------- Blog ----------------------------------------------------------

export type BlogPostItem = {
  slug: string;               // tail slug, e.g. "4-20-2021"
  title: string;
  href: string;               // internal route
  externalHref: string;       // live Wix URL
  cover?: string;
  images: readonly string[];  // own images only (for detail gallery)
  hasVideo: boolean;
  page: PageMedia;
};

function toBlogItem(page: PageMedia): BlogPostItem {
  const slug = tailSlug(page);
  return {
    slug,
    title: page.title,
    href: `/blog/${slug}`,
    externalHref: page.url,
    cover: coverImage(page),
    images: ownImages(page),
    hasVideo: page.videos.length > 0,
    page,
  };
}

/** All real blog posts, sorted so the ones with the richest media show first,
 *  then alphabetically by title for stability. */
export const blogPosts: readonly BlogPostItem[] = Object.values(blogPages)
  .map(toBlogItem)
  .sort((a, b) => {
    if (a.hasVideo !== b.hasVideo) return a.hasVideo ? -1 : 1;
    const la = a.images.length;
    const lb = b.images.length;
    if (la !== lb) return lb - la;
    return a.title.localeCompare(b.title);
  });

export function findBlogPost(slug: string): BlogPostItem | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

// ---------- Events --------------------------------------------------------

export type EventItem = {
  slug: string;
  title: string;
  href: string;
  externalHref: string;
  cover?: string;
  images: readonly string[];
  page: PageMedia;
};

function toEventItem(page: PageMedia): EventItem {
  const slug = tailSlug(page);
  return {
    slug,
    title: page.title,
    href: `/events/${slug}`,
    externalHref: page.url,
    cover: coverImage(page),
    images: ownImages(page),
    page,
  };
}

export const eventItems: readonly EventItem[] = Object.values(eventsPages)
  .map(toEventItem)
  .sort((a, b) => a.title.localeCompare(b.title));

export function findEvent(slug: string): EventItem | undefined {
  return eventItems.find((e) => e.slug === slug);
}

// ---------- Shop ----------------------------------------------------------

export type ProductItem = {
  slug: string;
  title: string;
  href: string;
  externalHref: string;
  cover?: string;
  images: readonly string[];
  page: PageMedia;
};

function toProductItem(page: PageMedia): ProductItem {
  const slug = tailSlug(page);
  return {
    slug,
    title: page.title,
    href: `/shop/${slug}`,
    externalHref: page.url,
    cover: coverImage(page),
    images: ownImages(page),
    page,
  };
}

/** Real products only — exclude the /category/all-products aggregator page. */
export const productItems: readonly ProductItem[] = Object.values(shopPages)
  .filter((p) => p.path.startsWith("/product-page/"))
  .map(toProductItem)
  .sort((a, b) => a.title.localeCompare(b.title));

export function findProduct(slug: string): ProductItem | undefined {
  return productItems.find((p) => p.slug === slug);
}

// ---------- Topic / About pages ------------------------------------------

/** Curated topic pages surfaced as galleries / background sources. */
export const topics = {
  theBoard: sitePages.theBoard,
  ams: sitePages.ams,
  lilRippers: sitePages.lilRippers,
  skaters: sitePages.skaters1,
  shredCentral: sitePages.shredCentral,
  dunbat2018: sitePages.dunbat2018,
  dunbat2021: sitePages.dunbat2021,
  dunbat2022: sitePages.dunbat2022,
  slurpeeOpen: sitePages.canadaSkateboardsSlurpeeOpen2023,
  originOfSkateboarding: sitePages.originOfSkateboarding,
};

// ---------- Home --------------------------------------------------------

/** Best hero image for the landing page. Prefers the original Wix hero
 *  (`home/02.jpg` = _DSC0329_edited) which is a wide 1920×662 action shot. */
export const heroImage: string =
  home.images.find((i) => i.endsWith("home/02.jpg")) ??
  coverImage(home) ??
  "/imported/the-board/04.jpg";

export const heroCaption = "Halton Region · Ontario · Canada";

export { home, allPages };
