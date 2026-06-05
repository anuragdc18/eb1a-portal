import { useState } from "react";
import { ExternalLink, CheckCircle, Circle, Plus } from "lucide-react";
import { StatusBadge } from "../components/ui/badge";
import { ProgressBar } from "../components/ui/progress";
import {
  PR_ARTICLES, AWARDS, RESEARCH_PAPERS, MEMBERSHIPS, LINKEDIN_DATA,
  WEBINARS, PODCASTS, BOOKS, WEBSITE_DATA, JURY_WORK
} from "../lib/portal-data";

const TABS = [
  { id: "pr", label: "Digital PR" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "awards", label: "Awards" },
  { id: "jury", label: "Jury Work" },
  { id: "research", label: "Research Papers" },
  { id: "memberships", label: "Memberships" },
  { id: "webinars", label: "Webinars" },
  { id: "website", label: "Website & Blog" },
  { id: "book", label: "Book Publishing" },
  { id: "podcast", label: "Podcasts" },
];

const DARK_ROW = { borderBottom: "1px solid #1a1a1a" };
const CELL_H = "text-[10px] font-semibold uppercase tracking-widest px-4 py-2.5";
const CELL_D = "px-4 py-3 text-xs";

function Check({ done }: { done: boolean }) {
  return done
    ? <CheckCircle size={14} style={{ color: "#4ade80" }} />
    : <Circle size={14} style={{ color: "#2a2a2a" }} />;
}

function InfoGrid({ items }: { items: { label: string; value: React.ReactNode }[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mt-3">
      {items.map((f) => (
        <div key={f.label}>
          <p style={{ color: "#737373" }}>{f.label}</p>
          <div className="mt-0.5 font-medium" style={{ color: "#ffffff" }}>{f.value}</div>
        </div>
      ))}
    </div>
  );
}

function ServiceCard({ title, subtitle, status, children }: {
  title: string; subtitle: string; status?: React.ReactNode; children?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: "#0d0d0d", border: "1px solid #1f1f1f" }}>
      <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
        <div>
          <h4 className="font-semibold text-sm" style={{ color: "#ffffff" }}>{title}</h4>
          <p className="text-[11px] mt-0.5" style={{ color: "#737373" }}>{subtitle}</p>
        </div>
        {status && <div className="shrink-0">{status}</div>}
      </div>
      {children}
    </div>
  );
}

