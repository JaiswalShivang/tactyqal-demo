"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import type { Post } from "@/lib/types";
import { SEED_POSTS } from "@/lib/memory-store";
import { SectionHeader } from "@/components/SectionHeader";

function PostThumbnail({
  src,
  title,
  className = "w-full h-full",
}: {
  src?: string | null;
  title: string;
  className?: string;
}) {
  const [imgSrc, setImgSrc] = useState<string>(
    src || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80"
  );

  useEffect(() => {
    if (src) setImgSrc(src);
  }, [src]);

  return (
    <img
      src={imgSrc}
      alt={title}
      className={`object-cover object-top transition-transform duration-300 group-hover:scale-105 ${className}`}
      onError={() => {
        setImgSrc("https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80");
      }}
      loading="lazy"
    />
  );
}

const POSTS_PER_PAGE = 6;

export default function HomepageBlogSection() {
  const [posts, setPosts] = useState<Post[]>(SEED_POSTS);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts?limit=100&published=true");
        const json = (await res.json()) as { data?: Post[] };
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          setPosts(json.data);
        }
      } catch {}
    };

    fetchPosts();
  }, []);

  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchesCat =
        selectedCategory === "All" ||
        p.category.toLowerCase() === selectedCategory.toLowerCase();
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  const featuredPost = filteredPosts[0];
  const remainingList = filteredPosts.slice(1);
  const totalPages = Math.max(1, Math.ceil(remainingList.length / POSTS_PER_PAGE));

  const pagePosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return remainingList.slice(start, start + POSTS_PER_PAGE);
  }, [remainingList, currentPage]);

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const displayedStart =
    filteredPosts.length === 0
      ? 0
      : (currentPage - 1) * POSTS_PER_PAGE + 1;

  const displayedEnd = Math.min(
    filteredPosts.length,
    (currentPage - 1) * POSTS_PER_PAGE + pagePosts.length + (currentPage === 1 ? 1 : 0)
  );

  return (
    <section
      id="blog-preview"
      className="py-16 md:py-20 px-4 bg-paper border-y border-ink"
      aria-label="Latest insights from our founders"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="From The Founders Desk"
          accent="Founders"
          description="Tactical blueprints, venture ideas, and mental models for high-schoolers launching software."
          action={
            <Link
              href="/blog"
              className="font-mono text-xs text-ink/70 hover:text-signal transition-colors uppercase tracking-[0.08em] font-semibold border-b border-ink/40 pb-0.5 hover:border-signal"
            >
              VIEW ALL ARTICLES →
            </Link>
          }
        />

        <div className="bg-white border-2 border-[#0F1B3D] shadow-[4px_4px_0px_0px_#0F1B3D] p-4 mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleCategoryClick("All")}
              className={`px-3 py-1.5 font-mono text-xs font-bold uppercase transition-all cursor-pointer ${
                selectedCategory === "All"
                  ? "bg-[#FF3D88] text-white border-2 border-[#0F1B3D] shadow-[2px_2px_0px_#0F1B3D]"
                  : "bg-white text-[#0F1B3D] border-2 border-[#0F1B3D] hover:bg-[#FFE4EF] hover:text-[#FF3D88]"
              }`}
            >
              All ({posts.length})
            </button>
            {categories.map(([cat, count]) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryClick(cat)}
                className={`px-3 py-1.5 font-mono text-xs font-bold uppercase transition-all cursor-pointer ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? "bg-[#FF3D88] text-white border-2 border-[#0F1B3D] shadow-[2px_2px_0px_#0F1B3D]"
                    : "bg-white text-[#0F1B3D] border-2 border-[#0F1B3D] hover:bg-[#FFE4EF] hover:text-[#FF3D88]"
                }`}
              >
                {cat} ({count})
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={`Search ${posts.length} articles...`}
                className="w-full border-2 border-[#0F1B3D] px-3 py-1.5 font-mono text-xs text-[#0F1B3D] placeholder-[#0F1B3D]/50 focus:outline-none focus:border-[#FF3D88]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => handleSearchChange("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-mono text-[#0F1B3D]/60 hover:text-[#FF3D88]"
                >
                  ✕
                </button>
              )}
            </div>
            <Link
              href="/blog"
              className="px-3.5 py-2 font-mono text-xs font-bold bg-[#0F1B3D] text-white hover:bg-[#FF3D88] border-2 border-[#0F1B3D] transition whitespace-nowrap shadow-[2px_2px_0px_#0F1B3D]"
            >
              View Full Blog Hub (/blog) →
            </Link>
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="bg-white border-2 border-[#0F1B3D] shadow-[4px_4px_0px_0px_#0F1B3D] p-12 text-center space-y-3">
            <div className="font-display font-extrabold text-2xl text-[#0F1B3D]">
              No articles found
            </div>
            <p className="text-sm font-mono text-[#0F1B3D]/70 max-w-md mx-auto">
              No published articles match &quot;{searchQuery}&quot; in category &quot;{selectedCategory}&quot;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
                setCurrentPage(1);
              }}
              className="px-4 py-2 bg-[#FF3D88] text-white font-mono text-xs font-bold uppercase border-2 border-[#0F1B3D] shadow-[2px_2px_0px_#0F1B3D] cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            {currentPage === 1 && featuredPost && (
              <div className="grid grid-cols-1 lg:grid-cols-12 bg-white border-2 border-[#0F1B3D] shadow-[6px_6px_0px_0px_#FF3D88] mb-8 overflow-hidden group">
                <div className="lg:col-span-6 relative min-h-[260px] lg:min-h-[340px] border-b-2 lg:border-b-0 lg:border-r-2 border-[#0F1B3D] bg-[#0F1B3D] overflow-hidden">
                  <PostThumbnail
                    src={featuredPost.coverImage}
                    title={featuredPost.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 bg-[#FF3D88] text-white font-mono text-[11px] font-bold uppercase tracking-wider border border-[#0F1B3D] shadow-[2px_2px_0px_#0F1B3D]">
                      ★ LATEST FEATURED GUIDE
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-6 p-6 lg:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2.5 mb-3 font-mono text-xs">
                      <span className="font-mono text-[11px] font-bold px-2.5 py-0.5 bg-[#FFE4EF] text-[#FF3D88] border border-[#FF3D88] uppercase">
                        {featuredPost.category}
                      </span>
                      <span className="text-[#0F1B3D]/60">{featuredPost.readTime} min read</span>
                      <span className="text-[#0F1B3D]/30">·</span>
                      <span className="text-[#0F1B3D]/60">
                        {new Date(featuredPost.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <h3 className="font-display font-extrabold text-2xl lg:text-3xl leading-snug tracking-tight text-[#0F1B3D] group-hover:text-[#FF3D88] transition-colors mb-3">
                      <Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
                    </h3>

                    <p className="text-sm text-[#0F1B3D]/75 leading-relaxed line-clamp-3 mb-4">
                      {featuredPost.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {(featuredPost.tags && featuredPost.tags.length > 0
                        ? featuredPost.tags.slice(0, 3)
                        : ["#StartupMVP", "#NoCode", "#YoungBuilders"]
                      ).map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[11px] font-bold text-[#0F1B3D] bg-[#F4F6FB] px-2.5 py-0.5 border border-[#0F1B3D]/30"
                        >
                          {tag.startsWith("#") ? tag : `#${tag}`}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#0F1B3D]/15 flex items-center justify-between font-mono text-xs">
                    <span className="text-[#0F1B3D]/70 font-semibold">
                      By {featuredPost.author || "Partha Chakraborty"}
                    </span>
                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="px-4 py-2 bg-[#FF3D88] text-white hover:bg-[#e62e76] font-mono font-bold text-xs uppercase tracking-wider border border-[#0F1B3D] shadow-[2px_2px_0px_#0F1B3D] group-hover:translate-x-0.5 transition"
                    >
                      READ FULL STORY →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {pagePosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 items-stretch">
                {pagePosts.map((post, idx) => {
                  const totalInPage = pagePosts.length;
                  const remainder = totalInPage % 3;
                  let colSpan = "lg:col-span-2";
                  let isHorizontal = false;

                  if (remainder === 1 && idx === totalInPage - 1) {
                    colSpan = "lg:col-span-6";
                    isHorizontal = true;
                  } else if (remainder === 2 && idx >= totalInPage - 2) {
                    colSpan = "lg:col-span-3";
                  }

                  if (isHorizontal) {
                    return (
                      <div key={post.id} className={`${colSpan} h-full`}>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="ticket-card h-full flex flex-col md:flex-row items-stretch p-5 md:p-6 bg-white border-2 border-[#0F1B3D] shadow-[4px_4px_0px_0px_#0F1B3D] hover:shadow-[6px_6px_0px_0px_#FF3D88] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all group gap-6"
                        >
                          <div className="w-full md:w-80 h-52 md:h-auto shrink-0 border border-[#0F1B3D] bg-[#F4F6FB] overflow-hidden relative">
                            <PostThumbnail
                              src={post.coverImage}
                              title={post.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-2 font-mono text-xs">
                                <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-[#FFE4EF] text-[#FF3D88] border border-[#FF3D88] uppercase">
                                  {post.category}
                                </span>
                                <span className="text-[#0F1B3D]/60">{post.readTime} min read</span>
                                <span className="text-[#0F1B3D]/30">·</span>
                                <span className="text-[#0F1B3D]/60">
                                  {new Date(post.createdAt).toLocaleDateString("en-IN", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>

                              <h4 className="font-display font-bold text-xl leading-snug tracking-tight text-[#0F1B3D] group-hover:text-[#FF3D88] transition-colors mb-2">
                                {post.title}
                              </h4>

                              <p className="text-xs sm:text-sm text-[#0F1B3D]/70 leading-relaxed line-clamp-3 mb-4">
                                {post.excerpt}
                              </p>
                            </div>

                            <div className="pt-3 border-t border-[#0F1B3D]/15 flex items-center justify-between font-mono text-xs">
                              <span className="text-[#0F1B3D]/60 font-medium">By {post.author}</span>
                              <span className="text-[#FF3D88] font-bold group-hover:translate-x-1 transition-transform">
                                READ GUIDE →
                              </span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  }

                  return (
                    <div key={post.id} className={`${colSpan} h-full`}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="ticket-card h-full flex flex-col justify-between p-5 bg-white border-2 border-[#0F1B3D] shadow-[4px_4px_0px_0px_#0F1B3D] hover:shadow-[6px_6px_0px_0px_#FF3D88] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all group"
                      >
                        <div>
                          <div className="aspect-[16/10] w-full border border-[#0F1B3D] mb-3.5 overflow-hidden bg-[#F4F6FB]">
                            <PostThumbnail
                              src={post.coverImage}
                              title={post.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex items-center gap-2 mb-2 font-mono text-xs">
                            <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-[#FFE4EF] text-[#FF3D88] border border-[#FF3D88] uppercase">
                              {post.category}
                            </span>
                            <span className="text-[#0F1B3D]/60">{post.readTime} min read</span>
                          </div>

                          <h4 className="font-display font-bold text-base leading-snug tracking-tight text-[#0F1B3D] line-clamp-2 group-hover:text-[#FF3D88] transition-colors mb-2">
                            {post.title}
                          </h4>

                          <p className="text-xs text-[#0F1B3D]/70 leading-relaxed line-clamp-2 mb-4">
                            {post.excerpt}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-[#0F1B3D]/15 flex items-center justify-between font-mono text-xs">
                          <span className="text-[#0F1B3D]/50 text-[11px]">
                            {new Date(post.createdAt).toLocaleDateString("en-IN", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <span className="text-[#FF3D88] font-bold group-hover:translate-x-1 transition-transform">
                            READ GUIDE →
                          </span>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="bg-white border-2 border-[#0F1B3D] shadow-[4px_4px_0px_0px_#0F1B3D] px-5 py-3 mt-8 flex flex-wrap items-center justify-between gap-4">
              <div className="font-mono text-xs text-[#0F1B3D]/70 font-semibold">
                Showing {displayedStart}–{displayedEnd} of {filteredPosts.length} Published Articles
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className={`px-3 py-1.5 border-2 border-[#0F1B3D] font-bold transition-all cursor-pointer ${
                    currentPage <= 1
                      ? "opacity-40 cursor-not-allowed bg-[#F4F6FB] text-[#0F1B3D]/50"
                      : "bg-white text-[#0F1B3D] hover:bg-[#FFE4EF] hover:text-[#FF3D88]"
                  }`}
                >
                  ← Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    type="button"
                    onClick={() => setCurrentPage(pg)}
                    className={`w-8 h-8 flex items-center justify-center font-bold border-2 border-[#0F1B3D] transition-all cursor-pointer ${
                      currentPage === pg
                        ? "bg-[#FF3D88] text-white shadow-[2px_2px_0px_#0F1B3D]"
                        : "bg-white text-[#0F1B3D] hover:bg-[#FFE4EF] hover:text-[#FF3D88]"
                    }`}
                  >
                    {pg}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className={`px-3 py-1.5 border-2 border-[#0F1B3D] font-bold transition-all cursor-pointer ${
                    currentPage >= totalPages
                      ? "opacity-40 cursor-not-allowed bg-[#F4F6FB] text-[#0F1B3D]/50"
                      : "bg-white text-[#0F1B3D] hover:bg-[#FFE4EF] hover:text-[#FF3D88]"
                  }`}
                >
                  Next →
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
