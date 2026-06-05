// ============================================================
// MOCK DATA — Extraordinary Profile OS
// ============================================================

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

// ── Clients ─────────────────────────────────────────────────
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
  // ownership: "superadmin" = superadmin's private client, "u2"/"u3" = added by that admin
  ownerId: string;
}

export const CLIENTS: Client[] = [
  {
    id: "c1",
    name: "Dr. Arjun Mehta",
    email: "arjun.mehta@example.com",
    phone: "+1 (415) 555-0192",
    country: "India → USA",
    profession: "Artificial Intelligence",
    designation: "Senior Research Scientist",
    company: "Google DeepMind",
    category: "Extraordinary Ability – Science & Technology",
    startDate: "2024-01-15",
    expectedCompletion: "2025-03-31",
    priority: "High",
    assignedManager: "Priya Sharma",
    progress: 72,
    currentStage: "Evidence Compilation",
    notes: "Strong publication record. Focus on judging and award applications.",
    eb1aScore: 78,
    status: "Active",
    avatar: "AM",
    ownerId: "superadmin",
  },
  {
    id: "c2",
    name: "Sneha Kapoor",
    email: "sneha.kapoor@example.com",
    phone: "+44 20 7946 0958",
    country: "India → UK",
    profession: "Biotechnology",
    designation: "Director of R&D",
    company: "AstraZeneca",
    category: "Extraordinary Ability – Sciences",
    startDate: "2024-03-01",
    expectedCompletion: "2025-06-30",
    priority: "Medium",
    assignedManager: "Rahul Verma",
    progress: 45,
    currentStage: "PR & LinkedIn Building",
    notes: "Needs 2 more publications. Strong award potential.",
    eb1aScore: 61,
    status: "Active",
    avatar: "SK",
    ownerId: "u2", // admin Priya Sharma added this client
  },
  {
    id: "c3",
    name: "Carlos Rivera",
    email: "carlos.rivera@example.com",
    phone: "+1 (212) 555-0143",
    country: "Mexico → USA",
    profession: "Architecture & Design",
    designation: "Principal Architect",
    company: "Zaha Hadid Architects",
    category: "Extraordinary Ability – Arts",
    startDate: "2023-08-10",
    expectedCompletion: "2024-12-31",
    priority: "High",
    assignedManager: "Priya Sharma",
    progress: 91,
    currentStage: "Attorney Review",
    notes: "Ready for filing. Awaiting final attorney sign-off.",
    eb1aScore: 92,
    status: "Active",
    avatar: "CR",
    ownerId: "u2", // admin Priya Sharma added this client
  },
  {
    id: "c4",
    name: "Dr. Yuki Tanaka",
    email: "yuki.tanaka@example.com",
    phone: "+81 3 1234 5678",
    country: "Japan → USA",
    profession: "Quantum Computing",
    designation: "Lead Quantum Engineer",
    company: "IBM Research",
    category: "Extraordinary Ability – Science & Technology",
    startDate: "2024-05-15",
    expectedCompletion: "2025-09-30",
    priority: "Medium",
    assignedManager: "Rahul Verma",
    progress: 28,
    currentStage: "Profile Assessment",
    notes: "Early stage. Strong academic background. Publications needed.",
    eb1aScore: 44,
    status: "Active",
    avatar: "YT",
    ownerId: "u3", // admin Rahul Verma added this client
  },
  {
    id: "c5",
    name: "Fatima Al-Hassan",
    email: "fatima.alhassan@example.com",
    phone: "+971 50 123 4567",
    country: "UAE → USA",
    profession: "Environmental Science",
    designation: "Climate Policy Advisor",
    company: "UNEP",
    category: "Extraordinary Ability – Sciences",
    startDate: "2023-11-01",
    expectedCompletion: "2025-01-31",
    priority: "High",
    assignedManager: "Priya Sharma",
    progress: 58,
    currentStage: "Document Review",
    notes: "Delayed due to visa issues. Needs media coverage.",
    eb1aScore: 65,
    status: "Delayed",
    avatar: "FA",
    ownerId: "superadmin", // superadmin's private client
  },
  // ── Superadmin-only private clients (admins never see these) ──
  {
    id: "c6",
    name: "Marcus Thompson",
    email: "marcus.t@example.com",
    phone: "+1 (310) 555-0171",
    country: "USA",
    profession: "Entertainment & Film",
    designation: "Film Director",
    company: "Independent",
    category: "Extraordinary Ability – Arts",
    startDate: "2025-01-10",
    expectedCompletion: "2026-01-10",
    priority: "High",
    assignedManager: "Alex Rivera",
    progress: 15,
    currentStage: "Initial Assessment",
    notes: "High-profile case. VIP client. Handled directly by super admin.",
    eb1aScore: 55,
    status: "Active",
    avatar: "MT",
    ownerId: "superadmin",
  },
  {
    id: "c7",
    name: "Dr. Lena Müller",
    email: "lena.muller@example.com",
    phone: "+49 30 1234 5678",
    country: "Germany → USA",
    profession: "Neuroscience",
    designation: "Principal Investigator",
    company: "Max Planck Institute",
    category: "Extraordinary Ability – Sciences",
    startDate: "2024-09-01",
    expectedCompletion: "2025-12-31",
    priority: "Medium",
    assignedManager: "Alex Rivera",
    progress: 40,
    currentStage: "Evidence Compilation",
    notes: "Direct referral. Confidential.",
    eb1aScore: 70,
    status: "Active",
    avatar: "LM",
    ownerId: "superadmin",
  },
];

