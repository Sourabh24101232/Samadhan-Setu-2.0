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
      res.status(401).json({ success: false, message: 'Access Denied: No Token Provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'your_university_jwt_secret_key_here';
    const decoded = jwt.verify(token, secret) as any;

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or Expired Token' });
    return;
  }
};

export default verifyUniversityToken;
