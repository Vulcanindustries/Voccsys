import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { ArrowLeft, LogOut, Mail, Phone, RefreshCw, Trash2 } from "lucide-react";
import { ADMIN_TOKEN_KEY } from "./AdminLogin";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const STATUS = {
  new: { label: "New", cls: "bg-[#B45309] text-white border-[#B45309]" },
  contacted: { label: "Contacted", cls: "bg-white text-[#1F1F22] border-[#D9D6CE]" },
  closed: { label: "Closed", cls: "bg-[#EAE8E2] text-[#6B6E6C] border-[#D9D6CE]" },
};
const FILTERS = ["all", "new", "contacted", "closed"];

function formatApiErrorDetail(detail) {
  if (detail == null) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail.map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e))).join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState(null);
  const [filter, setFilter] = useState("all");

  const authHeaders = useCallback(() => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    return token ? { Authorization: `Bearer ${token}` } : null;
  }, []);

  const handleAuthError = useCallback(() => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    navigate("/admin/login", { replace: true });
  }, [navigate]);

  const load = useCallback(async () => {
    const headers = authHeaders();
    if (!headers) return handleAuthError();
    try {
      const { data } = await axios.get(`${API}/inquiries`, { headers });
      setInquiries(data);
    } catch (err) {
      if (err?.response?.status === 401) return handleAuthError();
      toast.error(formatApiErrorDetail(err?.response?.data?.detail));
      setInquiries([]);
    }
  }, [authHeaders, handleAuthError]);

  useEffect(() => {
    document.title = "Enquiries — VOCCSYS Admin";
    load();
  }, [load]);

  const logout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    navigate("/admin/login", { replace: true });
  };

  const setStatus = async (id, status) => {
    try {
      await axios.patch(`${API}/inquiries/${id}`, { status }, { headers: authHeaders() });
      setInquiries((list) => list.map((it) => (it.id === id ? { ...it, status } : it)));
      toast.success(`Marked as ${STATUS[status].label.toLowerCase()}.`);
    } catch (err) {
      if (err?.response?.status === 401) return handleAuthError();
      toast.error(formatApiErrorDetail(err?.response?.data?.detail));
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this enquiry permanently?")) return;
    try {
      await axios.delete(`${API}/inquiries/${id}`, { headers: authHeaders() });
      setInquiries((list) => list.filter((it) => it.id !== id));
      toast.success("Enquiry deleted.");
    } catch (err) {
      if (err?.response?.status === 401) return handleAuthError();
      toast.error(formatApiErrorDetail(err?.response?.data?.detail));
    }
  };

  const counts = useMemo(() => {
    const c = { all: 0, new: 0, contacted: 0, closed: 0 };
    (inquiries || []).forEach((it) => {
      c.all += 1;
      c[it.status || "new"] = (c[it.status || "new"] || 0) + 1;
    });
    return c;
  }, [inquiries]);

  const visible = useMemo(
    () => (inquiries || []).filter((it) => filter === "all" || (it.status || "new") === filter),
    [inquiries, filter]
  );

  return (
    <div data-testid="admin-dashboard" className="min-h-screen bg-[#F2F1ED] text-[#1F1F22]">
      <header className="sticky top-0 z-50 bg-[#F2F1ED] border-b border-[#D9D6CE]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-6 bg-[#B45309]" />
            <span className="font-display font-black tracking-[-0.02em] text-lg">VOCCSYS</span>
            <span className="overline no-lead hidden sm:inline">Enquiries · Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={load}
              data-testid="admin-refresh-button"
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-mono uppercase tracking-widest border border-[#D9D6CE] text-[#3D3F3E] hover:border-[#B45309] hover:text-[#B45309] transition-colors"
            >
              <RefreshCw size={13} /> Refresh
            </button>
            <button
              onClick={logout}
              data-testid="admin-logout-button"
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-mono uppercase tracking-widest border border-[#D9D6CE] text-[#3D3F3E] hover:border-[#B45309] hover:text-[#B45309] transition-colors"
            >
              <LogOut size={13} /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10">
        <Link
          to="/"
          data-testid="admin-back-site"
          className="inline-flex items-center gap-2 text-sm text-[#6B6E6C] hover:text-[#B45309] transition-colors mb-8"
        >
          <ArrowLeft size={14} /> View site
        </Link>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="overline mb-2">Inbox</div>
            <h1 className="font-display font-black tracking-[-0.03em] text-3xl lg:text-4xl">
              Contact enquiries
            </h1>
          </div>
          <nav className="flex flex-wrap gap-2" data-testid="admin-filter-tabs">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                data-testid={`admin-filter-${f}`}
                className={`px-3 py-1.5 text-xs font-mono uppercase tracking-widest border transition-colors ${
                  filter === f
                    ? "bg-[#1F1F22] text-white border-[#1F1F22]"
                    : "border-[#D9D6CE] text-[#3D3F3E] hover:border-[#B45309] hover:text-[#B45309]"
                }`}
              >
                {f} · {counts[f] ?? 0}
              </button>
            ))}
          </nav>
        </div>

        <div className="dashed-divider my-8" />

        {inquiries === null ? (
          <p className="text-sm text-[#6B6E6C]" data-testid="admin-loading">Loading enquiries…</p>
        ) : visible.length === 0 ? (
          <div className="border border-[#D9D6CE] bg-white p-10 text-center" data-testid="admin-empty">
            <p className="font-display font-bold text-lg">No enquiries here yet.</p>
            <p className="mt-2 text-sm text-[#6B6E6C]">
              New contact form submissions land here and in your email inbox.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {visible.map((it) => (
              <article
                key={it.id}
                data-testid={`inquiry-card-${it.id}`}
                className="border border-[#D9D6CE] bg-white p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-display font-bold text-lg text-[#1F1F22]">{it.name}</h3>
                      <span className="text-sm text-[#6B6E6C]">{it.company}</span>
                      <span
                        data-testid={`inquiry-status-${it.id}`}
                        className={`px-2 py-0.5 text-[11px] font-mono uppercase tracking-widest border ${STATUS[it.status || "new"].cls}`}
                      >
                        {STATUS[it.status || "new"].label}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-[#3D3F3E]">
                      <a href={`mailto:${it.email}`} className="inline-flex items-center gap-1.5 hover:text-[#B45309] transition-colors">
                        <Mail size={13} className="text-[#B45309]" /> {it.email}
                      </a>
                      <a href={`tel:${it.phone}`} className="inline-flex items-center gap-1.5 hover:text-[#B45309] transition-colors">
                        <Phone size={13} className="text-[#B45309]" /> {it.phone}
                      </a>
                      <span className="text-[#6B6E6C]">{it.industry}</span>
                      <span className="text-[#8A8A80] text-xs font-mono">
                        {new Date(it.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                      </span>
                    </div>
                    {it.message && (
                      <p className="mt-3 text-sm text-[#3D3F3E] leading-relaxed whitespace-pre-line border-l-2 border-[#D9D6CE] pl-4">
                        {it.message}
                      </p>
                    )}
                  </div>
                  <div className="flex lg:flex-col gap-2 shrink-0">
                    {(it.status || "new") !== "contacted" && (
                      <button
                        onClick={() => setStatus(it.id, "contacted")}
                        data-testid={`inquiry-contacted-${it.id}`}
                        className="px-3 py-1.5 text-xs font-mono uppercase tracking-widest border border-[#D9D6CE] text-[#3D3F3E] hover:border-[#B45309] hover:text-[#B45309] transition-colors"
                      >
                        Contacted
                      </button>
                    )}
                    {(it.status || "new") !== "closed" && (
                      <button
                        onClick={() => setStatus(it.id, "closed")}
                        data-testid={`inquiry-closed-${it.id}`}
                        className="px-3 py-1.5 text-xs font-mono uppercase tracking-widest border border-[#D9D6CE] text-[#3D3F3E] hover:border-[#B45309] hover:text-[#B45309] transition-colors"
                      >
                        Close
                      </button>
                    )}
                    {(it.status || "new") !== "new" && (
                      <button
                        onClick={() => setStatus(it.id, "new")}
                        data-testid={`inquiry-reopen-${it.id}`}
                        className="px-3 py-1.5 text-xs font-mono uppercase tracking-widest border border-[#D9D6CE] text-[#3D3F3E] hover:border-[#B45309] hover:text-[#B45309] transition-colors"
                      >
                        Reopen
                      </button>
                    )}
                    <button
                      onClick={() => remove(it.id)}
                      data-testid={`inquiry-delete-${it.id}`}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-widest border border-[#D9D6CE] text-[#8A8A80] hover:border-[#B45309] hover:text-[#B45309] transition-colors"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
