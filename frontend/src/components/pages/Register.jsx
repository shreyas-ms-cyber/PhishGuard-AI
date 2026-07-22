import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    const result = await register(username, email, password);
    setLoading(false);
    if (result.success) {
      navigate('/login');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-md mx-auto px-margin-mobile md:px-0 flex items-center justify-center min-h-screen">
      <div className="w-full">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 border border-primary/20 shadow-[0_0_20px_rgba(0,218,243,0.2)]">
            {/* Inline SVG Shield – same as Login */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-primary">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <h1 className="font-headline-md text-headline-md text-primary font-bold tracking-tight">PhishGuard AI</h1>
          <p className="font-label-code text-label-code text-on-surface-variant uppercase tracking-widest mt-1 opacity-60">System Protocol: Active</p>
        </div>

        <div className="glass-card p-6 rounded-xl overflow-hidden">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Create Account</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Begin your secure journey.</p>
            </div>
            {error && (
              <div className="bg-error/10 border border-error/20 text-error p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="font-label-code text-label-code text-on-surface-variant block uppercase" htmlFor="username">Username</label>
                <div className="relative group input-focus-glow transition-all duration-300 rounded-lg">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl transition-colors group-focus-within:text-primary">person</span>
                  <input
                    id="username"
                    type="text"
                    className="w-full bg-surface-variant/20 border-0 border-b border-outline-variant/40 py-3 pl-11 pr-4 placeholder:text-outline-variant focus:ring-0 focus:border-primary transition-all font-body-md rounded-t-lg"
                    style={{ color: 'var(--input-text)' }}
                    placeholder="agent007"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-label-code text-label-code text-on-surface-variant block uppercase" htmlFor="email">Email</label>
                <div className="relative group input-focus-glow transition-all duration-300 rounded-lg">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl transition-colors group-focus-within:text-primary">mail</span>
                  <input
                    id="email"
                    type="email"
                    className="w-full bg-surface-variant/20 border-0 border-b border-outline-variant/40 py-3 pl-11 pr-4 placeholder:text-outline-variant focus:ring-0 focus:border-primary transition-all font-body-md rounded-t-lg"
                    style={{ color: 'var(--input-text)' }}
                    placeholder="agent@phishguard.ai"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-label-code text-label-code text-on-surface-variant block uppercase" htmlFor="password">Password</label>
                <div className="relative group input-focus-glow transition-all duration-300 rounded-lg">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl transition-colors group-focus-within:text-primary">lock</span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="w-full bg-surface-variant/20 border-0 border-b border-outline-variant/40 py-3 pl-11 pr-4 placeholder:text-outline-variant focus:ring-0 focus:border-primary transition-all font-body-md rounded-t-lg"
                    style={{ color: 'var(--input-text)' }}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface" onClick={() => setShowPassword(!showPassword)}>
                    <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-label-code text-label-code text-on-surface-variant block uppercase" htmlFor="confirm">Confirm Password</label>
                <div className="relative group input-focus-glow transition-all duration-300 rounded-lg">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl transition-colors group-focus-within:text-primary">lock</span>
                  <input
                    id="confirm"
                    type={showPassword ? 'text' : 'password'}
                    className="w-full bg-surface-variant/20 border-0 border-b border-outline-variant/40 py-3 pl-11 pr-4 placeholder:text-outline-variant focus:ring-0 focus:border-primary transition-all font-body-md rounded-t-lg"
                    style={{ color: 'var(--input-text)' }}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Registering...' : 'Register'}
                <span className="material-symbols-outlined">{loading ? 'sync' : 'arrow_forward'}</span>
              </button>
            </form>
          </div>
          <div className="bg-surface-container-high/50 border-t border-outline-variant/10 px-6 py-4 mt-6 flex justify-between items-center -mx-6 -mb-6 rounded-b-xl">
            <span className="font-label-code text-label-code text-outline uppercase">Auth Status</span>
            <div className="flex gap-2 items-center">
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse shadow-[0_0_10px_rgba(65,238,130,0.5)]"></div>
              <span className="font-label-code text-label-code text-secondary">Secure Gateways Ready</span>
            </div>
          </div>
        </div>

        <p className="text-center mt-6 text-on-surface-variant">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
        </p>

        <footer className="mt-8 text-center">
          <p className="font-label-code text-label-code text-outline-variant">© 2026 PhishGuard Intelligence Systems. Authorized Access Only.</p>
        </footer>
      </div>
    </div>
  );
};

export default Register;
