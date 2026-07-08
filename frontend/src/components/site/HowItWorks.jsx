import React from "react";
import { motion } from "framer-motion";

const STEPS = [
  {
    n: "01",
    t: "Inject",
    d: "Sponge balls (slightly oversized vs tube ID) are injected into the cooling water inlet header via the VOCCSYS ball trap.",
  },
  {
    n: "02",
    t: "Scrub",
    d: "Balls flow through every condenser tube with the water, wiping the internal surface clean of scale &amp; biofilm on every pass.",
  },
  {
    n: "03",
    t: "Collect",
    d: "A downstream strainer captures 100% of the balls after the condenser without disturbing water flow.",
  },
  {
    n: "04",
    t: "Recirculate",
    d: "The recovery pump re-injects the collected balls back to the inlet, forming a closed, continuous cleaning loop.",
  },
];

export default function HowItWorks() {
  return (
    <section id="process" data-testid="process-section" className="relative">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <div className="grid lg:grid-cols-12 gap-6 items-end mb-16">
          <div className="lg:col-span-6">
            <div className="overline mb-4">02 / How it works</div>
            <h2 className="font-display font-black tracking-[-0.03em] text-4xl lg:text-5xl text-white leading-[1.02]">
              A closed loop. <br />
              <span className="text-[#F59E0B]">Cleaning without pause.</span>
            </h2>
          </div>
          <div className="lg:col-span-6">
            <p className="text-[#A1A1AA] text-base leading-relaxed max-w-xl">
              Four stages, one continuous cycle. The balls travel with the cooling water, do their
              job inside the tubes, get caught, and go around again — indefinitely.
            </p>
          </div>
        </div>

        {/* Diagram */}
        <div className="border border-[#27272A] bg-[#0D0D10] p-6 lg:p-10 mb-16">
          <SpongeBallDiagram />
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-0 border border-[#27272A]">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              data-testid={`process-step-${i}`}
              className={`p-8 bg-[#121214] ${i < STEPS.length - 1 ? "lg:border-r border-[#27272A]" : ""} ${i < 2 ? "md:border-b lg:border-b-0 border-[#27272A]" : ""} ${i === 0 ? "md:border-r" : ""} ${i === 2 ? "md:border-r lg:border-r" : ""}`}
            >
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[#F59E0B] text-sm">{s.n}</span>
                <span className="h-[1px] w-8 bg-[#F59E0B]" />
              </div>
              <div className="mt-4 font-display font-bold text-2xl text-white">{s.t}</div>
              <p
                className="mt-3 text-sm text-[#A1A1AA] leading-relaxed"
                dangerouslySetInnerHTML={{ __html: s.d }}
              />
            </motion.div>
          ))}
        </div>
      </div>
      <div className="rule" />
    </section>
  );
}

/* ---------- SVG animated diagram ---------- */

