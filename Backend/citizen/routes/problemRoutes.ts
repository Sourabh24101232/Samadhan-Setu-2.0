// ==========================================
// CITIZEN MODULE - PROBLEM ROUTES (WITH ANONYMOUS ACCESS)
// File: Backend/citizen/routes/problemRoutes.ts
// ==========================================

/*
  PURPOSE:
  - Defines Express API routes for problem submission (authenticated & anonymous), public feed, and token tracking.

  ENDPOINTS TO CONFIGURE:
  - POST /api/citizen/problems/submit           -> calls submitProblem (optional auth middleware)
  - GET  /api/citizen/problems/anonymous-track/:token -> calls getAnonymousProblemTimeline (public secret token lookup)
  - GET  /api/citizen/problems/my-submissions   -> calls getMyReportedProblems (requires auth)
  - GET  /api/citizen/problems/public-feed      -> calls getPublicProblemsFeed (public)
  - GET  /api/citizen/problems/:id              -> calls getProblemDetailsAndTimeline (public)
  - POST /api/citizen/problems/:id/upvote       -> calls upvoteProblem (public/auth)
  - POST /api/citizen/problems/:id/verify-ground -> calls confirmGroundSolutionResolution
*/

import { Router } from 'express';
import {
  submitProblem,
  getAnonymousProblemTimeline,
  getMyReportedProblems,
  getPublicProblemsFeed,
  getProblemDetailsAndTimeline,
  upvoteProblem,
  confirmGroundSolutionResolution
} from '../controllers/problemController';
import { verifyToken, optionalVerifyToken } from '../middlewares/authMiddleware';

const router = Router();

router.post('/submit', optionalVerifyToken as any, submitProblem as any);
router.get('/anonymous-track/:token', getAnonymousProblemTimeline as any);
router.get('/my-submissions', verifyToken as any, getMyReportedProblems as any);
router.get('/public-feed', getPublicProblemsFeed as any);
router.get('/:id', getProblemDetailsAndTimeline as any);
router.post('/:id/upvote', upvoteProblem as any);
router.post('/:id/verify-ground', optionalVerifyToken as any, confirmGroundSolutionResolution as any);

export default router;
