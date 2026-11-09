"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import type { Post } from "@/lib/types";

const COVERS = [
  { label: "Elevator Pitch", url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80" },
  { label: "Startup Team", url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" },
  { label: "11 Reasons", url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80" },
  { label: "50 No-Code Ideas", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80" },
  { label: "Food Waste", url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80" },
  { label: "Gen-Z Founders", url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80" },
];

const CATEGORIES = [
  "All Categories",
  "Ideas",
  "Pitching",
  "Team Building",
  "Strategy",
  "AgriTech",
  "EdTech",
  "No-Code",
];

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function computeReadTime(content: string) {
  return Math.max(1, Math.round(wordCount(content) / 200));
}

function generateSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function AdminStudio() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formExcerpt, setFormExcerpt] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formCategory, setFormCategory] = useState("Ideas");
  const [formTags, setFormTags] = useState("");
  const [formCoverImage, setFormCoverImage] = useState("https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80");
  const [formAuthor, setFormAuthor] = useState("Partha Chakraborty");
  const [formAuthorRole, setFormAuthorRole] = useState("Founder, Tactyqal Labs");
  const [formPublished, setFormPublished] = useState(true);
  const [formFeatured, setFormFeatured] = useState(false);
  const [formSlugManual, setFormSlugManual] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    const session = sessionStorage.getItem("tactyqal_admin_session");
    if (session === "admin123") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (passwordInput.trim() === "admin123") {
      sessionStorage.setItem("tactyqal_admin_session", "admin123");
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Invalid password. Hint: default admin password is 'admin123'.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("tactyqal_admin_session");
    setIsAuthenticated(false);
    setPasswordInput("");
  };

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/posts?status=all&limit=100");
      const json = (await res.json()) as { data?: Post[]; count?: number };
      if (json.data && Array.isArray(json.data)) {
        setPosts(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts();
    }
  }, [isAuthenticated, fetchPosts]);

  const handleOpenCreate = () => {
    setEditingPost(null);
    setModalMode("create");
    setFormTitle("");
    setFormSlug("");
    setFormExcerpt("");
    setFormContent(
      "## Executive Summary\n\nWrite the core thesis of your startup article here...\n\n## Tactical Framework\n\n1. Step one for young founders\n2. Step two for scaling without code\n3. Step three for customer acquisition\n\n## Conclusion\n\nFinal actionable advice for builders."
    );
    setFormCategory("Ideas");
    setFormTags("startup, young founders, tactical");
    setFormCoverImage("/extracted/blog-nocode.webp");
    setFormAuthor("Partha Chakraborty");
    setFormAuthorRole("Founder, Tactyqal Labs");
    setFormPublished(true);
    setFormFeatured(false);
    setFormSlugManual(false);
    setModalOpen(true);
  };

  const handleOpenEdit = (post: Post) => {
    setEditingPost(post);
    setModalMode("edit");
    setFormTitle(post.title);
    setFormSlug(post.slug);
    setFormExcerpt(post.excerpt);
    setFormContent(post.content);
    setFormCategory(post.category);
    setFormTags(Array.isArray(post.tags) ? post.tags.join(", ") : "");
    setFormCoverImage(post.coverImage || "/extracted/blog-ele.webp");
    setFormAuthor(post.author || "Partha Chakraborty");
    setFormAuthorRole(post.authorRole || "Founder, Tactyqal Labs");
    setFormPublished(post.published);
    setFormFeatured(post.featured ?? false);
    setFormSlugManual(true);
    setModalOpen(true);
  };

  useEffect(() => {
    if (!formSlugManual && formTitle) {
      setFormSlug(generateSlug(formTitle));
    }
  }, [formTitle, formSlugManual]);

  const handleSaveArticle = async () => {
    if (!formTitle.trim() || !formContent.trim()) {
      alert("Title and Content are required.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: formTitle,
        slug: formSlug || generateSlug(formTitle),
        excerpt: formExcerpt || formContent.slice(0, 150) + "...",
        content: formContent,
        category: formCategory,
        tags: formTags.split(",").map((t) => t.trim()).filter(Boolean),
        coverImage: formCoverImage,
        author: formAuthor,
        authorRole: formAuthorRole,
        published: formPublished,
        featured: formFeatured,
      };

      if (modalMode === "edit" && editingPost) {
        await fetch(`/api/posts/${editingPost.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer admin123",
          },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer admin123",
          },
          body: JSON.stringify(payload),
        });
      }

      await fetchPosts();
      setModalOpen(false);
      setEditingPost(null);
    } catch (err) {
      console.error(err);
      alert("Error saving article");
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublished = async (post: Post) => {
    const nextPublished = !post.published;
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, published: nextPublished } : p))
    );
    try {
      await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer admin123",
        },
        body: JSON.stringify({ published: nextPublished }),
      });
      await fetchPosts();
    } catch {
      await fetchPosts();
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      await fetch(`/api/posts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer admin123",
        },
      });
      setDeleteConfirmId(null);
      await fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      const matchesCat =
        categoryFilter === "All Categories" ||
        p.category.toLowerCase() === categoryFilter.toLowerCase();
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "published" && p.published) ||
        (statusFilter === "draft" && !p.published);
      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [posts, search, categoryFilter, statusFilter]);

  const stats = useMemo(() => {
    const total = posts.length;
    const publishedCount = posts.filter((p) => p.published).length;
    const draftCount = posts.filter((p) => !p.published).length;
    return { total, publishedCount, draftCount };
  }, [posts]);

  const currentWc = wordCount(formContent);
  const currentRt = computeReadTime(formContent);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0F1B3D] flex items-center justify-center font-mono text-xs text-white/60">
        INITIALIZING SECURITY CONTEXT...
      </div>
    );
  }

  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-[#0F1B3D] text-[#FFFFFF] flex flex-col justify-between selection:bg-[#FF3D88] selection:text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

        <header className="border-b border-white/15 px-6 py-4 flex items-center justify-between relative z-10">
          <Link
            href="/"
            className="font-display font-extrabold text-base tracking-tight text-white hover:text-[#00F5D4] transition"
          >
            TACTYQAL
          </Link>
          <span className="px-2.5 py-1 bg-[#162654] border border-white/15 text-xs font-mono text-white/70">
            INTERNAL PORTAL
          </span>
        </header>

        <div className="flex-1 flex items-center justify-center p-4 relative z-10">
          <div className="max-w-md w-full bg-white text-[#0F1B3D] border-2 border-[#0F1B3D] shadow-[8px_8px_0px_0px_#FF3D88] p-7 sm:p-8">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#0F1B3D]/15">
              <span className="px-2 py-0.5 bg-[#FF3D88] text-white font-mono text-[10px] font-bold uppercase tracking-wider">
                ADMIN ACCESS ONLY
              </span>
              <span className="text-xs font-mono text-[#0F1B3D]/60 font-semibold">
                PASS: admin123
              </span>
            </div>

            <h1 className="font-display font-extrabold text-2xl text-[#0F1B3D] mb-1">
              Admin Authentication
            </h1>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block font-mono text-xs uppercase font-bold text-[#0F1B3D]/80 mb-1.5">
                  Master Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter admin password..."
                    autoFocus
                    className="w-full border-2 border-[#0F1B3D] px-3.5 py-2.5 text-sm font-mono bg-[#F4F6FB] focus:bg-white focus:outline-none focus:border-[#FF3D88]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-mono text-[#0F1B3D]/60 hover:text-[#FF3D88]"
                  >
                    {showPassword ? "HIDE" : "SHOW"}
                  </button>
                </div>
              </div>

              {authError && (
                <div className="p-2.5 bg-[#FFE4EF] border border-[#FF3D88] text-[#FF3D88] text-xs font-mono">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#FF3D88] hover:bg-[#e62e76] text-white font-mono font-bold text-xs uppercase tracking-wider shadow-[4px_4px_0px_0px_#0F1B3D] active:translate-x-[1px] active:translate-y-[1px] transition cursor-pointer"
              >
                Unlock Admin Studio →
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-[#0F1B3D]/10 text-center">
              <Link
                href="/"
                className="text-xs font-mono text-[#0F1B3D]/60 hover:text-[#FF3D88] transition"
              >
                ← Return to Public Website
              </Link>
            </div>
          </div>
        </div>

        <footer className="border-t border-white/10 px-6 py-3 text-center text-xs font-mono text-white/50 relative z-10">
          Tactyqal Labs CMS · Protected Architecture
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6FB] text-[#0F1B3D] selection:bg-[#FF3D88] selection:text-white">
      <header className="bg-[#0F1B3D] text-white border-b-2 border-[#0F1B3D] px-4 sm:px-6 h-16 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <Link
            href="/"
            className="font-display font-extrabold text-base tracking-tight text-white hover:text-[#00F5D4] transition whitespace-nowrap"
          >
            TACTYQAL
          </Link>
          <span className="px-2 py-0.5 bg-[#FF3D88] text-white font-mono text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
            CMS v2.0
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/"
            target="_blank"
            className="px-3 py-2 text-xs font-mono bg-[#162654] hover:bg-white hover:text-[#0F1B3D] border border-white/20 transition whitespace-nowrap inline-flex items-center gap-1"
          >
            <span>Public Site</span>
            <span>↗</span>
          </Link>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-[#FF3D88] hover:bg-[#e62e76] text-white text-xs font-bold uppercase tracking-wider shadow-[3px_3px_0px_0px_#FFFFFF] whitespace-nowrap active:translate-x-[1px] active:translate-y-[1px] transition cursor-pointer"
          >
            + New Article
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <div
            onClick={() => setStatusFilter("all")}
            className="bg-white border-2 border-[#0F1B3D] shadow-[4px_4px_0px_0px_#0F1B3D] p-5 relative overflow-hidden cursor-pointer transition hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#0F1B3D]"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#0F1B3D]" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-[#0F1B3D]/70 tracking-wider">
                TOTAL ARTICLES
              </span>
              <div className="w-7 h-7 bg-[#F4F6FB] border border-[#0F1B3D] flex items-center justify-center text-[#0F1B3D]">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-extrabold font-display text-[#0F1B3D] mb-1">
              {stats.total}
            </div>
            <div className="text-xs text-[#0F1B3D]/60 font-sans">
              Click to view all {stats.total} articles
            </div>
          </div>

          <div
            onClick={() => setStatusFilter("published")}
            className="bg-white border-2 border-[#0F1B3D] shadow-[4px_4px_0px_0px_#0F1B3D] p-5 relative overflow-hidden cursor-pointer transition hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#0F1B3D]"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#10B981]" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-[#0F1B3D]/70 tracking-wider">
                PUBLISHED LIVE
              </span>
              <div className="w-7 h-7 bg-[#E8F8F3] border border-[#10B981] flex items-center justify-center text-[#10B981]">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-extrabold font-display text-[#10B981] mb-1">
              {stats.publishedCount}
            </div>
            <div className="text-xs text-[#0F1B3D]/60 font-sans">
              Serving /blog &amp; homepage feed
            </div>
          </div>

          <div
            onClick={() => setStatusFilter("draft")}
            className="bg-white border-2 border-[#0F1B3D] shadow-[4px_4px_0px_0px_#0F1B3D] p-5 relative overflow-hidden cursor-pointer transition hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#0F1B3D]"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#FF3D88]" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-[#0F1B3D]/70 tracking-wider">
                DRAFTS / HIDDEN
              </span>
              <div className="w-7 h-7 bg-[#FFE4EF] border border-[#FF3D88] flex items-center justify-center text-[#FF3D88]">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-extrabold font-display text-[#FF3D88] mb-1">
              {stats.draftCount}
            </div>
            <div className="text-xs text-[#0F1B3D]/60 font-sans">
              Visible only in internal Admin Studio
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-[#0F1B3D] shadow-[4px_4px_0px_0px_#0F1B3D] p-3 mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-[280px]">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#0F1B3D]/50">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, slug, category, or content..."
                className="w-full pl-9 pr-8 py-2 text-xs font-mono border-[1.5px] border-[#0F1B3D] bg-white focus:outline-none focus:border-[#FF3D88]"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#0F1B3D]/60 hover:text-[#FF3D88] font-bold text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-xs font-bold text-[#0F1B3D] border-[1.5px] border-[#0F1B3D] bg-[#F4F6FB] focus:outline-none focus:border-[#FF3D88] cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center border-[1.5px] border-[#0F1B3D] bg-[#F4F6FB] p-0.5">
                  <button
                    type="button"
                    onClick={() => setStatusFilter("all")}
                    className={`px-3 py-1.5 text-xs font-mono uppercase font-bold transition-colors ${statusFilter === "all"
                      ? "bg-[#0F1B3D] text-white"
                      : "text-[#0F1B3D]/70 hover:text-[#0F1B3D]"
                      }`}
                  >
                    ALL ({stats.total})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter("published")}
                    className={`px-3 py-1.5 text-xs font-mono uppercase font-bold transition-colors ${statusFilter === "published"
                      ? "bg-[#0F1B3D] text-white"
                      : "text-[#0F1B3D]/70 hover:text-[#0F1B3D]"
                      }`}
                  >
                    PUBLISHED ({stats.publishedCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter("draft")}
                    className={`px-3 py-1.5 text-xs font-mono uppercase font-bold transition-colors ${statusFilter === "draft"
                      ? "bg-[#0F1B3D] text-white"
                      : "text-[#0F1B3D]/70 hover:text-[#0F1B3D]"
                      }`}
                  >
                    DRAFTS ({stats.draftCount})
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-[#0F1B3D] shadow-[6px_6px_0px_0px_#0F1B3D] overflow-hidden">
              <div className="bg-[#0F1B3D] text-white text-[11px] font-mono uppercase tracking-wider px-5 py-3.5 grid grid-cols-12 items-center gap-4">
                <div className="col-span-5">ARTICLE &amp; SLUG</div>
                <div className="col-span-2">CATEGORY</div>
                <div className="col-span-2">META (TIME / DATE)</div>
                <div className="col-span-2">STATUS</div>
                <div className="col-span-1 text-right">ACTIONS</div>
              </div>

              {loading ? (
                <div className="p-12 text-center font-mono text-xs uppercase text-[#0F1B3D]/60">
                  FETCHING PERSISTENT ARTICLES FROM POSTGRESQL / STORE...
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <div className="font-display font-extrabold text-xl text-[#0F1B3D]">
                    No articles match your search criteria
                  </div>
                  <p className="text-xs font-mono text-[#0F1B3D]/60 max-w-md mx-auto">
                    Try searching for another keyword, select &quot;All Categories&quot;, or click &quot;+ New Article&quot; to write a post.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setCategoryFilter("All Categories");
                      setStatusFilter("all");
                    }}
                    className="px-4 py-2 text-xs font-mono font-bold bg-[#FFE4EF] text-[#FF3D88] border-[1.5px] border-[#0F1B3D] hover:bg-[#FF3D88] hover:text-white transition"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="divide-y-[1.5px] divide-[#0F1B3D]/15">
                  {filteredPosts.map((post) => (
                    <div
                      key={post.id}
                      className="grid grid-cols-12 items-center gap-4 px-5 py-3.5 hover:bg-[#F4F6FB] transition-colors group"
                    >
                      <div className="col-span-5 flex items-center gap-3.5 min-w-0">
                        <div className="w-14 h-10 border border-[#0F1B3D] shrink-0 bg-[#0F1B3D] overflow-hidden">
                          <img
                            src={post.coverImage || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80"}
                            alt={post.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80";
                            }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div
                            onClick={() => handleOpenEdit(post)}
                            className="font-bold text-[15px] text-[#0F1B3D] group-hover:text-[#FF3D88] transition truncate cursor-pointer leading-snug"
                            title="Click to edit article"
                          >
                            {post.title}
                          </div>
                          <div className="text-xs font-mono text-[#0F1B3D]/55 truncate mt-0.5">
                            /{post.slug}
                          </div>
                        </div>
                      </div>

                      <div className="col-span-2">
                        <span className="inline-flex px-2.5 py-0.5 text-[11px] font-mono font-bold uppercase bg-[#FFE4EF] text-[#FF3D88] border border-[#0F1B3D]">
                          {post.category}
                        </span>
                      </div>

                      <div className="col-span-2">
                        <div className="font-mono text-xs font-semibold text-[#0F1B3D]">
                          {post.readTime} min read
                        </div>
                        <div className="text-[11px] font-mono text-[#0F1B3D]/60 mt-0.5">
                          {new Date(post.createdAt).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </div>

                      <div className="col-span-2">
                        <button
                          type="button"
                          onClick={() => handleTogglePublished(post)}
                          className="flex items-center gap-2 group/switch cursor-pointer"
                          title="Click to toggle Published/Draft via PUT /api/posts/[id]"
                        >
                          <div
                            className={`w-9 h-5 rounded-full border border-[#0F1B3D] p-0.5 transition-colors relative flex items-center ${post.published ? "bg-[#10B981]" : "bg-[#CBD5E1]"
                              }`}
                          >
                            <div
                              className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm border border-[#0F1B3D]/30 transition-transform ${post.published ? "translate-x-4" : "translate-x-0"
                                }`}
                            />
                          </div>
                          <span
                            className={`text-xs font-mono font-bold ${post.published ? "text-[#10B981]" : "text-[#F59E0B]"
                              }`}
                          >
                            {post.published ? "Live" : "Draft"}
                          </span>
                        </button>
                      </div>

                      <div className="col-span-1 flex items-center justify-end gap-1.5">
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="px-2 py-1 text-xs font-mono text-[#0F1B3D] border border-[#0F1B3D] bg-white hover:bg-[#FFE4EF] hover:text-[#FF3D88] transition"
                          title="View public reader"
                        >
                          ↗
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(post)}
                          className="bg-[#0F1B3D] text-white hover:bg-[#FF3D88] px-2.5 py-1 text-xs font-mono font-bold border border-[#0F1B3D] transition cursor-pointer"
                          title="Edit article"
                        >
                          Edit
                        </button>
                        {deleteConfirmId === post.id ? (
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleDeletePost(post.id)}
                              className="bg-[#EF4444] text-white font-mono text-xs font-bold px-2 py-1 border border-[#0F1B3D]"
                            >
                              Yes
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(null)}
                              className="bg-white text-[#0F1B3D] font-mono text-xs px-1.5 py-1 border border-[#0F1B3D]"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(post.id)}
                            className="bg-white text-[#EF4444] border border-[#0F1B3D] hover:bg-[#EF4444] hover:text-white px-2 py-1 text-xs font-mono font-bold transition cursor-pointer"
                            title="Delete article"
                          >
                            Del
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
      </main>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl bg-white border-2 border-[#0F1B3D] shadow-[10px_10px_0px_0px_#FF3D88] overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#0F1B3D] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#0F1B3D]">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 bg-[#FF3D88] text-white font-mono text-[10px] font-bold uppercase tracking-wider">
                  ARTICLE STUDIO
                </span>
                <h2 className="font-display font-extrabold text-lg text-white">
                  {modalMode === "edit" ? `Edit: ${editingPost?.title}` : "Create New Blog Post"}
                </h2>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-white/60 hidden sm:inline">
                  {currentWc} words · {currentRt} min read
                </span>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-7 h-7 bg-white/10 hover:bg-[#FF3D88] text-white flex items-center justify-center font-bold text-xs border border-white/20 transition cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 max-h-[75vh]">
              <div className="md:col-span-7 p-6 border-b md:border-b-0 md:border-r-[1.5px] border-[#0F1B3D] overflow-y-auto space-y-4">
                <div>
                  <label className="block font-mono text-xs uppercase font-bold text-[#0F1B3D]/70 mb-1">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. 10 Mistakes Founders Make When Pitching Angels"
                    className="w-full border-2 border-[#0F1B3D] px-3 py-2 text-sm font-bold font-sans bg-white focus:outline-none focus:border-[#FF3D88]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-xs uppercase font-bold text-[#0F1B3D]/70 mb-1">
                      URL Slug *
                    </label>
                    <input
                      type="text"
                      value={formSlug}
                      onChange={(e) => {
                        setFormSlug(e.target.value);
                        setFormSlugManual(true);
                      }}
                      className="w-full border-2 border-[#0F1B3D] px-3 py-2 font-mono text-xs bg-white focus:outline-none focus:border-[#FF3D88]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs uppercase font-bold text-[#0F1B3D]/70 mb-1">
                      Category *
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full border-2 border-[#0F1B3D] px-3 py-2 font-mono text-xs bg-white focus:outline-none focus:border-[#FF3D88] cursor-pointer"
                    >
                      {CATEGORIES.filter((c) => c !== "All Categories").map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-xs uppercase font-bold text-[#0F1B3D]/70 mb-1">
                      Author Name
                    </label>
                    <input
                      type="text"
                      value={formAuthor}
                      onChange={(e) => setFormAuthor(e.target.value)}
                      className="w-full border-2 border-[#0F1B3D] px-3 py-2 font-mono text-xs bg-white focus:outline-none focus:border-[#FF3D88]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs uppercase font-bold text-[#0F1B3D]/70 mb-1">
                      Author Role / Title
                    </label>
                    <input
                      type="text"
                      value={formAuthorRole}
                      onChange={(e) => setFormAuthorRole(e.target.value)}
                      className="w-full border-2 border-[#0F1B3D] px-3 py-2 font-mono text-xs bg-white focus:outline-none focus:border-[#FF3D88]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase font-bold text-[#0F1B3D]/70 mb-1">
                    Cover Image URL &amp; Preset Picker
                  </label>
                  <input
                    type="text"
                    value={formCoverImage}
                    onChange={(e) => setFormCoverImage(e.target.value)}
                    className="w-full border-2 border-[#0F1B3D] px-3 py-2 font-mono text-xs bg-white mb-2 focus:outline-none focus:border-[#FF3D88]"
                  />
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {COVERS.map((cov) => (
                      <button
                        key={cov.url}
                        type="button"
                        onClick={() => setFormCoverImage(cov.url)}
                        className={`flex items-center gap-2 p-1.5 border transition-all text-left ${formCoverImage === cov.url
                          ? "bg-[#FFE4EF] border-[#FF3D88] shadow-[2px_2px_0px_#FF3D88]"
                          : "bg-white border-[#0F1B3D]/30 hover:border-[#0F1B3D]"
                          }`}
                      >
                        <img
                          src={cov.url}
                          alt={cov.label}
                          className="w-8 h-6 object-cover border border-[#0F1B3D]/40 shrink-0"
                        />
                        <span className="text-[11px] font-mono truncate font-medium text-[#0F1B3D]">
                          {cov.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase font-bold text-[#0F1B3D]/70 mb-1">
                    Excerpt / Subtitle (appears on cards &amp; SEO)
                  </label>
                  <textarea
                    rows={2}
                    value={formExcerpt}
                    onChange={(e) => setFormExcerpt(e.target.value)}
                    placeholder="Brief 1-2 sentence hook describing the guide..."
                    className="w-full border-2 border-[#0F1B3D] px-3 py-2 text-xs bg-white focus:outline-none focus:border-[#FF3D88]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase font-bold text-[#0F1B3D]/70 mb-1">
                    Full Article Content (Markdown supported) *
                  </label>
                  <textarea
                    rows={10}
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    placeholder="## Introduction\n\nWrite your multi-paragraph content with Markdown..."
                    className="w-full border-2 border-[#0F1B3D] p-3 font-mono text-xs leading-relaxed bg-white focus:outline-none focus:border-[#FF3D88]"
                  />
                </div>
              </div>

              <div className="md:col-span-5 p-6 bg-[#F4F6FB] overflow-y-auto flex flex-col gap-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#0F1B3D]/20">
                  <span className="font-mono text-xs uppercase font-bold text-[#0F1B3D]/70">
                    Live Card &amp; Reader Preview
                  </span>
                  <span
                    className={`font-mono text-[10px] font-bold px-2 py-0.5 ${formPublished ? "bg-[#10B981] text-white" : "bg-[#F59E0B] text-white"
                      }`}
                  >
                    {formPublished ? "● LIVE" : "○ DRAFT"}
                  </span>
                </div>

                <div className="border-2 border-[#0F1B3D] bg-white p-4 shadow-[3px_3px_0px_#0F1B3D]">
                  <div className="aspect-[16/9] border border-[#0F1B3D] overflow-hidden mb-3 bg-[#0F1B3D]">
                    <img
                      src={formCoverImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80";
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-[10px] uppercase px-2 py-0.5 border border-[#FF3D88] bg-[#FFE4EF] text-[#FF3D88] font-bold">
                      {formCategory}
                    </span>
                    <span className="font-mono text-[11px] text-[#0F1B3D]/60">
                      {currentRt} MIN READ
                    </span>
                  </div>
                  <h3 className="font-display font-extrabold text-base leading-snug mb-2 text-[#0F1B3D]">
                    {formTitle || "Your Article Headline Will Render Here"}
                  </h3>
                  <p className="text-xs text-[#0F1B3D]/70 leading-relaxed mb-3 line-clamp-2">
                    {formExcerpt || "Your excerpt will appear on homepage and blog cards."}
                  </p>
                  <div className="font-mono text-[10px] text-[#0F1B3D]/50 border-t border-[#0F1B3D]/10 pt-2">
                    By {formAuthor} · {formAuthorRole}
                  </div>
                </div>

                <div className="border border-[#0F1B3D]/20 bg-white p-4">
                  <div className="font-mono text-[10px] uppercase font-bold text-[#0F1B3D]/60 mb-2 pb-1 border-b border-[#0F1B3D]/10">
                    Formatted Markdown Reader
                  </div>
                  <div className="prose prose-sm max-w-none text-[#0F1B3D] text-xs font-sans leading-relaxed">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                      {formContent}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border-t-2 border-[#0F1B3D] px-6 py-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer font-mono text-xs uppercase font-bold text-[#0F1B3D]">
                  <input
                    type="checkbox"
                    checked={formPublished}
                    onChange={(e) => setFormPublished(e.target.checked)}
                    className="w-4 h-4 accent-[#FF3D88]"
                  />
                  <span>Publish Immediately</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-mono text-xs uppercase font-bold text-[#0F1B3D]">
                  <input
                    type="checkbox"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="w-4 h-4 accent-[#FF3D88]"
                  />
                  <span>Featured Hero Card</span>
                </label>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 font-mono text-xs border border-[#0F1B3D] text-[#0F1B3D] hover:bg-[#F4F6FB] transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveArticle}
                  disabled={saving}
                  className="px-6 py-2.5 bg-[#FF3D88] hover:bg-[#e62e76] text-white font-mono font-bold text-xs uppercase tracking-wider shadow-[4px_4px_0px_0px_#0F1B3D] active:translate-x-[1px] active:translate-y-[1px] transition cursor-pointer"
                >
                  {saving ? "Saving..." : "Save Article to Database →"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
