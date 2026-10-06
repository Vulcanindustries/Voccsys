import React, { useState, useEffect } from "react";
import { ArrowRight, PlayCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const HERO_IMG =
  "https://images.unsplash.com/photo-1700607101915-99650c815caf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTF8MHwxfHNlYXJjaHwzfHxwb3dlciUyMHBsYW50JTIwY29vbGluZyUyMHRvd2VyJTIwaW5kdXN0cmlhbHxlbnwwfHx8fDE3ODM1NDYwMjJ8MA&ixlib=rb-4.1.0&q=85";

const VIDEO_ID = "u0iLiX1AXN8";

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

export default function Hero() {
  const [videoOpen, setVideoOpen] = useState(false);

  useEffect(() => {
    if (!videoOpen) return;
    const onKey = (e) => e.key === "Escape" && setVideoOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [videoOpen]);

  return (
    <section id="top" data-testid="hero-section" className="relative overflow-hidden text-[#3D3F3E]">
      <div className="absolute inset-0 -z-10">
        <img
          src={HERO_IMG}
          alt="Industrial power plant cooling tower — VOCCSYS keeps condensers clean while the plant runs"
          className="w-full h-full object-cover object-[center_75%]"
        />
        <div className="absolute inset-0 bg-[#F2F1ED]/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F2F1ED]/25 via-transparent to-[#F2F1ED]" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-14 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <span className="overline text-[#B45309]">
                Patent Pending · Online Cleaning · Zero Shutdown
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              data-testid="hero-headline"
              className="font-display font-black tracking-[-0.045em] text-[#1F1F22] leading-[0.95] text-5xl sm:text-6xl lg:text-[86px]"
            >
              Clean condensers <br className="hidden sm:block" />
              <span className="text-[#B45309]">while the plant runs.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mt-8 text-lg lg:text-xl text-[#3D3F3E] max-w-2xl leading-relaxed"
            >
              VOCCSYS<sup className="text-[14px] align-super font-normal text-[#B45309]">®</sup> is Vulcan Industries&apos; online condenser tube cleaning system — an
              engineered ball-circulation loop that scrubs scale &amp; biofilm continuously,
              restoring heat transfer rate without a single minute of downtime.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <button
                onClick={() => scrollTo("contact")}
                data-testid="hero-cta-demo"
                className="v-btn-primary"
              >
                Request On-Site Demo <ArrowRight size={18} />
              </button>
              <button
                onClick={() => setVideoOpen(true)}
                data-testid="hero-cta-process"
                className="v-btn-secondary"
              >
                <PlayCircle size={18} /> See the Process
              </button>
            </motion.div>

            <div className="mt-14 grid grid-cols-3 gap-6 max-w-2xl">
              {[
                { k: "0", u: "hrs", l: "Shutdown required" },
                { k: "1–3%", u: "", l: "Heat transfer rate recovery" },
                { k: "<15", u: "mo", l: "Typical payback" },
              ].map((s, i) => (
                <div key={i} className="border-t border-[#D9D6CE] pt-4" data-testid={`hero-stat-${i}`}>
                  <div className="font-display font-black text-3xl lg:text-4xl text-[#1F1F22] leading-none">
                    {s.k}
                    <span className="text-[#B45309] text-xl align-top ml-1">{s.u}</span>
                  </div>
                  <div className="mt-2 text-xs uppercase tracking-[0.18em] text-[#6B6E6C]">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 hidden lg:flex flex-col justify-end">
            <div className="border border-[#D9D6CE] bg-white/70 backdrop-blur p-6">
              <div className="overline mb-3">System Snapshot</div>
              <ul className="tick-list space-y-3 text-sm text-[#3D3F3E]">
                <li>Continuous sponge-ball loop through condenser tubes</li>
                <li>Ball collector + Ball Trap with auto-reinjection</li>
                <li>PLC control + Real-time monitoring</li>
                <li>Compatible with 18 – 32 mm tube ID configurations</li>
              </ul>
              <div className="dashed-divider my-5" />
              <div className="flex items-center justify-between text-xs text-[#6B6E6C]">
                <span>Model</span>
                <span className="font-mono text-[#1F1F22]">VOCCSYS-Series</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rule" />

      {/* ============ Video modal ============ */}
      <AnimatePresence>
        {videoOpen && (
          <motion.div
            key="video-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setVideoOpen(false)}
            data-testid="video-modal"
            className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: [0.34, 1.4, 0.64, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl"
            >
              <button
                onClick={() => setVideoOpen(false)}
                data-testid="video-close"
                aria-label="Close video"
                className="absolute -top-12 right-0 text-white hover:text-[#B45309] transition-colors flex items-center gap-2 text-sm font-mono uppercase tracking-widest"
              >
                Close <X size={18} />
              </button>
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
                  title="VOCCSYS — See the Process"
                  className="absolute inset-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
