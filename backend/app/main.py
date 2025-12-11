from contextlib import asynccontextmanager
import time
import logging
import psutil
import socket
import random

from fastapi import FastAPI, Request, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Path

# Import local modules
from app.config import get_settings
from app.logic import engine
# Import all required Pydantic models
from app.schemas import (
    SearchResponse,
    SearchResultItem,
    PaperMetadata,
    HealthResponse,
    SystemResources
)

# Configure Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()
# ---------------------------------------------------------
# LIFESPAN MANAGER
# ---------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Handles startup and shutdown logic.
    1. Startup: Load the AI Model and Search Index into memory.
    2. Shutdown: Clean up resources.
    """
    logger.info("🚀 Starting Application...")
    logger.info(f"🌍 Environment: {settings.APP_ENV}")

    try:
        engine.initialize()
        logger.info("✅ AI Engine initialized successfully.")
    except Exception as e:
        logger.error(f"❌ Failed to initialize AI Engine: {e}")

    yield

    logger.info("🛑 Shutting down Application...")

# ---------------------------------------------------------
# APP INITIALIZATION
# ---------------------------------------------------------
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    lifespan=lifespan
)

# ---------------------------------------------------------
# MIDDLEWARE
# ---------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = (time.time() - start_time) * 1000

    logger.info(
        f"Path: {request.url.path} | Method: {request.method} | "
        f"Status: {response.status_code} | Time: {process_time:.2f}ms"
    )
    return response

# ---------------------------------------------------------
# HELPER FUNCTIONS
# ---------------------------------------------------------
def check_internet(host="8.8.8.8", port=53, timeout=1):
    """Simple check to see if we have internet access."""
    try:
        socket.setdefaulttimeout(timeout)
        socket.socket(socket.AF_INET, socket.SOCK_STREAM).connect((host, port))
        return True
    except Exception:
        return False

# ---------------------------------------------------------
# API ENDPOINTS
# ---------------------------------------------------------
@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "message": "Academic Paper Recommender API is Online",
        "version": settings.VERSION,
        "ai_status": "ready" if engine.is_ready else "loading_or_failed"
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Comprehensive System Health Check.
    Monitors AI readiness and Server Resources (CPU/RAM/Disk/Network).
    """
    # 1. Gather System Metrics
    cpu_usage = psutil.cpu_percent(interval=None)
    memory = psutil.virtual_memory()

    # Storage monitoring
    disk = psutil.disk_usage('.')

    # Network monitoring
    is_online = check_internet()

    # 2. Determine AI Status
    ai_status = "ready" if engine.is_ready else "loading_or_failed"

    # 3. Alert Logic
    alerts = []
    status = "healthy"

    if not engine.is_ready:
        status = "degraded"
        alerts.append("AI Engine is not ready.")

    if cpu_usage > 90:
        status = "critical"
        alerts.append("Critical CPU load detected (>90%)")

    if memory.percent > 90:
        status = "critical"
        alerts.append("Critical Memory usage detected (>90%)")

    if disk.free < (1024 * 1024 * 1024): # Less than 1GB free
        status = "degraded"
        alerts.append("Low Disk Space (<1GB)")

    # 4. Return Data
    return HealthResponse(
        status=status,
        version=settings.VERSION,
        ai_engine_status=ai_status,
        system=SystemResources(
            cpu_percent=cpu_usage,
            memory_percent=memory.percent,
            memory_total_gb=round(memory.total / (1024**3), 2),
            memory_available_gb=round(memory.available / (1024**3), 2),
            disk_percent=disk.percent,
            disk_free_gb=round(disk.free / (1024**3), 2),
            network_online=is_online
        ),
        alerts=alerts
    )

@app.get("/recommend", response_model=SearchResponse)
async def recommend_papers(
        q: str = Query(..., min_length=3, max_length=300, description="Search query"),
        limit: int = Query(5, ge=1, le=50, description="Results limit")
):
    """
    Semantic Search Endpoint.
    """
    # 1. Check AI Engine Status
    if not engine.is_ready:
        raise HTTPException(
            status_code=503,
            detail="AI Engine is still loading. Please try again in a few seconds."
        )

    try:
        # 2. Perform Search
        search_output = engine.search(q, top_k=limit)

        # 3. Format Response
        formatted_results = []

        for item in search_output['results']:
            paper_data = item['paper']
            score = item['score']

            confidence = int(score * 100)
            explanation = f"This paper is a {confidence}% semantic match to your query context."

            paper_model = PaperMetadata(
                arxiv_id=paper_data.get('arxiv_id', 'unknown'),
                title=paper_data.get('title', 'Untitled'),
                abstract=paper_data.get('abstract', ''),
                authors=paper_data.get('authors', []),
                published=paper_data.get('published', ''),
                url=paper_data.get('url', ''),
                categories=paper_data.get('categories', [])
            )

            formatted_results.append(SearchResultItem(
                paper=paper_model,
                score=score,
                explanation=explanation
            ))

        return SearchResponse(
            results=formatted_results,
            meta=search_output['meta']
        )

    except Exception as e:
        logger.error(f"Search failed: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error during search processing")

@app.get("/papers/{paper_id}", response_model=PaperMetadata)
async def get_paper_details(
        paper_id: str = Path(..., description="The arXiv ID of the paper")
):
    """
    Phase 3.1: Get full details for a specific paper.
    """
    if not engine.is_ready:
        raise HTTPException(status_code=503, detail="AI Engine loading")

    paper = engine.get_paper_by_id(paper_id)

    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")

    # MOCK METRICS (Phase 3.1 Requirement: "Add citation count")
    # In a real production app, this would come from Semantic Scholar API
    # We use hashing to make the random number consistent for the same paper
    random.seed(paper_id)
    citations = random.randint(0, 500)

    # We return the data matching PaperMetadata schema
    return PaperMetadata(
        arxiv_id=paper['arxiv_id'],
        title=paper['title'],
        abstract=paper['abstract'],
        authors=paper['authors'],
        published=paper['published'],
        url=paper['url'],
        categories=paper['categories']
        # Note: We aren't passing citations in the basic schema yet,
        # we will handle that in the Frontend UI enrichment to keep schemas simple.
    )