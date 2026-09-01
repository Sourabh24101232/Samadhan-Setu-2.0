'use client';

// ==========================================
// FRONTEND COMPONENT - GLOBAL NAVBAR
// File: Frontend/src/components/Navbar.tsx
// ==========================================

/*
  PURPOSE:
  - Header navigation bar with branding, portal switcher dropdown, active role indicator, and auth login/logout controls.

  ELEMENTS TO RENDER LATER:
  1. Branding: Logo + "Samadhan-Setu" (Gov of Jharkhand badge).
  2. Navigation Links: Home, Public Challenges, HEI Innovation Hub, Industry CSR Hub, State Analytics.
  3. Action Buttons: "Report a Problem" (-> /citizen/submit) & "Login / Register".
*/

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  ShieldCheck,
  Building2,
  GraduationCap,
  Landmark,
  PlusCircle,
  LogIn,
  Layers
} from 'lucide-react';

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/', icon: Layers },
    { name: 'Public Feed', href: '/citizen', icon: ShieldCheck },
    { name: 'University Hub', href: '/university', icon: GraduationCap },
    { name: 'Industry & CSR', href: '/industry', icon: Building2 },
    { name: 'State Analytics', href: '/gov', icon: Landmark }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Gov Badge */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
              🌉
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">
                  Samadhan-Setu
                </span>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                  Jharkhand
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                Dept of Higher & Technical Education
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/citizen/submit"
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-lg text-sm font-medium shadow-sm transition-all hover:shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              Report Problem
            </Link>
            <Link
              href="/auth/login"
              className="flex items-center gap-1.5 border border-slate-300 hover:border-slate-400 text-slate-700 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Login / Portal
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-medium ${
                  isActive ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.name}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/citizen/submit"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center justify-center gap-2 bg-emerald-600 text-white py-2.5 rounded-lg font-medium text-sm"
            >
              <PlusCircle className="w-4 h-4" />
              Report a Problem
            </Link>
            <Link
              href="/auth/login"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center justify-center gap-2 border border-slate-300 text-slate-700 py-2.5 rounded-lg font-medium text-sm"
            >
              <LogIn className="w-4 h-4" />
              Login / Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
