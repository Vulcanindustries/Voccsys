import React from "react";
import { motion } from "framer-motion";
import { TrendingDown, Gauge, Timer, Leaf, Wrench, ShieldCheck } from "lucide-react";

const METRICS = [
  { n: "1–3%", label: "Heat rate improvement", sub: "Continuous, measurable at the turbine." },
  { n: "6–12", suffix: "mo", label: "Typical payback period", sub: "Across most large condensers." },
  { n: "40–60%", label: "Reduction in fouling losses", sub: "Vs. offline mechanical cleaning cycles." },
  { n: "24/7", label: "Uninterrupted operation", sub: "Zero shutdown, zero production loss." },
];

const BENEFITS = [
  {
    icon: TrendingDown,
    t: "Lower fuel & auxiliary power",
    d: "A cleaner condenser drops back-pressure — every percentage point of vacuum recovered translates directly to fuel savings.",
  },
  {
    icon: Gauge,
    t: "Stable heat rate",
    d: "No more sawtooth degradation between shutdowns. Performance stays flat at design conditions.",
  },
  {
    icon: Timer,
    t: "No production loss",
    d: "Cleaning happens with the plant running. Skip the offline cleaning windows entirely.",
  },
  {
    icon: Leaf,
    t: "Zero chemicals",
    d: "Fully mechanical scrubbing. No biocides, no acids, no environmental discharge concerns.",
  },
  {
    icon: Wrench,
    t: "Extends tube life",
    d: "Prevents pitting, under-deposit corrosion and biofouling — protecting your capital equipment.",
  },
  {
    icon: ShieldCheck,
    t: "Retrofit-ready",
    d: "Designed to be installed on existing condensers with minimal piping modifications.",
  },
];

export default function Benefits() {
  return (
    <section id="benefits" data-testid="benefits-section" className="relative bg-[#121216] text-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <div className="grid lg:grid-cols-12 gap-6 items-end mb-14">
          <div className="lg:col-span-6">
            <div className="overline mb-4">03 / ROI &amp; Benefits</div>
            <h2 className="font-display font-black tracking-[-0.03em] text-4xl lg:text-5xl text-white leading-[1.02]">
              Numbers that survive the finance meeting.
            </h2>
          </div>
          <div className="lg:col-span-6">
            <p className="text-[#A0A0AC] max-w-xl">
              The value of VOCCSYS is neither theoretical nor marginal — it is measurable at the
              main condenser vacuum, at the turbine heat rate, and on your fuel invoice.
            </p>
          </div>
        </div>

        {/* Metric grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 border border-[#2E2E38]">
          {METRICS.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              data-testid={`metric-${i}`}
              className={`p-8 bg-[#1A1A1F] border-[#2E2E38] ${i % 2 === 0 ? "sm:border-r" : ""} lg:border-r ${i === 3 ? "lg:border-r-0" : ""} border-b sm:border-b ${i >= 2 ? "sm:border-b-0" : ""} lg:border-b-0`}
            >
              <div className="font-display font-black text-5xl lg:text-6xl text-white leading-none tracking-[-0.04em]">
                {m.n}
                {m.suffix && <span className="text-[#500000] text-2xl align-top ml-1">{m.suffix}</span>}
              </div>
              <div className="dashed-divider my-4" />
              <div className="text-sm font-medium text-white">{m.label}</div>
              <div className="mt-1 text-xs text-[#A0A0AC]">{m.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Benefit cards */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BENEFITS.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.t}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                data-testid={`benefit-${i}`}
                className="v-card p-7"
              >
                <div className="w-11 h-11 border border-[#2E2E38] flex items-center justify-center">
                  <Icon size={20} strokeWidth={1.5} className="text-[#500000]" />
                </div>
                <h3 className="mt-6 font-display font-bold text-xl text-white">{b.t}</h3>
                <p className="mt-2 text-sm text-[#A0A0AC] leading-relaxed">{b.d}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
      <div className="rule" />
    </section>
  );
}
