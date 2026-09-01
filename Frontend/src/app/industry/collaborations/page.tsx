'use client';

// ==========================================
// INDUSTRY MODULE - SPONSORED COLLABORATIONS & MENTORSHIP
// File: Frontend/src/app/industry/collaborations/page.tsx
// ==========================================

/*
  PURPOSE:
  - Tracks sponsored university R&D projects, milestone deliverable reviews, tranche payment UTRs, and direct technical mentorship chat threads.

  FEATURES TO IMPLEMENT:
  1. Active CSR sponsored projects list with tranche status.
  2. Direct Technical Mentorship Chat Thread.
  3. Tranche Release Action Button with UTR Reference Logging.
*/

import React, { useState } from 'react';
import {
  Building2,
  Coins,
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  GraduationCap,
  Award,
  FileCheck
} from 'lucide-react';
import { industryApi } from '../../../lib/api';

export default function IndustryCollaborationsPage() {
  const [messages, setMessages] = useState<any[]>([
    {
      mentor: 'Sanjay Srivastava (Tata Steel CSR)',
      text: 'Tata Steel CSR Foundation has sanctioned ₹1.5 Lakh grant. Tranche 1 (₹45,000) released under UTR-TATA-2026-001.',
      time: '2 days ago'
    },
    {
      mentor: 'Dr. Vivek Sharma (Tata Steel R&D Lead)',
      text: 'For the high-fluoride groundwater in Kanke, we recommend 316L stainless steel electrodes to resist pitting corrosion.',
      time: 'Yesterday'
    }
  ]);
  const [newMsg, setNewMsg] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    setSendingMsg(true);
    try {
      const msgObj = {
        mentor: 'Tata Steel CSR Engineer',
        text: newMsg.trim(),
        time: 'Just now'
      };
      setMessages([...messages, msgObj]);
      setNewMsg('');
    } finally {
      setSendingMsg(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Active CSR Sponsored Innovation Portfolio
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Monitor prototype milestone deliverables, verify UTR tranche disbursements, and provide technical guidance directly to student innovators.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Sponsored Project & Tranches */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                Active Grant: ₹1,50,000
              </span>
              <span className="text-xs font-semibold text-slate-500">
                MOU Status: <strong>MOU Signed & Active</strong>
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Low-Cost Solar Electro-Coagulation Fluoride Filter
              </h2>
              <p className="text-xs text-indigo-700 font-semibold mt-1 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" />
                <span>BIT Mesra, Ranchi • Civil & Environmental Engineering</span>
              </p>
            </div>

            {/* Tranche Disbursement Roadmap */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Milestone Tranche Disbursement Status
              </h4>

              {/* Tranche 1 */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2 font-bold text-emerald-950">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Tranche 1: CAD & Lab Simulation (30%)</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    UTR: <code>UTR-TATA-2026-001</code> • Disbursed: ₹45,000
                  </p>
                </div>
                <span className="font-extrabold text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 text-[11px]">
                  Released ✓
                </span>
              </div>

              {/* Tranche 2 */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2 font-bold text-amber-950">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Tranche 2: Working Hardware Demo (40%)</span>
                  </div>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    Pending Student Lab Video Verification • ₹60,000
                  </p>
                </div>
                <button
                  onClick={() => alert('Tranche #2 (₹60,000) marked as Released! UTR reference logged.')}
                  className="font-bold text-white bg-amber-600 hover:bg-amber-700 px-3 py-1.5 rounded-xl shadow-sm text-xs transition-colors"
                >
                  Release Tranche
                </button>
              </div>

              {/* Tranche 3 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs opacity-75">
                <div>
                  <div className="flex items-center gap-2 font-bold text-slate-700">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>Tranche 3: Field Pilot & Citizen Handover (30%)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Scheduled on Ground Testing • ₹45,000
                  </p>
                </div>
                <span className="text-[11px] font-bold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                  Scheduled
                </span>
              </div>
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
                onClick={() => alert('Downloading official Jharkhand CSR Social Impact Certificate PDF...')}
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
              {messages.map((m, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1 text-xs">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-slate-800">{m.mentor}</span>
                    <span className="text-slate-400">{m.time}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{m.text}</p>
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
