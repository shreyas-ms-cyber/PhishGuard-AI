# 🛡️ PhishGuard AI
**Smart Phishing Email Detector – Heuristic‑based, Explainable, and SOC‑Ready**

An interactive and production‑ready phishing analysis platform built with React and FastAPI. It helps Blue Team analysts, SOC practitioners, and security enthusiasts detect phishing emails, extract indicators of compromise (IOCs), map threats to MITRE ATT&CK, and manage investigations in a single workflow.

🚀 **Live Demo**  
[PhishGuard AI – Live App](https://phishguard-ai-sooty-ten.vercel.app)  
[Backend API](https://phishguard-ai-qwbb.onrender.com) | [API Docs](https://phishguard-ai-qwbb.onrender.com/docs)

---

## 🧠 Overview

This project simulates a real‑world **cybersecurity investigation dashboard** with a focus on:

- **Heuristic‑based detection** (not a trained ML model – fully explainable)
- **Transparent risk scoring** with per‑rule evidence
- **SOC investigation workflow** (case management, notes, false‑positive feedback)
- **MITRE ATT&CK mapping** for contextual threat intelligence
- **Clean, responsive UI** with glassmorphism and dark/light themes

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React (Vite), Tailwind CSS, Chart.js, Framer Motion |
| **Backend** | Python 3.12, FastAPI, SQLAlchemy, Alembic |
| **Database** | PostgreSQL (Neon – free, never expires) |
| **Auth** | JWT (HTTP‑only cookies) + Argon2id |
| **Deployment** | Vercel (frontend), Render (backend), Neon (DB) |

---

## ⚙️ Setup Instructions

```bash
# Clone the repository
git clone https://github.com/shreyas-ms-cyber/PhishGuard-AI.git
cd PhishGuard-AI

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
cp .env.example .env
# Update DATABASE_URL and SECRET_KEY in .env
alembic upgrade head
uvicorn app.main:app --reload --port 8000

# Frontend setup (in a new terminal)
cd ../frontend
npm install
npm run dev



🧩 Features

🔍 Detection Engine

· Keyword detection – scans for phishing‑related terms
· Urgency language – detects pressure tactics
· Credential harvesting – identifies password/login requests
· URL analysis – flags shortened, IP‑based, and suspicious TLD links
· Email header analysis – SPF, DKIM, DMARC, and sender spoofing checks
· IOC extraction – URLs, domains, IPs, emails, and file hashes

📊 Explainable Risk Scoring

· Per‑rule point contributions (keywords, URLs, urgency, credential, bonus)
· Detailed breakdown with evidence
· Risk levels: Safe (0‑30), Suspicious (31‑60), High Risk (61‑100)

🎯 MITRE ATT&CK Mapping

· T1566 – Phishing
· T1566.001 – Spearphishing Attachment
· T1566.002 – Spearphishing Link
· T1589 – Gather Victim Identity Information
· Evidence‑based mapping with explanations

📁 Investigation & Case Management

· Create cases with severity (Low, Medium, High, Critical)
· Track status (Open, Investigating, Contained, Resolved, Closed)
· Link multiple analyses to a single case
· Add analyst notes and mark detections as false positives

📈 SOC Dashboard

· Risk distribution chart (doughnut)
· Weekly analysis trend (line chart)
· Top suspicious keywords and domains
· Attack pattern distribution
· Detection rule frequency
· MITRE technique frequency

📄 Reporting & Audit

· Export history as PDF or CSV
· Audit logging of all key actions (analysis, feedback, case operations)
· Recent activity displayed in Settings

🎨 UI/UX

· Dark cybersecurity theme with glassmorphism
· Light theme toggle
· Fully responsive (mobile‑first)
· Analyst Mode (detailed) & Executive Mode (concise summary)

---

🧱 Approach

· Modular architecture – Clean separation between frontend, API, services, and data layers.
· Heuristic engine – Built with Python regex and rule‑based logic, ensuring explainability.
· State management – React Context for authentication and theme; local state for UI.
· Security‑first – JWT with HTTP‑only cookies, Argon2id hashing, and CORS protection.
· Performance – Pagination, lazy loading, and optimized database queries.

---

🎯 Highlights

· Production‑ready – Deployed on Vercel, Render, and Neon.
· Heuristic detection – Fully explainable and auditable (not a black‑box ML model).
· SOC workflow – Complete investigation pipeline from analysis to case closure.
· MITRE integration – Actionable threat intelligence context.
· Polished UX – Glassmorphism, animations, and dual‑mode views.

---

📌 Future Improvements

· Integration with VirusTotal/Shodan for enriched IOC reputation
· Real‑time email scanning via API
· Multi‑user roles (Admin, Analyst, Viewer)
· Advanced rule builder for custom detection logic
· Email delivery of reports (PDF via email)

---

👤 Author

Shreyas M S
Aspiring Cybersecurity Analyst | Blue Team | SOC Enthusiast
📧 shreyasvaishnav40@gmail.com
🔗 GitHub · LinkedIn · 📞 9880974964

---

📝 © Copyright

© 2026 Shreyas M S. All rights reserved.

This project is created for educational and portfolio purposes only.
You are free to view, fork, and reference this project with proper attribution.

Unauthorized commercial use or redistribution without permission is prohibited.

---

⭐ Star this repo if you found it useful!
https://img.shields.io/github/stars/shreyas-ms-cyber/PhishGuard-AI?style=social
