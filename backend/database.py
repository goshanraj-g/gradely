import os
from sqlalchemy import create_engine  # connects to database
from sqlalchemy.ext.declarative import (
    declarative_base,
)  # allows to create tables using python classes
from sqlalchemy.orm import sessionmaker  # allows to talk to db (add/fetch)
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# creates the actual db connection
engine = create_engine(DATABASE_URL)

# session local is used to talk to the db
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

# base is what models (tables) will inherit from
Base = declarative_base()
