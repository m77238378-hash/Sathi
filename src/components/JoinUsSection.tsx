import React, { useState, useRef, useEffect } from 'react';
import { 
  Users, 
  Send, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  GraduationCap, 
  Heart,
  Globe,
  Upload,
  ArrowRight,
  Link as LinkIcon,
  Copy,
  Gift,
  PlusCircle,
  Clock,
  LogIn,
  Check
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../utils/firebase';
import { User } from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';

interface ApplicationState {
  fullName: string;
  email: string;
  phone: string;
  role: 'vaidya' | 'botanist' | 'scribe' | 'seeker';
  experienceYears: string;
  institution: string;
  biography: string;
}

interface ReferralItem {
  id: string;
  referrerId: string;
  referrerName: string;
  friendName: string;
  friendEmail: string;
  status: 'invited' | 'joined';
  createdAt: any;
}

interface JoinUsSectionProps {
  user: User | null;
  onSignInClick: () => void;
}

export default function JoinUsSection({ user, onSignInClick }: JoinUsSectionProps) {
  const [activeSubTab, setActiveSubTab] = useState<'apply' | 'referral'>('apply');
  
  // Application form states
  const [form, setForm] = useState<ApplicationState>({
    fullName: '',
    email: '',
    phone: '',
    role: 'vaidya',
    experienceYears: '3',
    institution: '',
    biography: ''
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Referral states
  const [friendName, setFriendName] = useState('');
  const [friendEmail, setFriendEmail] = useState('');
  const [isSendingInvite, setIsSendingInvite] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [inviteError, setInviteError] = useState('');
  
  const [referrals, setReferrals] = useState<ReferralItem[]>([]);
  const [isLoadingReferrals, setIsLoadingReferrals] = useState(false);
  const [copied, setCopied] = useState(false);

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (isValidFileType(file)) {
        setUploadedFile(file);
        setErrorMessage('');
      } else {
        setErrorMessage('Unsupported file format. Please upload a PDF or Microsoft Word document.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (isValidFileType(file)) {
        setUploadedFile(file);
        setErrorMessage('');
      } else {
        setErrorMessage('Unsupported file format. Please upload a PDF or Microsoft Word document.');
      }
    }
  };

  const isValidFileType = (file: File) => {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    return validTypes.includes(file.type) || file.name.endsWith('.pdf') || file.name.endsWith('.doc') || file.name.endsWith('.docx');
  };

  const handleTextInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!form.fullName || !form.email || !form.phone || !form.biography) {
      setErrorMessage('Please fill out all mandatory fields before invoking submission.');
      return;
    }

    setIsSubmitting(true);

    // Simulate safe database write delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      // Persist submission record locally safely
      try {
        const storedApplications = JSON.parse(localStorage.getItem('mab_applications') || '[]');
        storedApplications.push({
          ...form,
          id: `app_${Date.now()}`,
          fileName: uploadedFile ? uploadedFile.name : 'No attachment',
          submittedAt: new Date().toISOString()
        });
        localStorage.setItem('mab_applications', JSON.stringify(storedApplications));
      } catch (err) {
        console.error('Failed to update local storage sequence', err);
      }
    }, 2000);
  };

  const resetForm = () => {
    setForm({
      fullName: '',
      email: '',
      phone: '',
      role: 'vaidya',
      experienceYears: '3',
      institution: '',
      biography: ''
    });
    setUploadedFile(null);
    setSubmitSuccess(false);
    setErrorMessage('');
  };

  // Check and convert referral on auth login
  useEffect(() => {
    if (!user) return;
    
    const resolveReferralStatus = async () => {
      try {
        const referrerId = localStorage.getItem('mab_referrer_id');
        const userEmail = user.email;
        if (!userEmail) return;

        // Query if any invitation exists for this friend email
        const referralsRef = collection(db, 'referrals');
        const q = query(referralsRef, where('friendEmail', '==', userEmail.toLowerCase().trim()));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // If invitation exists, convert it to joined
          for (const docSnap of querySnapshot.docs) {
            const data = docSnap.data();
            if (data.status === 'invited') {
              const docRef = doc(db, 'referrals', docSnap.id);
              await updateDoc(docRef, { 
                status: 'joined'
              });
            }
          }
          // Clear referrer ID list
          localStorage.removeItem('mab_referrer_id');
        } else if (referrerId && referrerId !== user.uid) {
          // If they came via generic link, create a new referral document
          const newRefId = `ref_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
          const docRef = doc(db, 'referrals', newRefId);
          await setDoc(docRef, {
            referrerId: referrerId,
            referrerName: 'Vedic Link Ally',
            friendName: user.displayName || user.email?.split('@')[0] || 'Subscribed Scribe',
            friendEmail: userEmail,
            status: 'joined',
            createdAt: serverTimestamp()
          });
          // Clear referrer ID
          localStorage.removeItem('mab_referrer_id');
        }
      } catch (err) {
        console.error('Error resolving referral conversion:', err);
      }
    };

    resolveReferralStatus();
  }, [user]);

  // Real-time listener for referrals
  useEffect(() => {
    if (!user || activeSubTab !== 'referral') return;

    setIsLoadingReferrals(true);
    const referralsRef = collection(db, 'referrals');
    const q = query(referralsRef, where('referrerId', '==', user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      })) as ReferralItem[];
      
      // Sort in descending order of createdAt
      list.sort((a, b) => {
        const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
        const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
        return timeB - timeA;
      });
      
      setReferrals(list);
      setIsLoadingReferrals(false);
    }, (err) => {
      console.error('Error fetching referrals:', err);
      setIsLoadingReferrals(false);
    });

    return () => unsubscribe();
  }, [user, activeSubTab]);

  const copyReferralLink = () => {
    if (!user) return;
    const link = `${window.location.origin}/?ref=${user.uid}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setInviteError('');
    setInviteSuccess(false);
    
    if (!friendName || !friendEmail) {
      setInviteError('Please fill out all mandatory fields before sending an invitation.');
      return;
    }
    
    setIsSendingInvite(true);
    
    try {
      const referralId = `ref_${Date.now()}`;
      const docRef = doc(db, 'referrals', referralId);
      
      await setDoc(docRef, {
        referrerId: user.uid,
        referrerName: user.displayName || user.email || 'A Noble Practitioner',
        friendName: friendName.trim(),
        friendEmail: friendEmail.toLowerCase().trim(),
        status: 'invited',
        createdAt: serverTimestamp()
      });
      
      setInviteSuccess(true);
      setFriendName('');
      setFriendEmail('');
    } catch (err) {
      console.error('Failed to create invitation record:', err);
      try {
        handleFirestoreError(err, OperationType.CREATE, `referrals/${user.uid}`);
      } catch (formattedErr: any) {
        setInviteError(formattedErr.message || 'Error occurred while saving to database.');
      }
    } finally {
      setIsSendingInvite(false);
    }
  };

  // Summary Metrics
  const invitedCount = referrals.length;
  const joinedCount = referrals.filter(r => r.status === 'joined').length;

  return (
    <div id="mab-join-us-container" className="space-y-12 animate-fade-in text-stone-800 text-left">
      
      {/* 1. Brand Banner with Vedic styling */}
      <div id="mab-join-hero" className="bg-[#2d1b10] rounded-3xl border border-amber-900/10 p-8 md:p-12 relative overflow-hidden shadow-md text-white text-left flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950/40 via-stone-950/80 to-[#1a0f0a] -z-10" />
        
        {/* Abstract lotus grid illustration */}
        <div id="mab-join-hero-mandala" className="absolute right-0 bottom-0 top-0 w-1/3 opacity-5 pointer-events-none hidden md:block">
          <svg viewBox="0 0 100 100" fill="currentColor" className="text-amber-500 w-full h-full">
            <polygon points="50,15 85,50 50,85 15,50" stroke="currentColor" strokeWidth="0.5" fill="none" />
            <polygon points="50,5 95,50 50,95 5,50" stroke="currentColor" strokeWidth="0.2" fill="none" />
            <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.4" fill="none" strokeDasharray="2,2" />
          </svg>
        </div>

        <div className="space-y-4 max-w-3xl">
          <span id="mab-join-badge" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/20">
            <Users className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> Botanical Alliance Guild
          </span>
          <h1 id="mab-join-title" className="font-serif text-3xl md:text-5xl font-black text-[#faf2e6] tracking-tight leading-none">
            Join Our Ancient Mission
          </h1>
          <p id="mab-join-subtitle" className="text-[#eadbc8] text-base md:text-lg leading-relaxed font-serif italic">
            "सं गच्छध्वं सं वदध्वं सं वो मनांसि जानताम्" — Let us walk together, let us speak together, and let our minds be in complete unified resonance.
          </p>
          <p className="text-stone-300 text-sm leading-relaxed max-w-2xl font-sans">
            We are actively expanding our network of traditional Ayurvedic practitioners, Sanskrit script researchers, wildcrafting botanists, and passionate volunteers dedicated to raising global consciousness about pristine herbal sciences.
          </p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div id="mab-join-tabs" className="flex border-b border-stone-200">
        <button
          id="mab-tab-btn-apply"
          onClick={() => setActiveSubTab('apply')}
          className={`pb-4 px-6 font-serif font-bold text-sm tracking-wide border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'apply'
              ? 'border-amber-900 text-amber-950 font-black'
              : 'border-transparent text-stone-400 hover:text-stone-600'
          }`}
        >
          Apply to the Guild
        </button>
        <button
          id="mab-tab-btn-referral"
          onClick={() => setActiveSubTab('referral')}
          className={`pb-4 px-6 font-serif font-bold text-sm tracking-wide border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'referral'
              ? 'border-amber-900 text-amber-950 font-black'
              : 'border-transparent text-stone-400 hover:text-stone-600'
          }`}
        >
          <Gift className="w-4 h-4 text-amber-800" /> Referral Alliance Portal
        </button>
      </div>

      {activeSubTab === 'apply' ? (
        /* Original Interactive Elements */
        <div id="mab-join-sections-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
          
          {/* Left hand details cards */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#fcfaf4] rounded-2xl border border-amber-950/15 p-5 md:p-6 shadow-3xs space-y-4">
              <h3 className="font-serif font-black text-amber-955 text-md md:text-lg border-b border-amber-900/10 pb-2 flex items-center gap-2">
                <GraduationCap className="w-4.5 h-4.5 text-amber-800" /> Essential Callings
              </h3>
              
              <div className="space-y-4 text-xs font-sans">
                <div className="space-y-1 select-none">
                  <strong className="font-serif font-bold text-stone-900 text-[13px] block">Vaidya &amp; Clinical Guide:</strong>
                  <p className="text-stone-600 leading-relaxed">
                    Verify recipe combinations, offer live consult guidelines, or catalog complex local rasayanas. Requires certified BAMS or traditional Gurukula lineage titles.
                  </p>
                </div>

                <div className="space-y-1 select-none">
                  <strong className="font-serif font-bold text-stone-900 text-[13px] block">Field Botanist &amp; Harvester:</strong>
                  <p className="text-stone-600 leading-relaxed">
                    Identify wild medicinals inside high-altitude Himalayan zones and support cooperative ethical cultivation without leveraging ecological strain.
                  </p>
                </div>

                <div className="space-y-1 select-none">
                  <strong className="font-serif font-bold text-stone-900 text-[13px] block">Manuscript Copyist &amp; Scribe:</strong>
                  <p className="text-stone-600 leading-relaxed">
                    Help translate rare Sanskrit texts (Charaka, Sushruta, Astanga Hridaya) to assist digital curation schemas for future generations.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-600/35 text-xs text-emerald-950 flex gap-3 text-left">
              <ShieldCheck className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
              <div className="space-y-1 font-sans">
                <strong className="font-serif font-bold text-emerald-900">Guaranteed Privacy Protocols:</strong>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  Your submitted credentials, diplomas, and contact profiles undergo high-security masking to defend your traditional lineage integrity.
                </p>
              </div>
            </div>
          </div>

          {/* Right hand Application interactive form */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-amber-950/15 p-6 md:p-8 shadow-xs">
            {submitSuccess ? (
              <div className="text-center py-12 space-y-6 animate-fade-in font-sans">
                <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 shadow">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif font-black text-xl text-stone-900">Application Received Safely</h3>
                  <p className="text-xs text-stone-550 max-w-md mx-auto leading-relaxed">
                    Thank you for stepping up to honor the lineage. Our supervisor Vaidyas will review your credentials and contact you within three sun cycles.
                  </p>
                </div>
                <button
                  onClick={resetForm}
                  className="bg-amber-900 hover:bg-[#2d1b10] text-[#faf2e6] font-serif font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer border-none"
                >
                  Submit Mutual Application Sheet
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 font-sans">
                <div>
                  <h3 className="font-serif font-black text-stone-900 text-lg md:text-xl flex items-center gap-2">
                    <Heart className="w-5 h-5 text-amber-800" /> Spiritual &amp; Scientific Application File
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Please catalog your coordinates below so we may synchronize our callings together. (* Marks a compulsory field)
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 text-xs flex gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-800 shrink-0 mt-0.5" />
                    <p className="leading-snug">{errorMessage}</p>
                  </div>
                )}

                {/* Grid 2 Column */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-stone-400 font-bold uppercase tracking-wider text-left">Your Noble Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={form.fullName}
                      onChange={handleTextInput}
                      placeholder="e.g. Vaidya Devadatta Sharma"
                      className="bg-white border border-stone-200 focus:border-amber-700 p-2.5 rounded-lg outline-none text-xs text-stone-850"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-stone-400 font-bold uppercase tracking-wider text-left">Secretariat Email Coordinate *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleTextInput}
                      placeholder="e.g. sharma@ayurlineage.org"
                      className="bg-white border border-stone-200 focus:border-amber-700 p-2.5 rounded-lg outline-none text-xs text-stone-850"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-stone-400 font-bold uppercase tracking-wider text-left">Primary Contact Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={form.phone}
                      onChange={handleTextInput}
                      placeholder="e.g. +91 98765 43210"
                      className="bg-white border border-stone-200 focus:border-amber-700 p-2.5 rounded-lg outline-none text-xs text-stone-850"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-stone-400 font-bold uppercase tracking-wider text-left">Your Devoted Role Calling *</label>
                    <select
                      name="role"
                      value={form.role}
                      onChange={handleTextInput}
                      className="bg-white border border-stone-200 focus:border-amber-700 p-2.5 rounded-lg outline-none text-xs text-stone-850"
                    >
                      <option value="vaidya">Vaidya / Clinic Guide</option>
                      <option value="botanist">Field Phyto-Botanist</option>
                      <option value="scribe">Manuscript Scribe</option>
                      <option value="seeker">Volunteering seeker</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-stone-400 font-bold uppercase tracking-wider text-left">Minimum Field Cycle (Years)</label>
                    <input
                      type="number"
                      name="experienceYears"
                      min="1"
                      max="80"
                      value={form.experienceYears}
                      onChange={handleTextInput}
                      className="bg-white border border-stone-200 focus:border-amber-700 p-2.5 rounded-lg outline-none text-xs text-stone-850"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-stone-400 font-bold uppercase tracking-wider text-left">Affiliation / Training Gurukula (Optional)</label>
                  <input
                    type="text"
                    name="institution"
                    value={form.institution}
                    onChange={handleTextInput}
                    placeholder="e.g. National Institute of Ayurveda, Dharamshala Gurukula"
                    className="bg-white border border-stone-200 focus:border-amber-700 p-2.5 rounded-lg outline-none text-xs text-stone-850 justify-start"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-stone-400 font-bold uppercase tracking-wider text-left">Your Philosophy &amp; Experience Calling *</label>
                  <textarea
                    name="biography"
                    required
                    rows={4}
                    value={form.biography}
                    onChange={handleTextInput}
                    placeholder="Share a short chronicle of your studies, your daily wellness rituals, or how your family lineage relates to the wild botanical preserve..."
                    className="bg-white border border-stone-200 focus:border-amber-700 p-2.5 rounded-lg outline-none text-xs text-stone-850 leading-relaxed resize-none"
                  />
                </div>

                {/* Drag and Drop File Upload Section */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-stone-400 font-bold uppercase tracking-wider text-left">Qualifications, Diplomas or Resumé File</label>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 transition-all duration-300 text-center cursor-pointer flex flex-col items-center justify-center gap-2 ${
                      isDragging 
                        ? 'border-amber-700 bg-amber-50/35' 
                        : uploadedFile 
                        ? 'border-emerald-600 bg-emerald-500/5' 
                        : 'border-stone-200 hover:border-amber-800'
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                    />
                    
                    {uploadedFile ? (
                      <>
                        <FileText className="w-8 h-8 text-emerald-800 animate-pulse" />
                        <div>
                          <p className="font-serif font-black text-xs text-stone-900">{uploadedFile.name}</p>
                          <span className="text-[9.5px] font-mono text-emerald-800 font-bold block mt-0.5">
                            File uploaded successfully. Click or drag to replace.
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-stone-400" />
                        <div>
                          <p className="font-serif font-black text-xs text-stone-800">Drag &amp; Drop credentials file or Click to load</p>
                          <span className="text-[9.5px] font-mono text-stone-400 block mt-0.5">
                            Supported file formats: PDF, DOC, DOCX. Max sized limit: 12MB.
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200/50 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-amber-900 hover:bg-[#2d1b10] disabled:bg-stone-300 text-[#faf2e6] font-serif font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer border-none flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/35 border-t-white rounded-full animate-spin" />
                        Checking lineage files...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-amber-400 fill-current" /> Submit Application
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      ) : (
        /* Referral Alliance Portal with full Firestore synchronization */
        <div id="mab-join-referrals-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
          
          {!user ? (
            /* Unauthenticated State: Beautiful Invite Lock Panel */
            <div className="col-span-12 bg-[#faf7f2] rounded-3xl border border-amber-900/10 p-8 md:p-12 text-center max-w-3xl mx-auto space-y-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-amber-950/10 flex items-center justify-center text-amber-900 shadow-sm">
                <LogIn className="w-7 h-7" />
              </div>
              <div className="space-y-3">
                <h3 className="font-serif text-2xl md:text-3xl font-black text-[#2d1b10] tracking-tight">
                  Enter the Alliance Portal
                </h3>
                <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed font-sans">
                  Generate your unique referral link to invite friends, trace active disciples, and verify referral status real-time directly on our safe Firestore server.
                </p>
              </div>
              <div>
                <button
                  id="mab-btn-portal-signin"
                  onClick={onSignInClick}
                  className="bg-amber-900 hover:bg-[#2d1b10] text-[#faf2e6] font-serif font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer border-none flex items-center gap-2 mx-auto"
                >
                  <LogIn className="w-4 h-4" /> Sign In / Authenticate for Referrals
                </button>
              </div>
            </div>
          ) : (
            /* Authenticated Core Referral Dashboard */
            <>
              {/* Left hand details cards for Referrer details */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Unique Ref Link Card */}
                <div className="bg-[#fcfaf4] rounded-2xl border border-amber-955/15 p-5 md:p-6 shadow-3xs space-y-5">
                  <h3 className="font-serif font-black text-amber-955 text-md md:text-lg border-b border-amber-900/10 pb-2 flex items-center gap-2">
                    <LinkIcon className="w-4.5 h-4.5 text-amber-800" /> Unique Referral Coordinate
                  </h3>
                  
                  <p className="text-xs text-stone-550 leading-relaxed font-sans">
                    Each botanical enthusiast who registers using your unique code is verified as your invitee on our secure database.
                  </p>

                  <div className="space-y-2">
                    <div className="bg-[#f4efe4] border border-[#e3dac9] rounded-xl p-3 flex items-center justify-between gap-3 text-stone-800 select-all font-mono text-[11px] font-bold overflow-x-auto whitespace-nowrap">
                      {window.location.origin}/?ref={user.uid}
                    </div>
                    
                    <button
                      id="mab-btn-copy-ref"
                      onClick={copyReferralLink}
                      className={`w-full font-serif font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer border-none flex items-center justify-center gap-2 ${
                        copied 
                          ? 'bg-emerald-800 text-white' 
                          : 'bg-amber-900 hover:bg-[#2d1b10] text-[#faf2e6]'
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-white" /> Link Copied Successfully!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-[#eadbc8]" /> Copy Referral Link
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Tracking Metrices dashboard */}
                <div className="bg-white rounded-2xl border border-stone-200/80 p-5 md:p-6 shadow-3xs space-y-4">
                  <h3 className="font-serif font-black text-stone-900 text-sm md:text-base flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500 animate-spin" /> Alliance Statistics
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#faf9f5] border border-stone-100 rounded-xl p-4 text-center">
                      <span className="text-[10px] font-mono text-stone-400 font-bold uppercase block">Invited Friends</span>
                      <strong id="mab-stat-invited" className="font-serif text-3xl font-black text-amber-900 mt-1 block">
                        {isLoadingReferrals ? '...' : invitedCount}
                      </strong>
                    </div>

                    <div className="bg-[#f5faf6] border border-emerald-500/10 rounded-xl p-4 text-center">
                      <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase block">Joined Members</span>
                      <strong id="mab-stat-joined" className="font-serif text-3xl font-black text-emerald-800 mt-1 block">
                        {isLoadingReferrals ? '...' : joinedCount}
                      </strong>
                    </div>
                  </div>

                  <div className="p-3.5 bg-amber-50/20 border border-amber-905/10 rounded-xl text-[11px] leading-relaxed text-stone-600 flex gap-2 font-sans">
                    <Gift className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                    <span>Invitees automatically convert to "Joined" when completing their verification matching email cycles!</span>
                  </div>
                </div>
              </div>

              {/* Right hand Referrals forms & real-time list */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-amber-955/15 p-6 md:p-8 space-y-8 shadow-xs">
                
                {/* 1. Invite Form */}
                <form onSubmit={handleInviteSubmit} className="space-y-5 font-sans">
                  <div>
                    <h3 className="font-serif font-black text-stone-900 text-lg flex items-center gap-2">
                      <PlusCircle className="w-5 h-5 text-amber-800" /> Send Personalized Guild Invitation
                    </h3>
                    <p className="text-xs text-stone-500 mt-1">
                      Nominate peers or herbal practitioners directly. We will register an invitation token securely linked to your account.
                    </p>
                  </div>

                  {inviteError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-950 text-xs flex gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-800 shrink-0 mt-0.5" />
                      <p>{inviteError}</p>
                    </div>
                  )}

                  {inviteSuccess && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs flex gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                      <p>Divine nomination created successfully! Your friend's tracking token is active. Point them to register using your referral link.</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono text-stone-400 font-bold uppercase tracking-wider text-left">Friend's Full Name *</label>
                      <input
                        id="mab-friend-name"
                        type="text"
                        required
                        value={friendName}
                        onChange={(e) => setFriendName(e.target.value)}
                        placeholder="e.g. Acharya Sharma"
                        className="bg-white border border-stone-200 focus:border-amber-700 p-2.5 rounded-lg outline-none text-xs text-stone-850"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono text-stone-400 font-bold uppercase tracking-wider text-left">Friend's Email Coordinate *</label>
                      <input
                        id="mab-friend-email"
                        type="email"
                        required
                        value={friendEmail}
                        onChange={(e) => setFriendEmail(e.target.value)}
                        placeholder="e.g. friend@ayurscience.org"
                        className="bg-white border border-stone-200 focus:border-amber-700 p-2.5 rounded-lg outline-none text-xs text-stone-850"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      id="mab-submit-invite"
                      type="submit"
                      disabled={isSendingInvite}
                      className="bg-amber-900 hover:bg-[#2d1b10] disabled:bg-stone-300 text-[#faf2e6] font-serif font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer border-none flex items-center gap-2"
                    >
                      {isSendingInvite ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/35 border-t-white rounded-full animate-spin" />
                          Registering code...
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5 text-amber-400 fill-current" /> Nominate &amp; Track Invitation
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* 2. Real-time Invite Directory List */}
                <div className="pt-6 border-t border-stone-200/50 space-y-4">
                  <h3 className="font-serif font-black text-stone-900 text-base flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-800" /> Your Invited Disciples Directory
                  </h3>

                  {isLoadingReferrals ? (
                    <div className="text-center py-6 text-stone-400 text-xs flex justify-center items-center gap-2 font-sans">
                      <div className="w-4 h-4 border-2 border-amber-905 border-t-transparent rounded-full animate-spin" />
                      Connecting with Firestore secure directory...
                    </div>
                  ) : referrals.length === 0 ? (
                    <div className="text-center py-8 px-4 rounded-xl border border-dashed border-stone-200 text-stone-400 text-xs font-sans">
                      No matching invitation records. Copy your sacred referral coordinate above and share with your guild members.
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-stone-100">
                      <table className="w-full text-left font-sans text-xs border-collapse">
                        <thead>
                          <tr className="bg-[#faf9f5] border-b border-stone-100 text-stone-400 font-mono tracking-wider font-bold">
                            <th className="p-3 uppercase text-[9.5px]">Friend Name &amp; Email</th>
                            <th className="p-3 uppercase text-[9.5px]">Registration Date</th>
                            <th className="p-3 uppercase text-[9.5px] text-center">Alliance Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {referrals.map((item) => (
                            <tr key={item.id} className="border-b border-stone-100 hover:bg-[#fafaf8] transition-colors">
                              <td className="p-3">
                                <div className="font-serif font-black text-stone-950 text-xs">{item.friendName}</div>
                                <div className="text-[10px] text-stone-400 mt-0.5">{item.friendEmail}</div>
                              </td>
                              <td className="p-3 text-stone-500 font-mono text-[10px] whitespace-nowrap">
                                {item.createdAt 
                                  ? (item.createdAt.toDate ? item.createdAt.toDate().toLocaleDateString('en-IN') : new Date(item.createdAt).toLocaleDateString('en-IN')) 
                                  : 'Syncing...'}
                              </td>
                              <td className="p-3 text-center whitespace-nowrap">
                                {item.status === 'joined' ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9.5px] font-bold tracking-wide font-mono bg-emerald-100 text-emerald-800">
                                    <Check className="w-3 h-3 text-emerald-700" /> Joined Alliance
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9.5px] font-bold tracking-wide font-mono bg-amber-100 text-amber-800">
                                    <Clock className="w-3 h-3 text-amber-700" /> Invited Token
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>
            </>
          )}

        </div>
      )}

    </div>
  );
}
