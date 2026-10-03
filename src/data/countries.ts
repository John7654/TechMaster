export interface CarrierInfo {
  name: string;
  badgeColor: string;
  type?: string;
}

export interface CountryConfig {
  id: string;
  name: string;
  iso2: string;
  dialCode: string;
  flag: string;
  placeholder: string;
  formatMask: string;
  minLength: number;
  maxLength: number;
  description: string;
  regexPattern: string;
  pythonRegex: string;
  detectCarrier: (nationalDigits: string) => CarrierInfo | null;
  formatNational: (digits: string) => string;
  testSamples: {
    number: string;
    label: string;
    isValid: boolean;
  }[];
}

export const COUNTRIES: CountryConfig[] = [
  {
    id: 'bd',
    name: 'Bangladesh',
    iso2: 'BD',
    dialCode: '+880',
    flag: '🇧🇩',
    placeholder: '01712 345678',
    formatMask: '01XXX-XXXXXX',
    minLength: 10,
    maxLength: 11,
    description: '11 digits starting with 01[3-9], or 10 digits without leading 0',
    regexPattern: '^(?:\\+8801|01|1)[3-9]\\d{8}$',
    pythonRegex: '^(?:\\+8801|01|1)[3-9]\\d{8}$',
    detectCarrier: (digits: string) => {
      const clean = digits.replace(/^(\+880|880)/, '');
      const num = clean.startsWith('0') ? clean : '0' + clean;
      const prefix = num.substring(0, 3);
      if (prefix === '017' || prefix === '013') {
        return { name: 'Grameenphone (GP)', badgeColor: 'bg-sky-500/20 text-sky-400 border-sky-500/40', type: '4G/5G' };
      }
      if (prefix === '018') {
        return { name: 'Robi Axiata', badgeColor: 'bg-red-500/20 text-red-400 border-red-500/40', type: '4G/5G' };
      }
      if (prefix === '016') {
        return { name: 'Airtel Bangladesh', badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/40', type: '4G/5G' };
      }
      if (prefix === '019' || prefix === '014') {
        return { name: 'Banglalink', badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40', type: '4G/5G' };
      }
      if (prefix === '015') {
        return { name: 'Teletalk (State-owned)', badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', type: 'Govt 4G/5G' };
      }
      return null;
    },
    formatNational: (digits: string) => {
      const clean = digits.replace(/\D/g, '');
      if (clean.length <= 5) return clean;
      if (clean.length <= 11) return `${clean.slice(0, 5)} ${clean.slice(5)}`;
      return `${clean.slice(0, 5)} ${clean.slice(5, 11)}`;
    },
    testSamples: [
      { number: '01712345678', label: 'GP (Grameenphone)', isValid: true },
      { number: '01819998877', label: 'Robi Mobile', isValid: true },
      { number: '01911223344', label: 'Banglalink', isValid: true },
      { number: '01552345678', label: 'Teletalk', isValid: true },
      { number: '01234567890', label: 'Invalid Prefix (012)', isValid: false },
      { number: '017123456', label: 'Too short (9 digits)', isValid: false },
    ],
  },
  {
    id: 'in',
    name: 'India',
    iso2: 'IN',
    dialCode: '+91',
    flag: '🇮🇳',
    placeholder: '98765 43210',
    formatMask: 'XXXXX XXXXX',
    minLength: 10,
    maxLength: 10,
    description: '10 digits starting with [6, 7, 8, 9]',
    regexPattern: '^(?:\\+91)?[6-9]\\d{9}$',
    pythonRegex: '^(?:\\+91)?[6-9]\\d{9}$',
    detectCarrier: (digits: string) => {
      const clean = digits.replace(/^(\+91|91|0)/, '');
      if (clean.length < 2) return null;
      const prefix = clean.substring(0, 2);
      const firstDigit = clean[0];
      if (['98', '97', '99', '96', '95', '94'].includes(prefix)) {
        return { name: 'Airtel / Jio / Vi Circle', badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/40', type: 'Cellular' };
      }
      if (['70', '79', '80', '88', '89'].includes(prefix)) {
        return { name: 'Jio / Telecom Grid', badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40', type: 'VoLTE/5G' };
      }
      if (['6', '7', '8', '9'].includes(firstDigit)) {
        return { name: 'Indian National Telecom', badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', type: 'Mobile' };
      }
      return null;
    },
    formatNational: (digits: string) => {
      const clean = digits.replace(/\D/g, '');
      if (clean.length <= 5) return clean;
      return `${clean.slice(0, 5)} ${clean.slice(5, 10)}`;
    },
    testSamples: [
      { number: '9876543210', label: 'Standard Indian Mobile', isValid: true },
      { number: '7001234567', label: 'Jio 70-series', isValid: true },
      { number: '8123456789', label: 'Airtel 81-series', isValid: true },
      { number: '5123456789', label: 'Invalid Prefix (5XX)', isValid: false },
      { number: '9876543', label: 'Too short (7 digits)', isValid: false },
    ],
  },
  {
    id: 'us',
    name: 'United States',
    iso2: 'US',
    dialCode: '+1',
    flag: '🇺🇸',
    placeholder: '(415) 555-0198',
    formatMask: '(XXX) XXX-XXXX',
    minLength: 10,
    maxLength: 10,
    description: '10 digits with valid area code [2-9]XX and exchange [2-9]XX',
    regexPattern: '^(?:\\+1)?[2-9]\\d{2}[2-9]\\d{6}$',
    pythonRegex: '^(?:\\+1)?[2-9]\\d{2}[2-9]\\d{6}$',
    detectCarrier: (digits: string) => {
      const clean = digits.replace(/^(\+1|1)/, '');
      if (clean.length < 3) return null;
      const areaCode = clean.substring(0, 3);
      if (['415', '650', '510', '408'].includes(areaCode)) {
        return { name: 'California / SF Bay Area', badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/40', type: 'NANP Area' };
      }
      if (['212', '917', '718', '646'].includes(areaCode)) {
        return { name: 'New York Metro Area', badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/40', type: 'NANP Area' };
      }
      if (['312', '773'].includes(areaCode)) {
        return { name: 'Chicago Area', badgeColor: 'bg-teal-500/20 text-teal-400 border-teal-500/40', type: 'NANP Area' };
      }
      return { name: 'North American Numbering Plan', badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40', type: 'US Telecom' };
    },
    formatNational: (digits: string) => {
      const clean = digits.replace(/\D/g, '');
      if (clean.length === 0) return '';
      if (clean.length <= 3) return `(${clean}`;
      if (clean.length <= 6) return `(${clean.slice(0, 3)}) ${clean.slice(3)}`;
      return `(${clean.slice(0, 3)}) ${clean.slice(3, 6)}-${clean.slice(6, 10)}`;
    },
    testSamples: [
      { number: '4155550198', label: 'San Francisco (415)', isValid: true },
      { number: '2125550123', label: 'New York (212)', isValid: true },
      { number: '1155550198', label: 'Invalid Area Code (Starts with 1)', isValid: false },
      { number: '4151550198', label: 'Invalid Exchange (Starts with 1)', isValid: false },
    ],
  },
  {
    id: 'gb',
    name: 'United Kingdom',
    iso2: 'GB',
    dialCode: '+44',
    flag: '🇬🇧',
    placeholder: '7911 123456',
    formatMask: '7XXX XXXXXX',
    minLength: 10,
    maxLength: 10,
    description: '10 digits mobile starting with 7 (e.g. 7XXX XXXXXX)',
    regexPattern: '^(?:\\+44|0)?7\\d{9}$',
    pythonRegex: '^(?:\\+44|0)?7\\d{9}$',
    detectCarrier: (digits: string) => {
      const clean = digits.replace(/^(\+44|0)/, '');
      if (!clean.startsWith('7')) return null;
      const prefix = clean.substring(0, 3);
      if (['791', '792', '793'].includes(prefix)) {
        return { name: 'EE / BT Mobile', badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', type: '5G Mobile' };
      }
      if (['770', '771', '772', '773'].includes(prefix)) {
        return { name: 'Vodafone UK', badgeColor: 'bg-red-500/20 text-red-400 border-red-500/40', type: '5G Mobile' };
      }
      if (['780', '781', '782'].includes(prefix)) {
        return { name: 'O2 UK (Virgin Media)', badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/40', type: '5G Mobile' };
      }
      return { name: 'UK Cellular Network', badgeColor: 'bg-violet-500/20 text-violet-400 border-violet-500/40', type: 'Ofcom Valid' };
    },
    formatNational: (digits: string) => {
      const clean = digits.replace(/\D/g, '');
      if (clean.length <= 4) return clean;
      return `${clean.slice(0, 4)} ${clean.slice(4, 10)}`;
    },
    testSamples: [
      { number: '7911123456', label: 'EE Mobile UK', isValid: true },
      { number: '7700900123', label: 'Vodafone UK', isValid: true },
      { number: '2079460123', label: 'Landline (Not Mobile)', isValid: false },
    ],
  },
  {
    id: 'ae',
    name: 'United Arab Emirates',
    iso2: 'AE',
    dialCode: '+971',
    flag: '🇦🇪',
    placeholder: '50 123 4567',
    formatMask: '5X XXX XXXX',
    minLength: 9,
    maxLength: 9,
    description: '9 digits starting with 5 (e.g. 50, 52, 54, 55, 56, 58)',
    regexPattern: '^(?:\\+971|0)?5[024568]\\d{7}$',
    pythonRegex: '^(?:\\+971|0)?5[024568]\\d{7}$',
    detectCarrier: (digits: string) => {
      const clean = digits.replace(/^(\+971|0)/, '');
      const prefix = clean.substring(0, 2);
      if (['50', '54', '56'].includes(prefix)) {
        return { name: 'e& (Etisalat UAE)', badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', type: '5G' };
      }
      if (['52', '55', '58'].includes(prefix)) {
        return { name: 'du Telecom', badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40', type: '5G' };
      }
      return null;
    },
    formatNational: (digits: string) => {
      const clean = digits.replace(/\D/g, '');
      if (clean.length <= 2) return clean;
      if (clean.length <= 5) return `${clean.slice(0, 2)} ${clean.slice(2)}`;
      return `${clean.slice(0, 2)} ${clean.slice(2, 5)} ${clean.slice(5, 9)}`;
    },
    testSamples: [
      { number: '501234567', label: 'Etisalat (50)', isValid: true },
      { number: '551234567', label: 'du Telecom (55)', isValid: true },
      { number: '531234567', label: 'Unallocated prefix (53)', isValid: false },
    ],
  },
  {
    id: 'pk',
    name: 'Pakistan',
    iso2: 'PK',
    dialCode: '+92',
    flag: '🇵🇰',
    placeholder: '300 1234567',
    formatMask: '3XX XXXXXXX',
    minLength: 10,
    maxLength: 10,
    description: '10 digits mobile starting with 3 (e.g. 300-349)',
    regexPattern: '^(?:\\+92|0)?3[0-4]\\d{8}$',
    pythonRegex: '^(?:\\+92|0)?3[0-4]\\d{8}$',
    detectCarrier: (digits: string) => {
      const clean = digits.replace(/^(\+92|0)/, '');
      const prefix = clean.substring(0, 3);
      if (prefix.startsWith('30')) {
        return { name: 'Jazz (Mobilink)', badgeColor: 'bg-red-500/20 text-red-400 border-red-500/40', type: '4G LTE' };
      }
      if (prefix.startsWith('34')) {
        return { name: 'Telenor Pakistan', badgeColor: 'bg-sky-500/20 text-sky-400 border-sky-500/40', type: '4G LTE' };
      }
      if (prefix.startsWith('31')) {
        return { name: 'Zong 4G (CMPak)', badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', type: '4G LTE' };
      }
      if (prefix.startsWith('33')) {
        return { name: 'Ufone (PTCL)', badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40', type: '4G LTE' };
      }
      return null;
    },
    formatNational: (digits: string) => {
      const clean = digits.replace(/\D/g, '');
      if (clean.length <= 3) return clean;
      return `${clean.slice(0, 3)} ${clean.slice(3, 10)}`;
    },
    testSamples: [
      { number: '3001234567', label: 'Jazz Mobile (300)', isValid: true },
      { number: '3451234567', label: 'Telenor (345)', isValid: true },
      { number: '3121234567', label: 'Zong 4G (312)', isValid: true },
      { number: '3501234567', label: 'Invalid prefix (350)', isValid: false },
    ],
  },
  {
    id: 'sa',
    name: 'Saudi Arabia',
    iso2: 'SA',
    dialCode: '+966',
    flag: '🇸🇦',
    placeholder: '50 123 4567',
    formatMask: '5X XXX XXXX',
    minLength: 9,
    maxLength: 9,
    description: '9 digits starting with 5 (e.g. 50, 53, 55, 54, 56, 58, 59)',
    regexPattern: '^(?:\\+966|0)?5[013-689]\\d{7}$',
    pythonRegex: '^(?:\\+966|0)?5[013-689]\\d{7}$',
    detectCarrier: (digits: string) => {
      const clean = digits.replace(/^(\+966|0)/, '');
      const prefix = clean.substring(0, 2);
      if (['50', '53', '55'].includes(prefix)) {
        return { name: 'stc (Saudi Telecom)', badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/40', type: '5G' };
      }
      if (['54', '56'].includes(prefix)) {
        return { name: 'Mobily', badgeColor: 'bg-sky-500/20 text-sky-400 border-sky-500/40', type: '5G' };
      }
      if (['58', '59'].includes(prefix)) {
        return { name: 'Zain KSA', badgeColor: 'bg-pink-500/20 text-pink-400 border-pink-500/40', type: '5G' };
      }
      return null;
    },
    formatNational: (digits: string) => {
      const clean = digits.replace(/\D/g, '');
      if (clean.length <= 2) return clean;
      if (clean.length <= 5) return `${clean.slice(0, 2)} ${clean.slice(2)}`;
      return `${clean.slice(0, 2)} ${clean.slice(2, 5)} ${clean.slice(5, 9)}`;
    },
    testSamples: [
      { number: '501234567', label: 'stc (50)', isValid: true },
      { number: '541234567', label: 'Mobily (54)', isValid: true },
      { number: '581234567', label: 'Zain KSA (58)', isValid: true },
    ],
  },
  {
    id: 'sg',
    name: 'Singapore',
    iso2: 'SG',
    dialCode: '+65',
    flag: '🇸🇬',
    placeholder: '9123 4567',
    formatMask: 'XXXX XXXX',
    minLength: 8,
    maxLength: 8,
    description: '8 digits mobile starting with 8 or 9',
    regexPattern: '^(?:\\+65)?[89]\\d{7}$',
    pythonRegex: '^(?:\\+65)?[89]\\d{7}$',
    detectCarrier: (digits: string) => {
      const clean = digits.replace(/^(\+65)/, '');
      if (clean.startsWith('8') || clean.startsWith('9')) {
        return { name: 'Singtel / StarHub / M1', badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/40', type: 'IMDA Mobile' };
      }
      return null;
    },
    formatNational: (digits: string) => {
      const clean = digits.replace(/\D/g, '');
      if (clean.length <= 4) return clean;
      return `${clean.slice(0, 4)} ${clean.slice(4, 8)}`;
    },
    testSamples: [
      { number: '91234567', label: 'Singtel/StarHub Mobile (9)', isValid: true },
      { number: '82345678', label: 'M1/SIMBA Mobile (8)', isValid: true },
      { number: '61234567', label: 'Fixed line (6-series)', isValid: false },
    ],
  },
];
