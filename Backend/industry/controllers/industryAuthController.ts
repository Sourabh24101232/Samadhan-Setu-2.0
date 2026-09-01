// ==========================================
// INDUSTRY MODULE - AUTH CONTROLLER
// File: Backend/industry/controllers/industryAuthController.ts
// ==========================================

/*
  PURPOSE:
  - Handles authentication and onboarding for Industry Partners, CSR wings, and Startups.

  FUNCTIONS TO IMPLEMENT LATER:

  1. registerIndustry(req: Request, res: Response):
     - Extract { organizationName, orgType, officialEmail, password, contactPersonName, contactPhone, interestDomains, websiteUrl } from req.body.
     - Check for existing registration with officialEmail.
     - Hash password with bcrypt.
     - Save IndustryUser in MongoDB.
     - Return JWT token and profile data.

  2. loginIndustry(req: Request, res: Response):
     - Authenticate credentials and return JWT token.

  3. getIndustryProfile(req: Request, res: Response):
     - Return profile and list of all active sponsored university projects.
*/

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IndustryUser, IIndustryUser } from '../models/IndustryUser';
import { Partnership } from '../models/Partnership';
import { IndustryAuthRequest } from '../middlewares/authMiddleware';

/**
 * 1. Register a new Industry Partner / CSR Foundation account
 */
export const registerIndustry = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      organizationName,
      orgType = 'Corporate_CSR',
      officialEmail,
      password,
      contactPersonName,
      contactPhone,
      interestDomains = [],
      websiteUrl
    } = req.body;

    if (!organizationName || !officialEmail || !password || !contactPersonName) {
      res.status(400).json({
        success: false,
        message: 'Organization name, official email, password, and contact person name are required.'
      });
      return;
    }

    // Check existing email
    const existing = await IndustryUser.findOne({ officialEmail });
    if (existing) {
      res.status(400).json({
        success: false,
        message: 'An industry partner account with this official email already exists.'
      });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newIndustry = await IndustryUser.create({
      organizationName,
      orgType,
      officialEmail,
      password: hashedPassword,
      contactPersonName,
      contactPhone,
      interestDomains,
      websiteUrl,
      isVerifiedPartner: true,
      totalGrantsAllocatedINR: 0
    });

    // Generate JWT
    const jwtSecret = process.env.JWT_SECRET || 'your_industry_jwt_secret_key_here';
    const token = jwt.sign(
      {
        id: newIndustry._id,
        role: 'industry',
        officialEmail: newIndustry.officialEmail,
        organizationName: newIndustry.organizationName,
        orgType: newIndustry.orgType
      },
      jwtSecret,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      message: 'Industry partner registered successfully.',
      token,
      user: {
        id: newIndustry._id,
        organizationName: newIndustry.organizationName,
        orgType: newIndustry.orgType,
        officialEmail: newIndustry.officialEmail,
        contactPersonName: newIndustry.contactPersonName,
        interestDomains: newIndustry.interestDomains,
        websiteUrl: newIndustry.websiteUrl,
        isVerifiedPartner: newIndustry.isVerifiedPartner,
        totalGrantsAllocatedINR: newIndustry.totalGrantsAllocatedINR
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error registering industry partner.',
      error: error.message
    });
  }
};

/**
 * 2. Login industry partner
 */
export const loginIndustry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { officialEmail, password } = req.body;

    if (!officialEmail || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide both official email and password.'
      });
      return;
    }

    const user = await IndustryUser.findOne({ officialEmail });
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid official email or password.'
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid official email or password.'
      });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET || 'your_industry_jwt_secret_key_here';
    const token = jwt.sign(
      {
        id: user._id,
        role: 'industry',
        officialEmail: user.officialEmail,
        organizationName: user.organizationName,
        orgType: user.orgType
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
        organizationName: user.organizationName,
        orgType: user.orgType,
        officialEmail: user.officialEmail,
        contactPersonName: user.contactPersonName,
        interestDomains: user.interestDomains,
        websiteUrl: user.websiteUrl,
        isVerifiedPartner: user.isVerifiedPartner,
        totalGrantsAllocatedINR: user.totalGrantsAllocatedINR
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
 * 3. Get profile details and active sponsorships
 */
export const getIndustryProfile = async (req: IndustryAuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await IndustryUser.findById(userId).select('-password');
    if (!user) {
      res.status(404).json({ success: false, message: 'Industry profile not found.' });
      return;
    }

    const partnerships = await Partnership.find({ industryId: user._id })
      .populate({
        path: 'proposalId',
        select: 'proposalTitle executiveSummary estimatedBudgetINR milestoneTranches status',
        populate: { path: 'problemId', select: 'title domainCategory location severityLevel' }
      })
      .populate('universityId', 'fullName universityName department institutionalEmail');

    res.status(200).json({
      success: true,
      user,
      totalActivePartnerships: partnerships.length,
      partnerships
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching industry profile.',
      error: error.message
    });
  }
};
