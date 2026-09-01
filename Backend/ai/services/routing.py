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

JHARKHAND_HEI_DATABASE = [
    {
        "id": "hei_bit_mesra",
        "name": "BIT Mesra, Ranchi",
        "primary_domains": ["Water Resources", "Energy", "Urban Development", "Accessibility", "Environment"],
        "departments": ["Civil & Environmental Engineering", "Computer Science & IoT Lab", "Remote Sensing Centre"],
        "hub_district": "Ranchi",
        "proximity_districts": ["Ranchi", "Ramgarh", "Bokaro", "Hazaribagh", "Khunti", "Lohardaga"],
        "incubation_center": "BIT-TBI / Atal Incubation Centre"
    },
    {
        "id": "hei_iit_ism",
        "name": "IIT (ISM) Dhanbad",
        "primary_domains": ["Disaster Management", "Energy", "Environment", "Water Resources"],
        "departments": ["Centre of Mining Environment", "Applied Geophysics & Subsidence Lab", "Environmental Engineering"],
        "hub_district": "Dhanbad",
        "proximity_districts": ["Dhanbad", "Bokaro", "Giridih", "Jamtara", "Deoghar", "Ramgarh"],
        "incubation_center": "IIT ISM ACIC Innovation Hub"
    },
    {
        "id": "hei_bau_ranchi",
        "name": "Birsa Agricultural University (BAU), Ranchi",
        "primary_domains": ["Agriculture", "Rural Livelihoods", "Water Resources", "Environment"],
        "departments": ["Dept of Soil Science & Agricultural Chemistry", "Agricultural Engineering", "Forestry & Livelihoods"],
        "hub_district": "Ranchi",
        "proximity_districts": ["Ranchi", "Gumla", "Simdega", "Khunti", "Palamu", "Garhwa", "Latehar"],
        "incubation_center": "BAU Agri-Business Incubation Centre"
    },
    {
        "id": "hei_nit_jsr",
        "name": "NIT Jamshedpur",
        "primary_domains": ["Energy", "Urban Development", "Water Resources", "Public Administration"],
        "departments": ["Electrical & Renewable Energy", "Manufacturing & Hardware Prototyping", "Civil Infrastructure"],
        "hub_district": "East Singhbhum",
        "proximity_districts": ["East Singhbhum", "West Singhbhum", "Seraikela Kharsawan", "Ranchi"],
        "incubation_center": "NIT JSR Innovation & Startup Centre"
    },
    {
        "id": "hei_aiims_deoghar",
        "name": "AIIMS Deoghar & RIMS Ranchi",
        "primary_domains": ["Healthcare", "Disaster Management", "Rural Livelihoods"],
        "departments": ["Dept of Community Medicine", "Telemedicine & Rural Diagnostics Unit", "Biochemistry"],
        "hub_district": "Deoghar",
        "proximity_districts": ["Deoghar", "Dumka", "Godda", "Sahibganj", "Pakur", "Jamtara", "Ranchi"],
        "incubation_center": "HealthTech Innovation Cell"
    },
    {
        "id": "hei_cuj_ranchi",
        "name": "Central University of Jharkhand (CUJ), Ranchi",
        "primary_domains": ["Energy", "Environment", "Rural Livelihoods", "Education"],
        "departments": ["Centre for Energy Engineering", "Dept of Tribal Studies & Development", "Environmental Sciences"],
        "hub_district": "Ranchi",
        "proximity_districts": ["Ranchi", "Latehar", "Lohardaga", "Chatra", "Gumla"],
        "incubation_center": "CUJ Rural Innovation Hub"
    }
]

def recommend_universities(domain: str, district: str, tags: list = None) -> list:
    """Ranks and recommends Jharkhand Higher Education Institutions for a problem statement."""
    scored_heis = []
    
    for hei in JHARKHAND_HEI_DATABASE:
        score = 40  # Base institutional research capability
        reasons = []
        
        # 1. Domain alignment score (up to +40 pts)
        if domain in hei["primary_domains"]:
            score += 40
            reasons.append(f"Strong research expertise in {domain}")
        else:
            score += 10
            
        # 2. Geographical proximity score (up to +20 pts)
        if district.lower() == hei["hub_district"].lower():
            score += 20
            reasons.append(f"Located in the same district ({district}) for rapid field pilot")
        elif any(district.lower() == d.lower() for d in hei["proximity_districts"]):
            score += 12
            reasons.append(f"Regional proximity to {district}")
            
        scored_heis.append({
            "hei_id": hei["id"],
            "university_name": hei["name"],
            "match_score": min(score, 99),
            "relevant_departments": hei["departments"],
            "incubation_facility": hei["incubation_center"],
            "matching_justification": "; ".join(reasons) if reasons else f"Multidisciplinary innovation capability for {domain}"
        })
        
    # Sort descending by match score
    scored_heis.sort(key=lambda x: x["match_score"], reverse=True)
    return scored_heis[:3]
