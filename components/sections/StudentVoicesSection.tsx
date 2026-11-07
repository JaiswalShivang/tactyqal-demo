"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SectionHeader } from "@/components/SectionHeader";

const VOICES = [
  {
    name: "Aarav Sharma",
    quote: "I had to struggle to find a tech cofounder. After Tactyqal, I became my own CTO. I wish I had done this sooner.",
    initials: "AS",
    color: "bg-signal text-white",
    rotation: "-0.8deg",
  },
  {
    name: "Isha Patel",
    quote: "Now I feel independent and can build anything I want. The 1:1 sessions made all the difference in the world.",
    initials: "IP",
    color: "bg-sand text-ink",
    rotation: "0.7deg",
  },
  {
    name: "Rohan Verma",
    quote: "It's the future. Every teenager should know how to build a software product, not just consume one.",
    initials: "RV",
    color: "bg-emerald text-white",
    rotation: "-0.5deg",
  },
  {
    name: "Simran Kaur",
    quote: "I can focus on the creative side and don't have to worry about whether it can be built. That's real leverage.",
    initials: "SK",
    color: "bg-ink text-white",
    rotation: "0.8deg",
  },
  {
    name: "Devansh Mehta",
    quote: "I went on from having zero tech skills to launching my app in 8 weeks. Tactyqal made the impossible feel obvious.",
    initials: "DM",
    color: "bg-sand text-ink",
    rotation: "-0.6deg",
  },
  {
    name: "Priya Nair",
    quote: "My impact app was only in my head till I built it. Now it's live, deployed, and helping real people daily.",
    initials: "PN",
    color: "bg-signal text-white",
    rotation: "0.5deg",
  },
];

export default function StudentVoicesSection() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="student-voices"
      className="py-20 md:py-28 px-4 bg-sand border-y border-ink"
      aria-label="Student testimonials"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="№ 06 / 08 · STUDENT VOICES"
          title="What Our Students Say"
          accent="Students"
          description="Direct feedback from teen builders who designed, launched, and scaled real software in our cohorts."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {VOICES.map((voice, i) => (
            <motion.div
              key={voice.name}
              className="border-[1.5px] border-ink bg-ivory p-7 shadow-tactile flex flex-col justify-between transition-all"
              style={{
                transform: prefersReduced ? "none" : `rotate(${voice.rotation})`,
              }}
              initial={prefersReduced ? {} : { opacity: 0, y: 15 }}
              whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={
                prefersReduced
                  ? {}
                  : {
                      transform: "rotate(0deg) translateY(-3px)",
                      boxShadow: "4px 4px 0 #FF4F18",
                    }
              }
            >
              <div className="mb-6">
                <span className="text-3xl text-signal font-serif leading-none block mb-2">&ldquo;</span>
                <blockquote className="font-serif italic text-xl text-ink leading-relaxed">
                  {voice.quote}
                </blockquote>
              </div>

              <div className="pt-4 border-t border-ink/15 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 border border-ink flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 ${voice.color}`}
                  >
                    {voice.initials}
                  </div>
                  <div className="font-display font-bold text-sm text-ink truncate">
                    {voice.name}
                  </div>
                </div>

                <span className="verified-tag flex-shrink-0">
                  ✓ VERIFIED
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
