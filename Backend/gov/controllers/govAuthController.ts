// ==========================================
// GOVERNMENT MODULE - AUTH CONTROLLER
// File: Backend/gov/controllers/govAuthController.ts
// ==========================================

/*
  PURPOSE:
  - Handles authentication and administrative access control for Government nodal officers.

  FUNCTIONS TO IMPLEMENT LATER:

  1. registerGovOfficer(req: Request, res: Response):
     - Extract { officialName, governmentEmail, password, department, jurisdictionLevel, assignedDistrict, role } from req.body.
     - Hash password and create GovAdmin document.
     - Return JWT token with admin role.

  2. loginGovOfficer(req: Request, res: Response):
     - Authenticate admin credentials and return JWT token.

  3. getGovOfficerProfile(req: Request, res: Response):
     - Return officer details and department scope.
*/

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { GovAdmin, IGovAdmin } from '../models/GovAdmin';
import { GovAuthRequest } from '../middlewares/authMiddleware';

/**
 * 1. Register a new Government Officer / Admin
 */
export const registerGovOfficer = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      officialName,
      governmentEmail,
      password,
      department = 'Higher & Technical Education',
      jurisdictionLevel = 'State_Level',
      assignedDistrict,
      role = 'DepartmentOfficer'
    } = req.body;

    if (!officialName || !governmentEmail || !password) {
      res.status(400).json({
        success: false,
        message: 'Official name, government email, and password are required.'
      });
      return;
    }

    const existing = await GovAdmin.findOne({ governmentEmail });
    if (existing) {
      res.status(400).json({
        success: false,
        message: 'An officer account with this email already exists.'
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newOfficer = await GovAdmin.create({
      officialName,
      governmentEmail,
      password: hashedPassword,
      department,
      jurisdictionLevel,
      assignedDistrict,
      role
    });

    const jwtSecret = process.env.JWT_SECRET || 'your_gov_jwt_secret_key_here';
    const token = jwt.sign(
      {
        id: newOfficer._id,
        role: newOfficer.role,
        governmentEmail: newOfficer.governmentEmail,
        department: newOfficer.department,
        jurisdictionLevel: newOfficer.jurisdictionLevel,
        assignedDistrict: newOfficer.assignedDistrict
      },
      jwtSecret,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      message: 'Government officer account registered successfully.',
      token,
      user: {
        id: newOfficer._id,
        officialName: newOfficer.officialName,
        governmentEmail: newOfficer.governmentEmail,
        department: newOfficer.department,
        jurisdictionLevel: newOfficer.jurisdictionLevel,
        assignedDistrict: newOfficer.assignedDistrict,
        role: newOfficer.role
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error registering government officer.',
      error: error.message
    });
  }
};

/**
 * 2. Login government officer
 */
export const loginGovOfficer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { governmentEmail, password } = req.body;

    if (!governmentEmail || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide both government email and password.'
      });
      return;
    }

    const user = await GovAdmin.findOne({ governmentEmail });
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid government email or password.'
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid government email or password.'
      });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET || 'your_gov_jwt_secret_key_here';
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        governmentEmail: user.governmentEmail,
        department: user.department,
        jurisdictionLevel: user.jurisdictionLevel,
        assignedDistrict: user.assignedDistrict
      },
      jwtSecret,
      { expiresIn: '30d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        officialName: user.officialName,
        governmentEmail: user.governmentEmail,
        department: user.department,
        jurisdictionLevel: user.jurisdictionLevel,
        assignedDistrict: user.assignedDistrict,
        role: user.role
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error logging in.',
      error: error.message
    });
  }
};

/**
 * 3. Get profile details of authenticated government officer
 */
export const getGovOfficerProfile = async (req: GovAuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await GovAdmin.findById(userId).select('-password');
    if (!user) {
      res.status(404).json({ success: false, message: 'Officer profile not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching officer profile.',
      error: error.message
    });
  }
};
