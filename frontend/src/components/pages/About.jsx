import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const About = () => {
  const { theme } = useTheme();
  const [imgError, setImgError] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);
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

      {/* Project Description */}
      <div className="glass-card p-6 rounded-xl w-full">
        <p className="font-body-lg text-body-lg text-on-surface leading-relaxed">
          <strong>PhishGuard AI</strong> is an intelligent phishing detection platform built for Blue Team analysts, SOC practitioners, and security enthusiasts. 
          It uses a <strong>heuristic‑based detection engine</strong> (rule‑based, regex, keyword + URL analysis) – not a trained machine‑learning model – 
          to inspect suspicious emails in real time. The platform performs deep inspection of email headers, body content, and links to classify threats 
          as <span className="text-secondary font-semibold">Safe</span>, <span className="text-tertiary-container font-semibold">Suspicious</span>, 
          or <span className="text-error font-semibold">High Risk</span>, giving security teams a fast, reliable first line of defense against 
          phishing and social engineering attacks.
        </p>
      </div>

      {/* Developer Profile Card */}
      <div className="glass-card p-6 rounded-xl w-full flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Photo */}
        <div className="flex-shrink-0">
          <div className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-primary/30 shadow-[0_0_25px_rgba(0,229,255,0.3)] bg-surface-variant flex items-center justify-center relative">
            {imgLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-surface-variant rounded-full">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              </div>
            )}
            {!imgError ? (
              <img
                src={`/assets/images/profile-photo.jpg?v=${imgVersion}`}
                alt="Shreyas M S"
                className="w-full h-full object-cover"
                onError={() => {
                  setImgError(true);
                  setImgLoading(false);
                }}
                onLoad={() => setImgLoading(false)}
              />
            ) : (
              <span className="font-display text-4xl md:text-5xl text-primary font-bold">SM</span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <h3 className="font-headline-md text-headline-md font-bold text-primary">Shreyas M S</h3>
          <p className="font-body-md text-body-md text-secondary font-medium mt-1">
            Aspiring Cybersecurity Analyst | Blue Team | SOC Enthusiast
          </p>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            Specializing in SIEM, advanced threat detection, log analysis, and incident response.
          </p>

          {/* Social Links */}
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
