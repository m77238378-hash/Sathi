import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Clock, 
  Compass, 
  ArrowRight, 
  Leaf, 
  Flame, 
  Wind, 
  Heart, 
  Users, 
  BookOpen, 
  Activity,
  Award,
  ShieldAlert,
  ArrowRightCircle
} from 'lucide-react';

interface HomeSectionProps {
  onTabChange: (tab: 'catalog' | 'yoga' | 'about' | 'join') => void;
  activeRituId?: string;
  userEmail?: string;
}

// 6 Dinacharya time phases in a day
const DINACHARYA_PHASES = [
  {
    name: 'Brahma Muhurta (Ascension of Prana)',
    timeRange: '04:00 - 06:00',
    startHour: 4,
    endHour: 6,
    dosha: 'Vata / Sattva',
    description: 'The early pre-dawn hour where pure cosmic Prana is highest.',
    guideline: 'Optimal for spiritual study, deep chanting, breathwork (Pranayama), or setting pristine satvic intentions before daybreak.',
    icon: Wind
  },
  {
    name: 'Pratah Snana & Morning Sadhana',
    timeRange: '06:00 - 10:00',
    startHour: 6,
    endHour: 10,
    dosha: 'Kapha Accumulation',
    description: 'The period of stability and physical stamina.',
    guideline: 'Engage in active physical exercises, yogic kriya sequences, warm herbal self-massage (Abhyanga), and enjoy a light toasted warm breakfast.',
    icon: Activity
  },
  {
    name: 'Madhyahna (Agni Core Activity)',
    timeRange: '10:00 - 14:00',
    startHour: 10,
    endHour: 14,
    dosha: 'Pitta (Peak Digestion)',
    description: 'Agni (digestive fire) peaks in synchronization with the highest sun.',
    guideline: 'This is the ideal window for your largest, most nutritious meal of the day. Focus on raw / complex cooling grains or roasted roots. Avoid cold ice-cold liquids.',
    icon: Flame
  },
  {
    name: 'Aparahna (Intellectual Reflection)',
    timeRange: '14:00 - 18:00',
    startHour: 14,
    endHour: 18,
    dosha: 'Vata (High Mobility)',
    description: 'Mental focus and communications peak in high velocity.',
    guideline: 'Ideal for teaching, writing, studying, and completing complex analytical tasks. Supplement with warm cardamom-ginger tea to soothe nervous movement.',
    icon: Compass
  },
  {
    name: 'Sandhya Kala (Twilight Transition)',
    timeRange: '18:00 - 20:00',
    startHour: 18,
    endHour: 20,
    dosha: 'Kapha / Rest & Transition',
    description: 'The sacred dusk phase as nature transitions into rest.',
    guideline: 'Unwind with light prayer, warm light-cooked dinners, gentle strolls, and a complete disconnection from electronic screens.',
    icon: Leaf
  },
  {
    name: 'Ratri Kala (Sleep & Ojas Synthesis)',
    timeRange: '20:00 - 04:00',
    startHour: 20,
    endHour: 28, // Wrap hours up to 4 AM next day
    dosha: 'Pitta / Mind Detoxification',
    description: 'Internal rejuvenation and liver/cell cleansing cycle.',
    guideline: 'Retire to deep sleep by 10:00 PM to let your physical body synthesize Ojas (vital immunity). Drink warm nutmeg-infused golden milk before bed.',
    icon: Heart
  }
];

