import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, 
  Home,
  Filter, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShoppingBag, 
  CheckCircle2, 
  Info, 
  Users,
  ChevronRight, 
  X, 
  Printer, 
  Download,
  Sparkles, 
  Grid, 
  List,
  Leaf,
  Plus,
  Minus,
  Trash2,
  Lock,
  ArrowRight,
  Activity,
  Heart,
  Wind,
  HelpCircle,
  RefreshCw,
  UserCircle,
  LogIn,
  UserPlus,
  Cloud,
  CheckCircle,
  ExternalLink,
  Send,
  ArrowLeftRight,
  Scale,
  Share2,
  AlertTriangle,
  ArrowDownAZ
} from 'lucide-react';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, collection, addDoc } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { db, auth as authInstance, handleFirestoreError, OperationType } from './utils/firebase';
import { logCompoundingInquiry, logNewsletterSubscriber } from './utils/googleSheets';
import { subscribeNewsletter, submitCompoundingInquiry, saveQuizResultInCloudSQL, syncUserProfile } from './utils/backendApi.ts';
import RemedyFeedbackSection from './components/RemedyFeedbackSection';
import AuthModal from './components/AuthModal';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import { PRODUCTS, CATEGORIES, INDICATIONS, Product } from '../data/products';
import ProductPlaceholderImage from './components/ProductPlaceholderImage';
import CompareProductsModal from './components/CompareProductsModal';
// @ts-ignore
import brandLogo from './assets/images/Mangalamayurvedaushadhbhandar.png';
// @ts-ignore
import drSushilPhoto from './assets/images/Dr_Sushil_Gaur.jpg';
import DoshaDistributionChart, { QuizCompletion } from './components/DoshaDistributionChart';
import EducationalWorkshops from './components/EducationalWorkshops';
import GoogleMeetConsultation from './components/GoogleMeetConsultation';
import CompoundingWorkerPool from './components/CompoundingWorkerPool';
import { generateReportPDF, generateProductPDF } from './utils/pdfGenerator';
import GoogleDriveVault from './components/GoogleDriveVault';
import GoogleContactsDirectory from './components/GoogleContactsDirectory';
import { uploadReportToDrive } from './utils/googleDrive';
import DailyAyurvedicWisdom from './components/DailyAyurvedicWisdom';
import SeasonalWellnessBanner from './components/SeasonalWellnessBanner';
import YogicKriyaPranayam from './components/YogicKriyaPranayam';
import AboutUsSection from './components/AboutUsSection';
import JoinUsSection from './components/JoinUsSection';
import HomeSection from './components/HomeSection';
import { motion, AnimatePresence } from 'motion/react';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "How is your typical appetite and digestion after eating?",
    description: "Ayurveda defines Agni (digestive fire) as the key to long-term vitality.",
    options: [
      {
        value: "A",
        label: "Irregular & Erratic (Vata type)",
        sub: "Often experience gas, abdominal bloating, and unpredictable digestion.",
        dosha: "Vata"
      },
      {
        value: "B",
        label: "Strong & Acidic (Pitta type)",
        sub: "Intense hunger, but frequently prone to acid reflux, heartburn, or heat sensations.",
        dosha: "Pitta"
      },
      {
        value: "C",
        label: "Slow & Heaviness (Kapha type)",
        sub: "Low appetite, slow digestion, and feels sleepy or heavy after normal meals.",
        dosha: "Kapha"
      }
    ]
  },
  {
    id: 2,
    question: "How does your mind and sleep pattern respond under daily pressure?",
    description: "Mental energy (Manas) indicates which subtle element is currently active.",
    options: [
      {
        value: "A",
        label: "Anxious & Light Sleeper",
        sub: "Mind races or worries easily; sleep is light, easily disturbed, or restless.",
        dosha: "Vata"
      },
      {
        value: "B",
        label: "Irritable & Sharp Focus",
        sub: "Can become impatient or sharp; sleep sound and deep but feel hot and sweaty.",
        dosha: "Pitta"
      },
      {
        value: "C",
        label: "Calm & Deep Sleep",
        sub: "Patient, steady, and hard to anger; sleeps very deeply, but struggles to wake up.",
        dosha: "Kapha"
      }
    ]
  },
  {
    id: 3,
    question: "How do your joints and muscles feel on a regular basis?",
    description: "Physical lubrication and heat flow depict deep tissue (Dhatu) health.",
    options: [
      {
        value: "A",
        label: "Dry, Stiff, or Cracking",
        sub: "Joints click or pop, frequently stiff in dry/cold weather with cracking discomfort.",
        dosha: "Vata"
      },
      {
        value: "B",
        label: "Warm & Highly Flexible",
        sub: "Joints feel flexible but prone to general inflammation or hot burning muscle aches.",
        dosha: "Pitta"
      },
      {
        value: "C",
        label: "Heavy, Lubricated & Stable",
        sub: "Strong frame, rarely painful, but experiences occasional water retention or puffiness.",
        dosha: "Kapha"
      }
    ]
  },
  {
    id: 4,
    question: "How does your breathing and throat feel during seasonal changes?",
    description: "Your respiratory resilience tracks dry vs fluid elements in the chest.",
    options: [
      {
        value: "A",
        label: "Dry or Gritty Tickle",
        sub: "Easily get dry throat, dry barking coughs, irritated sinuses, and vocal tiring.",
        dosha: "Vata"
      },
      {
        value: "B",
        label: "Mild Soreness or Flush",
        sub: "Prone to inflammatory throat irritations, dry chest heat, or feeling flushed.",
        dosha: "Pitta"
      },
      {
        value: "C",
        label: "Phlegm, congestion, or mucus",
        sub: "Prone to deep wet congestion, runny nose, heavy seasonal allergies and chest phlegm.",
        dosha: "Kapha"
      }
    ]
  },
  {
    id: 5,
    question: "What is your primary wellness aspiration at this moment?",
    description: "Determine where your bodily intelligence is calling for immediate relief.",
    options: [
      {
        value: "A",
        label: "Nerve Balance & Deeper Rest",
        sub: "To calm an overactive nervous system, deep sound sleep, and soothe body aches.",
        dosha: "Vata"
      },
      {
        value: "B",
        label: "Gentle Organ Detox & Cooling",
        sub: "Remove toxic sludge from liver/blood, soothe active acidity, and restore gut skin.",
        dosha: "Pitta"
      },
      {
        value: "C",
        label: "Immunity Booster & Lung Power",
        sub: "Strengthen respiratory immunity, lift physical weakness, and boost digest metabolism.",
        dosha: "Kapha"
      }
    ]
  }
];

// Replaced with centralized firebase/auth instances exported by src/utils/firebase.ts

export interface Ritu {
  id: string;
  name: string;
  sanskritName: string;
  englishSeason: string;
  months: string;
  doshaInfluence: string;
  recommendedApproach: string;
  colorTheme: string;
}

export const RITUS: Ritu[] = [
  {
    id: 'all',
    name: 'All Seasons',
    sanskritName: 'सर्व ऋतु',
    englishSeason: 'Year-Round Balance',
    months: 'Jan - Dec',
    doshaInfluence: 'Tridosha Harmony',
    recommendedApproach: 'Maintain constitutional equilibrium with holistic daily tonics.',
    colorTheme: 'stone'
  },
  {
    id: 'vasanta',
    name: 'Vasanta',
    sanskritName: 'वसन्त',
    englishSeason: 'Spring',
    months: 'Mid-March to Mid-May',
    doshaInfluence: 'Kapha Liquidation',
    recommendedApproach: 'Gentle detoxification, respiratory warming, liver stoking.',
    colorTheme: 'emerald'
  },
  {
    id: 'grishma',
    name: 'Grishma',
    sanskritName: 'ग्रीष्म',
    englishSeason: 'Summer',
    months: 'Mid-May to Mid-July',
    doshaInfluence: 'Pitta & Dehydration',
    recommendedApproach: 'Cooling therapies, heavy sweet restoratives, stress-calming herbs.',
    colorTheme: 'amber'
  },
  {
    id: 'varsha',
    name: 'Varsha',
    sanskritName: 'वर्षा',
    englishSeason: 'Monsoon',
    months: 'Mid-July to Mid-Sept',
    doshaInfluence: 'Vata Aggravation',
    recommendedApproach: 'Ignite digestive fire (Agni), dry warm elements, joint lubrication.',
    colorTheme: 'indigo'
  },
  {
    id: 'sharad',
    name: 'Sharad',
    sanskritName: 'शरद',
    englishSeason: 'Autumn',
    months: 'Mid-Sept to Mid-Nov',
    doshaInfluence: 'Pitta Heat Overflow',
    recommendedApproach: 'Bile purification, liver support, cooling bitter compounds.',
    colorTheme: 'rose'
  },
  {
    id: 'hemanta',
    name: 'Hemanta',
    sanskritName: 'हेमन्त',
    englishSeason: 'Early Winter',
    months: 'Mid-Nov to Mid-Jan',
    doshaInfluence: 'Strong Agni & Cold Vata',
    recommendedApproach: 'Rich nutritive jams, heavy ghee bases, joint warmth.',
    colorTheme: 'amber'
  },
  {
    id: 'shishira',
    name: 'Shishira',
    sanskritName: 'शिशिर',
    englishSeason: 'Late Winter',
    months: 'Mid-Jan to Mid-March',
    doshaInfluence: 'Kapha Accumulation',
    recommendedApproach: 'Respiratory immunity fortification, muscle and marrow energy.',
    colorTheme: 'gold'
  }
];

export const getCurrentRituId = (): string => {
  const month = new Date().getMonth(); // 0-11
  const day = new Date().getDate();
  
  if (month === 2) { // March
    return day >= 15 ? 'vasanta' : 'shishira';
  }
  if (month === 3) return 'vasanta'; // April
  if (month === 4) { // May
    return day < 15 ? 'vasanta' : 'grishma';
  }
  if (month === 5) return 'grishma'; // June
  if (month === 6) { // July
    return day < 15 ? 'grishma' : 'varsha';
  }
  if (month === 7) return 'varsha'; // August
  if (month === 8) { // September
    return day < 15 ? 'varsha' : 'sharad';
  }
  if (month === 9) return 'sharad'; // October
  if (month === 10) { // November
    return day < 15 ? 'sharad' : 'hemanta';
  }
  if (month === 11) return 'hemanta'; // December
  if (month === 0) { // January
    return day < 15 ? 'hemanta' : 'shishira';
  }
  return 'shishira'; // February is shishira
};

