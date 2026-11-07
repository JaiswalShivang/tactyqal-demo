"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

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

  const BENEFITS = [
    {
      num: "01",
      title: "1:1 Personalized Mentoring",
      desc: "Every student gets dedicated, expert guidance. No group classes.",
      size: "lg:col-span-2",
      bg: "bg-signal text-white",
    },
    {
      num: "02",
      title: "Full Stack App with No-Code",
      desc: "Build real apps using modern no-code tools and platforms.",
      size: "",
      bg: "bg-ivory",
    },
    {
      num: "03",
      title: "Proven Track Record",
      desc: "50+ successful students, real revenue, and top university admits.",
      size: "",
      bg: "bg-volt",
    },
    {
      num: "04",
      title: "University Admission Edge",
      desc: "Stand out in applications with real-world projects and achievements.",
      size: "",
      bg: "bg-ivory",
    },
    {
      num: "05",
      title: "Revenue Generation",
      desc: "Students learn to build, launch, and monetize their own apps.",
      size: "",
      bg: "bg-sand",
    },
    {
      num: "06",
      title: "Life Long Support",
      desc: "Ongoing support, alumni community, and guidance after the program ends.",
      size: "",
      bg: "bg-ivory",
    },
    {
      num: "07",
      title: "Pitch & Presentation Skills",
      desc: "Learn to pitch, present, and launch on Product Hunt.",
      size: "",
      bg: "bg-ink text-white",
    },
  ];

  return (
    <section
      id="why-parents"
      className="py-24 px-4 bg-paper border-y border-ink"
      aria-label="Why parents choose Tactyqal Labs"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="section-number mb-3">№ 04 / 08 · THE CASE</div>
          <h2 className="headline-display mb-4">
            Why Parents Choose{" "}
            <span className="volt-highlight">Tactyqal Labs</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-min">
          {BENEFITS.map((benefit, i) => (
            <motion.div
              key={benefit.num}
              className={`${benefit.size ?? ""} ${benefit.bg} border border-ink p-6`}
              initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
              whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <div
                className={`font-mono text-xs mb-3 stamp-text ${
                  benefit.bg.includes("signal") || benefit.bg.includes("ink")
                    ? "opacity-50"
                    : "text-ink/40"
                }`}
              >
                № {benefit.num}
              </div>
              <div className="font-boomdang text-xl font-bold mb-2 leading-tight">
                {benefit.title}
              </div>
              <p
                className={`text-sm leading-relaxed ${
                  benefit.bg.includes("signal") || benefit.bg.includes("ink")
                    ? "opacity-80"
                    : "text-ink/70"
                }`}
              >
                {benefit.desc}
              </p>
            </motion.div>
          ))}

          <motion.div
            className="lg:col-span-2 bg-ink text-white border border-ink p-6 cursor-pointer group relative overflow-hidden"
            initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.49 }}
            onClick={() => setVideoOpen(true)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setVideoOpen(true); }}
            tabIndex={0}
            role="button"
            aria-label="Watch Startup Ideas 101 Founder Masterclass"
          >
            <div className="font-mono text-xs text-white/40 mb-3 stamp-text">
              FOUNDER MASTERCLASS
            </div>
            <div className="font-boomdang text-2xl font-bold mb-2">
              Startup Ideas 101
            </div>
            <p className="text-white/70 text-sm mb-6">
              Learn how to identify and validate profitable startup ideas from our founder.
            </p>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full border-2 border-signal flex items-center justify-center group-hover:bg-signal transition-colors">
                <svg
                  className="w-6 h-6 ml-1"
                  fill="white"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-sm">Watch Free Preview</div>
                <div className="font-mono text-xs text-white/40">12 min · Free access</div>
              </div>
            </div>

            <div className="absolute top-4 right-4">
              <span className="bg-signal text-white font-mono text-xs px-2 py-1 stamp-text">
                FREE
              </span>
            </div>
          </motion.div>
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
              className="w-full max-w-4xl bg-ink border-2 border-signal relative p-4 sm:p-6 shadow-tactile"
              initial={prefersReduced ? {} : { scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={prefersReduced ? {} : { scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/20 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-signal inline-block" />
                  <span className="w-3 h-3 rounded-full bg-volt inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald inline-block" />
                  <span className="font-mono text-xs text-white/60 ml-2 stamp-text">
                    CINEMA THEATER · STARTUP IDEAS 101
                  </span>
                </div>
                <button
                  onClick={closeModal}
                  className="text-white font-mono text-xs border border-white/40 px-2 py-1 hover:bg-signal hover:border-signal transition-colors"
                  aria-label="Close video"
                >
                  ESC / CLOSE ✕
                </button>
              </div>

              <div className="aspect-video border border-white/20 bg-black mb-4">
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
                  <div className="font-mono text-xs text-volt uppercase tracking-wider mb-2">
                    Jump to Chapter:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {CHAPTERS.map((ch) => (
                      <button
                        key={ch.time}
                        onClick={() => setSelectedTimestamp(ch.time)}
                        className={`font-mono text-xs px-2.5 py-1 border transition-colors ${
                          selectedTimestamp === ch.time
                            ? "bg-volt text-ink border-volt font-bold"
                            : "border-white/20 text-white/70 hover:border-white"
                        }`}
                      >
                        {ch.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="font-mono text-xs text-signal uppercase tracking-wider mb-2">
                    Core Founder Principles:
                  </div>
                  <ul className="text-xs text-white/80 space-y-1">
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

