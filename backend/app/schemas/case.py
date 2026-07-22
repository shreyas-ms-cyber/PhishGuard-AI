from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import enum

class CaseSeverity(str, enum.Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"

class CaseStatus(str, enum.Enum):
    OPEN = "Open"
    INVESTIGATING = "Investigating"
    CONTAINED = "Contained"
    RESOLVED = "Resolved"
    CLOSED = "Closed"

class NoteCreate(BaseModel):
    content: str

class NoteResponse(BaseModel):
    id: int
    content: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    user_id: int
    username: Optional[str] = None

class CaseCreate(BaseModel):
    title: str
    description: Optional[str] = None
    severity: CaseSeverity = CaseSeverity.MEDIUM
    status: CaseStatus = CaseStatus.OPEN
    analysis_ids: List[int] = []

class CaseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    severity: Optional[CaseSeverity] = None
    status: Optional[CaseStatus] = None
    analysis_ids: Optional[List[int]] = None

class CaseResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    severity: CaseSeverity
    status: CaseStatus
    created_at: datetime
    updated_at: Optional[datetime] = None
    user_id: int
    analyses: List[dict] = []
    notes: List[NoteResponse] = []

class CaseListItem(BaseModel):
    id: int
    title: str
    severity: CaseSeverity
    status: CaseStatus
    created_at: datetime
    updated_at: Optional[datetime] = None
    analysis_count: int = 0
    note_count: int = 0
