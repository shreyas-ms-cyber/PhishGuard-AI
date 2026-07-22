from sqlalchemy.orm import Session
from app.models.analysis import Analysis
from app.schemas.analysis import AnalysisResponse
from datetime import datetime

class AnalysisPersistence:
    @staticmethod
    def save_analysis(db: Session, user_id: int, result: AnalysisResponse, subject: str = None) -> Analysis:
        analysis = Analysis(
            user_id=user_id,
            subject=subject,
            risk_score=result.risk_score,
            risk_level=result.risk_level,
            findings=[f.dict() for f in result.findings],
            suspicious_keywords=result.suspicious_keywords,
            suspicious_urls=result.suspicious_urls,
            urgency_detected=result.urgency_detected,
            credential_detected=result.credential_detected,
            explanation=result.explanation,
            keyword_count=result.keyword_count,
            url_count=result.url_count,
        )
        db.add(analysis)
        db.commit()
        db.refresh(analysis)
        return analysis
