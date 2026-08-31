// ==========================================
// CITIZEN PORTAL - MY SUBMISSIONS & ANONYMOUS PASSKEY TRACKER
// File: Frontend/src/app/citizen/my-problems/page.tsx
// ==========================================

/*
  PURPOSE:
  - Dual tracker supporting both Logged-In Citizen Dashboard and Anonymous Passkey Lookup.

  TABS TO RENDER LATER:
  
  1. TAB 1: "My Account Submissions" (Logged-In Users):
     - Displays list of problems submitted via citizen account.
     - Status timeline for each problem.

  2. TAB 2: "🛡️ Track Anonymous Problem via Secret Key":
     - Search Input: "Enter your Secret Tracking Passkey (e.g. ANON-JH-XXXXXX)"
     - "Track Issue" Button -> calls `GET /api/citizen/problems/anonymous-track/:token`
     - Displays complete StatusTimeline, assigned university proposal, prototype demo, and a button to submit "Ground-Truth Verification & Rating" securely using the passkey.
*/