function PRTracker() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs" style={{ color: "#737373" }}>{PR_ARTICLES.length} articles tracked</p>
        <button className="flex items-center gap-1 text-xs font-semibold" style={{ color: "#ffe500" }}>
          <Plus size={13} /> Add Article
        </button>
      </div>
      <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid #1f1f1f" }}>
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr style={{ borderBottom: "1px solid #1f1f1f" }}>
              {["Platform", "Type", "Title", "DA Score", "URL", "Screenshot", "Invoice", "Status", "Remarks"].map((h) => (
                <th key={h} className={`${CELL_H} text-left`} style={{ color: "#737373" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PR_ARTICLES.map((a) => (
              <tr key={a.id} style={DARK_ROW}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#161616")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <td className={CELL_D} style={{ color: "#ffffff", fontWeight: 600 }}>{a.platform}</td>
                <td className={CELL_D}>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#1a1a2e", color: "#818cf8" }}>{a.type}</span>
                </td>
                <td className={`${CELL_D} max-w-[180px]`} style={{ color: "#a3a3a3" }}>
                  <p className="truncate">{a.title}</p>
                </td>
                <td className={CELL_D} style={{ color: "#ffe500", fontWeight: 700 }}>{a.daScore}</td>
                <td className={CELL_D}>
                  {a.publishedUrl ? (
                    <a href={a.publishedUrl} target="_blank" rel="noreferrer" style={{ color: "#60a5fa" }}>
                      <ExternalLink size={13} />
                    </a>
                  ) : <span style={{ color: "#2a2a2a" }}>—</span>}
                </td>
                <td className={CELL_D}><Check done={a.screenshotUploaded} /></td>
                <td className={CELL_D}><Check done={a.invoiceUploaded} /></td>
                <td className={CELL_D}><StatusBadge status={a.status} /></td>
                <td className={`${CELL_D} max-w-[140px]`} style={{ color: "#737373" }}>
                  <p className="truncate">{a.remarks}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LinkedInTracker() {
  const d = LINKEDIN_DATA;
  const checks = [
    { label: "Profile Audit Done", done: d.profileAudit },
    { label: "Banner Updated", done: d.bannerUpdated },
    { label: "Headline Updated", done: d.headlineUpdated },
    { label: "About Section Updated", done: d.aboutUpdated },
    { label: "Featured Section Added", done: d.featuredAdded },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#737373" }}>Profile Checklist</h4>
        <div className="space-y-2">
          {checks.map((c) => (
            <div key={c.label} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: "#0d0d0d", border: "1px solid #1a1a1a" }}>
              <Check done={c.done} />
              <span className="text-sm" style={{ color: c.done ? "#ffffff" : "#737373" }}>{c.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#737373" }}>Content Metrics</h4>
        <div className="space-y-4">
          {[
            { label: "Weekly Posts Planned", value: d.weeklyPostsPlanned, max: 5 },
            { label: "Posts Published", value: d.postsPublished, max: 50 },
            { label: "Followers", value: d.currentFollowers, max: 10000 },
          ].map((m) => (
            <div key={m.label}>
              <div className="flex justify-between text-xs mb-1.5">
                <span style={{ color: "#737373" }}>{m.label}</span>
                <span className="font-bold" style={{ color: "#ffffff" }}>{typeof m.value === "number" && m.value > 100 ? m.value.toLocaleString() : m.value}</span>
              </div>
              <ProgressBar value={(m.value / m.max) * 100} size="sm" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="rounded-xl p-3 text-center" style={{ backgroundColor: "#0f1a2e" }}>
              <p className="text-xl font-bold" style={{ color: "#60a5fa" }}>{d.engagementRate}</p>
              <p className="text-xs mt-0.5" style={{ color: "#737373" }}>Engagement Rate</p>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ backgroundColor: "#0d2b1a" }}>
              <p className="text-xl font-bold" style={{ color: "#4ade80" }}>{d.followersGrowth}</p>
              <p className="text-xs mt-0.5" style={{ color: "#737373" }}>30-day Growth</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AwardsTracker() {
  return (
    <div className="space-y-3">
      {AWARDS.map((a) => (
        <ServiceCard key={a.id} title={`🏆 ${a.name}`} subtitle={`${a.organization} · ${a.country}`}
          status={
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{
              backgroundColor: a.resultStatus === "Won" ? "#0d2b1a" : a.resultStatus === "Shortlisted" ? "#0f1a2e" : "#1f1400",
              color: a.resultStatus === "Won" ? "#4ade80" : a.resultStatus === "Shortlisted" ? "#60a5fa" : "#fbbf24",
            }}>{a.resultStatus}</span>
          }
        >
          <InfoGrid items={[
            { label: "Eligibility", value: a.eligibilityStatus },
            { label: "Deadline", value: a.applicationDeadline || "—" },
            { label: "Draft", value: <StatusBadge status={a.applicationDraft} /> },
            { label: "Certificate", value: a.certificateUploaded ? <span style={{ color: "#4ade80" }}>✓ Uploaded</span> : <span style={{ color: "#737373" }}>Pending</span> },
          ]} />
        </ServiceCard>
      ))}
    </div>
  );
}

function JuryTracker() {
  return (
    <div className="space-y-3">
      {JURY_WORK.map((j) => (
        <ServiceCard key={j.id} title={`⚖️ ${j.name}`} subtitle={`${j.org} · ${j.category}`} status={<StatusBadge status={j.status} />}>
          <InfoGrid items={[
            { label: "Invitation", value: j.invitationStatus },
            { label: "Work Done", value: <Check done={j.workCompleted} /> },
            { label: "Proof Doc", value: <Check done={j.proofDoc} /> },
            { label: "Certificate", value: <Check done={j.certificate} /> },
          ]} />
        </ServiceCard>
      ))}
    </div>
  );
}

function ResearchTracker() {
  return (
    <div className="space-y-3">
      {RESEARCH_PAPERS.map((p) => (
        <ServiceCard key={p.id} title={`📄 ${p.title}`} subtitle={`${p.journal} · ${p.authorType}`}
          status={
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{
              backgroundColor: p.reviewStatus === "Published" ? "#0d2b1a" : p.reviewStatus === "Accepted" ? "#0f1a2e" : "#1f1400",
              color: p.reviewStatus === "Published" ? "#4ade80" : p.reviewStatus === "Accepted" ? "#60a5fa" : "#fbbf24",
            }}>{p.reviewStatus}</span>
          }
        >
          <InfoGrid items={[
            { label: "Area", value: p.researchArea },
            { label: "Draft", value: <StatusBadge status={p.draftStatus} /> },
            { label: "Plagiarism Check", value: <Check done={p.plagiarismCheck} /> },
            { label: "Published URL", value: p.publishedUrl ? <a href={p.publishedUrl} target="_blank" rel="noreferrer" style={{ color: "#60a5fa" }}>View →</a> : "—" },
          ]} />
        </ServiceCard>
      ))}
    </div>
  );
}

function MembershipsTracker() {
  return (
    <div className="space-y-3">
      {MEMBERSHIPS.map((m) => (
        <ServiceCard key={m.id} title={`🏛️ ${m.org} — ${m.type}`} subtitle={m.country} status={<StatusBadge status={m.status} />}>
          <InfoGrid items={[
            { label: "Applied", value: m.applied },
            { label: "Approved", value: m.approved || "—" },
            { label: "Member ID", value: m.memberId || "—" },
            { label: "Certificate", value: <Check done={m.certificate} /> },
          ]} />
        </ServiceCard>
      ))}
    </div>
  );
}

function WebinarsTracker() {
  return (
    <div className="space-y-3">
      {WEBINARS.map((w) => (
        <ServiceCard key={w.id} title={`🎤 ${w.topic}`} subtitle={`${w.host} · ${w.speakerRole}`} status={<StatusBadge status={w.status} />}>
          <InfoGrid items={[
            { label: "Date", value: w.date },
            { label: "Audience", value: w.audienceSize.toLocaleString() },
            { label: "Certificate", value: <Check done={w.certificate} /> },
            { label: "Recording", value: w.recordingLink ? <a href={w.recordingLink} target="_blank" rel="noreferrer" style={{ color: "#60a5fa" }}>Watch →</a> : "Pending" },
          ]} />
        </ServiceCard>
      ))}
    </div>
  );
}

function WebsiteTracker() {
  const d = WEBSITE_DATA;
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl p-4" style={{ backgroundColor: "#0d0d0d", border: "1px solid #1f1f1f" }}>
          <h4 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#737373" }}>Website Status</h4>
          <div className="space-y-2 text-xs">
            {[
              { label: "Domain", value: d.domain },
              { label: "Hosting", value: d.hostingStatus },
              { label: "Pages", value: `${d.pagesCompleted}/${d.totalPages}` },
            ].map((f) => (
              <div key={f.label} className="flex justify-between py-1.5" style={{ borderBottom: "1px solid #1a1a1a" }}>
                <span style={{ color: "#737373" }}>{f.label}</span>
                <span className="font-semibold" style={{ color: "#ffffff" }}>{f.value}</span>
              </div>
            ))}
          </div>
          <ProgressBar value={(d.pagesCompleted / d.totalPages) * 100} size="sm" className="mt-3" />
          <h4 className="text-xs font-semibold uppercase tracking-widest mb-2 mt-4" style={{ color: "#737373" }}>Page Completion</h4>
          <div className="space-y-1.5">
            {[
              { label: "Bio Page", done: d.bioPage }, { label: "Media Page", done: d.mediaPage },
              { label: "Publications Page", done: d.publicationsPage }, { label: "Awards Page", done: d.awardsPage },
            ].map((p) => (
              <div key={p.label} className="flex items-center gap-2 text-xs">
                <Check done={p.done} />
                <span style={{ color: p.done ? "#ffffff" : "#737373" }}>{p.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#737373" }}>Blog Posts</h4>
          <div className="space-y-2">
            {d.blogs.map((b, i) => (
              <div key={i} className="rounded-xl p-3" style={{ backgroundColor: "#0d0d0d", border: "1px solid #1f1f1f" }}>
                <p className="text-sm font-medium" style={{ color: "#ffffff" }}>{b.title}</p>
                <div className="flex items-center gap-2 mt-1.5 text-xs flex-wrap">
                  <span style={{ color: "#737373" }}>{b.date}</span>
                  <StatusBadge status={b.seo} />
                  <a href={b.url} target="_blank" rel="noreferrer" className="ml-auto" style={{ color: "#60a5fa" }}>
                    <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BookTracker() {
  const b = BOOKS[0];
  return (
    <div className="space-y-4">
      <div className="rounded-xl p-5" style={{ backgroundColor: "#0d0d0d", border: "1px solid #1f1f1f" }}>
        <div className="flex items-start justify-between flex-wrap gap-2 mb-4">
          <div>
            <h4 className="font-semibold" style={{ color: "#ffffff" }}>📚 {b.title}</h4>
            <p className="text-xs mt-0.5" style={{ color: "#737373" }}>{b.topic} · {b.platform}</p>
          </div>
          <StatusBadge status={b.launchStatus} />
        </div>
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span style={{ color: "#737373" }}>Chapter Progress</span>
            <span className="font-bold" style={{ color: "#ffe500" }}>{b.chapterProgress}%</span>
          </div>
          <ProgressBar value={b.chapterProgress} size="md" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {[
            { label: "Outline", status: b.outlineStatus },
            { label: "Editing", status: b.editingStatus },
            { label: "Cover Design", status: b.coverDesign },
            { label: "ISBN", status: b.isbnStatus },
            { label: "Launch", status: b.launchStatus },
          ].map((f) => (
            <div key={f.label} className="rounded-lg p-2" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}>
              <p className="text-[10px] mb-1" style={{ color: "#737373" }}>{f.label}</p>
              <StatusBadge status={f.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PodcastTracker() {
  return (
    <div className="space-y-3">
      {PODCASTS.map((p) => (
        <ServiceCard key={p.id} title={`🎙 Ep. ${p.episode} — ${p.title}`} subtitle={`Guest: ${p.guest} · ${p.recordingDate}`} status={<StatusBadge status={p.editingStatus} />}>
          <InfoGrid items={[
            { label: "Platform", value: p.platform },
            { label: "Clips Created", value: p.clipsCreated },
            { label: "Promotion", value: <StatusBadge status={p.promotionStatus} /> },
            { label: "Link", value: p.link ? <a href={p.link} target="_blank" rel="noreferrer" style={{ color: "#60a5fa" }}>Listen →</a> : "—" },
          ]} />
        </ServiceCard>
      ))}
    </div>
  );
}

const CONTENT_MAP: Record<string, React.ReactNode> = {
  pr:          <PRTracker />,
  linkedin:    <LinkedInTracker />,
  awards:      <AwardsTracker />,
  jury:        <JuryTracker />,
  research:    <ResearchTracker />,
  memberships: <MembershipsTracker />,
  webinars:    <WebinarsTracker />,
  website:     <WebsiteTracker />,
  book:        <BookTracker />,
  podcast:     <PodcastTracker />,
};

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState("pr");

  return (
    <div className="p-4 md:p-6 space-y-4 overflow-y-auto flex-1" style={{ backgroundColor: "#0a0a0a" }}>
      {/* Client selector */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          className="text-sm font-semibold rounded-xl px-3 py-2 focus:outline-none"
          style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", color: "#ffffff" }}
        >
          <option>Dr. Arjun Mehta</option>
          <option>Sneha Kapoor</option>
          <option>Carlos Rivera</option>
        </select>
        <span className="text-xs" style={{ color: "#4a4a4a" }}>· Service Trackers</span>
      </div>

      {/* Tab strip */}
      <div className="flex gap-1.5 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all"
            style={
              activeTab === tab.id
                ? { backgroundColor: "#ffe500", color: "#0a0a0a" }
                : { backgroundColor: "#1a1a1a", color: "#737373", border: "1px solid #2a2a2a" }
            }
            onMouseEnter={e => {
              if (activeTab !== tab.id) e.currentTarget.style.borderColor = "#ffe500";
            }}
            onMouseLeave={e => {
              if (activeTab !== tab.id) e.currentTarget.style.borderColor = "#2a2a2a";
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="rounded-2xl p-4 md:p-5" style={{ backgroundColor: "#111111", border: "1px solid #1f1f1f" }}>
        {CONTENT_MAP[activeTab]}
      </div>
    </div>
  );
}
