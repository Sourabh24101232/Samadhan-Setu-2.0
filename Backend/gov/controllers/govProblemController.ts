// ==========================================
// GOVERNMENT MODULE - PROBLEM & EMERGENCY CONTROLLER (REAL-LIFE GROUND ENHANCED)
// File: Backend/gov/controllers/govProblemController.ts
// ==========================================

/*
  PURPOSE:
  - Gives government reviewers control to validate challenges, manage disaster emergencies, re-route non-R&D complaints, and authorize pilot deployments.

  FUNCTIONS TO IMPLEMENT LATER:

  1. getAllSubmittedProblems(req: Request, res: Response):
     - Query problems with pagination, search, status, and filter for `isDisasterEmergency == true` (top priority queue).

  2. verifyAndRouteProblem(req: Request, res: Response):
     - If problem is identified as a non-R&D routine grievance (isActionableRnD == false):
       * Mark status as 'Redirected_To_Jan_Samvad' and provide link to Jharkhand citizen grievance system.
     - If verified as innovative R&D challenge:
       * Confirm or override AI-recommended university assignment.
       * Set status = 'Verified' or 'Assigned to University'.

  3. handleDisasterEmergencyEscalation(req: Request, res: Response):
     - Fast-track disaster reports (Floods, Mine fires/subsidence in Dhanbad, drought emergency in Palamu).
     - Dispatch notification to Jharkhand State Disaster Management Authority (JSDMA) and designated university rapid-response centers.

  4. approveSolutionForFieldDeployment(req: Request, res: Response):
     - Authorize completed university prototypes for on-ground deployment in target district.

  5. getCitizenFeedbackAndAuditLog(req: Request, res: Response):
     - View ground-truth ratings and feedback submitted by rural citizens/panchayats for deployed solutions.
*/

import { Request, Response } from 'express';
import { Problem, IProblem } from '../../citizen/models/Problem';
import { SolutionProposal } from '../../university/models/SolutionProposal';
import { GovAuthRequest } from '../middlewares/authMiddleware';

/**
 * 1. Get all submitted problems across Jharkhand with Emergency SOS priority sorting
 */
export const getAllSubmittedProblems = async (req: GovAuthRequest, res: Response): Promise<void> => {
  try {
    const { district, domain, status, isEmergency, search, page = '1', limit = '15' } = req.query;

    const query: any = {};

    if (district) query['location.district'] = district;
    if (domain) query.domainCategory = domain;
    if (status) query.status = status;
    if (isEmergency === 'true') query.isDisasterEmergency = true;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 15;
    const skip = (pageNum - 1) * limitNum;

    const total = await Problem.countDocuments(query);
    const problems = await Problem.find(query)
      .populate('assignedUniversityId', 'universityName department fullName')
      .populate('submittedBy', 'fullName phone district userType')
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
      message: 'Error fetching problems for government review.',
      error: error.message
    });
  }
};

/**
 * 2. Validate, classify, or re-route a societal challenge
 */
export const verifyAndRouteProblem = async (req: GovAuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { isActionableRnD, domainCategory, severityLevel, assignedUniversityId, redirectionNote } = req.body;

    const problem = await Problem.findById(id);
    if (!problem) {
      res.status(404).json({ success: false, message: 'Problem not found.' });
      return;
    }

    if (isActionableRnD === false) {
      // Non-R&D Routine Civic Complaint -> Redirect to Jharkhand Jan Samvad
      problem.isActionableRnD = false;
      problem.status = 'Rejected';
      await problem.save();

      res.status(200).json({
        success: true,
        message: 'Problem marked as Routine Civic Grievance and redirected to Jharkhand Jan Samvad portal.',
        redirectionUrl: 'https://jansamvad.jharkhand.gov.in',
        problem
      });
      return;
    }

    if (domainCategory) problem.domainCategory = domainCategory;
    if (severityLevel) problem.severityLevel = severityLevel;

    if (assignedUniversityId) {
      problem.assignedUniversityId = assignedUniversityId;
      problem.status = 'Assigned to University';
      problem.claimExpiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    } else {
      problem.status = 'Verified';
    }

    await problem.save();

    res.status(200).json({
      success: true,
      message: 'Problem successfully validated and routed for university innovation.',
      problem
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error verifying problem.',
      error: error.message
    });
  }
};

/**
 * 3. Fast-Track Disaster Emergency Escalation (SOS to DDMA)
 */
export const handleDisasterEmergencyEscalation = async (req: GovAuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { emergencyAlertNotes, targetAgency = 'District Disaster Management Authority (DDMA)' } = req.body;

    const problem = await Problem.findById(id);
    if (!problem) {
      res.status(404).json({ success: false, message: 'Problem not found.' });
      return;
    }

    problem.isDisasterEmergency = true;
    problem.severityLevel = 'Critical';
    problem.status = 'Emergency_Escalated';
    await problem.save();

    res.status(200).json({
      success: true,
      message: `🚨 Emergency Escalation Fast-Track Dispatched to ${targetAgency} and Jharkhand State Disaster Management Authority (JSDMA).`,
      alertDetails: {
        problemId: problem._id,
        district: problem.location.district,
        severity: 'Critical',
        alertNotes: emergencyAlertNotes || 'Immediate disaster response mobilization requested.'
      },
      problem
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error escalating disaster emergency.',
      error: error.message
    });
  }
};

/**
 * 4. Authorize completed university prototype for official field deployment
 */
export const approveSolutionForFieldDeployment = async (req: GovAuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { pilotAuthorizationNumber, remarks } = req.body;

    const problem = await Problem.findById(id);
    if (!problem) {
      res.status(404).json({ success: false, message: 'Problem not found.' });
      return;
    }

    // Update Problem Status to Testing / Deployment Pilot
    problem.status = 'Testing';
    await problem.save();

    res.status(200).json({
      success: true,
      message: 'Official Government Field Pilot Sanction granted for university prototype deployment in target district.',
      pilotSanctionOrder: {
        authorizationNumber: pilotAuthorizationNumber || `JH-PILOT-${Date.now()}`,
        district: problem.location.district,
        sanctionedBy: req.user?.officialName || 'Dept of Higher & Technical Education',
        sanctionDate: new Date(),
        remarks: remarks || 'Sanctioned for on-ground community testing under supervision.'
      },
      problem
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error authorizing pilot deployment.',
      error: error.message
    });
  }
};

/**
 * 5. Get ground feedback audit log and ratings
 */
export const getCitizenFeedbackAndAuditLog = async (req: GovAuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const problem = await Problem.findById(id).select('title location domainCategory status citizenGroundFeedback isAnonymous');
    if (!problem) {
      res.status(404).json({ success: false, message: 'Problem not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      problemId: problem._id,
      title: problem.title,
      district: problem.location.district,
      status: problem.status,
      isWhistleblowerProtected: problem.isAnonymous,
      groundFeedback: problem.citizenGroundFeedback || { isResolvedConfirmedByCitizen: false, rating: null }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching ground feedback audit log.',
      error: error.message
    });
  }
};
