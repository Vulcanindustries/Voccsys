import React from "react";

const SPEC_GROUPS = [
  {
    title: "Configuration",
    rows: [
      ["Model range", "VCS-500 / VCS-1000 / VCS-2000 / Custom"],
      ["Ball injection type", "Continuous / batch programmable"],
      ["Tube ID compatibility", "18 mm – 32 mm"],
      ["Tube materials", "SS 304 / 316L, Titanium, Cu-Ni, Admiralty Brass"],
    ],
  },
  {
    title: "Sponge Balls",
    rows: [
      ["Base material", "Natural rubber / EPDM foam"],
      ["Ball grades", "Standard, Abrasive, Extra-abrasive"],
      ["Density", "Marginally < cooling water"],
      ["Typical life", "1,500 – 3,000 hours per lot"],
    ],
  },
  {
    title: "System",
    rows: [
      ["Control", "PLC + HMI, remote SCADA-ready"],
      ["Ball recovery", "100% via mesh strainer / basket type"],
      ["Piping", "MS / SS with rubber lining, ANSI B16.5 flanges"],
      ["Power supply", "415 V, 3φ, 50 Hz (customisable)"],
    ],
  },
  {
    title: "Compliance",
    rows: [
      ["Design code", "TEMA / HEI aligned"],
      ["Instrumentation", "ΔP, flow, turbidity, ball count sensors"],
      ["Documentation", "GA drawings, PID, IOM, O&M manual"],
      ["Warranty", "12 months from commissioning"],
    ],
  },
];

export default function Specs() {
  return (
    <section id="specs" data-testid="specs-section" className="relative bg-[#0B0B0D]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <div className="grid lg:grid-cols-12 gap-6 items-end mb-14">
          <div className="lg:col-span-6">
            <div className="overline mb-4">04 / Technical Specifications</div>
            <h2 className="font-display font-black tracking-[-0.03em] text-4xl lg:text-5xl text-white leading-[1.02]">
              Engineered <span className="text-[#F59E0B]">to your condenser</span>, not the other way around.
            </h2>
          </div>
          <div className="lg:col-span-6">
            <p className="text-[#A1A1AA] max-w-xl">
              Every VOCCSYS unit is sized against your condenser&apos;s tube geometry, water
              chemistry and operating envelope. Below is a representative baseline.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-0 border border-[#27272A]">
          {SPEC_GROUPS.map((g, gi) => (
            <div
              key={g.title}
              data-testid={`spec-group-${gi}`}
              className={`bg-[#121214] p-8 ${gi % 2 === 0 ? "md:border-r" : ""} ${gi < 2 ? "border-b" : ""} border-[#27272A]`}
            >
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-[#F59E0B]" />
                <div className="overline">{g.title}</div>
              </div>

              <dl className="mt-6 divide-y divide-[#1F1F22]">
                {g.rows.map(([k, v]) => (
                  <div key={k} className="py-3 grid grid-cols-5 gap-4">
                    <dt className="col-span-2 text-sm text-[#A1A1AA]">{k}</dt>
                    <dd className="col-span-3 text-sm text-white font-mono">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
      <div className="rule" />
    </section>
  );
}
