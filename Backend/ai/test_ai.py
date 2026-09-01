# ==========================================
# AI SERVICE - TEST VERIFICATION SCRIPT (PYTHON)
# File: Backend/ai/test_ai.py
# ==========================================

import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from services.categorization import classify_problem
from services.routing import recommend_universities
from services.deduplication import check_duplicate_problems

async def run_tests():
    print("==========================================")
    print("[TEST] Running Phase 2 AI Microservice Tests...")
    print("==========================================\n")
    
    # Test 1: Water Problem Classification
    print("[TEST 1] Classifying Water Contamination Issue in Ranchi...")
    res1 = await classify_problem(
        title="High fluoride and arsenic in drinking water well",
        description="Gramin log Kanke block me peene ke pani me arsenic se bimari ka samna kar rahe hain.",
        district="Ranchi",
        language="hi"
    )
    print(f"   Domain: {res1.get('domain_category')}")
    print(f"   Actionable R&D: {res1.get('is_actionable_rnd')}")
    print(f"   Severity: {res1.get('severity_level')}")
    print(f"   Emergency SOS: {res1.get('is_disaster_emergency')}")
    print(f"   AI Tags: {res1.get('ai_tags')}\n")
    assert res1.get("domain_category") == "Water Resources", "Expected domain to be Water Resources"
    assert res1.get("is_actionable_rnd") is True, "Expected is_actionable_rnd to be True"
    print("   [OK] Test 1 Passed!\n")

    # Test 2: Disaster Emergency Problem Classification
    print("[TEST 2] Classifying Disaster Emergency (Mine Subsidence / Toxic Gas in Dhanbad)...")
    res2 = await classify_problem(
        title="Sudden toxic gas leak and ground subsidence near Jharia coal mine",
        description="Emergency: Jharia basti me dhasan ho gayi hai aur poisonous gas leak ho raha hai.",
        district="Dhanbad",
        language="hi"
    )
    print(f"   Domain: {res2.get('domain_category')}")
    print(f"   Emergency SOS Flag: {res2.get('is_disaster_emergency')}")
    print(f"   Severity: {res2.get('severity_level')}\n")
    assert res2.get("is_disaster_emergency") is True, "Expected is_disaster_emergency to be True"
    print("   [OK] Test 2 Passed!\n")

    # Test 3: University Recommendation
    print("[TEST 3] Recommending HEIs for Mining Disaster in Dhanbad...")
    heis = recommend_universities(domain="Disaster Management", district="Dhanbad")
    for idx, hei in enumerate(heis, 1):
        print(f"   #{idx}: {hei['university_name']} (Match: {hei['match_score']}%) - {hei['matching_justification']}")
    assert len(heis) > 0, "Expected at least 1 HEI recommendation"
    assert "IIT (ISM) Dhanbad" in heis[0]["university_name"], "Expected IIT ISM Dhanbad to be top recommendation"
    print("   [OK] Test 3 Passed!\n")

    # Test 4: Deduplication Check
    print("[TEST 4] Deduplication Check (Nearby duplicate report)...")
    mock_existing = [{
        "id": "prob_101",
        "title": "High fluoride in drinking well",
        "description": "Arsenic and fluoride in local water.",
        "location": {"district": "Ranchi", "latitude": 23.3441, "longitude": 85.3096}
    }]
    dup_res = await check_duplicate_problems(
        title="Arsenic in well water",
        description="Arsenic and fluoride in local water.",
        district="Ranchi",
        latitude=23.3450,
        longitude=85.3100,
        candidate_problems=mock_existing
    )
    print(f"   Has Duplicate: {dup_res.get('has_duplicate')}")
    print(f"   Recommendation: {dup_res.get('recommendation')}\n")
    assert dup_res.get("has_duplicate") is True, "Expected duplicate to be detected"
    print("   [OK] Test 4 Passed!\n")

    print("[SUCCESS] All Phase 2 Python AI Microservice Tests Passed with 100% Success!")

if __name__ == "__main__":
    asyncio.run(run_tests())
