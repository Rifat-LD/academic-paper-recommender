import arxiv
import json
import os
from datetime import datetime

# Configuration
# Get the directory where THIS script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# Save relative to the script: Up one folder (..), then into data/raw
DATA_DIR = os.path.join(SCRIPT_DIR, "../data/raw")

FILENAME = "papers_1k.json"
SEARCH_QUERY = "cat:cs.AI OR cat:cs.CL OR cat:cs.CV" # AI, Computation/Language, Computer Vision
MAX_RESULTS = 1000

def fetch_papers():
    print(f" Starting download of {MAX_RESULTS} papers from arXiv...")
    print(f" Target Storage: {os.path.abspath(DATA_DIR)}")

    # Ensure directory exists
    os.makedirs(DATA_DIR, exist_ok=True)

    client = arxiv.Client(
        page_size=100,
        delay_seconds=3,
        num_retries=3
    )

    search = arxiv.Search(
        query=SEARCH_QUERY,
        max_results=MAX_RESULTS,
        sort_by=arxiv.SortCriterion.SubmittedDate
    )

    papers = []

    try:
        for result in client.results(search):
            paper_data = {
                "arxiv_id": result.entry_id.split('/')[-1],
                "title": result.title,
                "abstract": result.summary.replace("\n", " "),
                "authors": [a.name for a in result.authors],
                "published": result.published.isoformat(),
                "url": result.pdf_url,
                "categories": result.categories
            }
            papers.append(paper_data)

            if len(papers) % 100 == 0:
                print(f"✅ Fetched {len(papers)} papers...")

    except Exception as e:
        print(f"❌ Error during download: {e}")

    # Save to file (Offline First)
    output_path = os.path.join(DATA_DIR, FILENAME)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(papers, f, indent=2)

    print(f"\n Success! Saved {len(papers)} papers to {output_path}")

if __name__ == "__main__":
    fetch_papers()