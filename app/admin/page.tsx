import type { Metadata } from "next";
import AdminStudio from "@/components/admin/AdminStudio";

export const metadata: Metadata = {
  title: "Admin Studio — Tactyqal Labs Blog CMS",
  description: "Internal content management studio for Tactyqal Labs.",
};

export default function AdminPage() {
  return <AdminStudio />;
}
