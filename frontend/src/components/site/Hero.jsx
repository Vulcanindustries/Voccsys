import React from "react";
import { ArrowRight, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";

const HERO_IMG =
  "https://images.unsplash.com/photo-1700607101915-99650c815caf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTF8MHwxfHNlYXJjaHwzfHxwb3dlciUyMHBsYW50JTIwY29vbGluZyUyMHRvd2VyJTIwaW5kdXN0cmlhbHxlbnwwfHx8fDE3ODM1NDYwMjJ8MA&ixlib=rb-4.1.0&q=85";

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

export default function Hero() {
  return (
    <section id="top" data-testid="hero-section" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img src={HERO_IMG} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#121216]/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#121216]/40 via-transparent to-[#121216]" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-24 pb-32 lg:pt-32 lg:pb-40">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-8"
            >
              <span className="w-8 h-[1px] bg-[#500000]" />
              <span className="overline text-[#500000]">
                Patented · Online Cleaning · Zero Shutdown
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              data-testid="hero-headline"
              className="font-display font-black tracking-[-0.045em] text-white leading-[0.95] text-5xl sm:text-6xl lg:text-[86px]"
            >
              Clean condensers <br className="hidden sm:block" />
              <span className="text-[#500000]">while the plant runs.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mt-8 text-lg lg:text-xl text-[#E5E5EA] max-w-2xl leading-relaxed"
            >
              VOCCSYS is Vulcan Industries&apos; online condenser tube cleaning system — an
              engineered ball-circulation loop that scrubs scale &amp; biofilm continuously,
              restoring heat rate without a single minute of downtime.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <button
                onClick={() => scrollTo("contact")}
                data-testid="hero-cta-demo"
                className="v-btn-primary"
              >
                Request On-Site Demo <ArrowRight size={18} />
              </button>
              <button
                onClick={() => scrollTo("process")}
                data-testid="hero-cta-process"
                className="v-btn-secondary"
              >
                <PlayCircle size={18} /> See the Process
              </button>
            </motion.div>

            <div className="mt-14 grid grid-cols-3 gap-6 max-w-2xl">
              {[
                { k: "0", u: "hrs", l: "Shutdown required" },
                { k: "1–3%", u: "", l: "Heat rate recovery" },
                { k: "<12", u: "mo", l: "Typical payback" },
              ].map((s, i) => (
                <div key={i} className="border-t border-[#2E2E38] pt-4" data-testid={`hero-stat-${i}`}>
                  <div className="font-display font-black text-3xl lg:text-4xl text-white leading-none">
                    {s.k}
                    <span className="text-[#500000] text-xl align-top ml-1">{s.u}</span>
                  </div>
                  <div className="mt-2 text-xs uppercase tracking-[0.18em] text-[#A0A0AC]">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 hidden lg:flex flex-col justify-end">
            <div className="border border-[#2E2E38] bg-[#1A1A1F]/70 backdrop-blur p-6">
              <div className="overline mb-3">System Snapshot</div>
              <ul className="tick-list space-y-3 text-sm text-[#E5E5EA]">
                <li>Continuous sponge-ball loop through condenser tubes</li>
                <li>Ball collector + strainer with auto-reinjection</li>
                <li>PLC control + real-time differential pressure monitoring</li>
                <li>Compatible with 18 – 32 mm tube ID configurations</li>
              </ul>
              <div className="dashed-divider my-5" />
              <div className="flex items-center justify-between text-xs text-[#A0A0AC]">
                <span>Model</span>
                <span className="font-mono text-white">VCS-Series 500 / 1000 / 2000</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rule" />
    </section>
  );
}
