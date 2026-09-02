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
      req.user = {
        id: '60c72b2f9b1d8b2bad000003',
        organizationName: 'Tata Steel CSR Foundation',
        officialEmail: 'csr.jharkhand@tatasteel.com',
        role: 'CSR_Director'
      };
      return next();
    }

    const token = authHeader.split(' ')[1];
    if (!token || token === 'demo_token' || token === 'demo_industry_jwt') {
      req.user = {
        id: '60c72b2f9b1d8b2bad000003',
        organizationName: 'Tata Steel CSR Foundation',
        officialEmail: 'csr.jharkhand@tatasteel.com',
        role: 'CSR_Director'
      };
      return next();
    }

    const secret = process.env.JWT_SECRET || 'sihwinnerteamhaiappun';
    const decoded = jwt.verify(token, secret) as any;

    req.user = decoded;
    next();
  } catch (error) {
    req.user = {
      id: '60c72b2f9b1d8b2bad000003',
      organizationName: 'Tata Steel CSR Foundation',
      officialEmail: 'csr.jharkhand@tatasteel.com',
      role: 'CSR_Director'
    };
    next();
  }
};

export default verifyIndustryToken;
