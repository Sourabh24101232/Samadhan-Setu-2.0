// ==========================================
// UNIVERSITY MODULE - PROPOSAL & MILESTONE CONTROLLER
// File: Backend/university/controllers/proposalController.ts
// ==========================================

/*
  PURPOSE:
  - Enables multidisciplinary university teams to submit solution proposals, track project milestones, and submit prototypes/results.

  FUNCTIONS TO IMPLEMENT LATER:

  1. createSolutionProposal(req: Request, res: Response):
     - Extract { problemId, proposalTitle, executiveSummary, proposedMethodology, teamMembers, estimatedBudgetINR, milestones } from req.body.
     - University user ID attached from JWT (req.user.id).
     - Save new SolutionProposal in database.
     - Update Problem status to 'Proposal Submitted'.
     - Return proposal object.

  2. getMyUniversityProposals(req: Request, res: Response):
     - Query SolutionProposal where universityId == req.user.id.
     - Populate problem details.
     - Return list of active proposals and their funding status.

  3. updateMilestoneProgress(req: Request, res: Response):
     - Extract { proposalId, milestoneIndex, status, deliverableLink } from req.body.
     - Update specific milestone status (e.g., mark as 'Completed').
     - Check if all milestones completed, update overall proposal status to 'Field Testing' or 'Completed / Deployed'.
     - Save and return updated proposal.

  4. uploadPrototypeEvidence(req: Request, res: Response):
     - Upload demo photos, research papers, YouTube links, or CAD models to prototypeMedia array.
*/
