"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";

const PILLARS_ROW1 = [
  {
    num: "01",
    title: "1:1 Personalized Mentoring",
    desc: "Every student gets dedicated, expert guidance from founders. No group lectures.",
    border: "border-signal",
    badge: "text-signal",
  },
  {
    num: "02",
    title: "Full Stack App with No-Code",
    desc: "Build production-ready apps using modern no-code platforms and AI tools.",
    border: "border-[#2E3138]",
    badge: "text-volt",
  },
  {
    num: "03",
    title: "Proven Track Record",
    desc: "100+ students mentored, real revenue, and top university admits.",
    border: "border-[#2E3138]",
    badge: "text-emerald",
  },
  {
    num: "04",
    title: "University Admission Edge",
    desc: "Stand out in Ivy League and top applications with verifiable software and real traction.",
    border: "border-[#2E3138]",
    badge: "text-paper",
  },
];

const PILLARS_ROW2 = [
  {
    num: "05",
    title: "Revenue Generation",
    desc: "Students learn the economics of digital products: Stripe billing, pricing, and monetization.",
    border: "border-[#2E3138]",
    badge: "text-volt",
  },
  {
    num: "06",
    title: "Life Long Support",
    desc: "Alumni network access, ongoing founder mentorship, and introductions after cohort graduation.",
    border: "border-[#2E3138]",
    badge: "text-paper",
  },
  {
    num: "07",
    title: "Pitch & Presentation Skills",
    desc: "Master storytelling, build an investor pitch deck, and launch to thousands on Product Hunt.",
    border: "border-signal",
    badge: "text-signal",
  },
];

export default function WhyParentsSection() {
  const [selectedTimestamp, setSelectedTimestamp] = useState(105);

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

  return (
    <section
      id="why-parents"
      className="py-16 md:py-22 px-4 bg-[#121316] text-[#F6F4EE] border-y border-[#2E3138] relative overflow-hidden"
      aria-label="Why parents choose Tactyqal Labs"
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none mix-blend-luminosity"
        src="https://www.tactyqal.com/application/assets/videos/continuous-support.mp4"
      />

      <div className="absolute inset-0 bg-[#121316]/80 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          eyebrow="№ 04 / 08 · THE ADVANTAGE"
          title="Why Parents Choose Tactyqal Labs"
          accent="Tactyqal Labs"
          accentColor="signal"
          description="We replace passive screen time with high-agency software entrepreneurship under 1:1 executive mentorship."
          dark={true}
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch mb-8">
          <div className="col-span-12 md:col-span-6 md:row-span-2 border-[1.5px] border-[#2E3138] bg-[#1C1E22] text-paper p-6 sm:p-7 flex flex-col justify-between shadow-tactile">
            <div>
              <div className="flex items-center justify-between border-b border-paper/15 pb-3 mb-4">
                <span className="font-mono text-xs text-signal font-bold tracking-wider flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-signal animate-pulse" />
                  FOUNDER MASTERCLASS
                </span>
                <span className="font-mono text-xs text-paper/50 uppercase">
                  STARTUP IDEAS 101
                </span>
              </div>

              <div className="relative aspect-video border border-[#2E3138] bg-black mb-5 overflow-hidden shadow-tactile-sm">
                <iframe
                  src={`https://www.youtube.com/embed/UyUH06CfLbk?start=${selectedTimestamp}&rel=0`}
                  title="How to Come Up with Startup Ideas? | A CH Tribe Event with Partha Chakraborty"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>

              <h3 className="font-display font-bold text-2xl tracking-tight mb-2 text-paper">
                Startup Ideas 101 with Partha Chakraborty
              </h3>

              <p className="text-sm text-paper/75 leading-relaxed mb-4">
                Learn how to identify and validate profitable startup ideas from our founder in this live masterclass session.
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {CHAPTERS.map((ch) => (
                  <button
                    key={ch.time}
                    onClick={() => setSelectedTimestamp(ch.time)}
                    className={`font-mono text-[11px] px-2 py-1 border transition-colors cursor-pointer ${
                      selectedTimestamp === ch.time
                        ? "bg-signal text-white border-signal font-bold"
                        : "border-[#2E3138] text-paper/70 hover:border-paper bg-[#121316]"
                    }`}
                  >
                    {ch.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-paper/15 space-y-2">
              <div className="font-mono text-[11px] text-paper/50 uppercase tracking-wider mb-2">
                Core Takeaways:
              </div>
              {TAKEAWAYS.map((point) => (
                <div key={point} className="flex items-start gap-2 text-xs text-paper/85">
                  <span className="text-signal font-bold">▸</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {PILLARS_ROW1.map((p) => (
            <div
              key={p.num}
              className={`col-span-12 sm:col-span-6 md:col-span-3 border-[1.5px] ${p.border} bg-[#1C1E22] p-6 flex flex-col justify-between shadow-tactile-sm`}
            >
              <div>
                <div className="font-mono text-xs mb-3 text-paper/50 stamp-text">
                  № {p.num}
                </div>
                <h4 className="font-display font-bold text-lg leading-snug tracking-tight mb-2 text-paper">
                  {p.title}
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed text-paper/70">
                  {p.desc}
                </p>
              </div>
              <div className={`pt-4 mt-4 border-t border-paper/10 font-mono text-[11px] uppercase tracking-widest font-semibold ${p.badge}`}>
                VERIFIED PILLAR
              </div>
            </div>
          ))}

          {PILLARS_ROW2.map((p) => (
            <div
              key={p.num}
              className={`col-span-12 sm:col-span-6 md:col-span-4 border-[1.5px] ${p.border} bg-[#1C1E22] p-6 flex flex-col justify-between shadow-tactile-sm`}
            >
              <div>
                <div className="font-mono text-xs mb-3 text-paper/50 stamp-text">
                  № {p.num}
                </div>
                <h4 className="font-display font-bold text-lg leading-snug tracking-tight mb-2 text-paper">
                  {p.title}
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed text-paper/70">
                  {p.desc}
                </p>
              </div>
              <div className={`pt-4 mt-4 border-t border-paper/10 font-mono text-[11px] uppercase tracking-widest font-semibold ${p.badge}`}>
                VERIFIED PILLAR
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
