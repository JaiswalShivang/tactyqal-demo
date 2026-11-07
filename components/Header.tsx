"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { href: "#student-projects", label: "Stories" },
  { href: "#blueprint", label: "8-Week Program" },
  { href: "#why-parents", label: "Why Us" },
  { href: "#free-tools", label: "Tools" },
  { href: "/blog", label: "Blog" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS
      .filter((l) => l.href.startsWith("#"))
      .map((l) => l.href.slice(1));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (menuOpen && menuRef.current) {
      const firstFocusable = menuRef.current.querySelector("a, button") as HTMLElement;
      firstFocusable?.focus();
    }
  }, [menuOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-150 ${
          scrolled
            ? "bg-paper/95 backdrop-blur-sm border-b border-ink"
            : "bg-paper border-b border-ink"
        }`}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="font-display font-bold text-lg tracking-tight hover:text-signal transition-colors flex-shrink-0"
            aria-label="Tactyqal Labs home"
          >
            TACTYQAL LABS
          </Link>

          <nav
            className="hidden lg:flex items-center gap-5 xl:gap-6"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`whitespace-nowrap text-[13px] font-medium transition-colors hover:text-signal ${
                    isActive ? "text-signal font-bold" : "text-ink/80"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/blog"
              className="hidden sm:inline-flex items-center gap-2 font-mono text-xs border border-ink px-2.5 py-1.5 bg-ivory hover:bg-sand transition-colors whitespace-nowrap shadow-tactile-sm"
              title="Admin CMS Studio"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald inline-block animate-pulse" />
              <span className="text-ink font-semibold">CMS Studio</span>
            </Link>

            <Link
              href="#contact"
              className="hidden sm:inline-flex tactile-btn-signal px-4 py-2.5 text-xs font-semibold tracking-wide whitespace-nowrap"
            >
              Book Free Consultation
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 border border-ink bg-ivory hover:bg-sand transition-colors"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span
                  className={`block h-0.5 bg-ink transition-transform ${
                    menuOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 bg-ink transition-opacity ${
                    menuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 bg-ink transition-transform ${
                    menuOpen ? "-rotate-45 -translate-y-1.5" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <div
            id="mobile-nav"
            ref={menuRef}
            className="fixed inset-0 z-50 bg-paper/98 pt-20 px-6 pb-8 flex flex-col justify-between lg:hidden border-b-2 border-ink"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="flex justify-between items-center mb-8 border-b border-ink pb-4">
              <span className="font-display font-bold text-xl">NAVIGATION</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="font-mono text-sm border border-ink px-3 py-1 hover:bg-ink hover:text-paper"
              >
                CLOSE ✕
              </button>
            </div>

            <nav className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-display text-2xl font-bold hover:text-signal transition-colors py-1 border-b border-ink/10"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/admin/blog"
                onClick={() => setMenuOpen(false)}
                className="font-mono text-sm text-signal font-semibold pt-2"
              >
                ⌘ Admin Blog Studio (/admin/blog) →
              </Link>
            </nav>

            <div className="pt-8 border-t border-ink space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs text-ink/60">
                <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
                NEXT COHORT · 15 SPOTS AVAILABLE
              </div>
              <Link
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="tactile-btn-signal w-full py-3 text-center font-semibold block text-sm"
              >
                Book Free Consultation
              </Link>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
