from pydantic import BaseModel


# pydantic is apart of fastAPI, and is used to handle request data, response data, validation
# this function ensures that the data MUST have an email and password and both of which must have strings, fastAPI will reject bad input and return error mesages
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
    
class ScenarioOut(BaseModel):
    needed_mark: float


# these are all validation to define ths trcture of the responses
