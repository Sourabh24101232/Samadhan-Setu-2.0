// ==========================================
// AI ENGINE - PROBLEM CATEGORIZATION (REAL-LIFE GROUND ENHANCED)
// File: Backend/ai/controllers/categorizationController.ts
// ==========================================

/*
  PURPOSE:
  - Uses AI (Google Gemini 1.5 Flash) to parse raw citizen input (in English, Hindi, or Hinglish), filter routine complaints, extract domain, detect disaster emergencies, and score priority.

  FUNCTIONS TO IMPLEMENT LATER:

  1. classifyProblemDescription(req: Request, res: Response):
     - Extract { title, description, district, userSpokenLanguage } from req.body.
     - Prompt Gemini with real-world classification instructions:
       * "Analyze the submitted issue. Translate Hindi/Hinglish to English if needed."
       * "Determine if this is an Actionable R&D / Societal Innovation Challenge (e.g. arsenic water filter, solar cold storage, flood alert sensor) OR a Routine Municipal Grievance (e.g. broken street lamp, pothole on road)."
       * "Detect if there is an immediate Disaster Emergency (e.g. toxic mine gas leak, flash flood, landslide, dam breach)."
       * "Classify into one of 11 domains: ['Education', 'Agriculture', 'Healthcare', 'Water Resources', 'Environment', 'Energy', 'Urban Development', 'Accessibility', 'Public Administration', 'Rural Livelihoods', 'Disaster Management']."
     - Return JSON output:
       {
         englishTitle: string,
         englishSummary: string,
         domainCategory: string,
         isActionableRnD: boolean,
         isDisasterEmergency: boolean,
         severityLevel: 'Low' | 'Medium' | 'High' | 'Critical',
         aiTags: string[],
         confidenceScore: number
       }
*/
