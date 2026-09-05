import React, { useState } from 'react';
import { X, Scale, Sparkles, Building, User, IndianRupee, Loader2 } from 'lucide-react';
import { Matter, Contact, CaseCategory, CourtType, AppLanguage } from '../types';
import { fetchECourtsData } from '../services/eCourtsService';

interface NewMatterModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: Contact[];
  lang: AppLanguage;
  onCreateMatter: (newMatter: Matter) => void;
}

const COURTS_LIST: CourtType[] = [
  'National Consumer Disputes Redressal Commission (NCDRC)',
  'High Court of Delhi',
  'Bombay High Court',
  'District & Sessions Court, Saket',
  'Supreme Court of India',
  'National Company Law Tribunal (NCLT)',
  'Debts Recovery Tribunal (DRT)'
];

const CATEGORIES_LIST: CaseCategory[] = [
  'Consumer Protection',
  'Commercial Suit',
  'Writ Petition (Civil)',
  'Section 138 NI Act (Cheque Bounce)',
  'Arbitration & Conciliation',
  'Family & Succession',
  'Labor & Industrial'
];

export const NewMatterModal: React.FC<NewMatterModalProps> = ({
  isOpen,
  onClose,
  contacts,
  lang,
  onCreateMatter,
}) => {
  const isHi = lang === 'hi';
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CaseCategory>('Consumer Protection');
  const [court, setCourt] = useState<CourtType>('National Consumer Disputes Redressal Commission (NCDRC)');
  const [courtRoom, setCourtRoom] = useState('Court Room 3');
  const [cnrNumber, setCnrNumber] = useState('DLHC01-084920-2024');
  const [caseNumber, setCaseNumber] = useState('CC/412/2026');
  const [claimAmount, setClaimAmount] = useState('₹ 1,85,000');
  const [description, setDescription] = useState('');
  const [clientContactId, setClientContactId] = useState(contacts[0]?.id || '');
  const [oppositePartyName, setOppositePartyName] = useState('RetailCo Electronics Pvt Ltd');
  const [isFetchingECourts, setIsFetchingECourts] = useState(false);

  if (!isOpen) return null;

  const handleFetchECourts = async () => {
    if (!cnrNumber) return;
    setIsFetchingECourts(true);
    try {
      const record = await fetchECourtsData(cnrNumber);
      setTitle(`${record.petitionerName} v. ${record.respondentName}`);
      setCaseNumber(record.caseNumber);
      setDescription(`Imported from National Judicial Data Grid (NJDG). Next Hearing: ${record.nextHearingDate} for ${record.purposeOfHearing}.`);
    } finally {
      setIsFetchingECourts(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = contacts.find(c => c.id === clientContactId) || contacts[0];
    
    // Create new matter object
    const newMatter: Matter = {
      id: `matter-${Date.now()}`,
      matterNumber: `NS-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: title || `${client.name} v. ${oppositePartyName}`,
      description: description || 'Litigation matter initiated via NyaySetu intake portal.',
      category,
      court,
      courtRoom,
      cnrNumber: cnrNumber || undefined,
      caseNumber: caseNumber || undefined,
      status: 'Intake',
      leadAdvocate: 'Adv. Anita Deshmukh',
      paralegalAssigned: 'Rahul Verma',
      openedDate: new Date().toISOString().split('T')[0],
      claimAmount,
      parties: [
        {
          contactId: client.id,
          contact: client,
          role: 'Petitioner / Complainant',
          isPrimaryClient: true
        },
        {
          contactId: 'cnt-opposite',
          contact: {
            id: 'cnt-opposite',
            name: oppositePartyName,
            type: 'Company / Organization',
            phone: '+91 11 2345 6789',
            email: 'notice@oppositeparty.com',
            address: 'Industrial Area, Phase-I',
            city: 'New Delhi',
            state: 'Delhi'
          },
          role: 'Respondent / Opposite Party'
        }
      ],
      eCourtsTrackingActive: !!cnrNumber
    };

    onCreateMatter(newMatter);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-amber-600 flex items-center justify-center text-slate-950">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif text-amber-400">
                {isHi ? 'नया केस / वाद बनाएं' : 'Create New Legal Matter'}
              </h3>
              <p className="text-xs text-slate-400">
                {isHi ? 'केस को सिस्टम ऑफ रिकॉर्ड बनाएं और ई-कोर्ट्स से लिंक करें' : 'Establish single system of record & link eCourts CNR'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Quick eCourts Auto-fill Banner */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <div className="text-xs text-amber-950">
                <span className="font-bold">{isHi ? 'ई-कोर्ट्स ऑटो-फिल:' : 'eCourts Quick Auto-Fill:'}</span>{' '}
                {isHi ? 'सीएनआर नंबर दर्ज करके अदालती रिकॉर्ड सीधे भरें' : 'Enter CNR to populate case details from NJDG'}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={cnrNumber}
                onChange={(e) => setCnrNumber(e.target.value)}
                placeholder="CNR e.g. DLHC01-084920-2024"
                className="bg-white border border-amber-300 rounded px-2 py-1 text-xs font-mono font-bold text-slate-900 w-44 focus:outline-none focus:ring-1 focus:ring-amber-500 uppercase"
              />
              <button
                type="button"
                onClick={handleFetchECourts}
                disabled={isFetchingECourts}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-semibold flex items-center space-x-1 cursor-pointer disabled:opacity-50"
              >
                {isFetchingECourts ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                <span>{isHi ? 'प्राप्त करें' : 'Fetch'}</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {isHi ? 'केस का शीर्षक' : 'Matter Title'} *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Meera Sharma v. RetailCo Electronics Pvt Ltd"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {isHi ? 'वाद श्रेणी' : 'Case Category'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CaseCategory)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                {CATEGORIES_LIST.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Court */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {isHi ? 'न्यायालय / मंच' : 'Court / Forum'}
              </label>
              <select
                value={court}
                onChange={(e) => setCourt(e.target.value as CourtType)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                {COURTS_LIST.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Case No */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {isHi ? 'केस संख्या' : 'Official Case No.'}
              </label>
              <input
                type="text"
                value={caseNumber}
                onChange={(e) => setCaseNumber(e.target.value)}
                placeholder="e.g. CC/412/2026 or CS(COMM) 184/2025"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Claim Amount */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {isHi ? 'दावा राशि' : 'Claim / Disputed Value'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={claimAmount}
                  onChange={(e) => setClaimAmount(e.target.value)}
                  placeholder="e.g. ₹ 1,85,000"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-3 pr-3 py-2 text-sm text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Parties Linkage */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              {isHi ? 'पक्षकार संबंध (पुनः उपयोग संपर्क)' : 'Parties Linkage (Contact Reuse)'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  {isHi ? 'प्राथमिक मुवक्किल' : 'Primary Client (Contact Directory)'}
                </label>
                <select
                  value={clientContactId}
                  onChange={(e) => setClientContactId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {contacts.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  {isHi ? 'विपक्षी पक्षकार' : 'Opposite Party Name'}
                </label>
                <input
                  type="text"
                  value={oppositePartyName}
                  onChange={(e) => setOppositePartyName(e.target.value)}
                  placeholder="e.g. RetailCo Electronics Pvt Ltd"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {isHi ? 'केस का संक्षिप्त विवरण' : 'Case Summary & Legal Grounds'}
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summary of grievance, cause of action, and requested relief..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              {isHi ? 'रद्द करें' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-lg text-xs font-bold shadow-md shadow-amber-900/20 transition cursor-pointer flex items-center space-x-1.5"
            >
              <Scale className="w-4 h-4" />
              <span>{isHi ? 'केस बनाएं' : 'Create Matter'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
