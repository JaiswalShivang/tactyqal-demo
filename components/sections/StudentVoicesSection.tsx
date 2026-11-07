"use client";

import { motion, useReducedMotion } from "framer-motion";

const VOICES = [
  {
    name: "Aarav Sharma",
    quote: "I had to struggle to find a tech cofounder. After Tactyqal, I became my own CTO. I wish I had done this sooner.",
    initials: "AS",
    color: "bg-signal",
    rotation: "-1.5deg",
  },
  {
    name: "Isha Patel",
    quote: "Now I feel independent and can build anything I want. The 1:1 sessions made all the difference.",
    initials: "IP",
    color: "bg-volt",
    rotation: "1deg",
    textColor: "text-ink",
  },
  {
    name: "Rohan Verma",
    quote: "It's the future. Every teenager should know how to build a product, not just use one.",
    initials: "RV",
    color: "bg-emerald",
    rotation: "-0.8deg",
  },
  {
    name: "Simran Kaur",
    quote: "I can focus on the creative side and don't have to worry about whether it can be built. That's freedom.",
    initials: "SK",
    color: "bg-ink",
    rotation: "1.5deg",
  },
  {
    name: "Devansh Mehta",
    quote: "I went on from having no idea to launching my app in 8 weeks. Tactyqal made the impossible feel obvious.",
    initials: "DM",
    color: "bg-sand",
    rotation: "-0.5deg",
    textColor: "text-ink",
  },
  {
    name: "Priya Nair",
    quote: "My impact app was only in my head till I built it. Now it's live and helping real people.",
    initials: "PN",
    color: "bg-signal",
    rotation: "1.2deg",
  },
];

export default function StudentVoicesSection() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="student-voices"
      className="py-24 px-4 bg-sand border-y border-ink"
      aria-label="Student testimonials"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="section-number mb-3">№ 06 / 08 · PROOF</div>
          <h2 className="headline-display">
            What Our <span className="signal-underline">Students</span> Say
          </h2>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {VOICES.map((voice, i) => (
            <motion.div
              key={voice.name}
              className="break-inside-avoid"
              initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
              whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <div
                className="border border-ink bg-ivory p-5 hover:shadow-tactile transition-all cursor-default"
                style={{
                  transform: prefersReduced
                    ? "none"
                    : `rotate(${voice.rotation})`,
                }}
                onMouseEnter={(e) => {
                  if (prefersReduced) return;
                  (e.currentTarget as HTMLDivElement).style.transform = "rotate(0deg) translateY(-4px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "4px 4px 0 #121316";
                }}
                onMouseLeave={(e) => {
                  if (prefersReduced) return;
                  (e.currentTarget as HTMLDivElement).style.transform = `rotate(${voice.rotation})`;
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "";
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-9 h-9 rounded-none flex items-center justify-center ${voice.color} ${voice.textColor ?? "text-white"} font-mono font-bold text-xs flex-shrink-0`}
                  >
                    {voice.initials}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{voice.name}</div>
                    <span className="verified-tag">✓ VERIFIED STUDENT</span>
                  </div>
                </div>

                <blockquote className="text-sm leading-relaxed text-ink/80 italic border-l-2 border-ink/20 pl-3">
                  &ldquo;{voice.quote}&rdquo;
                </blockquote>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