// ── Admin–Client visibility assignments ─────────────────────
// Superadmin can share their own clients with an admin.
// Admin sees: their own clients (ownerId === adminId) + clients in this list for them.
// Admin has NO IDEA superadmin has clients outside this list.
export interface AdminClientAccess {
  adminId: string;      // which admin gets access
  clientId: string;     // which superadmin-owned client they can see
}

export let ADMIN_CLIENT_ACCESS: AdminClientAccess[] = [
  // Superadmin shared c5 (Fatima) with admin Priya (u2)
  { adminId: "u2", clientId: "c5" },
  // Superadmin has NOT shared c6 or c7 with anyone — those are invisible to admins
];

// Helper: get clients visible to a given user
export function getVisibleClients(userId: string, role: string): typeof CLIENTS {
  if (role === "superadmin") return CLIENTS; // sees everything
  if (role === "admin") {
    return CLIENTS.filter((c) => {
      const isOwnClient = c.ownerId === userId;
      const isSharedWithMe = ADMIN_CLIENT_ACCESS.some(
        (a) => a.adminId === userId && a.clientId === c.id
      );
      return isOwnClient || isSharedWithMe;
    });
  }
  return CLIENTS;
}

// Helper: toggle admin access to a superadmin client
export function toggleAdminClientAccess(adminId: string, clientId: string): void {
  const existing = ADMIN_CLIENT_ACCESS.findIndex(
    (a) => a.adminId === adminId && a.clientId === clientId
  );
  if (existing >= 0) {
    ADMIN_CLIENT_ACCESS = ADMIN_CLIENT_ACCESS.filter((_, i) => i !== existing);
  } else {
    ADMIN_CLIENT_ACCESS = [...ADMIN_CLIENT_ACCESS, { adminId, clientId }];
  }
}

// ── Tasks ────────────────────────────────────────────────────
export interface Task {
  id: string;
  clientId: string;
  clientName: string;
  service: string;
  title: string;
  description: string;
  deadline: string;
  priority: Priority;
  status: Status;
  assignedTo: string;
  comments: string;
}

