"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { href: "#student-projects", label: "Success Stories" },
  { href: "#blueprint", label: "8-Week Program" },
  { href: "#why-parents", label: "Why Us" },
  { href: "#free-tools", label: "Free Tools" },
  { href: "/blog", label: "Blog" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
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
            ? "bg-paper/95 backdrop-blur-sm border-b border-ink/20"
            : "bg-transparent"
        }`}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="font-boomdang font-bold text-lg tracking-tight hover:text-signal transition-colors flex-shrink-0"
            aria-label="Tactyqal Labs home"
          >
            TACTYQAL LABS
          </Link>

          <nav
            className="hidden lg:flex items-center gap-6"
            role="navigation"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href.startsWith("#") &&
                activeSection === link.href.slice(1);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-body text-sm font-medium transition-colors hover:text-signal ${
                    isActive ? "text-signal" : "text-ink/70"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/admin/blog"
              className="font-mono text-xs px-3 py-1.5 border border-ink/30 hover:border-ink transition-colors bg-sand/50"
              aria-label="Admin CMS"
            >
              ⌘ /admin/blog
            </Link>
            <Link
              href="#pricing"
              className="tactile-btn-signal px-4 py-2 text-sm font-semibold"
            >
              Book Free Consultation
            </Link>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <span className="pill pill-volt text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-ink animate-pulse-dot inline-block" />
              COHORT OPEN · 15 SPOTS
            </span>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 border border-ink/30 hover:border-ink transition-colors"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">{menuOpen ? "Close" : "Menu"}</span>
              <div className="w-5 flex flex-col gap-1.5">
                <span
                  className={`block h-0.5 bg-ink transition-all ${
                    menuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 bg-ink transition-all ${
                    menuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 bg-ink transition-all ${
                    menuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
              </div>
            </button>
          </div>

          <div className="hidden lg:flex items-center">
            <span className="pill pill-volt text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-ink animate-pulse-dot inline-block" />
              COHORT OPEN · 15 SPOTS
            </span>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="fixed inset-0 z-50 bg-paper lg:hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
          >
            <div className="flex flex-col h-full p-6">
              <div className="flex items-center justify-between mb-12">
                <span className="font-boomdang font-bold text-xl">
                  TACTYQAL LABS
                </span>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 border border-ink hover:bg-ink hover:text-paper transition-colors"
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>

              <nav className="flex flex-col gap-2 flex-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ x: 40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="block font-boomdang text-3xl font-bold py-3 border-b border-ink/10 hover:text-signal transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-auto flex flex-col gap-3">
                <Link
                  href="/admin/blog"
                  onClick={() => setMenuOpen(false)}
                  className="font-mono text-sm px-4 py-3 border border-ink text-center"
                >
                  ⌘ /admin/blog
                </Link>
                <Link
                  href="#pricing"
                  onClick={() => setMenuOpen(false)}
                  className="tactile-btn-signal px-4 py-3 text-base font-semibold text-center"
                >
                  Book Free Consultation
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

