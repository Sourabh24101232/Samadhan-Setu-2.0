// ==========================================
// FRONTEND LIB - CONSTANTS & ENUMS
// File: Frontend/src/lib/constants.ts
// ==========================================

/*
  PURPOSE:
  - Central repository for all static lists, options, dropdown choices, and UI color maps.

  CONSTANTS TO DEFINE LATER:

  1. ALL 24 JHARKHAND DISTRICTS:
     export const JHARKHAND_DISTRICTS = [
       "Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka",
       "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla",
       "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar",
       "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi",
       "Sahibganj", "Seraikela Kharsawan", "Simdega", "West Singhbhum"
     ];

  2. 11 THEMATIC DOMAINS (Problem Statement aligned):
     export const THEMATIC_DOMAINS = [
       "Education",
       "Agriculture",
       "Healthcare",
       "Water Resources",
       "Environment",
       "Energy",
       "Urban Development",
       "Accessibility",
       "Public Administration",
       "Rural Livelihoods",
       "Disaster Management"
     ];

  3. PROMINENT JHARKHAND HEIs:
     export const JHARKHAND_HEIS = [
       "BIT Mesra, Ranchi",
       "IIT (ISM) Dhanbad",
       "Birsa Agricultural University, Ranchi",
       "NIT Jamshedpur",
       "Ranchi University",
       "AIIMS Deoghar",
       "Kolhan University, Chaibasa",
       "Vinoba Bhave University, Hazaribagh",
       "Central University of Jharkhand, Ranchi"
     ];
*/

export const JHARKHAND_DISTRICTS = [
  "Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka",
  "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla",
  "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar",
  "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi",
  "Sahibganj", "Seraikela Kharsawan", "Simdega", "West Singhbhum"
] as const;

export const THEMATIC_DOMAINS = [
  "Education",
  "Agriculture",
  "Healthcare",
  "Water Resources",
  "Environment",
  "Energy",
  "Urban Development",
  "Accessibility",
  "Public Administration",
  "Rural Livelihoods",
  "Disaster Management"
] as const;

export const JHARKHAND_HEIS = [
  "BIT Mesra, Ranchi",
  "IIT (ISM) Dhanbad",
  "Birsa Agricultural University, Ranchi",
  "NIT Jamshedpur",
  "AIIMS Deoghar",
  "Central University of Jharkhand, Ranchi",
  "Ranchi University",
  "Vinoba Bhave University, Hazaribagh",
  "Kolhan University, Chaibasa"
] as const;

export const RESOLUTION_STAGES = [
  { stage: 1, key: 'Submitted', label: 'Reported', desc: 'Citizen / Whistleblower submission' },
  { stage: 2, key: 'Verified', label: 'Gov Verified', desc: 'R&D filter & AI auto-routing' },
  { stage: 3, key: 'Assigned to University', label: 'Claimed by HEI', desc: '14-day team lock active' },
  { stage: 4, key: 'Proposal Submitted', label: 'Proposal & Sponsor', desc: 'CSR milestone pledge locked' },
  { stage: 5, key: 'In Progress', label: 'Lab Prototype', desc: 'Bench testing & validation' },
  { stage: 6, key: 'Resolved', label: 'Field Deployed 🎉', desc: 'Ground verification confirmed' }
];

export const SEVERITY_COLORS = {
  Low: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  Medium: { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-200' },
  High: { bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-200' },
  Critical: { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200' }
};

export const DOMAIN_ICONS: Record<string, string> = {
  "Water Resources": "💧",
  "Agriculture": "🌾",
  "Healthcare": "🏥",
  "Environment": "🌲",
  "Energy": "⚡",
  "Disaster Management": "🚨",
  "Rural Livelihoods": "🚜",
  "Urban Development": "🏙️",
  "Education": "📚",
  "Accessibility": "♿",
  "Public Administration": "🏛️"
};
