import { useState } from "react";
import { useAuth, DEMO_ACCOUNTS } from "../lib/auth-context";
import { Target, ArrowRight, Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHints, setShowHints] = useState(false);

  const handleLogin = async () => {
    setError(null);
    if (!email.trim()) { setError("Email is required."); return; }
    if (!password) { setError("Password is required."); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const result = login(email, password);
    if (!result.success) setError(result.error ?? "Login failed.");
    setLoading(false);
  };

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("demo1234");
    setError(null);
  };

  const ROLE_BADGE_COLORS: Record<string, { bg: string; color: string }> = {
    superadmin: { bg: "#2a1f00", color: "#ffe500" },
    admin:      { bg: "#1a2030", color: "#60a5fa" },
    client:     { bg: "#0d2b1a", color: "#4ade80" },
    team:       { bg: "#2d0f2f", color: "#c084fc" },
    consultant: { bg: "#1a1500", color: "#fbbf24" },
  };

  const ROLE_DISPLAY: Record<string, string> = {
    superadmin: "Super Admin",
    admin:      "Admin",
    client:     "Client",
    team:       "Team",
    consultant: "Consultant",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      {/* Background glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] opacity-8 pointer-events-none"
        style={{ backgroundColor: "#ffe500" }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "#ffe500" }}
          >
            <Target size={26} style={{ color: "#0a0a0a" }} />
          </div>
          <h1 className="text-3xl font-black mb-1" style={{ color: "#ffffff" }}>
            Extraordinary
          </h1>
          <p className="text-base font-semibold" style={{ color: "#ffe500" }}>
            Profile OS
          </p>
          <p className="text-sm mt-2" style={{ color: "#737373" }}>
            EB1A Case Management Platform
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{ backgroundColor: "#111111", border: "1px solid #222222" }}
        >
          <h2 className="text-lg font-bold mb-6" style={{ color: "#ffffff" }}>
            Sign in to your account
          </h2>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: "#737373" }}>
              Email
            </label>
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

          {/* Password */}
          <div className="mb-6">
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: "#737373" }}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
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

          {/* Error */}
          {error && (
            <div
              className="mb-4 px-4 py-2.5 rounded-lg text-sm font-medium"
              style={{ backgroundColor: "#2d0f0f", color: "#f87171", border: "1px solid #3d1515" }}
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
            style={{
              backgroundColor: "#ffe500",
              color: "#0a0a0a",
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? (
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <>Sign In <ArrowRight size={16} /></>
            )}
          </button>
        </div>

        {/* Demo accounts hint */}
        <div
          className="mt-4 rounded-xl overflow-hidden"
          style={{ border: "1px solid #1f1f1f", backgroundColor: "#0d0d0d" }}
        >
          <button
            onClick={() => setShowHints(!showHints)}
            className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold transition-colors"
            style={{ color: "#737373" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")}
            onMouseLeave={e => (e.currentTarget.style.color = "#737373")}
          >
            <span>Demo accounts — click to autofill</span>
            {showHints ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showHints && (
            <div className="px-3 pb-3 space-y-1.5" style={{ borderTop: "1px solid #1f1f1f" }}>
              <p className="text-[10px] pt-3 pb-1" style={{ color: "#4a4a4a" }}>Any password works (e.g. "demo1234")</p>
              {Object.entries(DEMO_ACCOUNTS).map(([demoEmail, account]) => {
                const badge = ROLE_BADGE_COLORS[account.role] ?? { bg: "#1a1a1a", color: "#737373" };
                return (
                  <button
                    key={demoEmail}
                    onClick={() => fillDemo(demoEmail)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all"
                    style={{ backgroundColor: "#111111", border: "1px solid #1f1f1f" }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "#ffe500")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "#1f1f1f")}
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: "#ffffff" }}>{account.name}</p>
                      <p className="text-[10px] truncate" style={{ color: "#737373" }}>{demoEmail}</p>
                    </div>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full ml-2 shrink-0"
                      style={{ backgroundColor: badge.bg, color: badge.color }}
                    >
                      {ROLE_DISPLAY[account.role] ?? account.role}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
