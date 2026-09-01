# ==========================================
# AI SERVICE - CATEGORIZATION SERVICE (PYTHON / GEMINI)
# File: Backend/ai/services/categorization.py
# ==========================================

"""
PURPOSE:
- Core service using Google Gemini 1.5 Flash to categorize citizen challenges, evaluate R&D actionability, detect disaster emergencies, and extract tags.

FUNCTIONS TO IMPLEMENT LATER:

1. async def classify_problem(title: str, description: str, district: str, language: str = "hi") -> dict:
   - Construct prompt for Gemini 1.5 Flash:
     * Translate/understand Hindi, Hinglish, or English description.
     * Classify into 1 of the 11 domains.
     * Boolean `is_actionable_rnd`: True for technological/societal engineering problems, False for routine municipal maintenance (garbage, potholes).
     * Boolean `is_disaster_emergency`: True if immediate life-threatening situation (flash flood, dam breach, toxic mine gas, building collapse).
     * Severity: 'Low' | 'Medium' | 'High' | 'Critical'.
     * Extract 3-5 keywords / ai_tags.
     * 1-sentence English research summary.
   - Return structured dict response matching the Pydantic schema.
"""
