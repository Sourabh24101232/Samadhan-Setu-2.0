'use client';

// ==========================================
// UNIVERSITY MODULE - PROPOSAL BUILDER & MILESTONES
// File: Frontend/src/app/university/proposals/page.tsx
// ==========================================

/*
  PURPOSE:
  - Enables academic multidisciplinary teams to submit R&D solution proposals with milestone tranches, IP ownership declarations, and prototype evidence uploads.

  FEATURES TO IMPLEMENT:
  1. Proposal creation form with student team members, faculty supervisor sign-off, budget, and IP declaration.
  2. Milestone Tranche Tracker (% funding to release on each stage).
  3. Prototype Evidence Uploader (Demo Photos / Videos / CAD Links).
*/

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  FileText,
  PlusCircle,
  Users,
  Coins,
  ShieldCheck,
  Upload,
  CheckCircle2,
  Clock,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import { universityApi } from '../../../lib/api';
import OfficialLetterModal, { LetterData } from '../../../components/OfficialLetterModal';

function UniversityProposalsContent() {
  const searchParams = useSearchParams();
  const problemIdFromUrl = searchParams.get('problemId') || '';
  const problemTitleFromUrl = searchParams.get('title') || '';
  const [selectedLetter, setSelectedLetter] = useState<{ isOpen: boolean; data: LetterData } | null>(null);

  // Form State
  const [problemId, setProblemId] = useState(problemIdFromUrl || 'demo-p1');
  const [proposalTitle, setProposalTitle] = useState(
    problemTitleFromUrl ? `Solution: ${decodeURIComponent(problemTitleFromUrl)}` : 'Low-Cost Solar Electro-Coagulation Water Filter'
  );
  const [executiveSummary, setExecutiveSummary] = useState(
    'Solar powered mobile filtration unit removing 98% fluoride and heavy metals using electrolysis.'
  );
  const [proposedMethodology, setProposedMethodology] = useState(
    '1. CAD Modeling & circuit simulation -> 2. Bench prototype lab test -> 3. Village field deployment'
  );
  const [estimatedBudgetINR, setEstimatedBudgetINR] = useState(150000);
  const [ipDeclaration, setIpDeclaration] = useState('Open_Source_Social_Good');
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    if (problemIdFromUrl) {
      setProblemId(problemIdFromUrl);
      if (problemTitleFromUrl) {
        setProposalTitle(`Solution: ${decodeURIComponent(problemTitleFromUrl)}`);
      }
    }
  }, [problemIdFromUrl, problemTitleFromUrl]);

  // Submitted Proposals List State
  const [proposals, setProposals] = useState<any[]>([
    {
      _id: 'prop-101',
      proposalTitle: 'Low-Cost Solar Electro-Coagulation Fluoride Filter',
      problemTitle: 'Severe Fluoride in Kanke Community Wells',
      estimatedBudgetINR: 150000,
      ipOwnershipDeclaration: 'Open_Source_Social_Good',
      status: 'Funded_In_Progress',
      sponsorName: 'Tata Steel CSR Foundation',
      milestones: [
        { num: 1, title: 'CAD Design & Simulation', status: 'Completed', link: 'https://github.com/design.pdf' },
        { num: 2, title: 'Working Prototype Bench Demo', status: 'Submitted_For_Review', link: 'https://youtube.com/demo' },
        { num: 3, title: 'Village Pilot Handover', status: 'Pending', link: '' }
      ]
    }
  ]);

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('univ_token') || 'demo_univ_jwt' : 'demo_univ_jwt';
      const payload = {
        problemId,
        proposalTitle,
        executiveSummary,
        proposedMethodology,
        estimatedBudgetINR: Number(estimatedBudgetINR),
        projectTimelineMonths: 6,
        ipOwnershipDeclaration: ipDeclaration,
        teamMembers: [
          { name: 'Amit Kumar', branch: 'Civil Engineering', year: 'Final Year', role: 'Student Lead' },
          { name: 'Pooja Verma', branch: 'Biotechnology', year: '3rd Year', role: 'Chemical Testing' }
        ],
        facultyMentor: {
          name: 'Dr. Ananya Sen',
          email: 'ananya.sen@bitmesra.ac.in',
          department: 'Civil & Environmental Engineering',
          mentorApprovalStatus: 'Approved'
        }
      };

      const res = await universityApi.submitProposal(payload, token);
      if (res && res.success) {
        alert('🎉 Solution Proposal submitted to Open CSR Pool! Industry partners can now pledge milestone funding.');
        setProposals([res.proposal, ...proposals]);
      } else {
        alert('Proposal submission failed: ' + (res?.message || res?.error || 'Please ensure the University backend service on port 5002 is running.'));
      }
    } catch (err: any) {
      alert('Error submitting proposal: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Solution Proposal & Milestone Tranche Builder
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Form multidisciplinary teams, define 3-stage milestone release schedules, and submit R&D proposals for CSR grant sponsorship.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Proposal Submission Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl w-fit">
            <Sparkles className="w-4 h-4" />
            <span>NEP 2020 Proposal Formulation</span>
          </div>

          <form onSubmit={handleSubmitProposal} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Proposal Title *</label>
              <input
                type="text"
                required
                value={proposalTitle}
                onChange={(e) => setProposalTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Executive Summary *</label>
              <textarea
                required
                rows={2}
                value={executiveSummary}
                onChange={(e) => setExecutiveSummary(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Proposed Methodology & R&D Plan *</label>
              <textarea
                required
                rows={3}
                value={proposedMethodology}
                onChange={(e) => setProposedMethodology(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Estimated Budget (INR ₹) *</label>
                <input
                  type="number"
                  required
                  value={estimatedBudgetINR}
                  onChange={(e) => setEstimatedBudgetINR(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">IP Ownership Declaration *</label>
                <select
                  value={ipDeclaration}
                  onChange={(e) => setIpDeclaration(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Open_Source_Social_Good">Open Source / Social Good (Public Domain)</option>
                  <option value="Joint_Student_Faculty_Patent">Joint Student-Faculty Patent</option>
                  <option value="University_Incubation_IP">University TBI Incubation IP</option>
                </select>
              </div>
            </div>

            {/* 3-Stage Milestone Schedule Preview */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>📋 3-Stage Milestone Tranche Schedule</span>
                <span className="text-emerald-700 font-extrabold">100% Release</span>
              </div>
              <div className="space-y-1.5 text-slate-600">
                <div className="flex justify-between bg-white p-2 rounded-lg border border-slate-100">
                  <span>Tranche 1: CAD & Lab Simulation</span>
                  <span className="font-bold text-slate-800">30% (₹{Math.round(estimatedBudgetINR * 0.3)})</span>
                </div>
                <div className="flex justify-between bg-white p-2 rounded-lg border border-slate-100">
                  <span>Tranche 2: Working Hardware / Bench Demo</span>
                  <span className="font-bold text-slate-800">40% (₹{Math.round(estimatedBudgetINR * 0.4)})</span>
                </div>
                <div className="flex justify-between bg-white p-2 rounded-lg border border-slate-100">
                  <span>Tranche 3: Field Deployment & Handover</span>
                  <span className="font-bold text-slate-800">30% (₹{Math.round(estimatedBudgetINR * 0.3)})</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl shadow-sm text-xs transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              {submitting ? 'Submitting...' : 'Submit Proposal to Open CSR Marketplace'}
            </button>
          </form>
        </div>

        {/* Active Proposals & Milestone Updates */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-lg">
              Active University Proposals
            </h3>

            <div className="space-y-4">
              {proposals.map((prop) => (
                <div
                  key={prop._id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md">
                      ₹{prop.estimatedBudgetINR} Grant
                    </span>
                    <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                      {prop.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">{prop.proposalTitle}</h4>

                  {prop.sponsorName && (
                    <p className="text-xs text-emerald-800 font-medium bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                      🏢 Sponsored by: <strong>{prop.sponsorName}</strong>
                    </p>
                  )}

                  {/* Milestones */}
                  <div className="space-y-1.5 text-xs">
                    <span className="font-semibold text-slate-500 uppercase text-[10px]">Milestones:</span>
                    {prop.milestones?.map((m: any) => (
                      <div
                        key={m.num}
                        className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200 text-xs"
                      >
                        <div className="flex items-center gap-1.5">
                          {m.status === 'Completed' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                          )}
                          <span className="truncate">{m.title}</span>
                        </div>
                        <span className="text-[11px] font-bold text-slate-700">{m.status}</span>
                      </div>
                    ))}
                  </div>

                  {/* Upload Deliverable Link & View Endorsement */}
                  <div className="pt-2 space-y-2">
                    <button
                      onClick={() =>
                        setSelectedLetter({
                          isOpen: true,
                          data: {
                            title: prop.proposalTitle,
                            universityName: 'BIT Mesra, Ranchi',
                            mentorName: 'Dr. Ananya Sen',
                            studentLead: 'Amit Kumar (Lead Student Innovator)',
                            refNo: `BIT/RND/NEP2020/${prop._id}`
                          }
                        })
                      }
                      className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-slate-800 bg-white border border-slate-300 hover:bg-indigo-50 hover:text-indigo-900 py-2 rounded-xl transition-colors shadow-2xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-indigo-600" />
                      <span>📄 View NEP 2020 Institutional Endorsement Letter</span>
                    </button>
                    <button
                      onClick={() => alert('Deliverable upload dialog opened. Link your research paper, CAD schema, or YouTube demo.')}
                      className="w-full flex items-center justify-center gap-1 text-xs font-bold text-indigo-700 bg-white border border-indigo-200 hover:bg-indigo-50 py-2 rounded-xl transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Milestone Deliverable Link / Demo</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Official University NEP 2020 Endorsement Letter Modal */}
      <OfficialLetterModal
        isOpen={!!selectedLetter?.isOpen}
        onClose={() => setSelectedLetter(null)}
        type="univ_endorsement"
        data={selectedLetter?.data}
      />
    </div>
  );
}

export default function UniversityProposalsPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs text-slate-500">Loading proposal builder...</div>}>
      <UniversityProposalsContent />
    </Suspense>
  );
}
