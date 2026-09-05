import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Search, 
  FileText, 
  Calendar, 
  MessageSquare, 
  GitBranch, 
  Languages, 
  ArrowLeft,
  Scale,
  Award
} from 'lucide-react';
import { AppLanguage } from '../types';

interface DemoWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: AppLanguage;
  onSelectStepAction: (stepNumber: number) => void;
}

export const DemoWalkthroughModal: React.FC<DemoWalkthroughModalProps> = ({
  isOpen,
  onClose,
  lang,
  onSelectStepAction,
}) => {
  const [activeStep, setActiveStep] = useState(1);
  const isHi = lang === 'hi';

  if (!isOpen) return null;

  const STEPS = [
    {
      step: 1,
      title: isHi ? '1. मुख्य समस्या: विखंडन बनाम एकीकृत सेतु' : '1. The Core Problem: Fragmentation vs Unified Bridge',
      subtitle: isHi ? '5-8 अलग-अलग टूल्स और बार-बार डाटा एंट्री' : '5-8 Disconnected Tools & Constant Double-Entry',
      icon: Layers,
      color: 'from-rose-500 to-amber-600',
      description: isHi
        ? 'एक सामान्य भारतीय अधिवक्ता (जैसे एड. अनीता) का कार्य एक्सेल (केस लिस्ट), आउटलुक (तारीखें), व्हाट्सएप (क्लाइंट चैट), वर्ड (ड्राफ्टिंग), ड्राइव (दस्तावेज़) और ई-कोर्ट्स (केस स्टेटस) के बीच बंटा रहता है। एक ही मुवक्किल का नाम 5 बार टाइप करना पड़ता है। न्याय सेतु केस को केंद्र बनाकर इन सभी विखंडित कड़ियों को एक सूत्र में जोड़ता है।'
        : 'Litigators juggle 5-8 separate applications: Excel spreadsheets for case lists, Google/Outlook Calendar for hearings, WhatsApp for client chatter, Word for drafts, Google Drive for PDFs, and the government eCourts portal for hearing dates. The same client name is typed five times. NyaySetu turns the legal matter into the single system of record.',
      highlights: [
        isHi ? 'कोई सूचना अलग नहीं रहती' : 'Eliminates redundant double-entry across tools',
        isHi ? '50 मिलियन से अधिक लंबित मुकदमों के लिए उपयुक्त' : 'Engineered for India\'s 50M+ pending litigation backlog',
        isHi ? 'भारतीय संदर्भ: ई-कोर्ट्स, हिंदी, व्हाट्सएप और बी.एस.ए. साक्ष्य अनुपालन' : 'Native eCourts sync, bilingual vernacular UI, and WhatsApp dispatch'
      ],
      actionLabel: isHi ? 'केस डैशबोर्ड पर जाएं' : 'View Case Dashboard',
      actionCode: 1
    },
    {
      step: 2,
      title: isHi ? '2. केस को सिस्टम ऑफ रिकॉर्ड बनाना' : '2. The Matter as the Single System of Record',
      subtitle: isHi ? 'मीरा शर्मा बनाम रिटेलको (उपभोक्ता संरक्षण अधिनियम 2019)' : 'Featured Matter: "Meera v. RetailCo" (Consumer Protection)',
      icon: Scale,
      color: 'from-amber-500 to-amber-700',
      description: isHi
        ? 'प्रतियोगिता का केंद्र मामला "मीरा शर्मा बनाम रिटेलको इलेक्ट्रॉनिक्स" (वाद संख्या CC/412/2026, एनसीडीआरसी) है। एक ही स्क्रीन पर सभी पक्षकार, सीएनआर (CNR) नंबर, कोर्ट रूम, दावे की राशि ₹1,85,000, आगामी सुनवाई और सभी संबंद्ध फाइलें एक साथ सुव्यवस्थित रूप से प्रदर्शित होती हैं।'
        : 'Explore our reference case: "Meera Sharma v. RetailCo Electronics Pvt Ltd" (CC/412/2026, NCDRC). In a single screen, every party, CNR identifier, bench coram, claim value (₹1,85,000), upcoming hearing, and related artifact lives in complete synchronization.',
      highlights: [
        isHi ? 'एक बार संपर्क दर्ज करें, पुनः उपयोग करें' : 'Contact deduplication and cross-matter party reuse',
        isHi ? 'सीएनआर डीएलएचसी01-084920-2024 लिंक' : 'Authoritative CNR linkage (DLHC01-084920-2024)',
        isHi ? 'सभी 7 मॉड्यूल एक ही टैब इंटरफेस में' : 'Unified tabbed interface aggregating all 7 lifecycle modules'
      ],
      actionLabel: isHi ? 'मीरा v. रिटेलको केस खोलें' : 'Open Meera v. RetailCo Case',
      actionCode: 2
    },
    {
      step: 3,
      title: isHi ? '3. दस्तावेज अपलोड और इन-डॉक्यूमेंट ओसीआर सर्च' : '3. Document OCR & In-Document Full-Text Search',
      subtitle: isHi ? 'स्कैन किए गए नोटिस में तुरंत कीवर्ड हाइलाइट' : 'Find Keywords Inside Scanned Legal PDFs Instantly',
      icon: FileText,
      color: 'from-blue-500 to-indigo-600',
      description: isHi
        ? 'मौजूदा लीगलटेक टूल्स (जैसे Clio/MyCase) की सबसे बड़ी कमजोरी कमजोर दस्तावेज प्रबंधन है। न्याय सेतु में अपलोड किया गया कोई भी स्कैन पीडीएफ (जैसे लीगल नोटिस या टैक्स इनवॉइस) स्वतः ओसीआर (OCR) होता है और भारतीय साक्ष्य अधिनियम (BSA 2023) के अनुरूप SHA-256 हैश के साथ पूर्ण-पाठ खोज योग्य बन जाता है।'
        : 'Practitioners cite weak document search as the #1 reason they leave practice management suites. NyaySetu automatically extracts, OCRs, and indexes uploaded scans. Try searching "warranty", "defective", or "1,45,000" to see direct in-text keyword highlighting and BSA 2023 SHA-256 cryptographic verification.',
      highlights: [
        isHi ? 'दस्तावेज़ के अंदर सीधे कीवर्ड हाइलाइट' : 'In-document search highlights matches directly in text',
        isHi ? 'भारतीय साक्ष्य अधिनियम (BSA 2023) अनुपालन हैश' : 'Chain-of-custody SHA-256 integrity hash for electronic evidence',
        isHi ? 'ग्लोबल सर्च से किसी भी दस्तावेज तक पहुंच' : 'Global search finds text across all matters in <200ms'
      ],
      actionLabel: isHi ? 'दस्तावेज और ओसीआर सर्च देखें' : 'Test OCR & Document Search',
      actionCode: 3
    },
    {
      step: 4,
      title: isHi ? '4. ई-कोर्ट्स (eCourts) लाइव सिंक व पुष्टि' : '4. eCourts Live Sync: The Signature Glue Feature',
      subtitle: isHi ? 'सीएनआर दर्ज करें, तारीख स्वतः कैलेंडर व टाइमलाइन में' : 'One-Click Official Court Docket Pull & Calendar Push',
      icon: Calendar,
      color: 'from-emerald-500 to-teal-700',
      description: isHi
        ? 'भारतीय वकीलों को हर शाम ई-कोर्ट्स वेबसाइट पर अलग से लॉगिन करके तारीखें खोजनी पड़ती हैं और फिर मैन्युअल रूप से कैलेंडर में टाइप करनी होती हैं। न्याय सेतु में केवल "Fetch Court Status" बटन दबाएं; सिस्टम राष्ट्रीय न्यायिक डेटा ग्रिड (NJDG) से अगली तारीख (10 सितंबर 2026), बेंच और डेली ऑर्डर प्राप्त कर वकील की एक पुष्टि पर केस कैलेंडर में स्थानांतरित कर देता है।'
        : 'Foreign suites do not know eCourts exists. Indian lawyers spend hours daily copy-pasting dates from ecourts.gov.in into diaries. In NyaySetu, clicking "Fetch Latest eCourts Status" queries the National Judicial Data Grid by CNR, extracts the hearing date (10 Sept 2026), bench, and daily order, and allows one-click confirmation to push it into the firm docket.',
      highlights: [
        isHi ? 'एनजेडीजी (NJDG) से लाइव केस स्थिति व कॉज़ लिस्ट' : 'Live NJDG query returning Daily Cause List Item #24',
        isHi ? 'मानवीय पुष्टि के बाद ही कैलेंडर में दर्ज' : 'Human-in-the-loop confirmation before date becomes authoritative',
        isHi ? 'दैनिक आदेश सारांश और अग्रिम तारीख स्वतः प्राप्त' : 'Pushes hearing directly into firm calendar with source URL'
      ],
      actionLabel: isHi ? 'ई-कोर्ट्स सिंक का परीक्षण करें' : 'Simulate eCourts Sync',
      actionCode: 4
    },
    {
      step: 5,
      title: isHi ? '5. डॉकेटिंग और व्हाट्सएप क्लाइंट नोटिफिकेशन' : '5. Docketing & Authentic WhatsApp Client Alerts',
      subtitle: isHi ? 'ईमेल नहीं, भारतीय क्लाइंट्स को व्हाट्सएप पर सूचित करें' : 'Reach Indian Litigants on Channels They Actually Read',
      icon: MessageSquare,
      color: 'from-emerald-600 to-green-700',
      description: isHi
        ? 'भारतीय मुवक्किल ईमेल पर निर्भर नहीं रहते; वे व्हाट्सएप पर स्टेटस के लिए लगातार कॉल करते हैं। न्याय सेतु में तारीख तय होते ही एक क्लिक पर मुवक्किल को स्पष्ट व प्रामाणिक व्हाट्सएप संदेश (हिंदी अथवा अंग्रेजी में) प्रेषित किया जाता है जिसमें कोर्ट रूम, तारीख व आवश्यक दस्तावेजों की सूची शामिल होती है।'
        : 'Indian clients rarely check formal portal emails; they call lawyers anxious for case updates. NyaySetu includes native WhatsApp and SMS dispatch. Send structured, bilingual WhatsApp notices informing Meera of her 10 September hearing with required original warranty receipts, logging the dispatch into the case audit trail.',
      highlights: [
        isHi ? 'वास्तविक व्हाट्सएप चैट बबल प्रीव्यू' : 'Live authentic WhatsApp message bubble preview',
        isHi ? 'द्विभाषी (हिंदी/अंग्रेजी) संदेश टेम्पलेट' : 'Bilingual automated templates (English & Hindi)',
        isHi ? 'टाइमलाइन पर डिलीवरी स्टेटस स्वतः लॉग' : 'Delivery and read status recorded permanently on case timeline'
      ],
      actionLabel: isHi ? 'व्हाट्सएप संदेश भेजें' : 'Send WhatsApp Notice',
      actionCode: 5
    },
    {
      step: 6,
      title: isHi ? '6. निर्देशित दस्तावेज़ निर्माण (वकालतनामा व नोटिस)' : '6. Guided Document Assembly (Docassemble Style)',
      subtitle: isHi ? 'केस तथ्यों से स्वतः भरा वकालतनामा और विधिक नोटिस' : 'Pre-Filled Vakalatnama & CPA Notice in Seconds',
      icon: FileText,
      color: 'from-purple-500 to-indigo-700',
      description: isHi
        ? 'प्रवेश (Intake) के समय दर्ज जानकारी का पुनः उपयोग करते हुए न्याय सेतु वकालतनामा, धारा 35 सीपीए नोटिस या साक्ष्य का शपथपत्र बिना दोबारा टाइप किए तैयार करता है। वकील केवल आवश्यक विवरण चुनते हैं और प्रिंट व कोर्ट फाइलिंग के लिए तैयार पीडीएफ प्राप्त करते हैं, जो स्वतः केस में सेव हो जाती है।'
        : 'Eliminate re-typing client and court facts into Word templates. Inspired by Docassemble, NyaySetu pulls parties, court, advocate enrolment, and claim details directly from the matter into a guided Q&A. In seconds, generate a court-ready Vakalatnama or Consumer Legal Notice in English or Hindi, automatically attached and indexed.',
      highlights: [
        isHi ? 'शून्य डाटा पुनः प्रविष्टि (Zero re-typing)' : 'Zero re-typing: Case facts auto-populate interview fields',
        isHi ? 'अंग्रेजी एवं हिंदी दोनों भाषाओं में कानूनी प्रारूप' : 'Bilingual court formats (English and Devanagari Hindi)',
        isHi ? 'उत्पन्न दस्तावेज़ तुरंत केस में संलग्न और सर्च योग्य' : 'Auto-attaches to matter DMS and indexes into full-text search'
      ],
      actionLabel: isHi ? 'वकालतनामा / नोटिस तैयार करें' : 'Assemble Legal Document',
      actionCode: 6
    },
    {
      step: 7,
      title: isHi ? '7. एकीकृत कालानुक्रमिक केस टाइमलाइन' : '7. Unified Chronological Case Timeline',
      subtitle: isHi ? 'केस में घटित प्रत्येक घटना का संपूर्ण ऑडिट ट्रेल' : 'The Complete Audit Trail: From Intake to Final Order',
      icon: GitBranch,
      color: 'from-amber-600 to-slate-800',
      description: isHi
        ? 'न्याय सेतु की टाइमलाइन हर गतिविधि—केस निर्माण, दस्तावेज ओसीआर, ई-कोर्ट्स सिंक, तारीख का निर्धारण, व्हाट्सएप प्रेषण—को एक अखंड समय-सारणी में दर्ज करती है। यह पारदर्शिता प्रदान करता है और भारतीय साक्ष्य अधिनियम 2023 (BSA) के तहत डिजिटल अखंडता सुनिश्चित करता है।'
        : 'Every action taken across any module—case creation, document upload, OCR verification, eCourts docket update, WhatsApp alert, or document assembly—lands on a single unified chronological feed. This provides advocates with a 10-second briefing before court, satisfying BSA 2023 evidence integrity.',
      highlights: [
        isHi ? 'कर्ता, समय और स्रोत की स्पष्ट पहचान' : 'Source-linked provenance (Actor, Timestamp, Source URL)',
        isHi ? 'कोर्ट में जाने से पूर्व 10 सेकंड में संपूर्ण केस समीक्षा' : '10-second instant briefing for advocates before entering court',
        isHi ? 'क्लाइंट पोर्टल के साथ सहज सामंजस्य' : 'Synchronizes with read-only Client Portal for Meera'
      ],
      actionLabel: isHi ? 'केस टाइमलाइन देखें' : 'View Full Case Timeline',
      actionCode: 7
    }
  ];

  const currentStepData = STEPS[activeStep - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 shadow-md">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg sm:text-xl font-bold font-serif text-amber-400">
                  {isHi ? 'न्याय सेतु · मूल्यांकन एवं डेमो गाइड' : 'NyaySetu · Hackathon Judge Walkthrough'}
                </span>
                <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-mono">
                  Step {activeStep} of 7
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isHi ? 'श्रीजन हैकथॉन · लीगलटेक डोमेन · भारत-प्रथम केस वर्कफ़्लो' : 'Srijan Hackathon · LegalTech Domain · India-First Litigation Workflow'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Navigation Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center space-x-2 overflow-x-auto no-scrollbar">
          {STEPS.map((s) => {
            const Icon = s.icon;
            const isCurrent = s.step === activeStep;
            return (
              <button
                key={s.step}
                onClick={() => setActiveStep(s.step)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isCurrent
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>{s.step}.</span>
                <span className="hidden sm:inline">{s.title.split(':')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Step Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-start space-x-4">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${currentStepData.color} flex items-center justify-center text-white shrink-0 shadow-lg shadow-amber-900/10`}>
              {React.createElement(currentStepData.icon, { className: 'w-6 h-6' })}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-serif">
                {currentStepData.title}
              </h3>
              <p className="text-sm font-medium text-amber-700 mt-0.5">
                {currentStepData.subtitle}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 text-sm leading-relaxed">
            {currentStepData.description}
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              {isHi ? 'मुख्य विशेषताएं एवं विभेदक' : 'Key Architecture & Impact Highlights'}
            </h4>
            <div className="space-y-2">
              {currentStepData.highlights.map((h, idx) => (
                <div key={idx} className="flex items-center space-x-2.5 text-sm text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer with Actions */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              disabled={activeStep === 1}
              onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-300 transition cursor-pointer ${
                activeStep === 1 ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400' : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isHi ? 'पिछला' : 'Previous'}</span>
            </button>
            <button
              disabled={activeStep === STEPS.length}
              onClick={() => setActiveStep(prev => Math.min(STEPS.length, prev + 1))}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-300 transition cursor-pointer ${
                activeStep === STEPS.length ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400' : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>{isHi ? 'अगला' : 'Next'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                onSelectStepAction(currentStepData.actionCode);
                onClose();
              }}
              className="flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-amber-900/20 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>{currentStepData.actionLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
