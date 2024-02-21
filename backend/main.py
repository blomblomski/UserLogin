

from typing import Annotated
from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import orm

import api.crud as crud
from api import models, schemas

app = FastAPI()

# CORS
origins = [
    "http://localhost",
    "http://localhost:3000",
],

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create the database tables
crud.create_database()


@app.post("/api/create_user")
async def create_user(user: schemas.UserCreate, db: orm.Session = Depends(crud.get_db)):
    """Create a new user. Will prevent duplicate emails and usernames."""

    # check for existing user
    db_user = await crud.get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered. Please choose a different email or reset your password."
        )

    # Check for existing username
    db_user = await crud.get_user_by_username(db, user.username)
    if db_user or len(user.username) < 3 or len(user.username) > 50:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken or does not meet the length requirements. Please choose a different username."
        )

    # Create a new user
    created_user = await crud.create_user(db, user)

    return {"message": "User created successfully. {}".format(created_user.id)}


@app.post("/api/token")
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: orm.Session = Depends(crud.get_db)):
    """Log in and get an access token."""
    data = await crud.authenticate_user(db,  password=form_data.password, username=form_data.username)
    if not data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_data = await crud.create_access_token(data={"sub": data.username})
    return access_data


@app.get("/api/users/me", response_model=schemas.UserReturn)
async def read_users_me(current_user: Annotated[schemas.UserReturn, Depends(crud.get_current_user)]):
    """Get the current user."""
    return current_user


@app.get("/api/users", response_model=list[schemas.UserReturn])
async def read_users(users: Annotated[list[schemas.UserReturn], Depends(crud.get_all_users)]):
    """Get all users."""
    return users


@app.get("/api/welcome")
async def welcome():
    """Welcome message."""
    return {"message": "Welcome to the API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