export const TASKS: Task[] = [
  {
    id: "t1",
    clientId: "c1",
    clientName: "Dr. Arjun Mehta",
    service: "Digital PR",
    title: "Submit op-ed to TechCrunch",
    description: "Draft and submit an op-ed piece on AI safety.",
    deadline: "2025-07-15",
    priority: "High",
    status: "In Progress",
    assignedTo: "Meera Joshi",
    comments: "Draft ready, editor review needed",
  },
  {
    id: "t2",
    clientId: "c1",
    clientName: "Dr. Arjun Mehta",
    service: "Awards",
    title: "Apply for MIT Technology Review 35 Under 35",
    description: "Prepare application materials for the annual award.",
    deadline: "2025-07-30",
    priority: "High",
    status: "Waiting for Client",
    assignedTo: "Rahul Verma",
    comments: "Waiting for updated resume from client",
  },
  {
    id: "t3",
    clientId: "c2",
    clientName: "Sneha Kapoor",
    service: "Research Paper",
    title: "Submit paper to Nature Biotechnology",
    description: "Final paper on CRISPR applications ready for submission.",
    deadline: "2025-08-10",
    priority: "High",
    status: "In Progress",
    assignedTo: "Dr. Anil Kumar",
    comments: "Plagiarism check done. Formatting in progress.",
  },
  {
    id: "t4",
    clientId: "c2",
    clientName: "Sneha Kapoor",
    service: "LinkedIn",
    title: "LinkedIn profile optimization",
    description: "Update headline, about section, and featured posts.",
    deadline: "2025-07-20",
    priority: "Medium",
    status: "Completed",
    assignedTo: "Meera Joshi",
    comments: "All sections updated. 3 posts scheduled.",
  },
  {
    id: "t5",
    clientId: "c3",
    clientName: "Carlos Rivera",
    service: "Attorney Review",
    title: "Final petition review",
    description: "Attorney final review of all evidence and petition letter.",
    deadline: "2025-07-05",
    priority: "High",
    status: "Waiting for Approval",
    assignedTo: "Priya Sharma",
    comments: "Sent to attorney on June 28",
  },
  {
    id: "t6",
    clientId: "c4",
    clientName: "Dr. Yuki Tanaka",
    service: "Memberships",
    title: "IEEE Senior Member application",
    description: "Prepare and submit IEEE Senior Member application.",
    deadline: "2025-08-30",
    priority: "Medium",
    status: "Not Started",
    assignedTo: "Rahul Verma",
    comments: "",
  },
  {
    id: "t7",
    clientId: "c5",
    clientName: "Fatima Al-Hassan",
    service: "Digital PR",
    title: "Forbes expert contributor article",
    description: "Get client featured in Forbes as expert contributor.",
    deadline: "2025-07-25",
    priority: "High",
    status: "In Progress",
    assignedTo: "Meera Joshi",
    comments: "Editor connected. Draft in review.",
  },
  {
    id: "t8",
    clientId: "c1",
    clientName: "Dr. Arjun Mehta",
    service: "Podcast",
    title: "AI Research Podcast episode recording",
    description: "Record 45-minute podcast episode on ML advances.",
    deadline: "2025-07-18",
    priority: "Medium",
    status: "Submitted",
    assignedTo: "Rahul Verma",
    comments: "Episode recorded and submitted for editing",
  },
];

// ── Evidence / Documents ─────────────────────────────────────
export interface Document {
  id: string;
  clientId: string;
  clientName: string;
  name: string;
  category: string;
  criterion: string;
  uploadedDate: string;
  uploadedBy: string;
  status: "Pending Review" | "Approved" | "Rejected" | "Needs Update";
  strength: Strength;
  type: string;
  size: string;
  reviewedBy: string;
  remarks: string;
}

export const DOCUMENTS: Document[] = [
  {
    id: "d1",
    clientId: "c1",
    clientName: "Dr. Arjun Mehta",
    name: "Nature AI Paper - Published.pdf",
    category: "Research Paper",
    criterion: "Scholarly Articles",
    uploadedDate: "2025-06-10",
    uploadedBy: "Dr. Arjun Mehta",
    status: "Approved",
    strength: "Strong",
    type: "PDF",
    size: "2.4 MB",
    reviewedBy: "Dr. Sarah Chen",
    remarks: "Peer-reviewed, high-impact journal. Strong evidence.",
  },
  {
    id: "d2",
    clientId: "c1",
    clientName: "Dr. Arjun Mehta",
    name: "TechCrunch Feature Article.pdf",
    category: "Digital PR",
    criterion: "Published Material About Applicant",
    uploadedDate: "2025-05-22",
    uploadedBy: "Meera Joshi",
    status: "Approved",
    strength: "Strong",
    type: "PDF",
    size: "1.1 MB",
    reviewedBy: "Dr. Sarah Chen",
    remarks: "High-DA publication. Excellent for criterion 1.",
  },
  {
    id: "d3",
    clientId: "c1",
    clientName: "Dr. Arjun Mehta",
    name: "AI Safety Conference - Jury Certificate.pdf",
    category: "Award Jury",
    criterion: "Judging Work",
    uploadedDate: "2025-06-01",
    uploadedBy: "Rahul Verma",
    status: "Pending Review",
    strength: "Moderate",
    type: "PDF",
    size: "0.8 MB",
    reviewedBy: "",
    remarks: "Awaiting consultant review",
  },
  {
    id: "d4",
    clientId: "c2",
    clientName: "Sneha Kapoor",
    name: "AstraZeneca Salary Proof - 2024.pdf",
    category: "Compensation",
    criterion: "High Salary / Compensation",
    uploadedDate: "2025-06-05",
    uploadedBy: "Sneha Kapoor",
    status: "Approved",
    strength: "Strong",
    type: "PDF",
    size: "0.4 MB",
    reviewedBy: "Dr. Sarah Chen",
    remarks: "Top 5% in field. Strong evidence for criterion.",
  },
  {
    id: "d5",
    clientId: "c3",
    clientName: "Carlos Rivera",
    name: "Zaha Hadid - Senior Architect Contract.pdf",
    category: "Leading Role",
    criterion: "Leading or Critical Role",
    uploadedDate: "2025-04-15",
    uploadedBy: "Carlos Rivera",
    status: "Approved",
    strength: "Strong",
    type: "PDF",
    size: "1.8 MB",
    reviewedBy: "James Mitchell",
    remarks: "Distinguished organization. Clear leadership role.",
  },
  {
    id: "d6",
    clientId: "c4",
    clientName: "Dr. Yuki Tanaka",
    name: "IBM Research - Patent Certificate.pdf",
    category: "Original Contribution",
    criterion: "Original Contribution",
    uploadedDate: "2025-06-20",
    uploadedBy: "Dr. Yuki Tanaka",
    status: "Needs Update",
    strength: "Moderate",
    type: "PDF",
    size: "1.2 MB",
    reviewedBy: "James Mitchell",
    remarks: "Good but needs supporting letter from IBM leadership.",
  },
];

