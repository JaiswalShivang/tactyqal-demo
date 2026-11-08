"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";

const DATES = [
  { day: "Mon", date: "10", month: "Nov", full: "Monday, Nov 10" },
  { day: "Tue", date: "11", month: "Nov", full: "Tuesday, Nov 11" },
  { day: "Wed", date: "12", month: "Nov", full: "Wednesday, Nov 12" },
  { day: "Thu", date: "13", month: "Nov", full: "Thursday, Nov 13" },
  { day: "Fri", date: "14", month: "Nov", full: "Friday, Nov 14" },
  { day: "Sat", date: "15", month: "Nov", full: "Saturday, Nov 15" },
];

const TIME_SLOTS = [
  "10:00 AM",
  "11:30 AM",
  "02:00 PM",
  "04:30 PM",
  "06:00 PM",
];

const OFFICIAL_GCAL_URL =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ3JlaCrNitoPs8Bdr-FUP0cRfFI-MopSIH2azaPNDpRk56h6drYLbXSh-mDc9sfEZAQUKGdsUXs?gv=true";

export default function ContactSection() {
  const [copied, setCopied] = useState(false);
  const [selectedDate, setSelectedDate] = useState(DATES[0]);
  const [selectedSlot, setSelectedSlot] = useState("11:30 AM");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isBooked, setIsBooked] = useState(false);

  const handleCopyEmail = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText("tactyqal.labs@gmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setIsBooked(true);
  };

  return (
    <section
      id="contact"
      className="py-16 md:py-22 px-4 bg-sand border-y border-ink"
      aria-label="Contact and consultation booking"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="Book Your Free Founder Consultation"
          accent="Founder Consultation"
          description="Schedule a 1:1 strategy session with our founder Partha Chakraborty or reach our admissions desk directly."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-5 ticket-card bg-ivory p-6 sm:p-8 flex flex-col justify-between shadow-tactile border-[1.5px] border-ink h-full">
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

          <div className="lg:col-span-7 border-[1.5px] border-[#0F1B3D] bg-white shadow-[6px_6px_0px_0px_#0F1B3D] flex flex-col justify-between h-full overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 flex-1">
              <div className="md:col-span-5 p-6 border-b md:border-b-0 md:border-r border-ink/15 bg-sand/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-full bg-signal text-white font-display font-extrabold flex items-center justify-center text-base border-2 border-ink shadow-tactile-sm">
                      PC
                    </div>
                    <div>
                      <div className="font-display font-bold text-base text-ink">
                        Partha Chakraborty
                      </div>
                      <div className="font-mono text-xs text-ink/60">
                        Founder @ Tactyqal Labs
                      </div>
                    </div>
                  </div>

                  <h4 className="font-display font-extrabold text-xl text-ink tracking-tight mb-3">
                    Book a 15-Minute Call
                  </h4>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 font-mono text-xs text-ink/80">
                      <span>🕒</span>
                      <span>15 min appointment</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs text-ink/80">
                      <span>📹</span>
                      <span>Google Meet details on booking</span>
                    </div>
                  </div>

                  <p className="text-xs text-ink/70 leading-relaxed">
                    Get on a 15-minute 1:1 call to understand how we&apos;ll help your teen over the next 8 weeks come up with a unique startup idea and convert it into a deployed full-stack software app.
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-ink/15">
                  <a
                    href={OFFICIAL_GCAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tactile-btn text-xs py-2 w-full text-center font-mono block bg-white"
                  >
                    Open Official Google Calendar ↗
                  </a>
                </div>
              </div>

              <div className="md:col-span-7 p-6 flex flex-col justify-between bg-white">
                {!isBooked ? (
                  <form onSubmit={handleBooking} className="flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center justify-between mb-3 font-mono text-xs text-ink/60">
                        <span className="font-bold text-ink uppercase tracking-wider">
                          Select Day (Nov 2026):
                        </span>
                        <span>IST (GMT+05:30)</span>
                      </div>

                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-5">
                        {DATES.map((item) => (
                          <button
                            key={item.date}
                            type="button"
                            onClick={() => setSelectedDate(item)}
                            className={`p-2 text-center border transition-all cursor-pointer ${
                              selectedDate.date === item.date
                                ? "bg-signal text-white border-signal font-bold shadow-tactile-sm"
                                : "border-ink/20 bg-sand/30 hover:border-ink text-ink"
                            }`}
                          >
                            <div className="font-mono text-[10px] uppercase opacity-75">
                              {item.day}
                            </div>
                            <div className="font-display font-extrabold text-base">
                              {item.date}
                            </div>
                          </button>
                        ))}
                      </div>

                      <div className="font-mono text-xs font-bold text-ink uppercase tracking-wider mb-2">
                        Available Times ({selectedDate.full}):
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5">
                        {TIME_SLOTS.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedSlot(slot)}
                            className={`py-2 px-2.5 text-center font-mono text-xs border transition-all cursor-pointer ${
                              selectedSlot === slot
                                ? "bg-ink text-volt border-ink font-bold shadow-tactile-sm"
                                : "border-ink/25 bg-white hover:border-ink text-ink/90"
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>

                      <div className="space-y-3 pt-3 border-t border-ink/15">
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your Name / Parent's Name"
                          className="w-full text-xs font-sans p-2.5 border border-ink bg-sand/20 focus:bg-white focus:outline-none focus:border-signal"
                        />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Your Email (for Google Meet invite)"
                          className="w-full text-xs font-sans p-2.5 border border-ink bg-sand/20 focus:bg-white focus:outline-none focus:border-signal"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="tactile-btn-signal w-full py-3 mt-4 text-xs font-bold font-mono uppercase tracking-wider text-center"
                    >
                      Confirm Free 15-Min Strategy Session →
                    </button>
                  </form>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-6 h-full my-auto">
                    <div className="w-14 h-14 rounded-full bg-emerald text-white flex items-center justify-center text-2xl font-bold mb-4 shadow-tactile-sm">
                      ✓
                    </div>
                    <div className="font-mono text-xs text-signal font-bold uppercase tracking-wider mb-1">
                      SESSION RESERVED
                    </div>
                    <h4 className="font-display font-extrabold text-2xl text-ink tracking-tight mb-2">
                      You&apos;re Scheduled with Partha!
                    </h4>
                    <p className="font-mono text-xs text-ink/80 mb-2">
                      {selectedDate.full} · {selectedSlot} IST
                    </p>
                    <p className="text-xs text-ink/70 max-w-sm mb-6 leading-relaxed">
                      We have sent the Google Meet conference invite to <strong className="text-ink">{email}</strong>. Please check your inbox.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsBooked(false);
                        setName("");
                        setEmail("");
                      }}
                      className="tactile-btn text-xs px-5 py-2 font-mono"
                    >
                      Schedule Another Slot
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
