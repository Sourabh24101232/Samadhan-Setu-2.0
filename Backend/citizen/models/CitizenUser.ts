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
  6. blockOrVillage: String, optional
  7. userType: String, enum: ['Individual', 'Panchayat', 'CommunityOrg', 'UrbanLocalBody'], default: 'Individual'
  8. isVerified: Boolean, default: false
  9. createdAt / updatedAt: Timestamps

  WHAT TO IMPLEMENT LATER:
  - Import Schema, model, Document from 'mongoose'.
  - Create CitizenUserSchema with validation.
  - Export CitizenUser model.
*/

import mongoose, { Schema, Document, Model } from 'mongoose';

export type CitizenUserType = 'Individual' | 'Panchayat' | 'CommunityOrg' | 'UrbanLocalBody';

export interface ICitizenUser extends Document {
  fullName: string;
  phone: string;
  email?: string;
  password: string;
  district: string;
  blockOrVillage?: string;
  userType: CitizenUserType;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CitizenUserSchema: Schema<ICitizenUser> = new Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true
    },
    blockOrVillage: {
      type: String,
      trim: true
    },
    userType: {
      type: String,
      enum: ['Individual', 'Panchayat', 'CommunityOrg', 'UrbanLocalBody'],
      default: 'Individual'
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export const CitizenUser: Model<ICitizenUser> = mongoose.models.CitizenUser || mongoose.model<ICitizenUser>('CitizenUser', CitizenUserSchema);
export default CitizenUser;
