// ==========================================
// CITIZEN MODULE - USER MODEL
// File: Backend/citizen/models/CitizenUser.ts
// ==========================================

/*
  PURPOSE:
  - Defines the Mongoose schema for Citizen accounts (individuals, Panchayati Raj members, local bodies).

  SCHEMA FIELDS TO DEFINE:
  1. fullName: String, required (e.g. "Ramesh Kumar")
  2. phone: String, required, unique (for OTP/SMS verification)
  3. email: String, optional, sparse
  4. password: String, required (hashed with bcrypt)
  5. district: String, required (e.g. "Ranchi", "Dhanbad", "Bokaro", etc.)
  6. blockOrVillage: String, optional (local address)
  7. userType: String, enum: ['Individual', 'Panchayat', 'CommunityOrg', 'UrbanLocalBody'], default: 'Individual'
  8. isVerified: Boolean, default: false
  9. createdAt / updatedAt: Timestamps

  WHAT TO IMPLEMENT LATER:
  - Import Schema, model, Document from 'mongoose'.
  - Create CitizenUserSchema with validation.
  - Export CitizenUser model.
*/
