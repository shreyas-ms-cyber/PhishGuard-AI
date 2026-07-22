from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.analysis import Analysis
from app.schemas.analysis import DashboardStats, AnalysisHistoryItem
from typing import Optional
from datetime import datetime, timedelta
import json
import re

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats", response_model=DashboardStats)
def get_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    total = db.query(Analysis).filter(Analysis.user_id == current_user.id).count()
    if total == 0:
        return DashboardStats(total=0, safe=0, suspicious=0, high_risk=0, avg_score=0.0)
    
    counts = db.query(
        Analysis.risk_level,
        func.count().label('count')
    ).filter(Analysis.user_id == current_user.id).group_by(Analysis.risk_level).all()
    
    safe = sum(c for r, c in counts if r == "Safe")
    suspicious = sum(c for r, c in counts if r == "Suspicious")
    high_risk = sum(c for r, c in counts if r == "High Risk")
    
    avg_score = db.query(func.avg(Analysis.risk_score)).filter(Analysis.user_id == current_user.id).scalar() or 0.0
    
    return DashboardStats(
        total=total,
        safe=safe,
        suspicious=suspicious,
        high_risk=high_risk,
        avg_score=round(float(avg_score), 1)
    )

@router.get("/history")
def get_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    search: Optional[str] = Query(None),
    risk_level: Optional[str] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    sort_by: str = Query("created_at"),
    sort_order: str = Query("desc"),
):
    query = db.query(Analysis).filter(Analysis.user_id == current_user.id)

    if search:
        search_filter = or_(
            Analysis.id == (int(search) if search.isdigit() else -1),
            Analysis.subject.ilike(f"%{search}%")
        )
        query = query.filter(search_filter)
    if risk_level:
        query = query.filter(Analysis.risk_level == risk_level)
    if start_date:
        try:
            start_dt = datetime.fromisoformat(start_date)
            query = query.filter(Analysis.created_at >= start_dt)
        except ValueError:
            pass
    if end_date:
        try:
            end_dt = datetime.fromisoformat(end_date)
            query = query.filter(Analysis.created_at <= end_dt)
        except ValueError:
            pass

    sort_column = getattr(Analysis, sort_by, Analysis.created_at)
    if sort_order.lower() == "asc":
        query = query.order_by(sort_column.asc())
    else:
        query = query.order_by(sort_column.desc())

    total = query.count()
    analyses = query.offset(offset).limit(limit).all()
    
    items = [
        AnalysisHistoryItem(
            id=a.id,
            subject=a.subject,
            risk_score=a.risk_score,
            risk_level=a.risk_level,
            created_at=a.created_at
        ) for a in analyses
    ]
    
    return {
        "items": items,
        "total": total,
        "limit": limit,
        "offset": offset,
        "filters": {
            "search": search,
            "risk_level": risk_level,
            "start_date": start_date,
            "end_date": end_date,
            "sort_by": sort_by,
            "sort_order": sort_order
        }
    }

@router.get("/trends")
def get_trends(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    days: int = 30
):
    start_date = datetime.now() - timedelta(days=days)
    results = db.query(
        func.date(Analysis.created_at).label('date'),
        func.count().label('count')
    ).filter(
        Analysis.user_id == current_user.id,
        Analysis.created_at >= start_date
    ).group_by(
        func.date(Analysis.created_at)
    ).order_by(
        func.date(Analysis.created_at)
    ).all()
    
    dates = [r.date.isoformat() for r in results]
    counts = [r.count for r in results]
    return {"dates": dates, "counts": counts}

@router.get("/top-keywords")
def get_top_keywords(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = 5
):
    analyses = db.query(Analysis).filter(Analysis.user_id == current_user.id).all()
    keyword_count = {}
    for a in analyses:
        if a.suspicious_keywords:
            for kw in a.suspicious_keywords:
                keyword_count[kw] = keyword_count.get(kw, 0) + 1
    sorted_keywords = sorted(keyword_count.items(), key=lambda x: x[1], reverse=True)[:limit]
    return {"keywords": [k for k, v in sorted_keywords], "counts": [v for k, v in sorted_keywords]}

