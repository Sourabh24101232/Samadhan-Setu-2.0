// ==========================================
// AI ENGINE - CONFIGURATION & PROMPTS
// File: Backend/ai/config/aiConfig.ts
// ==========================================

/*
  PURPOSE:
  - Configuration for AI Models (Google Gemini 1.5 Flash API) and system prompts for problem intelligence.

  WHAT TO IMPLEMENT LATER:
  1. Read GEMINI_API_KEY from .env.
  2. Initialize Google Generative AI SDK client.
  3. Define System Prompts:
     - THEMATIC_CLASSIFICATION_PROMPT: Guides LLM to return valid categories (11 domains) + R&D check + emergency detection + severity + tags.
     - UNIVERSITY_MATCHING_PROMPT: Matches problem category and district with Jharkhand university department expertise (BIT Mesra, IIT ISM, Birsa Agri, AIIMS, NIT).
  4. Export AI client and prompt helpers.
*/
