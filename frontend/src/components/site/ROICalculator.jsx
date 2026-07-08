import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calculator, ArrowDown, Info } from "lucide-react";

/**
 * Simple assumption model (editable defaults):
 *  - Specific fuel consumption (SFC): 0.6 t of coal / MWh generated (typical sub-critical thermal).
 *  - Annual fuel bill  = capacity_MW × hours/yr × SFC × fuel_cost.
 *  - Recoverable loss  = fouling_loss% of fuel bill (this is what VOCCSYS eliminates).
 *  - System capex band = capacity-linked band shown as a range.
 */

const SFC_T_PER_MWH = 0.6;

const currency = (v) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(v)));

const inCr = (v) => {
  const cr = v / 10000000;
  if (cr >= 1) return `₹${cr.toFixed(cr >= 10 ? 1 : 2)} Cr`;
  const lakh = v / 100000;
  return `₹${lakh.toFixed(lakh >= 10 ? 1 : 2)} Lakh`;
};

function estimateCapex(capacityMW) {
  // Very rough band — for illustration only.
  const low = 25_00_000 + capacityMW * 40_000;
  const high = 60_00_000 + capacityMW * 90_000;
  return { low, high };
}

export default function ROICalculator() {
  const [capacity, setCapacity] = useState(250); // MW
  const [hours, setHours] = useState(8000); // hrs/yr
  const [fuelCost, setFuelCost] = useState(7000); // ₹/tonne
  const [loss, setLoss] = useState(2.0); // %

  const result = useMemo(() => {
    const annualMWh = capacity * hours;
    const annualFuelTonnes = annualMWh * SFC_T_PER_MWH;
    const annualFuelBill = annualFuelTonnes * fuelCost;
    const annualSavings = annualFuelBill * (loss / 100);

    const { low, high } = estimateCapex(capacity);
    const paybackMonthsLow = annualSavings > 0 ? (low / annualSavings) * 12 : 0;
    const paybackMonthsHigh = annualSavings > 0 ? (high / annualSavings) * 12 : 0;

    return {
      annualFuelBill,
      annualSavings,
      capexLow: low,
      capexHigh: high,
      paybackMonthsLow,
      paybackMonthsHigh,
    };
  }, [capacity, hours, fuelCost, loss]);

  const scrollToContact = () =>
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="calculator" data-testid="roi-calculator-section" className="relative bg-[#0B0B0D]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <div className="grid lg:grid-cols-12 gap-6 items-end mb-14">
          <div className="lg:col-span-6">
            <div className="flex items-center gap-3 mb-4">
              <Calculator size={16} strokeWidth={1.5} className="text-[#F59E0B]" />
              <span className="overline">Interactive · ROI Calculator</span>
            </div>
            <h2 className="font-display font-black tracking-[-0.03em] text-4xl lg:text-5xl text-white leading-[1.02]">
              Estimate your <span className="text-[#F59E0B]">annual savings</span> in 20 seconds.
            </h2>
          </div>
          <div className="lg:col-span-6">
            <p className="text-[#A1A1AA] max-w-xl">
              Move the sliders to match your plant. We&apos;ll show recoverable fuel losses,
              indicative system capex &amp; expected payback. Final numbers depend on your actual
              water chemistry &amp; tube condition.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-0 border border-[#27272A]">
          {/* Inputs */}
          <div
            data-testid="roi-inputs"
            className="lg:col-span-6 bg-[#121214] p-8 lg:p-10 lg:border-r border-b lg:border-b-0 border-[#27272A]"
          >
            <div className="overline mb-6">Your plant</div>

            <SliderField
              label="Plant capacity"
              unit="MW"
              value={capacity}
              min={20}
              max={1200}
              step={10}
              onChange={setCapacity}
              testid="roi-capacity"
            />
            <SliderField
              label="Operating hours / year"
              unit="hrs"
              value={hours}
              min={2000}
              max={8760}
              step={100}
              onChange={setHours}
              testid="roi-hours"
            />
            <SliderField
              label="Fuel cost"
              unit="₹ / tonne"
              value={fuelCost}
              min={2000}
              max={20000}
              step={100}
              onChange={setFuelCost}
              testid="roi-fuel-cost"
              format={(v) => v.toLocaleString("en-IN")}
            />
            <SliderField
              label="Heat rate loss from fouling"
              unit="%"
              value={loss}
              min={0.5}
              max={6}
              step={0.1}
              onChange={setLoss}
              testid="roi-loss"
              format={(v) => v.toFixed(1)}
            />

            <div className="mt-8 flex items-start gap-2 text-xs text-[#71717A]">
              <Info size={14} strokeWidth={1.5} className="text-[#71717A] mt-[2px]" />
              <p>
                Model uses SFC of {SFC_T_PER_MWH} t/MWh (typical sub-critical thermal). For gas /
                nuclear / HVAC, use effective fuel-equivalent cost.
              </p>
            </div>
          </div>

          {/* Results */}
          <div
            data-testid="roi-results"
            className="lg:col-span-6 bg-[#0D0D10] p-8 lg:p-10 relative overflow-hidden"
          >
            <div className="overline mb-6">Indicative outcome</div>

            <motion.div
              key={result.annualSavings}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="border-l-2 border-[#F59E0B] pl-5"
              data-testid="roi-annual-savings"
            >
              <div className="overline">Recoverable annual losses</div>
              <div className="mt-2 font-display font-black text-white text-5xl lg:text-6xl tracking-[-0.04em] leading-none">
                {inCr(result.annualSavings)}
                <span className="ml-3 text-[#F59E0B] text-lg font-mono align-top">/ year</span>
              </div>
              <div className="mt-3 text-sm text-[#A1A1AA]">
                Approx {currency(result.annualSavings)} — recovered continuously by VOCCSYS.
              </div>
            </motion.div>

            <div className="dashed-divider my-8" />

            <div className="grid grid-cols-2 gap-4">
              <ResultTile
                label="Est. fuel bill"
                value={inCr(result.annualFuelBill)}
                sub="Baseline / year"
                testid="roi-fuel-bill"
              />
              <ResultTile
                label="Indicative capex"
                value={`${inCr(result.capexLow)} – ${inCr(result.capexHigh)}`}
                sub="Turnkey range"
                testid="roi-capex"
              />
              <ResultTile
                label="Payback"
                value={
                  result.annualSavings > 0
                    ? `${result.paybackMonthsLow.toFixed(1)} – ${result.paybackMonthsHigh.toFixed(1)} mo`
                    : "—"
                }
                sub="From savings alone"
                testid="roi-payback"
              />
              <ResultTile
                label="5-year net"
                value={inCr(result.annualSavings * 5 - (result.capexLow + result.capexHigh) / 2)}
                sub="Savings − mid capex"
                testid="roi-net"
              />
            </div>

            <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <button
                onClick={scrollToContact}
                data-testid="roi-cta-quote"
                className="v-btn-primary"
              >
                Get an engineered quote
                <ArrowDown size={16} />
              </button>
              <span className="text-xs text-[#71717A]">
                We&apos;ll size the system against your actual condenser drawings.
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="rule" />
    </section>
  );
}

function SliderField({ label, unit, value, min, max, step, onChange, testid, format }) {
  const shown = format ? format(value) : value;
  return (
    <div className="mb-7">
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-sm text-[#D4D4D8] font-medium">{label}</span>
        <span className="font-display font-bold text-white text-lg tracking-tight" data-testid={`${testid}-value`}>
          {shown} <span className="text-[#F59E0B] text-xs font-mono ml-1">{unit}</span>
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        data-testid={testid}
        className="roi-range w-full"
      />
      <div className="flex justify-between mt-1 text-[10px] font-mono text-[#52525B]">
        <span>{format ? format(min) : min}</span>
        <span>{format ? format(max) : max}</span>
      </div>
    </div>
  );
}

function ResultTile({ label, value, sub, testid }) {
  return (
    <div className="border border-[#27272A] bg-[#121214] p-5" data-testid={testid}>
      <div className="overline">{label}</div>
      <div className="mt-2 font-display font-bold text-white text-lg lg:text-xl tracking-tight break-all">
        {value}
      </div>
      <div className="mt-1 text-[11px] text-[#71717A]">{sub}</div>
    </div>
  );
}
