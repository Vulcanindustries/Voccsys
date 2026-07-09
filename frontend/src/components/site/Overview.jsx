import React from "react";
import { motion } from "framer-motion";

export default function Overview() {
  return (
    <section id="overview" data-testid="overview-section" className="relative bg-[#121216] text-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-24 lg:py-32 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <div className="overline mb-4">01 / The System</div>
          <h2 className="font-display font-black tracking-[-0.03em] text-4xl lg:text-5xl text-white leading-[1.02]">
            Fouling is silent. <br />
            <span className="text-[#500000]">So is our fix.</span>
          </h2>
        </div>
        <div className="lg:col-span-8">
          <p className="text-lg text-[#E5E5EA] leading-relaxed">
            In every condenser, thin layers of scale, algae and biofilm form on the inner tube walls.
            You can&apos;t see it — but you pay for it. Every micron of fouling degrades heat
            transfer, silently forcing higher back-pressure, higher fuel burn and quiet losses that
            add up to crores of rupees each year.
          </p>
          <p className="mt-6 text-lg text-[#E5E5EA] leading-relaxed">
            VOCCSYS eliminates it — continuously, mechanically, and without ever stopping your
            plant. Cleaning sponge balls circulate through every tube on every pass, scrubbing
            surfaces back to a mirror finish and keeping them there.
          </p>

          <div className="mt-10 grid sm:grid-cols-3 gap-4">
            {[
              { t: "Continuous", d: "Runs 24×7 with your condenser — no offline windows." },
              { t: "Mechanical", d: "No chemicals, no additives, no environmental risk." },
              { t: "Proven", d: "Deployed across power, HVAC, refining and steel plants." },
            ].map((f, i) => (
              <motion.div
                key={f.t}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                data-testid={`overview-pillar-${i}`}
                className="border border-[#2E2E38] p-6 bg-[#1A1A1F]"
              >
                <div className="font-display font-bold text-xl text-white">{f.t}</div>
                <div className="dashed-divider my-3" />
                <p className="text-sm text-[#A0A0AC] leading-relaxed">{f.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <div className="rule" />
    </section>
  );
}
