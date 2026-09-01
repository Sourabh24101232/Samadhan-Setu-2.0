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

import { Router } from 'express';
import {
  getRoutedProblems,
  claimProblemForInvestigation,
  getAssignedProblemsHistory
} from '../controllers/universityProblemController';
import { verifyUniversityToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/routed', verifyUniversityToken as any, getRoutedProblems as any);
router.post('/:id/claim', verifyUniversityToken as any, claimProblemForInvestigation as any);
router.get('/history', verifyUniversityToken as any, getAssignedProblemsHistory as any);

export default router;
