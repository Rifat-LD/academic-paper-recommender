import arxiv
import json
import os
import time
from datetime import datetime

# ---------------------------------------------------------
# CONFIGURATION
# ---------------------------------------------------------
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# Note: Using 'raw' folder for initial downloads
DATA_DIR = os.path.join(SCRIPT_DIR, "../data/raw")
OUTPUT_FILE = os.path.join(DATA_DIR, "papers_1k.json")
VERSION_FILE = os.path.join(DATA_DIR, "dataset_version.json")

# Filter: CS Papers (AI, Computation & Language, Computer Vision)
SEARCH_QUERY = "cat:cs.AI OR cat:cs.CL OR cat:cs.CV"
TARGET_COUNT = 1000

def load_existing_progress():
    """Phase 2.1: Download resumption capability"""
    if os.path.exists(OUTPUT_FILE):
        try:
            with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return data
        except json.JSONDecodeError:
            print("⚠️ Corrupted existing file found. Starting fresh.")
            return []
    return []

def save_version_info(count):
    """Phase 2.1: Dataset version tracking system"""
    info = {
        "version": "1.0",
        "last_updated": datetime.now().isoformat(),
        "paper_count": count,
        "source": "arXiv API",
        "filters": ["cs.AI", "cs.CL", "cs.CV"]
    }
    with open(VERSION_FILE, 'w', encoding='utf-8') as f:
        json.dump(info, f, indent=2)
    print(f"📋 Version info saved to {VERSION_FILE}")

def main():
    print(f"🚀 Starting Robust Data Pipeline...")
    os.makedirs(DATA_DIR, exist_ok=True)

    # 1. Resumption Logic
    existing_papers = load_existing_progress()
    current_count = len(existing_papers)
    print(f"📊 Found {current_count}/{TARGET_COUNT} existing papers.")

    if current_count >= TARGET_COUNT:
        print("✅ Target reached. No new download needed.")
        return

    # 2. API Setup
    client = arxiv.Client(
        page_size=100,
        delay_seconds=3.0, # Respect API rate limits
        num_retries=5      # Resilience for unstable connections
    )

    search = arxiv.Search(
        query=SEARCH_QUERY,
        max_results=TARGET_COUNT,
        sort_by=arxiv.SortCriterion.SubmittedDate
    )

    # 3. Fetching Loop (skips already downloaded ones implicitly by set/logic or just append)
    # Since arXiv doesn't support easy "offset" in the new client, we fetch and filter duplicates.
    # Ideally, we would use 'start' parameter, but for <2000 papers, filtering by ID is safer for consistency.

    new_papers = existing_papers
    existing_ids = {p['arxiv_id'] for p in existing_papers}

    print("📡 Connecting to arXiv...")

    # We use a generator to stream results
    results_generator = client.results(search)

    try:
        for result in results_generator:
            if len(new_papers) >= TARGET_COUNT:
                break

            paper_id = result.entry_id.split('/')[-1]

            # Skip duplicates
            if paper_id in existing_ids:
                continue

            # Phase 2.1: Dataset filtering logic (Double check category)
            # primary_category is usually sufficient
            if not result.primary_category.startswith('cs.'):
                continue

            paper_data = {
                "arxiv_id": paper_id,
                "title": result.title,
                "abstract": result.summary.replace("\n", " "), # Phase 2.2: Whitespace normalization
                "authors": [a.name for a in result.authors],
                "published": result.published.isoformat(),
                "url": result.pdf_url,
                "categories": result.categories
            }

            new_papers.append(paper_data)
            existing_ids.add(paper_id)

            # Periodic Save (Resumption checkpoint)
            if len(new_papers) % 50 == 0:
                print(f"💾 Checkpoint: {len(new_papers)} papers...")
                with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
                    json.dump(new_papers, f, indent=2)

    except Exception as e:
        print(f"❌ Network Error: {e}")
        print("⚠️ implementation saved progress. Run script again to resume.")

    # Final Save
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(new_papers, f, indent=2)

    save_version_info(len(new_papers))
    print(f"🎉 Pipeline Complete. Total Papers: {len(new_papers)}")

if __name__ == "__main__":
    main()