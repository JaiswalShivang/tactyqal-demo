"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

function Barcode({ digits }: { digits: string }) {
  const heights = Array.from(digits).map((d) => 18 + parseInt(d) * 2.2);
  return (
    <div className="barcode" aria-hidden="true">
      {heights.map((h, i) => (
        <div
          key={i}
          className="barcode-bar"
          style={{ height: `${h}px`, width: i % 3 === 0 ? "3px" : "2px" }}
        />
      ))}
      <div className="barcode-bar" style={{ height: "36px", width: "4px" }} />
      {heights.slice().reverse().map((h, i) => (
        <div
          key={`r${i}`}
          className="barcode-bar"
          style={{ height: `${h}px` }}
        />
      ))}
    </div>
  );
}

export default function HeroSection() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [highlight, setHighlight] = useState({ x: 50, y: 50 });
  const prefersReduced = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * 5, y: -dx * 5 });
    setHighlight({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHighlight({ x: 50, y: 50 });
  };

  const PILLS = [
    "1:1 Mentoring",
    "Idea To Full-Stack App",
    "No Coding",
    "Admissions To The Best Colleges",
    "Grants",
    "Media Coverage",
  ];

  return (
    <section
      id="hero"
      className="relative min-h-[calc(100vh-3.5rem)] py-12 lg:py-16 px-4 sm:px-6 bg-[#0F1B3D] text-[#FFFFFF] overflow-hidden flex flex-col justify-center border-b border-[#263B73]"
      aria-label="Hero section"
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="https://img.youtube.com/vi/UyUH06CfLbk/hqdefault.jpg"
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-65 scale-[1.02] pointer-events-none"
        style={{ filter: "contrast(1.08) saturate(1.1)" }}
      >
        <source src="/videos/kid_impact.mp4" type="video/mp4" />
        <source src="https://www.tactyqal.com/application/assets/videos/kid_impact.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-r from-[#0F1B3D]/95 via-[#0F1B3D]/70 to-[#0F1B3D]/35 z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:64px_64px] z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F1B3D]/40 via-transparent to-[#0F1B3D]/80 z-0 pointer-events-none" />

      <div className="absolute inset-0 pointer-events-none select-none z-0" aria-hidden="true">
        <div className="absolute top-6 left-6 font-mono text-[12px] text-white/30 font-bold">+</div>
        <div className="absolute top-6 right-6 font-mono text-[12px] text-white/30 font-bold">+</div>
        <div className="absolute bottom-6 left-6 font-mono text-[12px] text-white/30 font-bold">+</div>
        <div className="absolute bottom-6 right-6 font-mono text-[12px] text-white/30 font-bold">+</div>
        <div className="hidden lg:block absolute top-0 bottom-0 left-[58.333%] border-r border-dashed border-white/10" />
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch relative z-10">
        <div className="lg:col-span-7 flex flex-col justify-between h-full">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 bg-[#162654] border border-[#FF3D88] text-[11px] font-mono font-bold uppercase tracking-wider text-white shadow-[2px_2px_0px_#0F1B3D]">
              <span className="w-2 h-2 rounded-full bg-[#FF3D88]" />
              <span>01 / 09 · THE PROGRAM</span>
            </div>

            <h1 className="font-display font-extrabold text-[clamp(2.4rem,4.2vw,3.9rem)] tracking-[-0.025em] leading-[1.04] text-[#FFFFFF] mb-4">
              Empower Your Kid To{" "}
              <span className="text-[#FF3D88] font-extrabold">Build</span>{" "}
              The Next App That Impacts Millions,{" "}
              <span className="whitespace-nowrap text-[#FF3D88] font-extrabold">
                in 8 Weeks.
              </span>
            </h1>

            <div className="flex flex-wrap gap-2 mb-5">
              {PILLS.map((pill) => (
                <span
                  key={pill}
                  className="text-xs px-3 py-1 rounded-full bg-[#162654]/85 backdrop-blur-sm border border-[#263B73] text-[#FFFFFF] hover:border-[#FF3D88] transition-colors font-sans"
                >
                  {pill}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5 border-[1.5px] border-[#0F1B3D] p-3.5 bg-white text-[#0F1B3D] max-w-xl shadow-[4px_4px_0px_0px_#FF3D88]">
              <div className="text-center border-r border-[#0F1B3D]/20 pr-2">
                <div className="font-display text-2xl sm:text-3xl font-extrabold text-[#FF3D88] tracking-tight">
                  100+
                </div>
                <div className="text-[10px] sm:text-[11px] text-[#0F1B3D]/70 font-mono mt-0.5 stamp-text">
                  STUDENTS MENTORED
                </div>
              </div>
              <div className="text-center border-r border-[#0F1B3D]/20 px-2">
                <div className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#0F1B3D]">
                  TOP
                </div>
                <div className="text-[10px] sm:text-[11px] text-[#0F1B3D]/70 font-mono mt-0.5 stamp-text">
                  UNIVERSITY ADMITS
                </div>
              </div>
              <div className="text-center pl-2">
                <div className="font-display text-lg sm:text-xl font-bold tracking-tight text-[#0F1B3D]">
                  ₹ THOUSANDS
                </div>
                <div className="text-[10px] sm:text-[11px] text-[#0F1B3D]/70 font-mono mt-0.5 stamp-text">
                  REAL REVENUE
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full pt-1">
            <Link
              href="#contact"
              className="whitespace-nowrap px-6 py-3.5 text-sm font-bold text-center tracking-wide bg-[#FF3D88] text-white border-2 border-white shadow-[4px_4px_0px_0px_#FFFFFF] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#FFFFFF] hover:bg-[#E62E76] transition-all cursor-pointer"
            >
              Book Free Consultation
            </Link>
            <Link
              href="#student-projects"
              className="whitespace-nowrap px-6 py-3.5 text-sm font-bold text-center tracking-wide bg-white text-[#0F1B3D] border-2 border-[#0F1B3D] shadow-[4px_4px_0px_0px_#FF3D88] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#FF3D88] transition-all cursor-pointer"
            >
              Explore Student Apps
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 flex justify-center lg:justify-end h-full">
          <motion.div
            ref={cardRef}
            className="ticket-card w-full max-w-md cursor-pointer bg-white text-[#0F1B3D] border-2 border-[#0F1B3D] shadow-[8px_8px_0px_0px_#FF3D88] flex flex-col justify-between h-full"
            style={
              prefersReduced
                ? {}
                : {
                    transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                    transition: "transform 0.15s ease-out",
                  }
            }
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {!prefersReduced && (
              <div
                className="absolute inset-0 opacity-10 pointer-events-none transition-all duration-150"
                style={{
                  background: `radial-gradient(circle at ${highlight.x}% ${highlight.y}%, white 0%, transparent 70%)`,
                }}
              />
            )}

            <div className="ticket-notch ticket-notch-left" />
            <div className="ticket-notch ticket-notch-right" />

            <div className="p-6 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-start justify-between mb-3 border-b border-[#0F1B3D]/15 pb-3">
                  <div>
                    <div className="font-mono text-xs text-[#0F1B3D]/50 stamp-text mb-0.5">
                      ADMISSION TICKET
                    </div>
                    <div className="font-display text-2xl font-bold tracking-tight">
                      8-WEEK COHORT
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-xs text-[#0F1B3D]/50 stamp-text">
                      SEAT NO.
                    </div>
                    <div className="font-mono font-bold text-lg text-[#FF3D88]">
                      #04
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="pill bg-[#FFE4EF] text-[#FF3D88] border-[#FF3D88] text-xs font-semibold">
                      Limited Time Offer
                    </span>
                    <span className="pill text-xs font-mono bg-[#F4F6FB] text-[#0F1B3D] border-[#0F1B3D]">
                      Only 15 spots
                    </span>
                  </div>

                  <div className="flex items-baseline gap-4 mb-1">
                    <span className="font-mono text-2xl line-through text-[#0F1B3D]/40">
                      ₹25,000
                    </span>
                    <span className="font-display text-[clamp(2.5rem,4vw,3.75rem)] font-extrabold text-[#FF3D88] leading-none tracking-tight">
                      ₹16,000
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-[#0F1B3D]/50 stamp-text">
                    ONE-TIME · FULL PROGRAM ACCESS · TAX INCLUDED
                  </div>
                </div>

                <div className="border-t border-dashed border-[#0F1B3D]/30 my-3.5" />

                <div className="mb-4">
                  <div className="font-mono text-xs text-[#0F1B3D]/70 uppercase tracking-wider mb-2 font-bold">
                    Cohort Inclusions:
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm">
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-[#00D2B4] text-[#0F1B3D] flex items-center justify-center text-[10px] font-bold">✓</span>
                      <span className="font-medium">8 Weeks 1:1 Live Mentoring</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-[#00D2B4] text-[#0F1B3D] flex items-center justify-center text-[10px] font-bold">✓</span>
                      <span className="font-medium">Full-Stack App Production Launch</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-[#00D2B4] text-[#0F1B3D] flex items-center justify-center text-[10px] font-bold">✓</span>
                      <span className="font-medium">100% Money-Back Guarantee</span>
                    </li>
                  </ul>
                </div>

                <div className="mb-4">
                  <Barcode digits="160002500008" />
                  <div className="font-mono text-[10px] text-[#0F1B3D]/40 mt-1 tracking-wider">
                    160002500008-TQLAB-VERIFIED
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Link
                  href="#contact"
                  className="tactile-btn-signal w-full py-2.5 text-center font-semibold block text-sm tracking-wide bg-[#FF3D88] text-white hover:bg-[#E62E76]"
                >
                  Enrol In 8-Week Cohort →
                </Link>
                <Link
                  href="#contact"
                  className="tactile-btn w-full py-2 text-center font-medium block text-xs bg-[#F4F6FB] tracking-wide text-[#0F1B3D]"
                >
                  Schedule Founder Call ↗
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
