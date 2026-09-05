import React, { useState, useMemo } from 'react';
import { 
  GitBranch, 
  Calendar, 
  FileText, 
  MessageSquare, 
  CheckSquare, 
  RefreshCw, 
  UserCheck, 
  Sparkles, 
  Download, 
  Filter,
  ShieldCheck
} from 'lucide-react';
import { Matter, TimelineEvent, AppLanguage } from '../../types';

interface CaseTimelineTabProps {
  matter: Matter;
  timeline: TimelineEvent[];
  lang: AppLanguage;
}

export const CaseTimelineTab: React.FC<CaseTimelineTabProps> = ({
  matter,
  timeline,
  lang
}) => {
  const isHi = lang === 'hi';
  const [filterType, setFilterType] = useState<string>('ALL');

  const matterEvents = useMemo(() => {
    return timeline.filter(e => e.matterId === matter.id);
  }, [timeline, matter.id]);

  const filteredEvents = useMemo(() => {
    if (filterType === 'ALL') return matterEvents;
    return matterEvents.filter(e => e.type === filterType);
  }, [matterEvents, filterType]);

  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'ECOURTS_SYNC':
        return <RefreshCw className="w-4 h-4 text-emerald-600" />;
      case 'DOC_UPLOAD':
      case 'DOC_ASSEMBLED':
        return <FileText className="w-4 h-4 text-purple-600" />;
      case 'WHATSAPP_SENT':
        return <MessageSquare className="w-4 h-4 text-emerald-600" />;
      case 'TASK_DUE':
        return <CheckSquare className="w-4 h-4 text-amber-600" />;
      default:
        return <GitBranch className="w-4 h-4 text-blue-600" />;
    }
  };

  const getEventBadgeColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'ECOURTS_SYNC':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'DOC_ASSEMBLED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'DOC_UPLOAD':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'WHATSAPP_SENT':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'TASK_DUE':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Filter Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-2">
            <GitBranch className="w-4 h-4 text-amber-600" />
            <span>{isHi ? 'एकीकृत कालानुक्रमिक केस टाइमलाइन' : 'Unified Chronological Case Timeline'}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {isHi ? 'प्रवेश से लेकर अंतिम आदेश तक सभी घटनाओं का संपूर्ण ऑडिट ट्रेल' : 'The complete audit trail: Every court sync, document, task, and message in sequence'}
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center space-x-1.5 flex-wrap">
          {[
            { id: 'ALL', label: isHi ? 'सभी' : 'All' },
            { id: 'ECOURTS_SYNC', label: 'eCourts' },
            { id: 'DOC_UPLOAD', label: isHi ? 'दस्तावेज' : 'Docs' },
            { id: 'WHATSAPP_SENT', label: 'WhatsApp' },
            { id: 'TASK_DUE', label: isHi ? 'तारीखें' : 'Deadlines' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                filterType === f.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative">
        {/* Continuous vertical line */}
        <div className="absolute left-9 top-8 bottom-8 w-0.5 bg-slate-200"></div>

        <div className="space-y-6">
          {filteredEvents.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm pl-12">
              No timeline events found for this filter.
            </div>
          ) : (
            filteredEvents.map((evt, idx) => (
              <div key={evt.id || idx} className="relative flex items-start space-x-4 group">
                
                {/* Timeline Icon Node */}
                <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-300 group-hover:border-amber-500 flex items-center justify-center shadow-xs shrink-0 z-10 transition">
                  {getEventIcon(evt.type)}
                </div>

                {/* Event Card Content */}
                <div className="flex-1 bg-slate-50 hover:bg-amber-50/30 p-4 rounded-xl border border-slate-200 transition space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <h4 className="text-xs font-bold text-slate-900">
                        {isHi && evt.titleHi ? evt.titleHi : evt.title}
                      </h4>
                      {evt.badge && (
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${getEventBadgeColor(evt.type)}`}>
                          {evt.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      {evt.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    {isHi && evt.descriptionHi ? evt.descriptionHi : evt.description}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px] text-slate-400">
                    <div className="flex items-center space-x-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      <span>Actor: <strong className="text-slate-700">{evt.actor}</strong> ({evt.actorRole})</span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400">
                      Ref: {evt.type}
                    </span>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
