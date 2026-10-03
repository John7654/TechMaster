import React from 'react';
import { Send, Shield, Sparkles, Cpu } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="relative z-10 w-full border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-fuchsia-500 p-0.5 shadow-lg shadow-cyan-500/25">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Cpu size={20} className="text-cyan-400" />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
              <Sparkles size={8} className="text-black" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-300">
                POWER VALIDATOR
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800/80 text-cyan-400 font-bold uppercase tracking-wider">
                PRO 3D
              </span>
            </div>
            <p className="text-xs text-slate-400">
              International Telecom Verification & Carrier Detection
            </p>
          </div>
        </div>

        {/* Developer Highlight & Telegram */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-cyan-500/10 border border-amber-500/30 flex items-center gap-2 shadow-sm">
            <Shield size={14} className="text-amber-400" />
            <div className="text-left">
              <div className="text-[10px] text-amber-300/80 font-semibold uppercase tracking-wider">
                Lead Architect
              </div>
              <div className="text-xs font-bold text-amber-200">
                Tech Master
              </div>
            </div>
          </div>

          <a
            href="https://t.me/tech_master_a2z"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 border border-sky-500/40 text-sky-300 hover:text-white transition-all text-xs font-semibold shadow-lg shadow-sky-950/40"
          >
            <Send size={13} className="text-sky-400" />
            <span>@tech_master_a2z</span>
          </a>
        </div>
      </div>
    </header>
  );
};
