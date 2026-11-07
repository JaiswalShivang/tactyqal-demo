"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

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
      className="py-24 px-4 bg-paper border-y border-ink"
      aria-label="Frequently asked questions"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <div className="section-number mb-3">№ 08 / 08 · QUESTIONS</div>
          <h2 className="headline-display">
            Everything You Want{" "}
            <span className="volt-highlight">To Know</span>
          </h2>
        </div>

        <div className="space-y-0" role="list">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="border border-ink border-b-0 last:border-b"
                role="listitem"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full text-left p-5 flex items-start justify-between gap-4 hover:bg-sand/50 transition-colors"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                  id={`faq-question-${i}`}
                >
                  <div className="flex items-start gap-4">
                    <span className="font-mono text-xs text-ink/40 stamp-text flex-shrink-0 mt-0.5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-semibold text-sm leading-snug">
                      {faq.q}
                    </span>
                  </div>
                  <motion.span
                    className="font-mono text-ink/40 flex-shrink-0 mt-0.5"
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={prefersReduced ? { duration: 0 } : { duration: 0.2 }}
                    aria-hidden="true"
                  >
                    →
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${i}`}
                      role="region"
                      aria-labelledby={`faq-question-${i}`}
                      initial={prefersReduced ? {} : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={prefersReduced ? {} : { height: 0, opacity: 0 }}
                      transition={{
                        height: { duration: 0.25 },
                        opacity: { duration: 0.2 },
                      }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="px-5 pb-5 pl-14 text-sm text-ink/70 leading-relaxed">
                        {faq.a}
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

