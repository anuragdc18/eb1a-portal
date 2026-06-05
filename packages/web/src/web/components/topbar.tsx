import { useState } from "react";
import { Bell, Search, LogOut } from "lucide-react";
import { useAuth } from "../lib/auth-context";
import { NOTIFICATIONS } from "../lib/portal-data";

interface TopbarProps {
  title: string;
  onNavigate: (view: string) => void;
}

export function Topbar({ title, onNavigate }: TopbarProps) {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const unread = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <header
      className="px-4 md:px-6 py-3.5 flex items-center justify-between sticky top-0 z-20"
      style={{ backgroundColor: "#0d0d0d", borderBottom: "1px solid #1f1f1f" }}
    >
      {/* Title — shifted right on mobile to avoid hamburger overlap */}
      <div className="pl-10 md:pl-0">
        <h1 className="text-base md:text-lg font-bold" style={{ color: "#ffffff" }}>{title}</h1>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#737373" }} />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm rounded-lg w-48 lg:w-56 focus:outline-none transition-all"
            style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", color: "#f5f5f5" }}
            onFocus={e => (e.currentTarget.style.borderColor = "#ffe500")}
            onBlur={e => (e.currentTarget.style.borderColor = "#2a2a2a")}
          />
        </div>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg transition-colors"
          style={{ color: "#737373" }}
          onClick={() => onNavigate("notifications")}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#1a1a1a"; e.currentTarget.style.color = "#ffe500"; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#737373"; }}
        >
          <Bell size={18} />
          {unread > 0 && (
            <span
              className="absolute top-1 right-1 w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold"
              style={{ backgroundColor: "#ffe500", color: "#0a0a0a" }}
            >
              {unread}
            </span>
          )}
        </button>

        {/* User */}
        {user && (
          <div className="flex items-center gap-2 pl-2 md:pl-3" style={{ borderLeft: "1px solid #2a2a2a" }}>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{ backgroundColor: "#ffe500", color: "#0a0a0a" }}
            >
              {user.avatar}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-semibold leading-tight" style={{ color: "#f5f5f5" }}>{user.name}</p>
              <p className="text-[10px]" style={{ color: "#737373" }}>{user.email}</p>
            </div>
            <button
              onClick={logout}
              className="ml-1 transition-colors"
              title="Logout"
              style={{ color: "#737373" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")}
              onMouseLeave={e => (e.currentTarget.style.color = "#737373")}
            >
              <LogOut size={15} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
