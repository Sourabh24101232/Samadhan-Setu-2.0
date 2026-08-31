// ==========================================
// CITIZEN MODULE - AUTH MIDDLEWARE
// File: Backend/citizen/middlewares/authMiddleware.ts
// ==========================================

/*
  PURPOSE:
  - Protects private citizen routes by verifying the JWT token sent in the Authorization header (Bearer <token>).

  WHAT TO IMPLEMENT LATER:
  1. Import { Request, Response, NextFunction } from 'express'.
  2. Import jwt from 'jsonwebtoken'.
  3. Extract token from `req.headers.authorization` (format: 'Bearer <token>').
  4. If no token provided, return 401 Unauthorized ("Access Denied: No Token Provided").
  5. Verify token with `jwt.verify(token, process.env.JWT_SECRET)`.
  6. Attach decoded citizen payload (e.g. { id, role, phone }) to `req.user`.
  7. Call `next()` to continue to the protected controller.
*/