// ── EB1A Criteria ────────────────────────────────────────────
export interface Criterion {
  id: string;
  name: string;
  relatedActivities: string[];
  evidenceAvailable: number;
  evidencePending: number;
  strength: Strength;
  attorneyStatus: "Not Reviewed" | "Under Review" | "Approved" | "Needs More";
  remarks: string;
  finalStatus: Status;
}

export const CRITERIA: Criterion[] = [
  {
    id: "cr1",
    name: "Published Material About Applicant",
    relatedActivities: ["TechCrunch Feature", "Forbes Mention", "MIT Review Article"],
    evidenceAvailable: 5,
    evidencePending: 2,
    strength: "Strong",
    attorneyStatus: "Approved",
    remarks: "Excellent coverage in major tech publications.",
    finalStatus: "Completed",
  },
  {
    id: "cr2",
    name: "Original Contribution",
    relatedActivities: ["AI Safety Framework Paper", "Patent US2024/001234", "Google DeepMind Innovation"],
    evidenceAvailable: 4,
    evidencePending: 1,
    strength: "Strong",
    attorneyStatus: "Approved",
    remarks: "Clear field-of-endeavor impact demonstrated.",
    finalStatus: "Completed",
  },
  {
    id: "cr3",
    name: "Scholarly Articles",
    relatedActivities: ["Nature Paper", "NeurIPS 2024", "ICML Conference"],
    evidenceAvailable: 8,
    evidencePending: 0,
    strength: "Strong",
    attorneyStatus: "Approved",
    remarks: "Strong publication record with peer review.",
    finalStatus: "Completed",
  },
  {
    id: "cr4",
    name: "Judging Work",
    relatedActivities: ["AI Safety Conference Jury", "ICLR Reviewer", "Nature Editorial Board"],
    evidenceAvailable: 3,
    evidencePending: 2,
    strength: "Moderate",
    attorneyStatus: "Under Review",
    remarks: "Good but need 2 more formal jury invitations.",
    finalStatus: "In Progress",
  },
  {
    id: "cr5",
    name: "Memberships",
    relatedActivities: ["ACM Senior Member", "IEEE Member", "AI Safety Board"],
    evidenceAvailable: 3,
    evidencePending: 1,
    strength: "Moderate",
    attorneyStatus: "Under Review",
    remarks: "Need IEEE Senior Member certificate.",
    finalStatus: "Waiting for Approval",
  },
  {
    id: "cr6",
    name: "Awards",
    relatedActivities: ["Google PhD Fellowship", "Best Paper Award NeurIPS"],
    evidenceAvailable: 2,
    evidencePending: 3,
    strength: "Weak",
    attorneyStatus: "Needs More",
    remarks: "Need 2 more prestigious external awards.",
    finalStatus: "In Progress",
  },
  {
    id: "cr7",
    name: "Leading or Critical Role",
    relatedActivities: ["Team Lead – Gemini Project", "Principal Researcher"],
    evidenceAvailable: 4,
    evidencePending: 0,
    strength: "Strong",
    attorneyStatus: "Approved",
    remarks: "Clear evidence of critical role at distinguished org.",
    finalStatus: "Completed",
  },
  {
    id: "cr8",
    name: "High Salary / Compensation",
    relatedActivities: ["Google Salary + RSU Package"],
    evidenceAvailable: 3,
    evidencePending: 0,
    strength: "Strong",
    attorneyStatus: "Approved",
    remarks: "Top 1% compensation. Very strong evidence.",
    finalStatus: "Completed",
  },
  {
    id: "cr9",
    name: "Commercial Success",
    relatedActivities: ["AI Product Deployment", "Licensed IP Revenue"],
    evidenceAvailable: 1,
    evidencePending: 2,
    strength: "Weak",
    attorneyStatus: "Not Reviewed",
    remarks: "Optional criterion. Not prioritized.",
    finalStatus: "On Hold",
  },
];

