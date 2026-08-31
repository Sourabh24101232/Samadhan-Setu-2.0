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
