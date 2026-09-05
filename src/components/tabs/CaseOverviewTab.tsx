import React, { useState } from 'react';
import { 
  Building2, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  ExternalLink, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Gavel, 
  Copy, 
  Check, 
  Sparkles,
  Info
} from 'lucide-react';
import { Matter, AppLanguage, TimelineEvent } from '../../types';
import { fetchECourtsData } from '../../services/eCourtsService';

interface CaseOverviewTabProps {
  matter: Matter;
  lang: AppLanguage;
  onUpdateMatter: (updated: Matter) => void;
  onAddTimelineEvent: (event: TimelineEvent) => void;
  onSwitchTab: (tab: string) => void;
}

export const CaseOverviewTab: React.FC<CaseOverviewTabProps> = ({
  matter,
  lang,
  onUpdateMatter,
  onAddTimelineEvent,
  onSwitchTab,
}) => {
  const isHi = lang === 'hi';
  const [isSyncing, setIsSyncing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [stagedHearingDate, setStagedHearingDate] = useState('2026-09-10');

  const copyCNR = () => {
    if (matter.cnrNumber) {
      navigator.clipboard.writeText(matter.cnrNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSyncECourts = async () => {
    if (!matter.cnrNumber) return;
    setIsSyncing(true);
    try {
      const record = await fetchECourtsData(matter.cnrNumber);
      setStagedHearingDate(record.nextHearingDate);
      setShowConfirmModal(true);
    } finally {
      setIsSyncing(false);
    }
  };

  const confirmHearingSync = () => {
    const updatedMatter: Matter = {
      ...matter,
      nextHearingDate: stagedHearingDate,
      status: 'Awaiting Hearing',
      courtRecord: matter.courtRecord ? {
        ...matter.courtRecord,
        nextHearingDate: stagedHearingDate,
        lastSyncedAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST'
      } : undefined
    };

    onUpdateMatter(updatedMatter);

    onAddTimelineEvent({
      id: `tl-${Date.now()}`,
      matterId: matter.id,
      timestamp: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST',
      title: isHi ? 'ई-कोर्ट्स सुनवाई तारीख की पुष्टि व कैलेंडर में प्रविष्टि' : 'eCourts Hearing Date Confirmed & Pushed to Docket',
      titleHi: 'ई-कोर्ट्स सुनवाई तारीख की पुष्टि व कैलेंडर में प्रविष्टि',
      description: isHi
        ? `एनजेडीजी से प्राप्त अगली तारीख (${stagedHearingDate}) की पुष्टि की गई। कोर्ट कैलेंडर एवं एड. अनीता की टास्क लिस्ट में स्वतः दर्ज।`
        : `Verified next hearing date (${stagedHearingDate}) from NJDG query. Pushed into firm docket and assigned preparation task to Adv. Anita.`,
      actor: 'Adv. Anita Deshmukh',
      actorRole: 'Advocate',
      type: 'ECOURTS_SYNC',
      badge: 'NJDG Verified'
    });

    setShowConfirmModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Signature Feature: eCourts Real-Time Court Sync Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div className="flex items-start space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-slate-950 shrink-0 shadow-lg shadow-emerald-950/50">
              <Gavel className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="text-xs uppercase tracking-wider font-bold text-emerald-400 font-mono flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>National Judicial Data Grid (NJDG) Live Link</span>
                </span>
                <span className="text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                  eCourts Services Connected
                </span>
              </div>
              <h3 className="text-xl font-bold font-serif text-white mt-1">
                {matter.courtRecord?.courtName || matter.court}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {matter.courtRecord?.courtComplex || 'Principal Bench Jurisdiction'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleSyncECourts}
              disabled={isSyncing}
              className="flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition cursor-pointer disabled:opacity-60"
              title="Query eCourts for real-time order sheets and hearing listings"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? (isHi ? 'ई-कोर्ट्स खोज जारी...' : 'Querying NJDG...') : (isHi ? 'ई-कोर्ट्स लाइव रिफ्रेश' : 'Fetch Latest Court Status')}</span>
            </button>
            {matter.courtRecord?.sourceUrl && (
              <a
                href={matter.courtRecord.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition"
                title="Open official eCourts Portal page"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* eCourts Docket Breakdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-5">
          
          {/* CNR Card */}
          <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              {isHi ? 'सीएनआर संख्या (CNR)' : 'Official CNR Number'}
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-mono text-sm font-bold text-amber-300">
                {matter.cnrNumber || 'Not Linked'}
              </span>
              {matter.cnrNumber && (
                <button
                  onClick={copyCNR}
                  className="text-slate-400 hover:text-white p-1 rounded transition cursor-pointer"
                  title="Copy CNR Number"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Case No: {matter.caseNumber || 'N/A'}
            </span>
          </div>

          {/* Next Hearing Card */}
          <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                {isHi ? 'आगामी सुनवाई' : 'Next Hearing Date'}
              </span>
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            </div>
            <div className="text-base font-bold text-white mt-1 flex items-center space-x-1.5 font-serif">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>{matter.nextHearingDate ? new Date(matter.nextHearingDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'To be notified'}</span>
            </div>
            <span className="text-[10px] text-emerald-300 font-medium mt-1 block truncate">
              {matter.courtRecord?.causeListStatus || 'Listed in Daily Cause List'}
            </span>
          </div>

          {/* Bench / Coram */}
          <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              {isHi ? 'पीठ / कोरम (Bench)' : 'Coram / Presiding Bench'}
            </span>
            <span className="text-xs font-semibold text-slate-200 mt-1 block line-clamp-2">
              {matter.courtRecord?.bench || matter.courtRoom || 'Single Bench'}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Room: {matter.courtRoom || 'Court Room 3'}
            </span>
          </div>

          {/* Current Stage */}
          <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              {isHi ? 'मुकदमे का वर्तमान चरण' : 'Current Litigation Stage'}
            </span>
            <span className="text-xs font-semibold text-amber-200 mt-1 block line-clamp-2">
              {matter.courtRecord?.caseStage || 'Evidence & Final Arguments'}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Purpose: {matter.courtRecord?.purposeOfHearing || 'Interim Relief'}
            </span>
          </div>

        </div>

        {/* Certified Daily Order Excerpt */}
        {matter.courtRecord?.lastOrderSummary && (
          <div className="mt-4 p-3 bg-slate-800/40 rounded-xl border border-slate-700/40 flex items-start space-x-3 text-xs">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-slate-300 leading-relaxed">
              <span className="font-bold text-amber-300">
                {isHi ? 'अंतिम कोर्ट आदेश पत्र सारांश:' : 'Latest Daily Order Summary:'}
              </span>{' '}
              {matter.courtRecord.lastOrderSummary}
            </div>
          </div>
        )}

      </div>

      {/* Case Details & Strategy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Main Facts & Grounds */}
        <div className="md:col-span-2 space-y-6">
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>{isHi ? 'केस का संक्षिप्त विवरण एवं विधिक आधार' : 'Case Background & Legal Grounds'}</span>
              <span className="text-xs font-medium text-slate-400 font-mono">ID: {matter.matterNumber}</span>
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              {matter.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium block">{isHi ? 'वाद श्रेणी' : 'Category'}</span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block">{matter.category}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium block">{isHi ? 'दावा राशि' : 'Claim Amount'}</span>
                <span className="text-xs font-bold text-emerald-700 mt-0.5 block">{matter.claimAmount || 'N/A'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium block">{isHi ? 'परिसीमा अवधि' : 'Limitation Deadline'}</span>
                <span className="text-xs font-bold text-rose-700 mt-0.5 block">{matter.limitationDeadline || 'Within 2 Years'}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Hub */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-3 mb-4">
              {isHi ? 'त्वरित कार्य एवं मॉड्यूल शॉर्टकट' : 'Litigation Workflow Shortcuts'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => onSwitchTab('documents')}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-left transition group cursor-pointer"
              >
                <div className="text-xs font-bold text-slate-900 group-hover:text-amber-900">
                  {isHi ? 'दस्तावेज व ओसीआर' : 'OCR & Search Docs'}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {isHi ? 'स्कैन नोटिस में खोजें' : 'Search scanned notice text'}
                </p>
              </button>

              <button
                onClick={() => onSwitchTab('assembly')}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 text-left transition group cursor-pointer"
              >
                <div className="text-xs font-bold text-slate-900 group-hover:text-purple-900">
                  {isHi ? 'वकालतनामा तैयार करें' : 'Assemble Vakalatnama'}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {isHi ? 'स्वतः भरा कानूनी ड्राफ्ट' : 'Auto-fill from matter facts'}
                </p>
              </button>

              <button
                onClick={() => onSwitchTab('comms')}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-left transition group cursor-pointer"
              >
                <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-900">
                  {isHi ? 'व्हाट्सएप अलर्ट भेजें' : 'WhatsApp Client Alert'}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {isHi ? 'मीरा को तारीख सूचित करें' : 'Send hearing update to Meera'}
                </p>
              </button>
            </div>
          </div>

        </div>

        {/* Right Col: Team & Primary Contacts */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-3">
              {isHi ? 'कानूनी टीम एवं उत्तरदायित्व' : 'Legal Counsel & Staff'}
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center font-bold text-amber-900 text-xs">
                  AD
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{matter.leadAdvocate}</p>
                  <p className="text-[11px] text-slate-500">Lead Litigator · D/1429/2012</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center font-bold text-slate-700 text-xs">
                  RV
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{matter.paralegalAssigned}</p>
                  <p className="text-[11px] text-slate-500">Paralegal / Associate</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium block">{isHi ? 'केस प्रारंभ तिथि' : 'Matter Opened On'}</span>
              <span className="text-xs font-bold text-slate-800">{new Date(matter.openedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>

          {/* Primary Parties Snapshot */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>{isHi ? 'प्रमुख पक्षकार' : 'Key Parties'}</span>
              <button
                onClick={() => onSwitchTab('parties')}
                className="text-xs text-amber-700 hover:text-amber-800 font-semibold cursor-pointer"
              >
                {isHi ? 'सभी देखें →' : 'View All →'}
              </button>
            </h4>

            {matter.parties.map((p, idx) => (
              <div key={idx} className="p-2.5 bg-slate-50 rounded-xl text-xs space-y-0.5">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  {p.role}
                </span>
                <span className="font-bold text-slate-900 block">{p.contact.name}</span>
                <span className="text-[11px] text-slate-500 block">{p.contact.phone}</span>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Human-in-the-Loop Hearing Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900 font-serif">
                {isHi ? 'ई-कोर्ट्स सुनवाई तिथि की पुष्टि करें' : 'Confirm Court Docket Update'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {isHi ? 'न्यायिक डाटा ग्रिड द्वारा निम्न अगली तारीख प्राप्त हुई है:' : 'The National Judicial Data Grid returned this official listing:'}
              </p>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-1">
              <span className="text-xs text-emerald-800 font-semibold uppercase tracking-wider">
                {isHi ? 'आगामी सुनवाई तारीख' : 'Next Hearing Date'}
              </span>
              <p className="text-2xl font-bold font-serif text-emerald-950">
                10 September 2026
              </p>
              <p className="text-xs text-emerald-800 font-mono">
                Court Room 3 · Item No. 24 (Morning Session)
              </p>
            </div>

            <p className="text-xs text-slate-500 text-center">
              {isHi
                ? 'पुष्टि करने पर यह तारीख केस कैलेंडर, वकील की कार्यसूची एवं टाइमलाइन में स्वतः जुड़ जाएगी।'
                : 'Confirming will push this date into the firm calendar, create preparation deadlines, and record in the case timeline.'}
            </p>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                {isHi ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={confirmHearingSync}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer"
              >
                {isHi ? 'कैलेंडर में जोड़ें' : 'Confirm & Push'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
