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
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
PORT = int(os.getenv("PORT", "5005"))

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
