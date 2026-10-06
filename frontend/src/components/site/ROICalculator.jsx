import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calculator, ArrowDown, Info, Zap, Snowflake } from "lucide-react";

/**
 * Two tabs:
 *  - Power Generation : fuel-side savings (coal t/MWh model)
 *  - HVAC             : electricity-side savings (kW/TR model)
 */

const SFC_T_PER_MWH = 0.6;          // sub-critical thermal coal plant
const KW_PER_TR     = 0.70;         // typical centrifugal chiller baseline

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

function powerCapex(capacityMW) {
  const low  = 25_00_000 + capacityMW * 40_000;
  const high = 60_00_000 + capacityMW * 90_000;
  return { low, high };
}

function hvacCapex(tr) {
  const low  = 8_00_000  + tr * 350;
  const high = 20_00_000 + tr * 900;
  return { low, high };
}

/* ============== Power Generation calculator ============== */
function PowerCalculator({ scrollToContact }) {
  const [capacity, setCapacity] = useState(250);
  const [hours, setHours]       = useState(8000);
  const [fuelCost, setFuelCost] = useState(7000);
  const [loss, setLoss]         = useState(2.0);

  const r = useMemo(() => {
    const annualMWh      = capacity * hours;
    const annualTonnes   = annualMWh * SFC_T_PER_MWH;
    const annualFuelBill = annualTonnes * fuelCost;
    const annualSavings  = annualFuelBill * (loss / 100);
    const { low, high }  = powerCapex(capacity);
    return {
      baseline: annualFuelBill,
      savings:  annualSavings,
      capexLow: low,
      capexHigh: high,
      pbLow:  annualSavings > 0 ? (low  / annualSavings) * 12 : 0,
      pbHigh: annualSavings > 0 ? (high / annualSavings) * 12 : 0,
    };
  }, [capacity, hours, fuelCost, loss]);

  return (
    <ResultLayout
      inputs={
        <>
          <SliderField label="Plant capacity" unit="MW" value={capacity}
            min={20} max={1200} step={10} onChange={setCapacity} testid="roi-capacity" />
          <SliderField label="Operating hours / year" unit="hrs" value={hours}
            min={2000} max={8760} step={100} onChange={setHours} testid="roi-hours" />
          <SliderField label="Fuel cost" unit="₹ / tonne" value={fuelCost}
            min={2000} max={20000} step={100} onChange={setFuelCost} testid="roi-fuel-cost"
            format={(v) => v.toLocaleString("en-IN")} />
          <SliderField label="Heat transfer rate loss from fouling" unit="%" value={loss}
            min={0.5} max={6} step={0.1} onChange={setLoss} testid="roi-loss"
            format={(v) => v.toFixed(1)} />
          <AssumptionLine>
            Model uses SFC of {SFC_T_PER_MWH} t/MWh (typical sub-critical thermal). For gas /
            nuclear, use effective fuel-equivalent cost.
          </AssumptionLine>
        </>
      }
      baselineLabel="Est. fuel bill"
      baseline={r.baseline}
      savings={r.savings}
      capexLow={r.capexLow}
      capexHigh={r.capexHigh}
      pbLow={r.pbLow}
      pbHigh={r.pbHigh}
      scrollToContact={scrollToContact}
    />
  );
}

