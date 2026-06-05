import { useState, useCallback } from "react";
import { Shield, UserCog, CheckSquare, Square, ChevronDown, ChevronUp, Lock } from "lucide-react";
import { Avatar } from "../components/ui/avatar";
import { CLIENTS, ADMIN_CLIENT_ACCESS, toggleAdminClientAccess } from "../lib/portal-data";
import { useAuth, type AuthAccount } from "../lib/auth-context";

// Superadmin-owned private clients (only superadmin can share these)
const SUPERADMIN_CLIENTS = CLIENTS.filter((c) => c.ownerId === "superadmin");

function CredentialRow({ account, onUpdate, canChangeRole }: {
  account: AuthAccount;
  onUpdate: (id: string, updates: Partial<AuthAccount>) => void;
  canChangeRole: boolean;
}) {
  const [draft, setDraft] = useState({
    name: account.name,
    email: account.email,
    password: account.password,
    role: account.role,
    active: account.active ?? true,
  });

  const save = () => onUpdate(account.id, draft);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr_130px_90px] gap-2 p-3 rounded-xl" style={{ backgroundColor: "#0d0d0d", border: "1px solid #1a1a1a" }}>
      <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="px-3 py-2 text-xs rounded-xl focus:outline-none" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", color: "#ffffff" }} />
      <input value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} className="px-3 py-2 text-xs rounded-xl focus:outline-none" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", color: "#ffffff" }} />
      <input value={draft.password} onChange={(e) => setDraft({ ...draft, password: e.target.value })} type="password" className="px-3 py-2 text-xs rounded-xl focus:outline-none" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", color: "#ffffff" }} />
      <select disabled={!canChangeRole} value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value as AuthAccount["role"] })} className="px-3 py-2 text-xs rounded-xl focus:outline-none" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", color: "#ffffff", opacity: canChangeRole ? 1 : 0.7 }}>
        <option value="admin">Admin</option>
        <option value="team">Team</option>
        <option value="consultant">Consultant</option>
        <option value="superadmin">Super Admin</option>
      </select>
      <div className="flex gap-2">
        <button onClick={() => setDraft({ ...draft, active: !draft.active })} className="px-2 py-2 text-[10px] font-bold rounded-xl flex-1" style={{ backgroundColor: draft.active ? "#0d2b1a" : "#2d0f0f", color: draft.active ? "#4ade80" : "#f87171" }}>
          {draft.active ? "Active" : "Off"}
        </button>
        <button onClick={save} className="px-3 py-2 text-xs font-bold rounded-xl" style={{ backgroundColor: "#ffe500", color: "#0a0a0a" }}>
          Save
        </button>
      </div>
    </div>
  );
}

