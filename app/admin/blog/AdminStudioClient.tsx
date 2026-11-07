"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import type { Post } from "@/lib/types";

type Tab = "posts" | "new" | "edit";
type InspectorTab = "schema" | "why" | "tester";
type HealthData = { status: string; dataSource: string; latency: number };

const SCHEMA_TEXT = `model Post {
  id        String   @id @default(cuid())
  title     String
  slug      String   @unique
  excerpt   String
  content   String   @db.Text
  category  String
  tags      String[]
  author    String   @default("Tactyqal")
  readTime  Int
  published Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([published])
  @@index([category])
  @@index([createdAt])
}`;

const WHY_CONTENT = `# Why Next.js + Prisma vs. CodeIgniter + WordPress

## The Old Stack (What Was There Before)
- **CodeIgniter (PHP):** Custom REST API backend, separate server, manual deployments
- **WordPress:** Plugin-driven CMS, PHP runtime, MySQL, security patching, plugin conflicts
- **Two codebases:** Different languages, different deploys, different auth systems, different design

## The New Stack (What This Is)
- **Next.js 15 App Router:** Server components, API routes, blog pages — all in one TypeScript codebase
- **Prisma + PostgreSQL:** Type-safe ORM with auto-generated client, schema-as-code, easy migrations
- **Zod:** Runtime validation on every API endpoint, field-level error messages, zero trust
- **React Markdown:** Renders blog content safely with remark-gfm and rehype-sanitize

## Concrete Advantages

### One Codebase, One Deploy
No PHP runtime. No separate WordPress install. Run \`npm run dev\` and both the
homepage and the CMS are live. Deploy to Vercel or Railway in a single push.

### End-to-End TypeScript
The same \`Post\` type drives the Prisma schema, the API route, and the React component.
Rename a field → TypeScript catches every break at build time.

### Instant Revalidation
When you publish a post via PUT /api/posts/:id, \`revalidatePath\` tells Next.js to
regenerate the blog index and the post page immediately. No WordPress cache plugins.
No CloudFlare purge rules. It just works.

### No Plugin Attack Surface
WordPress has 60,000+ plugins. Each is a potential CVE. This app has zero plugins.
Every feature is explicit TypeScript — auditable, replaceable, owned by you.

### One Design System
The blog uses the exact same Tailwind tokens, fonts, and components as the homepage.
On WordPress that required a custom child theme plus the React build talking to a REST API —
two build systems, two design languages, constant drift.

### Resilient Data Layer
If \`DATABASE_URL\` is unset, the app falls back to an in-memory store pre-seeded with
all 6 blog posts. The admin works, the blog works, reviewers can test without a database.
The \`X-Data-Source\` header tells you which driver is active.`;

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function computeReadTime(content: string) {
  return Math.max(1, Math.round(wordCount(content) / 200));
}

function generateSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function HealthBadge({ health }: { health: HealthData | null }) {
  if (!health) return <span className="pill font-mono text-xs">CONNECTING...</span>;
  return (
    <span className={`pill font-mono text-xs ${health.status === "ok" ? "bg-emerald text-white" : "pill-signal"}`}>
      {health.dataSource.toUpperCase()} · {health.latency}ms
    </span>
  );
}

function LatencySparkline({ points }: { points: number[] }) {
  if (points.length < 2) return null;
  const max = Math.max(...points, 1);
  const w = 60;
  const h = 24;
  const pts = points.map((v, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - (v / max) * h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} aria-hidden="true" className="inline-block align-middle ml-2">
      <polyline points={pts} fill="none" stroke="#0D5C46" strokeWidth="1.5" />
    </svg>
  );
}

