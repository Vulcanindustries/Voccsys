import "@/App.css";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import Landing from "@/pages/Landing";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import FAQ from "@/pages/FAQ";
import CaseStudy from "@/pages/CaseStudy";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";

function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

function App() {
  return (
    <div className="App min-h-screen bg-[#F2F1ED] text-[#1F1F22]" data-testid="app-root">
      <BrowserRouter>
        <ScrollToHash />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/case-study" element={<CaseStudy />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        theme="light"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#FFFFFF",
            border: "1px solid #D9D6CE",
            color: "#1F1F22",
            borderRadius: 2,
          },
        }}
      />
    </div>
  );
}

export default App;
