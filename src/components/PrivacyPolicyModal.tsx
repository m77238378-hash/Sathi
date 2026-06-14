import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, Lock, Eye, FileText, Check, Heart, HelpCircle } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="privacy-policy-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-stone-900/70 z-55 flex items-center justify-center p-4 backdrop-blur-xs"
        >
          <motion.div
            id="privacy-policy-container"
            initial={{ scale: 0.95, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="bg-[#fdfbf7] text-stone-800 w-full max-w-2xl rounded-2xl shadow-2xl border border-stone-200/80 overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="bg-[#4a3525] p-5 text-[#faf2e6] relative flex items-center justify-between border-b border-amber-950/20 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="bg-amber-950/40 p-2 rounded-lg border border-amber-700/20">
                  <Shield className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-base md:text-lg text-amber-100 uppercase tracking-wider leading-none">
                    Security &amp; Privacy Policy
                  </h3>
                  <p className="text-[10px] text-amber-200/70 font-mono mt-1 uppercase tracking-widest">
                    MANGALAM AYURVEDA AUSHADH BHANDAR • EST. 1952
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="bg-amber-900/30 hover:bg-amber-900/60 text-white rounded-full p-2 transition-all cursor-pointer border border-transparent hover:border-amber-700/10"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 md:p-8 font-serif text-xs md:text-sm leading-relaxed text-stone-700">
              <div className="text-center space-y-2 border-b border-stone-200/60 pb-5">
                <p className="font-sans font-bold text-amber-900 text-xs tracking-wider uppercase">
                  Vedic Transparency &amp; Patient Confidences
                </p>
                <h4 className="font-serif font-bold text-amber-950 text-lg md:text-xl">
                  How We Protect Your Sacred Health Data
                </h4>
                <p className="text-stone-400 text-[11px] font-mono">
                  Last Updated: June 14, 2026 • Certified Compliant
                </p>
              </div>

              {/* Notice Intro */}
              <div className="bg-amber-50/40 border border-amber-900/10 rounded-xl p-4 flex gap-3 text-left">
                <Lock className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                <p className="text-[#5c3e2f] text-xs font-serif leading-relaxed">
                  In accordance with both classical Ayurvedic Vaidya confidentiality obligations and modern cybersecurity data protection acts, Mangalam Ayurveda guarantees absolute end-to-end security over your consultations, remedy preferences, and digital evaluation logs.
                </p>
              </div>

              {/* Sections */}
              <div className="space-y-5">
                {/* Section 1 */}
                <div className="space-y-2">
                  <h5 className="font-serif font-extrabold text-amber-950 flex items-center gap-1.5 uppercase text-xs md:text-sm tracking-wide">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-700"></span>
                    1. Consultation &amp; Prescriptive Metadata
                  </h5>
                  <p className="pl-3.5 text-stone-600">
                    When submiting compounding inquiries or seeking customized botanical mixtures (such as customized Bhasma, Kashaya, Guggulu, or Churna preparations), we collect:
                  </p>
                  <ul className="pl-8 list-disc space-y-1 text-stone-600 text-[11px] md:text-xs">
                    <li>Your full name, contact details (phone, email) for billing verification and notification setup.</li>
                    <li>Symptom histories, Dosha Nadi evaluation histories (Vata, Pitta, Kapha results), and compounding intake choices (Anupāna context).</li>
                    <li>Google Meet consultation metadata if you schedule remote Ayurvedic evaluations with our certified Chief Vaidyas.</li>
                  </ul>
                </div>

                {/* Section 2 */}
                <div className="space-y-2">
                  <h5 className="font-serif font-extrabold text-amber-950 flex items-center gap-1.5 uppercase text-xs md:text-sm tracking-wide">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-700"></span>
                    2. Security Vault &amp; Zero-Sharing Guarantee
                  </h5>
                  <p className="pl-3.5 text-stone-600">
                    Your records are never stored in generic unencrypted vaults. We employ:
                  </p>
                  <ul className="pl-8 list-disc space-y-1 text-stone-600 text-[11px] md:text-xs">
                    <li><strong>Secure Cloud SQL Infrastructure:</strong> Patient profiles, formula logs, and feedback statements are protected via secure internal database systems with rigid, parameterized zero-trust operations.</li>
                    <li><strong>No Commercial Selling:</strong> We will never share, sell, distribute, or license your symptom descriptions, personal names, or email configurations to medical networks or marketing advertisers.</li>
                    <li><strong>Temporary Local Storing:</strong> Cart preferences, Nadi Pariksha history cache, and authentication credentials are saved locally in standard client-side storage structures under direct user command.</li>
                  </ul>
                </div>

                {/* Section 3 */}
                <div className="space-y-2">
                  <h5 className="font-serif font-extrabold text-amber-950 flex items-center gap-1.5 uppercase text-xs md:text-sm tracking-wide">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-700"></span>
                    3. Telemedicine &amp; Realtime Meet Session Security
                  </h5>
                  <p className="pl-3.5 text-stone-600">
                    Videoconference sessions arranged via the Google Meet consultation gateway are conducted strictly over end-to-end encrypted tunnels. Conversation context is analyzed purely by your assigned wellness provider to compile recipes and is never recorded, logged, or transcribed by external algorithms.
                  </p>
                </div>

                {/* Section 4 */}
                <div className="space-y-2">
                  <h5 className="font-serif font-extrabold text-amber-950 flex items-center gap-1.5 uppercase text-xs md:text-sm tracking-wide">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-700"></span>
                    4. Financial Integrity &amp; Payment Privacy
                  </h5>
                  <p className="pl-3.5 text-[#5c3e2f] bg-amber-50/20 p-2.5 rounded-lg border border-amber-900/5">
                    We process all secure payments using the native Google Pay framework. None of your banking account credentials, card keys, or security pins are transferred to or stored on our servers. Transactions occur directly through Google's zero-knowledge banking pathways, ensuring safe, certified billing.
                  </p>
                </div>

                {/* Section 5 */}
                <div className="space-y-2">
                  <h5 className="font-serif font-extrabold text-amber-950 flex items-center gap-1.5 uppercase text-xs md:text-sm tracking-wide">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-700"></span>
                    5. Patient Empowerment Rights
                  </h5>
                  <p className="pl-3.5 text-stone-600">
                    You hold full rights over your profile data. At any moment, you can request full erasure of your historical Nadi Pariksha results, compounding inquiry logs, newsletter email status, and consultation histories from our Cloud SQL records by writing to our privacy officers at <span className="font-mono text-amber-900 text-xs font-semibold pr-1">compounding@mangalamayur.in</span> or visiting our Rishikesh dispensary counter in Uttarakhand.
                  </p>
                </div>
              </div>

              {/* Legal Reassurance Stamp */}
              <div className="border border-stone-200/80 bg-white rounded-xl p-4 flex flex-col md:flex-row items-center gap-4 shadow-3xs">
                <Heart className="w-8 h-8 text-amber-800 shrink-0 stroke-[1.2]" />
                <div className="text-center md:text-left space-y-1">
                  <h6 className="font-serif font-extrabold text-amber-950 text-xs uppercase tracking-wide">
                    Guaranteed Vedic Trust Seal
                  </h6>
                  <p className="text-[11px] text-stone-500 font-sans">
                    Each botanical inquiry and wellness blueprint remains a sacred mutual trust. Safe safeguarding is our chief dharma.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="bg-[#f5f2eb] p-4 border-t border-stone-250 flex items-center justify-end gap-2.5 shrink-0">
              <span className="text-[10px] text-stone-400 font-mono hidden sm:inline mr-auto">
                SECURE END-TO-END CONNECTION ACTIVE
              </span>
              <button
                type="button"
                onClick={onClose}
                className="bg-amber-900 hover:bg-[#3d2c1f] text-white font-mono font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg transition-all cursor-pointer shadow-3xs active:scale-98"
              >
                Acknowledge Policy
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
