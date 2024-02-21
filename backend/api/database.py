from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Define the database
DATABASE_URL = "sqlite:///./test.db"

# to get a string like this run:
# openssl rand -hex 32
SECRET_KEY = "542747f2b4b0493f6291909c6d93368d21026fea863001da9734b10119b6f978"
ALOGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Create the database engine
# check_same_thread is set to False to allow multiple threads to access the database
# check_same_thread is only used for SQLite databases
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a base class for the database models
Base = declarative_base()