# ----- NEW ANALYTICS ENDPOINTS -----

@router.get("/attack-patterns")
def get_attack_patterns(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    analyses = db.query(Analysis).filter(Analysis.user_id == current_user.id).all()
    patterns = {
        "Urgency + Credential": 0,
        "Credential Only": 0,
        "Urgency Only": 0,
        "Suspicious URL Only": 0,
        "URL + Credential": 0,
        "URL + Urgency": 0,
        "All Three (URL + Urgency + Credential)": 0,
        "No Indicators": 0,
    }
    for a in analyses:
        has_url = a.url_count > 0
        has_urgency = a.urgency_detected
        has_credential = a.credential_detected
        if has_url and has_urgency and has_credential:
            patterns["All Three (URL + Urgency + Credential)"] += 1
        elif has_url and has_credential:
            patterns["URL + Credential"] += 1
        elif has_url and has_urgency:
            patterns["URL + Urgency"] += 1
        elif has_urgency and has_credential:
            patterns["Urgency + Credential"] += 1
        elif has_credential:
            patterns["Credential Only"] += 1
        elif has_urgency:
            patterns["Urgency Only"] += 1
        elif has_url:
            patterns["Suspicious URL Only"] += 1
        else:
            patterns["No Indicators"] += 1
    result = {k: v for k, v in patterns.items() if v > 0}
    return {"patterns": result}

@router.get("/top-domains")
def get_top_domains(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = 5
):
    analyses = db.query(Analysis).filter(Analysis.user_id == current_user.id).all()
    domain_counts = {}
    for a in analyses:
        if a.suspicious_urls:
            for url in a.suspicious_urls:
                domain_match = re.search(r'https?://([^/]+)', url)
                if domain_match:
                    domain = domain_match.group(1)
                    domain_counts[domain] = domain_counts.get(domain, 0) + 1
    sorted_domains = sorted(domain_counts.items(), key=lambda x: x[1], reverse=True)[:limit]
    return {"domains": [d for d, _ in sorted_domains], "counts": [c for _, c in sorted_domains]}

@router.get("/rule-frequency")
def get_rule_frequency(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    analyses = db.query(Analysis).filter(Analysis.user_id == current_user.id).all()
    rule_counts = {}
    for a in analyses:
        if a.findings:
            for finding in a.findings:
                ftype = finding.get('type')
                if ftype:
                    rule_counts[ftype] = rule_counts.get(ftype, 0) + 1
    name_map = {
        'keyword': 'Suspicious Keywords',
        'url': 'Suspicious URLs',
        'urgency': 'Urgency Language',
        'credential': 'Credential Request',
        'combined': 'Urgency+Credential Bonus'
    }
    result = {}
    for key, count in rule_counts.items():
        result[name_map.get(key, key)] = count
    return {"rules": list(result.keys()), "counts": list(result.values())}

@router.get("/mitre-frequency")
def get_mitre_frequency(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    analyses = db.query(Analysis).filter(Analysis.user_id == current_user.id).all()
    technique_counts = {}
    for a in analyses:
        if a.url_count > 0:
            technique_counts["T1566.002"] = technique_counts.get("T1566.002", 0) + 1
        if a.credential_detected:
            technique_counts["T1589"] = technique_counts.get("T1589", 0) + 1
        if a.urgency_detected and a.credential_detected:
            technique_counts["T1566"] = technique_counts.get("T1566", 0) + 1
    name_map = {
        "T1566.002": "Spearphishing Link",
        "T1589": "Gather Victim Identity",
        "T1566": "Phishing"
    }
    result = []
    for tech_id, count in technique_counts.items():
        result.append({"technique_id": tech_id, "technique_name": name_map.get(tech_id, tech_id), "count": count})
    result.sort(key=lambda x: x["count"], reverse=True)
    return {"mitre": result}
