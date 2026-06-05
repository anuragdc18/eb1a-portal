import { useState } from "react";
import { Search, Phone, Mail, MapPin, Calendar, User, Filter, UserCog, Lock, X, CreditCard } from "lucide-react";
import { Card, CardHeader, CardBody } from "../components/ui/card";
import { StatusBadge, PriorityBadge } from "../components/ui/badge";
import { ProgressBar, CircularProgress } from "../components/ui/progress";
import { Avatar } from "../components/ui/avatar";
import { getVisibleClients, CLIENTS, toggleAdminClientAccess, ADMIN_CLIENT_ACCESS, getClientPayment, updateClientPayment, type Client, type PaymentStatus } from "../lib/portal-data";
import { useAuth, type AuthAccount } from "../lib/auth-context";

const STATUS_ACCENT: Record<string, { bg: string; color: string }> = {
  Active:     { bg: "#0d2b1a", color: "#4ade80" },
  Completed:  { bg: "#1d3557", color: "#60a5fa" },
  Delayed:    { bg: "#2d0f0f", color: "#f87171" },
  "On Hold":  { bg: "#1a1a1a", color: "#737373" },
};

const PAYMENT_ACCENT: Record<PaymentStatus, { bg: string; color: string }> = {
  Paid: { bg: "#0d2b1a", color: "#4ade80" },
  Partial: { bg: "#1f1400", color: "#fbbf24" },
  Unpaid: { bg: "#2d0f0f", color: "#f87171" },
};

function formatMoney(value = 0) {
  return `Rs. ${Math.round(value).toLocaleString("en-IN")}`;
}

type AddClientForm = {
  name: string;
  email: string;
  phone: string;
  country: string;
  profession: string;
  designation: string;
  company: string;
  category: string;
  priority: Client["priority"];
  assignedManager: string;
};

function ClientFormField({
  label,
  field,
  form,
  setForm,
  placeholder = "",
  type = "text",
}: {
  label: string;
  field: keyof AddClientForm;
  form: AddClientForm;
  setForm: React.Dispatch<React.SetStateAction<AddClientForm>>;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: "#737373" }}>{label}</label>
      <input
        type={type}
        value={form[field] as string}
        onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm rounded-xl focus:outline-none"
        style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", color: "#f5f5f5" }}
        onFocus={e => (e.currentTarget.style.borderColor = "#ffe500")}
        onBlur={e => (e.currentTarget.style.borderColor = "#2a2a2a")}
      />
    </div>
  );
}

