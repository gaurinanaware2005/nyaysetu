import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Phone, 
  Mail, 
  MapPin, 
  Building, 
  UserCheck, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  Trash2,
  Tag
} from 'lucide-react';
import { Matter, Contact, PartyRole, MatterParty, AppLanguage, TimelineEvent } from '../../types';

interface CasePartiesTabProps {
  matter: Matter;
  contacts: Contact[];
  lang: AppLanguage;
  onUpdateMatter: (updated: Matter) => void;
  onAddContact: (contact: Contact) => void;
  onAddTimelineEvent: (event: TimelineEvent) => void;
}

const ROLES_LIST: PartyRole[] = [
  'Petitioner / Complainant',
  'Respondent / Opposite Party',
  'Opposing Counsel',
  'Witness',
  'Authorized Representative'
];

export const CasePartiesTab: React.FC<CasePartiesTabProps> = ({
  matter,
  contacts,
  lang,
  onUpdateMatter,
  onAddContact,
  onAddTimelineEvent
}) => {
  const isHi = lang === 'hi';
  const [showAddModal, setShowAddModal] = useState(false);
  const [mode, setMode] = useState<'existing' | 'new'>('existing');
  
  // Existing contact selection state
  const [selectedContactId, setSelectedContactId] = useState(contacts[0]?.id || '');
  const [selectedRole, setSelectedRole] = useState<PartyRole>('Witness');

  // New contact state
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<Contact['type']>('Individual');
  const [newPhone, setNewPhone] = useState('+91 ');
  const [newEmail, setNewEmail] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newCity, setNewCity] = useState('New Delhi');

  const handleLinkExisting = () => {
    const contact = contacts.find(c => c.id === selectedContactId);
    if (!contact) return;

    // Check if already in matter
    if (matter.parties.some(p => p.contactId === contact.id)) {
      alert(isHi ? 'यह संपर्क पहले से ही इस केस में जुड़ा हुआ है।' : 'This contact is already linked to this matter.');
      return;
    }

    const newParty: MatterParty = {
      contactId: contact.id,
      contact,
      role: selectedRole,
      isPrimaryClient: selectedRole === 'Petitioner / Complainant' && matter.parties.length === 0
    };

    const updatedMatter: Matter = {
      ...matter,
      parties: [...matter.parties, newParty]
    };

    onUpdateMatter(updatedMatter);

    onAddTimelineEvent({
      id: `tl-${Date.now()}`,
      matterId: matter.id,
      timestamp: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST',
      title: isHi ? `पक्षकार जोड़ा गया: ${contact.name}` : `Party Linked: ${contact.name}`,
      titleHi: `पक्षकार जोड़ा गया: ${contact.name}`,
      description: isHi
        ? `${contact.name} को '${selectedRole}' के रूप में केस से जोड़ा गया (संपर्क डायरेक्टरी से पुनः उपयोग)।`
        : `Linked ${contact.name} as ${selectedRole} (reused from firm contact directory).`,
      actor: 'Adv. Anita Deshmukh',
      actorRole: 'Advocate',
      type: 'STATUS_CHANGE',
      badge: selectedRole
    });

    setShowAddModal(false);
  };

  const handleCreateAndLinkNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    const newContact: Contact = {
      id: `cnt-${Date.now()}`,
      name: newName,
      type: newType,
      phone: newPhone,
      email: newEmail,
      address: newAddress,
      city: newCity,
      state: 'Delhi'
    };

    onAddContact(newContact);

    const newParty: MatterParty = {
      contactId: newContact.id,
      contact: newContact,
      role: selectedRole,
      isPrimaryClient: selectedRole === 'Petitioner / Complainant' && matter.parties.length === 0
    };

    const updatedMatter: Matter = {
      ...matter,
      parties: [...matter.parties, newParty]
    };

    onUpdateMatter(updatedMatter);

    onAddTimelineEvent({
      id: `tl-${Date.now()}`,
      matterId: matter.id,
      timestamp: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST',
      title: isHi ? `नया पक्षकार पंजीकृत: ${newName}` : `New Party Created: ${newName}`,
      titleHi: `नया पक्षकार पंजीकृत: ${newName}`,
      description: isHi
        ? `नया संपर्क बनाया गया और ${selectedRole} के रूप में केस में संबद्ध किया गया।`
        : `Created contact profile and attached as ${selectedRole}.`,
      actor: 'Adv. Anita Deshmukh',
      actorRole: 'Advocate',
      type: 'STATUS_CHANGE',
      badge: 'New Contact'
    });

    setShowAddModal(false);
  };

  const handleRemoveParty = (contactId: string) => {
    if (matter.parties.length <= 1) {
      alert(isHi ? 'केस में कम से कम एक मुख्य पक्षकार होना अनिवार्य है।' : 'Matter must retain at least one key party.');
      return;
    }
    const updated = {
      ...matter,
      parties: matter.parties.filter(p => p.contactId !== contactId)
    };
    onUpdateMatter(updated);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-2">
            <Users className="w-4 h-4 text-amber-600" />
            <span>{isHi ? 'पक्षकार, विपक्षी और अधिवक्ता प्रबंधन' : 'Litigants, Opposite Parties & Counsel'}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {isHi ? 'एक बार संपर्क दर्ज करें, किसी भी केस में पुनः उपयोग करें - दोहरी एंट्री बंद' : 'Single system of record: Reuse contacts across matters with zero redundant re-typing'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4 text-amber-400" />
          <span>{isHi ? '+ पक्षकार / संपर्क जोड़ें' : '+ Link / Add Party'}</span>
        </button>
      </div>

      {/* Parties Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {matter.parties.map((party, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 relative hover:border-amber-400 transition">
            
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                  party.role.includes('Petitioner')
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : party.role.includes('Respondent')
                    ? 'bg-rose-100 text-rose-900 border border-rose-300'
                    : 'bg-slate-100 text-slate-800 border border-slate-300'
                }`}>
                  {party.contact.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-bold text-slate-900">
                      {party.contact.name}
                    </h4>
                    {party.isPrimaryClient && (
                      <span className="text-[10px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full font-bold">
                        Primary Client
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    {party.role}
                  </span>
                </div>
              </div>

              {!party.isPrimaryClient && (
                <button
                  onClick={() => handleRemoveParty(party.contactId)}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded transition cursor-pointer"
                  title="Remove from matter"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Contact details */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-medium text-slate-800">{party.contact.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{party.contact.email}</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{party.contact.address}, {party.contact.city}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-mono">
              <span>Type: {party.contact.type}</span>
              {party.contact.panOrAadhar && (
                <span>ID: {party.contact.panOrAadhar}</span>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* Add Party / Link Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden my-6">
            
            <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold font-serif text-amber-400">
                  {isHi ? 'केस में पक्षकार संबद्ध करें' : 'Link Party to Matter'}
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4">
              
              {/* Tab: Reuse existing vs Create new */}
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setMode('existing')}
                  className={`py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                    mode === 'existing' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  {isHi ? 'डायरेक्टरी से पुनः उपयोग' : 'Reuse Existing Contact'}
                </button>
                <button
                  type="button"
                  onClick={() => setMode('new')}
                  className={`py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                    mode === 'new' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  {isHi ? '+ नया संपर्क बनाएं' : '+ Create New Contact'}
                </button>
              </div>

              {/* Mode 1: Reuse existing contact */}
              {mode === 'existing' ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {isHi ? 'संपर्क डायरेक्टरी से चुनें' : 'Select Contact from Directory'}
                    </label>
                    <select
                      value={selectedContactId}
                      onChange={(e) => setSelectedContactId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    >
                      {contacts.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.type}) - {c.phone}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {isHi ? 'इस केस में भूमिका (Role)' : 'Role in this Matter'}
                    </label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as PartyRole)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium cursor-pointer"
                    >
                      {ROLES_LIST.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-2 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleLinkExisting}
                      className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow transition cursor-pointer"
                    >
                      Link Contact to Matter
                    </button>
                  </div>
                </div>
              ) : (
                /* Mode 2: Create new contact */
                <form onSubmit={handleCreateAndLinkNew} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="e.g. Adv. Rakesh Tandon"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Contact Type
                      </label>
                      <select
                        value={newType}
                        onChange={(e) => setNewType(e.target.value as Contact['type'])}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="Individual">Individual</option>
                        <option value="Company / Organization">Company / Org</option>
                        <option value="Government Authority">Government Authority</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Role in Matter
                      </label>
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value as PartyRole)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        {ROLES_LIST.map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="text"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="lawyer@example.com"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Address & City
                    </label>
                    <input
                      type="text"
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      placeholder="Chamber No. 412, High Court Lawyers Block"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="pt-2 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow transition cursor-pointer"
                    >
                      Save & Link
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
