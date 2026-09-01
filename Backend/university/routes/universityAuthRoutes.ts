// ==========================================
// UNIVERSITY MODULE - AUTH ROUTES
// File: Backend/university/routes/universityAuthRoutes.ts
// ==========================================

/*
  PURPOSE:
  - Defines Express API routes for university user authentication.

  ENDPOINTS TO CONFIGURE:
  - POST /api/university/auth/register -> calls registerUniversityUser
  - POST /api/university/auth/login    -> calls loginUniversityUser
  - GET  /api/university/auth/profile  -> calls getUniversityProfile (protected)
*/

import { Router } from 'express';
import {
  registerUniversityUser,
  loginUniversityUser,
  getUniversityProfile
} from '../controllers/universityAuthController';
import { verifyUniversityToken } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', registerUniversityUser);
router.post('/login', loginUniversityUser);
router.get('/profile', verifyUniversityToken as any, getUniversityProfile as any);

export default router;
