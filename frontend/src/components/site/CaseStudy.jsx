import React from "react";
import { motion } from "framer-motion";
import { ArrowDownRight, FlaskConical } from "lucide-react";

const METRICS = [
  { label: "Condenser backpressure", before: "92 mbar", after: "71 mbar", delta: "-23%" },
  { label: "Terminal temperature difference", before: "6.4 °C", after: "3.0 °C", delta: "-53%" },
  { label: "Heat rate deviation", before: "+4.8%", after: "+1.2%", delta: "-3.6 pts" },
  { label: "Tube cleaning downtime", before: "18 days / yr", after: "0 days / yr", delta: "-100%" },
];

export default function CaseStudy() {
  return (
    <section
      id="case-study"
      data-testid="case-study-section"
      className="relative bg-[#F2F1ED] text-[#1F1F22] border-t border-[#D9D6CE]"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-14 lg:py-20 grid lg:grid-cols-12 gap-12">
        <motion.div
          className="lg:col-span-5"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="overline mb-4">06 / Case Study</div>
          <h2 className="font-display font-black tracking-[-0.03em] text-4xl lg:text-5xl leading-[1.02]">
            Cleaner tubes. <br />
            <span className="text-[#B45309]">Measurable megawatts.</span>
          </h2>
          <p className="mt-6 text-[#6B6E6C] leading-relaxed max-w-md">
            A representative 210 MW coal-fired thermal unit running VOCCSYS
            <sup className="text-[11px] align-super text-[#B45309]">®</sup> continuous
            condenser cleaning — measured at the condenser, not the lab.
          </p>

          <div className="mt-8 border border-[#D9D6CE] bg-white p-6">
            <div className="flex items-start gap-4">
              <div className="v-icon-box w-10 h-10 flex items-center justify-center shrink-0">
                <FlaskConical size={16} strokeWidth={1.5} className="text-[#B45309]" />
              </div>
              <div>
                <div className="overline">Illustrative example</div>
                <p className="mt-2 text-sm text-[#3D3F3E] leading-relaxed">
                  210 MW thermal unit · ~22,000 condenser tubes · once-through river water ·
                  figures representative of typical VOCCSYS installations over a 12-month window.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-xs text-[#8A8A80] max-w-md leading-relaxed">
            Shown as an illustrative example. Client-specific references and verified
            performance data available on request.
          </p>
        </motion.div>

        <motion.div
          className="lg:col-span-7"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        >
          <div className="border border-[#D9D6CE] bg-white">
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-6 px-6 lg:px-8 py-4 border-b border-[#D9D6CE] text-xs font-mono uppercase tracking-widest text-[#6B6E6C]">
              <span>Metric</span>
              <span className="text-right">Before</span>
              <span className="text-right">With VOCCSYS</span>
              <span className="text-right">Δ</span>
            </div>
            {METRICS.map((m, i) => (
              <div
                key={m.label}
                data-testid={`case-metric-${i}`}
                className="grid grid-cols-[1fr_auto_auto_auto] gap-x-6 items-center px-6 lg:px-8 py-5 border-b border-[#D9D6CE] last:border-b-0 hover:bg-[#F2F1ED]/60 transition-colors"
              >
                <span className="font-display font-bold text-sm lg:text-base text-[#1F1F22]">
                  {m.label}
                </span>
                <span className="text-right font-mono text-sm text-[#8A8A80] line-through decoration-[#D9D6CE]">
                  {m.before}
                </span>
                <span className="text-right font-mono text-sm lg:text-base font-bold text-[#1F1F22]">
                  {m.after}
                </span>
                <span className="inline-flex items-center gap-1 justify-end font-mono text-xs text-[#B45309]">
                  <ArrowDownRight size={12} strokeWidth={2} />
                  {m.delta}
                </span>
              </div>
            ))}
            <div className="px-6 lg:px-8 py-6 bg-[#1F1F22] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="overline !text-[#8A8A80]">Net effect</div>
                <div className="mt-1 font-display font-black text-2xl lg:text-3xl text-white tracking-[-0.02em]">
                  +4.1 MW <span className="text-[#B45309]">recovered output</span>
                </div>
              </div>
              <div className="text-right">
                <div className="overline !text-[#8A8A80]">Simple payback</div>
                <div className="mt-1 font-display font-black text-2xl lg:text-3xl text-white tracking-[-0.02em]">
                  5.4 <span className="text-[#B45309]">months</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
