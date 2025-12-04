import json
import os
import numpy as np
from sentence_transformers import SentenceTransformer
import time

# Configuration
# Get the directory where THIS script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# Navigate relative to the script: Up one folder (..), then into data
RAW_DATA_PATH = os.path.join(SCRIPT_DIR, "../data/raw/papers_1k.json")
PROCESSED_DIR = os.path.join(SCRIPT_DIR, "../data/processed")

MODEL_NAME = "all-MiniLM-L6-v2" # Small, fast, CPU-friendly model

def generate_embeddings():
    print("🧠 Loading AI Model (This may take a moment)...")
    model = SentenceTransformer(MODEL_NAME)

    # Load Raw Data
    with open(RAW_DATA_PATH, 'r', encoding='utf-8') as f:
        papers = json.load(f)

    print(f"📄 Processing {len(papers)} papers...")

    # Prepare text for embedding (Title + Abstract gives best context)
    sentences = [f"{p['title']}. {p['abstract']}" for p in papers]

    # Generate Embeddings (Batch process)
    print("⚡ Generating vectors (CPU Mode)...")
    start_time = time.time()
    embeddings = model.encode(sentences, show_progress_bar=True)
    end_time = time.time()

    print(f"✅ Embedded {len(papers)} papers in {end_time - start_time:.2f} seconds.")

    # Save Data for the App
    os.makedirs(PROCESSED_DIR, exist_ok=True)

    # 1. Save the Vectors (Numpy format for fast loading)
    np.save(os.path.join(PROCESSED_DIR, "embeddings.npy"), embeddings)

    # 2. Save the Metadata (ID mapping)
    with open(os.path.join(PROCESSED_DIR, "metadata.json"), "w", encoding="utf-8") as f:
        json.dump(papers, f)

    print(f"💾 Saved index to {PROCESSED_DIR}")

if __name__ == "__main__":
    generate_embeddings()