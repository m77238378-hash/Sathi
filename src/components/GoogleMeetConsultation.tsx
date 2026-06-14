import React, { useState, useEffect } from 'react';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut, 
  User 
} from 'firebase/auth';
import { 
  Video, 
  Calendar, 
  Clock, 
  UserCircle, 
  LogOut, 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink,
  ChevronRight,
  Activity,
  Award,
  PhoneCall
} from 'lucide-react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

import firebaseConfig from '../../firebase-applet-config.json';
import { db, handleFirestoreError, OperationType } from '../utils/firebase';
import { createCalendarConsultation } from '../utils/googleCalendar';
import { logConsultationBooking } from '../utils/googleSheets';
import { createUserBooking } from '../utils/backendApi.ts';

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
// Request Workspace scopes for creating Meet spaces, Calendar schedules, and Google Sheets logs
provider.addScope('https://www.googleapis.com/auth/meetings.space.created');
provider.addScope('https://www.googleapis.com/auth/calendar');
provider.addScope('https://www.googleapis.com/auth/spreadsheets');

interface ConsultationRecord {
  id: string;
  type: string;
  date: string;
  time: string;
  meetingUri: string;
  meetingCode: string;
  createdTime: number;
}

export default function GoogleMeetConsultation() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isCreatingSpace, setIsCreatingSpace] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  
  // Form selections
  const [consultationType, setConsultationType] = useState('Nadi Pariksha Assessment');
  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('11:30 AM - 12:00 PM IST');
  const [notes, setNotes] = useState('');

  // Local storage history
  const [history, setHistory] = useState<ConsultationRecord[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mangalam_consultations');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load consultation history', e);
    }
  }, []);

  // Save history to localStorage
  const saveHistory = (newHistory: ConsultationRecord[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem('mangalam_consultations', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Failed to save consultation history', e);
    }
  };

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setToken(null);
      }
      setIsLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  // Handle Google Sign-In
  const handleSignIn = async () => {
    setIsLoadingAuth(true);
    setApiError(null);
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (!credential?.accessToken) {
        throw new Error('No access token returned from Google Sign In. Please ensure the Google Meet integration is approved.');
      }
      setToken(credential.accessToken);
      setUser(result.user);
    } catch (error: any) {
      console.error('Google Sign In Error:', error);
      setApiError(error.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoadingAuth(false);
    }
  };

  // Handle Log Out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setToken(null);
    } catch (error: any) {
      console.error('Sign out error', error);
    }
  };

  // Create Google Meet space using Google Meet API & schedule in Google Calendar
  const createGoogleMeetSpace = async (isInstant = false) => {
    if (!token || !user) {
      setApiError("You must connect your Google account first.");
      return;
    }

    setIsCreatingSpace(true);
    setApiError(null);

    try {
      const typeStr = isInstant ? "Instant Live Consultation" : consultationType;
      const dateStr = isInstant ? new Date().toISOString().split('T')[0] : selectedDate;
      const timeStr = isInstant ? "Live Now" : selectedTimeSlot;

      // 1. Create Event in Google Calendar with Google Meet integrated!
      const calendarResult = await createCalendarConsultation(token, {
        type: typeStr,
        date: dateStr,
        timeSlot: timeStr,
        notes: isInstant ? "Started instantly from consultation dashboard." : notes,
      });

      const meetingUri = calendarResult.meetingUri;
      const meetingCode = calendarResult.meetingCode;

      // Generative random ID complying with isValidId patterns in rules
      const bookingId = `mab-bk-${Math.floor(100000 + Math.random() * 900000)}`;

      // 2. Persistent storage inside Cloud SQL via secure API endpoints (Zero-Trust Compliant)
      try {
        await createUserBooking(user, {
          bookingId,
          type: typeStr,
          date: dateStr,
          time: timeStr,
          meetingUri: meetingUri,
          meetingCode: meetingCode,
          notes: isInstant ? "Started via instant trigger." : notes
        });
        console.log('Successfully saved consultation booking to Cloud SQL.');
      } catch (dbErr) {
        console.error('Failed to create consultation record in Cloud SQL:', dbErr);
      }

      // 3. Log to corporate Google Sheets logs spreadsheet for operational record-keeping
      try {
        await logConsultationBooking(token, {
          date: dateStr,
          timeSlot: timeStr,
          type: typeStr,
          patientName: user.displayName || 'Authorized Clinician',
          patientEmail: user.email || 'N/A',
          meetingUri: meetingUri,
          notes: isInstant ? 'Instant Live Consultation started.' : notes
        });
      } catch (sheetErr) {
        console.warn('Logging to Google Sheets failed, but calendar event and firestore records succeeded:', sheetErr);
      }

      // 4. Update local client state & save to localStorage history lists copy
      const newRecord: ConsultationRecord = {
        id: bookingId,
        type: typeStr,
        date: dateStr,
        time: timeStr,
        meetingUri: meetingUri,
        meetingCode: meetingCode,
        createdTime: Date.now()
      };

      const updatedHistory = [newRecord, ...history];
      saveHistory(updatedHistory);

    } catch (error: any) {
      console.error('Failed to create consultation:', error);
      setApiError(error.message || 'Failed to schedule Google Calendar event or generate consultation space.');
    } finally {
      setIsCreatingSpace(false);
    }
  };

  // Copy meeting link
  const handleCopyLink = (uri: string, id: string) => {
    navigator.clipboard.writeText(uri);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Delete history item
  const handleDeleteRecord = (id: string) => {
    const confirmed = window.confirm("Are you sure you want to remove this scheduled consultation from your local list?");
    if (confirmed) {
      const updated = history.filter(item => item.id !== id);
      saveHistory(updated);
    }
  };

  return (
    <div id="google-meet-consultation-section" className="bg-white rounded-xl border border-amber-900/15 p-6 md:p-8 space-y-6 text-left shadow-xs">
      
      {/* Section Header */}
      <div className="border-b border-amber-900/10 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-mono tracking-widest text-[#8a5a36] uppercase block font-semibold">
            VIRTUAL VAIDYA CLINIC &apos; NADI PARIKSHA
          </span>
          <h3 className="text-xl md:text-2xl font-serif font-black text-amber-950 flex items-center gap-2">
            <Video className="w-5.5 h-5.5 text-amber-800 animate-pulse" />
            Vaidya Google Meet Consultations
          </h3>
          <p className="text-stone-500 text-xs font-serif leading-relaxed">
            Direct high-definition video evaluation with <strong className="text-amber-900 font-bold">Vaidya Dr. Sushil Chandra Gaur</strong> using official high-security Google Meet. Experience real-time tongue diagnosis, lifestyle analysis, and formulation advice.
          </p>
        </div>
      </div>

      {apiError && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs font-serif flex items-start gap-2.5">
          <span className="font-extrabold text-sm shrink-0 leading-none">⚠</span>
          <div>
            <strong className="font-black">Integration Notice:</strong> {apiError}
          </div>
        </div>
      )}

      {/* Main Grid split based on login state */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Interactive Settings / Login */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          {!user ? (
            /* BEFORE SIGN-IN: GSI Material Layout */
            <div className="bg-gradient-to-b from-[#faf8f4] to-white p-6 md:p-8 rounded-xl border border-dashed border-amber-900/15 text-center flex flex-col items-center justify-center space-y-5 h-full">
              <div className="p-3 bg-amber-50 rounded-full border border-amber-900/10">
                <Video className="w-8 h-8 text-amber-900" />
              </div>
              
              <div className="space-y-2 max-w-md">
                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-950 px-2.5 py-0.5 rounded-full text-[8px] font-mono font-black uppercase tracking-wider border border-amber-300/30">
                  Secure Workspace Link
                </span>
                <h4 className="font-serif font-black text-amber-950 text-base md:text-lg uppercase">
                  Authorize Your Google Account to Begin
                </h4>
                <p className="text-stone-500 font-serif text-xs leading-relaxed">
                  We use secure Google Workspace integration to generate private, dedicated Google Meet rooms for your ayurvedic consultations. Connect your account with permission to start.
                </p>
              </div>

              {isLoadingAuth ? (
                <div className="flex items-center gap-2 font-mono text-[10px] text-stone-400 font-black tracking-wider uppercase animate-pulse">
                  <div className="w-3.5 h-3.5 border-2 border-amber-900 border-t-transparent rounded-full animate-spin" />
                  INITIATING FIREBASE AUTH CREDENTIALS...
                </div>
              ) : (
                /* Google styled sign-in button from the system skills */
                <button 
                  type="button"
                  onClick={handleSignIn}
                  className="gsi-material-button inline-flex items-center cursor-pointer select-none border border-[#747775] bg-white text-[#1f1f1f] rounded-lg px-5 py-2.5 transition-all hover:bg-stone-50 active:scale-98 shadow-2xs hover:shadow-xs"
                >
                  <div className="gsi-material-button-content-wrapper flex items-center gap-3">
                    <div className="gsi-material-button-icon w-4.5 h-4.5 shrink-0">
                      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="block w-full h-full">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                      </svg>
                    </div>
                    <span className="gsi-material-button-contents font-sans font-black text-xs uppercase tracking-wider">Connect Google Meet Room</span>
                  </div>
                </button>
              )}
            </div>
          ) : (
            /* AFTER SIGN-IN: Booking Scheduler UI */
            <div className="bg-[#faf8f4]/60 p-5 rounded-xl border border-amber-900/10 space-y-4">
              
              {/* User Header */}
              <div className="flex items-center justify-between border-b border-amber-900/5 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-amber-900/20 bg-amber-50 flex items-center justify-center shrink-0">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <UserCircle className="w-5 h-5 text-amber-800" />
                    )}
                  </div>
                  <div>
                    <h5 className="font-serif font-black text-stone-900 text-xs uppercase tracking-tight leading-tight">
                      {user.displayName || 'Authorized Clinician'}
                    </h5>
                    <p className="text-[10px] text-stone-500 font-mono tracking-wide">
                      {user.email}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="px-2.5 py-1.5 rounded-md border border-stone-200 text-stone-500 hover:text-stone-900 bg-white hover:bg-stone-50 transition-colors flex items-center gap-1 font-mono text-[9px] font-black uppercase cursor-pointer"
                  title="Disconnect Google Auth"
                >
                  <LogOut className="w-3 h-3 text-red-500" /> Disconnect
                </button>
              </div>

              {/* Booking Selector Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Select Consultation Type */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-black text-stone-500 uppercase tracking-widest block">
                    Consultation Discipline
                  </label>
                  <select
                    value={consultationType}
                    onChange={(e) => setConsultationType(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-200 bg-white text-xs font-serif text-stone-800 focus:outline-none focus:border-amber-800"
                  >
                    <option>Nadi Pariksha Ayurvedic Diagnosis</option>
                    <option>Rasashastra Formulation Check</option>
                    <option>Chronic Metabolic Diet Advice</option>
                    <option>Herbo-mineral Carrier Setup</option>
                  </select>
                </div>

                {/* 2. Choose Date */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-black text-stone-500 uppercase tracking-widest block">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-200 bg-white text-xs font-serif text-stone-800 focus:outline-none focus:border-amber-800"
                  />
                </div>

                {/* 3. Time Selection */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-mono font-black text-stone-500 uppercase tracking-widest block mb-1">
                    Select Available Consultation slot (Clinic IST Hrs)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      '10:00 AM - 10:30 AM IST',
                      '11:30 AM - 12:00 PM IST',
                      '04:00 PM - 04:30 PM IST',
                      '05:00 PM - 05:30 PM IST'
                    ].map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`text-[10px] py-2 px-1.5 rounded-md border font-mono font-extrabold uppercase text-center transition-all cursor-pointer ${
                          selectedTimeSlot === slot
                            ? 'bg-amber-900 text-white border-amber-950'
                            : 'bg-white text-stone-600 border-stone-250 hover:bg-stone-50'
                        }`}
                      >
                        {slot.replace(' IST', '')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Patient Case Notes */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-mono font-black text-stone-500 uppercase tracking-widest block">
                    Optional Patient Notes (Imbalances / Current Symptoms)
                  </label>
                  <input
                    type="text"
                    placeholder="E.g., High flatulence, chronic joint pain, disturbed night sleep patterns..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-200 bg-white text-xs font-serif text-stone-800 focus:outline-none focus:border-amber-800"
                  />
                </div>

              </div>

              {/* Action Trigger Buttons */}
              <div className="pt-2 flex flex-col md:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={() => createGoogleMeetSpace(false)}
                  disabled={isCreatingSpace}
                  className="flex-1 bg-amber-900 text-[#faf2e6] hover:bg-[#2d1b10] disabled:bg-[#837063] py-2.5 px-4 rounded-lg font-mono font-bold tracking-wider transition-all cursor-pointer text-xs uppercase flex items-center justify-center gap-1.5 shadow-3xs"
                >
                  {isCreatingSpace ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-[#faf2e6] border-t-transparent rounded-full animate-spin" />
                      Creating Meet Space...
                    </>
                  ) : (
                    <>
                      <Calendar className="w-3.5 h-3.5 text-amber-300" /> Book &amp; Generate Meet Space
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => createGoogleMeetSpace(true)}
                  disabled={isCreatingSpace}
                  className="bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 py-2.5 px-4 rounded-lg font-mono font-bold tracking-wider transition-all cursor-pointer text-xs uppercase flex items-center justify-center gap-1.5"
                  title="Generate a link valid immediately"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Start Instant Consultation
                </button>
              </div>

            </div>
          )}
        </div>

        {/* Right Column: Dynamic Info Sidebar */}
        <div className="lg:col-span-4 bg-gradient-to-b from-[#faf8f4] to-white p-5 rounded-xl border border-amber-900/15 text-stone-700 flex flex-col justify-between h-full">
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-950 font-sans font-black px-2.5 py-0.5 rounded-full text-[8px] uppercase tracking-wider border border-amber-300/30">
                ✦ VIRTUAL CLINIC RULES ✦
              </span>
              <h4 className="font-serif font-black text-amber-950 text-sm uppercase leading-tight">
                Authentic Ayurvedic Diagnosis Protocol
              </h4>
              <p className="text-[11px] leading-relaxed text-stone-600 font-serif">
                To yield precise recommendations, our video consultations adhere to traditional Nadi Pariksha alternatives, checking facial parameters, skin moisture, tongue discoloration (Ama coating), and spoken voice frequency (Vani Pariksha).
              </p>
            </div>

            <div className="space-y-2.5 pt-2 text-[10.5px] font-mono font-bold text-stone-600 border-t border-amber-900/5">
              <div className="flex items-start gap-2">
                <span className="text-amber-800 font-serif text-xs">☉</span>
                <span>Keep your face well-lit of natural daylight during call</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-800 font-serif text-xs">☉</span>
                <span>Perform consultation on empty stomach if possible</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-800 font-serif text-xs">☉</span>
                <span>Have your calculated Tridosha score handy</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-amber-50/60 rounded-lg border border-amber-900/5 text-center">
            <div className="font-serif text-[11px] font-extrabold text-amber-950">
              Vaidya Helpline Coordination
            </div>
            <p className="text-[9.5px] text-stone-500 font-serif mt-0.5">
              For priority support: <span className="font-mono font-bold text-amber-900">9258240603</span>
            </p>
          </div>
        </div>

      </div>

      {/* Meet History Log */}
      {history.length > 0 && (
        <div className="mt-6 pt-5 border-t border-dashed border-stone-200">
          <div className="mb-4">
            <h4 className="font-serif font-black text-stone-900 text-xs md:text-sm uppercase tracking-wide">
              Active Video Consultation Rooms
            </h4>
            <p className="text-stone-500 text-[10px] font-mono uppercase mt-0.5">
              Your generated Google Meet consultation spaces (stored securely in local sandbox)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {history.map((record) => {
              const isCopied = copiedId === record.id;
              return (
                <div 
                  key={record.id}
                  className="bg-[#fafbfd] border border-amber-900/10 rounded-lg p-3.5 flex flex-col justify-between space-y-3 transition-colors hover:border-amber-800/20"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <span className="text-[8px] bg-sky-50 text-sky-800 border border-sky-100 rounded px-1.5 py-0.5 font-mono font-bold uppercase">
                        Google Meet
                      </span>
                      <h5 className="font-serif font-black text-stone-900 text-[11.5px] uppercase leading-tight pt-1">
                        {record.type}
                      </h5>
                      <div className="flex items-center gap-2 text-[10px] text-stone-50 tracking-tight font-sans text-stone-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 shrink-0" /> {record.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 shrink-0" /> {record.time}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteRecord(record.id)}
                      className="text-stone-300 hover:text-red-600 transition-colors cursor-pointer text-xs font-serif font-bold px-1"
                      title="Delete record details"
                    >
                      ×
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 pt-1.5 border-t border-stone-100">
                    <a 
                      href={record.meetingUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-[#1a73e8] hover:bg-[#1557b0] text-white py-1.5 px-3 rounded text-[10px] font-mono font-black uppercase text-center flex items-center justify-center gap-1 shadow-3xs transition-colors cursor-pointer"
                    >
                      <Video className="w-3 h-3" /> Join Video <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                    </a>

                    <button
                      type="button"
                      onClick={() => handleCopyLink(record.meetingUri, record.id)}
                      className="p-1.5 rounded border border-stone-250 bg-white text-stone-600 hover:text-stone-900 transition-all cursor-pointer flex items-center justify-center"
                      title="Copy Join Link"
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
