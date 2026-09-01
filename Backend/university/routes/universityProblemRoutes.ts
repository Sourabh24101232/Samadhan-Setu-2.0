// ==========================================
// UNIVERSITY MODULE - PROBLEM ROUTES
// File: Backend/university/routes/universityProblemRoutes.ts
// ==========================================

/*
  PURPOSE:
  - Defines Express API routes for viewing and claiming societal challenges for universities.

  ENDPOINTS TO CONFIGURE:
  - GET  /api/university/problems/routed      -> calls getRoutedProblems (protected)
  - POST /api/university/problems/:id/claim   -> calls claimProblemForInvestigation (protected)
  - GET  /api/university/problems/history     -> calls getAssignedProblemsHistory (protected)
*/
