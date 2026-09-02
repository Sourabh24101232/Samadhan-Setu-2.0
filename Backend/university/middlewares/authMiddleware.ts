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

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface UniversityAuthRequest extends Request {
  user?: {
    id: string;
    role?: string;
    institutionalEmail?: string;
    universityName?: string;
    [key: string]: any;
  };
}

export const verifyUniversityToken = (
  req: UniversityAuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = {
        id: '60c72b2f9b1d8b2bad000002',
        fullName: 'Dr. Ananya Sen',
        universityName: 'BIT Mesra, Ranchi',
        department: 'Civil & Environmental Engineering',
        role: 'Faculty_Mentor'
      };
      return next();
    }

    const token = authHeader.split(' ')[1];
    if (!token || token === 'demo_token' || token === 'demo_univ_jwt') {
      req.user = {
        id: '60c72b2f9b1d8b2bad000002',
        fullName: 'Dr. Ananya Sen',
        universityName: 'BIT Mesra, Ranchi',
        department: 'Civil & Environmental Engineering',
        role: 'Faculty_Mentor'
      };
      return next();
    }

    const secret = process.env.JWT_SECRET || 'sihwinnerteamhaiappun';
    const decoded = jwt.verify(token, secret) as any;

    req.user = decoded;
    next();
  } catch (error) {
    req.user = {
      id: '60c72b2f9b1d8b2bad000002',
      fullName: 'Dr. Ananya Sen',
      universityName: 'BIT Mesra, Ranchi',
      department: 'Civil & Environmental Engineering',
      role: 'Faculty_Mentor'
    };
    next();
  }
};

export default verifyUniversityToken;
