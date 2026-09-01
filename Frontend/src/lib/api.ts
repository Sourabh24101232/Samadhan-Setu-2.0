// ==========================================
// FRONTEND LIB - API CLIENT HELPERS
// File: Frontend/src/lib/api.ts
// ==========================================

/*
  PURPOSE:
  - Centralized HTTP fetch / Axios helper functions to interact with all 5 backend microservice endpoints.

  FUNCTIONS TO IMPLEMENT LATER:

  1. CITIZEN API:
     - fetchPublicProblems(filterParams) -> GET /api/citizen/problems/public-feed
     - submitNewProblem(problemData, token) -> POST /api/citizen/problems/submit
     - fetchAnonymousTimeline(passkey) -> GET /api/citizen/problems/anonymous-track/:token
     - fetchMySubmissions(token) -> GET /api/citizen/problems/my-submissions
     - upvoteProblemApi(problemId, token) -> POST /api/citizen/problems/:id/upvote

  2. AI API:
     - classifyProblemLive(text, district) -> POST /api/ai/classify
     - checkDuplicateLive(text, coords) -> POST /api/ai/check-duplicates

  3. UNIVERSITY API:
     - fetchRoutedProblems(token) -> GET /api/university/problems/routed
     - claimProblemApi(problemId, token) -> POST /api/university/problems/:id/claim
     - submitProposalApi(proposalData, token) -> POST /api/university/proposals/submit
     - updateMilestoneApi(proposalId, milestoneIdx, status, token) -> PUT /api/university/proposals/:id/milestone

  4. INDUSTRY API:
     - fetchOpenProposals(token) -> GET /api/industry/partnerships/browse-proposals
     - pledgeFundingApi(pledgeData, token) -> POST /api/industry/partnerships/sponsor

  5. GOVERNMENT API:
     - fetchGovOverviewStats() -> GET /api/gov/analytics/overview
     - fetchDistrictStats() -> GET /api/gov/analytics/districts
     - verifyProblemGov(problemId, verifyData, token) -> PUT /api/gov/problems/:id/verify
     - approvePilotGov(problemId, token) -> PUT /api/gov/problems/:id/approve-pilot
*/
