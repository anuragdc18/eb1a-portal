import { useState } from "react";
import { Provider } from "./components/provider";
import { AuthProvider, useAuth } from "./lib/auth-context";

// Layout components
import { Sidebar } from "./components/sidebar";
import { Topbar } from "./components/topbar";

// Pages
import LoginPage from "./pages/login";

// Dashboards
import SuperAdminDashboard from "./pages/dashboards/super-admin";
import AdminDashboard from "./pages/dashboards/admin";
import ClientDashboard from "./pages/dashboards/client";
import TeamDashboard from "./pages/dashboards/team";
import ConsultantDashboard from "./pages/dashboards/consultant";

// Feature pages
import ClientsPage from "./pages/clients";
import CriteriaPage from "./pages/criteria";
import ServicesPage from "./pages/services";
import DocumentsPage from "./pages/documents";
import ReportsPage from "./pages/reports";
import MessagesPage from "./pages/messages";
import NotificationsPage from "./pages/notifications";
import SettingsPage from "./pages/settings";
import AdminAccessPage from "./pages/admin-access";

const PAGE_TITLES: Record<string, string> = {
  dashboard: "Dashboard",
  clients: "Clients",
  criteria: "EB1A Criteria",
  services: "Services",
  documents: "Documents",
  reports: "Reports",
  messages: "Messages",
  notifications: "Notifications",
  "admin-access": "Manage Admins",
  settings: "Settings",
};

function DashboardComponent({ onNavigate }: { onNavigate: (v: string) => void }) {
  const { user } = useAuth();
  if (!user) return null;
  if (user.role === "superadmin") return <SuperAdminDashboard onNavigate={onNavigate} />;
  if (user.role === "admin")      return <AdminDashboard onNavigate={onNavigate} />;
  if (user.role === "consultant") return <ConsultantDashboard />;
  if (user.role === "team")       return <TeamDashboard />;
  return <ClientDashboard />;
}

function PageRouter({ view, onNavigate }: { view: string; onNavigate: (v: string) => void }) {
  const { user } = useAuth();
  if (!user) return null;

  if (view === "admin-access" && user.role !== "superadmin") {
    return <DashboardComponent onNavigate={onNavigate} />;
  }

  switch (view) {
    case "dashboard":     return <DashboardComponent onNavigate={onNavigate} />;
    case "clients":       return <ClientsPage />;
    case "criteria":      return <CriteriaPage />;
    case "services":      return <ServicesPage />;
    case "documents":     return <DocumentsPage />;
    case "reports":       return <ReportsPage />;
    case "messages":      return <MessagesPage />;
    case "notifications": return <NotificationsPage />;
    case "admin-access":  return <AdminAccessPage />;
    case "settings":      return <SettingsPage />;
    default:              return <DashboardComponent onNavigate={onNavigate} />;
  }
}

function AppShell() {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState("dashboard");

  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "#0a0a0a" }}>
      {/* Sidebar handles both mobile (overlay) and desktop (flex) */}
      <Sidebar activeView={activeView} onNavigate={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar title={PAGE_TITLES[activeView] ?? "Dashboard"} onNavigate={setActiveView} />
        <main className="flex-1 overflow-hidden flex flex-col">
          <PageRouter view={activeView} onNavigate={setActiveView} />
        </main>
      </div>
    </div>
  );
}

function AuthGate() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0a0a0a", color: "#ffffff" }}>
        <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
          <img
            src="/infigrowth-logo-icon.png"
            alt="Infigrowth Media logo"
            className="w-12 h-12 rounded-2xl mx-auto mb-4 object-cover"
          />
          <p className="text-sm font-bold">Loading secure portal...</p>
        </div>
      </div>
    );
  }
  if (!user) return <LoginPage />;
  return <AppShell />;
}

function App() {
  return (
    <Provider>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </Provider>
  );
}

export default App;
