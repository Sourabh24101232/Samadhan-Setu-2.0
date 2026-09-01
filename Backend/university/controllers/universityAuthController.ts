// ==========================================
// UNIVERSITY MODULE - AUTH CONTROLLER
// File: Backend/university/controllers/universityAuthController.ts
// ==========================================

/*
  PURPOSE:
  - Handles authentication and profile management for University Faculty, Student leads, and HEI administrators.

  FUNCTIONS TO IMPLEMENT LATER:

  1. registerUniversityUser(req: Request, res: Response):
     - Extract { fullName, universityName, department, institutionalEmail, password, role, researchExpertiseTags } from req.body.
     - Check if institutionalEmail already registered.
     - Hash password with bcrypt.
     - Save new UniversityUser record.
     - Return JWT token and profile data.

  2. loginUniversityUser(req: Request, res: Response):
     - Extract { institutionalEmail, password } from req.body.
     - Verify credentials, generate JWT containing university ID & role.
     - Return auth payload.

  3. getUniversityProfile(req: Request, res: Response):
     - Fetch university details and its active submitted solution proposals.
*/

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UniversityUser, IUniversityUser } from '../models/UniversityUser';
import { SolutionProposal } from '../models/SolutionProposal';
import { UniversityAuthRequest } from '../middlewares/authMiddleware';

/**
 * 1. Register a new University Faculty / Student Lead account
 */
export const registerUniversityUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      fullName,
      universityName,
      department,
      institutionalEmail,
      password,
      role = 'Faculty_Mentor',
      researchExpertiseTags = [],
      incubationCenterDetails
    } = req.body;

    if (!fullName || !universityName || !department || !institutionalEmail || !password) {
      res.status(400).json({
        success: false,
        message: 'Name, university name, department, institutional email, and password are required.'
      });
      return;
    }

    // Check existing email
    const existing = await UniversityUser.findOne({ institutionalEmail });
    if (existing) {
      res.status(400).json({
        success: false,
        message: 'An account with this institutional email already exists.'
      });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await UniversityUser.create({
      fullName,
      universityName,
      department,
      institutionalEmail,
      password: hashedPassword,
      role,
      researchExpertiseTags,
      incubationCenterDetails,
      activeProjectsCount: 0
    });

    // Generate JWT
    const jwtSecret = process.env.JWT_SECRET || 'your_university_jwt_secret_key_here';
    const token = jwt.sign(
      {
        id: newUser._id,
        role: newUser.role,
        institutionalEmail: newUser.institutionalEmail,
        universityName: newUser.universityName,
        department: newUser.department
      },
      jwtSecret,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      message: 'University account registered successfully.',
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        universityName: newUser.universityName,
        department: newUser.department,
        institutionalEmail: newUser.institutionalEmail,
        role: newUser.role,
        researchExpertiseTags: newUser.researchExpertiseTags,
        incubationCenterDetails: newUser.incubationCenterDetails
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error registering university account.',
      error: error.message
    });
  }
};

/**
 * 2. Login university user with institutional email and password
 */
export const loginUniversityUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { institutionalEmail, password } = req.body;

    if (!institutionalEmail || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide both institutional email and password.'
      });
      return;
    }

    const user = await UniversityUser.findOne({ institutionalEmail });
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid institutional email or password.'
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid institutional email or password.'
      });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET || 'your_university_jwt_secret_key_here';
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        institutionalEmail: user.institutionalEmail,
        universityName: user.universityName,
        department: user.department
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
        fullName: user.fullName,
        universityName: user.universityName,
        department: user.department,
        institutionalEmail: user.institutionalEmail,
        role: user.role,
        researchExpertiseTags: user.researchExpertiseTags,
        incubationCenterDetails: user.incubationCenterDetails,
        activeProjectsCount: user.activeProjectsCount
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
 * 3. Get profile details of authenticated university user
 */
export const getUniversityProfile = async (req: UniversityAuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await UniversityUser.findById(userId).select('-password');
    if (!user) {
      res.status(404).json({ success: false, message: 'University profile not found.' });
      return;
    }

    const proposals = await SolutionProposal.find({ universityId: user._id })
      .populate('problemId', 'title domainCategory severityLevel status')
      .populate('industrySponsorId', 'organizationName');

    res.status(200).json({
      success: true,
      user,
      totalProposals: proposals.length,
      proposals
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching university profile.',
      error: error.message
    });
  }
};
