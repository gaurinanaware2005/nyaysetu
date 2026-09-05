import React, { useState } from 'react';
import { 
  INITIAL_MATTERS, 
  INITIAL_CONTACTS, 
  INITIAL_DOCUMENTS, 
  INITIAL_TASKS, 
  INITIAL_TIMELINE, 
  INITIAL_COMMS 
} from './data/mockData';
import { 
  Matter, 
  Contact, 
  DocumentItem, 
  TaskItem, 
  TimelineEvent, 
  CommunicationLog, 
  UserRole, 
  AppLanguage,
  CourtSyncRecord
} from './types';
import { Navbar } from './components/Navbar';
import { MattersList } from './components/MattersList';
import { MatterDetailView } from './components/MatterDetailView';
import { CalendarView } from './components/CalendarView';
import { ContactsDirectory } from './components/ContactsDirectory';
import { ClientPortalView } from './components/ClientPortalView';
import { NewMatterModal } from './components/NewMatterModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { DemoWalkthroughModal } from './components/DemoWalkthroughModal';
import { ECourtsLookupModal } from './components/ECourtsLookupModal';
import { Scale, Sparkles, Heart } from 'lucide-react';

export default function App() {
  // Global Data Repositories
  const [matters, setMatters] = useState<Matter[]>(INITIAL_MATTERS);
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [timeline, setTimeline] = useState<TimelineEvent[]>(INITIAL_TIMELINE);
  const [communications, setCommunications] = useState<CommunicationLog[]>(INITIAL_COMMS);

  // App Navigation & Context
  const [currentView, setCurrentView] = useState<'matters' | 'matter-detail' | 'calendar' | 'contacts' | 'client-portal'>('matters');
  const [selectedMatterId, setSelectedMatterId] = useState<string>('matter-1'); // Default to Meera Sharma case
  const [matterActiveTab, setMatterActiveTab] = useState<string>('overview');
  const [userRole, setUserRole] = useState<UserRole>('Advocate');
  const [lang, setLang] = useState<AppLanguage>('en');

  // Modals
  const [isNewMatterOpen, setIsNewMatterOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDemoWalkthroughOpen, setIsDemoWalkthroughOpen] = useState(false);
  const [isECourtsLookupOpen, setIsECourtsLookupOpen] = useState(false);

  // Selected Matter Object
  const currentMatter = matters.find(m => m.id === selectedMatterId) || matters[0];

  // Navigation handlers
  const handleSelectMatter = (matterId: string, tab = 'overview') => {
    setSelectedMatterId(matterId);
    setMatterActiveTab(tab);
    setCurrentView('matter-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRoleChange = (newRole: UserRole) => {
    setUserRole(newRole);
    if (newRole === 'Litigant') {
      setCurrentView('client-portal');
    } else if (currentView === 'client-portal') {
      setCurrentView('matters');
    }
  };

  // Mutators
  const handleCreateMatter = (newMatter: Matter) => {
    setMatters(prev => [newMatter, ...prev]);
    setSelectedMatterId(newMatter.id);
    setMatterActiveTab('overview');
    setCurrentView('matter-detail');
  };

  const handleUpdateMatter = (updated: Matter) => {
    setMatters(prev => prev.map(m => m.id === updated.id ? updated : m));
  };

  const handleAddContact = (contact: Contact) => {
    setContacts(prev => [contact, ...prev]);
  };

  const handleAddDocument = (doc: DocumentItem) => {
    setDocuments(prev => [doc, ...prev]);
  };

  const handleAddTask = (task: TaskItem) => {
    setTasks(prev => [task, ...prev]);
  };

  const handleToggleTaskStatus = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      const nextStatus = t.status === 'Completed' ? 'Pending' : 'Completed';
      return { ...t, status: nextStatus };
    }));
  };

  const handleAddTimelineEvent = (event: TimelineEvent) => {
    setTimeline(prev => [event, ...prev]);
  };

  const handleAddCommunication = (log: CommunicationLog) => {
    setCommunications(prev => [log, ...prev]);
  };

  const handleCreateMatterFromCNR = (record: CourtSyncRecord) => {
    const newMatter: Matter = {
      id: `m-${Date.now()}`,
      matterNumber: `NS-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: `${record.petitionerName} vs. ${record.respondentName}`,
      titleHi: `${record.petitionerName} बनाम ${record.respondentName}`,
      category: 'Commercial Suit',
      status: 'Active',
      description: `Litigation matter ingested from eCourts CNR ${record.cnrNumber} (${record.caseNumber})`,
      court: record.courtName as any,
      courtRoom: record.bench,
      caseNumber: record.caseNumber,
      cnrNumber: record.cnrNumber,
      openedDate: record.filingDate,
      nextHearingDate: record.nextHearingDate,
      leadAdvocate: 'Adv. Anita Deshmukh',
      paralegalAssigned: 'Rahul Verma',
      eCourtsTrackingActive: true,
      lastECourtsSync: new Date().toLocaleDateString('en-IN') + ' IST',
      parties: [
        {
          contactId: 'cnt-petitioner',
          contact: {
            id: 'cnt-petitioner',
            name: record.petitionerName,
            type: 'Individual',
            phone: '+91 98112 00000',
            email: 'petitioner@case.in',
            address: 'High Court Chamber Block',
            city: 'New Delhi',
            state: 'Delhi'
          },
          role: 'Petitioner / Complainant',
          isPrimaryClient: true
        },
        {
          contactId: 'cnt-respondent',
          contact: {
            id: 'cnt-respondent',
            name: record.respondentName,
            type: 'Company / Organization',
            phone: '+91 11 2338 0000',
            email: 'legal@respondent.com',
            address: 'Corporate Office Complex',
            city: 'New Delhi',
            state: 'Delhi'
          },
          role: 'Respondent / Opposite Party',
          isPrimaryClient: false
        }
      ],
      courtRecord: record
    };

    handleCreateMatter(newMatter);

    handleAddTimelineEvent({
      id: `tl-${Date.now()}`,
      matterId: newMatter.id,
      timestamp: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST',
      title: 'Matter Ingested from eCourts NJDG Query',
      titleHi: 'ई-कोर्ट्स सीएनआर से केस स्वतः दर्ज हुआ',
      description: `Ingested ${record.cnrNumber} (${record.caseNumber}). Synced parties and scheduled hearing for ${record.nextHearingDate}.`,
      actor: 'Adv. Anita Deshmukh',
      actorRole: 'Advocate',
      type: 'ECOURTS_SYNC',
      badge: 'eCourts Ingest'
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-amber-200">
      
      {/* Universal Sticky Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        userRole={userRole}
        setUserRole={handleRoleChange}
        lang={lang}
        setLang={setLang}
        onOpenNewMatter={() => setIsNewMatterOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenDemoWalkthrough={() => setIsDemoWalkthroughOpen(true)}
        onOpenECourtsLookup={() => setIsECourtsLookupOpen(true)}
      />

      {/* Main Workspace Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentView === 'matters' && (
          <MattersList
            matters={matters}
            lang={lang}
            onSelectMatter={handleSelectMatter}
            onOpenNewMatter={() => setIsNewMatterOpen(true)}
            onOpenDemoWalkthrough={() => setIsDemoWalkthroughOpen(true)}
            onOpenECourtsLookup={() => setIsECourtsLookupOpen(true)}
          />
        )}

        {currentView === 'matter-detail' && currentMatter && (
          <MatterDetailView
            matter={currentMatter}
            contacts={contacts}
            documents={documents}
            tasks={tasks}
            timeline={timeline}
            communications={communications}
            lang={lang}
            activeTab={matterActiveTab}
            setActiveTab={setMatterActiveTab}
            onBack={() => setCurrentView('matters')}
            onUpdateMatter={handleUpdateMatter}
            onAddContact={handleAddContact}
            onAddDocument={handleAddDocument}
            onAddTask={handleAddTask}
            onToggleTaskStatus={handleToggleTaskStatus}
            onAddTimelineEvent={handleAddTimelineEvent}
            onAddCommunication={handleAddCommunication}
          />
        )}

        {currentView === 'calendar' && (
          <CalendarView
            matters={matters}
            tasks={tasks}
            lang={lang}
            onSelectMatter={handleSelectMatter}
          />
        )}

        {currentView === 'contacts' && (
          <ContactsDirectory
            contacts={contacts}
            matters={matters}
            lang={lang}
            onAddContact={handleAddContact}
            onSelectMatter={handleSelectMatter}
          />
        )}

        {currentView === 'client-portal' && currentMatter && (
          <ClientPortalView
            matter={currentMatter}
            documents={documents}
            lang={lang}
            onAddDocument={handleAddDocument}
            onAddTimelineEvent={handleAddTimelineEvent}
            onSwitchToAdvocate={() => handleRoleChange('Advocate')}
          />
        )}
      </main>

      {/* Modals */}
      <NewMatterModal
        isOpen={isNewMatterOpen}
        onClose={() => setIsNewMatterOpen(false)}
        contacts={contacts}
        lang={lang}
        onCreateMatter={handleCreateMatter}
      />

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        matters={matters}
        documents={documents}
        contacts={contacts}
        lang={lang}
        onSelectMatter={handleSelectMatter}
      />

      <DemoWalkthroughModal
        isOpen={isDemoWalkthroughOpen}
        onClose={() => setIsDemoWalkthroughOpen(false)}
        lang={lang}
        onSelectMatter={handleSelectMatter}
        onSwitchRole={handleRoleChange}
      />

      <ECourtsLookupModal
        isOpen={isECourtsLookupOpen}
        onClose={() => setIsECourtsLookupOpen(false)}
        lang={lang}
        onCreateMatterFromCNR={handleCreateMatterFromCNR}
      />

      {/* Portal Footer */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 py-8 px-4 sm:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center space-x-2.5">
            <div className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Scale className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-serif font-bold text-white tracking-wide">NyaySetu (न्याय सेतु)</span>
              <span className="mx-2 text-slate-600">·</span>
              <span>India-First Connected LegalTech Case Portal</span>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-slate-400">
            <span>BSA 2023 Certified</span>
            <span>·</span>
            <span>eCourts / NJDG Interoperable</span>
            <span>·</span>
            <span>Bilingual (English / हिन्दी)</span>
          </div>

          <div className="text-right text-[11px] text-slate-500">
            Engineered for Srijan Hackathon · Built with craftsmanship
          </div>
        </div>
      </footer>

    </div>
  );
}