export default function HomeSection({ onTabChange, activeRituId, userEmail }: HomeSectionProps) {
  // Live clock state
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  // Calculate current active Dinacharya phase
  const currentPhase = useMemo(() => {
    const hour = time.getHours();
    // Special handling for pre-dawn wrap
    const modifiedHour = hour < 4 ? hour + 24 : hour;
    
    return DINACHARYA_PHASES.find(p => {
      if (p.startHour <= modifiedHour && modifiedHour < p.endHour) {
        return true;
      }
      return false;
    }) || DINACHARYA_PHASES[5]; // Fallback to Ratri
  }, [time]);

  // Quiz assessment state for quick dosha estimator
  const [quizStep, setQuizStep] = useState<number>(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [outcome, setOutcome] = useState<string>('');

  const questions = [
    {
      q: "Which best describes your physical frame and activity level?",
      options: [
        { text: "Lean, slender, and rapidly moving with quick variable energy", val: "Vata" },
        { text: "Medium build, strong muscle tone with focused, deliberate movement", val: "Pitta" },
        { text: "Broad, robust, high stamina but slower, grounded movement", val: "Kapha" }
      ]
    },
    {
      q: "How does your digestive system and appetite behave?",
      options: [
        { text: "Irregular, fluctuating, easily bloated, variable hunger", val: "Vata" },
        { text: "Intense, strong, gets hangry if delayed, high metabolic speed", val: "Pitta" },
        { text: "Slow but steady, can skip meals comfortably, heavy digestion", val: "Kapha" }
      ]
    },
    {
      q: "Under emotional pressure or stress, what is your initial tendency?",
      options: [
        { text: "Prone to worry, racing thoughts, restlessness, and light sleep", val: "Vata" },
        { text: "Prone to irritability, hot impatience, demands solutions", val: "Pitta" },
        { text: "Prone to calm resistance, quiet retreat, complacency, or lethargy", val: "Kapha" }
      ]
    }
  ];

  const handleSelectOption = (val: string) => {
    const newAnswers = [...answers, val];
    setAnswers(newAnswers);
    if (quizStep < questions.length - 1) {
      setQuizStep(prev => prev + 1);
    } else {
      // Calculate majority
      const counts: Record<string, number> = { Vata: 0, Pitta: 0, Kapha: 0 };
      newAnswers.forEach(ans => { counts[ans] = (counts[ans] || 0) + 1; });
      let finalDosha = "Vata";
      if (counts.Pitta > counts[finalDosha]) finalDosha = "Pitta";
      if (counts.Kapha > counts[finalDosha]) finalDosha = "Kapha";
      setOutcome(finalDosha);
      setQuizStep(3); // Result step
    }
  };

  const handleResetQuiz = () => {
    setQuizStep(0);
    setAnswers([]);
    setOutcome('');
  };

  return (
    <div id="mab-home-root" className="space-y-12 animate-fade-in text-stone-800 text-left">
      
      {/* 1. HERO BANNER WITH SPIRITUAL GOLD AND EMBER DECORATIONS */}
      <section 
        id="mab-home-hero" 
        className="bg-[#2a170b] text-[#faf2e6] rounded-3xl border border-amber-900/10 p-8 md:p-14 relative overflow-hidden shadow-lg flex flex-col md:flex-row justify-between items-center gap-10"
      >
        {/* Layered radial gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/50 via-stone-950/85 to-[#1a0c06] -z-10" />
        
        {/* Abstract sacred grid background */}
        <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-[0.03] pointer-events-none hidden md:block">
          <svg viewBox="0 0 100 100" fill="currentColor" className="text-amber-500 w-full h-full">
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.3" fill="none" />
            <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="0.3" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.3" />
            <polygon points="50,5 95,50 50,95 5,50" stroke="currentColor" strokeWidth="0.2" fill="none" />
            <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="0.3" fill="none" strokeDasharray="3,3" />
          </svg>
        </div>

        <div className="space-y-6 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> Authentic Vedic Curation Hub
          </span>
          
          <h1 className="font-serif text-3xl md:text-6xl font-black tracking-tight text-[#faf2e6] leading-none">
            Mangalam Ayurveda
          </h1>
          
          <p className="font-serif italic text-amber-100 text-lg md:text-xl leading-relaxed max-w-2xl">
            "स्वस्थस्य स्वास्थ्य रक्षणं, आतुरस्य विकार प्रशमनं च।"
          </p>
          <p className="text-[#eadbc8] text-[13px] md:text-sm leading-relaxed max-w-2xl font-mono">
            — Preserving the profound equilibrium of the healthy, while soothing clinical anomalies with traditional herbal compounding secrets, yogic sadhanas, and lineage-tested formulas.
          </p>

          <p className="text-stone-300 text-xs md:text-sm max-w-xl leading-relaxed">
            Welcome to the sanctuary of absolute wellness. We bridge pure botanical formulations with modern analytical precision, offering lineage guidance, customized daily routines, and pranayama disciplines for holistic life energy alignment.
          </p>

          <div className="flex flex-wrap gap-3 pt-3">
            <button
              onClick={() => onTabChange('catalog')}
              className="bg-amber-500 hover:bg-amber-600 text-[#1a0f0a] font-serif font-black text-xs md:text-sm px-5 py-3 rounded-xl shadow-lg transition-all cursor-pointer border-none flex items-center gap-2 font-bold"
            >
              Consult Remedy Catalog <ArrowRight className="w-4 h-4 text-[#1a0f0a]" />
            </button>
            <button
              onClick={() => onTabChange('yoga')}
              className="bg-white/10 hover:bg-white/15 text-white border border-white/20 font-serif font-bold text-xs md:text-sm px-5 py-3 rounded-xl transition-all cursor-pointer flex items-center gap-2"
            >
              Explore Yogic Kriyas <Wind className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>

        {/* Small Highlight Stats Box */}
        <div className="bg-[#1f1107] border border-amber-900/35 rounded-2xl p-6 w-full md:w-80 shadow-md shrink-0 space-y-4 self-stretch flex flex-col justify-between">
          <div className="space-y-3">
            <h4 className="font-serif text-[#faf2e6] font-bold text-sm border-b border-amber-900/10 pb-1.5 flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400" /> Botanical Alliance
            </h4>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-[#eadbc8]">Traditional Formulas</span>
                <span className="text-amber-300 font-bold">100% Genuine</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-[#eadbc8]">Himalayan Sourcing</span>
                <span className="text-emerald-400 font-bold">Ethically Wild</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-[#eadbc8]">Consultation Lineage</span>
                <span className="text-amber-300 font-bold">Vaidya Master Pool</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-500/5 px-3 py-2 border border-amber-500/10 rounded-lg text-center">
            <span className="text-[10px] text-[#eadbc8] font-bold uppercase tracking-wider block">Your Location Access</span>
            <span className="text-[11px] text-amber-250 italic">Sanskrit Digital Curation Hub</span>
          </div>
        </div>
      </section>

      {/* 2. LIVE DINACHARYA REAL-TIME TRACKER SECTION */}
      <section id="mab-dinacharya-tracker" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Dynamic Highlight Card (Left) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#fdfbf7] to-[#f7f2e9] rounded-2xl border border-amber-900/15 p-6 shadow-xs space-y-6">
          <div className="flex justify-between items-center border-b border-amber-900/10 pb-4">
            <div className="space-y-1">
              <span className="uppercase text-[9px] font-mono font-bold tracking-wider text-amber-700 block">Live Vedic Clock</span>
              <h3 className="font-serif font-black text-stone-900 text-lg flex items-center gap-1.5">
                <Clock className="w-4.5 h-4.5 text-amber-800" /> Active Dinacharya Phase
              </h3>
            </div>
            
            {/* Elegant live counter display */}
            <div className="bg-[#2d1b10] px-3.5 py-1.5 rounded-xl border border-amber-700 text-center shadow-xs">
              <span className="text-[10px] font-mono text-amber-400 font-bold block leading-none select-none uppercase tracking-wider">GMT+5:30 Equivalent</span>
              <span className="font-mono text-[12px] font-black text-white block mt-1 tracking-wider leading-none">{formattedTime}</span>
            </div>
          </div>

          {/* Current Period Detailed Overview */}
          <div className="bg-white/70 rounded-xl p-4 border border-amber-950/5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="bg-[#2d1b10] text-[#faf2e6] w-10 h-10 rounded-xl flex items-center justify-center border border-amber-800/10 shadow-xs">
                {React.createElement(currentPhase.icon, { className: 'w-5 h-5 text-amber-300' })}
              </div>
              <div className="text-left">
                <h4 className="font-serif font-black text-[#2d1b10] text-[13px] md:text-sm">
                  {currentPhase.name}
                </h4>
                <div className="flex gap-2 mt-0.5">
                  <span className="text-[10px] bg-amber-500/15 text-amber-900 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider">{currentPhase.timeRange}</span>
                  <span className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider">Governs: {currentPhase.dosha}</span>
                </div>
              </div>
            </div>

            <p className="text-stone-700 text-[11px] leading-relaxed italic border-l-2 border-amber-700 pl-3">
              "{currentPhase.description}"
            </p>

            <div className="pt-2">
              <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-stone-400 block mb-1">Recommended Routine Duty:</span>
              <p className="text-stone-800 text-[11.5px] leading-relaxed">
                {currentPhase.guideline}
              </p>
            </div>
          </div>

          <div className="p-3 bg-indigo-50 border border-indigo-150 text-indigo-950 text-[10.5px] rounded-xl flex gap-2.5">
            <Award className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
            <p className="leading-snug">
              <strong>Seasonal Context (Ritu):</strong> This diurnal cycle operates inside our botanical catalog's current highlighted seasonal preservation algorithm.
            </p>
          </div>
        </div>

        {/* Directory/Wheel of 6 phases (Right) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-6 space-y-5">
          <div className="text-left">
            <h3 className="font-serif font-black text-stone-900 text-base md:text-lg">
              The Six Daily Cycles (Shat Samaya)
            </h3>
            <p className="text-xs text-stone-550 mt-0.5">
              Traditional Dinacharya operates in three-hour cycles synchronized to biological humor rises and sun ascension points.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {DINACHARYA_PHASES.map((p, idx) => {
              const isActive = p.name === currentPhase.name;
              const IconComp = p.icon;
              return (
                <div 
                  key={idx}
                  className={`p-3.5 rounded-xl border transition-all text-left flex gap-3 relative overflow-hidden ${
                    isActive 
                      ? 'bg-amber-500/[0.04] border-amber-800 shadow-3xs' 
                      : 'bg-stone-50/50 border-stone-100 hover:bg-stone-100/55'
                  }`}
                >
                  {isActive && (
                    <div className="absolute right-2 top-2">
                      <span className="bg-amber-900 text-[#faf2e6] text-[8px] font-mono font-black uppercase px-1.5 py-0.5 rounded shadow-3xs">
                        CURRENT NOW
                      </span>
                    </div>
                  )}

                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isActive ? 'bg-[#2d1b10] text-[#faf2e6]' : 'bg-stone-200 text-stone-500'
                  }`}>
                    <IconComp className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-stone-700'}`} />
                  </div>

                  <div className="space-y-1">
                    <h5 className="font-serif font-bold text-stone-900 text-[12px] leading-tight">
                      {p.name}
                    </h5>
                    <div className="flex gap-1.5 items-center">
                      <span className="text-[9px] font-mono font-bold text-stone-500 uppercase tracking-wider">{p.timeRange}</span>
                      <span className="text-[10px] text-amber-800">•</span>
                      <span className="text-[9px] font-mono text-[#2d1b10] font-bold uppercase">{p.dosha}</span>
                    </div>
                    <p className="text-[10.5px] text-stone-550 leading-relaxed max-w-sm">
                      {p.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </section>

      {/* 3. CORE PILLARS OF HEALING */}
      <section id="mab-healing-pillars" className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="font-serif text-2xl md:text-3xl font-black text-stone-900 tracking-tight">
            The Triple Pillars of Complete Life (Tri-Sutra)
          </h2>
          <p className="text-xs text-stone-550 leading-relaxed font-sans">
            Classical wellness is founded not on symptom extraction, but on the three functional lifestyle matrices that support eternal vitality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Ahara */}
          <div className="bg-[#fafbf8] border border-stone-200 rounded-2xl p-6 hover:shadow-xs transition-shadow text-left space-y-4">
            <div className="bg-[#eaefe3] text-[#3c5225] w-12 h-12 rounded-xl flex items-center justify-center border border-emerald-900/5">
              <Leaf className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <span className="text-[9.5px] font-mono uppercase tracking-wider text-emerald-800 font-bold block">Pillar One</span>
              <h3 className="font-serif font-black text-[#2d1b10] text-sm md:text-base">Ahara — Conscious Food</h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed font-sans">
              "Ayurveda believes food is the first master medicine." We analyze the six tastes (Shad Rasa), seasonal digestion speeds, and warm ghee-based cooking combinations to feed your gut Agni perfectly.
            </p>
          </div>

          {/* Vihara */}
          <div className="bg-[#faf9fb] border border-stone-200 rounded-2xl p-6 hover:shadow-xs transition-shadow text-left space-y-4">
            <div className="bg-[#efeaf6] text-[#4d2f73] w-12 h-12 rounded-xl flex items-center justify-center border border-indigo-900/5">
              <Wind className="w-6 h-6 text-indigo-850" />
            </div>
            <div className="space-y-1.5">
              <span className="text-[9.5px] font-mono uppercase tracking-wider text-indigo-700 font-bold block">Pillar Two</span>
              <h3 className="font-serif font-black text-[#2d1b10] text-sm md:text-base">Vihara — Harmonic Routines</h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed font-sans">
              Daily posture routines, breathing modifications (Yogic Pranayama), and season-specific sleep routines that keep your psychological humors (Vata, Pitta, Kapha) grounded in perfect rhythmic cycles.
            </p>
          </div>

          {/* Aushadhi */}
          <div className="bg-[#fcfaf4] border border-stone-200 rounded-2xl p-6 hover:shadow-xs transition-shadow text-left space-y-4">
            <div className="bg-[#faf3e3] text-[#71542f] w-12 h-12 rounded-xl flex items-center justify-center border border-amber-900/10">
              <Flame className="w-6 h-6 text-amber-800" />
            </div>
            <div className="space-y-1.5">
              <span className="text-[9.5px] font-mono uppercase tracking-wider text-amber-800 font-bold block">Pillar Three</span>
              <h3 className="font-serif font-black text-[#2d1b10] text-sm md:text-base">Aushadhi — Herb Compounding</h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed font-sans">
              Dynamic traditional formulations ranging from high-mountain Shilajit balances, Churanas, and Arishtams, processed through Gurukula clinical heritage standards to yield authentic active properties.
            </p>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE DOSHA QUICK ESTIMATOR */}
      <section id="mab-dosha-quick-check" className="bg-[#fcfbf9] rounded-2xl border border-amber-950/15 p-6 md:p-8 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Explanation Text */}
          <div className="lg:col-span-5 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-800/10 text-amber-950 font-mono text-[10px] font-semibold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 text-amber-800 animate-spin" /> Humoral Constitutions
            </span>
            <h3 className="font-serif font-black text-stone-900 text-lg md:text-2xl leading-tight">
              Assess Your Dominant Life Humor (Prakriti)
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed font-sans">
              According to ancient sages, each individual possesses a customizable bio-energy distribution of <strong>Vata</strong> (Air &amp; Ether), <strong>Pitta</strong> (Fire &amp; Water), and <strong>Kapha</strong> (Earth &amp; Water). 
            </p>
            <p className="text-xs text-stone-500 leading-relaxed">
              Answer this quick three-question diagnostic check. It provides a simple estimation and invites you to explore corresponding formulas inside our live Remedy Catalog!
            </p>
          </div>

          {/* Interactive Form Display */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-stone-200/80 p-5 shadow-3xs text-left">
            {quizStep < 3 ? (
              <div className="space-y-5 animate-fade-in">
                <div className="flex justify-between items-center bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-150">
                  <span className="text-[10px] font-mono text-stone-400 font-bold uppercase">Constitutional Diagnosis Check</span>
                  <span className="text-[10px] font-mono text-amber-800 font-bold">Question {quizStep + 1} of 3</span>
                </div>
                
                <h4 className="font-serif font-bold text-[#2d1b10] text-sm md:text-base leading-relaxed">
                  {questions[quizStep].q}
                </h4>

                <div className="space-y-2">
                  {questions[quizStep].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(opt.val)}
                      className="w-full text-left p-3 rounded-lg border border-stone-150 hover:border-amber-800 hover:bg-stone-50/50 transition-all text-xs font-sans text-stone-800 font-medium tracking-tight cursor-pointer focus:outline-none flex justify-between items-center"
                    >
                      <span>{opt.text}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-stone-400 shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Outcome Screen */
              <div className="text-center py-6 space-y-4 animate-fade-in font-sans">
                <div className="w-14 h-14 rounded-full bg-amber-500/15 text-amber-900 flex items-center justify-center mx-auto shadow-xs">
                  <Leaf className="w-7 h-7" />
                </div>
                
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono font-bold text-stone-400 uppercase tracking-widest block">Estimated Primary Predominance</span>
                  <h4 className="font-serif text-xl md:text-2xl font-black text-[#2d1b10] tracking-tight">
                    {outcome} Recurrent Humor (Prakriti)
                  </h4>
                  <p className="text-xs text-stone-550 max-w-md mx-auto leading-relaxed">
                    {outcome === 'Vata' && "Vata represents movement, air, and ether. You benefit from warm, heavy, lubricating foods, cozy routines, and mild oil-based self massages."}
                    {outcome === 'Pitta' && "Pitta represents digestion, heat, and focus. You benefit from sweet, cooling, hydrating habits, avoidance of spicy chilis, and cooling mint-fennel teas."}
                    {outcome === 'Kapha' && "Kapha represents cohesion, Earth, and calm. You benefit from warm, light, spicy foods, active physical exercises, and morning breathing (Pranayama) routines."}
                  </p>
                </div>

                <div className="flex justify-center gap-3 pt-3">
                  <button
                    onClick={handleResetQuiz}
                    className="border border-[#2d1b10]/20 hover:bg-stone-55 text-stone-800 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Retake Humoral Check
                  </button>
                  <button
                    onClick={() => {
                      onTabChange('catalog');
                    }}
                    className="bg-amber-900 hover:bg-[#2d1b10] text-[#faf2e6] px-5 py-2 rounded-xl text-xs font-serif font-black cursor-pointer shadow-sm border-none flex items-center gap-1.5"
                  >
                    Recommend Remedy Matches <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 5. GENTLE PATH CTAs FOOTER */}
      <section id="mab-home-footer-nav" className="border-t border-stone-200/70 pt-8">
        <h3 className="font-serif text-[#2d1b10] font-black text-sm md:text-base text-center uppercase tracking-wider mb-6">
          Direct Path Curation Tools
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div 
            onClick={() => onTabChange('catalog')}
            className="group cursor-pointer bg-stone-50 hover:bg-[#2d1b10] hover:text-[#faf2e6] border border-stone-150 p-5 rounded-xl transition-all duration-300 text-left space-y-2.5 flex flex-col justify-between"
          >
            <div className="space-y-1">
              <h5 className="font-serif font-black text-sm group-hover:text-amber-300 transition-colors">
                1. Browse Authentic Remedies
              </h5>
              <p className="text-[11px] text-stone-500 group-hover:text-stone-300 transition-colors leading-relaxed">
                Filter compounds by Rasa, seasonal preservation, or diagnostic indication rules.
              </p>
            </div>
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-amber-800 group-hover:text-amber-300 transition-colors inline-flex items-center gap-1">
              Browse Catalog <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          <div 
            onClick={() => onTabChange('yoga')}
            className="group cursor-pointer bg-stone-50 hover:bg-[#2d1b10] hover:text-[#faf2e6] border border-stone-150 p-5 rounded-xl transition-all duration-300 text-left space-y-2.5 flex flex-col justify-between"
          >
            <div className="space-y-1">
              <h5 className="font-serif font-black text-sm group-hover:text-amber-300 transition-colors">
                2. Practice Breath &amp; Kriyas
              </h5>
              <p className="text-[11px] text-stone-500 group-hover:text-stone-300 transition-colors leading-relaxed">
                Unlock active breathing practices carefully compiled to balance specific seasons.
              </p>
            </div>
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-amber-800 group-hover:text-amber-300 transition-colors inline-flex items-center gap-1">
              Open Pranayama <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          <div 
            onClick={() => onTabChange('join')}
            className="group cursor-pointer bg-stone-50 hover:bg-[#2d1b10] hover:text-[#faf2e6] border border-stone-150 p-5 rounded-xl transition-all duration-300 text-left space-y-2.5 flex flex-col justify-between"
          >
            <div className="space-y-1">
              <h5 className="font-serif font-black text-sm group-hover:text-amber-300 transition-colors">
                3. Enter Botanical Alliance
              </h5>
              <p className="text-[11px] text-stone-500 group-hover:text-stone-300 transition-colors leading-relaxed">
                Send invitations to peers or apply to join our safe manuscript curation circle.
              </p>
            </div>
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-amber-800 group-hover:text-amber-300 transition-colors inline-flex items-center gap-1">
              View Alliance <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </section>

    </div>
  );
}
