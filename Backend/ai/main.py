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
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Samadhan-Setu AI Engine",
    description="AI Intelligence Microservice for Thematic Domain Classification, R&D Filtering, Disaster SOS, and University Routing",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "service": "Samadhan-Setu AI Microservice",
        "status": "online",
        "port": int(os.getenv("PORT", 5005))
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 5005))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
