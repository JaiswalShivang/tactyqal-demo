import type { Metadata } from "next";
import AdminStudio from "@/components/admin/AdminStudio";
import { listPosts } from "@/lib/blog-store";

export const metadata: Metadata = {
  title: "Admin Studio — Tactyqal Labs Blog CMS",
  description: "Internal content management studio for Tactyqal Labs.",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { posts } = await listPosts({ status: "all", limit: 100 });
  const serialized = JSON.parse(JSON.stringify(posts));
  return <AdminStudio initialPosts={serialized} />;
}
