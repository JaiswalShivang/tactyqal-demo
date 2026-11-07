import { MetadataRoute } from "next";
import { listPosts } from "@/lib/blog-store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { posts } = await listPosts({ published: true, limit: 100 });
  const base = "https://tactyqal.com";

  const blogRoutes = posts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    ...blogRoutes,
  ];
}

