import sys
import torch
import fastapi
import sentence_transformers
import numpy
import sqlmodel

def check_status(name, version, note=""):
    print(f"✅ {name}: {version} {note}")

print("\n--- 🔍 Phase 0: Environment Verification (Python 3.13) ---\n")

# 1. Check Python Version
print(f"Python Runtime: {sys.version.split()[0]}")

# 2. Check Core Backend
check_status("FastAPI", fastapi.__version__)
check_status("SQLModel", sqlmodel.__version__)

# 3. Check AI/Math Core
check_status("Sentence Transformers", sentence_transformers.__version__)
check_status("Numpy", numpy.__version__, "(Vector Search Engine)")

# 4. Check PyTorch (CPU Verification)
if "cpu" in torch.__version__ or not torch.cuda.is_available():
    check_status("PyTorch", torch.__version__, "- CPU Mode Active (Correct for Offline)")
else:
    print(f"⚠️  PyTorch: {torch.__version__} (Warning: CUDA/GPU detected, expected CPU-only)")

print("\n-----------------------------------------------------------")
print("🎉 Dependency Validation Complete. Ready for Phase 1 Coding.")
print("-----------------------------------------------------------\n")