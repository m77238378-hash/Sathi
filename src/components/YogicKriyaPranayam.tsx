import React, { useState, useEffect, useRef } from 'react';
import { 
  Wind, 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Activity, 
  Flame, 
  Droplets, 
  Sun, 
  Moon, 
  BookOpen, 
  Heart, 
  AlertCircle, 
  ArrowRight,
  TrendingUp,
  Volume2,
  VolumeX,
  Compass,
  CheckCircle2,
  Calendar,
  Sparkles,
  Headphones
} from 'lucide-react';

interface YogicKriyaPranayamProps {
  activeRituId: string;
}

interface RoutineDetail {
  id: string;
  name: string;
  sanskritName: string;
  sourceText: string;
  type: 'Pranayama' | 'Kriya';
  primaryDosha: 'Vata' | 'Pitta' | 'Kapha' | 'Tridoshic';
  therapeuticBenefits: string[];
  contraindications: string[];
  stepByStep: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  bestSeason: string[]; // Ritu IDs
  temperatureEffect: 'Heating' | 'Cooling' | 'Neutral';
  detailedDesc: string;
  gazeOrBandha?: string;
}

const CLASSICAL_YOGA_REGIMENS: RoutineDetail[] = [
  {
    id: 'nadi-shodhana',
    name: 'Nadi Shodhana Pranayama',
    sanskritName: 'नाडीशोधन प्राणायाम',
    sourceText: 'Gheranda Samhita (V.38-45)',
    type: 'Pranayama',
    primaryDosha: 'Tridoshic',
    therapeuticBenefits: [
      'Purifies 72,000 psychic nadis (energy pathways)',
      'Balances hemispheric brain activity & calms hyperactive synapses',
      'Minimizes systematic cortisol levels'
    ],
    contraindications: [
      'None (extremely safe for all individuals)',
      'Avoid high retention ratios if suffering from active vertigo'
    ],
    stepByStep: [
      'Adopt Nasagra Mudra with right hand (index and middle fingers placed gently on eyebrow center).',
      'Close right nostril with thumb. Inhale slow, deep and noiseless through the left nostril (Puraka).',
      'Close both nostrils, holding the breath internally (Antar Kumbhaka).',
      'Release right nostril, exhale fully with controlled rhythm (Rechaka).',
      'Inhale immediately back through the right nostril, hold briefly, then exhale smoothly through the left nostril.'
    ],
    difficulty: 'Beginner',
    duration: '5 - 10 Minutes',
    bestSeason: ['all', 'vasanta', 'grishma', 'sharad', 'varsha', 'hemanta', 'shishira'],
    temperatureEffect: 'Neutral',
    detailedDesc: 'Also known as Alternate Nostril Breathing. It is the core preparatory respiratory practice of classical Hatha Yoga designed to restore optimal homeostatic balance to the nervous systems.',
    gazeOrBandha: 'Nasagra Drishti (gaze at nose-tip)'
  },
  {
    id: 'sheetali',
    name: 'Sheetali Kumbhaka',
    sanskritName: 'शीतली कुम्भक',
    sourceText: 'Hatha Yoga Pradipika (II.57-58)',
    type: 'Pranayama',
    primaryDosha: 'Pitta',
    therapeuticBenefits: [
      'Instantly reduces systemic somatic heat & calms esophageal acidity',
      'Alleviates thirst, hunger, & mild gastric ulcers',
      'Soothes skin rashes, hot flashes, and angry mental states'
    ],
    contraindications: [
      'Highly restricted during cold/congestive asthma outbreaks',
      'Avoid during winter seasons or in freezing climate conditions'
    ],
    stepByStep: [
      'Sit comfortably, close the eyes, and extend the tongue out beyond the lips.',
      'Fold/roll the sides of the tongue inwards into a tight micro-tube or pipe.',
      'Inhale deeply and slowly through the tongue tube, feeling a freezing wind glide over the taste buds.',
      'Withdraw the tongue, close the mouth, and perform a short heart-centered hold.',
      'Exhale slowly and completely through both nostrils.'
    ],
    difficulty: 'Beginner',
    duration: '3 - 5 Minutes',
    bestSeason: ['grishma', 'sharad'],
    temperatureEffect: 'Cooling',
    detailedDesc: 'The cooling breath. It forces cold air particles deep inside the visceral tract, helping dissipate excessive Pitta heat accumulated in the spleen, liver, and bloodstream.',
    gazeOrBandha: 'Khechari Mudra (optional)'
  },
  {
    id: 'kapalabhati',
    name: 'Kapalabhati Shodhana Kriya',
    sanskritName: 'कपालभाति षट्कर्म',
    sourceText: 'Hatha Yoga Pradipika (II.35-37)',
    type: 'Kriya',
    primaryDosha: 'Kapha',
    therapeuticBenefits: [
      'Drains pooled bronchial congestion & expands vital lung capacity',
      'Searing liver stimulation, resolves sluggish gut metabolic fire (Mandagni)',
      'Clears cerebral fog, giving the "skull-shining" mental luminosity'
    ],
    contraindications: [
      'Hernia, recent surgical incisions, abdominal blockages',
      'Elevated hypertension or severe vertigo'
    ],
    stepByStep: [
      'Sit in Padmasana or any steady posture, keeping spine strictly erect.',
      'Inhale naturally, then contract stomach muscles rapidly to force air out through nostrils in a sharp puff.',
      'Relax abdominal muscles immediately to allow passive, automatic inhalation.',
      'Repeat the rapid rhythmic exhalations continuously (60 to 120 strokes per minute).'
    ],
    difficulty: 'Intermediate',
    duration: '3 Rounds of 30 Strokes',
    bestSeason: ['vasanta', 'shishira', 'hemanta', 'varsha'],
    temperatureEffect: 'Heating',
    detailedDesc: 'A principal purificatory Hatha kriya. Translating literally as "forehead luster," it uses active physical piston-like diaphragmatic pulses to expel stale carbon layers from deep alveolar sockets.',
    gazeOrBandha: 'Uddiyana Bandha (lock on completion)'
  },
  {
    id: 'bhastrika',
    name: 'Bhastrika Pranayama',
    sanskritName: 'भस्त्रिका प्राणायाम',
    sourceText: 'Gheranda Samhita (V.75-82)',
    type: 'Pranayama',
    primaryDosha: 'Kapha',
    therapeuticBenefits: [
      'Rapidly oxygenates arterial blood, fueling cellular mitochondria',
      'Ignites the highest digestive fires & burns metabolic toxins (Ama)',
      'Warms systemic extremities by maximizing thoracic temperature'
    ],
    contraindications: [
      'Heart ailments, cardiac bypass histories, high neural pressure',
      'Active gastric ulcers or high acid reflux flares'
    ],
    stepByStep: [
      'Raise hands alongside shoulders. Breathe in deeply while opening chest wide and raising arms.',
      'Exhale vigorously through nostrils while bringing elbows down sharply against the ribs in a fist.',
      'Maintain an even, forceful cadence of active Inhales and active Exhales (Bellows effect).',
      'Complete 20 repetitions, then rest, observing the expansive stillness in the heart center.'
    ],
    difficulty: 'Advanced',
    duration: '3 Rounds of 15-20 Breaths',
    bestSeason: ['hemanta', 'shishira', 'vasanta'],
    temperatureEffect: 'Heating',
    detailedDesc: 'The "Bellows Breath." Involving equal force for both inhalation and exhalation, it mimics blacksmith bellows, building high physical warmth to digest stagnated mucus layers.',
    gazeOrBandha: 'Jalandhara & Mula Bandha during retention'
  },
  {
    id: 'bhramari',
    name: 'Bhramari Pranayama',
    sanskritName: 'भ्रामरी प्राणायाम',
    sourceText: 'Hatha Yoga Pradipika (II.68)',
    type: 'Pranayama',
    primaryDosha: 'Vata',
    therapeuticBenefits: [
      'Acoustic vibration releases endogenous nitric oxide from sinus walls',
      'Induces deepest parasympathetic relaxation, dissolving high anxiety',
      'Acts as immediate sleep facilitator'
    ],
    contraindications: [
      'Severe ear drum inflammation or active infection'
    ],
    stepByStep: [
      'Place hands in Shanmukhi Mudra: thumbs closing ear flaps, index on lower eye rim, middle on nostrils, ring/little on upper and lower lips.',
      'Inhale deep with natural expansion.',
      'On Exhalation, keep lips lightly closed and emit a beautiful, continuous, low-pitched humming bee frequencies.',
      'Savor the physical vibrations echoing in the skull and frontal brain cortex.'
    ],
    difficulty: 'Beginner',
    duration: '5 - 10 Minutes',
    bestSeason: ['all', 'varsha', 'sharad', 'grishma'],
    temperatureEffect: 'Neutral',
    detailedDesc: 'The Humming Bee breath. The steady internal vibratory harmonics immediately trigger neural resonant structures, suppressing erratic nervous (Vata) impulses.',
    gazeOrBandha: 'Inner hearing (Nada Yoga concentration)'
  },
  {
    id: 'sitkari',
    name: 'Sitkari Kumbhaka',
    sanskritName: 'सीत्कारी कुम्भक',
    sourceText: 'Hatha Yoga Pradipika (II.54-56)',
    type: 'Pranayama',
    primaryDosha: 'Pitta',
    therapeuticBenefits: [
      'Expels excessive localized Pitta heat from oral pathways',
      'Alleviates dry dental cavities, throat inflammation, and gingival sensitivity',
      'Reduces physiological blood pressure'
    ],
    contraindications: [
      'Very sensitive exposed teeth roots (hypersensitivity)',
      'Highly congested raw sinuses or winter season colds'
    ],
    stepByStep: [
      'Bring upper and lower teeth rows together lightly, drawing lips wide as if smiling.',
      'Inhale deeply and slowly through the interlocking teeth slots, producing the sound "Sss-ss-s-si".',
      'Feel the arctic breeze flowing over oral mucosal cells.',
      'Close lips, hold current breath inside, and then exhale slowly through both nostrils.'
    ],
    difficulty: 'Beginner',
    duration: '3 - 5 Minutes',
    bestSeason: ['grishma', 'sharad'],
    temperatureEffect: 'Cooling',
    detailedDesc: 'The teeth-hissing cooling breath. It is a brilliant remedy to control sudden surges of physiological heat, emotional anger, or fever spikes.',
    gazeOrBandha: 'Khechari Mudra during retention'
  }
];

