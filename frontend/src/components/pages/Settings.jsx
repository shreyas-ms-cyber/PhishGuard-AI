import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import api from '../../api/axiosConfig';

const Settings = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [auditLogs, setAuditLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoadingLogs(true);
      try {
        const res = await api.get('/audit/logs?limit=20');
        setAuditLogs(res.data);
      } catch (error) {
        console.error('Failed to fetch audit logs:', error);
      } finally {
        setLoadingLogs(false);
      }
    };
    fetchLogs();
  }, []);

  const getActionDisplay = (action) => {
    const map = {
      'analysis': '📄 Analysis Created',
      'feedback': '💬 Feedback Submitted',
      'case_create': '📁 Case Created',
      'case_update': '✏️ Case Updated',
      'case_delete': '🗑️ Case Deleted',
      'note_add': '📝 Note Added',
      'note_delete': '📝 Note Deleted',
    };
    return map[action] || action;
  };

  return (
    <div className="space-y-4 pt-4 md:pt-0 w-full max-w-full">
      <header>
        <h2 className="font-headline-md text-headline-md font-bold text-primary">Settings</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">Manage your account and preferences.</p>
      </header>

      {/* Profile */}
      <div className="glass-card p-6 rounded-xl w-full">
        <h3 className="font-headline-sm text-headline-sm text-primary mb-4">Profile</h3>
        <div className="space-y-2">
          <div className="flex justify-between border-b border-outline-variant/10 pb-2">
            <span className="font-body-md text-on-surface-variant">Username</span>
            <span className="font-body-md text-on-surface">{user?.username || '—'}</span>
          </div>
          <div className="flex justify-between border-b border-outline-variant/10 pb-2">
            <span className="font-body-md text-on-surface-variant">Email</span>
            <span className="font-body-md text-on-surface">{user?.email || '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-body-md text-on-surface-variant">Account Created</span>
            <span className="font-body-md text-on-surface">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}</span>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="glass-card p-6 rounded-xl w-full">
        <h3 className="font-headline-sm text-headline-sm text-primary mb-4">Appearance</h3>
        <div className="flex items-center justify-between">
          <span className="font-body-md text-on-surface-variant">Theme</span>
          <div className="flex items-center gap-3">
            <span className="font-body-sm text-on-surface-variant capitalize">{theme}</span>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg glass-card hover:bg-primary/10 transition-colors"
            >
              <span className="material-symbols-outlined text-on-surface">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="glass-card p-6 rounded-xl w-full">
        <h3 className="font-headline-sm text-headline-sm text-primary mb-4">Security</h3>
        <div className="space-y-2">
          <div className="flex justify-between border-b border-outline-variant/10 pb-2">
            <span className="font-body-md text-on-surface-variant">Authentication Status</span>
            <span className="font-body-md text-secondary flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              Authenticated
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-body-md text-on-surface-variant">Session</span>
            <span className="font-body-md text-on-surface-variant">Active</span>
          </div>
        </div>
      </div>

      {/* Audit Logs */}
      <div className="glass-card p-6 rounded-xl w-full">
        <h3 className="font-headline-sm text-headline-sm text-primary mb-4">Recent Activity (Audit Logs)</h3>
        {loadingLogs ? (
          <div className="text-center py-4 text-on-surface-variant">Loading logs...</div>
        ) : auditLogs.length === 0 ? (
          <div className="text-center py-4 text-on-surface-variant">No audit logs yet.</div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
            {auditLogs.map((log) => (
              <div key={log.id} className="flex justify-between items-center py-2 border-b border-outline-variant/10 text-sm">
                <span className="text-on-surface">{getActionDisplay(log.action)}</span>
                <span className="text-on-surface-variant">{new Date(log.created_at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
