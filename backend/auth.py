import models
import schemas
import os

from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import JWTError, jwt
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from database import SessionLocal
from dotenv import load_dotenv
from schemas import UserLogin, Token


load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


router = APIRouter() #modular router

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto") #hashes with salt

def get_db():
    db=SessionLocal() #opens a connection
    try:
        yield db # gives the route temp access and sends to finally block after the request is done 
    finally:
        db.close() #closes after route is done 
        
def hash_password(password:str):
    return pwd_context.hash(password)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could now validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta # expiration time
    to_encode.update({"exp": expire})  # adds the expiration
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM) # jwt.encode to create the json web token

@router.post("/signup") #when a post request is sent to signup, this is ran
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)): #users: -> json body with email, password with pydantic, db: ->inject a db connection into route
    existing = db.query(models.User).filter(models.User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email is already registered to an account")
    
    hashed_pw = hash_password(user.password)
    new_user = models.User(email=user.email, hashed_password = hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"message": "User created successfully", "user": {"id": new_user.id, "email": new_user.email}}

@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    #check if user exists in db
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user:
        #if it doesn't exist tell them
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    if not pwd_context.verify(user.password, db_user.hashed_password):
        #if the password doesn't match, give error
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    #once this is done, create a access token which expires, and 
    
    access_token = create_access_token(data={"sub": str(db_user.id)}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)) # set subject to the user id, and sets the expiration time
    
    return {"access_token": access_token, "token_type": "bearer"}


        
    