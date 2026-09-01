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
  8. csrComplianceCertificateUrl: String
  9. status: String, enum: ['Expressed_Interest', 'MOU_Signed', 'Funding_Active', 'Completed', 'Withdrawn'], default: 'Expressed_Interest'
  10. timestamps: true

  WHAT TO IMPLEMENT LATER:
  - Define PartnershipSchema with validation.
  - Export Partnership model.
*/

import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type CollaborationType =
  | 'CSR_Grant_Funding'
  | 'Technical_Mentorship'
  | 'Lab_Equipment_Access'
  | 'Pilot_Deployment_Site'
  | 'Tech_Transfer_License';

export interface IFundingDisbursement {
  trancheNumber: number;
  amountINR: number;
  disbursedAt?: Date;
  transactionReferenceOrUTR?: string;
  milestoneReferenceId?: string;
  status: 'Scheduled' | 'Released' | 'On_Hold';
}

export interface IMentorshipFeedback {
  mentorName: string;
  message: string;
  timestamp: Date;
  attachedReviewDocUrl?: string;
}

export type PartnershipStatus = 'Expressed_Interest' | 'MOU_Signed' | 'Funding_Active' | 'Completed' | 'Withdrawn';

export interface IPartnership extends Document {
  industryId: Types.ObjectId;
  proposalId: Types.ObjectId;
  universityId: Types.ObjectId;
  collaborationType: CollaborationType[];
  totalPledgedFundingINR: number;
  fundingDisbursements: IFundingDisbursement[];
  mentorshipFeedbackThread: IMentorshipFeedback[];
  csrComplianceCertificateUrl?: string;
  status: PartnershipStatus;
  createdAt: Date;
  updatedAt: Date;
}

const FundingDisbursementSchema = new Schema<IFundingDisbursement>(
  {
    trancheNumber: { type: Number, required: true },
    amountINR: { type: Number, required: true },
    disbursedAt: { type: Date },
    transactionReferenceOrUTR: { type: String, trim: true },
    milestoneReferenceId: { type: String, trim: true },
    status: {
      type: String,
      enum: ['Scheduled', 'Released', 'On_Hold'],
      default: 'Scheduled'
    }
  },
  { _id: false }
);

const MentorshipFeedbackSchema = new Schema<IMentorshipFeedback>(
  {
    mentorName: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    timestamp: { type: Date, default: Date.now },
    attachedReviewDocUrl: { type: String, trim: true }
  },
  { _id: false }
);

const PartnershipSchema: Schema<IPartnership> = new Schema(
  {
    industryId: {
      type: Schema.Types.ObjectId,
      ref: 'IndustryUser',
      required: [true, 'Industry partner reference is required']
    },
    proposalId: {
      type: Schema.Types.ObjectId,
      ref: 'SolutionProposal',
      required: [true, 'Proposal reference is required']
    },
    universityId: {
      type: Schema.Types.ObjectId,
      ref: 'UniversityUser',
      required: [true, 'University reference is required']
    },
    collaborationType: [
      {
        type: String,
        enum: [
          'CSR_Grant_Funding',
          'Technical_Mentorship',
          'Lab_Equipment_Access',
          'Pilot_Deployment_Site',
          'Tech_Transfer_License'
        ],
        required: true
      }
    ],
    totalPledgedFundingINR: {
      type: Number,
      default: 0,
      min: 0
    },
    fundingDisbursements: [FundingDisbursementSchema],
    mentorshipFeedbackThread: [MentorshipFeedbackSchema],
    csrComplianceCertificateUrl: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['Expressed_Interest', 'MOU_Signed', 'Funding_Active', 'Completed', 'Withdrawn'],
      default: 'Expressed_Interest'
    }
  },
  {
    timestamps: true
  }
);

PartnershipSchema.index({ industryId: 1, proposalId: 1 });
PartnershipSchema.index({ status: 1 });

export const Partnership: Model<IPartnership> =
  mongoose.models.Partnership || mongoose.model<IPartnership>('Partnership', PartnershipSchema);
export default Partnership;
