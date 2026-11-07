"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SectionHeader } from "@/components/SectionHeader";

const PILLARS_ROW1 = [
  {
    num: "01",
    title: "1:1 Personalized Mentoring",
    desc: "Every student gets dedicated, expert guidance from founders. No group lectures.",
    bg: "bg-signal text-white",
  },
  {
    num: "02",
    title: "Full Stack App with No-Code",
    desc: "Build production-ready apps using modern no-code platforms and AI tools.",
    bg: "bg-ivory text-ink",
  },
  {
    num: "03",
    title: "Proven Track Record",
    desc: "100+ students mentored, real revenue, and top university admits.",
    bg: "bg-sand text-ink",
  },
  {
    num: "04",
    title: "University Admission Edge",
    desc: "Stand out in Ivy League and top applications with verifiable software and real traction.",
    bg: "bg-ivory text-ink",
  },
];

const PILLARS_ROW2 = [
  {
    num: "05",
    title: "Revenue Generation",
    desc: "Students learn the economics of digital products: Stripe billing, pricing, and monetization.",
    bg: "bg-sand text-ink",
  },
  {
    num: "06",
    title: "Life Long Support",
    desc: "Alumni network access, ongoing founder mentorship, and introductions after cohort graduation.",
    bg: "bg-ivory text-ink",
  },
  {
    num: "07",
    title: "Pitch & Presentation Skills",
    desc: "Master storytelling, build an investor pitch deck, and launch to thousands on Product Hunt.",
    bg: "bg-ink text-white",
  },
];

