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
