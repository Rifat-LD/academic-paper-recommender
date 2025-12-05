from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi import HTTPException, Query, Depends
from app.schemas import SearchResponse, SearchResultItem, PaperMetadata
from app.schemas import HealthResponse, SystemResources
from fastapi.middleware.cors import CORSMiddleware
import time
import logging
import psutil

# Import our local modules
from app.config import get_settings
from app.logic import engine  # The SearchEngine singleton from Phase 1

# Configure Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()

# ---------------------------------------------------------
# LIFESPAN MANAGER (Phase 2.1.1 - AI Dependency Injection)
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

    # Initialize the Search Engine (Phase 1 Logic)
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
# MIDDLEWARE (Phase 2.1.1 - CORS & Logging)
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
# BASE ROUTES
# ---------------------------------------------------------
@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "message": "Academic Paper Recommender API is Online",
        "version": settings.VERSION,
        "ai_status": "ready" if engine.is_ready else "loading_or_failed"
    }

# ---------------------------------------------------------
# API ENDPOINTS
# ---------------------------------------------------------
@app.get("/recommend", response_model=SearchResponse)
async def recommend_papers(
        q: str = Query(..., min_length=3, max_length=300, description="Search query"),
        limit: int = Query(5, ge=1, le=50, description="Results limit")
):
    """
    Semantic Search Endpoint.
    1. Validates query.
    2. Runs vector search via the AI Engine.
    3. Returns ranked papers with explanations.
    """

    # 1. Check AI Engine Status
    if not engine.is_ready:
        raise HTTPException(
            status_code=503,
            detail="AI Engine is still loading. Please try again in a few seconds."
        )

    try:
        # 2. Perform Search (Phase 1 Logic)
        search_output = engine.search(q, top_k=limit)

        # 3. Format Response (Phase 2.1.2)
        formatted_results = []

        for item in search_output['results']:
            paper_data = item['paper']
            score = item['score']

            # Create a simple explanation based on score
            # (In a future phase, this could be generative text)
            confidence = int(score * 100)
            explanation = f"This paper is a {confidence}% semantic match to your query context."

            # Map raw dict to Pydantic Model
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

# ---------------------------------------------------------
# SYSTEM HEALTH (Phase 2.1.3)
# ---------------------------------------------------------
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Comprehensive System Health Check.
    Monitors AI readiness and Server Resources (CPU/RAM).
    """

    # 1. Gather System Metrics
    cpu_usage = psutil.cpu_percent(interval=None) # Non-blocking
    memory = psutil.virtual_memory()
    memory_gb = round(memory.available / (1024 ** 3), 2)

    # 2. Determine AI Status
    ai_status = "ready" if engine.is_ready else "loading_or_failed"

    # 3. Alerting Logic (Thresholds)
    alerts = []
    status = "healthy"

    # Critical Check: AI Engine failure
    if not engine.is_ready:
        status = "degraded" # API works, but Search won't
        alerts.append("AI Engine is not ready.")

    # Resource Checks
    if cpu_usage > 90:
        status = "critical"
        alerts.append("Critical CPU load detected (>90%)")
    elif cpu_usage > 70:
        status = "degraded" if status != "critical" else "critical"
        alerts.append("High CPU load detected (>70%)")

    if memory.percent > 90:
        status = "critical"
        alerts.append("Critical Memory usage detected (>90%)")
    elif memory.percent > 80:
        status = "degraded" if status != "critical" else "critical"
        alerts.append("High Memory usage detected (>80%)")

    return HealthResponse(
        status=status,
        version=settings.VERSION,
        ai_engine_status=ai_status,
        system=SystemResources(
            cpu_percent=cpu_usage,
            memory_percent=memory.percent,
            memory_available_gb=memory_gb
        ),
        alerts=alerts
    )