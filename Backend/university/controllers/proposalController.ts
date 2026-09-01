// ==========================================
// UNIVERSITY MODULE - PROPOSAL & MILESTONE CONTROLLER
// File: Backend/university/controllers/proposalController.ts
// ==========================================

/*
  PURPOSE:
  - Enables multidisciplinary university teams to submit solution proposals, track milestone tranches, and submit prototype deliverables.

  FUNCTIONS TO IMPLEMENT LATER:

  1. createSolutionProposal(req: Request, res: Response):
     - Extract { problemId, proposalTitle, executiveSummary, proposedMethodology, teamMembers, estimatedBudgetINR, milestoneTranches, ipOwnershipDeclaration } from req.body.
     - University user ID attached from JWT (req.user.id).
     - Save new SolutionProposal in database.
     - Update Problem status to 'Proposal Submitted'.
     - Return proposal object.

  2. getMyUniversityProposals(req: Request, res: Response):
     - Query SolutionProposal where universityId == req.user.id.
     - Populate problem details and CSR sponsor info.

  3. updateMilestoneProgress(req: Request, res: Response):
     - Extract { proposalId, milestoneIndex, status, deliverableLink } from req.body.
     - Update specific milestone tranche status (e.g. 'Submitted_For_Review' or 'Completed').
     - Check if all milestones completed, update overall status to 'Completed_Deployed'.
     - Save and return updated proposal.

  4. uploadPrototypeEvidence(req: Request, res: Response):
     - Upload demo photos, research reports, video links, or CAD models to prototypeMedia array.
*/

import { Response } from 'express';
import { SolutionProposal, ISolutionProposal } from '../models/SolutionProposal';
import { Problem } from '../../citizen/models/Problem';
import { UniversityAuthRequest } from '../middlewares/authMiddleware';

/**
 * 1. Submit a formal solution proposal for a claimed challenge
 */
export const createSolutionProposal = async (req: UniversityAuthRequest, res: Response): Promise<void> => {
  try {
    const universityUserId = req.user?.id;
    if (!universityUserId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const {
      problemId,
      proposalTitle,
      executiveSummary,
      proposedMethodology,
      estimatedBudgetINR,
      projectTimelineMonths = 6,
      teamMembers = [],
      facultyMentor,
      milestoneTranches = [],
      ipOwnershipDeclaration = 'Open_Source_Social_Good'
    } = req.body;

    if (!problemId || !proposalTitle || !executiveSummary || !proposedMethodology || !estimatedBudgetINR) {
      res.status(400).json({
        success: false,
        message: 'Problem ID, title, executive summary, methodology, and budget are required.'
      });
      return;
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      res.status(404).json({ success: false, message: 'Associated problem not found.' });
      return;
    }

    // Default 3-stage milestone roadmap if not provided
    const defaultMilestones = milestoneTranches.length > 0 ? milestoneTranches : [
      {
        milestoneNumber: 1,
        title: 'Prototype Design & Lab Simulation',
        description: 'Detailed CAD design, circuit schematics, and simulation results.',
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        percentageFundingToRelease: 30,
        status: 'Pending'
      },
      {
        milestoneNumber: 2,
        title: 'Working Hardware / Lab Prototype Demo',
        description: 'Physical prototype bench-testing and lab water/soil test verification.',
        targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        percentageFundingToRelease: 40,
        status: 'Pending'
      },
      {
        milestoneNumber: 3,
        title: 'Field Testing & Community Handover',
        description: 'Live field deployment in target district and local citizen ground testing.',
        targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        percentageFundingToRelease: 30,
        status: 'Pending'
      }
    ];

    const proposal = await SolutionProposal.create({
      problemId,
      universityId: universityUserId,
      proposalTitle,
      executiveSummary,
      proposedMethodology,
      estimatedBudgetINR,
      projectTimelineMonths,
      teamMembers,
      facultyMentor: facultyMentor || {
        name: req.user?.fullName || 'Faculty Mentor',
        email: req.user?.institutionalEmail || 'mentor@univ.edu',
        department: req.user?.department || 'Engineering',
        mentorApprovalStatus: 'Approved'
      },
      milestoneTranches: defaultMilestones,
      ipOwnershipDeclaration,
      prototypeMedia: [],
      status: 'Submitted_To_Open_Pool'
    });

    // Update Problem Status
    problem.status = 'Proposal Submitted';
    problem.assignedUniversityId = universityUserId as any;
    await problem.save();

    res.status(201).json({
      success: true,
      message: 'Solution proposal submitted successfully to the Open Pool for Industry CSR Sponsorship!',
      proposal
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error creating solution proposal.',
      error: error.message
    });
  }
};

/**
 * 2. Get all proposals created by this university team
 */
export const getMyUniversityProposals = async (req: UniversityAuthRequest, res: Response): Promise<void> => {
  try {
    const universityUserId = req.user?.id;
    if (!universityUserId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const proposals = await SolutionProposal.find({ universityId: universityUserId })
      .populate('problemId', 'title description domainCategory location severityLevel status')
      .populate('industrySponsorId', 'organizationName officialEmail')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: proposals.length,
      proposals
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching university proposals.',
      error: error.message
    });
  }
};

