import React, { useState, useEffect } from 'react';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Search, 
  Sparkles, 
  BookOpen, 
  Phone, 
  Mail, 
  FileText, 
  Check, 
  Activity, 
  Info,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  UserCheck
} from 'lucide-react';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Use same standard provider with Contacts scope
const contactsProvider = new GoogleAuthProvider();
contactsProvider.addScope('https://www.googleapis.com/auth/contacts');

export interface GoogleContact {
  resourceName: string; // e.g., people/c123456
  name: string;
  email: string;
  phone: string;
  notes: string;
}

interface GoogleContactsDirectoryProps {
  driveToken: string | null;
  setDriveToken: (token: string | null) => void;
  onSelectClient?: (client: { name: string; email: string; phone: string; notes: string }) => void;
}

export default function GoogleContactsDirectory({ 
  driveToken, 
  setDriveToken, 
  onSelectClient 
}: GoogleContactsDirectoryProps) {
  const [contacts, setContacts] = useState<GoogleContact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Form state for creating a new Contact
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGivenName, setNewGivenName] = useState('');
  const [newFamilyName, setNewFamilyName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newDoshaConstit, setNewDoshaConstit] = useState('Vata-Pitta');
  const [newCustomNotes, setNewCustomNotes] = useState('');

  // Deletion Confirmation States (Strict compliance)
  const [showDeleteConfirmResource, setShowDeleteConfirmResource] = useState<string | null>(null);
  const [isDeletingResource, setIsDeletingResource] = useState<string | null>(null);

  // Sign In with Contacts Scope
  const handleConnect = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, contactsProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (!credential?.accessToken) {
        throw new Error('No access token returned. Please ensure Google Contacts permissions are accepted.');
      }
      setDriveToken(credential.accessToken);
      setStatusMessage('Successfully authorized Google Contacts Carecircle!');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      console.error('Contacts Auth Error:', err);
      setError(err.message || 'Authorization failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    setDriveToken(null);
    setContacts([]);
    setError(null);
    setStatusMessage('Disconnected Google Contacts.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // List / Sync contacts from Google People API
  const loadContacts = async (tokenStr: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = 'https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses,phoneNumbers,biographies&pageSize=100';
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${tokenStr}`,
        },
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Failed to list contacts from Google Directory.');
      }

      const data = await response.json();
      const parsedContacts: GoogleContact[] = (data.connections || []).map((person: any) => {
        const nameObj = person.names?.[0];
        const dispName = nameObj?.displayName || 'Unnamed Contact';
        const email = person.emailAddresses?.[0]?.value || '';
        const phone = person.phoneNumbers?.[0]?.value || '';
        const notes = person.biographies?.[0]?.value || '';
        return {
          resourceName: person.resourceName,
          name: dispName,
          email,
          phone,
          notes,
        };
      });

      setContacts(parsedContacts);
    } catch (err: any) {
      console.error('Error fetching contacts:', err);
      setError(err.message || 'Failed to sync contacts.');
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new contact with the Google People API
  const handleAddNewContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driveToken) return;

    if (!newGivenName.trim()) {
      setError('First Name is required to register a contact.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const bioText = `Ayurveda Client Constitution: [${newDoshaConstit}]. Notes: ${newCustomNotes || 'None'}`;
      const payload = {
        names: [
          {
            givenName: newGivenName,
            familyName: newFamilyName,
          },
        ],
        emailAddresses: newEmail ? [{ value: newEmail }] : undefined,
        phoneNumbers: newPhone ? [{ value: newPhone }] : undefined,
        biographies: [{ value: bioText }],
      };

      const url = 'https://people.googleapis.com/v1/people:createContact';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${driveToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Failed to create contact on Google People API.');
      }

      // Success Reset
      setNewGivenName('');
      setNewFamilyName('');
      setNewEmail('');
      setNewPhone('');
      setNewCustomNotes('');
      setShowAddForm(false);
      setStatusMessage('Successfully added wellness contact to your Google directory!');
      setTimeout(() => setStatusMessage(null), 3000);

      // Reload lists
      await loadContacts(driveToken);
    } catch (err: any) {
      console.error('Error creating contact:', err);
      setError(err.message || 'Could not save new contact.');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a contact (MANDATORY EXPLICIT CONFIRMATION REQUIRED)
  const handleDeleteContact = async (resourceName: string, name: string) => {
    if (!driveToken) return;

    setIsDeletingResource(resourceName);
    setError(null);

    try {
      // Endpoint is https://people.googleapis.com/v1/{resourceName}:deleteContact
      // resourceName is like people/c1234
      const deleteUrl = `https://people.googleapis.com/v1/${resourceName}:deleteContact`;
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${driveToken}`,
        },
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error?.message || `Error status: ${response.status}`);
      }

      setStatusMessage(`Deleted "${name}" from your Google Contacts.`);
      setShowDeleteConfirmResource(null);
      await loadContacts(driveToken);
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      console.error('Error deleting contact:', err);
      setError(err.message || 'An error occurred during contact removal.');
    } finally {
      setIsDeletingResource(null);
    }
  };

  useEffect(() => {
    if (driveToken) {
      loadContacts(driveToken);
    }
  }, [driveToken]);

  // Client side search
  const filteredContacts = contacts.filter(c => {
    const term = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      c.phone.toLowerCase().includes(term) ||
      c.notes.toLowerCase().includes(term)
    );
  });

  return (
    <section 
      id="google-contacts-directory-panel" 
      className="bg-[#faf8f5] border border-amber-900/15 rounded-2xl overflow-hidden shadow-sm"
    >
      {/* Traditional Premium Header */}
      <div className="bg-gradient-to-r from-[#2c1b10] via-[#442614] to-[#2c1b10] p-5 text-white border-b border-amber-900/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[9px] font-mono tracking-widest text-[#dac3a3] uppercase block font-black">
              VAIDYA CLINICAL CARECIRCLE
            </span>
            <h3 className="text-lg font-serif font-black tracking-wide text-amber-50 flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-300" /> GOOGLE CONTACTS CARECIRCLE
            </h3>
            <p className="text-[11px] text-stone-300 font-serif">
              Import and register your ayurveda clients, referrals, or patients into your Google Contacts list dynamically.
            </p>
          </div>

          <div className="flex items-center shrink-0">
            {driveToken ? (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[9.5px] font-mono font-black uppercase rounded">
                  <Check className="w-3 h-3" /> DIRECTORY ACTIVE
                </span>
                <button
                  onClick={handleDisconnect}
                  className="bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-600 px-2.5 py-1 text-[9.5px] font-mono font-bold uppercase rounded cursor-pointer transition-colors"
                >
                  DISCONNECT
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnect}
                disabled={isLoading}
                className="w-full sm:w-auto inline-flex items-center justify-center cursor-pointer select-none border border-amber-900/20 bg-white hover:bg-amber-50 text-[#1f1f1f] rounded-lg px-3.5 py-1.5 transition-all active:scale-98 shadow-2xs text-[10px] font-mono font-black uppercase tracking-wider gap-2 animate-pulse hover:animate-none"
              >
                <div className="w-4 h-4 shrink-0">
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="block w-full h-full">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  </svg>
                </div>
                <span>CONNECT SECURE DIRECTORY</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="p-5 space-y-4 text-left">
        {/* Status notifications */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-950 rounded-xl text-xs font-serif flex items-start gap-2.5 animate-fadeIn">
            <AlertTriangle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Contacts Service Alert:</strong> {error}
            </div>
          </div>
        )}

        {statusMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl text-xs font-serif flex items-start gap-2.5 animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">System Notification:</strong> {statusMessage}
            </div>
          </div>
        )}

        {/* Not Connected State */}
        {!driveToken && (
          <div className="text-center py-8 px-4 border border-dashed border-amber-900/10 rounded-2xl bg-amber-500/[0.02] space-y-3">
            <BookOpen className="w-10 h-10 text-amber-900/35 mx-auto" />
            <h4 className="font-serif font-black text-amber-955 text-sm uppercase tracking-wide">
              Ayurvedic Contact Registry is Empty
            </h4>
            <p className="text-xs text-stone-500 font-serif max-w-sm mx-auto leading-relaxed">
              Authenticate using your Google Workspace. Once registered you can easily view your contacts, select them as patients for apothecary compounding, and view their Tridosha details instantly.
            </p>
          </div>
        )}

        {/* Connected Directory Dashboard */}
        {driveToken && (
          <div className="space-y-4">
            {/* Control Bar: Search & Adding Contact button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search Inputs */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search carecircle contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-stone-200 text-stone-900 placeholder-stone-500 rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-1 focus:ring-amber-900 outline-none"
                />
              </div>

              {/* Action toggles */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className={`px-3 py-2 text-[10.5px] font-mono font-black uppercase tracking-wider rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    showAddForm 
                      ? 'bg-amber-900/10 border-amber-900/20 text-amber-950' 
                      : 'bg-amber-900 text-[#faf2e6] hover:bg-[#2c1b10] border-amber-900'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  {showAddForm ? 'Close Directory Form' : 'Register Clinical Contact'}
                </button>

                <button
                  onClick={() => loadContacts(driveToken)}
                  disabled={isLoading}
                  className="p-2 border border-stone-200 text-stone-600 hover:text-stone-950 bg-white rounded-lg transition-colors cursor-pointer"
                  title="Force Refresh Contacts"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Registration Form Block */}
            {showAddForm && (
              <form 
                onSubmit={handleAddNewContact}
                className="bg-white border border-amber-900/15 rounded-xl p-4 space-y-3.5 shadow-sm animate-slideDown"
              >
                <div className="border-b border-[#faf5f0] pb-2 flex items-center gap-1">
                  <UserPlus className="w-4 h-4 text-amber-800" />
                  <h4 className="text-xs font-serif font-black text-amber-950 uppercase tracking-wider">
                    Create Sacred Ayurveda Client Contact
                  </h4>
                </div>

                {/* Grid fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black uppercase text-stone-600">
                      Given / First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newGivenName}
                      onChange={(e) => setNewGivenName(e.target.value)}
                      className="w-full bg-stone-50/50 text-stone-900 text-xs border border-stone-200 rounded-lg p-2 focus:bg-white outline-none"
                      placeholder="e.g., Harish"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black uppercase text-stone-600">
                      Family / Last Name
                    </label>
                    <input
                      type="text"
                      value={newFamilyName}
                      onChange={(e) => setNewFamilyName(e.target.value)}
                      className="w-full bg-stone-50/50 text-stone-900 text-xs border border-stone-200 rounded-lg p-2 focus:bg-white outline-none"
                      placeholder="e.g., Joshi"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black uppercase text-stone-600">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full bg-stone-50/50 text-stone-900 text-xs border border-stone-200 rounded-lg p-2 focus:bg-white outline-none"
                      placeholder="e.g., harish@example.com"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black uppercase text-stone-600">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full bg-stone-50/50 text-stone-900 text-xs border border-stone-200 rounded-lg p-2 focus:bg-white outline-none"
                      placeholder="e.g., +91 98765 43210"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black uppercase text-stone-600 block">
                      Prakriti / Bio-Constitution
                    </label>
                    <select
                      value={newDoshaConstit}
                      onChange={(e) => setNewDoshaConstit(e.target.value)}
                      className="bg-stone-50/50 text-stone-900 text-xs border border-stone-200 rounded-lg p-2 focus:bg-white outline-none"
                    >
                      <option value="Vata (Air/Space)">Vata Type (Air / Space bios)</option>
                      <option value="Pitta (Fire/Water)">Pitta Type (Fire / Water metabolic)</option>
                      <option value="Kapha (Earth/Water)">Kapha Type (Earth / Water heavy)</option>
                      <option value="Vata-Pitta">Vata-Pitta Dual</option>
                      <option value="Pitta-Kapha">Pitta-Kapha Dual</option>
                      <option value="Vata-Kapha">Vata-Kapha Dual</option>
                      <option value="Tridoshic">Sama Dosha (Balanced Tridoshic)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black uppercase text-stone-600">
                      Pulse / Consultation Clinical Notes
                    </label>
                    <textarea
                      value={newCustomNotes}
                      onChange={(e) => setNewCustomNotes(e.target.value)}
                      rows={2}
                      className="w-full bg-stone-50/50 text-stone-900 text-xs border border-stone-200 rounded-lg p-2 focus:bg-white outline-none resize-none"
                      placeholder="e.g. Complains of light stiffness in evenings, recommended Shanti Calm Balm."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#faf5f0]">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1.5 text-[9px] font-mono font-bold border border-stone-200 rounded-md hover:bg-stone-50 cursor-pointer"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-[9px] font-mono font-black uppercase tracking-wider bg-emerald-800 text-emerald-50 rounded-md hover:bg-emerald-950 cursor-pointer"
                  >
                    COMMIT TO CONTACTS
                  </button>
                </div>
              </form>
            )}

            {/* List Table of Contacts */}
            {isLoading && contacts.length === 0 ? (
              <div className="text-center py-6">
                <div className="w-5 h-5 border-2 border-amber-900 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs font-serif text-stone-500">Retrieving patient network from Cloud People API...</p>
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="text-center py-8 border border-stone-200 border-dashed rounded-xl bg-stone-50">
                <Users className="w-8 h-8 text-stone-300 mx-auto mb-1.5" />
                <p className="text-xs font-serif font-bold text-stone-600">No carecircle contacts found</p>
                <p className="text-[10.5px] font-serif text-stone-400 max-w-xs mx-auto mt-0.5">
                  Write a registration template above to enroll contacts natively or check search term matches.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1">
                {filteredContacts.map((contact) => (
                  <div 
                    key={contact.resourceName}
                    className="relative p-3.5 bg-white border border-stone-200 hover:border-amber-900/15 rounded-xl transition-all shadow-3xs flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-amber-100/60 border border-amber-900/10 text-amber-950 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                            {contact.name[0]}
                          </div>
                          <div>
                            <p className="text-xs font-serif font-black text-stone-800 leading-snug">
                              {contact.name}
                            </p>
                            {contact.notes && (
                              <span className="text-[9px] bg-amber-50 text-amber-950 px-1 py-0.2 rounded font-mono font-bold tracking-wider uppercase border border-amber-900/5 mt-0.5 inline-block">
                                {contact.notes.includes('[') ? contact.notes.split('[')[1].split(']')[0] : 'Ayurveda Client'}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Delete button triggering confirmation modal */}
                        <div>
                          {showDeleteConfirmResource === contact.resourceName ? (
                            <div className="absolute inset-0 bg-white/95 rounded-xl flex items-center justify-center p-3 text-center gap-2 border border-red-200 z-10 animate-fadeIn">
                              <span className="text-[10.5px] font-serif font-bold text-red-800">Delete {contact.name}?</span>
                              <button
                                onClick={() => handleDeleteContact(contact.resourceName, contact.name)}
                                disabled={isDeletingResource === contact.resourceName}
                                className="bg-red-700 hover:bg-red-800 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded cursor-pointer"
                              >
                                {isDeletingResource === contact.resourceName ? '...' : 'YES'}
                              </button>
                              <button
                                onClick={() => setShowDeleteConfirmResource(null)}
                                className="bg-stone-100 text-stone-700 text-[9px] font-mono font-bold px-2 py-0.5 rounded cursor-pointer"
                              >
                                NO
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setShowDeleteConfirmResource(contact.resourceName)}
                              className="p-1 px-1.5 text-stone-400 hover:text-red-700 bg-stone-55 hover:bg-red-50 border border-stone-200 rounded transition-colors cursor-pointer"
                              title="Delete contact from Google Directory"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Details lines */}
                      <div className="space-y-1 text-[10.5px] font-mono text-stone-600">
                        {contact.phone && (
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-stone-400 shrink-0" />
                            <span>{contact.phone}</span>
                          </div>
                        )}
                        {contact.email && (
                          <div className="flex items-center gap-1.5 text-ellipsis overflow-hidden">
                            <Mail className="w-3 h-3 text-stone-400 shrink-0" />
                            <span className="truncate">{contact.email}</span>
                          </div>
                        )}
                        {contact.notes && (
                          <div className="text-[10px] font-serif text-stone-500 bg-[#FAF9F6] p-1.5 border border-stone-100 rounded leading-snug mt-1.5 flex items-start gap-1">
                            <FileText className="w-3 h-3 text-stone-400 mt-0.5 shrink-0" />
                            <span className="line-clamp-2">
                              {contact.notes.includes('Notes: ') ? contact.notes.split('Notes: ')[1] : contact.notes}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer Actions: Select Contact for Checkout Form */}
                    {onSelectClient && (
                      <div className="mt-3 pt-2.5 border-t border-stone-100">
                        <button
                          onClick={() => {
                            const noteExtracted = contact.notes.includes('Notes: ') ? contact.notes.split('Notes: ')[1] : contact.notes;
                            onSelectClient({
                              name: contact.name,
                              email: contact.email,
                              phone: contact.phone,
                              notes: noteExtracted
                            });
                            setStatusMessage(`Auto-filled check-out details for client "${contact.name}"!`);
                            setTimeout(() => setStatusMessage(null), 3000);
                          }}
                          className="w-full bg-[#fbf9f5] border border-amber-900/15 text-amber-955 text-[9.5px] font-mono font-black uppercase py-1 px-2.5 rounded-md hover:bg-amber-900 hover:text-white hover:border-amber-900 transition-all cursor-pointer flex items-center justify-center gap-1 shadow-3xs"
                        >
                          <UserCheck className="w-3 h-3" />
                          Set as Patient of Record
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
