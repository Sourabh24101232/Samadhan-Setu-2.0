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

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role?: string;
    phone?: string;
    [key: string]: any;
  };
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Access Denied: No Token Provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'your_citizen_jwt_secret_key_here';
    const decoded = jwt.verify(token, secret) as any;

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or Expired Token' });
    return;
  }
};

export const optionalVerifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'your_citizen_jwt_secret_key_here';
      const decoded = jwt.verify(token, secret) as any;
      req.user = decoded;
    }
    next();
  } catch (error) {
    // For optional token, continue even if token is absent/malformed
    next();
  }
};

export default verifyToken;
