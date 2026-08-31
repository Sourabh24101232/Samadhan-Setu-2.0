// ==========================================
// UNIVERSITY MODULE - AUTH CONTROLLER
// File: Backend/university/controllers/universityAuthController.ts
// ==========================================

/*
  PURPOSE:
  - Handles authentication and profile management for University Faculty, Student leads, and HEI administrators.

  FUNCTIONS TO IMPLEMENT LATER:

  1. registerUniversityUser(req: Request, res: Response):
     - Extract { fullName, universityName, department, institutionalEmail, password, role, researchExpertiseTags } from req.body.
     - Check if institutionalEmail already registered.
     - Hash password with bcrypt.
     - Save new UniversityUser record.
     - Return JWT token and profile data.

  2. loginUniversityUser(req: Request, res: Response):
     - Extract { institutionalEmail, password } from req.body.
     - Verify credentials, generate JWT containing university ID & role.
     - Return auth payload.

  3. getUniversityProfile(req: Request, res: Response):
     - Fetch university details and its active submitted solution proposals.
*/
