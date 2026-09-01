// ==========================================
// FRONTEND COMPONENT - FOOTER
// File: Frontend/src/components/Footer.tsx
// ==========================================

/*
  PURPOSE:
  - Official-looking footer with Jharkhand Government citations, NEP 2020 experiential learning disclaimers, Smart India Hackathon 2026 tags, and portal links.

  SECTIONS TO RENDER LATER:
  1. Jharkhand Dept of Higher & Technical Education attribution.
  2. Quick links for Citizens, HEIs, and Industry CSR wings.
  3. SIH 2026 Problem Statement ID: SIH26043 notice.
*/

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Initiative */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                🌉
              </div>
              <span className="font-bold text-lg text-white">Samadhan-Setu</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bridging grassroots societal challenges in Jharkhand with academic R&D institutions and industry CSR funding under NEP 2020 experiential learning.
            </p>
            <div className="text-[11px] text-emerald-400 font-medium">
              SIH 2026 Problem Statement: SIH26043
            </div>
          </div>

          {/* Citizen Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Citizens & Panchayats</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/citizen" className="hover:text-emerald-400 transition-colors">Public Problem Feed</Link></li>
              <li><Link href="/citizen/submit" className="hover:text-emerald-400 transition-colors">Report Challenge (Auth / Anon)</Link></li>
              <li><Link href="/citizen/my-problems" className="hover:text-emerald-400 transition-colors">Track Secret Passkey (Whistleblower)</Link></li>
              <li><Link href="/citizen" className="hover:text-emerald-400 transition-colors">Community Upvoting</Link></li>
            </ul>
          </div>

          {/* University Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Universities & HEIs</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/university" className="hover:text-emerald-400 transition-colors">Routed Challenge Explorer</Link></li>
              <li><Link href="/university" className="hover:text-emerald-400 transition-colors">14-Day Claim Lock System</Link></li>
              <li><Link href="/university/proposals" className="hover:text-emerald-400 transition-colors">Proposal & Milestone Builder</Link></li>
              <li><Link href="/university/proposals" className="hover:text-emerald-400 transition-colors">Prototype Evidence Uploader</Link></li>
            </ul>
          </div>

          {/* Industry & Gov Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Industry CSR & Government</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/industry" className="hover:text-emerald-400 transition-colors">CSR Innovation Marketplace</Link></li>
              <li><Link href="/industry/collaborations" className="hover:text-emerald-400 transition-colors">Milestone Tranche Grants</Link></li>
              <li><Link href="/gov" className="hover:text-emerald-400 transition-colors">24-District Heatmap Analytics</Link></li>
              <li><Link href="/gov/verify" className="hover:text-emerald-400 transition-colors">Disaster Emergency SOS Queue</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Government of Jharkhand • Department of Higher & Technical Education</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Smart India Hackathon 2026 Prototype</span>
            <span>•</span>
            <span>NEP 2020 Experiential Learning</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
