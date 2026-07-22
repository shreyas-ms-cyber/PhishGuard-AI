import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="relative z-10 w-full max-w-4xl mx-auto px-margin-mobile md:px-0 flex flex-col items-center justify-center min-h-screen text-center">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 border border-primary/20 shadow-[0_0_30px_rgba(0,218,243,0.2)]">
        <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
      </div>
      <h1 className="font-display text-display text-primary font-bold tracking-tight">PhishGuard AI</h1>
      <p className="font-label-code text-label-code text-on-surface-variant uppercase tracking-widest mt-2 opacity-60">System Protocol: Active</p>
      <p className="font-body-lg text-body-lg text-on-surface max-w-2xl mt-6">
        Spot phishing emails before they spot you. Heuristic detection engine with explainable risk scores.
      </p>
      <div className="flex flex-wrap gap-4 mt-8">
        <Link to="/login" className="bg-primary-container text-on-primary-container font-headline-sm py-3 px-8 rounded-lg shadow-[0_0_30px_rgba(0,218,243,0.1)] hover:shadow-[0_0_40px_rgba(0,218,243,0.3)] transition-all">
          Sign In
        </Link>
        <Link to="/register" className="border border-primary/40 text-primary font-headline-sm py-3 px-8 rounded-lg hover:bg-primary/5 transition-all">
          Create Account
        </Link>
      </div>
      <div className="flex flex-wrap justify-center gap-6 mt-12 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
          <span className="font-label-code text-[10px] uppercase tracking-tighter">Argon2id Secure</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>vpn_key</span>
          <span className="font-label-code text-[10px] uppercase tracking-tighter">JWT Protected</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
          <span className="font-label-code text-[10px] uppercase tracking-tighter">SOC2 Compliant</span>
        </div>
      </div>
    </div>
  );
};

export default Landing;
