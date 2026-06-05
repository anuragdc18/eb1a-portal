import { supabase } from "./supabase";

export type Role = "superadmin" | "admin" | "client" | "team" | "consultant";

export const ROLES: { id: Role; label: string; desc: string }[] = [
  { id: "superadmin", label: "Super Admin", desc: "Full system access & oversight" },
  { id: "client", label: "Client / Applicant", desc: "Track your EB1A journey" },
  { id: "team", label: "Internal Team Member", desc: "Manage tasks & deliverables" },
  { id: "consultant", label: "Consultant / Reviewer", desc: "Review evidence & criteria" },
];

export type Status =
  | "Not Started"
  | "In Progress"
  | "Waiting for Client"
  | "Waiting for Approval"
  | "Submitted"
  | "Published"
  | "Completed"
  | "Rejected"
  | "On Hold";

export type Priority = "Low" | "Medium" | "High";
export type Strength = "Weak" | "Moderate" | "Strong";

export const STATUS_COLORS: Record<Status, string> = {
  "Not Started": "bg-gray-100 text-gray-600",
  "In Progress": "bg-blue-100 text-blue-700",
  "Waiting for Client": "bg-amber-100 text-amber-700",
  "Waiting for Approval": "bg-purple-100 text-purple-700",
  "Submitted": "bg-indigo-100 text-indigo-700",
  "Published": "bg-emerald-100 text-emerald-700",
  "Completed": "bg-green-100 text-green-700",
  "Rejected": "bg-red-100 text-red-700",
  "On Hold": "bg-orange-100 text-orange-700",
};

export const STRENGTH_COLORS: Record<Strength, string> = {
  "Weak": "bg-red-100 text-red-700",
  "Moderate": "bg-amber-100 text-amber-700",
  "Strong": "bg-green-100 text-green-700",
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  "Low": "bg-gray-100 text-gray-600",
  "Medium": "bg-amber-100 text-amber-700",
  "High": "bg-red-100 text-red-700",
};

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  profession: string;
  designation: string;
  company: string;
  category: string;
  startDate: string;
  expectedCompletion: string;
  priority: Priority;
  assignedManager: string;
  progress: number;
  currentStage: string;
  notes: string;
  eb1aScore: number;
  status: "Active" | "Completed" | "Delayed" | "On Hold";
  avatar: string;
  ownerId: string;
}

export interface AdminClientAccess {
  adminId: string;
  clientId: string;
}

export interface Task {
  id: string;
  clientId: string;
  clientName: string;
  service: string;
  title: string;
  assignedTo: string;
  deadline: string;
  priority: Priority;
  status: Status;
  progress: number;
  comments: number;
  proofUploaded: boolean;
}

export interface Document {
  id: string;
  name: string;
  clientName: string;
  category: string;
  type: string;
  uploadedBy: string;
  uploadDate: string;
  size: string;
  status: "Approved" | "Pending Review" | "Needs Update" | "Rejected";
  reviewer?: string;
  criterion?: string;
}

export interface Criterion {
  id: string;
  name: string;
  relatedActivities: string[];
  evidenceAvailable: number;
  evidencePending: number;
  strength: Strength;
  attorneyStatus: "Not Reviewed" | "In Review" | "Approved" | "Needs More Evidence";
  remarks: string;
  documents: string[];
  finalStatus: Status;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  tasksAssigned: number;
  tasksCompleted: number;
  performance: number;
}

export interface PRArticle {
  id: string;
  platform: string;
  country: string;
  type: "Interview" | "Feature" | "Op-ed" | "News";
  title: string;
  draftStatus: Status;
  publishedUrl: string;
  publicationDate: string;
  daScore: number;
  screenshotUploaded: boolean;
  invoiceUploaded: boolean;
  status: Status;
  remarks: string;
}

export interface Award {
  id: string;
  name: string;
  organization: string;
  country: string;
  eligibilityStatus: string;
  applicationDeadline: string;
  documentsRequired: string[];
  applicationDraft: Status;
  submittedDate: string;
  resultDate: string;
  resultStatus: string;
  certificateUploaded: boolean;
}

