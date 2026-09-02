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
       role: String
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

import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ITeamMember {
  name: string;
  studentId?: string;
  branch: string;
  year: string;
  role: string;
}

export interface IFacultyMentor {
  name: string;
  email: string;
  department: string;
  mentorApprovalStatus: 'Approved' | 'Pending' | 'Revision_Requested';
}

export interface IMilestoneTranche {
  milestoneNumber: number;
  title: string;
  description: string;
  targetDate: Date;
  percentageFundingToRelease: number;
  status: 'Pending' | 'Submitted_For_Review' | 'Approved_By_Sponsor' | 'Completed';
  deliverableLink?: string;
  mentorReviewNotes?: string;
}

export interface IPrototypeMedia {
  mediaType: 'image' | 'video' | 'cad_file' | 'report_pdf';
  url: string;
  caption?: string;
  uploadedAt: Date;
}

export type IPOwnershipType =
  | 'Open_Source_Social_Good'
  | 'Joint_Student_Faculty_Patent'
  | 'University_Incubation_IP'
  | 'Industry_Sponsored_Transfer';

export type ProposalStatus =
  | 'Draft'
  | 'Faculty_Pending'
  | 'Submitted_To_Open_Pool'
  | 'Funded_In_Progress'
  | 'Prototyping'
  | 'Field_Testing'
  | 'Completed_Deployed'
  | 'Abandoned_Expired';

export interface ISolutionProposal extends Document {
  problemId: Types.ObjectId;
  universityId: Types.ObjectId;
  teamMembers: ITeamMember[];
  facultyMentor: IFacultyMentor;
  proposalTitle: string;
  executiveSummary: string;
  proposedMethodology: string;
  estimatedBudgetINR: number;
  projectTimelineMonths: number;
  milestoneTranches: IMilestoneTranche[];
  ipOwnershipDeclaration: IPOwnershipType;
  prototypeMedia: IPrototypeMedia[];
  industrySponsorId?: Types.ObjectId;
  status: ProposalStatus;
  createdAt: Date;
  updatedAt: Date;
}

const TeamMemberSchema = new Schema<ITeamMember>(
  {
    name: { type: String, required: true },
    studentId: { type: String },
    branch: { type: String, required: true },
    year: { type: String, required: true },
    role: { type: String, required: true }
  },
  { _id: false }
);

const FacultyMentorSchema = new Schema<IFacultyMentor>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    department: { type: String, required: true },
    mentorApprovalStatus: {
      type: String,
      enum: ['Approved', 'Pending', 'Revision_Requested'],
      default: 'Pending'
    }
  },
  { _id: false }
);

const MilestoneTrancheSchema = new Schema<IMilestoneTranche>(
  {
    milestoneNumber: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    targetDate: { type: Date, required: true },
    percentageFundingToRelease: { type: Number, required: true, default: 33 },
    status: {
      type: String,
      enum: ['Pending', 'Submitted_For_Review', 'Approved_By_Sponsor', 'Completed'],
      default: 'Pending'
    },
    deliverableLink: { type: String },
    mentorReviewNotes: { type: String }
  },
  { _id: false }
);

const PrototypeMediaSchema = new Schema<IPrototypeMedia>(
  {
    mediaType: {
      type: String,
      enum: ['image', 'video', 'cad_file', 'report_pdf'],
      required: true
    },
    url: { type: String, required: true },
    caption: { type: String },
    uploadedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const SolutionProposalSchema: Schema<ISolutionProposal> = new Schema(
  {
    problemId: {
      type: Schema.Types.ObjectId,
      ref: 'Problem',
      required: [true, 'Problem reference is required']
    },
    universityId: {
      type: Schema.Types.ObjectId,
      ref: 'UniversityUser',
      required: [true, 'University reference is required']
    },
    teamMembers: [TeamMemberSchema],
    facultyMentor: FacultyMentorSchema,
    proposalTitle: {
      type: String,
      required: [true, 'Proposal title is required'],
      trim: true
    },
    executiveSummary: {
      type: String,
      required: [true, 'Executive summary is required'],
      trim: true
    },
    proposedMethodology: {
      type: String,
      required: [true, 'Methodology is required'],
      trim: true
    },
    estimatedBudgetINR: {
      type: Number,
      required: [true, 'Estimated budget is required'],
      min: 0
    },
    projectTimelineMonths: {
      type: Number,
      default: 6
    },
    milestoneTranches: [MilestoneTrancheSchema],
    ipOwnershipDeclaration: {
      type: String,
      enum: [
        'Open_Source_Social_Good',
        'Joint_Student_Faculty_Patent',
        'University_Incubation_IP',
        'Industry_Sponsored_Transfer',
        'University TBI Incubation IP',
        'Open Source / Social Good (Public Domain)',
        'Joint Student-Faculty Patent'
      ],
      default: 'Open_Source_Social_Good'
    },
    prototypeMedia: [PrototypeMediaSchema],
    industrySponsorId: {
      type: Schema.Types.ObjectId,
      ref: 'IndustryUser'
    },
    status: {
      type: String,
      enum: [
        'Draft',
        'Faculty_Pending',
        'Submitted_To_Open_Pool',
        'Funded_In_Progress',
        'Prototyping',
        'Field_Testing',
        'Completed_Deployed',
        'Abandoned_Expired'
      ],
      default: 'Draft'
    }
  },
  {
    timestamps: true
  }
);

SolutionProposalSchema.index({ problemId: 1, universityId: 1 });
SolutionProposalSchema.index({ status: 1 });

export const SolutionProposal: Model<ISolutionProposal> =
  mongoose.models.SolutionProposal || mongoose.model<ISolutionProposal>('SolutionProposal', SolutionProposalSchema);
export default SolutionProposal;
