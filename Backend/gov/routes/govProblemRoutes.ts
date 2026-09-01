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

import { Router } from 'express';
import {
  getAllSubmittedProblems,
  verifyAndRouteProblem,
  handleDisasterEmergencyEscalation,
  approveSolutionForFieldDeployment,
  getCitizenFeedbackAndAuditLog
} from '../controllers/govProblemController';
import { verifyGovToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/all', verifyGovToken as any, getAllSubmittedProblems as any);
router.put('/:id/verify', verifyGovToken as any, verifyAndRouteProblem as any);
router.post('/:id/emergency-sos', verifyGovToken as any, handleDisasterEmergencyEscalation as any);
router.put('/:id/approve-pilot', verifyGovToken as any, approveSolutionForFieldDeployment as any);
router.get('/:id/audit-feedback', verifyGovToken as any, getCitizenFeedbackAndAuditLog as any);

export default router;
