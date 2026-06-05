import { useState } from "react";
import { Search, Phone, Mail, MapPin, Calendar, User, Filter, UserCog, Lock, X, ChevronDown } from "lucide-react";
import { Card, CardHeader, CardBody } from "../components/ui/card";
import { StatusBadge, PriorityBadge } from "../components/ui/badge";
import { ProgressBar, CircularProgress } from "../components/ui/progress";
import { Avatar } from "../components/ui/avatar";
import { getVisibleClients, CLIENTS, toggleAdminClientAccess, ADMIN_CLIENT_ACCESS, type Client } from "../lib/mock-data";
import { DEMO_ACCOUNTS } from "../lib/auth-context";
import { useAuth } from "../lib/auth-context";

const STATUS_ACCENT: Record<string, { bg: string; color: string }> = {
  Active:     { bg: "#0d2b1a", color: "#4ade80" },
  Completed:  { bg: "#1d3557", color: "#60a5fa" },
  Delayed:    { bg: "#2d0f0f", color: "#f87171" },
  "On Hold":  { bg: "#1a1a1a", color: "#737373" },
};

const ADMIN_USERS = Object.values(DEMO_ACCOUNTS).filter((u) => u.role === "admin");

// ── Add Client Modal ────────────────────────────────────────
function AddClientModal({ ownerId, onClose, onAdded }: { ownerId: string; onClose: () => void; onAdded: () => void }) {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", country: "", profession: "", designation: "",
    company: "", category: "Extraordinary Ability – Science & Technology",
    priority: "Medium" as Client["priority"], assignedManager: "",
  });
  const [saved, setSaved] = useState(false);

  const inputStyle: React.CSSProperties = { backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", color: "#f5f5f5" };
  const focusBorder = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    (e.currentTarget.style.borderColor = "#ffe500");
  const blurBorder = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    (e.currentTarget.style.borderColor = "#2a2a2a");

  function handleAdd() {
    if (!form.name.trim() || !form.email.trim()) return;
    const now = new Date().toISOString().split("T")[0];
    const newClient: Client = {
      id: `c${Date.now()}`,
      name: form.name,
      email: form.email,
      phone: form.phone || "N/A",
      country: form.country || "N/A",
      profession: form.profession || "N/A",
      designation: form.designation || "N/A",
      company: form.company || "N/A",
      category: form.category,
      startDate: now,
      expectedCompletion: "",
      priority: form.priority,
      assignedManager: form.assignedManager || "Unassigned",
      progress: 0,
      currentStage: "Onboarding",
      notes: "",
      eb1aScore: 0,
      status: "Active",
      avatar: form.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(),
      ownerId,
    };
    CLIENTS.push(newClient);
    setSaved(true);
    setTimeout(() => { onAdded(); onClose(); }, 800);
  }

  const Field = ({ label, field, placeholder = "", type = "text" }: { label: string; field: keyof typeof form; placeholder?: string; type?: string }) => (
    <div>
      <label className="block text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: "#737373" }}>{label}</label>
      <input
        type={type}
        value={form[field] as string}
        onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm rounded-xl focus:outline-none"
        style={inputStyle}
        onFocus={focusBorder}
        onBlur={blurBorder}
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: "rgba(0,0,0,0.85)" }} onClick={onClose}>
      <div
        className="w-full max-w-xl rounded-2xl max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: "#111111", border: "1px solid #2a2a2a" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 sticky top-0 z-10" style={{ backgroundColor: "#111111", borderBottom: "1px solid #1f1f1f" }}>
          <h3 className="text-sm font-bold" style={{ color: "#ffffff" }}>Add New Client</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full transition-colors" style={{ color: "#737373", backgroundColor: "#1a1a1a" }}>
            <X size={14} />
          </button>
        </div>
        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Full Name *" field="name" placeholder="Dr. Jane Smith" />
            <Field label="Email *" field="email" placeholder="jane@example.com" type="email" />
            <Field label="Phone" field="phone" placeholder="+1 (555) 000-0000" />
            <Field label="Country" field="country" placeholder="India → USA" />
            <Field label="Profession" field="profession" placeholder="Computer Science" />
            <Field label="Designation" field="designation" placeholder="Research Scientist" />
            <Field label="Company / Institution" field="company" placeholder="Google, Stanford..." />
            <Field label="Manager" field="assignedManager" placeholder="Priya Sharma" />
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: "#737373" }}>Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              className="w-full px-3 py-2 text-sm rounded-xl focus:outline-none"
              style={inputStyle}
              onFocus={focusBorder}
              onBlur={blurBorder}
            >
              {["Extraordinary Ability – Science & Technology", "Extraordinary Ability – Arts", "Extraordinary Ability – Business", "Extraordinary Ability – Athletics", "Multinational Manager/Executive"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: "#737373" }}>Priority</label>
            <div className="flex items-center gap-2">
              {(["Low", "Medium", "High"] as Client["priority"][]).map((p) => (
                <button
                  key={p}
                  onClick={() => setForm((prev) => ({ ...prev, priority: p }))}
                  className="flex-1 py-2 text-xs font-bold rounded-xl transition-all"
                  style={
                    form.priority === p
                      ? { backgroundColor: p === "High" ? "#2d0f0f" : p === "Medium" ? "#1f1400" : "#1a1a1a", color: p === "High" ? "#f87171" : p === "Medium" ? "#fbbf24" : "#d4d4d4", border: `1px solid ${p === "High" ? "#4d1f1f" : p === "Medium" ? "#3f2800" : "#3a3a3a"}` }
                      : { backgroundColor: "#0d0d0d", color: "#737373", border: "1px solid #1a1a1a" }
                  }
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 sticky bottom-0" style={{ backgroundColor: "#111111", borderTop: "1px solid #1f1f1f" }}>
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold" style={{ color: "#737373" }}>Cancel</button>
          <button
            onClick={handleAdd}
            disabled={!form.name.trim() || !form.email.trim()}
            className="px-5 py-2 text-xs font-bold rounded-xl transition-all"
            style={{
              backgroundColor: saved ? "#1a4a1a" : "#ffe500",
              color: saved ? "#4ade80" : "#0a0a0a",
              opacity: !form.name.trim() || !form.email.trim() ? 0.4 : 1,
              cursor: !form.name.trim() || !form.email.trim() ? "not-allowed" : "pointer",
            }}
          >
            {saved ? "Added!" : "+ Add Client"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Assign Admin Modal ───────────────────────────────────────
function AssignAdminModal({
  client,
  onClose,
  onChanged,
}: {
  client: Client;
  onClose: () => void;
  onChanged: () => void;
}) {
  const isShared = (adminId: string) =>
    ADMIN_CLIENT_ACCESS.some((a) => a.adminId === adminId && a.clientId === client.id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6"
        style={{ backgroundColor: "#111111", border: "1px solid #2a2a2a" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold" style={{ color: "#ffffff" }}>Assign to Admins</h3>
          <button onClick={onClose} className="text-xs" style={{ color: "#737373" }}>✕</button>
        </div>
        <div className="flex items-center gap-3 mb-5 p-3 rounded-xl" style={{ backgroundColor: "#1a1a1a" }}>
          <Avatar name={client.avatar} size="sm" />
          <div>
            <p className="text-xs font-semibold" style={{ color: "#ffffff" }}>{client.name}</p>
            <p className="text-[10px]" style={{ color: "#737373" }}>{client.designation}</p>
          </div>
        </div>
        <div className="space-y-2">
          {ADMIN_USERS.map((admin) => {
            const shared = isShared(admin.id);
            return (
              <button
                key={admin.id}
                onClick={() => {
                  toggleAdminClientAccess(admin.id, client.id);
                  onChanged();
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl transition-all"
                style={{
                  backgroundColor: shared ? "#0f1d0f" : "#0d0d0d",
                  border: `1px solid ${shared ? "#2a4a2a" : "#1a1a1a"}`,
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "#ffe500")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = shared ? "#2a4a2a" : "#1a1a1a")}
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: "#ffe500", color: "#0a0a0a" }}>
                    {admin.avatar}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold" style={{ color: "#ffffff" }}>{admin.name}</p>
                    <p className="text-[10px]" style={{ color: "#737373" }}>{admin.email}</p>
                  </div>
                </div>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: shared ? "#1a2b1a" : "#1a1a1a",
                    color: shared ? "#4ade80" : "#737373",
                  }}
                >
                  {shared ? "Shared" : "Not shared"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ClientDrawer({ client, onClose }: { client: Client; onClose: () => void }) {
  const [tab, setTab] = useState("overview");
  const TABS = ["overview", "services", "documents", "notes"];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end"
      style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg h-full overflow-y-auto"
        style={{ backgroundColor: "#111111" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6" style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)", borderBottom: "1px solid #1f1f1f" }}>
          <div className="flex items-center justify-between mb-5">
            <button onClick={onClose} className="text-xs font-semibold transition-colors" style={{ color: "#737373" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#ffe500")}
              onMouseLeave={e => (e.currentTarget.style.color = "#737373")}
            >
              ← Back
            </button>
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase"
              style={STATUS_ACCENT[client.status] ?? { backgroundColor: "#1a1a1a", color: "#737373" }}
            >
              {client.status}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Avatar name={client.avatar} size="xl" />
            <div>
              <h2 className="text-xl font-black" style={{ color: "#ffffff" }}>{client.name}</h2>
              <p className="text-sm" style={{ color: "#ffe500" }}>{client.designation}</p>
              <p className="text-xs mt-0.5" style={{ color: "#737373" }}>{client.company}</p>
            </div>
          </div>
          <div className="flex items-center gap-6 mt-5">
            <CircularProgress value={client.progress} size={84} strokeWidth={8} label="Progress" />
            <CircularProgress value={client.eb1aScore} size={84} strokeWidth={8} label="EB1A Score" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex" style={{ borderBottom: "1px solid #1f1f1f" }}>
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-3 text-xs font-semibold capitalize transition-colors"
              style={tab === t ? { color: "#ffe500", borderBottom: "2px solid #ffe500" } : { color: "#737373" }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-5 space-y-3">
          {tab === "overview" && (
            <div className="space-y-2">
              {[
                { label: "Email", value: client.email, icon: <Mail size={13} /> },
                { label: "Phone", value: client.phone, icon: <Phone size={13} /> },
                { label: "Country", value: client.country, icon: <MapPin size={13} /> },
                { label: "Profession", value: client.profession, icon: <User size={13} /> },
                { label: "Category", value: client.category, icon: <Filter size={13} /> },
                { label: "Start Date", value: client.startDate, icon: <Calendar size={13} /> },
                { label: "Target Date", value: client.expectedCompletion, icon: <Calendar size={13} /> },
                { label: "Manager", value: client.assignedManager, icon: <User size={13} /> },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-3 py-2.5" style={{ borderBottom: "1px solid #1a1a1a" }}>
                  <span style={{ color: "#ffe500" }}>{f.icon}</span>
                  <span className="text-xs w-24 shrink-0" style={{ color: "#737373" }}>{f.label}</span>
                  <span className="text-xs font-medium" style={{ color: "#ffffff" }}>{f.value}</span>
                </div>
              ))}
              <div className="flex items-center gap-3 py-2.5">
                <span className="text-xs w-24" style={{ color: "#737373" }}>Priority</span>
                <PriorityBadge priority={client.priority} />
              </div>
              <div className="flex items-center gap-3 py-2.5">
                <span className="text-xs w-24" style={{ color: "#737373" }}>Stage</span>
                <StatusBadge status="In Progress" />
                <span className="text-xs" style={{ color: "#a3a3a3" }}>{client.currentStage}</span>
              </div>
            </div>
          )}
          {tab === "services" && (
            <div className="space-y-3">
              {["Digital PR", "LinkedIn", "Awards", "Jury Work", "Research Papers", "Memberships", "Webinars", "Website", "Book", "Podcasts"].map((s, i) => (
                <div key={s}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span style={{ color: "#a3a3a3" }}>{s}</span>
                    <span className="font-bold" style={{ color: "#ffe500" }}>
                      {[65, 85, 40, 55, 90, 75, 70, 80, 30, 50][i]}%
                    </span>
                  </div>
                  <ProgressBar value={[65, 85, 40, 55, 90, 75, 70, 80, 30, 50][i]} size="sm" />
                </div>
              ))}
            </div>
          )}
          {tab === "documents" && (
            <div className="space-y-2">
              {["Google PhD Fellowship Certificate", "NeurIPS Best Paper", "Nature MI Paper", "TechCrunch Feature", "ACM Senior Membership"].map((doc) => (
                <div
                  key={doc}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#1a1f3e" }}>
                    <span className="text-[10px] font-bold" style={{ color: "#818cf8" }}>PDF</span>
                  </div>
                  <span className="text-xs font-medium flex-1" style={{ color: "#f5f5f5" }}>{doc}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#0d2b1a", color: "#4ade80" }}>Approved</span>
                </div>
              ))}
            </div>
          )}
          {tab === "notes" && (
            <div className="p-4 rounded-xl text-sm" style={{ backgroundColor: "#1a1a1a", color: "#a3a3a3" }}>
              {client.notes || "No notes yet."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ClientsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selected, setSelected] = useState<Client | null>(null);
  const [assignTarget, setAssignTarget] = useState<Client | null>(null);
  const [accessVersion, setAccessVersion] = useState(0);
  const [showAddClient, setShowAddClient] = useState(false);

  const isSuperAdmin = user?.role === "superadmin";
  const isAdmin = user?.role === "admin";
  const canAddClient = isSuperAdmin || isAdmin;
  const visibleClients = user ? getVisibleClients(user.id, user.role) : [];

  const filtered = visibleClients.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 space-y-6 overflow-y-auto flex-1" style={{ backgroundColor: "#0a0a0a" }}>
      {selected && <ClientDrawer client={selected} onClose={() => setSelected(null)} />}
      {assignTarget && (
        <AssignAdminModal
          client={assignTarget}
          onClose={() => setAssignTarget(null)}
          onChanged={() => { setAccessVersion((v) => v + 1); setAssignTarget(null); }}
        />
      )}
      {showAddClient && user && (
        <AddClientModal
          ownerId={user.id}
          onClose={() => setShowAddClient(false)}
          onAdded={() => setAccessVersion((v) => v + 1)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-black" style={{ color: "#ffffff" }}>
            {isAdmin ? "Company Clients" : "Clients"}
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "#737373" }}>
            {filtered.length} {isAdmin ? "company" : "total"} profiles
          </p>
        </div>
        {canAddClient && (
          <button
            onClick={() => setShowAddClient(true)}
            className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
            style={{ backgroundColor: "#ffe500", color: "#0a0a0a" }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            + Add Client
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#737373" }} />
          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm rounded-xl w-56 focus:outline-none"
            style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", color: "#f5f5f5" }}
            onFocus={e => (e.currentTarget.style.borderColor = "#ffe500")}
            onBlur={e => (e.currentTarget.style.borderColor = "#2a2a2a")}
          />
        </div>
        {["All", "Active", "Completed", "Delayed", "On Hold"].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className="px-3 py-1.5 text-xs rounded-xl font-semibold transition-colors"
            style={
              filterStatus === s
                ? { backgroundColor: "#ffe500", color: "#0a0a0a" }
                : { backgroundColor: "#1a1a1a", color: "#737373", border: "1px solid #2a2a2a" }
            }
          >
            {s}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((client) => {
          const sc = STATUS_ACCENT[client.status] ?? { bg: "#1a1a1a", color: "#737373" };
          const isPrivate = client.ownerId === "superadmin";
          return (
            <div
              key={client.id}
              className="rounded-2xl p-5 cursor-pointer transition-all"
              style={{ backgroundColor: "#111111", border: "1px solid #1f1f1f" }}
              onClick={() => setSelected(client)}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "#ffe500")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "#1f1f1f")}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar name={client.avatar} size="md" />
                  <div>
                    <p className="font-bold text-sm" style={{ color: "#ffffff" }}>{client.name}</p>
                    <p className="text-[10px]" style={{ color: "#737373" }}>{client.designation}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {isSuperAdmin && isPrivate && (
                    <span title="Private client">
                      <Lock size={11} style={{ color: "#ffe500" }} />
                    </span>
                  )}
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: sc.bg, color: sc.color }}
                  >
                    {client.status}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 mb-4">
                <div className="flex items-center gap-2 text-xs" style={{ color: "#737373" }}>
                  <MapPin size={11} />
                  <span className="truncate">{client.country} · {client.category}</span>
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: "#737373" }}>
                  <User size={11} />
                  <span>{client.assignedManager}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-xs" style={{ color: "#737373" }}>Progress</span>
                <span className="text-xs font-bold" style={{ color: "#ffe500" }}>{client.progress}%</span>
              </div>
              <ProgressBar value={client.progress} size="sm" />

              <div className="flex items-center justify-between mt-3">
                <PriorityBadge priority={client.priority} />
                <span className="text-[10px]" style={{ color: "#737373" }}>
                  EB1A: <span className="font-bold" style={{ color: "#ffffff" }}>{client.eb1aScore}</span>/100
                </span>
              </div>

              {/* Superadmin: assign to admin button */}
              {isSuperAdmin && (
                <button
                  onClick={(e) => { e.stopPropagation(); setAssignTarget(client); }}
                  className="w-full mt-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  style={{ backgroundColor: "#1a1a1a", color: "#737373", border: "1px solid #2a2a2a" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#ffe500"; e.currentTarget.style.color = "#ffe500"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2a2a"; e.currentTarget.style.color = "#737373"; }}
                >
                  <UserCog size={12} /> Assign to Admin
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
