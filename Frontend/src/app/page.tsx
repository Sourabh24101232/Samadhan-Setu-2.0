'use client';

// ==========================================
// FRONTEND - OFFICIAL GOVERNMENT HOME / LANDING PAGE
// File: Frontend/src/app/page.tsx
// ==========================================

/*
  PURPOSE:
  - Official Government of Jharkhand landing page showcasing the 4-Stakeholder Quadruple Helix platform (Citizens, Universities, Industry CSR, Govt).

  SECTIONS RENDERED:
  1. Official State Emblem & National Tricolor Header Strip.
  2. Live Government Innovation Bulletin / News Ticker.
  3. Hero section: Bilingual headline + SIH26043 Problem Statement context.
  4. Real-Time Statewide Impact Counters (Live MongoDB KPI aggregation).
  5. Interactive 24-District Geospatial Heatmap of Jharkhand.
  6. 4 Tailored Stakeholder Portals (Citizens, Universities, Industry CSR, Govt).
  7. NEP 2020 Experiential Learning & Real-Life Ground Architecture Highlights.
  8. Official Government Links (Jan Samvad, Higher Edu Dept, JUT, AICTE).
*/

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  GraduationCap,
  Building2,
  Landmark,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Users,
  Coins,
  TrendingUp,
  MapPin,
  Mic,
  ShieldCheck,
  AlertTriangle,
  Award,
  ExternalLink,
  ChevronRight,
  Radio,
  FileText
} from 'lucide-react';
import { govApi } from '../lib/api';
import { StatewideKPIs, DistrictStat } from '../lib/types';
import DistrictHeatmap from '../components/DistrictHeatmap';

