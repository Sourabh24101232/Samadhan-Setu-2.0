'use client';

// ==========================================
// INDUSTRY MODULE - SPONSORED COLLABORATIONS & MENTORSHIP
// File: Frontend/src/app/industry/collaborations/page.tsx
// ==========================================

import React, { useState, useEffect } from 'react';
import {
  Building2,
  Coins,
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  GraduationCap,
  Award,
  FileCheck,
  RefreshCw
} from 'lucide-react';
import { industryApi } from '../../../lib/api';

export default function IndustryCollaborationsPage() {
  const [collaborations, setCollaborations] = useState<any[]>([]);
  const [selectedCollabIndex, setSelectedCollabIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [newMsg, setNewMsg] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  // Fallback initial messages if empty
  const defaultMessages = [
    {
      mentorName: 'Sanjay Srivastava (Tata Steel CSR)',
      message: 'Tata Steel CSR Foundation has sanctioned the grant. Milestone tranche schedule locked with university R&D cell.',
      timestamp: new Date().toISOString()
    },
    {
      mentorName: 'Dr. Vivek Sharma (Tata Steel R&D Lead)',
      message: 'For the pilot deployment in target district, please verify sensor calibration and ground telemetry before field trial.',
      timestamp: new Date().toISOString()
    }
  ];

  const fetchCollaborations = async () => {
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('industry_token') || 'demo_industry_jwt' : 'demo_industry_jwt';
      const res = await industryApi.getMyCollaborations(token);
      if (res && res.success && res.partnerships && res.partnerships.length > 0) {
        setCollaborations(res.partnerships);
      } else {
        // Fallback default demo partnership if none created yet
        setCollaborations([
          {
            _id: 'collab-demo-01',
            mouStatus: 'Active',
            totalPledgedFundingINR: 150000,
            proposalId: {
              proposalTitle: 'Low-Cost Solar Electro-Coagulation Fluoride Filter',
              domainCategory: 'Water Resources'
            },
            universityId: {
              universityName: 'BIT Mesra, Ranchi',
              department: 'Civil & Environmental Engineering'
            },
            fundingDisbursements: [
              {
                trancheNumber: 1,
                percentage: 30,
                amount: 45000,
                status: 'Released',
                transactionReferenceOrUTR: 'UTR-TATA-2026-001',
                title: 'CAD & Lab Simulation (30%)'
              },
              {
                trancheNumber: 2,
                percentage: 40,
                amount: 60000,
                status: 'Pending',
                title: 'Working Hardware Demo (40%)'
              },
              {
                trancheNumber: 3,
                percentage: 30,
                amount: 45000,
                status: 'Pending',
                title: 'Field Pilot & Citizen Handover (30%)'
              }
            ],
            mentorshipFeedbackThread: defaultMessages
          }
        ]);
      }
    } catch (err) {
      console.error('Error fetching collaborations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollaborations();
  }, []);

  const activeCollab = collaborations[selectedCollabIndex] || collaborations[0];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim() || !activeCollab) return;
    setSendingMsg(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('industry_token') || 'demo_industry_jwt' : 'demo_industry_jwt';
      const msgObj = {
        mentorName: 'Tata Steel CSR Engineer',
        message: newMsg.trim(),
        timestamp: new Date().toISOString()
      };

      if (activeCollab._id && !activeCollab._id.startsWith('collab-demo')) {
        await industryApi.postFeedback(activeCollab._id, { message: newMsg.trim(), mentorName: 'Tata Steel CSR Lead' }, token);
      }

      const updatedThread = [...(activeCollab.mentorshipFeedbackThread || []), msgObj];
      setCollaborations((prev) =>
        prev.map((c, i) => (i === selectedCollabIndex ? { ...c, mentorshipFeedbackThread: updatedThread } : c))
      );
      setNewMsg('');
    } catch (err: any) {
      console.error('Error posting message:', err);
    } finally {
      setSendingMsg(false);
    }
  };

  const handleReleaseTranche = async (trancheNum: number, amount: number) => {
    const utr = `UTR-JH-${Math.floor(100000 + Math.random() * 900000)}`;
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('industry_token') || 'demo_industry_jwt' : 'demo_industry_jwt';
      if (activeCollab._id && !activeCollab._id.startsWith('collab-demo')) {
        await industryApi.disburseTranche(activeCollab._id, { trancheNumber: trancheNum, transactionReferenceOrUTR: utr }, token);
      }

      alert(`🎉 Tranche #${trancheNum} (₹${amount.toLocaleString()}) marked as Released!\nGenerated UTR: ${utr}`);

      // Update local state
      setCollaborations((prev) =>
        prev.map((c, i) => {
          if (i !== selectedCollabIndex) return c;
          const updatedDisb = (c.fundingDisbursements || []).map((t: any) =>
            t.trancheNumber === trancheNum ? { ...t, status: 'Released', transactionReferenceOrUTR: utr } : t
          );
          return { ...c, fundingDisbursements: updatedDisb };
        })
      );
    } catch (err: any) {
      alert('Error releasing tranche: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin text-amber-600 mx-auto" />
        <p className="text-sm font-semibold text-slate-600">Loading sponsored innovation portfolio...</p>
      </div>
    );
  }

  const proposalTitle = activeCollab?.proposalId?.proposalTitle || 'Sponsored Academic R&D Solution';
  const universityName = activeCollab?.universityId?.universityName || activeCollab?.universityId?.fullName || 'BIT Mesra, Ranchi';
  const department = activeCollab?.universityId?.department || 'R&D Cell';
  const pledgedFunding = activeCollab?.totalPledgedFundingINR || 150000;
  const disbursements = activeCollab?.fundingDisbursements && activeCollab.fundingDisbursements.length > 0
    ? activeCollab.fundingDisbursements
    : [
        { trancheNumber: 1, percentage: 30, amount: Math.round(pledgedFunding * 0.3), status: 'Released', transactionReferenceOrUTR: 'UTR-TATA-2026-001', title: 'CAD & Lab Simulation (30%)' },
        { trancheNumber: 2, percentage: 40, amount: Math.round(pledgedFunding * 0.4), status: 'Pending', title: 'Working Hardware Demo (40%)' },
        { trancheNumber: 3, percentage: 30, amount: Math.round(pledgedFunding * 0.3), status: 'Pending', title: 'Field Pilot & Citizen Handover (30%)' }
      ];
  const messages = activeCollab?.mentorshipFeedbackThread && activeCollab.mentorshipFeedbackThread.length > 0
    ? activeCollab.mentorshipFeedbackThread
    : defaultMessages;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Active CSR Sponsored Innovation Portfolio
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Monitor prototype milestone deliverables, verify UTR tranche disbursements, and provide technical guidance directly to student innovators.
          </p>
        </div>

        <button
          onClick={fetchCollaborations}
          className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2.5 rounded-xl shadow-sm self-start"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Portfolio</span>
        </button>
      </div>

      {/* Multiple Sponsored Projects Tabs (if more than 1) */}
      {collaborations.length > 1 && (
        <div className="flex overflow-x-auto gap-3 pb-2">
          {collaborations.map((c, idx) => (
            <button
              key={c._id || idx}
              onClick={() => setSelectedCollabIndex(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                selectedCollabIndex === idx
                  ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {c.proposalId?.proposalTitle || `Sponsored Project #${idx + 1}`}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Sponsored Project & Tranches */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                Active Grant: ₹{pledgedFunding.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                MOU Status: <strong className="text-emerald-700">MOU Signed & Active</strong>
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {proposalTitle}
              </h2>
              <p className="text-xs text-indigo-700 font-semibold mt-1 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" />
                <span>{universityName} • {department}</span>
              </p>
            </div>

            {/* Tranche Disbursement Roadmap */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Milestone Tranche Disbursement Status
              </h4>

              {disbursements.map((tranche: any, idx: number) => {
                const isReleased = tranche.status === 'Released';
                const trancheTitle = tranche.title || `Tranche ${tranche.trancheNumber || idx + 1}: Milestone Deliverable`;
                const amount = tranche.amount || Math.round(pledgedFunding * ((tranche.percentage || 30) / 100));

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border flex items-center justify-between text-xs transition-all ${
                      isReleased
                        ? 'bg-emerald-50/70 border-emerald-200'
                        : idx === 1 || !isReleased
                        ? 'bg-amber-50/70 border-amber-200'
                        : 'bg-slate-50 border-slate-200 opacity-75'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        {isReleased ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                        )}
                        <span>{trancheTitle}</span>
                      </div>
                      <p className={`text-[11px] mt-0.5 ${isReleased ? 'text-emerald-700' : 'text-slate-600'}`}>
                        {isReleased ? (
                          <>UTR: <code>{tranche.transactionReferenceOrUTR || `UTR-JH-${Math.floor(100000 + Math.random() * 900000)}`}</code> • Disbursed: ₹{amount.toLocaleString()}</>
                        ) : (
                          <>Milestone Funding Allocation: ₹{amount.toLocaleString()}</>
                        )}
                      </p>
                    </div>

                    {isReleased ? (
                      <span className="font-extrabold text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 text-[11px]">
                        Released ✓
                      </span>
                    ) : (
                      <button
                        onClick={() => handleReleaseTranche(tranche.trancheNumber || idx + 1, amount)}
                        className="font-bold text-white bg-amber-600 hover:bg-amber-700 px-3 py-1.5 rounded-xl shadow-sm text-xs transition-colors shrink-0"
                      >
                        Release Tranche
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* CSR Social Impact Certificate */}
            <div className="bg-slate-900 text-white rounded-2xl p-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <strong>CSR Social Impact Compliance Certificate</strong>
                  <p className="text-[11px] text-slate-400">Audited under Section 135 Companies Act 2013</p>
                </div>
              </div>
              <button
                onClick={() => alert(`Official Jharkhand CSR Social Impact Certificate\n\nProject: ${proposalTitle}\nSanctioned Grant: ₹${pledgedFunding.toLocaleString()}\nPartner: ${universityName}\nStatus: Audited & Approved under Section 135 Companies Act 2013`)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-[11px] transition-colors"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Direct Technical Mentorship Thread */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between h-[560px]">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl w-fit mb-4">
              <MessageSquare className="w-4 h-4 text-amber-600" />
              <span>Direct R&D Mentorship Channel</span>
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Industry R&D & Faculty Discussion
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Collaborative engineering guidance for student teams.
            </p>

            {/* Messages Scroll Area */}
            <div className="space-y-3 overflow-y-auto max-h-[300px] pr-1">
              {messages.map((m: any, idx: number) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1 text-xs">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-slate-800">{m.mentorName || m.mentor || 'Mentor'}</span>
                    <span className="text-slate-400">{m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{m.message || m.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendMessage} className="pt-4 border-t border-slate-100 flex gap-2">
            <input
              type="text"
              placeholder="Post technical guidance or review..."
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              className="flex-grow px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={sendingMsg || !newMsg.trim()}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
