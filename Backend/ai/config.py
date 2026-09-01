# ==========================================
# AI ENGINE - CONFIGURATION & PROMPTS (PYTHON / FASTAPI)
# File: Backend/ai/config.py
# ==========================================

"""
PURPOSE:
- Configuration for Google Gemini AI SDK and structured system prompt templates.

WHAT TO IMPLEMENT LATER:
1. Load GEMINI_API_KEY from environment variables (.env).
2. Configure `google.generativeai` with the API key.
3. Select model `gemini-1.5-flash` for high-speed, cost-effective multimodal inference.
4. Define Prompt Constants:
   - CLASSIFICATION_SYSTEM_PROMPT:
     * Guides Gemini to classify into 11 domains.
     * Evaluates R&D actionability vs routine municipal grievance.
     * Detects immediate Disaster Emergency (floods, toxic leaks, mine collapse).
     * Extracts tags and handles Hindi/English bilingual inputs.
   - UNIVERSITY_MATCHING_PROMPT:
     * Matches domain & district with Jharkhand institutions (BIT Mesra, IIT ISM Dhanbad, Birsa Agri Univ, NIT Jamshedpur, AIIMS Deoghar).
"""

import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
PORT = int(os.getenv("PORT", "5005"))

# Initialize Gemini SDK if key is configured
if GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here":
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        print("[OK] [AI Service] Google Gemini API Configured Successfully")
    except Exception as e:
        print(f"[!] [AI Service] Gemini configuration warning: {e}")
else:
    print("[!] [AI Service] GEMINI_API_KEY not set. Using intelligent rule-based fallback mode.")

# The 11 standard societal domains from SIH26043 Problem Statement
THEMATIC_DOMAINS = [
    "Education",
    "Agriculture",
    "Healthcare",
    "Water Resources",
    "Environment",
    "Energy",
    "Urban Development",
    "Accessibility",
    "Public Administration",
    "Rural Livelihoods",
    "Disaster Management"
]

CLASSIFICATION_SYSTEM_PROMPT = """
You are the AI Problem Management & Classification Engine for 'Samadhan-Setu', a digital innovation platform by the Department of Higher & Technical Education, Government of Jharkhand (SIH 2026).

Analyze the user's submitted societal problem (which may be in English, Hindi, or Hinglish) and return a strict JSON object with these exact keys:
{
  "english_title": "Concise 1-line title in English",
  "english_summary": "2-sentence clear research & engineering summary of the problem",
  "domain_category": "One of: ['Education', 'Agriculture', 'Healthcare', 'Water Resources', 'Environment', 'Energy', 'Urban Development', 'Accessibility', 'Public Administration', 'Rural Livelihoods', 'Disaster Management']",
  "is_actionable_rnd": boolean (true if this problem requires technological, scientific, or institutional R&D innovation from universities; false if it is just a routine municipal grievance like road sweeping or broken street bulb),
  "is_disaster_emergency": boolean (true if this is a sudden flash flood, toxic mine gas leak, coal subsidence, dam breach, or life-threatening disaster),
  "severity_level": "One of: ['Low', 'Medium', 'High', 'Critical']",
  "ai_tags": ["list", "of", "3_to_5", "keywords"],
  "confidence_score": float (between 0.80 and 0.99)
}

Strictly output ONLY valid JSON without markdown formatting or backticks.
"""
