'use client';

// ==========================================
// FRONTEND COMPONENT - OFFICIAL DISPATCH LETTER MODAL
// File: Frontend/src/components/OfficialLetterModal.tsx
// ==========================================

/*
  PURPOSE:
  - Generates authentic, downloadable official letters, Government Orders (G.O.), University Institutional Endorsement letters, CSR Grant Awards, and Panchayat Completion Certificates.
*/

import React from 'react';
import { X, Printer, ShieldCheck, Award, FileText, CheckCircle2 } from 'lucide-react';

export type LetterType = 'gov_sanction' | 'univ_endorsement' | 'csr_award' | 'panchayat_completion';

export interface LetterData {
  title?: string;
  refNo?: string;
  district?: string;
  block?: string;
  village?: string;
  universityName?: string;
  mentorName?: string;
  studentLead?: string;
  industryName?: string;
  grantAmount?: number;
  sanctionDate?: string;
  utrNo?: string;
}

interface OfficialLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: LetterType;
  data?: LetterData;
}

export default function OfficialLetterModal({
  isOpen,
  onClose,
  type,
  data = {}
}: OfficialLetterModalProps) {
  if (!isOpen) return null;

  const today = data.sanctionDate || new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-300 my-8 overflow-hidden animate-in zoom-in-95 print:shadow-none print:border-none print:my-0">
        {/* Modal Top Control Bar (Hidden during print) */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-xs font-bold">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Official E-Governance Document Dispatch System</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* DOCUMENT CANVAS / LETTERHEAD                              */}
        {/* ========================================================= */}
        <div className="p-8 sm:p-12 space-y-6 text-slate-900 font-serif leading-relaxed bg-white">
          
          {/* 1. GOVERNMENT PILOT SANCTION ORDER (G.O.) */}
          {type === 'gov_sanction' && (
            <div className="space-y-6">
              {/* Official Header */}
              <div className="text-center border-b-2 border-slate-900 pb-5 space-y-1">
                <div className="w-12 h-12 rounded-full bg-emerald-800 text-white flex items-center justify-center text-2xl mx-auto shadow-sm">
                  🏛️
                </div>
                <h2 className="text-lg font-bold uppercase tracking-wide font-sans text-slate-900">
                  Government of Jharkhand • झारखंड सरकार
                </h2>
                <h3 className="text-sm font-semibold font-sans text-slate-700">
                  Department of Higher & Technical Education (उच्च एवं तकनीकी शिक्षा विभाग)
                </h3>
                <p className="text-[11px] font-sans text-slate-500">
                  Nepal House, Doranda, Ranchi - 834002 | Email: director.higheredu@jharkhand.gov.in
                </p>
              </div>

              {/* Memo Meta */}
              <div className="flex justify-between items-start text-xs font-sans border-b border-slate-200 pb-3">
                <div>
                  <span className="font-bold text-slate-700">Dispatch Memo No:</span>{' '}
                  <span className="font-mono font-bold text-slate-900">
                    {data.refNo || 'JH/DHTE/2026/SANCTION-8841'}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-slate-700">Date of Sanction:</span>{' '}
                  <span className="font-bold text-slate-900">{today}</span>
                </div>
              </div>

              {/* Subject */}
              <div className="text-xs font-sans font-bold bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-emerald-800 uppercase tracking-wider block text-[10px]">
                  SUBJECT / विषय:
                </span>
                Administrative Sanction & Field Pilot Deployment Approval for Societal Innovation: &ldquo;{data.title || 'Low-Cost Solar Fluoride Water Purification'}&rdquo; under NEP 2020 Scheme.
              </div>

              {/* Order Body */}
              <div className="text-xs space-y-3 font-sans text-slate-700 text-justify">
                <p>
                  <strong>ORDER:</strong> In exercise of powers conferred under the State Innovation & Higher Technical Education Framework, the Competent Authority hereby accords formal <strong>Administrative Sanction and Field Pilot Deployment Clearance</strong> to the multidisciplinary research team of <strong>{data.universityName || 'BIT Mesra, Ranchi'}</strong>.
                </p>
                <p>
                  The sanctioned innovation shall be field-deployed at <strong>{data.village || 'Sukhurhutu Panchayat'}</strong>, Block: <strong>{data.block || 'Kanke'}</strong>, District: <strong>{data.district || 'Ranchi'}</strong> to resolve verified ground challenges.
                </p>
                <p>
                  <strong>DIRECTIVES:</strong> The District Administration, Block Development Officer (BDO), and local Gram Panchayat representatives are instructed to render necessary logistical assistance, water/site access, and technical facilitation to the student engineers and faculty supervisors.
                </p>
              </div>

              {/* Signatures & Seal */}
              <div className="pt-8 flex justify-between items-end border-t border-slate-200 text-xs font-sans">
                <div className="space-y-1">
                  <div className="w-16 h-16 border border-dashed border-emerald-500 rounded-xl flex flex-col items-center justify-center text-[9px] text-emerald-800 font-bold bg-emerald-50">
                    <span>STATE SEAL</span>
                    <span>झारखंड सरकार</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">Digitally Signed & Dispatched</span>
                </div>

                <div className="text-right space-y-1">
                  <span className="font-mono font-bold text-emerald-900 block text-xs">
                    [Digitally Signed by Director]
                  </span>
                  <p className="font-bold text-slate-900">Rajesh Kumar Singh (IAS)</p>
                  <p className="text-[11px] text-slate-600">Director, Higher & Technical Education</p>
                  <p className="text-[10px] text-slate-500">Government of Jharkhand</p>
                </div>
              </div>
            </div>
          )}

          {/* 2. UNIVERSITY INSTITUTIONAL ENDORSEMENT LETTER (NEP 2020) */}
          {type === 'univ_endorsement' && (
            <div className="space-y-6">
              <div className="text-center border-b-2 border-slate-900 pb-5 space-y-1">
                <div className="w-12 h-12 rounded-full bg-indigo-800 text-white flex items-center justify-center text-2xl mx-auto shadow-sm">
                  🎓
                </div>
                <h2 className="text-lg font-bold uppercase tracking-wide font-sans text-slate-900">
                  {data.universityName || 'Birla Institute of Technology (BIT) Mesra, Ranchi'}
                </h2>
                <h3 className="text-sm font-semibold font-sans text-indigo-900">
                  Office of Dean (Research & Experiential Innovation) • Form NEP-2020-R&D
                </h3>
              </div>

              <div className="flex justify-between items-start text-xs font-sans border-b border-slate-200 pb-3">
                <div>
                  <span className="font-bold text-slate-700">Proposal Ref No:</span>{' '}
                  <span className="font-mono font-bold text-slate-900">{data.refNo || 'BIT/RND/NEP2020/PROP-104'}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-700">Date:</span>{' '}
                  <span className="font-bold text-slate-900">{today}</span>
                </div>
              </div>

              <div className="text-xs font-sans font-bold bg-indigo-50/70 p-3 rounded-xl border border-indigo-200">
                <span className="text-indigo-900 uppercase tracking-wider block text-[10px]">
                  INSTITUTIONAL ENDORSEMENT & IP DECLARATION:
                </span>
                R&D Project: &ldquo;{data.title || 'Solar Electro-Coagulation Fluoride Removal Unit'}&rdquo; under National Education Policy 2020 Experiential Learning Track.
              </div>

              <div className="text-xs space-y-3 font-sans text-slate-700 text-justify">
                <p>
                  This is to certify that the multidisciplinary student innovation team led by <strong>{data.studentLead || 'Amit Kumar (Civil Eng)'}</strong>, under the faculty supervision of <strong>{data.mentorName || 'Dr. Ananya Sen'}</strong>, has been officially endorsed by the Institute Academic Council.
                </p>
                <p>
                  <strong>IP DECLARATION:</strong> The underlying technology and schematics are declared as <strong>Open Source / Public Domain Social Good</strong> to enable wide state replication.
                </p>
                <p>
                  The Institute Incubation Centre (TBI) guarantees lab infrastructure, simulation tools, and analytical testing support for the 3-stage milestone deliverables.
                </p>
              </div>

              <div className="pt-8 flex justify-between items-end border-t border-slate-200 text-xs font-sans">
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-900">{data.mentorName || 'Dr. Ananya Sen'}</p>
                  <p className="text-[11px] text-slate-600">Faculty Supervisor & Project Lead</p>
                  <p className="text-[10px] text-slate-500">{data.universityName || 'BIT Mesra, Ranchi'}</p>
                </div>
                <div className="text-right space-y-0.5">
                  <p className="font-bold text-slate-900">Prof. (Dr.) S. K. Mahato</p>
                  <p className="text-[11px] text-slate-600">Dean of Research & Development</p>
                  <p className="text-[10px] text-slate-500">Institutional Seal Affixed</p>
                </div>
              </div>
            </div>
          )}

          {/* 3. CORPORATE CSR GRANT AWARD LETTER (SECTION 135) */}
          {type === 'csr_award' && (
            <div className="space-y-6">
              <div className="text-center border-b-2 border-slate-900 pb-5 space-y-1">
                <div className="w-12 h-12 rounded-full bg-amber-700 text-white flex items-center justify-center text-2xl mx-auto shadow-sm">
                  🏢
                </div>
                <h2 className="text-lg font-bold uppercase tracking-wide font-sans text-slate-900">
                  {data.industryName || 'Tata Steel CSR Foundation, Jamshedpur'}
                </h2>
                <h3 className="text-sm font-semibold font-sans text-amber-900">
                  Corporate Social Responsibility Sanction Letter • Form CSR-1 / Section 135 MCA
                </h3>
              </div>

              <div className="flex justify-between items-start text-xs font-sans border-b border-slate-200 pb-3">
                <div>
                  <span className="font-bold text-slate-700">Grant Agreement No:</span>{' '}
                  <span className="font-mono font-bold text-slate-900">{data.refNo || 'TSF/CSR/2026/GRANT-089'}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-700">Date:</span>{' '}
                  <span className="font-bold text-slate-900">{today}</span>
                </div>
              </div>

              <div className="text-xs font-sans font-bold bg-amber-50/70 p-3 rounded-xl border border-amber-200">
                <span className="text-amber-900 uppercase tracking-wider block text-[10px]">
                  GRANT COMMITMENT & TRANCHE DISBURSEMENT:
                </span>
                Total Sanctioned Grant: <strong>₹{(data.grantAmount || 150000).toLocaleString('en-IN')} INR</strong> for Rural Innovation & Sustainable Livelihoods.
              </div>

              <div className="text-xs space-y-3 font-sans text-slate-700 text-justify">
                <p>
                  The CSR Board Committee of <strong>{data.industryName || 'Tata Steel Foundation'}</strong> has reviewed and approved milestone grant funding for the academic solution proposed by <strong>{data.universityName || 'BIT Mesra'}</strong>.
                </p>
                <p>
                  <strong>STATUTORY COMPLIANCE:</strong> This grant qualifies under Schedule VII, Item (iv) of the Companies Act, 2013 (Water Conservation, Rural Livelihoods & Environmental Sustainability) under MCA Registration No: <strong>CSR00018924</strong>.
                </p>
                <p>
                  <strong>TRANCHE STATUS:</strong> Tranche 1 (₹45,000) disbursed via Electronic Fund Transfer. Transaction Reference / UTR: <strong className="font-mono text-slate-900">{data.utrNo || 'UTR-TATA-2026-001'}</strong>.
                </p>
              </div>

              <div className="pt-8 flex justify-between items-end border-t border-slate-200 text-xs font-sans">
                <div className="space-y-0.5">
                  <p className="font-mono text-[10px] text-emerald-800 font-bold">✓ Section 135 Compliant</p>
                  <p className="text-[10px] text-slate-500">Corporate Seal Affixed</p>
                </div>
                <div className="text-right space-y-0.5">
                  <p className="font-bold text-slate-900">Sanjay Srivastava</p>
                  <p className="text-[11px] text-slate-600">Head, CSR & Sustainable Development</p>
                  <p className="text-[10px] text-slate-500">{data.industryName || 'Tata Steel Foundation'}</p>
                </div>
              </div>
            </div>
          )}

          {/* 4. GRAM PANCHAYAT GROUND COMPLETION CERTIFICATE */}
          {type === 'panchayat_completion' && (
            <div className="space-y-6">
              <div className="text-center border-b-2 border-slate-900 pb-5 space-y-1">
                <div className="w-12 h-12 rounded-full bg-emerald-700 text-white flex items-center justify-center text-2xl mx-auto shadow-sm">
                  🌾
                </div>
                <h2 className="text-lg font-bold uppercase tracking-wide font-sans text-slate-900">
                  कार्यालय ग्राम पंचायत - {data.village || 'सुकुरहुटू'} (काँके, राँची)
                </h2>
                <h3 className="text-sm font-semibold font-sans text-emerald-900">
                  ग्राम पंचायत कार्य पूर्णता एवं सामाजिक अंकेक्षण प्रमाणपत्र (Ground Completion Certificate)
                </h3>
              </div>

              <div className="flex justify-between items-start text-xs font-sans border-b border-slate-200 pb-3">
                <div>
                  <span className="font-bold text-slate-700">प्रमाणपत्र संख्या:</span>{' '}
                  <span className="font-mono font-bold text-slate-900">{data.refNo || 'GP/SUKH/2026/COMP-012'}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-700">दिनांक:</span>{' '}
                  <span className="font-bold text-slate-900">{today}</span>
                </div>
              </div>

              <div className="text-xs font-sans font-bold bg-emerald-50/70 p-3 rounded-xl border border-emerald-200">
                <span className="text-emerald-900 uppercase tracking-wider block text-[10px]">
                  प्रमाणित किया जाता है (CERTIFIED):
                </span>
                परियोजना: &ldquo;{data.title || 'ग्रामीण पेयजल कुओं में सौर फ्लोराइड शुद्धिकरण संयंत्र'}&rdquo; का जमीनी परीक्षण एवं स्थापना कार्य सफलतापूर्वक पूर्ण हुआ।
              </div>

              <div className="text-xs space-y-3 font-sans text-slate-700 text-justify">
                <p>
                  प्रमाणित किया जाता है कि <strong>{data.universityName || 'बीआईटी मेसरा, राँची'}</strong> के छात्र-वैज्ञानिकों की टीम द्वारा हमारे ग्राम पंचायत में स्थापित प्रोटोटाइप का जमीनी परीक्षण किया गया है।
                </p>
                <p>
                  ग्राम सभा एवं ग्रामीणों द्वारा पानी की गुणवत्ता जांच में फ्लोराइड की मात्रा सुरक्षित सीमा (1.0 ppm) के भीतर पाई गई है। ग्राम सभा इस कार्य से <strong>100% संतुष्ट (5/5 ★)</strong> है।
                </p>
              </div>

              <div className="pt-8 flex justify-between items-end border-t border-slate-200 text-xs font-sans">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-emerald-800 font-bold block">✓ ग्राम सभा द्वारा अनुमोदित</span>
                  <span className="text-[10px] text-slate-500">मुहर: ग्राम पंचायत सुकुरहुटू</span>
                </div>
                <div className="text-right space-y-0.5">
                  <p className="font-bold text-slate-900">रमेश मुंडा (मुखिया)</p>
                  <p className="text-[11px] text-slate-600">ग्राम पंचायत सुकुरहुटू, काँके</p>
                  <p className="text-[10px] text-slate-500">जिला: राँची (झारखंड)</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
