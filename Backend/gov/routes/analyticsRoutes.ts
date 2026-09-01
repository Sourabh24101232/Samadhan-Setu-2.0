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

import { Router } from 'express';
import {
  getStatewideSummaryStats,
  getDistrictWiseDistribution,
  getThematicDomainDistribution,
  getUniversityPerformanceMetrics
} from '../controllers/analyticsController';

const router = Router();

router.get('/overview', getStatewideSummaryStats);
router.get('/districts', getDistrictWiseDistribution);
router.get('/domains', getThematicDomainDistribution);
router.get('/university-rankings', getUniversityPerformanceMetrics);

export default router;
