// ==========================================
// INDUSTRY MODULE - PARTNERSHIP CONTROLLER
// File: Backend/industry/controllers/partnershipController.ts
// ==========================================

/*
  PURPOSE:
  - Facilitates industry discovery of student/university proposals, milestone tranche pledges, and mentorship tracking.

  FUNCTIONS TO IMPLEMENT LATER:

  1. discoverSolutionProposals(req: Request, res: Response):
     - Fetch university solution proposals filtered by thematic category, required budget, or institution name.
     - Return enriched proposal list with problem context.

  2. initiatePartnershipOrFunding(req: Request, res: Response):
     - Extract { proposalId, collaborationType, pledgedFundingAmountINR, trancheSchedule } from req.body.
     - Extract industry ID from JWT (req.user.id).
     - Fetch proposal to get universityId.
     - Create Partnership record with status: 'Expressed_Interest'.
     - Notify university team.
     - Return created partnership details.

  3. getMySponsoredCollaborations(req: Request, res: Response):
     - Fetch all partnerships initiated by this industry user.
     - Populate proposal and university details with milestone progress.

  4. postMentorshipFeedback(req: Request, res: Response):
     - Post technical feedback and review notes to proposal mentorship thread.
*/

import { Request, Response } from 'express';
import { Partnership, IPartnership, CollaborationType } from '../models/Partnership';
import { SolutionProposal } from '../../university/models/SolutionProposal';
import { Problem } from '../../citizen/models/Problem';
import { IndustryUser } from '../models/IndustryUser';
import { IndustryAuthRequest } from '../middlewares/authMiddleware';

/**
 * 1. Discover university proposals open for CSR funding & technical mentorship
 */
