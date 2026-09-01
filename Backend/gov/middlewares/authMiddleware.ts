// ==========================================
// GOVERNMENT MODULE - AUTH MIDDLEWARE
// File: Backend/gov/middlewares/authMiddleware.ts
// ==========================================

/*
  PURPOSE:
  - Protects administrative government routes (approving pilot solutions, statewide sensitive stats).

  WHAT TO IMPLEMENT LATER:
  1. Import { Request, Response, NextFunction } from 'express'.
  2. Import jwt from 'jsonwebtoken'.
  3. Extract Bearer token from headers.
  4. Verify token with JWT_SECRET and confirm user is a verified GovAdmin/DepartmentOfficer.
  5. If valid, set `req.user` and call `next()`. Otherwise return 403 Forbidden.
*/

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface GovAuthRequest extends Request {
  user?: {
    id: string;
    role?: string;
    governmentEmail?: string;
    department?: string;
    assignedDistrict?: string;
    [key: string]: any;
  };
}

export const verifyGovToken = (req: GovAuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Access Denied: No Token Provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'your_gov_jwt_secret_key_here';
    const decoded = jwt.verify(token, secret) as any;

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or Expired Token' });
    return;
  }
};

export default verifyGovToken;
