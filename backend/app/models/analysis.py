from sqlalchemy import Column, Integer, String, DateTime, JSON, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    subject = Column(String, nullable=True)
    risk_score = Column(Integer, nullable=False)
    risk_level = Column(String, nullable=False)
    findings = Column(JSON, nullable=True)
    suspicious_keywords = Column(JSON, nullable=True)
    suspicious_urls = Column(JSON, nullable=True)
    urgency_detected = Column(Boolean, default=False)
    credential_detected = Column(Boolean, default=False)
    explanation = Column(String, nullable=True)
    keyword_count = Column(Integer, default=0)
    url_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    # New feedback fields
    feedback = Column(Boolean, nullable=True)
    feedback_comment = Column(Text, nullable=True)
    feedback_updated_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="analyses")