export default function App() {
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signup');
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  // State Management
  const [searchQuery, setSearchQuery] = useState('');

  // Real-time search suggestions state
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Compute suggestions based on name, sanskrit name, category or indications
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    return PRODUCTS.filter(product => {
      return (
        product.name.toLowerCase().includes(query) ||
        product.sanskritName.includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.indications.some(ind => ind.toLowerCase().includes(query))
      );
    }).slice(0, 5); // Limit to top 5 suggestions
  }, [searchQuery]);

  // Click outside listener for suggestions menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || searchSuggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex(prev => 
        prev < searchSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex(prev => 
        prev > 0 ? prev - 1 : searchSuggestions.length - 1
      );
    } else if (e.key === 'Enter') {
      if (activeSuggestionIndex >= 0 && activeSuggestionIndex < searchSuggestions.length) {
        e.preventDefault();
        const selected = searchSuggestions[activeSuggestionIndex];
        setSearchQuery(selected.name);
        setShowSuggestions(false);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      e.currentTarget.blur();
    }
  };
  const [currentTab, setCurrentTab] = useState<'home' | 'catalog' | 'yoga' | 'about' | 'join'>('home');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedIndication, setSelectedIndication] = useState('all');
  const [selectedSeason, setSelectedSeason] = useState('all');
  const [isFeaturedOnly, setIsFeaturedOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'alphabetical'>('default');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [shareStatus, setShareStatus] = useState<string>('');
  const [cart, setCart] = useState<{ product: Product; quantity: number; selectedSize: string }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mab_wishlist_v2');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const toggleWishlist = (id: string) => {
    setWishlist(prev => {
      const updated = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('mab_wishlist_v2', JSON.stringify(updated));
      return updated;
    });
  };

  const wishlistedProducts = useMemo(() => {
    return PRODUCTS.filter(product => wishlist.includes(product.id));
  }, [wishlist]);

  // Ayurvedic Newsletter States
  const [isNewsletterSubscribed, setIsNewsletterSubscribed] = useState(() => {
    try {
      return localStorage.getItem('mab_newsletter_subscribed') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [subscribedEmail, setSubscribedEmail] = useState(() => {
    try {
      return localStorage.getItem('mab_newsletter_email') || '';
    } catch (e) {
      return '';
    }
  });
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      const emailVal = newsletterEmail.trim();
      setIsNewsletterSubscribed(true);
      setSubscribedEmail(emailVal);
      try {
        localStorage.setItem('mab_newsletter_subscribed', 'true');
        localStorage.setItem('mab_newsletter_email', emailVal);

        // 1. Storage in Cloud SQL database via Express API (Zero-Trust Validation Compliant)
        await subscribeNewsletter(emailVal);
        console.log('Saved newsletter subscriber to Cloud SQL.');

        // 2. Logging to Google Sheets
        if (driveToken) {
          await logNewsletterSubscriber(driveToken, emailVal);
          console.log('Logged newsletter subscriber to Google Sheets.');
        }
      } catch (err: any) {
        console.error('Newsletter persistence error:', err);
      }
      setNewsletterEmail('');
    }
  };

  // Compare Products States
  const [compareList, setCompareList] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [compareAlert, setCompareAlert] = useState<string>('');

  const toggleCompare = (product: Product) => {
    setCompareList(prev => {
      if (prev.includes(product.id)) {
        return prev.filter(x => x !== product.id);
      }
      if (prev.length >= 2) {
        setCompareAlert('Mātrā Limit: Maximum 2 products can be compared side-by-side.');
        setTimeout(() => setCompareAlert(''), 4005);
        return prev;
      }
      return [...prev, product.id];
    });
  };

  const isCompared = (id: string) => compareList.includes(id);

  const comparedProductsData = useMemo(() => {
    return PRODUCTS.filter(p => compareList.includes(p.id));
  }, [compareList]);

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    consultationNotes: '',
    anupanaPreference: 'Warm Water'
  });
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'traditional' | 'gpay'>('gpay');
  const [isPaidViaGPay, setIsPaidViaGPay] = useState(false);
  const [gpayTxnId, setGpayTxnId] = useState('');
  const [showGPaySheet, setShowGPaySheet] = useState(false);
  const [gpayProcessingStep, setGpayProcessingStep] = useState<'idle' | 'linking' | 'authorization' | 'success'>('idle');
  const [gpaySelectedMethod, setGpaySelectedMethod] = useState<'sbi' | 'hdfc' | 'gpay_balance'>('gpay_balance');

  // Personalized Nadi Pariksha Quiz state
  const [activeQuizIndex, setActiveQuizIndex] = useState<number>(-1); // -1 is closed/not started, 0 to 4 are questions, 5 is results
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [quizAddedId, setQuizAddedId] = useState<string | null>(null);

  // Google Drive Integration state
  const [driveToken, setDriveToken] = useState<string | null>(null);
  const [isUploadingToDrive, setIsUploadingToDrive] = useState(false);
  const [driveUploadSuccess, setDriveUploadSuccess] = useState(false);
  const [driveUploadFileLink, setDriveUploadFileLink] = useState<string | null>(null);
  const [driveUploadError, setDriveUploadError] = useState<string | null>(null);

  // Load quiz history from LocalStorage or preloaded historical data
  const [quizHistory, setQuizHistory] = useState<QuizCompletion[]>(() => {
    const saved = localStorage.getItem('mab_quiz_history_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback to default
      }
    }
    return [
      { date: '2026-06-01', dosha: 'Vata' },
      { date: '2026-06-02', dosha: 'Pitta' },
      { date: '2026-06-02', dosha: 'Pitta' },
      { date: '2026-06-03', dosha: 'Kapha' },
      { date: '2026-06-04', dosha: 'Vata' },
      { date: '2026-06-04', dosha: 'Vata' },
      { date: '2026-06-05', dosha: 'Pitta' },
      { date: '2026-06-06', dosha: 'Kapha' },
      { date: '2026-06-07', dosha: 'Vata' },
      { date: '2026-06-08', dosha: 'Pitta' },
      { date: '2026-06-09', dosha: 'Kapha' },
      { date: '2026-06-09', dosha: 'Vata' },
      { date: '2026-06-10', dosha: 'Pitta' },
      { date: '2026-06-11', dosha: 'Vata' },
      { date: '2026-06-11', dosha: 'Pitta' },
      { date: '2026-06-12', dosha: 'Kapha' },
    ];
  });

  // Listen to auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authInstance, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Automatically sync customer info name/email with authorized user
        setCustomerInfo(prev => ({
          ...prev,
          name: currentUser.displayName || prev.name,
          email: currentUser.email || prev.email
        }));
        // Synchronize authenticated user with Cloud SQL users table
        syncUserProfile(currentUser).catch(err => {
          console.error('Cloud SQL profile sync failed:', err);
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync selectedProduct with URL query parameter for deep-linking & direct sharing
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const productParam = params.get('product');
    
    if (productParam && !selectedProduct) {
      const found = PRODUCTS.find((p: Product) => p.id === productParam);
      if (found) {
        setSelectedProduct(found);
      }
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (selectedProduct) {
      if (params.get('product') !== selectedProduct.id) {
        params.set('product', selectedProduct.id);
        const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
        window.history.replaceState(null, '', newUrl);
      }
    } else {
      if (params.has('product')) {
        params.delete('product');
        const newUrl = params.toString() 
          ? `${window.location.pathname}?${params.toString()}${window.location.hash}`
          : `${window.location.pathname}${window.location.hash}`;
        window.history.replaceState(null, '', newUrl);
      }
    }
  }, [selectedProduct]);

  const handleShareProduct = async () => {
    if (!selectedProduct) return;

    // Construct the direct deep link url
    const url = new URL(window.location.href);
    url.searchParams.set('product', selectedProduct.id);
    const directUrl = url.toString();

    const title = `Mangalam Ayurveda: ${selectedProduct.name}`;
    const text = `Discover ${selectedProduct.name} (${selectedProduct.sanskritName}) - ${selectedProduct.description}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: directUrl
        });
        setShareStatus('Shared!');
        setTimeout(() => setShareStatus(''), 2000);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Web Share failed, fallback to clipboard:', err);
          copyToClipboard(directUrl);
        }
      }
    } else {
      copyToClipboard(directUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setShareStatus('Link Copied!');
      setTimeout(() => setShareStatus(''), 2000);
    }).catch(err => {
      console.error('Could not copy text: ', err);
      setShareStatus('Copy failed');
      setTimeout(() => setShareStatus(''), 2200);
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut(authInstance);
      setUser(null);
    } catch (e) {
      console.error('Sign Out Error:', e);
    }
  };

  const commitSubmittedInquiry = async (gpayTx: string = '', paid: boolean = false) => {
    if (cart.length === 0) return;
    
    const inquiryId = `mab-inq-${Math.floor(100000 + Math.random() * 900000)}`;
    
    const itemsMapped = cart.map(item => ({
      productId: item.product.id,
      name: item.product.name,
      quantity: item.quantity,
      selectedSize: item.selectedSize,
      price: item.product.price
    }));

    const orderData = {
      userId: user?.uid || 'anonymous_client',
      name: customerInfo.name,
      email: customerInfo.email || '',
      phone: customerInfo.phone,
      anupanaPreference: customerInfo.anupanaPreference,
      consultationNotes: customerInfo.consultationNotes || '',
      selectedPaymentMethod: selectedPaymentMethod,
      totalPrice: totalInquiryPrice,
      status: 'submitted',
      items: itemsMapped,
      gpayTxnId: gpayTx,
      isPaid: paid
    };

    // 1. Persistent storage inside Cloud SQL via secure Express API (Zero-Trust Compliant)
    try {
      await submitCompoundingInquiry({
        inquiryId,
        ...orderData
      });
      console.log('Successfully saved compounding inquiry order to Cloud SQL.');
    } catch (error) {
      console.error('Failed to create compounding inquiry inside Cloud SQL:', error);
    }

    // 2. Logging rows to Google Sheets operational ledger Spreadsheet (if Sheets token exists)
    // We can use driveToken or request a fresh sign-in to log if they chose Google options
    if (driveToken) {
      try {
        const compoundsStr = cart.map(item => `${item.product.name} (${item.selectedSize} x${item.quantity})`).join(', ');
        await logCompoundingInquiry(driveToken, {
          date: new Date().toLocaleDateString('en-IN'),
          name: customerInfo.name,
          phone: customerInfo.phone,
          email: customerInfo.email,
          compounds: compoundsStr,
          anupana: customerInfo.anupanaPreference,
          paymentMethod: selectedPaymentMethod,
          totalPrice: totalInquiryPrice,
          status: 'submitted'
        });
        console.log('Successfully logged compounding inquiry to Google Sheets.');
      } catch (sheetErr) {
        console.warn('Logging compounding inquiry to Google Sheets failed:', sheetErr);
      }
    }
  };

  const handleSaveReportToDrive = async (
    dominantDosha: string,
    subtitle: string,
    description: string,
    scores: { vata: number; pitta: number; kapha: number },
    recommendedProducts: Product[]
  ) => {
    let currentToken = driveToken;
    setIsUploadingToDrive(true);
    setDriveUploadError(null);
    setDriveUploadSuccess(false);
    setDriveUploadFileLink(null);

    try {
      if (!currentToken) {
        // Authenticate with Google Drive Scope
        const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
        const provider = new GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/drive');
        const result = await signInWithPopup(authInstance, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (!credential?.accessToken) {
          throw new Error('Could not authorize Google Drive scope. Please allow permissions when prompted.');
        }
        currentToken = credential.accessToken;
        setDriveToken(currentToken);
      }

      // Generate the report document
      const doc = generateReportPDF(
        dominantDosha,
        subtitle,
        description,
        scores,
        recommendedProducts
      );
      const pdfBlob = doc.output('blob');
      const safeFilename = `Tridosha_${dominantDosha}_Report_${new Date().toISOString().split('T')[0]}.pdf`;

      // Upload to Drive folder (via our newly created helper)
      const uploaded = await uploadReportToDrive(currentToken, pdfBlob, safeFilename);
      setDriveUploadSuccess(true);
      setDriveUploadFileLink(uploaded.webViewLink);
    } catch (err: any) {
      console.error('Google Drive Upload error:', err);
      setDriveUploadError(err.message || 'Failed to upload report to Google Drive.');
    } finally {
      setIsUploadingToDrive(false);
    }
  };

  const handleUploadCurrent = async () => {
    if (quizAnswers.length !== 5) return;
    const countA = quizAnswers.filter(x => x === 'A').length;
    const countB = quizAnswers.filter(x => x === 'B').length;
    const countC = quizAnswers.filter(x => x === 'C').length;

    let dominantDosha = 'Vata';
    let subtitle = 'Air & Space bio-elements dominant';
    let description = 'Your responses reflect a dominantly Vata-oriented state (or Vata Vikriti), which is marked by qualities of coldness, dryness, and active movement. Restoring harmony requires warm, deeply nourishing, and lubricating formulas to ground your active nervous system.';
    let remedyIds = ['p8', 'p4', 'p10'];

    if (countB > countA && countB >= countC) {
      dominantDosha = 'Pitta';
      subtitle = 'Fire & Water bio-elements dominant';
      description = 'Your responses suggest a dominantly Pitta-oriented state (or Pitta Vikriti), which represents heat, translation, and metabolism. Restoring biological balance requires cooling, liver-supportive bitter tonics, metabolic cleansers, and soothing remedies.';
      remedyIds = ['p9', 'p5', 'p6'];
    } else if (countC > countA && countC > countB) {
      dominantDosha = 'Kapha';
      subtitle = 'Earth & Water bio-elements dominant';
      description = 'Your responses indicate a dominantly Kapha-oriented state (or Kapha Vikriti), representing structure, lubrication, and stability. Restoring your system requires light, heating, stimulating remedies that clear heavy fluids, boost immunity, and metabolize sluggishness.';
      remedyIds = ['p3', 'p2', 'p1'];
    }
    const recommendedProducts = PRODUCTS.filter(p => remedyIds.includes(p.id));

    await handleSaveReportToDrive(
      dominantDosha,
      subtitle,
      description,
      { vata: countA, pitta: countB, kapha: countC },
      recommendedProducts
    );
  };

  const handleSelectClient = (client: { name: string; email: string; phone: string; notes: string }) => {
    setCustomerInfo(prev => ({
      ...prev,
      name: client.name,
      email: client.email,
      phone: client.phone,
      consultationNotes: client.notes ? `${prev.consultationNotes}\nClient Notes: ${client.notes}`.trim() : prev.consultationNotes
    }));
    setIsCartOpen(true);
  };

  const [hasSavedCurrentResult, setHasSavedCurrentResult] = useState(false);
  const [showCommunityStats, setShowCommunityStats] = useState(false);

  useEffect(() => {
    if (activeQuizIndex === 5 && quizAnswers.length === 5 && !hasSavedCurrentResult) {
      const countA = quizAnswers.filter(x => x === 'A').length;
      const countB = quizAnswers.filter(x => x === 'B').length;
      const countC = quizAnswers.filter(x => x === 'C').length;

      let dominantDosha: 'Vata' | 'Pitta' | 'Kapha' = 'Vata';
      if (countB > countA && countB >= countC) {
        dominantDosha = 'Pitta';
      } else if (countC > countA && countC > countB) {
        dominantDosha = 'Kapha';
      }

      const newItem: QuizCompletion = {
        date: new Date().toISOString().split('T')[0],
        dosha: dominantDosha
      };

      const updatedHistory = [...quizHistory, newItem];
      setQuizHistory(updatedHistory);
      localStorage.setItem('mab_quiz_history_v2', JSON.stringify(updatedHistory));
      
      // Persist results inside Cloud SQL database (Zero-Trust Compliant)
      if (user) {
        const resultId = `mab-qz-${Math.floor(100000 + Math.random() * 900000)}`;
        const saveResult = async () => {
          try {
            await saveQuizResultInCloudSQL({
              quizResultId: resultId,
              userId: user.uid,
              dominantDosha: dominantDosha,
              doshaResult: {
                vata: Math.round((countA / 5) * 100),
                pitta: Math.round((countB / 5) * 100),
                kapha: Math.round((countC / 5) * 100)
              }
            });
            console.log('Successfully saved Nadi Pariksha evaluation result to Cloud SQL.');
          } catch (error) {
            console.error('Failed to save quiz results inside Cloud SQL:', error);
          }
        };
        saveResult();
      }

      setHasSavedCurrentResult(true);
    } else if (activeQuizIndex === 0) {
      // Reset the saved latch when a new quiz session begins
      setHasSavedCurrentResult(false);
    }
  }, [activeQuizIndex, quizAnswers, hasSavedCurrentResult, quizHistory, user]);

  // Filter and sort products based on search, selected attributes, and sort selection
  const filteredProducts = useMemo(() => {
    const sorted = PRODUCTS.filter(product => {
      // Search term matching (Name, Sanskrit, Description, Ingredients, Indication)
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sanskritName.includes(searchQuery) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.indications.some(ind => ind.toLowerCase().includes(searchQuery.toLowerCase())) ||
        product.ingredients.some(ing => ing.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesIndication = selectedIndication === 'all' || product.indications.includes(selectedIndication);
      const matchesFeatured = !isFeaturedOnly || product.featured;
      const matchesSeason = selectedSeason === 'all' || (product.seasons && product.seasons.includes(selectedSeason));

      return matchesSearch && matchesCategory && matchesIndication && matchesFeatured && matchesSeason;
    });

    if (sortBy === 'price-asc') {
      return [...sorted].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      return [...sorted].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'alphabetical') {
      return [...sorted].sort((a, b) => a.name.localeCompare(b.name));
    }
    return sorted;
  }, [searchQuery, selectedCategory, selectedIndication, isFeaturedOnly, selectedSeason, sortBy]);

  // Cart Management
  const addToCart = (product: Product, size: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(
        item => item.product.id === product.id && item.selectedSize === size
      );
      if (existingItem) {
        return prevCart.map(item => 
          item.product.id === product.id && item.selectedSize === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1, selectedSize: size }];
    });
    // Open cart drawer for confirmation
    setIsCartOpen(true);
  };

  const updateCartQty = (productId: string, size: string, change: number) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.product.id === productId && item.selectedSize === size) {
          const newQty = item.quantity + change;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter((item): item is typeof item & {} => item !== null);
    });
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.selectedSize === size)));
  };

  const totalInquiryPrice = useMemo(() => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }, [cart]);

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const playGPaySuccessSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = "sine";
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.15, start + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
        osc.start(start);
        osc.stop(start + duration);
      };
      const now = ctx.currentTime;
      playTone(659.25, now, 0.4); // E5
      playTone(830.61, now + 0.12, 0.5); // G#5
    } catch (err) {
      console.log('Audio Context failed', err);
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    if (selectedPaymentMethod === 'gpay') {
      setGpayProcessingStep('idle');
      setShowGPaySheet(true);
    } else {
      await commitSubmittedInquiry('', false);
      setIsOrderSubmitted(true);
      setIsPaidViaGPay(false);
      setGpayTxnId('');
    }
  };

  const resetInquiry = () => {
    setCart([]);
    setIsOrderSubmitted(false);
    setIsCartOpen(false);
    setIsPaidViaGPay(false);
    setGpayTxnId('');
    setShowGPaySheet(false);
    setGpayProcessingStep('idle');
    setCustomerInfo({
      name: '',
      email: '',
      phone: '',
      consultationNotes: '',
      anupanaPreference: 'Warm Water'
    });
  };

  // Generate mock compilation code / reference
  const mockReferenceCode = useMemo(() => {
    return `MAB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  }, [isOrderSubmitted]);

  return (
    <div id="mab-catalog-app" className="min-h-screen bg-[#faf8f4] text-stone-800 font-sans antialiased selection:bg-amber-200">
      
      {/* 1. Header/Branding Area */}
      <header id="mab-header" className="relative border-b border-amber-800/10 bg-white/70 backdrop-blur-md">
        {/* Sanskrit Shloka Top Bar */}
        <div className="bg-[#4a3525] text-[#faf2e6] text-xs py-2 px-4 shadow-inner">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center gap-1.5 font-serif">
            <span className="tracking-wide font-medium italic">
              "स्वस्थस्य स्वास्थ्य रक्षणं आतुरस्य विकार प्रशमनं च"
            </span>
            <span className="text-[10px] md:text-xs opacity-90 tracking-widest font-mono flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
              ESTD. 1952 • TRADITIONAL AYURVEDIC FORMULARY
            </span>
          </div>
        </div>

        {/* Main Logo & Navigation details */}
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white flex items-center justify-center border-2 border-amber-400 shadow-sm overflow-hidden transform hover:scale-105 transition-transform duration-300 p-1 shrink-0">
                <img 
                  src={brandLogo} 
                  alt="Mangalam Ayurveda Logo" 
                  className="w-full h-full object-contain rounded-full" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-serif font-black text-amber-950 tracking-wide leading-none">
                  मङ्गलम् आयुर्वेद औषध भण्डार
                </h1>
                <p className="text-sm md:text-md text-amber-800/80 font-serif mt-1 italic font-medium">
                  Mangalam Ayurveda Aushadh Bhandar
                </p>
                <p className="text-[11px] md:text-sm text-amber-950 tracking-wider font-semibold font-serif mt-1 flex items-center justify-center md:justify-start gap-2 bg-amber-50/60 px-2.5 py-1 rounded-lg border border-amber-900/10 w-fit">
                  <img 
                    src={drSushilPhoto} 
                    alt="Dr. Sushil Chandra Gaur" 
                    className="w-6 h-6 rounded-full object-cover border border-amber-800/30 shadow-3xs"
                    referrerPolicy="no-referrer"
                  />
                  <span>Chief Vaidya: Dr. Sushil Chandra Gaur</span>
                </p>
                <p className="text-[10px] text-stone-500 tracking-wider font-mono mt-1 uppercase">
                  Traditional Compounding Pharmacy & Formulation Supervision
                </p>
              </div>
            </div>

            {/* Quick Contact & Status Widget + Auth section */}
            <div className="flex flex-col lg:flex-row items-stretch gap-4">
              <div className="grid grid-cols-2 gap-4 text-xs bg-[#fbf9f5] border border-amber-900/10 rounded-xl p-3 shadow-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-800" />
                  <div>
                    <p className="font-semibold text-stone-700">Aushadh Shala</p>
                    <p className="text-stone-500 text-[10px]">Rishikesh, Uttarakhand</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-800" />
                  <div>
                    <p className="font-semibold text-stone-700">Helpline</p>
                    <p className="text-stone-500 text-[10px]">9258240603</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-800" />
                  <div>
                    <p className="font-semibold text-stone-700">Compounding Hrs</p>
                    <p className="text-stone-500 text-[10px]">09:00 AM - 07:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-emerald-800" />
                  <div>
                    <p className="font-semibold text-emerald-800">Inquiry Basket</p>
                    <button 
                      onClick={() => setIsCartOpen(true)}
                      className="text-[10px] text-amber-800 font-bold hover:underline cursor-pointer"
                    >
                      {cart.length} item(s) selected
                    </button>
                  </div>
                </div>
              </div>

              {/* Dynamic User Profile / Auth Area */}
              <div className="bg-[#faf6f0] border border-amber-900/15 rounded-xl p-3 shadow-sm text-xs flex flex-col justify-center min-w-[210px]">
                {user ? (
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full overflow-hidden border border-amber-900/20 bg-white flex items-center justify-center shrink-0">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full bg-amber-100 flex items-center justify-center text-amber-850 font-serif font-black text-sm uppercase">
                          {(user.displayName || user.email || 'A')[0]}
                        </div>
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-serif font-black text-amber-950 text-[11px] uppercase tracking-tight leading-tight max-w-[130px] truncate">
                        {user.displayName || 'Ayurveda User'}
                      </p>
                      <p className="text-[9px] text-stone-500 font-mono tracking-wider truncate max-w-[130px] pt-0.5">
                        {user.email}
                      </p>
                      <button
                        onClick={handleSignOut}
                        className="text-[9px] font-mono font-black uppercase text-red-700 hover:text-red-900 hover:underline mt-1 flex items-center gap-0.5 cursor-pointer bg-transparent border-0 p-0"
                      >
                        Sign Out →
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5 w-full justify-center h-full">
                    <div className="flex items-center justify-center gap-1.5 text-center bg-amber-500/10 text-amber-950 text-[8.5px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded border border-amber-300/20">
                      <Sparkles className="w-2.5 h-2.5 text-amber-850" /> SECURE USER PORTAL
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                      <button
                        onClick={() => {
                          setAuthModalMode('signin');
                          setIsAuthModalOpen(true);
                        }}
                        className="bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 py-1.5 px-2.5 rounded-lg font-mono font-bold text-[9px] uppercase transition-all tracking-wider cursor-pointer flex items-center justify-center gap-1 shadow-3xs"
                      >
                        <LogIn className="w-2.5 h-2.5 text-amber-700" /> Log In
                      </button>
                      <button
                        onClick={() => {
                          setAuthModalMode('signup');
                          setIsAuthModalOpen(true);
                        }}
                        className="bg-amber-900 hover:bg-[#2d1b10] text-white py-1.5 px-2.5 rounded-lg font-mono font-bold text-[9px] uppercase transition-all tracking-wider cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                      >
                        <UserPlus className="w-2.5 h-2.5 text-amber-300" /> Sign Up
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sticky Main Navigation Selector */}
      <nav id="mab-main-navigation" className="bg-amber-950 text-[#faf2e6] border-b border-amber-900/35 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 flex justify-start items-center">
          <button
            onClick={() => setCurrentTab('home')}
            className={`px-5 py-4 font-serif font-black text-xs md:text-sm uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border-b-2 outline-none border-solid ${
              currentTab === 'home'
                ? 'border-amber-400 text-amber-300 bg-white/5 font-extrabold'
                : 'border-transparent text-stone-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Home className="w-4 h-4 text-amber-400" />
            Home
          </button>

          <button
            onClick={() => setCurrentTab('catalog')}
            className={`px-5 py-4 font-serif font-black text-xs md:text-sm uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border-b-2 outline-none border-solid ${
              currentTab === 'catalog'
                ? 'border-amber-400 text-amber-300 bg-white/5 font-extrabold'
                : 'border-transparent text-stone-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            Remedy Catalog
          </button>
          
          <button
            onClick={() => setCurrentTab('yoga')}
            className={`px-5 py-4 font-serif font-black text-xs md:text-sm uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border-b-2 outline-none border-solid ${
              currentTab === 'yoga'
                ? 'border-amber-400 text-amber-300 bg-white/5 font-extrabold'
                : 'border-transparent text-stone-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Wind className="w-4 h-4 text-amber-400" />
            Yogic Kriya &amp; Pranayam
          </button>

          <button
            onClick={() => setCurrentTab('about')}
            className={`px-5 py-4 font-serif font-black text-xs md:text-sm uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border-b-2 outline-none border-solid ${
              currentTab === 'about'
                ? 'border-amber-400 text-amber-300 bg-white/5 font-extrabold'
                : 'border-transparent text-stone-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Info className="w-4 h-4 text-amber-400" />
            About Us
          </button>

          <button
            onClick={() => setCurrentTab('join')}
            id="mab-nav-join-tab"
            className={`px-5 py-4 font-serif font-black text-xs md:text-sm uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border-b-2 outline-none border-solid ${
              currentTab === 'join'
                ? 'border-amber-400 text-amber-300 bg-white/5 font-extrabold'
                : 'border-transparent text-stone-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4 text-amber-400" />
            Join Us
          </button>
        </div>
      </nav>

      {/* 2. Educational Heritage Notice Banner */}
      <section className="bg-gradient-to-r from-amber-500/5 via-amber-600/10 to-amber-700/5 py-4 border-b border-amber-900/5">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-serif text-amber-950">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-700 shrink-0" />
            <p className="leading-relaxed">
              <strong>Authenticity Statement:</strong> Every botanical formula below is compounded using traditional Bhaishajya Kalpana texts (Sarangadhara Samhita &amp; Charaka Samhita). We employ genuine high-precision digital image placeholders next to each cataloged remedy to illustrate typical traditional packagings.
            </p>
          </div>
          <button 
            onClick={() => {
              setSelectedCategory('all');
              setSelectedIndication('all');
              setSearchQuery('');
              setIsFeaturedOnly(true);
            }} 
            className="shrink-0 bg-amber-800/10 hover:bg-amber-800/20 text-amber-900 font-semibold px-3 py-1.5 rounded-lg transition-colors border border-amber-800/20"
          >
            Show Seasonal Rejuvenatives (Rasayana)
          </button>
        </div>
      </section>

      {/* 3. Main Search & Catalog Hub */}
      <main className="max-w-7xl mx-auto px-4 py-8">

        {currentTab === 'home' && (
          <HomeSection 
            onTabChange={(tab) => setCurrentTab(tab)} 
            activeRituId={selectedSeason}
            userEmail={user?.email || undefined}
          />
        )}

        {currentTab === 'catalog' && (
          <>
            {/* Personalized Nadi Pariksha Quiz */}
        <section id="nadi-pariksha-quiz" className="mb-10 bg-white rounded-2xl border border-amber-950/15 overflow-hidden shadow-xs">
          
          {/* Header Strip */}
          <div className="bg-gradient-to-r from-amber-900 to-[#47220c] px-6 py-4 flex items-center justify-between text-white border-b border-amber-950/10">
            <div className="flex items-center gap-2.5">
              <Activity className="w-5 h-5 text-amber-300 animate-pulse text-left shrink-0" />
              <div className="text-left">
                <h2 className="font-serif font-black text-sm md:text-base tracking-wide uppercase text-amber-50 leading-tight">
                  Personalized Nadi Pariksha Quiz
                </h2>
                <p className="text-[10px] text-amber-250/70 font-mono font-bold tracking-wider uppercase leading-none mt-0.5">
                  5-Step Digital Pulse Assessment • Classical Constitutional Analysis
                </p>
              </div>
            </div>
            
            {activeQuizIndex !== -1 && (
              <button
                onClick={() => {
                  setActiveQuizIndex(-1);
                  setQuizAnswers([]);
                }}
                className="text-amber-200 hover:text-white text-[10px] font-mono font-bold flex items-center gap-1 bg-amber-950/40 hover:bg-amber-950/60 px-2.5 py-1.5 rounded-lg border border-amber-805/30 border-amber-800/30 transition-all cursor-pointer shadow-3xs"
              >
                <X className="w-3 h-3" /> Exit Assessment
              </button>
            )}
          </div>

          {activeQuizIndex === -1 ? (
            /* INTRO SCREEN */
            <div className="divide-y divide-amber-900/5">
              <div className="p-6 md:p-8 bg-gradient-to-b from-amber-50/45 to-white flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl text-left">
                  <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 font-sans font-black px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider border border-amber-300/30 shadow-3xs">
                    <Sparkles className="w-3 h-3 text-amber-700 animate-spin [animation-duration:3s]" /> Tridosha Wellness Assessment
                  </span>
                  <h3 className="font-serif font-black text-xl md:text-2xl text-stone-900 tracking-tight leading-tight">
                    Uncover your current Dosha Constitution (Vata, Pitta, or Kapha)
                  </h3>
                  <p className="text-stone-600 text-xs md:text-sm leading-relaxed font-serif">
                    In classical Bhaishajya scriptures, a person first receives <strong className="text-amber-900 font-bold">Nadi Pariksha</strong> (pulse assessment) to discover biological imbalances before compounding medication. Answer 5 simple wellness questions compiled by our Rishikesh Vaidyas to identify your core constitution and get custom remedy recommendations.
                  </p>
                  <div className="flex flex-wrap gap-3 text-[10px] text-stone-500 font-semibold font-mono pt-1">
                    <span className="flex items-center gap-1.5 bg-stone-50 px-2.5 py-1 rounded border border-stone-200 shadow-3xs">
                      🟢 Takes 2 Minutes
                    </span>
                    <span className="flex items-center gap-1.5 bg-stone-50 px-2.5 py-1 rounded border border-stone-200 shadow-3xs">
                      💡 Instantly Actionable
                    </span>
                    <span className="flex items-center gap-1.5 bg-stone-50 px-2.5 py-1 rounded border border-stone-200 shadow-3xs">
                      🎴 Real Catalogue Remedies
                    </span>
                  </div>
                </div>
                
                <div className="shrink-0 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveQuizIndex(0);
                      setQuizAnswers([]);
                    }}
                    className="w-full md:w-auto bg-amber-900 hover:bg-[#3d1c06] text-[#faf2e6] font-serif font-black text-xs px-6 py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer tracking-wider hover:scale-[1.02]"
                  >
                    Start Assessment <ChevronRight className="w-4 h-4 text-amber-300" />
                  </button>
                </div>
              </div>

              {/* Integrated Recharts Stats Dashboard */}
              <div className="p-6 md:p-8 bg-white/50 text-left space-y-4">
                <div className="max-w-3xl">
                  <span className="text-[9px] font-mono font-black text-amber-800 tracking-wider block mb-1 uppercase">
                    REGIONAL VITALITY ANALYTICS
                  </span>
                  <h4 className="font-serif font-black text-stone-900 text-sm md:text-base uppercase tracking-wide">
                    Community Tridosha Balance Dashboard
                  </h4>
                  <p className="text-stone-600 text-[11px] font-sans leading-relaxed mt-1">
                    Ayurvedic energetic constitutions vary depending on local environmental humidity, stress factors, and climate shifts. This dataset tracks compiled pulse assessments from our digital Nadi Pariksha. Start the test above to dynamically add your profile to our community statistics!
                  </p>
                </div>
                <DoshaDistributionChart history={quizHistory} />
              </div>
            </div>
          ) : activeQuizIndex >= 0 && activeQuizIndex < 5 ? (
            /* ACTIVE QUIZ QUESTION SCREEN */
            <div className="p-6 md:p-8 bg-[#faf7f2]/25 text-left">
              {/* Stepper progress info */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] uppercase font-mono font-black text-amber-900 tracking-widest bg-amber-55 bg-amber-100/60 px-2.5 py-0.5 rounded border border-amber-900/10 shadow-3xs">
                  Question {activeQuizIndex + 1} of 5
                </span>
                <span className="text-[10px] font-mono text-stone-500 font-bold">
                  {Math.round((activeQuizIndex / 5) * 100)}% Completed
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden mb-6 border border-stone-200/50">
                <div 
                  className="h-full bg-gradient-to-r from-amber-700 to-amber-900 rounded-full transition-all duration-300"
                  style={{ width: `${(activeQuizIndex / 5) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <div className="space-y-1 mb-6 text-left">
                <h4 className="font-serif font-black text-base md:text-lg text-stone-900 leading-tight">
                  {QUIZ_QUESTIONS[activeQuizIndex].question}
                </h4>
                <p className="text-stone-500 text-xs italic font-serif">
                  {QUIZ_QUESTIONS[activeQuizIndex].description}
                </p>
              </div>

              {/* Option List */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-6">
                {QUIZ_QUESTIONS[activeQuizIndex].options.map((opt, oIdx) => {
                  const isSelected = quizAnswers[activeQuizIndex] === opt.value;
                  return (
                    <div
                      key={oIdx}
                      onClick={() => {
                        const newAns = [...quizAnswers];
                        newAns[activeQuizIndex] = opt.value;
                        setQuizAnswers(newAns);
                        
                        // Proceed to next step automatically or let them hit next
                        setTimeout(() => {
                          setActiveQuizIndex(prev => prev + 1);
                        }, 250);
                      }}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between text-left group ${
                        isSelected 
                          ? 'bg-amber-950 border-amber-950 text-white shadow-md' 
                          : 'bg-white border-amber-900/10 text-stone-800 hover:border-amber-800/30 hover:bg-stone-50/60'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between pointer-events-none">
                          <span className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded ${
                            isSelected ? 'bg-amber-900 text-amber-100' : 'bg-amber-50 text-amber-900'
                          }`}>
                            Option {opt.value}
                          </span>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-amber-300 bg-amber-900' : 'border-stone-300 group-hover:border-amber-900/50'
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-amber-300" />}
                          </div>
                        </div>
                        <h5 className="font-serif font-black text-sm text-inherit">
                          {opt.label}
                        </h5>
                        <p className={`text-[11px] leading-relaxed font-serif ${
                          isSelected ? 'text-amber-100/90' : 'text-stone-500'
                        }`}>
                          {opt.sub}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Navigation Back */}
              <div className="flex justify-between items-center border-t border-stone-100 pt-4">
                <button
                  type="button"
                  disabled={activeQuizIndex === 0}
                  onClick={() => setActiveQuizIndex(prev => prev - 1)}
                  className={`text-xs font-bold font-serif px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    activeQuizIndex === 0 
                      ? 'text-stone-300 border-stone-200 cursor-not-allowed bg-stone-50' 
                      : 'text-stone-700 border-stone-300 hover:bg-stone-50 hover:text-stone-900 bg-white'
                  }`}
                >
                  ← Previous Question
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveQuizIndex(-1);
                    setQuizAnswers([]);
                  }}
                  className="text-stone-400 hover:text-stone-600 text-xs font-mono font-semibold cursor-pointer"
                >
                  Reset & Cancel
                </button>
              </div>
            </div>
          ) : (
            /* RESULTS SCREEN */
            (() => {
              const countA = quizAnswers.filter(x => x === 'A').length;
              const countB = quizAnswers.filter(x => x === 'B').length;
              const countC = quizAnswers.filter(x => x === 'C').length;

              let dominantDosha = 'Vata';
              let subtitle = 'Air & Space bio-elements dominant';
              let description = 'Your responses reflect a dominantly Vata-oriented state (or Vata Vikriti), which is marked by qualities of coldness, dryness, and active movement. Restoring harmony requires warm, deeply nourishing, and lubricating formulas to ground your active nervous system.';
              let remedyIds = ['p8', 'p4', 'p10'];

              if (countB > countA && countB >= countC) {
                dominantDosha = 'Pitta';
                subtitle = 'Fire & Water bio-elements dominant';
                description = 'Your responses suggest a dominantly Pitta-oriented state (or Pitta Vikriti), which represents heat, translation, and metabolism. Restoring biological balance requires cooling, liver-supportive bitter tonics, metabolic cleansers, and soothing remedies.';
                remedyIds = ['p9', 'p5', 'p6'];
              } else if (countC > countA && countC > countB) {
                dominantDosha = 'Kapha';
                subtitle = 'Earth & Water bio-elements dominant';
                description = 'Your responses indicate a dominantly Kapha-oriented state (or Kapha Vikriti), representing structure, lubrication, and stability. Restoring your system requires light, heating, stimulating remedies that clear heavy fluids, boost immunity, and metabolize sluggishness.';
                remedyIds = ['p3', 'p2', 'p1'];
              }

              const recommendedProducts = PRODUCTS.filter(p => remedyIds.includes(p.id));

              return (
                <div className="p-6 md:p-8 bg-[#faf7f2]/15 text-left">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Constitutional breakdown */}
                    <div className="lg:col-span-5 bg-gradient-to-b from-[#fbf9f4] to-white p-5 rounded-xl border border-amber-900/10 space-y-4 text-left">
                      <div className="text-center pb-4 border-b border-amber-900/10">
                        <span className="text-[9px] font-mono font-black text-amber-800 tracking-wider block mb-1 uppercase">
                          YOUR CALCULATED DOSHA STATE
                        </span>
                        <h4 className="font-serif font-black text-2xl text-amber-950 uppercase tracking-tight">
                          {dominantDosha} CONSTITUTION
                        </h4>
                        <p className="text-[10px] font-mono font-semibold text-stone-500 italic uppercase">
                          {subtitle}
                        </p>
                      </div>

                      <div className="space-y-4 text-left">
                        <p className="text-stone-600 font-serif leading-relaxed text-[12px]">
                          {description}
                        </p>

                        {/* Scores chart / bars */}
                        <div className="space-y-2 border-t border-dashed border-stone-200 pt-3">
                          <label className="text-[9px] font-mono font-black uppercase text-stone-400 block tracking-wider">
                            Assessment Distribution (Dosha Score)
                          </label>
                          
                          {/* Vata Bar */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px] font-serif font-bold text-stone-700">
                              <span>Vata (Dry / Airy / Cold)</span>
                              <span className="font-mono text-xs">{countA} / 5</span>
                            </div>
                            <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200/40">
                              <div className="bg-amber-600 h-full rounded-full" style={{ width: `${(countA / 5) * 100}%` }} />
                            </div>
                          </div>

                          {/* Pitta Bar */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px] font-serif font-bold text-stone-700">
                              <span>Pitta (Hot / Acidic / Sharp)</span>
                              <span className="font-mono text-xs">{countB} / 5</span>
                            </div>
                            <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200/40">
                              <div className="bg-rose-500 h-full rounded-full" style={{ width: `${(countB / 5) * 100}%` }} />
                            </div>
                          </div>

                          {/* Kapha Bar */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px] font-serif font-bold text-stone-700">
                              <span>Kapha (Heavy / Moist / Slow)</span>
                              <span className="font-mono text-xs">{countC} / 5</span>
                            </div>
                            <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200/40">
                              <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${(countC / 5) * 100}%` }} />
                            </div>
                          </div>
                        </div>

                        {/* Recommendation advice */}
                        <div className="bg-amber-50 p-3 rounded-lg border border-amber-900/10 text-[10px] text-amber-900 leading-relaxed font-serif">
                          <strong>Vaidyas Advice:</strong> To normalize this specific state, integrate the recommended herbs below directly into your seasonal regimen. Always consume alongside the advised carrier vehicles (Anupana).
                        </div>
                      </div>

                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveQuizIndex(0);
                            setQuizAnswers([]);
                          }}
                          className="w-full bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-300 font-mono font-bold text-[10px] py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer uppercase shadow-3xs"
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> Retake Nadi Pariksha Quiz
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => generateReportPDF(
                            dominantDosha,
                            subtitle,
                            description,
                            { vata: countA, pitta: countB, kapha: countC },
                            recommendedProducts
                          )}
                          className="w-full bg-[#fbf5eb] hover:bg-[#f6ebdc] text-amber-950 border border-amber-900/20 font-mono font-bold text-[10px] py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer uppercase shadow-3xs hover:border-amber-900/30"
                        >
                          <Download className="w-3.5 h-3.5 text-amber-600 animate-bounce animate-duration-1000" /> Download Constitutional Report (PDF)
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSaveReportToDrive(
                            dominantDosha,
                            subtitle,
                            description,
                            { vata: countA, pitta: countB, kapha: countC },
                            recommendedProducts
                          )}
                          disabled={isUploadingToDrive}
                          className="w-full bg-[#f4ebd0] hover:bg-[#ebdcae] disabled:bg-stone-100 text-[#2c1b10] border border-amber-900/35 font-mono font-bold text-[10px] py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer uppercase shadow-3xs"
                        >
                          <Cloud className={`w-3.5 h-3.5 ${isUploadingToDrive ? 'animate-spin text-amber-800' : 'text-amber-905'}`} />
                          {isUploadingToDrive ? 'Saving to Google Drive...' : driveToken ? 'Save to Google Drive' : 'Connect & Save to Drive'}
                        </button>

                        {driveUploadSuccess && driveUploadFileLink && (
                          <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-lg text-[10.5px] font-serif flex flex-col gap-1 text-center animate-fadeIn">
                            <span className="font-bold flex items-center justify-center gap-1 text-emerald-800">
                              <CheckCircle className="w-3.5 h-3.5" />
                              SUCCESSFULLY SAVED TO DRIVE!
                            </span>
                            <a 
                              href={driveUploadFileLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              referrerPolicy="no-referrer"
                              className="text-amber-900 hover:text-amber-950 font-black tracking-wide font-mono uppercase underline flex items-center justify-center gap-1"
                            >
                              Open file in Drive <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}

                        {driveUploadError && (
                          <div className="p-2.5 bg-red-50 border border-red-200 text-red-950 rounded-lg text-[10.5px] font-serif text-center animate-fadeIn">
                            <strong className="font-bold">Drive Sync error:</strong> {driveUploadError}
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => setShowCommunityStats(prev => !prev)}
                          className={`w-full font-mono font-bold text-[10px] py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer uppercase shadow-3xs ${
                            showCommunityStats 
                              ? 'bg-amber-900 border border-amber-950 text-white' 
                              : 'bg-white hover:bg-stone-50 text-stone-700 border border-stone-300'
                          }`}
                        >
                          <Activity className="w-3.5 h-3.5 text-amber-500 animate-pulse animate-duration-1000 shrink-0" />
                          {showCommunityStats ? 'Hide Community Stats' : 'Compare Community Stats'}
                        </button>
                      </div>
                    </div>

                    {/* Right Column: Recommended products */}
                    <div className="lg:col-span-7 space-y-4 text-left">
                      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
                        <Heart className="w-4 h-4 text-amber-850 text-amber-900" />
                        <h4 className="font-serif font-black text-stone-950 text-xs md:text-sm uppercase tracking-wide">
                          Recommended Compounding Remedies For Your Tridosha State
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {recommendedProducts.map(product => {
                          const isAdded = quizAddedId === product.id;
                          return (
                            <div 
                              key={product.id}
                              className="bg-white rounded-xl border border-amber-955/10 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-amber-800/25 flex flex-col justify-between group bg-gradient-to-b from-white to-[#faf9f6]/30"
                            >
                              <div className="relative overflow-hidden shrink-0 h-24 bg-stone-55/60 flex items-center justify-center p-2 border-b border-stone-100">
                                <div className="transition-transform duration-500 group-hover:scale-[1.03]">
                                  <ProductPlaceholderImage 
                                    product={product} 
                                    size="sm" 
                                    className="max-h-20 object-contain mx-auto"
                                  />
                                </div>
                                <span className="absolute top-1.5 right-1.5 text-[8px] px-1.5 py-0.5 rounded-sm bg-stone-900/60 text-white font-mono uppercase">
                                  {product.category.replace('-', ' & ')}
                                </span>
                              </div>

                              <div className="p-3 flex-1 flex flex-col justify-between text-left">
                                <div className="space-y-1 mb-3 text-left">
                                  <div className="flex justify-between items-start gap-1">
                                    <h5 className="font-serif font-black text-stone-900 group-hover:text-amber-900 transition-colors text-xs leading-tight line-clamp-1 flex-1">
                                      {product.name}
                                    </h5>
                                    <span className="font-black text-amber-950 text-xs font-mono shrink-0">
                                      ₹{product.price}
                                    </span>
                                  </div>
                                  <p className="text-[9px] text-amber-805/85 text-amber-800 font-serif leading-none italic font-medium">
                                    {product.sanskritName}
                                  </p>
                                  <p className="text-stone-550 text-stone-500 text-[10px] leading-relaxed line-clamp-3 font-serif min-h-[45px]">
                                    {product.description}
                                  </p>
                                </div>

                                <div className="space-y-1.5 mt-auto">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedProduct(product)}
                                    className="w-full text-stone-600 hover:text-[#3d1c06] hover:bg-stone-50 transition-all py-1 px-2 rounded-md border border-stone-200 text-[9px] font-bold flex items-center gap-1 justify-center bg-white cursor-pointer shadow-3xs"
                                  >
                                    <Info className="w-3 h-3 text-amber-800" /> Recipe Details
                                  </button>
                                  
                                  <button
                                    type="button"
                                    onClick={() => {
                                      addToCart(product, product.sizeOptions[0]);
                                      setQuizAddedId(product.id);
                                      setTimeout(() => setQuizAddedId(null), 2000);
                                    }}
                                    className={`w-full py-1.5 px-2 rounded-md text-[9px] font-black flex items-center gap-1 justify-center transition-all cursor-pointer shadow-3xs ${
                                      isAdded 
                                        ? 'bg-emerald-700 text-white shadow-xs animate-pulse'
                                        : 'bg-amber-900 hover:bg-[#2d1b10] text-[#faf2e6]'
                                    }`}
                                  >
                                    {isAdded ? (
                                      <>
                                        <CheckCircle2 className="w-3 h-3 text-emerald-100" /> Added to Basket
                                      </>
                                    ) : (
                                      <>
                                        <Plus className="w-3 h-3" /> Add to Basket
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                    </div>

                  </div>

                  {showCommunityStats && (
                    <div className="mt-8 pt-6 border-t border-dashed border-[#e7e5e4]">
                      <div className="mb-4 text-left">
                        <h4 className="font-serif font-black text-stone-900 text-xs md:text-sm uppercase tracking-wide">
                          Comparing Your Results to Community Distribution
                        </h4>
                        <p className="text-stone-500 text-[10px] font-mono uppercase mt-0.5">
                          How your calculated {dominantDosha} energetic state stacks up against total local pulse evaluations
                        </p>
                      </div>
                      <DoshaDistributionChart history={quizHistory} />
                    </div>
                  )}

                </div>
              );
            })()
          )}
        </section>

        {/* Grid layout for Dashboard Filters + Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* A. Sidebar Filter Controls (1 Column wide on desktop) */}
          <aside id="catalog-sidebar-filters" className="space-y-6 lg:col-span-1">
            
            {/* Search Input Box */}
            <div className="bg-white rounded-xl p-5 border border-amber-900/15 shadow-xs">
              <h3 className="font-serif text-lg font-bold text-amber-950 mb-3 flex items-center gap-2">
                <Search className="w-4 h-4 text-amber-800" />
                Quick Formulary Search
              </h3>
              <div className="relative" ref={searchContainerRef}>
                <input
                  type="text"
                  placeholder="e.g., Shilajit, Triphala, Joints..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                    setActiveSuggestionIndex(-1);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={handleSearchKeyDown}
                  className="w-full bg-[#fdfdfc] border border-stone-300 rounded-lg py-2 pl-3 pr-10 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-700/30 focus:border-amber-700"
                />
                {searchQuery && (
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setShowSuggestions(false);
                      setActiveSuggestionIndex(-1);
                    }}
                    className="absolute right-2 top-2.5 text-stone-400 hover:text-stone-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {/* REAL-TIME QUICK SEARCH SUGGESTION DROPDOWN */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 z-50 mt-1 max-h-64 overflow-y-auto bg-white border border-stone-200 shadow-xl rounded-lg divide-y divide-stone-100">
                    {searchSuggestions.map((product, idx) => {
                      const isHighlighted = idx === activeSuggestionIndex;
                      return (
                        <div
                          key={product.id}
                          onClick={() => {
                            setSearchQuery(product.name);
                            setShowSuggestions(false);
                          }}
                          onMouseEnter={() => setActiveSuggestionIndex(idx)}
                          className={`flex items-center justify-between px-3.5 py-2.5 cursor-pointer transition-colors duration-150 ${
                            isHighlighted ? 'bg-amber-50 text-amber-950' : 'text-stone-700 hover:bg-stone-50'
                          }`}
                        >
                          <div className="flex flex-col min-w-0 pr-2">
                            <span className="text-xs font-serif font-bold truncate leading-tight">
                              {product.name}
                            </span>
                            <span className="text-[10px] text-amber-800/80 italic font-medium leading-none mt-0.5">
                              {product.sanskritName}
                            </span>
                          </div>
                          
                          <div className="text-right flex items-center gap-1.5 shrink-0">
                            {product.category === 'Asava-Arishta' && (
                              <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded-sm bg-blue-100 text-blue-800 font-bold">Arishta</span>
                            )}
                            {product.category === 'Vati-Gutika' && (
                              <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-800 font-bold">Vati</span>
                            )}
                            {product.category === 'Churna' && (
                              <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded-sm bg-amber-100 text-amber-900 font-bold">Churna</span>
                            )}
                            {product.category === 'Rasayana-Lehya' && (
                              <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded-sm bg-purple-100 text-purple-800 font-bold">Rasayana</span>
                            )}
                            {product.category === 'Taila-Ghrita' && (
                              <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded-sm bg-amber-200 text-amber-950 font-bold">Taila</span>
                            )}
                            {product.category === 'Bhasma' && (
                              <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded-sm bg-rose-100 text-rose-800 font-bold">Bhasma</span>
                            )}
                            <span className="text-[10px] font-mono text-stone-400">
                              ₹{product.price}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <p className="text-[10px] text-stone-500 mt-2">
                Matches remedy name, sanskrit scriptures, ingredients, and medicinal indications.
              </p>
            </div>

            {/* Seasonally Recommended (Ayurvedic Ritus) */}
            <div className="bg-white rounded-xl p-5 border border-amber-900/15 shadow-xs">
              <h3 className="font-serif text-lg font-bold text-amber-950 mb-2.5 flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-800" />
                  Seasonal Rhythms (ऋतु)
                </span>
                <span className="text-[10px] bg-red-10 px-2 py-0.5 rounded-full animate-pulse flex items-center gap-1 text-red-850 font-black tracking-wide border border-red-300">
                  ⬤ Live Ritu
                </span>
              </h3>
              <p className="text-[11px] text-stone-500 mb-4 leading-relaxed">
                Indian medicine aligns healing to the 6 classical seasons. Select a Ritu to list remedies traditionally prescribed to balance the active dosha.
              </p>

              {/* Ritu Active Selector Card */}
              <div className="mb-4 p-3 rounded-lg bg-amber-50/50 border border-amber-200/50 text-xs text-amber-955">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-[10px] text-amber-900 uppercase tracking-widest">Active Season:</span>
                  <button 
                    onClick={() => setSelectedSeason(getCurrentRituId())} 
                    className="font-mono text-[9px] underline font-black text-amber-700 hover:text-amber-950 focus:outline-none cursor-pointer border-none bg-transparent"
                    title="Jump to current season"
                  >
                    Quick Filter to {RITUS.find(r => r.id === getCurrentRituId())?.name} ✦
                  </button>
                </div>
                {(() => {
                  const currRitu = RITUS.find(r => r.id === getCurrentRituId());
                  return currRitu ? (
                    <div className="space-y-1 text-left">
                      <div className="flex items-center gap-1.5 font-serif font-black text-sm text-amber-955">
                        {currRitu.name} ({currRitu.sanskritName}) - <span className="font-sans font-medium text-xs text-stone-600">{currRitu.englishSeason}</span>
                      </div>
                      <p className="text-[10px] text-stone-600 leading-relaxed font-serif italic">
                        "{currRitu.months} | {currRitu.recommendedApproach}"
                      </p>
                    </div>
                  ) : null;
                })()}
              </div>

              <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                {RITUS.map(ritu => {
                  const isCurrent = ritu.id === getCurrentRituId();
                  const isSelected = selectedSeason === ritu.id;
                  return (
                    <button
                      key={ritu.id}
                      onClick={() => setSelectedSeason(ritu.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 flex items-center justify-between cursor-pointer border-none ${
                        isSelected
                          ? 'bg-amber-950 text-[#faf2e6] shadow-xs translate-x-1 font-bold'
                          : 'text-stone-700 hover:bg-stone-50 hover:text-stone-950'
                      }`}
                    >
                      <div className="flex flex-col text-left">
                        <div className="flex items-center gap-1.5 animate-none">
                          <span className="font-semibold">{ritu.name}</span>
                          <span className="text-[10px] text-amber-700/80 font-serif">({ritu.sanskritName})</span>
                          {isCurrent && (
                            <span className="text-[8px] bg-red-100 text-red-800 font-extrabold px-1 rounded-sm uppercase tracking-wide">
                              Current
                            </span>
                          )}
                        </div>
                        <span className={`text-[10px] leading-tight mt-0.5 ${
                          isSelected ? 'text-amber-250' : 'text-stone-400'
                        }`}>
                          {ritu.englishSeason} • {ritu.months}
                        </span>
                      </div>
                      {productCountForSeason(ritu.id) > 0 && (
                        <span className={`text-[10px] py-0.5 px-2 rounded-full font-bold ml-1 ${
                          isSelected ? 'bg-amber-800 text-white' : 'bg-stone-100 text-[#713f12]'
                        }`}>
                          {productCountForSeason(ritu.id)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ayurvedic Categories List */}
            <div className="bg-white rounded-xl p-5 border border-amber-900/15 shadow-xs">
              <h3 className="font-serif text-lg font-bold text-amber-950 mb-3 flex items-center gap-2">
                <Filter className="w-4 h-4 text-amber-800" />
                Anatomical Categories
              </h3>
              <div className="space-y-1.5">
                {CATEGORIES.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 flex items-center justify-between ${
                      selectedCategory === category.id
                        ? 'bg-amber-900 text-[#faf2e6] shadow-xs translate-l-1'
                        : 'text-stone-700 hover:bg-stone-50 hover:text-amber-950'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span>{category.name}</span>
                      {category.id !== 'all' && (
                        <span className={`text-[10px] leading-none mt-0.5 italic ${
                          selectedCategory === category.id ? 'text-amber-200' : 'text-stone-400'
                        }`}>
                          {category.desc}
                        </span>
                      )}
                    </div>
                    {productCountForCategory(category.id) > 0 && (
                      <span className={`text-[10px] py-0.5 px-2 rounded-full font-bold ml-1 ${
                        selectedCategory === category.id ? 'bg-amber-800 text-white' : 'bg-stone-100 text-[#713f12]'
                      }`}>
                        {productCountForCategory(category.id)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Therapeutic Indication Filter */}
            <div className="bg-white rounded-xl p-5 border border-amber-900/15 shadow-xs">
              <h3 className="font-serif text-lg font-bold text-amber-950 mb-2.5 flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-800" />
                Target Indications
              </h3>
              <p className="text-[11px] text-stone-500 mb-3 leading-relaxed">
                Filter remedies by diagnosed physical, somatic, or spiritual bodily functions.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedIndication('all')}
                  className={`px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                    selectedIndication === 'all'
                      ? 'bg-amber-100 text-amber-950 border border-amber-300'
                      : 'bg-[#fcfbf9] text-stone-600 border border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  All Indications
                </button>
                {INDICATIONS.map(ind => (
                  <button
                    key={ind}
                    onClick={() => setSelectedIndication(ind)}
                    className={`px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                      selectedIndication === ind
                        ? 'bg-amber-100 text-amber-950 border border-amber-300'
                        : 'bg-[#fcfbf9] text-stone-600 border border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured State Toggle & Stats */}
            <div className="bg-[#fcfbf9] rounded-xl p-5 border border-amber-950/10 space-y-4">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isFeaturedOnly}
                  onChange={(e) => setIsFeaturedOnly(e.target.checked)}
                  className="rounded-sm border-stone-300 text-amber-800 focus:ring-amber-700/40 w-4 h-4"
                />
                <span className="text-xs md:text-sm font-medium text-amber-950">
                  ⭐️ Only Show Sages' Selections
                </span>
              </label>

              <hr className="border-amber-900/5" />

              <div className="text-xs text-stone-600 space-y-2">
                <div className="flex justify-between">
                  <span>Remedies Cataloged:</span>
                  <span className="font-semibold text-stone-900">{PRODUCTS.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Filtered Matches:</span>
                  <span className="font-semibold text-[#8a5a36]">{filteredProducts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Compounded On-Site:</span>
                  <span className="font-semibold text-emerald-700">100% Verified</span>
                </div>
              </div>
            </div>

          </aside>

          {/* B. Main Catalogue Listings (3 Columns wide on desktop) */}
          <section id="catalog-listing-hub" className="space-y-6 lg:col-span-3">
            
            {/* Daily Ayurvedic Wisdom Component */}
            <DailyAyurvedicWisdom />

            {/* Seasonal Ritucharya Guidance Banner */}
            <SeasonalWellnessBanner 
              selectedSeason={selectedSeason} 
              onClearSeason={() => setSelectedSeason('all')} 
            />
            
            {/* Display / Layout Settings Ribbon */}
            <div className="bg-white rounded-xl px-5 py-4 border border-amber-900/15 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <p className="text-sm font-medium text-stone-500">
                  Showing <strong className="text-[#8a5a36]">{filteredProducts.length}</strong> Ayurvedic products based on your criteria
                </p>
                {/* Active filters breadcrumbs */}
                {(selectedCategory !== 'all' || selectedIndication !== 'all' || selectedSeason !== 'all' || searchQuery || isFeaturedOnly) && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedCategory !== 'all' && (
                      <span className="text-[10px] bg-amber-50 text-amber-900 px-2 py-0.5 rounded-sm border border-amber-200">
                        Category: {selectedCategory}
                      </span>
                    )}
                    {selectedIndication !== 'all' && (
                      <span className="text-[10px] bg-amber-50 text-amber-900 px-2 py-0.5 rounded-sm border border-amber-200">
                        Indication: {selectedIndication}
                      </span>
                    )}
                    {selectedSeason !== 'all' && (
                      <span className="text-[10px] bg-amber-55 text-amber-900 px-2 py-0.5 rounded-sm border border-amber-200">
                        Ritu: {RITUS.find(r => r.id === selectedSeason)?.name || selectedSeason}
                      </span>
                    )}
                    {searchQuery && (
                      <span className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-sm font-semibold">
                        Query: "{searchQuery}"
                      </span>
                    )}
                    {isFeaturedOnly && (
                      <span className="text-[10px] bg-yellow-50 text-yellow-900 px-2 py-0.5 rounded-sm border border-yellow-200">
                        Sage Pick
                      </span>
                    )}
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setSelectedIndication('all');
                        setSelectedSeason('all');
                        setSearchQuery('');
                        setIsFeaturedOnly(false);
                      }}
                      className="text-[10px] text-amber-800 font-bold hover:underline ml-1 cursor-pointer bg-transparent border-none"
                    >
                      Clear All
                    </button>
                  </div>
                )}
              </div>

              {/* Sorting & Layout Toggle Action Block */}
              <div id="mab-catalog-controls" className="flex flex-wrap items-center gap-4 w-full sm:w-auto overflow-visible justify-end">
                {/* Sorting Select Dropdown */}
                <div id="mab-catalog-sort-wrapper" className="flex items-center gap-2">
                  <span className="text-xs font-medium text-stone-550 flex items-center gap-1 shrink-0 font-sans">
                    <ArrowDownAZ className="w-3.5 h-3.5 text-amber-800" /> Sort:
                  </span>
                  <select
                    id="mab-catalog-sort-dropdown"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="text-xs bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-md py-1.5 px-3 focus:outline-none focus:border-amber-800 focus:ring-1 focus:ring-amber-800/10 text-stone-700 cursor-pointer font-sans transition-all"
                  >
                    <option value="default">Default / Recom.</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="alphabetical">Alphabetical (A-Z)</option>
                  </select>
                </div>

                {/* Layout Toggle Option */}
                <div id="mab-catalog-view-toggle" className="flex items-center gap-2 border border-stone-200 rounded-md p-0.5 shrink-0 bg-stone-50">
                  <button
                    id="mab-view-list-btn"
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-xs transition-all cursor-pointer ${
                      viewMode === 'list'
                        ? 'bg-amber-900 text-[#faf2e6] shadow-xs'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                    title="List View (Side-by-Side Image Placeholders)"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    id="mab-view-grid-btn"
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-xs transition-all cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-amber-900 text-[#faf2e6] shadow-xs'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                    title="Grid View (Top Visual Placeholders)"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* C. Products Iterative Representation */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl py-20 text-center border border-amber-900/10 shadow-xs">
                <Leaf className="w-12 h-12 text-stone-300 mx-auto stroke-[1.2] animate-bounce" />
                <h4 className="text-xl font-serif font-semibold text-stone-700 mt-4">No Ayurvedic Remedies Found</h4>
                <p className="text-stone-500 text-sm max-w-md mx-auto mt-2">
                  We currently lack compiled formulations matching those exact search parameters. Try adjusting your category choice or contact our vaidyas directly.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedIndication('all');
                    setIsFeaturedOnly(false);
                  }}
                  className="mt-6 bg-amber-900 text-white font-medium py-2 px-5 rounded-lg text-xs md:text-sm hover:bg-stone-800 transition-colors"
                >
                  Reset Diagnostics Settings
                </button>
              </div>
            ) : viewMode === 'list' ? (
              /* --- LIST REPRESENTATION --- (Side-by-side placeholder image focus) */
              <motion.div layout className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map(product => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      key={product.id}
                      id={`product-row-${product.id}`}
                      className="bg-white rounded-xl border border-amber-900/15 p-5 transition-all hover:border-amber-800/40 hover:shadow-xs group flex flex-col md:flex-row gap-6 relative"
                    >
                      {/* Sage Pick ribbon badge */}
                      {product.featured && (
                        <span className="absolute -top-2 flex items-center gap-1 -left-2 bg-gradient-to-r from-yellow-600 to-amber-700 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-tr-lg rounded-bl-lg shadow-sm font-mono tracking-widest uppercase">
                          ★ SAGE RECOMMENDED
                        </span>
                      )}

                      {/* Left Hand: High Fidelity Placeholder Image (next to listing) */}
                      <div className="shrink-0 flex items-center justify-center">
                        <ProductPlaceholderImage 
                          product={product} 
                          size="md" 
                          className="w-full md:w-48 overflow-hidden rounded-lg"
                        />
                      </div>

                      {/* Right Hand: Product Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          {/* Categories and Sanskrit details */}
                          <div className="flex flex-wrap justify-between items-start gap-2">
                            <div className="text-xs font-mono uppercase bg-[#fbf9f4] border border-amber-900/10 px-2 py-0.5 rounded-sm font-semibold tracking-wider text-amber-950">
                              {product.category.replace('-', ' & ')}
                            </div>
                            {product.stock < 5 ? (
                              <span className="text-[10px] text-red-700 bg-red-50 border border-red-200 py-0.5 px-2 rounded font-extrabold font-mono flex items-center gap-1 animate-pulse">
                                <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                                LOW STOCK: ONLY {product.stock} LEFT
                              </span>
                            ) : product.stock <= 15 ? (
                              <span className="text-[10px] text-amber-700 bg-amber-50 py-0.5 px-2 rounded font-semibold font-mono">
                                ONLY {product.stock} BOTTLES LEFT
                              </span>
                            ) : null}
                          </div>

                          {/* Title & Price */}
                          <div className="mt-2.5 flex justify-between items-baseline gap-4">
                            <h2 className="text-lg md:text-xl font-serif font-bold text-stone-900 group-hover:text-amber-900 transition-colors">
                              {product.name} <span className="text-stone-500 font-serif font-normal text-sm md:text-base ml-1.5">({product.sanskritName})</span>
                            </h2>
                            <div className="text-right text-stone-900 shrink-0">
                              <span className="text-xs text-stone-400 font-serif line-through mr-1">
                                ₹{Math.floor(product.price * 1.15)}
                              </span>
                              <span className="text-lg font-bold font-mono text-amber-950">
                                ₹{product.price}
                              </span>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-stone-600 text-xs md:text-sm mt-2 leading-relaxed">
                            {product.description}
                          </p>

                          {/* Targets of cure */}
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {product.indications.map(ind => (
                              <span
                                key={ind}
                                className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-sm font-semibold hover:bg-amber-100 hover:text-amber-900 transition-colors"
                              >
                                ✚ {ind}
                              </span>
                            ))}
                          </div>

                          {/* Recommended Seasons (Ritus) */}
                          <div className="flex flex-wrap gap-1.5 mt-3 items-center">
                            <span className="text-[10px] font-mono text-stone-400 mr-2 uppercase tracking-wide">Seasonal Alignment (Ritu):</span>
                            {product.seasons.map(sid => {
                              const r = RITUS.find(ritu => ritu.id === sid);
                              const isCurrent = sid === getCurrentRituId();
                              return r ? (
                                <span 
                                  key={sid} 
                                  className={`text-[10px] px-2 py-0.5 rounded font-serif italic border ${
                                    isCurrent 
                                      ? 'bg-red-50 text-red-900 border-red-200 font-extrabold' 
                                      : 'bg-amber-50 text-amber-900 border-amber-900/10'
                                  }`}
                                  title={`${r.name} Ritu (${r.englishSeason}) — ${r.recommendedApproach}`}
                                >
                                  {r.name} {isCurrent ? '• Active' : ''}
                                </span>
                              ) : null;
                            })}
                          </div>
                        </div>

                        {/* Action trigger deck */}
                        <div className="mt-5 pt-4 border-t border-dotted border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                          <div className="text-[11px] text-stone-500 leading-none">
                            <strong>Active Formula:</strong> {product.ingredients[0].name} ({product.ingredients[0].proportion}), {product.ingredients[1]?.name || ''}...
                          </div>
                          <div className="flex gap-2 w-full sm:w-auto shrink-0 justify-end">
                            <button
                              onClick={() => toggleCompare(product)}
                              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border ${
                                isCompared(product.id)
                                  ? 'bg-[#fbf9f4] text-amber-950 border-amber-900/30 font-extrabold'
                                  : 'text-stone-700 bg-stone-100 border-transparent hover:bg-stone-200 hover:text-stone-950'
                              }`}
                              title={isCompared(product.id) ? 'Staged for side-by-side comparison' : 'Staged for Ayurvedic comparison'}
                            >
                              <ArrowLeftRight className={`w-3.5 h-3.5 ${isCompared(product.id) ? 'text-amber-900 animate-pulse' : 'text-stone-500'}`} /> 
                              {isCompared(product.id) ? 'Staged' : 'Compare'}
                            </button>
                            <button
                              onClick={() => setSelectedProduct(product)}
                              className="flex-1 sm:flex-none text-stone-700 bg-stone-100 hover:bg-stone-200 hover:text-stone-950 transition-colors px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
                            >
                              <Info className="w-3.5 h-3.5" /> Details
                            </button>
                            <button
                              onClick={() => addToCart(product, product.sizeOptions[0])}
                              className="flex-1 sm:flex-none bg-amber-900 hover:bg-[#2e2015] text-[#faf2e6] transition-colors px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm"
                            >
                              <Plus className="w-3.5 h-3.5" /> Add to Basket
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              /* --- GRID REPRESENTATION --- */
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map(product => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      key={product.id}
                      className="bg-white rounded-xl border border-amber-950/10 overflow-hidden hover:shadow-lg hover:border-amber-800/35 group flex flex-col justify-between bg-gradient-to-b from-white to-stone-55/20 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div>
                        {/* Top Placeholder Image block */}
                        <div className="relative overflow-hidden">
                          <div className="transition-transform duration-500 group-hover:scale-[1.03]">
                            <ProductPlaceholderImage 
                              product={product} 
                              size="md" 
                              className="rounded-b-none"
                            />
                          </div>
                          {product.featured && (
                            <span className="absolute top-2.5 left-2.5 bg-gradient-to-r from-amber-800 to-amber-950 text-white text-[8px] font-bold px-2 py-0.5 rounded-sm font-mono tracking-wider uppercase border border-amber-400/20 shadow-xs">
                              ★ Sage pick
                            </span>
                          )}
                          <span className="absolute top-2.5 right-2.5 text-[9px] px-2 py-0.5 rounded-sm bg-neutral-900/70 text-amber-50 font-mono uppercase tracking-wider">
                            {product.category.replace('-', ' & ')}
                          </span>
                          {product.stock < 5 ? (
                            <span className="absolute bottom-2.5 right-2.5 bg-red-600 border border-red-500 text-white text-[9px] font-extrabold px-2 py-1 rounded-sm font-mono tracking-wider uppercase shadow-md animate-pulse flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 shrink-0" /> Low Stock: {product.stock} Left
                            </span>
                          ) : product.stock <= 15 ? (
                            <span className="absolute bottom-2.5 right-2.5 bg-amber-700/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-sm font-mono tracking-wider uppercase shadow-xs">
                              {product.stock} Left
                            </span>
                          ) : null}
                        </div>

                        {/* Content block */}
                        <div className="p-4 space-y-2 text-left">
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="font-serif font-black text-stone-900 group-hover:text-amber-900 transition-colors text-base leading-tight truncate flex-1" title={product.name}>
                              {product.name}
                            </h3>
                            <span className="font-black text-amber-950 text-sm md:text-base font-mono shrink-0">
                              ₹{product.price}
                            </span>
                          </div>
                          <div className="flex justify-between items-center gap-1.5 min-h-[16px]">
                            <p className="text-[11px] text-amber-800/80 font-serif leading-none italic font-medium">
                              Sanskrit: {product.sanskritName}
                            </p>
                            {product.stock < 5 && (
                              <span className="text-[10px] text-red-600 font-extrabold font-mono flex items-center gap-0.5 shrink-0 animate-pulse bg-red-50 px-1.5 py-0.5 rounded border border-red-100">
                                <AlertTriangle className="w-2.5 h-2.5 text-red-600" /> Low Stock
                              </span>
                            )}
                          </div>
                          <p className="text-stone-600 text-xs line-clamp-3 leading-relaxed min-h-[54px]">
                            {product.description}
                          </p>
                          {/* Target indicators */}
                          <div className="flex flex-wrap gap-1 pt-1.5">
                            {product.indications.slice(0, 2).map(ind => (
                              <span key={ind} className="text-[9px] bg-amber-50 text-amber-950 px-1.5 py-0.5 rounded-sm font-bold border border-amber-900/5">
                                ✚ {ind}
                              </span>
                            ))}
                          </div>

                          {/* Recommended Seasons (Ritus) */}
                          <div className="flex flex-wrap gap-1 items-center pt-1 overflow-x-auto text-left">
                            <span className="text-[9px] font-mono text-stone-400 mr-1 uppercase">Ritus:</span>
                            {product.seasons.map(sid => {
                              const r = RITUS.find(ritu => ritu.id === sid);
                              const isCurrent = sid === getCurrentRituId();
                              return r ? (
                                <span 
                                  key={sid} 
                                  className={`text-[9.5px] px-1 py-0.5 rounded font-serif italic border ${
                                    isCurrent 
                                      ? 'bg-red-50 text-red-900 border-red-200 font-extrabold' 
                                      : 'bg-[#fdfcf7] text-amber-900 border-amber-900/10'
                                  }`}
                                  title={`${r.name} Ritu - ${r.englishSeason}`}
                                >
                                  {r.name}
                                </span>
                              ) : null;
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Bottom grid elements */}
                      <div className="p-4 pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2 mt-auto bg-stone-50/50">
                        <button
                          onClick={() => toggleCompare(product)}
                          className={`p-2 rounded-lg border text-[11px] transition-all cursor-pointer ${
                            isCompared(product.id)
                              ? 'bg-amber-800 text-amber-50 border-amber-900'
                              : 'text-stone-600 hover:text-amber-950 bg-white border-stone-200 hover:border-amber-910/30'
                          }`}
                          title={isCompared(product.id) ? 'Deselect from comparison' : 'Add to side-by-side comparison'}
                        >
                          <ArrowLeftRight className={`w-3.5 h-3.5 ${isCompared(product.id) ? 'animate-pulse' : ''}`} />
                        </button>
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="text-stone-700 hover:text-amber-950 hover:bg-stone-100 transition-all p-2 rounded-lg border border-stone-200 text-[11px] font-bold flex items-center gap-1 flex-1 justify-center bg-white shadow-3xs cursor-pointer"
                        >
                          <Info className="w-3.5 h-3.5 text-amber-800/80" /> Recipe Detail
                        </button>
                        <button
                          onClick={() => addToCart(product, product.sizeOptions[0])}
                          className="bg-amber-900 hover:bg-[#2d1b10] text-[#faf2e6] transition-all p-2 rounded-lg text-[11px] font-black flex items-center gap-1 flex-1 justify-center shadow-xs hover:shadow-sm cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add to Basket
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {/* D. Brand Heritage / Educational Section */}
            <section id="bhandar-heritage" className="bg-white rounded-xl border border-amber-900/15 p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* Left part has about details (2 columns on large screen) */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="border-b border-amber-900/10 pb-4 text-left">
                    <span className="text-xs font-mono tracking-widest text-[#8a5a36] uppercase block font-semibold">ABOUT MANGALAM AYURVEDA</span>
                    <h3 className="text-xl md:text-2xl font-serif font-bold text-amber-950 mt-1">
                      Compounding Traditional Remedies Since 1952
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs md:text-sm text-stone-600 leading-relaxed font-serif text-left">
                    <div className="space-y-2">
                      <h4 className="font-bold text-amber-900 text-sm">Genuineness of Herb Sourcing</h4>
                      <p>
                        All roots, leaves, and mineral raw substances are hand-picked by certified botanists from the upper altitude valleys of Gangotri and Kedarnath. Traditional dry sheds optimize ingredient potency.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold text-amber-900 text-sm">Classic Firewood Processing</h4>
                      <p>
                        We stick to our ancient brick furnace structures fueled specifically by dry sesame stems and sandalwood residues. This gentle slow heat preserves volatile active therapeutic enzymes.
                      </p>
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <h4 className="font-bold text-amber-900 text-sm">Vaidya Supervision Protocol</h4>
                      <p>
                        Every batch of Chyawanprash, Vati, and churnas are prepared under the direct expert supervision of royal Vaidyas. Standardized organoleptic testing checks taste, consistency, and luster.
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#4a3525]/5 rounded-lg p-4 border border-[#4a3525]/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
                    <div className="text-stone-700 text-left">
                      <span className="font-semibold block font-serif">Looking for custom herb compounding?</span>
                      We specialize in custom preparation values based on personalized pulse diagnosis readings (Nadi Pariksha).
                    </div>
                    <button 
                      onClick={() => setIsCartOpen(true)}
                      className="bg-amber-900 text-[#faf2e6] hover:bg-[#2d1b10] py-2 px-4 rounded-lg font-medium tracking-wide transition-all shrink-0 cursor-pointer text-xs"
                    >
                      Start Consultation Inquiry
                    </button>
                  </div>
                </div>

                {/* Right part has Photo & Bio of Dr. Sushil Chandra Gaur */}
                <div className="flex flex-col items-center text-center bg-gradient-to-b from-[#FAF6F0] to-[#F1E8DC]/30 p-5 rounded-xl border border-amber-900/15 shadow-3xs max-w-sm mx-auto w-full">
                  <div className="relative mb-4 group">
                    {/* Retro frame border effect */}
                    <div className="absolute -inset-1.5 rounded-xl bg-gradient-to-tr from-amber-800 via-amber-600 to-amber-950 opacity-20 blur-xs transition-opacity duration-500 group-hover:opacity-40" />
                    <div className="relative w-44 h-44 md:w-52 md:h-52 rounded-lg overflow-hidden border-4 border-white shadow-md mx-auto">
                      <img 
                        src={drSushilPhoto} 
                        alt="Dr. Sushil Chandra Gaur" 
                        className="w-full h-full object-cover transition-all duration-550" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    {/* Traditional Gold Corner Accents */}
                    <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-amber-600 pointer-events-none" />
                    <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-amber-600 pointer-events-none" />
                    <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-amber-600 pointer-events-none" />
                    <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-amber-600 pointer-events-none" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="text-[9px] font-mono font-black uppercase text-amber-850 tracking-widest bg-amber-100/60 px-2 py-0.5 rounded border border-amber-900/10">
                      ✦ CHIEF CONSULTING VAIDYA ✦
                    </div>
                    <h4 className="font-serif font-black text-amber-950 text-base md:text-lg leading-tight uppercase">
                      Dr. Sushil Chandra Gaur
                    </h4>
                    <p className="text-[10px] text-stone-500 font-mono tracking-wide uppercase font-bold italic">
                      Ayurved Ratna, Gurukul Kangri, Haridwar
                    </p>
                    <p className="text-stone-600 font-serif text-[11px] leading-relaxed italic text-center px-1">
                      "Each traditional formulation follows the strict Rasashastra guidelines—meticulously crafted in Rishikesh to maintain absolute herbal potency and structural purity."
                    </p>
                  </div>
                </div>

              </div>
            </section>

          </section>

        </div>

        {/* Dynamic Multi-Threaded Compounding Laboratory & Worker Pool */}
        <div className="mt-10">
          <CompoundingWorkerPool />
        </div>

        {/* E. Google Meet Virtual Clinic Consultation */}
        <div className="mt-10">
          <GoogleMeetConsultation />
        </div>

        {/* Secure Cloud Vault: Google Drive Health Archives */}
        <div className="mt-10">
          <GoogleDriveVault 
            driveToken={driveToken} 
            setDriveToken={setDriveToken} 
            onRequestUploadCurrent={handleUploadCurrent}
            hasCurrentReportToUpload={quizAnswers.length === 5}
          />
        </div>

        {/* Clinician Directory: Google Contacts Manager */}
        <div className="mt-10">
          <GoogleContactsDirectory 
            driveToken={driveToken} 
            setDriveToken={setDriveToken} 
            onSelectClient={handleSelectClient}
          />
        </div>

        {/* F. Educational Training & Workshops Section */}
        <div className="mt-10">
          <EducationalWorkshops />
        </div>
          </>
        )}

        {currentTab === 'yoga' && (
          <YogicKriyaPranayam activeRituId={selectedSeason} />
        )}

        {currentTab === 'about' && (
          <AboutUsSection />
        )}

        {currentTab === 'join' && (
          <JoinUsSection 
            user={user} 
            onSignInClick={() => {
              setAuthModalMode('signin');
              setIsAuthModalOpen(true);
            }} 
          />
        )}

      </main>

      {/* 4. DETAILS DIALOG MODAL PANEL */}
      {selectedProduct && (
        <div id="product-detail-modal" className="fixed inset-0 bg-stone-900/75 flex items-center justify-center p-4 z-50 overflow-y-auto backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-amber-900/25 overflow-hidden shadow-2xl relative my-8">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-full p-2 transition-all z-20 shadow-xs cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header portion with image placeholder */}
            <div className="bg-gradient-to-b from-[#fbf9f4] to-white p-6 border-b border-stone-100">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                
                {/* Visual placeholder inside detail modal */}
                <div className="sm:col-span-1 flex justify-center">
                  <ProductPlaceholderImage product={selectedProduct} size="lg" className="w-full sm:w-44" />
                </div>

                <div className="sm:col-span-2 space-y-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-widest bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-sm">
                      {selectedProduct.category.replace('-', ' & ')}
                    </span>
                    {selectedProduct.stock < 5 ? (
                      <span className="text-[9px] uppercase font-bold tracking-wider bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded-sm flex items-center gap-1 animate-pulse">
                        <AlertTriangle className="w-3 h-3 text-red-600 shrink-0" /> Low Stock: Only {selectedProduct.stock} Left
                      </span>
                    ) : selectedProduct.stock <= 15 ? (
                      <span className="text-[9px] uppercase font-bold tracking-wider bg-amber-105 text-amber-850 border border-amber-200 px-2 py-0.5 rounded-sm">
                        Only {selectedProduct.stock} Left
                      </span>
                    ) : null}
                  </div>
                  <h2 className="text-2xl font-serif font-black text-amber-950">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-xs text-[#a16207] font-serif font-medium italic">
                    Devanagari Sanskrit: {selectedProduct.sanskritName} Formula
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-2xl font-bold font-mono text-stone-900">
                      ₹{selectedProduct.price}
                    </p>
                    <button
                      onClick={handleShareProduct}
                      className="inline-flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-950 border border-amber-900/10 px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer shadow-3xs"
                      title="Share product details"
                    >
                      <Share2 className="w-3.5 h-3.5 text-amber-800" />
                      {shareStatus || 'Share'}
                    </button>
                    <button
                      onClick={() => generateProductPDF(selectedProduct)}
                      id="mab-download-recipe-pdf"
                      className="inline-flex items-center gap-1.5 bg-[#fbf9f4] hover:bg-amber-100 text-amber-900 border border-amber-900/15 px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer shadow-3xs"
                      title="Generate printer-friendly PDF Recipe Sheet"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-800" />
                      Get Recipe PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable details */}
            <div className="p-6 space-y-6 max-h-[30rem] overflow-y-auto text-sm leading-relaxed text-stone-700">
              
              <div>
                <h4 className="font-serif font-bold text-amber-950 text-base border-b border-amber-900/5 pb-1 mb-2">
                  Traditional Therapeutic Narrative
                </h4>
                <p className="text-stone-600 text-xs md:text-sm">
                  {selectedProduct.description}
                </p>
              </div>

              {/* Seasonal Alignment Section */}
              <div className="bg-[#fcfbf9] border border-amber-900/10 p-4 rounded-xl space-y-2 text-left">
                <h4 className="font-serif font-black text-amber-900 text-sm flex items-center gap-1.5 uppercase tracking-wide">
                  <Calendar className="w-4 h-4 cursor-default" /> Traditional Seasonal Rasayana Alignment
                </h4>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  In Ayurvedic Chikitsa, remedies yield optimized potency and prevent dosha imbalance when aligned to the specific *Ritus* (seasons). This formula is classically recommended for balancing the doshas during:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {selectedProduct.seasons.map(sid => {
                    const r = RITUS.find(ritu => ritu.id === sid);
                    const isCurrent = sid === getCurrentRituId();
                    return r ? (
                      <div key={sid} className={`px-2.5 py-2 rounded-lg border flex flex-col text-left text-xs ${
                        isCurrent 
                          ? 'bg-amber-50/80 text-[#301b10] border-amber-400' 
                          : 'bg-white text-stone-800 border-stone-200'
                      }`}>
                        <div className="flex items-center gap-1 font-bold">
                          <span>{r.name} Ritu ({r.sanskritName})</span>
                          {isCurrent && (
                            <span className="text-[8px] bg-red-105 text-red-800 font-extrabold px-1 rounded-sm uppercase tracking-wide">
                              Active Season
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-stone-500 mt-0.5">
                          {r.englishSeason} ({r.months})
                        </span>
                        <span className="text-[9.5px] text-[#8a5a36] mt-0.5 italic leading-snug">
                          {r.recommendedApproach}
                        </span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>

              {/* Composition ingredients mapping */}
              <div>
                <h4 className="font-serif font-bold text-amber-950 text-base border-b border-amber-900/5 pb-1 mb-3">
                  🌿 Complete Botanical / Mineral Proportions
                </h4>
                <div className="border border-stone-200/80 rounded-lg overflow-hidden text-xs">
                  <div className="bg-stone-50 p-2 font-mono flex justify-between font-bold text-stone-900 border-b border-stone-200 uppercase">
                    <span className="w-1/3">Herb Name</span>
                    <span className="w-1/6 text-center">Ratio</span>
                    <span className="w-1/2">Therapeutic Function (Doṣa Impact)</span>
                  </div>
                  <div className="divide-y divide-stone-100">
                    {selectedProduct.ingredients.map((ing, k) => (
                      <div key={k} className="p-2 flex justify-between items-start">
                        <span className="w-1/3 font-medium text-[#5c3d2e]">{ing.name}</span>
                        <span className="w-1/6 text-center text-stone-500 font-mono font-bold bg-[#fbf9f4] rounded-sm py-0.5">{ing.proportion}</span>
                        <span className="w-1/2 text-stone-600 pl-2 leading-tight">{ing.benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dosage instructions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#fbf9f4] p-4 rounded-xl border border-[#4a3525]/5 space-y-1">
                  <h5 className="font-serif font-bold text-amber-950 flex items-center gap-1 text-xs uppercase">
                    👨‍⚕️ Prescribed Dosage (Matra)
                  </h5>
                  <p className="text-stone-700 text-xs">
                    {selectedProduct.dosage}
                  </p>
                </div>
                <div className="bg-[#f0fdf4] p-4 rounded-xl border border-emerald-900/5 space-y-1">
                  <h5 className="font-serif font-bold text-emerald-950 flex items-center gap-1 text-xs uppercase">
                    🥛 Vehicle Medium (Anupana)
                  </h5>
                  <p className="text-stone-700 text-xs">
                    {selectedProduct.administration}
                  </p>
                </div>
              </div>

              {/* Indications */}
              <div>
                <h4 className="font-serif font-bold text-amber-950 text-xs uppercase mb-2">
                  Target Organs &amp; Somatic Balance
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.indications.map(ind => (
                    <span key={ind} className="bg-stone-100 text-stone-700 px-3 py-1 rounded-sm text-xs font-semibold">
                      ✓ {ind}
                    </span>
                  ))}
                  <span className="bg-amber-50 text-amber-950 border border-amber-200 px-3 py-1 rounded-sm text-xs font-semibold">
                    ✓ Balanced Tridosha (Vata-Pitta-Kapha)
                  </span>
                </div>
              </div>

              {/* Dynamic Remedy Feedback Reviews and Ratings section */}
              <RemedyFeedbackSection 
                productId={selectedProduct.id}
                user={user}
                onOpenAuth={() => setIsAuthModalOpen(true)}
              />
            </div>

            {/* Footer with checkout option */}
            <div className="bg-stone-50 p-6 border-t border-stone-100 flex items-center justify-between gap-4">
              <span className="text-xs text-stone-500 font-medium">Size option: Default compounding package container ({selectedProduct.sizeOptions[0]})</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="bg-stone-200 hover:bg-stone-300 transition-colors px-4 py-2 rounded-lg text-xs font-semibold text-stone-700"
                >
                  Back to Catalogue
                </button>
                <button
                  onClick={() => {
                    addToCart(selectedProduct, selectedProduct.sizeOptions[0]);
                    setSelectedProduct(null);
                  }}
                  className="bg-amber-900 hover:bg-[#312015] text-white transition-colors px-5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> Add to Basket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COMPARE PRODUCTS OVERLAYS & FLOATING NOTIFICATION BAR */}
      {compareList.length > 0 && (
        <div 
          id="floating-compare-bar" 
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1f1610]/95 backdrop-blur-md text-[#ead8c5] px-4 py-3 rounded-2xl shadow-2xl z-40 border border-amber-900/40 flex items-center gap-4 sm:gap-6 animate-bounce-once"
        >
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-400 rotate-12 shrink-0 animate-spin-once" />
            <p className="text-xs font-mono font-black uppercase tracking-wider hidden sm:block">
              Apothecary Comparator:
            </p>
            <span className="bg-amber-900 text-amber-50 text-[10px] font-black font-mono px-2 py-0.5 rounded-full border border-amber-800">
              {compareList.length}/2 Staged
            </span>
          </div>

          {/* Mini product thumbnails */}
          <div className="flex items-center gap-1.5">
            {compareList.map(id => {
              const prod = PRODUCTS.find(p => p.id === id);
              if (!prod) return null;
              return (
                <div key={id} className="relative group bg-[#130d0a]/85 p-1 rounded-lg border border-amber-950 flex items-center gap-1">
                  <ProductPlaceholderImage product={prod} size="sm" className="w-6 h-6 rounded-md shrink-0 block" />
                  <span className="text-[10px] font-serif font-black truncate max-w-[85px] hidden md:inline text-amber-50 pl-1">{prod.name}</span>
                  <button
                    onClick={() => toggleCompare(prod)}
                    className="text-stone-400 hover:text-red-400 p-0.5 rounded-full cursor-pointer hover:bg-stone-850/40 transition-colors"
                    title="Remove from comparator"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            {compareList.length === 2 ? (
              <button
                onClick={() => setIsCompareModalOpen(true)}
                className="bg-amber-800 hover:bg-amber-700 text-[#faf2e6] font-mono font-black text-xs uppercase tracking-widest py-1.5 px-3 rounded-lg shadow-sm transition-all hover:scale-102 active:scale-98 cursor-pointer flex items-center gap-1"
              >
                <Scale className="w-3.5 h-3.5 text-amber-300" />
                Compare
              </button>
            ) : (
              <div className="text-[10.5px] text-amber-200/90 font-serif leading-none italic animate-pulse hidden xs:block">
                Choose 1 more remedy...
              </div>
            )}
            <button
              onClick={() => setCompareList([])}
              className="text-stone-400 hover:text-white font-mono text-[9px] font-black uppercase tracking-wider bg-stone-900 px-2.5 py-1.5 rounded-lg border border-stone-800 cursor-pointer"
            >
              Clear
            </button>
          </div>

          {compareAlert && (
            <div 
              id="compare-alert" 
              className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-950 text-red-100 border border-red-800 text-[10px] font-bold font-mono px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl"
            >
              ⚠️ {compareAlert}
            </div>
          )}
        </div>
      )}

      {/* COMPONENT DIALOG TRIGGER CONTAINER */}
      <CompareProductsModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        products={comparedProductsData}
        onAddToCart={addToCart}
        onRemoveFromCompare={(id) => {
          setCompareList(prev => prev.filter(x => x !== id));
        }}
      />

      {/* 5. CONSULTATION INQUIRY DRAWER & CART */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            id="cart-overlay-drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-stone-900/60 z-50 flex justify-end"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
              className="bg-white w-full max-w-md h-full flex flex-col justify-between shadow-2xl overflow-hidden relative"
            >
              
              {/* Header of Basket */}
              <div className="bg-[#4a3525] p-5 text-[#faf2e6] flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <ShoppingBag className="w-5 h-5 text-amber-200" />
                  <div>
                    <h3 className="font-serif font-black text-base text-amber-100 leading-none">Compounding Inquiry Basket</h3>
                    <p className="text-[10px] text-amber-200/80 font-mono mt-1">MANGALAM TRADITIONAL APOTHECARY</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-amber-900/40 hover:bg-amber-900/60 text-white rounded-full p-2 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Inner Content Area */}
              {isOrderSubmitted ? (
                /* Success / Inquiry compile state resembling an ancient traditional billing invoice */
                <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[#fdfaf5]">
                  <div className="text-center py-6 space-y-2">
                    <CheckCircle2 className="w-12 h-12 text-emerald-700 mx-auto stroke-[1.5]" />
                    <h4 className="font-serif text-xl font-bold text-amber-950">Inquiry Received Successfully</h4>
                    <p className="text-xs text-stone-500">Our chief ayurvedic vaidyas are compiling your botanical remedies.</p>
                  </div>

                  {/* Ancient Invoice design wrapper */}
                  <div className="border border-amber-950/20 bg-white p-4 rounded-lg shadow-xs space-y-4 text-xs font-serif relative">
                    {/* Watermark Logo */}
                    <div className="absolute right-4 top-4 text-stone-200 uppercase font-mono text-[9px] font-bold border border-dotted border-stone-300 p-1 rounded-sm rotate-12">
                      MAB APPROVED
                    </div>

                    <div className="text-center pb-2 border-b border-double border-stone-300 flex flex-col items-center gap-2">
                      <img 
                        src={brandLogo} 
                        alt="Mangalam Logo" 
                        className="w-12 h-12 object-contain rounded-full border border-amber-400" 
                        referrerPolicy="no-referrer"
                      />
                      <p className="font-black text-sm uppercase text-amber-950">MANGALAM AYURVEDA AUSHADH BHANDAR</p>
                      <p className="text-[9px] text-[#835840] font-mono leading-none tracking-wide mt-1">HIGH PRECISION EXTEMPORANEOUS COMPOUNDING</p>
                      <p className="text-[10px] text-stone-400 mt-1">Ref No: {mockReferenceCode} • Date: {new Date().toLocaleDateString()}</p>
                    </div>

                    <div className="space-y-1 text-stone-600">
                      <p><strong>Customer Name:</strong> {customerInfo.name}</p>
                      <p><strong>Consultation Contact:</strong> {customerInfo.phone || 'N/A'} | {customerInfo.email || 'N/A'}</p>
                      <p><strong>Compound Carrier (Anupāna):</strong> <span className="bg-amber-100 text-[#5c3e2f] px-1.5 py-0.5 rounded text-[10px] font-semibold">{customerInfo.anupanaPreference}</span></p>
                      {customerInfo.consultationNotes && (
                        <p><strong>Symptom Context:</strong> "{customerInfo.consultationNotes}"</p>
                      )}
                      <p className="flex items-center gap-1.5 mt-2 border-t border-dashed border-stone-200 pt-2 pb-0.5">
                        <strong>Payment Status:</strong> 
                        {isPaidViaGPay ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-sans font-bold px-2 py-0.5 rounded text-[9px] uppercase border border-emerald-300">
                            🟢 Paid via Google Pay
                          </span>
                        ) : (
                          <span className="inline-block bg-amber-50 text-amber-800 font-sans font-bold px-2 py-0.5 rounded text-[9px] uppercase border border-amber-200">
                            Cash Balance / Pay on Pickup
                          </span>
                        )}
                      </p>
                      {isPaidViaGPay && gpayTxnId && (
                        <p className="font-mono text-[9px] text-stone-500 bg-stone-50 px-2 py-1 rounded border border-stone-200 inline-block mt-1">
                          <strong>Transaction ID:</strong> <span className="select-all font-bold text-stone-700">{gpayTxnId}</span>
                        </p>
                      )}
                    </div>

                    <table className="w-full text-left text-xs border-y border-stone-200 mt-3 font-serif">
                      <thead>
                        <tr className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-200">
                          <th className="py-1">Remedy Name</th>
                          <th className="py-1 text-center font-mono">Size</th>
                          <th className="py-1 text-center font-mono">Qty</th>
                          <th className="py-1 text-right font-mono">Comp. Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-dotted divide-stone-200 text-stone-800">
                        {cart.map((item, id) => (
                          <tr key={id} className="py-1">
                            <td className="py-1.5 pr-2 font-serif font-semibold">{item.product.name}</td>
                            <td className="py-1.5 text-center font-mono">{item.selectedSize}</td>
                            <td className="py-1.5 text-center font-mono font-bold">{item.quantity}</td>
                            <td className="py-1.5 text-right font-mono font-semibold">₹{item.product.price * item.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="text-right space-y-1 pt-2 font-serif">
                      <p className="text-stone-500">Sanskrit Processing Charge: <span className="font-mono text-emerald-800 font-bold">FREE</span></p>
                      <p className="text-sm font-black text-amber-950">Estimated Bill: <span className="font-mono font-black text-base">₹{totalInquiryPrice}</span></p>
                    </div>

                    <div className="border-t border-stone-200 pt-3 text-[10px] text-stone-500 text-center leading-relaxed">
                      <p>🇮🇳 Packed inside specialized eco-friendly organic medical paper pouches.</p>
                      {isPaidViaGPay ? (
                        <p className="font-bold text-emerald-800 mt-1 uppercase tracking-wide bg-emerald-50 py-1 px-2 rounded">
                          ⚡ Priority Compound Processing Activated. Your recipe is queued first for extraction and compounding!
                        </p>
                      ) : (
                        <p className="italic text-stone-400 mt-1">Please keep this estimate receipt ready during delivery checkout at the Rishikesh counter pharmacy.</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        window.print();
                      }}
                      className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs py-2.5 rounded-lg flex items-center justify-center gap-1 border border-stone-300"
                    >
                      <Printer className="w-4 h-4" /> Save / Print Invoice
                    </button>
                    <button
                      onClick={resetInquiry}
                      className="flex-1 bg-amber-900 hover:bg-stone-900 text-white font-semibold text-xs py-2.5 rounded-lg text-center"
                    >
                      Browse Other Formulas
                    </button>
                  </div>
                </div>
              ) : (
                /* Ongoing basket list and interactive Inquiry checkout details */
                <div className="flex-1 flex flex-col justify-between overflow-hidden">
                  {/* Cart products listing */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {cart.length === 0 ? (
                      <div className="h-full flex flex-col justify-center items-center text-center space-y-3 py-20 bg-stone-50 rounded-xl border border-dashed border-stone-200">
                        <ShoppingBag className="w-10 h-10 text-stone-300 stroke-[1.2]" />
                        <h5 className="font-serif text-lg font-bold text-stone-700">Inquiry Basket is Empty</h5>
                        <p className="text-xs text-stone-400 max-w-xs">
                          Select authentic traditional compound mixtures from our catalog matrix to queue up for medical preparation.
                        </p>
                        <button
                          onClick={() => setIsCartOpen(false)}
                          className="bg-amber-900 text-white font-medium py-1.5 px-4 rounded text-xs"
                        >
                          Keep Browsing
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-xs text-stone-500 font-mono">
                          <span>Items in queue</span>
                          <button 
                            onClick={() => setCart([])}
                            className="text-[#991b1b] hover:underline flex items-center gap-1 font-bold uppercase rounded"
                          >
                            <Trash2 className="w-3 h-3" /> WIPE BASKET
                          </button>
                        </div>

                        {cart.map((item, idx) => (
                          <div
                            key={`${item.product.id}-${item.selectedSize}`}
                            className="bg-[#fcfbf9] rounded-lg border border-stone-200 p-3 relative flex gap-3 items-center"
                          >
                            {/* Mini placeholder rendering on the left */}
                            <div className="shrink-0">
                              <ProductPlaceholderImage 
                                product={item.product} 
                                size="sm" 
                                className="h-16 w-16" 
                              />
                            </div>

                            {/* Detail data */}
                            <div className="flex-1 space-y-1 min-w-0">
                              <h4 className="font-serif font-bold text-stone-900 text-xs truncate">
                                {item.product.name}
                              </h4>
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] text-stone-500 bg-stone-100 px-1 rounded-sm uppercase tracking-wider font-mono">
                                  {item.selectedSize}
                                </span>
                                <span className="text-xs font-bold font-mono text-stone-900 shadow-inner px-1 rounded-sm py-0.5">
                                  ₹{item.product.price} each
                                </span>
                              </div>

                              {/* Quantity modifier controls */}
                              <div className="flex items-center justify-between pt-1">
                                <div className="flex items-center border border-stone-300 rounded-md overflow-hidden bg-white">
                                  <button
                                    onClick={() => updateCartQty(item.product.id, item.selectedSize, -1)}
                                    className="px-1.5 py-0.5 text-stone-500 hover:bg-stone-100 transition-colors"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="px-2.5 text-xs font-mono font-bold text-stone-900">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateCartQty(item.product.id, item.selectedSize, 1)}
                                    className="px-1.5 py-0.5 text-stone-500 hover:bg-stone-100 transition-colors"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>

                                <button
                                  onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                                  className="text-stone-400 hover:text-red-700 transition-colors"
                                  title="Remove item"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Form to proceed with compile inquiries */}
                  {cart.length > 0 && (
                    <div className="bg-[#f9f7f2] p-4 border-t border-stone-200">
                      <form onSubmit={handleInquirySubmit} className="space-y-3.5">
                        <div className="flex justify-between items-baseline border-b border-stone-200 pb-2 mb-2 font-serif">
                          <span className="text-stone-600 text-xs uppercase font-semibold">Inquiry Sum:</span>
                          <span className="text-xl font-bold font-mono text-amber-950">₹{totalInquiryPrice}</span>
                        </div>

                        <h5 className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-950 block border-b border-amber-900/10 pb-1">
                          Sanskrit Compounding Consultation Details
                        </h5>

                        <div className="space-y-2 text-stone-700 text-xs">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-bold text-stone-500 mb-0.5">FULL NAME *</label>
                              <input
                                type="text"
                                name="name"
                                required
                                value={customerInfo.name}
                                onChange={handleFormInputChange}
                                placeholder="e.g., Rajesh Sharma"
                                className="w-full bg-white border border-stone-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-800 text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-stone-500 mb-0.5">PHONE NUMBER *</label>
                              <input
                                type="tel"
                                name="phone"
                                required
                                value={customerInfo.phone}
                                onChange={handleFormInputChange}
                                placeholder="e.g., 94120XXXXX"
                                className="w-full bg-white border border-stone-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-800 text-xs"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-stone-500 mb-0.5">EMAIL ADDRESS</label>
                            <input
                              type="email"
                              name="email"
                              value={customerInfo.email}
                              onChange={handleFormInputChange}
                              placeholder="e.g., rajesh@mail.com"
                              className="w-full bg-white border border-stone-300 rounded px-2 py-1 text-xs focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-stone-500 mb-0.5">COMPANION INTAKE CARRIER (ANUPĀNA)</label>
                            <select
                              name="anupanaPreference"
                              value={customerInfo.anupanaPreference}
                              onChange={handleFormInputChange}
                              className="w-full bg-white border border-stone-300 rounded px-2 py-1 text-xs focus:outline-none"
                            >
                              <option value="Warm Water">Warm Shuddha Water (Pitta pacifying)</option>
                              <option value="Warm Milk">Raw Goma Milk (Nerve nourishing)</option>
                              <option value="Forest Honey">Wild Hills Honey (Kapha draining)</option>
                              <option value="Ginger Decoction">Fresh Ginger Infusion (Agni Igniter)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-stone-500 mb-0.5">SYMPTOM HISTORY OR REQUEST DETAILS</label>
                            <textarea
                              name="consultationNotes"
                              rows={2}
                              value={customerInfo.consultationNotes}
                              onChange={handleFormInputChange}
                              placeholder="e.g., Hyperacidity after meal. Low fatigue in evening."
                              className="w-full bg-white border border-stone-300 rounded px-2 py-1 text-xs focus:outline-none resize-none"
                            />
                          </div>

                          {/* Payment & Processing Route selection */}
                          <div className="bg-amber-50/50 p-2.5 rounded-lg border border-amber-900/10 space-y-1.5 mt-3">
                            <label className="block text-[9px] font-mono font-black text-amber-900 uppercase tracking-widest">
                              Choose Processing & Payment Route
                            </label>
                            <div className="grid grid-cols-2 gap-2 text-[11px]">
                              {/* Option 1: GPay */}
                              <label className={`flex flex-col p-2.5 rounded-lg border cursor-pointer transition-all ${
                                selectedPaymentMethod === 'gpay'
                                  ? 'bg-amber-950 border-amber-950 text-white shadow-xs'
                                  : 'bg-white border-stone-200 text-stone-700 hover:border-amber-900/30'
                              }`}>
                                <div className="flex items-center gap-1.5 font-bold">
                                  <input
                                    type="radio"
                                    name="payment_method"
                                    checked={selectedPaymentMethod === 'gpay'}
                                    onChange={() => setSelectedPaymentMethod('gpay')}
                                    className="accent-amber-500"
                                  />
                                  <span>Google Pay</span>
                                </div>
                                <span className={`text-[9px] mt-1 leading-tight ${
                                  selectedPaymentMethod === 'gpay' ? 'text-amber-200' : 'text-stone-400'
                                }`}>
                                  ⚡ Fast-track. Vaidyas start compounding first.
                                </span>
                              </label>

                              {/* Option 2: Traditional Receipt */}
                              <label className={`flex flex-col p-2.5 rounded-lg border cursor-pointer transition-all ${
                                selectedPaymentMethod === 'traditional'
                                  ? 'bg-[#5c3e2f] border-[#5c3e2f] text-white shadow-xs'
                                  : 'bg-white border-stone-200 text-stone-700 hover:border-amber-900/30'
                              }`}>
                                <div className="flex items-center gap-1.5 font-bold">
                                  <input
                                    type="radio"
                                    name="payment_method"
                                    checked={selectedPaymentMethod === 'traditional'}
                                    onChange={() => setSelectedPaymentMethod('traditional')}
                                    className="accent-amber-500"
                                  />
                                  <span>Counter Cash</span>
                                </div>
                                <span className={`text-[9px] mt-1 leading-tight ${
                                  selectedPaymentMethod === 'traditional' ? 'text-amber-200/85' : 'text-stone-400'
                                }`}>
                                  📍 Pay at counter in Rishikesh pharmacy.
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>

                        {selectedPaymentMethod === 'gpay' ? (
                          <button
                            type="submit"
                            className="w-full bg-stone-900 hover:bg-black text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md group border border-stone-950 cursor-pointer"
                          >
                            <div className="flex items-center bg-white px-2 py-0.5 rounded border border-stone-100 font-sans tracking-wide shrink-0">
                              <span className="text-[#4285F4] font-extrabold text-[11px]">G</span>
                              <span className="text-[#EA4335] font-extrabold text-[11px]">o</span>
                              <span className="text-[#FBBC05] font-extrabold text-[11px]">o</span>
                              <span className="text-[#4285F4] font-extrabold text-[11px]">g</span>
                              <span className="text-[#34A853] font-extrabold text-[11px]">l</span>
                              <span className="text-[#EA4335] font-extrabold text-[11px]">e</span>
                              <span className="text-[#5f6368] font-bold text-[11px] ml-1">Pay</span>
                            </div>
                            <span className="text-xs uppercase tracking-widest font-mono font-bold text-amber-100 group-hover:text-white transition-colors">
                              Pay ₹{totalInquiryPrice} Securely
                            </span>
                          </button>
                        ) : (
                          <button
                            type="submit"
                            className="w-full bg-emerald-800 hover:bg-emerald-950 text-[#faf2e6] font-bold text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors uppercase tracking-widest shadow-sm cursor-pointer"
                          >
                            <Lock className="w-3.5 h-3.5" /> Submit Compounding Request
                          </button>
                        )}
                      </form>
                    </div>
                  )}
                </div>
              )}

              {/* Sticky warning on bottom in cart */}
              {!isOrderSubmitted && (
                <div className="bg-amber-900 text-[#faf2e6] px-4 py-2.5 text-[10px] text-center leading-relaxed font-mono">
                  📞 HELPLINE &amp; DIRECT SUPPORT FOR INQUIRIES: 9258240603
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WISHLIST DRAWER OVERLAY */}
      {isWishlistOpen && (
        <div id="wishlist-overlay-drawer" className="fixed inset-0 bg-stone-900/60 z-50 flex justify-end transition-all">
          <div className="bg-white w-full max-w-md h-full flex flex-col justify-between shadow-2xl overflow-hidden relative">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-rose-900 to-[#2c1b10] p-5 text-[#faf2e6] flex justify-between items-center border-b border-rose-900/10">
              <div className="flex items-center gap-1.5">
                <Heart className="w-5 h-5 text-rose-300 fill-rose-300 animate-pulse" />
                <div>
                  <h3 className="font-serif font-black text-base text-amber-50 leading-none">Sacred Ayurveda Wishlist</h3>
                  <p className="text-[10px] text-rose-200/80 font-mono mt-1">YOUR PERSONAL CHOSEN DIPENSARY</p>
                </div>
              </div>
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="bg-rose-950/40 hover:bg-stone-900/50 text-white rounded-full p-2 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {wishlistedProducts.length === 0 ? (
                <div className="h-full flex flex-col justify-center items-center text-center space-y-3 py-20 bg-stone-50 rounded-xl border border-dashed border-stone-200">
                  <Heart className="w-10 h-10 text-stone-300 stroke-[1.2]" />
                  <h5 className="font-serif text-lg font-bold text-stone-700">Wishlist is Empty</h5>
                  <p className="text-xs text-stone-400 max-w-xs leading-relaxed font-serif">
                    Mark formulations as favorites in the catalogue to save them here for quick future access.
                  </p>
                  <button
                    onClick={() => setIsWishlistOpen(false)}
                    className="mt-2 bg-stone-800 text-[#faf2e6] hover:bg-stone-950 font-mono text-[9px] font-bold uppercase tracking-wider py-1.5 px-4 rounded-lg cursor-pointer transition-all"
                  >
                    Keep Browsing
                  </button>
                </div>
              ) : (
                <div className="space-y-3 text-left">
                  <div className="flex justify-between items-center text-xs text-stone-500 font-mono">
                    <span>{wishlistedProducts.length} favourite remedies</span>
                    <button 
                      onClick={() => setWishlist([])}
                      className="text-[#991b1b] hover:underline flex items-center gap-1 font-bold uppercase cursor-pointer text-[10px]"
                    >
                      <Trash2 className="w-3 h-3" /> CLEAR WISHLIST
                    </button>
                  </div>

                  {wishlistedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-[#fcfbf9] rounded-lg border border-stone-200 p-3 relative flex gap-3 items-center hover:border-rose-900/20 transition-all shadow-3xs"
                    >
                      {/* Mini Image */}
                      <div className="shrink-0 cursor-pointer" onClick={() => {
                        setSelectedProduct(product);
                        setIsWishlistOpen(false);
                      }}>
                        <ProductPlaceholderImage 
                          product={product} 
                          size="sm" 
                          className="h-16 w-16 hover:scale-105 transition-transform" 
                        />
                      </div>

                      {/* Detail data */}
                      <div className="flex-1 space-y-1 min-w-0 text-left">
                        <div className="flex justify-between items-start gap-1">
                          <h4 
                            className="font-serif font-black text-stone-900 text-xs truncate hover:text-rose-900 cursor-pointer"
                            onClick={() => {
                              setSelectedProduct(product);
                              setIsWishlistOpen(false);
                            }}
                          >
                            {product.name}
                          </h4>
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className="text-stone-400 hover:text-rose-700 transition-colors p-0.5"
                            title="Remove from favorites"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-[10px] text-stone-500 italic font-serif truncate leading-none">
                          {product.sanskritName}
                        </p>

                        <div className="flex justify-between items-center pt-1">
                          <span className="text-xs font-bold text-stone-800 font-mono">
                            ₹{product.price}
                          </span>
                          
                          <button
                            onClick={() => {
                              addToCart(product, product.sizeOptions[0]);
                            }}
                            className="bg-emerald-800 hover:bg-emerald-950 text-white text-[9px] font-mono font-black uppercase py-1 px-2.5 rounded transition-all cursor-pointer flex items-center gap-1"
                          >
                            Add To Basket
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Panel */}
            <div className="bg-[#fdfbf7] p-4 border-t border-stone-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  wishlistedProducts.forEach(prod => {
                    addToCart(prod, prod.sizeOptions[0]);
                  });
                  setIsWishlistOpen(false);
                  setIsCartOpen(true);
                }}
                disabled={wishlistedProducts.length === 0}
                className="w-full bg-[#2c1b10] hover:bg-stone-950 text-white font-mono font-black text-xs py-2.5 px-4 rounded-lg text-center uppercase tracking-wider transition-all shadow-3xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                📥 Queue All Favorites in Basket
              </button>
              <p className="text-[9.5px] text-stone-400 font-serif text-center">
                Wishlist data is saved on this device via standard client-side storage
              </p>
            </div>

          </div>
        </div>
      )}

      {/* Dynamic CTA Banner Insertion */}
      <div className="max-w-7xl mx-auto px-4 my-10" id="mab-dynamic-cta">
        <div rrm-inline-cta="3595208f-82a5-4bdb-a424-899fb737ed2b"></div>
      </div>

      {/* 6. Footer section */}
      <footer id="mab-footer" className="bg-[#1f1610] text-[#ead8c5] py-12 border-t border-amber-900/20 text-xs md:text-sm">
        
        {/* NEW NEWSLETTER SUBSCRIPTION ROW */}
        <div id="mab-newsletter-row" className="max-w-7xl mx-auto px-4 border-b border-amber-950/40 pb-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-2 text-left">
              <span className="inline-flex items-center gap-1 bg-amber-950/80 text-amber-300 font-mono text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border border-amber-900/10">
                ✦ RISHIKESH CHRONICLES ✦
              </span>
              <h4 className="font-serif font-black text-amber-100 text-base md:text-xl uppercase tracking-wide">
                Ayurvedic Wellness Newsletter
              </h4>
              <p className="text-[#a49180] text-xs max-w-2xl leading-relaxed">
                Subscribe to receive seasonal health tips (Ritucharya), daily morning rituals (Dinacharya), and exclusive alerts when new wild-harvested Himalayan remedy formulations arrive at our traditional Rishikesh dispensary.
              </p>
            </div>
            
            <div className="lg:col-span-5">
              {isNewsletterSubscribed ? (
                <div id="newsletter-success" className="bg-emerald-950/40 border border-emerald-900/35 p-4 rounded-xl flex items-start gap-3 text-left">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 animate-bounce" />
                  <div>
                    <h5 className="font-serif font-extrabold text-amber-100 text-xs uppercase tracking-wide leading-none">
                      Welcome to the Sacred Circle!
                    </h5>
                    <p className="text-[#a49180] text-[11px] mt-1 pr-1 leading-snug">
                      Your email <strong className="text-amber-100 font-mono font-bold break-all">{subscribedEmail}</strong> has been enrolled in our seasonal health log. Our next Ritucharya guide will arrive in your inbox.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsNewsletterSubscribed(false);
                        try {
                          localStorage.removeItem('mab_newsletter_subscribed');
                        } catch (e) {}
                      }}
                      className="text-amber-400/90 hover:text-amber-300 font-mono text-[9px] font-black uppercase tracking-wider underline mt-2 bg-transparent border-none cursor-pointer p-0"
                    >
                      Change Email
                    </button>
                  </div>
                </div>
              ) : (
                <form id="newsletter-form" onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-3.5 w-4 h-4 text-[#a49180]" />
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-amber-950/60 bg-[#130d0a] text-xs font-serif text-[#faf2e6] placeholder-stone-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-amber-800 hover:bg-amber-900 text-[#faf2e6] font-mono font-black text-xs uppercase tracking-wider py-3 px-5 rounded-lg transition-all shadow-3xs cursor-pointer flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap hover:scale-102 active:scale-98"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-300" />
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-amber-400" />
              <span className="font-serif font-black text-lg tracking-wider text-amber-100">मङ्गलम् आयुर्वेद औषध भण्डार</span>
            </div>
            <p className="text-[#a49180] leading-relaxed max-w-sm">
              Est. in 1952 in the holy lands of Uttarakhand. Committed to delivering pristine, untouched Ayurvedic remedies extracted directly from Himalayan elements in complete accordance with classic Guggulu, Arishta, and Vati scripture guidelines.
            </p>
            <div className="text-[10px] text-[#817062] font-mono uppercase tracking-wider flex flex-wrap items-center gap-3">
              <span>© 2026 MANGALAM AYURVEDA AUSHADH BHANDAR. ALL RIGHTS RESERVED.</span>
              <span className="text-stone-700 select-none">•</span>
              <button
                type="button"
                onClick={() => setIsPrivacyModalOpen(true)}
                className="text-amber-400 hover:text-amber-300 underline cursor-pointer bg-transparent border-none p-0 transition-all uppercase tracking-widest font-bold"
              >
                Privacy Policy
              </button>
              <span className="text-stone-700 select-none">•</span>
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 underline transition-all font-bold"
              >
                Sitemap
              </a>
              <span className="text-stone-700 select-none">•</span>
              <a
                href="/robots.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 underline transition-all font-bold"
              >
                Robots.txt
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h5 className="font-serif font-extrabold text-amber-200 text-xs uppercase tracking-wider mb-2">AUTHENTIC REASSURANCE</h5>
              <ul className="space-y-1 text-[#a49180] text-xs">
                <li className="flex items-center gap-1">✓ Ancient Firewood Furnaces</li>
                <li className="flex items-center gap-1">✓ Certified Organic Shodhit Minerals</li>
                <li className="flex items-center gap-1">✓ Non-Synthetic Glass Formulations</li>
                <li className="flex items-center gap-1">✓ Verified Doctor Sponsoring</li>
              </ul>
            </div>

            <div className="pt-3 border-t border-amber-950/40">
              <h5 className="font-serif font-extrabold text-amber-200 text-xs uppercase tracking-wider mb-2">Ayurveda Products &amp; Remedies</h5>
              <ul className="space-y-2 text-[#ead8c5] text-xs">
                <li>
                  <a href="https://ayush.gov.in/" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:underline font-bold block">
                    Ayush Ministry ↗
                  </a>
                  <span className="text-[#a49180] text-[10.5px] leading-tight block">Government of India’s official Ayurveda resources.</span>
                </li>
                <li>
                  <a href="https://www.patanjaliayurved.net/" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:underline font-bold block">
                    Patanjali Ayurveda ↗
                  </a>
                  <span className="text-[#a49180] text-[10.5px] leading-tight block">Widely available Ayurvedic medicines and wellness products.</span>
                </li>
                <li>
                  <a href="https://www.keralaayurveda.biz/" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:underline font-bold block">
                    Kerala Ayurveda ↗
                  </a>
                  <span className="text-[#a49180] text-[10.5px] leading-tight block">Trusted brand for classical formulations.</span>
                </li>
                <li>
                  <a href="https://himalayawellness.in/" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:underline font-bold block">
                    Himalaya Wellness ↗
                  </a>
                  <span className="text-[#a49180] text-[10.5px] leading-tight block">Herbal supplements and personal care.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <h5 className="font-serif font-extrabold text-amber-200">CORPUS CONTEXT &amp; LOCATION</h5>
            <div className="space-y-2 text-[#a49180]">
              <p className="flex items-start gap-1">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Railway Road, Rishikesh, Uttarakhand, 249201</span>
              </p>
              <p className="flex items-center gap-1">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>compounding@mangalamayur.in</span>
              </p>

              {/* Interactive Google Map Embed */}
              <div className="mt-3 rounded-lg overflow-hidden border border-amber-900/30 h-28 w-full shadow-inner relative group/map">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3451.905626359998!2d78.2965415!3d30.1119424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39091bd89df1fd7b%3A0xe5aef1bf22bd53ab!2sRailway%20Rd%2C%20Rishikesh%2C%20Uttarakhand%20249201!5e0!3m2!1sen!2sin!4v1718228312517!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  className="grayscale opacity-75 group-hover/map:opacity-100 group-hover/map:grayscale-0 transition-all duration-300"
                  style={{ border: 0 }} 
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <a 
                  href="https://maps.google.com/?q=Mangalam+Ayurveda+Railway+Road+Rishikesh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-1.5 right-1.5 bg-stone-900/90 hover:bg-stone-950 text-white text-[9px] px-2 py-0.5 rounded font-semibold font-mono flex items-center gap-1 shadow-sm transition-all"
                >
                  <MapPin className="w-2.5 h-2.5 text-amber-400" /> View Map
                </a>
              </div>

              <div className="pt-2">
                <span className="text-[10px] block text-stone-500 uppercase tracking-widest leading-none">SYSTEM METADATA</span>
                <span className="text-[9px] text-[#ead8c5]/70 font-mono">PORT 3000 ACCESSED • VITE COMPILED</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* 7. Google Pay Payment Sheet Modal */}
      {showGPaySheet && (
        <div className="fixed inset-0 bg-black/60 z-55 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-xs">
          <div className="bg-stone-900 text-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden border border-stone-800 flex flex-col font-sans transition-all transform scale-100 duration-300">
            {/* Top Bar Indicator for mobile */}
            <div className="w-12 h-1 bg-stone-700 rounded-full mx-auto my-3 sm:hidden" />
            
            {/* Header */}
            <div className="px-6 pb-4 pt-2 sm:pt-6 border-b border-stone-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                {/* Official standard-inspired GPay Icon banner */}
                <div className="flex items-center bg-white px-2.5 py-1 rounded font-sans tracking-tight shrink-0">
                  <span className="text-[#4285F4] font-black text-xs">G</span>
                  <span className="text-[#EA4335] font-black text-xs">o</span>
                  <span className="text-[#FBBC05] font-black text-xs">o</span>
                  <span className="text-[#4285F4] font-black text-xs">g</span>
                  <span className="text-[#34A853] font-black text-xs">l</span>
                  <span className="text-[#EA4335] font-black text-xs">e</span>
                  <span className="text-[#5f6368] font-bold text-xs ml-1">Pay</span>
                </div>
                <span className="text-xs font-semibold text-stone-400 font-mono">SECURE GATEWAY</span>
              </div>
              <button 
                onClick={() => {
                  setShowGPaySheet(false);
                  setGpayProcessingStep('idle');
                }}
                className="text-stone-400 hover:text-white hover:bg-stone-800 p-1 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              
              {/* Step 1: Idle - Select Payment source & Pay */}
              {gpayProcessingStep === 'idle' && (
                <div className="space-y-4">
                  {/* Business Identity */}
                  <div className="flex items-center gap-3 bg-stone-950 p-3 rounded-lg border border-stone-800">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-0.5 border border-amber-500 overflow-hidden shrink-0">
                      <img src={brandLogo} alt="MAB Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h5 className="text-[10px] uppercase text-stone-500 font-mono font-bold leading-none">Paying Merchant</h5>
                      <p className="text-xs font-black text-amber-100 mt-1 font-serif text-left">MANGALAM AYURVEDA AUSHADH BHANDAR</p>
                      <p className="text-[9px] text-stone-400 text-left">Merchant UPI: mangalam@okaxis</p>
                    </div>
                  </div>

                  {/* Bill Total details */}
                  <div className="flex justify-between items-center text-sm bg-stone-950 px-4 py-2.5 rounded-lg border border-stone-880">
                    <span className="text-stone-400 font-mono text-xs">Inquiry Bill Amount:</span>
                    <span className="text-lg font-black text-emerald-400 font-mono">₹{totalInquiryPrice}</span>
                  </div>

                  {/* Google Account Profile */}
                  <div className="flex items-center gap-2 px-1">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-[#EA4335] text-white flex items-center justify-center text-[10px] font-bold">
                      M
                    </div>
                    <div className="text-stone-300 text-xs">
                      Paying as <span className="text-white font-medium">m77238378@gmail.com</span>
                    </div>
                  </div>

                  {/* Payment Instrument accounts list */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider text-left">Choose payment account</p>
                    
                    {/* GPay Balance option */}
                    <div 
                      onClick={() => setGpaySelectedMethod('gpay_balance')}
                      className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                        gpaySelectedMethod === 'gpay_balance'
                          ? 'bg-stone-800 border-emerald-550 shadow-xs'
                          : 'bg-stone-950 border-stone-800 hover:bg-stone-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-950 flex items-center justify-center text-emerald-400 border border-emerald-800 font-serif">
                          ₹
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-bold">Google Pay Balance</p>
                          <p className="text-[10px] text-stone-400">Available: ₹12,450.00</p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        gpaySelectedMethod === 'gpay_balance' ? 'border-emerald-400 bg-emerald-500 text-white' : 'border-stone-700'
                      }`}>
                        {gpaySelectedMethod === 'gpay_balance' && <div className="w-1.5 h-1.5 rounded-full bg-stone-900" />}
                      </div>
                    </div>

                    {/* State Bank of India account */}
                    <div 
                      onClick={() => setGpaySelectedMethod('sbi')}
                      className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                        gpaySelectedMethod === 'sbi'
                          ? 'bg-stone-800 border-emerald-550 shadow-xs'
                          : 'bg-stone-950 border-stone-800 hover:bg-stone-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-950 flex items-center justify-center text-blue-400 border border-blue-800 font-mono text-xs font-bold uppercase">
                          SBI
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-bold">State Bank of India</p>
                          <p className="text-[10px] text-stone-400">Savings Account (•••• 4821)</p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        gpaySelectedMethod === 'sbi' ? 'border-emerald-400 bg-emerald-500 text-white' : 'border-stone-700'
                      }`}>
                        {gpaySelectedMethod === 'sbi' && <div className="w-1.5 h-1.5 rounded-full bg-stone-900" />}
                      </div>
                    </div>

                    {/* HDFC bank account */}
                    <div 
                      onClick={() => setGpaySelectedMethod('hdfc')}
                      className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                        gpaySelectedMethod === 'hdfc'
                          ? 'bg-stone-800 border-emerald-550 shadow-xs'
                          : 'bg-stone-950 border-stone-800 hover:bg-stone-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-teal-950 flex items-center justify-center text-teal-400 border border-teal-800 font-mono text-xs font-bold uppercase">
                          HDF
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-bold">HDFC Bank Ltd</p>
                          <p className="text-[10px] text-stone-400">Savings Account (•••• 6190)</p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        gpaySelectedMethod === 'hdfc' ? 'border-emerald-400 bg-emerald-500 text-white' : 'border-stone-700'
                      }`}>
                        {gpaySelectedMethod === 'hdfc' && <div className="w-1.5 h-1.5 rounded-full bg-stone-900" />}
                      </div>
                    </div>
                  </div>

                  {/* Proceed trigger button */}
                  <button
                    onClick={() => {
                      setGpayProcessingStep('linking');
                      setTimeout(() => {
                        setGpayProcessingStep('authorization');
                      }, 2000);
                    }}
                    className="w-full bg-[#1a73e8] hover:bg-blue-600 active:bg-blue-700 text-white font-bold text-xs py-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-md uppercase tracking-wider cursor-pointer font-sans"
                  >
                    Proceed to Pay ₹{totalInquiryPrice}
                  </button>
                </div>
              )}

              {/* Step 2: Linking Bank / Gateway Processing */}
              {gpayProcessingStep === 'linking' && (
                <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="relative w-12 h-12">
                    <div className="absolute inset-0 rounded-full border-4 border-stone-800 animate-pulse" />
                    <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-blue-500 animate-spin" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm">Contacting Payment Gateway...</h5>
                    <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto leading-relaxed">
                      Handshaking securely with {
                        gpaySelectedMethod === 'gpay_balance' ? 'Google Pay Core Wallet' :
                        gpaySelectedMethod === 'sbi' ? 'State Bank of India Node' : 'HDFC UPI Node'
                      }.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3: Authorization (PIN submission simulation) */}
              {gpayProcessingStep === 'authorization' && (
                <div className="space-y-4 text-center">
                  <div className="bg-stone-950 p-4 rounded-lg border border-stone-800">
                    <p className="text-xs text-stone-400">Securing Payment Authorization</p>
                    <h5 className="font-serif text-lg font-bold text-amber-100 mt-1">₹{totalInquiryPrice}</h5>
                    <p className="text-[10px] text-stone-500 font-mono mt-1">Ref ID: GPAY-AUTH-{Math.floor(100000 + Math.random() * 900000)}</p>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-[10px] font-mono text-center text-stone-400 uppercase tracking-widest leading-none">
                      🔒 Enter UPI PIN / Fingerprint Authorization
                    </label>
                    
                    <div className="flex justify-center gap-3 py-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-blue-500 animate-bounce" />
                      <div className="w-3.5 h-3.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.1s]" />
                      <div className="w-3.5 h-3.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                      <div className="w-3.5 h-3.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.3s]" />
                    </div>

                    <p className="text-[10px] text-stone-500 text-center max-w-xs mx-auto leading-relaxed">
                      For simulation security, please click the confirmation button below to authorize this demo compounding transaction instantly.
                    </p>

                    <button
                      onClick={async () => {
                        setGpayProcessingStep('success');
                        playGPaySuccessSound();
                        
                        const randomTxn = `GPAY-Y26B-${Math.floor(1000 + Math.random() * 9000)}-XN8A`;
                        setGpayTxnId(randomTxn);
                        setIsPaidViaGPay(true);

                        await commitSubmittedInquiry(randomTxn, true);
                        
                        setTimeout(() => {
                          setIsOrderSubmitted(true);
                          setShowGPaySheet(false);
                          setGpayProcessingStep('idle');
                        }, 2500);
                      }}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs py-3 rounded-lg transition-all flex items-center justify-center gap-1.5 uppercase shadow-md cursor-pointer"
                    >
                      ✓ Tap to Authorize Payment
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Success state inside GPay modal */}
              {gpayProcessingStep === 'success' && (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-2 left-6 w-1.5 h-3.5 bg-yellow-400 rotate-12" />
                    <div className="absolute top-4 right-10 w-2 h-2 bg-blue-400 rounded-full" />
                    <div className="absolute bottom-6 left-12 w-2 h-2 bg-red-400 -rotate-45" />
                    <div className="absolute bottom-8 right-16 w-3 h-1.5 bg-[#10b981] rotate-45" />
                  </div>

                  <div className="w-16 h-16 bg-emerald-950/80 rounded-full flex items-center justify-center border border-emerald-550 text-emerald-400 relative">
                    <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                  </div>

                  <div>
                    <h5 className="font-bold text-emerald-400 text-base">Payment Successful!</h5>
                    <p className="text-xs text-white mt-1">₹{totalInquiryPrice} Transferred Securely</p>
                    <p className="text-[10px] text-stone-400 mt-2 font-mono">Txn ID: {gpayTxnId}</p>
                  </div>

                  <div className="bg-stone-950 px-4 py-2 rounded-md border border-stone-850 inline-flex items-center gap-1 text-[10px] text-stone-400">
                    <span>Authenticating compounding queue...</span>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer Reassurance */}
            <div className="bg-stone-950 px-6 py-3 border-t border-stone-800/60 flex items-center justify-center gap-1.5 text-[10px] text-stone-500 font-sans">
              <span className="text-emerald-500 font-bold">100% SECURE</span> • Powered by UPI Unified Payments Gateway Encryption
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal Overlay */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialMode={authModalMode}
        onAuthSuccess={() => {
          // Successfully logged in
        }}
      />

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal 
        isOpen={isPrivacyModalOpen} 
        onClose={() => setIsPrivacyModalOpen(false)} 
      />

    </div>
  );

  // Helper utility to dynamically query how many products map to a category
  function productCountForCategory(catId: string) {
    if (catId === 'all') return PRODUCTS.length;
    return PRODUCTS.filter(p => p.category === catId).length;
  }

  // Helper utility to dynamically query how many products map to an Indian season
  function productCountForSeason(seasonId: string) {
    if (seasonId === 'all') return PRODUCTS.length;
    return PRODUCTS.filter(p => p.seasons && p.seasons.includes(seasonId)).length;
  }
}
