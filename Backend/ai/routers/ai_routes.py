# ==========================================
# AI SERVICE - FASTAPI ROUTERS (PYTHON)
# File: Backend/ai/routers/ai_routes.py
# ==========================================

"""
PURPOSE:
- Defines FastAPI HTTP endpoints for the AI Microservice.

ENDPOINTS TO CONFIGURE:
- POST /api/ai/classify            -> Calls categorization.classify_problem
- POST /api/ai/recommend-universities -> Calls routing.recommend_universities
- POST /api/ai/check-duplicates    -> Calls deduplication.check_duplicate_problems
- GET  /api/ai/health              -> Health check endpoint
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

from services.categorization import classify_problem
from services.routing import recommend_universities
from services.deduplication import check_duplicate_problems

router = APIRouter(prefix="/api/ai", tags=["AI Problem Intelligence"])

# --- Pydantic Request Models ---

class ClassifyRequest(BaseModel):
    title: str = Field(..., example="Arsenic contamination in drinking well water")
    description: str = Field(..., example="Villagers in Kanke block are facing skin lesions due to high arsenic levels in local boring wells.")
    district: str = Field(..., example="Ranchi")
    language: Optional[str] = Field("hi", example="hi")

class RoutingRequest(BaseModel):
    domain: str = Field(..., example="Water Resources")
    district: str = Field(..., example="Ranchi")
    tags: Optional[List[str]] = Field(default=[], example=["water-filtration", "arsenic", "rural-iot"])

class DuplicateCheckRequest(BaseModel):
    title: str = Field(..., example="Arsenic in well water")
    description: str = Field(..., example="High arsenic in village drinking water.")
    district: str = Field(..., example="Ranchi")
    latitude: Optional[float] = Field(None, example=23.3441)
    longitude: Optional[float] = Field(None, example=85.3096)
    candidate_problems: Optional[List[Dict[str, Any]]] = Field(default=[])

# --- Endpoints ---

@router.get("/health")
def health_check():
    """Health check endpoint to verify AI microservice is active."""
    return {
        "status": "healthy",
        "service": "Samadhan-Setu AI Intelligence Engine",
        "version": "1.0.0"
    }

@router.post("/classify")
async def api_classify_problem(req: ClassifyRequest):
    """
    Classifies a citizen problem report:
    - Auto-categorizes into 1 of 11 domains
    - Checks if problem is actionable R&D innovation (vs routine municipal complaint)
    - Detects life-threatening Disaster Emergencies (SOS)
    - Determines severity level and generates AI tags
    """
    try:
        result = await classify_problem(
            title=req.title,
            description=req.description,
            district=req.district,
            language=req.language or "hi"
        )
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Classification failed: {str(e)}")

@router.post("/recommend-universities")
def api_recommend_universities(req: RoutingRequest):
    """
    Recommends top Jharkhand Universities/HEIs based on:
    - Domain specialization & lab facilities
    - Geographic district proximity
    """
    try:
        recommendations = recommend_universities(
            domain=req.domain,
            district=req.district,
            tags=req.tags or []
        )
        return {"success": True, "domain": req.domain, "district": req.district, "data": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Routing recommendation failed: {str(e)}")

@router.post("/check-duplicates")
async def api_check_duplicates(req: DuplicateCheckRequest):
    """
    Checks if a problem is a duplicate of an existing issue in the same district/radius.
    """
    try:
        result = await check_duplicate_problems(
            title=req.title,
            description=req.description,
            district=req.district,
            latitude=req.latitude,
            longitude=req.longitude,
            candidate_problems=req.candidate_problems or []
        )
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Deduplication check failed: {str(e)}")
