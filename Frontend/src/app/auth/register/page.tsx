// ==========================================
// AUTHENTICATION - MULTI-ROLE REGISTRATION PAGE
// File: Frontend/src/app/auth/register/page.tsx
// ==========================================

/*
  PURPOSE:
  - Unified registration portal for onboarding new Citizens, Universities/Faculty leads, and Industry partners.

  WORKFLOW TO IMPLEMENT LATER:
  1. Role Selector:
     - Citizen Registration: Name, Phone, District, Block/Village, User Type (Individual / Panchayat).
     - University HEI Registration: Faculty Name, University Name (e.g. BIT Mesra), Department, Institutional Email, Research Tags.
     - Industry Registration: Company Name, Org Type (CSR Foundation / Startup / MSME), Contact Person, Official Email, Focus Domains.
  2. Submission Logic:
     - Dispatches payload to corresponding microservice `/auth/register`.
     - Automatically logs user in and redirects to onboarding dashboard.
*/
