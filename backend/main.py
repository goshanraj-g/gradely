import models
from fastapi import FastAPI
from database import engine
from assignment import router as assignments_router
from auth import router as auth_router
from courses import router as courses_router
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from fastapi.openapi.models import OAuthFlows as OAuthFlowsModel, OAuth2 as OAuth2Model
from fastapi.openapi.utils import get_openapi

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TermCalc API",
    description="Backend for TermCalc - grade tracking and calculator",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "TermCalc backend is running!"}


app.include_router(auth_router)
app.include_router(courses_router)
app.include_router(assignments_router)
