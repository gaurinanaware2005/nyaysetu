import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Gavel, 
  CheckSquare, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { Matter, TaskItem, AppLanguage } from '../types';

interface CalendarViewProps {
  matters: Matter[];
  tasks: TaskItem[];
  lang: AppLanguage;
  onSelectMatter: (matterId: string, tab?: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  matters,
  tasks,
  lang,
  onSelectMatter
}) => {
  const isHi = lang === 'hi';
  const [filterType, setFilterType] = useState<string>('ALL');

  // Group all hearings and deadlines
  const events = [
    // Next hearings from matters
    ...matters.filter(m => m.nextHearingDate).map(m => ({
      id: `hearing-${m.id}`,
      matterId: m.id,
      title: `${m.title} - Hearing`,
      matterTitle: m.title,
      matterNumber: m.matterNumber,
      court: m.court,
      courtRoom: m.courtRoom,
      date: m.nextHearingDate!,
      type: 'Court Hearing',
      priority: 'High',
      causeList: m.courtRecord?.causeListStatus || 'Item Scheduled'
    })),
    // Tasks from tasks array
    ...tasks.map(t => {
      const parentMatter = matters.find(m => m.id === t.matterId);
      return {
        id: t.id,
        matterId: t.matterId,
        title: t.title,
        matterTitle: parentMatter?.title || 'Matter',
        matterNumber: parentMatter?.matterNumber || 'NS-2026',
        court: parentMatter?.court || '',
        courtRoom: parentMatter?.courtRoom || '',
        date: t.dueDate,
        type: t.type,
        priority: t.priority,
        causeList: t.time || 'All Day'
      };
    })
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const filteredEvents = events.filter(e => {
    if (filterType === 'ALL') return true;
    if (filterType === 'HEARING') return e.type === 'Court Hearing' || e.type === 'Hearing';
    if (filterType === 'FILING') return e.type === 'Filing Deadline' || e.type === 'Limitation Period';
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold font-serif text-slate-900 flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5 text-amber-600" />
            <span>{isHi ? 'कोर्ट कैलेंडर एवं डॉकेटिंग डायरी' : 'Practice Docket & Court Calendar'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isHi ? 'सभी न्यायालयों, पंचाटों एवं समय-सीमाओं की एकीकृत सूची' : 'Cross-matter hearings, cause list items, and limitation dates'}
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
          >
            <option value="ALL">{isHi ? 'सभी तारीखें' : 'All Events'}</option>
            <option value="HEARING">{isHi ? 'केवल अदालती सुनवाई' : 'Court Hearings Only'}</option>
            <option value="FILING">{isHi ? 'फाइलिंग एवं परिसीमा' : 'Filing Deadlines'}</option>
          </select>
        </div>
      </div>

      {/* Agenda Stream View */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            {isHi ? 'आगामी कार्यसूची (September 2026)' : 'Upcoming Court Docket (September 2026)'}
          </span>
          <span className="text-xs font-mono text-slate-400">
            {filteredEvents.length} Scheduled Events
          </span>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            No events scheduled for the selected filter.
          </div>
        ) : (
          filteredEvents.map(evt => (
            <div
              key={evt.id}
              onClick={() => onSelectMatter(evt.matterId, evt.type.includes('Hearing') ? 'overview' : 'tasks')}
              className="p-4 sm:p-5 hover:bg-amber-50/40 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="flex items-start space-x-4">
                {/* Date Box */}
                <div className="w-14 h-14 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center shrink-0 border border-slate-800 shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-amber-400">
                    {new Date(evt.date).toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                  <span className="text-lg font-bold font-serif leading-none">
                    {new Date(evt.date).getDate()}
                  </span>
                </div>

                {/* Event info */}
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 flex-wrap">
                    <span className="text-sm font-bold text-slate-900 group-hover:text-amber-900 transition">
                      {evt.title}
                    </span>
                    <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold border border-slate-200">
                      {evt.matterNumber}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                      evt.type.includes('Hearing')
                        ? 'bg-amber-100 text-amber-900 border border-amber-200'
                        : 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                    }`}>
                      {evt.type}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 flex items-center space-x-2 flex-wrap">
                    <span className="font-semibold text-slate-700">{evt.court}</span>
                    <span>·</span>
                    <span>{evt.courtRoom}</span>
                    <span>·</span>
                    <span className="text-emerald-700 font-semibold">{evt.causeList}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                <span className="text-xs text-slate-400 group-hover:text-amber-700 font-semibold flex items-center space-x-1">
                  <span>{isHi ? 'केस देखें' : 'View Case'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
