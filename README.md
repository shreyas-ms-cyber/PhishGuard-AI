# 🛡️ PhishGuard AI – Smart Phishing Email Detector

**PhishGuard AI** is a production-ready, heuristic-based phishing detection platform for Blue Team analysts, SOC practitioners, and security enthusiasts. It analyzes email content in real time, extracts IOCs, maps detections to MITRE ATT&CK, and provides a full SOC investigation workflow.



![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel&logoColor=white)




![Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7?logo=render&logoColor=white)




![License](https://img.shields.io/badge/License-MIT-blue)




![Detection](https://img.shields.io/badge/Detection-Heuristic--based-orange)




![Live Demo](https://img.shields.io/badge/Live%20Demo-Online-brightgreen?logo=vercel)



> 🔍 **Detection Engine:** Heuristic-based (rule-based, regex, keyword + URL analysis). Not a trained ML model — fully explainable and auditable.

## 🔗 Live Demo

**[Try PhishGuard AI Live →](https://phishguard-ai-sooty-ten.vercel.app)**

> ⚠️ Note: Backend is on Render's free tier — may take 30–60 seconds to spin up if idle.

---

## 🌟 Executive Overview
In an era of sophisticated phishing and credential theft, simple email filters aren't enough. PhishGuard AI gives security teams a fast, explainable first line of defense — showing *why* an email is flagged, not just that it is.

### Core Features
- **Heuristic Detection Engine**: Keyword, urgency, credential, and URL analysis with transparent risk scoring.
- **IOC Extraction**: URLs, domains, IPs, emails, and file hashes.
- **MITRE ATT&CK Mapping**: Auto-mapped to phishing-related techniques.
- **Case Management**: Full SOC workflow with severity, status, and analyst notes.
- **AI Chatbot**: Gemini-powered assistant for security education.
- **Dashboard & Reports**: Real-time analytics with PDF/CSV export.

---

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js 18+**
- **Python 3.12+**
- **PostgreSQL** (or SQLite for dev)

### 1. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```
The server will start at `http://localhost:8000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Runs at `http://localhost:5173`.

---

## 🏗️ Architecture
- **Frontend**: React 18, Vite, Tailwind CSS, Chart.js.
- **Backend**: Python FastAPI with a modular detection engine.
- **Database**: PostgreSQL (Neon).
- **Logic**: Rule-based scoring, header analysis, IOC extraction.

---

## 🎓 Interview & Portfolio Guide
If presenting this in an interview, focus on these points:
1. **The Heuristic Engine**: Why rule-based detection is more explainable than ML.
2. **Risk Scoring**: The additive formula behind each risk component.
3. **Security**: JWT with HTTP-only cookies, Argon2id hashing, CORS.
4. **SOC Workflow**: How cases, notes, and audit logs power investigations.

---

## 🚀 Future Roadmap
- [ ] **VirusTotal/Shodan Integration** – Enrich IOC reputation.
- [ ] **Real-time Email Scanning** – Automated API-based scanning.
- [ ] **Multi-user Roles** – Admin, Analyst, Viewer permissions.
- [ ] **Mobile App** – React Native companion app.

---

## 📝 License
MIT License — see [LICENSE](LICENSE) for details.

---

**Author:** Shreyas M S · [GitHub](https://github.com/shreyas-ms-cyber) · shreyasvaishnav40@gmail.com
