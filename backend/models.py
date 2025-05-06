from sqlalchemy  import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

# user table
class User(Base):
    __tablename__ = "users" # table name in db
    #index -> able to look up with email
    id = Column(Integer, primary_key =True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_pasword=Column(String, nullable=False)
    
    #one user can have many courses
    courses = relationship("Course", back_populates="owner")

class Course(Base):
    __tablename__ = "courses"
    
    id = Column(Integer, primary_key = True, index=True)
    name = Column(String, nullable = False)
    code = Column(String, nullable = False)
    owner_id = Column(Integer, ForeignKey("users.id"))
    
    owner = relationship("User", back_populates="courses") #a course can have multiple users