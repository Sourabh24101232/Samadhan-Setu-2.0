// ==========================================
// CITIZEN MODULE - PROBLEM ROUTES (WITH ANONYMOUS ACCESS)
// File: Backend/citizen/routes/problemRoutes.ts
// ==========================================

/*
  PURPOSE:
  - Defines Express API routes for problem submission (authenticated & anonymous), public feed, and token tracking.

  ENDPOINTS TO CONFIGURE:
  - POST /api/citizen/problems/submit           -> calls submitProblem (optional auth middleware: allows anonymous or logged-in)
  - GET  /api/citizen/problems/anonymous-track/:token -> calls getAnonymousProblemTimeline (public: secret token lookup)
  - GET  /api/citizen/problems/my-submissions   -> calls getMyReportedProblems (requires auth)
  - GET  /api/citizen/problems/public-feed      -> calls getPublicProblemsFeed (public)
  - GET  /api/citizen/problems/:id              -> calls getProblemDetailsAndTimeline (public)
  - POST /api/citizen/problems/:id/upvote       -> calls upvoteProblem (public/auth)
  - POST /api/citizen/problems/:id/verify-ground -> calls confirmGroundSolutionResolution
*/