// ── Team Members ─────────────────────────────────────────────
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  assignedClients: number;
  tasksDue: number;
  completionRate: number;
  avatar: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  { id: "tm1", name: "Priya Sharma", role: "Account Manager", email: "priya@epros.com", assignedClients: 3, tasksDue: 7, completionRate: 88, avatar: "PS" },
  { id: "tm2", name: "Rahul Verma", role: "PR Strategist", email: "rahul@epros.com", assignedClients: 4, tasksDue: 12, completionRate: 74, avatar: "RV" },
  { id: "tm3", name: "Meera Joshi", role: "Content Writer", email: "meera@epros.com", assignedClients: 5, tasksDue: 9, completionRate: 91, avatar: "MJ" },
  { id: "tm4", name: "Dr. Anil Kumar", role: "Research Lead", email: "anil@epros.com", assignedClients: 2, tasksDue: 4, completionRate: 95, avatar: "AK" },
];

// ── PR Articles ──────────────────────────────────────────────
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

export const PR_ARTICLES: PRArticle[] = [
  {
    id: "pr1",
    platform: "TechCrunch",
    country: "USA",
    type: "Feature",
    title: "How AI Safety Researchers Are Shaping the Future of Machine Intelligence",
    draftStatus: "Completed",
    publishedUrl: "https://techcrunch.com/ai-safety",
    publicationDate: "2025-05-15",
    daScore: 94,
    screenshotUploaded: true,
    invoiceUploaded: true,
    status: "Published",
    remarks: "Excellent coverage. High DA.",
  },
  {
    id: "pr2",
    platform: "Forbes",
    country: "USA",
    type: "Op-ed",
    title: "The Ethical Imperative of Responsible AI Development",
    draftStatus: "In Progress",
    publishedUrl: "",
    publicationDate: "",
    daScore: 96,
    screenshotUploaded: false,
    invoiceUploaded: false,
    status: "In Progress",
    remarks: "Editor reviewing draft",
  },
  {
    id: "pr3",
    platform: "MIT Technology Review",
    country: "USA",
    type: "Interview",
    title: "35 Innovators Under 35 Profile",
    draftStatus: "Waiting for Approval",
    publishedUrl: "",
    publicationDate: "",
    daScore: 89,
    screenshotUploaded: false,
    invoiceUploaded: false,
    status: "Waiting for Approval",
    remarks: "Interview recorded, awaiting editorial approval",
  },
  {
    id: "pr4",
    platform: "VentureBeat",
    country: "USA",
    type: "News",
    title: "Google DeepMind Researcher Publishes Breakthrough Safety Framework",
    draftStatus: "Completed",
    publishedUrl: "https://venturebeat.com/deepmind-safety",
    publicationDate: "2025-04-02",
    daScore: 88,
    screenshotUploaded: true,
    invoiceUploaded: true,
    status: "Published",
    remarks: "Good secondary coverage.",
  },
];

// ── Awards ───────────────────────────────────────────────────
export interface Award {
  id: string;
  name: string;
  organization: string;
  country: string;
  eligibilityStatus: "Eligible" | "Checking" | "Not Eligible";
  applicationDeadline: string;
  documentsRequired: string[];
  applicationDraft: Status;
  submittedDate: string;
  resultDate: string;
  resultStatus: "Pending" | "Won" | "Not Selected" | "Shortlisted";
  certificateUploaded: boolean;
}

