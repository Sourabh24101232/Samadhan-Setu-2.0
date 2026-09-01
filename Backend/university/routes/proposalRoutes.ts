// ==========================================
// UNIVERSITY MODULE - PROPOSAL ROUTES
// File: Backend/university/routes/proposalRoutes.ts
// ==========================================

/*
  PURPOSE:
  - Defines Express API routes for university proposal creation, milestones, and prototype updates.

  ENDPOINTS TO CONFIGURE:
  - POST /api/university/proposals/submit            -> calls createSolutionProposal (protected)
  - GET  /api/university/proposals/my-proposals      -> calls getMyUniversityProposals (protected)
  - PUT  /api/university/proposals/:id/milestone     -> calls updateMilestoneProgress (protected)
  - POST /api/university/proposals/:id/prototype-media -> calls uploadPrototypeEvidence (protected)
*/
