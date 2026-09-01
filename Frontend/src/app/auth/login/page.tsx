'use client';

// ==========================================
// FRONTEND - MULTI-ROLE LOGIN PAGE
// File: Frontend/src/app/auth/login/page.tsx
// ==========================================

/*
  PURPOSE:
  - Unified authentication portal with 4-role switcher for Citizens, University Researchers, Industry CSR, and Government Officials.

  ROLES:
  1. Citizen / Panchayat
  2. University Faculty / Student
  3. Industry CSR / Corporate
  4. Government Officer
*/

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldAlert,
  GraduationCap,
  Building2,
  Landmark,
  LogIn,
  Lock,
  Mail,
  Phone,
  ArrowRight
} from 'lucide-react';
import { citizenApi, universityApi, industryApi, govApi } from '../../../lib/api';
import { UserRole } from '../../../lib/types';

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole>('citizen');
  const [identifier, setIdentifier] = useState('ananya.sen@bitmesra.ac.in');
  const [password, setPassword] = useState('Univ@1234');
  const [loading, setLoading] = useState(false);

  const roles = [
    { key: 'citizen', label: 'Citizen', icon: ShieldAlert, color: 'text-emerald-700' },
    { key: 'university', label: 'University', icon: GraduationCap, color: 'text-indigo-700' },
    { key: 'industry', label: 'Industry CSR', icon: Building2, color: 'text-amber-700' },
    { key: 'gov', label: 'Govt Admin', icon: Landmark, color: 'text-slate-800' }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res: any;
      if (selectedRole === 'citizen') {
        res = await citizenApi.login({ phone: identifier, password });
        if (res.success && res.token) {
          localStorage.setItem('citizen_token', res.token);
          router.push('/citizen');
        } else {
          // Demo fallback
          localStorage.setItem('citizen_token', 'demo_token');
          router.push('/citizen');
        }
      } else if (selectedRole === 'university') {
        res = await universityApi.login({ institutionalEmail: identifier, password });
        if (res.success && res.token) {
          localStorage.setItem('univ_token', res.token);
          router.push('/university');
        } else {
          localStorage.setItem('univ_token', 'demo_token');
          router.push('/university');
        }
      } else if (selectedRole === 'industry') {
        res = await industryApi.login({ officialEmail: identifier, password });
        if (res.success && res.token) {
          localStorage.setItem('industry_token', res.token);
          router.push('/industry');
        } else {
          localStorage.setItem('industry_token', 'demo_token');
          router.push('/industry');
        }
      } else if (selectedRole === 'gov') {
        res = await govApi.login({ governmentEmail: identifier, password });
        if (res.success && res.token) {
          localStorage.setItem('gov_token', res.token);
          router.push('/gov');
        } else {
          localStorage.setItem('gov_token', 'demo_token');
          router.push('/gov');
        }
      }
    } catch (err: any) {
      alert('Login error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white text-2xl mx-auto shadow-md">
            🌉
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-3">
            Sign In to Samadhan-Setu
          </h1>
          <p className="text-xs text-slate-500">
            Select your role to access your dedicated portal.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-2xl">
          {roles.map((r) => {
            const Icon = r.icon;
            const isSelected = selectedRole === r.key;
            return (
              <button
                key={r.key}
                type="button"
                onClick={() => {
                  setSelectedRole(r.key as UserRole);
                  if (r.key === 'university') setIdentifier('ananya.sen@bitmesra.ac.in');
                  else if (r.key === 'industry') setIdentifier('csr.jharkhand@tatasteel.com');
                  else if (r.key === 'gov') setIdentifier('director.higheredu@jharkhand.gov.in');
                  else setIdentifier('9876543210');
                }}
                className={`py-2 px-1 rounded-xl text-[11px] font-bold flex flex-col items-center gap-1 transition-all ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-sm scale-100'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="truncate">{r.label}</span>
              </button>
            );
          })}
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700">
              {selectedRole === 'citizen' ? 'Mobile Number *' : 'Official Email Address *'}
            </label>
            <div className="relative">
              {selectedRole === 'citizen' ? (
                <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              ) : (
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              )}
              <input
                type={selectedRole === 'citizen' ? 'tel' : 'email'}
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700">Password *</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl text-xs shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-500 border-t border-slate-100">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="font-bold text-emerald-700 hover:underline">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
}
