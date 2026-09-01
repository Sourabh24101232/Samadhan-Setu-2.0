# ==========================================
# AI SERVICE - SMART UNIVERSITY ROUTING (PYTHON)
# File: Backend/ai/services/routing.py
# ==========================================

"""
PURPOSE:
- Matches validated problem domain, district, and tags with the best-suited Jharkhand Universities and HEI departments.

FUNCTIONS TO IMPLEMENT LATER:

1. def recommend_universities(domain: str, district: str, tags: list) -> list:
   - Institutional Matrix for Jharkhand:
     * Agriculture / Soil / Rural -> Birsa Agricultural University (BAU), Ranchi
     * Water Purification / IoT / Engineering -> BIT Mesra, Ranchi & NIT Jamshedpur
     * Mining / Geo-Disaster / Subsidence -> IIT (ISM) Dhanbad
     * Healthcare / Epidemic -> AIIMS Deoghar & RIMS Ranchi
     * Renewable Energy / Environmental -> Central University of Jharkhand (CUJ)
   - Score candidates based on domain match (60%), geographical proximity (30%), and available incubation facilities (10%).
   - Return ranked recommendations with matching justifications.
"""
