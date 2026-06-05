import { useState } from "react";
import { CheckSquare, Clock, AlertCircle, Upload, MessageSquare } from "lucide-react";
import { Card, CardHeader, CardBody, KPICard } from "../../components/ui/card";
import { StatusBadge, PriorityBadge } from "../../components/ui/badge";
import { Avatar } from "../../components/ui/avatar";
import { TASKS, type Task, type Status } from "../../lib/portal-data";
import { cn } from "../../lib/utils";

const SERVICES = ["All", "Digital PR", "LinkedIn", "Awards", "Research Paper", "Memberships", "Podcast", "Webinar", "Website"];

const KANBAN_COLS: { status: Status; accent: string }[] = [
  { status: "Not Started", accent: "#737373" },
  { status: "In Progress", accent: "#60a5fa" },
  { status: "Waiting for Client", accent: "#fbbf24" },
  { status: "Submitted", accent: "#818cf8" },
  { status: "Completed", accent: "#4ade80" },
];

function DarkTaskCard({ task }: { task: Task }) {
  return (
    <div
      className="rounded-xl p-3 space-y-2 cursor-pointer transition-all"
      style={{ backgroundColor: "#161616", border: "1px solid #2a2a2a" }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "#ffe500")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "#2a2a2a")}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold leading-snug" style={{ color: "#f5f5f5" }}>{task.title}</p>
        <PriorityBadge priority={task.priority} />
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: "#1a1f3e", color: "#818cf8" }}>{task.service}</span>
        <span className="text-[10px]" style={{ color: "#737373" }}>{task.clientName}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-[10px]" style={{ color: "#737373" }}>
          <Clock size={10} />
          <span>{task.deadline}</span>
        </div>
        <Avatar name={task.assignedTo.slice(0, 2)} size="sm" />
      </div>
      {task.comments && (
        <div className="pt-1" style={{ borderTop: "1px solid #1f1f1f" }}>
          <p className="text-[10px] italic truncate" style={{ color: "#737373" }}>{task.comments}</p>
        </div>
      )}
      <div className="flex items-center gap-1.5 pt-1">
        <button
          className="flex-1 flex items-center justify-center gap-1 py-1 text-[10px] rounded-lg transition-colors font-semibold"
          style={{ backgroundColor: "#1a2e1a", color: "#4ade80" }}
        >
          <Upload size={10} /> Upload Proof
        </button>
        <button
          className="flex items-center justify-center gap-1 px-2 py-1 text-[10px] rounded-lg"
          style={{ backgroundColor: "#1a1a1a", color: "#737373" }}
        >
          <MessageSquare size={10} />
        </button>
      </div>
    </div>
  );
}

export default function TeamDashboard({ onNavigate }: { onNavigate?: (v: string) => void }) {
  const [view, setView] = useState<"list" | "kanban">("list");
  const [filterService, setFilterService] = useState("All");

  const filtered = TASKS.filter((t) => filterService === "All" || t.service === filterService);
  const done = TASKS.filter((t) => t.status === "Completed").length;
  const inProgress = TASKS.filter((t) => t.status === "In Progress").length;
  const overdue = TASKS.filter((t) => t.priority === "High" && t.status !== "Completed").length;

  return (
    <div className="p-6 space-y-6 overflow-y-auto flex-1" style={{ backgroundColor: "#0a0a0a" }}>
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard accent title="Total Tasks" value={TASKS.length} subtitle="All deliverables" icon={<CheckSquare size={18} style={{ color: "#0a0a0a" }} />} />
        <KPICard title="In Progress" value={inProgress} subtitle="Active work" icon={<Clock size={18} style={{ color: "#60a5fa" }} />} change={{ value: "On track", positive: true }} />
        <KPICard title="Completed" value={done} subtitle="Delivered" icon={<CheckSquare size={18} style={{ color: "#4ade80" }} />} change={{ value: "Great pace", positive: true }} />
        <KPICard title="High Priority" value={overdue} subtitle="Needs attention" icon={<AlertCircle size={18} style={{ color: "#f87171" }} />} change={{ value: "Act now", positive: false }} />
      </div>

      {/* Filter & view toggle */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-1.5 flex-wrap">
          {SERVICES.map((s) => (
            <button
              key={s}
              onClick={() => setFilterService(s)}
              className="px-3 py-1.5 text-xs rounded-lg font-medium transition-colors"
              style={
                filterService === s
                  ? { backgroundColor: "#ffe500", color: "#0a0a0a" }
                  : { backgroundColor: "#1a1a1a", color: "#737373", border: "1px solid #2a2a2a" }
              }
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-1 rounded-xl p-1" style={{ backgroundColor: "#1a1a1a" }}>
          {(["list", "kanban"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="px-3 py-1.5 text-xs rounded-lg font-semibold capitalize transition-colors"
              style={view === v ? { backgroundColor: "#ffe500", color: "#0a0a0a" } : { color: "#737373" }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Task views */}
      {view === "list" ? (
        <Card>
          <CardBody className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid #1f1f1f" }}>
                  {["Task", "Client", "Service", "Status", "Priority", "Deadline", "Assigned"].map((h) => (
                    <th key={h} className="text-left text-[10px] font-semibold uppercase tracking-widest px-4 py-3" style={{ color: "#737373" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((task) => (
                  <tr
                    key={task.id}
                    className="transition-colors cursor-pointer"
                    style={{ borderBottom: "1px solid #1a1a1a" }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#161616")}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <td className="px-4 py-3">
                      <p className="text-xs font-semibold" style={{ color: "#ffffff" }}>{task.title}</p>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "#a3a3a3" }}>{task.clientName}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: "#a3a3a3" }}>{task.service}</td>
                    <td className="px-4 py-3"><StatusBadge status={task.status} /></td>
                    <td className="px-4 py-3"><PriorityBadge priority={task.priority} /></td>
                    <td className="px-4 py-3 text-xs" style={{ color: "#a3a3a3" }}>{task.deadline}</td>
                    <td className="px-4 py-3">
                      <Avatar name={task.assignedTo.slice(0, 2)} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {KANBAN_COLS.map((col) => {
            const colTasks = filtered.filter((t) => t.status === col.status);
            return (
              <div key={col.status}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.accent }} />
                  <span className="text-xs font-bold" style={{ color: "#ffffff" }}>{col.status}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full ml-auto" style={{ backgroundColor: "#1a1a1a", color: "#737373" }}>
                    {colTasks.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {colTasks.map((task) => (
                    <DarkTaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
