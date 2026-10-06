// Centralised FAQ content — used by the FAQ page and (optionally) by JSON-LD.
export const FAQ_UPDATED = "October 2026";

export const FAQ_CATEGORIES = [
  {
    id: "general",
    title: "General Information",
    items: [
      {
        q: "What is VOCCSYS®, and how does it work?",
        a: [
          { type: "p", text: "VOCCSYS® is Vulcan Industries' online condenser tube cleaning system designed to automatically clean condenser tubes without stopping plant operations. It operates as a closed, four-stage ball-circulation loop:" },
          { type: "list", items: [
            "Inject — Soft sponge rubber balls (slightly oversized compared to the tube inner diameter) are injected into the cooling water inlet header.",
            "Scrub — As water flows through the condenser, the balls travel through every tube, mechanically scrubbing away scale, algae, and biofilm.",
            "Collect — A downstream Ball Trap captures all of the balls without disturbing water flow.",
            "Recirculate — A recirculation pump re-injects the collected balls back into the inlet to maintain a continuous cleaning process.",
          ] },
        ],
      },
      {
        q: "What is the expected lifespan of the VOCCSYS® system?",
        a: [
          { type: "p", text: "With proper care, VOCCSYS® has an operational lifespan of 10 to 15 years. Because the system has no moving parts except for the valves and recirculation pump — which run for short, controlled intervals — mechanical wear is minimal." },
        ],
      },
    ],
  },
  {
    id: "maintenance",
    title: "Maintenance & Lifespan",
    items: [
      {
        q: "What maintenance is required, and how long do the sponge balls last?",
        a: [
          { type: "p", text: "VOCCSYS® is virtually maintenance-free. While the valves and recirculation pump require yearly maintenance, routine maintenance is limited to replacing the cleaning sponge balls as they undergo gradual wear." },
          { type: "p", text: "Ball Lifespan: A lot of sponge balls typically lasts between 200 and 1,200 operating hours, depending on tube surface roughness and water fouling levels." },
          { type: "p", text: "Replacement Schedule: Depending on the fouling intensity, ball replenishment is typically required every 1 to 2 months." },
        ],
      },
    ],
  },
  {
    id: "performance",
    title: "Performance & Savings",
    items: [
      {
        q: "What energy and operational savings can VOCCSYS® achieve?",
        a: [
          { type: "p", text: "VOCCSYS® helps restore heat transfer efficiency and reduces fouling losses by 5% to 20% compared to traditional offline mechanical cleaning." },
          { type: "list", items: [
            "Heat Transfer Rate — Delivers a 1% to 3% improvement in heat transfer rate.",
            "Energy Reduction — Reduces energy consumption by up to 20% by lowering condenser back-pressure and turbine/chiller power draw.",
            "Typical Payback Period — Most installations achieve full Return on Investment (ROI) within 6 to 15 months (or 1 to 1.5 years depending on plant size).",
          ] },
        ],
      },
      {
        q: "How does VOCCSYS® ensure that sponge balls pass through every tube?",
        a: [
          { type: "p", text: "Complete tube coverage is proven through both mathematical probability and field performance:" },
          { type: "list", items: [
            "Theoretical Probability — With a ball charge equal to 5% of the single-pass tube count operating at 3 batch cycles per hour (72 cycles per day), the mathematical probability of a ball passing through any specific tube within 24 hours is 99.9%.",
            "Field Verification — Condensers inspected after 6 months of continuous VOCCSYS® operation showed uniform cleanliness across all tubes.",
          ] },
        ],
      },
      {
        q: "How do you monitor the performance of the system?",
        a: [
          { type: "p", text: "VOCCSYS® performance is monitored by tracking:" },
          { type: "list", items: [
            "Differential pressure (ΔP) across the condenser.",
            "Condenser approach temperature / differential temperature (ΔT).",
            "Main condenser vacuum and turbine heat transfer rates.",
          ] },
          { type: "p", text: "Maintaining these values at baseline post-descaling levels confirms optimal tube cleanliness." },
        ],
      },
    ],
  },
  {
    id: "capabilities",
    title: "System Capabilities",
    items: [
      {
        q: "Can VOCCSYS® remove existing hard scale in condenser tubes?",
        a: [
          { type: "p", text: "No. VOCCSYS® is an online preventive system that uses soft natural rubber balls." },
          { type: "list", items: [
            "Pre-Installation Descaling — Before commissioning, the condenser tubes must be descaled to restore the inner tube diameter to design specifications and checked with feeler gauges.",
            "Preventive Mechanism — Hard scale originates when Calcium and Magnesium salts form soft gel deposits. VOCCSYS® wipes away these soft deposits continuously before they can harden into scale.",
          ] },
        ],
      },
      {
        q: "Does VOCCSYS® operate continuously or in batches?",
        a: [
          { type: "p", text: "VOCCSYS® offers flexible control configurations:" },
          { type: "list", items: [
            "Batch Programmable Operation — Typically runs 3 automated cycles per hour, lasting 3 to 5 minutes per cycle.",
            "Continuous Operation — Can be programmed to run 100% continuous recirculation depending on site requirements.",
          ] },
        ],
      },
      {
        q: "Does VOCCSYS® require continuous manual supervision?",
        a: [
          { type: "p", text: "No, VOCCSYS® operates automatically via an integrated PLC with HMI and is remote SCADA-ready. Manual monitoring is only recommended during the first 2 cycles following a system restart." },
        ],
      },
    ],
  },
  {
    id: "components",
    title: "System Components",
    items: [
      {
        q: "What types of sponge balls are available, and are they eco-friendly?",
        a: [
          { type: "p", text: "Vulcan condenser cleaning balls are made from 100% natural rubber, have a specific density marginally less than cooling water, and are fully biodegradable. They are available in three variants:" },
          { type: "list", items: [
            "Standard sponge balls.",
            "Ring Coated sponge balls.",
            "Full Coated sponge balls.",
          ] },
        ],
      },
      {
        q: "Can sponge balls cause tube erosion or get stuck inside tubes?",
        a: [
          { type: "list", items: [
            "No Tube Erosion — The balls are soft and absorb the wear themselves, protecting the condenser tubes from pitting or damage.",
            "No Blockages — Cooling water velocity drives the balls smoothly through the tubes.",
          ] },
        ],
      },
    ],
  },
  {
    id: "compatibility",
    title: "System Compatibility",
    items: [
      {
        q: "What tube materials, sizes, and geometries are compatible with VOCCSYS®?",
        a: [
          { type: "list", items: [
            "Compatible Tube Materials — Stainless Steel (SS 304 / 316L), Titanium, Copper-Nickel (Cu-Ni), and Admiralty Brass.",
            "Tube Inner Diameter (ID) — Compatible with tube sizes ranging from 18 mm to 32 mm.",
            "Tube Geometry — Performs with equal effectiveness in standard straight tubes as well as spirally grooved / enhanced tubes.",
          ] },
        ],
      },
      {
        q: "What pipeline sizes and plant capacities can VOCCSYS® support?",
        a: [
          { type: "list", items: [
            "Standard Line Sizes — Available for cooling water line sizes from 4 inches (DN100) up to 25 inches (DN650).",
            "Large-Scale Custom Engineering — Custom-designed systems can accommodate line sizes up to 40 inches and above.",
            "Multi-Condenser Connection — A single standard VOCCSYS® skid can be configured with additional piping components to serve up to 3 chillers/condensers.",
          ] },
        ],
      },
    ],
  },
  {
    id: "compliance",
    title: "Technical Compliance & Warranty",
    items: [
      {
        q: "What design and technical compliance standards does VOCCSYS® meet?",
        a: [
          { type: "list", items: [
            "Design Standards — Aligned with TEMA (Tubular Exchanger Manufacturers Association) and HEI (Heat Exchange Institute) codes.",
            "Flange Specifications — ANSI B16.5 compliant piping in MS, CS, or SS options.",
            "Power Supply — Standard 460V / 3PH / 60HZ (customizable upon request).",
            "Warranty — Includes a 12-month warranty from the date of commissioning.",
            "Documentation Provided — Complete GA drawings, P&ID schematics, and O&M manuals.",
          ] },
        ],
      },
    ],
  },
  {
    id: "industries",
    title: "Industries Served",
    items: [
      {
        q: "Which industries benefit from VOCCSYS®?",
        a: [
          { type: "p", text: "VOCCSYS® is deployed across high-demand industrial cooling loops in India and internationally, including:" },
          { type: "list", items: [
            "Thermal & Nuclear Power Plants",
            "HVAC & District Cooling Systems",
            "Petrochemical & Refining Complexes",
            "Steel & Metals Manufacturing",
            "Sugar & Paper Mills",
            "Chemical & Fertilizer Plants",
          ] },
        ],
      },
    ],
  },
];
