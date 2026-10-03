import React, { useState } from 'react';
import { Lock, Unlock, ShieldCheck, KeyRound, ArrowRight, Sparkles, Send } from 'lucide-react';

interface AuthLockScreenProps {
  onAuthenticated: () => void;
}

export const AuthLockScreen: React.FC<AuthLockScreenProps> = ({ onAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === 'techmaster') {
      setIsSubmitting(true);
      setError(false);
      setTimeout(() => {
        onAuthenticated();
      }, 400);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2500);
    }
  };

  const handleQuickFill = () => {
    setPassword('techmaster');
  };

  return (
    <div className="relative z-10 min-h-[85vh] flex items-center justify-center p-4">
      {/* 3D Glassmorphic Auth Card */}
      <div className="w-full max-w-md rounded-3xl bg-slate-900/85 border border-cyan-500/30 p-8 backdrop-blur-2xl shadow-2xl shadow-cyan-950/50 text-center relative overflow-hidden">
        {/* Glow corner highlights */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Security Shield Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-xl shadow-cyan-500/30 mb-5">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            {isSubmitting ? (
              <Unlock size={28} className="text-emerald-400 animate-bounce" />
            ) : (
              <Lock size={28} className="text-cyan-400" />
            )}
          </div>
        </div>

        {/* Branding & Developer Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-[11px] font-mono text-cyan-300 font-semibold mb-3">
          <Sparkles size={11} className="text-yellow-400" />
          SYSTEM ACCESS PORTAL
        </div>

        <h2 className="text-2xl font-black text-white tracking-tight mb-1">
          POWER VALIDATOR
        </h2>
        <div className="text-xs text-slate-400 mb-6">
          Architect:{' '}
          <span className="font-bold text-amber-300">Tech Master</span> •{' '}
          <a
            href="https://t.me/tech_master_a2z"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-400 hover:underline"
          >
            t.me/tech_master_a2z
          </a>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative text-left">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <KeyRound size={13} className="text-cyan-400" />
              Master Access Passcode
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter passcode..."
              autoFocus
              className={`w-full bg-slate-950/80 border ${
                error
                  ? 'border-rose-500 focus:border-rose-400 ring-2 ring-rose-500/20'
                  : 'border-slate-700/80 focus:border-cyan-400'
              } rounded-xl px-4 py-3 text-white font-mono placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all text-sm`}
            />

            {error && (
              <p className="text-xs text-rose-400 mt-1.5 font-medium animate-pulse">
                Invalid passcode! Hint: default key is <span className="font-bold underline">techmaster</span>
              </p>
            )}
          </div>

          <div className="flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-cyan-400 hover:text-cyan-300 transition-colors font-mono underline underline-offset-4"
            >
              [Fast Autofill: techmaster]
            </button>
            <span className="text-slate-500 font-mono">SHA-256 Protected</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:via-indigo-500 hover:to-purple-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/25 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <ShieldCheck size={18} className="animate-spin" />
                <span>Decrypting Workspace...</span>
              </>
            ) : (
              <>
                <span>Authenticate & Open System</span>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-center gap-3 text-xs text-slate-500">
          <Send size={13} className="text-sky-400" />
          <span>Channel: t.me/tech_master_a2z</span>
        </div>
      </div>
    </div>
  );
};
