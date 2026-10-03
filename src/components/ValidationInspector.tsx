import React, { useState } from 'react';
import { Code2, ShieldCheck, Terminal, Check, Copy, BookOpen } from 'lucide-react';
import { CountryConfig } from '../data/countries';

interface ValidationInspectorProps {
  country: CountryConfig;
  rawInput: string;
}

export const ValidationInspector: React.FC<ValidationInspectorProps> = ({
  country,
  rawInput,
}) => {
  const [activeTab, setActiveTab] = useState<'python' | 'ts' | 'specs'>('python');
  const [copiedCode, setCopiedCode] = useState(false);

  const cleanDigits = rawInput.replace(/\D/g, '');

  const pythonSnippet = `# Python 3 Phone Validation for ${country.name} (${country.dialCode})
import re

def validate_${country.id}_phone(phone_number: str) -> dict:
    """
    Validates a ${country.name} phone number against national numbering format.
    Regex: ${country.regexPattern}
    """
    clean_number = re.sub(r'\\D', '', phone_number)
    pattern = r"${country.regexPattern}"
    
    is_valid = bool(re.match(pattern, phone_number.strip()) or re.match(pattern, clean_number))
    
    # E.164 format normalization
    e164 = None
    if is_valid:
        digits = clean_number.lstrip('0')
        e164 = f"${country.dialCode}{digits}"
        
    return {
        "is_valid": is_valid,
        "clean_digits": clean_number,
        "e164": e164,
        "country": "${country.name}",
        "dial_code": "${country.dialCode}"
    }

# Test sample:
# print(validate_${country.id}_phone("${cleanDigits || country.testSamples[0]?.number || '01712345678'}"))`;

  const tsSnippet = `// TypeScript / JavaScript Validation for ${country.name} (${country.dialCode})
export interface PhoneValidationResult {
  isValid: boolean;
  cleanDigits: string;
  e164: string | null;
  country: string;
  dialCode: string;
}

export function validate${country.iso2}Phone(phoneNumber: string): PhoneValidationResult {
  const cleanNumber = phoneNumber.replace(/\\D/g, '');
  const pattern = new RegExp('${country.regexPattern}');
  
  const isValid = pattern.test(phoneNumber.trim()) || pattern.test(cleanNumber);
  const normalizedDigits = cleanNumber.replace(/^0+/, '');
  
  return {
    isValid,
    cleanDigits: cleanNumber,
    e164: isValid ? \`${country.dialCode}\${normalizedDigits}\` : null,
    country: '${country.name}',
    dialCode: '${country.dialCode}'
  };
}

// Example usage:
// const res = validate${country.iso2}Phone("${cleanDigits || country.testSamples[0]?.number || '01712345678'}");`;

  const currentSnippet = activeTab === 'python' ? pythonSnippet : tsSnippet;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="rounded-3xl bg-slate-900/80 border border-slate-700/60 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <Terminal size={18} className="text-cyan-400" />
          <h2 className="text-base font-bold text-white tracking-wide">
            Telecom Specs & Implementation Logic
          </h2>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-950/80 border border-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('python')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'python'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Python 3
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ts')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'ts'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            TypeScript
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'specs'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Numbering Specs
          </button>
        </div>
      </div>

      {activeTab === 'specs' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-[11px] font-mono text-slate-400 block mb-1 uppercase">
                Country Dial Code
              </span>
              <span className="text-lg font-mono font-bold text-cyan-400">
                {country.dialCode}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-[11px] font-mono text-slate-400 block mb-1 uppercase">
                Length Constraints
              </span>
              <span className="text-lg font-mono font-bold text-amber-400">
                {country.minLength === country.maxLength
                  ? `${country.minLength} digits`
                  : `${country.minLength} - ${country.maxLength} digits`}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-[11px] font-mono text-slate-400 block mb-1 uppercase">
                Standard Mask
              </span>
              <span className="text-lg font-mono font-bold text-emerald-400">
                {country.formatMask}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
              <BookOpen size={14} className="text-cyan-400" />
              National Numbering Plan Details
            </span>
            <p className="text-sm text-slate-400 leading-relaxed">
              {country.description}. Phone numbers in this region adhere to the International Telecommunication Union (ITU-T E.164) recommendations.
            </p>
            <div className="pt-2">
              <span className="text-[11px] font-mono text-slate-500 block mb-1">
                Active Regular Expression Pattern:
              </span>
              <code className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-300 block overflow-x-auto">
                {country.regexPattern}
              </code>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-800/40 space-y-2">
            <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 uppercase tracking-wider">
              <ShieldCheck size={14} className="text-cyan-400" />
              Production Security Best Practices
            </span>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              <li>Always enforce server-side format verification before making gateway calls.</li>
              <li>Rate limit verification requests per IP and target number (e.g. 1 request / 60 seconds).</li>
              <li>Use CAPTCHA (Turnstile / reCAPTCHA) on user-facing verification forms to prevent automated toll fraud.</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border border-slate-800 rounded-t-xl">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-2">
              <Code2 size={13} className="text-cyan-400" />
              {activeTab === 'python' ? 'validator.py' : 'validator.ts'}
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              {copiedCode ? (
                <>
                  <Check size={13} className="text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-4 bg-slate-950/90 border-x border-b border-slate-800 rounded-b-xl overflow-x-auto text-xs font-mono text-cyan-200/90 leading-relaxed max-h-72">
            <code>{currentSnippet}</code>
          </pre>
        </div>
      )}
    </div>
  );
};
