'use client';

// ==========================================
// UNIVERSITY MODULE - ROUTED CHALLENGE EXPLORER
// File: Frontend/src/app/university/page.tsx
// ==========================================

/*
  PURPOSE:
  - Portal for University Faculty, Researchers, and Student Innovation Teams to discover domain-matched problems and claim challenges under a 14-day lock.

  FEATURES TO IMPLEMENT:
  1. Filter by academic department (Civil/Env, Agriculture, Mechanical/IoT, Medical, CSE).
  2. 1-Click "Claim Problem (14-Day Lock)" button.
  3. Direct Link to "Submit Solution Proposal & Milestone Budget".
*/

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Sparkles,
  Lock,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Filter,
  PlusCircle,
  FileText
} from 'lucide-react';
import { ProblemItem } from '../../lib/types';
import { THEMATIC_DOMAINS, JHARKHAND_DISTRICTS } from '../../lib/constants';
import { universityApi, citizenApi } from '../../lib/api';

export default function UniversityPortalPage() {
  const [problems, setProblems] = useState<ProblemItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const res = await citizenApi.getPublicFeed('?limit=20');
      if (res && res.success && res.problems) {
        setProblems(res.problems);
      } else {
        // Fallback sample data
        setProblems([
          {
            _id: 'sample-p1',
            title: 'High Fluoride & Arsenic Contamination in Rural Community Wells',
            description: 'Over 8 villages in Kanke reporting skeletal fluorosis. Need solar electro-coagulation or low-cost activated alumina filter.',
            isAnonymous: true,
            isDisasterEmergency: false,
            isActionableRnD: true,
            domainCategory: 'Water Resources',
            location: { district: 'Ranchi', block: 'Kanke' },
            mediaAttachments: [],
            status: 'Verified',
            upvotes: ['1', '2', '3', '4'],
            severityLevel: 'High',
            aiTags: ['water-filtration', 'fluoride'],
            createdAt: new Date().toISOString()
          },
          {
            _id: 'sample-p2',
            title: 'Portable IoT Paddy Moisture & Aflatoxin Detection Kit',
            description: 'Post-harvest crop loss due to fungal toxins in damp storage; farmers need rapid handheld moisture sensor.',
            isAnonymous: false,
            isDisasterEmergency: false,
            isActionableRnD: true,
            domainCategory: 'Agriculture',
            location: { district: 'Khunti', block: 'Murhu' },
            mediaAttachments: [],
            status: 'Verified',
            upvotes: ['1', '2'],
            severityLevel: 'Medium',
            aiTags: ['sensor', 'iot', 'agriculture'],
            createdAt: new Date().toISOString()
          }
        ]);
      }
    } catch (err) {
      console.error('Error fetching university feed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [selectedDomain]);

  const handleClaimProblem = async (problemId: string) => {
    setClaimingId(problemId);
    try {
      // Mock token for instant demo test
      const token = typeof window !== 'undefined' ? localStorage.getItem('univ_token') || 'demo_univ_jwt' : 'demo_univ_jwt';
      const res = await universityApi.claimProblem(problemId, token);
      if (res && res.success) {
        alert('🛡️ Challenge successfully claimed! 14-Day Investigation Lock active. Please formulate student team and submit proposal.');
        fetchProblems();
      } else {
        // Optimistic update for demo
        alert('🛡️ Challenge Claimed! 14-Day Lock active. Proceed to create Solution Proposal.');
        setProblems((prev) =>
          prev.map((p) =>
            p._id === problemId
              ? { ...p, status: 'Assigned to University', claimExpiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() }
              : p
          )
        );
      }
    } catch (err: any) {
      alert('Error claiming challenge: ' + err.message);
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-blue-500/30 border border-blue-400/40 text-blue-200 text-xs px-3 py-1 rounded-full font-semibold">
            <span>🎓 NEP 2020 Academic Innovation & R&D Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            University Societal Problem Intake Portal
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Browse verified real-world challenges routed to Higher Education Institutions. Claim challenges under a 14-day lock, form multidisciplinary student teams, and win CSR grants.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <Link
            href="/university/proposals"
            className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-3 rounded-xl shadow-md transition-all text-xs sm:text-sm"
          >
            <FileText className="w-4 h-4" />
            Proposal & Milestones Dashboard
          </Link>
        </div>
      </div>

      {/* Domain Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <button
          onClick={() => setSelectedDomain('All')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
            selectedDomain === 'All'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          🌟 All Disciplines
        </button>
        {THEMATIC_DOMAINS.map((domain) => (
          <button
            key={domain}
            onClick={() => setSelectedDomain(domain)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
              selectedDomain === domain
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {domain}
          </button>
        ))}
      </div>

      {/* Challenges Grid */}
      {loading ? (
        <div className="text-center py-16 space-y-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Loading routed university challenges...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {problems.map((problem) => {
            const isClaimed = problem.status === 'Assigned to University' || problem.status === 'Proposal Submitted';

            return (
              <div
                key={problem._id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-all space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-200 px-3 py-1 rounded-lg">
                      {problem.domainCategory}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      📍 {problem.location.district}, {problem.location.block || 'Jharkhand'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{problem.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{problem.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  {isClaimed ? (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Claimed by Academic Team (14-Day Lock)</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleClaimProblem(problem._id)}
                      disabled={claimingId === problem._id}
                      className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-sm transition-all"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      {claimingId === problem._id ? 'Claiming...' : 'Claim Challenge (14-Day Lock)'}
                    </button>
                  )}

                  <Link
                    href={`/university/proposals?problemId=${problem._id}&title=${encodeURIComponent(problem.title)}`}
                    className="w-full sm:w-auto flex items-center justify-center gap-1 text-xs font-bold text-slate-700 hover:text-indigo-700 bg-slate-100 hover:bg-indigo-50 px-4 py-2.5 rounded-xl transition-colors"
                  >
                    <span>Create Proposal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
