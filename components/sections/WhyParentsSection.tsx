"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";

const PILLARS_ROW1 = [
  {
    num: "01",
    title: "1:1 Personalized Mentoring",
    desc: "Every student gets dedicated, expert guidance from founders. No group lectures.",
    cardStyle: "bg-signal text-white border-ink shadow-tactile-sm",
    badgeStyle: "text-white/80",
  },
  {
    num: "02",
    title: "Full Stack App with No-Code",
    desc: "Build production-ready apps using modern no-code platforms and AI tools.",
    cardStyle: "bg-ivory text-ink border-ink shadow-tactile-sm",
    badgeStyle: "text-signal font-bold",
  },
  {
    num: "03",
    title: "Proven Track Record",
    desc: "100+ students mentored, real revenue, and top university admits.",
    cardStyle: "bg-sand text-ink border-ink shadow-tactile-sm",
    badgeStyle: "text-emerald font-bold",
  },
  {
    num: "04",
    title: "University Admission Edge",
    desc: "Stand out in Ivy League and top applications with verifiable software and real traction.",
    cardStyle: "bg-ivory text-ink border-ink shadow-tactile-sm",
    badgeStyle: "text-ink/60",
  },
];

const PILLARS_ROW2 = [
  {
    num: "05",
    title: "Revenue Generation",
    desc: "Students learn the economics of digital products: Stripe billing, pricing, and monetization.",
    cardStyle: "bg-sand text-ink border-ink shadow-tactile-sm",
    badgeStyle: "text-signal font-bold",
  },
  {
    num: "06",
    title: "Life Long Support",
    desc: "Alumni network access, ongoing founder mentorship, and introductions after cohort graduation.",
    cardStyle: "bg-ivory text-ink border-ink shadow-tactile-sm",
    badgeStyle: "text-ink/60",
  },
  {
    num: "07",
    title: "Pitch & Presentation Skills",
    desc: "Master storytelling, build an investor pitch deck, and launch to thousands on Product Hunt.",
    cardStyle: "bg-ink text-white border-ink shadow-tactile-sm",
    badgeStyle: "text-volt font-bold",
  },
];

const CHAPTERS = [
  { time: 0, label: "00:00 · The Thesis" },
  { time: 105, label: "01:45 · Idea Matrix" },
  { time: 495, label: "08:15 · First Customers" },
];

