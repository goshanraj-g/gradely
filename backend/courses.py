from fastapi import APIRouter, Depends
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from database import SessionLocal
from auth import get_current_user, get_db
from schemas import CourseCreate

import models
import os

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/courses", tags=["Courses"], summary="Get courses for the current user")
def get_user_courses(
    db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
):
    return (
        db.query(models.Course).filter(models.Course.owner_id == current_user.id).all()
    )


@router.post(
    "/courses", tags=["Courses"], summary="Creates courses for the current user"
)
def create_course(
    course: CourseCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    new_course = models.Course(
        name=course.name, code=course.code, owner_id=current_user.id
    )
    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    return new_course


@router.delete("/courses/{course_id}", status_code=204)
def delete_course(
    course_id: int,
    db: Session = Depends(get_db),
    current: models.User = Depends(get_current_user),
):
    course = (
        db.query(models.Course)
        .filter(models.Course.id == course_id, models.Course.owner_id == current.id)
        .first()
    )
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    db.delete(course)
    db.commit()
    return
