// ==========================================
// INDUSTRY MODULE - PARTNERSHIP ROUTES
// File: Backend/industry/routes/partnershipRoutes.ts
// ==========================================

/*
  PURPOSE:
  - Defines Express API routes for industry to discover proposals and initiate funding/mentorship.

  ENDPOINTS TO CONFIGURE:
  - GET  /api/industry/partnerships/browse-proposals -> calls discoverSolutionProposals (public/protected)
  - POST /api/industry/partnerships/sponsor          -> calls initiatePartnershipOrFunding (protected)
  - GET  /api/industry/partnerships/my-commitments   -> calls getMySponsoredCollaborations (protected)
  - POST /api/industry/partnerships/:id/feedback     -> calls postMentorshipFeedback (protected)
*/
