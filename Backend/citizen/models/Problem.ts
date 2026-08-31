// ==========================================
// CITIZEN MODULE - PROBLEM SCHEMA (WITH ANONYMOUS WHISTLEBLOWER PROTECTION)
// File: Backend/citizen/models/Problem.ts
// ==========================================

/*
  PURPOSE:
  - Defines the Mongoose schema for societal challenges reported by citizens, panchayats, and anonymous whistleblowers.

  REAL-LIFE & WHISTLEBLOWER SHIELD FIELDS:
  1. title: String, required (e.g. "Illegal chemical dumping polluting Subarnarekha River")
  2. description: String, required (detailed issue explanation)
  3. voiceNoteUrl: String, optional (audio recording with optional pitch-shift for privacy)
  4. languageCode: String, default: 'hi'
  
  --- 🛡️ WHISTLEBLOWER & ANONYMITY SHIELD ---
  5. isAnonymous: Boolean, default: false (Protects citizen from criminals, mafia, or harassment)
  6. anonymousTrackingToken: String, unique, sparse (Hashed token for anonymous user to check status without login)
  7. submittedBy: ObjectId (ref: 'CitizenUser', optional - null if isAnonymous is true)
  
  8. domainCategory: String, enum: [
       'Education', 'Agriculture', 'Healthcare', 'Water Resources', 
       'Environment', 'Energy', 'Urban Development', 'Accessibility', 
       'Public Administration', 'Rural Livelihoods', 'Disaster Management'
     ]
  9. isDisasterEmergency: Boolean, default: false (SOS Fast-Track)
  10. isActionableRnD: Boolean, default: true
  11. location: {
       district: String (required, e.g. "Ranchi", "Dhanbad"),
       block: String,
       villageOrPanchayat: String,
       landmark: String,
       latitude: Number,
       longitude: Number
     }
  12. mediaAttachments: Array of {
       mediaType: 'image' | 'video' | 'audio' | 'document',
       url: String,
       isExifStripped: Boolean, // Device metadata stripped to prevent geo-tracking whistleblower
       uploadedAt: Date
     }
  13. status: String, enum: [
        'Submitted', 'Under Review', 'Verified', 'Assigned to University', 
        'Proposal Submitted', 'In Progress', 'Testing', 'Resolved', 'Rejected', 'Emergency_Escalated'
      ], default: 'Submitted'
  14. assignedUniversityId: ObjectId (ref: 'UniversityUser', optional)
  15. claimExpiresAt: Date
  16. upvotes: [{ type: String }] // Can store citizen ID or anonymous session hash
  17. severityLevel: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium'
  18. aiTags: [String]
  19. citizenGroundFeedback: {
        isResolvedConfirmedByCitizen: Boolean,
        rating: Number, // 1 to 5 stars
        citizenFeedbackComments: String,
        verifiedAt: Date
      }
  20. duplicateOfProblemId: ObjectId (ref: 'Problem', optional)
  21. timestamps: true

  WHAT TO IMPLEMENT LATER:
  - Define ProblemSchema with Mongoose indexes.
  - Export Problem model.
*/
