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

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/api/ai", tags=["AI Problem Intelligence"])

# Pydantic Request Models
class ClassifyRequest(BaseModel):
    title: str
    description: str
    district: str
    language: Optional[str] = "hi"

class RoutingRequest(BaseModel):
    domain: str
    district: str
    tags: Optional[List[str]] = []

class DuplicateCheckRequest(BaseModel):
    title: str
    description: str
    district: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None

# Routes will be implemented in Phase 2
