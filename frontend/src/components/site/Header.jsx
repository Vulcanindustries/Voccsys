import React, { useState, useEffect } from "react";
import { Menu, X, Download } from "lucide-react";

const NAV = [
  { id: "overview", label: "System" },
  { id: "process", label: "Process" },
  { id: "benefits", label: "ROI" },
  { id: "specs", label: "Specs" },
  { id: "calculator", label: "Calculator" },
  { id: "contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  return (
    <header
      data-testid="site-header"
      className={`sticky top-0 z-50 bg-[#F2F1ED] border-b border-[#D9D6CE] ${scrolled ? "shadow-[0_1px_0_0_#D9D6CE]" : ""}`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-[72px] flex items-center justify-between">
        <button
          onClick={() => go("top")}
          data-testid="brand-wordmark"
          className="flex items-center gap-3 group"
          aria-label="VOCCSYS home"
        >
          <span className="inline-block w-2 h-6 bg-[#B45309]" />
          <span className="font-display font-black tracking-[-0.04em] text-xl text-[#1F1F22]">
            VOCCSYS
          </span>
          <span className="hidden md:inline overline no-lead pl-2 border-l border-[#D9D6CE]">
            by Vulcan Industries
          </span>
        </button>

        <nav className="hidden lg:flex items-center gap-8" aria-label="Primary">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => go(n.id)}
              data-testid={`nav-${n.id}`}
              className="text-sm font-medium text-[#6B6E6C] hover:text-[#1F1F22] transition-colors"
            >
              {n.label}
            </button>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href="/voccsys-brochure.pdf"
            download
            data-testid="header-cta-brochure"
            className="v-btn-secondary text-sm"
          >
            <Download size={16} /> Brochure
          </a>
          <button
            data-testid="header-cta-demo"
            onClick={() => go("contact")}
            className="v-btn-primary text-sm"
          >
            Request Demo
          </button>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden text-[#1F1F22] p-2 border border-[#D9D6CE]"
          data-testid="mobile-menu-toggle"
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-[#D9D6CE] bg-[#F2F1ED]" data-testid="mobile-menu">
          <div className="px-6 py-4 grid gap-1">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => go(n.id)}
                data-testid={`mnav-${n.id}`}
                className="text-left py-3 text-[#1F1F22] border-b border-[#D9D6CE] font-display"
              >
                {n.label}
              </button>
            ))}
            <button
              onClick={() => go("contact")}
              data-testid="mobile-cta-demo"
              className="v-btn-primary mt-4 justify-center"
            >
              Request Demo
            </button>
            <a
              href="/voccsys-brochure.pdf"
              download
              data-testid="mobile-cta-brochure"
              className="v-btn-secondary mt-3 justify-center"
            >
              <Download size={16} /> Download Brochure
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
