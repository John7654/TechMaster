import React, { useState, useEffect } from 'react';
import { Background3D } from './components/Background3D';
import { Header } from './components/Header';
import { PhoneValidatorCard } from './components/PhoneValidatorCard';
import { ValidationInspector } from './components/ValidationInspector';
import { AuthLockScreen } from './components/AuthLockScreen';
import { COUNTRIES, CountryConfig } from './data/countries';
import { Lock, Unlock, ShieldAlert, Sparkles, Send, Heart } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Check if previously unlocked in session
    return sessionStorage.getItem('power_val_auth') === 'true';
  });

  const [selectedCountry, setSelectedCountry] = useState<CountryConfig>(COUNTRIES[0]); // Defaults to Bangladesh (+880)
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const handleAuthenticated = () => {
    sessionStorage.setItem('power_val_auth', 'true');
    setIsAuthenticated(true);
  };

  const handleLock = () => {
    sessionStorage.removeItem('power_val_auth');
    setIsAuthenticated(false);
  };

  // When changing country, optionally pre-fill placeholder or clear
  const handleCountryChange = (country: CountryConfig) => {
    setSelectedCountry(country);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-black relative overflow-x-hidden">
      {/* 3D Dynamic Animated Mesh Canvas */}
      <Background3D />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation Bar */}
        <Header />

        {/* Lock / Unlock Status Bar */}
        <div className="w-full bg-slate-950/80 border-b border-slate-900 px-4 py-2 text-xs">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
              <span>Status:</span>
              <span className="font-mono text-cyan-400 font-semibold">
                {isAuthenticated ? 'UNLOCKED (Session Active)' : 'SECURE LOCKED'}
              </span>
            </div>

            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLock}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors"
              >
                <Lock size={12} className="text-amber-400" />
                <span>Lock System</span>
              </button>
            ) : (
              <span className="text-[11px] font-mono text-slate-500">
                Passcode: <span className="text-cyan-400 font-bold">techmaster</span>
              </span>
            )}
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
          {!isAuthenticated ? (
            <AuthLockScreen onAuthenticated={handleAuthenticated} />
          ) : (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Hero Banner with Developer Highlight */}
              <div className="relative rounded-3xl bg-gradient-to-r from-cyan-950/40 via-purple-950/30 to-slate-900/60 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-3">
                    <Sparkles size={12} className="text-yellow-400" />
                    POWER VALIDATOR • LUXURY TELECOM SUITE
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
                    Dynamic Phone Validation & Operator Detection
                  </h2>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Designed by <strong className="text-amber-300 font-semibold">Tech Master</strong>. 
                    Select your country code (e.g., <strong className="text-cyan-300">+880</strong> Bangladesh, <strong className="text-cyan-300">+91</strong> India), 
                    and watch the validation logic adapt dynamically with real-time carrier identification, regex patterns, and formatted E.164 output.
                  </p>
                </div>
              </div>

              {/* Main Interactive Validator Card */}
              <PhoneValidatorCard
                country={selectedCountry}
                onCountryChange={handleCountryChange}
                rawInput={phoneNumber}
                onInputChange={setPhoneNumber}
              />

              {/* Technical Validation Inspector & Code Exporter */}
              <ValidationInspector
                country={selectedCountry}
                rawInput={phoneNumber}
              />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="relative z-10 w-full border-t border-slate-900 bg-slate-950/80 backdrop-blur-md py-6 text-xs text-slate-500">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span>Engineered with</span>
              <Heart size={13} className="text-rose-500 fill-rose-500" />
              <span>by</span>
              <strong className="text-amber-300">Tech Master</strong>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://t.me/tech_master_a2z"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 hover:text-sky-300 flex items-center gap-1.5 transition-colors font-mono"
              >
                <Send size={12} />
                <span>t.me/tech_master_a2z</span>
              </a>
              <span>•</span>
              <span className="font-mono text-slate-600">v2.5.0 Pro</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
