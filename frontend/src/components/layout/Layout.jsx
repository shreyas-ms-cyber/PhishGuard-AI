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

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative w-full max-w-full overflow-x-hidden">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 glass-card z-50 sticky top-0 w-full">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
          aria-label="Open sidebar"
        >
          <span className="material-symbols-outlined text-on-surface">menu</span>
        </button>
        <span className="font-headline-sm text-primary font-bold">PhishGuard AI</span>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
            aria-label="Toggle theme"
          >
            <span className="material-symbols-outlined text-on-surface">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          <div className="w-8 h-8 rounded-full bg-surface-variant overflow-hidden">
            <span className="material-symbols-outlined text-on-surface">person</span>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-surface-container-low/30 backdrop-blur-32 border-r border-outline-variant/10
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0 md:flex md:flex-col md:h-auto md:bg-surface-container-low/30
        `}
      >
        <div className="p-margin-desktop flex flex-col gap-2 h-full">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <span className="material-symbols-outlined text-primary">shield</span>
            </div>
            <div>
              <h1 className="font-headline-sm text-headline-sm font-bold text-primary">PhishGuard AI</h1>
              <p className="font-label-code text-label-code text-secondary">Vigilance Active</p>
            </div>
          </div>
          <nav className="flex flex-col gap-1 flex-1">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded text-on-surface-variant hover:bg-surface-variant/20 hover:text-on-surface transition-colors ${
                  isActive ? 'text-primary bg-primary/10 border-r-2 border-primary translate-x-1' : ''
                }`
              }
              onClick={closeSidebar}
            >
              <span className="material-symbols-outlined">dashboard</span>
              <span className="font-label-code text-label-code">Dashboard</span>
            </NavLink>
            <NavLink
              to="/analyze"
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded text-on-surface-variant hover:bg-surface-variant/20 hover:text-on-surface transition-colors ${
                  isActive ? 'text-primary bg-primary/10 border-r-2 border-primary translate-x-1' : ''
                }`
              }
              onClick={closeSidebar}
            >
              <span className="material-symbols-outlined">mail_lock</span>
              <span className="font-label-code text-label-code">Analyze Email</span>
            </NavLink>
            <NavLink
              to="/history"
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded text-on-surface-variant hover:bg-surface-variant/20 hover:text-on-surface transition-colors ${
                  isActive ? 'text-primary bg-primary/10 border-r-2 border-primary translate-x-1' : ''
                }`
              }
              onClick={closeSidebar}
            >
              <span className="material-symbols-outlined">history</span>
              <span className="font-label-code text-label-code">History</span>
            </NavLink>
            <NavLink
              to="/reports"
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded text-on-surface-variant hover:bg-surface-variant/20 hover:text-on-surface transition-colors ${
                  isActive ? 'text-primary bg-primary/10 border-r-2 border-primary translate-x-1' : ''
                }`
              }
              onClick={closeSidebar}
            >
              <span className="material-symbols-outlined">assessment</span>
              <span className="font-label-code text-label-code">Reports</span>
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded text-on-surface-variant hover:bg-surface-variant/20 hover:text-on-surface transition-colors ${
                  isActive ? 'text-primary bg-primary/10 border-r-2 border-primary translate-x-1' : ''
                }`
              }
              onClick={closeSidebar}
            >
              <span className="material-symbols-outlined">settings</span>
              <span className="font-label-code text-label-code">Settings</span>
            </NavLink>
            <NavLink
              to="/cases"
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded text-on-surface-variant hover:bg-surface-variant/20 hover:text-on-surface transition-colors ${
                  isActive ? 'text-primary bg-primary/10 border-r-2 border-primary translate-x-1' : ''
                }`
              }
              onClick={closeSidebar}
            >
              <span className="material-symbols-outlined">assignment</span>
              <span className="font-label-code text-label-code">Cases</span>
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded text-on-surface-variant hover:bg-surface-variant/20 hover:text-on-surface transition-colors ${
                  isActive ? 'text-primary bg-primary/10 border-r-2 border-primary translate-x-1' : ''
                }`
              }
              onClick={closeSidebar}
            >
              <span className="material-symbols-outlined">info</span>
              <span className="font-label-code text-label-code">About</span>
            </NavLink>
          </nav>
          <div className="mt-auto border-t border-outline-variant/10 pt-4">
            <div className="mb-4 px-4 py-2 glass-card rounded-lg flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-surface-variant overflow-hidden">
                <span className="material-symbols-outlined text-on-surface">person</span>
              </div>
              <div>
                <p className="font-label-code text-label-code text-on-surface font-sans">{user?.username || 'Agent'}</p>
                <p className="font-label-code text-[10px] text-on-surface-variant font-sans">{user?.email || ''}</p>
              </div>
            </div>
            <nav className="flex flex-col gap-1">
              <NavLink
                to="/support"
                className="flex items-center gap-4 px-4 py-3 rounded text-on-surface-variant hover:bg-surface-variant/20 hover:text-on-surface transition-colors"
                onClick={closeSidebar}
              >
                <span className="material-symbols-outlined">help</span>
                <span className="font-label-code text-label-code">Support</span>
              </NavLink>
              <button
                onClick={handleLogout}
                className="btn-secondary w-full justify-center"
              >
                <span className="material-symbols-outlined">logout</span>
                Logout
              </button>
            </nav>
          </div>
        </div>
      </aside>

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-margin-desktop w-full max-w-full overflow-x-hidden">
        <div className="hidden md:flex justify-end items-center mb-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg glass-card hover:bg-primary/10 transition-colors"
            aria-label="Toggle theme"
          >
            <span className="material-symbols-outlined text-on-surface">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
