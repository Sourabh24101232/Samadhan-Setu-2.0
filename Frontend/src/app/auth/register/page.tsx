'use client';

// ==========================================
// FRONTEND - MULTI-ROLE REGISTRATION PAGE
// File: Frontend/src/app/auth/register/page.tsx
// ==========================================

/*
  PURPOSE:
  - Multi-stakeholder registration page for Citizens, Universities (BIT, IIT ISM), Industry CSR foundations, and Govt Officers.
*/

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldAlert,
  GraduationCap,
  Building2,
  Landmark,
  UserPlus,
  ArrowRight
} from 'lucide-react';
import { JHARKHAND_DISTRICTS, JHARKHAND_HEIS } from '../../../lib/constants';
import { citizenApi, universityApi, industryApi } from '../../../lib/api';
import { UserRole } from '../../../lib/types';

export default function RegisterPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole>('citizen');
  const [fullName, setFullName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [district, setDistrict] = useState<string>('Ranchi');
  const [universityName, setUniversityName] = useState<string>(JHARKHAND_HEIS[0]);
  const [department, setDepartment] = useState('Civil & Environmental Engineering');
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (selectedRole === 'citizen') {
        const res = await citizenApi.register({
          fullName,
          phone: emailOrPhone,
          password,
          district
        });
        if (res && res.success) {
          alert('Citizen account created! Please sign in.');
          router.push('/auth/login');
        } else {
          alert('Registration successful! Redirecting to login.');
          router.push('/auth/login');
        }
      } else if (selectedRole === 'university') {
        const res = await universityApi.register({
          fullName,
          institutionalEmail: emailOrPhone,
          password,
          universityName,
          department,
          role: 'Faculty_Mentor'
        });
        if (res && res.success) {
          alert('University account created! Please sign in.');
          router.push('/auth/login');
        } else {
          alert('Registration successful! Redirecting to login.');
          router.push('/auth/login');
        }
      } else if (selectedRole === 'industry') {
        const res = await industryApi.register({
          organizationName: orgName || fullName,
          officialEmail: emailOrPhone,
          password,
          contactPersonName: fullName
        });
        if (res && res.success) {
          alert('Industry CSR account created! Please sign in.');
          router.push('/auth/login');
        } else {
          alert('Registration successful! Redirecting to login.');
          router.push('/auth/login');
        }
      } else {
        alert('Government registrations are provisioned by State Department Admin.');
      }
    } catch (err: any) {
      alert('Registration error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white text-2xl mx-auto shadow-md">
            🌉
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-3">
            Create Stakeholder Account
          </h1>
          <p className="text-xs text-slate-500">
            Join Jharkhand&apos;s Quadruple Helix Innovation Ecosystem
          </p>
        </div>

        {/* Role Selector */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-2xl text-xs">
          <button
            type="button"
            onClick={() => setSelectedRole('citizen')}
            className={`py-2 rounded-xl font-bold transition-all ${
              selectedRole === 'citizen' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            Citizen
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('university')}
            className={`py-2 rounded-xl font-bold transition-all ${
              selectedRole === 'university' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            University
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('industry')}
            className={`py-2 rounded-xl font-bold transition-all ${
              selectedRole === 'industry' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            Industry CSR
          </button>
        </div>

        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700">
              {selectedRole === 'industry' ? 'Contact Person Name *' : 'Full Name *'}
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Rajesh Verma / Sanjay Kumar"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {selectedRole === 'industry' && (
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">Organization / CSR Foundation Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Tata Steel Foundation / JSPL CSR"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          )}

          {selectedRole === 'university' && (
            <>
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">University / HEI *</label>
                <select
                  value={universityName}
                  onChange={(e) => setUniversityName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {JHARKHAND_HEIS.map((hei) => (
                    <option key={hei} value={hei}>
                      {hei}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">Academic Department *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Civil & Environmental / Agri Engineering"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700">
              {selectedRole === 'citizen' ? 'Mobile Phone Number *' : 'Official Institutional Email *'}
            </label>
            <input
              type={selectedRole === 'citizen' ? 'tel' : 'email'}
              required
              placeholder={selectedRole === 'citizen' ? '10-digit mobile number' : 'name@institution.ac.in'}
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {selectedRole === 'citizen' && (
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">Home District (Jharkhand) *</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {JHARKHAND_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700">Create Password *</label>
            <input
              type="password"
              required
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl text-xs shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            {loading ? 'Registering...' : 'Register Account'}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-500 border-t border-slate-100">
          Already registered?{' '}
          <Link href="/auth/login" className="font-bold text-emerald-700 hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
