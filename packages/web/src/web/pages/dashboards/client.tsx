import { CheckCircle, Clock, FileText, ExternalLink, TrendingUp, AlertTriangle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardBody, KPICard } from "../../components/ui/card";
import { StatusBadge } from "../../components/ui/badge";
import { CircularProgress, ProgressBar } from "../../components/ui/progress";
import { CLIENTS, CRITERIA, TASKS, MONTHLY_ACTIVITY } from "../../lib/mock-data";

const CLIENT = CLIENTS[0];

const SERVICE_COMPLETION = [
  { name: "Digital PR", value: 65 },
  { name: "LinkedIn", value: 85 },
  { name: "Awards", value: 40 },
  { name: "Research Papers", value: 90 },
  { name: "Memberships", value: 75 },
  { name: "Webinars", value: 70 },
  { name: "Podcast", value: 50 },
  { name: "Website", value: 80 },
];

const PROGRESS_TIMELINE = [
  { month: "Jan", score: 25 }, { month: "Feb", score: 32 }, { month: "Mar", score: 41 },
  { month: "Apr", score: 54 }, { month: "May", score: 65 }, { month: "Jun", score: 72 },
];

const PENDING_DOCS = [
  { name: "Updated CV (2025)", due: "2025-07-10", urgent: true },
  { name: "IBM Collaboration Letter", due: "2025-07-15", urgent: true },
  { name: "Conference Talk Proof", due: "2025-07-25", urgent: false },
  { name: "Bank Statement for Salary", due: "2025-07-31", urgent: false },
];

const PUBLISHED_LINKS = [
  { title: "TechCrunch Feature", url: "https://techcrunch.com", date: "2025-05-15", type: "PR" },
  { title: "VentureBeat Article", url: "https://venturebeat.com", date: "2025-04-02", type: "PR" },
  { title: "Nature MI Paper", url: "https://nature.com", date: "2025-01-20", type: "Research" },
  { title: "LinkedIn Profile", url: "https://linkedin.com", date: "Ongoing", type: "LinkedIn" },
];

