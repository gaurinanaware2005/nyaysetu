import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  Building, 
  Briefcase, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { Contact, Matter, AppLanguage } from '../types';

interface ContactsDirectoryProps {
  contacts: Contact[];
  matters: Matter[];
  lang: AppLanguage;
  onAddContact: (contact: Contact) => void;
  onSelectMatter: (matterId: string) => void;
}

export const ContactsDirectory: React.FC<ContactsDirectoryProps> = ({
  contacts,
  matters,
  lang,
  onAddContact,
  onSelectMatter
}) => {
  const isHi = lang === 'hi';
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState<Contact['type']>('Individual');
  const [phone, setPhone] = useState('+91 ');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('New Delhi');
  const [address, setAddress] = useState('');

  const filteredContacts = useMemo(() => {
    return contacts.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.city.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [contacts, search]);

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newContact: Contact = {
      id: `cnt-${Date.now()}`,
      name,
      type,
      phone,
      email,
      city,
      address,
      state: 'Delhi'
    };

    onAddContact(newContact);
    setName('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold font-serif text-slate-900 flex items-center space-x-2">
            <Users className="w-5 h-5 text-amber-600" />
            <span>{isHi ? 'संपर्क एवं पक्षकार डायरेक्टरी' : 'Contacts & Litigants Directory'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isHi ? 'मुवक्किलों, विपक्षी कंपनियों, वकीलों व गवाहों का केंद्रीकृत भंडार' : 'Re-use parties across matters without redundant data entry'}
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>{showAddForm ? (isHi ? 'फॉर्म बंद करें' : 'Close Form') : (isHi ? '+ नया संपर्क जोड़ें' : '+ Add Contact')}</span>
        </button>
      </div>

      {/* Add Contact Form */}
      {showAddForm && (
        <form onSubmit={handleCreateContact} className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200 shadow-sm space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
            {isHi ? 'नया संपर्क पंजीकृत करें' : 'Add New Contact to Legal Master Index'}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. S.K. Batra / Tata Consultancy"
                className="w-full bg-white border border-amber-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as Contact['type'])}
                className="w-full bg-white border border-amber-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Individual">Individual</option>
                <option value="Company / Organization">Company / Org</option>
                <option value="Government Authority">Government Authority</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white border border-amber-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@law.in"
                className="w-full bg-white border border-amber-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-white border border-amber-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Sector 18, Noida"
                className="w-full bg-white border border-amber-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow transition cursor-pointer"
            >
              Save Contact
            </button>
          </div>
        </form>
      )}

      {/* Search Input */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={isHi ? 'नाम, फोन या शहर द्वारा संपर्क खोजें...' : 'Search contacts by name, phone, email, or city...'}
          className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-2 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
        />
      </div>

      {/* Contacts Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContacts.map(c => {
          // Find linked matters
          const linkedMatters = matters.filter(m => m.parties.some(p => p.contactId === c.id));

          return (
            <div key={c.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-amber-400 transition space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 font-bold flex items-center justify-center text-xs border border-slate-200">
                      {c.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{c.name}</h4>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold border border-slate-200">
                        {c.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{c.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{c.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{c.city}, {c.state}</span>
                  </div>
                </div>
              </div>

              {/* Linked Matters section */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Linked Matters ({linkedMatters.length})
                </span>
                {linkedMatters.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">Not linked to any active matter</span>
                ) : (
                  <div className="space-y-1">
                    {linkedMatters.map(m => (
                      <button
                        key={m.id}
                        onClick={() => onSelectMatter(m.id)}
                        className="text-left w-full text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center justify-between p-1 rounded hover:bg-amber-50 transition cursor-pointer"
                      >
                        <span className="truncate max-w-[200px]">{m.title}</span>
                        <ExternalLink className="w-3 h-3 text-amber-600 shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
