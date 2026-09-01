// ==========================================
// GOVERNMENT MODULE - PROBLEM & ALLOCATION ROUTES
// File: Backend/gov/routes/govProblemRoutes.ts
// ==========================================

/*
  PURPOSE:
  - Defines Express API routes for government officials to review, validate, and allocate societal problems.

  ENDPOINTS TO CONFIGURE:
  - GET  /api/gov/problems/all                -> calls getAllSubmittedProblems (protected)
  - PUT  /api/gov/problems/:id/verify         -> calls verifyAndRouteProblem (protected)
  - POST /api/gov/problems/:id/emergency-sos  -> calls handleDisasterEmergencyEscalation (protected)
  - PUT  /api/gov/problems/:id/approve-pilot  -> calls approveSolutionForFieldDeployment (protected)
*/
