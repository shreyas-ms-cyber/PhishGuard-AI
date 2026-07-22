from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.analysis import Analysis
from app.schemas.analysis import AnalysisRequest, AnalysisResponse, FeedbackSubmit
from app.services.analysis_service import AnalysisService
from app.services.analysis_persistence import AnalysisPersistence
from app.services.audit_service import log_action
from datetime import datetime

router = APIRouter(prefix="/analyze", tags=["Analysis"])

@router.post("/", response_model=AnalysisResponse)
def analyze_email(
    request: AnalysisRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not request.content or len(request.content.strip()) < 10:
        raise HTTPException(status_code=400, detail="Email content is too short or empty")
    
    service = AnalysisService()
    result = service.analyze(request.content, request.subject)
    
    saved = AnalysisPersistence.save_analysis(db, current_user.id, result, request.subject)
    result.id = saved.id
    result.created_at = saved.created_at

    log_action(db, current_user.id, "analysis", {"analysis_id": saved.id, "subject": request.subject})

    return result

@router.get("/{analysis_id}")
def get_analysis(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id,
        Analysis.user_id == current_user.id
    ).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return analysis

@router.post("/{analysis_id}/feedback")
def submit_feedback(
    analysis_id: int,
    feedback_data: FeedbackSubmit,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id,
        Analysis.user_id == current_user.id
    ).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    analysis.feedback = feedback_data.is_false_positive
    analysis.feedback_comment = feedback_data.comment
    analysis.feedback_updated_at = datetime.now()
    db.commit()
    db.refresh(analysis)

    log_action(db, current_user.id, "feedback", {
        "analysis_id": analysis_id,
        "is_false_positive": feedback_data.is_false_positive,
        "comment": feedback_data.comment
    })

    return {"message": "Feedback submitted successfully", "feedback": feedback_data.is_false_positive}