export default function HomePage() {
  const [stats, setStats] = useState<StatewideKPIs>({
    totalSocietalProblemsReported: 148,
    activeChallengesInProgress: 42,
    solutionsFieldDeployedAndResolved: 26,
    disasterEmergencySOSAlerts: 4,
    participatingUniversitiesAndHEIs: 9,
    totalSolutionProposalsSubmitted: 38,
    totalCSRGrantsMobilizedINR: 4250000,
    resolutionRatePercentage: 18
  });

  const [districtStats, setDistrictStats] = useState<DistrictStat[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  useEffect(() => {
    // Fetch live overview KPIs
    govApi.getOverviewKPIs().then((res) => {
      if (res && res.success && res.data) {
        setStats(res.data);
      }
    }).catch(() => {});

    // Fetch live district analytics for the 24-district map
    govApi.getDistrictStats().then((res: any) => {
      if (res && res.success && res.data && res.data.districts) {
        setDistrictStats(res.data.districts);
      }
    }).catch(() => {});
  }, []);

  const portals = [
    {
      title: 'Citizens & Panchayats',
      hindiTitle: 'नागरिक एवं पंचायत मंच',
      desc: 'Report grassroots community challenges with photo evidence and voice notes. Supports 🛡️ Anonymous Whistleblower Protection with zero IP/phone logging.',
      href: '/citizen',
      actionText: 'Report or Track Problem',
      icon: ShieldCheck,
      color: 'from-emerald-600 to-teal-800',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      tag: 'Grassroots Sourcing'
    },
    {
      title: 'Universities & HEIs',
      hindiTitle: 'विश्वविद्यालय एवं शोध संस्थान',
      desc: 'Claim domain-matched challenges under a 14-day lock, assemble multidisciplinary student engineering teams, and submit milestone-based R&D proposals.',
      href: '/university',
      actionText: 'Explore & Claim Challenges',
      icon: GraduationCap,
      color: 'from-blue-600 to-indigo-800',
      badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      tag: 'NEP 2020 R&D'
    },
    {
      title: 'Industry & CSR Foundations',
      hindiTitle: 'उद्योग एवं सीएसआर सहभागिता',
      desc: 'Discover vetted student innovations, pledge milestone tranche grants, track UTR disbursements, and provide direct technical mentorship to young engineers.',
      href: '/industry',
      actionText: 'Browse Proposals & Fund',
      icon: Building2,
      color: 'from-amber-600 to-orange-800',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      tag: 'CSR Grant Marketplace'
    },
    {
      title: 'Government of Jharkhand',
      hindiTitle: 'झारखंड सरकार समीक्षा डैशबोर्ड',
      desc: 'Departmental review queue, Disaster SOS emergency alerts, official field pilot sanctions, and statewide 24-district geospatial heatmap intelligence.',
      href: '/gov',
      actionText: 'State Analytics Dashboard',
      icon: Landmark,
      color: 'from-slate-800 to-slate-950',
      badgeColor: 'bg-slate-100 text-slate-900 border-slate-300',
      tag: 'Statewide Governance'
    }
  ];

  return (
    <div className="space-y-16 pb-24">
      {/* 1. NATIONAL TRICOLOR TOP ACCENT */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-600 shadow-xs" />

      {/* 2. OFFICIAL GOVERNMENT BANNER & FLASH BULLETIN */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 space-y-3">
        {/* State Department Header Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-700 via-emerald-800 to-teal-900 text-white flex items-center justify-center font-bold text-xl shadow-md border border-emerald-400/40 shrink-0">
              🏛️
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="text-xs font-extrabold text-emerald-950 tracking-wide uppercase">
                  झारखंड सरकार • Government of Jharkhand
                </span>
                <span className="hidden sm:inline-block text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded-md font-bold">
                  Official Portal
                </span>
              </div>
              <p className="text-xs font-bold text-slate-700">
                Department of Higher & Technical Education (उच्च एवं तकनीकी शिक्षा विभाग)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center text-xs">
            <span className="bg-indigo-50 border border-indigo-200 text-indigo-900 px-3 py-1 rounded-xl font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Smart India Hackathon 2026 • SIH26043</span>
            </span>
            <span className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-3 py-1 rounded-xl font-bold">
              NEP 2020 Aligned
            </span>
          </div>
        </div>

        {/* Live News Ticker Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl px-4 py-2.5 flex items-center gap-3 text-xs shadow-sm overflow-hidden">
          <div className="flex items-center gap-1.5 bg-red-600 text-white font-extrabold px-2.5 py-0.5 rounded-lg text-[10px] tracking-wider uppercase shrink-0 animate-pulse">
            <Radio className="w-3 h-3" />
            <span>LIVE BULLETIN</span>
          </div>
          <div className="text-slate-200 truncate">
            <span className="font-semibold text-emerald-300">Latest:</span> BIT Mesra deployed solar fluoride water unit in Kanke (Ranchi) • Tata Steel CSR Foundation disbursed Tranche 1 grant • 24-District Innovation Grid Active across Jharkhand!
          </div>
        </div>
      </div>

      {/* 3. HERO SECTION */}
      <section className="relative overflow-hidden pt-6 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-100/90 border border-emerald-300/80 px-4 py-1.5 rounded-full text-xs font-bold text-emerald-950 shadow-2xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
              <span>Quadruple Helix Societal Innovation Platform • समाधान सेतु</span>
            </div>

            {/* Main Bilingual Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Samadhan-Setu <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-teal-700 to-indigo-800">
                समाधान सेतु (झारखंड)
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-3xl mx-auto font-medium">
              Connecting grassroots challenges reported by rural citizens & panchayats across Jharkhand directly with premier Higher Educational Institutions (BIT Mesra, IIT ISM, BAU), student innovation teams, and corporate CSR funding under <strong>NEP 2020 Experiential Learning</strong>.
            </p>

            {/* Fast Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <Link
                href="/citizen/submit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-7 py-4 rounded-2xl shadow-md hover:shadow-lg transition-all hover:scale-102"
              >
                <ShieldAlert className="w-5 h-5" />
                <span>Report Grassroots Problem</span>
              </Link>
              <Link
                href="/university"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-700 hover:bg-indigo-800 text-white font-bold px-6 py-4 rounded-2xl shadow-md transition-all hover:scale-102"
              >
                <GraduationCap className="w-5 h-5" />
                <span>University R&D Portal</span>
              </Link>
              <Link
                href="/industry"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-800 text-white font-bold px-6 py-4 rounded-2xl shadow-md transition-all hover:scale-102"
              >
                <Building2 className="w-5 h-5" />
                <span>Industry CSR Marketplace</span>
              </Link>
              <Link
                href="/gov"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-4 rounded-2xl shadow-md transition-all hover:scale-102"
              >
                <Landmark className="w-5 h-5 text-amber-400" />
                <span>Govt Command Center</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. REAL-TIME STATEWIDE IMPACT METRICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 border-2 border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-md">
                Official State Monitoring
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                Real-Time Statewide Innovation Metrics
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl self-start sm:self-auto">
              Live Synchronization Across All 24 Districts
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/80 border border-slate-200 text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono">
                {stats.totalSocietalProblemsReported}
              </div>
              <p className="text-xs font-bold text-slate-600 mt-1">Challenges Crowdsourced</p>
              <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">🌾 Verified Grassroots Issues</span>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100/60 border border-indigo-200 text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-800 font-mono">
                {stats.participatingUniversitiesAndHEIs}
              </div>
              <p className="text-xs font-bold text-indigo-950 mt-1">Active Universities & HEIs</p>
              <span className="text-[10px] text-indigo-700 font-semibold mt-0.5 block">🎓 BIT Mesra, IIT ISM, BAU, NIT</span>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/60 border border-amber-200 text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-800 font-mono">
                ₹{(stats.totalCSRGrantsMobilizedINR / 100000).toFixed(1)}L+
              </div>
              <p className="text-xs font-bold text-amber-950 mt-1">CSR Grant Capital Pledged</p>
              <span className="text-[10px] text-amber-700 font-semibold mt-0.5 block">🏢 Tata Steel, JSPL Foundations</span>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/60 border border-emerald-200 text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-800 font-mono">
                {stats.solutionsFieldDeployedAndResolved}
              </div>
              <p className="text-xs font-bold text-emerald-950 mt-1">Prototypes Field-Deployed</p>
              <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">⭐ 5-Star Citizen Verified</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE 24-DISTRICT GEOSPATIAL HEATMAP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
              Statewide Innovation Mapping
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Interactive 24-District Problem Map of Jharkhand
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Select any district to inspect grassroots challenge density, active university pilot projects, and sanctioned CSR grant funds.
            </p>
          </div>

          <DistrictHeatmap
            districtStats={districtStats}
            selectedDistrict={selectedDistrict}
            onSelectDistrict={(dist) => setSelectedDistrict(dist)}
          />
        </div>
      </section>

      {/* 6. 4-STAKEHOLDER QUADRUPLE HELIX PORTALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100/80 px-3.5 py-1.5 rounded-full border border-emerald-300">
            Quadruple Helix Portals
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
            Dedicated Stakeholder Gateways
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Empowering rural citizens, engineering researchers, CSR corporate donors, and government decision-makers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portals.map((portal) => {
            const Icon = portal.icon;
            return (
              <div
                key={portal.title}
                className="bg-white rounded-3xl p-7 border-2 border-slate-200 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${portal.color} flex items-center justify-center text-white shadow-md border border-white/20`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full border ${portal.badgeColor}`}>
                      {portal.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">{portal.title}</h3>
                  <p className="text-xs font-semibold text-emerald-800 mb-2">{portal.hindiTitle}</p>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6 font-medium">{portal.desc}</p>
                </div>

                <Link
                  href={portal.href}
                  className="flex items-center justify-between w-full bg-slate-900 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-3.5 rounded-xl transition-all group-hover:shadow-sm"
                >
                  <span>{portal.actionText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. REAL-LIFE GROUND INNOVATIONS ARCHITECTURE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-tr from-slate-950 via-slate-900 to-emerald-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl border border-emerald-900/40">
          <div className="max-w-3xl space-y-6">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-700 px-3.5 py-1 rounded-full">
              Ground Reality Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              Engineered for Real-World Indian Ground Challenges
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300 pt-2">
              <div className="flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5 font-bold">Whistleblower Identity Shield</strong>
                  Zero IP/phone logging, client-side EXIF stripping, and anonymous tracking passkeys (`ANON-JH-XXXXXX`).
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5 font-bold">14-Day Claim Expiry Lock</strong>
                  Prevents universities from hoarding problems without formulating multidisciplinary student teams.
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                <Coins className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5 font-bold">Milestone Tranche Grants</strong>
                  Corporate CSR funds scheduled in 3 verified stages (30/40/30) linked to actual field deliverables.
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5 font-bold">Mandatory Citizen Ground Rating</strong>
                  1–5 star community confirmation required from local panchayats before a challenge is marked resolved.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. OFFICIAL GOVERNMENT PORTAL QUICK LINKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <FileText className="w-4 h-4 text-emerald-700" />
            <span>Jharkhand State Portals & Academic Network Links</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <a
              href="https://cm-jansamvad.jharkhand.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 hover:border-emerald-500 hover:text-emerald-800 flex items-center justify-between transition-all shadow-2xs"
            >
              <span>CM Jan Samvad</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
            <a
              href="https://jharkhand.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 hover:border-emerald-500 hover:text-emerald-800 flex items-center justify-between transition-all shadow-2xs"
            >
              <span>Jharkhand State Portal</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
            <a
              href="https://jutranchi.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 hover:border-emerald-500 hover:text-emerald-800 flex items-center justify-between transition-all shadow-2xs"
            >
              <span>Jharkhand Univ of Tech (JUT)</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
            <a
              href="https://sih.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 hover:border-emerald-500 hover:text-emerald-800 flex items-center justify-between transition-all shadow-2xs"
            >
              <span>AICTE Smart India Hackathon</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