/* ============== HVAC calculator ============== */
function HVACCalculator({ scrollToContact }) {
  const [tr, setTr]         = useState(2000);
  const [hours, setHours]   = useState(6000);
  const [elec, setElec]     = useState(10);
  const [loss, setLoss]     = useState(5);

  const r = useMemo(() => {
    const baselineKW       = tr * KW_PER_TR;
    const annualKWh        = baselineKW * hours;
    const annualElecBill   = annualKWh * elec;
    const annualSavings    = annualElecBill * (loss / 100);
    const { low, high }    = hvacCapex(tr);
    return {
      baseline: annualElecBill,
      savings:  annualSavings,
      capexLow: low,
      capexHigh: high,
      pbLow:  annualSavings > 0 ? (low  / annualSavings) * 12 : 0,
      pbHigh: annualSavings > 0 ? (high / annualSavings) * 12 : 0,
    };
  }, [tr, hours, elec, loss]);

  return (
    <ResultLayout
      inputs={
        <>
          <SliderField label="Chiller plant capacity" unit="TR" value={tr}
            min={200} max={10000} step={50} onChange={setTr} testid="roi-tr"
            format={(v) => v.toLocaleString("en-IN")} />
          <SliderField label="Operating hours / year" unit="hrs" value={hours}
            min={1500} max={8760} step={100} onChange={setHours} testid="roi-hvac-hours" />
          <SliderField label="Electricity tariff" unit="₹ / kWh" value={elec}
            min={4} max={20} step={0.1} onChange={setElec} testid="roi-elec"
            format={(v) => v.toFixed(1)} />
          <SliderField label="Chiller COP loss from fouling" unit="%" value={loss}
            min={1} max={15} step={0.5} onChange={setLoss} testid="roi-hvac-loss"
            format={(v) => v.toFixed(1)} />
          <AssumptionLine>
            Model uses baseline {KW_PER_TR} kW/TR (typical centrifugal chiller). Adjust the loss
            slider higher for condenser-fouling-prone sites.
          </AssumptionLine>
        </>
      }
      baselineLabel="Est. electricity bill"
      baseline={r.baseline}
      savings={r.savings}
      capexLow={r.capexLow}
      capexHigh={r.capexHigh}
      pbLow={r.pbLow}
      pbHigh={r.pbHigh}
      scrollToContact={scrollToContact}
    />
  );
}

/* ============== Shared result layout ============== */
function ResultLayout({
  inputs,
  baselineLabel,
  baseline,
  savings,
  capexLow,
  capexHigh,
  pbLow,
  pbHigh,
  scrollToContact,
}) {
  const net5yr = savings * 5 - (capexLow + capexHigh) / 2;
  return (
    <div className="grid lg:grid-cols-12 gap-0 border border-[#D9D6CE]">
      <div data-testid="roi-inputs"
        className="lg:col-span-6 bg-white p-8 lg:p-10 lg:border-r border-b lg:border-b-0 border-[#D9D6CE]">
        <div className="overline mb-6">Your inputs</div>
        {inputs}
      </div>
      <div data-testid="roi-results"
        className="lg:col-span-6 bg-[#F8F7F3] p-8 lg:p-10 relative overflow-hidden">
        <div className="overline mb-6">Indicative outcome</div>
        <motion.div key={savings}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="border-l-2 border-[#B45309] pl-5"
          data-testid="roi-annual-savings">
          <div className="overline">Recoverable annual losses</div>
          <div className="mt-2 font-display font-black text-[#1F1F22] text-5xl lg:text-6xl tracking-[-0.04em] leading-none">
            {inCr(savings)}
            <span className="ml-3 text-[#B45309] text-lg font-mono align-top">/ year</span>
          </div>
          <div className="mt-3 text-sm text-[#6B6E6C]">
            Approx {currency(savings)} — recovered continuously by VOCCSYS.
          </div>
        </motion.div>
        <div className="dashed-divider my-8" />
        <div className="grid grid-cols-2 gap-4">
          <ResultTile label={baselineLabel} value={inCr(baseline)} sub="Baseline / year" testid="roi-fuel-bill" />
          <ResultTile label="Indicative capex" value={`${inCr(capexLow)} – ${inCr(capexHigh)}`} sub="Turnkey range" testid="roi-capex" />
          <ResultTile label="Payback"
            value={savings > 0 ? `${pbLow.toFixed(1)} – ${pbHigh.toFixed(1)} mo` : "—"}
            sub="From savings alone" testid="roi-payback" />
          <ResultTile label="5-year net" value={inCr(net5yr)} sub="Savings − mid capex" testid="roi-net" />
        </div>
        <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <button onClick={scrollToContact} data-testid="roi-cta-quote" className="v-btn-primary">
            Get an engineered quote <ArrowDown size={16} />
          </button>
          <span className="text-xs text-[#8A8A80]">
            We&apos;ll size the system against your actual condenser drawings.
          </span>
        </div>
      </div>
    </div>
  );
}

