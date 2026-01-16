from typing import Optional
from sqlmodel import Field, SQLModel

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    hashed_password: str

    # Offline Recovery Fields
    security_question: str
    security_answer_hash: str # We hash the answer too for privacy!