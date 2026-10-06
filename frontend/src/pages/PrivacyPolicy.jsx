import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";

const EFFECTIVE_DATE = "9 December 2025";

const SECTIONS = [
  {
    id: "intro",
    title: "1. Introduction",
    body: [
      "This Privacy Policy explains how Vulcan Industries India (\u201cVulcan Industries\u201d, \u201cwe\u201d, \u201cus\u201d or \u201cour\u201d) collects, uses, stores and shares personal information when you visit voccsys.com (the \u201cSite\u201d) or interact with us about VOCCSYS\u2122 \u2014 our online condenser cleaning system.",
      "We are committed to protecting your privacy and handling your information transparently and responsibly. By using the Site or submitting a quote or demo request, you agree to the practices described in this policy.",
    ],
  },
  {
    id: "collect",
    title: "2. Information We Collect",
    body: [
      "We collect only the information you choose to provide and a minimal set of technical data required to operate the Site.",
    ],
    list: [
      "Contact information you submit through our \u201cRequest Quote\u201d / \u201cRequest Demo\u201d form \u2014 name, company, work email, phone number, industry, and any message you send.",
      "Email correspondence \u2014 any messages you send to contactus@vulcanindustriesindia.com.",
      "Technical information automatically logged by our hosting provider \u2014 your IP address, browser type, operating system, referring URL and pages viewed. This is standard server-log data.",
      "Cookies and similar technologies strictly necessary for the Site to function. We do not use advertising cookies.",
    ],
  },
  {
    id: "use",
    title: "3. How We Use Your Information",
    body: [],
    list: [
      "To respond to your quote, demo or technical inquiry.",
      "To prepare an engineered proposal and send relevant technical documentation.",
      "To follow up on commercial discussions and provide after-sales support.",
      "To maintain, secure and improve the Site (operational logs, abuse prevention).",
      "To comply with applicable legal, regulatory and tax obligations.",
    ],
  },
  {
    id: "basis",
    title: "4. Legal Basis for Processing",
    body: [
      "Depending on where you reside, we process your personal information on one or more of the following legal bases: your consent (when you submit the form), performance of a contract or steps taken prior to entering into a contract with you, our legitimate interests in operating and promoting our business, and our legal obligations.",
    ],
  },
  {
    id: "share",
    title: "5. Sharing and Disclosure",
    body: [
      "We do not sell or rent your personal information. We only share it in the limited circumstances below:",
    ],
    list: [
      "With trusted service providers who help us operate the Site and our business (for example, hosting providers, email providers, CRM tools) \u2014 under appropriate confidentiality and data-protection commitments.",
      "With professional advisers (lawyers, auditors, accountants) when strictly necessary and bound by confidentiality.",
      "If required to do so by law, legal process, or to protect the rights, property or safety of Vulcan Industries, our customers or others.",
      "In connection with a business transaction (for example, a merger, acquisition or asset sale), where personal information may transfer as part of the business, subject to continuing privacy protections.",
    ],
  },
  {
    id: "retention",
    title: "6. Data Retention",
    body: [
      "We retain the contact details you submit only for as long as needed to pursue the inquiry and, where a commercial relationship develops, for the duration of that relationship plus the period required for warranty, legal and tax purposes. Server logs are retained for a short rolling window and then overwritten.",
    ],
  },
  {
    id: "security",
    title: "7. Security",
    body: [
      "We use reasonable administrative, technical and physical safeguards to protect personal information against loss, misuse, unauthorised access, disclosure, alteration and destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.",
    ],
  },
  {
    id: "rights",
    title: "8. Your Rights",
    body: [
      "Depending on your location, you may have rights to:",
    ],
    list: [
      "Access the personal information we hold about you.",
      "Request correction of inaccurate or incomplete information.",
      "Request deletion of your information, subject to legal retention requirements.",
      "Object to or restrict certain processing.",
      "Withdraw consent at any time, where processing is based on consent.",
      "Lodge a complaint with your local data protection authority.",
    ],
    tail: "To exercise any of these rights, email us at contactus@vulcanindustriesindia.com. We will respond within a reasonable timeframe and may ask you to verify your identity first.",
  },
  {
    id: "cookies",
    title: "9. Cookies & Analytics",
    body: [
      "The Site uses only cookies and local storage strictly necessary for its basic functioning (for example, remembering your form input while you type). We do not deploy advertising, cross-site tracking, or third-party marketing cookies. Where we use lightweight privacy-respecting analytics, we rely on aggregated and de-identified data only.",
    ],
  },
  {
    id: "children",
    title: "10. Children\u2019s Privacy",
    body: [
      "The Site is intended for business audiences and is not directed to children under 18. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us and we will delete it.",
    ],
  },
  {
    id: "intl",
    title: "11. International Data Transfers",
    body: [
      "Vulcan Industries India is based in India. If you access the Site from outside India, your information may be transferred to, stored and processed in India or in other countries where our service providers operate. By using the Site, you consent to such transfers. Where legally required, we implement appropriate safeguards (for example, standard contractual clauses) for cross-border transfers.",
    ],
  },
  {
    id: "changes",
    title: "12. Changes to This Policy",
    body: [
      "We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements or other factors. We will post the updated policy on this page and update the \u201cEffective Date\u201d above. Material changes will be highlighted on the Site.",
    ],
  },
  {
    id: "contact",
    title: "13. Contact Us",
    body: [
      "If you have questions, concerns, or requests related to this Privacy Policy or your personal information, please contact:",
    ],
    tail: "Vulcan Industries India \u2014 contactus@vulcanindustriesindia.com",
  },
];

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = "Privacy Policy — VOCCSYS by Vulcan Industries India";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div data-testid="privacy-page" className="relative z-10 bg-[#F2F1ED] min-h-screen">
      <Header />
      <main>
        <section className="relative bg-[#F2F1ED] text-[#1F1F22]">
          <div className="max-w-[1000px] mx-auto px-6 lg:px-10 py-10 lg:py-14">
            <Link
              to="/"
              data-testid="back-to-home"
              className="inline-flex items-center gap-2 text-sm text-[#6B6E6C] hover:text-[#B45309] transition-colors mb-8"
            >
              <ArrowLeft size={14} /> Back to voccsys.com
            </Link>

            <span className="overline">Legal · Privacy Policy</span>

            <h1 className="mt-4 font-display font-black tracking-[-0.03em] text-4xl lg:text-5xl text-[#1F1F22] leading-[1.02]">
              Privacy Policy
            </h1>

            <p className="mt-4 text-sm font-mono text-[#6B6E6C]">
              Effective date: <span className="text-[#1F1F22]">{EFFECTIVE_DATE}</span>
            </p>

            <div className="dashed-divider my-8" />

            {/* Table of contents */}
            <nav
              aria-label="Policy sections"
              data-testid="privacy-toc"
              className="mb-10 border border-[#D9D6CE] bg-white p-6"
            >
              <div className="overline mb-4">On this page</div>
              <ol className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="text-[#3D3F3E] hover:text-[#B45309] transition-colors"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            {/* Sections */}
            <article className="space-y-10">
              {SECTIONS.map((s) => (
                <section key={s.id} id={s.id} data-testid={`privacy-${s.id}`}>
                  <h2 className="font-display font-bold text-2xl lg:text-3xl text-[#1F1F22] tracking-[-0.02em] mb-4">
                    {s.title}
                  </h2>
                  {s.body?.map((p, i) => (
                    <p key={i} className="text-[#3D3F3E] text-base leading-relaxed mb-4">
                      {p}
                    </p>
                  ))}
                  {s.list && (
                    <ul className="tick-list space-y-3 text-[#3D3F3E] text-base leading-relaxed">
                      {s.list.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {s.tail && (
                    <p className="mt-5 text-[#3D3F3E] text-base leading-relaxed">
                      {s.tail}
                    </p>
                  )}
                </section>
              ))}
            </article>

            <div className="dashed-divider my-10" />

            <p className="text-xs text-[#8A8A80] font-mono">
              © {new Date().getFullYear()} Vulcan Industries India · VOCCSYS™ ·
              All rights reserved.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
