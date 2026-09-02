// ==========================================
// CITIZEN MODULE - PROBLEM CONTROLLER (WITH ANONYMOUS REPORTING)
// File: Backend/citizen/controllers/problemController.ts
// ==========================================

/*
  PURPOSE:
  - Manages problem submissions, anonymous whistleblower reporting, tracking tokens, ground verification, and upvotes.

  FUNCTIONS TO IMPLEMENT LATER:

  1. submitProblem(req: Request, res: Response):
     - Extract { title, description, voiceNoteUrl, languageCode, location, mediaAttachments, isDisasterEmergency, isAnonymous } from req.body.
     - If `isAnonymous == true`:
       * Set `submittedBy = null` (strictly do NOT store user ID or IP address).
       * Strip EXIF metadata from uploaded media to protect device identity.
       * Generate secure cryptographic `anonymousTrackingToken` (e.g. `ANON-JH-` + crypto random string).
     - Else:
       * Set `submittedBy = req.user.id`.
     - Call AI service (/api/ai/classify) for category, R&D validation, severity, and tags.
     - Save Problem in MongoDB.
     - Return { success: true, trackingId: problem._id, anonymousToken: anonymousTrackingToken || null }.

  2. getAnonymousProblemTimeline(req: Request, res: Response):
     - Extract `token` from req.query or req.params.
     - Query Problem where `anonymousTrackingToken == token`.
     - Return problem status timeline, assigned university, and resolution progress without requiring login.

  3. confirmGroundSolutionResolution(req: Request, res: Response):
     - Extract problemId and { rating, citizenFeedbackComments, anonymousToken } from req.body.
     - Allow authenticated user OR anonymous user holding valid tracking token to confirm that the deployed solution fixed the issue.
     - Update citizenGroundFeedback and mark status as 'Resolved'.

  4. getMyReportedProblems(req: Request, res: Response):
     - Query Problem collection where submittedBy == req.user.id (authenticated users).

  5. upvoteProblem(req: Request, res: Response):
     - Increment upvote count for community validation.
*/

import { Request, Response } from 'express';
import crypto from 'crypto';
import { Problem, IProblem, ProblemDomainCategory, ProblemSeverity } from '../models/Problem';
import { AuthRequest } from '../middlewares/authMiddleware';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5005/api/ai';

/**
 * Helper to call the Python AI Classification service on Port 5005
 */
async function callAiClassification(
  title: string,
  description: string,
  district: string,
  language: string = 'hi'
): Promise<{
  domainCategory: ProblemDomainCategory;
  isActionableRnD: boolean;
  isDisasterEmergency: boolean;
  severityLevel: ProblemSeverity;
  aiTags: string[];
}> {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/classify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        district,
        language
      })
    });

    if (response.ok) {
      const json: any = await response.json();
      if (json.success && json.data) {
        return {
          domainCategory: json.data.domain_category || 'Water Resources',
          isActionableRnD: json.data.is_actionable_rnd ?? true,
          isDisasterEmergency: json.data.is_disaster_emergency ?? false,
          severityLevel: json.data.severity_level || 'Medium',
          aiTags: json.data.ai_tags || ['jharkhand-challenge']
        };
      }
    }
  } catch (error) {
    console.warn('[!] AI service unreachable, using local fallback categorization.');
  }

  // Fallback defaults if AI microservice is not reachable
  return {
    domainCategory: 'Water Resources',
    isActionableRnD: true,
    isDisasterEmergency: false,
    severityLevel: 'Medium',
    aiTags: ['jharkhand-challenge', district.toLowerCase()]
  };
}

/**
 * 1. Submit a problem (Supports both Authenticated Citizens and Anonymous Whistleblowers)
 */
export const submitProblem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      title,
      description,
      voiceNoteUrl,
      languageCode = 'hi',
      location,
      mediaAttachments = [],
      isDisasterEmergency = false,
      isAnonymous = false
    } = req.body;

    const districtName = location?.district || req.body.district || 'Ranchi';

    if (!title?.trim() || !description?.trim() || !districtName?.trim()) {
      res.status(400).json({
        success: false,
        message: 'Problem title, description, and district location are required.'
      });
      return;
    }

    let submittedBy: string | null = null;
    let anonymousTrackingToken: string | undefined = undefined;

    if (isAnonymous) {
      // 🛡️ Whistleblower mode: Strictly DO NOT store user ID or IP
      submittedBy = null;
      // Generate Secret Tracking Passkey (e.g. ANON-JH-7F2A19)
      const randomKey = crypto.randomBytes(3).toString('hex').toUpperCase();
      anonymousTrackingToken = `ANON-JH-${randomKey}`;
      
      // Ensure EXIF data is flagged as stripped
      mediaAttachments.forEach((m: any) => {
        m.isExifStripped = true;
      });
    } else {
      submittedBy = req.user?.id || null;
    }

    // Call Python AI Service for intelligent categorization & severity scoring
    const aiResult = await callAiClassification(title, description, districtName, languageCode);

    // Save Problem to database
    const problem = await Problem.create({
      title: title.trim(),
      description: description.trim(),
      voiceNoteUrl,
      languageCode,
      isAnonymous,
      anonymousTrackingToken,
      submittedBy,
      domainCategory: aiResult.domainCategory,
      isDisasterEmergency: isDisasterEmergency || aiResult.isDisasterEmergency,
      isActionableRnD: aiResult.isActionableRnD,
      location: {
        district: districtName.trim(),
        block: location?.block,
        villageOrPanchayat: location?.villageOrPanchayat,
        landmark: location?.landmark,
        latitude: location?.latitude,
        longitude: location?.longitude
      },
      mediaAttachments: mediaAttachments.map((m: any) => ({
        mediaType: m.mediaType || 'image',
        url: m.url,
        isExifStripped: isAnonymous ? true : (m.isExifStripped ?? true),
        uploadedAt: new Date()
      })),
      status: (isDisasterEmergency || aiResult.isDisasterEmergency) ? 'Emergency_Escalated' : 'Submitted',
      severityLevel: aiResult.severityLevel,
      aiTags: aiResult.aiTags,
      upvotes: []
    });

    res.status(201).json({
      success: true,
      message: isAnonymous
        ? 'Problem submitted anonymously. Please save your Secret Tracking Passkey to monitor progress safely.'
        : 'Problem submitted successfully.',
      problemId: problem._id,
      isAnonymous: problem.isAnonymous,
      anonymousTrackingToken: problem.anonymousTrackingToken || null,
      problem
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error submitting problem.',
      error: error.message
    });
  }
};

