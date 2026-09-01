'use client';

// ==========================================
// FRONTEND - LANDING / HOME PAGE
// File: Frontend/src/app/page.tsx
// ==========================================

/*
  PURPOSE:
  - Main landing page showcasing the 4-Stakeholder Quadruple Helix platform (Citizens, Universities, Industry CSR, Govt).

  SECTIONS TO RENDER:
  1. Hero section: Bilingual headline + Problem Statement SIH26043 context.
  2. Live Impact Counters: Total Problems Solved, Active HEIs, CSR Funds Pledged.
  3. 4 Stakeholder Access Portals:
     - Citizens (Anonymous Whistleblower / Verified)
     - Universities / HEIs (14-day claim & proposal builder)
     - Industry & CSR (Tranche-based funding & mentorship)
     - Govt Review & Heatmap Analytics
  4. NEP 2020 Experiential Learning & Hackathon Highlights.
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
  ShieldCheck
} from 'lucide-react';
import { govApi } from '../lib/api';
import { StatewideKPIs } from '../lib/types';

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

  useEffect(() => {
    govApi.getOverviewKPIs().then((res) => {
      if (res && res.success && res.data) {
        setStats(res.data);
      }
    }).catch(() => {
      // Use fallback defaults
    });
  }, []);

  const portals = [
    {
      title: 'Citizens & Panchayats',
      subtitle: 'नागरिक एवं पंचायत मंच',
      desc: 'Report grassroots community challenges with photo evidence and voice notes. Supports 🛡️ Anonymous Whistleblower Protection.',
      href: '/citizen',
      actionText: 'Report or Track Problem',
      icon: ShieldCheck,
      color: 'from-emerald-500 to-teal-700',
      tag: 'Grassroots Sourcing'
    },
    {
      title: 'Universities & HEIs',
      subtitle: 'विश्वविद्यालय एवं शोध संस्थान',
      desc: 'Claim domain-matched challenges under a 14-day lock, assemble student teams, and submit milestone-based R&D proposals.',
      href: '/university',
      actionText: 'Explore & Claim Challenges',
      icon: GraduationCap,
      color: 'from-blue-600 to-indigo-800',
      tag: 'NEP 2020 R&D'
    },
    {
      title: 'Industry & CSR Foundations',
      subtitle: 'उद्योग एवं सीएसआर सहभागिता',
      desc: 'Discover vetted student innovations, pledge milestone tranche grants, track UTR disbursements, and mentor young engineers.',
      href: '/industry',
      actionText: 'Browse Proposals & Fund',
      icon: Building2,
      color: 'from-amber-500 to-orange-700',
      tag: 'CSR Grant Marketplace'
    },
    {
      title: 'Government of Jharkhand',
      subtitle: 'झारखंड सरकार समीक्षा डैशबोर्ड',
      desc: 'Departmental review queue, Disaster SOS alerts, official field pilot sanctions, and live 24-district heatmap intelligence.',
      href: '/gov',
      actionText: 'State Analytics Dashboard',
      icon: Landmark,
      color: 'from-slate-700 to-slate-900',
      tag: 'Statewide Governance'
    }
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-gradient-to-b from-emerald-50/60 via-slate-50 to-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Gov & SIH Badge */}
            <div className="inline-flex items-center gap-2 bg-emerald-100/80 border border-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-900 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Govt of Jharkhand • Dept of Higher & Technical Education • SIH26043</span>
            </div>

            {/* Bilingual Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Samadhan-Setu <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700">
                समाधान सेतु
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Bridging grassroots societal challenges across Jharkhand with higher educational institutions (HEIs), student innovation teams, and corporate CSR funding under <strong>NEP 2020 Experiential Learning</strong>.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/citizen/submit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <ShieldAlert className="w-5 h-5" />
                Report a Challenge (Auth / Anon)
              </Link>
              <Link
                href="/university"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold px-6 py-3.5 rounded-xl shadow-sm transition-all"
              >
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                University R&D Portal
              </Link>
              <Link
                href="/gov"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-3.5 rounded-xl shadow-sm transition-all"
              >
                <Landmark className="w-5 h-5 text-amber-400" />
                24-District Heatmap
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE IMPACT METRICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Real-Time Statewide Impact
            </h2>
            <p className="text-xl font-extrabold text-slate-900 mt-1">
              Live Progress Across Jharkhand's 24 Districts
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <div className="text-3xl font-extrabold text-slate-900">
                {stats.totalSocietalProblemsReported}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">Challenges Crowdsourced</p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-center">
              <div className="text-3xl font-extrabold text-indigo-700">
                {stats.participatingUniversitiesAndHEIs}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">Participating HEIs (BIT, IIT, BAU)</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 text-center">
              <div className="text-3xl font-extrabold text-amber-700">
                ₹{(stats.totalCSRGrantsMobilizedINR / 100000).toFixed(1)} Lakhs
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">CSR Grant Funds Pledged</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-center">
              <div className="text-3xl font-extrabold text-emerald-700">
                {stats.solutionsFieldDeployedAndResolved}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">Prototypes Field-Deployed</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 4-STAKEHOLDER QUADRUPLE HELIX PORTALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full">
            Stakeholder Ecosystem
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
            Tailored Portals for Every Actor
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Seamlessly integrating rural communities, student engineering teams, corporate CSR donors, and government decision-makers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portals.map((portal) => {
            const Icon = portal.icon;
            return (
              <div
                key={portal.title}
                className="glass-card glass-card-hover rounded-3xl p-7 border border-slate-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${portal.color} flex items-center justify-center text-white shadow-md`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                      {portal.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">{portal.title}</h3>
                  <p className="text-xs font-medium text-emerald-700 mb-2">{portal.subtitle}</p>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">{portal.desc}</p>
                </div>

                <Link
                  href={portal.href}
                  className="flex items-center justify-between w-full bg-slate-900 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-3 rounded-xl transition-colors group"
                >
                  <span>{portal.actionText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. REAL-LIFE GROUND INNOVATION FEATURES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-tr from-slate-900 to-slate-800 rounded-3xl p-8 sm:p-12 text-white">
          <div className="max-w-3xl space-y-6">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3 py-1 rounded-full">
              Ground Reality Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              Designed for Real-Life Indian Societal Challenges
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300 pt-2">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">Whistleblower Protection</strong>
                  Zero IP/phone logging, client-side EXIF stripping, and anonymous secret passkeys.
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">14-Day Claim Expiry Lock</strong>
                  Prevents universities from hoarding problems without submitting concrete proposals.
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Coins className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">Milestone Tranche Grants</strong>
                  Corporate CSR funds disbursed in 3 stages linked to verified prototype milestones.
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">Citizen Ground Verification</strong>
                  1–5 star rating required from local panchayats before a challenge is marked resolved.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
