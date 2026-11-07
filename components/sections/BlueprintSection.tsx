"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

const PHASES = [
  {
    weeks: "Week 1–2",
    label: "Ideation & Market Research",
    deliverables: [
      "Identify real problems worth solving",
      "Validate startup ideas with real users",
      "Competitor landscape mapping",
      "Target customer personas",
    ],
    color: "#FF4F18",
  },
  {
    weeks: "Week 3–4",
    label: "Design & Prototyping",
    deliverables: [
      "UI/UX wireframing",
      "User flow mapping",
      "High-converting landing page design",
      "Figma prototype for user testing",
    ],
    color: "#D2FF28",
  },
  {
    weeks: "Week 5–6",
    label: "Full-Stack Development",
    deliverables: [
      "No-code + AI full-stack architecture",
      "Database and backend setup",
      "Automated workflows",
      "Working MVP deployed live",
    ],
    color: "#0D5C46",
  },
  {
    weeks: "Week 7–8",
    label: "Launch & Marketing",
    deliverables: [
      "Product Hunt launch campaign",
      "Investor pitch deck creation",
      "First paying customers strategy",
      "Press and media outreach",
    ],
    color: "#121316",
  },
];

export default function BlueprintSection() {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [activePhase, setActivePhase] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    if (prefersReduced || !pathRef.current) return;

    const unsubscribe = scrollYProgress.on("change", (v) => {
      if (pathRef.current) {
        const clamped = Math.min(1, Math.max(0, (v - 0.1) / 0.6));
        pathRef.current.style.strokeDashoffset = `${1 - clamped}`;
      }
    });

    return unsubscribe;
  }, [scrollYProgress, prefersReduced]);

  const pathProgress = useTransform(scrollYProgress, [0.1, 0.7], [1, 0]);

  return (
    <section
      id="blueprint"
      ref={sectionRef}
      className="py-24 px-4 bg-paper border-y border-ink relative overflow-hidden"
      aria-label="8-Week Blueprint"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <div className="section-number mb-3">№ 03 / 08 · THE PROGRAM</div>
          <h2 className="headline-display mb-4">
            From Idea to Full App{" "}
            <span className="signal-underline">in 8 Weeks</span>
          </h2>

          <div className="inline-flex flex-wrap gap-x-6 gap-y-2 border border-ink px-6 py-3 bg-volt text-sm font-medium font-mono">
            <span>Personal 1:1 Live Sessions</span>
            <span className="text-ink/40">·</span>
            <span>1 Hour Each</span>
            <span className="text-ink/40">·</span>
            <span>Expert Guidance</span>
            <span className="text-ink/40">·</span>
            <span>2–3 Hours/Week Total Commitment</span>
          </div>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-ink/10 -translate-x-1/2" />

          <div className="hidden lg:block absolute left-0 top-8 w-full" aria-hidden="true">
            <svg
              viewBox="0 0 800 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full opacity-20"
              aria-hidden="true"
            >
              {[0, 50, 100, 150, 200, 250, 300, 350, 400].map((x) => (
                <line
                  key={x}
                  x1={x}
                  y1="0"
                  x2={x}
                  y2="400"
                  stroke="#121316"
                  strokeWidth="0.5"
                  strokeDasharray="2 4"
                />
              ))}
              {[0, 100, 200, 300, 400].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="800"
                  y2={y}
                  stroke="#121316"
                  strokeWidth="0.5"
                  strokeDasharray="2 4"
                />
              ))}
              <path
                ref={pathRef}
                d="M 50 50 C 100 50 150 150 200 150 C 250 150 300 250 350 250 C 400 250 450 350 500 350 C 550 350 600 300 650 300 C 700 300 750 200 800 200"
                stroke="#FF4F18"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="1"
                pathLength="1"
                style={
                  prefersReduced
                    ? { strokeDashoffset: 0 }
                    : { strokeDashoffset: pathProgress as unknown as number }
                }
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {PHASES.map((phase, i) => (
              <motion.div
                key={phase.weeks}
                className="border border-ink bg-ivory cursor-pointer"
                initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
                whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() =>
                  setActivePhase(activePhase === i ? null : i)
                }
              >
                <div className="flex items-start gap-4 p-5">
                  <div
                    className="w-10 h-10 flex-shrink-0 border border-ink flex items-center justify-center font-mono font-bold text-lg"
                    style={{ backgroundColor: phase.color, color: phase.color === "#D2FF28" || phase.color === "#F6F4EE" ? "#121316" : "white" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  <div className="flex-1">
                    <div className="font-mono text-xs text-ink/50 mb-1 stamp-text">
                      {phase.weeks.toUpperCase()}
                    </div>
                    <div className="font-boomdang text-xl font-bold mb-2">
                      {phase.label}
                    </div>

                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        activePhase === i ? "max-h-48" : "max-h-0"
                      }`}
                    >
                      <ul className="mt-3 space-y-1.5">
                        {phase.deliverables.map((d) => (
                          <li
                            key={d}
                            className="flex items-start gap-2 text-sm text-ink/70"
                          >
                            <span
                              className="mt-1 w-3 h-3 flex-shrink-0 border border-ink inline-block"
                              style={{ backgroundColor: phase.color }}
                              aria-hidden="true"
                            />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <span
                    className="font-mono text-ink/40 transition-transform duration-200"
                    style={{
                      transform:
                        activePhase === i ? "rotate(90deg)" : "none",
                    }}
                    aria-hidden="true"
                  >
                    →
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          className="mt-16 border-l-4 border-signal bg-ivory p-8 relative"
          initial={prefersReduced ? {} : { opacity: 0, x: -20 }}
          whileInView={prefersReduced ? {} : { opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="font-boomdang text-2xl lg:text-3xl leading-tight mb-4 italic">
            &ldquo;Learn to sell. Learn to build. If you can do both, you will be unstoppable.&rdquo;
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-ink text-paper flex items-center justify-center font-mono font-bold text-xs">
              NR
            </div>
            <div>
              <div className="font-bold">Naval Ravikant</div>
              <div className="font-mono text-xs text-ink/50 stamp-text">ENTREPRENEUR · INVESTOR · PHILOSOPHER</div>
            </div>
            <div className="ml-auto">
              <span className="bg-signal text-white font-mono text-xs px-3 py-1 stamp-text rotate-2 inline-block">
                STAMPED
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

