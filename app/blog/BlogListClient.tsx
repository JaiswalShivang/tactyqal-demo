"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Post } from "@/lib/types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-volt text-ink">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default function BlogListClient({
  initialPosts,
  categories,
}: {
  initialPosts: Post[];
  categories: string[];
}) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filtered = useMemo(() => {
    let posts = [...initialPosts];
    if (activeCategory !== "All") {
      posts = posts.filter(
        (p) => p.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return posts;
  }, [initialPosts, query, activeCategory]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: initialPosts.length };
    for (const post of initialPosts) {
      counts[post.category] = (counts[post.category] ?? 0) + 1;
    }
    return counts;
  }, [initialPosts]);

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen pt-20">
        <div className="border-b border-ink bg-paper">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="section-number mb-4">THE FOUNDERS DESK</div>
            <h1 className="headline-display mb-6">
              Startup Knowledge<br />
              <span className="volt-highlight">For Young Founders</span>
            </h1>

            <div className="relative max-w-xl">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full border border-ink px-4 py-3 font-mono text-sm bg-ivory focus:outline-none focus:ring-2 focus:ring-volt"
                aria-label="Search blog posts"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink font-mono text-xs"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-wrap gap-2 mb-10" role="group" aria-label="Filter by category">
            {["All", ...categories].map((cat) => {
              const count = categoryCounts[cat] ?? 0;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`pill text-sm transition-colors ${
                    activeCategory === cat
                      ? "bg-ink text-paper border-ink"
                      : "hover:bg-sand"
                  }`}
                  aria-pressed={activeCategory === cat}
                >
                  {cat}
                  <span className="ml-2 font-mono text-xs opacity-60">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="font-display font-bold text-4xl mb-4">
                No articles found
              </div>
              <p className="text-ink/60 mb-6">
                Try a different search term or category.
              </p>
              <button
                onClick={() => { setQuery(""); setActiveCategory("All"); }}
                className="tactile-btn px-6 py-3 font-semibold bg-volt"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 space-y-6">
                {featured && (
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="block ticket-card hover:shadow-tactile-signal transition-all group"
                  >
                    <div className="p-8">
                      {featured.coverImage && (
                        <div className="border border-ink mb-6 overflow-hidden bg-white shadow-tactile-sm">
                          <div className="relative aspect-[21/9] overflow-hidden">
                            <img
                              src={featured.coverImage}
                              alt={featured.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3 mb-4">
                        <span className="bg-signal text-white font-mono text-xs px-3 py-1 stamp-text">
                          FEATURED
                        </span>
                        <span className="pill pill-volt text-xs">{featured.category}</span>
                        <span className="font-mono text-xs text-ink/40">
                          {featured.readTime} min
                        </span>
                      </div>
                      <h2 className="font-display text-3xl font-bold mb-3 leading-tight group-hover:text-signal transition-colors">
                        {highlightMatch(featured.title, query)}
                      </h2>
                      <p className="text-ink/60 leading-relaxed mb-4">
                        {highlightMatch(featured.excerpt, query)}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="font-mono text-xs text-ink/40">
                          {new Date(featured.createdAt).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                          {" · "}By {featured.author}
                        </div>
                        <span className="font-mono text-xs text-signal group-hover:translate-x-1 transition-transform stamp-text">
                          READ FULL STORY →
                        </span>
                      </div>
                    </div>
                  </Link>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rest.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="ticket-card hover:shadow-tactile transition-all group"
                    >
                      <div className="p-5">
                        {post.coverImage && (
                          <div className="border border-ink mb-4 overflow-hidden bg-white shadow-tactile-sm">
                            <div className="relative aspect-[16/9] overflow-hidden">
                              <img
                                src={post.coverImage}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                              />
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="pill text-xs">{post.category}</span>
                          <span className="font-mono text-xs text-ink/40">
                            {post.readTime} min
                          </span>
                        </div>
                        <h3 className="font-display font-bold text-lg mb-2 leading-tight group-hover:text-signal transition-colors">
                          {highlightMatch(post.title, query)}
                        </h3>
                        <p className="text-sm text-ink/60 line-clamp-2 mb-3">
                          {highlightMatch(post.excerpt, query)}
                        </p>
                        <div className="font-mono text-xs text-ink/40">
                          {new Date(post.createdAt).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <aside className="space-y-6" aria-label="Latest articles sidebar">
                <div className="border border-ink bg-ivory p-5">
                  <div className="font-mono text-xs text-ink/40 mb-4 stamp-text border-b border-ink/20 pb-3">
                    LATEST
                  </div>
                  <ol className="space-y-4">
                    {initialPosts.slice(0, 6).map((post, i) => (
                      <li key={post.id} className="flex gap-3">
                        <span className="font-mono text-xs text-ink/30 flex-shrink-0 mt-0.5">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="font-semibold text-sm leading-snug hover:text-signal transition-colors"
                        >
                          {post.title}
                        </Link>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="border border-ink bg-volt p-5">
                  <div className="font-mono text-xs text-ink/40 mb-3 stamp-text">
                    FREE COHORT
                  </div>
                  <div className="font-display text-xl font-bold mb-2">
                    Join the next cohort
                  </div>
                  <p className="text-sm text-ink/70 mb-4">
                    15 spots. 8 weeks. Your teen&apos;s startup, built live.
                  </p>
                  <Link
                    href="#pricing"
                    className="tactile-btn-signal px-4 py-2 text-sm font-semibold text-center block"
                  >
                    Book Free Consultation
                  </Link>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

