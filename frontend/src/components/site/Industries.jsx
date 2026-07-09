import React from "react";
import { motion } from "framer-motion";
import { Zap, Snowflake, Factory, FlaskConical, Wheat, Cog } from "lucide-react";

const INDUSTRIES = [
  { icon: Zap, t: "Thermal & Nuclear Power", d: "Main and auxiliary condensers, closed-cycle cooling.", tag: "500 MW+" },
  { icon: Snowflake, t: "HVAC & District Cooling", d: "Large chiller condensers in commercial and campus deployments.", tag: "5000+ TR" },
  { icon: FlaskConical, t: "Petrochemical & Refining", d: "Overhead condensers and heat exchangers in critical service.", tag: "24×7" },
  { icon: Factory, t: "Steel & Metals", d: "Blast furnace, rolling mill and continuous casting cooling.", tag: "Retrofit" },
  { icon: Wheat, t: "Sugar & Paper", d: "Vapour condensers and process heat exchangers.", tag: "Seasonal" },
  { icon: Cog, t: "Chemical & Fertilizer", d: "Process condensers with challenging water chemistry.", tag: "Corrosive" },
];

export default function Industries() {
  return (
    <section id="industries" data-testid="industries-section" className="relative bg-[#F2F1ED] text-[#1F1F22]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <div className="grid lg:grid-cols-12 gap-6 items-end mb-14">
          <div className="lg:col-span-6">
            <div className="overline mb-4">05 / Industries Served</div>
            <h2 className="font-display font-black tracking-[-0.03em] text-4xl lg:text-5xl text-[#1F1F22] leading-[1.02]">
              Wherever tubes foul, <br />
              <span className="text-[#C85A17]">VOCCSYS pays back.</span>
            </h2>
          </div>
          <div className="lg:col-span-6">
            <p className="text-[#6B6E6C] max-w-xl">
              Deployed across some of the toughest industrial cooling loops in India and abroad.
              Every install is engineered to the site&apos;s water chemistry &amp; tube bundle.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {INDUSTRIES.map((it, i) => {
            const Icon = it.icon;
            return (
              <motion.div
                key={it.t}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: i * 0.04 }}
                data-testid={`industry-${i}`}
                className="v-card p-7 flex flex-col"
              >
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 border border-[#D9D6CE] flex items-center justify-center">
                    <Icon size={20} strokeWidth={1.5} className="text-[#C85A17]" />
                  </div>
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#C85A17] border border-[#C85A17]/30 px-2 py-1">
                    {it.tag}
                  </span>
                </div>
                <h3 className="mt-6 font-display font-bold text-xl text-[#1F1F22]">{it.t}</h3>
                <p className="mt-2 text-sm text-[#6B6E6C] leading-relaxed flex-1">{it.d}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
      <div className="rule" />
    </section>
  );
}
