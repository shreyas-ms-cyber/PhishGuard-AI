import { useState } from 'react';
import { Link } from 'react-router-dom';

const Support = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'What is heuristic-based phishing detection?',
      a: 'Heuristic-based phishing detection uses a set of predefined rules, patterns, and heuristics to analyze email content. It looks for suspicious keywords, urgent language, credential requests, malicious URLs, and other indicators commonly found in phishing emails. This approach provides explainable, transparent results without requiring large training datasets.'
    },
    {
      q: 'How is the risk score calculated?',
      a: 'The risk score is calculated additively from multiple components: suspicious keywords (+4 each, capped at +20), suspicious URLs (+15 each, capped at +40, with IP-based URLs scoring +20 and shortened URLs scoring +10), urgency language (+15), credential request (+20), and a +10 bonus if both urgency and credential request are detected. The final score is capped at 100.'
    },
    {
      q: 'What does a High Risk result mean?',
      a: 'A High Risk result (score 61–100) indicates strong phishing indicators. The email contains multiple suspicious patterns (keywords, URLs, urgency, credential requests) and is highly likely to be a phishing attempt. We recommend not interacting with any links or attachments in such emails.'
    },
    {
      q: 'How are suspicious URLs detected?',
      a: 'PhishGuard AI extracts all URLs from the email and analyzes them for known phishing patterns. It checks for shortened URLs (bit.ly, tinyurl, etc.), IP-based URLs, suspicious TLDs (.tk, .ml, etc.), excessive subdomains, and misspelled domains (like paypa1.com). Suspicious URLs are highlighted in the analysis results.'
    },
    {
      q: 'What file types can be uploaded?',
      a: 'Currently, only plain text (.txt) files are supported for upload. The maximum file size is 500 KB. Other file types are rejected to maintain security.'
    },
    {
      q: 'Is this system machine-learning based?',
      a: 'No, PhishGuard AI does not use machine learning or neural networks. It employs heuristic-based detection using rule-based analysis, regular expressions, suspicious keywords, URL analysis, urgency detection, and credential-request detection. This approach is transparent, explainable, and does not require training on large datasets.'
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="space-y-6 pt-4 md:pt-0 w-full max-w-full">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-on-surface">Support Center</h1>
        <p className="text-muted text-sm">Find answers and get help.</p>
      </div>

      {/* FAQ */}
      <div className="glass-card p-6 rounded-xl">
        <h3 className="font-display text-sm font-semibold text-on-surface mb-4">Frequently Asked Questions</h3>
        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-glass-border last:border-0">
              <button
                onClick={() => toggleFaq(index)}
                className="w-full text-left py-3 flex justify-between items-center hover:text-primary transition-colors"
              >
                <span className="text-sm font-medium text-on-surface">{faq.q}</span>
                <span className="material-symbols-outlined text-muted">
                  {openFaq === index ? 'expand_less' : 'expand_more'}
                </span>
              </button>
              {openFaq === index && (
                <div className="pb-3 text-sm text-muted leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* System Information */}
      <div className="glass-card p-6 rounded-xl">
        <h3 className="font-display text-sm font-semibold text-on-surface mb-4">System Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-label-code text-[10px] text-muted uppercase tracking-wider">Status</p>
            <p className="text-sm text-status-safe flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-status-safe animate-pulse" />
              Operational
            </p>
          </div>
          <div>
            <p className="font-label-code text-[10px] text-muted uppercase tracking-wider">Detection Engine</p>
            <p className="text-sm text-on-surface mt-1">Heuristic-based</p>
          </div>
          <div>
            <p className="font-label-code text-[10px] text-muted uppercase tracking-wider">Supported Upload</p>
            <p className="text-sm text-on-surface mt-1">TXT (max 500 KB)</p>
          </div>
          <div>
            <p className="font-label-code text-[10px] text-muted uppercase tracking-wider">Version</p>
            <p className="text-sm text-on-surface mt-1">1.0.0</p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="glass-card p-6 rounded-xl">
        <h3 className="font-display text-sm font-semibold text-on-surface mb-4">Quick Help</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/analyze" className="btn-secondary text-sm">
            <span className="material-symbols-outlined">mail_lock</span>
            Analyze Email
          </Link>
          <Link to="/history" className="btn-secondary text-sm">
            <span className="material-symbols-outlined">history</span>
            History
          </Link>
          <Link to="/reports" className="btn-secondary text-sm">
            <span className="material-symbols-outlined">assessment</span>
            Reports
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Support;
