'use client';

// ==========================================
// GOVERNMENT MODULE - PROBLEM VALIDATION & PILOT APPROVALS
// File: Frontend/src/app/gov/verify/page.tsx
// ==========================================

/*
  PURPOSE:
  - Enables government reviewers to validate problems for R&D feasibility, redirect routine grievances to Jharkhand Jan Samvad, and authorize field pilot deployments.

  FEATURES TO IMPLEMENT:
  1. Incoming Problem Review Table with Whistleblower identity protection.
  2. Action: Validate R&D & Route to University (BIT Mesra, IIT ISM, etc.).
  3. Action: Redirect Non-R&D Routine Grievance to Jan Samvad.
  4. Action: Grant Official Government Field Pilot Sanction.
*/

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  ShieldAlert,
  GraduationCap,
  ExternalLink,
  CheckCircle2,
  XCircle,
  FileCheck,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import { govApi } from '../../../lib/api';

export default function GovVerifyPage() {
  const [problems, setProblems] = useState<any[]>([
    {
      _id: 'p-v1',
      title: 'Fluoride and Arsenic Contamination in Rural Community Borewells',
      district: 'Ranchi',
      domain: 'Water Resources',
      isAnonymous: true,
      isDisasterEmergency: false,
      status: 'Submitted',
      recommendedHEI: 'BIT Mesra, Ranchi'
    },
    {
      _id: 'p-v2',
      title: 'Pothole on Main Road near Bus Stand in Hazaribagh',
      district: 'Hazaribagh',
      domain: 'Urban Development',
      isAnonymous: false,
      isDisasterEmergency: false,
      status: 'Submitted',
      isRoutineComplaint: true
    },
    {
      _id: 'p-v3',
      title: 'Low-Cost Solar Electro-Coagulation Filter Prototype Complete',
      district: 'Ranchi',
      domain: 'Water Resources',
      isAnonymous: true,
      status: 'Testing',
      universityName: 'BIT Mesra, Ranchi',
      readyForPilot: true
    }
  ]);

  const handleValidateRnD = async (problemId: string, heiName: string) => {
    alert(`✓ Problem validated as Academic R&D challenge and officially routed to ${heiName}!`);
    setProblems((prev) =>
      prev.map((p) => (p._id === problemId ? { ...p, status: 'Assigned to University' } : p))
    );
  };

  const handleRedirectJanSamvad = async (problemId: string) => {
    alert('⚠️ Problem marked as Routine Municipal Grievance and redirected to Jharkhand Jan Samvad portal (https://jansamvad.jharkhand.gov.in).');
    setProblems((prev) =>
      prev.map((p) => (p._id === problemId ? { ...p, status: 'Redirected_To_Jan_Samvad' } : p))
    );
  };

  const handleGrantPilotSanction = async (problemId: string, district: string) => {
    const sanctionNo = `JH-PILOT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    alert(`🎉 Official Government Field Pilot Sanction Order [${sanctionNo}] granted for deployment in ${district} district!`);
    setProblems((prev) =>
      prev.map((p) => (p._id === problemId ? { ...p, status: 'Pilot_Sanctioned' } : p))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/gov"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-semibold mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Command Center</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Government Problem Review & Allocation Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Screen incoming crowdsourced problems, filter out routine civic complaints, and grant pilot deployment sanctions.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-900 px-3.5 py-2 rounded-2xl text-xs font-bold w-fit">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Whistleblower Identity Shield Active</span>
        </div>
      </div>

      {/* Review Queue Table Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <h3 className="font-bold text-slate-900 text-lg">
          Incoming Challenges Verification Queue
        </h3>

        <div className="space-y-4">
          {problems.map((p) => (
            <div
              key={p._id}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded-md">
                    {p.domain}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-600">
                    📍 {p.district} District
                  </span>
                  {p.isAnonymous && (
                    <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                      🛡️ Whistleblower Protected
                    </span>
                  )}
                  <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">
                    Status: {p.status}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-base">{p.title}</h4>
                {p.recommendedHEI && (
                  <p className="text-xs text-indigo-700 font-medium">
                    Recommended HEI: <strong>{p.recommendedHEI}</strong>
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap shrink-0">
                {p.readyForPilot ? (
                  <button
                    onClick={() => handleGrantPilotSanction(p._id, p.district)}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition-colors"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>Authorize Field Pilot Sanction</span>
                  </button>
                ) : p.isRoutineComplaint ? (
                  <button
                    onClick={() => handleRedirectJanSamvad(p._id)}
                    className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Redirect to Jan Samvad</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleValidateRnD(p._id, p.recommendedHEI || 'BIT Mesra')}
                      className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs shadow-sm transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Validate & Assign HEI</span>
                    </button>
                    <button
                      onClick={() => handleRedirectJanSamvad(p._id)}
                      className="flex items-center gap-1 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold"
                    >
                      <span>Jan Samvad</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
