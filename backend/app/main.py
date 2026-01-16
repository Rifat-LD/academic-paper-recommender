from contextlib import asynccontextmanager
import time
import logging
import psutil
import socket
import random

from fastapi import FastAPI, Request, HTTPException, Query, Path, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Path
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlmodel import Session, select
from jose import jwt, JWTError

# Import local modules
from app.config import get_settings
from app.logic import engine
from app.database import create_db_and_tables, get_session
from app.models import User
from app.auth import get_password_hash, verify_password, create_access_token, settings

from sqlmodel import Session, select
# Import all required Pydantic models
from app.schemas import (
    SearchResponse,
    SearchResultItem,
    PaperMetadata,
    HealthResponse,
    SystemResources,
    UserCreate, UserLogin, Token, UserRead, UserQuestionReq, UserQuestionRes, UserResetReq
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
    # 1. Initialize Database
    create_db_and_tables()
    logger.info("📂 Database tables created.")
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

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# Middleware / Dependency to protect routes
async def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    """
    Decodes the token and retrieves the user.
    Acts as MIDDLEWARE for protected routes.
    """
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    statement = select(User).where(User.username == username)
    user = session.exec(statement).first()
    if user is None:
        raise credentials_exception
    return user

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

# --- AUTH ENDPOINTS ---
@app.post("/auth/register")
async def register_user(user_data: UserCreate, session: Session = Depends(get_session)):
    # 1. TRIM WHITESPACE (Crucial fix for "Invalid Password" issues)
    clean_username = user_data.username.strip()

    # 2. CHECK DUPLICATES EXPLICITLY
    statement = select(User).where(User.username == clean_username)
    existing_user = session.exec(statement).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    # 3. HASH EVERYTHING
    hashed_pwd = get_password_hash(user_data.password)
    # We strip the answer too so "Fluffy " matches "Fluffy"
    hashed_answer = get_password_hash(user_data.security_answer.strip())

    # 4. SAVE
    new_user = User(
        username=clean_username,
        hashed_password=hashed_pwd,
        security_question=user_data.security_question,
        security_answer_hash=hashed_answer
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return {"message": "User created successfully", "username": new_user.username}

@app.post("/auth/login", response_model=Token)
async def login_for_access_token(
        form_data: OAuth2PasswordRequestForm = Depends(), # <--- Changed this line
        session: Session = Depends(get_session)
):
    """
    Authenticates a user and returns a JWT Access Token.
    Accepts OAuth2 Form Data (username, password).
    """
    # 1. Find User
    statement = select(User).where(User.username == form_data.username)
    user = session.exec(statement).first()

    # 2. Check Password
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 3. Generate Token
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=UserRead)
async def read_users_me(current_user: User = Depends(get_current_user)):
    """
    Returns the current user's profile.
    REQUIRES AUTHENTICATION.
    """
    return current_user

# ---------------------------------------------------------
# RECOVERY ENDPOINTS
# ---------------------------------------------------------

@app.post("/auth/get-question", response_model=UserQuestionRes)
async def get_security_question(req: UserQuestionReq, session: Session = Depends(get_session)):
    """
    Step 1: Check if user exists and return their security question.
    """
    statement = select(User).where(User.username == req.username)
    user = session.exec(statement).first()

    if not user:
        # Security: In a web app, we might hide this.
        # For a local app, explicit error is better UX.
        raise HTTPException(status_code=404, detail="User not found")

    return {"username": user.username, "security_question": user.security_question}

@app.post("/auth/reset-password")
async def reset_password(req: UserResetReq, session: Session = Depends(get_session)):
    """
    Step 2: Verify security answer and update password.
    """
    statement = select(User).where(User.username == req.username)
    user = session.exec(statement).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Verify Answer (Compare Hash)
    if not verify_password(req.security_answer, user.security_answer_hash):
        raise HTTPException(status_code=400, detail="Incorrect security answer")

    # Update Password
    user.hashed_password = get_password_hash(req.new_password)
    session.add(user)
    session.commit()

    return {"message": "Password updated successfully"}

# --- SEARCH ENDPOINTS (Protected) ---

@app.get("/recommend", response_model=SearchResponse)
async def recommend_papers(
        q: str = Query(..., min_length=3, max_length=300, description="Search query"),
        limit: int = Query(5, ge=1, le=50, description="Results limit"),
        current_user: User = Depends(get_current_user)
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
        paper_id: str = Path(..., description="The arXiv ID of the paper"),
        current_user: User = Depends(get_current_user)
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