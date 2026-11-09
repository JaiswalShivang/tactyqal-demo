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
    cardStyle: "bg-[#0F1B3D] text-white border-ink shadow-tactile-sm",
    badgeStyle: "text-[#00F5D4] font-bold",
  },
];

export default function WhyParentsSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section
      id="why-parents"
      className="py-16 md:py-22 px-4 bg-paper border-y border-ink relative"
      aria-label="Why parents choose Tactyqal Labs"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="Why Parents Choose Tactyqal Labs"
          accent="Tactyqal Labs"
          description="We replace passive screen time with high-agency software entrepreneurship under 1:1 executive mentorship."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-6">
          <div className="lg:col-span-6 border-[1.5px] border-[#0F1B3D] bg-[#0F1B3D] text-[#FFFFFF] shadow-[6px_6px_0px_0px_#FF3D88] p-5 sm:p-6 flex flex-col justify-between h-full">
            <div>
              <div className="relative aspect-video border-[1.5px] border-[#263B73] bg-[#0A1229] mb-5 overflow-hidden">
                {!isPlaying ? (
                  <div
                    onClick={() => setIsPlaying(true)}
                    className="absolute inset-0 cursor-pointer group flex flex-col items-center justify-center p-6 select-none relative"
                  >
                    <img
                      src="https://i.ytimg.com/vi/UyUH06CfLbk/hqdefault.jpg"
                      alt="Startup Ideas 101 with Partha Chakraborty"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/extracted/blog-ele.webp";
                      }}
                    />

                    <div className="absolute inset-0 bg-[#0F1B3D]/65 group-hover:bg-[#0F1B3D]/50 transition-colors pointer-events-none" />

                    <div className="relative z-10 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 rounded-full bg-[#FF3D88] text-white flex items-center justify-center border-2 border-white shadow-[4px_4px_0px_0px_#FFFFFF] group-hover:scale-110 group-hover:shadow-[6px_6px_0px_0px_#FFFFFF] transition-all cursor-pointer mb-3">
                        <svg className="w-6 h-6 translate-x-0.5 fill-current" viewBox="0 0 24 24">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      </div>
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-white bg-[#0F1B3D]/90 border border-white/20 px-3.5 py-1">
                        Watch Founder Masterclass (12 Mins)
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <iframe
                      src="https://www.youtube-nocookie.com/embed/UyUH06CfLbk?autoplay=1&rel=0&modestbranding=1"
                      title="Startup Ideas 101 with Partha Chakraborty"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full border-0"
                    />
                    <button
                      type="button"
                      onClick={() => setIsPlaying(false)}
                      className="absolute top-2 right-2 z-20 bg-[#0F1B3D]/90 text-white hover:bg-[#FF3D88] border border-white/20 px-2.5 py-1 text-[11px] font-mono font-bold transition cursor-pointer"
                    >
                      ✕ Close
                    </button>
                  </div>
                )}
              </div>

              <h3 className="font-display font-bold text-xl sm:text-2xl tracking-normal mb-2 text-white">
                Startup Ideas 101 with Partha Chakraborty
              </h3>

              <p className="text-xs sm:text-sm text-paper/75 leading-relaxed tracking-normal">
                How teenagers spot real daily friction and turn it into scalable software before writing a single line of code.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 grid-rows-2 gap-6 h-full">
            {PILLARS_ROW1.map((p) => (
              <div
                key={p.num}
                className={`border-[1.5px] p-5 sm:p-6 flex flex-col justify-between h-full ${p.cardStyle}`}
              >
                <div>
                  <div className="font-mono text-xs mb-2 opacity-60 stamp-text">
                    № {p.num}
                  </div>
                  <h4 className="font-display font-bold text-base sm:text-lg leading-snug tracking-normal mb-2">
                    {p.title}
                  </h4>
                  <p className="text-xs sm:text-sm leading-relaxed tracking-normal opacity-85">
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
                <h4 className="font-display font-bold text-base sm:text-lg leading-snug tracking-normal mb-2">
                  {p.title}
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed tracking-normal opacity-85">
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
