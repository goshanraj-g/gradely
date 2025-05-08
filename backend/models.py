from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    courses = relationship("Course", back_populates="owner", cascade="all, delete")


class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    code = Column(String, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="courses")
    assignments = relationship(
        "Assignment", back_populates="course", cascade="all, delete, delete-orphan"
    )


class Assignment(Base):
    __tablename__ = "assignments"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    mark = Column(Float, nullable=False)
    weight = Column(Float, nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"))
    course = relationship("Course", back_populates="assignments")
