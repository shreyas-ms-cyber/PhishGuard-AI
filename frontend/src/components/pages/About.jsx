import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const About = () => {
  const { theme } = useTheme();
  const [imgError, setImgError] = useState(false);
  const [imgVersion, setImgVersion] = useState(1);

  useEffect(() => {
    setImgVersion(Date.now());
  }, []);

  return (
    <div className="space-y-6 pt-4 md:pt-0 w-full max-w-full">
      <header>
        <h2 className="font-headline-md text-headline-md font-bold text-primary">About PhishGuard AI</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">Meet the developer behind the platform.</p>
      </header>

      {/* Project Description – Updated */}
      <div className="glass-card p-6 rounded-xl w-full">
        <p className="font-body-lg text-body-lg text-on-surface leading-relaxed">
          <strong>PhishGuard AI</strong> is an intelligent phishing detection platform built for Blue Team analysts, SOC practitioners, and security enthusiasts. 
          It uses a <strong>heuristic‑based detection engine</strong> (rule‑based, regex, keyword + URL analysis) – not a trained machine‑learning model – 
          to inspect suspicious emails in real time. The platform performs deep inspection of email headers, body content, and links to classify threats 
          as <span className="text-secondary font-semibold">Safe</span>, <span className="text-tertiary-container font-semibold">Suspicious</span>, 
          or <span className="text-error font-semibold">High Risk</span>, giving security teams a fast, reliable first line of defense against 
          phishing and social engineering attacks.
        </p>
        <p className="font-body-md text-on-surface-variant mt-4">
          <strong>Beyond detection, PhishGuard AI provides a full SOC investigation workflow:</strong>
        </p>
        <ul className="list-disc list-inside text-on-surface-variant font-body-md space-y-1 mt-2">
          <li><strong>IOC Extraction</strong> – URLs, domains, IPv4, email addresses, and file hashes.</li>
          <li><strong>Email Header Analysis</strong> – SPF, DKIM, DMARC, and sender spoofing detection.</li>
          <li><strong>MITRE ATT&CK Mapping</strong> – automatically maps findings to techniques like T1566 and T1589.</li>
          <li><strong>Explainable Risk Scoring</strong> – per‑rule point contributions with detailed evidence.</li>
          <li><strong>Case Management</strong> – track investigations with severity, status, and linked analyses.</li>
          <li><strong>Analyst Notes & Feedback</strong> – record findings and mark detections as false positives.</li>
          <li><strong>Audit Logging</strong> – all key actions logged for accountability and transparency.</li>
          <li><strong>AI Chatbot</strong> – Gemini‑powered cybersecurity assistant for education and Q&A.</li>
          <li><strong>Reports & Dashboard</strong> – PDF/CSV export and real‑time SOC analytics with charts.</li>
        </ul>
        <p className="font-body-md text-on-surface-variant mt-4">
          <strong>Tech stack:</strong> React 18, FastAPI, PostgreSQL, JWT authentication, and secure HTTP‑only cookies. 
          Deployed on Vercel (frontend), Render (backend), and Neon (database – free, never expires).
        </p>
      </div>

      {/* Developer Profile Card – unchanged */}
      <div className="glass-card p-6 rounded-xl w-full flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="flex-shrink-0">
          <div className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-primary/30 shadow-[0_0_25px_rgba(0,229,255,0.3)] bg-surface-variant flex items-center justify-center">
            {!imgError ? (
              <img
                src={`/assets/images/profile-photo.jpg?v=${imgVersion}`}
                alt="Shreyas M S"
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
                onLoad={() => setImgError(false)}
              />
            ) : (
              <span className="font-display text-4xl md:text-5xl text-primary font-bold">SM</span>
            )}
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h3 className="font-headline-md text-headline-md font-bold text-primary">Shreyas M S</h3>
          <p className="font-body-md text-body-md text-secondary font-medium mt-1">
            Aspiring Cybersecurity Analyst | Blue Team | SOC Enthusiast
          </p>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            Specializing in SIEM, advanced threat detection, log analysis, and incident response.
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
            <a
              href="https://github.com/shreyas-ms-cyber"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-xl">code</span>
              <span className="font-label-code text-label-code">GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/shreyas-m-s-cyber"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-xl">work</span>
              <span className="font-label-code text-label-code">LinkedIn</span>
            </a>
            <a
              href="tel:9880974964"
              className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-xl">call</span>
              <span className="font-label-code text-label-code">9880974964</span>
            </a>
            <a
              href="mailto:shreyasvaishnav40@gmail.com"
              className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-xl">mail</span>
              <span className="font-label-code text-label-code">Email</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
