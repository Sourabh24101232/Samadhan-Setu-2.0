// ==========================================
// GOVERNMENT MODULE - ADMIN MODEL
// File: Backend/gov/models/GovAdmin.ts
// ==========================================

/*
  PURPOSE:
  - Defines Mongoose schema for Government Officials, District Magistrates, and Dept of Higher & Technical Education reviewers.

  SCHEMA FIELDS TO DEFINE:
  1. officialName: String, required (e.g. "Secretary, Dept of Higher & Technical Education")
  2. governmentEmail: String, required, unique (e.g. "admin.education@jharkhand.gov.in")
  3. password: String, required (hashed)
  4. department: String, required (e.g. "Higher & Technical Education", "Rural Development", "Water Resources")
  5. jurisdictionLevel: String, enum: ['State_Level', 'District_Level', 'Block_Level'], default: 'State_Level'
  6. assignedDistrict: String (optional, e.g. "Ranchi", "Dhanbad", or null for State-wide)
  7. role: String, enum: ['SuperAdmin', 'DepartmentOfficer', 'DistrictNodalOfficer', 'Reviewer'], default: 'DepartmentOfficer'
  8. timestamps: true

  WHAT TO IMPLEMENT LATER:
  - Define GovAdminSchema with validation.
  - Export GovAdmin model.
*/
