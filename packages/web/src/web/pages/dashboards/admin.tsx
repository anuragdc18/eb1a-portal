import { useState } from "react";
import { Users, TrendingUp, Clock, AlertCircle, Star, BarChart3, CheckCircle } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar, AreaChart, Area,
} from "recharts";
import { Card, CardHeader, CardBody, KPICard } from "../../components/ui/card";
import { StatusBadge, PriorityBadge } from "../../components/ui/badge";
import { ProgressBar, CircularProgress } from "../../components/ui/progress";
import { Avatar } from "../../components/ui/avatar";
import { getVisibleClients, TASKS, TEAM_MEMBERS, MONTHLY_ACTIVITY, SERVICE_PROGRESS, getClientPayment, type PaymentStatus } from "../../lib/portal-data";
import { useAuth } from "../../lib/auth-context";

const RADAR_DATA = [
  { subject: "PR", A: 85 }, { subject: "LinkedIn", A: 72 }, { subject: "Awards", A: 58 },
  { subject: "Research", A: 90 }, { subject: "Memberships", A: 78 }, { subject: "Webinars", A: 65 },
];

const PAYMENT_ACCENT: Record<PaymentStatus, { bg: string; color: string }> = {
  Paid: { bg: "#0d2b1a", color: "#4ade80" },
  Partial: { bg: "#1f1400", color: "#fbbf24" },
  Unpaid: { bg: "#2d0f0f", color: "#f87171" },
};

function formatMoney(value = 0) {
  return `Rs. ${Math.round(value).toLocaleString("en-IN")}`;
}