export const discoverSolutionProposals = async (req: Request, res: Response): Promise<void> => {
  try {
    const { domain, minBudget, maxBudget, search, page = '1', limit = '10' } = req.query;

    const query: any = {
      status: { $in: ['Submitted_To_Open_Pool', 'Draft'] }
    };

    if (minBudget || maxBudget) {
      query.estimatedBudgetINR = {};
      if (minBudget) query.estimatedBudgetINR.$gte = Number(minBudget);
      if (maxBudget) query.estimatedBudgetINR.$lte = Number(maxBudget);
    }

    if (search) {
      query.$or = [
        { proposalTitle: { $regex: search, $options: 'i' } },
        { executiveSummary: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    let proposals = await SolutionProposal.find(query)
      .populate('problemId', 'title description domainCategory location severityLevel isDisasterEmergency status')
      .populate('universityId', 'fullName universityName department institutionalEmail researchExpertiseTags incubationCenterDetails')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Optional domain filter on the populated problem document
    if (domain) {
      proposals = proposals.filter((p: any) => p.problemId && p.problemId.domainCategory === domain);
    }

    res.status(200).json({
      success: true,
      total: proposals.length,
      page: pageNum,
      proposals
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching solution proposals marketplace.',
      error: error.message
    });
  }
};

/**
 * 2. Sponsor a university proposal (CSR Grant Tranche Pledging & Mentorship Commitment)
 */
export const initiatePartnershipOrFunding = async (req: IndustryAuthRequest, res: Response): Promise<void> => {
  try {
    const industryUserId = req.user?.id;
    if (!industryUserId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const {
      proposalId,
      collaborationType = ['CSR_Grant_Funding'],
      totalPledgedFundingINR,
      fundingDisbursements = [],
      csrComplianceCertificateUrl
    } = req.body;

    if (!proposalId || totalPledgedFundingINR === undefined) {
      res.status(400).json({
        success: false,
        message: 'Proposal ID and total pledged funding amount (INR) are required.'
      });
      return;
    }

    const proposal = await SolutionProposal.findById(proposalId);
    if (!proposal) {
      res.status(404).json({ success: false, message: 'Solution proposal not found.' });
      return;
    }

    // Default 3-stage tranche disbursements matching proposal milestones if not supplied
    const defaultDisbursements = fundingDisbursements.length > 0 ? fundingDisbursements : [
      {
        trancheNumber: 1,
        amountINR: Math.round(Number(totalPledgedFundingINR) * 0.3),
        status: 'Scheduled',
        milestoneReferenceId: 'Milestone 1: Design & Simulation'
      },
      {
        trancheNumber: 2,
        amountINR: Math.round(Number(totalPledgedFundingINR) * 0.4),
        status: 'Scheduled',
        milestoneReferenceId: 'Milestone 2: Prototype Demo'
      },
      {
        trancheNumber: 3,
        amountINR: Math.round(Number(totalPledgedFundingINR) * 0.3),
        status: 'Scheduled',
        milestoneReferenceId: 'Milestone 3: Field Deployment'
      }
    ];

    const partnership = await Partnership.create({
      industryId: industryUserId,
      proposalId,
      universityId: proposal.universityId,
      collaborationType,
      totalPledgedFundingINR: Number(totalPledgedFundingINR),
      fundingDisbursements: defaultDisbursements,
      mentorshipFeedbackThread: [
        {
          mentorName: req.user?.organizationName || 'CSR Director',
          message: `Partnership initiated! Pledged ₹${totalPledgedFundingINR} across ${defaultDisbursements.length} milestone-linked tranches. Looking forward to collaborative prototyping.`,
          timestamp: new Date()
        }
      ],
      csrComplianceCertificateUrl,
      status: 'Funding_Active'
    });

    // Link sponsor on Proposal and update status
    proposal.industrySponsorId = industryUserId as any;
    proposal.status = 'Funded_In_Progress';
    await proposal.save();

    // Update Problem Status
    await Problem.findByIdAndUpdate(proposal.problemId, { status: 'In Progress' });

    // Update Industry Grants Total
    await IndustryUser.findByIdAndUpdate(industryUserId, {
      $inc: { totalGrantsAllocatedINR: Number(totalPledgedFundingINR) }
    });

    res.status(201).json({
      success: true,
      message: 'Partnership initiated successfully! Milestone-linked CSR grant schedule locked.',
      partnership
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error initiating industry sponsorship.',
      error: error.message
    });
  }
};

/**
 * 3. Get all sponsored collaborations for authenticated industry partner
 */
export const getMySponsoredCollaborations = async (req: IndustryAuthRequest, res: Response): Promise<void> => {
  try {
    const industryUserId = req.user?.id;
    if (!industryUserId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const partnerships = await Partnership.find({ industryId: industryUserId })
      .populate({
        path: 'proposalId',
        populate: { path: 'problemId', select: 'title description domainCategory location severityLevel status' }
      })
      .populate('universityId', 'fullName universityName department institutionalEmail')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: partnerships.length,
      partnerships
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sponsored partnerships.',
      error: error.message
    });
  }
};

/**
 * 4. Post technical feedback / review notes to the mentorship thread
 */
export const postMentorshipFeedback = async (req: IndustryAuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { message, mentorName, attachedReviewDocUrl } = req.body;
    const industryUserId = req.user?.id;

    if (!message) {
      res.status(400).json({ success: false, message: 'Feedback message is required.' });
      return;
    }

    const partnership = await Partnership.findById(id);
    if (!partnership) {
      res.status(404).json({ success: false, message: 'Partnership record not found.' });
      return;
    }

    if (partnership.industryId.toString() !== industryUserId) {
      res.status(403).json({ success: false, message: 'Unauthorized to post feedback for this partnership.' });
      return;
    }

    partnership.mentorshipFeedbackThread.push({
      mentorName: mentorName || req.user?.organizationName || 'Industry Mentor',
      message,
      timestamp: new Date(),
      attachedReviewDocUrl
    });

    await partnership.save();

    res.status(200).json({
      success: true,
      message: 'Mentorship feedback posted successfully.',
      mentorshipFeedbackThread: partnership.mentorshipFeedbackThread
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error posting mentorship feedback.',
      error: error.message
    });
  }
};

/**
 * 5. Record a released tranche payment with UTR / Transaction Reference
 */
export const disburseTrancheFunding = async (req: IndustryAuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { trancheNumber, transactionReferenceOrUTR } = req.body;
    const industryUserId = req.user?.id;

    const partnership = await Partnership.findById(id);
    if (!partnership) {
      res.status(404).json({ success: false, message: 'Partnership not found.' });
      return;
    }

    if (partnership.industryId.toString() !== industryUserId) {
      res.status(403).json({ success: false, message: 'Unauthorized.' });
      return;
    }

    const tranche = partnership.fundingDisbursements.find(
      (t) => t.trancheNumber === parseInt(trancheNumber, 10)
    );

    if (!tranche) {
      res.status(404).json({ success: false, message: `Tranche #${trancheNumber} not found.` });
      return;
    }

    tranche.status = 'Released';
    tranche.disbursedAt = new Date();
    tranche.transactionReferenceOrUTR = transactionReferenceOrUTR || `UTR-JH-${Date.now()}`;

    await partnership.save();

    res.status(200).json({
      success: true,
      message: `Tranche #${trancheNumber} marked as Released! UTR Recorded.`,
      disbursement: tranche
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error disbursing tranche.',
      error: error.message
    });
  }
};
