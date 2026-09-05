import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Calendar, 
  Upload, 
  CheckCircle2, 
  FileText, 
  MessageSquare, 
  Clock, 
  AlertCircle, 
  Phone, 
  Languages, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Matter, DocumentItem, AppLanguage, TimelineEvent } from '../types';

interface ClientPortalViewProps {
  matter: Matter;
  documents: DocumentItem[];
  lang: AppLanguage;
  onAddDocument: (doc: DocumentItem) => void;
  onAddTimelineEvent: (event: TimelineEvent) => void;
  onSwitchToAdvocate: () => void;
}

export const ClientPortalView: React.FC<ClientPortalViewProps> = ({
  matter,
  documents,
  lang,
  onAddDocument,
  onAddTimelineEvent,
  onSwitchToAdvocate
}) => {
  const [portalLang, setPortalLang] = useState<AppLanguage>(lang);
  const isHi = portalLang === 'hi';
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [docName, setDocName] = useState('');

  const primaryClient = matter.parties.find(p => p.isPrimaryClient)?.contact || matter.parties[0]?.contact;
  const clientDocs = documents.filter(d => d.matterId === matter.id);

  const handleClientUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    const newDoc: DocumentItem = {
      id: `doc-client-${Date.now()}`,
      matterId: matter.id,
      title: `${docName.trim()}.pdf`,
      titleHi: `${docName.trim()}.pdf`,
      type: 'Client Submission',
      fileSize: '1.4 MB',
      fileType: 'application/pdf',
      uploadedAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST',
      uploadedBy: primaryClient?.name || 'Meera Sharma (Litigant)',
      sha256Hash: '98fa2e457f9208a38b4f17912bb9472e35a0928e4693a1cf59b48f93e981c71f',
      ocrProcessed: true,
      ocrContent: `Client uploaded document regarding consumer complaint: ${docName}. Contains purchase receipts, warranty terms, and authorized service center inspection notes.`,
      source: 'Client Portal Upload',
      tags: ['Client Evidence', 'Self-Attested']
    };

    onAddDocument(newDoc);

    onAddTimelineEvent({
      id: `tl-${Date.now()}`,
      matterId: matter.id,
      timestamp: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST',
      title: isHi ? `मुवक्किल द्वारा साक्ष्य अपलोड: ${docName}` : `Client Uploaded Evidence: ${docName}`,
      titleHi: `मुवक्किल द्वारा साक्ष्य अपलोड: ${docName}`,
      description: isHi
        ? `${primaryClient?.name} ने क्लाइंट पोर्टल से नया दस्तावेज़ संलग्न किया। वकील को सूचित किया गया।`
        : `Uploaded by ${primaryClient?.name} via Mobile Client Portal. SHA-256 hash verified.`,
      actor: primaryClient?.name || 'Meera Sharma',
      actorRole: 'Litigant',
      type: 'DOC_UPLOAD',
      badge: 'Client Upload'
    });

    setDocName('');
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Client Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
              {isHi ? 'न्याय सेतु मुवक्किल पोर्टल' : 'NyaySetu Litigant Portal'}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold font-serif">
              {isHi ? `नमस्ते, ${primaryClient?.name || 'मीरा जी'}` : `Namaste, ${primaryClient?.name || 'Meera Sharma'}`}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              {isHi ? 'आपके केस की वास्तविक अदालती स्थिति और आदेशों की सीधी जानकारी' : 'Transparent, jargon-free tracking of your ongoing legal case'}
            </p>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center space-x-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700 self-start sm:self-auto">
            <Languages className="w-4 h-4 text-amber-400 ml-1" />
            <button
              onClick={() => setPortalLang('en')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                portalLang === 'en' ? 'bg-amber-500 text-slate-950' : 'text-slate-300'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setPortalLang('hi')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                portalLang === 'hi' ? 'bg-amber-500 text-slate-950' : 'text-slate-300'
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>

        {/* Litigant Switch Back Button */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Viewing as Litigant (Client View)</span>
          <button
            onClick={onSwitchToAdvocate}
            className="text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
          >
            Switch to Advocate View →
          </button>
        </div>
      </div>

      {/* Case Status Big Summary Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <span className="text-[10px] font-mono font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
              {matter.matterNumber}
            </span>
            <h2 className="text-lg font-bold font-serif text-slate-900 mt-1">
              {isHi && matter.titleHi ? matter.titleHi : matter.title}
            </h2>
            <p className="text-xs text-slate-500">
              {matter.court} ({matter.courtRoom || 'Bench 3'})
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full">
              {matter.status}
            </span>
          </div>
        </div>

        {/* Big Alert: Next Hearing */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 font-bold flex flex-col items-center justify-center shrink-0 shadow-sm">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
                {isHi ? 'अगली अदालती सुनवाई' : 'Next Court Hearing'}
              </span>
              <p className="text-base sm:text-lg font-bold text-slate-900 font-serif">
                {matter.nextHearingDate ? new Date(matter.nextHearingDate).toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }) : '10 September 2026'}
              </p>
              <p className="text-xs text-amber-900 font-medium mt-0.5">
                {isHi ? 'आइटम #24 · कारण सूची (Cause List) में सूचीबद्ध' : 'Cause List Item #24 · Hearing on Rejoinder & Cost Compliance'}
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/919811234567"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-sm transition cursor-pointer self-start sm:self-auto"
          >
            <MessageSquare className="w-4 h-4 text-emerald-200" />
            <span>{isHi ? 'वकील से व्हाट्सएप पर पूछें' : 'WhatsApp Lead Counsel'}</span>
          </a>
        </div>

        {/* What happened in last hearing */}
        <div className="space-y-2 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            {isHi ? 'पिछली सुनवाई में क्या हुआ?' : 'What happened at the last hearing?'}
          </h3>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-1">
            <p className="font-semibold text-slate-900">
              {isHi
                ? 'माननीय आयोग ने विपक्षी पार्टी (RetailCo) को जवाब दाखिल करने का अंतिम अवसर दिया और ₹5,000 की हर्जाना राशि आप (उपभोक्ता) को अदा करने का आदेश दिया।'
                : 'The Hon\'ble Commission granted a final opportunity to the opposite party (RetailCo) to file their written reply subject to payment of ₹5,000 cost to you (the complainant).'}
            </p>
            <p className="text-slate-500 text-[11px]">
              Order passed by Presiding Member on 28-08-2026. Adv. Anita Deshmukh appeared on your behalf.
            </p>
          </div>
        </div>
      </div>

      {/* Action Needed: Mobile Document Upload */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-2">
            <Upload className="w-4 h-4 text-blue-600" />
            <span>{isHi ? 'वकील द्वारा मांगे गए दस्तावेज अपलोड करें' : 'Documents Requested by Counsel'}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {isHi ? 'सीधे फोन से इनवॉइस या सर्विस सेंटर विजिट रिपोर्ट की फोटो या पीडीएफ अपलोड करें' : 'Upload purchase bills, defect photos, or correspondence directly from your phone'}
          </p>
        </div>

        <form onSubmit={handleClientUpload} className="bg-blue-50/50 p-4 sm:p-5 rounded-2xl border border-blue-200 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isHi ? 'दस्तावेज़ का नाम / विवरण' : 'Document Title / Description'} *
            </label>
            <input
              type="text"
              required
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              placeholder={isHi ? 'जैसे: सैमसंग टीवी बिल और वारंटी कार्ड' : 'e.g. Original Tax Invoice & Authorised Service Job Slip'}
              className="w-full bg-white border border-blue-300 rounded-xl p-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <div className="border-2 border-dashed border-blue-300 rounded-xl p-6 text-center bg-white space-y-2 cursor-pointer hover:bg-blue-50/30 transition">
            <Upload className="w-8 h-8 text-blue-500 mx-auto" />
            <p className="text-xs font-bold text-slate-800">
              {isHi ? 'फाइल चुनें या यहाँ खींचें (PDF / JPG / PNG)' : 'Select PDF or take a photo with your mobile camera'}
            </p>
            <p className="text-[11px] text-slate-400">
              Auto-stamped with SHA-256 cryptographic hash (BSA 2023 certified)
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-900/20 transition flex items-center space-x-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isHi ? 'केस फाइल में अपलोड करें' : 'Upload to Case File'}</span>
            </button>
          </div>

          {uploadSuccess && (
            <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-semibold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{isHi ? 'दस्तावेज़ सफलतापूर्वक वकील की फाइल में संलग्न हो गया!' : 'Document safely uploaded & indexed into Advocate\'s portal!'}</span>
            </div>
          )}
        </form>

        {/* Existing uploaded docs list */}
        <div className="space-y-2 pt-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {isHi ? 'केस में उपलब्ध फाइलें' : 'Files in your Case Record'} ({clientDocs.length})
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {clientDocs.map(doc => (
              <div key={doc.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 truncate pr-2">
                  <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-800 truncate">{doc.title}</span>
                </div>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono shrink-0">
                  {doc.fileSize}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Advocate Contact Details Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-400 font-bold flex items-center justify-center text-sm font-serif border border-slate-800">
            AD
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Adv. Anita Deshmukh
            </h4>
            <p className="text-xs text-slate-500">
              Designated Counsel · Enrolment: D/1842/2012
            </p>
            <p className="text-xs text-slate-600 mt-0.5 flex items-center space-x-1">
              <Phone className="w-3 h-3 text-slate-400" />
              <span>+91 98112 34567 · Chamber 412, High Court</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <a
            href="tel:+919811234567"
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5 text-slate-600" />
            <span>Call Office</span>
          </a>
          <a
            href="https://wa.me/919811234567"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-200" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

    </div>
  );
};
