import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AuthCard from '../auth/AuthCard';

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
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

      <AuthCard
        title="Create Account"
        subtitle="Begin your secure journey."
      >
        {error && (
          <div className="bg-error/10 border border-error/20 text-error p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="font-label-code text-[10px] text-on-surface-variant uppercase tracking-wider" htmlFor="username">
              Username
            </label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xl transition-colors group-focus-within:text-primary">
                person
              </span>
              <input
                id="username"
                type="text"
                className="w-full bg-input border border-glass-border rounded-lg py-3 pl-11 pr-4 text-on-surface placeholder:text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all font-body-md"
                placeholder="agent007"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-label-code text-[10px] text-on-surface-variant uppercase tracking-wider" htmlFor="email">
              Email
            </label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xl transition-colors group-focus-within:text-primary">
                mail
              </span>
              <input
                id="email"
                type="email"
                className="w-full bg-input border border-glass-border rounded-lg py-3 pl-11 pr-4 text-on-surface placeholder:text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all font-body-md"
                placeholder="agent@phishguard.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-label-code text-[10px] text-on-surface-variant uppercase tracking-wider" htmlFor="password">
              Password
            </label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xl transition-colors group-focus-within:text-primary">
                lock
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="w-full bg-input border border-glass-border rounded-lg py-3 pl-11 pr-12 text-on-surface placeholder:text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all font-body-md"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-on-surface transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-symbols-outlined text-xl">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-label-code text-[10px] text-on-surface-variant uppercase tracking-wider" htmlFor="confirm">
              Confirm Password
            </label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xl transition-colors group-focus-within:text-primary">
                lock
              </span>
              <input
                id="confirm"
                type={showPassword ? 'text' : 'password'}
                className="w-full bg-input border border-glass-border rounded-lg py-3 pl-11 pr-4 text-on-surface placeholder:text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all font-body-md"
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
            className="btn-primary w-full justify-center py-3 text-base"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin">sync</span>
                Registering...
              </>
            ) : (
              <>
                Register
                <span className="material-symbols-outlined">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-4 mt-4 border-t border-glass-border flex justify-between items-center">
          <span className="font-label-code text-[10px] text-muted uppercase tracking-wider">Auth Status</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-status-safe animate-pulse shadow-[0_0_10px_rgba(0,210,106,0.3)]" />
            <span className="font-label-code text-[10px] text-status-safe uppercase tracking-wider">Secure Gateways Ready</span>
          </div>
        </div>

        <p className="text-center text-sm text-on-surface-variant">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline transition-colors">
            Login
          </Link>
        </p>
      </AuthCard>
    </div>
  );
};

export default Register;