/* ============== Main component with tabs ============== */
export default function ROICalculator() {
  const [tab, setTab] = useState("power");
  const scrollToContact = () =>
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });

  const tabs = [
    { id: "power", label: "Power Generation", icon: Zap },
    { id: "hvac",  label: "HVAC",             icon: Snowflake },
  ];

  return (
    <section id="calculator" data-testid="roi-calculator-section" className="relative bg-[#F2F1ED] text-[#3D3F3E]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10 lg:py-14">
        <div className="grid lg:grid-cols-12 gap-6 items-end mb-10">
          <div className="lg:col-span-6">
            <div className="flex items-center gap-3 mb-4">
              <Calculator size={16} strokeWidth={1.5} className="text-[#B45309] icon-float" />
              <span className="overline">Interactive · ROI Calculator</span>
            </div>
            <h2 className="font-display font-black tracking-[-0.03em] text-4xl lg:text-5xl text-[#1F1F22] leading-[1.02]">
              Estimate your <span className="text-[#B45309]">annual savings</span> in 20 seconds.
            </h2>
          </div>
          <div className="lg:col-span-6">
            <p className="text-[#6B6E6C] max-w-xl">
              Choose your industry, move the sliders to match your site. We&apos;ll show
              recoverable losses, indicative capex &amp; expected payback. Final numbers depend on
              your actual water chemistry &amp; tube condition.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Calculator industry"
          data-testid="roi-tabs"
          className="flex flex-wrap gap-0 border border-[#D9D6CE] border-b-0 w-fit"
        >
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                data-testid={`roi-tab-${t.id}`}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-display font-bold tracking-wide transition-colors
                  ${active
                    ? "bg-[#B45309] text-white"
                    : "bg-white text-[#1F1F22] hover:bg-[#F8F7F3]"
                  }`}
              >
                <Icon size={16} strokeWidth={1.75} />
                {t.label}
              </button>
            );
          })}
        </div>

        {tab === "power"
          ? <PowerCalculator scrollToContact={scrollToContact} />
          : <HVACCalculator  scrollToContact={scrollToContact} />
        }
      </div>
      <div className="rule" />
    </section>
  );
}

/* ============== Shared primitives ============== */
function SliderField({ label, unit, value, min, max, step, onChange, testid, format }) {
  const shown = format ? format(value) : value;
  return (
    <div className="mb-7">
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-sm text-[#1F1F22] font-medium">{label}</span>
        <span className="font-display font-bold text-[#1F1F22] text-lg tracking-tight" data-testid={`${testid}-value`}>
          {shown} <span className="text-[#B45309] text-xs font-mono ml-1">{unit}</span>
        </span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        data-testid={testid}
        className="roi-range w-full"
      />
      <div className="flex justify-between mt-1 text-[10px] font-mono text-[#9A9C99]">
        <span>{format ? format(min) : min}</span>
        <span>{format ? format(max) : max}</span>
      </div>
    </div>
  );
}

function ResultTile({ label, value, sub, testid }) {
  return (
    <div className="border border-[#D9D6CE] bg-white p-5" data-testid={testid}>
      <div className="overline">{label}</div>
      <div className="mt-2 font-display font-bold text-[#1F1F22] text-lg lg:text-xl tracking-tight break-all">
        {value}
      </div>
      <div className="mt-1 text-[11px] text-[#8A8A80]">{sub}</div>
    </div>
  );
}

function AssumptionLine({ children }) {
  return (
    <div className="mt-8 flex items-start gap-2 text-xs text-[#8A8A80]">
      <Info size={14} strokeWidth={1.5} className="text-[#8A8A80] mt-[2px]" />
      <p>{children}</p>
    </div>
  );
}
