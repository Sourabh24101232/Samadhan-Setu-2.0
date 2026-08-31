// ==========================================
// AI ENGINE - CONFIGURATION & PROMPTS
// File: Backend/ai/config/aiConfig.ts
// ==========================================

/*
  PURPOSE:
  - Configuration for AI Models (e.g. Google Gemini API, OpenAI, Hugging Face, or LangChain) and system prompts for problem intelligence.

  WHAT TO IMPLEMENT LATER:
  1. Read GEMINI_API_KEY from .env.
  2. Initialize Google Generative AI SDK client.
  3. Define System Prompts:
     - THEMATIC_CLASSIFICATION_PROMPT: Guides LLM to return valid categories (Water Resources, Agriculture, Healthcare, Rural Livelihoods, etc.) + severity + keywords from user text.
     - UNIVERSITY_MATCHING_PROMPT: Matches problem category and district with university department expertise (e.g. BIT Mesra -> Water/IoT, Birsa Agricultural University -> Agri/Soil, IIT ISM -> Mining/Disaster).
  4. Export AI client and prompt helpers.
*/
