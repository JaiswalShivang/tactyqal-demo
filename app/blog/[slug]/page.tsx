import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostByIdOrSlug, listPosts } from "@/lib/blog-store";
import BlogPostClient from "./BlogPostClient";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostByIdOrSlug(slug);

  if (!post || !post.published) {
    return { title: "Post Not Found" };
  }

  return {
    metadataBase: new URL("https://tactyqal.com"),
    title: post.title,
    description: post.excerpt,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: new Date(post.createdAt).toISOString(),
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export async function generateStaticParams() {
  const { posts } = await listPosts({ published: true, limit: 100 });
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostByIdOrSlug(slug);

  if (!post || !post.published) {
    notFound();
  }

  const { posts: allPosts } = await listPosts({ published: true, limit: 50 });
  const related = allPosts
    .filter(
      (p) =>
        p.id !== post.id &&
        (p.category === post.category ||
          p.tags.some((t) => post.tags.includes(t)))
    )
    .slice(0, 3);

  const postIdx = allPosts.findIndex((p) => p.id === post.id);
  const prevPost = postIdx > 0 ? allPosts[postIdx - 1] : null;
  const nextPost = postIdx < allPosts.length - 1 ? allPosts[postIdx + 1] : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    author: {
      "@type": "Organization",
      name: post.author,
    },
    datePublished: new Date(post.createdAt).toISOString(),
    dateModified: new Date(post.updatedAt).toISOString(),
    publisher: {
      "@type": "Organization",
      name: "Tactyqal Labs",
      url: "https://tactyqal.com",
    },
    keywords: post.tags.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostClient
        post={post}
        related={related}
        prevPost={prevPost ?? undefined}
        nextPost={nextPost ?? undefined}
      />
    </>
  );
}