export const AWARDS: Award[] = [
  {
    id: "aw1",
    name: "MIT Technology Review 35 Under 35",
    organization: "MIT",
    country: "USA",
    eligibilityStatus: "Eligible",
    applicationDeadline: "2025-07-31",
    documentsRequired: ["Bio", "Portfolio", "Nominator Letter"],
    applicationDraft: "In Progress",
    submittedDate: "",
    resultDate: "2025-10-15",
    resultStatus: "Pending",
    certificateUploaded: false,
  },
  {
    id: "aw2",
    name: "Google PhD Fellowship",
    organization: "Google",
    country: "USA",
    eligibilityStatus: "Eligible",
    applicationDeadline: "2024-11-01",
    documentsRequired: ["Transcripts", "Research Statement", "References"],
    applicationDraft: "Completed",
    submittedDate: "2024-10-28",
    resultDate: "2025-01-15",
    resultStatus: "Won",
    certificateUploaded: true,
  },
  {
    id: "aw3",
    name: "Best Paper Award – NeurIPS 2024",
    organization: "NeurIPS Foundation",
    country: "USA",
    eligibilityStatus: "Eligible",
    applicationDeadline: "2024-09-15",
    documentsRequired: ["Paper Submission"],
    applicationDraft: "Completed",
    submittedDate: "2024-09-10",
    resultDate: "2024-12-10",
    resultStatus: "Won",
    certificateUploaded: true,
  },
];

// ── Research Papers ───────────────────────────────────────────
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
  reviewStatus: "Pending" | "Under Review" | "Accepted" | "Rejected" | "Published";
  publishedUrl: string;
  certificate: boolean;
  status: Status;
}

export const RESEARCH_PAPERS: ResearchPaper[] = [
  {
    id: "rp1",
    title: "Constitutional AI: Harmlessness from AI Feedback",
    authorType: "Co-author",
    researchArea: "AI Safety",
    abstractStatus: "Completed",
    draftStatus: "Completed",
    plagiarismCheck: true,
    journal: "Nature Machine Intelligence",
    submissionDate: "2025-01-10",
    reviewStatus: "Published",
    publishedUrl: "https://nature.com/articles/ai-safety",
    certificate: true,
    status: "Published",
  },
  {
    id: "rp2",
    title: "Scalable Oversight in Large Language Models",
    authorType: "Single",
    researchArea: "AI Alignment",
    abstractStatus: "Completed",
    draftStatus: "In Progress",
    plagiarismCheck: false,
    journal: "NeurIPS 2025",
    submissionDate: "",
    reviewStatus: "Pending",
    publishedUrl: "",
    certificate: false,
    status: "In Progress",
  },
];

// ── Monthly Activity (Chart Data) ─────────────────────────────
export const MONTHLY_ACTIVITY = [
  { month: "Jan", pr: 3, awards: 1, papers: 2, linkedin: 8, podcasts: 2 },
  { month: "Feb", pr: 4, awards: 2, papers: 1, linkedin: 12, podcasts: 3 },
  { month: "Mar", pr: 5, awards: 1, papers: 3, linkedin: 10, podcasts: 2 },
  { month: "Apr", pr: 7, awards: 3, papers: 2, linkedin: 15, podcasts: 4 },
  { month: "May", pr: 6, awards: 2, papers: 4, linkedin: 18, podcasts: 3 },
  { month: "Jun", pr: 8, awards: 4, papers: 3, linkedin: 20, podcasts: 5 },
];

export const CLIENT_READINESS = CLIENTS.map((c) => ({
  name: c.name.split(" ").slice(-1)[0],
  score: c.eb1aScore,
}));

export const SERVICE_PROGRESS = [
  { service: "Digital PR", completed: 12, inProgress: 5, pending: 3 },
  { service: "LinkedIn", completed: 8, inProgress: 7, pending: 5 },
  { service: "Awards", completed: 4, inProgress: 6, pending: 8 },
  { service: "Jury Work", completed: 6, inProgress: 4, pending: 3 },
  { service: "Research Papers", completed: 9, inProgress: 6, pending: 4 },
  { service: "Memberships", completed: 11, inProgress: 3, pending: 2 },
  { service: "Webinars", completed: 7, inProgress: 5, pending: 4 },
  { service: "Website", completed: 5, inProgress: 4, pending: 6 },
  { service: "Books", completed: 2, inProgress: 3, pending: 7 },
  { service: "Podcasts", completed: 8, inProgress: 4, pending: 3 },
];

