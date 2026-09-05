import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Scale, 
  Calendar, 
  FileText, 
  Users, 
  GitBranch, 
  MessageSquare, 
  CheckSquare, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  Gavel
} from 'lucide-react';
import { 
  Matter, 
  Contact, 
  DocumentItem, 
  TaskItem, 
  TimelineEvent, 
  CommunicationLog, 
  AppLanguage,
  CaseStatus
} from '../types';
import { CaseOverviewTab } from './tabs/CaseOverviewTab';
import { CasePartiesTab } from './tabs/CasePartiesTab';
import { CaseDocumentsTab } from './tabs/CaseDocumentsTab';
import { CaseAssemblyTab } from './tabs/CaseAssemblyTab';
import { CaseTasksTab } from './tabs/CaseTasksTab';
import { CaseCommsTab } from './tabs/CaseCommsTab';
import { CaseTimelineTab } from './tabs/CaseTimelineTab';

interface MatterDetailViewProps {
  matter: Matter;
  contacts: Contact[];
  documents: DocumentItem[];
  tasks: TaskItem[];
  timeline: TimelineEvent[];
  communications: CommunicationLog[];
  lang: AppLanguage;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onBack: () => void;
  onUpdateMatter: (updated: Matter) => void;
  onAddContact: (contact: Contact) => void;
  onAddDocument: (doc: DocumentItem) => void;
  onAddTask: (task: TaskItem) => void;
  onToggleTaskStatus: (taskId: string) => void;
  onAddTimelineEvent: (event: TimelineEvent) => void;
  onAddCommunication: (log: CommunicationLog) => void;
}

