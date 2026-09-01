// ==========================================
// INDUSTRY MODULE - AUTH ROUTES
// File: Backend/industry/routes/industryAuthRoutes.ts
// ==========================================

/*
  PURPOSE:
  - Defines Express API routes for industry partner authentication.

  ENDPOINTS TO CONFIGURE:
  - POST /api/industry/auth/register -> calls registerIndustry
  - POST /api/industry/auth/login    -> calls loginIndustry
  - GET  /api/industry/auth/profile  -> calls getIndustryProfile (protected)
*/

import { Router } from 'express';
import {
  registerIndustry,
  loginIndustry,
  getIndustryProfile
} from '../controllers/industryAuthController';
import { verifyIndustryToken } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', registerIndustry);
router.post('/login', loginIndustry);
router.get('/profile', verifyIndustryToken as any, getIndustryProfile as any);

export default router;
