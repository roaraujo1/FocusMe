import os
from pathlib import Path
from backend.app.models import Users, FocusSession
from dotenv import load_dotenv
from fastapi import FastAPI
from sqlmodel import Field, Session, SQLModel, create_engine, select

# Load backend/.env for local runs (on Cloud Run there's no file, so this does nothing)
load_dotenv(Path(__file__).resolve().parent.parent / ".env")



# The database URL is automatically injected as an environment variable
engine = create_engine(os.getenv("DATABASE_URL"))


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session