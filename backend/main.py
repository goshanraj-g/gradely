import models
from fastapi import FastAPI
from database import engine
from auth import router as auth_router

models.Base.metadata.create_all(bind=engine)
app = FastAPI() #create backend

@app.get("/") #when someone vistis home page, return this:
def home():
    return {"message": "TermCalc backend is running!"}

app.include_router(auth_router) # take all routes from auth.py and add them to the app