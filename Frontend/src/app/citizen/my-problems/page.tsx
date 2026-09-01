'use client';

// ==========================================
// CITIZEN MODULE - MY SUBMISSIONS & ANONYMOUS TRACKER
// File: Frontend/src/app/citizen/my-problems/page.tsx
// ==========================================

/*
  PURPOSE:
  - Dual tracker page supporting logged-in citizen submissions and login-free Anonymous Whistleblower secret passkey lookups with 1-5 star ground verification.

  FEATURES TO IMPLEMENT:
  1. Tab 1: 🔑 Anonymous Secret Passkey Lookup (zero login required).
  2. Tab 2: 👤 My Authenticated Submissions.
  3. Interactive 6-Stage <StatusTimeline /> rendering.
  4. Ground-Truth Verification Modal (1–5 Star Rating + Citizen sign-off).
*/

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Key,
  Search,
  Shield,
  Star,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  GraduationCap,
  Award
} from 'lucide-react';
import StatusTimeline from '../../../components/StatusTimeline';
import { ProblemItem } from '../../../lib/types';
import { citizenApi } from '../../../lib/api';

function MyProblemsContent() {
  const searchParams = useSearchParams();
  const initialPasskey = searchParams.get('passkey') || '';

  const [activeTab, setActiveTab] = useState<'passkey' | 'auth'>('passkey');
  const [passkeyInput, setPasskeyInput] = useState(initialPasskey);
  const [trackedProblem, setTrackedProblem] = useState<ProblemItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Ground Verification Modal States
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingValue, setRatingValue] = useState(5);
  const [feedbackComments, setFeedbackComments] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);

  const handleLookupPasskey = async (tokenToLookup?: string) => {
    const token = tokenToLookup || passkeyInput.trim();
    if (!token) return;

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await citizenApi.getAnonymousTimeline(token);
      if (res && res.success && res.problem) {
        setTrackedProblem(res.problem);
      } else {
        setErrorMsg(res.message || 'No challenge found matching this secret passkey.');
        setTrackedProblem(null);
      }
    } catch (err: any) {
      setErrorMsg('Error looking up secret passkey: ' + err.message);
      setTrackedProblem(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialPasskey) {
      setPasskeyInput(initialPasskey);
      handleLookupPasskey(initialPasskey);
    }
  }, [initialPasskey]);

  const handleConfirmResolution = async () => {
    if (!trackedProblem) return;
    setSubmittingRating(true);
    try {
      const res = await citizenApi.confirmGroundResolution(trackedProblem._id, {
        rating: ratingValue,
        citizenFeedbackComments: feedbackComments,
        anonymousTrackingToken: trackedProblem.anonymousTrackingToken
      });
      if (res && res.success) {
        alert('🎉 Ground verification & community rating recorded successfully! Thank you.');
        setShowRatingModal(false);
        if (trackedProblem.anonymousTrackingToken) {
          handleLookupPasskey(trackedProblem.anonymousTrackingToken);
        }
      } else {
        alert(res.message || 'Error submitting ground verification.');
      }
    } catch (err: any) {
      alert('Failed to submit verification: ' + err.message);
    } finally {
      setSubmittingRating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Challenge Tracking & Ground Verification Hub
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Track R&D milestones for reported challenges and confirm ground resolution with a 1–5 star community rating.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab('passkey')}
          className={`pb-3 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'passkey'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Key className="w-4 h-4 text-amber-500" />
          <span>🔑 Track Secret Passkey (Whistleblower / Guest)</span>
        </button>
        <button
          onClick={() => setActiveTab('auth')}
          className={`pb-3 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'auth'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span>👤 My Logged-in Submissions</span>
        </button>
      </div>

      {/* TAB 1: ANONYMOUS SECRET PASSKEY LOOKUP */}
      {activeTab === 'passkey' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl w-fit">
              <Shield className="w-4 h-4" />
              <span>Zero-Login Secret Passkey Protocol</span>
            </div>

            <h3 className="font-bold text-slate-900 text-lg">
              Enter Your Secret Tracking Passkey
            </h3>
            <p className="text-xs text-slate-600">
              Enter the passkey generated during submission (e.g. <code>ANON-JH-A98B21</code>) to inspect live university R&D progress.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <input
                type="text"
                placeholder="Enter Passkey (e.g. ANON-JH-XXXXXX)"
                value={passkeyInput}
                onChange={(e) => setPasskeyInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLookupPasskey()}
                className="flex-grow px-4 py-3 rounded-xl border border-slate-200 font-mono text-sm uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={() => handleLookupPasskey()}
                disabled={loading || !passkeyInput.trim()}
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl shadow-sm text-xs transition-all"
              >
                <Search className="w-4 h-4" />
                {loading ? 'Locating...' : 'Track Timeline'}
              </button>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200 font-medium">
                {errorMsg}
              </p>
            )}
          </div>

          {/* Timeline & Details Card */}
          {trackedProblem && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                    {trackedProblem.domainCategory}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-2">
                    {trackedProblem.title}
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      {trackedProblem.location.district}, {trackedProblem.location.block || 'Jharkhand'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-slate-100 text-slate-800 px-3 py-1.5 rounded-xl border border-slate-200">
                    Status: {trackedProblem.status}
                  </span>
                </div>
              </div>

              {/* 6-Stage Visual Timeline */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                  Innovation Resolution Progress
                </h4>
                <StatusTimeline
                  currentStatus={trackedProblem.status}
                  claimExpiresAt={trackedProblem.claimExpiresAt}
                  assignedUniversityName={trackedProblem.assignedUniversityId?.universityName}
                  rating={trackedProblem.citizenGroundFeedback?.rating}
                />
              </div>

              {/* Problem Description */}
              <div className="space-y-2 text-xs text-slate-700">
                <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
                  Reported Challenge Details
                </h4>
                <p className="leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {trackedProblem.description}
                </p>
              </div>

              {/* Ground-Truth Confirmation Section */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-emerald-950 flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-700" />
                    <span>Citizen Ground-Truth Verification & Rating</span>
                  </h4>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    Has the university team deployed the solution in your village? Confirm if the challenge has been solved on the ground.
                  </p>
                </div>

                <button
                  onClick={() => setShowRatingModal(true)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-sm shrink-0 transition-all"
                >
                  {trackedProblem.citizenGroundFeedback?.isResolvedConfirmedByCitizen
                    ? 'Update 1-5★ Rating'
                    : 'Confirm Resolution (1-5★)'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: LOGGED-IN SUBMISSIONS PLACEHOLDER */}
      {activeTab === 'auth' && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-2xl mx-auto">
            👤
          </div>
          <h3 className="font-bold text-slate-800 text-lg">Citizen Login Required</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            To view non-anonymous submissions tied to your registered phone number, please sign in.
          </p>
        </div>
      )}

      {/* 1–5 STAR GROUND VERIFICATION MODAL */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-6 animate-in zoom-in-95">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl mx-auto">
                ⭐
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Rate Deployed Solution
              </h3>
              <p className="text-xs text-slate-600">
                Your rating directly updates the university and government impact records.
              </p>
            </div>

            {/* Star Selector */}
            <div className="flex justify-center items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatingValue(star)}
                  className="p-1.5 focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= ratingValue
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Feedback Comments */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Ground Experience Feedback (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Filter was installed at the primary school well; water is now completely clear and sweet."
                value={feedbackComments}
                onChange={(e) => setFeedbackComments(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowRatingModal(false)}
                className="flex-1 py-3 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submittingRating}
                onClick={handleConfirmResolution}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
              >
                {submittingRating ? 'Saving...' : 'Submit Rating'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CitizenMyProblemsPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs text-slate-500">Loading tracking dashboard...</div>}>
      <MyProblemsContent />
    </Suspense>
  );
}
