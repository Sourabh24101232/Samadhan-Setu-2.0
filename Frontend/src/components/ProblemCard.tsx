'use client';

// ==========================================
// FRONTEND COMPONENT - PROBLEM CARD
// File: Frontend/src/components/ProblemCard.tsx
// ==========================================

/*
  PURPOSE:
  - Reusable card component displaying a societal challenge with domain tag, severity badge, location, photo preview, and upvote button.

  PROPS TO DEFINE LATER:
  - problem: ProblemItem
  - onUpvote?: (problemId: string) => void

  ELEMENTS TO RENDER LATER:
  1. Header: Domain Badge + Severity Badge + Whistleblower Shield icon if anonymous.
  2. Title & Description snippet.
  3. Location Tag: District & Landmark.
  4. Footer: Upvote counter + Status Pill + "View Details & Solutions" link.
*/

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  ThumbsUp,
  Shield,
  AlertTriangle,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { ProblemItem } from '../lib/types';
import { SEVERITY_COLORS, DOMAIN_ICONS } from '../lib/constants';
import { citizenApi } from '../lib/api';

interface ProblemCardProps {
  problem: ProblemItem;
  onUpvoteSuccess?: (updatedProblem: ProblemItem) => void;
}

export default function ProblemCard({ problem, onUpvoteSuccess }: ProblemCardProps) {
  const [upvotes, setUpvotes] = useState(problem.upvotes || []);
  const [isUpvoting, setIsUpvoting] = useState(false);

  const severityStyle = SEVERITY_COLORS[problem.severityLevel] || SEVERITY_COLORS.Medium;
  const domainIcon = DOMAIN_ICONS[problem.domainCategory] || '📌';

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsUpvoting(true);
    try {
      const voterId = 'client-user-' + (typeof window !== 'undefined' ? localStorage.getItem('guest_voter_id') || Math.random().toString(36).substring(2, 9) : 'voter');
      if (typeof window !== 'undefined') localStorage.setItem('guest_voter_id', voterId);

      const res = await citizenApi.upvoteProblem(problem._id, voterId);
      if (res.success) {
        if (upvotes.includes(voterId)) {
          setUpvotes(upvotes.filter((id) => id !== voterId));
        } else {
          setUpvotes([...upvotes, voterId]);
        }
      }
    } catch (err) {
      console.error('Error upvoting:', err);
    } finally {
      setIsUpvoting(false);
    }
  };

  return (
    <div className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-200/80 flex flex-col justify-between shadow-sm hover:border-emerald-300 transition-all">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-100 text-slate-800 text-xs font-semibold px-2.5 py-1 rounded-lg">
            <span>{domainIcon}</span>
            <span>{problem.domainCategory}</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {problem.isDisasterEmergency && (
              <span className="flex items-center gap-1 text-[11px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-full animate-pulse">
                <AlertTriangle className="w-3 h-3" />
                SOS Emergency
              </span>
            )}
            {problem.isAnonymous && (
              <span className="flex items-center gap-1 text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full">
                <Shield className="w-3 h-3" />
                Whistleblower
              </span>
            )}
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${severityStyle.bg} ${severityStyle.text} ${severityStyle.border}`}
            >
              {problem.severityLevel}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-900 text-base line-clamp-2 mb-1.5 hover:text-emerald-700 transition-colors">
          {problem.title}
        </h3>

        {/* Description Snippet */}
        <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
          {problem.description}
        </p>

        {/* Location & Metadata */}
        <div className="space-y-1.5 text-xs text-slate-500 mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="font-medium text-slate-700">
              {problem.location.district}
              {problem.location.block ? `, ${problem.location.block}` : ''}
            </span>
          </div>
          {problem.assignedUniversityId && (
            <div className="flex items-center gap-1.5 text-indigo-700 bg-indigo-50/70 px-2 py-1 rounded-md">
              <GraduationCap className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate font-medium text-[11px]">
                {problem.assignedUniversityId.universityName}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer / Status & Upvotes */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg ${
              problem.status === 'Resolved'
                ? 'bg-emerald-100 text-emerald-800'
                : problem.status === 'In Progress' || problem.status === 'Testing'
                ? 'bg-amber-100 text-amber-800'
                : problem.status === 'Assigned to University' || problem.status === 'Proposal Submitted'
                ? 'bg-indigo-100 text-indigo-800'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {problem.status === 'Resolved' ? (
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            ) : (
              <Clock className="w-3 h-3 text-slate-500" />
            )}
            {problem.status}
          </span>
        </div>

        <button
          onClick={handleUpvote}
          disabled={isUpvoting}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-emerald-700 bg-slate-50 hover:bg-emerald-50 border border-slate-200 px-3 py-1 rounded-lg transition-all active:scale-95"
          title="Upvote this community challenge"
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          <span className="font-bold">{upvotes.length}</span>
        </button>
      </div>
    </div>
  );
}
