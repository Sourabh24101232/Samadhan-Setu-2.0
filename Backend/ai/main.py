# ==========================================
# AI SERVICE - FASTAPI ENTRY POINT (PYTHON)
# File: Backend/ai/main.py
# ==========================================

"""
PURPOSE:
- Entry point to run the Python AI Microservice on Port 5005 using Uvicorn.

WHAT TO IMPLEMENT LATER:
1. Initialize FastAPI application with title "Samadhan-Setu AI Intelligence Service".
2. Add CORS middleware (allowing Next.js frontend port 3000 and Node.js microservices).
3. Include router from `routers.ai_routes`.
4. Run server on port 5005: `uvicorn main:app --host 0.0.0.0 --port 5005 --reload`.
"""

import os
import sys

# Ensure local imports work correctly regardless of current working directory
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from config import PORT
from routers.ai_routes import router as ai_router

load_dotenv()

app = FastAPI(
    title="Samadhan-Setu AI Problem Intelligence Engine",
    description="AI Microservice for Automated Classification, R&D Filtering, Disaster SOS Detection, and Smart University Routing in Jharkhand",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for Frontend (port 3000) and Backend Microservices (5001-5004)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount AI API Routes
app.include_router(ai_router)

@app.get("/")
def root():
    return {
        "service": "Samadhan-Setu AI Intelligence Engine",
        "status": "online",
        "port": PORT,
        "docs": f"http://localhost:{PORT}/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=PORT, reload=True)
