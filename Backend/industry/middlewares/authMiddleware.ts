// ==========================================
// INDUSTRY MODULE - AUTH MIDDLEWARE
// File: Backend/industry/middlewares/authMiddleware.ts
// ==========================================

/*
  PURPOSE:
  - Protects private industry routes (pledging funds, viewing proprietary proposal details).

  WHAT TO IMPLEMENT LATER:
  1. Import { Request, Response, NextFunction } from 'express'.
  2. Import jwt from 'jsonwebtoken'.
  3. Extract and verify JWT token from Authorization header.
  4. Ensure decoded token contains valid industry partner ID and role.
  5. Attach decoded payload to `req.user` and invoke `next()`.
*/

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface IndustryAuthRequest extends Request {
  user?: {
    id: string;
    role?: string;
    officialEmail?: string;
    organizationName?: string;
    [key: string]: any;
  };
}

export const verifyIndustryToken = (
  req: IndustryAuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Access Denied: No Token Provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'your_industry_jwt_secret_key_here';
    const decoded = jwt.verify(token, secret) as any;

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or Expired Token' });
    return;
  }
};

export default verifyIndustryToken;
