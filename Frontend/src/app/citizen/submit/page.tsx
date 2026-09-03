'use client';

// ==========================================
// CITIZEN MODULE - PROBLEM SUBMISSION FORM
// File: Frontend/src/app/citizen/submit/page.tsx
// ==========================================

/*
  PURPOSE:
  - Form enabling rural citizens, whistleblowers, and panchayat representatives to report local societal challenges with photo/audio evidence.

  FEATURES TO IMPLEMENT:
  1. 🛡️ Anonymous Whistleblower Mode toggle (zero identity logging + EXIF stripper).
  2. Live AI Domain Categorization preview (via Python AI /api/ai/classify).
  3. Audio Voice Note recorder.
  4. Secret Passkey Modal on successful anonymous submission.
*/

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Camera,
  Mic,
  MapPin,
  AlertTriangle,
  Copy,
  CheckCircle2,
  ArrowRight,
  Info,
  Upload,
  X,
  ExternalLink
} from 'lucide-react';
import { JHARKHAND_DISTRICTS, THEMATIC_DOMAINS } from '../../../lib/constants';
import { citizenApi, aiApi } from '../../../lib/api';

export default function CitizenSubmitProblemPage() {
  const router = useRouter();

  // Form States
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [district, setDistrict] = useState<string>('Ranchi');
  const [block, setBlock] = useState('');
  const [village, setVillage] = useState('');
  const [landmark, setLandmark] = useState('');
  const [domainCategory, setDomainCategory] = useState<string>('Water Resources');
  const [isDisasterEmergency, setIsDisasterEmergency] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [voiceNoteUrl, setVoiceNoteUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [liveCoordinates, setLiveCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [fetchingGps, setFetchingGps] = useState(false);

  // UI & Loading States
  const [isClassifying, setIsClassifying] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [generatedPasskey, setGeneratedPasskey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Optional Live GPS Location Fetcher
  const handleGetLiveLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setFetchingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLiveCoordinates({
          latitude: parseFloat(pos.coords.latitude.toFixed(6)),
          longitude: parseFloat(pos.coords.longitude.toFixed(6))
        });
        setFetchingGps(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        alert('Could not access live GPS location. Please ensure location permissions are allowed in your browser.');
        setFetchingGps(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Direct Photo File Picker with Client-Side EXIF Stripper
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      // 1. Strip EXIF metadata via HTML5 Canvas (Anonymous Whistleblower Protection)
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      const cleanedBlob = await new Promise<Blob>((resolve, reject) => {
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error('Canvas conversion failed'));
            },
            'image/jpeg',
            0.88
          );
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
      });

      const localPreview = URL.createObjectURL(cleanedBlob);
      setImagePreview(localPreview);

      // 2. Upload to Cloudinary if configured in .env
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'samadhan_setu_preset';

      if (cloudName && cloudName !== 'your_cloud_name') {
        const formData = new FormData();
        formData.append('file', cleanedBlob);
        formData.append('upload_preset', uploadPreset);

        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData
        });
        const data = await uploadRes.json();
        if (data.secure_url) {
          setPhotoUrl(data.secure_url);
        } else {
          setPhotoUrl(localPreview);
        }
      } else {
        setPhotoUrl(localPreview);
      }
    } catch (err: any) {
      console.error('Photo upload error:', err);
      alert('Error processing photo: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  // Live AI Classification Trigger
  const handleAiClassify = async () => {
    if (!description.trim() && !title.trim()) return;
    setIsClassifying(true);
    try {
      const res = await aiApi.classifyLive({
        title: title || 'Societal challenge in Jharkhand',
        description: description || title,
        district: district || 'Ranchi'
      });
      if (res && res.success && res.data) {
        const domain = res.data.domainCategory || res.data.domain_category;
        const severity = res.data.severityLevel || res.data.severity_level;
        const isEmergency = res.data.isDisasterEmergency ?? res.data.is_disaster_emergency;
        const isRnD = res.data.isActionableRnD ?? res.data.is_actionable_rnd;
        const tags = res.data.suggestedTags || res.data.ai_tags || [];

        setAiSuggestion({
          domainCategory: domain,
          severityLevel: severity,
          isDisasterEmergency: isEmergency,
          isActionableRnD: isRnD,
          suggestedTags: tags
        });

        if (domain) setDomainCategory(domain);
        if (isEmergency !== undefined) setIsDisasterEmergency(isEmergency);
      }
    } catch (err) {
      console.error('Error during AI classification:', err);
    } finally {
      setIsClassifying(false);
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please provide a problem title and description.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        isAnonymous,
        domainCategory,
        isDisasterEmergency,
        location: {
          district: district || 'Ranchi',
          block: block?.trim() || undefined,
          villageOrPanchayat: village?.trim() || undefined,
          landmark: landmark?.trim() || undefined,
          latitude: liveCoordinates?.latitude,
          longitude: liveCoordinates?.longitude
        },
        mediaAttachments: photoUrl
          ? [{ mediaType: 'image', url: photoUrl, isExifStripped: isAnonymous }]
          : [],
        voiceNoteUrl: voiceNoteUrl || undefined
      };

      const res = await citizenApi.submitProblem(payload);
      if (res && res.success) {
        if (res.anonymousTrackingToken || isAnonymous || res.isAnonymous || res.problem?.anonymousTrackingToken) {
          setGeneratedPasskey(res.anonymousTrackingToken || res.problem?.anonymousTrackingToken);
        } else {
          alert('Societal challenge submitted successfully! Academic teams have been notified.');
          router.push('/citizen');
        }
      } else {
        alert(res.message || 'Error submitting challenge.');
      }
    } catch (err: any) {
      alert('Failed to submit challenge: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyPasskey = () => {
    if (generatedPasskey) {
      navigator.clipboard.writeText(generatedPasskey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Anonymous Secret Key Success Modal */}
      {generatedPasskey && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-slate-200 text-center space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl mx-auto">
              🛡️
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                Whistleblower Challenge Logged!
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Your report has been received with <strong>zero identity or IP logging</strong>. To track progress, review university proposals, or confirm ground resolution, copy and save your secret passkey below:
              </p>
            </div>

            <div className="bg-slate-50 border-2 border-dashed border-emerald-400 rounded-2xl p-4 flex items-center justify-between gap-3">
              <span className="font-mono font-extrabold text-lg text-emerald-900 tracking-wider">
                {generatedPasskey}
              </span>
              <button
                onClick={handleCopyPasskey}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-sm"
              >
                {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Key'}
              </button>
            </div>

            <p className="text-[11px] text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200 text-left">
              ⚠️ <strong>Note:</strong> We do not store your contact info. This secret passkey is the only way you can access this ticket later without logging in.
            </p>

            <Link
              href={`/citizen/my-problems?passkey=${generatedPasskey}`}
              className="flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl text-xs transition-colors"
            >
              <span>Go to Secret Tracking Timeline</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Main Form Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            <span>🌾 Grassroots Sourcing Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Report a Societal Challenge in Jharkhand
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Describe the civic, environmental, agricultural, or healthcare problem in your village or urban ward. Our AI will classify and route it to academic R&D teams.
          </p>
        </div>

        {/* 🛡️ WHISTLEBLOWER SHIELD TOGGLE */}
        <div
          onClick={() => setIsAnonymous(!isAnonymous)}
          className={`cursor-pointer rounded-2xl p-4 sm:p-5 border-2 transition-all flex items-start gap-4 ${
            isAnonymous
              ? 'bg-indigo-50/70 border-indigo-500 shadow-sm'
              : 'bg-slate-50 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isAnonymous ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}
          >
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="flex-grow">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900">
                🛡️ Submit Anonymously (Whistleblower Mode)
              </h4>
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={() => {}}
                className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
              />
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              When enabled, your name, phone number, and IP address are <strong>zero-logged</strong>. Photo EXIF metadata is stripped. You will receive a secret passkey to track the status privately.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Problem Title / समस्या का शीर्षक *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. High fluoride contamination in rural drinking wells across 8 villages"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Detailed Description & Community Impact *
              </label>
              <button
                type="button"
                onClick={handleAiClassify}
                disabled={isClassifying || !description}
                className="flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-900 font-bold bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-lg transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isClassifying ? 'Analyzing AI...' : 'AI Auto-Detect Category'}
              </button>
            </div>
            <textarea
              required
              rows={4}
              placeholder="Explain what is happening, who is affected (e.g. school children, farmers), duration of problem, and any attempted remedies..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* AI Classification Insights Card */}
          {aiSuggestion && (
            <div className="bg-gradient-to-br from-emerald-50 via-teal-50/60 to-indigo-50/50 border-2 border-emerald-300/80 rounded-3xl p-5 shadow-sm space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-extrabold text-slate-900 text-sm">
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-sm">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span>AI Problem Intelligence Analysis</span>
                </div>
                <span className="text-[11px] font-extrabold bg-emerald-600 text-white px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                  <span>⚡ Live AI Result</span>
                </span>
              </div>

              {/* 3 Prominent Insight Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* 1. Recommended Domain */}
                <div className="bg-white/90 backdrop-blur-sm border border-emerald-200/80 rounded-2xl p-3 shadow-2xs">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                    Detected Domain
                  </span>
                  <span className="text-xs font-extrabold text-emerald-800 block mt-0.5 truncate">
                    🎯 {aiSuggestion.domainCategory || 'Water Resources'}
                  </span>
                </div>

                {/* 2. Severity Level */}
                <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl p-3 shadow-2xs">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                    Estimated Severity
                  </span>
                  <span
                    className={`text-xs font-extrabold block mt-0.5 ${
                      aiSuggestion.severityLevel === 'Critical'
                        ? 'text-red-600'
                        : aiSuggestion.severityLevel === 'High'
                        ? 'text-amber-600'
                        : 'text-emerald-700'
                    }`}
                  >
                    ⚡ {aiSuggestion.severityLevel || 'Medium'} Severity
                  </span>
                </div>

                {/* 3. Feasibility Track */}
                <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl p-3 shadow-2xs">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                    R&D Feasibility
                  </span>
                  <span
                    className={`text-xs font-extrabold block mt-0.5 ${
                      aiSuggestion.isActionableRnD !== false
                        ? 'text-indigo-700'
                        : 'text-slate-600'
                    }`}
                  >
                    {aiSuggestion.isActionableRnD !== false
                      ? '🔬 Academic HEI Project'
                      : '📋 Routine Jan Samvad'}
                  </span>
                </div>
              </div>

              {/* Emergency Banner if Critical */}
              {aiSuggestion.isDisasterEmergency && (
                <div className="bg-red-500 text-white rounded-2xl px-3.5 py-2 text-xs font-bold flex items-center gap-2 shadow-sm animate-pulse">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>🚨 Priority Alert: Life-threatening disaster emergency detected. Fast-tracking to DDMA!</span>
                </div>
              )}

              {/* AI Suggested Tags */}
              {aiSuggestion.suggestedTags && aiSuggestion.suggestedTags.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                  <span className="text-[11px] font-bold text-slate-500 mr-1">AI Tags:</span>
                  {aiSuggestion.suggestedTags.map((t: string) => (
                    <span
                      key={t}
                      className="bg-emerald-100/80 hover:bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-lg text-[11px] font-bold border border-emerald-200 transition-colors"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Domain Category & District */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Thematic Domain Category *
              </label>
              <select
                value={domainCategory}
                onChange={(e) => setDomainCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {THEMATIC_DOMAINS.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Jharkhand District *
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {JHARKHAND_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Block, Village & Landmark */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Block / प्रखंड</label>
              <input
                type="text"
                placeholder="e.g. Kanke / Topchanchi"
                value={block}
                onChange={(e) => setBlock(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Village / Panchayat</label>
              <input
                type="text"
                placeholder="e.g. Sukhurhutu Panchayat"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Landmark</label>
              <input
                type="text"
                placeholder="e.g. Near Govt Middle School"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Optional Live GPS Location Button & Badge */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <span>Exact Live GPS Coordinates</span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase bg-white border border-slate-200 px-1.5 py-0.2 rounded">
                    Optional
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Pinpoint exact ground coordinates to aid university R&D field visits & drone surveys
                </p>
              </div>
            </div>

            {!liveCoordinates ? (
              <button
                type="button"
                disabled={fetchingGps}
                onClick={handleGetLiveLocation}
                className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-emerald-50 active:scale-98 border border-emerald-300 text-emerald-700 font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2 shrink-0"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{fetchingGps ? 'Acquiring GPS...' : '📍 Share Live Location'}</span>
              </button>
            ) : (
              <div className="flex flex-wrap items-center gap-2 bg-emerald-100 text-emerald-950 border border-emerald-300 px-3.5 py-2 rounded-xl text-xs font-mono font-bold shadow-2xs animate-in fade-in">
                <span>📍 {liveCoordinates.latitude}°, {liveCoordinates.longitude}°</span>
                <a
                  href={`https://www.google.com/maps?q=${liveCoordinates.latitude},${liveCoordinates.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 bg-white hover:bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-300 text-[11px] font-sans font-bold transition-all shadow-2xs active:scale-95"
                  title="Verify your live location on Google Maps"
                >
                  <span>🗺️ Check on Map</span>
                  <ExternalLink className="w-3 h-3 text-emerald-600" />
                </a>
                <button
                  type="button"
                  onClick={() => setLiveCoordinates(null)}
                  className="p-1 hover:bg-emerald-200 text-emerald-800 rounded-full transition-colors"
                  title="Remove Coordinates"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Media Attachments & Voice Note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Direct Photo File Picker with EXIF Stripper */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-emerald-600" />
                  <span>Attach Photo Evidence</span>
                </span>
                <span className="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full font-bold">
                  🛡️ Auto EXIF Stripped
                </span>
              </label>

              {!imagePreview ? (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-4 cursor-pointer bg-slate-50 hover:bg-emerald-50/50 transition-all">
                  <Upload className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-xs font-bold text-slate-700">
                    {uploadingImage ? 'Stripping EXIF & Uploading...' : 'Click to Upload / Take Photo'}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5">
                    JPG, PNG, WebP (Camera & GPS metadata removed)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingImage}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 p-2 flex items-center gap-3">
                  <img
                    src={imagePreview}
                    alt="Evidence Preview"
                    className="w-16 h-16 object-cover rounded-xl border border-slate-200"
                  />
                  <div className="flex-grow text-xs">
                    <span className="font-bold text-emerald-700 block">✓ Photo Attached</span>
                    <span className="text-[10px] text-slate-500">EXIF metadata sanitized</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setPhotoUrl('');
                    }}
                    className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-full transition-colors"
                    title="Remove Photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Voice Note Simulation */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Mic className="w-4 h-4 text-slate-500" />
                <span>Voice Note (Hindi / Local Dialect)</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsRecording(!isRecording);
                    if (!isRecording) {
                      setVoiceNoteUrl('https://samadhan-audio.jharkhand.gov.in/voice-note-demo.mp3');
                    }
                  }}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isRecording
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                  {isRecording ? 'Recording (Click to stop)' : 'Record Audio Note'}
                </button>
                {voiceNoteUrl && (
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    ✓ Audio attached
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* SOS Emergency Checkbox */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
            <input
              type="checkbox"
              id="emergencySos"
              checked={isDisasterEmergency}
              onChange={(e) => setIsDisasterEmergency(e.target.checked)}
              className="w-5 h-5 accent-red-600 rounded cursor-pointer"
            />
            <label htmlFor="emergencySos" className="text-xs text-red-900 font-medium cursor-pointer">
              <strong>🚨 Fast-Track Disaster Emergency (SOS):</strong> Check if this is an immediate life-threatening emergency (e.g. mine fire toxic blowout, sudden dam breach, landslide).
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-4 rounded-2xl shadow-md hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2"
          >
            {submitting ? (
              <span>Submitting Challenge...</span>
            ) : (
              <>
                <ShieldAlert className="w-5 h-5" />
                <span>Submit Societal Challenge to Innovation Grid</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
