import { useState } from "react";
import { useAuth } from "../lib/auth-context";

const TABS = ["Profile", "Notifications", "Team", "Security"];

const inputStyle = {
  base: { backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", color: "#f5f5f5" } as React.CSSProperties,
  focus: "#ffe500",
};

function DarkInput({ type = "text", defaultValue = "", placeholder = "" }: { type?: string; defaultValue?: string; placeholder?: string }) {
  return (
    <input
      type={type}
      defaultValue={defaultValue}
      placeholder={placeholder}
      className="w-full px-3 py-2.5 text-sm rounded-xl focus:outline-none"
      style={inputStyle.base}
      onFocus={e => (e.currentTarget.style.borderColor = inputStyle.focus)}
      onBlur={e => (e.currentTarget.style.borderColor = "#2a2a2a")}
    />
  );
}

function DarkSelect({ children, defaultValue = "" }: { children: React.ReactNode; defaultValue?: string }) {
  return (
    <select
      defaultValue={defaultValue}
      className="w-full px-3 py-2.5 text-sm rounded-xl focus:outline-none"
      style={{ ...inputStyle.base, cursor: "pointer" }}
    >
      {children}
    </select>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none"
      style={{ backgroundColor: checked ? "#ffe500" : "#2a2a2a" }}
    >
      <span
        className="inline-block h-3.5 w-3.5 transform rounded-full shadow transition-transform"
        style={{
          backgroundColor: checked ? "#0a0a0a" : "#737373",
          transform: checked ? "translateX(20px)" : "translateX(4px)",
        }}
      />
    </button>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-6" style={{ backgroundColor: "#111111", border: "1px solid #1f1f1f" }}>
      {children}
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <h3 className="text-sm font-bold" style={{ color: "#ffffff" }}>{title}</h3>
      {subtitle && <p className="text-xs mt-0.5" style={{ color: "#737373" }}>{subtitle}</p>}
    </div>
  );
}

function FormRow({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid #1a1a1a" }}>
      <div className="flex-1 pr-8">
        <p className="text-xs font-semibold" style={{ color: "#d4d4d4" }}>{label}</p>
        {hint && <p className="text-[10px] mt-0.5" style={{ color: "#737373" }}>{hint}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function ProfileTab() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  function handleSave() { setSaved(true); setTimeout(() => setSaved(false), 2000); }

  return (
    <div className="space-y-5">
      <Card>
        <SectionHeader title="Profile Information" subtitle="Update your personal details and public profile." />
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-black shrink-0" style={{ backgroundColor: "#ffe500", color: "#0a0a0a" }}>
            {user?.avatar ?? "U"}
          </div>
          <div>
            <button className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors" style={{ border: "1px solid #2a2a2a", color: "#a3a3a3" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "#ffe500")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "#2a2a2a")}
            >
              Change Photo
            </button>
            <p className="text-[10px] mt-1" style={{ color: "#4a4a4a" }}>JPG, PNG. Max 2MB.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#737373" }}>First Name</label>
            <DarkInput defaultValue={user?.name?.split(" ")[0] ?? ""} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#737373" }}>Last Name</label>
            <DarkInput defaultValue={user?.name?.split(" ").slice(1).join(" ") ?? ""} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#737373" }}>Email</label>
            <DarkInput type="email" defaultValue={user?.email ?? ""} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#737373" }}>Phone</label>
            <DarkInput defaultValue="+1 (555) 000-0000" />
          </div>
        </div>
        <div className="mb-3">
          <label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#737373" }}>Bio</label>
          <textarea
            rows={3}
            defaultValue="Immigration professional with expertise in EB-1A and O-1A visa categories."
            className="w-full px-3 py-2.5 text-sm rounded-xl resize-none focus:outline-none"
            style={inputStyle.base}
            onFocus={e => (e.currentTarget.style.borderColor = "#ffe500")}
            onBlur={e => (e.currentTarget.style.borderColor = "#2a2a2a")}
          />
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button className="px-4 py-2 text-xs font-semibold rounded-xl" style={{ color: "#737373" }}>Cancel</button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-xs font-bold rounded-xl transition-colors"
            style={{ backgroundColor: saved ? "#1a4a1a" : "#ffe500", color: saved ? "#4ade80" : "#0a0a0a" }}
          >
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </Card>
      <Card>
        <SectionHeader title="Localization" />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#737373" }}>Timezone</label>
            <DarkSelect>
              <option>America/New_York (EST)</option>
              <option>America/Los_Angeles (PST)</option>
              <option>Europe/London (GMT)</option>
              <option>Asia/Kolkata (IST)</option>
            </DarkSelect>
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#737373" }}>Date Format</label>
            <DarkSelect>
              <option>MM/DD/YYYY</option>
              <option>DD/MM/YYYY</option>
              <option>YYYY-MM-DD</option>
            </DarkSelect>
          </div>
        </div>
      </Card>
    </div>
  );
}

function NotificationsTab() {
  const [prefs, setPrefs] = useState({ emailDocs: true, emailMsgs: true, emailDeadlines: true, emailWeekly: false, pushDocs: true, pushMsgs: true, pushDeadlines: true, pushStatus: false });
  const toggle = (k: keyof typeof prefs) => setPrefs((p) => ({ ...p, [k]: !p[k] }));

  return (
    <div className="space-y-4">
      <Card>
        <SectionHeader title="Email Notifications" />
        <FormRow label="Document uploads & reviews" hint="When documents are uploaded or reviewed"><Toggle checked={prefs.emailDocs} onChange={() => toggle("emailDocs")} /></FormRow>
        <FormRow label="New messages"><Toggle checked={prefs.emailMsgs} onChange={() => toggle("emailMsgs")} /></FormRow>
        <FormRow label="Deadline reminders" hint="7, 3, and 1 day before deadlines"><Toggle checked={prefs.emailDeadlines} onChange={() => toggle("emailDeadlines")} /></FormRow>
        <FormRow label="Weekly digest" hint="Summary of activity every Monday"><Toggle checked={prefs.emailWeekly} onChange={() => toggle("emailWeekly")} /></FormRow>
      </Card>
      <Card>
        <SectionHeader title="Push Notifications" />
        <FormRow label="Document updates"><Toggle checked={prefs.pushDocs} onChange={() => toggle("pushDocs")} /></FormRow>
        <FormRow label="Messages"><Toggle checked={prefs.pushMsgs} onChange={() => toggle("pushMsgs")} /></FormRow>
        <FormRow label="Deadline alerts"><Toggle checked={prefs.pushDeadlines} onChange={() => toggle("pushDeadlines")} /></FormRow>
        <FormRow label="Status changes"><Toggle checked={prefs.pushStatus} onChange={() => toggle("pushStatus")} /></FormRow>
      </Card>
    </div>
  );
}

const TEAM = [
  { id: "1", name: "Sarah Chen", email: "sarah@epros.com", role: "Consultant", active: true },
  { id: "2", name: "Marcus Johnson", email: "marcus@epros.com", role: "Team Member", active: true },
  { id: "3", name: "James Park", email: "james@epros.com", role: "Team Member", active: false },
];

function TeamTab() {
  const [invite, setInvite] = useState(false);
  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between mb-5">
          <SectionHeader title="Team Members" subtitle="Manage access and roles." />
          <button
            onClick={() => setInvite(true)}
            className="px-3 py-2 text-xs font-bold rounded-xl"
            style={{ backgroundColor: "#ffe500", color: "#0a0a0a" }}
          >
            + Invite
          </button>
        </div>
        <div className="space-y-2">
          {TEAM.map((m) => (
            <div key={m.id} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: "#0d0d0d", border: "1px solid #1a1a1a" }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: "#ffe500", color: "#0a0a0a" }}>
                  {m.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: "#ffffff" }}>{m.name}</p>
                  <p className="text-[10px]" style={{ color: "#737373" }}>{m.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: m.active ? "#0d2b1a" : "#1a1a1a", color: m.active ? "#4ade80" : "#737373" }}>
                  {m.active ? "Active" : "Pending"}
                </span>
                <select className="text-[10px] rounded-lg px-2 py-1 focus:outline-none" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", color: "#a3a3a3" }}>
                  <option>{m.role}</option>
                  <option>Admin</option>
                  <option>Viewer</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </Card>
      {invite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: "rgba(0,0,0,0.8)" }}>
          <div className="w-full max-w-md rounded-2xl" style={{ backgroundColor: "#111111", border: "1px solid #2a2a2a" }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #1f1f1f" }}>
              <h3 className="text-sm font-bold" style={{ color: "#ffffff" }}>Invite Member</h3>
              <button onClick={() => setInvite(false)} className="text-xs" style={{ color: "#737373" }}>✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#737373" }}>Email</label><DarkInput placeholder="colleague@example.com" /></div>
              <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#737373" }}>Role</label><DarkSelect><option>Consultant</option><option>Team Member</option><option>Admin</option></DarkSelect></div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4" style={{ borderTop: "1px solid #1f1f1f" }}>
              <button onClick={() => setInvite(false)} className="px-4 py-2 text-xs" style={{ color: "#737373" }}>Cancel</button>
              <button onClick={() => setInvite(false)} className="px-4 py-2 text-xs font-bold rounded-xl" style={{ backgroundColor: "#ffe500", color: "#0a0a0a" }}>Send Invite</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SecurityTab() {
  const { user, accounts, updatePassword, updateAccount } = useAuth();
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const canManageAccounts = user?.role === "superadmin";

  const savePassword = async () => {
    setMessage(null);
    if (form.next !== form.confirm) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }
    const result = await updatePassword(form.current, form.next);
    if (!result.success) {
      setMessage({ type: "error", text: result.error ?? "Could not update password." });
      return;
    }
    setForm({ current: "", next: "", confirm: "" });
    setMessage({ type: "success", text: "Password updated." });
  };

  return (
    <div className="space-y-4">
      <Card>
        <SectionHeader title="Change Password" />
        <div className="space-y-3 max-w-md">
          <PasswordInput label="Current Password" value={form.current} onChange={(current) => setForm({ ...form, current })} />
          <PasswordInput label="New Password" value={form.next} onChange={(next) => setForm({ ...form, next })} />
          <PasswordInput label="Confirm New Password" value={form.confirm} onChange={(confirm) => setForm({ ...form, confirm })} />
          {message && (
            <div className="px-3 py-2 rounded-xl text-xs font-semibold" style={{ backgroundColor: message.type === "success" ? "#0d2b1a" : "#2d0f0f", color: message.type === "success" ? "#4ade80" : "#f87171" }}>
              {message.text}
            </div>
          )}
          <button onClick={savePassword} className="px-4 py-2 text-xs font-bold rounded-xl mt-2" style={{ backgroundColor: "#ffe500", color: "#0a0a0a" }}>
            Update Password
          </button>
        </div>
      </Card>
      {canManageAccounts && (
        <Card>
          <SectionHeader title="Account Access" subtitle="Update emails, temporary passwords, roles, and active status for portal users." />
          <div className="space-y-2">
            {accounts.map((account) => (
              <div key={account.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_120px_90px] gap-2 p-3 rounded-xl" style={{ backgroundColor: "#0d0d0d", border: "1px solid #1a1a1a" }}>
                <input defaultValue={account.email} onBlur={(e) => updateAccount(account.id, { email: e.target.value })} className="px-3 py-2 text-xs rounded-xl focus:outline-none" style={inputStyle.base} />
                <input type="password" defaultValue={account.password} onBlur={(e) => updateAccount(account.id, { password: e.target.value })} className="px-3 py-2 text-xs rounded-xl focus:outline-none" style={inputStyle.base} />
                <select defaultValue={account.role} onChange={(e) => updateAccount(account.id, { role: e.target.value as typeof account.role })} className="px-3 py-2 text-xs rounded-xl focus:outline-none" style={inputStyle.base}>
                  <option value="superadmin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="client">Client</option>
                  <option value="team">Team</option>
                  <option value="consultant">Consultant</option>
                </select>
                <button onClick={() => updateAccount(account.id, { active: !(account.active ?? true) })} className="px-3 py-2 text-[10px] font-bold rounded-xl" style={{ backgroundColor: (account.active ?? true) ? "#0d2b1a" : "#2d0f0f", color: (account.active ?? true) ? "#4ade80" : "#f87171" }}>
                  {(account.active ?? true) ? "Active" : "Inactive"}
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}
      <Card>
        <SectionHeader title="Two-Factor Authentication" />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold" style={{ color: "#d4d4d4" }}>Authenticator App</p>
            <p className="text-[10px]" style={{ color: "#737373" }}>Use Google Authenticator or similar</p>
          </div>
          <button className="px-3 py-1.5 text-xs font-semibold rounded-xl" style={{ border: "1px solid #ffe500", color: "#ffe500" }}>Enable 2FA</button>
        </div>
      </Card>
      <Card>
        <SectionHeader title="Active Sessions" />
        {[
          { device: "MacBook Pro", location: "New York, USA", time: "Now", current: true },
          { device: "iPhone 15", location: "New York, USA", time: "2 hours ago", current: false },
        ].map((s, i) => (
          <div key={i} className="flex items-center justify-between py-3" style={{ borderBottom: i === 0 ? "1px solid #1a1a1a" : "none" }}>
            <div>
              <p className="text-xs font-semibold flex items-center gap-2" style={{ color: "#d4d4d4" }}>
                {s.device}
                {s.current && <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "#0d2b1a", color: "#4ade80" }}>Current</span>}
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: "#737373" }}>{s.location} · {s.time}</p>
            </div>
            {!s.current && (
              <button className="text-xs font-semibold transition-colors" style={{ color: "#f87171" }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                Revoke
              </button>
            )}
          </div>
        ))}
      </Card>
    </div>
  );
}

function PasswordInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#737373" }}>{label}</label>
      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 text-sm rounded-xl focus:outline-none"
        style={inputStyle.base}
        onFocus={e => (e.currentTarget.style.borderColor = inputStyle.focus)}
        onBlur={e => (e.currentTarget.style.borderColor = "#2a2a2a")}
      />
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Profile");

  return (
    <div className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: "#0a0a0a" }}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-black" style={{ color: "#ffffff" }}>Settings</h1>
          <p className="text-xs mt-0.5" style={{ color: "#737373" }}>Manage your account and preferences</p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 p-1 rounded-xl w-fit" style={{ backgroundColor: "#111111", border: "1px solid #1f1f1f" }}>
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2 text-xs font-semibold rounded-lg transition-colors"
              style={activeTab === tab ? { backgroundColor: "#ffe500", color: "#0a0a0a" } : { color: "#737373" }}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Profile" && <ProfileTab />}
        {activeTab === "Notifications" && <NotificationsTab />}
        {activeTab === "Team" && <TeamTab />}
        {activeTab === "Security" && <SecurityTab />}
      </div>
    </div>
  );
}
