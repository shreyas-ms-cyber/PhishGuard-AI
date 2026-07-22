import re
from datetime import datetime
from typing import List, Dict, Any, Optional
from app.schemas.analysis import AnalysisResponse, Finding, IOC, HeaderAnalysis, Rule, ScoreBreakdown, MitreMapping

class AnalysisService:
    SUSPICIOUS_KEYWORDS = [
        "verify", "password", "login", "account", "update", "bank",
        "reward", "urgent", "security alert", "confirm", "crypto", "bitcoin",
        "click here", "reset", "validate", "authenticate", "credential"
    ]
    
    URGENCY_PHRASES = [
        "immediately", "urgent", "as soon as possible", "within 24 hours",
        "action required", "final notice", "suspended", "terminated",
        "your account will be", "must respond", "limited time"
    ]
    
    CREDENTIAL_PHRASES = [
        "verify your account", "confirm your identity", "update your password",
        "reset your password", "enter your password", "enter your username",
        "provide your login", "authentication required"
    ]

    def __init__(self):
        pass

    def analyze(self, content: str, subject: Optional[str] = None) -> AnalysisResponse:
        text = content.lower()
        
        found_keywords = [kw for kw in self.SUSPICIOUS_KEYWORDS if kw in text]
        found_keywords = list(dict.fromkeys(found_keywords))
        
        urgency_detected = any(p in text for p in self.URGENCY_PHRASES)
        credential_detected = any(p in text for p in self.CREDENTIAL_PHRASES)
        
        url_pattern = r'https?://[^\s<>"\']+'
        all_urls = re.findall(url_pattern, content)
        suspicious_urls = [url for url in all_urls if self._is_suspicious_url(url)]
        
        iocs = self._extract_iocs(content)
        header_analysis = self._analyze_headers(content)
        
        keyword_points = min(len(found_keywords) * 4, 20)
        url_points = min(len(suspicious_urls) * 15, 40)
        urgency_points = 15 if urgency_detected else 0
        credential_points = 20 if credential_detected else 0
        bonus_points = 10 if (urgency_detected and credential_detected) else 0
        total_points = keyword_points + url_points + urgency_points + credential_points + bonus_points
        total_points = min(total_points, 100)
        
        rules = []
        if keyword_points > 0:
            rules.append(Rule(
                id="RULE-KEY-001",
                name="Suspicious Keyword Detection",
                severity="medium",
                description="Email contains one or more suspicious keywords commonly used in phishing.",
                evidence=", ".join(found_keywords[:5]),
                points=keyword_points
            ))
        if url_points > 0:
            rules.append(Rule(
                id="RULE-URL-001",
                name="Suspicious URL Detection",
                severity="high",
                description="Email contains URLs with suspicious indicators (shortened, IP-based, suspicious TLDs).",
                evidence=", ".join(suspicious_urls[:3]),
                points=url_points
            ))
        if urgency_detected:
            rules.append(Rule(
                id="RULE-URG-001",
                name="Urgency Language Detection",
                severity="medium",
                description="Email uses urgent language to pressure the recipient into quick action.",
                evidence="Urgency phrases found: " + ", ".join([p for p in self.URGENCY_PHRASES if p in text][:3]),
                points=urgency_points
            ))
        if credential_detected:
            rules.append(Rule(
                id="RULE-CRED-001",
                name="Credential Harvesting Detection",
                severity="high",
                description="Email requests sensitive credentials or account information.",
                evidence="Credential phrases found: " + ", ".join([p for p in self.CREDENTIAL_PHRASES if p in text][:3]),
                points=credential_points
            ))
        if bonus_points:
            rules.append(Rule(
                id="RULE-BONUS-001",
                name="Urgency + Credential Combination",
                severity="high",
                description="Combined urgency and credential requests create a high-risk phishing signature.",
                evidence="Both urgency and credential patterns detected.",
                points=bonus_points
            ))
        
        findings = []
        if keyword_points > 0:
            findings.append(Finding(
                type="keyword",
                severity="medium",
                title=f"{len(found_keywords)} suspicious keywords detected",
                description=f"Found keywords: {', '.join(found_keywords[:5])}",
                evidence=", ".join(found_keywords[:5])
            ))
        if url_points > 0:
            findings.append(Finding(
                type="url",
                severity="high",
                title=f"{len(suspicious_urls)} suspicious URLs detected",
                description="Contains suspicious links that may lead to phishing sites",
                evidence=", ".join(suspicious_urls[:3])
            ))
        if urgency_detected:
            findings.append(Finding(
                type="urgency",
                severity="medium",
                title="Urgency language detected",
                description="The message creates pressure for immediate action",
                evidence="Urgent language found in content"
            ))
        if credential_detected:
            findings.append(Finding(
                type="credential",
                severity="high",
                title="Credential request detected",
                description="The email requests sensitive account credentials",
                evidence="Credential harvesting phrases detected"
            ))
        if bonus_points:
            findings.append(Finding(
                type="combined",
                severity="high",
                title="Urgency + credential request combination",
                description="Combined urgency and credential requests create a high-risk phishing signature",
                evidence="Both urgency and credential patterns detected"
            ))

        score_breakdown = ScoreBreakdown(
            keyword_points=keyword_points,
            url_points=url_points,
            urgency_points=urgency_points,
            credential_points=credential_points,
            bonus_points=bonus_points,
            total_points=total_points
        )

        if total_points <= 30:
            risk_level = "Safe"
        elif total_points <= 60:
            risk_level = "Suspicious"
        else:
            risk_level = "High Risk"

        explanation = self._generate_explanation(
            total_points,
            risk_level,
            len(found_keywords),
            len(suspicious_urls),
            urgency_detected,
            credential_detected
        )

        # MITRE ATT&CK mappings
        mitre_mappings = self._map_to_mitre(content, findings, suspicious_urls, credential_detected)

        return AnalysisResponse(
            risk_score=total_points,
            risk_level=risk_level,
            findings=findings,
            suspicious_keywords=found_keywords,
            suspicious_urls=suspicious_urls,
            urgency_detected=urgency_detected,
            credential_detected=credential_detected,
            explanation=explanation,
            keyword_count=len(found_keywords),
            url_count=len(all_urls),
            created_at=datetime.now(),
            iocs=iocs,
            header_analysis=header_analysis,
            score_breakdown=score_breakdown,
            rules=rules,
            mitre_mappings=mitre_mappings
        )
    
    def _is_suspicious_url(self, url: str) -> bool:
        suspicious_patterns = [
            r'bit\.ly', r'tinyurl\.com', r'ow\.ly', r'short\.link', r'goo\.gl',
            r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}',
            r'[a-zA-Z0-9-]+-[a-zA-Z0-9-]+-[a-zA-Z0-9-]+\.'
        ]
        for pattern in suspicious_patterns:
            if re.search(pattern, url, re.IGNORECASE):
                return True
        return False
    
    def _extract_iocs(self, content: str) -> List[IOC]:
        iocs = []
        urls = re.findall(r'https?://[^\s<>"\']+', content)
        for url in urls:
            iocs.append(IOC(type="url", value=url))
        
        domain_pattern = r'(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}'
        domains = set(re.findall(domain_pattern, content))
        for domain in domains:
            if not domain.startswith('www.') and not domain.endswith('.com') and not domain.endswith('.org'):
                continue
            iocs.append(IOC(type="domain", value=domain))
        
        ip_pattern = r'\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b'
        ips = set(re.findall(ip_pattern, content))
        for ip in ips:
            iocs.append(IOC(type="ipv4", value=ip))
        
        email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
        emails = set(re.findall(email_pattern, content))
        for email in emails:
            iocs.append(IOC(type="email", value=email))
        
        hash_patterns = {
            'md5': r'\b[a-fA-F0-9]{32}\b',
            'sha1': r'\b[a-fA-F0-9]{40}\b',
            'sha256': r'\b[a-fA-F0-9]{64}\b'
        }
        for hash_type, pattern in hash_patterns.items():
            hashes = set(re.findall(pattern, content))
            for h in hashes:
                iocs.append(IOC(type=hash_type, value=h))
        
        return iocs
    
    def _analyze_headers(self, content: str) -> Optional[HeaderAnalysis]:
        lines = content.split('\n')
        headers = {}
        current_key = None
        for line in lines:
            if ': ' in line:
                key, value = line.split(': ', 1)
                headers[key.lower()] = value.strip()
            elif line.startswith(' ') and current_key:
                headers[current_key] += ' ' + line.strip()
            elif line.strip() == '':
                break
            else:
                current_key = None
        
        if not headers:
            return None
        
        from_addr = headers.get('from', '')
        reply_to = headers.get('reply-to', '')
        return_path = headers.get('return-path', '')
        received = headers.get('received', '')
        auth_results = headers.get('authentication-results', '')
        
        from_reply_to_mismatch = bool(from_addr and reply_to and from_addr != reply_to)
        
        suspicious_sender_domain = False
        if from_addr:
            domain_match = re.search(r'@([a-zA-Z0-9.-]+)', from_addr)
            if domain_match:
                domain = domain_match.group(1)
                if re.search(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', domain):
                    suspicious_sender_domain = True
                elif any(tld in domain for tld in ['.tk', '.ml', '.ga', '.cf', '.xyz', '.top']):
                    suspicious_sender_domain = True
                elif re.search(r'[a-zA-Z0-9-]+-[a-zA-Z0-9-]+', domain):
                    suspicious_sender_domain = True
        
        display_name_spoofing = bool(from_addr and re.search(r'(?i)(paypal|amazon|microsoft|google|apple|bank|secure|verify)', from_addr))
        
        spf_result = None
        dkim_result = None
        dmarc_result = None
        auth_failures = []
        if auth_results:
            if 'spf=' in auth_results:
                spf_match = re.search(r'spf=(\w+)', auth_results)
                if spf_match:
                    spf_result = spf_match.group(1).upper()
                    if spf_result != 'PASS':
                        auth_failures.append(f"SPF {spf_result}")
            if 'dkim=' in auth_results:
                dkim_match = re.search(r'dkim=(\w+)', auth_results)
                if dkim_match:
                    dkim_result = dkim_match.group(1).upper()
                    if dkim_result != 'PASS':
                        auth_failures.append(f"DKIM {dkim_result}")
            if 'dmarc=' in auth_results:
                dmarc_match = re.search(r'dmarc=(\w+)', auth_results)
                if dmarc_match:
                    dmarc_result = dmarc_match.group(1).upper()
                    if dmarc_result != 'PASS':
                        auth_failures.append(f"DMARC {dmarc_result}")
        
        explanation_parts = []
        if from_reply_to_mismatch:
            explanation_parts.append("From and Reply-To addresses do not match.")
        if suspicious_sender_domain:
            explanation_parts.append("Sender domain appears suspicious.")
        if display_name_spoofing:
            explanation_parts.append("Display name may be impersonating a trusted brand.")
        if auth_failures:
            explanation_parts.append(f"Authentication failures: {', '.join(auth_failures)}.")
        if not explanation_parts:
            explanation_parts.append("No obvious header anomalies detected.")
        
        return HeaderAnalysis(
            from_address=from_addr,
            reply_to=reply_to,
            return_path=return_path,
            received=received,
            authentication_results=auth_results,
            from_reply_to_mismatch=from_reply_to_mismatch,
            suspicious_sender_domain=suspicious_sender_domain,
            display_name_spoofing=display_name_spoofing,
            spf_result=spf_result,
            dkim_result=dkim_result,
            dmarc_result=dmarc_result,
            authentication_failures=auth_failures,
            explanation=" ".join(explanation_parts)
        )
    
    def _generate_explanation(self, score: int, level: str, keywords: int, urls: int, urgency: bool, credential: bool) -> str:
        parts = []
        parts.append(f"Risk Score: {score}/100 – {level}")
        parts.append(f"Found {keywords} suspicious keywords.")
        if urls > 0:
            parts.append(f"Found {urls} suspicious URL(s).")
        if urgency:
            parts.append("Urgency language detected.")
        if credential:
            parts.append("Credential request detected.")
        return " ".join(parts)

    def _map_to_mitre(self, content: str, findings: List[Finding], suspicious_urls: List[str], credential_detected: bool) -> List[MitreMapping]:
        mappings = []
        text_lower = content.lower()

        # T1566.002 – Spearphishing Link
        if suspicious_urls:
            mappings.append(MitreMapping(
                technique_id="T1566.002",
                technique_name="Spearphishing Link",
                evidence=", ".join(suspicious_urls[:2]),
                explanation="Suspicious URLs detected in the email, indicating a possible spearphishing link attempt."
            ))

        # T1566.001 – Spearphishing Attachment (if attachment indicators exist)
        if "attachment" in text_lower or "attach" in text_lower or "download" in text_lower:
            mappings.append(MitreMapping(
                technique_id="T1566.001",
                technique_name="Spearphishing Attachment",
                evidence="Keywords suggesting an attachment or download request.",
                explanation="Email contains language requesting the user to open an attachment, which may deliver malware."
            ))

        # T1566 – Phishing (general)
        if len(findings) > 0:
            mappings.append(MitreMapping(
                technique_id="T1566",
                technique_name="Phishing",
                evidence="Multiple phishing indicators detected.",
                explanation="The email exhibits several characteristics consistent with phishing attacks."
            ))

        # T1589 – Gather Victim Identity Information (if credential request detected)
        if credential_detected:
            mappings.append(MitreMapping(
                technique_id="T1589",
                technique_name="Gather Victim Identity Information",
                evidence="Credential harvesting phrases detected.",
                explanation="The email attempts to collect credentials, which may be used for identity theft or further attacks."
            ))

        # Remove duplicates (keep unique technique IDs)
        seen = set()
        unique_mappings = []
        for m in mappings:
            if m.technique_id not in seen:
                seen.add(m.technique_id)
                unique_mappings.append(m)
        return unique_mappings
