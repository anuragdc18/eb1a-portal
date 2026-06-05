import { useState } from "react";
import { MESSAGES } from "../lib/portal-data";
import { useAuth } from "../lib/auth-context";
import { Search, Plus, Send, Paperclip } from "lucide-react";

type PortalMessage = {
  id: string;
  from: string;
  to?: string;
  role: string;
  subject: string;
  preview: string;
  body: string;
  time: string;
  read: boolean;
  tags?: string[];
  attachments?: string[];
};

function MsgAvatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const sz = size === "sm" ? "w-8 h-8 text-xs" : size === "lg" ? "w-11 h-11 text-sm" : "w-9 h-9 text-xs";
  return (
    <div className={`${sz} rounded-full flex items-center justify-center font-bold shrink-0`} style={{ backgroundColor: "#ffe500", color: "#0a0a0a" }}>
      {initials}
    </div>
  );
}

function roleLabel(role: string) {
  const labels: Record<string, string> = {
    superadmin: "Super Admin",
    admin: "Admin",
    client: "Client / Applicant",
    team: "Internal Team",
    consultant: "Consultant / Reviewer",
  };
  return labels[role] ?? role;
}

export default function MessagesPage() {
  const { user, accounts } = useAuth();
  const [localMessages, setLocalMessages] = useState<PortalMessage[]>(MESSAGES as PortalMessage[]);
  const [selectedId, setSelectedId] = useState<string>(localMessages[0]?.id ?? "");
  const [search, setSearch] = useState("");
  const [compose, setCompose] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [draft, setDraft] = useState({ to: accounts.find((account) => account.id !== user?.id)?.id ?? "", subject: "", body: "" });
  const [readIds, setReadIds] = useState<Set<string>>(new Set(localMessages.filter((m) => m.read).map((m) => m.id)));

  const recipients = accounts.filter((account) => account.id !== user?.id && (account.active ?? true));
  const filtered = localMessages.filter(
    (m) =>
      m.from.toLowerCase().includes(search.toLowerCase()) ||
      (m.to ?? "").toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.preview.toLowerCase().includes(search.toLowerCase())
  );

  const selected = localMessages.find((m) => m.id === selectedId);

  function handleSelect(id: string) {
    setSelectedId(id);
    setReadIds((prev) => new Set([...prev, id]));
  }

  function sendDraft() {
    const recipient = accounts.find((account) => account.id === draft.to);
    if (!recipient || !draft.subject.trim() || !draft.body.trim()) return;
    const message: PortalMessage = {
      id: `msg-${Date.now()}`,
      from: user?.name ?? "Me",
      to: recipient.name,
      role: roleLabel(user?.role ?? "team"),
      subject: draft.subject,
      preview: draft.body.slice(0, 90),
      body: draft.body,
      time: "Just now",
      read: true,
      tags: [roleLabel(recipient.role)],
      attachments: [],
    };
    setLocalMessages((prev) => [message, ...prev]);
    setSelectedId(message.id);
    setDraft({ to: recipients[0]?.id ?? "", subject: "", body: "" });
    setCompose(false);
  }

  function sendReply() {
    if (!selected || !replyText.trim()) return;
    const message: PortalMessage = {
      id: `reply-${Date.now()}`,
      from: user?.name ?? "Me",
      to: selected.from,
      role: roleLabel(user?.role ?? "team"),
      subject: `Re: ${selected.subject}`,
      preview: replyText.slice(0, 90),
      body: replyText,
      time: "Just now",
      read: true,
      tags: ["Reply"],
      attachments: [],
    };
    setLocalMessages((prev) => [message, ...prev]);
    setSelectedId(message.id);
    setReplyText("");
  }

  const unreadCount = localMessages.filter((m) => !readIds.has(m.id)).length;

  return (
    <div className="flex h-full overflow-hidden" style={{ backgroundColor: "#0a0a0a" }}>
      <div className="w-72 shrink-0 flex flex-col" style={{ backgroundColor: "#0d0d0d", borderRight: "1px solid #1f1f1f" }}>
        <div className="p-4" style={{ borderBottom: "1px solid #1f1f1f" }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold" style={{ color: "#ffffff" }}>Messages</h2>
              {unreadCount > 0 && <p className="text-xs" style={{ color: "#737373" }}>{unreadCount} unread</p>}
            </div>
            <button onClick={() => setCompose(true)} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: "#ffe500", color: "#0a0a0a" }} title="Compose">
              <Plus size={14} />
            </button>
          </div>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#737373" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search messages..."
              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl focus:outline-none"
              style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", color: "#f5f5f5" }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs" style={{ color: "#737373" }}>No messages found</div>
          ) : (
            filtered.map((msg) => {
              const isRead = readIds.has(msg.id);
              const isSelected = selectedId === msg.id;
              return (
                <button
                  key={msg.id}
                  onClick={() => handleSelect(msg.id)}
                  className="w-full text-left p-4 transition-colors"
                  style={{
                    borderBottom: "1px solid #1a1a1a",
                    backgroundColor: isSelected ? "#1a1a1a" : "transparent",
                    borderLeft: isSelected ? "2px solid #ffe500" : "2px solid transparent",
                  }}
                >
                  <div className="flex items-start gap-2.5">
                    <MsgAvatar name={msg.from} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs truncate font-semibold" style={{ color: isRead ? "#a3a3a3" : "#ffffff" }}>{msg.from}</span>
                        <span className="text-[10px] ml-1 shrink-0" style={{ color: "#4a4a4a" }}>{msg.time}</span>
                      </div>
                      <p className="text-[11px] truncate mb-0.5" style={{ color: isRead ? "#737373" : "#d4d4d4", fontWeight: isRead ? 400 : 600 }}>{msg.subject}</p>
                      <p className="text-[10px] truncate" style={{ color: "#4a4a4a" }}>{msg.preview}</p>
                    </div>
                    {!isRead && <div className="w-1.5 h-1.5 rounded-full mt-1 shrink-0" style={{ backgroundColor: "#ffe500" }} />}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: "#0a0a0a" }}>
        {selected ? (
          <>
            <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #1f1f1f" }}>
              <div>
                <h3 className="text-sm font-bold" style={{ color: "#ffffff" }}>{selected.subject}</h3>
                <p className="text-xs mt-0.5" style={{ color: "#737373" }}>
                  From <span style={{ color: "#a3a3a3" }}>{selected.from}</span> {selected.to ? `to ${selected.to}` : ""} - {selected.time}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-2xl">
                <div className="flex items-start gap-4 mb-6">
                  <MsgAvatar name={selected.from} size="lg" />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#ffffff" }}>{selected.from}</p>
                    <p className="text-xs" style={{ color: "#737373" }}>To: {selected.to ?? user?.name ?? "Me"}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: "#4a4a4a" }}>{selected.time}</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl mb-4" style={{ backgroundColor: "#111111", border: "1px solid #1f1f1f" }}>
                  <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "#d4d4d4" }}>{selected.body}</p>
                </div>

                {selected.tags && selected.tags.length > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    {selected.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 text-[10px] font-semibold rounded-full" style={{ backgroundColor: "#1a1400", color: "#ffe500", border: "1px solid #2a2000" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {selected.attachments && selected.attachments.length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: "#4a4a4a" }}>Attachments</p>
                    <div className="flex flex-wrap gap-2">
                      {selected.attachments.map((att) => (
                        <div key={att} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs" style={{ backgroundColor: "#1a1a1a", color: "#a3a3a3", border: "1px solid #2a2a2a" }}>
                          <Paperclip size={12} /> {att}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4" style={{ borderTop: "1px solid #1f1f1f" }}>
              <div className="flex items-start gap-3">
                <MsgAvatar name={user?.name ?? "Me"} size="sm" />
                <div className="flex-1">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Reply to ${selected.from}...`}
                    rows={2}
                    className="w-full px-3 py-2 text-sm rounded-xl resize-none focus:outline-none"
                    style={{ backgroundColor: "#111111", border: "1px solid #2a2a2a", color: "#f5f5f5" }}
                  />
                  <div className="flex items-center justify-end mt-2">
                    <button
                      onClick={sendReply}
                      disabled={!replyText.trim()}
                      className="px-4 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5"
                      style={{ backgroundColor: "#ffe500", color: "#0a0a0a", opacity: replyText.trim() ? 1 : 0.4 }}
                    >
                      <Send size={12} /> Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm" style={{ color: "#737373" }}>Select a message to read</p>
          </div>
        )}
      </div>

      {compose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: "rgba(0,0,0,0.8)" }}>
          <div className="w-full max-w-lg rounded-2xl" style={{ backgroundColor: "#111111", border: "1px solid #2a2a2a" }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #1f1f1f" }}>
              <h3 className="text-sm font-bold" style={{ color: "#ffffff" }}>New Message</h3>
              <button onClick={() => setCompose(false)} className="text-sm" style={{ color: "#737373" }}>x</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: "#737373" }}>To</label>
                <select
                  value={draft.to}
                  onChange={(e) => setDraft({ ...draft, to: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl focus:outline-none"
                  style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", color: "#f5f5f5" }}
                >
                  {recipients.map((account) => (
                    <option key={account.id} value={account.id}>{account.name} - {roleLabel(account.role)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: "#737373" }}>Subject</label>
                <input
                  value={draft.subject}
                  onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl focus:outline-none"
                  style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", color: "#f5f5f5" }}
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: "#737373" }}>Message</label>
                <textarea
                  value={draft.body}
                  onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                  rows={5}
                  className="w-full px-3 py-2 text-sm rounded-xl resize-none focus:outline-none"
                  style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", color: "#f5f5f5" }}
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4" style={{ borderTop: "1px solid #1f1f1f" }}>
              <button onClick={() => setCompose(false)} className="px-4 py-2 text-xs font-semibold" style={{ color: "#737373" }}>Cancel</button>
              <button onClick={sendDraft} className="px-4 py-2 text-xs font-bold rounded-xl" style={{ backgroundColor: "#ffe500", color: "#0a0a0a" }}>
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