export interface ResearchPaper {
  id: string;
  title: string;
  authorType: "Single" | "Co-author";
  researchArea: string;
  abstractStatus: Status;
  draftStatus: Status;
  plagiarismCheck: boolean;
  journal: string;
  submissionDate: string;
  reviewStatus: string;
  publishedUrl: string;
  certificate: boolean;
}

type Row<T> = { id: string; data: T };

async function readRows<T>(table: string): Promise<T[]> {
  const { data, error } = await supabase.from(table).select("id,data").order("id", { ascending: true });
  if (error) {
    console.warn(`Supabase table ${table} is not ready: ${error.message}`);
    return [];
  }
  return ((data ?? []) as Row<T>[]).map((row) => ({ id: row.id, ...row.data }));
}

async function readSetting<T>(key: string, fallback: T): Promise<T> {
  const { data, error } = await supabase.from("portal_settings").select("data").eq("key", key).maybeSingle();
  if (error || !data?.data) {
    if (error) console.warn(`Supabase setting ${key} is not ready: ${error.message}`);
    return fallback;
  }
  return data.data as T;
}

export const CLIENTS: Client[] = [];
export let ADMIN_CLIENT_ACCESS: AdminClientAccess[] = [];
export const TASKS: Task[] = [];
export const DOCUMENTS: Document[] = [];
export const CRITERIA: Criterion[] = [];
export const TEAM_MEMBERS: TeamMember[] = [];
export const PR_ARTICLES: PRArticle[] = [];
export const AWARDS: Award[] = [];
export const RESEARCH_PAPERS: ResearchPaper[] = [];

export const MONTHLY_ACTIVITY: { month: string; clients: number; tasks: number; documents: number }[] = [];
export const SERVICE_PROGRESS: { service: string; completed: number; total: number }[] = [];
export const NOTIFICATIONS: { id: string; title: string; message: string; time: string; type: string; read: boolean }[] = [];
export const MESSAGES: { id: string; from: string; role: string; subject: string; preview: string; body: string; time: string; read: boolean }[] = [];
export const MEMBERSHIPS: any[] = [];
export const WEBINARS: any[] = [];
export const PODCASTS: any[] = [];
export const BOOKS: any[] = [];
export const JURY_WORK: any[] = [];

export const LINKEDIN_DATA = {
  profileAudit: false,
  bannerUpdated: false,
  headlineUpdated: false,
  aboutUpdated: false,
  featuredAdded: false,
  weeklyPostsPlanned: 0,
  postsPublished: 0,
  currentFollowers: 0,
  engagementRate: "0%",
  followersGrowth: "+0",
  monthlyReport: "",
  status: "Not Started" as Status,
};

export const WEBSITE_DATA = {
  domain: "",
  hostingStatus: "Not Started",
  pagesCompleted: 0,
  bioPage: false,
  mediaPage: false,
  publicationsPage: false,
  awardsPage: false,
  blogTitle: "",
  blogDate: "",
  blogUrl: "",
  seoStatus: "Not Started",
};

export const CLIENT_READINESS = CLIENTS.map((c) => ({
  name: c.name.split(" ")[0] || c.name,
  score: c.eb1aScore,
  progress: c.progress,
}));

export function getVisibleClients(userId: string, role: string): typeof CLIENTS {
  if (role === "superadmin") return CLIENTS;
  if (role === "admin") {
    return CLIENTS.filter((c) => {
      const ownsClient = c.ownerId === userId;
      const isSharedWithMe = ADMIN_CLIENT_ACCESS.some((a) => a.adminId === userId && a.clientId === c.id);
      return ownsClient || isSharedWithMe;
    });
  }
  return CLIENTS;
}

