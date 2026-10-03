import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, Globe } from 'lucide-react';
import { COUNTRIES, CountryConfig } from '../data/countries';

interface CountrySelectorProps {
  selectedCountry: CountryConfig;
  onSelectCountry: (country: CountryConfig) => void;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  selectedCountry,
  onSelectCountry,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // focus search input
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Filter countries
  const filteredCountries = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dialCode.toLowerCase().includes(q) ||
        c.iso2.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 hover:border-cyan-500/50 text-slate-100 transition-all duration-200 shadow-lg shadow-black/40 backdrop-blur-md group focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
      >
        <span className="text-2xl leading-none select-none">{selectedCountry.flag}</span>
        <div className="flex flex-col items-start leading-tight">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider group-hover:text-cyan-400 transition-colors">
            {selectedCountry.iso2}
          </span>
          <span className="text-sm font-bold text-white tracking-wide">
            {selectedCountry.dialCode}
          </span>
        </div>
        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform duration-200 ml-1 ${
            isOpen ? 'rotate-180 text-cyan-400' : 'group-hover:text-white'
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header & Search */}
          <div className="p-3 border-b border-slate-800 bg-slate-950/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Globe size={13} className="text-cyan-400" />
                Select Region / Country
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {filteredCountries.length} countries
              </span>
            </div>
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search name, code (+880, +91)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Quick Select Badges */}
          <div className="px-3 py-2 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none bg-slate-950/30">
            <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">Quick:</span>
            {COUNTRIES.slice(0, 5).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  onSelectCountry(c);
                  setIsOpen(false);
                }}
                className={`px-2 py-0.5 rounded-lg border text-xs flex items-center gap-1 whitespace-nowrap transition-colors ${
                  selectedCountry.id === c.id
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-semibold'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-700/60'
                }`}
              >
                <span>{c.flag}</span>
                <span>{c.iso2}</span>
                <span className="text-[10px] text-slate-400">{c.dialCode}</span>
              </button>
            ))}
          </div>

          {/* List of Countries */}
          <div className="max-h-64 overflow-y-auto p-1.5 space-y-1 divide-y divide-slate-800/40">
            {filteredCountries.length === 0 ? (
              <div className="py-6 text-center text-sm text-slate-400">
                No matching country found
              </div>
            ) : (
              filteredCountries.map((country) => {
                const isSelected = selectedCountry.id === country.id;
                return (
                  <button
                    key={country.id}
                    type="button"
                    onClick={() => {
                      onSelectCountry(country);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-950/80 to-slate-900 border border-cyan-500/40 text-cyan-200'
                        : 'hover:bg-slate-800/70 text-slate-200 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl leading-none">{country.flag}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-semibold text-white">
                            {country.name}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                            {country.iso2}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="text-slate-500 font-mono text-[11px]">
                            {country.formatMask}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-cyan-400">
                        {country.dialCode}
                      </span>
                      {isSelected && <Check size={16} className="text-cyan-400 stroke-[3]" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
