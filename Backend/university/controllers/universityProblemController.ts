// ==========================================
// UNIVERSITY MODULE - PROBLEM INTAKE CONTROLLER
// File: Backend/university/controllers/universityProblemController.ts
// ==========================================

/*
  PURPOSE:
  - Allows universities to browse societal challenges routed to them by AI/Admin, filter challenges by academic domain, and claim problems with a 14-day lock.

  FUNCTIONS TO IMPLEMENT LATER:

  1. getRoutedProblems(req: Request, res: Response):
     - Query Problem collection for problems matching university's department/domain or assigned directly.
     - Filter options: domainCategory, district, severity, status ('Verified' or 'Under Review').
     - Return list of open challenges available for academic solution.

  2. claimProblemForInvestigation(req: Request, res: Response):
     - Extract problemId from req.params.
     - Set Problem.assignedUniversityId = req.user.id, status = 'Assigned to University', and claimExpiresAt = Date.now() + 14 days.
     - Return confirmation so the university can form a project team.

  3. getAssignedProblemsHistory(req: Request, res: Response):
     - Return list of all problems claimed or worked on by this university department.
*/

import { Response } from 'express';
import { Problem } from '../../citizen/models/Problem';
import { UniversityUser } from '../models/UniversityUser';
import { UniversityAuthRequest } from '../middlewares/authMiddleware';

/**
 * 1. Browse societal challenges routed to or available for HEIs
 */
export const getRoutedProblems = async (req: UniversityAuthRequest, res: Response): Promise<void> => {
  try {
    const { domain, district, severity, status, search, page = '1', limit = '10' } = req.query;

    const query: any = {};

    // 14-Day Expiry Check: If previous claim expired without proposal, release back to open pool
    await Problem.updateMany(
      {
        status: 'Assigned to University',
        claimExpiresAt: { $lt: new Date() }
      },
      {
        $set: {
          status: 'Submitted',
          assignedUniversityId: null
        },
        $unset: { claimExpiresAt: 1 }
      }
    );

    if (domain) {
      query.domainCategory = domain;
    }
    if (district) {
      query['location.district'] = district;
    }
    if (severity) {
      query.severityLevel = severity;
    }
    if (status) {
      query.status = status;
    } else {
      // By default show open/available challenges
      query.status = { $in: ['Submitted', 'Under Review', 'Verified', 'Emergency_Escalated'] };
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await Problem.countDocuments(query);
    const problems = await Problem.find(query)
      .select('-anonymousTrackingToken')
      .sort({ isDisasterEmergency: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      problems
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching routed problems.',
      error: error.message
    });
  }
};

/**
 * 2. Claim a societal challenge with a 14-Day Expiry Lock
 */
export const claimProblemForInvestigation = async (req: UniversityAuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const universityUserId = req.user?.id;

    if (!universityUserId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const problem = await Problem.findById(id);
    if (!problem) {
      res.status(404).json({ success: false, message: 'Problem not found.' });
      return;
    }

    // Check if already claimed by someone else and lock is active
    if (
      problem.assignedUniversityId &&
      problem.assignedUniversityId.toString() !== universityUserId &&
      problem.claimExpiresAt &&
      problem.claimExpiresAt > new Date()
    ) {
      res.status(400).json({
        success: false,
        message: 'This challenge has already been claimed by another academic team under a 14-day lock.'
      });
      return;
    }

    // Set 14-Day Expiry Lock (14 * 24 * 60 * 60 * 1000 ms)
    const expiryDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    problem.assignedUniversityId = universityUserId as any;
    problem.status = 'Assigned to University';
    problem.claimExpiresAt = expiryDate;
    await problem.save();

    // Increment active count on user profile
    await UniversityUser.findByIdAndUpdate(universityUserId, {
      $inc: { activeProjectsCount: 1 }
    });

    res.status(200).json({
      success: true,
      message: 'Challenge successfully claimed! 14-Day Investigation Lock active. Please submit your solution proposal before expiry.',
      claimExpiresAt: expiryDate,
      problem
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error claiming problem.',
      error: error.message
    });
  }
};

/**
 * 3. Get history of challenges claimed or worked on by this university
 */
export const getAssignedProblemsHistory = async (req: UniversityAuthRequest, res: Response): Promise<void> => {
  try {
    const universityUserId = req.user?.id;
    if (!universityUserId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const problems = await Problem.find({ assignedUniversityId: universityUserId })
      .select('-anonymousTrackingToken')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: problems.length,
      problems
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching claimed challenges history.',
      error: error.message
    });
  }
};
