import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Lock } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
export const ADMIN_TOKEN_KEY = "vocc_admin_token";

function formatApiErrorDetail(detail) {
  if (detail == null) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail.map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e))).join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Admin Sign In — VOCCSYS";
    if (localStorage.getItem(ADMIN_TOKEN_KEY)) navigate("/admin", { replace: true });
  }, [navigate]);

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Enter your email and password.");
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await axios.post(`${API}/auth/login`, { email, password });
      localStorage.setItem(ADMIN_TOKEN_KEY, data.access_token);
      navigate("/admin", { replace: true });
    } catch (err) {
      toast.error(formatApiErrorDetail(err?.response?.data?.detail));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      data-testid="admin-login-page"
      className="min-h-screen bg-[#F2F1ED] text-[#1F1F22] flex flex-col"
    >
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <Link
            to="/"
            data-testid="admin-back-home"
            className="inline-flex items-center gap-2 text-sm text-[#6B6E6C] hover:text-[#B45309] transition-colors mb-8"
          >
            <ArrowLeft size={14} /> Back to voccsys.com
          </Link>

          <form
            onSubmit={submit}
            noValidate
            data-testid="admin-login-form"
            className="border border-[#D9D6CE] bg-white p-8 lg:p-10"
          >
            <div className="v-icon-box w-11 h-11 flex items-center justify-center mb-6">
              <Lock size={17} strokeWidth={1.5} className="text-[#B45309]" />
            </div>
            <div className="overline mb-3">Internal · Admin</div>
            <h1 className="font-display font-black tracking-[-0.03em] text-3xl text-[#1F1F22]">
              Sign in to enquiries
            </h1>
            <p className="mt-3 text-sm text-[#6B6E6C] leading-relaxed">
              Private dashboard for the Vulcan Industries team.
            </p>

            <div className="mt-8 space-y-5">
              <label className="block">
                <span className="overline no-lead block mb-2">
                  Email <span className="text-[#B45309] ml-1">*</span>
                </span>
                <input
                  type="email"
                  className="v-input"
                  data-testid="admin-email-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@vulcanindustriesindia.com"
                  autoComplete="username"
                />
              </label>
              <label className="block">
                <span className="overline no-lead block mb-2">
                  Password <span className="text-[#B45309] ml-1">*</span>
                </span>
                <input
                  type="password"
                  className="v-input"
                  data-testid="admin-password-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              data-testid="admin-login-submit"
              className="v-btn-primary w-full justify-center mt-8 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Signing in…" : "Sign in"}
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
