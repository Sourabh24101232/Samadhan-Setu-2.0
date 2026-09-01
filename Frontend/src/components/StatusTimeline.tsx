'use client';

// ==========================================
// FRONTEND COMPONENT - PROBLEM RESOLUTION TIMELINE
// File: Frontend/src/components/StatusTimeline.tsx
// ==========================================

/*
  PURPOSE:
  - 6-Stage visual tracker rendering current stage of societal challenge.

  STAGES TO RENDER LATER:
  1. Submitted (Reported by Citizen / Whistleblower).
  2. Verified (Gov validation & AI categorisation).
  3. Assigned to University (Claimed with 14-day lock).
  4. Proposal Submitted (CSR sponsor milestone tranche pledged).
  5. In Progress & Testing (Working lab prototype / demo).
  6. Resolved & Deployed (Citizen ground verification rating).
*/

import React from 'react';
import {
  CheckCircle,
  Clock,
  Send,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Wrench,
  Award
} from 'lucide-react';
import { ProblemStatus } from '../lib/types';

interface StatusTimelineProps {
  currentStatus: ProblemStatus;
  claimExpiresAt?: string;
  assignedUniversityName?: string;
  rating?: number;
}

export default function StatusTimeline({
  currentStatus,
  claimExpiresAt,
  assignedUniversityName,
  rating
}: StatusTimelineProps) {
  const stages = [
    {
      key: 'Submitted',
      title: 'Problem Reported',
      desc: 'Submitted by citizen / whistleblower with evidence.',
      icon: Send
    },
    {
      key: 'Verified',
      title: 'Gov R&D Verified',
      desc: 'Screened for scientific R&D feasibility and auto-routed.',
      icon: ShieldCheck
    },
    {
      key: 'Assigned to University',
      title: 'Claimed by University',
      desc: assignedUniversityName
        ? `Claimed by ${assignedUniversityName}.`
        : 'Assigned to university R&D department under 14-day lock.',
      icon: GraduationCap
    },
    {
      key: 'Proposal Submitted',
      title: 'Proposal & CSR Grant',
      desc: 'Multidisciplinary proposal with milestone tranches.',
      icon: Sparkles
    },
    {
      key: 'Testing',
      title: 'Prototype & Field Trial',
      desc: 'Lab hardware built and pilot deployed in target district.',
      icon: Wrench
    },
    {
      key: 'Resolved',
      title: 'Field Deployed & Verified',
      desc: rating
        ? `Citizen ground verified (${rating} / 5 ⭐ rating).`
        : 'Community handover and ground impact confirmation complete.',
      icon: Award
    }
  ];

  const statusOrder: Record<string, number> = {
    Submitted: 1,
    'Under Review': 1,
    Verified: 2,
    'Assigned to University': 3,
    'Proposal Submitted': 4,
    'In Progress': 5,
    Testing: 5,
    Resolved: 6,
    Emergency_Escalated: 2,
    Rejected: 0
  };

  const currentLevel = statusOrder[currentStatus] || 1;

  return (
    <div className="py-4">
      <div className="relative">
        {/* Connector Line */}
        <div className="absolute top-5 left-6 right-6 hidden md:block h-0.5 bg-slate-200" />
        <div
          className="absolute top-5 left-6 hidden md:block h-0.5 bg-emerald-500 transition-all duration-500"
          style={{ width: `${Math.min(100, ((currentLevel - 1) / (stages.length - 1)) * 100)}%` }}
        />

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {stages.map((stage, idx) => {
            const stepNumber = idx + 1;
            const isCompleted = stepNumber < currentLevel || currentStatus === 'Resolved';
            const isCurrent = stepNumber === currentLevel && currentStatus !== 'Resolved';
            const Icon = stage.icon;

            return (
              <div key={stage.key} className="flex md:flex-col items-start md:items-center gap-3 md:gap-2">
                {/* Icon Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 font-bold transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                      : isCurrent
                      ? 'bg-amber-500 text-white ring-4 ring-amber-100 shadow-md animate-pulse'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>

                {/* Text Labels */}
                <div className="md:text-center">
                  <p
                    className={`text-xs font-bold ${
                      isCompleted ? 'text-emerald-800' : isCurrent ? 'text-amber-800' : 'text-slate-500'
                    }`}
                  >
                    {stage.title}
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-tight">
                    {stage.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {claimExpiresAt && currentStatus === 'Assigned to University' && (
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2 text-xs text-amber-800">
          <Clock className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>14-Day Expiry Lock Active:</strong> Must submit solution proposal before{' '}
            {new Date(claimExpiresAt).toLocaleDateString()} or the challenge will unlock for other HEIs.
          </span>
        </div>
      )}
    </div>
  );
}
