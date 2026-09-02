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

import React, { useState, useEffect } from 'react';
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
  ArrowLeft,
  RefreshCw,
  Award
} from 'lucide-react';
import { govApi, citizenApi } from '../../../lib/api';

export default function GovVerifyPage() {
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await citizenApi.getPublicFeed('?limit=50');
      if (res && res.success && res.problems && res.problems.length > 0) {
        setProblems(res.problems);
      } else {
        setProblems([
          {
            _id: 'sample-v1',
            title: 'Fluoride and Arsenic Contamination in Rural Community Borewells',
            location: { district: 'Ranchi' },
            domainCategory: 'Water Resources',
            isAnonymous: true,
            isDisasterEmergency: false,
            status: 'Submitted',
            recommendedHEI: 'BIT Mesra, Ranchi'
          },
          {
            _id: 'sample-v2',
            title: 'Pothole on Main Road near Bus Stand in Hazaribagh',
            location: { district: 'Hazaribagh' },
            domainCategory: 'Urban Development',
            isAnonymous: false,
            isDisasterEmergency: false,
            status: 'Submitted',
            isRoutineComplaint: true
          }
        ]);
      }
    } catch (err) {
      console.error('Error fetching gov verification queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleValidateRnD = async (problemId: string, heiName: string) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('gov_token') || 'demo_token' : 'demo_token';
      const res = await govApi.verifyProblem(problemId, { isActionableRnD: true }, token);
      if (res && res.success) {
        alert(`✓ Problem validated as Academic R&D challenge and officially verified for university innovation!`);
        setProblems((prev) =>
          prev.map((p) => (p._id === problemId ? { ...p, status: 'Verified' } : p))
        );
      } else {
        alert('Validation failed: ' + (res?.message || 'Please ensure the Government service on port 5004 is running.'));
      }
    } catch (err: any) {
      alert('Error validating problem: ' + err.message);
    }
  };

  const handleRedirectJanSamvad = async (problemId: string) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('gov_token') || 'demo_token' : 'demo_token';
      const res = await govApi.verifyProblem(problemId, { isActionableRnD: false }, token);
      if (res && res.success) {
        alert('⚠️ Problem marked as Routine Municipal Grievance and redirected to Jharkhand Jan Samvad portal (https://jansamvad.jharkhand.gov.in).');
        setProblems((prev) =>
          prev.map((p) => (p._id === problemId ? { ...p, status: 'Rejected' } : p))
        );
      } else {
        alert('Redirection failed: ' + (res?.message || 'Please ensure the Government service on port 5004 is running.'));
      }
    } catch (err: any) {
      alert('Error redirecting problem: ' + err.message);
    }
  };

  const handleGrantPilotSanction = async (problemId: string, district: string) => {
    try {
      const sanctionNo = `JH-PILOT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const token = typeof window !== 'undefined' ? localStorage.getItem('gov_token') || 'demo_token' : 'demo_token';
      const res = await govApi.approvePilot(problemId, { pilotAuthorizationNumber: sanctionNo, remarks: `Approved for ${district} field testing.` }, token);
      if (res && res.success) {
        alert(`🎉 Official Government Field Pilot Sanction Order [${sanctionNo}] granted for deployment in ${district} district!`);
        setProblems((prev) =>
          prev.map((p) => (p._id === problemId ? { ...p, status: 'Testing' } : p))
        );
      } else {
        alert('Pilot sanction failed: ' + (res?.message || 'Please ensure the Government service on port 5004 is running.'));
      }
    } catch (err: any) {
      alert('Error granting pilot sanction: ' + err.message);
    }
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
                    {p.domainCategory || p.domain || 'Water Resources'}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-600">
                    📍 {p.location?.district || p.district || 'Ranchi'} District
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
                {p.description && (
                  <p className="text-xs text-slate-600 line-clamp-2">{p.description}</p>
                )}
                {p.recommendedHEI && (
                  <p className="text-xs text-indigo-700 font-medium">
                    Recommended HEI: <strong>{p.recommendedHEI}</strong>
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap shrink-0">
                {p.status === 'In Progress' || p.readyForPilot ? (
                  <button
                    onClick={() => handleGrantPilotSanction(p._id, p.location?.district || p.district || 'Khunti')}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md shadow-emerald-100 transition-all hover:scale-105"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>Authorize Field Pilot Sanction</span>
                  </button>
                ) : p.status === 'Testing' ? (
                  <span className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-3 py-1.5 rounded-xl text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Field Pilot Sanctioned (In Testing)</span>
                  </span>
                ) : p.status === 'Verified' ? (
                  <span className="flex items-center gap-1.5 bg-indigo-50 text-indigo-800 border border-indigo-200 font-bold px-3 py-1.5 rounded-xl text-xs">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                    <span>Verified R&D (Open for HEI Claim)</span>
                  </span>
                ) : p.status === 'Assigned to University' || p.status === 'Proposal Submitted' ? (
                  <span className="flex items-center gap-1.5 bg-purple-50 text-purple-800 border border-purple-200 font-bold px-3 py-1.5 rounded-xl text-xs">
                    <GraduationCap className="w-4 h-4 text-purple-600" />
                    <span>HEI R&D Proposal Active</span>
                  </span>
                ) : p.status === 'Resolved' ? (
                  <span className="flex items-center gap-1.5 bg-teal-100 text-teal-800 border border-teal-300 font-bold px-3 py-1.5 rounded-xl text-xs">
                    <Award className="w-4 h-4 text-teal-600" />
                    <span>Resolved & Ground Verified ★</span>
                  </span>
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
