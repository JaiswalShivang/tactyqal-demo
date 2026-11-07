"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { SectionHeader } from "@/components/SectionHeader";

const PHASES = [
  {
    num: "01",
    weeks: "WEEKS 1–2",
    tag: "DISCOVERY",
    title: "Ideation & Market Research",
    bullets: [
      "Identify real problems worth solving",
      "Validate startup ideas with real users",
      "Map competitors and customer personas",
    ],
    output: "OUTPUT: Validated Problem Spec",
    accent: "text-signal",
  },
  {
    num: "02",
    weeks: "WEEKS 3–4",
    tag: "PROTOTYPING",
    title: "Design & Prototyping",
    bullets: [
      "UI/UX wireframes and user flows",
      "High-converting landing page structure",
      "Interactive Figma prototype for testing",
    ],
    output: "OUTPUT: Interactive Figma Prototype",
    accent: "text-ink",
  },
  {
    num: "03",
    weeks: "WEEKS 5–6",
    tag: "ENGINEERING",
    title: "Full-Stack Development",
    bullets: [
      "No-code + AI full-stack architecture",
      "Database schema and backend setup",
      "Automated logic and working MVP",
    ],
    output: "OUTPUT: Full-Stack AI App",
    accent: "text-emerald",
  },
  {
    num: "04",
    weeks: "WEEKS 7–8",
    tag: "GO-TO-MARKET",
    title: "Launch & Marketing",
    bullets: [
      "Product Hunt launch campaign",
      "Investor pitch deck creation",
      "First paying customer acquisition",
    ],
    output: "OUTPUT: Product Hunt Launch",
    accent: "text-signal",
  },
];

export default function BlueprintSection() {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const pathLength = useTransform(scrollYProgress, [0.15, 0.65], [0, 1]);

  return (
    <section
      id="blueprint"
      ref={sectionRef}
      className="py-16 md:py-22 px-4 bg-paper border-y border-ink relative overflow-hidden"
      aria-label="8-Week Blueprint"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="№ 03 / 08 · THE ARCHITECTURE"
          title="From Idea to Full App in 8 Weeks"
          accent="8 Weeks"
          description="A structured, milestone-driven curriculum engineered to take high schoolers from zero to a live, monetizable software startup."
        />

        <div className="hidden lg:block mb-8">
          <div className="relative">
            <svg
              viewBox="0 0 1200 40"
              className="w-full h-10 overflow-visible"
              aria-hidden="true"
            >
              <line
                x1="0"
                y1="20"
                x2="1200"
                y2="20"
                stroke="#121316"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.3"
              />
              <motion.line
                x1="0"
                y1="20"
                x2="1200"
                y2="20"
                stroke="#FF4F18"
                strokeWidth="2.5"
                style={
                  prefersReduced
                    ? { pathLength: 1 }
                    : { pathLength }
                }
              />
              {[150, 450, 750, 1050].map((cx, idx) => (
                <g key={cx}>
                  <circle
                    cx={cx}
                    cy="20"
                    r="8"
                    fill="#F6F4EE"
                    stroke="#121316"
                    strokeWidth="2"
                  />
                  <circle cx={cx} cy="20" r="3" fill="#FF4F18" />
                  <text
                    x={cx}
                    y="36"
                    textAnchor="middle"
                    className="font-mono text-[10px] fill-ink/60 font-medium"
                  >
                    PHASE {idx + 1}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-stretch mb-12">
          {PHASES.map((phase, idx) => (
            <div
              key={phase.num}
              className={`border-[1.5px] border-ink bg-ivory p-6 sm:p-7 flex flex-col justify-between relative ${
                idx > 0 ? "lg:-ml-[1.5px]" : ""
              } ${idx >= 2 ? "md:-mt-[1.5px] lg:mt-0" : ""}`}
            >
              <div>
                <div className="flex items-center justify-between border-b border-ink/15 pb-3 mb-4">
                  <span className="font-mono text-xs font-bold text-ink">
                    {phase.num} / {phase.weeks}
                  </span>
                  <span className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 bg-sand text-ink/80 border border-ink/20">
                    {phase.tag}
                  </span>
                </div>

                <h3 className="font-display font-bold text-xl tracking-tight leading-snug mb-4 text-ink">
                  {phase.title}
                </h3>

                <ul className="space-y-2.5 mb-8">
                  {phase.bullets.map((bullet) => (
                    <li key={bullet} className="text-sm text-ink/75 leading-relaxed flex items-start gap-2">
                      <span className="text-signal font-bold mt-0.5">▸</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-dashed border-ink/25">
                <span className="font-mono text-xs font-bold text-ink bg-sand/70 border border-ink/30 px-2.5 py-1.5 block text-center">
                  {phase.output}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="border border-ink bg-sand p-6 sm:p-8 mb-8 shadow-tactile-sm">
          <div className="max-w-3xl mx-auto text-center">
            <span className="font-mono text-xs text-ink/50 uppercase tracking-widest block mb-3">
              NAVAL RAVIKANT · THE NEW LEVERAGE
            </span>
            <blockquote className="font-serif italic text-xl sm:text-2xl text-ink leading-relaxed mb-4">
              &ldquo;Coding, writing books, recorded podcasts, tweets, YouTubes, software — these are all permissionless leverage. You don&apos;t need anyone&apos;s permission to build.&rdquo;
            </blockquote>
            <div className="font-mono text-xs text-signal font-bold uppercase tracking-wider">
              — Teach kids to own permissionless leverage before college
            </div>
          </div>
        </div>

        <div className="border border-ink px-6 py-4 bg-ivory flex flex-wrap items-center justify-between gap-4 font-mono text-xs sm:text-sm">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald" />
            <span className="font-semibold uppercase tracking-wider">Cohort Spec:</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-ink/80">
            <span>Personal 1:1 Live Sessions</span>
            <span>·</span>
            <span>1 Hour Each</span>
            <span>·</span>
            <span>Expert Guidance</span>
            <span>·</span>
            <span>2–3 Hours/Week Total</span>
          </div>
        </div>
      </div>
    </section>
  );
}
