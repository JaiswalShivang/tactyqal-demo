"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function PricingSection() {
  const prefersReduced = useReducedMotion();

  const INCLUDES = [
    "8 weeks of 1:1 mentoring",
    "Full-stack app development",
    "Product Hunt launch",
    "Pitch deck creation",
    "Marketing strategy",
    "Ongoing support",
  ];

  return (
    <section
      id="pricing"
      className="py-24 px-4 bg-ink text-white border-y border-ink"
      aria-label="Pricing"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="font-mono text-xs text-white/40 mb-3 stamp-text">
            № 07 / 08 · INVESTMENT
          </div>
          <h2 className="headline-display text-white mb-4">
            The <span className="bg-volt text-ink px-2">Builder&apos;s</span> Vault
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <motion.div
            className="ticket-card bg-paper text-ink border border-volt"
            style={{ boxShadow: "4px 4px 0 #D2FF28" }}
            initial={prefersReduced ? {} : { x: -30, opacity: 0 }}
            whileInView={prefersReduced ? {} : { x: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="ticket-notch ticket-notch-left" style={{ backgroundColor: "#121316" }} />
            <div className="ticket-notch ticket-notch-right" style={{ backgroundColor: "#121316" }} />

            <div className="p-8">
              <div className="font-mono text-xs text-ink/40 mb-4 stamp-text">
                ADMISSION TICKET · FULL COHORT ACCESS
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="font-mono text-2xl line-through text-ink/40">
                    ₹25,000
                  </span>
                  <span className="font-boomdang text-6xl font-bold text-signal leading-none">
                    ₹16,000
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="pill pill-volt text-xs">Limited Time Offer</span>
                  <span className="pill text-xs bg-signal text-white border-ink">Save ₹9,000</span>
                </div>
              </div>

              <div className="border-t border-dashed border-ink/30 my-6" />

              <ul className="space-y-3 mb-8">
                {INCLUDES.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <span className="w-5 h-5 bg-emerald flex items-center justify-center text-white text-xs flex-shrink-0">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="border-t border-dashed border-ink/30 mb-6" />

              <div className="bg-emerald text-white text-xs font-mono px-4 py-2 stamp-text text-center mb-6">
                RESULTS GUARANTEED OR MONEY BACK
              </div>

              <div className="font-mono text-xs text-ink/50 text-center stamp-text mb-6">
                ONLY 15 SPOTS AVAILABLE FOR THE MONTH
              </div>

              <a
                href="mailto:tactyqal.labs@gmail.com?subject=Book Free Consultation&body=Hi, I'd like to book a free consultation for the Tactyqal Labs 8-week program."
                className="tactile-btn-signal px-6 py-4 text-base font-bold text-center block"
              >
                Book Free Consultation
              </a>
            </div>
          </motion.div>

          <motion.div
            className="space-y-6"
            initial={prefersReduced ? {} : { x: 30, opacity: 0 }}
            whileInView={prefersReduced ? {} : { x: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="border border-white/20 p-6">
              <div className="font-mono text-xs text-white/40 mb-3 stamp-text">CONTACT</div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-white/40 w-16">EMAIL</span>
                  <a
                    href="mailto:tactyqal.labs@gmail.com"
                    className="font-mono text-sm hover:text-volt transition-colors"
                  >
                    tactyqal.labs@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-white/40 w-16">PHONE</span>
                  <a
                    href="tel:+919804772106"
                    className="font-mono text-sm hover:text-volt transition-colors"
                  >
                    +91-98047-72106
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-white/40 w-16">HOURS</span>
                  <span className="font-mono text-sm">Mon–Sat, 9am–7pm IST</span>
                </div>
                <div className="font-mono text-xs text-white/40 mt-2">
                  Response within 24 hours guaranteed.
                </div>
              </div>
            </div>

            <div className="border border-white/20 p-6">
              <div className="font-mono text-xs text-white/40 mb-3 stamp-text">PARTNER</div>
              <p className="text-sm text-white/70 mb-4">
                Learn coding by building apps with AI teachers — FREE
              </p>
              <a
                href="https://codesync.club"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-volt hover:underline"
              >
                codesync.club →
              </a>
            </div>

            <div className="border border-volt/40 p-6 bg-volt/10">
              <div className="font-boomdang text-xl font-bold mb-2">
                Still deciding?
              </div>
              <p className="text-sm text-white/70 mb-4">
                Book a free 30-minute call with our founder. No pressure, no pitch — just honest advice about whether this program is right for your teen.
              </p>
              <a
                href="mailto:tactyqal.labs@gmail.com?subject=Free Call Request"
                className="tactile-btn bg-volt text-ink border-volt px-4 py-2 text-sm font-bold inline-block"
                style={{ boxShadow: "4px 4px 0 #D2FF28" }}
              >
                Schedule Free Call
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

