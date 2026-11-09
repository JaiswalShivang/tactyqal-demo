"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import type { Post } from "@/lib/types";

const COVERS = [
  { label: "Elevator Pitch", url: "/extracted/blog-ele.webp" },
  { label: "Startup Team", url: "/extracted/blog-startup.webp" },
  { label: "11 Reasons", url: "/extracted/blog-fail.webp" },
  { label: "50 No-Code Ideas", url: "/extracted/blog-nocode.webp" },
  { label: "Food Waste", url: "/extracted/blog-foodwaste.webp" },
  { label: "Gen-Z Founders", url: "/extracted/blog-genz.webp" },
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

const PRISMA_SCHEMA = `model Post {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  excerpt     String
  content     String   @db.Text
  coverImage  String?
  category    String
  tags        String[]
  author      String   @default("Partha Chakraborty")
  authorRole  String   @default("Founder, Tactyqal Labs")
  readTime    Int
  published   Boolean  @default(true)
  featured    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([published])
  @@index([category])
  @@index([createdAt])
}`;

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
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [mainView, setMainView] = useState<"content" | "inspector">("content");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [dataSource, setDataSource] = useState("prisma");
  const [latency, setLatency] = useState(14);
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);

  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formExcerpt, setFormExcerpt] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formCategory, setFormCategory] = useState("Ideas");
  const [formTags, setFormTags] = useState("");
  const [formCoverImage, setFormCoverImage] = useState("/extracted/blog-ele.webp");
  const [formAuthor, setFormAuthor] = useState("Partha Chakraborty");
  const [formAuthorRole, setFormAuthorRole] = useState("Founder, Tactyqal Labs");
  const [formPublished, setFormPublished] = useState(true);
  const [formFeatured, setFormFeatured] = useState(false);
  const [formSlugManual, setFormSlugManual] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [testerMethod, setTesterMethod] = useState("GET");
  const [testerUrl, setTesterUrl] = useState("/api/posts?status=all&limit=6");
  const [testerBody, setTesterBody] = useState(
    JSON.stringify(
      {
        title: "How Indian Teen Founders Are Raising Pre-Seed Grants",
        category: "Strategy",
        excerpt: "A tactical breakdown of teenage entrepreneurs winning state and venture grants without writing code.",
        content: "## The Shift in Youth Entrepreneurship\n\nIndian teenage founders are bypassing traditional gatekeepers by leveraging no-code and agentic AI tools to build working MVPs in weeks.\n\n## Key Takeaways\n\n- Focus on real customer problem discovery before tech stack selection\n- Deploy functional prototypes with Supabase and FlutterFlow\n- Pitch traction over theoretical metrics",
        tags: ["grants", "teen founders", "funding"],
        coverImage: "/extracted/blog-ele.webp",
        published: true,
      },
      null,
      2
    )
  );
  const [testerResponse, setTesterResponse] = useState<{
    status: number;
    time: number;
    headers: Record<string, string>;
    body: unknown;
  } | null>(null);
  const [testerLoading, setTesterLoading] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const start = Date.now();
    try {
      const res = await fetch("/api/posts?status=all&limit=100");
      const elapsed = Date.now() - start;
      setLatency(elapsed);
      const ds = res.headers.get("x-data-source") ?? "prisma";
      setDataSource(ds);
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
    fetchPosts();
  }, [fetchPosts]);

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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: nextPublished }),
      });
      await fetchPosts();
    } catch {
      await fetchPosts();
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      await fetch(`/api/posts/${id}`, { method: "DELETE" });
      setDeleteConfirmId(null);
      await fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickSeed = async () => {
    setSeeding(true);
    try {
      const randomId = Math.floor(Math.random() * 900 + 100);
      const payload = {
        title: `Teen Founder Playbook: 0 to ₹1 Lakh ARR in 60 Days #${randomId}`,
        slug: `teen-founder-playbook-${Date.now().toString().slice(-4)}`,
        category: "Ideas",
        excerpt: "How high school builders are launching micro-SaaS and agency tooling using no-code, Next.js, and AI automation.",
        content: "## The New Era of Teenage Software Founders\n\nHigh-schoolers today don't need years of theoretical computer science to launch viable commercial software. By pairing modern no-code workflows with AI tools and rigorous customer discovery, teenage founders are launching revenue-generating applications in 8 weeks.\n\n### The 3 Core Tenets\n\n1. **Obsess Over One Pain Point:** Avoid building massive platforms. Solve one painful friction for local businesses or peers.\n2. **Deploy Rapid Prototypes:** Use Supabase, Tailwind, and Next.js to reach production in under two weeks.\n3. **Charge From Day One:** Real validation is not email signups; it is revenue.\n\n> The best way to learn entrepreneurship is to ship software that people pay for.",
        coverImage: "/extracted/blog-startup.webp",
        tags: ["playbook", "teen founders", "revenue"],
        author: "Partha Chakraborty",
        authorRole: "Founder, Tactyqal Labs",
        readTime: 4,
        published: true,
        featured: false,
      };

      await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      await fetchPosts();
      setSeedSuccess(true);
      setTimeout(() => setSeedSuccess(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setSeeding(false);
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

  const runTesterRequest = async (overrideMethod?: string, overrideUrl?: string, overrideBody?: string) => {
    setTesterLoading(true);
    const method = overrideMethod || testerMethod;
    const url = overrideUrl || testerUrl;
    const bodyPayload = overrideBody !== undefined ? overrideBody : testerBody;
    const start = Date.now();
    try {
      const opts: RequestInit = {
        method,
        headers: { "Content-Type": "application/json" },
      };
      if (["POST", "PUT", "PATCH"].includes(method) && bodyPayload) {
        opts.body = bodyPayload;
      }
      const res = await fetch(url, opts);
      const time = Date.now() - start;
      const headers: Record<string, string> = {};
      res.headers.forEach((v, k) => {
        headers[k] = v;
      });
      const body = await res.json();
      setTesterResponse({ status: res.status, time, headers, body });
      if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
        fetchPosts();
      }
    } catch (e) {
      setTesterResponse({
        status: 0,
        time: Date.now() - start,
        headers: {},
        body: { error: String(e) },
      });
    } finally {
      setTesterLoading(false);
    }
  };

  const getCurlSnippet = () => {
    const parts = [`curl -X ${testerMethod} 'http://localhost:3000${testerUrl}'`];
    if (["POST", "PUT", "PATCH"].includes(testerMethod)) {
      parts.push(`  -H 'Content-Type: application/json'`);
      parts.push(`  -d '${testerBody.replace(/'/g, "'\\''")}'`);
    }
    return parts.join(" \\\n");
  };

  const currentWc = wordCount(formContent);
  const currentRt = computeReadTime(formContent);

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
          <span className="text-white/20 hidden xl:inline-block">/</span>
          <span className="text-xs font-mono text-white/70 hidden xl:inline-block whitespace-nowrap">
            Blog Backend &amp; Content Studio
          </span>
          <span className="px-2.5 py-1 bg-[#162654] border border-white/15 text-[11px] font-mono text-[#00F5D4] hidden md:flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F5D4] animate-pulse" />
            DB Ready • {latency}ms
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="flex border border-white/20 bg-[#162654]/80 p-0.5">
            <button
              onClick={() => setMainView("content")}
              className={`px-3 py-1.5 text-xs font-mono font-bold whitespace-nowrap transition-colors ${
                mainView === "content"
                  ? "bg-[#00F5D4] text-[#0F1B3D]"
                  : "text-white/80 hover:text-white"
              }`}
            >
              Content Manager
            </button>
            <button
              onClick={() => setMainView("inspector")}
              className={`px-3 py-1.5 text-xs font-mono font-bold whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                mainView === "inspector"
                  ? "bg-[#00F5D4] text-[#0F1B3D]"
                  : "text-white/80 hover:text-white"
              }`}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="4 17 10 11 4 5" />
                <line x1="12" y1="19" x2="20" y2="19" />
              </svg>
              <span>API &amp; Schema Inspector</span>
            </button>
          </div>

          <Link
            href="/"
            target="_blank"
            className="px-3 py-2 text-xs font-mono bg-[#162654] hover:bg-white hover:text-[#0F1B3D] border border-white/20 transition whitespace-nowrap hidden lg:inline-flex items-center gap-1"
          >
            <span>Public Site</span>
            <span>↗</span>
          </Link>

          <Link
            href="/blog"
            target="_blank"
            className="px-3 py-2 text-xs font-mono bg-[#162654] hover:bg-white hover:text-[#0F1B3D] border border-white/20 transition whitespace-nowrap hidden md:inline-flex items-center gap-1"
          >
            <span>/blog</span>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <div
            onClick={() => {
              setStatusFilter("all");
              setMainView("content");
            }}
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
            onClick={() => {
              setStatusFilter("published");
              setMainView("content");
            }}
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
            onClick={() => {
              setStatusFilter("draft");
              setMainView("content");
            }}
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

          <div
            onClick={() => setMainView("inspector")}
            className="bg-white border-2 border-[#0F1B3D] shadow-[4px_4px_0px_0px_#0F1B3D] p-5 relative overflow-hidden cursor-pointer transition hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#0F1B3D]"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#3B82F6]" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-[#0F1B3D]/70 tracking-wider">
                REST API &amp; DB ENGINE
              </span>
              <div className="w-7 h-7 bg-[#EFF6FF] border border-[#3B82F6] flex items-center justify-center text-[#3B82F6]">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
            </div>
            <div className="text-xl font-extrabold font-display text-[#10B981] flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
              ONLINE
            </div>
            <div className="text-xs text-[#0F1B3D]/60 font-mono truncate">
              {dataSource === "prisma" ? "PostgreSQL • Prisma" : "Hybrid Store"} · {latency}ms
            </div>
          </div>
        </div>

        {mainView === "inspector" ? (
          <div className="space-y-6">
            <div className="bg-[#0F1B3D] text-white border-2 border-[#0F1B3D] shadow-[6px_6px_0px_0px_#FF3D88] p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/15 mb-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#FF3D88] text-white font-mono text-[10px] font-bold uppercase tracking-wider mb-2">
                    TASK 2 ENGINEERING SHOWCASE
                  </div>
                  <h2 className="text-2xl font-display font-extrabold text-white">
                    REST API &amp; Relational Schema Inspector
                  </h2>
                  <p className="text-xs font-mono text-white/70 mt-1">
                    Direct architectural replacement for legacy PHP CodeIgniter + WordPress REST endpoints.
                  </p>
                </div>
                <button
                  onClick={() => setMainView("content")}
                  className="px-4 py-2 bg-white text-[#0F1B3D] font-mono text-xs font-bold border border-white hover:bg-[#00F5D4] transition shrink-0"
                >
                  ← Back to Content Manager
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00F5D4]">
                      1. Interactive REST API Endpoint Tester
                    </span>
                    <span className="text-[11px] font-mono text-white/50">
                      Live Next.js Route Handlers
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      {
                        method: "GET",
                        badgeClass: "bg-[#3B82F6] text-white",
                        endpoint: "/api/posts",
                        desc: "List all articles with status & limit filters",
                        run: () => {
                          setTesterMethod("GET");
                          setTesterUrl("/api/posts?status=all&limit=6");
                          runTesterRequest("GET", "/api/posts?status=all&limit=6");
                        },
                      },
                      {
                        method: "POST",
                        badgeClass: "bg-[#10B981] text-white",
                        endpoint: "/api/posts",
                        desc: "Create new article with Zod schema validation",
                        run: () => {
                          setTesterMethod("POST");
                          setTesterUrl("/api/posts");
                          const sample = JSON.stringify(
                            {
                              title: `Live API Test Article #${Math.floor(Math.random() * 900 + 100)}`,
                              slug: `live-api-test-${Date.now().toString().slice(-4)}`,
                              category: "Strategy",
                              excerpt: "Engineered via live POST route tester in Tactyqal Admin CMS.",
                              content: "## Generated via Live POST Tester\n\nFull-stack verification of JSON payload parsing, Zod validation, and database mutation.",
                              tags: ["test", "api"],
                              coverImage: "/extracted/blog-ele.webp",
                              published: true,
                            },
                            null,
                            2
                          );
                          setTesterBody(sample);
                          runTesterRequest("POST", "/api/posts", sample);
                        },
                      },
                      {
                        method: "PUT",
                        badgeClass: "bg-[#F59E0B] text-[#0F1B3D]",
                        endpoint: "/api/posts/[id]",
                        desc: "Update post fields or toggle published state",
                        run: () => {
                          const target = posts[0];
                          const url = target ? `/api/posts/${target.id}` : "/api/posts";
                          setTesterMethod("PUT");
                          setTesterUrl(url);
                          const sample = JSON.stringify(
                            { published: target ? !target.published : true, featured: false },
                            null,
                            2
                          );
                          setTesterBody(sample);
                          runTesterRequest("PUT", url, sample);
                        },
                      },
                      {
                        method: "DELETE",
                        badgeClass: "bg-[#EF4444] text-white",
                        endpoint: "/api/posts/[id]",
                        desc: "Delete article by UUID or CUID identifier",
                        run: () => {
                          const target = posts[posts.length - 1];
                          const url = target ? `/api/posts/${target.id}` : "/api/posts";
                          setTesterMethod("DELETE");
                          setTesterUrl(url);
                          runTesterRequest("DELETE", url);
                        },
                      },
                    ].map((ep) => (
                      <div
                        key={ep.method + ep.endpoint}
                        className="p-3 bg-[#162654] border border-[#263B73] flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`px-2 py-0.5 text-[10px] font-mono font-bold ${ep.badgeClass}`}>
                              {ep.method}
                            </span>
                            <span className="font-mono text-xs font-bold text-white truncate">
                              {ep.endpoint}
                            </span>
                          </div>
                          <p className="text-[11px] text-white/60 font-sans line-clamp-1 mb-2.5">
                            {ep.desc}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={ep.run}
                          disabled={testerLoading}
                          className="w-full py-1.5 px-2 bg-white/10 hover:bg-[#FF3D88] text-white font-mono text-[11px] font-bold border border-white/20 transition flex items-center justify-center gap-1.5"
                        >
                          <span>▶</span>
                          <span>Send Live Request</span>
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="border border-white/20 bg-[#0A1229] p-4 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#00F5D4]" />
                        <span className="font-mono text-xs font-bold text-[#00F5D4]">
                          Live JSON Response Console
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {testerResponse && (
                          <span
                            className={`px-2 py-0.5 font-mono text-[10px] font-bold ${
                              testerResponse.status < 300 ? "bg-[#10B981] text-white" : "bg-[#EF4444] text-white"
                            }`}
                          >
                            HTTP {testerResponse.status} • {testerResponse.time}ms
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(getCurlSnippet());
                            setCopiedCurl(true);
                            setTimeout(() => setCopiedCurl(false), 2000);
                          }}
                          className="px-2 py-0.5 border border-white/30 text-[10px] font-mono text-white/80 hover:text-white hover:border-[#00F5D4] transition"
                        >
                          {copiedCurl ? "cURL Copied ✓" : "Copy cURL"}
                        </button>
                      </div>
                    </div>

                    <pre className="font-mono text-xs text-[#00F5D4] overflow-auto max-h-60 p-3 bg-[#0F1B3D] border border-white/10 leading-relaxed">
                      {testerResponse
                        ? JSON.stringify(testerResponse.body, null, 2)
                        : `// Click "▶ Send Live Request" on any endpoint above to inspect\n// real HTTP status codes, latency, and response headers.\n{\n  "status": "idle",\n  "driver": "${dataSource}",\n  "message": "Awaiting test execution"\n}`}
                    </pre>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00F5D4]">
                      2. Database Schema &amp; Architecture
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(PRISMA_SCHEMA);
                        setCopiedSchema(true);
                        setTimeout(() => setCopiedSchema(false), 2000);
                      }}
                      className="px-2 py-0.5 border border-white/30 text-[10px] font-mono text-white/80 hover:text-white hover:border-[#00F5D4] transition"
                    >
                      {copiedSchema ? "Schema Copied ✓" : "Copy Schema"}
                    </button>
                  </div>

                  <div className="border border-white/20 bg-[#0A1229] p-3">
                    <div className="font-mono text-[10px] text-white/50 mb-2 uppercase tracking-wider">
                      prisma/schema.prisma · PostgreSQL Model
                    </div>
                    <pre className="font-mono text-[11px] text-[#00F5D4] overflow-auto max-h-56 p-2 bg-[#0F1B3D] border border-white/10 leading-relaxed">
                      {PRISMA_SCHEMA}
                    </pre>
                  </div>

                  <div className="border border-white/20 overflow-x-auto bg-[#0A1229]">
                    <table className="w-full text-left text-[11px] font-mono">
                      <thead className="bg-white/10 border-b border-white/20">
                        <tr>
                          <th className="p-2.5 text-white">METRIC</th>
                          <th className="p-2.5 text-[#FF3D88]">PHP + WORDPRESS</th>
                          <th className="p-2.5 text-[#10B981]">NEXT.JS + POSTGRES</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10 text-white/80">
                        <tr>
                          <td className="p-2.5 font-bold text-white">Runtime</td>
                          <td className="p-2.5 text-[#FF3D88]">2 split servers</td>
                          <td className="p-2.5 text-[#10B981]">Unified full-stack</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold text-white">Security</td>
                          <td className="p-2.5 text-[#FF3D88]">60k+ WP plugins</td>
                          <td className="p-2.5 text-[#10B981]">Zod schema validated</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold text-white">Type Safety</td>
                          <td className="p-2.5 text-[#FF3D88]">Zero type safety</td>
                          <td className="p-2.5 text-[#10B981]">End-to-end TS types</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold text-white">Cache Reval</td>
                          <td className="p-2.5 text-[#FF3D88]">Fragile cache purge</td>
                          <td className="p-2.5 text-[#10B981]">revalidatePath()</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {mainView === "content" && (
          <>
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
                <button
                  type="button"
                  onClick={handleQuickSeed}
                  disabled={seeding}
                  className="px-3 py-2 text-xs font-mono font-bold bg-[#FFE4EF] text-[#FF3D88] border-[1.5px] border-[#0F1B3D] hover:bg-[#FF3D88] hover:text-white transition cursor-pointer flex items-center gap-1.5 shadow-[2px_2px_0px_#0F1B3D] active:translate-x-[1px] active:translate-y-[1px]"
                >
                  <span>⚡</span>
                  <span>{seedSuccess ? "SEEDED ✓" : seeding ? "SEEDING..." : "Quick-Seed Demo Post"}</span>
                </button>

                <div className="flex items-center border-[1.5px] border-[#0F1B3D] bg-[#F4F6FB] p-0.5">
                  <button
                    type="button"
                    onClick={() => setStatusFilter("all")}
                    className={`px-3 py-1.5 text-xs font-mono uppercase font-bold transition-colors ${
                      statusFilter === "all"
                        ? "bg-[#0F1B3D] text-white"
                        : "text-[#0F1B3D]/70 hover:text-[#0F1B3D]"
                    }`}
                  >
                    ALL ({stats.total})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter("published")}
                    className={`px-3 py-1.5 text-xs font-mono uppercase font-bold transition-colors ${
                      statusFilter === "published"
                        ? "bg-[#0F1B3D] text-white"
                        : "text-[#0F1B3D]/70 hover:text-[#0F1B3D]"
                    }`}
                  >
                    PUBLISHED ({stats.publishedCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter("draft")}
                    className={`px-3 py-1.5 text-xs font-mono uppercase font-bold transition-colors ${
                      statusFilter === "draft"
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
                    Try searching for another keyword, select &quot;All Categories&quot;, or click Quick-Seed to create a new post instantly.
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
                            src={post.coverImage || "/extracted/blog-ele.webp"}
                            alt={post.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/extracted/blog-ele.webp";
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
                            className={`w-9 h-5 rounded-full border border-[#0F1B3D] p-0.5 transition-colors relative flex items-center ${
                              post.published ? "bg-[#10B981]" : "bg-[#CBD5E1]"
                            }`}
                          >
                            <div
                              className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm border border-[#0F1B3D]/30 transition-transform ${
                                post.published ? "translate-x-4" : "translate-x-0"
                              }`}
                            />
                          </div>
                          <span
                            className={`text-xs font-mono font-bold ${
                              post.published ? "text-[#10B981]" : "text-[#F59E0B]"
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
          </>
        )}
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
                        className={`flex items-center gap-2 p-1.5 border transition-all text-left ${
                          formCoverImage === cov.url
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
                    className={`font-mono text-[10px] font-bold px-2 py-0.5 ${
                      formPublished ? "bg-[#10B981] text-white" : "bg-[#F59E0B] text-white"
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
                        (e.target as HTMLImageElement).src = "/extracted/blog-ele.webp";
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
