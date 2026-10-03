import React, { useState, useId, useMemo } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Copy,
  Check,
  Radio,
  Sparkles,
  Zap,
  Gauge,
  PhoneCall,
  Info,
} from 'lucide-react';
import { CountryConfig, CarrierInfo } from '../data/countries';
import { CountrySelector } from './CountrySelector';

interface PhoneValidatorCardProps {
  country: CountryConfig;
  onCountryChange: (country: CountryConfig) => void;
  rawInput: string;
  onInputChange: (val: string) => void;
}

export const PhoneValidatorCard: React.FC<PhoneValidatorCardProps> = ({
  country,
  onCountryChange,
  rawInput,
  onInputChange,
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [speedMode, setSpeedMode] = useState<'fast' | 'slow'>('fast');
  const [isValidating, setIsValidating] = useState(false);
  const inputId = useId();

  // Extract clean digits
  const cleanDigits = useMemo(() => {
    return rawInput.replace(/\D/g, '');
  }, [rawInput]);

  // Validation logic
  const validationResult = useMemo(() => {
    if (!cleanDigits) {
      return {
        status: 'empty',
        message: 'Awaiting phone number input',
        color: 'text-slate-400',
        bgColor: 'bg-slate-800/40 border-slate-700/60',
      };
    }

    const fullInternational = country.dialCode + cleanDigits.replace(/^0+/, '');
    const regex = new RegExp(country.regexPattern);
    const isValidWithCode = regex.test(fullInternational) || regex.test(cleanDigits);

    // Specific length and prefix checks
    const targetLength = country.minLength;
    const currentLength = cleanDigits.startsWith('0') ? cleanDigits.length - 1 : cleanDigits.length;

    // Check carrier
    const carrier = country.detectCarrier(cleanDigits);

    if (isValidWithCode) {
      return {
        status: 'valid',
        message: `Valid ${country.name} mobile number`,
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10 border-emerald-500/40 shadow-emerald-500/10',
        carrier,
        e164: country.dialCode + (cleanDigits.startsWith('0') ? cleanDigits.slice(1) : cleanDigits),
      };
    }

    if (cleanDigits.length < country.minLength) {
      return {
        status: 'short',
        message: `Too short (${cleanDigits.length}/${country.minLength} digits required)`,
        color: 'text-amber-400',
        bgColor: 'bg-amber-500/10 border-amber-500/40 shadow-amber-500/10',
        carrier,
      };
    }

    if (cleanDigits.length > country.maxLength + 1) {
      return {
        status: 'long',
        message: `Exceeds max allowed length (${cleanDigits.length} digits)`,
        color: 'text-rose-400',
        bgColor: 'bg-rose-500/10 border-rose-500/40 shadow-rose-500/10',
        carrier,
      };
    }

    return {
      status: 'invalid',
      message: `Invalid format or prefix for ${country.name}`,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10 border-rose-500/40 shadow-rose-500/10',
      carrier,
    };
  }, [cleanDigits, country]);

  // Handle input change with formatting
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (speedMode === 'slow') {
      setIsValidating(true);
      setTimeout(() => {
        setIsValidating(false);
      }, 350);
    }
    onInputChange(val);
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 1800);
  };

  // E.164 computation
  const formattedE164 = useMemo(() => {
    if (!cleanDigits) return '';
    const num = cleanDigits.startsWith('0') ? cleanDigits.slice(1) : cleanDigits;
    return `${country.dialCode}${num}`;
  }, [cleanDigits, country.dialCode]);

  // Formatted national
  const formattedNational = useMemo(() => {
    return country.formatNational(cleanDigits);
  }, [cleanDigits, country]);

  return (
    <div className="relative rounded-3xl bg-slate-900/80 border border-slate-700/60 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-cyan-950/20 overflow-hidden">
      {/* Decorative ambient glow lines */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-gradient-to-tr from-amber-500/15 to-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar with Speed Mode & Status */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs font-mono tracking-wider uppercase text-cyan-400 font-semibold">
            Telecom Verification Engine
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
            E.164 Compliant
          </span>
        </div>

        {/* Speed Mode Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
          <span className="text-slate-400 text-[11px] font-medium px-2 flex items-center gap-1">
            <Gauge size={12} className="text-cyan-400" />
            Mode:
          </span>
          <button
            type="button"
            onClick={() => setSpeedMode('fast')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
              speedMode === 'fast'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap size={11} />
            Fast
          </button>
          <button
            type="button"
            onClick={() => setSpeedMode('slow')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
              speedMode === 'slow'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio size={11} />
            Slow (Simulated)
          </button>
        </div>
      </div>

      {/* Primary Input Container */}
      <div className="space-y-4">
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Enter Mobile / Telephone Number
        </label>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Country Selector Component */}
          <CountrySelector
            selectedCountry={country}
            onSelectCountry={(c) => {
              onCountryChange(c);
            }}
          />

          {/* Number Input Field */}
          <div className="relative flex-1">
            <input
              id={inputId}
              type="tel"
              value={rawInput}
              onChange={handleTextChange}
              placeholder={`e.g. ${country.placeholder}`}
              className="w-full h-full min-h-[52px] bg-slate-950/70 border border-slate-700/80 hover:border-slate-600 focus:border-cyan-400 rounded-xl px-4 text-lg font-mono text-white placeholder-slate-500 tracking-wide focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all shadow-inner"
            />
            {rawInput && (
              <button
                type="button"
                onClick={() => onInputChange('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Validation Status Indicator */}
        <div
          className={`flex items-center justify-between p-3.5 rounded-xl border backdrop-blur-md transition-all ${validationResult.bgColor}`}
        >
          <div className="flex items-center gap-3">
            {validationResult.status === 'valid' && (
              <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
            )}
            {validationResult.status === 'short' && (
              <AlertCircle size={20} className="text-amber-400 shrink-0" />
            )}
            {validationResult.status === 'long' && (
              <XCircle size={20} className="text-rose-400 shrink-0" />
            )}
            {validationResult.status === 'invalid' && (
              <XCircle size={20} className="text-rose-400 shrink-0" />
            )}
            {validationResult.status === 'empty' && (
              <Info size={20} className="text-slate-400 shrink-0" />
            )}

            <div>
              <div className="text-sm font-semibold text-white flex items-center gap-2">
                <span>{validationResult.message}</span>
                {isValidating && (
                  <span className="text-xs text-amber-400 animate-pulse font-mono">
                    Analyzing...
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Rule: {country.description}
              </div>
            </div>
          </div>

          {/* Carrier Badge if Detected */}
          {validationResult.carrier && (
            <div
              className={`px-3 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 shadow-sm ${validationResult.carrier.badgeColor}`}
            >
              <Radio size={12} className="animate-pulse" />
              <span>{validationResult.carrier.name}</span>
              {validationResult.carrier.type && (
                <span className="text-[10px] opacity-80 uppercase">
                  [{validationResult.carrier.type}]
                </span>
              )}
            </div>
          )}
        </div>

        {/* Formatted E.164 and National Values */}
        {cleanDigits && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {/* E.164 Standard Card */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">
                  International (E.164)
                </span>
                <span className="text-sm font-mono font-bold text-cyan-400">
                  {formattedE164}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(formattedE164, 'e164')}
                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Copy E.164 format"
              >
                {copiedType === 'e164' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>

            {/* National Format Card */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">
                  National / Display Format
                </span>
                <span className="text-sm font-mono font-bold text-slate-200">
                  {formattedNational}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(formattedNational, 'national')}
                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Copy National format"
              >
                {copiedType === 'national' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        )}

        {/* Quick Test Samples */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles size={13} className="text-yellow-400" />
              Quick Test Samples for {country.name}
            </span>
            <span className="text-[11px] text-slate-500">Click to fill</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {country.testSamples.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onInputChange(sample.number)}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all flex items-center gap-1.5 ${
                  sample.isValid
                    ? 'bg-slate-800/70 hover:bg-emerald-950/40 border-slate-700 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-300'
                    : 'bg-slate-800/70 hover:bg-rose-950/40 border-slate-700 hover:border-rose-500/50 text-slate-300 hover:text-rose-300'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    sample.isValid ? 'bg-emerald-400' : 'bg-rose-400'
                  }`}
                />
                <span className="font-semibold">{sample.label}:</span>
                <span className="text-slate-400">{sample.number}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
