"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export default function WhyParentsSection() {
  const [videoOpen, setVideoOpen] = useState(false);
  const prefersReduced = useReducedMotion();
  const videoUrl = process.env.NEXT_PUBLIC_FOUNDER_VIDEO_URL ?? "";

  const closeModal = useCallback(() => setVideoOpen(false), []);

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
            aria-label="Founder Masterclass video"
          >
            <motion.div
              className="w-full max-w-3xl bg-ink border border-ink relative"
              initial={prefersReduced ? {} : { scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={prefersReduced ? {} : { scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute -top-10 right-0 text-white font-mono text-sm hover:text-signal transition-colors"
                aria-label="Close video"
              >
                CLOSE ✕
              </button>

              <div className="aspect-video">
                {videoUrl ? (
                  <iframe
                    src={`${videoUrl}?autoplay=1&rel=0`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                    title="Startup Ideas 101 - Founder Masterclass"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/50 font-mono text-sm">
                    Set NEXT_PUBLIC_FOUNDER_VIDEO_URL in .env.local
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

