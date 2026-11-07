import type { Metadata } from "next";
import { listPosts } from "@/lib/blog-store";
import BlogListClient from "./BlogListClient";

export const metadata: Metadata = {
  title: "Blog — Startup Knowledge for Young Founders",
  description:
    "Practical startup guides, idea lists, and founder insights from Tactyqal Labs.",
  openGraph: {
    title: "Blog — Tactyqal Labs",
    description: "Practical startup guides and founder insights.",
  },
};

export default async function BlogPage() {
  const { posts } = await listPosts({ published: true, limit: 50 });

  const categories = Array.from(new Set(posts.map((p) => p.category))).sort();

  return (
    <BlogListClient
      initialPosts={posts}
      categories={categories}
    />
  );
}

