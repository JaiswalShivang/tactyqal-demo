"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";

export default function ContactSection() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText("tactyqal.labs@gmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section
      id="contact"
      className="py-16 md:py-22 px-4 bg-sand border-y border-ink"
      aria-label="Contact and consultation booking"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="№ 09 / 09 · CONTACT & BOOKING"
          title="Book Your Free Founder Consultation"
          accent="Founder Consultation"
          description="Schedule a 1:1 strategy session with our founder Partha Chakraborty or reach our admissions desk directly."
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5 ticket-card bg-ivory p-6 sm:p-8 flex flex-col justify-between shadow-tactile border-[1.5px] border-ink">
            <div>
              <div className="font-mono text-xs text-signal font-bold uppercase tracking-wider mb-2 stamp-text">
                DIRECT ADMISSIONS DESK
              </div>

              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-ink tracking-tight mb-3">
                Ready to Start Your Teen&apos;s Success Story?
              </h3>

              <p className="text-sm text-ink/75 leading-relaxed mb-6">
                Reach out to our dedicated team for any inquiries, cohort schedules, curriculum breakdowns, or fee assistance.
              </p>

              <div className="space-y-4 mb-6">
                <div className="border border-ink bg-paper p-4 shadow-tactile-sm">
                  <div className="font-mono text-[11px] text-ink/50 uppercase tracking-wider mb-1">
                    Direct Email
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <a
                      href="mailto:tactyqal.labs@gmail.com"
                      className="font-mono text-sm font-bold text-ink hover:text-signal transition-colors break-all"
                    >
                      tactyqal.labs@gmail.com
                    </a>
                    <button
                      onClick={handleCopyEmail}
                      className="font-mono text-[11px] px-2.5 py-1 border border-ink bg-ivory hover:bg-volt transition-colors flex-shrink-0 cursor-pointer font-semibold"
                      aria-label="Copy email"
                    >
                      {copied ? "COPIED ✓" : "COPY"}
                    </button>
                  </div>
                </div>

                <div className="border border-ink bg-paper p-4 shadow-tactile-sm">
                  <div className="font-mono text-[11px] text-ink/50 uppercase tracking-wider mb-1">
                    Phone / WhatsApp Hotline
                  </div>
                  <a
                    href="tel:+919804772106"
                    className="font-mono text-sm font-bold text-ink hover:text-signal transition-colors block"
                  >
                    +91-98047-72106
                  </a>
                </div>

                <div className="border border-ink bg-paper p-4 shadow-tactile-sm">
                  <div className="font-mono text-[11px] text-ink/50 uppercase tracking-wider mb-1">
                    Admissions Hours
                  </div>
                  <div className="font-mono text-sm font-medium text-ink">
                    Monday – Saturday · 9:00 AM – 7:00 PM IST
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-ink/15 flex items-center justify-between font-mono text-xs">
              <span className="text-ink/60">Response Guarantee:</span>
              <span className="pill pill-volt text-[11px] font-bold">Within 24 Hours</span>
            </div>
          </div>

          <div className="md:col-span-7 border-[1.5px] border-ink bg-white shadow-tactile overflow-hidden">
            <div className="bg-[#121316] text-white px-4 py-2.5 flex items-center justify-between font-mono text-xs border-b border-ink">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-signal animate-pulse" />
                <span className="font-bold tracking-wider">
                  PARTHA CHAKRABORTY (15-MIN GOOGLE MEET)
                </span>
              </div>
              <span className="text-paper/60 uppercase text-[10px] hidden sm:inline">
                LIVE CALENDAR SYNC
              </span>
            </div>

            <div className="relative w-full h-[580px] bg-white">
              <iframe
                src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ3JlaCrNitoPs8Bdr-FUP0cRfFI-MopSIH2azaPNDpRk56h6drYLbXSh-mDc9sfEZAQUKGdsUXs?gv=true"
                className="w-full h-full border-0"
                title="Schedule 15-Minute Consultation with Partha Chakraborty"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
