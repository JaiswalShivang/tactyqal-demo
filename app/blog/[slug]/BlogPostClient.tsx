"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Post } from "@/lib/types";

interface HeadingItem {
  id: string;
  text: string;
}

export default function BlogPostClient({
  post,
  related,
  prevPost,
  nextPost,
}: {
  post: Post;
  related: Post[];
  prevPost?: Post;
  nextPost?: Post;
}) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeHeading, setActiveHeading] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const totalHeight = el.scrollHeight - el.clientHeight;
      if (totalHeight > 0) {
        setReadingProgress(Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100)));
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headings = useMemo<HeadingItem[]>(() => {
    const matches: HeadingItem[] = [];
    const lines = post.content.split("\n");
    for (const line of lines) {
      if (line.startsWith("## ")) {
        const text = line.replace("## ", "").trim();
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        matches.push({ id, text });
      }
    }
    return matches;
  }, [post.content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <div
        className="reading-progress"
        style={{ width: `${readingProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(readingProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      <Header />

      <main id="main-content" className="min-h-screen pt-20">
        <article className="max-w-7xl mx-auto px-4 py-12">
          <div className="mb-8">
            <Link
              href="/blog"
              className="font-mono text-xs text-ink/60 hover:text-signal transition-colors stamp-text inline-flex items-center gap-1 mb-6"
            >
              ← ALL ARTICLES
            </Link>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="pill pill-volt text-xs">{post.category}</span>
              <span className="font-mono text-xs text-ink/50">{post.readTime} MIN READ</span>
              <span className="font-mono text-xs text-ink/50">·</span>
              <span className="font-mono text-xs text-ink/50">{formattedDate}</span>
              <span className="font-mono text-xs text-ink/50">·</span>
              <span className="font-mono text-xs text-ink/50">BY {post.author.toUpperCase()}</span>
            </div>

            <h1 className="headline-display text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              {post.title}
            </h1>

            <p className="text-lg text-ink/70 leading-relaxed max-w-3xl border-l-4 border-signal pl-4 italic">
              {post.excerpt}
            </p>
          </div>

          <div className="border-t border-b border-ink/20 py-4 mb-10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="font-mono text-xs bg-sand/60 px-2.5 py-1 border border-ink/20">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyLink}
                className="font-mono text-xs px-3 py-1.5 border border-ink bg-ivory hover:bg-volt transition-colors tactile-btn"
                aria-label="Copy article link"
              >
                {copied ? "COPIED ✓" : "COPY LINK ↗"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-8">
              <div className="prose-tactyqal drop-cap text-base leading-relaxed text-ink/90">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeSanitize]}
                  components={{
                    h2: ({ children }) => {
                      const text = String(children);
                      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                      return (
                        <h2 id={id} className="scroll-mt-24">
                          {children}
                        </h2>
                      );
                    },
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>

              <div className="mt-16 pt-8 border-t border-ink/20">
                <div className="bg-volt border border-ink p-6 mb-12">
                  <div className="font-mono text-xs text-ink/50 mb-2 stamp-text">
                    APPLY FOR THE COHORT
                  </div>
                  <h3 className="font-boomdang text-2xl font-bold mb-2">
                    Ready to build your startup in 8 weeks?
                  </h3>
                  <p className="text-sm text-ink/80 mb-4">
                    1:1 personal mentoring for teen founders. Build, deploy, and launch a full-stack product.
                  </p>
                  <Link
                    href="/#pricing"
                    className="tactile-btn-signal px-5 py-2.5 text-sm font-semibold inline-block"
                  >
                    Book Free Consultation
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {prevPost ? (
                    <Link
                      href={`/blog/${prevPost.slug}`}
                      className="border border-ink p-4 bg-ivory hover:bg-sand/30 transition-colors block group"
                    >
                      <div className="font-mono text-xs text-ink/40 mb-1 stamp-text">← PREVIOUS POST</div>
                      <div className="font-boomdang font-bold text-sm line-clamp-2 group-hover:text-signal transition-colors">
                        {prevPost.title}
                      </div>
                    </Link>
                  ) : <div />}

                  {nextPost ? (
                    <Link
                      href={`/blog/${nextPost.slug}`}
                      className="border border-ink p-4 bg-ivory hover:bg-sand/30 transition-colors block text-right group"
                    >
                      <div className="font-mono text-xs text-ink/40 mb-1 stamp-text">NEXT POST →</div>
                      <div className="font-boomdang font-bold text-sm line-clamp-2 group-hover:text-signal transition-colors">
                        {nextPost.title}
                      </div>
                    </Link>
                  ) : <div />}
                </div>
              </div>
            </div>

            <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-8" aria-label="Table of contents and related">
              {headings.length > 0 && (
                <div className="border border-ink bg-ivory p-5">
                  <div className="font-mono text-xs text-ink/40 mb-3 stamp-text border-b border-ink/20 pb-2">
                    TABLE OF CONTENTS
                  </div>
                  <nav className="space-y-2" aria-label="Article sections">
                    {headings.map(({ id, text }) => (
                      <a
                        key={id}
                        href={`#${id}`}
                        className={`block text-xs font-mono transition-colors ${
                          activeHeading === id
                            ? "text-signal font-bold translate-x-1"
                            : "text-ink/60 hover:text-ink"
                        }`}
                      >
                        • {text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {related.length > 0 && (
                <div className="border border-ink bg-paper p-5">
                  <div className="font-mono text-xs text-ink/40 mb-3 stamp-text border-b border-ink/20 pb-2">
                    RELATED ARTICLES
                  </div>
                  <div className="space-y-4">
                    {related.map((item) => (
                      <Link
                        key={item.id}
                        href={`/blog/${item.slug}`}
                        className="block group"
                      >
                        <span className="pill text-[10px] py-0.5 px-2 mb-1 inline-block">
                          {item.category}
                        </span>
                        <h4 className="font-boomdang text-sm font-bold leading-snug group-hover:text-signal transition-colors">
                          {item.title}
                        </h4>
                        <span className="font-mono text-[10px] text-ink/40">
                          {item.readTime} MIN READ
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}
