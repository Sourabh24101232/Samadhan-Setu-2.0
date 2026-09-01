'use client';

// ==========================================
// FRONTEND COMPONENT - 24 DISTRICT HEATMAP
// File: Frontend/src/components/DistrictHeatmap.tsx
// ==========================================

/*
  PURPOSE:
  - Interactive map & grid of Jharkhand's 24 districts displaying crowdsourced problem density, resolution rates, and SOS emergency alerts.

  PROPS TO DEFINE LATER:
  - districtStats: DistrictStat[]
  - onSelectDistrict?: (districtName: string) => void
*/

import React, { useState } from 'react';
import { MapPin, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { DistrictStat } from '../lib/types';
import { JHARKHAND_DISTRICTS } from '../lib/constants';

interface DistrictHeatmapProps {
  districtStats?: DistrictStat[];
  selectedDistrict?: string | null;
  onSelectDistrict?: (district: string | null) => void;
}

export default function DistrictHeatmap({
  districtStats = [],
  selectedDistrict = null,
  onSelectDistrict
}: DistrictHeatmapProps) {
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictStat | null>(null);

  // Map stats dictionary for quick lookup
  const statsMap = new Map<string, DistrictStat>();
  districtStats.forEach((s) => statsMap.set(s.district.toLowerCase(), s));

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <span>🗺️</span>
            <span>Jharkhand Statewide 24-District Problem Map</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Click any district to inspect crowdsourced problem density and academic R&D deployment.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-slate-600">High Intensity</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="text-slate-600">Moderate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-400" />
            <span className="text-slate-600">Low / Resolved</span>
          </div>
        </div>
      </div>

      {/* 24-District Interactive Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
        {JHARKHAND_DISTRICTS.map((districtName) => {
          const stat = statsMap.get(districtName.toLowerCase()) || {
            district: districtName,
            totalReported: 0,
            inProgressCount: 0,
            resolvedCount: 0,
            emergencyCount: 0,
            intensityLevel: 'Low' as const
          };

          const isSelected = selectedDistrict?.toLowerCase() === districtName.toLowerCase();

          // Calculate color based on reported / emergency counts
          let badgeColor = 'bg-slate-50 border-slate-200 text-slate-700 hover:border-emerald-400';
          if (stat.emergencyCount > 0) {
            badgeColor = 'bg-red-50 border-red-300 text-red-900 hover:bg-red-100';
          } else if (stat.totalReported > 10) {
            badgeColor = 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100';
          } else if (stat.totalReported > 0) {
            badgeColor = 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100';
          }

          if (isSelected) {
            badgeColor = 'bg-emerald-600 border-emerald-700 text-white shadow-md scale-105';
          }

          return (
            <button
              key={districtName}
              onClick={() => onSelectDistrict?.(isSelected ? null : districtName)}
              onMouseEnter={() => setHoveredDistrict(stat)}
              onMouseLeave={() => setHoveredDistrict(null)}
              className={`p-3 rounded-xl border text-left transition-all duration-150 relative group ${badgeColor}`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className={`font-bold text-xs truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                  {districtName}
                </span>
                {stat.emergencyCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping shrink-0" />
                )}
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className={isSelected ? 'text-emerald-100' : 'text-slate-500'}>Challenges</span>
                <span className={`font-extrabold ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                  {stat.totalReported}
                </span>
              </div>

              {stat.resolvedCount > 0 && (
                <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-medium mt-1">
                  <CheckCircle className="w-2.5 h-2.5" />
                  <span>{stat.resolvedCount} Resolved</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected District Info Bar */}
      {selectedDistrict && (
        <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between flex-wrap gap-2 text-xs text-emerald-900">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-700" />
            <span>
              Filtering feed by <strong>{selectedDistrict} District</strong>
            </span>
          </div>
          <button
            onClick={() => onSelectDistrict?.(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold underline text-[11px]"
          >
            Clear Filter
          </button>
        </div>
      )}
    </div>
  );
}
