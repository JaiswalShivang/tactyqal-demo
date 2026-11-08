"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SectionHeader } from "@/components/SectionHeader";

const FAQS = [
  {
    q: "What if my teen has no coding experience?",
    a: "No coding experience is required—or expected. The program is specifically designed for beginners. We use modern no-code and AI tools, so your teen focuses on the entrepreneurial skills: ideation, design, customer discovery, and marketing. The tools handle the technical heavy lifting.",
  },
  {
    q: "How do you guarantee university admissions?",
    a: "We don't promise specific admission outcomes—no programme honestly can. What we do promise is a real, verifiable project your teen built, launched, and potentially monetised. Admissions offices value evidence of initiative and real-world impact. Tactyqal graduates stand out because their applications contain something most applicants can't claim: a live product and a startup story.",
  },
  {
    q: "What kind of apps do students typically build?",
    a: "Our students have built AI-powered apps, D2C subscription products, edtech tools, social impact platforms, and media companies—across AgriTech, Health, Commerce, and more. The only constraint is that the app must solve a real problem. We help each student find that problem in Week 1.",
  },
  {
    q: "How much time commitment is required?",
    a: "2–3 hours per week is the target commitment. This includes one 1-hour live 1:1 session per week plus independent work in between. It's structured to fit around school schedules, board exams, and extracurricular commitments.",
  },
  {
    q: "What is the success rate?",
    a: "100% of students who complete the programme launch a working, deployed app by the end of Week 8. Many go further: generating real revenue, attracting media coverage, or using their project as a university application cornerstone.",
  },
  {
    q: "Can my teen generate real revenue?",
    a: "Yes—and several already have. One Last Chapter generates ₹1,00,000/month. Elenor Vegan Handbags made ₹9,000 in its first week. We teach real monetisation strategy, not just how to build a product that looks impressive.",
  },
  {
    q: "What universities have your students gotten into?",
    a: "Our alumni have been admitted to universities in the United States, United Kingdom, and Ivy League institutions. We share anonymised case studies on request. The common thread: a strong, verifiable project portfolio built during the programme.",
  },
  {
    q: "What ongoing support do you provide?",
    a: "Support doesn't end at Week 8. All graduates join our alumni community, receive ongoing mentorship access, and can tap the Tactyqal network for introductions to investors, media contacts, and potential co-founders. We're invested in the long-term trajectory of every student who goes through the programme.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="faq"
      className="py-16 md:py-22 px-4 bg-paper border-y border-ink"
      aria-label="Frequently asked questions"
    >
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          eyebrow="09 / 09 · FREQUENTLY ASKED QUESTIONS"
          title="Everything You Want To Know"
          accent="To Know"
          description="Clear answers on time commitments, prerequisites, college admissions impact, and guarantees."
        />

        <div className="space-y-0" role="list">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="border border-ink border-b-0 last:border-b bg-ivory"
                role="listitem"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-sand/40 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                >
                  <span className="font-display font-bold text-base sm:text-lg text-ink leading-snug tracking-tight">
                    {faq.q}
                  </span>
                  <span
                    className={`font-mono text-lg font-bold flex-shrink-0 w-8 h-8 border border-ink flex items-center justify-center transition-transform ${
                      isOpen ? "bg-signal text-white rotate-45" : "bg-paper text-ink"
                    }`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${i}`}
                      initial={prefersReduced ? {} : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={prefersReduced ? {} : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 pb-5 px-6 border-t border-[#0F1B3D]/15 bg-[#F4F6FB]/80">
                        <div className="border-l-[3px] border-signal pl-4 py-1 text-sm leading-relaxed text-ink/85">
                          {faq.a}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
