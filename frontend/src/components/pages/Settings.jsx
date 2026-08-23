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
    <div className="space-y-6 pt-4 md:pt-0 w-full max-w-full">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-on-surface">Settings</h1>
        <p className="text-muted text-sm">Manage your account and preferences.</p>
      </div>

      {/* Profile */}
      <div className="glass-card p-6 rounded-xl">
        <h3 className="font-display text-sm font-semibold text-on-surface mb-4">Profile</h3>
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-glass-border pb-3">
            <span className="text-sm text-muted">Username</span>
            <span className="text-sm text-on-surface font-medium">{user?.username || '—'}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-glass-border pb-3">
            <span className="text-sm text-muted">Email</span>
            <span className="text-sm text-on-surface font-medium">{user?.email || '—'}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <span className="text-sm text-muted">Account Created</span>
            <span className="text-sm text-on-surface font-medium">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}</span>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="glass-card p-6 rounded-xl">
        <h3 className="font-display text-sm font-semibold text-on-surface mb-4">Appearance</h3>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted">Theme</span>
          <div className="flex items-center gap-3">
            <span className="font-label-code text-xs text-muted uppercase tracking-wider">{theme}</span>
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
      <div className="glass-card p-6 rounded-xl">
        <h3 className="font-display text-sm font-semibold text-on-surface mb-4">Security</h3>
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-glass-border pb-3">
            <span className="text-sm text-muted">Authentication Status</span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-status-safe animate-pulse shadow-[0_0_10px_rgba(0,210,106,0.3)]" />
              <span className="text-sm text-status-safe font-medium">Authenticated</span>
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <span className="text-sm text-muted">Session</span>
            <span className="text-sm text-on-surface font-medium">Active</span>
          </div>
        </div>
      </div>

      {/* Audit Logs */}
      <div className="glass-card p-6 rounded-xl">
        <h3 className="font-display text-sm font-semibold text-on-surface mb-4">Recent Activity</h3>
        {loadingLogs ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : auditLogs.length === 0 ? (
          <div className="text-center py-8 text-muted text-sm">No audit logs yet.</div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
            {auditLogs.map((log) => (
              <div key={log.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-glass-border/50 last:border-0">
                <span className="text-sm text-on-surface">{getActionDisplay(log.action)}</span>
                <span className="font-mono text-xs text-muted">{new Date(log.created_at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
