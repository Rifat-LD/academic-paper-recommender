import os
import shutil
from sentence_transformers import SentenceTransformer
import torch

# Configuration
MODEL_NAME = "all-MiniLM-L6-v2"
CACHE_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "models_cache")

class ModelManager:
    def __init__(self):
        self.model = None
        self.model_name = MODEL_NAME

    def load_model(self):
        """
        Phase 3.1: Model loading, caching, and validation.
        """
        print(f"🧠 AI Core: Initializing Model Manager for {self.model_name}...")

        # Ensure cache directory exists
        os.makedirs(CACHE_DIR, exist_ok=True)

        try:
            # 1. Loading & Caching (Handled by sentence_transformers, but we explicitly set path)
            print(f"   ↳ Checking cache at {CACHE_DIR}...")
            self.model = SentenceTransformer(self.model_name, cache_folder=CACHE_DIR)

            # 2. Validation Check (Phase 3.1)
            print("   ↳ Running validation check (Sanity Test)...")
            test_vector = self.model.encode("Academic Paper Recommender")
            if test_vector.shape[0] != 384: # Expected dimension for MiniLM
                raise ValueError(f"Model output dimension mismatch. Expected 384, got {test_vector.shape[0]}")

            print("✅ Model loaded and validated successfully.")
            return self.model

        except Exception as e:
            print(f"❌ Model Loading Failed: {e}")
            return self.fallback_mechanism()

    def fallback_mechanism(self):
        """
        Phase 3.1: Build fallback mechanism for corrupted models
        """
        print("⚠️ Initiating Fallback Mechanism...")
        try:
            # Delete corrupted cache if it exists
            model_path = os.path.join(CACHE_DIR, f"sentence-transformers_{self.model_name}")
            if os.path.exists(model_path):
                print("   ↳ Removing potential corrupted cache files...")
                shutil.rmtree(model_path)

            print("   ↳ Retrying download...")
            self.model = SentenceTransformer(self.model_name, cache_folder=CACHE_DIR)
            return self.model
        except Exception as e:
            print(f"💀 Critical Failure: Fallback failed. {e}")
            raise RuntimeError("Could not load AI model even after fallback.")