import { useState } from "react";
import { useAuth } from "../lib/auth-context";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    if (!email.trim()) { setError("Email is required."); return; }
    if (!password) { setError("Password is required."); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const result = await login(email, password);
    if (!result.success) setError(result.error ?? "Login failed.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: "#0a0a0a" }}>
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] opacity-8 pointer-events-none"
        style={{ backgroundColor: "#ffe500" }}
      />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <img
            src="/infigrowth-logo-icon.png"
            alt="Infigrowth Media logo"
            className="w-16 h-16 rounded-2xl object-cover mx-auto mb-4"
          />
          <h1
            className="text-3xl font-black mb-3"
            style={{
              color: "#ffffff",
              fontFamily: "Arial Black, Inter, system-ui, sans-serif",
              textShadow: "0 1px 0 #0a0a0a, 0 0 18px rgba(255, 229, 0, 0.2)",
              WebkitTextStroke: "0.4px rgba(10,10,10,0.8)",
            }}
          >
            Infigrowth <span style={{ color: "#ffe500", textShadow: "0 0 22px rgba(255, 229, 0, 0.45)" }}>Media</span>
          </h1>
          <div className="flex items-center justify-center gap-4 mt-2">
            <span className="h-px w-10" style={{ backgroundColor: "#d7a900" }} />
            <p
              className="text-xs uppercase font-semibold"
              style={{
                color: "#a3a3a3",
                letterSpacing: "0.32em",
                fontFamily: "Inter, Arial, system-ui, sans-serif",
                textShadow: "0 1px 0 #000, 0 0 12px rgba(255,255,255,0.2)",
              }}
            >
              EB1A Growth Tracker
            </p>
            <span className="h-px w-10" style={{ backgroundColor: "#d7a900" }} />
          </div>
        </div>

        <div className="rounded-2xl p-8" style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
          <h2 className="text-lg font-bold mb-6" style={{ color: "#ffffff" }}>Sign in to your account</h2>

          <div className="mb-4">
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: "#737373" }}>Email</label>
            <input
              type="email"
              placeholder="you@epros.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null); }}
              className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all"
              style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", color: "#f5f5f5" }}
              onFocus={e => (e.currentTarget.style.borderColor = "#ffe500")}
              onBlur={e => (e.currentTarget.style.borderColor = error ? "#ef4444" : "#2a2a2a")}
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: "#737373" }}>Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null); }}
                className="w-full px-4 py-3 pr-11 rounded-xl text-sm focus:outline-none transition-all"
                style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", color: "#f5f5f5" }}
                onFocus={e => (e.currentTarget.style.borderColor = "#ffe500")}
                onBlur={e => (e.currentTarget.style.borderColor = error ? "#ef4444" : "#2a2a2a")}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: "#737373" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")}
                onMouseLeave={e => (e.currentTarget.style.color = "#737373")}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 px-4 py-2.5 rounded-lg text-sm font-medium" style={{ backgroundColor: "#2d0f0f", color: "#f87171", border: "1px solid #3d1515" }}>
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
            style={{ backgroundColor: "#ffe500", color: "#0a0a0a", opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Signing in..." : <>Sign In <ArrowRight size={16} /></>}
          </button>
        </div>
      </div>
    </div>
  );
}
