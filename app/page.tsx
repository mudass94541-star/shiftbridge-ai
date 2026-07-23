'use client';

import { useState } from 'react';
import { Activity, AlertTriangle, Check, Copy, FileText, HeartPulse, Stethoscope, User, RefreshCw } from 'lucide-react';

interface ISBARResult {
  identify: string;
  situation: string;
  background: string;
  assessment: string;
  recommendations: string;
  criticalAlerts: string[];
  patientSummary: string;
}

const SAMPLE_NOTES = `Bed 4B - John Doe (68M). Admitted yesterday with acute CHF exacerbation. 
Shift update: SpO2 dipped to 89% on room air around 02:00, started on 2L NC, now stable at 95%. 
Furosemide 40mg IV given at 04:00, good fluid output (800ml). Morning labs drawn (K+ pending). 
Needs BP check every 2 hours (was 148/92). Doctor wants consult if urine output drops below 30ml/hr.`;

export default function Home() {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ISBARResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!notes.trim()) return;
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/handover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate report');
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating the handover.');
    } finally {
      setLoading(false);
    }
  };

  const copyReport = () => {
    if (!result) return;
    const formatted = `
--- ISBAR CLINICAL HANDOVER ---
IDENTIFY: ${result.identify}
SITUATION: ${result.situation}
BACKGROUND: ${result.background}
ASSESSMENT: ${result.assessment}
RECOMMENDATION: ${result.recommendations}
CRITICAL ALERTS: ${result.criticalAlerts.join(' | ')}
    `.trim();

    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">ShiftBridge AI</h1>
              <p className="text-xs text-slate-500">Clinical ISBAR Handover & Risk Summarizer</p>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Clinical AI Tool v1.0
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Input Column */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-semibold text-slate-800">
                Raw Patient Shift Notes
              </label>
              <button
                onClick={() => setNotes(SAMPLE_NOTES)}
                className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium"
              >
                <FileText className="w-3.5 h-3.5" /> Load Sample Note
              </button>
            </div>

            <textarea
              rows={12}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste or type raw shift observations, vitals, meds administered, doctor orders..."
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm leading-relaxed"
            />

            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading || !notes.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating ISBAR Report...
                </>
              ) : (
                <>
                  <HeartPulse className="w-4 h-4" />
                  Generate ISBAR Handover
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Output Column */}
        <div className="space-y-4">
          {result ? (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
              
              <div className="flex items-center justify-between border-b pb-3">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" /> Standardized ISBAR Report
                </h2>
                <button
                  onClick={copyReport}
                  className="px-3 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50 text-xs font-medium flex items-center gap-1 text-slate-700"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Report'}
                </button>
              </div>

              {/* Critical Flags Banner */}
              {result.criticalAlerts && result.criticalAlerts.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-800 font-semibold text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-600" /> Critical Shift Alerts & Follow-ups
                  </div>
                  <ul className="list-disc list-inside text-xs text-amber-900 space-y-1">
                    {result.criticalAlerts.map((alert, idx) => (
                      <li key={idx}>{alert}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ISBAR Sections */}
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="font-bold text-blue-900 block text-xs uppercase tracking-wider mb-1">I — Identify</span>
                  <p className="text-slate-800">{result.identify}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="font-bold text-blue-900 block text-xs uppercase tracking-wider mb-1">S — Situation</span>
                  <p className="text-slate-800">{result.situation}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="font-bold text-blue-900 block text-xs uppercase tracking-wider mb-1">B — Background</span>
                  <p className="text-slate-800">{result.background}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="font-bold text-blue-900 block text-xs uppercase tracking-wider mb-1">A — Assessment</span>
                  <p className="text-slate-800">{result.assessment}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="font-bold text-blue-900 block text-xs uppercase tracking-wider mb-1">R — Recommendation</span>
                  <p className="text-slate-800">{result.recommendations}</p>
                </div>

                {/* Patient/Family Friendly Version */}
                <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-lg">
                  <span className="font-bold text-blue-900 flex items-center gap-1 text-xs uppercase tracking-wider mb-1">
                    <User className="w-3.5 h-3.5" /> Patient / Family Friendly Update
                  </span>
                  <p className="text-slate-700 text-xs italic">{result.patientSummary}</p>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white p-12 rounded-xl border border-dashed border-slate-300 text-center flex flex-col items-center justify-center min-h-[400px]">
              <Stethoscope className="w-12 h-12 text-slate-300 mb-3" />
              <h3 className="font-medium text-slate-700 mb-1">No Report Generated Yet</h3>
              <p className="text-xs text-slate-400 max-w-xs">
                Enter clinical observations on the left or click "Load Sample Note" to see ShiftBridge AI transform raw notes into an ISBAR handover.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}