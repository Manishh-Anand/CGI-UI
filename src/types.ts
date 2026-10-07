export type UserRole = 'New Joiner' | 'Employee' | 'Contributor' | 'Admin' | 'Management';

export type IntelligenceArea = 'Clients' | 'Competitors' | 'Workflow' | 'Tools' | 'Technology';

export type Priority = 'P0' | 'P1' | 'P2' | 'P3';
export type FreshnessState = 'Fresh' | 'Aging' | 'Stale' | 'Unknown';

export interface DataEvidence {
  sourceName: string;
  sourceUrl?: string;
  retrievedAt: string;
  lastUpdatedAt?: string;
  freshnessState: FreshnessState;
  confidence: 'High' | 'Medium' | 'Low' | 'Unverified';
  comparisonBasis?: string;
  notes?: string;
}

export type RegionFilter = 'All' | 'North America' | 'EMEA' | 'APAC';
export type DepartmentFilter = 'All' | 'Legal Solutions' | 'Forensics' | 'Managed Services' | 'Data Operations';
export type DateRangeFilter = 'LTM' | 'YTD' | 'Q3 2026' | 'Q2 2026';

export interface GlobalFilterState {
  region: RegionFilter;
  department: DepartmentFilter;
  dateRange: DateRangeFilter;
  savedViewName?: string;
}

export interface CompanyTimelineItem {
  year: string;
  title: string;
  summary: string;
  capability: string;
  evidence: DataEvidence;
}

export interface CompanyLeader {
  name: string;
  title: string;
  biography: string;
  highlights: string[];
  portraitUrl?: string;
  evidence: DataEvidence;
}

export interface UnifiedWorkflowNode {
  id: string;
  label: string;
  description: string;
  metric: string;
  owner: string;
  tools: string[];
  subflowStages: string[];
}

export interface UnifiedWorkflowLayer {
  id: 'system' | 'business' | 'application' | 'data';
  name: string;
  summary: string;
  nodes: UnifiedWorkflowNode[];
}

export type ClientStatus = 'Active' | 'Watch' | 'Attention' | 'Growth';
export type ChurnRisk = 'Low' | 'Medium' | 'High';

export interface ClientService {
  name: string;
  sharePercent: number;
  activeMatters: number;
}

export interface ClientReview {
  author: string;
  role: string;
  date: string;
  rating: number; // 1-5
  comment: string;
}

export interface ClientRecord {
  id: string;
  name: string;
  tier: 'Enterprise' | 'Strategic' | 'Mid-Market';
  region: 'North America' | 'EMEA' | 'APAC';
  industry: string;
  accountOwner: string;
  status: ClientStatus;
  annualRevenue: number; // in USD (synthetic)
  revenueSharePercent: number; // % of portfolio
  yoyGrowth: number; // e.g. -14, +8
  qoqGrowth: number;
  services: string[]; // ['Review', 'Processing', etc.]
  serviceMix: ClientService[];
  activeMattersCount: number;
  documentsProcessedGB: number;
  healthScore: number; // 0-100
  churnRisk: ChurnRisk;
  nextBestAction: string;
  whitespaceOpportunity: string;
  competitorExposure: string;
  clientSince: string;
  quarterlyRevenue: { quarter: string; revenue: number }[];
  reviews: ClientReview[];
  evidence?: DataEvidence;
}

export interface CompetitorCapability {
  capability: string;
  consilioRating: 'Leading' | 'Strong' | 'Moderate';
  competitorRating: 'Leading' | 'Strong' | 'Moderate' | 'Limited';
  differential: number; // -2 to +2
}

export interface CompetitorRecord {
  id: string;
  name: string;
  marketPosition: 'Market Leader' | 'Challenger' | 'Legacy Incumbent' | 'Specialist';
  marketSharePct: number;
  analystRanking: string;
  strengths: string[];
  weaknesses: string[];
  keyOfferings: string[];
  pricingModel: string;
  recentMoves: { date: string; title: string; impact: string }[];
  battlecardSummary: string;
  capabilities: CompetitorCapability[];
  capabilityGapScore: number; // e.g. +14% net Consilio advantage
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  evidence?: DataEvidence;
}

export interface WorkflowStage {
  id: string;
  number: string;
  name: string;
  shortDesc: string;
  fullDesc: string;
  roles: { role: string; raci: 'R' | 'A' | 'C' | 'I' }[];
  toolsUsed: string[];
  primaryInputs: string[];
  primaryOutputs: string[];
  handoffs: string;
  avgCycleTime: string;
  throughputMetric: string;
  commonBottlenecks: string[];
}

export interface RoleRecord {
  id: string;
  title: string;
  department: string;
  experienceLevel: string;
  overview: string;
  responsibilities: string[];
  inputs: string[];
  outputs: string[];
  workflowStages: string[];
  primaryTools: string[];
  kpis: { label: string; target: string }[];
  coreSkills: string[];
  careerPath: string[];
}

export interface InternalToolRecord {
  id: string;
  name: string;
  category: string;
  tagline: string;
  whatItDoes: string;
  whoUsesIt: string[];
  workflowStages: string[];
  relatedTools: string[];
  integrations: string[];
  atlasDocUrl: string;
  adoptionTier: 'Enterprise Standard' | 'Specialized Tier' | 'Phase Out / Legacy';
  adoptionRatePct: number;
  licenseModel: string;
  systemStatus: 'Operational' | 'Scheduled Maintenance' | 'Degraded';
  recentReleases: { version: string; date: string; note: string }[];
  evidence?: DataEvidence;
}

export type RadarRing = 'Adopt' | 'Trial' | 'Assess' | 'Hold';

export interface TechRadarItem {
  id: string;
  name: string;
  category: 'AI & Machine Learning' | 'Architecture & Cloud' | 'Analytics & ECA' | 'Forensics & Privacy';
  ring: RadarRing;
  summary: string;
  consilioMaturity: 'High' | 'Growing' | 'Emerging' | 'Evaluating';
  marketAdoptionPct: number;
  impactOnRoles: string;
  regulatoryConsiderations: string;
  evidence?: DataEvidence;
}

export interface LearningModule {
  id: string;
  title: string;
  area: IntelligenceArea;
  durationMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'Completed' | 'In Progress' | 'Not Started';
  progressPct: number;
  score?: number;
  summary: string;
  keyTakeaways: string[];
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  moduleTitle: string;
  area: IntelligenceArea;
  options: string[];
  correctIndex: number;
  explanation: string;
  relatedDoc: string;
}

export interface ContributorSubmission {
  id: string;
  title: string;
  area: IntelligenceArea;
  submittedBy: string;
  role: string;
  submittedAt: string;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Rejected';
  summary: string;
  proposedChanges: string;
}

export interface AiSearchResult {
  query: string;
  summary: string;
  evidenceClients?: ClientRecord[];
  evidenceCompetitors?: CompetitorRecord[];
  evidenceTools?: InternalToolRecord[];
  evidenceWorkflow?: WorkflowStage;
  sources: { title: string; dataset: string; lastUpdated: string }[];
  followUpQuestions: string[];
  contextualActions: { label: string; targetView: string; targetId?: string }[];
}
