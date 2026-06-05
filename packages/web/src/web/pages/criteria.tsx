import { useState } from "react";
import { Target, Plus, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { StrengthBadge } from "../components/ui/badge";
import { ProgressBar } from "../components/ui/progress";
import { CRITERIA } from "../lib/mock-data";

const ATTORNEY_COLORS: Record<string, { bg: string; color: string }> = {
  "Not Reviewed": { bg: "#1a1a1a", color: "#737373" },
  "Under Review": { bg: "#0f1a2e", color: "#60a5fa" },
  "Approved":     { bg: "#0d2b1a", color: "#4ade80" },
  "Needs More":   { bg: "#2d0f0f", color: "#f87171" },
};

const CRITERION_ICONS: Record<string, string> = {
  "Published Material About Applicant": "📰",
  "Original Contribution": "💡",
  "Scholarly Articles": "📄",
  "Judging Work": "⚖️",
  "Memberships": "🏛️",
  "Awards": "🏆",
  "Leading or Critical Role": "👑",
  "High Salary / Compensation": "💰",
  "Commercial Success": "📈",
};

export default function CriteriaPage() {
  const [expanded, setExpanded] = useState<string | null>("cr1");
  const [selectedClient, setSelectedClient] = useState("Dr. Arjun Mehta");

  const CLIENTS_LIST = ["Dr. Arjun Mehta", "Sneha Kapoor", "Carlos Rivera"];
  const strong = CRITERIA.filter((c) => c.strength === "Strong").length;
  const moderate = CRITERIA.filter((c) => c.strength === "Moderate").length;
  const weak = CRITERIA.filter((c) => c.strength === "Weak").length;
  const totalEvidence = CRITERIA.reduce((a, c) => a + c.evidenceAvailable, 0);

  return (
    <div className="p-6 space-y-5 overflow-y-auto flex-1" style={{ backgroundColor: "#0a0a0a" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Target size={18} style={{ color: "#ffe500" }} />
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="text-sm font-semibold rounded-xl px-3 py-2 focus:outline-none"
            style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", color: "#ffffff" }}
          >
            {CLIENTS_LIST.map((c) => <option key={c}>{c}</option>)}
          </select>
          <span className="text-xs" style={{ color: "#4a4a4a" }}>EB1A Criteria Tracker</span>
        </div>
        <button
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-xl"
          style={{ backgroundColor: "#ffe500", color: "#0a0a0a" }}
        >
          <Plus size={15} /> Add Evidence
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Strong", value: strong, bg: "#0d2b1a", color: "#4ade80" },
          { label: "Moderate", value: moderate, bg: "#1f1400", color: "#fbbf24" },
          { label: "Weak", value: weak, bg: "#2d0f0f", color: "#f87171" },
          { label: "Total Evidence", value: totalEvidence, bg: "#0f1a2e", color: "#60a5fa" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl p-4" style={{ backgroundColor: s.bg, border: `1px solid ${s.color}22` }}>
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs mt-0.5" style={{ color: "#737373" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Criteria list */}
      <div className="space-y-2">
        {CRITERIA.map((c) => {
          const attyStyle = ATTORNEY_COLORS[c.attorneyStatus] ?? { bg: "#1a1a1a", color: "#737373" };
          return (
            <div
              key={c.id}
              className="rounded-2xl overflow-hidden"
              style={{ backgroundColor: "#111111", border: "1px solid #1f1f1f" }}
            >
              <div
                className="flex items-center gap-4 p-5 cursor-pointer transition-colors"
                onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#161616")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <div className="text-2xl shrink-0">{CRITERION_ICONS[c.name] ?? "📋"}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-sm" style={{ color: "#ffffff" }}>{c.name}</h3>
                    <StrengthBadge strength={c.strength} />
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-xs" style={{ color: "#4ade80" }}>{c.evidenceAvailable} docs</span>
                    {c.evidencePending > 0 && (
                      <span className="text-xs" style={{ color: "#fbbf24" }}>{c.evidencePending} pending</span>
                    )}
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: attyStyle.bg, color: attyStyle.color }}
                    >
                      {c.attorneyStatus}
                    </span>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-3">
                  <div className="hidden md:block w-28">
                    <ProgressBar
                      value={(c.evidenceAvailable / Math.max(c.evidenceAvailable + c.evidencePending, 1)) * 100}
                      size="sm"
                      color={c.strength === "Strong" ? "green" : c.strength === "Moderate" ? "amber" : "red"}
                    />
                  </div>
                  {expanded === c.id
                    ? <ChevronUp size={15} style={{ color: "#737373" }} />
                    : <ChevronDown size={15} style={{ color: "#737373" }} />
                  }
                </div>
              </div>

              {expanded === c.id && (
                <div className="px-5 pb-5 space-y-4" style={{ borderTop: "1px solid #1a1a1a" }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: "#4a4a4a" }}>Related Activities</p>
                      <div className="space-y-1.5">
                        {c.relatedActivities.map((a) => (
                          <div key={a} className="flex items-center gap-2 text-xs" style={{ color: "#a3a3a3" }}>
                            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "#ffe500" }} />
                            {a}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: "#4a4a4a" }}>Attorney Remarks</p>
                      <p className="text-xs p-3 rounded-xl" style={{ backgroundColor: "#1a1a1a", color: "#a3a3a3" }}>{c.remarks}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: "#4a4a4a" }}>Supporting Documents</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.from({ length: c.evidenceAvailable }).map((_, i) => (
                        <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: "#0f1a2e", color: "#60a5fa" }}>
                          <FileText size={11} /> Document {i + 1}
                        </div>
                      ))}
                      {Array.from({ length: c.evidencePending }).map((_, i) => (
                        <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: "#1f1400", color: "#fbbf24", border: "1px dashed #3a2600" }}>
                          <FileText size={11} /> Pending {i + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button className="px-3 py-1.5 text-xs font-bold rounded-lg" style={{ backgroundColor: "#ffe500", color: "#0a0a0a" }}>
                      Upload Evidence
                    </button>
                    {["View All Docs", "Send for Review"].map((label) => (
                      <button key={label} className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors" style={{ backgroundColor: "#1a1a1a", color: "#737373", border: "1px solid #2a2a2a" }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = "#ffe500")}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = "#2a2a2a")}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
