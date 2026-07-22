import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';

const Analyze = () => {
  const [emailContent, setEmailContent] = useState('');
  const [subject, setSubject] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Reset file error
    setFileError('');

    // Validate file type
    if (!file.name.endsWith('.txt')) {
      setFileError('Only .txt files are allowed.');
      return;
    }

    // Validate file size (max 500KB)
    if (file.size > 500 * 1024) {
      setFileError('File size exceeds 500KB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      setEmailContent(content);
      // Optionally, extract subject from first line or filename
    };
    reader.readAsText(file);
    // Clear the input so the same file can be re-uploaded
    event.target.value = '';
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

    try {
      const response = await api.post('/analyze/', {
        content: trimmed,
        subject: subject.trim() || null
      });
      navigate('/result', { state: { analysis: response.data } });
    } catch (err) {
      console.error('Analysis error:', err);
      const detail = err.response?.data?.detail;
      if (typeof detail === 'string') {
        setError(detail);
      } else {
        setError('Analysis failed. Please try again.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4 pt-4 md:pt-0 w-full max-w-full">
      <header>
        <h2 className="font-headline-md text-headline-md font-bold text-primary">New Analysis</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">Perform deep neural inspection of suspicious email vectors.</p>
      </header>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 flex-1 w-full">
        <div className="lg:col-span-8 flex flex-col gap-4 w-full">
          <section className="glass-card rounded-xl p-4 md:p-6 flex flex-col gap-4 relative overflow-hidden w-full">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined">terminal</span>
              <h3 className="font-label-code text-label-code uppercase tracking-widest text-sm">Neural Input Vector</h3>
            </div>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                className="w-full bg-surface-container-lowest/50 border border-outline-variant/30 rounded-lg p-3 text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all text-sm"
                placeholder="Subject (optional)"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
              <textarea
                className="w-full h-48 md:h-64 bg-surface-container-lowest/50 border border-outline-variant/30 rounded-lg p-4 font-label-code text-label-code text-on-surface focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all resize-none custom-scrollbar text-sm"
                placeholder="Paste email body here (minimum 10 characters)..."
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                spellCheck={false}
              />
              {fileError && (
                <div className="bg-error/10 border border-error/20 text-error p-3 rounded-lg text-sm">
                  {fileError}
                </div>
              )}
              {error && (
                <div className="bg-error/10 border border-error/20 text-error p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                {/* Upload .txt – clickable */}
                <div
                  className="btn-secondary flex-1 justify-center border-dashed hover:border-solid cursor-pointer"
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
                  className="btn-primary flex-1"
                >
                  <span className="material-symbols-outlined">{isAnalyzing ? 'sync' : 'bolt'}</span>
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Email'}
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-4 w-full">
          <section className="glass-card rounded-xl p-4 md:p-6 flex flex-col gap-4 relative scanner-effect w-full">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined">data_exploration</span>
              <h3 className="font-label-code text-label-code uppercase tracking-widest text-sm">Analysis Status</h3>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="font-label-code text-label-code text-on-surface-variant text-xs">Keyword Scan</span>
                  <span className="material-symbols-outlined text-outline-variant text-sm">pending</span>
                </div>
                <div className="h-1.5 w-full bg-surface-variant rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-0 transition-all duration-700"></div>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="font-label-code text-label-code text-on-surface-variant text-xs">URL Analysis</span>
                  <span className="material-symbols-outlined text-outline-variant text-sm">pending</span>
                </div>
                <div className="h-1.5 w-full bg-surface-variant rounded-full overflow-hidden">
                  <div className="h-full bg-secondary w-0 transition-all duration-700"></div>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="font-label-code text-label-code text-on-surface-variant text-xs">Threat Assessment</span>
                  <span className="material-symbols-outlined text-outline-variant text-sm">pending</span>
                </div>
                <div className="h-1.5 w-full bg-surface-variant rounded-full overflow-hidden">
                  <div className="h-full bg-tertiary-fixed-dim w-0 transition-all duration-700"></div>
                </div>
              </div>
              <div className="mt-2 pt-4 border-t border-outline-variant/10 flex flex-col items-center">
                <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle className="text-surface-variant" cx="64" cy="64" fill="none" r="56" stroke="currentColor" strokeWidth="8"></circle>
                    <circle className="text-primary transition-all duration-1000 ease-out" cx="64" cy="64" fill="none" r="56" stroke="currentColor" strokeDasharray="352" strokeDashoffset="352" strokeWidth="8"></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-headline-lg text-headline-lg font-bold text-sm md:text-base">0%</span>
                    <span className="font-label-code text-[8px] md:text-[10px] uppercase text-outline-variant">Threat Level</span>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 justify-center">
                  <span className="px-2 py-1 bg-surface-variant/30 border border-outline-variant/20 rounded font-label-code text-[8px] md:text-[10px] text-on-surface-variant">WAITING FOR INPUT</span>
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
