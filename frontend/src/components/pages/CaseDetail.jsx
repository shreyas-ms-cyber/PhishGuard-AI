import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/axiosConfig';

const CaseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editSeverity, setEditSeverity] = useState('Medium');
  const [editStatus, setEditStatus] = useState('Open');

  const fetchCase = async () => {
    try {
      const res = await api.get(`/cases/${id}`);
      setCaseData(res.data);
      setEditTitle(res.data.title);
      setEditDescription(res.data.description || '');
      setEditSeverity(res.data.severity);
      setEditStatus(res.data.status);
    } catch (error) {
      console.error('Failed to fetch case:', error);
      navigate('/cases');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCase();
  }, [id]);

  const addNote = async () => {
    if (!newNote.trim()) return;
    try {
      const res = await api.post(`/cases/${id}/notes`, { content: newNote });
      setCaseData({
        ...caseData,
        notes: [...caseData.notes, res.data]
      });
      setNewNote('');
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  const updateCase = async () => {
    try {
      const res = await api.put(`/cases/${id}`, {
        title: editTitle,
        description: editDescription,
        severity: editSeverity,
        status: editStatus
      });
      setCaseData(res.data);
      setEditing(false);
    } catch (error) {
      console.error('Failed to update case:', error);
    }
  };

  const deleteCase = async () => {
    if (!confirm('Delete this case?')) return;
    try {
      await api.delete(`/cases/${id}`);
      navigate('/cases');
    } catch (error) {
      console.error('Failed to delete case:', error);
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
        <div className="text-primary animate-pulse">Loading case...</div>
      </div>
    );
  }

  if (!caseData) return null;

  return (
    <div className="space-y-4 pt-4 md:pt-0 w-full max-w-full">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="font-headline-md text-headline-md font-bold text-primary">{caseData.title}</h2>
            <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase border ${getSeverityBadge(caseData.severity)}`}>
              {caseData.severity}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase border ${getStatusBadge(caseData.status)}`}>
              {caseData.status}
            </span>
            <span className="text-on-surface-variant text-sm">Case #{caseData.id}</span>
          </div>
          {caseData.description && (
            <p className="text-on-surface-variant mt-1">{caseData.description}</p>
          )}
          <p className="text-on-surface-variant text-sm mt-1">
            Created: {new Date(caseData.created_at).toLocaleString()}
            {caseData.updated_at && ` • Updated: ${new Date(caseData.updated_at).toLocaleString()}`}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setEditing(true)} className="btn-secondary text-sm">
            Edit
          </button>
          <button onClick={deleteCase} className="text-error hover:bg-error/10 px-3 py-1 rounded-lg text-sm transition-colors">
            Delete
          </button>
        </div>
      </div>

      {editing && (
        <div className="glass-card p-6 rounded-xl w-full">
          <h3 className="font-headline-sm text-headline-sm text-primary mb-4">Edit Case</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full bg-surface-container-lowest/50 border border-outline-variant/30 rounded-lg p-2 text-sm text-on-surface"
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full bg-surface-container-lowest/50 border border-outline-variant/30 rounded-lg p-2 text-sm text-on-surface resize-none h-24"
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-label-code text-label-code text-on-surface-variant block mb-1">Severity</label>
                <select
                  value={editSeverity}
                  onChange={(e) => setEditSeverity(e.target.value)}
                  className="w-full bg-surface-container-lowest/50 border border-outline-variant/30 rounded-lg p-2 text-sm text-on-surface"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="font-label-code text-label-code text-on-surface-variant block mb-1">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full bg-surface-container-lowest/50 border border-outline-variant/30 rounded-lg p-2 text-sm text-on-surface"
                >
                  <option value="Open">Open</option>
                  <option value="Investigating">Investigating</option>
                  <option value="Contained">Contained</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={updateCase} className="btn-primary">Save</button>
              <button onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="glass-card p-4 rounded-xl w-full">
        <h3 className="font-headline-sm text-headline-sm text-primary mb-3">Linked Analyses</h3>
        {caseData.analyses && caseData.analyses.length > 0 ? (
          <div className="space-y-2">
            {caseData.analyses.map((analysis) => (
              <div key={analysis.id} className="flex justify-between items-center p-3 rounded-lg bg-surface-container/30 border border-outline-variant/10">
                <div>
                  <Link to={`/result/${analysis.id}`} className="text-primary hover:underline">
                    #{analysis.id} - {analysis.subject || 'No subject'}
                  </Link>
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] uppercase border ${
                    analysis.risk_level === 'Safe' ? 'bg-secondary/10 text-secondary border-secondary/20' :
                    analysis.risk_level === 'Suspicious' ? 'bg-tertiary-container/10 text-tertiary-container border-tertiary-container/20' :
                    'bg-error/10 text-error border-error/20'
                  }`}>
                    {analysis.risk_level}
                  </span>
                </div>
                <div className="text-sm text-on-surface-variant">
                  Score: {analysis.risk_score}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-on-surface-variant">No analyses linked yet.</p>
        )}
      </div>

      <div className="glass-card p-4 rounded-xl w-full">
        <h3 className="font-headline-sm text-headline-sm text-primary mb-3">Analyst Notes</h3>
        <div className="space-y-3">
          {caseData.notes && caseData.notes.length > 0 ? (
            caseData.notes.map((note) => (
              <div key={note.id} className="p-3 rounded-lg bg-surface-container/30 border border-outline-variant/10">
                <p className="text-on-surface whitespace-pre-wrap">{note.content}</p>
                <div className="text-xs text-on-surface-variant mt-1">
                  {new Date(note.created_at).toLocaleString()}
                </div>
              </div>
            ))
          ) : (
            <p className="text-on-surface-variant">No notes yet.</p>
          )}
          <div className="flex gap-2 mt-2">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note..."
              className="flex-1 bg-surface-container-lowest/50 border border-outline-variant/30 rounded-lg p-2 text-sm text-on-surface resize-none h-20"
            />
            <button onClick={addNote} className="btn-primary self-end">Add Note</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDetail;
