import React from 'react';

const AuthCard = ({ children, title, subtitle, icon = 'shield' }) => {
  return (
    <div className="relative z-10 w-full max-w-md mx-auto px-4 md:px-0 flex items-center justify-center min-h-screen py-8">
      <div className="w-full">
        {/* Logo & Brand */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 border border-primary/20 shadow-[0_0_30px_rgba(0,229,255,0.15)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-primary">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <h1 className="font-display text-2xl font-bold text-primary tracking-tight">PhishGuard AI</h1>
          <p className="font-label-code text-label-code text-on-surface-variant uppercase tracking-widest mt-1 opacity-60 text-xs">System Protocol: Active</p>
        </div>

        {/* Auth Card */}
        <div className="glass-card p-6 rounded-2xl overflow-hidden">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="font-display text-xl font-semibold text-on-surface">{title}</h2>
              {subtitle && (
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{subtitle}</p>
              )}
            </div>
            {children}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center">
          <p className="font-label-code text-[10px] text-on-surface-variant/50 uppercase tracking-wider">
            © 2026 PhishGuard Intelligence Systems. Authorized Access Only.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AuthCard;
