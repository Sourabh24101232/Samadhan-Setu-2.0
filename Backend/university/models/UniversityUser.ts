// ==========================================
// UNIVERSITY MODULE - USER / HEI MODEL
// File: Backend/university/models/UniversityUser.ts
// ==========================================

/*
  PURPOSE:
  - Defines the Mongoose schema for University/HEI entities, Faculty Mentors, and Student Teams.

  SCHEMA FIELDS TO DEFINE:
  1. fullName: String, required (e.g. "Dr. Ananya Sen" or "Team Innovate BIT")
  2. universityName: String, required (e.g. "BIT Mesra", "IIT ISM Dhanbad", "Ranchi University", "NIT Jamshedpur")
  3. department: String, required (e.g. "Civil Engineering", "Computer Science", "Biotechnology", "Agriculture")
  4. institutionalEmail: String, required, unique (e.g. "ananya.sen@bitmesra.ac.in")
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
