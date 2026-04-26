export type AIEvaluationStatus =
  | "NOT_REQUESTED"
  | "VALIDATING"
  | "QUEUED"
  | "ANALYZING"
  | "SCORING"
  | "GENERATING_REPORT"
  | "COMPLETED"
  | "INSUFFICIENT_DATA"
  | "FAILED"
  | "ACCESS_RESTRICTED";

export interface SubMetric {
  name: string;
  score: number;
  maxScore: number;
  comment: string;
}

export interface Recommendation {
  category: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  text: string;
  impact: string;
}

export interface AIEvaluationReport {
  evaluationId: string;
  startupId: string;
  status: AIEvaluationStatus;
  overallScore: number;
  pitchDeckScore: number;
  businessPlanScore: number;
  teamScore: number;
  marketScore: number;
  productScore: number;
  tractionScore: number;
  financialScore: number;
  calculatedAt: string;
  generatedAt: string;
  isCurrent: boolean;
  configVersion: string;
  modelVersion: string;
  promptVersion: string;
  snapshotLabel: string;
  warningMessages: string[];
  executiveSummary: string;
  strengths: string[];
  opportunities: string[];
  risks: string[];
  concerns: string[];
  gaps: string[];
  recommendations: Recommendation[];
  subMetrics: {
    team: SubMetric[];
    market: SubMetric[];
    product: SubMetric[];
    traction: SubMetric[];
    financial: SubMetric[];
    /** Tiêu chí BE gắn pillar OTHER hoặc không khớp nhóm chính. */
    other: SubMetric[];
  };
}

export type UserRole = "STARTUP_OWNER" | "INVESTOR_FULL" | "INVESTOR_LIMITED" | "INVESTOR_UNAUTHORIZED";

/* ─── Readiness ────────────────────────────────────────────── */

export interface ReadinessItem {
  label: string;
  ready: boolean;
  detail?: string;
}

export interface EligibleDocument {
  id: string;
  name: string;
  type: "PITCH_DECK" | "BUSINESS_PLAN" | "OTHER";
  updatedAt: string;
  recommended: boolean;
}

export interface ReadinessSummary {
  profile: {
    ready: boolean;
    completionPercent: number;
    items: ReadinessItem[];
  };
  documents: {
    ready: boolean;
    eligibleDocs: EligibleDocument[];
    items: ReadinessItem[];
  };
}

export interface ProfileSnapshot {
  name: string;
  stage: string;
  industry: string;
  foundedYear: number;
  teamSize: number;
  lastUpdated: string;
}
