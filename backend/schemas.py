from pydantic import BaseModel
from typing import Optional


class UserCreate(BaseModel):
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class CourseCreate(BaseModel):
    name: str
    code: str


class AssignmentCreate(BaseModel):
    name: str
    mark: float
    weight: float


class AssignmentOut(AssignmentCreate):
    id: int
    model_config = {"from_attributes": True}


class AssignmentUpdate(BaseModel):
    name: Optional[str]
    weight: Optional[float]
    mark: Optional[float]

class ScenarioOut(BaseModel):
    needed_mark: float
