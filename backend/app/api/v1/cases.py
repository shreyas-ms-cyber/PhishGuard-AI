from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.case import Case, CaseStatus, CaseSeverity
from app.models.analysis import Analysis
from app.models.note import AnalystNote
from app.schemas.case import CaseCreate, CaseUpdate, CaseResponse, CaseListItem, NoteCreate, NoteResponse
from app.services.audit_service import log_action

router = APIRouter(prefix="/cases", tags=["Cases"])

# --- GET all cases ---
@router.get("", response_model=List[CaseListItem])
@router.get("/", response_model=List[CaseListItem])
def list_cases(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cases = db.query(Case).filter(Case.user_id == current_user.id).order_by(Case.created_at.desc()).all()
    result = []
    for case in cases:
        result.append(CaseListItem(
            id=case.id,
            title=case.title,
            severity=case.severity,
            status=case.status,
            created_at=case.created_at,
            updated_at=case.updated_at,
            analysis_count=len(case.analyses),
            note_count=len(case.notes)
        ))
    return result

# --- POST create case ---
@router.post("", response_model=CaseResponse)
@router.post("/", response_model=CaseResponse)
def create_case(
    case_data: CaseCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if case_data.analysis_ids:
        analyses = db.query(Analysis).filter(
            Analysis.id.in_(case_data.analysis_ids),
            Analysis.user_id == current_user.id
        ).all()
        if len(analyses) != len(case_data.analysis_ids):
            raise HTTPException(status_code=404, detail="One or more analyses not found")
    else:
        analyses = []

    new_case = Case(
        title=case_data.title,
        description=case_data.description,
        severity=case_data.severity,
        status=case_data.status,
        user_id=current_user.id
    )
    db.add(new_case)
    db.commit()
    db.refresh(new_case)

    for analysis in analyses:
        new_case.analyses.append(analysis)
    db.commit()
    db.refresh(new_case)

    log_action(db, current_user.id, "case_create", {"case_id": new_case.id, "title": new_case.title})
    return new_case

# --- GET single case ---
@router.get("/{case_id}", response_model=CaseResponse)
def get_case(
    case_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    case = db.query(Case).filter(
        Case.id == case_id,
        Case.user_id == current_user.id
    ).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case

# --- PUT update case ---
@router.put("/{case_id}", response_model=CaseResponse)
def update_case(
    case_id: int,
    case_data: CaseUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    case = db.query(Case).filter(
        Case.id == case_id,
        Case.user_id == current_user.id
    ).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    if case_data.title is not None:
        case.title = case_data.title
    if case_data.description is not None:
        case.description = case_data.description
    if case_data.severity is not None:
        case.severity = case_data.severity
    if case_data.status is not None:
        case.status = case_data.status

    if case_data.analysis_ids is not None:
        case.analyses = []
        if case_data.analysis_ids:
            analyses = db.query(Analysis).filter(
                Analysis.id.in_(case_data.analysis_ids),
                Analysis.user_id == current_user.id
            ).all()
            if len(analyses) != len(case_data.analysis_ids):
                raise HTTPException(status_code=404, detail="One or more analyses not found")
            case.analyses.extend(analyses)

    db.commit()
    db.refresh(case)

    log_action(db, current_user.id, "case_update", {"case_id": case.id, "title": case.title})
    return case

# --- DELETE case ---
@router.delete("/{case_id}")
def delete_case(
    case_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    case = db.query(Case).filter(
        Case.id == case_id,
        Case.user_id == current_user.id
    ).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    db.delete(case)
    db.commit()
    log_action(db, current_user.id, "case_delete", {"case_id": case_id})
    return {"message": "Case deleted"}

# --- POST add note ---
@router.post("/{case_id}/notes", response_model=NoteResponse)
def add_note(
    case_id: int,
    note_data: NoteCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    case = db.query(Case).filter(
        Case.id == case_id,
        Case.user_id == current_user.id
    ).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    note = AnalystNote(
        content=note_data.content,
        user_id=current_user.id,
        case_id=case_id
    )
    db.add(note)
    db.commit()
    db.refresh(note)
    log_action(db, current_user.id, "note_add", {"case_id": case_id, "note_id": note.id})
    return note

# --- DELETE note ---
@router.delete("/notes/{note_id}")
def delete_note(
    note_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    note = db.query(AnalystNote).filter(
        AnalystNote.id == note_id,
        AnalystNote.user_id == current_user.id
    ).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(note)
    db.commit()
    log_action(db, current_user.id, "note_delete", {"note_id": note_id})
    return {"message": "Note deleted"}
