import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowDownRight, FlaskConical } from "lucide-react";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";

const METRICS = [
  { label: "Condenser backpressure", before: "92 mbar", after: "71 mbar", delta: "-23%" },
  { label: "Terminal temperature difference", before: "6.4 °C", after: "3.0 °C", delta: "-53%" },
  { label: "Heat rate deviation", before: "+4.8%", after: "+1.2%", delta: "-3.6 pts" },
  { label: "Tube cleaning downtime", before: "18 days / yr", after: "0 days / yr", delta: "-100%" },
];

export default function CaseStudy() {
  useEffect(() => {
    document.title = "Case Study — VOCCSYS by Vulcan Industries India";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div data-testid="case-study-page" className="relative z-10 bg-[#F2F1ED] min-h-screen">
      <Header />
      <main>
        <section className="relative bg-[#F2F1ED] text-[#1F1F22]">
          <div className="max-w-[1100px] mx-auto px-6 lg:px-10 py-10 lg:py-14">
            <Link
              to="/"
              data-testid="back-to-home"
              className="inline-flex items-center gap-2 text-sm text-[#6B6E6C] hover:text-[#B45309] transition-colors mb-8"
            >
              <ArrowLeft size={14} /> Back to voccsys.com
            </Link>

            <span className="overline">Results · Case Study</span>

            <h1 className="mt-4 font-display font-black tracking-[-0.03em] text-4xl lg:text-5xl text-[#1F1F22] leading-[1.02]">
              Cleaner tubes. <br />
              <span className="text-[#B45309]">Measurable megawatts.</span>
            </h1>

            <p className="mt-5 text-[#3D3F3E] text-base leading-relaxed max-w-2xl">
              A representative 210 MW coal-fired thermal unit running VOCCSYS
              <sup className="text-[11px] align-super text-[#B45309]">®</sup> continuous
              condenser cleaning — measured at the condenser, not the lab.
            </p>

            <div className="dashed-divider my-10" />

            {/* Installation context */}
            <div className="border border-[#D9D6CE] bg-white p-6 lg:p-8 mb-10">
              <div className="flex items-start gap-4">
                <div className="v-icon-box w-10 h-10 flex items-center justify-center shrink-0">
                  <FlaskConical size={16} strokeWidth={1.5} className="text-[#B45309]" />
                </div>
                <div>
                  <div className="overline">Illustrative example</div>
                  <p className="mt-2 text-sm text-[#3D3F3E] leading-relaxed max-w-2xl">
                    210 MW thermal unit · ~22,000 condenser tubes · once-through river water ·
                    figures representative of typical VOCCSYS installations over a 12-month
                    window. Shown as an illustrative example — client-specific references and
                    verified performance data available on request.
                  </p>
                </div>
              </div>
            </div>

            {/* Before / after table */}
            <div className="border border-[#D9D6CE] bg-white" data-testid="case-study-table">
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
                <div className="sm:text-right">
                  <div className="overline !text-[#8A8A80]">Simple payback</div>
                  <div className="mt-1 font-display font-black text-2xl lg:text-3xl text-white tracking-[-0.02em]">
                    5.4 <span className="text-[#B45309]">months</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-10 border border-[#D9D6CE] bg-white p-8 lg:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="overline mb-2">Your plant next?</div>
                <h3 className="font-display font-bold text-xl lg:text-2xl text-[#1F1F22]">
                  Send us your condenser data — we&apos;ll project your numbers.
                </h3>
              </div>
              <Link to="/#contact" data-testid="case-study-cta-contact" className="v-btn-primary">
                Request a proposal →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