const CUSTOM_TOOLTIP = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, padding: "8px 12px" }}>
      <p style={{ color: "#ffe500", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: "#f5f5f5", fontSize: 11 }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function AdminDashboard({ onNavigate }: { onNavigate?: (v: string) => void }) {
  const { user } = useAuth();
  // Admin sees all company clients visible to them — presented as the company portfolio
  const clients = user ? getVisibleClients(user.id, user.role) : [];
  const [chartTab, setChartTab] = useState<"monthly" | "service">("monthly");

  const activeClients = clients.filter((c) => c.status === "Active").length;
  const delayedClients = clients.filter((c) => c.status === "Delayed").length;
  const completedClients = clients.filter((c) => c.status === "Completed").length;
  const pendingTasks = TASKS.filter((t) => t.status !== "Completed").length;

  return (
    <div className="p-4 md:p-6 space-y-5 overflow-y-auto flex-1" style={{ backgroundColor: "#0a0a0a" }}>
      {/* Welcome */}
      <div>
        <h2 className="text-xl md:text-2xl font-black" style={{ color: "#ffffff" }}>
          Good morning, <span style={{ color: "#ffe500" }}>{user?.name?.split(" ")[0]}</span>
        </h2>
        <p className="text-sm mt-1" style={{ color: "#737373" }}>
          Company overview — {clients.length} active client profiles
        </p>
      </div>

      {/* KPIs — identical to superadmin */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <KPICard
          accent
          title="Company Clients"
          value={clients.length}
          subtitle="Total portfolio"
          icon={<Users size={20} style={{ color: "#0a0a0a" }} />}
          change={{ value: "2 this month", positive: true }}
        />
        <KPICard
          title="Active Cases"
          value={activeClients}
          subtitle="In progress"
          icon={<TrendingUp size={20} style={{ color: "#4ade80" }} />}
          change={{ value: "On track", positive: true }}
        />
        <KPICard
          title="Delayed Cases"
          value={delayedClients}
          subtitle="Need attention"
          icon={<AlertCircle size={20} style={{ color: "#f87171" }} />}
          change={{ value: delayedClients > 0 ? "1 new delay" : "All good", positive: delayedClients === 0 }}
        />
        <KPICard
          title="Pending Tasks"
          value={pendingTasks}
          subtitle="Across all clients"
          icon={<Clock size={20} style={{ color: "#fbbf24" }} />}
          change={{ value: "Due this week: 3", positive: false }}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-bold" style={{ color: "#ffffff" }}>Activity Overview</h3>
              <p className="text-xs mt-0.5" style={{ color: "#737373" }}>Deliverables across all services</p>
            </div>
            <div className="flex gap-1">
              {(["monthly", "service"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setChartTab(tab)}
                  className="px-3 py-1 text-xs rounded-lg font-medium transition-colors"
                  style={
                    chartTab === tab
                      ? { backgroundColor: "#ffe500", color: "#0a0a0a" }
                      : { backgroundColor: "#1a1a1a", color: "#737373" }
                  }
                >
                  {tab === "monthly" ? "Monthly" : "By Service"}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardBody>
            {chartTab === "monthly" ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={MONTHLY_ACTIVITY} barSize={10}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#737373" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#737373" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CUSTOM_TOOLTIP />} />
                  <Bar dataKey="pr" name="PR" fill="#ffe500" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="papers" name="Papers" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="awards" name="Awards" fill="#4ade80" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="podcasts" name="Podcasts" fill="#f472b6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={SERVICE_PROGRESS} layout="vertical" barSize={8}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#737373" }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="service" type="category" tick={{ fontSize: 10, fill: "#737373" }} width={80} axisLine={false} tickLine={false} />
                  <Tooltip content={<CUSTOM_TOOLTIP />} />
                  <Bar dataKey="completed" name="Completed" fill="#4ade80" radius={[0, 0, 0, 0]} stackId="a" />
                  <Bar dataKey="inProgress" name="In Progress" fill="#ffe500" radius={[0, 0, 0, 0]} stackId="a" />
                  <Bar dataKey="pending" name="Pending" fill="#1f1f1f" radius={[0, 4, 4, 0]} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-bold" style={{ color: "#ffffff" }}>Service Coverage</h3>
            <p className="text-xs mt-0.5" style={{ color: "#737373" }}>Average across all clients</p>
          </CardHeader>
          <CardBody className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke="#1f1f1f" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#737373" }} />
                <Radar name="Coverage" dataKey="A" stroke="#ffe500" fill="#ffe500" fillOpacity={0.1} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* Clients + Team */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-bold" style={{ color: "#ffffff" }}>Client EB1A Readiness</h3>
              <p className="text-xs mt-0.5" style={{ color: "#737373" }}>Company portfolio scores</p>
            </div>
            <button
              onClick={() => onNavigate?.("clients")}
              className="text-xs font-semibold"
              style={{ color: "#ffe500" }}
            >
              View All →
            </button>
          </CardHeader>
          <CardBody className="p-0 overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr style={{ borderBottom: "1px solid #1f1f1f" }}>
                  {["Client", "Stage", "Priority", "Payment", "EB1A Score", "Progress"].map((h) => (
                    <th key={h} className="text-left text-[10px] font-semibold uppercase tracking-widest px-5 py-2.5" style={{ color: "#737373" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => {
                  const payment = getClientPayment(c);
                  return (
                  <tr
                    key={c.id}
                    className="cursor-pointer transition-colors"
                    style={{ borderBottom: "1px solid #1a1a1a" }}
                    onClick={() => onNavigate?.("clients")}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#161616")}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={c.avatar} size="sm" />
                        <div>
                          <p className="font-semibold text-xs" style={{ color: "#ffffff" }}>{c.name}</p>
                          <p className="text-[10px]" style={{ color: "#737373" }}>{c.profession}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-xs" style={{ color: "#a3a3a3" }}>{c.currentStage}</td>
                    <td className="px-3 py-3"><PriorityBadge priority={c.priority} /></td>
                    <td className="px-3 py-3">
                      <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ backgroundColor: PAYMENT_ACCENT[payment.paymentStatus].bg, color: PAYMENT_ACCENT[payment.paymentStatus].color }}>
                        {payment.paymentStatus} / {formatMoney(payment.dueAmount)}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        <Star size={11} style={{ color: c.eb1aScore >= 80 ? "#4ade80" : c.eb1aScore >= 60 ? "#fbbf24" : "#f87171" }} fill="currentColor" />
                        <span className="font-bold text-xs" style={{ color: "#ffffff" }}>{c.eb1aScore}</span>
                        <span className="text-[10px]" style={{ color: "#737373" }}>/100</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 pr-5 w-36">
                      <div className="flex items-center gap-2">
                        <ProgressBar value={c.progress} size="sm" className="flex-1" />
                        <span className="text-xs font-semibold" style={{ color: "#ffe500" }}>{c.progress}%</span>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-bold" style={{ color: "#ffffff" }}>Team Performance</h3>
            <p className="text-xs mt-0.5" style={{ color: "#737373" }}>Completion rates</p>
          </CardHeader>
          <CardBody className="space-y-4">
            {TEAM_MEMBERS.map((member) => (
              <div key={member.id}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Avatar name={member.avatar} size="sm" />
                    <div>
                      <p className="text-xs font-semibold" style={{ color: "#ffffff" }}>{member.name}</p>
                      <p className="text-[10px]" style={{ color: "#737373" }}>{member.role}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold" style={{ color: member.completionRate >= 85 ? "#4ade80" : "#fbbf24" }}>
                    {member.completionRate}%
                  </span>
                </div>
                <ProgressBar value={member.completionRate} size="sm" color={member.completionRate >= 85 ? "green" : "amber"} />
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      {/* Task alerts */}
      <Card>
        <CardHeader className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-bold" style={{ color: "#ffffff" }}>Task Alerts</h3>
            <p className="text-xs mt-0.5" style={{ color: "#737373" }}>High priority pending items</p>
          </div>
          <button onClick={() => onNavigate?.("services")} className="text-xs font-semibold" style={{ color: "#ffe500" }}>
            View All →
          </button>
        </CardHeader>
        <CardBody className="p-0">
          {TASKS.filter((t) => t.priority === "High" && t.status !== "Completed").map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 md:gap-4 px-4 md:px-5 py-3.5 transition-colors"
              style={{ borderBottom: "1px solid #1a1a1a" }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#161616")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <div className="w-1 h-10 rounded-full shrink-0" style={{ backgroundColor: "#f87171" }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: "#ffffff" }}>{task.title}</p>
                <p className="text-xs" style={{ color: "#737373" }}>{task.clientName} · {task.service}</p>
              </div>
              <div className="hidden sm:flex items-center gap-3">
                <StatusBadge status={task.status} />
                <span className="text-xs hidden md:block" style={{ color: "#737373" }}>Due {task.deadline}</span>
                <span className="text-xs hidden lg:block" style={{ color: "#737373" }}>{task.assignedTo}</span>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
