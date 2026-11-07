"use client";

import { motion, useReducedMotion } from "framer-motion";

const TICKER_ITEMS = [
  "TACTYQAL LABS",
  "COHORT OPEN",
  "15 SPOTS LEFT",
  "8-WEEK PROGRAM",
  "1:1 MENTORING",
  "FULL STACK APP",
  "NO CODING NEEDED",
  "RESULTS GUARANTEED",
  "100+ STUDENTS",
  "REAL REVENUE",
  "UNIVERSITY ADMITS",
  "PRODUCT HUNT LAUNCH",
];

export function HeroTicker() {
  const prefersReduced = useReducedMotion();
  const content = [...TICKER_ITEMS, ...TICKER_ITEMS];

  if (prefersReduced) {
    return (
      <div className="bg-sand text-ink border-b border-ink py-2.5 overflow-hidden">
        <div className="flex gap-8 px-4 font-mono text-xs sm:text-sm tracking-[0.08em] uppercase flex-wrap">
          {TICKER_ITEMS.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-sand text-ink border-b border-ink py-2.5 overflow-hidden relative group cursor-default"
      role="marquee"
      aria-label="Tactyqal Labs highlights ticker"
    >
      <motion.div
        className="flex gap-12 whitespace-nowrap group-hover:[animation-play-state:paused]"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ width: "max-content" }}
      >
        {content.map((item, i) => (
          <span
            key={i}
            className="font-mono text-xs sm:text-sm tracking-[0.08em] uppercase flex items-center gap-8 font-medium text-ink/90"
          >
            <span>{item}</span>
            <span className="text-signal font-bold">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function HomepageTicker() {
  return null;
}
