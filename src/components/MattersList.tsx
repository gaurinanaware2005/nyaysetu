import React, { useState, useMemo } from 'react';
import { 
  Scale, 
  Briefcase, 
  Calendar, 
  Search, 
  Plus, 
  ExternalLink, 
  ArrowRight, 
  Filter, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Gavel,
  Users,
  Clock
} from 'lucide-react';
import { Matter, CaseCategory, CaseStatus, CourtType, AppLanguage } from '../types';

interface MattersListProps {
  matters: Matter[];
  lang: AppLanguage;
  onSelectMatter: (matterId: string, tab?: string) => void;
  onOpenNewMatter: () => void;
  onOpenDemoWalkthrough: () => void;
  onOpenECourtsLookup: () => void;
}

export const MattersList: React.FC<MattersListProps> = ({
  matters,
  lang,
  onSelectMatter,
  onOpenNewMatter,
  onOpenDemoWalkthrough,
  onOpenECourtsLookup,
}) => {
  const isHi = lang === 'hi';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Metrics
  const activeCount = matters.filter(m => m.status !== 'Disposed').length;
  const eCourtsCount = matters.filter(m => m.eCourtsTrackingActive).length;
  const awaitingHearingCount = matters.filter(m => m.status === 'Awaiting Hearing').length;

  const filteredMatters = useMemo(() => {
    return matters.filter(m => {
      const matchesSearch = 
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.matterNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.cnrNumber && m.cnrNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
        m.court.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = selectedStatus === 'ALL' || m.status === selectedStatus;
      const matchesCategory = selectedCategory === 'ALL' || m.category === selectedCategory;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [matters, searchQuery, selectedStatus, selectedCategory]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Value Banner: India-First Connected System */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex items-center space-x-2">
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isHi ? 'न्याय सेतु · द ब्रिज टू जस्टिस' : 'NyaySetu · The Bridge to Justice'}</span>
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Srijan Hackathon · LegalTech
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight">
            {isHi 
              ? 'एकीकृत वाद एवं केस प्रबंधन मंच' 
              : 'Unified Litigation Workflow & Case Management System'}
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            {isHi
              ? 'एक ही केस को केंद्र बनाकर ई-कोर्ट्स के आदेश, दस्तावेज, ओसीआर खोज, समय-सीमाएं और व्हाट्सएप क्लाइंट अपडेट को जोड़ता है — ताकि भारतीय वकील डाटा पुनः प्रविष्टि के बजाय कानून पर ध्यान दे सकें।'
              : 'Connecting court data, scanned documents, deadlines, and client communication into a single system of record — solving the software fragmentation that slows Indian legal practice.'}
          </p>

          <div className="flex items-center space-x-3 pt-2 flex-wrap gap-y-2">
            <button
              onClick={onOpenNewMatter}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-md transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isHi ? '+ नया केस दर्ज करें' : '+ New Legal Matter'}</span>
            </button>

            <button
              onClick={onOpenDemoWalkthrough}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isHi ? 'प्रतियोगिता वॉकथ्रू गाइड' : 'Hackathon 7-Step Guide'}</span>
            </button>

            <button
              onClick={onOpenECourtsLookup}
              className="px-4 py-2 bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center space-x-1.5 cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>{isHi ? 'ई-कोर्ट्स सीएनआर खोज' : 'Query eCourts CNR'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {isHi ? 'सक्रिय केस' : 'Active Matters'}
          </span>
          <div className="text-2xl font-bold font-serif text-slate-900 flex items-center justify-between">
            <span>{activeCount}</span>
            <Briefcase className="w-5 h-5 text-amber-600" />
          </div>
          <span className="text-[11px] text-slate-500 block">Across District & High Courts</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {isHi ? 'ई-कोर्ट्स ट्रैकिंग सक्रिय' : 'eCourts NJDG Synced'}
          </span>
          <div className="text-2xl font-bold font-serif text-emerald-700 flex items-center justify-between">
            <span>{eCourtsCount}</span>
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-[11px] text-emerald-700 font-medium block">Daily Cause List Monitored</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {isHi ? 'आगामी सुनवाई' : 'Awaiting Hearing'}
          </span>
          <div className="text-2xl font-bold font-serif text-amber-700 flex items-center justify-between">
            <span>{awaitingHearingCount}</span>
            <Gavel className="w-5 h-5 text-amber-600" />
          </div>
          <span className="text-[11px] text-slate-500 block">Next 7 Days Listed</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {isHi ? 'साक्ष्य अनुपालन' : 'BSA 2023 Compliant'}
          </span>
          <div className="text-2xl font-bold font-serif text-indigo-700 flex items-center justify-between">
            <span>100%</span>
            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
          </div>
          <span className="text-[11px] text-slate-500 block">SHA-256 Hash Verified</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isHi ? 'केस का नाम, सीएनआर, कोर्ट या पार्टी खोजें...' : 'Search cases by title, CNR number, court, or party name...'}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option value="ALL">{isHi ? 'सभी श्रेणियां (All Categories)' : 'All Categories'}</option>
              <option value="Consumer Protection">Consumer Protection</option>
              <option value="Commercial Suit">Commercial Suit</option>
              <option value="Writ Petition (Civil)">Writ Petition (Civil)</option>
              <option value="Section 138 NI Act (Cheque Bounce)">Section 138 NI Act</option>
            </select>
          </div>

        </div>

        {/* Status Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pt-1">
          {['ALL', 'Intake', 'Active', 'Awaiting Hearing', 'Reserved', 'Disposed'].map(st => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                selectedStatus === st
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'ALL' ? (isHi ? 'सभी स्थिति' : 'All Statuses') : st}
            </button>
          ))}
        </div>
      </div>

      {/* Matters Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMatters.map(m => {
          const primaryClient = m.parties.find(p => p.isPrimaryClient)?.contact || m.parties[0]?.contact;
          const oppositeParty = m.parties.find(p => p.role.includes('Respondent'))?.contact;

          return (
            <div
              key={m.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-amber-400 shadow-sm hover:shadow-md transition flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-5 space-y-3.5">
                
                {/* Card Top Meta */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                    {m.matterNumber}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    m.status === 'Awaiting Hearing'
                      ? 'bg-amber-100 text-amber-800'
                      : m.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {m.status}
                  </span>
                </div>

                {/* Case Title */}
                <div>
                  <h3
                    onClick={() => onSelectMatter(m.id)}
                    className="text-base font-bold font-serif text-slate-900 group-hover:text-amber-900 transition cursor-pointer leading-snug line-clamp-2"
                  >
                    {isHi && m.titleHi ? m.titleHi : m.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                    {m.court}
                  </p>
                </div>

                {/* Parties row */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Client:</span>
                    <span className="font-bold truncate max-w-[170px]">{primaryClient?.name}</span>
                  </div>
                  {oppositeParty && (
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Opposite:</span>
                      <span className="font-medium truncate max-w-[170px] text-slate-600">{oppositeParty.name}</span>
                    </div>
                  )}
                </div>

                {/* eCourts & Next Date Pill */}
                <div className="space-y-1.5 text-xs">
                  {m.nextHearingDate && (
                    <div className="flex items-center justify-between text-emerald-900 bg-emerald-50/70 border border-emerald-200/80 px-2.5 py-1.5 rounded-lg font-medium">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Hearing: {new Date(m.nextHearingDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-700">
                        {m.courtRecord?.causeListStatus ? 'Listed' : 'Scheduled'}
                      </span>
                    </div>
                  )}

                  {m.cnrNumber && (
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>CNR:</span>
                      <span className="text-slate-600 font-semibold">{m.cnrNumber}</span>
                    </div>
                  )}
                </div>

              </div>

              {/* Card Footer Button */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  {m.parties.length} Parties Linked
                </span>
                <button
                  onClick={() => onSelectMatter(m.id)}
                  className="px-3.5 py-1.5 bg-slate-900 group-hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                >
                  <span>{isHi ? 'केस खोलें' : 'Open Case'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
