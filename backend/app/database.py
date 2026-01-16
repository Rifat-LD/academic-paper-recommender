from sqlmodel import SQLModel, create_engine, Session
import os

# Create 'backend/db' folder if it doesn't exist
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_DIR = os.path.join(BASE_DIR, "db")
os.makedirs(DB_DIR, exist_ok=True)

sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{os.path.join(DB_DIR, sqlite_file_name)}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, echo=True, connect_args=connect_args)

def create_db_and_tables():
    """Creates the tables if they don't exist."""
    SQLModel.metadata.create_all(engine)

def get_session():
    """Dependency for FastAPI endpoints."""
    with Session(engine) as session:
        yield session