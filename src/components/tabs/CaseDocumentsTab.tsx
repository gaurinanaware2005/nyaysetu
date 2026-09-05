import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  UploadCloud, 
  Search, 
  ShieldCheck, 
  Eye, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  FileCheck, 
  X, 
  Copy, 
  Check, 
  Lock,
  Tag
} from 'lucide-react';
import { Matter, DocumentItem, AppLanguage, TimelineEvent } from '../../types';

interface CaseDocumentsTabProps {
  matter: Matter;
  documents: DocumentItem[];
  lang: AppLanguage;
  onAddDocument: (doc: DocumentItem) => void;
  onAddTimelineEvent: (event: TimelineEvent) => void;
}

export const CaseDocumentsTab: React.FC<CaseDocumentsTabProps> = ({
  matter,
  documents,
  lang,
  onAddDocument,
  onAddTimelineEvent
}) => {
  const isHi = lang === 'hi';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  // Filter documents belonging to this matter
  const matterDocs = useMemo(() => {
    return documents.filter(d => d.matterId === matter.id);
  }, [documents, matter.id]);

  // Filtered docs based on in-case search query
  const filteredDocs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return matterDocs;
    return matterDocs.filter(d => 
      d.title.toLowerCase().includes(q) ||
      d.type.toLowerCase().includes(q) ||
      d.tags.some(t => t.toLowerCase().includes(q)) ||
      d.ocrContent.toLowerCase().includes(q)
    );
  }, [matterDocs, searchQuery]);

  // Quick helper to highlight matched text
  const renderHighlightedSnippet = (text: string, query: string) => {
    if (!query) return text.slice(0, 160) + '...';
    const lower = text.toLowerCase();
    const qLower = query.toLowerCase();
    const idx = lower.indexOf(qLower);
    if (idx === -1) return text.slice(0, 160) + '...';

    const start = Math.max(0, idx - 40);
    const end = Math.min(text.length, idx + query.length + 80);
    const snippet = text.slice(start, end);

    const parts = snippet.split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
        {start > 0 && '... '}
        {parts.map((part, i) => 
          part.toLowerCase() === qLower ? (
            <mark key={i} className="bg-amber-300 text-amber-950 font-bold px-1 rounded">
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
        {end < text.length && ' ...'}
      </span>
    );
  };

  const handleSimulatedUpload = (fileType: string) => {
    setIsUploading(true);
    setTimeout(() => {
      const newDoc: DocumentItem = {
        id: `doc-${Date.now()}`,
        matterId: matter.id,
        title: `Service Center Inspection Job Sheet #SRV-90124.pdf`,
        type: 'Evidence / Invoice',
        fileSize: '620 KB',
        fileType: 'application/pdf',
        uploadedAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST',
        uploadedBy: 'Adv. Anita Deshmukh',
        sha256Hash: '4a6e84d2b271d5b3648a7b9e6912384fa71e89bca02179b014cd78a5e0192ef4',
        ocrProcessed: true,
        ocrContent: `RETAILCO SERVICE CARE CENTER (SOUTH DELHI WORKSHOP)
SERVICE TICKET NUMBER: #SRV-90124 | DATE: 04-01-2024
Customer: Ms. Meera Sharma | Appliance: 85-inch OLED Display TV (RC-85OLED-X)
TECHNICIAN OBSERVATIONS & BENCH INSPECTION:
1. Internal panel circuit failure verified on oscilloscope. Vertical black banding caused by defective T-Con ribbon cable and driver gate failure.
2. No signs of external water ingress or accidental physical drops. Factory panel defect present within warranty term.
3. Replacement recommended under Section 2(11) of Consumer Protection Act 2019. Customer escalation logged.`,
        source: 'Upload',
        tags: ['Inspection Sheet', 'Technician Report', 'Panel Defect']
      };

      onAddDocument(newDoc);
      onAddTimelineEvent({
        id: `tl-${Date.now()}`,
        matterId: matter.id,
        timestamp: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST',
        title: isHi ? 'नया साक्ष्य दस्तावेज़ अपलोड और ओसीआर संपन्न' : 'Evidence Uploaded & OCR Indexed',
        titleHi: 'नया साक्ष्य दस्तावेज़ अपलोड और ओसीआर संपन्न',
        description: isHi 
          ? `सर्विस सेंटर इंस्पेक्शन रिपोर्ट #SRV-90124 अपलोड की गई। भारतीय साक्ष्य अधिनियम (BSA 2023) हेतु SHA-256 हैश सुरक्षित।`
          : `Service Inspection Job Sheet uploaded and auto-OCRed with full-text search indexing & BSA 2023 SHA-256 integrity hash.`,
        actor: 'Adv. Anita Deshmukh',
        actorRole: 'Advocate',
        type: 'DOC_UPLOAD',
        badge: 'OCR Complete'
      });

      setIsUploading(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      
      {/* Upload Zone & In-Case Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Search inside Case Docs */}
        <div className="md:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
              <Search className="w-4 h-4 text-amber-600" />
              <span>{isHi ? 'केस फाइलों के अंदर पूर्ण-पाठ खोज (OCR Search)' : 'In-Case Document OCR Full-Text Search'}</span>
            </h4>
            <span className="text-[11px] font-mono text-slate-400">
              {filteredDocs.length} {isHi ? 'दस्तावेज' : 'Files'}
            </span>
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isHi ? 'दस्तावेज के अंदर का कोई भी शब्द खोजें (उदा. warranty, defective, 1,45,000, CPA)...' : 'Search any word inside scanned text (e.g. warranty, defective, 1,45,000, CPA)...'}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-3 pr-8 py-2.5 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filter Queries */}
          <div className="flex items-center space-x-2 flex-wrap text-xs pt-1">
            <span className="text-[11px] font-semibold text-slate-500">{isHi ? 'क्लिक करें:' : 'Try:'}</span>
            {['warranty', 'defective', '1,45,000', 'Bhasin', 'OLED'].map(q => (
              <button
                key={q}
                onClick={() => setSearchQuery(q)}
                className="px-2 py-0.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded text-[11px] font-medium transition cursor-pointer"
              >
                "{q}"
              </button>
            ))}
          </div>
        </div>

        {/* Drag-and-drop simulated upload button */}
        <div className="bg-slate-50 rounded-2xl p-5 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-center space-y-2.5 hover:border-amber-500 transition">
          <UploadCloud className="w-7 h-7 text-amber-600" />
          <div>
            <p className="text-xs font-bold text-slate-800">
              {isHi ? 'नया कानूनी दस्तावेज़ जोड़ें' : 'Upload Legal Document'}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {isHi ? 'स्वतः ओसीआर व साक्ष्य सत्यापन' : 'Auto-OCR & BSA 2023 Hash'}
            </p>
          </div>
          <button
            onClick={() => handleSimulatedUpload('pdf')}
            disabled={isUploading}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition cursor-pointer disabled:opacity-50 flex items-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{isUploading ? (isHi ? 'ओसीआर हो रहा है...' : 'Running OCR...') : (isHi ? 'अपलोड सिमुलेट करें' : '+ Upload Evidence PDF')}</span>
          </button>
        </div>

      </div>

      {/* Document List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-amber-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {isHi ? 'संबद्ध वाद दस्तावेज एवं इलेक्ट्रॉनिक साक्ष्य' : 'Attached Case Files & Electronic Evidence'}
            </h4>
          </div>
          <div className="flex items-center space-x-2 text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Bharatiya Sakshya Adhiniyam (BSA 2023) Verified</span>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredDocs.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p>{isHi ? 'कोई दस्तावेज़ नहीं मिला' : 'No documents match the search criteria'}</p>
            </div>
          ) : (
            filteredDocs.map((doc) => (
              <div key={doc.id} className="p-4 sm:p-5 hover:bg-slate-50/70 transition space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 border border-amber-200">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-900 hover:text-amber-800 transition cursor-pointer" onClick={() => setSelectedDoc(doc)}>
                          {doc.title}
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold border border-slate-200">
                          {doc.type}
                        </span>
                        {doc.ocrProcessed && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-semibold border border-emerald-200 flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>OCR Extracted</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 flex items-center space-x-2">
                        <span>{doc.fileSize}</span>
                        <span>·</span>
                        <span>Uploaded by {doc.uploadedBy} on {doc.uploadedAt}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => setSelectedDoc(doc)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center space-x-1 border border-slate-200"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isHi ? 'देखें व ओसीआर' : 'Inspect OCR'}</span>
                    </button>
                  </div>
                </div>

                {/* OCR In-Text Preview with Match Highlighting */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-700 leading-relaxed">
                  <div className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
                    <span>{isHi ? 'ओसीआर पाठ स्निपेट:' : 'OCR Text Snippet:'}</span>
                    {searchQuery && (
                      <span className="text-amber-700 font-semibold lowercase">
                        {isHi ? 'खोज हाइलाइट' : 'highlighted match'}
                      </span>
                    )}
                  </div>
                  <p>{renderHighlightedSnippet(doc.ocrContent, searchQuery)}</p>
                </div>

                {/* Chain of Custody / BSA 2023 SHA-256 Hash */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-400 font-mono pt-1">
                  <div className="flex items-center space-x-1.5 truncate">
                    <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>SHA-256:</span>
                    <span className="text-slate-600 font-semibold truncate">{doc.sha256Hash}</span>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0 font-sans">
                    {doc.tags.map((tag, i) => (
                      <span key={i} className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      </div>

      {/* Document Inspector Modal with Full OCR Viewer */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden my-6">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-amber-600 flex items-center justify-center text-slate-950">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif text-amber-400 truncate max-w-md">
                    {selectedDoc.title}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedDoc.type} · {selectedDoc.fileSize} · {selectedDoc.uploadedAt}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              
              {/* Evidence Certificate Box */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-emerald-900 font-semibold">
                    Electronic Evidence Integrity (Bharatiya Sakshya Adhiniyam, 2023)
                  </span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedDoc.sha256Hash);
                    setCopiedHash(true);
                    setTimeout(() => setCopiedHash(false), 2000);
                  }}
                  className="px-2 py-1 bg-white border border-emerald-300 rounded text-[11px] font-mono font-bold text-emerald-800 hover:bg-emerald-100 transition cursor-pointer flex items-center space-x-1"
                >
                  {copiedHash ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedHash ? 'Hash Copied' : 'Copy Hash'}</span>
                </button>
              </div>

              {/* In-Modal Search Query */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type keyword to highlight across full document text..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-3 pr-8 py-2 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Full OCR Content Pre */}
              <div className="bg-slate-900 text-slate-100 p-5 rounded-xl font-mono text-xs leading-relaxed border border-slate-800 whitespace-pre-wrap selection:bg-amber-400 selection:text-slate-950">
                {searchQuery ? (
                  renderHighlightedSnippet(selectedDoc.ocrContent, searchQuery)
                ) : (
                  selectedDoc.ocrContent
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-500">
                SHA-256: {selectedDoc.sha256Hash}
              </span>
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition cursor-pointer"
              >
                Close Inspector
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
