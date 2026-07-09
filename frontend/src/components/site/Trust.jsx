import React from "react";
import { Hexagon, Triangle, Square, Circle, Diamond, Pentagon } from "lucide-react";

const CLIENTS = [
  { icon: Hexagon, name: "APEX POWERGEN" },
  { icon: Triangle, name: "MERIDIAN STEEL" },
  { icon: Square, name: "NORTHWIND HVAC" },
  { icon: Circle, name: "KAVERI SUGARS" },
  { icon: Diamond, name: "CIRRUS REFINERIES" },
  { icon: Pentagon, name: "ATLAS PETROCHEM" },
  { icon: Hexagon, name: "SAPPHIRE ENERGY" },
  { icon: Triangle, name: "ORION CHEMICALS" },
];

const TESTIMONIALS = [
  {
    q: "Since installing VOCCSYS, our main condenser back-pressure has stayed within design year-round. The unit paid for itself in under 10 months.",
    who: "Plant Manager",
    org: "500 MW Thermal Power Station",
  },
  {
    q: "We replaced our quarterly offline mechanical cleaning cycle entirely. Fewer shutdowns, no chemicals, cleaner tubes.",
    who: "Head, Utilities",
    org: "Petrochemical Refinery, West India",
  },
  {
    q: "Our chiller COP recovery translated directly to lower auxiliary consumption across the campus.",
    who: "Chief Engineer",
    org: "District Cooling Operator",
  },
];

export default function Trust() {
  const doubled = [...CLIENTS, ...CLIENTS];

  return (
    <section id="trust" data-testid="trust-section" className="relative bg-[#F2F1ED] text-[#1F1F22]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-[1px] bg-[#B45309]" />
          <span className="overline">Trusted across industry</span>
        </div>

        <h2 className="font-display font-black tracking-[-0.03em] text-3xl lg:text-4xl text-[#1F1F22] max-w-3xl">
          Deployed at plants that can&apos;t afford to stop.
        </h2>

        {/* Marquee logos */}
        <div className="mt-12 border-y border-[#D9D6CE] py-6 overflow-hidden">
          <div className="marquee gap-16 whitespace-nowrap">
            {doubled.map((c, i) => {
              const Icon = c.icon;
              return (
                <div
                  key={i}
                  data-testid={`client-logo-${i}`}
                  className="flex items-center gap-3 opacity-70 hover:opacity-100 transition-opacity shrink-0"
                >
                  <Icon size={18} strokeWidth={1.5} className="text-[#6B6E6C]" />
                  <span className="font-display font-bold text-sm tracking-[0.15em] text-[#3D3F3E]">
                    {c.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-16 grid md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              data-testid={`testimonial-${i}`}
              className="border border-[#D9D6CE] bg-white p-7 flex flex-col"
            >
              <div className="text-[#B45309] font-display font-black text-4xl leading-none">&ldquo;</div>
              <p className="mt-4 text-[#3D3F3E] text-sm leading-relaxed flex-1">{t.q}</p>
              <div className="dashed-divider my-4" />
              <div className="text-xs uppercase tracking-[0.18em] text-[#1F1F22]">{t.who}</div>
              <div className="text-xs text-[#6B6E6C] mt-1">{t.org}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="rule" />
    </section>
  );
}