export default function AdminAccessPage() {
  const { accounts, updateAccount, createAccount } = useAuth();
  const adminUsers = accounts.filter((u) => u.role === "admin");
  const superAdmins = accounts.filter((u) => u.role === "superadmin");
  // Local state to force re-render when toggling
  const [, setAccessVersion] = useState(0);
  const [expandedAdmin, setExpandedAdmin] = useState<string | null>(adminUsers[0]?.id ?? null);
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", password: "" });

  const forceRefresh = useCallback(() => setAccessVersion((v) => v + 1), []);

  const handleToggle = (adminId: string, clientId: string) => {
    toggleAdminClientAccess(adminId, clientId);
    forceRefresh();
  };

  const isShared = (adminId: string, clientId: string) =>
    ADMIN_CLIENT_ACCESS.some((a) => a.adminId === adminId && a.clientId === clientId);

  return (
    <div className="p-6 space-y-6 overflow-y-auto flex-1" style={{ backgroundColor: "#0a0a0a" }}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}
        >
          <UserCog size={20} style={{ color: "#ffe500" }} />
        </div>
        <div>
          <h2 className="text-xl font-black" style={{ color: "#ffffff" }}>Manage Admin Access</h2>
          <p className="text-xs mt-0.5" style={{ color: "#737373" }}>
            Control which of your private clients each admin can see.
          </p>
        </div>
      </div>

      {/* Info banner */}
      <div
        className="rounded-xl p-4 flex items-start gap-3"
        style={{ backgroundColor: "#1a1400", border: "1px solid #2d2400" }}
      >
        <Lock size={14} className="mt-0.5 shrink-0" style={{ color: "#ffe500" }} />
        <p className="text-xs" style={{ color: "#a3a3a3" }}>
          <span style={{ color: "#ffe500", fontWeight: 700 }}>Private clients</span> are visible only to you by default.
          Share them selectively with admins below. Admins never see that other private clients exist.
        </p>
      </div>

      <div className="rounded-2xl p-5" style={{ backgroundColor: "#111111", border: "1px solid #1f1f1f" }}>
        <h3 className="text-sm font-bold mb-4" style={{ color: "#ffffff" }}>Super Admin Credentials</h3>
        <div className="space-y-3">
          {superAdmins.map((account) => (
            <CredentialRow key={account.id} account={account} onUpdate={updateAccount} canChangeRole={false} />
          ))}
        </div>
      </div>

      <div className="rounded-2xl p-5" style={{ backgroundColor: "#111111", border: "1px solid #1f1f1f" }}>
        <div className="flex items-center justify-between gap-3 mb-4">
          <h3 className="text-sm font-bold" style={{ color: "#ffffff" }}>Admin Credentials</h3>
          <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ backgroundColor: "#1a1400", color: "#ffe500" }}>
            {adminUsers.length} admins
          </span>
        </div>
        <div className="space-y-3 mb-5">
          {adminUsers.map((account) => (
            <CredentialRow key={account.id} account={account} onUpdate={updateAccount} canChangeRole />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 pt-4" style={{ borderTop: "1px solid #1f1f1f" }}>
          <input value={newAdmin.name} onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })} placeholder="Admin name" className="px-3 py-2 text-xs rounded-xl focus:outline-none" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", color: "#ffffff" }} />
          <input value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} placeholder="Email" className="px-3 py-2 text-xs rounded-xl focus:outline-none" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", color: "#ffffff" }} />
          <input value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} placeholder="Password" type="password" className="px-3 py-2 text-xs rounded-xl focus:outline-none" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", color: "#ffffff" }} />
          <button
            onClick={() => {
              if (!newAdmin.name || !newAdmin.email || !newAdmin.password) return;
              createAccount({ ...newAdmin, role: "admin" });
              setNewAdmin({ name: "", email: "", password: "" });
            }}
            className="px-3 py-2 text-xs font-bold rounded-xl"
            style={{ backgroundColor: "#ffe500", color: "#0a0a0a" }}
          >
            Add Admin
          </button>
        </div>
      </div>

      {/* Admin accordions */}
      <div className="space-y-3">
        {adminUsers.map((admin) => {
          const isExpanded = expandedAdmin === admin.id;
          const sharedCount = SUPERADMIN_CLIENTS.filter((c) => isShared(admin.id, c.id)).length;

          return (
            <div
              key={admin.id}
              className="rounded-2xl overflow-hidden"
              style={{ backgroundColor: "#111111", border: "1px solid #1f1f1f" }}
            >
              {/* Accordion header */}
              <button
                onClick={() => setExpandedAdmin(isExpanded ? null : admin.id)}
                className="w-full flex items-center justify-between p-5 text-left transition-colors"
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#161616")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ backgroundColor: "#ffe500", color: "#0a0a0a" }}
                  >
                    {admin.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: "#ffffff" }}>{admin.name}</p>
                    <p className="text-[11px]" style={{ color: "#737373" }}>{admin.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: sharedCount > 0 ? "#1a2b1a" : "#1a1a1a",
                      color: sharedCount > 0 ? "#4ade80" : "#737373",
                    }}
                  >
                    {sharedCount} / {SUPERADMIN_CLIENTS.length} shared
                  </span>
                  {isExpanded ? (
                    <ChevronUp size={16} style={{ color: "#737373" }} />
                  ) : (
                    <ChevronDown size={16} style={{ color: "#737373" }} />
                  )}
                </div>
              </button>

              {/* Expanded client list */}
              {isExpanded && (
                <div style={{ borderTop: "1px solid #1f1f1f" }}>
                  {SUPERADMIN_CLIENTS.length === 0 ? (
                    <div className="p-6 text-center">
                      <p className="text-sm" style={{ color: "#737373" }}>No private clients to share.</p>
                    </div>
                  ) : (
                    <div className="p-4 space-y-2">
                      <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: "#4a4a4a" }}>
                        Your private clients — toggle to share
                      </p>
                      {SUPERADMIN_CLIENTS.map((client) => {
                        const shared = isShared(admin.id, client.id);
                        return (
                          <button
                            key={client.id}
                            onClick={() => handleToggle(admin.id, client.id)}
                            className="w-full flex items-center justify-between p-3 rounded-xl text-left transition-all"
                            style={{
                              backgroundColor: shared ? "#0f1d0f" : "#0d0d0d",
                              border: `1px solid ${shared ? "#2a4a2a" : "#1a1a1a"}`,
                            }}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = shared ? "#4ade80" : "#ffe500")}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = shared ? "#2a4a2a" : "#1a1a1a")}
                          >
                            <div className="flex items-center gap-3">
                              <Avatar name={client.avatar} size="sm" />
                              <div>
                                <p className="text-xs font-semibold" style={{ color: "#ffffff" }}>{client.name}</p>
                                <p className="text-[10px]" style={{ color: "#737373" }}>{client.designation} · {client.company}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span
                                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                style={{
                                  backgroundColor: client.status === "Active" ? "#0d2b1a" : "#1a1a1a",
                                  color: client.status === "Active" ? "#4ade80" : "#737373",
                                }}
                              >
                                {client.status}
                              </span>
                              <div style={{ color: shared ? "#4ade80" : "#2a2a2a" }}>
                                {shared ? <CheckSquare size={18} /> : <Square size={18} />}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Also show admin's own clients (read-only) */}
                  {(() => {
                    const ownClients = CLIENTS.filter((c) => c.ownerId === admin.id);
                    if (ownClients.length === 0) return null;
                    return (
                      <div className="px-4 pb-4" style={{ borderTop: "1px solid #1a1a1a" }}>
                        <p className="text-[10px] font-semibold uppercase tracking-widest pt-3 mb-2" style={{ color: "#4a4a4a" }}>
                          Their own clients (always visible)
                        </p>
                        <div className="space-y-1">
                          {ownClients.map((client) => (
                            <div
                              key={client.id}
                              className="flex items-center gap-3 p-3 rounded-xl"
                              style={{ backgroundColor: "#0d0d0d", border: "1px solid #1a1a1a" }}
                            >
                              <Avatar name={client.avatar} size="sm" />
                              <div>
                                <p className="text-xs font-semibold" style={{ color: "#a3a3a3" }}>{client.name}</p>
                                <p className="text-[10px]" style={{ color: "#4a4a4a" }}>{client.designation}</p>
                              </div>
                              <Shield size={12} className="ml-auto" style={{ color: "#2a2a2a" }} />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* All clients overview */}
      <div
        className="rounded-2xl p-5"
        style={{ backgroundColor: "#111111", border: "1px solid #1f1f1f" }}
      >
        <h3 className="text-sm font-bold mb-4" style={{ color: "#ffffff" }}>All Clients Overview</h3>
        <div className="space-y-2">
          {CLIENTS.map((client) => {
            const isPrivate = client.ownerId === "superadmin";
            const ownerAdmin = !isPrivate ? accounts.find((account) => account.id === client.ownerId) : null;
            return (
              <div
                key={client.id}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ backgroundColor: "#0d0d0d", border: "1px solid #1a1a1a" }}
              >
                <Avatar name={client.avatar} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: "#ffffff" }}>{client.name}</p>
                  <p className="text-[10px] truncate" style={{ color: "#737373" }}>{client.designation}</p>
                </div>
                <div className="shrink-0 text-right">
                  {isPrivate ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#1a1400", color: "#ffe500" }}>
                      Private
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#1a2030", color: "#60a5fa" }}>
                      {ownerAdmin?.name?.split(" ")[0] ?? "Admin"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
