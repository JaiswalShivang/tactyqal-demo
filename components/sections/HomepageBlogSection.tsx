"use client";

import { useEffect, useState } from "react";
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
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className={`bg-sand flex items-center justify-center font-display font-bold text-ink/40 text-2xl ${className}`}>
        {title.charAt(0)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={title}
      className={`object-cover object-top transition-transform duration-300 group-hover:scale-105 ${className}`}
      onError={() => setHasError(true)}
      loading="lazy"
    />
  );
}

export default function HomepageBlogSection() {
  const [posts, setPosts] = useState<Post[]>(SEED_POSTS.slice(0, 6));

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts?limit=6&published=true");
        const json = (await res.json()) as { data: Post[] };
        if (json.data && json.data.length >= 6) {
          setPosts(json.data.slice(0, 6));
        }
      } catch {}
    };

    fetchPosts();
  }, []);

  const lead = posts.find((p) => p.slug === "50-no-code-startup-app-ideas") || posts[0];
  const pool = posts.filter((p) => p.id !== lead?.id);
  const sidePosts = [
    pool.find((p) => p.slug === "the-elevator-pitch-for-business-entrepreneurs") || pool[0],
    pool.find((p) => p.slug === "how-to-build-a-tech-startup-team") || pool[1],
  ].filter(Boolean) as Post[];
  const bottomPosts = [
    pool.find((p) => p.slug === "11-reasons-why-startups-fail-at-the-idea-stage") || pool[2],
    pool.find((p) => p.slug === "30-startup-ideas-to-solve-food-waste-problems") || pool[3],
    pool.find((p) => p.slug === "50-startup-ideas-for-gen-z-entrepreneurs") || pool[4],
  ].filter(Boolean) as Post[];

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
              READ ALL ARTICLES →
            </Link>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-6">
          {lead && (
            <div className="lg:col-span-7 h-full flex flex-col justify-between">
              <Link
                href={`/blog/${lead.slug}`}
                className="ticket-card h-full flex flex-col justify-between hover:shadow-tactile-signal transition-all group p-5 sm:p-6 bg-white border-2 border-[#0F1B3D] shadow-[4px_4px_0px_0px_#0F1B3D]"
              >
                <div>
                  <div className="border border-[#0F1B3D] mb-4 overflow-hidden bg-sand shadow-tactile-sm">
                    <div className="relative h-60 w-full overflow-hidden">
                      <PostThumbnail
                        src={lead.coverImage}
                        title={lead.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 mb-2.5">
                    <span className="pill pill-volt text-xs font-semibold">
                      {lead.category}
                    </span>
                    <span className="font-mono text-xs text-ink/50">
                      {lead.readTime} min read
                    </span>
                    <span className="font-mono text-xs text-ink/40">·</span>
                    <span className="font-mono text-xs text-ink/50">
                      {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-2xl sm:text-[26px] leading-snug tracking-tight mb-2.5 group-hover:text-signal transition-colors">
                    {lead.title}
                  </h3>

                  <p className="text-sm text-ink/80 leading-relaxed line-clamp-3 mb-4">
                    {lead.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {["#NoCodeMVP", "#AIWorkflows", "#TeenFounders"].map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[11px] font-bold text-[#FF3D88] bg-[#FFE4EF] px-2.5 py-0.5 border border-[#FF3D88]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-ink/15 flex items-center justify-between font-mono text-xs">
                  <span className="text-ink/60 font-medium">By {lead.author}</span>
                  <span className="text-signal font-bold group-hover:translate-x-1 transition-transform">
                    READ FULL STORY →
                  </span>
                </div>
              </Link>
            </div>
          )}

          <div className="lg:col-span-5 flex flex-col justify-between gap-6 h-full">
            {sidePosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="flex flex-col sm:flex-row items-stretch p-4 gap-4 bg-white border-[1.5px] border-[#0F1B3D] shadow-[4px_4px_0px_0px_#0F1B3D] hover:shadow-[6px_6px_0px_0px_#FF3D88] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all group flex-1"
              >
                <div className="w-full sm:w-44 h-40 sm:h-auto shrink-0 overflow-hidden border border-[#0F1B3D] bg-[#F4F6FB]">
                  <PostThumbnail
                    src={post.coverImage}
                    title={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-[#FFE4EF] text-[#FF3D88] border border-[#FF3D88]">
                        {post.category}
                      </span>
                      <span className="font-mono text-[11px] text-[#0F1B3D]/60">
                        {post.readTime} min read
                      </span>
                    </div>

                    <h4 className="font-display font-bold text-lg leading-snug tracking-tight text-[#0F1B3D] group-hover:text-[#FF3D88] transition-colors mb-1.5 line-clamp-2">
                      {post.title}
                    </h4>

                    <p className="text-xs text-[#0F1B3D]/70 leading-relaxed line-clamp-2 mb-2">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#0F1B3D]/15 flex items-center justify-between font-mono text-[11px]">
                    <span className="text-[#0F1B3D]/60 font-medium line-clamp-1">By Partha Chakraborty</span>
                    <span className="text-[#FF3D88] font-bold group-hover:translate-x-1 transition-transform shrink-0 flex items-center gap-1">
                      <span>Read Guide</span>
                      <span>→</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {bottomPosts.map((post) => (
            <div key={post.id} className="h-full flex flex-col">
              <Link
                href={`/blog/${post.slug}`}
                className="ticket-card h-full p-5 hover:shadow-tactile transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 w-full border border-ink mb-3.5 overflow-hidden bg-sand shadow-tactile-sm">
                    <PostThumbnail
                      src={post.coverImage}
                      title={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="pill text-[10px] px-2 py-0.5 bg-sand font-semibold">
                      {post.category}
                    </span>
                    <span className="font-mono text-[11px] text-ink/50">
                      {post.readTime} min read
                    </span>
                  </div>

                  <h4 className="font-display font-bold text-base leading-snug tracking-tight line-clamp-2 group-hover:text-signal transition-colors mb-2">
                    {post.title}
                  </h4>

                  <p className="text-xs text-ink/70 leading-relaxed line-clamp-2 mb-4">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-ink/15 flex items-center justify-between font-mono text-xs">
                  <span className="text-ink/50">
                    {new Date(post.createdAt).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="text-signal font-bold group-hover:translate-x-1 transition-transform">
                    READ GUIDE →
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
