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

import json
import re
import warnings

# Suppress deprecation warning for clean terminal logs
warnings.filterwarnings("ignore", category=FutureWarning)

import google.generativeai as genai
from config import GEMINI_API_KEY, CLASSIFICATION_SYSTEM_PROMPT, THEMATIC_DOMAINS

def _fallback_classification(title: str, description: str, district: str) -> dict:
    """Intelligent rule-based fallback when Gemini API key is not configured."""
    text = (title + " " + description).lower()
    
    def match_any(keywords):
        return any(re.search(r'\b' + re.escape(w) + r'\b', text, re.IGNORECASE) if ' ' not in w else w in text for w in keywords)

    # 1. Disaster Emergency Check
    is_disaster = match_any(["flood", "subsidence", "landslide", "collapse", "toxic gas", "gas leak", "mine fire", "dam breach", "aag", "baadh", "dhasan", "fissure", "blowout"])

    # 2. Domain Classification
    domain = "Water Resources"
    if match_any(["health", "swasthya", "hospital", "disease", "bimari", "doctor", "medicine", "malnutrition", "epidemic", "anemia", "sickle cell", "hemoglobin", "blood", "maternal", "screening"]):
        domain = "Healthcare"
    elif match_any(["mine", "mining", "coal", "blast", "subsidence", "disaster", "flood", "earthquake", "hazard", "gas leak", "mine fire", "colliery"]):
        domain = "Disaster Management"
    elif match_any(["solar", "electricity", "bijli", "energy", "power", "grid", "urja", "battery", "pv", "photovoltaic", "microgrid", "micro-grid"]):
        domain = "Energy"
    elif match_any(["agri", "agriculture", "farmer", "kisan", "crop", "fasal", "soil", "mitti", "irrigation", "drought", "sukha", "pesticide", "paddy", "grain", "spoilage", "aflatoxin"]):
        domain = "Agriculture"
    elif match_any(["water", "pani", "arsenic", "fluoride", "borewell", "contamination", "filter", "jal", "peene ka pani", "drinking water"]):
        domain = "Water Resources"
    elif match_any(["forest", "pollution", "plastic", "waste", "river", "environment", "pradushan", "jungle", "toxic waste", "dumping"]):
        domain = "Environment"
    elif match_any(["livelihood", "tribal", "employment", "rojgar", "artisan", "handicraft", "gramin", "pashupalan", "shg", "mahila samiti", "de-husker"]):
        domain = "Rural Livelihoods"
    elif match_any(["school", "college", "education", "student", "shiksha", "vidyalaya", "digital literacy", "dropout", "classroom"]):
        domain = "Education"
    elif match_any(["traffic", "drainage", "sewage", "urban", "smart city", "waste management", "kachra", "bulb", "street light", "pothole", "streetlight"]):
        domain = "Urban Development"
    elif match_any(["disabled", "wheelchair", "divyang", "accessibility", "blind", "braille", "deaf"]):
        domain = "Accessibility"
    elif match_any(["panchayat", "scheme", "ration", "yojana", "certificate", "governance", "corruption", "whistleblower"]):
        domain = "Public Administration"

    # 3. Actionability & Severity
    is_rnd = not match_any(["sweeping", "bulb", "street light", "streetlight", "pothole", "dustbin", "meter reading", "kachra safai", "garbage bin"])
    severity = "Critical" if is_disaster else ("High" if match_any(["poison", "death", "severe", "arsenic", "crisis", "anemia", "fluoride", "epidemic", "blowout"]) else "Medium")
    
    tags = [domain.lower().replace(" ", "-"), district.lower(), "jharkhand-societal-challenge"]
    
    return {
        "english_title": title if title else f"{domain} challenge in {district}",
        "english_summary": f"Societal challenge in {district}, Jharkhand regarding {domain.lower()}. Requires innovation and multidisciplinary research proposal.",
        "domain_category": domain,
        "is_actionable_rnd": is_rnd,
        "is_disaster_emergency": is_disaster,
        "severity_level": severity,
        "ai_tags": tags,
        "confidence_score": 0.88
    }

async def classify_problem(title: str, description: str, district: str, language: str = "hi") -> dict:
    """Classifies a submitted problem using Google Gemini 1.5 Flash or intelligent fallback."""
    if not GEMINI_API_KEY or GEMINI_API_KEY == "your_gemini_api_key_here":
        return _fallback_classification(title, description, district)
    
    try:
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            system_instruction=CLASSIFICATION_SYSTEM_PROMPT
        )
        
        user_prompt = f"""
        Problem Title: {title}
        Problem Description: {description}
        District Location: {district}, Jharkhand
        Reported Language: {language}
        """
        
        response = model.generate_content(user_prompt)
        raw_text = response.text.strip()
        
        # Clean markdown codeblocks if Gemini returned ```json ... ```
        if raw_text.startswith("```"):
            raw_text = re.sub(r"^```(?:json)?\n?", "", raw_text)
            raw_text = re.sub(r"\n?```$", "", raw_text)
            
        data = json.loads(raw_text)
        
        # Validate domain against allowed domains
        if data.get("domain_category") not in THEMATIC_DOMAINS:
            data["domain_category"] = "Water Resources"
            
        return data
    except Exception as e:
        print(f"[!] Gemini classification API call failed: {e}. Falling back to rule engine.")
        return _fallback_classification(title, description, district)
