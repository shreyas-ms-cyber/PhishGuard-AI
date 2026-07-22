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
    const colors = {
      'Low': 'bg-secondary/10 text-secondary border-secondary/20',
      'Medium': 'bg-tertiary-container/10 text-tertiary-container border-tertiary-container/20',
      'High': 'bg-error/10 text-error border-error/20',
      'Critical': 'bg-error/10 text-error border-error/20'
    };
    return colors[severity] || colors['Medium'];
  };

  const getStatusBadge = (status) => {
    const colors = {
      'Open': 'bg-primary/10 text-primary border-primary/20',
      'Investigating': 'bg-tertiary-container/10 text-tertiary-container border-tertiary-container/20',
      'Contained': 'bg-secondary/10 text-secondary border-secondary/20',
      'Resolved': 'bg-secondary/10 text-secondary border-secondary/20',
      'Closed': 'bg-surface-variant/50 text-on-surface-variant border-outline-variant/20'
    };
    return colors[status] || colors['Open'];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-primary animate-pulse">Loading cases...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-4 md:pt-0 w-full max-w-full">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="font-headline-md text-headline-md font-bold text-primary">Investigations</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Manage your investigation cases.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="btn-primary"
        >
          <span className="material-symbols-outlined">add</span>
          New Case
        </button>
      </header>

      {showCreate && (
        <div className="glass-card p-6 rounded-xl w-full">
          <h3 className="font-headline-sm text-headline-sm text-primary mb-4">Create New Case</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Case Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-surface-container-lowest/50 border border-outline-variant/30 rounded-lg p-2 text-sm text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary/50"
            />
            <textarea
              placeholder="Description (optional)"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full bg-surface-container-lowest/50 border border-outline-variant/30 rounded-lg p-2 text-sm text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary/50 resize-none h-24"
            />
            <select
              value={newSeverity}
              onChange={(e) => setNewSeverity(e.target.value)}
              className="w-full bg-surface-container-lowest/50 border border-outline-variant/30 rounded-lg p-2 text-sm text-on-surface focus:outline-none focus:border-primary/50"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
            <div className="flex gap-3">
              <button onClick={createCase} className="btn-primary">Create</button>
              <button onClick={() => setShowCreate(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {cases.length === 0 ? (
        <div className="glass-card p-12 text-center text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl block mb-4 opacity-30">description</span>
          <p>No cases yet. Start an investigation by creating a case.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {cases.map((caseItem) => (
            <div key={caseItem.id} className="glass-card p-4 rounded-xl w-full hover:border-primary/30 transition-colors cursor-pointer" onClick={() => navigate(`/cases/${caseItem.id}`)}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">{caseItem.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase border ${getSeverityBadge(caseItem.severity)}`}>
                      {caseItem.severity}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase border ${getStatusBadge(caseItem.status)}`}>
                      {caseItem.status}
                    </span>
                  </div>
                  <p className="font-body-sm text-on-surface-variant mt-1">
                    {caseItem.analysis_count} analysis{caseItem.analysis_count !== 1 ? 'es' : ''} • {caseItem.note_count} note{caseItem.note_count !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="text-sm text-on-surface-variant">
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
