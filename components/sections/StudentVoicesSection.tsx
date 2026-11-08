"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SectionHeader } from "@/components/SectionHeader";

const VOICES = [
  {
    name: "Aarav Sharma",
    role: "Alumni · Cohort #01",
    quote: "I had to struggle to find a tech cofounder. After Tactyqal, I became my own CTO. I wish I had done this sooner.",
    avatar: "/avatars/avatar-aarav.webp",
    rotation: "-0.8deg",
  },
  {
    name: "Isha Patel",
    role: "Alumni · Cohort #02",
    quote: "Now I feel independent and can build anything I want. The 1:1 sessions made all the difference in the world.",
    avatar: "/avatars/avatar-isha.webp",
    rotation: "0.7deg",
  },
  {
    name: "Rohan Verma",
    role: "Alumni · Cohort #01",
    quote: "It's the future. Every teenager should know how to build a software product, not just consume one.",
    avatar: "/avatars/avatar-rohan.webp",
    rotation: "-0.5deg",
  },
  {
    name: "Simran Kaur",
    role: "Alumni · Cohort #03",
    quote: "I can focus on the creative side and don't have to worry about whether it can be built. That's real leverage.",
    avatar: "/avatars/avatar-simran.webp",
    rotation: "0.8deg",
  },
  {
    name: "Devansh Mehta",
    role: "Alumni · Cohort #02",
    quote: "I went on from having zero tech skills to launching my app in 8 weeks. Tactyqal made the impossible feel obvious.",
    avatar: "/avatars/avatar-devansh.webp",
    rotation: "-0.6deg",
  },
  {
    name: "Priya Nair",
    role: "Alumni · Cohort #03",
    quote: "My impact app was only in my head till I built it. Now it's live, deployed, and helping real people daily.",
    avatar: "/avatars/avatar-priya.webp",
    rotation: "0.5deg",
  },
];

export default function StudentVoicesSection() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="student-voices"
      className="py-16 md:py-22 px-4 bg-sand border-y border-ink"
      aria-label="Student testimonials"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeader
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
                      boxShadow: "4px 4px 0 #FF3D88",
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
                  <div className="w-10 h-10 border border-ink overflow-hidden bg-sand flex-shrink-0 shadow-tactile-sm">
                    <img
                      src={voice.avatar}
                      alt={`${voice.name} portrait`}
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="font-display font-bold text-sm text-ink truncate">
                      {voice.name}
                    </div>
                    <div className="font-mono text-[10px] text-ink/50 uppercase tracking-wider truncate">
                      {voice.role}
                    </div>
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
