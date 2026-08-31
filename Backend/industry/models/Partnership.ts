// ==========================================
// INDUSTRY MODULE - PARTNERSHIP & CSR SCHEMA (REAL-LIFE GROUND ENHANCED)
// File: Backend/industry/models/Partnership.ts
// ==========================================

/*
  PURPOSE:
  - Defines the schema for Industry-University collaborations, CSR fund disbursements, and mentorship communication threads.

  REAL-LIFE FIELD ENHANCEMENTS:
  1. industryId: ObjectId (ref: 'IndustryUser', required)
  2. proposalId: ObjectId (ref: 'SolutionProposal', required)
  3. universityId: ObjectId (ref: 'UniversityUser', required)
  4. collaborationType: [String], enum: [
       'CSR_Grant_Funding', 'Technical_Mentorship', 
       'Lab_Equipment_Access', 'Pilot_Deployment_Site', 'Tech_Transfer_License'
     ], required
  5. totalPledgedFundingINR: Number, default: 0
  6. fundingDisbursements: [{
       trancheNumber: Number,
       amountINR: Number,
       disbursedAt: Date,
       transactionReferenceOrUTR: String,
       milestoneReferenceId: String,
       status: { type: String, enum: ['Scheduled', 'Released', 'On_Hold'], default: 'Scheduled' }
     }]
  7. mentorshipFeedbackThread: [{
       mentorName: String,
       message: String,
       timestamp: Date,
       attachedReviewDocUrl: String
     }]
  8. csrComplianceCertificateUrl: String (Official 80G / CSR deduction certificate link)
  9. status: String, enum: ['Expressed_Interest', 'MOU_Signed', 'Funding_Active', 'Completed', 'Withdrawn'], default: 'Expressed_Interest'
  10. timestamps: true

  WHAT TO IMPLEMENT LATER:
  - Define PartnershipSchema with validation.
  - Export Partnership model.
*/
