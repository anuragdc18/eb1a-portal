import { useState } from "react";
import { cn } from "../lib/utils";
import { useAuth } from "../lib/auth-context";
import type { AppRole } from "../lib/auth-context";
import {
  LayoutDashboard, Users, Target, Briefcase, FolderOpen,
  BarChart3, MessageSquare, Bell, Settings, LogOut, ChevronLeft, ChevronRight,
  Star, Shield, UserCheck, Zap, UserCog, Menu, X
} from "lucide-react";

export type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  roles: AppRole[];
};

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard",     label: "Dashboard",      icon: <LayoutDashboard size={18} />, roles: ["superadmin", "admin", "client", "team", "consultant"] },
  { id: "clients",       label: "Clients",         icon: <Users size={18} />,           roles: ["superadmin", "admin", "team", "consultant"] },
  { id: "criteria",      label: "EB1A Criteria",   icon: <Target size={18} />,          roles: ["superadmin", "admin", "client", "consultant"] },
  { id: "services",      label: "Services",        icon: <Briefcase size={18} />,       roles: ["superadmin", "admin", "client", "team"] },
  { id: "documents",     label: "Documents",       icon: <FolderOpen size={18} />,      roles: ["superadmin", "admin", "client", "team", "consultant"] },
  { id: "reports",       label: "Reports",         icon: <BarChart3 size={18} />,       roles: ["superadmin", "admin", "client", "consultant"] },
  { id: "messages",      label: "Messages",        icon: <MessageSquare size={18} />,   roles: ["superadmin", "admin", "client", "team", "consultant"] },
  { id: "notifications", label: "Notifications",   icon: <Bell size={18} />,            roles: ["superadmin", "admin", "client", "team", "consultant"] },
  { id: "admin-access",  label: "Manage Admins",   icon: <UserCog size={18} />,         roles: ["superadmin"] },
  { id: "settings",      label: "Settings",        icon: <Settings size={18} />,        roles: ["superadmin", "admin", "client", "team", "consultant"] },
];

const ROLE_ICONS: Record<AppRole, React.ReactNode> = {
  superadmin: <Shield size={12} />,
  admin:      <UserCog size={12} />,
  client:     <Star size={12} />,
  team:       <UserCheck size={12} />,
  consultant: <Zap size={12} />,
};

const ROLE_LABELS: Record<AppRole, string> = {
  superadmin: "Super Admin",
  admin:      "Partner",
  client:     "Applicant",
  team:       "Team Member",
  consultant: "Consultant",
};

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

export function Sidebar({ activeView, onNavigate }: SidebarProps) {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const visibleItems = NAV_ITEMS.filter((item) => user && item.roles.includes(user.role));

  const handleNav = (id: string) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <aside
      className={cn(
        "relative flex flex-col h-full transition-all duration-300 shrink-0",
        !isMobile && (collapsed ? "w-16" : "w-60")
      )}
      style={{ backgroundColor: "#0d0d0d", borderRight: "1px solid #1f1f1f", width: isMobile ? "260px" : undefined }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5" style={{ borderBottom: "1px solid #1f1f1f" }}>
        <img
          src="/infigrowth-logo-icon.png"
          alt="Infigrowth Media logo"
          className="w-8 h-8 rounded-lg object-cover shrink-0"
        />
        {(!collapsed || isMobile) && (
          <div className="overflow-hidden">
            <div className="font-bold text-sm leading-tight" style={{ color: "#ffffff" }}>Infigrowth Media</div>
            <div className="text-[11px] font-medium" style={{ color: "#737373" }}>EB1A Growth Tracker</div>
          </div>
        )}
        {isMobile && (
          <button onClick={() => setMobileOpen(false)} className="ml-auto" style={{ color: "#737373" }}>
            <X size={18} />
          </button>
        )}
      </div>

      {/* Collapse toggle (desktop only) */}
      {!isMobile && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-14 w-6 h-6 rounded-full flex items-center justify-center shadow-lg z-10 transition-colors"
          style={{ backgroundColor: "#1f1f1f", border: "1px solid #333333", color: "#a3a3a3" }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = "#ffe500")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "#333333")}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {visibleItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              title={collapsed && !isMobile ? item.label : undefined}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                (collapsed && !isMobile) && "justify-center"
              )}
              style={{
                backgroundColor: isActive ? "#ffe500" : "transparent",
                color: isActive ? "#0a0a0a" : "#737373",
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "#1a1a1a";
                  e.currentTarget.style.color = "#ffffff";
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#737373";
                }
              }}
            >
              <span className="shrink-0">{item.icon}</span>
              {(!collapsed || isMobile) && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* User */}
      {user && (
        <div className="p-3" style={{ borderTop: "1px solid #1f1f1f" }}>
          <div className={cn("flex items-center gap-3", (collapsed && !isMobile) && "justify-center")}>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{ backgroundColor: "#ffe500", color: "#0a0a0a" }}
            >
              {user.avatar}
            </div>
            {(!collapsed || isMobile) && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate" style={{ color: "#ffffff" }}>{user.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span style={{ color: "#ffe500" }}>{ROLE_ICONS[user.role]}</span>
                  <span className="text-[10px]" style={{ color: "#737373" }}>{ROLE_LABELS[user.role]}</span>
                </div>
              </div>
            )}
            {(!collapsed || isMobile) && (
              <button
                onClick={logout}
                className="transition-colors"
                title="Logout"
                style={{ color: "#737373" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")}
                onMouseLeave={e => (e.currentTarget.style.color = "#737373")}
              >
                <LogOut size={15} />
              </button>
            )}
          </div>
        </div>
      )}
    </aside>
  );

  return (
    <>
      {/* Mobile hamburger — shown in topbar area but rendered here for context */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 w-9 h-9 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={18} style={{ color: "#ffffff" }} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex" onClick={() => setMobileOpen(false)}>
          <div style={{ backgroundColor: "rgba(0,0,0,0.7)" }} className="absolute inset-0" />
          <div className="relative h-full flex flex-col" onClick={e => e.stopPropagation()}>
            <SidebarContent isMobile />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex h-screen">
        <SidebarContent />
      </div>
    </>
  );
}
