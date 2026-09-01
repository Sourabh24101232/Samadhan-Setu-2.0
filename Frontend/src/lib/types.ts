// ==========================================
// FRONTEND LIB - TYPESCRIPT INTERFACES
// File: Frontend/src/lib/types.ts
// ==========================================

/*
  PURPOSE:
  - Common TypeScript types and interfaces used across frontend pages and components.

  INTERFACES TO DEFINE LATER:

  export type UserRole = 'citizen' | 'university' | 'industry' | 'gov';

  export interface ProblemItem {
    _id: string;
    title: string;
    description: string;
    voiceNoteUrl?: string;
    languageCode?: string;
    isAnonymous: boolean;
    anonymousTrackingToken?: string;
    isDisasterEmergency: boolean;
    isActionableRnD: boolean;
    domainCategory: string;
    location: {
      district: string;
      block?: string;
      villageOrPanchayat?: string;
      landmark?: string;
      latitude?: number;
      longitude?: number;
    };
    mediaAttachments: Array<{ mediaType: string; url: string; isExifStripped?: boolean }>;
    submittedBy?: string | null;
    status: 'Submitted' | 'Under Review' | 'Verified' | 'Assigned to University' | 'Proposal Submitted' | 'In Progress' | 'Testing' | 'Resolved' | 'Rejected' | 'Emergency_Escalated';
    assignedUniversityId?: { _id: string; universityName: string; department: string };
    upvotes: string[];
    severityLevel: 'Low' | 'Medium' | 'High' | 'Critical';
    aiTags: string[];
    citizenGroundFeedback?: {
      isResolvedConfirmedByCitizen: boolean;
      rating: number;
      citizenFeedbackComments?: string;
      verifiedAt?: string;
    };
    createdAt: string;
  }

  export interface SolutionProposalItem {
    _id: string;
    problemId: ProblemItem | string;
    universityId: string;
    proposalTitle: string;
    executiveSummary: string;
    proposedMethodology: string;
    estimatedBudgetINR: number;
    milestoneTranches: Array<{
      milestoneNumber: number;
      title: string;
      description: string;
      targetDate: string;
      percentageFundingToRelease: number;
      status: 'Pending' | 'Submitted_For_Review' | 'Approved_By_Sponsor' | 'Completed';
      deliverableLink?: string;
      mentorReviewNotes?: string;
    }>;
    ipOwnershipDeclaration: string;
    prototypeMedia?: Array<{ mediaType: string; url: string; caption?: string }>;
    status: string;
    industrySponsorId?: { organizationName: string };
  }

  export interface DistrictAnalytics {
    district: string;
    count: number;
    resolvedCount: number;
    inProgressCount: number;
  }
*/

export type UserRole = 'citizen' | 'university' | 'industry' | 'gov';

export type ProblemStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Verified'
  | 'Assigned to University'
  | 'Proposal Submitted'
  | 'In Progress'
  | 'Testing'
  | 'Resolved'
  | 'Rejected'
  | 'Emergency_Escalated';

export type ProblemSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export interface ProblemLocation {
  district: string;
  block?: string;
  villageOrPanchayat?: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
}

export interface MediaAttachment {
  mediaType: 'image' | 'video' | 'audio' | 'document';
  url: string;
  isExifStripped?: boolean;
  uploadedAt?: string;
}

export interface CitizenGroundFeedback {
  isResolvedConfirmedByCitizen: boolean;
  rating: number;
  citizenFeedbackComments?: string;
  verifiedAt?: string;
}

export interface ProblemItem {
  _id: string;
  title: string;
  description: string;
  voiceNoteUrl?: string;
  languageCode?: string;
  isAnonymous: boolean;
  anonymousTrackingToken?: string;
  isDisasterEmergency: boolean;
  isActionableRnD: boolean;
  domainCategory: string;
  location: ProblemLocation;
  mediaAttachments: MediaAttachment[];
  submittedBy?: { _id: string; fullName: string; phone: string } | null;
  status: ProblemStatus;
  assignedUniversityId?: { _id: string; universityName: string; department: string; fullName?: string };
  claimExpiresAt?: string;
  upvotes: string[];
  severityLevel: ProblemSeverity;
  aiTags: string[];
  citizenGroundFeedback?: CitizenGroundFeedback;
  createdAt: string;
  updatedAt?: string;
}

export interface MilestoneTranche {
  milestoneNumber: number;
  title: string;
  description: string;
  targetDate: string;
  percentageFundingToRelease: number;
  status: 'Pending' | 'Submitted_For_Review' | 'Approved_By_Sponsor' | 'Completed';
  deliverableLink?: string;
  mentorReviewNotes?: string;
}

export interface SolutionProposalItem {
  _id: string;
  problemId: ProblemItem;
  universityId: { _id: string; fullName: string; universityName: string; department: string; institutionalEmail: string };
  proposalTitle: string;
  executiveSummary: string;
  proposedMethodology: string;
  estimatedBudgetINR: number;
  projectTimelineMonths: number;
  teamMembers: Array<{ name: string; branch: string; year: string; role: string }>;
  facultyMentor: { name: string; email: string; department: string; mentorApprovalStatus: string };
  milestoneTranches: MilestoneTranche[];
  ipOwnershipDeclaration: string;
  prototypeMedia: Array<{ mediaType: string; url: string; caption?: string; uploadedAt?: string }>;
  industrySponsorId?: { _id: string; organizationName: string; officialEmail: string };
  status: string;
  createdAt: string;
}

export interface PartnershipItem {
  _id: string;
  industryId: { _id: string; organizationName: string; orgType: string; officialEmail: string };
  proposalId: SolutionProposalItem;
  universityId: { _id: string; fullName: string; universityName: string; department: string };
  collaborationType: string[];
  totalPledgedFundingINR: number;
  fundingDisbursements: Array<{
    trancheNumber: number;
    amountINR: number;
    disbursedAt?: string;
    transactionReferenceOrUTR?: string;
    milestoneReferenceId?: string;
    status: string;
  }>;
  mentorshipFeedbackThread: Array<{
    mentorName: string;
    message: string;
    timestamp: string;
    attachedReviewDocUrl?: string;
  }>;
  status: string;
  createdAt: string;
}

export interface DistrictStat {
  district: string;
  totalReported: number;
  inProgressCount: number;
  resolvedCount: number;
  emergencyCount: number;
  intensityLevel: 'Low' | 'Medium' | 'High';
}

export interface StatewideKPIs {
  totalSocietalProblemsReported: number;
  activeChallengesInProgress: number;
  solutionsFieldDeployedAndResolved: number;
  disasterEmergencySOSAlerts: number;
  participatingUniversitiesAndHEIs: number;
  totalSolutionProposalsSubmitted: number;
  totalCSRGrantsMobilizedINR: number;
  resolutionRatePercentage: number;
}
