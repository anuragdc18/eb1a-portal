import { useState } from "react";
import { MESSAGES } from "../lib/portal-data";
import { useAuth } from "../lib/auth-context";
import { Search, Plus, Send, Paperclip } from "lucide-react";

function MsgAvatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const sz = size === "sm" ? "w-8 h-8 text-xs" : size === "lg" ? "w-11 h-11 text-sm" : "w-9 h-9 text-xs";
  return (
    <div
      className={`${sz} rounded-full flex items-center justify-center font-bold shrink-0`}
      style={{ backgroundColor: "#ffe500", color: "#0a0a0a" }}
    >
      {initials}
    </div>
  );
}

export default function MessagesPage() {
  const { user } = useAuth();
  const [selectedId, setSelectedId] = useState<string>(MESSAGES[0]?.id ?? "");
  const [search, setSearch] = useState("");
  const [compose, setCompose] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [readIds, setReadIds] = useState<Set<string>>(new Set(MESSAGES.filter((m) => m.read).map((m) => m.id)));

  const filtered = MESSAGES.filter(
    (m) =>
      m.from.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.preview.toLowerCase().includes(search.toLowerCase())
  );

  const selected = MESSAGES.find((m) => m.id === selectedId);

  function handleSelect(id: string) {
    setSelectedId(id);
    setReadIds((prev) => new Set([...prev, id]));
  }

  const unreadCount = MESSAGES.filter((m) => !readIds.has(m.id)).length;

  return (
    <div className="flex h-full overflow-hidden" style={{ backgroundColor: "#0a0a0a" }}>
      {/* Sidebar */}
      <div className="w-72 shrink-0 flex flex-col" style={{ backgroundColor: "#0d0d0d", borderRight: "1px solid #1f1f1f" }}>
        <div className="p-4" style={{ borderBottom: "1px solid #1f1f1f" }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold" style={{ color: "#ffffff" }}>Messages</h2>
              {unreadCount > 0 && (
                <p className="text-xs" style={{ color: "#737373" }}>{unreadCount} unread</p>
              )}
            </div>
            <button
              onClick={() => setCompose(true)}
              className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
              style={{ backgroundColor: "#ffe500", color: "#0a0a0a" }}
              title="Compose"
            >
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
              onFocus={e => (e.currentTarget.style.borderColor = "#ffe500")}
              onBlur={e => (e.currentTarget.style.borderColor = "#2a2a2a")}
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
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.backgroundColor = "#111111"; }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  <div className="flex items-start gap-2.5">
                    <MsgAvatar name={msg.from} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs truncate font-semibold" style={{ color: isRead ? "#a3a3a3" : "#ffffff" }}>
                          {msg.from}
                        </span>
                        <span className="text-[10px] ml-1 shrink-0" style={{ color: "#4a4a4a" }}>{msg.time}</span>
                      </div>
                      <p className="text-[11px] truncate mb-0.5" style={{ color: isRead ? "#737373" : "#d4d4d4", fontWeight: isRead ? 400 : 600 }}>
                        {msg.subject}
                      </p>
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

      {/* Message Detail */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: "#0a0a0a" }}>
        {selected ? (
          <>
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #1f1f1f" }}>
              <div>
                <h3 className="text-sm font-bold" style={{ color: "#ffffff" }}>{selected.subject}</h3>
                <p className="text-xs mt-0.5" style={{ color: "#737373" }}>
                  From <span style={{ color: "#a3a3a3" }}>{selected.from}</span> · {selected.time}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                  style={{ backgroundColor: "#1a1a1a", color: "#a3a3a3", border: "1px solid #2a2a2a" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "#ffe500")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "#2a2a2a")}
                >
                  Reply
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-2xl">
                <div className="flex items-start gap-4 mb-6">
                  <MsgAvatar name={selected.from} size="lg" />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#ffffff" }}>{selected.from}</p>
                    <p className="text-xs" style={{ color: "#737373" }}>To: {user?.name ?? "Me"}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: "#4a4a4a" }}>{selected.time}</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl mb-4" style={{ backgroundColor: "#111111", border: "1px solid #1f1f1f" }}>
                  <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "#d4d4d4" }}>
                    {selected.body}
                  </p>
                </div>

                {selected.tags && selected.tags.length > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    {selected.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 text-[10px] font-semibold rounded-full"
                        style={{ backgroundColor: "#1a1400", color: "#ffe500", border: "1px solid #2a2000" }}
                      >
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
                        <div
                          key={att}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs cursor-pointer transition-colors"
                          style={{ backgroundColor: "#1a1a1a", color: "#a3a3a3", border: "1px solid #2a2a2a" }}
                        >
                          <Paperclip size={12} /> {att}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reply Box */}
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
                    onFocus={e => (e.currentTarget.style.borderColor = "#ffe500")}
                    onBlur={e => (e.currentTarget.style.borderColor = "#2a2a2a")}
                  />
                  <div className="flex items-center justify-end mt-2">
                    <button
                      onClick={() => setReplyText("")}
                      disabled={!replyText.trim()}
                      className="px-4 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                      style={{
                        backgroundColor: "#ffe500",
                        color: "#0a0a0a",
                        opacity: replyText.trim() ? 1 : 0.4,
                        cursor: replyText.trim() ? "pointer" : "not-allowed",
                      }}
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
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#1a1a1a" }}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "#2a2a2a" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm" style={{ color: "#737373" }}>Select a message to read</p>
            </div>
          </div>
        )}
      </div>

      {/* Compose Modal */}
      {compose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: "rgba(0,0,0,0.8)" }}>
          <div className="w-full max-w-lg rounded-2xl" style={{ backgroundColor: "#111111", border: "1px solid #2a2a2a" }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #1f1f1f" }}>
              <h3 className="text-sm font-bold" style={{ color: "#ffffff" }}>New Message</h3>
              <button onClick={() => setCompose(false)} className="text-sm" style={{ color: "#737373" }}>✕</button>
            </div>
            <div className="p-6 space-y-4">
              {["To", "Subject"].map((label) => (
                <div key={label}>
                  <label className="block text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: "#737373" }}>{label}</label>
                  <input
                    className="w-full px-3 py-2 text-sm rounded-xl focus:outline-none"
                    style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", color: "#f5f5f5" }}
                    onFocus={e => (e.currentTarget.style.borderColor = "#ffe500")}
                    onBlur={e => (e.currentTarget.style.borderColor = "#2a2a2a")}
                  />
                </div>
              ))}
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: "#737373" }}>Message</label>
                <textarea
                  rows={5}
                  className="w-full px-3 py-2 text-sm rounded-xl resize-none focus:outline-none"
                  style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", color: "#f5f5f5" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "#ffe500")}
                  onBlur={e => (e.currentTarget.style.borderColor = "#2a2a2a")}
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4" style={{ borderTop: "1px solid #1f1f1f" }}>
              <button onClick={() => setCompose(false)} className="px-4 py-2 text-xs font-semibold" style={{ color: "#737373" }}>Cancel</button>
              <button onClick={() => setCompose(false)} className="px-4 py-2 text-xs font-bold rounded-xl" style={{ backgroundColor: "#ffe500", color: "#0a0a0a" }}>
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
