import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  Briefcase, 
  Users, 
  FileText, 
  CheckSquare, 
  ArrowRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Matter, Contact, DocumentItem, TaskItem, AppLanguage } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  matters: Matter[];
  contacts: Contact[];
  documents: DocumentItem[];
  tasks: TaskItem[];
  lang: AppLanguage;
  onSelectMatter: (matterId: string, tab?: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  matters,
  contacts,
  documents,
  tasks,
  lang,
  onSelectMatter
}) => {
  const [query, setQuery] = useState('');
  const isHi = lang === 'hi';

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { matchedMatters: [], matchedContacts: [], matchedDocs: [], matchedTasks: [] };

    const matchedMatters = matters.filter(m => 
      m.title.toLowerCase().includes(q) ||
      m.matterNumber.toLowerCase().includes(q) ||
      (m.cnrNumber && m.cnrNumber.toLowerCase().includes(q)) ||
      m.court.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q)
    );

    const matchedContacts = contacts.filter(c => 
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q)
    );

    const matchedDocs = documents.filter(d => 
      d.title.toLowerCase().includes(q) ||
      d.tags.some(t => t.toLowerCase().includes(q)) ||
      d.ocrContent.toLowerCase().includes(q)
    ).map(d => {
      // Extract snippet around matched text in OCR
      const lower = d.ocrContent.toLowerCase();
      const idx = lower.indexOf(q);
      let snippet = '';
      if (idx !== -1) {
        const start = Math.max(0, idx - 40);
        const end = Math.min(d.ocrContent.length, idx + q.length + 60);
        snippet = (start > 0 ? '...' : '') + d.ocrContent.slice(start, end) + (end < d.ocrContent.length ? '...' : '');
      } else {
        snippet = d.ocrContent.slice(0, 90) + '...';
      }
      return { doc: d, snippet };
    });

    const matchedTasks = tasks.filter(t => 
      t.title.toLowerCase().includes(q) ||
      t.assignedTo.toLowerCase().includes(q) ||
      (t.notes && t.notes.toLowerCase().includes(q))
    );

    return { matchedMatters, matchedContacts, matchedDocs, matchedTasks };
  }, [query, matters, contacts, documents, tasks]);

  if (!isOpen) return null;

  const totalHits = 
    results.matchedMatters.length + 
    results.matchedContacts.length + 
    results.matchedDocs.length + 
    results.matchedTasks.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/70 backdrop-blur-sm p-4 pt-16 sm:pt-24 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center space-x-3 bg-slate-50">
          <Search className="w-5 h-5 text-amber-600 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isHi ? 'केस का नाम, सीएनआर, पार्टी या ओसीआर दस्तावेज़ का शब्द खोजें (जैसे: warranty, 1,45,000, Meera)...' : 'Search matters, CNR, parties, or document OCR text (e.g. warranty, 1,45,000, Meera)...'}
            className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs bg-slate-200 text-slate-700 px-2.5 py-1 rounded font-mono hover:bg-slate-300 transition cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        {!query && (
          <div className="p-5 space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {isHi ? 'सुझाए गए खोज शब्द (क्लिक करें):' : 'Suggested Live Demo Queries:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {['Meera Sharma', 'warranty', '1,45,000', 'RetailCo', 'DLHC01-084920-2024', 'defective', 'NCDRC'].map(q => (
                <button
                  key={q}
                  onClick={() => setQuery(q)}
                  className="px-3 py-1 bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200/80 rounded-lg text-xs font-medium transition cursor-pointer flex items-center space-x-1"
                >
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>{q}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 pt-2">
              {isHi ? '💡 न्याय सेतु हर दस्तावेज के पूर्ण पाठ (OCR) तथा सभी अदालती रजिस्टरों में एक साथ खोज करता है।' : '💡 Global search indexes matter metadata, contact directories, and in-document OCR full text simultaneously.'}
            </p>
          </div>
        )}

        {/* Results Display */}
        {query && (
          <div className="max-h-[60vh] overflow-y-auto divide-y divide-slate-100 p-2">
            {totalHits === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-medium">{isHi ? 'कोई परिणाम नहीं मिला' : 'No matching records found'}</p>
                <p className="text-xs text-slate-400 mt-1">{isHi ? 'कृपया अलग शब्द या सीएनआर नंबर से प्रयास करें।' : 'Try searching for "Meera", "warranty", or "RetailCo".'}</p>
              </div>
            ) : (
              <>
                {/* Matters Results */}
                {results.matchedMatters.length > 0 && (
                  <div className="py-2">
                    <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wider px-3 py-1 flex items-center space-x-1">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>{isHi ? 'केस व वाद (Matters)' : 'Cases & Matters'} ({results.matchedMatters.length})</span>
                    </p>
                    {results.matchedMatters.map(m => (
                      <div
                        key={m.id}
                        onClick={() => {
                          onSelectMatter(m.id, 'overview');
                          onClose();
                        }}
                        className="p-3 hover:bg-amber-50/70 rounded-xl cursor-pointer transition flex items-center justify-between group"
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-slate-900 group-hover:text-amber-900">
                              {m.title}
                            </span>
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                              {m.matterNumber}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {m.court} · {m.status} {m.cnrNumber ? `· CNR: ${m.cnrNumber}` : ''}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition" />
                      </div>
                    ))}
                  </div>
                )}

                {/* OCR In-Document Full Text Results */}
                {results.matchedDocs.length > 0 && (
                  <div className="py-2">
                    <p className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider px-3 py-1 flex items-center space-x-1">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{isHi ? 'ओसीआर दस्तावेज पाठ परिणाम' : 'Document OCR Full-Text Hits'} ({results.matchedDocs.length})</span>
                    </p>
                    {results.matchedDocs.map(({ doc, snippet }) => (
                      <div
                        key={doc.id}
                        onClick={() => {
                          onSelectMatter(doc.matterId, 'documents');
                          onClose();
                        }}
                        className="p-3 hover:bg-indigo-50/70 rounded-xl cursor-pointer transition group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-900 flex items-center space-x-1.5">
                            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                            <span>{doc.title}</span>
                          </span>
                          <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-mono font-medium">
                            OCR Verified
                          </span>
                        </div>
                        <div className="mt-1.5 p-2 bg-slate-100 rounded-lg text-xs font-mono text-slate-700 leading-relaxed border border-slate-200">
                          {snippet}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 flex items-center space-x-2">
                          <span>{doc.type}</span>
                          <span>·</span>
                          <span>SHA-256: {doc.sha256Hash.slice(0, 12)}...</span>
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Contacts Results */}
                {results.matchedContacts.length > 0 && (
                  <div className="py-2">
                    <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider px-3 py-1 flex items-center space-x-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>{isHi ? 'पक्षकार व संपर्क' : 'Parties & Contacts'} ({results.matchedContacts.length})</span>
                    </p>
                    {results.matchedContacts.map(c => (
                      <div
                        key={c.id}
                        onClick={() => {
                          const linkedMatter = matters.find(m => m.parties.some(p => p.contactId === c.id));
                          if (linkedMatter) onSelectMatter(linkedMatter.id, 'parties');
                          onClose();
                        }}
                        className="p-3 hover:bg-emerald-50/70 rounded-xl cursor-pointer transition flex items-center justify-between group"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-900">
                            {c.name} {c.nameHi ? `(${c.nameHi})` : ''}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {c.phone} · {c.email} · {c.city}
                          </p>
                        </div>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">
                          {c.type}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tasks Results */}
                {results.matchedTasks.length > 0 && (
                  <div className="py-2">
                    <p className="text-[11px] font-bold text-purple-700 uppercase tracking-wider px-3 py-1 flex items-center space-x-1">
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span>{isHi ? 'कार्य व कोर्ट तारीखें' : 'Tasks & Court Hearings'} ({results.matchedTasks.length})</span>
                    </p>
                    {results.matchedTasks.map(t => (
                      <div
                        key={t.id}
                        onClick={() => {
                          onSelectMatter(t.matterId, 'tasks');
                          onClose();
                        }}
                        className="p-3 hover:bg-purple-50/70 rounded-xl cursor-pointer transition flex items-center justify-between group"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900 group-hover:text-purple-900">
                            {t.title}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Due: {t.dueDate} {t.time ? `at ${t.time}` : ''} · Assigned: {t.assignedTo}
                          </p>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                          t.priority === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {t.type}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
