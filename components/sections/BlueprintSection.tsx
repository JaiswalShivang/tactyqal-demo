"use client";

import { useRef } from "react";
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
    output: "OUTPUT: Interactive UI Prototype",
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
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id="blueprint"
      ref={sectionRef}
      className="py-16 md:py-22 px-4 bg-paper border-y border-ink relative overflow-hidden"
      aria-label="8-Week Blueprint"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="03 / 09 · 8-WEEK BLUEPRINT"
          title="From Idea to Full App in 8 Weeks"
          accent="8 Weeks"
          description="A structured, milestone-driven curriculum engineered to take high schoolers from zero to a live, monetizable software startup."
        />

        <div className="hidden lg:block mb-8 relative">
          <div className="absolute top-2 left-12 right-12 h-0.5 border-t border-dashed border-ink/30 z-0" />
          <div className="grid grid-cols-4 relative z-10">
            {PHASES.map((phase, idx) => (
              <div key={phase.num} className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full border-2 border-ink bg-paper flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-signal" />
                </div>
                <span className="font-mono text-[10px] text-ink/60 font-bold mt-1.5 uppercase tracking-wider">
                  PHASE {idx + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-stretch mb-12">
          {PHASES.map((phase, idx) => (
            <div
              key={phase.num}
              className={`border-[1.5px] border-ink bg-ivory p-6 sm:p-7 flex flex-col justify-between h-full relative ${
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

                <h3 className="font-display font-bold text-xl leading-snug mb-4 text-ink">
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
                <span className="font-mono text-[11px] font-bold text-ink bg-sand/70 border border-ink/30 px-3 py-1.5 block text-center truncate whitespace-nowrap w-full">
                  {phase.output}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="border border-ink bg-sand p-6 sm:p-8 mb-8 shadow-tactile-sm">
          <div className="max-w-3xl mx-auto text-center">
            <span className="pill pill-volt text-xs font-semibold mb-3">
              Guaranteed Outcome
            </span>
            <blockquote className="font-serif italic text-xl sm:text-2xl text-ink leading-relaxed mb-4">
              &ldquo;By Week 8, your student will not have a certificate—they will have a live URL, real users, and verifiable proof of competence.&rdquo;
            </blockquote>
            <div className="font-mono text-xs text-ink/60 uppercase tracking-wider">
              Partha Chakraborty · Founder &amp; Lead Mentor
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
