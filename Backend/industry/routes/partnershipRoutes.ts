// ==========================================
// INDUSTRY MODULE - PARTNERSHIP ROUTES
// File: Backend/industry/routes/partnershipRoutes.ts
// ==========================================

/*
  PURPOSE:
  - Defines Express API routes for industry to discover proposals and initiate funding/mentorship.

  ENDPOINTS TO CONFIGURE:
  - GET  /api/industry/partnerships/browse-proposals -> calls discoverSolutionProposals (public/protected)
  - POST /api/industry/partnerships/sponsor          -> calls initiatePartnershipOrFunding (protected)
  - GET  /api/industry/partnerships/my-commitments   -> calls getMySponsoredCollaborations (protected)
  - POST /api/industry/partnerships/:id/feedback     -> calls postMentorshipFeedback (protected)
*/

import { Router } from 'express';
import {
  discoverSolutionProposals,
  initiatePartnershipOrFunding,
  getMySponsoredCollaborations,
  postMentorshipFeedback,
  disburseTrancheFunding
} from '../controllers/partnershipController';
import { verifyIndustryToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/browse-proposals', discoverSolutionProposals);
router.post('/sponsor', verifyIndustryToken as any, initiatePartnershipOrFunding as any);
router.get('/my-commitments', verifyIndustryToken as any, getMySponsoredCollaborations as any);
router.post('/:id/feedback', verifyIndustryToken as any, postMentorshipFeedback as any);
router.post('/:id/disburse-tranche', verifyIndustryToken as any, disburseTrancheFunding as any);

export default router;
