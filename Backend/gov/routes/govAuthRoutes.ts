// ==========================================
// GOVERNMENT MODULE - AUTH ROUTES
// File: Backend/gov/routes/govAuthRoutes.ts
// ==========================================

/*
  PURPOSE:
  - Defines Express API routes for government official login and registration.

  ENDPOINTS TO CONFIGURE:
  - POST /api/gov/auth/register -> calls registerGovOfficer
  - POST /api/gov/auth/login    -> calls loginGovOfficer
  - GET  /api/gov/auth/profile  -> calls getGovOfficerProfile (protected)
*/

import { Router } from 'express';
import {
  registerGovOfficer,
  loginGovOfficer,
  getGovOfficerProfile
} from '../controllers/govAuthController';
import { verifyGovToken } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', registerGovOfficer);
router.post('/login', loginGovOfficer);
router.get('/profile', verifyGovToken as any, getGovOfficerProfile as any);

export default router;
