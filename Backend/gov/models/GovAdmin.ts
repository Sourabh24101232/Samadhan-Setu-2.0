// ==========================================
// GOVERNMENT MODULE - ADMIN MODEL
// File: Backend/gov/models/GovAdmin.ts
// ==========================================

/*
  PURPOSE:
  - Defines Mongoose schema for Government Officials, District Magistrates, and Dept of Higher & Technical Education reviewers.

  SCHEMA FIELDS TO DEFINE:
  1. officialName: String, required
  2. governmentEmail: String, required, unique
  3. password: String, required (hashed)
  4. department: String, required (e.g. "Higher & Technical Education", "Rural Development", "Water Resources")
  5. jurisdictionLevel: String, enum: ['State_Level', 'District_Level', 'Block_Level'], default: 'State_Level'
  6. assignedDistrict: String
  7. role: String, enum: ['SuperAdmin', 'DepartmentOfficer', 'DistrictNodalOfficer', 'Reviewer'], default: 'DepartmentOfficer'
  8. timestamps: true

  WHAT TO IMPLEMENT LATER:
  - Define GovAdminSchema with validation.
  - Export GovAdmin model.
*/

import mongoose, { Schema, Document, Model } from 'mongoose';

export type JurisdictionLevel = 'State_Level' | 'District_Level' | 'Block_Level';
export type GovRole = 'SuperAdmin' | 'DepartmentOfficer' | 'DistrictNodalOfficer' | 'Reviewer';

export interface IGovAdmin extends Document {
  officialName: string;
  governmentEmail: string;
  password: string;
  department: string;
  jurisdictionLevel: JurisdictionLevel;
  assignedDistrict?: string;
  role: GovRole;
  createdAt: Date;
  updatedAt: Date;
}

const GovAdminSchema: Schema<IGovAdmin> = new Schema(
  {
    officialName: {
      type: String,
      required: [true, 'Official name is required'],
      trim: true
    },
    governmentEmail: {
      type: String,
      required: [true, 'Government email is required'],
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      default: 'Higher & Technical Education'
    },
    jurisdictionLevel: {
      type: String,
      enum: ['State_Level', 'District_Level', 'Block_Level'],
      default: 'State_Level'
    },
    assignedDistrict: {
      type: String,
      trim: true
    },
    role: {
      type: String,
      enum: ['SuperAdmin', 'DepartmentOfficer', 'DistrictNodalOfficer', 'Reviewer'],
      default: 'DepartmentOfficer'
    }
  },
  {
    timestamps: true
  }
);

export const GovAdmin: Model<IGovAdmin> =
  mongoose.models.GovAdmin || mongoose.model<IGovAdmin>('GovAdmin', GovAdminSchema);
export default GovAdmin;