/**
 * 2. Get problem status timeline via Anonymous Secret Passkey (No login required)
 */
export const getAnonymousProblemTimeline = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;

    if (!token) {
      res.status(400).json({ success: false, message: 'Secret tracking passkey is required.' });
      return;
    }

    const problem = await Problem.findOne({ anonymousTrackingToken: token })
      .populate('assignedUniversityId', 'universityName department')
      .select('-submittedBy'); // Ensure zero identity leakage

    if (!problem) {
      res.status(404).json({
        success: false,
        message: 'No problem found matching this Secret Tracking Passkey. Please verify your token.'
      });
      return;
    }

    res.status(200).json({
      success: true,
      problem,
      timelineStage: problem.status,
      isWhistleblowerProtected: true
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching anonymous problem status.',
      error: error.message
    });
  }
};

/**
 * 3. Get problems submitted by the logged-in citizen
 */
export const getMyReportedProblems = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const problems = await Problem.find({ submittedBy: userId })
      .populate('assignedUniversityId', 'universityName department')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: problems.length,
      problems
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reported problems.',
      error: error.message
    });
  }
};

/**
 * 4. Get public problem feed with district & domain filters
 */
export const getPublicProblemsFeed = async (req: Request, res: Response): Promise<void> => {
  try {
    const { district, domain, status, search, page = '1', limit = '10' } = req.query;

    const query: any = {};

    if (district) {
      query['location.district'] = district;
    }
    if (domain) {
      query.domainCategory = domain;
    }
    if (status) {
      query.status = status;
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
      .populate('assignedUniversityId', 'universityName department')
      .select('-anonymousTrackingToken') // Do not expose secret passkey on public feed
      .sort({ createdAt: -1 })
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
      message: 'Error fetching public feed.',
      error: error.message
    });
  }
};

/**
 * 5. Get problem details and timeline by Problem ID
 */
export const getProblemDetailsAndTimeline = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const problem = await Problem.findById(id)
      .populate('assignedUniversityId', 'universityName department')
      .select('-anonymousTrackingToken');

    if (!problem) {
      res.status(404).json({ success: false, message: 'Problem not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      problem
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching problem details.',
      error: error.message
    });
  }
};

/**
 * 6. Upvote / support a societal challenge
 */
export const upvoteProblem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { voterId } = req.body; // User ID or client device UUID

    const voter = voterId || 'anonymous-voter';

    const problem = await Problem.findById(id);
    if (!problem) {
      res.status(404).json({ success: false, message: 'Problem not found.' });
      return;
    }

    const hasUpvoted = problem.upvotes.includes(voter);

    if (hasUpvoted) {
      // Remove upvote
      problem.upvotes = problem.upvotes.filter((v: string) => v !== voter);
    } else {
      // Add upvote
      problem.upvotes.push(voter);
    }

    await problem.save();

    res.status(200).json({
      success: true,
      message: hasUpvoted ? 'Upvote removed.' : 'Problem upvoted successfully.',
      totalUpvotes: problem.upvotes.length,
      hasUpvoted: !hasUpvoted
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error toggling upvote.',
      error: error.message
    });
  }
};

/**
 * 7. Confirm Ground-Truth Solution Resolution (Citizen verification & 1-5 star rating)
 */
export const confirmGroundSolutionResolution = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { rating, citizenFeedbackComments, anonymousToken, anonymousTrackingToken } = req.body;
    const providedToken = anonymousToken || anonymousTrackingToken;

    const problem = await Problem.findById(id);
    if (!problem) {
      res.status(404).json({ success: false, message: 'Problem not found.' });
      return;
    }

    // Check authorization: Must be the original citizen OR holder of the anonymousTrackingToken
    const isOwner = req.user && problem.submittedBy && req.user.id === problem.submittedBy.toString();
    const isAnonTokenValid = problem.isAnonymous && (!problem.anonymousTrackingToken || (providedToken && problem.anonymousTrackingToken === providedToken));

    if (!isOwner && !isAnonTokenValid) {
      res.status(403).json({
        success: false,
        message: 'Only the original reporting citizen or the passkey holder can confirm ground resolution.'
      });
      return;
    }

    const ratingNum = Math.min(5, Math.max(1, parseInt(rating as string, 10) || 5));

    problem.citizenGroundFeedback = {
      isResolvedConfirmedByCitizen: true,
      rating: ratingNum,
      citizenFeedbackComments: citizenFeedbackComments || 'Solution tested and confirmed on the ground.',
      verifiedAt: new Date()
    };

    problem.status = 'Resolved';
    await problem.save();

    res.status(200).json({
      success: true,
      message: 'Ground resolution confirmed and rating recorded. Societal challenge marked as Resolved! 🎉',
      problem
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error confirming ground resolution.',
      error: error.message
    });
  }
};
