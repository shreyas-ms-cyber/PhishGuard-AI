# 🛡️ PhishGuard AI – Smart Phishing Email Detector

**PhishGuard AI** is a production‑ready, heuristic‑based phishing detection platform designed for Blue Team analysts, SOC practitioners, and security enthusiasts. It analyzes email content in real time, extracts indicators of compromise (IOCs), performs email header analysis, maps detections to MITRE ATT&CK, and provides a full SOC investigation workflow with case management, analyst notes, and executive summaries.

[

![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

](https://phishguard-ai-sooty-ten.vercel.app)
[

![Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

](https://phishguard-ai-qwbb.onrender.com)
[

![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)

](LICENSE)
[

![Made with](https://img.shields.io/badge/Made%20with-React-61DAFB?style=for-the-badge&logo=react&logoColor=white)

](https://reactjs.org/)
[

![Made with](https://img.shields.io/badge/Made%20with-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)

](https://fastapi.tiangolo.com/)
[

![Heuristic](https://img.shields.io/badge/Detection-Heuristic--based-orange?style=for-the-badge)

](https://github.com/shreyas-ms-cyber/PhishGuard-AI)
[

![Live Demo](https://img.shields.io/badge/Live%20Demo-Online-brightgreen?style=for-the-badge&logo=vercel)

](https://phishguard-ai-sooty-ten.vercel.app)
[

![AI Powered](https://img.shields.io/badge/AI-Gemini%20Powered-4285F4?style=for-the-badge&logo=google&logoColor=white)

](https://ai.google.dev/gemini-api)

> 🔍 **Detection Engine:** Heuristic‑based (rule-based, regex, keyword + URL analysis). **Not** a trained machine‑learning model – fully explainable and auditable.

---

## 🔗 Live Demo

**[Try PhishGuard AI Live →](https://phishguard-ai-sooty-ten.vercel.app)**

> ⚠️ Note: Hosted on Render's free tier — the backend server may take 30–60 seconds to spin up on first load if it's been idle.

| Service | URL |
|---------|-----|
| **Frontend (Vercel)** | [https://phishguard-ai-sooty-ten.vercel.app](https://phishguard-ai-sooty-ten.vercel.app) |
| **Backend API** | [https://phishguard-ai-qwbb.onrender.com](https://phishguard-ai-qwbb.onrender.com) |
| **API Documentation** | [https://phishguard-ai-qwbb.onrender.com/docs](https://phishguard-ai-qwbb.onrender.com/docs) |

---

## 🌟 Executive Overview

In an era of sophisticated phishing attacks, social engineering, and credential theft, simple email filters are no longer sufficient. **PhishGuard AI** provides security teams with a fast, reliable first line of defense by simulating how an attacker's techniques would be perceived by an intelligent detection system.

### Core Features

| Feature | Description |
|---------|-------------|
| **🔍 Heuristic Detection Engine** | Keyword, urgency, credential, and URL analysis with transparent risk scoring. |
| **🧩 IOC Extraction** | URLs, domains, IPv4, email addresses, MD5/SHA1/SHA256 hashes. |
| **📨 Email Header Analysis** | SPF, DKIM, DMARC, From/Reply‑To mismatch, and display‑name spoofing. |
| **🎯 MITRE ATT&CK Mapping** | Automatic mapping to T1566 (Phishing), T1566.002 (Spearphishing Link), T1589 (Gather Victim Identity). |
| **📊 Explainable Risk Scoring** | Per‑rule point contributions (keywords, URLs, urgency, credential, bonus) with detailed evidence. |
| **📁 Case Management** | Track investigations with severity (Low/Medium/High/Critical) and status (Open/Investigating/Contained/Resolved/Closed). |
| **📝 Analyst Notes & Feedback** | Record findings and mark detections as false positives. |
| **📜 Audit Logging** | All key actions logged for accountability and transparency. |
| **🤖 AI Chatbot** | Gemini‑powered cybersecurity assistant for education and Q&A. |
| **📄 Reports & Dashboard** | PDF/CSV export and real‑time SOC analytics with interactive charts. |
| **🎨 UI/UX** | Glassmorphism design, dark/light themes, fully responsive, Analyst & Executive modes. |
| **🔐 Security** | JWT with HTTP‑only cookies, Argon2id password hashing, CORS protection, rate limiting. |

---

## 🏗️ Architecture

- **Frontend**: React 18, Vite, Tailwind CSS, Chart.js, Framer Motion.
- **Backend**: Python 3.12+, FastAPI, SQLAlchemy, Alembic.
- **Database**: PostgreSQL (Neon – free, never expires).
- **Authentication**: JWT (HTTP‑only cookies) + Argon2id password hashing.
- **Deployment**: Frontend → Vercel, Backend → Render, Database → Neon.
- **AI Integration**: Google Gemini API for the cybersecurity assistant chatbot.

---

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js 18+**
- **Python 3.12+**
- **PostgreSQL** (or SQLite for development)

### 1. Clone the Repository
```bash
git clone https://github.com/shreyas-ms-cyber/PhishGuard-AI.git
cd PhishGuard-AI
```

### 2. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Update DATABASE_URL and SECRET_KEY in .env
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

### 4. Access the Application
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`
- Interactive API Docs: `http://localhost:8000/docs`

---

## 🔬 Detection Methodology

PhishGuard AI uses a heuristic‑based approach – no machine learning is involved. The engine applies a set of rule‑based detectors:

- **Keyword Detection** – scans for suspicious terms (e.g., "verify", "password", "account", "bank").
- **Urgency Language** – detects phrases that pressure the user (e.g., "immediate action required").
- **Credential Harvesting** – identifies requests for passwords, usernames, or login details.
- **URL Analysis** – flags shortened URLs, IP‑based URLs, suspicious TLDs, excessive subdomains, and misspelled domains.

### Risk Score Breakdown

| Component | Points |
|-----------|--------|
| Suspicious Keywords | +4 each (capped at +20) |
| Suspicious URLs | +15 each (capped at +40) |
| IP‑Based URL | +20 instead of +15 |
| Shortened URL | +10 instead of +15 |
| Urgency Language | +15 |
| Credential Request | +20 |
| Urgency + Credential Bonus | +10 |

**Risk Levels:**
- 0–30: Safe
- 31–60: Suspicious
- 61–100: High Risk

---

## 📊 API Endpoints

Key endpoints (full docs available at `/docs`):

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Log in (sets HTTP‑only cookies) |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Log out (clears cookies) |
| POST | `/analyze/` | Analyze email content |
| POST | `/analyze/{id}/feedback` | Submit false‑positive feedback |
| GET | `/dashboard/stats` | Get dashboard statistics |
| GET | `/dashboard/history` | Get paginated history with filters |
| GET | `/dashboard/trends` | Get daily analysis trends |
| GET | `/dashboard/top-keywords` | Top suspicious keywords |
| GET | `/dashboard/attack-patterns` | Attack pattern distribution |
| GET | `/dashboard/top-domains` | Top suspicious domains |
| GET | `/dashboard/rule-frequency` | Detection rule frequency |
| GET | `/dashboard/mitre-frequency` | MITRE technique frequency |
| CRUD | `/cases` | Case management endpoints |
| POST | `/ai/chat` | AI Chatbot (Gemini) |
| GET | `/audit/logs` | Recent audit logs |

---

## 🧪 Testing

```bash
# Backend (pytest)
cd backend
pytest

# Frontend (Jest + React Testing Library)
cd frontend
npm test
```

---

## 🎓 Interview & Portfolio Guide

If presenting this in an interview, focus on these points:

1. **The Heuristic Engine**: Explain how rule‑based detection works and why it's more explainable than ML models.
2. **Risk Scoring**: Walk through the additive formula and how each component contributes to the final score.
3. **Security Architecture**: JWT with HTTP‑only cookies, Argon2id hashing, and CORS configuration.
4. **SOC Workflow**: How cases, notes, and audit logs enable a complete investigation pipeline.
5. **MITRE Integration**: How detections are mapped to MITRE ATT&CK for contextual threat intelligence.
6. **AI Chatbot**: How Gemini is used for cybersecurity education (not hacking).

---

## 🚀 Deployment

| Component | Platform | URL |
|-----------|----------|-----|
| Frontend | Vercel | https://phishguard-ai-sooty-ten.vercel.app |
| Backend | Render | https://phishguard-ai-qwbb.onrender.com |
| Database | Neon | Free, never expires |

### Environment Variables (Backend)

| Key | Description |
|-----|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SECRET_KEY` | JWT signing key (run `openssl rand -hex 32`) |
| `JWT_ALGORITHM` | HS256 |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | 15 |
| `REFRESH_TOKEN_EXPIRE_DAYS` | 30 |
| `CORS_ORIGINS` | Comma‑separated list of allowed origins |
| `COOKIE_SECURE` | True for HTTPS |
| `COOKIE_SAMESITE` | None |
| `GEMINI_API_KEY` | Google Gemini API key for AI Chatbot |
| `DEBUG` | False for production |

### Environment Variables (Frontend)

| Key | Description |
|-----|-------------|
| `VITE_API_URL` | Backend API URL |

---

## 🚀 Future Roadmap

- [ ] **VirusTotal/Shodan Integration** – Enrich IOC reputation.
- [ ] **Real‑time Email Scanning** – API endpoint for automated scanning.
- [ ] **Multi‑user Roles** – Admin, Analyst, Viewer with permissions.
- [ ] **Advanced Rule Builder** – Custom detection logic.
- [ ] **Email Delivery** – PDF reports sent via email.
- [ ] **Mobile App** – React Native companion app.

---

## 👨‍💻 Author

**Shreyas M S**
Aspiring Cybersecurity Analyst | Blue Team | SOC Enthusiast

[

![GitHub](https://img.shields.io/badge/GitHub-shreyas--ms--cyber-181717?style=for-the-badge&logo=github&logoColor=white)

](https://github.com/shreyas-ms-cyber)
[

![LinkedIn](https://img.shields.io/badge/LinkedIn-Shreyas%20M%20S-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)

](https://linkedin.com)
[

![Email](https://img.shields.io/badge/Email-shreyasvaishnav40%40gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)

](mailto:shreyasvaishnav40@gmail.com)
[

![Phone](https://img.shields.io/badge/Phone-9880974964-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)

](tel:9880974964)

**Specialties:** SIEM, advanced threat detection, log analysis, and incident response.

---

## 📝 License

```
MIT License

Copyright (c) 2026 Shreyas M S

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- Built as a practical Blue Team / SOC project
- Inspired by real‑world phishing analysis techniques and the MITRE ATT&CK framework
- Special thanks to the open‑source community for the amazing tools and libraries

---

## 📧 Contact

For questions, feedback, or collaboration opportunities:

- **Email:** shreyasvaishnav40@gmail.com
- **LinkedIn:** Shreyas M S
- **GitHub:** shreyas-ms-cyber

---

⭐ **Star this repo if you found it useful!**



![Stars](https://img.shields.io/github/stars/shreyas-ms-cyber/PhishGuard-AI?style=social)



---

*Made with 🛡️ by Shreyas M S*

*This project accurately reflects heuristic‑based detection and is a testament to practical cybersecurity engineering.*