export default function WhyParentsSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTimestamp, setSelectedTimestamp] = useState(105);

  const handlePlayChapter = (time: number) => {
    setSelectedTimestamp(time);
    setIsPlaying(true);
  };

  return (
    <section
      id="why-parents"
      className="py-16 md:py-22 px-4 bg-paper border-y border-ink relative"
      aria-label="Why parents choose Tactyqal Labs"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="№ 04 / 08 · THE ADVANTAGE"
          title="Why Parents Choose Tactyqal Labs"
          accent="Tactyqal Labs"
          description="We replace passive screen time with high-agency software entrepreneurship under 1:1 executive mentorship."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-6">
          <div className="lg:col-span-6 border-[1.5px] border-[#121316] bg-[#121316] text-[#F6F4EE] shadow-[6px_6px_0px_0px_#FF4F18] p-5 sm:p-6 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between border-b border-[#2E3138] pb-3 mb-4 font-mono text-xs">
                <span className="text-signal font-bold tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-signal animate-pulse" />
                  FOUNDER MASTERCLASS // PARTHA CHAKRABORTY
                </span>
                <span className="text-paper/60 uppercase text-[11px] border border-[#2E3138] px-2 py-0.5">
                  YOUTUBE LIVE EVENT
                </span>
              </div>

              <div className="relative aspect-video border-y-[1.5px] border-[#2E3138] bg-black mb-4 overflow-hidden">
                {!isPlaying ? (
                  <div
                    onClick={() => setIsPlaying(true)}
                    className="absolute inset-0 cursor-pointer group flex flex-col justify-between p-3.5"
                  >
                    <img
                      src="https://img.youtube.com/vi/UyUH06CfLbk/hqdefault.jpg"
                      alt="Startup Ideas 101 Masterclass"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 group-hover:from-black/75 transition-colors" />

                    <div className="relative z-10 flex items-center justify-between">
                      <span className="pill pill-volt text-[10px] font-semibold">
                        A CH Tribe Event · Live Recording
                      </span>
                      <span className="font-mono text-[10px] text-white bg-[#121316]/80 px-2 py-0.5 border border-white/20">
                        12 MIN
                      </span>
                    </div>

                    <div className="relative z-10 flex items-center justify-center my-auto">
                      <button
                        type="button"
                        className="tactile-btn-signal px-4 py-2 text-xs font-bold flex items-center gap-2 shadow-tactile group-hover:scale-105 transition-transform"
                      >
                        <span className="w-0 h-0 border-y-[5px] border-y-transparent border-l-[9px] border-l-white ml-0.5" />
                        Watch with Sound ▶
                      </button>
                    </div>

                    <div className="relative z-10 flex items-center justify-between font-mono text-[10px] text-paper/80">
                      <span>Partha Chakraborty · Founder</span>
                      <span className="text-signal font-bold">CLICK TO PLAY INLINE</span>
                    </div>
                  </div>
                ) : (
                  <iframe
                    src={`https://www.youtube.com/embed/UyUH06CfLbk?start=${selectedTimestamp}&autoplay=1&rel=0`}
                    title="How to Come Up with Startup Ideas? | A CH Tribe Event with Partha Chakraborty"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                )}
              </div>

              <h3 className="font-display font-bold text-xl sm:text-2xl tracking-tight mb-1 text-white">
                Startup Ideas 101 with Partha Chakraborty
              </h3>

              <p className="text-xs sm:text-sm text-paper/75 leading-relaxed mb-4">
                How teenagers spot real daily friction and turn it into scalable software before writing a single line of code.
              </p>
            </div>

            <div className="pt-3 border-t border-[#2E3138] flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] text-paper/50 uppercase tracking-wider mr-1">
                Chapters:
              </span>
              {CHAPTERS.map((ch) => (
                <button
                  key={ch.time}
                  onClick={() => handlePlayChapter(ch.time)}
                  className={`font-mono text-[10px] px-2.5 py-1 border transition-colors cursor-pointer ${
                    selectedTimestamp === ch.time && isPlaying
                      ? "bg-signal text-white border-signal font-bold"
                      : "border-[#2E3138] text-paper/70 hover:border-paper bg-[#1C1E22]"
                  }`}
                >
                  {ch.label}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
            {PILLARS_ROW1.map((p) => (
              <div
                key={p.num}
                className={`border-[1.5px] p-5 sm:p-6 flex flex-col justify-between h-full ${p.cardStyle}`}
              >
                <div>
                  <div className="font-mono text-xs mb-2 opacity-60 stamp-text">
                    № {p.num}
                  </div>
                  <h4 className="font-display font-bold text-base sm:text-lg leading-snug tracking-tight mb-2">
                    {p.title}
                  </h4>
                  <p className="text-xs sm:text-sm leading-relaxed opacity-85">
                    {p.desc}
                  </p>
                </div>
                <div className={`pt-3 mt-4 border-t border-current/15 font-mono text-[10px] uppercase tracking-widest font-semibold ${p.badgeStyle}`}>
                  VERIFIED PILLAR
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {PILLARS_ROW2.map((p) => (
            <div
              key={p.num}
              className={`border-[1.5px] p-5 sm:p-6 flex flex-col justify-between h-full ${p.cardStyle}`}
            >
              <div>
                <div className="font-mono text-xs mb-2 opacity-60 stamp-text">
                  № {p.num}
                </div>
                <h4 className="font-display font-bold text-base sm:text-lg leading-snug tracking-tight mb-2">
                  {p.title}
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed opacity-85">
                  {p.desc}
                </p>
              </div>
              <div className={`pt-3 mt-4 border-t border-current/15 font-mono text-[10px] uppercase tracking-widest font-semibold ${p.badgeStyle}`}>
                VERIFIED PILLAR
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
