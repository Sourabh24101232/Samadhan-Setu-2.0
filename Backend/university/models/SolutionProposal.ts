// ==========================================
// UNIVERSITY MODULE - SOLUTION PROPOSAL SCHEMA (REAL-LIFE GROUND ENHANCED)
// File: Backend/university/models/SolutionProposal.ts
// ==========================================

/*
  PURPOSE:
  - Defines the schema for student-faculty solution proposals with real-world milestone-linked fund tranches, IP declarations, and mentor feedback.

  REAL-LIFE FIELD ENHANCEMENTS:
  1. problemId: ObjectId (ref: 'Problem', required)
  2. universityId: ObjectId (ref: 'UniversityUser', required)
  3. teamMembers: [{
       name: String,
       studentId: String,
       branch: String,
       year: String,
       role: String // e.g. "Hardware Lead", "Software / IoT Developer", "Field Tester"
     }]
  4. facultyMentor: {
       name: String,
       email: String,
       department: String,
       mentorApprovalStatus: { type: String, enum: ['Approved', 'Pending', 'Revision_Requested'], default: 'Pending' }
     }
  5. proposalTitle: String, required
  6. executiveSummary: String, required
  7. proposedMethodology: String, required
  8. estimatedBudgetINR: Number, required
  9. projectTimelineMonths: Number, default: 6
  10. milestoneTranches: [{
        milestoneNumber: Number,
        title: String,
        description: String,
        targetDate: Date,
        percentageFundingToRelease: Number, // e.g. Milestone 1: 30%, Milestone 2: 40%, Milestone 3: 30%
        status: { type: String, enum: ['Pending', 'Submitted_For_Review', 'Approved_By_Sponsor', 'Completed'], default: 'Pending' },
        deliverableLink: String,
        mentorReviewNotes: String
      }]
  11. ipOwnershipDeclaration: {
        type: String, 
        enum: ['Open_Source_Social_Good', 'Joint_Student_Faculty_Patent', 'University_Incubation_IP', 'Industry_Sponsored_Transfer'], 
        default: 'Open_Source_Social_Good'
      }
  12. prototypeMedia: [{
        mediaType: 'image' | 'video' | 'cad_file' | 'report_pdf',
        url: String,
        caption: String,
        uploadedAt: Date
      }]
  13. industrySponsorId: ObjectId (ref: 'IndustryUser', optional)
  14. status: String, enum: [
        'Draft', 'Faculty_Pending', 'Submitted_To_Open_Pool', 
        'Funded_In_Progress', 'Prototyping', 'Field_Testing', 'Completed_Deployed', 'Abandoned_Expired'
      ], default: 'Draft'
  15. timestamps: true

  WHAT TO IMPLEMENT LATER:
  - Define SolutionProposalSchema with Mongoose.
  - Export SolutionProposal model.
*/
