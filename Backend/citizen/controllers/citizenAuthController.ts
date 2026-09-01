// ==========================================
// CITIZEN MODULE - AUTH CONTROLLER
// File: Backend/citizen/controllers/citizenAuthController.ts
// ==========================================

/*
  PURPOSE:
  - Handles authentication (registration, login, profile retrieval) for Citizens.

  FUNCTIONS TO IMPLEMENT LATER:
  
  1. registerCitizen(req: Request, res: Response):
     - Extract { fullName, phone, email, password, district, blockOrVillage, userType } from req.body.
     - Check if citizen already exists with the given phone or email.
     - Hash password using bcrypt.hash().
     - Save new CitizenUser in database.
     - Generate JWT token containing citizen ID & role.
     - Return success status, token, and user profile data.

  2. loginCitizen(req: Request, res: Response):
     - Extract { phone, password } from req.body.
     - Find user by phone number.
     - Compare password using bcrypt.compare().
     - If valid, generate and return JWT token and user info.
     - Else return 401 Unauthorized error.

  3. getCitizenProfile(req: Request, res: Response):
     - Extract citizen ID from authenticated JWT token (req.user).
     - Fetch user document from DB (excluding password).
     - Return user details with their submitted problem count.
*/

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { CitizenUser } from '../models/CitizenUser';
import { Problem } from '../models/Problem';
import { AuthRequest } from '../middlewares/authMiddleware';

/**
 * 1. Register a new citizen account
 */
export const registerCitizen = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, phone, email, password, district, blockOrVillage, userType } = req.body;

    if (!fullName || !phone || !password || !district) {
      res.status(400).json({
        success: false,
        message: 'Please provide full name, phone number, password, and district.'
      });
      return;
    }

    // Check if phone already registered
    const existingUser = await CitizenUser.findOne({ phone });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'A citizen account with this phone number already exists.'
      });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await CitizenUser.create({
      fullName,
      phone,
      email: email || undefined,
      password: hashedPassword,
      district,
      blockOrVillage,
      userType: userType || 'Individual',
      isVerified: true
    });

    // Generate JWT Token
    const jwtSecret = process.env.JWT_SECRET || 'your_citizen_jwt_secret_key_here';
    const token = jwt.sign(
      { id: newUser._id, role: 'citizen', phone: newUser.phone },
      jwtSecret,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      message: 'Citizen account registered successfully.',
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        phone: newUser.phone,
        email: newUser.email,
        district: newUser.district,
        blockOrVillage: newUser.blockOrVillage,
        userType: newUser.userType
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error registering citizen account.',
      error: error.message
    });
  }
};

/**
 * 2. Login citizen using phone and password
 */
export const loginCitizen = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide both phone number and password.'
      });
      return;
    }

    const user = await CitizenUser.findOne({ phone });
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid phone number or password.'
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid phone number or password.'
      });
      return;
    }

    // Generate JWT Token
    const jwtSecret = process.env.JWT_SECRET || 'your_citizen_jwt_secret_key_here';
    const token = jwt.sign(
      { id: user._id, role: 'citizen', phone: user.phone },
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
        phone: user.phone,
        email: user.email,
        district: user.district,
        blockOrVillage: user.blockOrVillage,
        userType: user.userType
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
 * 3. Get profile details of authenticated citizen
 */
export const getCitizenProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await CitizenUser.findById(userId).select('-password');
    if (!user) {
      res.status(404).json({ success: false, message: 'Citizen profile not found.' });
      return;
    }

    // Count submitted problems
    const problemsCount = await Problem.countDocuments({ submittedBy: user._id });

    res.status(200).json({
      success: true,
      user,
      totalProblemsReported: problemsCount
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching citizen profile.',
      error: error.message
    });
  }
};
