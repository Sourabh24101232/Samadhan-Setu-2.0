// ==========================================
// INDUSTRY MODULE - USER MODEL
// File: Backend/industry/models/IndustryUser.ts
// ==========================================

/*
  PURPOSE:
  - Defines Mongoose schema for Industry Partners, Startups, MSMEs, CSR organizations, and R&D Labs.

  SCHEMA FIELDS TO DEFINE:
  1. organizationName: String, required (e.g. "Tata Steel CSR Foundation", "JSPL R&D")
  2. orgType: String, enum: ['Corporate_CSR', 'Startup', 'MSME', 'Research_Lab', 'Angel_Fund'], required
  3. officialEmail: String, required, unique
  4. password: String, required (hashed)
  5. contactPersonName: String, required
  6. contactPhone: String
  7. interestDomains: [String]
  8. websiteUrl: String
  9. isVerifiedPartner: Boolean, default: false
  10. totalGrantsAllocatedINR: Number, default: 0
  11. timestamps: true

  WHAT TO IMPLEMENT LATER:
  - Define IndustryUserSchema with validation.
  - Export IndustryUser model.
*/

import mongoose, { Schema, Document, Model } from 'mongoose';

export type IndustryOrgType = 'Corporate_CSR' | 'Startup' | 'MSME' | 'Research_Lab' | 'Angel_Fund';

export interface IIndustryUser extends Document {
  organizationName: string;
  orgType: IndustryOrgType;
  officialEmail: string;
  password: string;
  contactPersonName: string;
  contactPhone?: string;
  interestDomains: string[];
  websiteUrl?: string;
  isVerifiedPartner: boolean;
  totalGrantsAllocatedINR: number;
  createdAt: Date;
  updatedAt: Date;
}

const IndustryUserSchema: Schema<IIndustryUser> = new Schema(
  {
    organizationName: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true
    },
    orgType: {
      type: String,
      enum: ['Corporate_CSR', 'Startup', 'MSME', 'Research_Lab', 'Angel_Fund'],
      required: [true, 'Organization type is required'],
      default: 'Corporate_CSR'
    },
    officialEmail: {
      type: String,
      required: [true, 'Official email is required'],
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6
    },
    contactPersonName: {
      type: String,
      required: [true, 'Contact person name is required'],
      trim: true
    },
    contactPhone: {
      type: String,
      trim: true
    },
    interestDomains: [
      {
        type: String,
        trim: true
      }
    ],
    websiteUrl: {
      type: String,
      trim: true
    },
    isVerifiedPartner: {
      type: Boolean,
      default: false
    },
    totalGrantsAllocatedINR: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export const IndustryUser: Model<IIndustryUser> =
  mongoose.models.IndustryUser || mongoose.model<IIndustryUser>('IndustryUser', IndustryUserSchema);
export default IndustryUser;