export function toggleAdminClientAccess(adminId: string, clientId: string): void {
  const existing = ADMIN_CLIENT_ACCESS.findIndex((a) => a.adminId === adminId && a.clientId === clientId);
  if (existing >= 0) {
    ADMIN_CLIENT_ACCESS = ADMIN_CLIENT_ACCESS.filter((_, i) => i !== existing);
    void supabase.from("portal_admin_client_access").delete().eq("id", `${adminId}:${clientId}`);
  } else {
    const access = { adminId, clientId };
    ADMIN_CLIENT_ACCESS = [...ADMIN_CLIENT_ACCESS, access];
    void supabase.from("portal_admin_client_access").upsert({ id: `${adminId}:${clientId}`, data: access });
  }
}

async function hydratePortalData() {
  const [
    clients,
    access,
    tasks,
    documents,
    criteria,
    teamMembers,
    prArticles,
    awards,
    researchPapers,
    monthlyActivity,
    serviceProgress,
    notifications,
    messages,
    memberships,
    webinars,
    podcasts,
    books,
    juryWork,
    linkedinData,
    websiteData,
  ] = await Promise.all([
    readRows<Client>("portal_clients"),
    readRows<AdminClientAccess>("portal_admin_client_access"),
    readRows<Task>("portal_tasks"),
    readRows<Document>("portal_documents"),
    readRows<Criterion>("portal_criteria"),
    readRows<TeamMember>("portal_team_members"),
    readRows<PRArticle>("portal_pr_articles"),
    readRows<Award>("portal_awards"),
    readRows<ResearchPaper>("portal_research_papers"),
    readRows<{ month: string; clients: number; tasks: number; documents: number }>("portal_monthly_activity"),
    readRows<{ service: string; completed: number; total: number }>("portal_service_progress"),
    readRows<{ id: string; title: string; message: string; time: string; type: string; read: boolean }>("portal_notifications"),
    readRows<{ id: string; from: string; role: string; subject: string; preview: string; body: string; time: string; read: boolean }>("portal_messages"),
    readRows<any>("portal_memberships"),
    readRows<any>("portal_webinars"),
    readRows<any>("portal_podcasts"),
    readRows<any>("portal_books"),
    readRows<any>("portal_jury_work"),
    readSetting("linkedin_data", LINKEDIN_DATA),
    readSetting("website_data", WEBSITE_DATA),
  ]);

  CLIENTS.splice(0, CLIENTS.length, ...clients);
  ADMIN_CLIENT_ACCESS = access;
  TASKS.splice(0, TASKS.length, ...tasks);
  DOCUMENTS.splice(0, DOCUMENTS.length, ...documents);
  CRITERIA.splice(0, CRITERIA.length, ...criteria);
  TEAM_MEMBERS.splice(0, TEAM_MEMBERS.length, ...teamMembers);
  PR_ARTICLES.splice(0, PR_ARTICLES.length, ...prArticles);
  AWARDS.splice(0, AWARDS.length, ...awards);
  RESEARCH_PAPERS.splice(0, RESEARCH_PAPERS.length, ...researchPapers);
  MONTHLY_ACTIVITY.splice(0, MONTHLY_ACTIVITY.length, ...monthlyActivity);
  SERVICE_PROGRESS.splice(0, SERVICE_PROGRESS.length, ...serviceProgress);
  NOTIFICATIONS.splice(0, NOTIFICATIONS.length, ...notifications);
  MESSAGES.splice(0, MESSAGES.length, ...messages);
  MEMBERSHIPS.splice(0, MEMBERSHIPS.length, ...memberships);
  WEBINARS.splice(0, WEBINARS.length, ...webinars);
  PODCASTS.splice(0, PODCASTS.length, ...podcasts);
  BOOKS.splice(0, BOOKS.length, ...books);
  JURY_WORK.splice(0, JURY_WORK.length, ...juryWork);
  Object.assign(LINKEDIN_DATA, linkedinData);
  Object.assign(WEBSITE_DATA, websiteData);
  CLIENT_READINESS.splice(0, CLIENT_READINESS.length, ...CLIENTS.map((c) => ({
    name: c.name.split(" ")[0] || c.name,
    score: c.eb1aScore,
    progress: c.progress,
  })));
}

void hydratePortalData();
