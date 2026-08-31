// ==========================================
// INDUSTRY MODULE - USER MODEL
// File: Backend/industry/models/IndustryUser.ts
// ==========================================

/*
  PURPOSE:
  - Defines Mongoose schema for Industry Partners, Startups, MSMEs, CSR organizations, and R&D Labs.

  SCHEMA FIELDS TO DEFINE:
  1. organizationName: String, required (e.g. "Tata Steel CSR Foundation", "JSPL R&D", "AgriTech Innovation Labs")
  2. orgType: String, enum: ['Corporate_CSR', 'Startup', 'MSME', 'Research_Lab', 'Angel_Fund'], required
  3. officialEmail: String, required, unique
  4. password: String, required (hashed)
  5. contactPersonName: String, required
  6. contactPhone: String
  7. interestDomains: [String] (e.g. ['Water Resources', 'Agriculture', 'Disaster Management', 'Healthcare'])
  8. websiteUrl: String
  9. isVerifiedPartner: Boolean, default: false
  10. totalGrantsAllocatedINR: Number, default: 0
  11. timestamps: true

  WHAT TO IMPLEMENT LATER:
  - Define IndustryUserSchema with validation.
  - Export IndustryUser model.
*/
