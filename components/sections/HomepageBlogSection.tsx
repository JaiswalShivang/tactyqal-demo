"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Post } from "@/lib/types";

export default function HomepageBlogSection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const cached = localStorage.getItem("tactyqal-blog-cache");
        if (cached) {
          const { posts: cachedPosts, ts } = JSON.parse(cached) as { posts: Post[]; ts: number };
          if (Date.now() - ts < 5 * 60 * 1000) {
            setPosts(cachedPosts.slice(0, 3));
            setLoading(false);
          }
        }

        const res = await fetch("/api/posts?limit=3&published=true");
        const json = await res.json() as { data: Post[] };
        if (json.data) {
          setPosts(json.data.slice(0, 3));
          localStorage.setItem(
            "tactyqal-blog-cache",
            JSON.stringify({ posts: json.data, ts: Date.now() })
          );
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <section className="py-24 px-4 bg-paper border-y border-ink">
        <div className="max-w-7xl mx-auto">
          <div className="section-number mb-3">№ 06.5 / 08 · INSIGHTS</div>
          <div className="font-mono text-xs text-ink/40 stamp-text">LOADING LATEST POSTS...</div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) return null;

  return (
    <section
      id="blog-preview"
      className="py-24 px-4 bg-paper border-y border-ink"
      aria-label="Latest blog posts"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 flex items-end justify-between gap-4">
          <div>
            <div className="section-number mb-3">№ 06.5 / 08 · INSIGHTS</div>
            <h2 className="headline-display">
              From The <span className="volt-highlight">Founders</span> Desk
            </h2>
          </div>
          <Link
            href="/blog"
            className="font-mono text-sm text-ink/60 hover:text-signal transition-colors stamp-text flex-shrink-0"
          >
            ALL POSTS →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {posts.map((post, i) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className={`ticket-card hover:shadow-tactile-signal transition-all group ${
                i === 0 ? "md:col-span-2" : ""
              }`}
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
                  <span className="pill pill-volt text-xs">{post.category}</span>
                  <span className="font-mono text-xs text-ink/40">
                    {post.readTime} min read
                  </span>
                </div>

                <h3
                  className={`font-boomdang font-bold leading-tight mb-2 group-hover:text-signal transition-colors ${
                    i === 0 ? "text-xl" : "text-base"
                  }`}
                >
                  {post.title}
                </h3>

                <p className="text-sm text-ink/60 leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="font-mono text-xs text-ink/40">
                    {new Date(post.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="font-mono text-xs text-signal group-hover:translate-x-1 transition-transform stamp-text">
                    READ →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

