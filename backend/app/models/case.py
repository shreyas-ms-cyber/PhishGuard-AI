from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Enum, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum

class CaseStatus(str, enum.Enum):
    OPEN = "Open"
    INVESTIGATING = "Investigating"
    CONTAINED = "Contained"
    RESOLVED = "Resolved"
    CLOSED = "Closed"

class CaseSeverity(str, enum.Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"

case_analysis = Table(
    'case_analysis',
    Base.metadata,
    Column('case_id', Integer, ForeignKey('cases.id', ondelete='CASCADE'), primary_key=True),
    Column('analysis_id', Integer, ForeignKey('analyses.id', ondelete='CASCADE'), primary_key=True),
    Column('created_at', DateTime(timezone=True), server_default=func.now())
)

class Case(Base):
    __tablename__ = "cases"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    severity = Column(Enum(CaseSeverity), default=CaseSeverity.MEDIUM)
    status = Column(Enum(CaseStatus), default=CaseStatus.OPEN)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    user = relationship("User", back_populates="cases")
    analyses = relationship("Analysis", secondary=case_analysis, backref="cases")
    notes = relationship("AnalystNote", back_populates="case", cascade="all, delete-orphan")
