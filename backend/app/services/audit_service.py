from sqlalchemy.orm import Session
from app.models.audit import AuditLog
import json

def log_action(db: Session, user_id: int, action: str, details: dict = None):
    log_entry = AuditLog(
        user_id=user_id,
        action=action,
        details=json.dumps(details) if details else None
    )
    db.add(log_entry)
    db.commit()