function SpongeBallDiagram() {
  // 6 horizontal tubes. Path returns via top+bottom bends.
  const tubes = [1, 2, 3, 4, 5, 6];
  const width = 1000;
  const height = 360;

  // We'll animate multiple balls using CSS offset-path via motion path.
  const balls = [0, 1, 2, 3, 4];

  return (
    <div className="w-full overflow-hidden" data-testid="how-it-works-diagram">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        role="img"
        aria-label="VOCCSYS sponge ball circulation diagram"
      >
        <defs>
          <linearGradient id="tubeGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#1A1A1D" />
            <stop offset="100%" stopColor="#101013" />
          </linearGradient>
          <linearGradient id="pipeGrad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#2A2A2E" />
            <stop offset="100%" stopColor="#1A1A1D" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Left header (inlet) */}
        <rect x="60" y="60" width="24" height="240" fill="url(#pipeGrad)" stroke="#3F3F46" />
        <text x="72" y="45" fill="#A1A1AA" fontSize="11" textAnchor="middle" fontFamily="IBM Plex Mono">
          INLET
        </text>

        {/* Right header (outlet) */}
        <rect x={width - 84} y="60" width="24" height="240" fill="url(#pipeGrad)" stroke="#3F3F46" />
        <text x={width - 72} y="45" fill="#A1A1AA" fontSize="11" textAnchor="middle" fontFamily="IBM Plex Mono">
          OUTLET
        </text>

        {/* Condenser bounding box */}
        <rect
          x="50"
          y="55"
          width={width - 100}
          height="250"
          fill="none"
          stroke="#27272A"
          strokeDasharray="4 6"
        />
        <text x="60" y="325" fill="#71717A" fontSize="11" fontFamily="IBM Plex Mono">
          CONDENSER SHELL — tube bundle
        </text>

        {/* Tubes */}
        {tubes.map((t, i) => {
          const y = 80 + i * 36;
          return (
            <g key={i}>
              <rect x="84" y={y - 6} width={width - 168} height="12" fill="url(#tubeGrad)" stroke="#27272A" />
              <line
                x1="84"
                x2={width - 84}
                y1={y}
                y2={y}
                stroke="#F59E0B"
                strokeOpacity="0.18"
                strokeWidth="1"
              />
            </g>
          );
        })}

        {/* External return loop path (visual) */}
        <path
          d={`M ${width - 60} 180 C ${width + 40} 180, ${width + 40} 340, ${width - 60} 340
              L 80 340
              C -20 340, -20 180, 80 180`}
          fill="none"
          stroke="#3F3F46"
          strokeWidth="10"
          strokeLinecap="round"
          opacity="0.35"
        />
        <path
          d={`M ${width - 60} 180 C ${width + 40} 180, ${width + 40} 340, ${width - 60} 340
              L 80 340
              C -20 340, -20 180, 80 180`}
          fill="none"
          stroke="#F59E0B"
          strokeOpacity="0.15"
          strokeWidth="2"
          strokeDasharray="4 6"
        />

        {/* Collector / Pump icons */}
        <g>
          <circle cx={width - 40} cy="340" r="14" fill="#121214" stroke="#F59E0B" />
          <text x={width - 40} y="366" fontSize="10" fill="#A1A1AA" textAnchor="middle" fontFamily="IBM Plex Mono">
            COLLECTOR
          </text>
        </g>
        <g>
          <rect x="30" y="326" width="28" height="28" fill="#121214" stroke="#F59E0B" />
          <text x="44" y="374" fontSize="10" fill="#A1A1AA" textAnchor="middle" fontFamily="IBM Plex Mono">
            PUMP
          </text>
        </g>

        {/* Animated balls — one per tube + one on the return loop */}
        {tubes.map((t, i) => {
          const y = 80 + i * 36;
          const dur = 4 + (i % 3);
          const delay = i * 0.35;
          return (
            <motion.circle
              key={`ball-${i}`}
              r="5"
              fill="#F59E0B"
              filter="url(#glow)"
              initial={{ cx: 84, cy: y }}
              animate={{ cx: [84, width - 84] }}
              transition={{
                duration: dur,
                delay,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          );
        })}

        {/* Extra balls on return path — approximated by moving along y=340 line */}
        {balls.map((b, i) => (
          <motion.circle
            key={`ret-${i}`}
            r="4"
            fill="#F59E0B"
            opacity="0.85"
            initial={{ cx: width - 84, cy: 340 }}
            animate={{ cx: [width - 84, 84] }}
            transition={{
              duration: 5 + i * 0.4,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.7,
            }}
          />
        ))}

        {/* Flow arrows */}
        <g fontFamily="IBM Plex Mono" fontSize="10" fill="#71717A">
          <text x={width / 2} y="45" textAnchor="middle">
            → COOLING WATER + SPONGE BALLS →
          </text>
          <text x={width / 2} y="360" textAnchor="middle">
            ← RECIRCULATION LOOP ←
          </text>
        </g>
      </svg>
    </div>
  );
}

// end
