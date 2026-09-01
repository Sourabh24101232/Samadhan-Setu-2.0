// ==========================================
// GOVERNMENT MODULE - ANALYTICS ROUTES
// File: Backend/gov/routes/analyticsRoutes.ts
// ==========================================

/*
  PURPOSE:
  - Defines Express API routes to power government analytical charts, maps, and reports.

  ENDPOINTS TO CONFIGURE:
  - GET /api/gov/analytics/overview             -> calls getStatewideSummaryStats
  - GET /api/gov/analytics/districts            -> calls getDistrictWiseDistribution
  - GET /api/gov/analytics/domains              -> calls getThematicDomainDistribution
  - GET /api/gov/analytics/university-rankings  -> calls getUniversityPerformanceMetrics
*/
