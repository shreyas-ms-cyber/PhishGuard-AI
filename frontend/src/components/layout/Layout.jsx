import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const Layout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const closeSidebar = () => setSidebarOpen(false);

  const navGroups = [
    {
      label: 'Detection',
      items: [
        { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
        { to: '/analyze', icon: 'mail_lock', label: 'Analyze Email' },
        { to: '/history', icon: 'history', label: 'History' },
      ],
    },
    {
      label: 'Intelligence',
      items: [
        { to: '/reports', icon: 'assessment', label: 'Reports' },
        { to: '/cases', icon: 'assignment', label: 'Cases' },
        { to: '/ai-chat', icon: 'chat', label: 'AI Chat' },
      ],
    },
    {
      label: 'System',
      items: [
        { to: '/settings', icon: 'settings', label: 'Settings' },
        { to: '/about', icon: 'info', label: 'About' },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative w-full max-w-full overflow-x-hidden bg-background">
      {/* Mobile Header */}
      <header
        className={`md:hidden flex items-center justify-between p-4 z-50 sticky top-0 w-full transition-all duration-300 ${
          sidebarOpen
            ? 'bg-surface border-b border-glass-border'
            : 'glass-card'
        }`}
      >
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
          aria-label="Toggle sidebar"
        >
          <span className="material-symbols-outlined text-on-surface">menu</span>
        </button>
        <span className="font-display text-sm font-bold text-primary">PhishGuard AI</span>
        <div className="w-8" />
      </header>

      {/* Sidebar - Fixed unstable logo + opaque background */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 flex flex-col
          bg-surface border-r border-glass-border
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0 md:flex md:flex-col md:min-h-screen
        `}
      >
        {/* Brand - ALWAYS renders with icon, title, subtitle - no conditional logic */}
        <div className="flex-shrink-0 p-6 pb-4 border-b border-glass-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 flex-shrink-0">
              <span className="material-symbols-outlined text-primary text-sm">shield</span>
            </div>
            <div>
              <h1 className="font-display text-sm font-bold text-primary tracking-tight">PhishGuard AI</h1>
              <p className="font-label-code text-[10px] text-secondary uppercase tracking-widest">Vigilance Active</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {navGroups.map((group) => (
            <div key={group.label}>
              <h3 className="font-label-code text-[10px] text-muted uppercase tracking-wider mb-2 px-3">
                {group.label}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'text-primary bg-primary/10 border-l-2 border-primary shadow-[0_0_20px_rgba(0,229,255,0.05)]'
                          : 'text-on-surface-variant hover:text-on-surface hover:bg-surface/50'
                      }`
                    }
                    onClick={closeSidebar}
                  >
                    <span className="material-symbols-outlined text-lg flex-shrink-0">
                      {item.icon}
                    </span>
                    <span className="font-body-sm text-sm font-medium">{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="flex-shrink-0 p-4 border-t border-glass-border space-y-3">
          <div className="glass-card p-3 rounded-lg flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-surface/50 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-on-surface text-sm">person</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-body-sm text-sm text-on-surface truncate">{user?.username || 'Agent'}</p>
              <p className="font-label-code text-[10px] text-muted truncate">{user?.email || ''}</p>
            </div>
          </div>
          <div className="space-y-1">
            <NavLink
              to="/support"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface/50 transition-colors"
              onClick={closeSidebar}
            >
              <span className="material-symbols-outlined text-lg flex-shrink-0">help</span>
              <span className="font-body-sm text-sm">Support</span>
            </NavLink>
            <button
              onClick={() => {
                handleLogout();
                closeSidebar();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors"
            >
              <span className="material-symbols-outlined text-lg flex-shrink-0">logout</span>
              <span className="font-body-sm text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop - Completely opaque, no blur */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen p-4 md:p-6 relative">
        <div className="flex items-center justify-between mb-6">
          <div className="hidden md:block" />
          <div className="flex items-center gap-3 ml-auto">
            <button className="p-2 rounded-lg glass-card text-on-surface-variant hover:text-primary transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-error animate-pulse-once" />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg glass-card text-on-surface-variant hover:text-primary transition-colors transition-all duration-300"
            >
              <span className="material-symbols-outlined">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 glass-card rounded-full">
              <div className="w-6 h-6 rounded-full bg-surface/50 flex items-center justify-center">
                <span className="material-symbols-outlined text-on-surface text-sm">person</span>
              </div>
              <span className="font-body-sm text-sm text-on-surface">{user?.username || 'Agent'}</span>
            </div>
          </div>
        </div>

        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