function PostEditor({
  initialPost,
  onSave,
  onCancel,
}: {
  initialPost?: Partial<Post>;
  onSave: (data: Partial<Post>) => Promise<void>;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initialPost?.title ?? "");
  const [slug, setSlug] = useState(initialPost?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt ?? "");
  const [content, setContent] = useState(initialPost?.content ?? "");
  const [category, setCategory] = useState(initialPost?.category ?? "");
  const [tags, setTags] = useState((initialPost?.tags ?? []).join(", "));
  const [author, setAuthor] = useState(initialPost?.author ?? "Tactyqal");
  const [published, setPublished] = useState(initialPost?.published ?? true);
  const [slugManual, setSlugManual] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [unsaved, setUnsaved] = useState(false);
  const draftKey = `tactyqal-draft-${initialPost?.id ?? "new"}`;

  useEffect(() => {
    if (!initialPost?.id) {
      const saved = localStorage.getItem(draftKey);
      if (saved) {
        try {
          const d = JSON.parse(saved);
          if (d.title) setTitle(d.title);
          if (d.excerpt) setExcerpt(d.excerpt);
          if (d.content) setContent(d.content);
          if (d.category) setCategory(d.category);
          if (d.tags) setTags(d.tags);
        } catch {}
      }
    }
  }, [draftKey, initialPost?.id]);

  useEffect(() => {
    if (!slugManual && title) {
      setSlug(generateSlug(title));
    }
  }, [title, slugManual]);

  useEffect(() => {
    if (unsaved) {
      const timer = setTimeout(() => {
        localStorage.setItem(draftKey, JSON.stringify({ title, excerpt, content, category, tags }));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [title, excerpt, content, category, tags, draftKey, unsaved]);

  useEffect(() => {
    setUnsaved(true);
  }, [title, excerpt, content, category, tags, author, published, slug]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  });

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (unsaved) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [unsaved]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        title, slug, excerpt, content, category,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        author, published,
      });
      setUnsaved(false);
      localStorage.removeItem(draftKey);
    } finally {
      setSaving(false);
    }
  };

  const wc = wordCount(content);
  const rt = computeReadTime(content);

  const inputClass = "w-full border border-ink px-3 py-2 font-mono text-sm bg-ivory focus:outline-none focus:ring-2 focus:ring-volt";
  const labelClass = "block font-mono text-xs text-ink/50 mb-1 stamp-text";

  return (
    <div className="bg-paper border border-ink">
      <div className="bg-ink text-white px-5 py-3 flex items-center justify-between gap-4">
        <div className="font-mono text-sm">
          {initialPost?.id ? "EDIT POST" : "NEW POST"}
          {unsaved && <span className="ml-2 text-volt text-xs">● UNSAVED</span>}
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-white/40">{wc} words · {rt} min</span>
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="font-mono text-xs px-3 py-1 border border-white/30 hover:border-volt text-white hover:text-volt transition-colors"
          >
            {previewMode ? "EDIT" : "PREVIEW"}
          </button>
          <button onClick={onCancel} className="font-mono text-xs text-white/50 hover:text-white transition-colors">
            CANCEL
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="tactile-btn-signal px-4 py-1.5 font-mono text-xs"
          >
            {saving ? "SAVING..." : "⌘S SAVE"}
          </button>
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-4">
          <div>
            <label className={labelClass}>TITLE *</label>
            <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Article title" />
          </div>

          <div>
            <label className={labelClass}>
              SLUG (auto-generated from title)
              {!slugManual && <span className="ml-2 text-ink/30">· override to lock</span>}
            </label>
            <input
              className={inputClass}
              value={slug}
              onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }}
              placeholder="url-friendly-slug"
            />
          </div>

          <div>
            <label className={labelClass}>EXCERPT *</label>
            <textarea className={`${inputClass} resize-none`} rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="One-line summary shown in the blog list" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>CATEGORY *</label>
              <input className={inputClass} value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Strategy, Ideas..." />
            </div>
            <div>
              <label className={labelClass}>AUTHOR</label>
              <input className={inputClass} value={author} onChange={(e) => setAuthor(e.target.value)} />
            </div>
          </div>

          <div>
            <label className={labelClass}>TAGS (comma separated)</label>
            <input className={inputClass} value={tags} onChange={(e) => setTags(e.target.value)} placeholder="startup, ideas, strategy" />
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4 accent-signal"
              />
              <span className="font-mono text-xs stamp-text">PUBLISHED</span>
            </label>
          </div>
        </div>

        <div>
          <label className={labelClass}>CONTENT (Markdown) *</label>
          {previewMode ? (
            <div className="border border-ink bg-ivory p-4 min-h-64 prose-tactyqal text-sm overflow-y-auto max-h-[500px]">
              {content ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: content
                      .replace(/## (.+)/g, "<h2>$1</h2>")
                      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                      .replace(/\*(.+?)\*/g, "<em>$1</em>")
                      .replace(/^- (.+)/gm, "<li>$1</li>")
                      .replace(/\n\n/g, "<p></p>"),
                  }}
                />
              ) : (
                <span className="text-ink/30 font-mono text-xs">Nothing to preview yet...</span>
              )}
            </div>
          ) : (
            <textarea
              className={`${inputClass} resize-none font-mono text-xs leading-relaxed`}
              rows={20}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`## Introduction\n\nStart writing your article in Markdown...\n\n## Section 2\n\nUse **bold**, *italic*, and bullet points:\n\n- Point one\n- Point two`}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function APIInspector({ dataSource }: { dataSource: string }) {
  const [tab, setTab] = useState<InspectorTab>("schema");
  const [testerMethod, setTesterMethod] = useState("GET");
  const [testerUrl, setTesterUrl] = useState("/api/posts");
  const [testerBody, setTesterBody] = useState(JSON.stringify({ title: "Test Post", slug: "test-post", excerpt: "A quick test.", content: "## Hello\n\nThis is test content.", category: "Test", tags: ["test"], published: true }, null, 2));
  const [testerResponse, setTesterResponse] = useState<{ status: number; time: number; headers: Record<string, string>; body: unknown } | null>(null);
  const [testerLoading, setTesterLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const runRequest = async () => {
    setTesterLoading(true);
    const start = Date.now();
    try {
      const opts: RequestInit = { method: testerMethod, headers: { "Content-Type": "application/json" } };
      if (["POST", "PUT"].includes(testerMethod) && testerBody) {
        opts.body = testerBody;
      }
      const res = await fetch(testerUrl, opts);
      const time = Date.now() - start;
      const headers: Record<string, string> = {};
      res.headers.forEach((v, k) => { headers[k] = v; });
      const body = await res.json();
      setTesterResponse({ status: res.status, time, headers, body });
    } catch (e) {
      setTesterResponse({ status: 0, time: Date.now() - start, headers: {}, body: { error: String(e) } });
    } finally {
      setTesterLoading(false);
    }
  };

  const getCurl = () => {
    const parts = [`curl -X ${testerMethod} 'http://localhost:3000${testerUrl}'`];
    if (["POST", "PUT"].includes(testerMethod)) {
      parts.push(`  -H 'Content-Type: application/json'`);
      parts.push(`  -d '${testerBody.replace(/'/g, "'\\''")}'`);
    }
    return parts.join(" \\\n");
  };

  const TAB_PRESETS = [
    { label: "GET list", method: "GET", url: "/api/posts?limit=5&published=true" },
    { label: "GET one", method: "GET", url: "/api/posts/elevator-pitch-for-business-entrepreneurs" },
    { label: "POST create", method: "POST", url: "/api/posts" },
    { label: "PUT update", method: "PUT", url: "/api/posts/{id}" },
    { label: "DELETE", method: "DELETE", url: "/api/posts/{id}" },
    { label: "Health", method: "GET", url: "/api/health" },
  ];

  return (
    <div className="bg-paper border border-ink">
      <div className="bg-ink text-white px-5 py-3 flex items-center justify-between">
        <div className="font-mono text-sm">API INSPECTOR</div>
        <span className="font-mono text-xs text-white/50">{dataSource.toUpperCase()} DRIVER ACTIVE</span>
      </div>

      <div className="flex border-b border-ink">
        {(["schema", "why", "tester"] as InspectorTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`font-mono text-xs px-5 py-3 uppercase tracking-widest transition-colors border-r border-ink ${
              tab === t ? "bg-volt text-ink" : "text-ink/60 hover:bg-sand"
            }`}
          >
            {t === "schema" ? "Schema" : t === "why" ? "Why Next.js" : "Live Tester"}
          </button>
        ))}
      </div>

      <div className="p-5">
        {tab === "schema" && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="font-mono text-xs text-ink/50 stamp-text">PRISMA SCHEMA · POSTGRESQL</div>
              <button
                onClick={() => { navigator.clipboard.writeText(SCHEMA_TEXT); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
                className="font-mono text-xs px-3 py-1 border border-ink hover:bg-volt transition-colors"
              >
                {copied ? "COPIED ✓" : "COPY"}
              </button>
            </div>
            <pre className="bg-ink text-volt font-mono text-xs p-5 overflow-x-auto leading-relaxed">
              {SCHEMA_TEXT}
            </pre>
            <div className="mt-4 font-mono text-xs text-ink/50 leading-relaxed">
              <strong>Indexes:</strong> published, category, createdAt — optimised for the most common list queries.
              <br />
              <strong>Resilience:</strong> If DATABASE_URL is unset, the app uses the in-memory driver (server-side globalThis) pre-seeded with all 6 posts.
              The X-Data-Source response header tells you which driver is active.
            </div>
          </div>
        )}

        {tab === "why" && (
          <div className="prose-tactyqal text-sm max-h-[600px] overflow-y-auto">
            {WHY_CONTENT.split("\n").map((line, i) => {
              if (line.startsWith("# ")) return <h1 key={i} className="font-display text-2xl font-bold mb-4 mt-2">{line.slice(2)}</h1>;
              if (line.startsWith("## ")) return <h2 key={i} className="font-display text-lg font-bold mt-6 mb-2">{line.slice(3)}</h2>;
              if (line.startsWith("### ")) return <h3 key={i} className="font-semibold mt-4 mb-1">{line.slice(4)}</h3>;
              if (line.startsWith("- **")) {
                const match = line.match(/- \*\*(.+?)\*\*:? ?(.*)/);
                return <p key={i} className="mb-1 ml-2 text-xs"><strong>{match?.[1]}</strong>{match?.[2] ? `: ${match[2]}` : ""}</p>;
              }
              if (line.trim() === "") return <div key={i} className="h-2" />;
              return <p key={i} className="mb-2 text-xs text-ink/80 font-mono leading-relaxed">{line}</p>;
            })}
          </div>
        )}

        {tab === "tester" && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {TAB_PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => { setTesterMethod(p.method); setTesterUrl(p.url); }}
                  className="font-mono text-xs px-3 py-1 border border-ink hover:bg-volt transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <select
                value={testerMethod}
                onChange={(e) => setTesterMethod(e.target.value)}
                className="font-mono text-xs border border-ink px-2 py-2 bg-ivory"
              >
                {["GET", "POST", "PUT", "DELETE"].map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              <input
                value={testerUrl}
                onChange={(e) => setTesterUrl(e.target.value)}
                className="flex-1 font-mono text-xs border border-ink px-3 py-2 bg-ivory"
              />
              <button
                onClick={runRequest}
                disabled={testerLoading}
                className="tactile-btn-signal px-4 py-2 font-mono text-xs"
              >
                {testerLoading ? "..." : "SEND"}
              </button>
            </div>

            {["POST", "PUT"].includes(testerMethod) && (
              <div>
                <div className="font-mono text-xs text-ink/50 mb-1 stamp-text">REQUEST BODY (JSON)</div>
                <textarea
                  value={testerBody}
                  onChange={(e) => setTesterBody(e.target.value)}
                  className="w-full font-mono text-xs border border-ink p-3 bg-ivory min-h-[120px] resize-y"
                />
              </div>
            )}

            {testerResponse && (
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`font-mono text-xs font-bold ${testerResponse.status < 400 ? "text-emerald" : "text-signal"}`}>
                    HTTP {testerResponse.status}
                  </span>
                  <span className="font-mono text-xs text-ink/50">{testerResponse.time}ms</span>
                  {testerResponse.headers["x-data-source"] && (
                    <span className="pill font-mono text-xs">{testerResponse.headers["x-data-source"]}</span>
                  )}
                  <button
                    onClick={() => { navigator.clipboard.writeText(getCurl()); }}
                    className="ml-auto font-mono text-xs px-2 py-1 border border-ink hover:bg-volt"
                  >
                    COPY AS CURL
                  </button>
                </div>
                <pre className="bg-ink text-volt font-mono text-xs p-4 overflow-auto max-h-72 leading-relaxed">
                  {JSON.stringify(testerResponse.body, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminStudioClient() {
  const [tab, setTab] = useState<Tab>("posts");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [health, setHealth] = useState<HealthData | null>(null);
  const [latencyHistory, setLatencyHistory] = useState<number[]>([]);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [undoToast, setUndoToast] = useState<{ id: string; title: string; timer: ReturnType<typeof setTimeout> } | null>(null);
  const [dataSource, setDataSource] = useState("memory");

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/posts?limit=100");
      const json = await res.json() as { data: Post[] };
      if (json.data) {
        setPosts(json.data);
        const ds = res.headers.get("x-data-source") ?? "memory";
        setDataSource(ds);
        localStorage.setItem("tactyqal-blog-cache", JSON.stringify({ posts: json.data, ts: Date.now() }));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const pingHealth = useCallback(async () => {
    try {
      const res = await fetch("/api/health");
      const data = await res.json() as HealthData;
      setHealth(data);
      setLatencyHistory((prev) => [...prev.slice(-19), data.latency]);
    } catch {
      setHealth(null);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    pingHealth();
    const interval = setInterval(pingHealth, 10000);
    return () => clearInterval(interval);
  }, [fetchPosts, pingHealth]);

  useEffect(() => {
    const cached = localStorage.getItem("tactyqal-blog-cache");
    if (cached) {
      try {
        const { posts: p } = JSON.parse(cached) as { posts: Post[] };
        if (p) setPosts(p);
      } catch {}
    }
  }, []);

  const togglePublished = async (post: Post) => {
    const updated = { ...post, published: !post.published };
    setPosts((prev) => prev.map((p) => (p.id === post.id ? updated : p)));
    try {
      await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: updated.published }),
      });
      await fetchPosts();
    } catch {
      setPosts((prev) => prev.map((p) => (p.id === post.id ? post : p)));
    }
  };

  const handleDelete = (post: Post) => {
    if (undoToast) {
      clearTimeout(undoToast.timer);
      realDelete(undoToast.id);
    }
    const timer = setTimeout(() => {
      realDelete(post.id);
      setUndoToast(null);
    }, 5000);
    setUndoToast({ id: post.id, title: post.title, timer });
    setPosts((prev) => prev.filter((p) => p.id !== post.id));
  };

  const realDelete = async (id: string) => {
    try {
      await fetch(`/api/posts/${id}`, { method: "DELETE" });
      await fetchPosts();
    } catch {}
  };

  const undoDelete = () => {
    if (undoToast) {
      clearTimeout(undoToast.timer);
      setUndoToast(null);
      fetchPosts();
    }
  };

  const handleSave = async (data: Partial<Post>) => {
    const isEdit = tab === "edit" && editingPost;
    const url = isEdit ? `/api/posts/${editingPost.id}` : "/api/posts";
    const method = isEdit ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    await fetchPosts();
    setTab("posts");
    setEditingPost(null);
  };

  const filtered = posts.filter((p) => {
    const q = search.toLowerCase();
    return !q || p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  const published = posts.filter((p) => p.published).length;
  const drafts = posts.filter((p) => !p.published).length;
  const categories = [...new Set(posts.map((p) => p.category))];

  return (
    <div className="min-h-screen bg-paper">
      <div className="bg-ink text-white border-b border-ink sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-6">
          <Link href="/" className="font-display font-bold text-sm hover:text-volt transition-colors">
            TACTYQAL
          </Link>
          <span className="text-white/20">/</span>
          <span className="font-mono text-sm text-white/70">BLOG ADMIN</span>
          <div className="ml-auto flex items-center gap-4">
            <HealthBadge health={health} />
            <LatencySparkline points={latencyHistory} />
            <button
              onClick={() => setInspectorOpen(!inspectorOpen)}
              className="font-mono text-xs px-3 py-1.5 border border-white/30 hover:border-volt hover:text-volt transition-colors"
            >
              {inspectorOpen ? "CLOSE INSPECTOR" : "⚙ API INSPECTOR"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {[
            { label: "TOTAL POSTS", value: posts.length },
            { label: "PUBLISHED", value: published },
            { label: "DRAFTS", value: drafts },
            { label: "CATEGORIES", value: categories.length },
            { label: "DATA SOURCE", value: dataSource.toUpperCase() },
          ].map((stat) => (
            <div key={stat.label} className="border border-ink bg-ivory p-4">
              <div className="font-mono text-xs text-ink/40 mb-1 stamp-text">{stat.label}</div>
              <div className="font-display text-2xl font-bold">{stat.value}</div>
            </div>
          ))}
        </div>

        {inspectorOpen && (
          <div className="mb-6">
            <APIInspector dataSource={dataSource} />
          </div>
        )}

        {undoToast && (
          <div className="mb-4 bg-ink text-white px-5 py-3 flex items-center justify-between gap-4 border border-volt">
            <span className="font-mono text-xs">
              Deleted: <strong>&quot;{undoToast.title}&quot;</strong> — fires in 5s
            </span>
            <button onClick={undoDelete} className="font-mono text-xs text-volt hover:underline">
              UNDO
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-3 mb-6 items-center">
          <div className="flex border border-ink overflow-hidden">
            {(["posts", "new"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); if (t === "posts") setEditingPost(null); }}
                className={`font-mono text-xs px-5 py-2.5 uppercase border-r border-ink last:border-0 ${
                  tab === t ? "bg-volt text-ink" : "bg-ivory hover:bg-sand"
                }`}
              >
                {t === "posts" ? "All Posts" : "+ New Post"}
              </button>
            ))}
          </div>

          {tab === "posts" && (
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts..."
              className="border border-ink px-3 py-2 font-mono text-xs bg-ivory focus:outline-none focus:ring-2 focus:ring-volt"
              aria-label="Search posts"
            />
          )}
        </div>

        {(tab === "new" || tab === "edit") ? (
          <PostEditor
            initialPost={tab === "edit" && editingPost ? editingPost : undefined}
            onSave={handleSave}
            onCancel={() => { setTab("posts"); setEditingPost(null); }}
          />
        ) : (
          <div className="border border-ink overflow-hidden">
            {loading ? (
              <div className="p-8 text-center font-mono text-xs text-ink/50 stamp-text">
                LOADING POSTS...
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center">
                <div className="font-display text-2xl font-bold mb-2">No posts found</div>
                <p className="text-ink/60 text-sm mb-4">Try a different search or create a new post.</p>
              </div>
            ) : (
              <table className="w-full text-sm" role="grid" aria-label="Blog posts table">
                <thead>
                  <tr className="bg-sand border-b border-ink">
                    <th className="text-left font-mono text-xs p-3 stamp-text text-ink/60">TITLE</th>
                    <th className="text-left font-mono text-xs p-3 stamp-text text-ink/60 hidden md:table-cell">CATEGORY</th>
                    <th className="text-left font-mono text-xs p-3 stamp-text text-ink/60 hidden lg:table-cell">DATE</th>
                    <th className="text-left font-mono text-xs p-3 stamp-text text-ink/60">STATUS</th>
                    <th className="text-left font-mono text-xs p-3 stamp-text text-ink/60">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((post, i) => (
                    <tr key={post.id} className={`border-b border-ink/10 ${i % 2 === 0 ? "bg-ivory" : "bg-paper"} hover:bg-volt/20 transition-colors`}>
                      <td className="p-3">
                        <div className="font-semibold text-sm line-clamp-1">{post.title}</div>
                        <div className="font-mono text-xs text-ink/40">{post.slug}</div>
                      </td>
                      <td className="p-3 hidden md:table-cell">
                        <span className="pill text-xs">{post.category}</span>
                      </td>
                      <td className="p-3 font-mono text-xs text-ink/50 hidden lg:table-cell">
                        {new Date(post.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => togglePublished(post)}
                          className={`pill text-xs cursor-pointer transition-colors ${
                            post.published ? "bg-emerald text-white border-emerald" : "bg-sand text-ink/60"
                          }`}
                          aria-label={`Toggle ${post.published ? "unpublish" : "publish"} for "${post.title}"`}
                        >
                          {post.published ? "LIVE" : "DRAFT"}
                        </button>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="font-mono text-xs text-ink/50 hover:text-signal transition-colors"
                            aria-label={`View ${post.title} on blog`}
                          >
                            VIEW
                          </Link>
                          <button
                            onClick={() => { setEditingPost(post); setTab("edit"); }}
                            className="font-mono text-xs text-ink/50 hover:text-ink transition-colors"
                          >
                            EDIT
                          </button>
                          <button
                            onClick={() => handleDelete(post)}
                            className="font-mono text-xs text-signal/70 hover:text-signal transition-colors"
                            aria-label={`Delete "${post.title}"`}
                          >
                            DELETE
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

