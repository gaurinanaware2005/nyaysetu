import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Download, 
  Printer, 
  ArrowRight, 
  Languages, 
  RefreshCw,
  Copy,
  Check,
  Building
} from 'lucide-react';
import { Matter, DocumentItem, AppLanguage, TimelineEvent } from '../../types';
import { 
  ASSEMBLY_TEMPLATES, 
  AssemblyTemplate, 
  generateLegalDocumentContent 
} from '../../services/docAssemblyService';

interface CaseAssemblyTabProps {
  matter: Matter;
  lang: AppLanguage;
  onAddDocument: (doc: DocumentItem) => void;
  onAddTimelineEvent: (event: TimelineEvent) => void;
  onSwitchTab: (tab: string) => void;
}

export const CaseAssemblyTab: React.FC<CaseAssemblyTabProps> = ({
  matter,
  lang,
  onAddDocument,
  onAddTimelineEvent,
  onSwitchTab
}) => {
  const isHi = lang === 'hi';
  const [selectedTemplateId, setSelectedTemplateId] = useState('tpl-vakalatnama');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [docLanguage, setDocLanguage] = useState<AppLanguage>(lang);
  const [generatedText, setGeneratedText] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const selectedTemplate = ASSEMBLY_TEMPLATES.find(t => t.id === selectedTemplateId) || ASSEMBLY_TEMPLATES[0];

  // Auto-populate form data whenever template or matter changes
  useEffect(() => {
    const initial: Record<string, string> = {};
    selectedTemplate.fields.forEach(f => {
      initial[f.key] = f.defaultValueFromMatter ? f.defaultValueFromMatter(matter) : '';
    });
    setFormData(initial);
    setIsSaved(false);
  }, [selectedTemplateId, matter]);

  // Generate preview whenever formData or docLanguage changes
  useEffect(() => {
    const text = generateLegalDocumentContent(selectedTemplateId, formData, docLanguage);
    setGeneratedText(text);
  }, [selectedTemplateId, formData, docLanguage]);

  const handleFieldChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setIsSaved(false);
  };

  const handleSaveAndAttach = () => {
    const isHindiDoc = docLanguage === 'hi';
    const docTitle = isHindiDoc
      ? `${selectedTemplate.nameHi}.pdf`
      : `${selectedTemplate.name}.pdf`;

    const newDoc: DocumentItem = {
      id: `doc-asm-${Date.now()}`,
      matterId: matter.id,
      title: docTitle,
      titleHi: `${selectedTemplate.nameHi}.pdf`,
      type: selectedTemplateId === 'tpl-vakalatnama' ? 'Vakalatnama' : selectedTemplateId === 'tpl-legal-notice' ? 'Legal Notice' : 'Affidavit',
      fileSize: '340 KB',
      fileType: 'application/pdf',
      uploadedAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST',
      uploadedBy: 'Docassemble Engine',
      sha256Hash: 'c71f98d02e457f9208a38b4f17912bb9472e35a0928e4693a1cf59b48f93e981',
      ocrProcessed: true,
      ocrContent: generatedText,
      source: 'Document Assembly',
      tags: ['Assembled', selectedTemplate.category, docLanguage.toUpperCase()]
    };

    onAddDocument(newDoc);

    onAddTimelineEvent({
      id: `tl-${Date.now()}`,
      matterId: matter.id,
      timestamp: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST',
      title: isHi ? 'दस्तावेज़ निर्माण संपन्न एवं केस में संलग्न' : 'Document Assembled & Auto-Attached',
      titleHi: 'दस्तावेज़ निर्माण संपन्न एवं केस में संलग्न',
      description: isHi
        ? `निर्देशित प्रारूप द्वारा ${selectedTemplate.nameHi} तैयार किया गया एवं केस फाइलों में स्वतः जोड़ा गया।`
        : `Generated court-ready ${selectedTemplate.name} via guided assembly. Auto-attached to matter & indexed into DMS.`,
      actor: 'Adv. Anita Deshmukh',
      actorRole: 'Advocate',
      type: 'DOC_ASSEMBLED',
      badge: 'Assembly'
    });

    setIsSaved(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Template Selector Ribbon */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>{isHi ? 'निर्देशित विधिक दस्तावेज़ निर्माण (Docassemble Engine)' : 'Guided Legal Document Assembly (Docassemble Engine)'}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isHi ? 'केस तथ्यों से स्वतः भरा वकालतनामा, कानूनी नोटिस व शपथपत्र तैयार करें' : 'Auto-populate case facts into court filings with zero re-typing'}
            </p>
          </div>

          {/* Document Language Selector */}
          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 pl-2">
              {isHi ? 'प्रारूप भाषा:' : 'Drafting Language:'}
            </span>
            <button
              onClick={() => setDocLanguage('en')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                docLanguage === 'en' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setDocLanguage('hi')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                docLanguage === 'hi' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              हिन्दी (Devanagari)
            </button>
          </div>
        </div>

        {/* Template Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {ASSEMBLY_TEMPLATES.map(tpl => {
            const isSelected = tpl.id === selectedTemplateId;
            return (
              <div
                key={tpl.id}
                onClick={() => setSelectedTemplateId(tpl.id)}
                className={`p-3.5 rounded-xl border transition cursor-pointer text-left space-y-1 ${
                  isSelected
                    ? 'border-purple-600 bg-purple-50/60 shadow-sm ring-1 ring-purple-600'
                    : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                    {tpl.category}
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
                </div>
                <h4 className="text-xs font-bold text-slate-900 pt-1">
                  {isHi ? tpl.nameHi : tpl.name}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2">
                  {isHi ? tpl.descriptionHi : tpl.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Workspace: Form Fields (Left) vs Real-Time Legal Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Guided Q&A (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {isHi ? 'केस से स्वतः भरे गए तथ्य (Auto-Populated)' : 'Auto-Populated Matter Facts'}
            </h4>
            <button
              onClick={() => {
                const reset: Record<string, string> = {};
                selectedTemplate.fields.forEach(f => {
                  reset[f.key] = f.defaultValueFromMatter ? f.defaultValueFromMatter(matter) : '';
                });
                setFormData(reset);
              }}
              className="text-[11px] text-purple-700 hover:text-purple-800 font-semibold flex items-center space-x-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{isHi ? 'पुनः भरें' : 'Reset to Matter'}</span>
            </button>
          </div>

          <div className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
            {selectedTemplate.fields.map(field => (
              <div key={field.key} className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  {isHi ? field.labelHi : field.label}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    rows={3}
                    value={formData[field.key] || ''}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium leading-relaxed"
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={formData[field.key] || ''}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                  >
                    {field.options?.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={formData[field.key] || ''}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={handleSaveAndAttach}
              disabled={isSaved}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-md cursor-pointer ${
                isSaved
                  ? 'bg-emerald-600 text-white shadow-emerald-900/20'
                  : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-900/20'
              }`}
            >
              {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              <span>{isSaved ? (isHi ? 'केस में सुरक्षित एवं संलग्न!' : 'Saved & Attached to Matter!') : (isHi ? 'केस में सुरक्षित व संलग्न करें' : 'Save & Attach to Matter')}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Printable Legal Paper Preview (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                {isHi ? 'न्यायिक प्रारूप प्रीव्यू' : 'Court Drafting Preview'}
              </span>
              <span className="text-[10px] bg-slate-800 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-mono">
                {docLanguage.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => window.print()}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition cursor-pointer text-xs flex items-center space-x-1"
                title="Print court document"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print</span>
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedText);
                  alert(isHi ? 'प्रारूप क्लिपबोर्ड पर कॉपी हो गया!' : 'Document copied to clipboard!');
                }}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition cursor-pointer text-xs flex items-center space-x-1"
                title="Copy text"
              >
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copy</span>
              </button>
            </div>
          </div>

          {/* Visual Legal Paper Container */}
          <div className="p-6 sm:p-8 bg-amber-50/30 flex-1 overflow-y-auto max-h-[65vh]">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-amber-900/10 font-serif text-xs sm:text-sm text-slate-900 leading-relaxed whitespace-pre-wrap selection:bg-amber-200">
              {generatedText}
            </div>
          </div>

          {isSaved && (
            <div className="p-3 bg-emerald-50 border-t border-emerald-200 flex items-center justify-between text-xs text-emerald-900 font-medium">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{isHi ? 'दस्तावेज़ डीएमएस (DMS) में सुरक्षित हुआ और टाइमलाइन में दर्ज हुआ।' : 'Document attached to matter DMS and logged to case timeline.'}</span>
              </span>
              <button
                onClick={() => onSwitchTab('documents')}
                className="font-bold text-emerald-800 underline hover:text-emerald-950 cursor-pointer"
              >
                {isHi ? 'फाइलें देखें →' : 'View in Documents →'}
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