export const MatterDetailView: React.FC<MatterDetailViewProps> = ({
  matter,
  contacts,
  documents,
  tasks,
  timeline,
  communications,
  lang,
  activeTab,
  setActiveTab,
  onBack,
  onUpdateMatter,
  onAddContact,
  onAddDocument,
  onAddTask,
  onToggleTaskStatus,
  onAddTimelineEvent,
  onAddCommunication
}) => {
  const isHi = lang === 'hi';

  const TABS = [
    { id: 'overview', label: isHi ? 'सिंहावलोकन व ई-कोर्ट्स' : 'Overview & eCourts', icon: Gavel },
    { id: 'parties', label: isHi ? 'पक्षकार व संपर्क' : 'Parties & Counsel', icon: Users, count: matter.parties.length },
    { id: 'documents', label: isHi ? 'दस्तावेज व ओसीआर' : 'Documents & OCR', icon: FileText, count: documents.filter(d => d.matterId === matter.id).length },
    { id: 'assembly', label: isHi ? 'दस्तावेज निर्माण' : 'Doc Assembly', icon: Sparkles },
    { id: 'tasks', label: isHi ? 'कार्य व तारीखें' : 'Tasks & Deadlines', icon: CheckSquare, count: tasks.filter(t => t.matterId === matter.id && t.status === 'Pending').length },
    { id: 'comms', label: isHi ? 'व्हाट्सएप व संवाद' : 'WhatsApp & Comms', icon: MessageSquare, count: communications.filter(c => c.matterId === matter.id).length },
    { id: 'timeline', label: isHi ? 'केस टाइमलाइन' : 'Case Timeline', icon: GitBranch, count: timeline.filter(t => t.matterId === matter.id).length },
  ];

  const handleStatusChange = (newStatus: CaseStatus) => {
    const updated = { ...matter, status: newStatus };
    onUpdateMatter(updated);
    onAddTimelineEvent({
      id: `tl-${Date.now()}`,
      matterId: matter.id,
      timestamp: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST',
      title: isHi ? `केस की स्थिति बदली: ${newStatus}` : `Matter Status Changed: ${newStatus}`,
      titleHi: `केस की स्थिति बदली: ${newStatus}`,
      description: isHi ? `स्थिति को '${newStatus}' में परिवर्तित किया गया।` : `Transitioned matter lifecycle status to ${newStatus}.`,
      actor: 'Adv. Anita Deshmukh',
      actorRole: 'Advocate',
      type: 'STATUS_CHANGE',
      badge: newStatus
    });
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Breadcrumbs & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
          <button
            onClick={onBack}
            className="hover:text-amber-700 flex items-center space-x-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isHi ? 'सभी केस सूची' : 'Matters Directory'}</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-900 font-bold truncate max-w-xs sm:max-w-md">
            {matter.title}
          </span>
        </div>

        {/* Case Status Dropdown Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-500">{isHi ? 'केस स्थिति:' : 'Status:'}</span>
          <select
            value={matter.status}
            onChange={(e) => handleStatusChange(e.target.value as CaseStatus)}
            className="bg-white border border-slate-300 text-xs font-bold rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-amber-500 cursor-pointer shadow-xs"
          >
            <option value="Intake">Intake (प्रवेश)</option>
            <option value="Active">Active (सक्रिय)</option>
            <option value="Awaiting Hearing">Awaiting Hearing (सुनवाई प्रतीक्षित)</option>
            <option value="Reserved">Reserved for Judgment (निर्णय हेतु सुरक्षित)</option>
            <option value="Disposed">Disposed / Closed (निस्तारित)</option>
          </select>
        </div>
      </div>

      {/* Main Matter Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2.5 flex-wrap">
              <span className="text-xs bg-amber-500/15 text-amber-900 border border-amber-500/30 px-2.5 py-0.5 rounded-md font-mono font-bold">
                {matter.matterNumber}
              </span>
              {matter.cnrNumber && (
                <span className="text-xs bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-md font-mono font-semibold">
                  CNR: {matter.cnrNumber}
                </span>
              )}
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-semibold">
                {matter.category}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 leading-snug">
              {isHi && matter.titleHi ? matter.titleHi : matter.title}
            </h2>

            <p className="text-xs text-slate-500 flex items-center space-x-2 flex-wrap">
              <span className="font-semibold text-slate-700">{matter.court}</span>
              <span>·</span>
              <span>{matter.courtRoom || 'Main Bench'}</span>
              <span>·</span>
              <span>Lead: {matter.leadAdvocate}</span>
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center space-x-2 flex-wrap shrink-0">
            <button
              onClick={() => setActiveTab('assembly')}
              className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>{isHi ? 'वकालतनामा तैयार करें' : 'Assemble Vakalatnama'}</span>
            </button>
            <button
              onClick={() => setActiveTab('comms')}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-200" />
              <span>{isHi ? 'व्हाट्सएप भेजें' : 'WhatsApp Client'}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <div className="pt-2 border-t border-slate-100 flex items-center space-x-1 overflow-x-auto no-scrollbar">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Body View */}
      <div>
        {activeTab === 'overview' && (
          <CaseOverviewTab
            matter={matter}
            lang={lang}
            onUpdateMatter={onUpdateMatter}
            onAddTimelineEvent={onAddTimelineEvent}
            onSwitchTab={setActiveTab}
          />
        )}
        {activeTab === 'parties' && (
          <CasePartiesTab
            matter={matter}
            contacts={contacts}
            lang={lang}
            onUpdateMatter={onUpdateMatter}
            onAddContact={onAddContact}
            onAddTimelineEvent={onAddTimelineEvent}
          />
        )}
        {activeTab === 'documents' && (
          <CaseDocumentsTab
            matter={matter}
            documents={documents}
            lang={lang}
            onAddDocument={onAddDocument}
            onAddTimelineEvent={onAddTimelineEvent}
          />
        )}
        {activeTab === 'assembly' && (
          <CaseAssemblyTab
            matter={matter}
            lang={lang}
            onAddDocument={onAddDocument}
            onAddTimelineEvent={onAddTimelineEvent}
            onSwitchTab={setActiveTab}
          />
        )}
        {activeTab === 'tasks' && (
          <CaseTasksTab
            matter={matter}
            tasks={tasks}
            lang={lang}
            onAddTask={onAddTask}
            onToggleTaskStatus={onToggleTaskStatus}
            onAddTimelineEvent={onAddTimelineEvent}
          />
        )}
        {activeTab === 'comms' && (
          <CaseCommsTab
            matter={matter}
            communications={communications}
            lang={lang}
            onAddCommunication={onAddCommunication}
            onAddTimelineEvent={onAddTimelineEvent}
          />
        )}
        {activeTab === 'timeline' && (
          <CaseTimelineTab
            matter={matter}
            timeline={timeline}
            lang={lang}
          />
        )}
      </div>

    </div>
  );
};
