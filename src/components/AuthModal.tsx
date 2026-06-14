import React, { useState } from 'react';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile,
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Key,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { initializeApp, getApp, getApps } from 'firebase/app';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase Auth
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: (user: any) => void;
  initialMode?: 'signin' | 'signup';
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialMode = 'signup' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setSuccessMsg(`Welcome, ${result.user.displayName || 'Vaidya User'}!`);
      setTimeout(() => {
        if (onAuthSuccess) onAuthSuccess(result.user);
        onClose();
        setSuccessMsg(null);
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to sign in with Google.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setError('Please fill in all required fields.');
      setIsLoading(false);
      return;
    }

    if (mode === 'signup') {
      if (!name) {
        setError('Please enter your full name.');
        setIsLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        setIsLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        setIsLoading(false);
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Set user display name
        await updateProfile(userCredential.user, { displayName: name });
        
        setSuccessMsg('Account created successfully! Welcome to Mangalam Ayurveda.');
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(userCredential.user);
          onClose();
          setSuccessMsg(null);
        }, 1500);
      } catch (err: any) {
        console.error(err);
        if (err.code === 'auth/email-already-in-use') {
          setError('This email is already in use. Try logging in instead.');
        } else if (err.code === 'auth/operation-not-allowed') {
          setError('Email/password sign-up is not yet enabled in the Firebase Console. Please enable it under Auth -> Sign-in methods, or sign up instantly with Google.');
        } else {
          setError(err.message || 'An error occurred during registration.');
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      // Login mode
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setSuccessMsg(`Logged in successfully! Welcome back, ${userCredential.user.displayName || 'Vaidya User'}.`);
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(userCredential.user);
          onClose();
          setSuccessMsg(null);
        }, 1500);
      } catch (err: any) {
        console.error(err);
        if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
          setError('Invalid email or password.');
        } else if (err.code === 'auth/invalid-credential') {
          setError('Invalid login credentials provided.');
        } else if (err.code === 'auth/operation-not-allowed') {
          setError('Email/password sign-in is not yet enabled in the Firebase Console. Please enable it, or sign in with Google.');
        } else {
          setError(err.message || 'An error occurred during authentication.');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="auth-modal-content" 
        className="relative w-full max-w-md bg-[#faf8f4] rounded-2xl border border-amber-900/20 shadow-xl overflow-hidden transition-all duration-300 transform scale-100"
      >
        {/* Double traditional gold headers */}
        <div className="relative bg-gradient-to-r from-amber-950 via-[#442614] to-amber-950 p-6 text-white text-center border-b border-amber-900/20">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-amber-200/80 hover:text-white bg-amber-900/40 hover:bg-amber-900/60 p-1.5 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-widest text-amber-300 uppercase block font-black">
              MANGALAM AYURVEDA SEVA
            </span>
            <h3 className="text-xl font-serif font-black tracking-wide text-amber-50">
              {mode === 'signup' ? 'CREATE DISCIPLINE ACCOUNT' : 'SECURE VAIDYA PORTAL'}
            </h3>
            <p className="text-[11px] text-amber-200/70 font-serif">
              {mode === 'signup' 
                ? 'Join our traditional Rishikesh healthcare & botanical repository' 
                : 'Access your personal diagnostic history and virtual clinic rooms'
              }
            </p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Status Message Containers */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-900 rounded-lg text-xs font-serif flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Notice:</strong> {error}
              </div>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg text-xs font-serif flex items-start gap-2 animate-fadeIn">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Success:</strong> {successMsg}
              </div>
            </div>
          )}

          {/* Social Sign-In (Highly Preferred & pre-configured) */}
          <div className="space-y-2">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center cursor-pointer select-none border border-[#747775] bg-white text-[#1f1f1f] rounded-lg px-4 py-2.5 transition-all hover:bg-stone-50 active:scale-98 shadow-2xs text-xs font-sans font-black uppercase tracking-wider gap-3"
            >
              <div className="w-4.5 h-4.5 shrink-0">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="block w-full h-full">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                </svg>
              </div>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-stone-200"></div>
            <span className="flex-shrink mx-3 text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest">Or Use Email</span>
            <div className="flex-grow border-t border-stone-200"></div>
          </div>

          {/* Email Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4 text-left">
            {mode === 'signup' && (
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-black text-stone-500 uppercase tracking-widest block">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    required
                    placeholder="E.g. Rajesh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-stone-200 bg-white text-xs font-serif text-stone-800 focus:outline-none focus:border-amber-800 focus:ring-1 focus:ring-amber-800"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-black text-stone-500 uppercase tracking-widest block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-stone-200 bg-white text-xs font-serif text-stone-800 focus:outline-none focus:border-amber-800 focus:ring-1 focus:ring-amber-800"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-black text-stone-500 uppercase tracking-widest block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-stone-200 bg-white text-xs font-serif text-stone-800 focus:outline-none focus:border-amber-800 focus:ring-1 focus:ring-amber-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-3 text-stone-400 hover:text-stone-600 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-black text-stone-500 uppercase tracking-widest block">
                  Confirm Password
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-stone-200 bg-white text-xs font-serif text-stone-800 focus:outline-none focus:border-amber-800 focus:ring-1 focus:ring-amber-800"
                  />
                </div>
              </div>
            )}

            {/* Note on Email password activation settings requirement */}
            <div className="text-[9.5px] text-stone-500 bg-amber-50/60 p-2.5 rounded border border-amber-900/5 leading-relaxed font-serif">
              <span className="font-extrabold text-[#8a5a36] uppercase tracking-wide block mb-0.5">ℹ️ Firebase Notice</span>
              To sign up with Email/Password, ensure "Email/Password" is enabled under the "Sign-in providers" tab in your Firebase Console authentication deck.
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-900 text-[#faf2e6] hover:bg-[#2d1b10] disabled:bg-stone-405 disabled:bg-[#837063] py-2.5 rounded-lg font-mono font-bold uppercase text-xs tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-3xs"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-[#faf2e6] border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : mode === 'signup' ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Complete Registration
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-300" /> Authorize & Sign In
                </>
              )}
            </button>
          </form>

          {/* Toggle link */}
          <div className="text-center pt-2">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => {
                setMode(mode === 'signup' ? 'signin' : 'signup');
                setError(null);
                setSuccessMsg(null);
              }}
              className="text-xs text-amber-900 hover:text-[#2d1b10] font-serif font-black underline hover:no-underline cursor-pointer focus:outline-none"
            >
              {mode === 'signup' 
                ? 'Already have an Ayurvedic account? Log In here' 
                : "Don't have an account? Sign Up & join us today!"
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
