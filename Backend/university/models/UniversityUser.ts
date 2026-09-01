// ==========================================
// UNIVERSITY MODULE - USER / HEI MODEL
// File: Backend/university/models/UniversityUser.ts
// ==========================================

/*
  PURPOSE:
  - Defines the Mongoose schema for University/HEI entities, Faculty Mentors, and Student Teams.

  SCHEMA FIELDS TO DEFINE:
  1. fullName: String, required (e.g. "Dr. Ananya Sen" or "Team Innovate BIT")
  2. universityName: String, required (e.g. "BIT Mesra", "IIT ISM Dhanbad", "Birsa Agricultural University", "NIT Jamshedpur")
  3. department: String, required (e.g. "Civil Engineering", "Computer Science", "Biotechnology", "Agriculture")
  4. institutionalEmail: String, required, unique
  5. password: String, required (hashed)
  6. role: String, enum: ['Faculty_Mentor', 'Student_Lead', 'Incubation_Head', 'University_Admin'], default: 'Faculty_Mentor'
  7. researchExpertiseTags: [String] (e.g. ["Water Purification", "IoT Sensors", "Soil Health", "Disaster Alert"])
  8. incubationCenterDetails: {
       hasIncubationLab: Boolean,
       centerName: String
     }
  9. activeProjectsCount: Number, default: 0
  10. timestamps: true

  WHAT TO IMPLEMENT LATER:
  - Define UniversityUserSchema with validation.
  - Export UniversityUser model.
*/

import mongoose, { Schema, Document, Model } from 'mongoose';

export type UniversityRole = 'Faculty_Mentor' | 'Student_Lead' | 'Incubation_Head' | 'University_Admin';

export interface IUniversityUser extends Document {
  fullName: string;
  universityName: string;
  department: string;
  institutionalEmail: string;
  password: string;
  role: UniversityRole;
  researchExpertiseTags: string[];
  incubationCenterDetails?: {
    hasIncubationLab: boolean;
    centerName?: string;
  };
  activeProjectsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const UniversityUserSchema: Schema<IUniversityUser> = new Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    universityName: {
      type: String,
      required: [true, 'University name is required'],
      trim: true
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true
    },
    institutionalEmail: {
      type: String,
      required: [true, 'Institutional email is required'],
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6
    },
    role: {
      type: String,
      enum: ['Faculty_Mentor', 'Student_Lead', 'Incubation_Head', 'University_Admin'],
      default: 'Faculty_Mentor'
    },
    researchExpertiseTags: [
      {
        type: String,
        trim: true
      }
    ],
    incubationCenterDetails: {
      hasIncubationLab: {
        type: Boolean,
        default: false
      },
      centerName: {
        type: String,
        trim: true
      }
    },
    activeProjectsCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export const UniversityUser: Model<IUniversityUser> =
  mongoose.models.UniversityUser || mongoose.model<IUniversityUser>('UniversityUser', UniversityUserSchema);
export default UniversityUser;
