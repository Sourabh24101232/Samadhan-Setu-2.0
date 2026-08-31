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
