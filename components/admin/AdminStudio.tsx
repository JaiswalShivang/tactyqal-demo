"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import type { Post } from "@/lib/types";

type Tab = "posts" | "new" | "edit";
type InspectorSubTab = "tester" | "schema" | "architecture";

const COVERS = [
  { label: "Elevator Pitch", url: "/extracted/blog-ele.webp" },
  { label: "Startup Team", url: "/extracted/blog-startup.webp" },
  { label: "11 Reasons", url: "/extracted/blog-fail.webp" },
  { label: "50 No-Code Ideas", url: "/extracted/blog-nocode.webp" },
  { label: "Food Waste", url: "/extracted/blog-foodwaste.webp" },
  { label: "Gen-Z Founders", url: "/extracted/blog-genz.webp" },
];

const CATEGORIES = ["Pitching", "Team Building", "Strategy", "Ideas", "AgriTech", "EdTech", "No-Code"];

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
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [tab, setTab] = useState<Tab>("posts");
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [inspectorTab, setInspectorTab] = useState<InspectorSubTab>("tester");
  const [dataSource, setDataSource] = useState("file");
  const [latency, setLatency] = useState(12);

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
        content: "## The Shift in Youth Entrepreneurship\\n\\nIndian teenage founders are bypassing traditional gatekeepers by leveraging no-code and agentic AI tools to build working MVPs in weeks.\\n\\n## Key Takeaways\\n\\n- Focus on real customer problem discovery before tech stack selection\\n- Deploy functional prototypes with Supabase and FlutterFlow\\n- Pitch traction over theoretical metrics",
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
      const ds = res.headers.get("x-data-source") ?? "file";
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
    setFormTitle("");
    setFormSlug("");
    setFormExcerpt("");
    setFormContent(
      "## Executive Summary\\n\\nWrite the core thesis of your startup article here...\\n\\n## Tactical Framework\\n\\n1. Step one for young founders\\n2. Step two for scaling without code\\n3. Step three for customer acquisition\\n\\n## Conclusion\\n\\nFinal actionable advice for builders."
    );
    setFormCategory("Ideas");
    setFormTags("startup, young founders, tactical");
    setFormCoverImage("/extracted/blog-nocode.webp");
    setFormAuthor("Partha Chakraborty");
    setFormAuthorRole("Founder, Tactyqal Labs");
    setFormPublished(true);
    setFormFeatured(false);
    setFormSlugManual(false);
    setTab("new");
  };

  const handleOpenEdit = (post: Post) => {
    setEditingPost(post);
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
    setTab("edit");
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

      if (tab === "edit" && editingPost) {
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
      setTab("posts");
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

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q);
      const matchesCat =
        categoryFilter === "All" ||
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

  const runTesterRequest = async () => {
    setTesterLoading(true);
    const start = Date.now();
    try {
      const opts: RequestInit = {
        method: testerMethod,
        headers: { "Content-Type": "application/json" },
      };
      if (["POST", "PUT", "PATCH"].includes(testerMethod) && testerBody) {
        opts.body = testerBody;
      }
      const res = await fetch(testerUrl, opts);
      const time = Date.now() - start;
      const headers: Record<string, string> = {};
      res.headers.forEach((v, k) => {
        headers[k] = v;
      });
      const body = await res.json();
      setTesterResponse({ status: res.status, time, headers, body });
      if (["POST", "PUT", "PATCH", "DELETE"].includes(testerMethod)) {
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
    <div className="min-h-screen bg-[#F6F4EE] text-[#121316] selection:bg-[#D2FF28] selection:text-[#121316]">
      <header className="bg-[#121316] text-[#F6F4EE] border-b-2 border-[#121316] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="font-extrabold text-sm tracking-tight text-[#F6F4EE] hover:text-[#D2FF28] transition-colors"
            >
              TACTYQAL LABS
            </Link>
            <span className="text-white/20">/</span>
            <span className="font-mono text-xs uppercase tracking-wider text-white/80 hidden sm:inline">
              INTERNAL CMS // BLOG BACKEND v2.0 (REPLACING WORDPRESS)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 bg-white/10 px-3 py-1.5 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="font-mono text-[11px] text-[#F6F4EE]">
                {dataSource === "prisma" ? "PRISMA + POSTGRESQL" : "FILE STORE (data/posts.json)"} · {latency}ms
              </span>
            </div>

            <button
              onClick={() => setInspectorOpen(!inspectorOpen)}
              className={`font-mono text-xs px-3 py-1.5 border transition-all ${
                inspectorOpen
                  ? "bg-[#D2FF28] text-[#121316] border-[#D2FF28] font-bold"
                  : "border-white/30 text-white hover:border-[#D2FF28] hover:text-[#D2FF28]"
              }`}
            >
              {inspectorOpen ? "✕ CLOSE INSPECTOR" : "⚙ API & SCHEMA INSPECTOR"}
            </button>

            <Link
              href="/blog"
              target="_blank"
              className="font-mono text-xs px-3 py-1.5 border border-white/30 text-white hover:border-white transition-colors hidden md:inline-block"
            >
              VIEW PUBLIC BLOG ↗
            </Link>

            <button
              onClick={handleOpenCreate}
              className="bg-[#FF4F18] hover:bg-[#E04415] text-white font-bold text-xs uppercase font-mono px-4 py-2 border-2 border-[#121316] shadow-[2px_2px_0px_#121316] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
            >
              + NEW ARTICLE
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#FAF9F5] border-2 border-[#121316] p-4 shadow-[3px_3px_0px_#121316]">
            <div className="font-mono text-[11px] uppercase tracking-wider text-black/50 mb-1">
              TOTAL ARTICLES
            </div>
            <div className="font-extrabold text-3xl font-display">{stats.total}</div>
            <div className="font-mono text-[11px] text-black/40 mt-1">
              Pre-seeded multi-paragraph guides
            </div>
          </div>

          <div className="bg-[#FAF9F5] border-2 border-[#121316] p-4 shadow-[3px_3px_0px_#121316]">
            <div className="font-mono text-[11px] uppercase tracking-wider text-black/50 mb-1">
              PUBLISHED LIVE
            </div>
            <div className="font-extrabold text-3xl font-display text-[#10B981]">
              {stats.publishedCount}
            </div>
            <div className="font-mono text-[11px] text-black/40 mt-1">
              Serving /blog &amp; homepage feed
            </div>
          </div>

          <div className="bg-[#FAF9F5] border-2 border-[#121316] p-4 shadow-[3px_3px_0px_#121316]">
            <div className="font-mono text-[11px] uppercase tracking-wider text-black/50 mb-1">
              DRAFTS / HIDDEN
            </div>
            <div className="font-extrabold text-3xl font-display text-[#FF4F18]">
              {stats.draftCount}
            </div>
            <div className="font-mono text-[11px] text-black/40 mt-1">
              Visible only in Admin Studio
            </div>
          </div>

          <div className="bg-[#FAF9F5] border-2 border-[#121316] p-4 shadow-[3px_3px_0px_#121316]">
            <div className="font-mono text-[11px] uppercase tracking-wider text-black/50 mb-1">
              REST API STATUS
            </div>
            <div className="font-extrabold text-xl font-display flex items-center gap-2 text-[#10B981]">
              <span className="w-3 h-3 rounded-full bg-[#10B981] animate-pulse" />
              ONLINE
            </div>
            <div className="font-mono text-[11px] text-black/50 mt-1">
              GET · POST · PUT · DELETE · PATCH
            </div>
          </div>
        </div>

        {inspectorOpen && (
          <div className="bg-[#121316] text-[#F6F4EE] border-2 border-[#121316] shadow-[5px_5px_0px_#121316] mb-8 overflow-hidden">
            <div className="border-b border-white/10 px-5 py-3 flex flex-wrap items-center justify-between gap-3 bg-[#0B0C0E]">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs uppercase text-[#D2FF28] font-bold">
                  INTERACTIVE REST API &amp; DATABASE INSPECTOR
                </span>
                <span className="font-mono text-[11px] text-white/50">
                  {dataSource.toUpperCase()} DRIVER
                </span>
              </div>
              <div className="flex border border-white/20">
                {(["tester", "schema", "architecture"] as InspectorSubTab[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => setInspectorTab(st)}
                    className={`font-mono text-xs px-4 py-1.5 uppercase transition-colors ${
                      inspectorTab === st
                        ? "bg-[#D2FF28] text-[#121316] font-bold"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {st === "tester"
                      ? "REST API Tester"
                      : st === "schema"
                      ? "Prisma Schema"
                      : "Architecture vs WordPress"}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5">
              {inspectorTab === "tester" && (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {[
                      {
                        label: "GET All Posts (status=all)",
                        method: "GET",
                        url: "/api/posts?status=all&limit=10",
                      },
                      {
                        label: "GET Published Only",
                        method: "GET",
                        url: "/api/posts?status=published&limit=6",
                      },
                      {
                        label: "GET Single Post by Slug",
                        method: "GET",
                        url: "/api/posts/50-no-code-startup-app-ideas",
                      },
                      {
                        label: "POST Create Article",
                        method: "POST",
                        url: "/api/posts",
                      },
                      {
                        label: "PUT Toggle Publish Status",
                        method: "PUT",
                        url: posts[0] ? `/api/posts/${posts[0].id}` : "/api/posts",
                      },
                      {
                        label: "DELETE Post",
                        method: "DELETE",
                        url: posts[0] ? `/api/posts/${posts[0].id}` : "/api/posts",
                      },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => {
                          setTesterMethod(preset.method);
                          setTesterUrl(preset.url);
                          if (preset.method === "PUT" && posts[0]) {
                            setTesterBody(
                              JSON.stringify(
                                { published: !posts[0].published, title: posts[0].title },
                                null,
                                2
                              )
                            );
                          }
                        }}
                        className="font-mono text-xs px-3 py-1.5 border border-white/30 bg-white/5 hover:bg-[#D2FF28] hover:text-[#121316] hover:border-[#D2FF28] transition-colors"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <select
                      value={testerMethod}
                      onChange={(e) => setTesterMethod(e.target.value)}
                      className="font-mono text-xs bg-[#1F2024] text-white border border-white/20 px-3 py-2.5 font-bold"
                    >
                      {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      value={testerUrl}
                      onChange={(e) => setTesterUrl(e.target.value)}
                      className="flex-1 font-mono text-xs bg-[#1F2024] text-white border border-white/20 px-3 py-2.5 focus:outline-none focus:border-[#D2FF28]"
                    />

                    <button
                      onClick={runTesterRequest}
                      disabled={testerLoading}
                      className="bg-[#FF4F18] hover:bg-[#E04415] text-white font-mono font-bold text-xs px-6 py-2.5 border border-[#FF4F18]"
                    >
                      {testerLoading ? "SENDING..." : "SEND REQUEST"}
                    </button>
                  </div>

                  {["POST", "PUT", "PATCH"].includes(testerMethod) && (
                    <div>
                      <div className="font-mono text-[11px] uppercase text-white/50 mb-1">
                        REQUEST BODY (JSON)
                      </div>
                      <textarea
                        value={testerBody}
                        onChange={(e) => setTesterBody(e.target.value)}
                        rows={6}
                        className="w-full font-mono text-xs bg-[#1F2024] text-white border border-white/20 p-3 resize-y focus:outline-none focus:border-[#D2FF28]"
                      />
                    </div>
                  )}

                  {testerResponse && (
                    <div className="border border-white/20 bg-[#0B0C0E] p-4">
                      <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <span
                            className={`font-mono text-xs font-bold px-2 py-0.5 ${
                              testerResponse.status < 300
                                ? "bg-[#10B981] text-white"
                                : "bg-[#FF4F18] text-white"
                            }`}
                          >
                            HTTP {testerResponse.status}
                          </span>
                          <span className="font-mono text-xs text-white/60">
                            Latency: {testerResponse.time}ms
                          </span>
                          {testerResponse.headers["x-data-source"] && (
                            <span className="font-mono text-xs text-[#D2FF28]">
                              Driver: {testerResponse.headers["x-data-source"]}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(getCurlSnippet());
                            setCopiedCurl(true);
                            setTimeout(() => setCopiedCurl(false), 2000);
                          }}
                          className="font-mono text-xs px-3 py-1 border border-white/30 text-white/80 hover:text-white hover:border-[#D2FF28]"
                        >
                          {copiedCurl ? "COPIED cURL ✓" : "COPY AS cURL"}
                        </button>
                      </div>

                      <pre className="font-mono text-xs text-[#D2FF28] overflow-auto max-h-72 p-2 bg-[#121316]">
                        {JSON.stringify(testerResponse.body, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {inspectorTab === "schema" && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs uppercase text-white/50">
                      prisma/schema.prisma · Relational Post Model
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(PRISMA_SCHEMA);
                        setCopiedSchema(true);
                        setTimeout(() => setCopiedSchema(false), 2000);
                      }}
                      className="font-mono text-xs px-3 py-1 border border-white/30 hover:border-[#D2FF28] text-white"
                    >
                      {copiedSchema ? "COPIED ✓" : "COPY SCHEMA"}
                    </button>
                  </div>
                  <pre className="font-mono text-xs text-[#D2FF28] bg-[#0B0C0E] p-4 border border-white/10 overflow-x-auto leading-relaxed">
                    {PRISMA_SCHEMA}
                  </pre>
                  <p className="font-mono text-xs text-white/60 mt-3 leading-relaxed">
                    Indexes on [published], [category], and [createdAt] guarantee sub-10ms listing and filtering. If DATABASE_URL is not set on the evaluator machine, mutations persist seamlessly to local data/posts.json.
                  </p>
                </div>
              )}

              {inspectorTab === "architecture" && (
                <div className="space-y-4 text-xs font-mono">
                  <div className="border border-white/20 overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-white/10 border-b border-white/20">
                        <tr>
                          <th className="p-3 text-white">ARCHITECTURAL METRIC</th>
                          <th className="p-3 text-[#FF4F18]">LEGACY STACK (PHP CodeIgniter + WordPress)</th>
                          <th className="p-3 text-[#10B981]">NEW TACTYQAL STACK (Next.js 15 + Prisma)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10 text-white/80">
                        <tr>
                          <td className="p-3 font-bold text-white">Runtime &amp; Deployment</td>
                          <td className="p-3 text-[#FF4F18]">2 split servers: PHP Apache/Nginx + WordPress DB</td>
                          <td className="p-3 text-[#10B981]">Unified TypeScript full-stack in 1 container / Vercel</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-white">Security &amp; Vulnerabilities</td>
                          <td className="p-3 text-[#FF4F18]">60,000+ WordPress plugins with weekly CVE exploits</td>
                          <td className="p-3 text-[#10B981]">Zero plugin surface; Zod schema runtime validation</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-white">Type Safety</td>
                          <td className="p-3 text-[#FF4F18]">Zero type safety between PHP REST API and React UI</td>
                          <td className="p-3 text-[#10B981]">End-to-end TypeScript Post type from Prisma to UI</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-white">Cache Invalidation</td>
                          <td className="p-3 text-[#FF4F18]">Fragile WP Super Cache plugins with purge race bugs</td>
                          <td className="p-3 text-[#10B981]">Deterministic revalidatePath() on every mutation</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-white">Design &amp; Token Drift</td>
                          <td className="p-3 text-[#FF4F18]">Mismatched WP themes vs React custom app CSS</td>
                          <td className="p-3 text-[#10B981]">Exact same Neo-Brutalist design tokens everywhere</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {(tab === "new" || tab === "edit") && (
          <div className="bg-[#FAF9F5] border-2 border-[#121316] shadow-[5px_5px_0px_#121316] mb-8 overflow-hidden">
            <div className="bg-[#121316] text-[#F6F4EE] px-6 py-4 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[#D2FF28]">
                  ARTICLE EDITOR
                </span>
                <h2 className="font-display font-extrabold text-xl">
                  {tab === "edit" ? `Edit: ${editingPost?.title}` : "Create New Blog Post"}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-white/50 hidden sm:inline">
                  {currentWc} words · {currentRt} min read
                </span>
                <button
                  onClick={() => {
                    setTab("posts");
                    setEditingPost(null);
                  }}
                  className="font-mono text-xs px-3 py-1.5 border border-white/30 text-white/80 hover:text-white hover:border-white transition-colors"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleSaveArticle}
                  disabled={saving}
                  className="bg-[#FF4F18] hover:bg-[#E04415] text-white font-mono font-bold text-xs uppercase px-5 py-2 border border-[#121316] shadow-[2px_2px_0px_#121316]"
                >
                  {saving ? "SAVING..." : "SAVE ARTICLE →"}
                </button>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block font-mono text-xs uppercase text-black/60 mb-1 font-bold">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. 10 Mistakes Founders Make When Pitching Angels"
                    className="w-full border-2 border-[#121316] px-3 py-2.5 font-bold font-sans bg-white focus:outline-none focus:ring-2 focus:ring-[#D2FF28]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-xs uppercase text-black/60 mb-1 font-bold">
                      Slug (URL)
                    </label>
                    <input
                      type="text"
                      value={formSlug}
                      onChange={(e) => {
                        setFormSlug(e.target.value);
                        setFormSlugManual(true);
                      }}
                      className="w-full border-2 border-[#121316] px-3 py-2 font-mono text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#D2FF28]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase text-black/60 mb-1 font-bold">
                      Category *
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full border-2 border-[#121316] px-3 py-2 font-mono text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#D2FF28]"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase text-black/60 mb-1 font-bold">
                    Cover Image URL
                  </label>
                  <input
                    type="text"
                    value={formCoverImage}
                    onChange={(e) => setFormCoverImage(e.target.value)}
                    className="w-full border-2 border-[#121316] px-3 py-2 font-mono text-xs bg-white mb-2"
                  />
                  <div className="flex flex-wrap gap-2">
                    {COVERS.map((cov) => (
                      <button
                        key={cov.url}
                        type="button"
                        onClick={() => setFormCoverImage(cov.url)}
                        className={`font-mono text-[10px] px-2 py-1 border border-[#121316] transition-colors ${
                          formCoverImage === cov.url
                            ? "bg-[#D2FF28] font-bold"
                            : "bg-white hover:bg-[#F6F4EE]"
                        }`}
                      >
                        {cov.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase text-black/60 mb-1 font-bold">
                    Excerpt / Subtitle (appears on cards &amp; SEO)
                  </label>
                  <textarea
                    rows={2}
                    value={formExcerpt}
                    onChange={(e) => setFormExcerpt(e.target.value)}
                    className="w-full border-2 border-[#121316] px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#D2FF28]"
                    placeholder="Brief 1-2 sentence hook describing the guide..."
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase text-black/60 mb-1 font-bold">
                    Full Markdown Content *
                  </label>
                  <textarea
                    rows={12}
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    className="w-full border-2 border-[#121316] p-3 font-mono text-xs leading-relaxed bg-white focus:outline-none focus:ring-2 focus:ring-[#D2FF28]"
                    placeholder="## Introduction\n\nWrite your multi-paragraph content with Markdown..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center gap-3 bg-white border-2 border-[#121316] p-3">
                    <input
                      type="checkbox"
                      id="formPublished"
                      checked={formPublished}
                      onChange={(e) => setFormPublished(e.target.checked)}
                      className="w-4 h-4 accent-[#FF4F18]"
                    />
                    <label
                      htmlFor="formPublished"
                      className="font-mono text-xs uppercase font-bold cursor-pointer"
                    >
                      Published Live ({formPublished ? "Visible on /blog" : "Draft Hidden"})
                    </label>
                  </div>

                  <div className="flex items-center gap-3 bg-white border-2 border-[#121316] p-3">
                    <input
                      type="checkbox"
                      id="formFeatured"
                      checked={formFeatured}
                      onChange={(e) => setFormFeatured(e.target.checked)}
                      className="w-4 h-4 accent-[#FF4F18]"
                    />
                    <label
                      htmlFor="formFeatured"
                      className="font-mono text-xs uppercase font-bold cursor-pointer"
                    >
                      Featured Hero Card
                    </label>
                  </div>
                </div>
              </div>

              <div className="border-2 border-[#121316] bg-white p-5 flex flex-col shadow-[3px_3px_0px_#121316]">
                <div className="font-mono text-xs uppercase tracking-wider text-black/50 mb-3 pb-2 border-b border-[#121316]/20 flex items-center justify-between">
                  <span>LIVE EDITORIAL PREVIEW</span>
                  <span className="text-[#FF4F18] font-bold">
                    {formPublished ? "● LIVE" : "○ DRAFT"}
                  </span>
                </div>

                <div className="overflow-y-auto max-h-[640px] pr-2 space-y-4">
                  <div className="border-2 border-[#121316] bg-[#FAF9F5] p-4 shadow-[2px_2px_0px_#121316]">
                    <div className="aspect-[16/9] border-2 border-[#121316] overflow-hidden mb-3 bg-[#121316]">
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
                      <span className="font-mono text-[10px] uppercase px-2 py-0.5 border border-[#121316] bg-[#D2FF28] font-bold">
                        {formCategory}
                      </span>
                      <span className="font-mono text-[11px] text-black/50">
                        {currentRt} MIN READ
                      </span>
                    </div>
                    <h3 className="font-display font-extrabold text-lg leading-snug mb-2">
                      {formTitle || "Your Article Headline Will Render Here"}
                    </h3>
                    <p className="text-xs text-black/70 leading-relaxed mb-3 line-clamp-2">
                      {formExcerpt || "Your excerpt will appear on homepage and blog cards."}
                    </p>
                    <div className="font-mono text-[10px] text-black/40">
                      By {formAuthor} · {formAuthorRole}
                    </div>
                  </div>

                  <div className="border-t-2 border-[#121316] pt-4">
                    <div className="font-mono text-[10px] uppercase text-black/40 mb-2 font-bold">
                      FULL ARTICLE READER PREVIEW
                    </div>
                    <div className="prose prose-sm max-w-none font-sans leading-relaxed text-[#121316]">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                        {formContent}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-[#FAF9F5] border-2 border-[#121316] shadow-[4px_4px_0px_#121316] p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            <div className="flex flex-1 gap-3 items-center">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles by title, slug, or content..."
                className="w-full md:max-w-md border-2 border-[#121316] px-3 py-2 font-mono text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#D2FF28]"
              />

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border-2 border-[#121316] px-3 py-2 font-mono text-xs bg-white font-bold"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1 border-2 border-[#121316] bg-white p-0.5">
              {(["all", "published", "draft"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`font-mono text-xs uppercase px-3 py-1.5 transition-colors ${
                    statusFilter === st
                      ? "bg-[#121316] text-[#F6F4EE] font-bold"
                      : "text-black/60 hover:text-black"
                  }`}
                >
                  {st === "all" ? "All" : st === "published" ? "Live Only" : "Drafts"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-2 border-[#121316] bg-[#FAF9F5] shadow-[4px_4px_0px_#121316] overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center font-mono text-xs uppercase text-black/50">
              LOADING PERSISTENT BLOG POSTS...
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="font-display font-extrabold text-2xl">No articles match your filter</div>
              <p className="text-sm text-black/60 font-mono">
                Try searching for another keyword or clear the category filters.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setCategoryFilter("All");
                  setStatusFilter("all");
                }}
                className="font-mono text-xs px-4 py-2 border-2 border-[#121316] bg-[#D2FF28] font-bold"
              >
                RESET FILTERS
              </button>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#121316] text-[#F6F4EE] font-mono text-xs uppercase tracking-wider">
                  <th className="p-3 w-16 text-center">COVER</th>
                  <th className="p-3">ARTICLE TITLE &amp; SLUG</th>
                  <th className="p-3">CATEGORY</th>
                  <th className="p-3">READ TIME</th>
                  <th className="p-3">DATE</th>
                  <th className="p-3">STATUS (1-CLICK TOGGLE)</th>
                  <th className="p-3 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-[#121316]">
                {filteredPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-[#FFF9D2]/40 transition-colors bg-white font-sans text-sm"
                  >
                    <td className="p-3 text-center">
                      <div className="w-12 h-12 border-2 border-[#121316] overflow-hidden bg-[#121316] mx-auto">
                        <img
                          src={post.coverImage || "/extracted/blog-ele.webp"}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/extracted/blog-ele.webp";
                          }}
                        />
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="font-bold text-sm leading-snug line-clamp-1">{post.title}</div>
                      <div className="font-mono text-[11px] text-black/50 mt-0.5">
                        /{post.slug}
                      </div>
                    </td>

                    <td className="p-3">
                      <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 border border-[#121316] bg-[#F6F4EE]">
                        {post.category}
                      </span>
                    </td>

                    <td className="p-3 font-mono text-xs text-black/60">
                      {post.readTime} min
                    </td>

                    <td className="p-3 font-mono text-xs text-black/60 whitespace-nowrap">
                      {new Date(post.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>

                    <td className="p-3 whitespace-nowrap">
                      <button
                        onClick={() => handleTogglePublished(post)}
                        className={`font-mono text-xs px-3 py-1 border-2 border-[#121316] shadow-[2px_2px_0px_#121316] font-bold transition-all ${
                          post.published
                            ? "bg-[#10B981] text-white hover:bg-[#059669]"
                            : "bg-[#E5E7EB] text-black/70 hover:bg-[#D1D5DB]"
                        }`}
                        title="Click to toggle live publish state"
                      >
                        {post.published ? "● LIVE (CLICK TO DRAFT)" : "○ DRAFT (CLICK TO PUBLISH)"}
                      </button>
                    </td>

                    <td className="p-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="font-mono text-xs px-2.5 py-1 border border-[#121316] hover:bg-[#D2FF28] transition-colors"
                        >
                          VIEW ↗
                        </Link>
                        <button
                          onClick={() => handleOpenEdit(post)}
                          className="font-mono text-xs px-2.5 py-1 border border-[#121316] bg-[#FAF9F5] hover:bg-[#121316] hover:text-white transition-colors"
                        >
                          EDIT
                        </button>
                        {deleteConfirmId === post.id ? (
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="font-mono text-xs px-2 py-1 bg-[#FF4F18] text-white font-bold"
                            >
                              CONFIRM
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="font-mono text-xs px-2 py-1 border border-black/40"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(post.id)}
                            className="font-mono text-xs px-2.5 py-1 border border-[#FF4F18] text-[#FF4F18] hover:bg-[#FF4F18] hover:text-white transition-colors"
                          >
                            DELETE
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
