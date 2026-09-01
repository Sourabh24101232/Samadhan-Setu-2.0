'use client';

// ==========================================
// GOVERNMENT MODULE - STATEWIDE ANALYTICS DASHBOARD
// File: Frontend/src/app/gov/page.tsx
// ==========================================

/*
  PURPOSE:
  - Executive command center for Jharkhand Department of Higher & Technical Education featuring 24-district heatmap intelligence, disaster SOS queue, and KPI metrics.

  FEATURES TO IMPLEMENT:
  1. Statewide Executive KPI Cards.
  2. Interactive 24-District Heatmap & Problem Density Grid.
  3. 🚨 Disaster Emergency SOS Alert Queue.
  4. Link to Problem Verification & Pilot Sanctions.
*/

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Landmark,
  ShieldAlert,
  GraduationCap,
  Coins,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  TrendingUp,
  Award,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import DistrictHeatmap from '../../components/DistrictHeatmap';
import { govApi } from '../../lib/api';
import { DistrictStat, StatewideKPIs } from '../../lib/types';

export default function GovDashboardPage() {
  const [kpis, setKpis] = useState<StatewideKPIs>({
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
    govApi.getOverviewKPIs().then((res) => {
      if (res && res.success && res.data) setKpis(res.data);
    }).catch(() => {});

    govApi.getDistrictStats().then((res) => {
      if (res && res.success && res.data) setDistrictStats(res.data);
    }).catch(() => {});
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs px-3 py-1 rounded-full font-semibold">
            <span>🏛️ Department of Higher & Technical Education • Govt of Jharkhand</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Statewide Societal Innovation Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Real-time geospatial intelligence, disaster emergency SOS monitoring, academic allocation queues, and field pilot deployment sanctions.
          </p>
        </div>

        {/* Action Button */}
        <Link
          href="/gov/verify"
          className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-3 rounded-xl shadow-md transition-all text-xs sm:text-sm shrink-0"
        >
          <ShieldCheck className="w-4 h-4" />
          Review & Validate Problem Queue
        </Link>
      </div>

      {/* 1. Statewide KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Challenges Reported</span>
            <span>📍</span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {kpis.totalSocietalProblemsReported}
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold">Across all 24 districts</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Active HEI Projects</span>
            <span>🎓</span>
          </div>
          <div className="text-3xl font-extrabold text-indigo-700">
            {kpis.activeChallengesInProgress}
          </div>
          <p className="text-[11px] text-indigo-700 font-semibold">Under 14-day lock & R&D</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>CSR Grants Mobilized</span>
            <span>💰</span>
          </div>
          <div className="text-3xl font-extrabold text-amber-700">
            ₹{(kpis.totalCSRGrantsMobilizedINR / 100000).toFixed(1)}L
          </div>
          <p className="text-[11px] text-amber-700 font-semibold">3-Stage Tranche Releases</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Solutions Deployed</span>
            <span>🎉</span>
          </div>
          <div className="text-3xl font-extrabold text-emerald-700">
            {kpis.solutionsFieldDeployedAndResolved}
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold">
            {kpis.resolutionRatePercentage}% Ground Resolution Rate
          </p>
        </div>
      </div>

      {/* 2. 🚨 Disaster Emergency SOS Alerts Queue */}
      <div className="bg-red-50/80 border-2 border-red-200 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
            <h3 className="font-extrabold text-red-950 text-base flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span>🚨 Live Disaster Emergency SOS Priority Queue (DDMA Fast-Track)</span>
            </h3>
          </div>
          <span className="text-xs font-extrabold text-white bg-red-600 px-3 py-1 rounded-full">
            {kpis.disasterEmergencySOSAlerts} Critical Incidents
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="bg-white rounded-2xl p-4 border border-red-200 shadow-sm space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-red-900">Dhanbad • Jharia Block</span>
              <span className="bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded text-[10px]">
                Mine Fire Toxic Leaks
              </span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              Sudden carbon monoxide emission from fissure near residential ward 4. Rapid sensor deployment & evacuation support needed.
            </p>
            <div className="pt-2 flex justify-between items-center">
              <span className="text-[11px] text-slate-500">Reported 3h ago</span>
              <button
                onClick={() => alert('Emergency alert dispatched to Dhanbad DDMA & IIT ISM Rapid Unit!')}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg text-[11px]"
              >
                Dispatch to DDMA & IIT ISM
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-red-200 shadow-sm space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-red-900">Sahibganj • Rajmahal</span>
              <span className="bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded text-[10px]">
                Riverbank Breach Threat
              </span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              Ganga riverbank erosion threatening 120 tribal households; requires geo-textile reinforcement and drone structural survey.
            </p>
            <div className="pt-2 flex justify-between items-center">
              <span className="text-[11px] text-slate-500">Reported 5h ago</span>
              <button
                onClick={() => alert('Emergency alert dispatched to Sahibganj DDMA & NIT Jamshedpur!')}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg text-[11px]"
              >
                Dispatch to DDMA & NIT JSR
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 24-District Interactive Heatmap */}
      <DistrictHeatmap
        districtStats={districtStats}
        selectedDistrict={selectedDistrict}
        onSelectDistrict={setSelectedDistrict}
      />
    </div>
  );
}