// ── Notifications ────────────────────────────────────────────
export const NOTIFICATIONS = [
  { id: "n1", title: "New document uploaded", desc: "Dr. Arjun Mehta uploaded IEEE Certificate", time: "2 min ago", read: false, type: "document" },
  { id: "n2", title: "Task deadline approaching", desc: "TechCrunch op-ed due in 3 days", time: "1 hr ago", read: false, type: "deadline" },
  { id: "n3", title: "Evidence approved", desc: "Nature Paper approved by Dr. Sarah Chen", time: "3 hrs ago", read: true, type: "approval" },
  { id: "n4", title: "Client message", desc: "Sneha Kapoor: 'When is the LinkedIn update ready?'", time: "5 hrs ago", read: true, type: "message" },
  { id: "n5", title: "New client onboarded", desc: "Carlos Rivera profile activated", time: "1 day ago", read: true, type: "client" },
  { id: "n6", title: "Attorney review complete", desc: "Carlos Rivera petition approved for filing", time: "2 days ago", read: true, type: "approval" },
];

// ── Messages ─────────────────────────────────────────────────
export const MESSAGES = [
  {
    id: "m1",
    from: "Priya Sharma",
    fromRole: "Account Manager",
    avatar: "PS",
    subject: "EB1A Progress Update – Week 26",
    preview: "Hi Dr. Mehta, great news — your Nature paper has been officially approved by the attorney...",
    time: "2 hrs ago",
    read: false,
    body: "Hi Dr. Mehta,\n\nGreat news — your Nature paper has been officially approved by the attorney as strong evidence for Criterion 3 (Scholarly Articles).\n\nWe are currently at 72% overall progress. Next steps:\n1. Submit jury invitation response to AI Safety Conference\n2. Finalize Forbes op-ed draft\n3. Upload updated salary certificate\n\nPlease upload the documents by July 10th to stay on schedule.\n\nBest,\nPriya",
  },
  {
    id: "m2",
    from: "Dr. Arjun Mehta",
    fromRole: "Client",
    avatar: "AM",
    subject: "Question about awards timeline",
    preview: "Hi Priya, I wanted to ask about the MIT Technology Review deadline...",
    time: "5 hrs ago",
    read: true,
    body: "Hi Priya,\n\nI wanted to ask about the MIT Technology Review 35 Under 35 deadline. Is July 31st the final date?\n\nAlso, I have uploaded the salary certificate — can you check if it's sufficient?\n\nThanks,\nArjun",
  },
  {
    id: "m3",
    from: "Dr. Sarah Chen",
    fromRole: "Consultant",
    avatar: "SC",
    subject: "Evidence Review Complete – Criteria 1-4",
    preview: "I have reviewed all submitted evidence for criteria 1 through 4...",
    time: "1 day ago",
    read: true,
    body: "Team,\n\nI have reviewed all submitted evidence for criteria 1 through 4 for Dr. Arjun Mehta's case.\n\nSummary:\n- Criterion 1 (Published Material): STRONG ✓\n- Criterion 2 (Original Contribution): STRONG ✓\n- Criterion 3 (Scholarly Articles): STRONG ✓\n- Criterion 4 (Judging Work): MODERATE — need 2 more formal jury certificates\n\nPlease action the judging criterion ASAP.\n\nDr. Sarah Chen\nEB1A Consultant",
  },
];

// ── Membership Data ───────────────────────────────────────────
export const MEMBERSHIPS = [
  { id: "mem1", org: "ACM", type: "Senior Member", country: "USA", applied: "2024-03-01", approved: "2024-05-15", memberId: "ACM-2024-7823", certificate: true, validity: "2027-05-15", status: "Completed" as Status },
  { id: "mem2", org: "IEEE", type: "Member", country: "USA", applied: "2024-06-01", approved: "2024-08-10", memberId: "IEEE-98754", certificate: true, validity: "2025-12-31", status: "Completed" as Status },
  { id: "mem3", org: "AI Safety Board", type: "Advisory Board", country: "International", applied: "2025-01-15", approved: "", memberId: "", certificate: false, validity: "", status: "Waiting for Approval" as Status },
];

