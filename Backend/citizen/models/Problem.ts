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
  16. upvotes: [{ type: String }]
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

import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type ProblemDomainCategory =
  | 'Education'
  | 'Agriculture'
  | 'Healthcare'
  | 'Water Resources'
  | 'Environment'
  | 'Energy'
  | 'Urban Development'
  | 'Accessibility'
  | 'Public Administration'
  | 'Rural Livelihoods'
  | 'Disaster Management';

export type ProblemStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Verified'
  | 'Assigned to University'
  | 'Proposal Submitted'
  | 'In Progress'
  | 'Testing'
  | 'Resolved'
  | 'Rejected'
  | 'Emergency_Escalated';

export type ProblemSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export interface IMediaAttachment {
  mediaType: 'image' | 'video' | 'audio' | 'document';
  url: string;
  isExifStripped?: boolean;
  uploadedAt: Date;
}

export interface ICitizenGroundFeedback {
  isResolvedConfirmedByCitizen: boolean;
  rating: number; // 1 to 5
  citizenFeedbackComments?: string;
  verifiedAt?: Date;
}

export interface IProblemLocation {
  district: string;
  block?: string;
  villageOrPanchayat?: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
}

export interface IProblem extends Document {
  title: string;
  description: string;
  voiceNoteUrl?: string;
  languageCode: string;
  isAnonymous: boolean;
  anonymousTrackingToken?: string;
  submittedBy?: Types.ObjectId | null;
  domainCategory: ProblemDomainCategory;
  isDisasterEmergency: boolean;
  isActionableRnD: boolean;
  location: IProblemLocation;
  mediaAttachments: IMediaAttachment[];
  status: ProblemStatus;
  assignedUniversityId?: Types.ObjectId;
  claimExpiresAt?: Date;
  upvotes: string[]; // List of user IDs or session tokens
  severityLevel: ProblemSeverity;
  aiTags: string[];
  citizenGroundFeedback?: ICitizenGroundFeedback;
  duplicateOfProblemId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MediaAttachmentSchema = new Schema<IMediaAttachment>(
  {
    mediaType: {
      type: String,
      enum: ['image', 'video', 'audio', 'document'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    isExifStripped: {
      type: Boolean,
      default: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const CitizenGroundFeedbackSchema = new Schema<ICitizenGroundFeedback>(
  {
    isResolvedConfirmedByCitizen: {
      type: Boolean,
      default: false
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },
    citizenFeedbackComments: {
      type: String,
      trim: true
    },
    verifiedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const ProblemSchema: Schema<IProblem> = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Problem title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Problem description is required'],
      trim: true
    },
    voiceNoteUrl: {
      type: String,
      trim: true
    },
    languageCode: {
      type: String,
      default: 'hi',
      trim: true
    },
    isAnonymous: {
      type: Boolean,
      default: false
    },
    anonymousTrackingToken: {
      type: String,
      sparse: true,
      index: true,
      trim: true
    },
    submittedBy: {
      type: Schema.Types.ObjectId,
      ref: 'CitizenUser',
      default: null
    },
    domainCategory: {
      type: String,
      enum: [
        'Education',
        'Agriculture',
        'Healthcare',
        'Water Resources',
        'Environment',
        'Energy',
        'Urban Development',
        'Accessibility',
        'Public Administration',
        'Rural Livelihoods',
        'Disaster Management'
      ],
      required: [true, 'Domain category is required'],
      default: 'Water Resources'
    },
    isDisasterEmergency: {
      type: Boolean,
      default: false
    },
    isActionableRnD: {
      type: Boolean,
      default: true
    },
    location: {
      district: {
        type: String,
        required: [true, 'District is required'],
        trim: true
      },
      block: { type: String, trim: true },
      villageOrPanchayat: { type: String, trim: true },
      landmark: { type: String, trim: true },
      latitude: { type: Number },
      longitude: { type: Number }
    },
    mediaAttachments: [MediaAttachmentSchema],
    status: {
      type: String,
      enum: [
        'Submitted',
        'Under Review',
        'Verified',
        'Assigned to University',
        'Proposal Submitted',
        'In Progress',
        'Testing',
        'Resolved',
        'Rejected',
        'Emergency_Escalated'
      ],
      default: 'Submitted'
    },
    assignedUniversityId: {
      type: Schema.Types.ObjectId,
      ref: 'UniversityUser'
    },
    claimExpiresAt: {
      type: Date
    },
    upvotes: [
      {
        type: String
      }
    ],
    severityLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium'
    },
    aiTags: [
      {
        type: String,
        trim: true
      }
    ],
    citizenGroundFeedback: CitizenGroundFeedbackSchema,
    duplicateOfProblemId: {
      type: Schema.Types.ObjectId,
      ref: 'Problem'
    }
  },
  {
    timestamps: true
  }
);

ProblemSchema.index({ 'location.district': 1, status: 1 });
ProblemSchema.index({ domainCategory: 1, isDisasterEmergency: 1 });

export const Problem: Model<IProblem> = mongoose.models.Problem || mongoose.model<IProblem>('Problem', ProblemSchema);
export default Problem;
