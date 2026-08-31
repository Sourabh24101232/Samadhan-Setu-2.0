// ==========================================
// UNIVERSITY MODULE - AUTH MIDDLEWARE
// File: Backend/university/middlewares/authMiddleware.ts
// ==========================================

/*
  PURPOSE:
  - Protects private university/HEI routes by validating JWT tokens for faculty mentors and student leads.

  WHAT TO IMPLEMENT LATER:
  1. Import { Request, Response, NextFunction } from 'express'.
  2. Import jwt from 'jsonwebtoken'.
  3. Extract token from `req.headers.authorization`.
  4. Verify token using process.env.JWT_SECRET.
  5. Check if user role matches university roles ('Faculty_Mentor', 'Student_Lead', 'Incubation_Head', 'University_Admin').
  6. Attach decoded payload to `req.user` and call `next()`.
*/