const TOOLTIP = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, padding: "8px 12px" }}>
      <p style={{ color: "#ffe500", fontSize: 11, fontWeight: 700 }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: "#f5f5f5", fontSize: 11 }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function ClientDashboard({ onNavigate }: { onNavigate?: (v: string) => void }) {
  const myTasks = TASKS.filter((t) => t.clientId === "c1");

  return (
    <div className="p-6 space-y-6 overflow-y-auto flex-1" style={{ backgroundColor: "#0a0a0a" }}>
      {/* Hero banner */}
      <div
        className="rounded-2xl p-6"
        style={{ background: "linear-gradient(135deg, #ffe500 0%, #ffb800 100%)" }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-sm font-semibold mb-1" style={{ color: "rgba(0,0,0,0.6)" }}>Welcome back,</p>
            <h2 className="text-2xl font-black" style={{ color: "#0a0a0a" }}>{CLIENT.name}</h2>
            <p className="text-sm mt-1" style={{ color: "rgba(0,0,0,0.7)" }}>{CLIENT.profession} · {CLIENT.company}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: "rgba(0,0,0,0.15)", color: "#0a0a0a" }}>
                Stage: {CLIENT.currentStage}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: "rgba(0,0,0,0.15)", color: "#0a0a0a" }}>
                Target: {CLIENT.expectedCompletion}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <CircularProgress value={CLIENT.progress} size={100} strokeWidth={9} label="Overall" color="#0a0a0a" />
            <CircularProgress value={CLIENT.eb1aScore} size={100} strokeWidth={9} label="EB1A Score" color="#0a0a0a" />
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Met Criteria"
          value={`${CRITERIA.filter((c) => c.strength === "Strong").length}/${CRITERIA.length}`}
          subtitle="EB1A categories"
          icon={<CheckCircle size={18} style={{ color: "#4ade80" }} />}
          change={{ value: "2 new this month", positive: true }}
        />
        <KPICard
          title="Active Tasks"
          value={myTasks.filter((t) => t.status === "In Progress").length}
          subtitle="In progress"
          icon={<Clock size={18} style={{ color: "#fbbf24" }} />}
          change={{ value: "On schedule", positive: true }}
        />
        <KPICard
          title="Documents"
          value={myTasks.filter((t) => t.status === "Completed").length}
          subtitle="Published/Submitted"
          icon={<FileText size={18} style={{ color: "#60a5fa" }} />}
          change={{ value: "3 pending review", positive: true }}
        />
        <KPICard
          title="Pending Docs"
          value={PENDING_DOCS.length}
          subtitle="From you"
          icon={<AlertTriangle size={18} style={{ color: "#f87171" }} />}
          change={{ value: "2 urgent", positive: false }}
        />
      </div>

      {/* Charts + services */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <h3 className="font-bold" style={{ color: "#ffffff" }}>EB1A Score Progress</h3>
            <p className="text-xs mt-0.5" style={{ color: "#737373" }}>Your profile strength over time</p>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={PROGRESS_TIMELINE}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffe500" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ffe500" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#737373" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#737373" }} axisLine={false} tickLine={false} />
                <Tooltip content={<TOOLTIP />} />
                <Area type="monotone" dataKey="score" name="Score" stroke="#ffe500" strokeWidth={2} fill="url(#scoreGrad)" dot={{ r: 4, fill: "#ffe500" }} />
              </AreaChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-bold" style={{ color: "#ffffff" }}>Service Completion</h3>
            <p className="text-xs mt-0.5" style={{ color: "#737373" }}>Per category progress</p>
          </CardHeader>
          <CardBody className="space-y-3">
            {SERVICE_COMPLETION.map((s) => (
              <div key={s.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: "#a3a3a3" }}>{s.name}</span>
                  <span className="font-bold" style={{ color: "#ffe500" }}>{s.value}%</span>
                </div>
                <ProgressBar value={s.value} size="sm" />
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      {/* Pending docs + links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <h3 className="font-bold" style={{ color: "#ffffff" }}>Documents Needed</h3>
              <p className="text-xs mt-0.5" style={{ color: "#737373" }}>Please upload these items</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: "#2d0f0f", color: "#f87171" }}>
              {PENDING_DOCS.filter(d => d.urgent).length} Urgent
            </span>
          </CardHeader>
          <CardBody className="space-y-2.5">
            {PENDING_DOCS.map((doc) => (
              <div
                key={doc.name}
                className="flex items-center gap-3 p-3 rounded-xl transition-colors"
                style={{
                  backgroundColor: doc.urgent ? "#1a0a0a" : "#131313",
                  border: `1px solid ${doc.urgent ? "#3a1515" : "#1f1f1f"}`,
                }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: doc.urgent ? "#2d0f0f" : "#1f1f1f" }}
                >
                  {doc.urgent
                    ? <AlertTriangle size={13} style={{ color: "#f87171" }} />
                    : <FileText size={13} style={{ color: "#737373" }} />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: "#ffffff" }}>{doc.name}</p>
                  <p className="text-[10px]" style={{ color: "#737373" }}>Due: {doc.due}</p>
                </div>
                <button
                  className="text-xs px-3 py-1 rounded-lg font-semibold transition-colors"
                  style={{ backgroundColor: "#ffe500", color: "#0a0a0a" }}
                >
                  Upload
                </button>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-bold" style={{ color: "#ffffff" }}>Published Links</h3>
            <p className="text-xs mt-0.5" style={{ color: "#737373" }}>Your live evidence</p>
          </CardHeader>
          <CardBody className="space-y-2.5">
            {PUBLISHED_LINKS.map((link) => (
              <a
                key={link.title}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl transition-colors block"
                style={{ backgroundColor: "#131313", border: "1px solid #1f1f1f" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "#ffe500")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "#1f1f1f")}
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#1f2f1f" }}>
                  <ExternalLink size={13} style={{ color: "#4ade80" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: "#ffffff" }}>{link.title}</p>
                  <p className="text-[10px]" style={{ color: "#737373" }}>{link.date} · {link.type}</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "#0d2b1a", color: "#4ade80" }}>Live</span>
              </a>
            ))}
          </CardBody>
        </Card>
      </div>

      {/* My tasks */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <h3 className="font-bold" style={{ color: "#ffffff" }}>My Tasks</h3>
            <p className="text-xs mt-0.5" style={{ color: "#737373" }}>Action items across your services</p>
          </div>
          <button onClick={() => onNavigate?.("services")} className="text-xs font-semibold" style={{ color: "#ffe500" }}>
            View All →
          </button>
        </CardHeader>
        <CardBody className="p-0">
          <div>
            {myTasks.slice(0, 6).map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-4 px-5 py-3.5 transition-colors"
                style={{ borderBottom: "1px solid #1a1a1a" }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#161616")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <TrendingUp size={14} style={{ color: "#737373" }} className="shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: "#ffffff" }}>{task.title}</p>
                  <p className="text-xs" style={{ color: "#737373" }}>{task.service} · Due {task.deadline}</p>
                </div>
                <StatusBadge status={task.status} />
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
