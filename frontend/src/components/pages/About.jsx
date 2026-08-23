import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const About = () => {
  const { theme } = useTheme();
  const [imgError, setImgError] = useState(false);

  return (
    <div className="space-y-6 pt-4 md:pt-0 w-full max-w-full">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-on-surface">About PhishGuard AI</h1>
        <p className="text-muted text-sm">Meet the developer behind the platform.</p>
      </div>

      {/* Description */}
      <div className="glass-card p-6 rounded-xl">
        <p className="text-sm text-on-surface leading-relaxed">
          <strong>PhishGuard AI</strong> is an intelligent phishing detection platform built for Blue Team analysts, SOC practitioners, and security enthusiasts. 
          It uses a <strong>heuristic‑based detection engine</strong> (rule‑based, regex, keyword + URL analysis) – not a trained machine‑learning model – 
          to inspect suspicious emails in real time. The platform performs deep inspection of email headers, body content, and links to classify threats 
          as <span className="text-status-safe font-semibold">Safe</span>, <span className="text-status-suspicious font-semibold">Suspicious</span>, 
          or <span className="text-status-high-risk font-semibold">High Risk</span>, giving security teams a fast, reliable first line of defense against 
          phishing and social engineering attacks. It also features a <strong className="text-primary">Gemini‑powered AI Chatbot</strong> that serves as an interactive 
          cybersecurity assistant.
        </p>
      </div>

      {/* Developer Profile – Photo always visible */}
      <div className="glass-card p-6 rounded-xl flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="flex-shrink-0">
          <div
            className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-primary/30 shadow-[0_0_25px_rgba(0,229,255,0.15)] flex items-center justify-center"
            style={{
              backgroundImage: `url('/assets/images/profile-photo.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Fallback visible only if image fails */}
            {imgError && (
              <span className="font-display text-4xl md:text-5xl text-primary font-bold">SM</span>
            )}
            <img
              src="/assets/images/profile-photo.jpg"
              alt="Shreyas M S"
              className="w-full h-full object-cover"
              style={{ display: 'none' }}
              onError={() => setImgError(true)}
            />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h3 className="font-display text-xl font-semibold text-on-surface">Shreyas M S</h3>
          <p className="text-sm text-secondary font-medium mt-1">
            Aspiring Cybersecurity Analyst | Blue Team | SOC Enthusiast
          </p>
          <p className="text-sm text-muted mt-0.5">
            Specializing in SIEM, advanced threat detection, log analysis, and incident response.
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
            <a
              href="https://github.com/shreyas-ms-cyber"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-xl">code</span>
              <span className="font-label-code text-xs">GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/shreyas-m-s-cyber"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-xl">work</span>
              <span className="font-label-code text-xs">LinkedIn</span>
            </a>
            <a
              href="tel:9880974964"
              className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-xl">call</span>
              <span className="font-label-code text-xs">9880974964</span>
            </a>
            <a
              href="mailto:shreyasvaishnav40@gmail.com"
              className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-xl">mail</span>
              <span className="font-label-code text-xs">Email</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
