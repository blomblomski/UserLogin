
from datetime import datetime, timedelta
from typing import Annotated
from fastapi import Depends, HTTPException, status
from api.database import SessionLocal, Base, engine, ACCESS_TOKEN_EXPIRE_MINUTES, SECRET_KEY, ALOGORITHM
from api import models, schemas
from sqlalchemy import orm
from passlib.context import CryptContext
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer

# pwd_context is used to hash the passwords
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# oauth2_scheme is used to authenticate the user
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/token")


def create_database():
    # Create the database tables
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_passowrd_hash(password):
    return pwd_context.hash(password)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


async def create_user(db: orm.Session, user: schemas.UserCreate):
    # Create a new user
    db_user = models.User(username=user.username.lower(),
                          email=user.email.lower(), password=get_passowrd_hash(user.password), full_name=user.full_name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


async def get_user_by_email(db: orm.Session, email: str):
    # Get a user by email
    return db.query(models.User).filter(models.User.email == email).first()


async def get_user_by_username(db: orm.Session, username: str):
    # Get a user by username
    return db.query(models.User).filter(models.User.username == username).first()


async def authenticate_user(db: orm.Session, password: str, username: str):
    # Authenticate a user
    user = await get_user_by_username(db, username)
    if not user:
        user = await get_user_by_email(db, username)
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user


async def create_access_token(data: dict):
    # Create an access token
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALOGORITHM)
    return {"access_token": encoded_jwt, "token_type": "bearer"}


async def get_current_user(db: orm.Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    # Get the current user
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALOGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = await get_user_by_username(db, username)
    if user is None:
        user = await get_user_by_email(db, username)
    if user is None:
        raise credentials_exception
    return user


async def get_all_users(db: orm.Session = Depends(get_db), token: str = Depends(oauth2_scheme)):

    user = await get_current_user(db, token)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Get all users
    return db.query(models.User).all()
