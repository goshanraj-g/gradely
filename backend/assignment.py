from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import models, schemas
from auth import get_current_user, get_db

router = APIRouter(prefix="/courses/{course_id}/assignments", tags=["Assignments"])


def course_owned(course_id: int, db: Session, user_id: int):
    course = db.query(models.Course).filter_by(id=course_id, owner_id=user_id).first()

    if not course:
        raise HTTPException(404, "Course not found")
    return course


@router.get("", response_model=list[schemas.AssignmentOut])
def list_assignments(
    course_id: int, db: Session = Depends(get_db), current=Depends(get_current_user)
):
    return course_owned(course_id, db, current.id).assignments


@router.post(
    "", response_model=schemas.AssignmentOut, status_code=status.HTTP_201_CREATED
)
def add_assignments(
    course_id: int,
    payload: schemas.AssignmentCreate,
    db: Session = Depends(get_db),
    current=Depends(get_current_user),
):
    course_owned(course_id, db, current.id)  # 404 if not owner
    ass = models.Assignment(course_id=course_id, **payload.dict())
    db.add(ass)
    db.commit()
    db.refresh(ass)
    return ass
