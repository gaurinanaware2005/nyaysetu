import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  CheckCheck, 
  Clock, 
  Sparkles, 
  Smartphone, 
  Languages, 
  CheckCircle2,
  Bell,
  Mail
} from 'lucide-react';
import { Matter, CommunicationLog, AppLanguage, TimelineEvent } from '../../types';

interface CaseCommsTabProps {
  matter: Matter;
  communications: CommunicationLog[];
  lang: AppLanguage;
  onAddCommunication: (log: CommunicationLog) => void;
  onAddTimelineEvent: (event: TimelineEvent) => void;
}

export const CaseCommsTab: React.FC<CaseCommsTabProps> = ({
  matter,
  communications,
  lang,
  onAddCommunication,
  onAddTimelineEvent
}) => {
  const isHi = lang === 'hi';
  const primaryClient = matter.parties.find(p => p.isPrimaryClient)?.contact || matter.parties[0]?.contact;

  const [messageChannel, setMessageChannel] = useState<'WhatsApp' | 'SMS' | 'Email'>('WhatsApp');
  const [msgLang, setMsgLang] = useState<AppLanguage>(lang);
  const [customMessage, setCustomMessage] = useState(
    `Namaste ${primaryClient?.name || 'Meera ji'}. Update regarding your Consumer Case (${matter.caseNumber || 'CC/412/2026'}) vs ${matter.parties.find(p => p.role.includes('Respondent'))?.contact.name || 'RetailCo'}: Your hearing is listed before the Hon'ble NCDRC on Thursday, 10 September 2026 (Item #24). Our office is filing the rejoinder. Please keep your original warranty card and invoice handy. - Adv. Anita Deshmukh's Office (NyaySetu Portal)`
  );
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const matterComms = communications.filter(c => c.matterId === matter.id);

  const handleApplyTemplate = (type: 'hearing' | 'docs' | 'order') => {
    const isHindi = msgLang === 'hi';
    const clientName = primaryClient?.name || 'Meera Sharma';

    if (type === 'hearing') {
      setCustomMessage(
        isHindi
          ? `नमस्ते ${clientName} जी। आपके उपभोक्ता वाद (${matter.caseNumber || 'CC/412/2026'}) के संबंध में अदालती सूचना: आपकी सुनवाई 10 सितंबर 2026 (आइटम 24) को कोर्ट रूम 3 में नियत है। कृपया सुनवाई पूर्व मूल दस्तावेज तैयार रखें। - एड. अनीता देशमुख (न्याय सेतु पोर्टल)`
          : `Namaste ${clientName}. Update regarding ${matter.caseNumber || 'CC/412/2026'}: Your next hearing is scheduled for 10 September 2026 (Item 24) in Court Room 3. Please keep your original files ready. - Adv. Anita Deshmukh (NyaySetu Portal)`
      );
    } else if (type === 'docs') {
      setCustomMessage(
        isHindi
          ? `नमस्ते ${clientName} जी। आपके केस में शपथपत्र संलग्न करने हेतु कृपया अपने क्रय का मूल टैक्स इनवॉइस व सर्विस सेंटर विजिट स्लिप हमें व्हाट्सएप पर या क्लाइंट पोर्टल में साझा करें। - न्याय सेतु लीगल टीम`
          : `Namaste ${clientName}. For filing the affidavit in your matter, please upload or share the original purchase tax invoice and service center job sheet. - NyaySetu Legal Team`
      );
    } else {
      setCustomMessage(
        isHindi
          ? `नमस्ते ${clientName} जी। माननीय कोर्ट ने विपक्षी पार्टी रिटेलको पर ₹5,000 की हर्जाना राशि अधिरोपित की है तथा अंतिम अवसर प्रदान किया है। अग्रिम तारीख 10-09-2026 है। - एड. अनीता देशमुख`
          : `Namaste ${clientName}. The Hon'ble Commission has imposed a cost of ₹5,000 on RetailCo and granted them a final opportunity. Next date of hearing is 10-09-2026. - Adv. Anita Deshmukh`
      );
    }
  };

  const handleSendMessage = () => {
    if (!customMessage.trim()) return;
    setIsSending(true);

    setTimeout(() => {
      const newLog: CommunicationLog = {
        id: `comm-${Date.now()}`,
        matterId: matter.id,
        recipientName: primaryClient?.name || 'Meera Sharma',
        recipientPhone: primaryClient?.phone || '+91 98112 34567',
        channel: messageChannel,
        timestamp: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST',
        messageText: customMessage,
        status: 'Delivered',
        automatedReason: 'Manual Litigator Dispatch via NyaySetu Hub'
      };

      onAddCommunication(newLog);

      onAddTimelineEvent({
        id: `tl-${Date.now()}`,
        matterId: matter.id,
        timestamp: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST',
        title: isHi ? `क्लाइंट को ${messageChannel} संदेश प्रेषित` : `${messageChannel} Notice Dispatched to Client`,
        titleHi: `क्लाइंट को ${messageChannel} संदेश प्रेषित`,
        description: isHi
          ? `${primaryClient?.name} (${primaryClient?.phone}) को विधिक अपडेट प्रेषित किया गया। स्थिति: Delivered (वितरित)।`
          : `Dispatched litigation update to ${primaryClient?.name} (${primaryClient?.phone}) over official ${messageChannel} channel.`,
        actor: 'Adv. Anita Deshmukh',
        actorRole: 'Advocate',
        type: 'WHATSAPP_SENT',
        badge: messageChannel
      });

      setIsSending(false);
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 3000);
    }, 700);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>{isHi ? 'व्हाट्सएप एवं बहुभाषी मुवक्किल संवाद हब' : 'Client Communications & WhatsApp Hub'}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {isHi ? 'भारतीय मुवक्किलों तक सीधी पहुंच: व्हाट्सएप और एसएमएस द्वारा सटीक सूचना' : 'Reach Indian litigants on the channels they actually use — zero status-chasing calls'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>WhatsApp Business API Active</span>
          </span>
        </div>
      </div>

      {/* Composer & Authentic WhatsApp Phone Mockup Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: Composer & Pre-built Templates */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {isHi ? 'संदेश रचयिता (Composer)' : 'Compose Client Notification'}
            </h4>

            {/* Language Selector */}
            <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => { setMsgLang('en'); handleApplyTemplate('hearing'); }}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition cursor-pointer ${
                  msgLang === 'en' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => { setMsgLang('hi'); handleApplyTemplate('hearing'); }}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition cursor-pointer ${
                  msgLang === 'hi' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>

          {/* Quick Pre-Set Template Chips */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              {isHi ? 'त्वरित कानूनी टेम्पलेट्स:' : 'Quick Legal Alert Templates:'}
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleApplyTemplate('hearing')}
                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-medium transition cursor-pointer"
              >
                📅 {isHi ? 'सुनवाई तारीख अलर्ट' : 'Hearing Date Alert'}
              </button>
              <button
                onClick={() => handleApplyTemplate('docs')}
                className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg text-xs font-medium transition cursor-pointer"
              >
                📑 {isHi ? 'दस्तावेज़ मांग (इनवॉइस)' : 'Document Request'}
              </button>
              <button
                onClick={() => handleApplyTemplate('order')}
                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-medium transition cursor-pointer"
              >
                ⚖️ {isHi ? 'कोर्ट आदेश सारांश' : 'Daily Order Summary'}
              </button>
            </div>
          </div>

          {/* Channel selector */}
          <div className="grid grid-cols-3 gap-2">
            {(['WhatsApp', 'SMS', 'Email'] as const).map(ch => (
              <button
                key={ch}
                type="button"
                onClick={() => setMessageChannel(ch)}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center space-x-1.5 ${
                  messageChannel === ch
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                }`}
              >
                {ch === 'WhatsApp' ? <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> : ch === 'SMS' ? <Smartphone className="w-3.5 h-3.5 text-blue-400" /> : <Mail className="w-3.5 h-3.5 text-amber-400" />}
                <span>{ch}</span>
              </button>
            ))}
          </div>

          {/* Textarea */}
          <div>
            <textarea
              rows={5}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium leading-relaxed"
            />
          </div>

          {/* Dispatch Button */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              Recipient: <strong className="text-slate-800">{primaryClient?.name}</strong> ({primaryClient?.phone})
            </span>
            <button
              onClick={handleSendMessage}
              disabled={isSending}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-900/20 transition flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSending ? (isHi ? 'भेजा जा रहा है...' : 'Sending via Gateway...') : (isHi ? `व्हाट्सएप संदेश प्रेषित करें` : `Send ${messageChannel} Alert`)}</span>
            </button>
          </div>

          {sendSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-semibold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{isHi ? 'संदेश सफलतापूर्वक प्रेषित हुआ और केस टाइमलाइन में दर्ज हुआ!' : 'Message dispatched successfully & recorded on matter timeline!'}</span>
            </div>
          )}
        </div>

        {/* Right 5 Cols: Authentic WhatsApp Message Preview Bubble */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-4 border border-slate-700 shadow-lg flex flex-col justify-between">
          <div>
            {/* Phone Top Bar */}
            <div className="bg-emerald-800 text-white px-3.5 py-2.5 rounded-xl flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                  AD
                </div>
                <div>
                  <p className="text-xs font-bold leading-tight">Adv. Anita Deshmukh</p>
                  <p className="text-[10px] text-emerald-200">NyaySetu Official Legal Verified</p>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-900/80 px-2 py-0.5 rounded text-emerald-200 font-mono">
                +91 98112 34567
              </span>
            </div>

            {/* WhatsApp Wallpaper Chat Box */}
            <div className="mt-4 p-3 bg-emerald-950/40 rounded-xl border border-emerald-800/30 space-y-3 min-h-[220px] flex flex-col justify-end">
              <div className="self-center bg-slate-900/80 text-slate-300 text-[10px] px-2.5 py-1 rounded-full border border-slate-700">
                Messages and calls are end-to-end encrypted
              </div>

              {/* Chat Bubble */}
              <div className="self-end bg-emerald-800 text-white p-3 rounded-2xl rounded-tr-xs max-w-[90%] shadow-md space-y-1.5">
                <p className="text-xs leading-relaxed font-sans">
                  {customMessage}
                </p>
                <div className="flex items-center justify-end space-x-1 text-[10px] text-emerald-200">
                  <span>{new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                  <CheckCheck className="w-3.5 h-3.5 text-cyan-300" />
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 text-center pt-3 italic">
            {isHi ? 'व्हाट्सएप बिजनेस एपीआई द्वारा रियल-टाइम डिलीवरी' : 'Simulated real-time dispatch via WhatsApp Business API'}
          </p>
        </div>

      </div>

      {/* Communication Log History */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            {isHi ? 'प्रेषित संदेशों का इतिहास एवं ऑडिट ट्रेल' : 'Communication Dispatch Log & Audit Trail'}
          </h4>
        </div>

        <div className="divide-y divide-slate-100">
          {matterComms.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs">
              No communication logs available.
            </div>
          ) : (
            matterComms.map((log) => (
              <div key={log.id} className="p-4 hover:bg-slate-50/70 transition space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900">
                      To: {log.recipientName} ({log.recipientPhone})
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                      {log.channel}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {log.timestamp}
                  </span>
                </div>

                <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-sans leading-relaxed">
                  "{log.messageText}"
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Trigger: {log.automatedReason}</span>
                  <span className="text-emerald-700 font-bold flex items-center space-x-1">
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Status: {log.status}</span>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
