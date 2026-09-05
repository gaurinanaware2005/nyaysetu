import React from 'react';
import { 
  Scale, 
  Search, 
  Globe2, 
  UserCheck, 
  Sparkles, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { AppLanguage, UserRole } from '../types';

interface NavbarProps {
  currentView: 'matters' | 'matter-detail' | 'calendar' | 'contacts' | 'client-portal';
  setCurrentView: (view: 'matters' | 'matter-detail' | 'calendar' | 'contacts' | 'client-portal') => void;
  lang: AppLanguage;
  setLang: (lang: AppLanguage) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  onOpenSearch: () => void;
  onOpenDemoWalkthrough: () => void;
  onOpenNewMatter: () => void;
  onOpenECourtsLookup: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  lang,
  setLang,
  userRole,
  setUserRole,
  onOpenSearch,
  onOpenDemoWalkthrough,
  onOpenNewMatter,
  onOpenECourtsLookup,
}) => {
  const isHi = lang === 'hi';

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
      {/* Top micro banner for Hackathon identification */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 text-amber-100 text-xs px-4 py-1 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="bg-amber-950/60 font-semibold px-2 py-0.5 rounded text-[11px] uppercase tracking-wider text-amber-200">
            Srijan Hackathon
          </span>
          <span className="hidden sm:inline">LegalTech Domain · India-First Litigation Workflow & Case Management Platform</span>
          <span className="sm:hidden font-medium">NyaySetu (न्याय सेतु)</span>
        </div>
        <button
          onClick={onOpenDemoWalkthrough}
          className="flex items-center space-x-1 font-semibold text-white bg-amber-900/60 hover:bg-amber-950 px-2.5 py-0.5 rounded border border-amber-400/40 transition text-xs shadow-sm cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>{isHi ? 'प्रतियोगिता डेमो गाइड' : 'Hackathon Demo Walkthrough'}</span>
        </button>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentView('matters')}>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-900/30 border border-amber-400/30">
              <Scale className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-white font-serif">
                  NyaySetu
                </span>
                <span className="text-sm font-medium px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-serif">
                  न्याय सेतु
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-normal">
                {isHi ? 'एकीकृत भारतीय वाद एवं केस प्रबंधन मंच' : 'Unified Litigation Workflow & Case System'}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          {userRole !== 'CLIENT' && (
            <nav className="hidden md:flex items-center space-x-1">
              <button
                id="nav-matters-btn"
                onClick={() => setCurrentView('matters')}
                className={`px-3.5 py-2 rounded-md text-sm font-medium transition cursor-pointer ${
                  currentView === 'matters' || currentView === 'matter-detail'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {isHi ? 'केस व वाद (Matters)' : 'Cases & Matters'}
              </button>
              <button
                id="nav-calendar-btn"
                onClick={() => setCurrentView('calendar')}
                className={`px-3.5 py-2 rounded-md text-sm font-medium transition cursor-pointer ${
                  currentView === 'calendar'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {isHi ? 'कोर्ट कैलेंडर व तारीखें' : 'Court Calendar'}
              </button>
              <button
                id="nav-contacts-btn"
                onClick={() => setCurrentView('contacts')}
                className={`px-3.5 py-2 rounded-md text-sm font-medium transition cursor-pointer ${
                  currentView === 'contacts'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {isHi ? 'पक्षकार व संपर्क' : 'Parties & Directory'}
              </button>
              <button
                id="nav-ecourts-btn"
                onClick={onOpenECourtsLookup}
                className="px-3.5 py-2 rounded-md text-sm font-medium text-emerald-300 hover:bg-emerald-950/50 border border-emerald-500/30 flex items-center space-x-1.5 transition cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>eCourts CNR Live</span>
              </button>
            </nav>
          )}

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            
            {/* Global Search Button */}
            <button
              id="global-search-btn"
              onClick={onOpenSearch}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700/80 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 text-xs sm:text-sm transition cursor-pointer"
              title="Search across all matters, parties, and OCR documents"
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span className="hidden lg:inline">{isHi ? 'केस, दस्तावेज व OCR खोजें...' : 'Search matters, docs, OCR...'}</span>
              <kbd className="hidden sm:inline bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded text-[10px] border border-slate-700 font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded text-xs font-medium transition cursor-pointer ${
                  lang === 'en'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Switch to English"
              >
                EN
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`px-2 py-1 rounded text-xs font-medium transition cursor-pointer ${
                  lang === 'hi'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="हिंदी में बदलें"
              >
                हिन्दी
              </button>
            </div>

            {/* Role Switcher (Advocate / Paralegal / Client) */}
            <div className="flex items-center space-x-2 border-l border-slate-800 pl-3">
              <div className="relative group">
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as UserRole)}
                  className="bg-slate-800 text-slate-200 text-xs rounded-lg border border-slate-700 px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer font-medium appearance-none pr-7"
                >
                  <option value="ADVOCATE">Adv. Anita Deshmukh (Lead Litigator)</option>
                  <option value="PARALEGAL">Rahul Verma (Paralegal / Associate)</option>
                  <option value="CLIENT">Meera Sharma (Client Portal View)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-slate-400">
                  <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
