import { useState } from "react";
import { Download, FileBarChart, Calendar } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { ProgressBar, CircularProgress } from "../components/ui/progress";
import { CLIENTS, CRITERIA, TASKS, MONTHLY_ACTIVITY, getClientPayment } from "../lib/portal-data";

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

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default function ReportsPage() {
  const [period, setPeriod] = useState<"Weekly" | "Monthly">("Monthly");
  const [clientId, setClientId] = useState(CLIENTS[0]?.id ?? "");
  const selectedClient = CLIENTS.find((client) => client.id === clientId) ?? CLIENTS[0];
  const payment = selectedClient ? getClientPayment(selectedClient) : null;
  const clientTasks = selectedClient ? TASKS.filter((task) => task.clientId === selectedClient.id) : TASKS;
  const completedTasks = clientTasks.filter((task) => task.status === "Completed");
  const pendingTasks = clientTasks.filter((task) => task.status !== "Completed");

  function generatePdfReport() {
    const reportTitle = `${period} EB1A Progress Report`;
    const generated = new Date().toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
    const clientName = selectedClient?.name ?? "All Clients";
    const safeClientName = escapeHtml(clientName);
    const safeReportTitle = escapeHtml(reportTitle);
    const safeGenerated = escapeHtml(generated);
    const html = `
      <!doctype html>
      <html>
        <head>
          <title>${safeReportTitle}</title>
          <style>
            body { font-family: Arial, sans-serif; color: #111; padding: 32px; line-height: 1.45; }
            h1 { margin: 0 0 4px; font-size: 26px; }
            h2 { margin-top: 28px; font-size: 16px; border-bottom: 1px solid #ddd; padding-bottom: 8px; }
            .muted { color: #666; font-size: 12px; }
            .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 20px 0; }
            .card { border: 1px solid #ddd; border-radius: 10px; padding: 14px; }
            .label { font-size: 11px; color: #666; text-transform: uppercase; }
            .value { font-size: 22px; font-weight: 800; margin-top: 4px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border-bottom: 1px solid #eee; text-align: left; padding: 9px; font-size: 12px; }
            th { background: #f6f6f6; text-transform: uppercase; font-size: 10px; color: #555; }
            .pill { display: inline-block; padding: 3px 8px; border-radius: 999px; background: #fff5b0; font-size: 11px; font-weight: 700; }
            @media print { button { display: none; } body { padding: 20px; } }
          </style>
        </head>
        <body>
          <button onclick="window.print()" style="float:right;padding:10px 14px;font-weight:700">Save as PDF</button>
          <h1>${safeReportTitle}</h1>
          <div class="muted">${safeClientName} | Generated ${safeGenerated}</div>
          <div class="grid">
            <div class="card"><div class="label">Profile Progress</div><div class="value">${selectedClient?.progress ?? 0}%</div></div>
            <div class="card"><div class="label">EB1A Score</div><div class="value">${selectedClient?.eb1aScore ?? 0}/100</div></div>
            <div class="card"><div class="label">Payment Status</div><div class="value">${escapeHtml(payment?.paymentStatus ?? "Unpaid")}</div></div>
            <div class="card"><div class="label">Due Left</div><div class="value">Rs. ${Math.round(payment?.dueAmount ?? 0).toLocaleString("en-IN")}</div></div>
          </div>
          <h2>Client Summary</h2>
          <table>
            <tr><th>Name</th><td>${safeClientName}</td><th>Current Stage</th><td>${escapeHtml(selectedClient?.currentStage ?? "N/A")}</td></tr>
            <tr><th>Profession</th><td>${escapeHtml(selectedClient?.profession ?? "N/A")}</td><th>Company</th><td>${escapeHtml(selectedClient?.company ?? "N/A")}</td></tr>
            <tr><th>Category</th><td>${escapeHtml(selectedClient?.category ?? "N/A")}</td><th>Target Date</th><td>${escapeHtml(selectedClient?.expectedCompletion ?? "N/A")}</td></tr>
          </table>
          <h2>EB1A Criteria Snapshot</h2>
          <table>
            <thead><tr><th>Criterion</th><th>Strength</th><th>Evidence</th><th>Review</th></tr></thead>
            <tbody>
              ${CRITERIA.map((c) => `<tr><td>${escapeHtml(c.name)}</td><td><span class="pill">${escapeHtml(c.strength)}</span></td><td>${c.evidenceAvailable} available / ${c.evidencePending} pending</td><td>${escapeHtml(c.attorneyStatus)}</td></tr>`).join("")}
            </tbody>
          </table>
          <h2>Completed Work</h2>
          <table>
            <thead><tr><th>Service</th><th>Task</th><th>Owner</th><th>Status</th></tr></thead>
            <tbody>${completedTasks.slice(0, 12).map((t) => `<tr><td>${escapeHtml(t.service)}</td><td>${escapeHtml(t.title)}</td><td>${escapeHtml(t.assignedTo)}</td><td>${escapeHtml(t.status)}</td></tr>`).join("") || "<tr><td colspan='4'>No completed tasks recorded yet.</td></tr>"}</tbody>
          </table>
          <h2>Next Actions</h2>
          <table>
            <thead><tr><th>Priority</th><th>Task</th><th>Deadline</th><th>Status</th></tr></thead>
            <tbody>${pendingTasks.slice(0, 12).map((t) => `<tr><td>${escapeHtml(t.priority)}</td><td>${escapeHtml(t.title)}</td><td>${escapeHtml(t.deadline)}</td><td>${escapeHtml(t.status)}</td></tr>`).join("") || "<tr><td colspan='4'>No pending tasks recorded.</td></tr>"}</tbody>
          </table>
        </body>
      </html>
    `;
    const reportWindow = window.open("", "_blank", "width=900,height=1100");
    if (!reportWindow) return;
    reportWindow.document.write(html);
    reportWindow.document.close();
    reportWindow.focus();
    setTimeout(() => reportWindow.print(), 400);
  }

  return (
    <div className="p-6 space-y-5 overflow-y-auto flex-1" style={{ backgroundColor: "#0a0a0a" }}>
      <div
        className="rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        style={{ background: "linear-gradient(135deg, #1a1400 0%, #0a0a0a 100%)", border: "1px solid #2a2000" }}
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileBarChart size={20} style={{ color: "#ffe500" }} />
            <h2 className="text-lg font-black" style={{ color: "#ffffff" }}>{period} Progress Report</h2>
          </div>
          <p className="text-sm" style={{ color: "#737373" }}>
            {selectedClient?.name ?? "Select a client"} - EB1A Profile Building
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span className="px-3 py-1 text-xs font-semibold flex items-center gap-1 rounded-full" style={{ backgroundColor: "#1a1400", color: "#ffe500", border: "1px solid #2a2000" }}>
              <Calendar size={11} /> Ready to generate
            </span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <select value={period} onChange={(e) => setPeriod(e.target.value as "Weekly" | "Monthly")} className="px-3 py-2 text-xs rounded-xl focus:outline-none" style={{ backgroundColor: "#0d0d0d", border: "1px solid #2a2000", color: "#ffffff" }}>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>
          <select value={clientId} onChange={(e) => setClientId(e.target.value)} className="px-3 py-2 text-xs rounded-xl focus:outline-none min-w-48" style={{ backgroundColor: "#0d0d0d", border: "1px solid #2a2000", color: "#ffffff" }}>
            {CLIENTS.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}
          </select>
          <button
            onClick={generatePdfReport}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl"
            style={{ backgroundColor: "#ffe500", color: "#0a0a0a" }}
          >
            <Download size={16} /> Generate PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div style={CARD}>
          <h3 className="text-sm font-bold mb-4" style={{ color: "#ffffff" }}>EB1A Readiness</h3>
          <div className="flex flex-col items-center gap-4">
            <CircularProgress value={selectedClient?.progress ?? 0} size={110} strokeWidth={10} label="Overall" />
            <CircularProgress value={selectedClient?.eb1aScore ?? 0} size={110} strokeWidth={10} label="EB1A Score" />
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
          <h3 className="text-sm font-bold mb-1" style={{ color: "#ffffff" }}>Deliverables</h3>
          <p className="text-xs mb-4" style={{ color: "#737373" }}>{period} activity summary</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={[MONTHLY_ACTIVITY[5] ?? { month: "Now", pr: 0, papers: 0, awards: 0, podcasts: 0 }]}>
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

      <div style={CARD}>
        <h3 className="text-sm font-bold mb-1" style={{ color: "#ffffff" }}>Service-wise Progress</h3>
        <p className="text-xs mb-5" style={{ color: "#737373" }}>Completion percentages</p>
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
    </div>
  );
}
