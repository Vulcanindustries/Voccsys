import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Minus } from "lucide-react";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { FAQ_CATEGORIES, FAQ_UPDATED } from "@/data/faq";

function AnswerBlock({ a }) {
  return (
    <div className="mt-4 space-y-4">
      {a.map((block, i) => {
        if (block.type === "p") {
          return (
            <p key={i} className="text-[#3D3F3E] text-base leading-relaxed">
              {block.text}
            </p>
          );
        }
        if (block.type === "list") {
          return (
            <ul key={i} className="tick-list space-y-2 text-[#3D3F3E] text-base leading-relaxed">
              {block.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          );
        }
        return null;
      })}
    </div>
  );
}

function FaqItem({ q, a, openId, setOpenId, id }) {
  const isOpen = openId === id;
  return (
    <div
      data-testid={`faq-item-${id}`}
      className={`border-b border-[#D9D6CE] ${isOpen ? "bg-white" : "bg-transparent"}`}
    >
      <button
        onClick={() => setOpenId(isOpen ? null : id)}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${id}`}
        data-testid={`faq-toggle-${id}`}
        className="w-full text-left py-5 px-4 flex items-start justify-between gap-6 group"
      >
        <h3 className="font-display font-bold text-base lg:text-lg text-[#1F1F22] leading-snug group-hover:text-[#B45309] transition-colors">
          {q}
        </h3>
        <span
          className={`shrink-0 w-7 h-7 flex items-center justify-center border border-[#D9D6CE] transition-all duration-300 ${
            isOpen ? "bg-[#B45309] border-[#B45309] rotate-180" : "bg-white"
          }`}
        >
          {isOpen ? (
            <Minus size={14} strokeWidth={2} className="text-white" />
          ) : (
            <Plus size={14} strokeWidth={2} className="text-[#1F1F22]" />
          )}
        </span>
      </button>
      {isOpen && (
        <div
          id={`faq-answer-${id}`}
          data-testid={`faq-answer-${id}`}
          className="px-4 pb-6 -mt-2"
        >
          <AnswerBlock a={a} />
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    document.title = "FAQ — VOCCSYS by Vulcan Industries India";
    window.scrollTo(0, 0);
  }, []);

  const totalItems = FAQ_CATEGORIES.reduce((n, c) => n + c.items.length, 0);

  return (
    <div data-testid="faq-page" className="relative z-10 bg-[#F2F1ED] min-h-screen">
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

            <span className="overline">Help · Frequently Asked Questions</span>

            <h1 className="mt-4 font-display font-black tracking-[-0.03em] text-4xl lg:text-5xl text-[#1F1F22] leading-[1.02]">
              Frequently Asked Questions
            </h1>

            <p className="mt-5 text-[#3D3F3E] text-base leading-relaxed max-w-2xl">
              Everything procurement, operations and engineering teams typically ask about
              VOCCSYS<sup className="text-[11px] align-super text-[#B45309]">®</sup> — grouped by
              topic. Can&apos;t find your question?{" "}
              <Link to="/#contact" className="text-[#B45309] hover:underline">
                Reach out to our team.
              </Link>
            </p>

            <div className="mt-5 flex items-center gap-6 text-xs font-mono text-[#6B6E6C]">
              <span>
                Updated: <span className="text-[#1F1F22]">{FAQ_UPDATED}</span>
              </span>
              <span>
                Questions: <span className="text-[#1F1F22]">{totalItems}</span>
              </span>
            </div>

            <div className="dashed-divider my-10" />

            {/* Category chips */}
            <nav
              aria-label="FAQ categories"
              data-testid="faq-nav"
              className="flex flex-wrap gap-2 mb-10"
            >
              {FAQ_CATEGORIES.map((c) => (
                <a
                  key={c.id}
                  href={`#${c.id}`}
                  data-testid={`faq-chip-${c.id}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono uppercase tracking-widest border border-[#D9D6CE] text-[#3D3F3E] hover:border-[#B45309] hover:text-[#B45309] transition-colors"
                >
                  {c.title}
                </a>
              ))}
            </nav>

            {/* Categories */}
            {FAQ_CATEGORIES.map((cat, ci) => (
              <section
                key={cat.id}
                id={cat.id}
                data-testid={`faq-category-${cat.id}`}
                className="mb-14 scroll-mt-24"
              >
                <div className="flex items-end justify-between mb-5">
                  <div>
                    <div className="overline mb-2">
                      {String(ci + 1).padStart(2, "0")} / {cat.title}
                    </div>
                    <h2 className="font-display font-bold text-2xl lg:text-3xl text-[#1F1F22] tracking-[-0.02em]">
                      {cat.title}
                    </h2>
                  </div>
                  <span className="text-xs font-mono text-[#6B6E6C]">
                    {cat.items.length} {cat.items.length === 1 ? "question" : "questions"}
                  </span>
                </div>

                <div className="border-t border-[#D9D6CE]">
                  {cat.items.map((it, i) => {
                    const id = `${cat.id}-${i}`;
                    return (
                      <FaqItem
                        key={id}
                        id={id}
                        q={it.q}
                        a={it.a}
                        openId={openId}
                        setOpenId={setOpenId}
                      />
                    );
                  })}
                </div>
              </section>
            ))}

            {/* CTA */}
            <div className="border border-[#D9D6CE] bg-white p-8 lg:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="overline mb-2">Still have questions?</div>
                <h3 className="font-display font-bold text-xl lg:text-2xl text-[#1F1F22]">
                  Our engineers typically respond within 2 working days.
                </h3>
              </div>
              <Link
                to="/#contact"
                data-testid="faq-cta-contact"
                className="v-btn-primary"
              >
                Ask our team →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
