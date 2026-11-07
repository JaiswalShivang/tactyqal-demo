import type { Metadata } from "next";
import AdminStudioClient from "./AdminStudioClient";

export const metadata: Metadata = {
  title: "Admin Studio — Blog CMS",
  description: "Tactyqal Labs blog content management studio and API architecture inspector.",
};

export default function AdminBlogPage() {
  return <AdminStudioClient />;
}
