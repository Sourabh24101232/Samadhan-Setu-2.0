'use client';

// ==========================================
// CITIZEN MODULE - PUBLIC PROBLEM FEED & CROWDSOURCING PAGE
// File: Frontend/src/app/citizen/page.tsx
// ==========================================

/*
  PURPOSE:
  - Public problem feed allowing citizens, panchayat members, and students to browse, filter, search, and upvote grassroots challenges across Jharkhand.

  FEATURES TO IMPLEMENT:
  1. Header banner with "Report Challenge" and "Track Secret Passkey" buttons.
  2. Filter bar: Domain category pill selector, District dropdown, Severity filter, Search query.
  3. Responsive Grid of Problem Cards with live upvoting.
*/

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  PlusCircle,
  Key,
  Shield,
  MapPin,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import ProblemCard from '../../components/ProblemCard';
import { ProblemItem } from '../../lib/types';
import { JHARKHAND_DISTRICTS, THEMATIC_DOMAINS } from '../../lib/constants';
import { citizenApi } from '../../lib/api';

export default function CitizenPublicFeed() {
  const [problems, setProblems] = useState<ProblemItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');

  const fetchFeed = async () => {
    setLoading(true);
    try {
      let params = '?limit=30';
      if (selectedDomain !== 'All') params += `&domain=${encodeURIComponent(selectedDomain)}`;
      if (selectedDistrict !== 'All') params += `&district=${encodeURIComponent(selectedDistrict)}`;
      if (search.trim()) params += `&search=${encodeURIComponent(search.trim())}`;

      const res = await citizenApi.getPublicFeed(params);
      if (res && res.success && res.problems) {
        setProblems(res.problems);
      } else {
        // Fallback sample data for demo if backend is offline
        setProblems([
          {
            _id: 'sample-1',
            title: 'Severe Fluoride & Arsenic Contamination in Rural Community Wells',
            description: 'Over 8 villages in Kanke block reporting dental and skeletal fluorosis among school children due to high fluoride in deep borewells.',
            isAnonymous: true,
            isDisasterEmergency: false,
            isActionableRnD: true,
            domainCategory: 'Water Resources',
            location: { district: 'Ranchi', block: 'Kanke', villageOrPanchayat: 'Sukhurhutu' },
            mediaAttachments: [],
            status: 'Assigned to University',
            assignedUniversityId: { _id: 'u1', universityName: 'BIT Mesra, Ranchi', department: 'Civil & Environmental' },
            upvotes: ['v1', 'v2', 'v3', 'v4', 'v5', 'v6'],
            severityLevel: 'High',
            aiTags: ['water-filtration', 'fluoride', 'ranchi'],
            createdAt: new Date().toISOString()
          },
          {
            _id: 'sample-2',
            title: 'Toxic Coal Dust Inhalation & Subterranean Mine Fire Smoke',
            description: 'Underground coal fire emitting carbon monoxide and particulate smoke across Jharia settlement causing acute respiratory illness.',
            isAnonymous: false,
            isDisasterEmergency: true,
            isActionableRnD: true,
            domainCategory: 'Disaster Management',
            location: { district: 'Dhanbad', block: 'Jharia' },
            mediaAttachments: [],
            status: 'Emergency_Escalated',
            upvotes: ['v1', 'v2', 'v3'],
            severityLevel: 'Critical',
            aiTags: ['mine-fire', 'toxic-gas', 'dhanbad'],
            createdAt: new Date().toISOString()
          },
          {
            _id: 'sample-3',
            title: 'Solar Powered Grain De-husker for Tribal Women SHGs',
            description: 'Manual paddy processing is physically exhausting; requesting a compact solar-operated micro-milling machine for local Mahila Samitis.',
            isAnonymous: false,
            isDisasterEmergency: false,
            isActionableRnD: true,
            domainCategory: 'Agriculture',
            location: { district: 'Khunti', block: 'Murhu' },
            mediaAttachments: [],
            status: 'Proposal Submitted',
            assignedUniversityId: { _id: 'u2', universityName: 'Birsa Agricultural University', department: 'Agri Engineering' },
            upvotes: ['v1', 'v2'],
            severityLevel: 'Medium',
            aiTags: ['agriculture', 'solar-mill', 'khunti'],
            createdAt: new Date().toISOString()
          }
        ]);
      }
    } catch (err) {
      console.error('Error fetching public feed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, [selectedDomain, selectedDistrict]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 rounded-3xl p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs px-3 py-1 rounded-full font-semibold">
            <span>🛡️ Community Crowdsourcing & Whistleblower Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Grassroots Societal Challenges of Jharkhand
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            Report issues in your village or ward, upvote high-priority community needs, and track university R&D solutions from lab to field deployment.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
          <Link
            href="/citizen/submit"
            className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-5 py-3 rounded-xl shadow-md transition-all text-xs sm:text-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Report Problem
          </Link>
          <Link
            href="/citizen/my-problems"
            className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 font-semibold px-5 py-3 rounded-xl backdrop-blur-sm transition-all text-xs sm:text-sm"
          >
            <Key className="w-4 h-4 text-amber-300" />
            Track Secret Passkey
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-grow w-full">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search challenges by keyword (e.g. fluoride, arsenic, solar pump, bridge)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchFeed()}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* District Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <MapPin className="w-4 h-4 text-slate-500 shrink-0 hidden sm:block" />
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full md:w-48 py-2.5 px-3 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All 24 Districts</option>
              {JHARKHAND_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <button
              onClick={fetchFeed}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
              title="Refresh feed"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Domain Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2 border-t border-slate-100">
          <button
            onClick={() => setSelectedDomain('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
              selectedDomain === 'All'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🌟 All Categories
          </button>
          {THEMATIC_DOMAINS.map((domain) => (
            <button
              key={domain}
              onClick={() => setSelectedDomain(domain)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                selectedDomain === domain
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {domain}
            </button>
          ))}
        </div>
      </div>

      {/* Problem Grid */}
      {loading ? (
        <div className="text-center py-16 space-y-3">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Loading community challenges...</p>
        </div>
      ) : problems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-2xl mx-auto">
            🔍
          </div>
          <h3 className="font-bold text-slate-800 text-lg">No challenges found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No societal challenges match your selected filters. Be the first to report an issue from your village or ward!
          </p>
          <Link
            href="/citizen/submit"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm hover:bg-emerald-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Report First Challenge
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((problem) => (
            <ProblemCard key={problem._id} problem={problem} />
          ))}
        </div>
      )}
    </div>
  );
}
