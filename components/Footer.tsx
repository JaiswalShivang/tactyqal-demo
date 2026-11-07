import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="bg-paper border-t border-ink"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16 border-b border-ink pb-16 items-start">
          <div className="md:col-span-4">
            <div className="font-mono text-xs text-ink/50 mb-4 stamp-text">№ 01 · CONTACT</div>
            <div className="space-y-2">
              <div>
                <a
                  href="mailto:tactyqal.labs@gmail.com"
                  className="font-mono text-sm hover:text-signal transition-colors font-medium"
                >
                  tactyqal.labs@gmail.com
                </a>
              </div>
              <div>
                <a
                  href="tel:+919804772106"
                  className="font-mono text-sm hover:text-signal transition-colors font-medium"
                >
                  +91-98047-72106
                </a>
              </div>
              <div className="font-mono text-xs text-ink/60 pt-2">
                Mon–Sat, 9am–7pm IST
              </div>
              <div className="font-mono text-xs text-ink/50">
                Direct founder response within 24 hours
              </div>
            </div>
          </div>

          <div className="md:col-span-4">
            <div className="font-mono text-xs text-ink/50 mb-4 stamp-text">№ 02 · PROGRAM NAVIGATION</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { href: "#student-projects", label: "Success Stories" },
                { href: "#blueprint", label: "8-Week Blueprint" },
                { href: "#why-parents", label: "Why Us" },
                { href: "#free-tools", label: "Free Tools" },
                { href: "/blog", label: "Blog" },
                { href: "#pricing", label: "Pricing & Enrol" },
                { href: "#faq", label: "FAQ" },
                { href: "/admin/blog", label: "Admin CMS" },
              ].map((link) => (
                <div key={link.href}>
                  <Link
                    href={link.href}
                    className="font-mono text-xs text-ink/70 hover:text-signal transition-colors"
                  >
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-4">
            <div className="font-mono text-xs text-ink/50 mb-4 stamp-text">№ 03 · LEARNING PARTNER</div>
            <div className="border border-ink p-5 bg-sand">
              <div className="font-mono text-[11px] text-ink/60 uppercase tracking-wider mb-2">
                AI Coding Platform
              </div>
              <p className="text-sm font-medium mb-4 text-ink leading-snug">
                Learn coding by building apps with AI teachers — 100% Free
              </p>
              <a
                href="https://codesync.club"
                target="_blank"
                rel="noopener noreferrer"
                className="tactile-btn bg-ink text-white px-4 py-2 text-xs font-mono inline-block tracking-wider"
              >
                VISIT CODESYNC.CLUB →
              </a>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden pt-4 pb-2 -mb-6 group">
          <div
            className="font-display font-extrabold text-center select-none leading-[0.8] tracking-[-0.05em] cursor-default text-transparent transition-colors duration-200 group-hover:text-ink group-focus-within:text-ink"
            style={{
              fontSize: "clamp(4rem, 17vw, 16rem)",
              WebkitTextStroke: "1.5px #121316",
            }}
            aria-hidden="true"
          >
            TACTYQAL
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-ink/20 font-mono text-xs text-ink/50">
          <div>© {new Date().getFullYear()} Tactyqal Labs. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <span>Built for teen founders.</span>
            <span>·</span>
            <Link href="/blog" className="hover:text-signal">Editorial</Link>
            <span>·</span>
            <Link href="/admin/blog" className="hover:text-signal">CMS</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
