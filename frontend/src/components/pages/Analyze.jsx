import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';

const Analyze = () => {
  const [emailContent, setEmailContent] = useState('');
  const [subject, setSubject] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [fileError, setFileError] = useState('');
  const [analysisStatus, setAnalysisStatus] = useState({
    keyword: 'pending',
    url: 'pending',
    threat: 'pending',
  });
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileError('');

    if (!file.name.endsWith('.txt')) {
      setFileError('Only .txt files are allowed.');
      return;
    }

    if (file.size > 500 * 1024) {
      setFileError('File size exceeds 500KB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      setEmailContent(content);
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const simulateScan = () => {
    return new Promise((resolve) => {
      const steps = ['keyword', 'url', 'threat'];
      let index = 0;

      const runStep = () => {
        if (index >= steps.length) {
          resolve();
          return;
        }

        const step = steps[index];
        setAnalysisStatus((prev) => ({ ...prev, [step]: 'in_progress' }));

        setTimeout(() => {
          setAnalysisStatus((prev) => ({ ...prev, [step]: 'complete' }));
          index++;
          setTimeout(runStep, 400);
        }, 600);
      };

      runStep();
    });
  };

  const handleAnalyze = async () => {
    const trimmed = emailContent.trim();
    if (!trimmed) {
      setError('Please enter email content.');
      return;
    }
    if (trimmed.length < 10) {
      setError('Email content must be at least 10 characters for meaningful analysis.');
      return;
    }

    setError('');
    setIsAnalyzing(true);
    setAnalysisStatus({ keyword: 'pending', url: 'pending', threat: 'pending' });

    try {
      // Run the scan animation first
      await simulateScan();

      // Then make the actual API call
      const response = await api.post('/analyze/', {
        content: trimmed,
        subject: subject.trim() || null,
      });
      navigate('/result', { state: { analysis: response.data } });
    } catch (err) {
      console.error('Analysis error:', err);
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : 'Analysis failed. Please try again.');
      setAnalysisStatus({ keyword: 'pending', url: 'pending', threat: 'pending' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAnalyze();
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <span className="material-symbols-outlined text-muted text-sm">pending</span>;
      case 'in_progress':
        return <span className="material-symbols-outlined text-primary text-sm animate-spin">sync</span>;
      case 'complete':
        return <span className="material-symbols-outlined text-status-safe text-sm">check_circle</span>;
      default:
        return null;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'Waiting...';
      case 'in_progress':
        return 'Scanning...';
      case 'complete':
        return 'Complete';
      default:
        return '';
    }
  };

  const getStatusBarWidth = (status) => {
    switch (status) {
      case 'pending':
        return 'w-0';
      case 'in_progress':
        return 'w-1/2';
      case 'complete':
        return 'w-full';
      default:
        return 'w-0';
    }
  };

  const getStatusBarColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-muted';
      case 'in_progress':
        return 'bg-primary';
      case 'complete':
        return 'bg-status-safe';
      default:
        return 'bg-muted';
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6 pt-4 md:pt-0 w-full max-w-full">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-on-surface">New Analysis</h1>
        <p className="text-muted text-sm">Perform deep neural inspection of suspicious email vectors.</p>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 flex-1">
        {/* Left: Input Area */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <section className="glass-card rounded-xl p-6 flex flex-col gap-6 relative overflow-hidden">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined">terminal</span>
              <h3 className="font-label-code text-xs text-primary uppercase tracking-widest">Neural Input Vector</h3>
            </div>

            <div className="flex flex-col gap-4">
              <input
                type="text"
                className="w-full bg-input border border-glass-border rounded-lg p-3 text-on-surface placeholder:text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all font-body-md text-sm"
                placeholder="Subject (optional)"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />

              <textarea
                className="w-full h-48 md:h-64 bg-input border border-glass-border rounded-lg p-4 font-mono text-sm text-on-surface placeholder:text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all resize-none custom-scrollbar"
                placeholder="Paste email body here (minimum 10 characters)..."
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
              />

              {(fileError || error) && (
                <div className="bg-error/10 border border-error/20 text-error p-3 rounded-lg text-sm">
                  {fileError || error}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <div
                  className="btn-secondary flex-1 justify-center border-dashed hover:border-solid cursor-pointer transition-all"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <span className="material-symbols-outlined">upload_file</span>
                  Upload .txt
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".txt"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <button
                  onClick={handleAnalyze}
                  disabled={!emailContent.trim() || isAnalyzing}
                  className={`btn-primary flex-1 justify-center py-3 text-base transition-all ${
                    isAnalyzing ? 'opacity-90' : ''
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">sync</span>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">bolt</span>
                      Analyze Email
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Right: Analysis Status Panel */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <section className="glass-card rounded-xl p-6 flex flex-col gap-6 relative scanner-effect flex-1">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined">data_exploration</span>
              <h3 className="font-label-code text-xs text-primary uppercase tracking-widest">Analysis Status</h3>
            </div>

            <div className="flex flex-col gap-5 flex-1 justify-center">
              {/* Keyword Scan */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-label-code text-xs text-on-surface-variant">Keyword Scan</span>
                  <div className="flex items-center gap-2">
                    <span className="font-label-code text-[10px] text-muted">{getStatusLabel(analysisStatus.keyword)}</span>
                    {getStatusIcon(analysisStatus.keyword)}
                  </div>
                </div>
                <div className="h-1 w-full bg-surface/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-700 ease-out ${getStatusBarColor(analysisStatus.keyword)} ${getStatusBarWidth(analysisStatus.keyword)}`}
                  />
                </div>
              </div>

              {/* URL Analysis */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-label-code text-xs text-on-surface-variant">URL Analysis</span>
                  <div className="flex items-center gap-2">
                    <span className="font-label-code text-[10px] text-muted">{getStatusLabel(analysisStatus.url)}</span>
                    {getStatusIcon(analysisStatus.url)}
                  </div>
                </div>
                <div className="h-1 w-full bg-surface/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-700 ease-out ${getStatusBarColor(analysisStatus.url)} ${getStatusBarWidth(analysisStatus.url)}`}
                  />
                </div>
              </div>

              {/* Threat Assessment */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-label-code text-xs text-on-surface-variant">Threat Assessment</span>
                  <div className="flex items-center gap-2">
                    <span className="font-label-code text-[10px] text-muted">{getStatusLabel(analysisStatus.threat)}</span>
                    {getStatusIcon(analysisStatus.threat)}
                  </div>
                </div>
                <div className="h-1 w-full bg-surface/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-700 ease-out ${getStatusBarColor(analysisStatus.threat)} ${getStatusBarWidth(analysisStatus.threat)}`}
                  />
                </div>
              </div>

              {/* Threat Level Gauge (static placeholder) */}
              <div className="mt-4 pt-4 border-t border-glass-border flex flex-col items-center">
                <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle className="text-surface/30" cx="64" cy="64" fill="none" r="56" stroke="currentColor" strokeWidth="8" />
                    <circle
                      className="text-primary transition-all duration-1000 ease-out"
                      cx="64"
                      cy="64"
                      fill="none"
                      r="56"
                      stroke="currentColor"
                      strokeDasharray="352"
                      strokeDashoffset={isAnalyzing ? '176' : '352'}
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display text-lg font-bold text-on-surface">
                      {isAnalyzing ? '🔍' : '0%'}
                    </span>
                    <span className="font-label-code text-[8px] uppercase text-muted tracking-wider">Threat Level</span>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  <span className="px-2 py-1 bg-surface/30 border border-glass-border rounded font-label-code text-[8px] text-muted">
                    {isAnalyzing ? 'SCANNING...' : 'WAITING FOR INPUT'}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Analyze;