interface BreathPattern {
  id: string;
  name: string;
  inhale: number;
  holdInner: number;
  exhale: number;
  holdOuter: number;
  ratioLabel: string;
  description: string;
}

const BREATH_PATTERNS: BreathPattern[] = [
  { id: 'sama-vritti', name: 'Sama Vritti (Balanced Box)', inhale: 4, holdInner: 4, exhale: 4, holdOuter: 4, ratioLabel: '1 : 1 : 1 : 1', description: 'Restores nervous homeostasis, reduces mental erratic loops.' },
  { id: 'visama-vritti', name: 'Visama Vritti (Pranayama Core)', inhale: 4, holdInner: 8, exhale: 8, holdOuter: 0, ratioLabel: '1 : 2 : 2 : 0', description: 'Deep lung cell expansion, triggers rapid parasympathetic relaxation.' },
  { id: 'nadi-purify', name: 'Classical Kumbhaka (Deep Hold)', inhale: 4, holdInner: 16, exhale: 8, holdOuter: 4, ratioLabel: '1 : 4 : 2 : 1', description: 'Advanced metabolic insulation. Requires serene posture and quiet atmosphere.' },
  { id: 'quick-detox', name: 'Purifying Puraka', inhale: 3, holdInner: 2, exhale: 5, holdOuter: 0, ratioLabel: '3 : 2 : 5 : 0', description: 'Elongated exhalations to expel excess stale CO2 and tension.' },
];