// ── Add Client Modal ────────────────────────────────────────
function AddClientModal({ ownerId, onClose, onAdded }: { ownerId: string; onClose: () => void; onAdded: () => void }) {
  const [form, setForm] = useState<AddClientForm>({
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
            <ClientFormField label="Full Name *" field="name" form={form} setForm={setForm} placeholder="Dr. Jane Smith" />
            <ClientFormField label="Email *" field="email" form={form} setForm={setForm} placeholder="jane@example.com" type="email" />
            <ClientFormField label="Phone" field="phone" form={form} setForm={setForm} placeholder="+1 (555) 000-0000" />
            <ClientFormField label="Country" field="country" form={form} setForm={setForm} placeholder="India to USA" />
            <ClientFormField label="Profession" field="profession" form={form} setForm={setForm} placeholder="Computer Science" />
            <ClientFormField label="Designation" field="designation" form={form} setForm={setForm} placeholder="Research Scientist" />
            <ClientFormField label="Company / Institution" field="company" form={form} setForm={setForm} placeholder="Google, Stanford..." />
            <ClientFormField label="Manager" field="assignedManager" form={form} setForm={setForm} placeholder="Priya Sharma" />
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
  admins,
  onClose,
  onChanged,
}: {
  client: Client;
  admins: AuthAccount[];
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
          {admins.map((admin) => {
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

function PaymentEditor({ client, canEdit, onSaved }: { client: Client; canEdit: boolean; onSaved: (client: Client) => void }) {
  const payment = getClientPayment(client);
  const [draft, setDraft] = useState({
    paymentStatus: payment.paymentStatus,
    totalAmount: payment.totalAmount,
    amountPaid: payment.amountPaid,
    paymentRemarks: payment.paymentRemarks,
  });
  const dueAmount = Math.max((Number(draft.totalAmount) || 0) - (Number(draft.amountPaid) || 0), 0);
  const accent = PAYMENT_ACCENT[draft.paymentStatus];

  const save = () => {
    const updated = updateClientPayment(client.id, {
      paymentStatus: draft.paymentStatus,
      totalAmount: Number(draft.totalAmount) || 0,
      amountPaid: Number(draft.amountPaid) || 0,
      paymentRemarks: draft.paymentRemarks,
    });
    if (updated) onSaved({ ...updated });
  };

  if (!canEdit) {
    return (
      <div className="rounded-xl p-4" style={{ backgroundColor: "#0d0d0d", border: "1px solid #1a1a1a" }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold" style={{ color: "#ffffff" }}>Payment Status</p>
          <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ backgroundColor: accent.bg, color: accent.color }}>
            {payment.paymentStatus}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div><p className="text-[10px]" style={{ color: "#737373" }}>Total</p><p className="text-xs font-bold" style={{ color: "#ffffff" }}>{formatMoney(payment.totalAmount)}</p></div>
          <div><p className="text-[10px]" style={{ color: "#737373" }}>Paid</p><p className="text-xs font-bold" style={{ color: "#4ade80" }}>{formatMoney(payment.amountPaid)}</p></div>
          <div><p className="text-[10px]" style={{ color: "#737373" }}>Due</p><p className="text-xs font-bold" style={{ color: payment.dueAmount > 0 ? "#f87171" : "#4ade80" }}>{formatMoney(payment.dueAmount)}</p></div>
        </div>
        {payment.paymentRemarks && <p className="text-[10px] mt-3" style={{ color: "#737373" }}>{payment.paymentRemarks}</p>}
      </div>
    );
  }

  return (
    <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: "#0d0d0d", border: "1px solid #1a1a1a" }}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold" style={{ color: "#ffffff" }}>Payment Status</p>
        <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ backgroundColor: accent.bg, color: accent.color }}>
          Due: {formatMoney(dueAmount)}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <select value={draft.paymentStatus} onChange={(e) => setDraft({ ...draft, paymentStatus: e.target.value as PaymentStatus })} className="px-3 py-2 text-xs rounded-xl focus:outline-none" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", color: "#ffffff" }}>
          <option value="Unpaid">Unpaid</option>
          <option value="Partial">Partial</option>
          <option value="Paid">Paid</option>
        </select>
        <input type="number" value={draft.totalAmount} onChange={(e) => setDraft({ ...draft, totalAmount: Number(e.target.value) })} placeholder="Total fee" className="px-3 py-2 text-xs rounded-xl focus:outline-none" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", color: "#ffffff" }} />
        <input type="number" value={draft.amountPaid} onChange={(e) => setDraft({ ...draft, amountPaid: Number(e.target.value) })} placeholder="Amount paid" className="px-3 py-2 text-xs rounded-xl focus:outline-none" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", color: "#ffffff" }} />
      </div>
      <textarea value={draft.paymentRemarks} onChange={(e) => setDraft({ ...draft, paymentRemarks: e.target.value })} placeholder="Office payment note" rows={2} className="w-full px-3 py-2 text-xs rounded-xl focus:outline-none resize-none" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", color: "#ffffff" }} />
      <button onClick={save} className="px-4 py-2 text-xs font-bold rounded-xl" style={{ backgroundColor: "#ffe500", color: "#0a0a0a" }}>
        Save Payment
      </button>
    </div>
  );
}

function ClientDrawer({ client, canManagePayment, onClientChanged, onClose }: { client: Client; canManagePayment: boolean; onClientChanged: (client: Client) => void; onClose: () => void }) {
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
              <PaymentEditor client={client} canEdit={canManagePayment} onSaved={onClientChanged} />
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
  const { user, accounts } = useAuth();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selected, setSelected] = useState<Client | null>(null);
  const [assignTarget, setAssignTarget] = useState<Client | null>(null);
  const [, setAccessVersion] = useState(0);
  const [showAddClient, setShowAddClient] = useState(false);

  const isSuperAdmin = user?.role === "superadmin";
  const isAdmin = user?.role === "admin";
  const canAddClient = isSuperAdmin || isAdmin;
  const visibleClients = user ? getVisibleClients(user.id, user.role) : [];
  const adminUsers = accounts.filter((account) => account.role === "admin" && (account.active ?? true));

  const filtered = visibleClients.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 space-y-6 overflow-y-auto flex-1" style={{ backgroundColor: "#0a0a0a" }}>
      {selected && <ClientDrawer client={selected} canManagePayment={canAddClient} onClientChanged={(updated) => { setSelected(updated); setAccessVersion((v) => v + 1); }} onClose={() => setSelected(null)} />}
      {assignTarget && (
        <AssignAdminModal
          client={assignTarget}
          admins={adminUsers}
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
          const payment = getClientPayment(client);
          const paymentAccent = PAYMENT_ACCENT[payment.paymentStatus];
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
              <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px solid #1a1a1a" }}>
                <span className="text-[10px] flex items-center gap-1" style={{ color: "#737373" }}><CreditCard size={11} /> Payment</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: paymentAccent.bg, color: paymentAccent.color }}>
                  {payment.paymentStatus} / Due {formatMoney(payment.dueAmount)}
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

