import os
import json
import time
import numpy as np
from app.ai_core import ModelManager
from app.text_utils import normalize_text

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data", "processed")
METADATA_PATH = os.path.join(DATA_DIR, "metadata.json")
EMBEDDINGS_PATH = os.path.join(DATA_DIR, "embeddings.npy")

class SearchEngine:
    def __init__(self):
        self.model = None
        self.papers = []
        self.embeddings = None
        self.is_ready = False
        self.model_manager = ModelManager()

    def initialize(self):
        """Loads model and data."""
        if self.is_ready:
            return

        print("⏳ Search Engine: Loading Resources...")

        # 1. Load Model (Phase 3.1)
        self.model = self.model_manager.load_model()

        # 2. Load Data
        if not os.path.exists(METADATA_PATH) or not os.path.exists(EMBEDDINGS_PATH):
            raise FileNotFoundError("Processed data not found.")

        with open(METADATA_PATH, 'r', encoding='utf-8') as f:
            self.papers = json.load(f)

        self.embeddings = np.load(EMBEDDINGS_PATH)
        self.is_ready = True
        print(f"✅ Search Engine Online. Index Size: {len(self.papers)}")

    def search(self, raw_query: str, top_k: int = 5):
        """
        Phase 3.3: Vector Search Implementation
        """
        if not self.is_ready:
            self.initialize()

        # Phase 3.3: Benchmarking System (Start Timer)
        start_time = time.perf_counter()

        # Phase 3.3: Query Preprocessing
        clean_query = normalize_text(raw_query)

        # Encode Query
        query_vector = self.model.encode([clean_query])[0]

        # Phase 3.3: Relevance Scoring (Cosine Similarity)
        # Note: embeddings are normalized by SentenceTransformer, so dot product == cosine sim
        scores = np.dot(self.embeddings, query_vector)

        # Sort and get indices
        top_indices = np.argsort(scores)[-top_k:][::-1]

        results = []
        for idx in top_indices:
            results.append({
                "paper": self.papers[idx],
                "score": float(scores[idx])
            })

        # Benchmarking (End Timer)
        duration_ms = (time.perf_counter() - start_time) * 1000

        return {
            "results": results,
            "meta": {
                "query_processed": clean_query,
                "latency_ms": round(duration_ms, 2),
                "items_scanned": len(self.papers)
            }
        }

# Global Instance
engine = SearchEngine()