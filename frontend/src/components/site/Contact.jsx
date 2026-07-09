import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { ArrowRight, Mail, Phone, MapPin } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const INDUSTRIES = [
  "Power Generation",
  "HVAC / District Cooling",
  "Petrochemical / Refining",
  "Steel / Metals",
  "Sugar / Paper",
  "Chemical / Fertilizer",
  "Other",
];

const initial = {
  name: "",
  company: "",
  email: "",
  phone: "",
  industry: "",
  message: "",
};

export default function Contact() {
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.company || !form.email || !form.phone || !form.industry) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${API}/inquiries`, form);
      toast.success("Request received. Our engineering team will contact you shortly.");
      setForm(initial);
    } catch (err) {
      const detail = err?.response?.data?.detail;
      const msg = Array.isArray(detail)
        ? detail.map((d) => d.msg).join(" · ")
        : detail || "Something went wrong. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" data-testid="contact-section" className="relative bg-[#F2F1ED] text-[#1F1F22]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10 lg:py-14 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <div className="overline mb-4">06 / Request a Demo</div>
          <h2 className="font-display font-black tracking-[-0.03em] text-4xl lg:text-5xl text-[#1F1F22] leading-[1.02]">
            Send us your condenser. <br />
            <span className="text-[#B45309]">We&apos;ll size a system.</span>
          </h2>
          <p className="mt-6 text-[#6B6E6C] leading-relaxed max-w-md">
            Share your plant details and one of our engineers will get back with a tailored
            technical proposal — typically within 2 working days.
          </p>

          <div className="mt-10 space-y-4">
            <ContactLine
              icon={Mail}
              label="Email"
              value="contactus@vulcanindustriesindia.com"
              href="mailto:contactus@vulcanindustriesindia.com"
              testid="contact-email"
            />
            <ContactLine
              icon={Phone}
              label="Phone"
              value="+91 · Call our sales desk"
              testid="contact-phone"
            />
            <ContactLine
              icon={MapPin}
              label="Head Office"
              value="Vulcan Industries India"
              testid="contact-address"
            />
          </div>
        </div>

        <form
          onSubmit={submit}
          noValidate
          data-testid="contact-form"
          className="lg:col-span-7 border border-[#D9D6CE] bg-white p-6 lg:p-10"
        >
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Full name" required>
              <input
                data-testid="input-name"
                type="text"
                className="v-input"
                value={form.name}
                onChange={update("name")}
                placeholder="e.g. Anil Sharma"
                required
              />
            </Field>
            <Field label="Company" required>
              <input
                data-testid="input-company"
                type="text"
                className="v-input"
                value={form.company}
                onChange={update("company")}
                placeholder="Your organisation"
                required
              />
            </Field>
            <Field label="Work email" required>
              <input
                data-testid="input-email"
                type="email"
                className="v-input"
                value={form.email}
                onChange={update("email")}
                placeholder="you@company.com"
                required
              />
            </Field>
            <Field label="Phone" required>
              <input
                data-testid="input-phone"
                type="tel"
                className="v-input"
                value={form.phone}
                onChange={update("phone")}
                placeholder="+91 98xxxxxxxx"
                required
              />
            </Field>
            <Field label="Industry" required className="sm:col-span-2">
              <select
                data-testid="input-industry"
                className="v-input"
                value={form.industry}
                onChange={update("industry")}
                required
              >
                <option value="" disabled>Select industry…</option>
                {INDUSTRIES.map((it) => (
                  <option key={it} value={it}>
                    {it}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Tell us about your condenser" className="sm:col-span-2">
              <textarea
                data-testid="input-message"
                rows={4}
                className="v-input resize-none"
                value={form.message}
                onChange={update("message")}
                placeholder="Capacity, tube material, water source, current cleaning method…"
              />
            </Field>
          </div>

          <div className="dashed-divider my-6" />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-xs text-[#8A8A80] max-w-md">
              By submitting, you agree that Vulcan Industries may contact you about VOCCSYS. We
              never share your details.
            </p>
            <button
              type="submit"
              disabled={submitting}
              data-testid="submit-inquiry"
              className="v-btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Sending…" : "Request Demo"}
              <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({ label, required, className = "", children }) {
  return (
    <label className={`block ${className}`}>
      <span className="overline no-lead block mb-2">
        {label}
        {required && <span className="text-[#B45309] ml-1">*</span>}
      </span>
      {children}
    </label>
  );
}

function ContactLine({ icon: Icon, label, value, href, testid }) {
  const inner = (
    <div className="contact-line flex items-start gap-4 group">
      <div className="v-icon-box w-10 h-10 flex items-center justify-center shrink-0">
        <Icon size={16} strokeWidth={1.5} className="text-[#B45309]" />
      </div>
      <div>
        <div className="overline">{label}</div>
        <div className="mt-1 text-[#1F1F22] text-sm group-hover:text-[#B45309] transition-colors break-all">
          {value}
        </div>
      </div>
    </div>
  );
  if (href) {
    return (
      <a href={href} data-testid={testid} className="block">
        {inner}
      </a>
    );
  }
  return <div data-testid={testid}>{inner}</div>;
}
