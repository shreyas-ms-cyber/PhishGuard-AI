import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';

const AnalysisResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (id) {
        try {
          const response = await api.get(`/analyze/${id}`);
          setAnalysis(response.data);
        } catch (error) {
          console.error('Failed to fetch analysis:', error);
          navigate('/history');
        } finally {
          setLoading(false);
        }
      } else if (location.state?.analysis) {
        setAnalysis(location.state.analysis);
        setLoading(false);
      } else {
        navigate('/analyze');
      }
    };
    fetchAnalysis();
  }, [id, location.state, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-primary animate-pulse">Loading analysis...</div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-error">Analysis not found</div>
      </div>
    );
  }

  const circumference = 264;
  const offset = circumference - (analysis.risk_score / 100) * circumference;

  const getRiskColor = (level) => {
    if (level === 'Safe') return 'text-status-safe';
    if (level === 'Suspicious') return 'text-status-suspicious';
    return 'text-status-high-risk';
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => console.log('Copied:', text));
  };

  const createCaseFromAnalysis = async () => {
    try {
      const res = await api.post('/cases', {
        title: `Case from Analysis #${analysis.id}`,
        description: `Automatically created from analysis #${analysis.id} – Risk Score: ${analysis.risk_score}`,
        severity: analysis.risk_level === 'High Risk' ? 'High' : analysis.risk_level === 'Suspicious' ? 'Medium' : 'Low',
        analysis_ids: [analysis.id]
      });
      navigate(`/cases/${res.data.id}`);
    } catch (error) {
      console.error('Failed to create case:', error);
    }
  };

  return (
    <div className="space-y-gutter">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="font-headline-md text-headline-md font-bold text-primary">Analysis Results</h2>
          <p className="text-on-surface-variant font-body-md">
            {analysis.id ? `Scan #${analysis.id}` : 'Recent scan'} • 
            {new Date(analysis.created_at).toLocaleString()}
          </p>
        </div>
      </header>

      {/* Risk Summary */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        <div className="md:col-span-4 glass-card p-8 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="material-symbols-outlined text-8xl">warning</span>
          </div>
          <div className="relative w-48 h-48 mb-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle className="text-surface-variant" cx="50" cy="50" fill="transparent" r="42" stroke="currentColor" strokeWidth="8"></circle>
              <circle className={`${getRiskColor(analysis.risk_level)} glow-error`} cx="50" cy="50" fill="transparent" r="42" stroke="currentColor" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" strokeWidth="8"></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`font-display text-display ${getRiskColor(analysis.risk_level)}`}>{analysis.risk_score}</span>
              <span className={`font-label-code text-label-code text-on-surface-variant -mt-2 ${getRiskColor(analysis.risk_level)}`}>{analysis.risk_level}</span>
            </div>
          </div>
          <div className="text-center">
            {/* NEW: Status Pill */}
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${
              analysis.risk_level === 'Safe' 
                ? 'bg-status-safe/10 text-status-safe border border-status-safe/20' 
                : 'bg-status-high-risk/10 text-status-high-risk border border-status-high-risk/20'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {analysis.risk_level === 'Safe' ? 'Threat Cleared' : 'Threat Confirmed'}
            </div>
          </div>
        </div>
        <div className="md:col-span-8 glass-card p-8 flex flex-col justify-center">
          <h3 className="font-headline-sm text-headline-sm text-primary mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined">info</span>
            Executive Summary
          </h3>
          <p className="font-body-lg text-body-lg text-on-surface leading-relaxed mb-6">
            {analysis.explanation}
          </p>
          <div className="flex flex-wrap gap-3">
            {analysis.keyword_count > 0 && (
              <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-label-code border border-primary/20 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                {analysis.keyword_count} Keywords
              </div>
            )}
            {analysis.url_count > 0 && (
              <div className="px-3 py-1 rounded-full bg-error/10 text-error text-label-code border border-error/20 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-error"></div>
                {analysis.url_count} URLs
              </div>
            )}
            {analysis.urgency_detected && (
              <div className="px-3 py-1 rounded-full bg-tertiary-container/10 text-tertiary-container text-label-code border border-tertiary-container/20 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-tertiary-container"></div>
                URGENCY
              </div>
            )}
            {analysis.credential_detected && (
              <div className="px-3 py-1 rounded-full bg-error/10 text-error text-label-code border border-error/20 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-error"></div>
                CREDENTIAL THEFT
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Findings */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        {analysis.findings.map((finding, idx) => (
          <div key={idx} className={`glass-card p-6 border-l-4 ${finding.severity === 'high' ? 'border-l-error' : finding.severity === 'medium' ? 'border-l-tertiary-container' : 'border-l-primary'}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-headline-sm text-headline-sm text-on-surface">{finding.title}</h4>
                <span className={`text-label-code ${finding.severity === 'high' ? 'text-error' : finding.severity === 'medium' ? 'text-tertiary-container' : 'text-primary'} uppercase font-bold tracking-widest`}>{finding.severity} severity</span>
              </div>
            </div>
            <div className="bg-surface-container-highest/50 rounded p-4 mb-4 border border-outline-variant/10">
              <p className="font-label-code text-label-code text-primary/80 mb-2">// EVIDENCE</p>
              <code className="text-sm text-on-surface-variant block leading-relaxed italic">"{finding.evidence}"</code>
            </div>
            <p className="text-body-sm text-on-surface-variant">{finding.description}</p>
          </div>
        ))}
      </section>

      {/* Risk Score Breakdown */}
      {analysis.score_breakdown && (
        <section className="glass-card p-8">
          <h3 className="font-headline-sm text-headline-sm text-primary mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined">calculate</span>
            Risk Score Breakdown
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-outline-variant/10 pb-2">
              <span className="font-body-md text-on-surface-variant">Suspicious Keywords</span>
              <span className="font-body-md text-on-surface font-semibold">+{analysis.score_breakdown.keyword_points}</span>
            </div>
            <div className="flex justify-between items-center border-b border-outline-variant/10 pb-2">
              <span className="font-body-md text-on-surface-variant">Suspicious URLs</span>
              <span className="font-body-md text-on-surface font-semibold">+{analysis.score_breakdown.url_points}</span>
            </div>
            <div className="flex justify-between items-center border-b border-outline-variant/10 pb-2">
              <span className="font-body-md text-on-surface-variant">Urgency Language</span>
              <span className="font-body-md text-on-surface font-semibold">+{analysis.score_breakdown.urgency_points}</span>
            </div>
            <div className="flex justify-between items-center border-b border-outline-variant/10 pb-2">
              <span className="font-body-md text-on-surface-variant">Credential Request</span>
              <span className="font-body-md text-on-surface font-semibold">+{analysis.score_breakdown.credential_points}</span>
            </div>
            {analysis.score_breakdown.bonus_points > 0 && (
              <div className="flex justify-between items-center border-b border-outline-variant/10 pb-2">
                <span className="font-body-md text-on-surface-variant">Urgency + Credential Bonus</span>
                <span className="font-body-md text-primary font-semibold">+{analysis.score_breakdown.bonus_points}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t-2 border-primary/30">
              <span className="font-headline-sm text-headline-sm text-primary">Total Risk Score</span>
              {/* NEW: Bolder total score */}
              <span className="font-headline-md text-headline-md text-primary font-bold">{analysis.score_breakdown.total_points} / 100</span>
            </div>
          </div>
        </section>
      )}

      {/* Detection Rules */}
      {analysis.rules && analysis.rules.length > 0 && (
        <section className="glass-card p-8">
          <h3 className="font-headline-sm text-headline-sm text-primary mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined">rule</span>
            Detection Rules Fired
          </h3>
          <div className="space-y-4">
            {analysis.rules.map((rule, idx) => (
              <div key={idx} className={`p-4 rounded-lg border-l-4 ${rule.severity === 'high' ? 'border-l-error' : rule.severity === 'medium' ? 'border-l-tertiary-container' : 'border-l-primary'} bg-surface-container/30`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-label-code text-label-code text-primary">{rule.id}</span>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface">{rule.name}</h4>
                  </div>
                  <span className={`font-label-code text-label-code ${rule.severity === 'high' ? 'text-error' : rule.severity === 'medium' ? 'text-tertiary-container' : 'text-primary'} uppercase font-bold`}>
                    {rule.severity} severity
                  </span>
                </div>
                <p className="font-body-sm text-on-surface-variant mb-2">{rule.description}</p>
                <div className="bg-surface-container-highest/50 rounded p-3 mb-2">
                  <p className="font-label-code text-label-code text-primary/80 mb-1">// EVIDENCE</p>
                  <code className="text-sm text-on-surface-variant block break-all italic">"{rule.evidence}"</code>
                </div>
                <div className="flex justify-end">
                  <span className="font-label-code text-label-code text-primary font-semibold">+{rule.points} points</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* MITRE ATT&CK Mappings */}
      {analysis.mitre_mappings && analysis.mitre_mappings.length > 0 && (
        <section className="glass-card p-8">
          <h3 className="font-headline-sm text-headline-sm text-primary mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined">military_tech</span>
            MITRE ATT&CK Mappings
          </h3>
          <div className="space-y-4">
            {analysis.mitre_mappings.map((mapping, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-surface-container/30 border border-outline-variant/20">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-label-code text-label-code text-primary">{mapping.technique_id}</span>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface">{mapping.technique_name}</h4>
                  </div>
                </div>
                <p className="font-body-sm text-on-surface-variant mb-2">{mapping.explanation}</p>
                <div className="bg-surface-container-highest/50 rounded p-3">
                  <p className="font-label-code text-label-code text-primary/80 mb-1">// EVIDENCE</p>
                  <code className="text-sm text-on-surface-variant block break-all italic">"{mapping.evidence}"</code>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Suspicious URLs */}
      {analysis.suspicious_urls && analysis.suspicious_urls.length > 0 && (
        <section className="glass-card p-8">
          <h3 className="font-headline-sm text-headline-sm text-primary mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined">link</span>
            Suspicious URLs
          </h3>
          <div className="space-y-4">
            {analysis.suspicious_urls.map((url, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 rounded-lg bg-surface-container/50 border border-outline-variant/20">
                <div className="w-10 h-10 rounded bg-error/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-error">link_off</span>
                </div>
                <div>
                  <p className="font-label-code text-body-md text-error break-all">{url}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Extracted IOCs */}
      {analysis.iocs && analysis.iocs.length > 0 && (
        <section className="glass-card p-8">
          <h3 className="font-headline-sm text-headline-sm text-primary mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined">search</span>
            Extracted Indicators (IOCs)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.iocs.map((ioc, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-surface-container/50 border border-outline-variant/20">
                <div>
                  <span className={`text-xs font-label-code uppercase ${ioc.type === 'url' ? 'text-error' : ioc.type === 'ipv4' ? 'text-warning' : 'text-primary'}`}>
                    {ioc.type}
                  </span>
                  <p className="font-body-sm text-on-surface break-all">{ioc.value}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(ioc.value)}
                  className="p-1 rounded hover:bg-primary/10 transition-colors"
                  title="Copy"
                >
                  <span className="material-symbols-outlined text-sm">content_copy</span>
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Email Header Analysis */}
      {analysis.header_analysis && (
        <section className="glass-card p-8">
          <h3 className="font-headline-sm text-headline-sm text-primary mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined">mail</span>
            Email Header Analysis
          </h3>
          <div className="space-y-4">
            <div className="bg-surface-container/50 rounded-lg p-4 border border-outline-variant/10">
              <p className="font-body-sm text-on-surface-variant">{analysis.header_analysis.explanation}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-label-code text-label-code text-on-surface-variant uppercase text-xs">From</span>
                <p className="font-body-sm text-on-surface break-all">{analysis.header_analysis.from_address || '—'}</p>
              </div>
              <div>
                <span className="font-label-code text-label-code text-on-surface-variant uppercase text-xs">Reply-To</span>
                <p className="font-body-sm text-on-surface break-all">{analysis.header_analysis.reply_to || '—'}</p>
              </div>
              <div>
                <span className="font-label-code text-label-code text-on-surface-variant uppercase text-xs">Return-Path</span>
                <p className="font-body-sm text-on-surface break-all">{analysis.header_analysis.return_path || '—'}</p>
              </div>
              <div>
                <span className="font-label-code text-label-code text-on-surface-variant uppercase text-xs">Received</span>
                <p className="font-body-sm text-on-surface break-all">{analysis.header_analysis.received ? analysis.header_analysis.received.slice(0, 60) + '…' : '—'}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {analysis.header_analysis.from_reply_to_mismatch && (
                <span className="px-3 py-1 rounded-full bg-error/10 text-error text-label-code border border-error/20 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-error"></span>
                  From/Reply-To Mismatch
                </span>
              )}
              {analysis.header_analysis.suspicious_sender_domain && (
                <span className="px-3 py-1 rounded-full bg-warning/10 text-warning text-label-code border border-warning/20 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-warning"></span>
                  Suspicious Sender Domain
                </span>
              )}
              {analysis.header_analysis.display_name_spoofing && (
                <span className="px-3 py-1 rounded-full bg-error/10 text-error text-label-code border border-error/20 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-error"></span>
                  Display Name Spoofing
                </span>
              )}
              {analysis.header_analysis.authentication_failures.map((failure, idx) => (
                <span key={idx} className="px-3 py-1 rounded-full bg-error/10 text-error text-label-code border border-error/20 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-error"></span>
                  {failure}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="flex flex-col md:flex-row items-center justify-between gap-gutter pt-8">
        <button
          onClick={() => navigate('/analyze')}
          className="bg-primary text-on-primary font-bold px-6 py-3 rounded-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          New Analysis
        </button>
        <button
          onClick={createCaseFromAnalysis}
          className="border border-primary/40 text-primary font-bold px-6 py-3 rounded-lg hover:bg-primary/5 active:scale-95 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined">assignment_add</span>
          Create Case
        </button>
        <button
          onClick={() => navigate('/history')}
          className="border border-primary/40 text-primary font-bold px-6 py-3 rounded-lg hover:bg-primary/5 active:scale-95 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined">history</span>
          View History
        </button>
      </footer>
    </div>
  );
};

export default AnalysisResult;
