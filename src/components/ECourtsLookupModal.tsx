import React, { useState } from 'react';
import { 
  Gavel, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  ExternalLink, 
  Calendar, 
  Download, 
  ShieldCheck, 
  Plus, 
  Building,
  Sparkles
} from 'lucide-react';
import { CourtSyncRecord, AppLanguage } from '../types';
import { fetchECourtsData, SAMPLE_CNRS } from '../services/eCourtsService';

interface ECourtsLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: AppLanguage;
  onCreateMatterFromCNR?: (record: CourtSyncRecord) => void;
}

export const ECourtsLookupModal: React.FC<ECourtsLookupModalProps> = ({
  isOpen,
  onClose,
  lang,
  onCreateMatterFromCNR
}) => {
  const isHi = lang === 'hi';
  const [cnr, setCnr] = useState('DLHC01-084920-2024');
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState<CourtSyncRecord | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (queryCnr?: string) => {
    const targetCnr = queryCnr || cnr;
    if (!targetCnr.trim()) return;
    setLoading(true);
    setRecord(null);

    try {
      const res = await fetchECourtsData(targetCnr);
      setRecord(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Gavel className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif text-amber-400">
                {isHi ? 'ई-कोर्ट्स सीएनआर खोज (eCourts NJDG API)' : 'eCourts & NJDG Public Portal Query'}
              </h3>
              <p className="text-[11px] text-slate-300">
                {isHi ? 'राष्ट्रीय न्यायिक डेटा ग्रिड (NJDG) से वास्तविक कोर्ट रिकॉर्ड प्राप्त करें' : 'Fetch live cause list, orders & hearing history directly from court records'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-5">
          
          {/* Search Bar */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              {isHi ? '१६ अंकों का सीएनआर (CNR) नंबर दर्ज करें' : 'Enter 16-Digit CNR Number'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={cnr}
                onChange={(e) => setCnr(e.target.value.toUpperCase())}
                placeholder="e.g. DLHC01-084920-2024"
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                onClick={() => handleSearch()}
                disabled={loading}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>{loading ? (isHi ? 'खोज जारी...' : 'Querying...') : (isHi ? 'कोर्ट रिकॉर्ड प्राप्त करें' : 'Query NJDG')}</span>
              </button>
            </div>

            {/* Quick Sample CNR Buttons */}
            <div className="flex items-center space-x-2 pt-1 flex-wrap gap-y-1">
              <span className="text-[11px] font-semibold text-slate-400">Sample CNRs:</span>
              {SAMPLE_CNRS.map(s => (
                <button
                  key={s.cnr}
                  onClick={() => {
                    setCnr(s.cnr);
                    handleSearch(s.cnr);
                  }}
                  className="text-[10px] font-mono bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-slate-200 px-2 py-0.5 rounded cursor-pointer transition"
                >
                  {s.cnr} ({s.court})
                </button>
              ))}
            </div>
          </div>

          {/* Result Card */}
          {record && (
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4 max-h-[50vh] overflow-y-auto">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded font-mono font-bold">
                    CNR: {record.cnrNumber}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">
                    {record.caseNumber}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {record.courtName} · {record.bench}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-semibold text-emerald-700 bg-white border border-emerald-300 px-2 py-0.5 rounded">
                    NJDG Status: {record.caseStage}
                  </span>
                </div>
              </div>

              {/* Parties */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-white p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Petitioner / Complainant:</span>
                  <span className="font-bold text-slate-900">{record.petitionerName}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Respondent:</span>
                  <span className="font-bold text-slate-900">{record.respondentName}</span>
                </div>
              </div>

              {/* Next hearing */}
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-900 flex items-center space-x-1.5">
                  <Calendar className="w-4 h-4 text-emerald-700" />
                  <span>Next Hearing Date: <strong>{new Date(record.nextHearingDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</strong></span>
                </span>
                <span className="text-emerald-800 font-semibold text-[11px]">
                  {record.causeListStatus}
                </span>
              </div>

              {/* Order sheet snippet */}
              {record.lastOrderSummary && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Latest Daily Court Order (NJDG Download)
                  </span>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                    <div className="flex items-center justify-between font-semibold text-slate-900">
                      <span>Order Date: {record.lastHearingDate}</span>
                      <span className="text-slate-400 font-mono text-[10px]">Certified NJDG Copy</span>
                    </div>
                    <p className="italic text-slate-600 font-serif">
                      "{record.lastOrderSummary}"
                    </p>
                  </div>
                </div>
              )}

              {/* Action Button */}
              {onCreateMatterFromCNR && (
                <div className="pt-2 border-t border-slate-200 flex justify-end">
                  <button
                    onClick={() => {
                      onCreateMatterFromCNR(record);
                      onClose();
                    }}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isHi ? 'इस सीएनआर से नया केस बनाएं' : 'Create Matter from this CNR'}</span>
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
