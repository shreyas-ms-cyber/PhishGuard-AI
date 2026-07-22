from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class Finding(BaseModel):
    type: str
    severity: str
    title: str
    description: str
    evidence: str

class IOC(BaseModel):
    type: str
    value: str
    description: Optional[str] = None

class HeaderAnalysis(BaseModel):
    from_address: Optional[str] = None
    reply_to: Optional[str] = None
    return_path: Optional[str] = None
    received: Optional[str] = None
    authentication_results: Optional[str] = None
    from_reply_to_mismatch: bool = False
    suspicious_sender_domain: bool = False
    display_name_spoofing: bool = False
    spf_result: Optional[str] = None
    dkim_result: Optional[str] = None
    dmarc_result: Optional[str] = None
    authentication_failures: List[str] = []
    explanation: str = ""

class Rule(BaseModel):
    id: str
    name: str
    severity: str
    description: str
    evidence: str
    points: int

class ScoreBreakdown(BaseModel):
    keyword_points: int
    url_points: int
    urgency_points: int
    credential_points: int
    bonus_points: int
    total_points: int

class MitreMapping(BaseModel):
    technique_id: str
    technique_name: str
    evidence: str
    explanation: str

class AnalysisRequest(BaseModel):
    content: str
    subject: Optional[str] = None

class FeedbackSubmit(BaseModel):
    is_false_positive: bool
    comment: Optional[str] = None

class AnalysisResponse(BaseModel):
    id: Optional[int] = None
    risk_score: int
    risk_level: str
    findings: List[Finding]
    suspicious_keywords: List[str]
    suspicious_urls: List[str]
    urgency_detected: bool
    credential_detected: bool
    explanation: str
    keyword_count: int
    url_count: int
    created_at: Optional[datetime] = None
    iocs: List[IOC] = []
    header_analysis: Optional[HeaderAnalysis] = None
    score_breakdown: Optional[ScoreBreakdown] = None
    rules: List[Rule] = []
    mitre_mappings: List[MitreMapping] = []
    # New feedback fields
    feedback: Optional[bool] = None
    feedback_comment: Optional[str] = None
    feedback_updated_at: Optional[datetime] = None

class AnalysisHistoryItem(BaseModel):
    id: int
    subject: Optional[str]
    risk_score: int
    risk_level: str
    created_at: datetime

class DashboardStats(BaseModel):
    total: int
    safe: int
    suspicious: int
    high_risk: int
    avg_score: float
