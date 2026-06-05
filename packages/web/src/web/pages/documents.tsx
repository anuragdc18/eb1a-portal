import { useState } from "react";
import { Search, Upload, FileText, CheckCircle, XCircle, AlertCircle, Clock, Download, Eye } from "lucide-react";
import { StrengthBadge } from "../components/ui/badge";
import { Avatar } from "../components/ui/avatar";
import { DOCUMENTS, type Document } from "../lib/mock-data";

const STATUS_STYLES: Record<string, { bg: string; color: string; icon: React.ReactNode }> = {
  "Approved":       { bg: "#0d2b1a", color: "#4ade80", icon: <CheckCircle size={13} /> },
  "Pending Review": { bg: "#1f1400", color: "#fbbf24", icon: <Clock size={13} /> },
  "Rejected":       { bg: "#2d0f0f", color: "#f87171", icon: <XCircle size={13} /> },
  "Needs Update":   { bg: "#2d1800", color: "#fb923c", icon: <AlertCircle size={13} /> },
};

const CATEGORIES = ["All", "Research Paper", "Digital PR", "Award Jury", "Leading Role", "Original Contribution", "Compensation", "Memberships"];

export default function DocumentsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const filtered = DOCUMENTS.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.clientName.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || d.category === category;
    const matchStatus = statusFilter === "All" || d.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  const stats = {
    total: DOCUMENTS.length,
    approved: DOCUMENTS.filter((d) => d.status === "Approved").length,
    pending: DOCUMENTS.filter((d) => d.status === "Pending Review").length,
    needsUpdate: DOCUMENTS.filter((d) => d.status === "Needs Update").length,
  };

  const selectStyle = {
    backgroundColor: "#1a1a1a",
    border: "1px solid #2a2a2a",
    color: "#a3a3a3",
    borderRadius: "10px",
    padding: "6px 10px",
    fontSize: "12px",
    outline: "none",
  } as React.CSSProperties;

  return (
    <div className="p-6 space-y-5 overflow-y-auto flex-1" style={{ backgroundColor: "#0a0a0a" }}>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total", value: stats.total, bg: "#0f1a2e", color: "#60a5fa" },
          { label: "Approved", value: stats.approved, bg: "#0d2b1a", color: "#4ade80" },
          { label: "Pending", value: stats.pending, bg: "#1f1400", color: "#fbbf24" },
          { label: "Needs Update", value: stats.needsUpdate, bg: "#2d1800", color: "#fb923c" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl p-4" style={{ backgroundColor: s.bg }}>
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs mt-0.5" style={{ color: "#737373" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
        className="rounded-2xl p-8 text-center cursor-pointer transition-all"
        style={{
          border: `2px dashed ${dragOver ? "#ffe500" : "#2a2a2a"}`,
          backgroundColor: dragOver ? "#1a1400" : "#0d0d0d",
        }}
      >
        <Upload size={28} className="mx-auto mb-2" style={{ color: dragOver ? "#ffe500" : "#2a2a2a" }} />
        <p className="text-sm font-semibold" style={{ color: "#737373" }}>Drop files here to upload evidence</p>
        <p className="text-xs mt-1" style={{ color: "#4a4a4a" }}>PDF, DOCX, JPG, PNG up to 50MB</p>
        <button className="mt-3 px-4 py-2 text-xs font-bold rounded-xl" style={{ backgroundColor: "#ffe500", color: "#0a0a0a" }}>
          Browse Files
        </button>
      </div>

      {/* Filters + list */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#111111", border: "1px solid #1f1f1f" }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5" style={{ borderBottom: "1px solid #1f1f1f" }}>
          <div>
            <h3 className="text-sm font-bold" style={{ color: "#ffffff" }}>Evidence Repository</h3>
            <p className="text-xs mt-0.5" style={{ color: "#737373" }}>{filtered.length} documents</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "#737373" }} />
              <input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg focus:outline-none w-44"
                style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", color: "#f5f5f5" }}
                onFocus={e => (e.currentTarget.style.borderColor = "#ffe500")}
                onBlur={e => (e.currentTarget.style.borderColor = "#2a2a2a")}
              />
            </div>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={selectStyle}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={selectStyle}>
              {["All", "Approved", "Pending Review", "Needs Update", "Rejected"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div>
          {filtered.map((doc) => {
            const style = STATUS_STYLES[doc.status] ?? STATUS_STYLES["Pending Review"];
            return (
              <div
                key={doc.id}
                className="flex items-center gap-4 px-5 py-4 cursor-pointer transition-colors"
                style={{ borderBottom: "1px solid #1a1a1a" }}
                onClick={() => setSelectedDoc(selectedDoc?.id === doc.id ? null : doc)}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#161616")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#0f1a2e" }}>
                  <FileText size={16} style={{ color: "#60a5fa" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs font-semibold truncate" style={{ color: "#ffffff" }}>{doc.name}</p>
                    <StrengthBadge strength={doc.strength} />
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px]" style={{ color: "#4a4a4a" }}>
                    <span style={{ color: "#737373" }}>{doc.criterion}</span>
                    <span>·</span>
                    <span>{doc.clientName}</span>
                    <span>·</span>
                    <span>{doc.uploadedDate}</span>
                    <span>·</span>
                    <span>{doc.size}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span style={{ color: style.color }}>{style.icon}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: style.bg, color: style.color }}>
                    {doc.status}
                  </span>
                  <button className="p-1 rounded-lg transition-colors" style={{ color: "#737373" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#60a5fa")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#737373")}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Eye size={14} />
                  </button>
                  <button className="p-1 rounded-lg transition-colors" style={{ color: "#737373" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#4ade80")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#737373")}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Download size={14} />
                  </button>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <FileText size={32} className="mx-auto mb-3" style={{ color: "#2a2a2a" }} />
              <p className="text-sm" style={{ color: "#737373" }}>No documents found</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail panel */}
      {selectedDoc && (
        <div className="rounded-2xl p-5" style={{ backgroundColor: "#111111", border: "1px solid #ffe50033" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold" style={{ color: "#ffffff" }}>Document Details</h3>
            <button onClick={() => setSelectedDoc(null)} className="text-xs" style={{ color: "#737373" }}>Close ×</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 text-xs">
              {[
                ["File Name", selectedDoc.name],
                ["Category", selectedDoc.category],
                ["Criterion", selectedDoc.criterion],
                ["Client", selectedDoc.clientName],
                ["Upload Date", selectedDoc.uploadedDate],
                ["By", selectedDoc.uploadedBy],
                ["Type", selectedDoc.type],
                ["Size", selectedDoc.size],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-3 py-1.5" style={{ borderBottom: "1px solid #1a1a1a" }}>
                  <span className="w-24 shrink-0" style={{ color: "#737373" }}>{label}</span>
                  <span className="font-semibold" style={{ color: "#d4d4d4" }}>{value}</span>
                </div>
              ))}
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: "#4a4a4a" }}>Remarks</p>
              <p className="text-xs p-3 rounded-xl mb-4" style={{ backgroundColor: "#1a1a1a", color: "#a3a3a3" }}>
                {selectedDoc.remarks || "No remarks yet"}
              </p>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl" style={{ backgroundColor: "#ffe500", color: "#0a0a0a" }}>
                  <Eye size={12} /> Preview
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl" style={{ backgroundColor: "#1a1a1a", color: "#737373", border: "1px solid #2a2a2a" }}>
                  <Download size={12} /> Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