// ── LinkedIn Data ────────────────────────────────────────────
export const LINKEDIN_DATA = {
  profileAudit: true,
  bannerUpdated: true,
  headlineUpdated: true,
  aboutUpdated: true,
  featuredAdded: true,
  weeklyPostsPlanned: 3,
  postsPublished: 28,
  engagementRate: "4.2%",
  followersGrowth: "+1,240",
  currentFollowers: 8420,
  status: "In Progress" as Status,
  monthlyReport: "Generated",
};

// ── Webinars ─────────────────────────────────────────────────
export const WEBINARS = [
  {
    id: "w1",
    topic: "AI Safety: Practical Approaches for 2025",
    host: "World Economic Forum",
    date: "2025-04-20",
    speakerRole: "Keynote Speaker",
    audienceSize: 3200,
    posterUploaded: true,
    recordingLink: "https://wef.org/ai-safety-2025",
    certificate: true,
    photosUploaded: true,
    status: "Completed" as Status,
  },
  {
    id: "w2",
    topic: "Machine Learning in Healthcare",
    host: "Stanford Medicine",
    date: "2025-06-15",
    speakerRole: "Panelist",
    audienceSize: 850,
    posterUploaded: true,
    recordingLink: "",
    certificate: false,
    photosUploaded: false,
    status: "In Progress" as Status,
  },
];

// ── Podcasts ─────────────────────────────────────────────────
export const PODCASTS = [
  {
    id: "pod1",
    episode: 1,
    title: "The Future of AI Safety with Dr. Arjun Mehta",
    guest: "Lex Fridman",
    recordingDate: "2025-05-10",
    editingStatus: "Completed" as Status,
    platform: "Spotify & YouTube",
    link: "https://spotify.com/episode/ai-safety",
    clipsCreated: 3,
    promotionStatus: "Completed" as Status,
  },
  {
    id: "pod2",
    episode: 2,
    title: "Constitutional AI Explained",
    guest: "Sam Altman",
    recordingDate: "2025-07-15",
    editingStatus: "In Progress" as Status,
    platform: "Spotify",
    link: "",
    clipsCreated: 0,
    promotionStatus: "Not Started" as Status,
  },
];

// ── Book Publishing ───────────────────────────────────────────
export const BOOKS = [
  {
    id: "bk1",
    title: "Safe Intelligence: A Framework for Responsible AI",
    topic: "AI Safety & Ethics",
    outlineStatus: "Completed" as Status,
    chapterProgress: 60,
    editingStatus: "In Progress" as Status,
    coverDesign: "In Progress" as Status,
    isbnStatus: "Not Started" as Status,
    platform: "O'Reilly Media",
    publishedLink: "",
    launchStatus: "In Progress" as Status,
  },
];

// ── Website & Blog ────────────────────────────────────────────
export const WEBSITE_DATA = {
  domain: "arjunmehta.ai",
  hostingStatus: "Active",
  pagesCompleted: 5,
  totalPages: 7,
  bioPage: true,
  mediaPage: true,
  publicationsPage: true,
  awardsPage: false,
  blogs: [
    { title: "Why Constitutional AI Matters", date: "2025-05-01", url: "https://arjunmehta.ai/blog/constitutional-ai", seo: "Optimized" as Status },
    { title: "My Journey to Google DeepMind", date: "2025-04-10", url: "https://arjunmehta.ai/blog/journey", seo: "In Progress" as Status },
  ],
};

// ── Jury Work ─────────────────────────────────────────────────
export const JURY_WORK = [
  {
    id: "j1",
    name: "AI Safety Excellence Awards",
    org: "Partnership on AI",
    category: "Research & Innovation",
    invitationStatus: "Accepted",
    workCompleted: true,
    proofDoc: true,
    certificate: true,
    status: "Completed" as Status,
  },
  {
    id: "j2",
    name: "ICLR 2025 Paper Review",
    org: "OpenReview Foundation",
    category: "Machine Learning Research",
    invitationStatus: "Accepted",
    workCompleted: true,
    proofDoc: true,
    certificate: false,
    status: "In Progress" as Status,
  },
  {
    id: "j3",
    name: "Global Tech Leadership Awards",
    org: "World Tech Forum",
    category: "Technology Leadership",
    invitationStatus: "Pending",
    workCompleted: false,
    proofDoc: false,
    certificate: false,
    status: "Waiting for Approval" as Status,
  },
];