export default function YogicKriyaPranayam({ activeRituId }: YogicKriyaPranayamProps) {
  const [selectedRoutine, setSelectedRoutine] = useState<RoutineDetail | null>(CLASSICAL_YOGA_REGIMENS[0]);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'All' | 'Pranayama' | 'Kriya'>('All');
  
  // Breath simulator engine states
  const [activePatternId, setActivePatternId] = useState<string>('sama-vritti');
  const [isEngineActive, setIsEngineActive] = useState<boolean>(false);
  const [currentPhase, setCurrentPhase] = useState<'Inhale' | 'Hold (Both)' | 'Exhale' | 'Hold (Empty)'>('Inhale');
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState<number>(4);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [totalCyclesCompleted, setTotalCyclesCompleted] = useState<number>(0);
  
  // Nostril indicator states (useful for Anuloma Viloma tracking)
  const [focusedNostril, setFocusedNostril] = useState<'Left' | 'Right' | 'Both' | 'None'>('Left');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const selectedPattern = BREATH_PATTERNS.find(p => p.id === activePatternId) || BREATH_PATTERNS[0];

  // Svara-Vatika Guided TTS Assistant States
  const [isTtsSpeaking, setIsTtsSpeaking] = useState<boolean>(false);
  const [ttsCurrentStep, setTtsCurrentStep] = useState<number | 'intro' | 'outro' | null>(null);
  const [ttsSpeechRate, setTtsSpeechRate] = useState<number>(0.85); // meditate slowly
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');
  const ttsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load voices for speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
        // Default to a serene English or relevant voice
        const defaultVoice = voices.find(v => v.lang.startsWith('en') || v.lang.startsWith('hi')) || voices[0];
        if (defaultVoice) {
          setSelectedVoiceName(defaultVoice.name);
        }
      };
      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  // Stop sound if selected exercise changes
  useEffect(() => {
    stopTtsSession();
  }, [selectedRoutine]);

  const speakUtterance = (text: string, onEndCallback: () => void) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    if (ttsTimeoutRef.current) clearTimeout(ttsTimeoutRef.current);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = ttsSpeechRate;

    if (selectedVoiceName) {
      const voice = availableVoices.find(v => v.name === selectedVoiceName);
      if (voice) utterance.voice = voice;
    }

    utterance.onend = () => {
      const timeout = setTimeout(() => {
        onEndCallback();
      }, 2000); // Zen pause of 2 seconds
      ttsTimeoutRef.current = timeout;
    };

    utterance.onerror = () => {
      setIsTtsSpeaking(false);
      setTtsCurrentStep(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const startTtsSession = (routine: RoutineDetail) => {
    if (!routine) return;
    setIsTtsSpeaking(true);
    setTtsCurrentStep('intro');

    const introText = `Welcome to your guided sessions of ${routine.name}. ${routine.detailedDesc}. We suggest a practice of ${routine.duration}. Sit in a comfortable alignment. Keep your spine erect and chest open. Prepare to begin.`;
    
    speakUtterance(introText, () => {
      playStepByStep(routine, 0);
    });
  };

  const playStepByStep = (routine: RoutineDetail, stepIndex: number) => {
    if (stepIndex >= routine.stepByStep.length) {
      setTtsCurrentStep('outro');
      const outroText = `You have completed all guidance steps for ${routine.name}. Relax your focus. Rest in natural awareness. Thank you for your practice. Shanti. Shanti. Shanti.`;
      speakUtterance(outroText, () => {
        setIsTtsSpeaking(false);
        setTtsCurrentStep(null);
      });
      return;
    }

    setTtsCurrentStep(stepIndex);
    const stepText = `Step ${stepIndex + 1}: ${routine.stepByStep[stepIndex]}`;
    speakUtterance(stepText, () => {
      playStepByStep(routine, stepIndex + 1);
    });
  };

  const stopTtsSession = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (ttsTimeoutRef.current) clearTimeout(ttsTimeoutRef.current);
    setIsTtsSpeaking(false);
    setTtsCurrentStep(null);
  };

  useEffect(() => {
    // Reset timer state when pattern changes
    setIsEngineActive(false);
    setCurrentPhase('Inhale');
    setPhaseSecondsLeft(selectedPattern.inhale);
    setFocusedNostril('Left');
  }, [activePatternId]);

  // Handle acoustic cue synth frequencies
  const playBeepTone = (frequency: number, duration: number, type: 'sine' | 'triangle' = 'sine') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      osc.type = type;
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.log('Audio synthesis aborted', e);
    }
  };

  useEffect(() => {
    if (!isEngineActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setPhaseSecondsLeft(prev => {
        if (prev <= 1) {
          // Transit to next phase of chosen pattern
          let nextP: typeof currentPhase = 'Inhale';
          let duration = 4;
          let soundFreq = 523.25; // C5 default inhale

          if (currentPhase === 'Inhale') {
            if (selectedPattern.holdInner > 0) {
              nextP = 'Hold (Both)';
              duration = selectedPattern.holdInner;
              soundFreq = 392.00; // G4 hold
              setFocusedNostril('Both');
            } else {
              nextP = 'Exhale';
              duration = selectedPattern.exhale;
              soundFreq = 587.33; // D5 exhale
              setFocusedNostril('Right');
            }
          } else if (currentPhase === 'Hold (Both)') {
            nextP = 'Exhale';
            duration = selectedPattern.exhale;
            soundFreq = 587.33;
            // Alternating nostrils toggle based on cycle completion
            setFocusedNostril(totalCyclesCompleted % 2 === 0 ? 'Right' : 'Left');
          } else if (currentPhase === 'Exhale') {
            if (selectedPattern.holdOuter > 0) {
              nextP = 'Hold (Empty)';
              duration = selectedPattern.holdOuter;
              soundFreq = 329.63; // E4 outer hollow
              setFocusedNostril('None');
            } else {
              nextP = 'Inhale';
              duration = selectedPattern.inhale;
              soundFreq = 523.25;
              setFocusedNostril(totalCyclesCompleted % 2 === 0 ? 'Right' : 'Left');
              setTotalCyclesCompleted(c => c + 1);
            }
          } else if (currentPhase === 'Hold (Empty)') {
            nextP = 'Inhale';
            duration = selectedPattern.inhale;
            soundFreq = 523.25;
            setFocusedNostril(totalCyclesCompleted % 2 === 0 ? 'Left' : 'Right');
            setTotalCyclesCompleted(c => c + 1);
          }

          playBeepTone(soundFreq, 0.45, nextP.startsWith('Hold') ? 'triangle' : 'sine');
          setCurrentPhase(nextP);
          return duration;
        } else {
          // Play a small click tone on remaining tick
          if (prev <= 3) {
            playBeepTone(220, 0.05); // quiet tracking click
          }
          return prev - 1;
        }
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isEngineActive, currentPhase, selectedPattern, totalCyclesCompleted]);

  const toggleEngine = () => {
    setIsEngineActive(prev => {
      if (!prev) {
        setPhaseSecondsLeft(selectedPattern.inhale);
        setCurrentPhase('Inhale');
        setFocusedNostril('Left');
        playBeepTone(523.25, 0.6); // beautiful beginning bell tone
      }
      return !prev;
    });
  };

  const resetEngine = () => {
    setIsEngineActive(false);
    setCurrentPhase('Inhale');
    setPhaseSecondsLeft(selectedPattern.inhale);
    setTotalCyclesCompleted(0);
    setFocusedNostril('Left');
  };

  // Filtered list based on both Tab selection and Ritu seasonality alignment
  const filteredRemedies = CLASSICAL_YOGA_REGIMENS.filter(routine => {
    const isCategoryMatch = activeCategoryFilter === 'All' || routine.type === activeCategoryFilter;
    return isCategoryMatch;
  });

  return (
    <div id="mab-yogic-kriyas-page" className="space-y-8 animate-fade-in text-stone-800">
      
      {/* 1. Header Hero Panel with Sanskrit typography */}
      <div className="bg-[#2d1b10] rounded-3xl border border-amber-900/10 p-6 md:p-10 relative overflow-hidden shadow-md text-white text-left flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Background Mandala Vector Pattern Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950/40 via-stone-950/80 to-[#1a0f0a] -z-10" />
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-5 pointer-events-none hidden md:block">
          <svg viewBox="0 0 100 100" fill="currentColor" className="text-amber-500 w-full h-full">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" fill="none" strokeDasharray="3,3" />
            <polygon points="50,10 90,50 50,90 10,50" stroke="currentColor" strokeWidth="0.5" fill="none" />
            <polygon points="50,5 95,50 50,95 5,50" stroke="currentColor" strokeWidth="0.3" fill="none" />
          </svg>
        </div>

        <div className="space-y-4 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/20">
            <Wind className="w-3.5 h-3.5 animate-pulse text-amber-400" /> Prana Chikitsa Center (प्राण चिकित्सा)
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-black text-[#faf2e6] tracking-tight leading-none">
            Yogic Kriya &amp; Pranayam
          </h1>
          <p className="text-[#eadbc8] text-sm md:text-base leading-relaxed font-serif italic">
            "चले वाते चले चित्तं निश्चले निश्चलं भवेत्" — When the breath is wandering, the mind is unsteady. But when the breath remains still and silent, the mind achieves ultimate deep diagnostic stillness.
          </p>
          <div className="flex flex-wrap items-center gap-3.5 pt-2 text-xs text-[#c4b19f]">
            <span className="flex items-center gap-1"><BookOpen className="w-4 h-4 text-amber-400" /> Classic Hatha Treatises</span>
            <span className="text-amber-700/60">•</span>
            <span className="flex items-center gap-1"><Heart className="w-4 h-4 text-amber-400" /> Cardiorespiratory Homeostasis</span>
            <span className="text-amber-700/60">•</span>
            <span className="flex items-center gap-1"><Compass className="w-4 h-4 text-amber-400" /> Seasonal Dosha Alignment</span>
          </div>
        </div>

        {/* Live Ritu Recommendation Badge */}
        <div className="bg-amber-900/40 border border-amber-500/20 rounded-2xl p-4 shrink-0 text-center space-y-1.5 max-w-[240px]">
          <span className="text-[10px] font-mono font-black text-amber-400 uppercase tracking-widest block">Active Ritu Focus:</span>
          {(() => {
            const rituMap: Record<string, {name: string, sans: string, recom: string}> = {
              vasanta: {name: "Vasanta (Spring)", sans: "वसन्त", recom: "Kapalabhati Shodhana to expel congestive winter Kapha"},
              grishma: {name: "Grishma (Summer)", sans: "ग्रीष्म", recom: "Sheetali Kumbhaka to cool vascular blood and calm Pitta"},
              varsha: {name: "Varsha (Monsoon)", sans: "वर्षा", recom: "Bhramari Hum to discharge Vata tension and warm bones"},
              sharad: {name: "Sharad (Autumn)", sans: "शरद", recom: "Sitkari or Nadi Shodhana to soothe volatile high-bile heat"},
              hemanta: {name: "Hemanta (Early Winter)", sans: "हेमन्त", recom: "Bhastrika Bellows to lock internal metabolic combustion"},
              shishira: {name: "Shishira (Late Winter)", sans: "शिशिर", recom: "Deep Bhastrika & Kapalabhati to ignite spinal Agni"}
            };
            const act = rituMap[activeRituId] || {name: "All-Season Equilbrium", sans: "सम", recom: "Continuous Nadi Shodhana is classically beneficial to purify nadis year-round."};
            return (
              <>
                <p className="font-serif font-black text-lg text-amber-50 leading-tight">
                  {act.name}
                </p>
                <span className="text-[10px] italic font-serif text-amber-250 font-semibold block">{act.sans} Routine</span>
                <p className="text-[10.5px] text-amber-100/70 leading-normal pt-1 flex items-center justify-center gap-1 border-t border-amber-900/60 mt-1">
                  {act.recom}
                </p>
              </>
            );
          })()}
        </div>
      </div>

      {/* 2. Interactive Breath Simulator and Timer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        
        {/* Left Hand: Breath Simulator Engine */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-amber-950/15 overflow-hidden shadow-xs flex flex-col justify-between">
          <div className="bg-gradient-to-r from-amber-950 to-[#47220c] text-white px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4.5 h-4.5 text-amber-400 animate-pulse" />
              <div>
                <h3 className="font-serif font-bold text-sm uppercase leading-tight">Pranayama breathing guide</h3>
                <span className="text-[9px] text-amber-250 font-mono tracking-wider">VISUAL SYNCHRONIZATION METER</span>
              </div>
            </div>

            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-amber-200 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors border-none bg-transparent cursor-pointer"
              title={soundEnabled ? "Mute audio cues" : "Unmute audio cues"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          <div className="p-6 flex flex-col items-center justify-center space-y-6 text-center grow">
            {/* Active breathing ring with live visual feedback */}
            <div className="relative w-56 h-56 flex items-center justify-center">
              {/* Outer pulsing shadow ring */}
              <div 
                className={`absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/10 to-teal-500/10 blur-xl transition-all duration-1000 ${
                  isEngineActive ? 'scale-110 opacity-100 animate-pulse' : 'scale-90 opacity-40'
                }`}
              />

              {/* Dynamic Scaling Circle representing lungs size */}
              <div 
                className={`absolute rounded-full border-2 border-dashed border-amber-800/25 transition-all duration-1000 flex items-center justify-center ${
                  !isEngineActive ? 'w-48 h-48 opacity-40' : 
                  currentPhase === 'Inhale' ? 'w-52 h-52 bg-amber-50/30' :
                  currentPhase === 'Hold (Both)' ? 'w-52 h-52 bg-emerald-50/20 border-emerald-500/30' :
                  currentPhase === 'Exhale' ? 'w-36 h-36 bg-amber-100/10' :
                  'w-32 h-32 bg-stone-100/50 border-stone-400/20'
                }`}
              />

              {/* Central Solid Display Orb */}
              <div className={`w-36 h-36 rounded-full shadow-lg flex flex-col items-center justify-center z-10 transition-all duration-500 ${
                !isEngineActive ? 'bg-amber-50 text-amber-950 border border-amber-900/15' :
                currentPhase === 'Inhale' ? 'bg-amber-800 text-white scale-102 shadow-amber-900/20' :
                currentPhase === 'Hold (Both)' ? 'bg-emerald-800 text-white scale-100 shadow-emerald-900/20' :
                currentPhase === 'Exhale' ? 'bg-amber-600 text-white scale-98 shadow-amber-900/15' :
                'bg-stone-700 text-white scale-95 shadow-stone-800/20'
              }`}>
                {isEngineActive ? (
                  <>
                    <span className="text-[10px] font-mono tracking-widest uppercase opacity-75">{currentPhase}</span>
                    <span className="text-4xl font-black font-mono tracking-tight my-1">{phaseSecondsLeft}s</span>
                    <span className="text-[10px] italic font-serif px-2 opacity-80 leading-none">
                      {currentPhase === 'Inhale' ? 'Puraka 🌬' : 
                       currentPhase === 'Hold (Both)' ? 'Antar Kumbhaka ⛰' :
                       currentPhase === 'Exhale' ? 'Rechaka 💨' : 
                       'Bahya Kumbhaka ◌'}
                    </span>
                  </>
                ) : (
                  <>
                    <Wind className="w-8 h-8 text-amber-800 mb-1 animate-bounce" />
                    <span className="text-xs font-serif font-black uppercase text-amber-950 tracking-wider">Ready</span>
                    <span className="text-[9.5px] text-stone-500 font-mono mt-0.5">Click Begin Below</span>
                  </>
                )}
              </div>
            </div>

            {/* Nostril and Mudra Guidance indicators */}
            <div className="w-full grid grid-cols-2 gap-3 pt-2">
              <div className={`p-2.5 rounded-xl border text-center transition-all duration-300 ${
                isEngineActive && (focusedNostril === 'Left' || focusedNostril === 'Both')
                  ? 'bg-amber-55 border-amber-900/25 shadow-3xs translate-y-[-1px]' 
                  : 'bg-stone-50 border-stone-200/50 opacity-60'
              }`}>
                <span className="text-[9px] font-mono font-black text-stone-400 uppercase tracking-widest block">Left Nasal Passage:</span>
                <span className="text-xs font-serif font-black text-amber-950 flex items-center justify-center gap-1 mt-0.5">
                  <Moon className="w-3.5 h-3.5 text-blue-500 shrink-0" /> Ida (Cooling) {isEngineActive && focusedNostril === 'Left' ? '• Active Intake' : ''}
                </span>
              </div>

              <div className={`p-2.5 rounded-xl border text-center transition-all duration-300 ${
                isEngineActive && (focusedNostril === 'Right' || focusedNostril === 'Both')
                  ? 'bg-amber-55 border-amber-900/25 shadow-3xs translate-y-[-1px]' 
                  : 'bg-stone-50 border-stone-200/50 opacity-60'
              }`}>
                <span className="text-[9px] font-mono font-black text-stone-400 uppercase tracking-widest block">Right Nasal Passage:</span>
                <span className="text-xs font-serif font-black text-amber-950 flex items-center justify-center gap-1 mt-0.5">
                  <Sun className="w-3.5 h-3.5 text-amber-600 shrink-0" /> Pingala (Heating) {isEngineActive && focusedNostril === 'Right' ? '• Active Intake' : ''}
                </span>
              </div>
            </div>

            {/* Breathing controls row */}
            <div className="flex items-center gap-3 w-full">
              <button
                onClick={toggleEngine}
                className={`flex-1 py-3 px-4 rounded-xl font-serif font-bold text-sm tracking-wide shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border-none ${
                  isEngineActive 
                    ? 'bg-rose-700 hover:bg-rose-900 text-white' 
                    : 'bg-amber-900 hover:bg-[#2d1b10] text-[#faf2e6]'
                }`}
              >
                {isEngineActive ? (
                  <>
                    <Pause className="w-4 h-4 shrink-0 fill-current" /> Pause Practice
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 shrink-0 fill-current animate-ping" /> Begin Practice Session
                  </>
                )}
              </button>

              <button
                onClick={resetEngine}
                className="bg-stone-100 hover:bg-stone-200 p-3 rounded-xl border border-stone-205 transition-all text-stone-600 hover:text-stone-900 cursor-pointer"
                title="Reset timer values"
              >
                <RotateCcw className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* Quick Stats Panel Footer */}
          <div className="bg-[#fafbf9] border-t border-stone-200/80 px-5 py-4 flex justify-between items-center text-xs">
            <span className="text-stone-500 font-mono tracking-wider">Completed: <strong className="text-amber-900">{totalCyclesCompleted}</strong> full cycles</span>
            <span className="font-serif italic font-medium text-stone-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Est: {(totalCyclesCompleted * (selectedPattern.inhale + selectedPattern.holdInner + selectedPattern.exhale + selectedPattern.holdOuter) / 60).toFixed(1)} mins completed
            </span>
          </div>
        </div>

        {/* Right Hand: Breath Patterns Selector & Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-amber-950/15 p-5 md:p-6 shadow-xs space-y-4">
            <h3 className="font-serif font-black text-amber-950 text-base md:text-lg border-b border-amber-900/5 pb-2 flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-800" /> Select Traditional Respiratory Metronome
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Pranayama manifests when we manipulate the ratio of **Puraka** (inhale), **Antar Kumbhaka** (inner hold), **Rechaka** (exhale), and **Bahya Kumbhaka** (outer empty hold). Select a pattern below to load the visual guides above:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BREATH_PATTERNS.map(pattern => {
                const isSelected = pattern.id === activePatternId;
                return (
                  <button
                    key={pattern.id}
                    onClick={() => setActivePatternId(pattern.id)}
                    className={`text-left p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between h-full bg-stone-50 cursor-pointer ${
                      isSelected 
                        ? 'border-amber-700 bg-amber-50/40 shadow-xs ring-1 ring-amber-700/20' 
                        : 'border-stone-200/70 hover:border-stone-400 hover:bg-stone-50/50'
                    }`}
                  >
                    <div className="text-left">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-serif font-bold text-xs md:text-sm text-stone-850">{pattern.name}</span>
                        <span className={`text-[9px] font-mono font-black border px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-amber-950 text-[#faf2e6] border-transparent' : 'bg-white text-stone-500'
                        }`}>
                          {pattern.ratioLabel}
                        </span>
                      </div>
                      <p className="text-[10.5px] leading-relaxed text-stone-500 mt-1">
                        {pattern.description}
                      </p>
                    </div>
                    {/* Time breakdown summary indicators */}
                    <div className="flex gap-2 text-[9px] font-mono font-black uppercase text-stone-400 pt-2 border-t border-stone-900/5 mt-2 max-w-full overflow-x-auto">
                      <span>Inhale: {pattern.inhale}s</span>
                      <span>•</span>
                      <span>Hold: {pattern.holdInner}s</span>
                      <span>•</span>
                      <span>Exhale: {pattern.exhale}s</span>
                      {pattern.holdOuter > 0 && (
                        <>
                          <span>•</span>
                          <span>Hollow: {pattern.holdOuter}s</span>
                        </>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Mudra Info Notice */}
          <div className="p-4 rounded-xl bg-teal-500/5 border border-teal-605 text-xs text-teal-950 flex gap-3 text-left">
            <AlertCircle className="w-5 h-5 text-teal-800 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="font-serif font-bold text-teal-900">Important Svarodaya Shastra Mudra Advice:</strong>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                When inhaling left, apply finger pressure on right nostril. When inhaling right, apply pressure on left. For equal-breath hold phases, lightly close both channels completely to lock internal pressure safely.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Detailed Classical Routines Directory */}
      <div className="bg-white rounded-2xl border border-amber-950/15 p-5 md:p-8 shadow-xs text-left space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-900/5 pb-4">
          <div>
            <h2 className="font-serif text-lg md:text-2xl font-black text-amber-950 leading-tight">
              Traditional Sanskrit Directory &amp; Sūtras
            </h2>
            <p className="text-xs text-stone-505">
              Browse classical reference guides compiled directly from Hatha Yoga Pradipika &amp; Gheranda Samhita.
            </p>
          </div>

          {/* Directory Filters */}
          <div className="flex gap-2">
            {(['All', 'Pranayama', 'Kriya'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategoryFilter(cat);
                  // Auto focus first match
                  const match = CLASSICAL_YOGA_REGIMENS.find(r => cat === 'All' || r.type === cat);
                  if (match) setSelectedRoutine(match);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-serif font-black transition-all cursor-pointer border ${
                  activeCategoryFilter === cat 
                    ? 'bg-amber-950 text-[#faf2e6] border-transparent shadow-xs' 
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                {cat === 'All' ? '❖ All Practices' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Splits Pane */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Side A: Selected Filters List */}
          <div className="md:col-span-4 space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {filteredRemedies.map(routine => {
              const isActive = selectedRoutine?.id === routine.id;
              const belongsToActiveRitu = routine.bestSeason.includes(activeRituId) || routine.bestSeason.includes('all');
              return (
                <button
                  key={routine.id}
                  onClick={() => setSelectedRoutine(routine)}
                  className={`w-full text-left p-3.5 rounded-xl border flex flex-col items-stretch transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? 'bg-amber-900 text-white border-transparent shadow-xs translate-x-1 font-bold' 
                      : 'bg-white hover:bg-stone-50/80 border-stone-200'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className={`font-serif font-black text-sm ${isActive ? 'text-white' : 'text-stone-900'}`}>
                        {routine.name}
                      </h4>
                      <p className={`text-[10px] italic font-serif ${isActive ? 'text-amber-200' : 'text-[#8a5a36]'}`}>
                        {routine.sanskritName}
                      </p>
                    </div>
                    <span className={`text-[8.5px] font-mono tracking-wider uppercase border px-1.5 py-0.5 rounded shrink-0 ${
                      isActive ? 'bg-white/10 text-white border-white/20' : 'bg-stone-100 text-stone-500'
                    }`}>
                      {routine.type}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {/* Dosha tag */}
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-medium ${
                      isActive ? 'bg-white/20 text-[#ffe5d9]' : 'bg-amber-50 text-amber-900'
                    }`}>
                      {routine.primaryDosha}
                    </span>
                    {/* Temperature tag */}
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-medium ${
                      isActive ? 'bg-white/20 text-white' : 
                      routine.temperatureEffect === 'Heating' ? 'bg-orange-50 text-orange-950' :
                      routine.temperatureEffect === 'Cooling' ? 'bg-sky-50 text-sky-950' :
                      'bg-stone-100 text-stone-700'
                    }`}>
                      {routine.temperatureEffect}
                    </span>
                    {belongsToActiveRitu && (
                      <span className={`text-[9px] font-mono font-black font-extrabold uppercase px-1.5 rounded tracking-wider flex items-center gap-0.5 ${
                        isActive ? 'bg-emerald-800 text-white' : 'bg-emerald-50 text-emerald-800'
                      }`}>
                        ⬤ Recommended Seasonally
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Side B: Active Routine Complete Insight Deck */}
          <div className="md:col-span-8 bg-stone-50/50 rounded-2xl border border-stone-200 p-5 md:p-6 space-y-6">
            {selectedRoutine ? (
              <div className="space-y-6 animate-fade-in">
                {/* Heading Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
                  <div>
                    <span className="font-mono text-[9px] font-black uppercase text-[#8a5a36]">
                      {selectedRoutine.sourceText} • {selectedRoutine.type}
                    </span>
                    <h3 className="font-serif text-2xl font-black text-stone-900 mt-0.5">
                      {selectedRoutine.name}
                    </h3>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase bg-amber-950 text-white px-3 py-1 rounded-full font-black">
                      {selectedRoutine.difficulty} Level
                    </span>
                  </div>
                </div>

                {/* Sūtra Quote spotlights */}
                <div className="p-4 bg-white rounded-xl border border-stone-200/80 text-center space-y-1">
                  <p className="font-serif font-black text-amber-955 text-sm md:text-base leading-relaxed">
                    "{selectedRoutine.sanskritName}" Formula Sūtra
                  </p>
                  <p className="text-[11px] leading-relaxed text-stone-505 italic max-w-2xl mx-auto">
                    {selectedRoutine.detailedDesc}
                  </p>
                </div>

                {/* Svara-Vātikā Guided Audio Assistant Panel */}
                <div id="mab-svara-voice-assistant" className="bg-[#fcfaf4] rounded-xl border border-amber-950/10 p-4 space-y-3.5 shadow-3xs text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sans">
                    <div className="flex items-center gap-2.5">
                      <div className="bg-amber-950/10 p-2 rounded-lg text-amber-900 flex items-center justify-center">
                        <Headphones className={`w-4.5 h-4.5 ${isTtsSpeaking ? 'animate-bounce text-amber-800' : 'text-amber-900'}`} />
                      </div>
                      <div>
                        <h4 className="font-serif font-black text-xs md:text-sm uppercase tracking-wide text-stone-900 leading-tight">
                          Svara-Vātikā (Guided Sound Assistant)
                        </h4>
                        <p className="text-[10px] text-stone-550 font-serif italic mt-0.5">
                          Let an artificial voice safely pace the steps of your selected routine with calculated reflective pauses.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isTtsSpeaking ? (
                        <button
                          onClick={stopTtsSession}
                          className="bg-rose-700 hover:bg-rose-800 text-white font-serif font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer border-none"
                        >
                          <Pause className="w-3.5 h-3.5 fill-current" /> Stop Voice Guide
                        </button>
                      ) : (
                        <button
                          onClick={() => startTtsSession(selectedRoutine)}
                          className="bg-amber-950 hover:bg-[#2d1b10] text-[#faf2e6] font-serif font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer border-none"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-amber-400" /> Start Voice Guide
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Settings controls & Live Subtitle readout */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-3 border-t border-stone-200/55 text-xs font-sans">
                    {/* Voice Select */}
                    <div className="sm:col-span-12 md:col-span-5 flex flex-col gap-1">
                      <label className="text-[9px] font-mono text-stone-400 font-bold uppercase tracking-wider text-left">Voice Character:</label>
                      <select
                        value={selectedVoiceName}
                        onChange={(e) => setSelectedVoiceName(e.target.value)}
                        className="bg-white border border-stone-200 p-2 rounded-md outline-none text-[11px]"
                      >
                        {availableVoices.length > 0 ? (
                          availableVoices.map((voice, idx) => (
                            <option key={`${voice.name}-${voice.lang}-${idx}`} value={voice.name}>
                              {voice.name} ({voice.lang})
                            </option>
                          ))
                        ) : (
                          <option>System Default Reader</option>
                        )}
                      </select>
                    </div>

                    {/* Speech Speed bar */}
                    <div className="sm:col-span-6 md:col-span-4 flex flex-col gap-1">
                      <label className="text-[9px] font-mono text-stone-400 font-bold uppercase tracking-wider flex justify-between">
                        <span>Guidance Pace:</span>
                        <strong className="text-amber-900 font-bold">{ttsSpeechRate}x</strong>
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="1.3"
                        step="0.05"
                        value={ttsSpeechRate}
                        onChange={(e) => setTtsSpeechRate(parseFloat(e.target.value))}
                        className="w-full accent-amber-900 py-1"
                      />
                    </div>

                    {/* Status Feedback bar */}
                    <div className="sm:col-span-6 md:col-span-3 flex flex-col gap-1 justify-center bg-amber-50/45 px-3 py-1.5 rounded-lg border border-amber-950/5">
                      <span className="text-[9px] font-mono text-stone-400 font-bold uppercase tracking-wider text-left">Voice engine:</span>
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isTtsSpeaking ? 'bg-amber-600 animate-ping' : 'bg-stone-300'}`} />
                        <span className="font-serif font-black text-[10.5px] text-amber-955 truncate max-w-full">
                          {isTtsSpeaking ? (
                            ttsCurrentStep === 'intro' ? 'Intro narrative...' :
                            ttsCurrentStep === 'outro' ? 'Closing mantra...' :
                            `Speaking Step ${typeof ttsCurrentStep === 'number' ? ttsCurrentStep + 1 : ''}`
                          ) : 'Idling peacefully'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dynamic Attributes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white p-3.5 rounded-xl border border-stone-200/60 shadow-3xs flex flex-col justify-between">
                    <span className="text-[9px] font-mono text-stone-400 font-bold uppercase tracking-wider block">Dosha Regulation:</span>
                    <span className="text-sm font-serif font-black text-amber-955 mt-1 block">
                      Balances {selectedRoutine.primaryDosha}
                    </span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-stone-200/60 shadow-3xs flex flex-col justify-between">
                    <span className="text-[9px] font-mono text-stone-400 font-bold uppercase tracking-wider block">Thermal Potency:</span>
                    <span className={`text-sm font-serif font-black mt-1 block ${
                      selectedRoutine.temperatureEffect === 'Heating' ? 'text-orange-850' :
                      selectedRoutine.temperatureEffect === 'Cooling' ? 'text-[#0284c7]' : 'text-stone-800'
                    }`}>
                      {selectedRoutine.temperatureEffect} Effect
                    </span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-stone-200/60 shadow-3xs flex flex-col justify-between">
                    <span className="text-[9px] font-mono text-stone-400 font-bold uppercase tracking-wider block">Recommended Length:</span>
                    <span className="text-sm font-serif font-black text-stone-800 mt-1 block">
                      {selectedRoutine.duration}
                    </span>
                  </div>
                </div>

                {/* Left/Right Split: Stepper & Core Benefits */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                  
                  {/* Step by step */}
                  <div className="space-y-3">
                    <h4 className="font-serif font-black text-[#5c3e21] text-xs uppercase tracking-widest flex items-center gap-1">
                      <ArrowRight className="w-4.5 h-4.5 text-[#8a5a36] shrink-0" /> STEP-BY-STEP TECHNIQUE:
                    </h4>
                    <ol className="space-y-3.5 text-xs text-stone-600 pl-1 list-none">
                      {selectedRoutine.stepByStep.map((step, k) => {
                        const isSpeakingThisStep = isTtsSpeaking && ttsCurrentStep === k;
                        return (
                          <li 
                            key={k} 
                            className={`flex gap-3 text-left p-3 rounded-xl transition-all duration-300 border ${
                              isSpeakingThisStep 
                                ? 'bg-amber-100/70 border-amber-900/15 shadow-md scale-102 ring-1 ring-amber-500/20' 
                                : 'bg-transparent border-transparent'
                            }`}
                          >
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold font-mono text-[10px] shrink-0 border transition-all ${
                              isSpeakingThisStep
                                ? 'bg-amber-950 text-white border-transparent shadow animate-pulse'
                                : 'bg-amber-50 text-amber-900 border-amber-900/10'
                            }`}>
                              {k + 1}
                            </span>
                            <div className="space-y-1">
                              <p className={`leading-snug transition-all ${isSpeakingThisStep ? 'text-stone-950 font-bold' : 'text-stone-605'}`}>{step}</p>
                              {isSpeakingThisStep && (
                                <span className="inline-flex items-center gap-1 text-[9px] font-mono text-amber-900 animate-pulse font-black mt-1">
                                  ● Currently Speaking Out loud
                                </span>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ol>
                  </div>

                  {/* Benefits & Contraindications side */}
                  <div className="space-y-5">
                    {/* Benefits */}
                    <div className="space-y-2">
                      <h4 className="font-serif font-black text-emerald-900 text-xs uppercase tracking-widest flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" /> THERAPEUTIC BENEFITS:
                      </h4>
                      <ul className="space-y-1.5 text-xs text-stone-600">
                        {selectedRoutine.therapeuticBenefits.map((ben, i) => (
                          <li key={i} className="flex items-start gap-1 text-left">
                            <span className="text-emerald-700 block shrink-0 mt-0.5">✦</span>
                            <span className="leading-snug">{ben}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Contraindications */}
                    <div className="space-y-2">
                      <h4 className="font-serif font-black text-red-950 text-xs uppercase tracking-widest flex items-center gap-1">
                        <AlertCircle className="w-4 h-4 text-red-700 shrink-0" /> SAFETY CONTRAINDICATIONS:
                      </h4>
                      <ul className="space-y-1.5 text-xs text-stone-600">
                        {selectedRoutine.contraindications.map((con, i) => (
                          <li key={i} className="flex items-start gap-1 text-left">
                            <span className="text-red-750 block shrink-0 mt-0.5">⚠️</span>
                            <span className="leading-snug">{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </div>

                {/* Seasonal mapping summary bar */}
                <div className="pt-4 border-t border-dashed border-stone-300 flex flex-col sm:flex-row justify-between items-center text-xs gap-3">
                  <span className="text-stone-500 font-mono tracking-wider uppercase">Aligned Seasons (Ayurvedic Ritus):</span>
                  <div className="flex gap-1.5">
                    {selectedRoutine.bestSeason.map(sid => {
                      if (sid === 'all') return <span key={sid} className="bg-amber-50 text-amber-900 border border-amber-900/10 px-2 py-0.5 rounded font-serif italic font-bold">All Seasons (Tridoshic)</span>;
                      
                      const r = ['vasanta', 'grishma', 'varsha', 'sharad', 'hemanta', 'shishira'].includes(sid);
                      return r ? (
                        <span key={sid} className={`px-2 py-0.5 rounded font-serif italic text-[11px] font-bold border capitalize ${
                          sid === activeRituId 
                            ? 'bg-red-50 text-red-900 border-red-200' 
                            : 'bg-stone-100 text-stone-700 border-stone-200'
                        }`}>
                          {sid} {sid === activeRituId ? '• Active' : ''}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center py-10 text-stone-400 font-serif">
                Select a routine from the side panel to view detailed Hatha guidelines.
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
