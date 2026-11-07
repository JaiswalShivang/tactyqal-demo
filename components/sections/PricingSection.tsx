"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";

export default function PricingSection() {
  const prefersReduced = useReducedMotion();

  const INCLUDES = [
    "8 weeks of dedicated 1:1 live mentoring with founders",
    "Full-stack software application built and deployed live",
    "Product Hunt launch campaign and media prep",
    "Professional investor pitch deck and story architecture",
    "Direct customer acquisition and monetization strategy",
    "Lifetime alumni network and founder mentorship access",
  ];

  return (
    <section
      id="pricing"
      className="py-16 md:py-22 px-4 bg-ink text-paper border-y border-ink"
      aria-label="Pricing and enrollment"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="№ 07 / 08 · INVESTMENT"
          title="The Builder's Vault"
          accent="Vault"
          accentColor="signal"
          description="Transparent, all-inclusive tuition for the complete 8-week 1:1 cohort. Results guaranteed or 100% refunded."
          dark={true}
        />

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <motion.div
            className="lg:col-span-7 ticket-card bg-paper text-ink border-2 border-signal shadow-tactile p-6 sm:p-8"
            initial={prefersReduced ? {} : { x: -20, opacity: 0 }}
            whileInView={prefersReduced ? {} : { x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="ticket-notch ticket-notch-left" style={{ backgroundColor: "#121316" }} />
            <div className="ticket-notch ticket-notch-right" style={{ backgroundColor: "#121316" }} />

            <div>
              <div className="flex items-center justify-between border-b border-ink/15 pb-4 mb-6">
                <div>
                  <div className="font-mono text-xs text-ink/50 stamp-text mb-1">
                    ADMISSION TICKET · FULL COHORT ACCESS
                  </div>
                  <div className="font-display text-2xl font-bold tracking-tight">
                    8-WEEK ACCELERATOR PASS
                  </div>
                </div>
                <span className="pill pill-volt text-xs font-semibold">
                  15 SPOTS ONLY
                </span>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs text-signal font-bold tracking-wider uppercase">
                    LIMITED TIME TUITION:
                  </span>
                </div>
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="font-mono text-2xl line-through text-ink/40">
                    ₹25,000
                  </span>
                  <span className="font-display text-5xl sm:text-6xl font-extrabold text-signal tracking-tight leading-none">
                    ₹16,000
                  </span>
                </div>
                <div className="font-mono text-xs text-ink/50 stamp-text">
                  ONE-TIME INVESTMENT · ZERO HIDDEN FEES · TAXES INCLUDED
                </div>
              </div>

              <div className="border-t border-dashed border-ink/30 my-6" />

              <div className="mb-8">
                <div className="font-mono text-xs text-ink/60 uppercase tracking-wider mb-4 font-bold">
                  What Every Builder Receives:
                </div>
                <ul className="space-y-3 text-sm">
                  {INCLUDES.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-none bg-emerald text-white flex items-center justify-center text-xs flex-shrink-0 font-bold mt-0.5">
                        ✓
                      </span>
                      <span className="text-ink/85 leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3 pt-2 border-t border-ink/15">
                <Link
                  href="#contact"
                  className="tactile-btn-signal w-full py-4 text-center font-bold block text-sm tracking-wide"
                >
                  Book Free 1:1 Consultation Call →
                </Link>
                <div className="font-mono text-[11px] text-ink/50 text-center">
                  Consultation includes a 20-minute startup ideation review with founders.
                </div>
              </div>
            </div>
          </motion.div>

          <div className="lg:col-span-5 space-y-6">
            <div className="border border-paper/20 bg-[#1C1E22] p-6 text-paper">
              <div className="font-mono text-xs text-signal uppercase tracking-wider font-bold mb-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-signal rounded-full" />
                OUR COMMITMENT
              </div>
              <h3 className="font-display font-bold text-xl tracking-tight mb-2 text-paper">
                100% Results Guaranteed
              </h3>
              <p className="text-sm text-paper/75 leading-relaxed">
                If your child attends all sessions, completes the milestone sprints, and does not have a live, working application launched by Week 8, we refund 100% of your tuition without hesitation.
              </p>
            </div>

            <div className="border border-paper/20 bg-[#1C1E22] p-6 text-paper">
              <div className="font-mono text-xs text-paper/50 uppercase tracking-wider font-bold mb-3">
                AFTER APPLICATION
              </div>
              <ol className="space-y-3 text-xs text-paper/80 font-mono">
                <li className="flex gap-2">
                  <span className="text-signal font-bold">01.</span>
                  <span>Founder fit consultation (20 minutes).</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-signal font-bold">02.</span>
                  <span>Domain & interest diagnostic mapping.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-signal font-bold">03.</span>
                  <span>Mentor pairing & onboarding kit sent.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-signal font-bold">04.</span>
                  <span>Week 1 kick-off live 1:1 session begins.</span>
                </li>
              </ol>
            </div>

            <div className="border border-paper/20 bg-sand text-ink p-6">
              <div className="font-mono text-xs text-ink/50 uppercase tracking-wider mb-2 font-bold">
                PAYMENT FLEXIBILITY
              </div>
              <p className="text-sm text-ink/80 leading-relaxed">
                We accept UPI, Net Banking, and all major Indian & International credit cards via secure payment gateway.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
