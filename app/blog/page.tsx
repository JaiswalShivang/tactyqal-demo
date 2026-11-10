import type { Metadata } from "next";
import { listPosts } from "@/lib/blog-store";
import BlogListClient from "./BlogListClient";

export const metadata: Metadata = {
  metadataBase: new URL("https://tactyqal.com"),
  title: "Blog — Startup Knowledge for Young Founders",
  description:
    "Practical startup guides, idea lists, and founder insights from Tactyqal Labs.",
  openGraph: {
    title: "Blog — Tactyqal Labs",
    description: "Practical startup guides and founder insights.",
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BlogPage() {
  const { posts } = await listPosts({ published: true, limit: 100 });
  const serialized = JSON.parse(JSON.stringify(posts));
  const categories = Array.from(new Set(posts.map((p) => p.category))).sort();

  return (
    <BlogListClient
      initialPosts={serialized}
      categories={categories}
    />
  );
}