/**
 * 3. Update milestone deliverable progress
 */
export const updateMilestoneProgress = async (req: UniversityAuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { milestoneNumber, status, deliverableLink, mentorReviewNotes } = req.body;
    const universityUserId = req.user?.id;

    const proposal = await SolutionProposal.findById(id);
    if (!proposal) {
      res.status(404).json({ success: false, message: 'Proposal not found.' });
      return;
    }

    if (proposal.universityId.toString() !== universityUserId) {
      res.status(403).json({ success: false, message: 'Unauthorized to update this proposal.' });
      return;
    }

    const milestone = proposal.milestoneTranches.find(
      (m) => m.milestoneNumber === parseInt(milestoneNumber, 10)
    );

    if (!milestone) {
      res.status(404).json({ success: false, message: `Milestone #${milestoneNumber} not found.` });
      return;
    }

    if (status) milestone.status = status;
    if (deliverableLink) milestone.deliverableLink = deliverableLink;
    if (mentorReviewNotes) milestone.mentorReviewNotes = mentorReviewNotes;

    // Check if all milestones are completed
    const allCompleted = proposal.milestoneTranches.every((m) => m.status === 'Completed');
    if (allCompleted) {
      proposal.status = 'Completed_Deployed';
      await Problem.findByIdAndUpdate(proposal.problemId, { status: 'Testing' });
    } else {
      proposal.status = 'Funded_In_Progress';
    }

    await proposal.save();

    res.status(200).json({
      success: true,
      message: `Milestone #${milestoneNumber} updated successfully.`,
      proposal
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating milestone.',
      error: error.message
    });
  }
};

/**
 * 4. Upload prototype evidence photos / videos / reports
 */
export const uploadPrototypeEvidence = async (req: UniversityAuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { mediaType = 'image', url, caption } = req.body;
    const universityUserId = req.user?.id;

    if (!url) {
      res.status(400).json({ success: false, message: 'Media URL is required.' });
      return;
    }

    const proposal = await SolutionProposal.findById(id);
    if (!proposal) {
      res.status(404).json({ success: false, message: 'Proposal not found.' });
      return;
    }

    if (proposal.universityId.toString() !== universityUserId) {
      res.status(403).json({ success: false, message: 'Unauthorized.' });
      return;
    }

    proposal.prototypeMedia.push({
      mediaType,
      url,
      caption: caption || 'Prototype Demonstration Evidence',
      uploadedAt: new Date()
    });

    await proposal.save();

    res.status(200).json({
      success: true,
      message: 'Prototype evidence uploaded successfully.',
      prototypeMedia: proposal.prototypeMedia
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error uploading prototype evidence.',
      error: error.message
    });
  }
};
