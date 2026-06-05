import { useState } from "react";
import { NOTIFICATIONS } from "../lib/portal-data";
import { Bell, FileText, MessageSquare, CheckCircle, Clock, AlertTriangle, Settings } from "lucide-react";

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  document: { icon: <FileText size={15} />, color: "#60a5fa", bg: "#0f1a2e" },
  message:  { icon: <MessageSquare size={15} />, color: "#c084fc", bg: "#1a0f2e" },
  status:   { icon: <CheckCircle size={15} />, color: "#4ade80", bg: "#0d2b1a" },
  deadline: { icon: <Clock size={15} />, color: "#fbbf24", bg: "#1f1400" },
  alert:    { icon: <AlertTriangle size={15} />, color: "#f87171", bg: "#2d0f0f" },
  system:   { icon: <Settings size={15} />, color: "#737373", bg: "#1a1a1a" },
};

const FILTERS = ["All", "Unread", "Documents", "Messages", "Status", "Deadlines", "Alerts"];

const TYPE_MAP: Record<string, string> = {
  Documents: "document",
  Messages: "message",
  Status: "status",
  Deadlines: "deadline",
  Alerts: "alert",
};

export default function NotificationsPage() {
  const [readIds, setReadIds] = useState<Set<string>>(
    new Set(NOTIFICATIONS.filter((n) => n.read).map((n) => n.id))
  );
  const [activeFilter, setActiveFilter] = useState("All");

  function markAllRead() {
    setReadIds(new Set(NOTIFICATIONS.map((n) => n.id)));
  }

  function markRead(id: string) {
    setReadIds((prev) => new Set([...prev, id]));
  }

  const filtered = NOTIFICATIONS.filter((n) => {
    if (activeFilter === "Unread") return !readIds.has(n.id);
    const typeFilter = TYPE_MAP[activeFilter];
    if (typeFilter) return n.type === typeFilter;
    return true;
  });

  const unreadCount = NOTIFICATIONS.filter((n) => !readIds.has(n.id)).length;

  return (
    <div className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: "#0a0a0a" }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-black" style={{ color: "#ffffff" }}>Notifications</h1>
            <p className="text-xs mt-0.5" style={{ color: "#737373" }}>
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="px-4 py-2 text-xs font-semibold rounded-xl transition-colors"
              style={{ backgroundColor: "#1a1a1a", color: "#ffe500", border: "1px solid #2a2a2a" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "#ffe500")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "#2a2a2a")}
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="px-3 py-1.5 text-xs font-semibold rounded-full transition-colors"
              style={
                activeFilter === f
                  ? { backgroundColor: "#ffe500", color: "#0a0a0a" }
                  : { backgroundColor: "#1a1a1a", color: "#737373", border: "1px solid #2a2a2a" }
              }
            >
              {f}
              {f === "Unread" && unreadCount > 0 && (
                <span
                  className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: activeFilter === f ? "rgba(0,0,0,0.2)" : "#2a2a2a", color: activeFilter === f ? "#0a0a0a" : "#ffe500" }}
                >
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl p-12 text-center" style={{ backgroundColor: "#111111", border: "1px solid #1f1f1f" }}>
            <Bell size={32} className="mx-auto mb-3" style={{ color: "#2a2a2a" }} />
            <p className="text-sm" style={{ color: "#737373" }}>No notifications here</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((notif) => {
              const isRead = readIds.has(notif.id);
              const cfg = TYPE_CONFIG[notif.type] ?? TYPE_CONFIG.system;
              return (
                <div
                  key={notif.id}
                  className="rounded-xl p-4 flex items-start gap-4 transition-all"
                  style={{
                    backgroundColor: isRead ? "#0d0d0d" : "#111111",
                    border: `1px solid ${isRead ? "#1a1a1a" : "#2a2a2a"}`,
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: cfg.bg, color: cfg.color }}
                  >
                    {cfg.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold" style={{ color: isRead ? "#737373" : "#ffffff" }}>
                          {notif.title}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: "#737373" }}>{notif.message}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] whitespace-nowrap" style={{ color: "#4a4a4a" }}>{notif.time}</span>
                        {!isRead && <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "#ffe500" }} />}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                      {notif.action && (
                        <button className="text-xs font-semibold transition-colors" style={{ color: "#ffe500" }}
                          onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
                          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                        >
                          {notif.action}
                        </button>
                      )}
                      {!isRead && (
                        <button
                          onClick={() => markRead(notif.id)}
                          className="text-xs transition-colors"
                          style={{ color: "#4a4a4a" }}
                          onMouseEnter={e => (e.currentTarget.style.color = "#737373")}
                          onMouseLeave={e => (e.currentTarget.style.color = "#4a4a4a")}
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
