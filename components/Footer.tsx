import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="bg-paper border-t border-ink"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 border-b border-ink pb-16">
          <div>
            <div className="font-mono text-xs text-ink/40 mb-4 stamp-text">CONTACT</div>
            <div className="space-y-2">
              <div>
                <a
                  href="mailto:tactyqal.labs@gmail.com"
                  className="font-mono text-sm hover:text-signal transition-colors"
                >
                  tactyqal.labs@gmail.com
                </a>
              </div>
              <div>
                <a
                  href="tel:+919804772106"
                  className="font-mono text-sm hover:text-signal transition-colors"
                >
                  +91-98047-72106
                </a>
              </div>
              <div className="font-mono text-xs text-ink/50">
                Mon–Sat, 9am–7pm IST
              </div>
              <div className="font-mono text-xs text-ink/40">
                Response within 24 hours
              </div>
            </div>
          </div>

          <div>
            <div className="font-mono text-xs text-ink/40 mb-4 stamp-text">PROGRAM</div>
            <div className="space-y-2">
              {[
                { href: "#student-projects", label: "Success Stories" },
                { href: "#blueprint", label: "8-Week Blueprint" },
                { href: "#why-parents", label: "Why Us" },
                { href: "#free-tools", label: "Free Tools" },
                { href: "/blog", label: "Blog" },
                { href: "#pricing", label: "Pricing & Enrol" },
              ].map((link) => (
                <div key={link.href}>
                  <Link
                    href={link.href}
                    className="font-mono text-sm text-ink/70 hover:text-signal transition-colors"
                  >
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="font-mono text-xs text-ink/40 mb-4 stamp-text">PARTNER</div>
            <div className="border border-ink p-4 bg-volt">
              <p className="text-sm font-medium mb-3">
                Learn coding by building apps with AI teachers — FREE
              </p>
              <a
                href="https://codesync.club"
                target="_blank"
                rel="noopener noreferrer"
                className="tactile-btn bg-ink text-white px-4 py-2 text-xs font-mono inline-block"
              >
                VISIT CODESYNC.CLUB →
              </a>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div
            className="font-boomdang font-bold text-center select-none leading-none cursor-default group"
            style={{ fontSize: "clamp(3rem, 15vw, 12rem)" }}
          >
            <span className="text-transparent"
              style={{
                WebkitTextStroke: "2px #121316",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLSpanElement).style.color = "#121316";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLSpanElement).style.color = "transparent";
              }}
            >
              TACTYQAL
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-8 border-t border-ink/20">
          <div className="font-mono text-xs text-ink/40 stamp-text">
            © {new Date().getFullYear()} TACTYQAL LABS · TACTYQAL.COM
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/admin/blog"
              className="font-mono text-xs text-ink/40 hover:text-ink transition-colors stamp-text"
            >
              ⌘ ADMIN CMS
            </Link>
            <span className="font-mono text-xs text-ink/40 stamp-text">
              BUILT WITH NEXT.JS 15
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

