from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

import models, schemas
from auth import get_current_user, get_db

router = APIRouter(prefix="/courses/{course_id}/assignments", tags=["Assignments"])


def course_owned(course_id: int, db: Session, user_id: int):
    course = db.query(models.Course).filter_by(id=course_id, owner_id=user_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Course not found"
        )
    return course


@router.get("", response_model=list[schemas.AssignmentOut])
def list_assignments(
    course_id: int,
    db: Session = Depends(get_db),
    current=Depends(get_current_user),
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
    course_owned(course_id, db, current.id)
    ass = models.Assignment(course_id=course_id, **payload.dict())
    db.add(ass)
    db.commit()
    db.refresh(ass)
    return ass


@router.delete("/{assignment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_assignment(
    course_id: int,
    assignment_id: int,
    db: Session = Depends(get_db),
    current=Depends(get_current_user),
):
    course_owned(course_id, db, current.id)
    assignment = (
        db.query(models.Assignment)
        .filter_by(id=assignment_id, course_id=course_id)
        .first()
    )
    if assignment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Assignment not found"
        )
    db.delete(assignment)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.put("/{assignment_id}", response_model=schemas.AssignmentOut)
def update_assignment(
    course_id: int,
    assignment_id: int,
    updated_assignment: schemas.AssignmentUpdate,
    db: Session = Depends(get_db),
    current=Depends(get_current_user),
):
    course_owned(course_id, db, current.id)
    assignment = (
        db.query(models.Assignment)
        .filter_by(id=assignment_id, course_id=course_id)
        .first()
    )
    if assignment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Assignment not found"
        )
    for key, value in updated_assignment.dict(exclude_unset=True).items():
        setattr(assignment, key, value)
    db.commit()
    db.refresh(assignment)
    return assignment


@router.get(
    "/{assignment_id}/scenario",
    response_model=schemas.ScenarioOut,
    summary="Calculate the mark needed on one evaluation for a target course grade",
)
def scenario_calc(
    course_id: int,
    assignment_id: int,
    target: float,
    db: Session = Depends(get_db),
    current=Depends(get_current_user),
):
    course = course_owned(course_id, db, current.id)
    assignments = course.assignments
    assignment = next((a for a in assignments if a.id == assignment_id), None)
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Assignment not found"
        )
    total_weight = sum(a.weight for a in assignments)
    current_sum = sum(
        a.mark * a.weight
        for a in assignments
        if a.id != assignment_id and a.mark is not None
    )
    try:
        needed = (target * total_weight - current_sum) / assignment.weight
    except ZeroDivisionError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Assignment weight must be non-zero",
        )
    return schemas.ScenarioOut(needed_mark=round(needed, 2))
