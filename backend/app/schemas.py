from pydantic import BaseModel, Field, field_validator
from typing import List, Optional

# ---------------------------------------------------------
# REQUEST MODELS
# ---------------------------------------------------------
class SearchQuery(BaseModel):
    """
    Defines the structure for the search query parameters.
    """
    q: str = Field(
        ...,
        min_length=3,
        max_length=300,
        description="The natural language search query",
        examples=["machine learning for climate change"]
    )
    limit: int = Field(
        5,
        ge=1,
        le=50,
        description="Number of results to return"
    )

    @field_validator('q')
    @classmethod
    def validate_query_content(cls, v: str) -> str:
        """Phase 2.1.2: Edge case validation (Empty or whitespace only)"""
        if not v.strip():
            raise ValueError("Query cannot be empty or whitespace only")
        return v.strip()

# ---------------------------------------------------------
# RESPONSE MODELS
# ---------------------------------------------------------
class PaperMetadata(BaseModel):
    """Represents a single academic paper."""
    id: str = Field(..., alias="arxiv_id") # Map arxiv_id to id
    title: str
    abstract: str
    authors: List[str]
    published: str
    url: str
    categories: List[str]

class SearchResultItem(BaseModel):
    """A single paper result with its relevance score."""
    paper: PaperMetadata
    score: float
    explanation: str  # Phase 2.1.2: Explanation field

class SearchResponse(BaseModel):
    """The final JSON structure returned to the frontend."""
    results: List[SearchResultItem]
    meta: dict

# ---------------------------------------------------------
# HEALTH MONITORING MODELS
# ---------------------------------------------------------
class SystemResources(BaseModel):
    cpu_percent: float
    memory_percent: float
    memory_available_gb: float

class HealthResponse(BaseModel):
    status: str            # "healthy", "degraded", "critical"
    version: str
    ai_engine_status: str  # "ready", "loading", "failed"
    system: SystemResources
    alerts: List[str] = [] # List of warning messages