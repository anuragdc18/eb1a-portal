import { useState } from "react";
import { CheckCircle, XCircle, Clock, AlertCircle, Star, FileText } from "lucide-react";
import { Card, CardHeader, CardBody, KPICard } from "../../components/ui/card";
import { StatusBadge, StrengthBadge } from "../../components/ui/badge";
import { Avatar } from "../../components/ui/avatar";
import { DOCUMENTS, CRITERIA } from "../../lib/mock-data";

export default function ConsultantDashboard({ onNavigate }: { onNavigate?: (v: string) => void }) {
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, string>>({});
  const [docStatus, setDocStatus] = useState<Record<string, string>>({});

  const pendingReview = DOCUMENTS.filter((d) => d.status === "Pending Review").length;
  const approved = DOCUMENTS.filter((d) => d.status === "Approved").length;
  const needsUpdate = DOCUMENTS.filter((d) => d.status === "Needs Update").length;
  const criteriaApproved = CRITERIA.filter((c) => c.attorneyStatus === "Approved").length;

  const getDocStatus = (doc: any) => docStatus[doc.id] || doc.status;

  const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
    "Pending Review": { bg: "#2d2000", color: "#fbbf24" },
    "Approved":       { bg: "#0d2b1a", color: "#4ade80" },
    "Needs Update":   { bg: "#2d0f0f", color: "#f87171" },
    "Draft":          { bg: "#1a1a1a", color: "#737373" },
    "Uploaded":       { bg: "#1d3557", color: "#60a5fa" },
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto flex-1" style={{ backgroundColor: "#0a0a0a" }}>
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Pending Review" value={pendingReview} subtitle="Awaiting your review" icon={<Clock size={18} style={{ color: "#fbbf24" }} />} change={{ value: "Review now", positive: false }} />
        <KPICard accent title="Approved" value={approved} subtitle="Evidence approved" icon={<CheckCircle size={18} style={{ color: "#0a0a0a" }} />} change={{ value: "Great work", positive: true }} />
        <KPICard title="Needs Update" value={needsUpdate} subtitle="Action required" icon={<AlertCircle size={18} style={{ color: "#f87171" }} />} change={{ value: "Client alerted", positive: false }} />
        <KPICard title="Criteria Approved" value={`${criteriaApproved}/${CRITERIA.length}`} subtitle="EB1A criteria" icon={<Star size={18} style={{ color: "#ffe500" }} />} change={{ value: "On track", positive: true }} />
      </div>

      {/* Evidence review queue */}
      <Card>
        <CardHeader>
          <h3 className="font-bold" style={{ color: "#ffffff" }}>Evidence Review Queue</h3>
          <p className="text-xs mt-0.5" style={{ color: "#737373" }}>Review and approve submitted documents</p>
        </CardHeader>
        <CardBody className="p-0">
          <div>
            {DOCUMENTS.map((doc) => {
              const status = getDocStatus(doc);
              const sc = STATUS_COLORS[status] ?? { bg: "#1a1a1a", color: "#737373" };
              const isOpen = selectedDoc === doc.id;

              return (
                <div key={doc.id} style={{ borderBottom: "1px solid #1a1a1a" }}>
                  <div
                    className="flex items-center gap-4 px-5 py-3.5 cursor-pointer transition-colors"
                    onClick={() => setSelectedDoc(isOpen ? null : doc.id)}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#161616")}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#1a1a1a" }}>
                      <FileText size={15} style={{ color: "#ffe500" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: "#ffffff" }}>{doc.title}</p>
                      <p className="text-xs" style={{ color: "#737373" }}>{doc.clientName} · {doc.category}</p>
                    </div>
                    <div className="hidden md:flex items-center gap-3">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase" style={{ backgroundColor: sc.bg, color: sc.color }}>
                        {status}
                      </span>
                      <span className="text-xs" style={{ color: "#737373" }}>{doc.uploadDate}</span>
                    </div>
                    <span style={{ color: "#737373", fontSize: 12 }}>{isOpen ? "▲" : "▼"}</span>
                  </div>

                  {isOpen && (
                    <div className="px-5 py-4 space-y-3" style={{ backgroundColor: "#131313" }}>
                      <p className="text-sm" style={{ color: "#a3a3a3" }}>{doc.notes || "No additional notes provided."}</p>
                      <textarea
                        placeholder="Add review comments..."
                        value={comments[doc.id] || ""}
                        onChange={(e) => setComments((prev) => ({ ...prev, [doc.id]: e.target.value }))}
                        className="w-full px-3 py-2 text-xs rounded-xl resize-none focus:outline-none"
                        rows={3}
                        style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", color: "#f5f5f5" }}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => setDocStatus((p) => ({ ...p, [doc.id]: "Approved" }))}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                          style={{ backgroundColor: "#0d2b1a", color: "#4ade80", border: "1px solid #1a3d2a" }}
                        >
                          <CheckCircle size={13} /> Approve
                        </button>
                        <button
                          onClick={() => setDocStatus((p) => ({ ...p, [doc.id]: "Needs Update" }))}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                          style={{ backgroundColor: "#2d0f0f", color: "#f87171", border: "1px solid #3d1f1f" }}
                        >
                          <XCircle size={13} /> Request Update
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* EB1A criteria */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <h3 className="font-bold" style={{ color: "#ffffff" }}>EB1A Criteria Review</h3>
            <p className="text-xs mt-0.5" style={{ color: "#737373" }}>Attorney status per criterion</p>
          </div>
          <button onClick={() => onNavigate?.("criteria")} className="text-xs font-semibold" style={{ color: "#ffe500" }}>
            View All →
          </button>
        </CardHeader>
        <CardBody className="p-0">
          <div>
            {CRITERIA.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-4 px-5 py-3.5 transition-colors"
                style={{ borderBottom: "1px solid #1a1a1a" }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: "#ffffff" }}>{c.criterion}</p>
                  <p className="text-xs truncate" style={{ color: "#737373" }}>{c.evidence}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StrengthBadge strength={c.strength} />
                  <span
                    className="text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase"
                    style={
                      c.attorneyStatus === "Approved"
                        ? { backgroundColor: "#0d2b1a", color: "#4ade80" }
                        : c.attorneyStatus === "Needs More"
                        ? { backgroundColor: "#2d0f0f", color: "#f87171" }
                        : { backgroundColor: "#1a1a1a", color: "#737373" }
                    }
                  >
                    {c.attorneyStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