export default function WhyParentsSection() {
  const [videoOpen, setVideoOpen] = useState(false);
  const [selectedTimestamp, setSelectedTimestamp] = useState(105);
  const prefersReduced = useReducedMotion();
  const videoBase = process.env.NEXT_PUBLIC_FOUNDER_VIDEO_URL || "https://www.youtube.com/embed/UyUH06CfLbk";

  const closeModal = useCallback(() => setVideoOpen(false), []);

  const CHAPTERS = [
    { time: 0, label: "00:00 · The Builder Thesis" },
    { time: 105, label: "01:45 · Spotting Real Problems" },
    { time: 260, label: "04:20 · Validating Before Code" },
    { time: 495, label: "08:15 · First Paying Customers" },
    { time: 690, label: "11:30 · 8-Week Launch Map" },
  ];

  const TAKEAWAYS = [
    "Solve problems people are already paying to solve.",
    "No-code lets high-schoolers ship in days, not months.",
    "Real revenue is the ultimate university admission proof.",
  ];

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    if (videoOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [videoOpen, closeModal]);

  return (
    <section
      id="why-parents"
      className="py-20 md:py-28 px-4 bg-paper border-y border-ink"
      aria-label="Why parents choose Tactyqal Labs"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="№ 04 / 08 · THE ADVANTAGE"
          title="Why Parents Choose Tactyqal Labs"
          accent="Tactyqal Labs"
          description="We replace passive screen time with high-agency software entrepreneurship under 1:1 executive mentorship."
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
          <div className="col-span-12 md:col-span-6 md:row-span-2 border-[1.5px] border-ink bg-ink text-paper p-6 sm:p-7 flex flex-col justify-between shadow-tactile">
            <div>
              <div className="flex items-center justify-between border-b border-paper/20 pb-3 mb-4">
                <span className="font-mono text-xs text-signal font-bold tracking-wider flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-signal animate-pulse" />
                  WATCH MASTERCLASS
                </span>
                <span className="font-mono text-xs text-paper/50 uppercase">
                  12 MINS · FOUNDER SESSION
                </span>
              </div>

              <div
                className="relative aspect-video border border-paper/20 bg-black cursor-pointer group mb-5 overflow-hidden"
                onClick={() => setVideoOpen(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setVideoOpen(true); }}
                aria-label="Play Startup Ideas 101 video masterclass"
              >
                <iframe
                  src={`${videoBase}?autoplay=0&rel=0&controls=0`}
                  title="Startup Ideas 101 Preview"
                  className="w-full h-full pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity"
                  tabIndex={-1}
                />
                <div className="absolute inset-0 bg-ink/40 group-hover:bg-ink/20 flex items-center justify-center transition-colors">
                  <div className="w-14 h-14 rounded-full bg-signal text-white flex items-center justify-center shadow-tactile group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <h3 className="font-display font-bold text-2xl tracking-tight mb-2 text-paper">
                Startup Ideas 101
              </h3>

              <p className="text-sm text-paper/75 leading-relaxed mb-5">
                Learn how to identify and validate profitable startup ideas from our founder.
              </p>
            </div>

            <div className="pt-4 border-t border-paper/15 space-y-2">
              <div className="font-mono text-xs text-paper/50 uppercase tracking-wider mb-2">
                Core Takeaways:
              </div>
              {TAKEAWAYS.map((point) => (
                <div key={point} className="flex items-start gap-2 text-xs text-paper/85">
                  <span className="text-signal font-bold">▸</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {PILLARS_ROW1.map((p) => (
            <div
              key={p.num}
              className={`col-span-12 sm:col-span-6 md:col-span-3 border-[1.5px] border-ink p-6 flex flex-col justify-between ${p.bg} shadow-tactile-sm`}
            >
              <div>
                <div className="font-mono text-xs mb-3 opacity-60 stamp-text">
                  № {p.num}
                </div>
                <h4 className="font-display font-bold text-lg leading-snug tracking-tight mb-2">
                  {p.title}
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed opacity-85">
                  {p.desc}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-current/15 font-mono text-[11px] opacity-60 uppercase tracking-widest">
                VERIFIED PILLAR
              </div>
            </div>
          ))}

          {PILLARS_ROW2.map((p) => (
            <div
              key={p.num}
              className={`col-span-12 sm:col-span-6 md:col-span-4 border-[1.5px] border-ink p-6 flex flex-col justify-between ${p.bg} shadow-tactile-sm`}
            >
              <div>
                <div className="font-mono text-xs mb-3 opacity-60 stamp-text">
                  № {p.num}
                </div>
                <h4 className="font-display font-bold text-lg leading-snug tracking-tight mb-2">
                  {p.title}
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed opacity-85">
                  {p.desc}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-current/15 font-mono text-[11px] opacity-60 uppercase tracking-widest">
                VERIFIED PILLAR
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {videoOpen && (
          <div
            className="modal-overlay"
            onClick={closeModal}
            role="dialog"
            aria-modal="true"
            aria-label="Founder Masterclass video theater"
          >
            <motion.div
              className="w-full max-w-4xl bg-ink border-2 border-signal relative p-4 sm:p-6 shadow-tactile text-paper"
              initial={prefersReduced ? {} : { scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={prefersReduced ? {} : { scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-paper/20 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-signal inline-block" />
                  <span className="w-3 h-3 rounded-full bg-volt inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald inline-block" />
                  <span className="font-mono text-xs text-paper/60 ml-2 stamp-text">
                    CINEMA THEATER · STARTUP IDEAS 101
                  </span>
                </div>
                <button
                  onClick={closeModal}
                  className="text-paper font-mono text-xs border border-paper/40 px-2.5 py-1 hover:bg-signal hover:border-signal transition-colors"
                  aria-label="Close video"
                >
                  ESC / CLOSE ✕
                </button>
              </div>

              <div className="aspect-video border border-paper/20 bg-black mb-4">
                <iframe
                  src={`${videoBase}?start=${selectedTimestamp}&autoplay=1&rel=0`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                  title="Startup Ideas 101 - Founder Masterclass"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <div className="font-mono text-xs text-signal uppercase tracking-wider mb-2 font-bold">
                    Jump to Chapter:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {CHAPTERS.map((ch) => (
                      <button
                        key={ch.time}
                        onClick={() => setSelectedTimestamp(ch.time)}
                        className={`font-mono text-xs px-2.5 py-1 border transition-colors ${
                          selectedTimestamp === ch.time
                            ? "bg-signal text-white border-signal font-bold"
                            : "border-paper/20 text-paper/70 hover:border-paper"
                        }`}
                      >
                        {ch.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="font-mono text-xs text-signal uppercase tracking-wider mb-2 font-bold">
                    Core Founder Principles:
                  </div>
                  <ul className="text-xs text-paper/80 space-y-1">
                    {TAKEAWAYS.map((point) => (
                      <li key={point} className="flex items-start gap-2">
                        <span className="text-signal">▸</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
