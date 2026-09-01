// ==========================================
// UNIVERSITY MODULE - PROPOSAL ROUTES
// File: Backend/university/routes/proposalRoutes.ts
// ==========================================

/*
  PURPOSE:
  - Defines Express API routes for university proposal creation, milestones, and prototype updates.

  ENDPOINTS TO CONFIGURE:
  - POST /api/university/proposals/submit            -> calls createSolutionProposal (protected)
  - GET  /api/university/proposals/my-proposals      -> calls getMyUniversityProposals (protected)
  - PUT  /api/university/proposals/:id/milestone     -> calls updateMilestoneProgress (protected)
  - POST /api/university/proposals/:id/prototype-media -> calls uploadPrototypeEvidence (protected)
*/

import { Router } from 'express';
import {
  createSolutionProposal,
  getMyUniversityProposals,
  updateMilestoneProgress,
  uploadPrototypeEvidence
} from '../controllers/proposalController';
import { verifyUniversityToken } from '../middlewares/authMiddleware';

const router = Router();

router.post('/submit', verifyUniversityToken as any, createSolutionProposal as any);
router.get('/my-proposals', verifyUniversityToken as any, getMyUniversityProposals as any);
router.put('/:id/milestone', verifyUniversityToken as any, updateMilestoneProgress as any);
router.post('/:id/prototype-media', verifyUniversityToken as any, uploadPrototypeEvidence as any);

export default router;
