"""
Database configuration and session management for Cloutopia
Using SQLAlchemy with SQLite for development (can be switched to PostgreSQL for production)
"""

from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator
import os
from dotenv import load_dotenv

load_dotenv()

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./cloutopia.db")

# Create engine
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL, 
        connect_args={"check_same_thread": False},  # Needed for SQLite
        echo=os.getenv("DEBUG", "false").lower() == "true"  # Log SQL queries in debug mode
    )
else:
    engine = create_engine(DATABASE_URL, echo=os.getenv("DEBUG", "false").lower() == "true")

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class for models
Base = declarative_base()

def get_db() -> Generator[Session, None, None]:
    """
    Dependency function to get database session
    Use this in FastAPI endpoints with Depends(get_db)
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    """
    Create all tables in the database
    Call this function to initialize the database
    """
    Base.metadata.create_all(bind=engine)

def drop_tables():
    """
    Drop all tables in the database
    Use with caution - this will delete all data!
    """
    Base.metadata.drop_all(bind=engine)

def reset_database():
    """
    Reset the database by dropping and recreating all tables
    Use with caution - this will delete all data!
    """
    drop_tables()
    create_tables()
