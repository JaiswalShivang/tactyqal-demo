"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const TICKER_1 = [
  "TACTYQAL LABS",
  "COHORT OPEN",
  "15 SPOTS LEFT",
  "8-WEEK PROGRAM",
  "1:1 MENTORING",
  "FULL STACK APP",
  "NO CODING NEEDED",
  "RESULTS GUARANTEED",
];

const TICKER_2 = [
  "SUCCESS STORIES",
  "REAL REVENUE",
  "UNIVERSITY ADMITS",
  "IVY LEAGUE",
  "PRODUCT HUNT LAUNCH",
  "AI TOOLS",
  "NO-CODE MAGIC",
  "100+ STUDENTS",
];

function TickerTape({
  items,
  direction = "left",
  bg = "bg-volt",
  textColor = "text-ink",
}: {
  items: string[];
  direction?: "left" | "right";
  bg?: string;
  textColor?: string;
}) {
  const prefersReduced = useReducedMotion();
  const content = [...items, ...items];

  if (prefersReduced) {
    return (
      <div className={`${bg} ${textColor} border-y border-ink py-2 overflow-hidden`}>
        <div className="flex gap-8 px-4 font-mono text-xs stamp-text flex-wrap">
          {items.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${bg} ${textColor} border-y border-ink py-2 overflow-hidden relative`}
      role="marquee"
      aria-label="Tactyqal Labs highlights"
    >
      <motion.div
        className="flex gap-10 whitespace-nowrap"
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ width: "max-content" }}
      >
        {content.map((item, i) => (
          <span key={i} className="font-mono text-xs stamp-text flex items-center gap-6">
            {item}
            <span className="opacity-40">·</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function HeroTicker() {
  return (
    <div className="sticky top-14 z-30">
      <TickerTape
        items={TICKER_1}
        direction="left"
        bg="bg-volt"
        textColor="text-ink"
      />
      <TickerTape
        items={TICKER_2}
        direction="right"
        bg="bg-signal"
        textColor="text-white"
      />
    </div>
  );
}

export function HomepageTicker() {
  return (
    <div className="border-y border-ink">
      <TickerTape
        items={TICKER_1}
        direction="left"
        bg="bg-ink"
        textColor="text-volt"
      />
    </div>
  );
}

