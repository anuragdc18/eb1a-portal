import { Download, FileBarChart, Calendar } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { ProgressBar, CircularProgress } from "../components/ui/progress";
import { MONTHLY_ACTIVITY } from "../lib/portal-data";

const PROGRESS_DATA = [
  { month: "Jan", score: 25 }, { month: "Feb", score: 32 }, { month: "Mar", score: 41 },
  { month: "Apr", score: 54 }, { month: "May", score: 65 }, { month: "Jun", score: 72 },
];

const PIE_DATA = [
  { name: "Strong", value: 4, color: "#4ade80" },
  { name: "Moderate", value: 3, color: "#fbbf24" },
  { name: "Weak", value: 2, color: "#f87171" },
];

const TOOLTIP_STYLE = {
  backgroundColor: "#1a1a1a",
  border: "1px solid #2a2a2a",
  borderRadius: 8,
  color: "#f5f5f5",
  fontSize: 11,
};

const CARD = { backgroundColor: "#111111", border: "1px solid #1f1f1f", borderRadius: 16, padding: 20 } as React.CSSProperties;

export default function ReportsPage() {
  return (
    <div className="p-6 space-y-5 overflow-y-auto flex-1" style={{ backgroundColor: "#0a0a0a" }}>
      {/* Header banner */}
      <div
        className="rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        style={{ background: "linear-gradient(135deg, #1a1400 0%, #0a0a0a 100%)", border: "1px solid #2a2000" }}
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileBarChart size={20} style={{ color: "#ffe500" }} />
            <h2 className="text-lg font-black" style={{ color: "#ffffff" }}>Monthly Progress Report</h2>
          </div>
          <p className="text-sm" style={{ color: "#737373" }}>June 2025 — Dr. Arjun Mehta · EB1A Profile Building</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="px-3 py-1 text-xs font-semibold flex items-center gap-1 rounded-full" style={{ backgroundColor: "#1a1400", color: "#ffe500", border: "1px solid #2a2000" }}>
              <Calendar size={11} /> Generated: Jul 1, 2025
            </span>
          </div>
        </div>
        <button
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl"
          style={{ backgroundColor: "#ffe500", color: "#0a0a0a" }}
        >
          <Download size={16} /> Download PDF
        </button>
      </div>

      {/* KPIs + trend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div style={CARD}>
          <h3 className="text-sm font-bold mb-4" style={{ color: "#ffffff" }}>EB1A Readiness</h3>
          <div className="flex flex-col items-center gap-4">
            <CircularProgress value={72} size={110} strokeWidth={10} label="Overall" />
            <CircularProgress value={78} size={110} strokeWidth={10} label="EB1A Score" />
          </div>
        </div>
        <div className="md:col-span-2" style={CARD}>
          <h3 className="text-sm font-bold mb-1" style={{ color: "#ffffff" }}>Progress Trend</h3>
          <p className="text-xs mb-4" style={{ color: "#737373" }}>EB1A score over time</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={PROGRESS_DATA}>
              <defs>
                <linearGradient id="pGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffe500" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ffe500" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#737373" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#737373" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Area type="monotone" dataKey="score" stroke="#ffe500" strokeWidth={2.5} fill="url(#pGrad)" name="Score" dot={{ fill: "#ffe500", r: 4, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie + bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div style={CARD}>
          <h3 className="text-sm font-bold mb-4" style={{ color: "#ffffff" }}>Criteria Strength Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={PIE_DATA} cx="50%" cy="50%" outerRadius={75} dataKey="value">
                {PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: "#737373" }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={CARD}>
          <h3 className="text-sm font-bold mb-1" style={{ color: "#ffffff" }}>Monthly Deliverables</h3>
          <p className="text-xs mb-4" style={{ color: "#737373" }}>June 2025 highlights</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={[MONTHLY_ACTIVITY[5]]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#737373" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#737373" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="pr" name="PR" fill="#ffe500" radius={[4, 4, 0, 0]} />
              <Bar dataKey="papers" name="Papers" fill="#60a5fa" radius={[4, 4, 0, 0]} />
              <Bar dataKey="awards" name="Awards" fill="#4ade80" radius={[4, 4, 0, 0]} />
              <Bar dataKey="podcasts" name="Podcasts" fill="#c084fc" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Service progress */}
      <div style={CARD}>
        <h3 className="text-sm font-bold mb-1" style={{ color: "#ffffff" }}>Service-wise Progress</h3>
        <p className="text-xs mb-5" style={{ color: "#737373" }}>Completion percentages — June 2025</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
          {[
            { name: "Digital PR", value: 65 },
            { name: "LinkedIn", value: 85 },
            { name: "Awards", value: 40 },
            { name: "Award Jury Work", value: 55 },
            { name: "Research Papers", value: 90 },
            { name: "Memberships", value: 75 },
            { name: "Webinars / Lectures", value: 70 },
            { name: "Website & Blog", value: 80 },
            { name: "Book Publishing", value: 30 },
            { name: "Podcasts", value: 50 },
          ].map((s) => (
            <div key={s.name}>
              <div className="flex justify-between text-xs mb-1.5">
                <span style={{ color: "#a3a3a3" }}>{s.name}</span>
                <span className="font-bold" style={{ color: "#ffe500" }}>{s.value}%</span>
              </div>
              <ProgressBar value={s.value} size="sm" />
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div style={CARD}>
        <h3 className="text-sm font-bold mb-4" style={{ color: "#ffffff" }}>Key Achievements — June 2025</h3>
        <div className="space-y-2">
          {[
            { icon: "🏆", text: "NeurIPS Best Paper Award certificate uploaded and approved by attorney" },
            { icon: "📰", text: "8 PR articles published this month (TechCrunch, VentureBeat, Forbes in progress)" },
            { icon: "📄", text: "Nature Machine Intelligence paper officially published and added to criteria evidence" },
            { icon: "🎤", text: "Keynote at World Economic Forum — 3,200 attendees. Certificate uploaded." },
            { icon: "🏛️", text: "ACM Senior Membership renewed through 2027. IEEE membership active." },
          ].map((a, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ backgroundColor: "#1a1a1a" }}>
              <span className="text-xl shrink-0">{a.icon}</span>
              <p className="text-xs" style={{ color: "#a3a3a3" }}>{a.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Next steps */}
      <div style={CARD}>
        <h3 className="text-sm font-bold mb-4" style={{ color: "#ffffff" }}>Next Steps — July 2025</h3>
        <div className="space-y-1">
          {[
            { priority: "High", text: "Submit Forbes op-ed draft by July 15", owner: "Meera Joshi" },
            { priority: "High", text: "Apply for MIT Technology Review 35 Under 35 (deadline Jul 31)", owner: "Rahul Verma" },
            { priority: "High", text: "Upload salary certificate for attorney review", owner: "Client" },
            { priority: "Medium", text: "Start ISBN registration for book project", owner: "Rahul Verma" },
            { priority: "Low", text: "Record podcast episode 2", owner: "Rahul Verma" },
          ].map((t, i) => {
            const prStyle =
              t.priority === "High" ? { bg: "#2d0f0f", color: "#f87171" } :
              t.priority === "Medium" ? { bg: "#1f1400", color: "#fbbf24" } :
              { bg: "#1a1a1a", color: "#737373" };
            return (
              <div key={i} className="flex items-center gap-3 py-2.5" style={{ borderBottom: i < 4 ? "1px solid #1a1a1a" : "none" }}>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: prStyle.bg, color: prStyle.color }}>
                  {t.priority}
                </span>
                <p className="text-xs flex-1" style={{ color: "#a3a3a3" }}>{t.text}</p>
                <span className="text-[10px] shrink-0" style={{ color: "#4a4a4a" }}>{t.owner}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
