"""
Database initialization script for Cloutopia
Run this script to create the database tables
"""

import sys
import os

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import create_tables, reset_database, engine
from app.models import User, Blog, Image
from sqlalchemy import text

def init_database():
    """Initialize the database with all tables"""
    print("Initializing Cloutopia database...")
    
    # Create all tables
    create_tables()
    
    # Verify tables were created
    with engine.connect() as connection:
        result = connection.execute(text("SELECT name FROM sqlite_master WHERE type='table';"))
        tables = [row[0] for row in result]
        print(f"Created tables: {', '.join(tables)}")
    
    print("Database initialization complete!")

def reset_db():
    """Reset the database (WARNING: This will delete all data!)"""
    print("WARNING: This will delete all data in the database!")
    confirm = input("Are you sure? Type 'yes' to confirm: ")
    if confirm.lower() == 'yes':
        reset_database()
        print("Database reset complete!")
    else:
        print("Database reset cancelled.")

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Cloutopia Database Management")
    parser.add_argument("action", choices=["init", "reset"], help="Action to perform")
    
    args = parser.parse_args()
    
    if args.action == "init":
        init_database()
    elif args.action == "reset":
        reset_db()
