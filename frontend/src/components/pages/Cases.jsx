import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';

const Cases = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newSeverity, setNewSeverity] = useState('Medium');
  const navigate = useNavigate();

  const fetchCases = async () => {
    try {
      const res = await api.get('/cases');
      setCases(res.data);
    } catch (error) {
      console.error('Failed to fetch cases:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const createCase = async () => {
    if (!newTitle.trim()) return;
    try {
      const res = await api.post('/cases', {
        title: newTitle,
        description: newDescription || null,
        severity: newSeverity,
        analysis_ids: []
      });
      setCases([res.data, ...cases]);
      setShowCreate(false);
      setNewTitle('');
      setNewDescription('');
      setNewSeverity('Medium');
    } catch (error) {
      console.error('Failed to create case:', error);
    }
  };

  const getSeverityBadge = (severity) => {
    const classes = {
      'Low': 'bg-status-safe/10 text-status-safe border-status-safe/20',
      'Medium': 'bg-status-suspicious/10 text-status-suspicious border-status-suspicious/20',
      'High': 'bg-status-high-risk/10 text-status-high-risk border-status-high-risk/20',
      'Critical': 'bg-status-high-risk/20 text-status-high-risk border-status-high-risk/30',
    };
    return classes[severity] || classes['Medium'];
  };

  const getStatusBadge = (status) => {
    const classes = {
      'Open': 'bg-primary/10 text-primary border-primary/20',
      'Investigating': 'bg-status-suspicious/10 text-status-suspicious border-status-suspicious/20',
      'Contained': 'bg-status-safe/10 text-status-safe border-status-safe/20',
      'Resolved': 'bg-status-safe/20 text-status-safe border-status-safe/30',
      'Closed': 'bg-muted/10 text-muted border-muted/20',
    };
    return classes[status] || classes['Open'];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-muted text-sm">Loading cases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-4 md:pt-0 w-full max-w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-on-surface">Investigations</h1>
          <p className="text-muted text-sm">Manage your investigation cases.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="btn-primary"
        >
          <span className="material-symbols-outlined">add</span>
          New Case
        </button>
      </div>

      {/* Create Case Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-card p-6 rounded-xl w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold text-on-surface">Create New Case</h3>
              <button
                onClick={() => setShowCreate(false)}
                className="text-muted hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="font-label-code text-[10px] text-muted uppercase tracking-wider block mb-1.5">Case Title</label>
                <input
                  type="text"
                  placeholder="Enter case title..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-input border border-glass-border rounded-lg p-2.5 text-sm text-on-surface placeholder:text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                />
              </div>
              <div>
                <label className="font-label-code text-[10px] text-muted uppercase tracking-wider block mb-1.5">Description</label>
                <textarea
                  placeholder="Describe the case (optional)..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-input border border-glass-border rounded-lg p-2.5 text-sm text-on-surface placeholder:text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all resize-none h-24"
                />
              </div>
              <div>
                <label className="font-label-code text-[10px] text-muted uppercase tracking-wider block mb-1.5">Severity</label>
                <select
                  value={newSeverity}
                  onChange={(e) => setNewSeverity(e.target.value)}
                  className="w-full bg-input border border-glass-border rounded-lg p-2.5 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={createCase} className="btn-primary flex-1 justify-center">Create</button>
                <button onClick={() => setShowCreate(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cases List */}
      {cases.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-muted/30 block mb-4">description</span>
          <p className="text-on-surface/60 font-medium">No cases yet</p>
          <p className="text-muted text-sm mt-1">Start an investigation by creating a case.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {cases.map((caseItem) => (
            <div
              key={caseItem.id}
              className="glass-card p-5 rounded-xl hover:translate-y-[-2px] transition-all duration-200 cursor-pointer"
              onClick={() => navigate(`/cases/${caseItem.id}`)}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-display text-base font-semibold text-on-surface truncate">{caseItem.title}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase border ${getSeverityBadge(caseItem.severity)}`}>
                      {caseItem.severity}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase border ${getStatusBadge(caseItem.status)}`}>
                      {caseItem.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted mt-1">
                    {caseItem.analysis_count} analysis{caseItem.analysis_count !== 1 ? 'es' : ''} • {caseItem.note_count} note{caseItem.note_count !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="font-mono text-xs text-muted flex-shrink-0">
                  {new Date(caseItem.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cases;
