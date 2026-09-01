# ==========================================
# AI SERVICE - GEOLOCATION & SEMANTIC DEDUPLICATION (PYTHON)
# File: Backend/ai/services/deduplication.py
# ==========================================

"""
PURPOSE:
- Detects duplicate problems submitted within the same geographic radius to prevent redundant research and promote community upvoting.

FUNCTIONS TO IMPLEMENT LATER:

1. def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
   - Calculates distance in kilometers between two GPS coordinates using the Haversine formula.

2. async def check_duplicate_problems(title: str, description: str, district: str, lat: float = None, lon: float = None) -> dict:
   - Query existing active problems in the same district.
   - Filter candidates within a 10km radius (if coordinates provided).
   - Compute text similarity using Gemini prompt or cosine similarity over embeddings.
   - If similarity > 75%, return `{ "is_duplicate": True, "matched_problem_id": "...", "similarity_score": 0.88 }`.
"""

import math
import re

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates great-circle distance between two GPS coordinates in kilometers."""
    if lat1 is None or lon1 is None or lat2 is None or lon2 is None:
        return 999.0
    
    R = 6371.0  # Earth's radius in km
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)
    
    a = (math.sin(d_lat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(d_lon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)

def _text_similarity(t1: str, t2: str) -> float:
    """Calculates word-overlap similarity (Jaccard coefficient) between two problem texts."""
    words1 = set(re.findall(r'\w+', (t1 or '').lower()))
    words2 = set(re.findall(r'\w+', (t2 or '').lower()))
    
    # Remove common stop words
    stopwords = {"in", "the", "a", "an", "and", "or", "to", "is", "of", "for", "on", "at", "me", "ka", "ki", "ke", "hai", "se"}
    words1 -= stopwords
    words2 -= stopwords
    
    if not words1 or not words2:
        return 0.0
    
    intersection = words1.intersection(words2)
    union = words1.union(words2)
    return round(len(intersection) / len(union), 2)

async def check_duplicate_problems(
    title: str,
    description: str,
    district: str,
    latitude: float = None,
    longitude: float = None,
    candidate_problems: list = None
) -> dict:
    """
    Checks if an incoming problem has an existing duplicate within 10km in the same district.
    """
    if not candidate_problems:
        return {
            "has_duplicate": False,
            "matched_problem_id": None,
            "similarity_score": 0.0,
            "distance_km": None,
            "recommendation": "Unique challenge. Proceed with new registration."
        }
        
    best_match = None
    highest_sim = 0.0
    min_dist = None
    
    for candidate in candidate_problems:
        # Check district match
        c_district = candidate.get("location", {}).get("district", "")
        if c_district.lower() != district.lower():
            continue
            
        c_title = candidate.get("title", "")
        c_desc = candidate.get("description", "")
        c_lat = candidate.get("location", {}).get("latitude")
        c_lon = candidate.get("location", {}).get("longitude")
        
        sim = _text_similarity(title + " " + description, c_title + " " + c_desc)
        dist = haversine_distance(latitude, longitude, c_lat, c_lon) if (latitude and c_lat) else None
        
        # Flag as duplicate if high text similarity or (moderate similarity within 10km)
        is_dup = (sim >= 0.70) or (dist is not None and dist <= 10.0 and sim >= 0.45)
        
        if is_dup and sim > highest_sim:
            highest_sim = sim
            min_dist = dist
            best_match = candidate.get("_id") or candidate.get("id")
            
    if best_match:
        return {
            "has_duplicate": True,
            "matched_problem_id": str(best_match),
            "similarity_score": highest_sim,
            "distance_km": min_dist,
            "recommendation": f"A similar problem was already reported nearby ({min_dist}km away, {int(highest_sim*100)}% match). Consider upvoting the existing issue."
        }
        
    return {
        "has_duplicate": False,
        "matched_problem_id": None,
        "similarity_score": highest_sim,
        "distance_km": None,
        "recommendation": "Unique challenge. Proceed with new registration."
    }
