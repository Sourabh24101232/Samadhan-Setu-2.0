// ==========================================
// CITIZEN MODULE - AUTH ROUTES
// File: Backend/citizen/routes/citizenAuthRoutes.ts
// ==========================================

/*
  PURPOSE:
  - Defines Express API routes for citizen authentication and profile.

  ENDPOINTS TO CONFIGURE:
  - POST /api/citizen/auth/register -> calls registerCitizen
  - POST /api/citizen/auth/login    -> calls loginCitizen
  - GET  /api/citizen/auth/profile  -> calls getCitizenProfile (requires auth middleware)
*/
