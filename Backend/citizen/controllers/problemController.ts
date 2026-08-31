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
