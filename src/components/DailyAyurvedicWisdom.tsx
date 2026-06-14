import React, { useState, useMemo } from 'react';
import { Sparkles, Leaf, BookOpen, Clock, Compass, RefreshCw } from 'lucide-react';

interface WisdomUnit {
  source: string;
  sanskrit?: string;
  translation: string;
  explanation: string;
  type: 'Sutra' | 'Ritucharya' | 'Dinacharya';
}

const WISDOM_POOL: WisdomUnit[] = [
  {
    type: 'Sutra',
    source: 'Charaka Samhita, Sutrasthana 1.41',
    sanskrit: 'हिताहितं सुखं दुःखमायुस्तस्य हिताहितम्। मानं च तच्च यत्रोक्तमायुर्वेदः स उच्यते॥',
    translation: 'Ayur (life) is of four types: Hita (beneficial), Ahita (harmful), Sukha (happy), and Dukha (unhappy). That science which describes this life is Ayurveda.',
    explanation: 'Ayurdevic science exists not merely to cure physical disease, but to guide conscious lifestyle choices to maximize longevity and profound mental happiness.'
  },
  {
    type: 'Sutra',
    source: 'Ashtanga Hridaya, Sutrasthana 1.2',
    sanskrit: 'आयुःकामयमानेन धर्मार्थसुखसाधनम्। आयुर्वेदोपदेशेषु विधेयः परमादरः॥',
    translation: 'One who desires long life as a means to achieve righteousness (Dharma), wealth (Artha), and eternal happiness (Sukha) must pay the utmost respect to the teachings of Ayurveda.',
    explanation: 'Longevity is valued because it allows a soul to fulfill its earthly biological and spiritual purpose.'
  },
  {
    type: 'Sutra',
    source: 'Ashtanga Hridaya 1.7',
    sanskrit: 'काले हितमितभुक् च स्यात्।',
    translation: 'One must consume warm, nutritious food in proper limited measure, only when the previous meal is completely digested.',
    explanation: 'True health is centered directly within Agni (digestive fire). Standardizing proper meal spacing prevents the formation of Ama (systemic toxic load).'
  },
  {
    type: 'Sutra',
    source: 'Sushruta Samhita, Sutrasthana 15.41',
    sanskrit: 'समदोषः समाग्निश्च समधातुमलक्रियः। प्रसन्नात्मेन्द्रियमनः स्वस्थ इत्यभिधीयते॥',
    translation: 'Health is a state of balanced bodily humors (Dosha), digestive fire (Agni), tissue nutrition (Dhatu), and waste excretion (Mala), alongside a cheerful soul, senses, and mind.',
    explanation: 'True absolute wellness is not just the absence of clinical symptoms, but the complete spiritual and emotional harmony of your entire consciousness.'
  },
  {
    type: 'Dinacharya',
    source: 'Sushruta Samhita (Daily Routine Guidelines)',
    translation: 'Begin your day before Sunrise (Brahma Muhurta).',
    explanation: 'Waking up around 4:30 AM - 5:30 AM helps you absorb pristine cosmic Prana, syncs your biological clock with universal patterns, and naturally pacifies Vata and Kapha imbalances.'
  },
  {
    type: 'Sutra',
    source: 'Traditional Ayurvedic Maxim',
    translation: 'What is good for the stomach is good for the mind; what is toxic to the gut disturbs the heart.',
    explanation: 'The gut and brain are chemically and biophysically linked through Prana and Sadhaka Pitta. Clear food choices promote sattvic thought structures.'
  },
  {
    type: 'Dinacharya',
    source: 'Ashtanga Hridaya, Dinacharya Chapters',
    translation: 'Incorporate daily self-massage (Abhyanga) with warm black sesame oil.',
    explanation: 'Abhyanga keeps the musculoskeletal body supple, nourishes neurological paths, strengthens sleep quality, and creates a biological shield against nervous fatigue.'
  }
];

// Seasonal Tips depending on Month
const SEASONAL_TIPS: Record<number, { season: string; ritu: string; tip: string; advice: string }> = {
  1: {
    season: 'Shishira (Late Winter)',
    ritu: 'De-congesting cold season',
    tip: 'Increase sweet, sour, and salty tastes. Include thick warming soups, steamed root vegetables, and hot spiced teas.',
    advice: 'Avoid cold raw salads or ice water, which severely shock the digestive Agni in sub-zero periods.'
  },
  2: {
    season: 'Shishira (Late Winter)',
    ritu: 'De-congesting cold season',
    tip: 'Emphasize nourishing warm foods cooked with pure cow ghee. Guard yourself from chilly winds.',
    advice: 'Incorporate daily sesame oil massage to seal body heat and reassure Vata.'
  },
  3: {
    season: 'Vasanta (Spring Season)',
    ritu: 'Kapha-liquefying phase',
    tip: 'Incorporate bitter, astringent, and pungent tastes to clear excess Kapha accumulation melted by the warming sun.',
    advice: 'Drink warm honey water, eat dry roasted barley or millet, and avoid heavy sweets and dairy products.'
  },
  4: {
    season: 'Vasanta (Spring Season)',
    ritu: 'Kapha-liquefying phase',
    tip: 'Time for deep detoxification. Increase intake of ginger, black pepper, and bitter greens.',
    advice: 'Stay active in the morning hours to mobilize sluggishness and spring allergens.'
  },
  5: {
    season: 'Grishma (Summer Season)',
    ritu: 'Pitta-raising solar period',
    tip: 'Cool your body with light, sweet, liquid foods. Drink fresh coconut water, sweet lassi, and watermelon juice.',
    advice: 'Limit hot chilies, vinegar, fried items, and intense hard exercises under direct sunlight.'
  },
  6: {
    season: 'Grishma (Summer Season)',
    ritu: 'Pitta-raising solar period',
    tip: 'Maximize hydration. Drink cooling infusions made of coriander seeds, fennel, and fresh mint leaves.',
    advice: 'Apply pure sandalwood paste or organic rose water externally to calm thermal skin flares.'
  },
  7: {
    season: 'Varsha (Monsoon Season)',
    ritu: 'Agni-weakening humid phase',
    tip: 'During heavy rainfall, safeguard your digestive fire (Agni). Consume freshly cooked, warm, light meals containing dry ginger and rock salt.',
    advice: 'Do not eat raw herbs or cold uncooked foods. Keep boiled warm water as your exclusive beverage companion.'
  },
  8: {
    season: 'Varsha (Monsoon Season)',
    ritu: 'Agni-weakening humid phase',
    tip: 'Introduce protective spices like cumin, asafoetida (Hing), and black pepper to stabilize erratic bowel movements.',
    advice: 'Beware of damp environments. Ensure room air circulation to suppress micro-pathogens.'
  },
  9: {
    season: 'Sharad (Autumn Season)',
    ritu: 'Pitta-overflowing period',
    tip: 'Pitta naturally spikes as monsoon clouds disappear and intense autumn heat arrives. Choose bitter and sweet herbs.',
    advice: 'Incorporate pure cow ghee, bitter gourds, and boiled basmati rice. Avoid excessive garlic, onion, and red meat.'
  },
  10: {
    season: 'Sharad (Autumn Season)',
    ritu: 'Pitta-overflowing period',
    tip: 'Soothe excess acid. Take dry raisins soaked overnight in warm water.',
    advice: 'Practice calming sheetali pranayama (cooling breath) to quickly reduce internal heat flashes.'
  },
  11: {
    season: 'Hemanta (Early Winter)',
    ritu: 'Strong digestive Agni phase',
    tip: 'Your internal digestive fire (Agni) is strong. Feed it high-nutrition oils, warm nuts, rich dates, and whole grains.',
    advice: 'Do not skip meals, or the highly activated digestive fire will start digesting host tissue layers.'
  },
  12: {
    season: 'Hemanta (Early Winter)',
    ritu: 'Strong digestive Agni phase',
    tip: 'Warming herbs like cardamom, cinnamon, and nutmeg should be cooked liberally into warm milk beverages.',
    advice: 'Practice vigorous physical yoga postures to improve baseline stamina and warm up marrow.'
  }
};

export default function DailyAyurvedicWisdom() {
  const currentDate = useMemo(() => new Date(), []);
  const currentMonthIdx = useMemo(() => currentDate.getMonth() + 1, [currentDate]); // 1-indexed month
  const currentDay = useMemo(() => currentDate.getDate(), [currentDate]);

  // Use date to pick a default quote deterministically
  const defaultQuoteIndex = useMemo(() => {
    return (currentDay + currentMonthIdx) % WISDOM_POOL.length;
  }, [currentDay, currentMonthIdx]);

  const [activeQuoteIndex, setActiveQuoteIndex] = useState(defaultQuoteIndex);
  const [isRotating, setIsRotating] = useState(false);

  const activeQuote = WISDOM_POOL[activeQuoteIndex];
  const seasonalTip = SEASONAL_TIPS[currentMonthIdx] || SEASONAL_TIPS[6]; // Fallback to Summer (June)

  const handleNextWisdom = () => {
    setIsRotating(true);
    setTimeout(() => {
      setActiveQuoteIndex((prev) => (prev + 1) % WISDOM_POOL.length);
      setIsRotating(false);
    }, 450);
  };

  return (
    <div 
      id="daily-ayurvedic-wisdom-card" 
      className="bg-gradient-to-r from-[#fcfaeedb] via-amber-50/45 to-[#fcfaeedb] rounded-xl border border-amber-900/15 p-5 relative overflow-hidden transition-all duration-300 shadow-3xs hover:border-amber-900/25 mb-6 text-left"
    >
      {/* Absolute background mandala accent */}
      <div className="absolute -right-10 -bottom-10 w-36 h-36 opacity-5 pointer-events-none select-none">
        <svg viewBox="0 0 100 100" fill="currentColor" className="text-amber-900 w-full h-full animate-[spin_100s_linear_infinite]">
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1" fill="none" />
          <path d="M50 10 Q60 50 90 50 Q60 50 50 90 Q40 50 10 50 Q40 50 50 10" stroke="currentColor" strokeWidth="1" fill="none" />
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch relative z-10">
        
        {/* Quote of the Day: 7 columns */}
        <div className="md:col-span-7 flex flex-col justify-between border-b md:border-b-0 md:border-r border-amber-900/10 pb-4 md:pb-0 md:pr-5 space-y-3.5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 bg-amber-900 text-[#faf2e6] text-[9px] font-mono font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
                <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" /> DAILY SUTRA
              </span>
              <button
                onClick={handleNextWisdom}
                disabled={isRotating}
                className="text-stone-400 hover:text-amber-900 font-mono text-[9px] font-extrabold uppercase tracking-widest flex items-center gap-1.5 cursor-pointer select-none py-1 px-2 rounded-md hover:bg-amber-100/40 transition-all active:scale-95 disabled:opacity-50"
                title="Seek another classical formulation insight"
              >
                <RefreshCw className={`w-2.5 h-2.5 ${isRotating ? 'animate-spin text-amber-900' : ''}`} />
                SEEK NEW WISDOM
              </button>
            </div>

            <div className={`transition-opacity duration-300 ${isRotating ? 'opacity-20' : 'opacity-100'} space-y-2.5`}>
              {activeQuote.sanskrit && (
                <p className="font-serif font-black text-amber-950 text-xs tracking-wider leading-relaxed bg-amber-100/30 p-2 rounded border border-amber-950/5 text-center italic">
                  &ldquo;{activeQuote.sanskrit}&rdquo;
                </p>
              )}
              
              <p className="text-stone-850 font-serif font-semibold text-xs md:text-[13px] leading-relaxed italic">
                &ldquo;{activeQuote.translation}&rdquo;
              </p>
              
              <p className="text-stone-500 text-[11px] font-serif leading-relaxed">
                {activeQuote.explanation}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-stone-400 font-mono text-[8px] uppercase tracking-wider">
            <BookOpen className="w-3 h-3 text-amber-900" />
            <span>SOURCE: {activeQuote.source}</span>
          </div>
        </div>

        {/* Seasonal Lifestyle Tip: 5 columns */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-3.5 pl-0 md:pl-1">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1.5 bg-emerald-800 text-white text-[9px] font-mono font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
                <Leaf className="w-3 h-3 text-emerald-300" /> RITUCHARYA TIP
              </span>
              <span className="text-[9px] font-mono text-stone-400 font-bold uppercase tracking-wider">
                • {seasonalTip.season}
              </span>
            </div>

            <div className="space-y-1.5">
              <h5 className="font-serif font-black text-stone-900 text-xs md:text-[13px] uppercase tracking-tight flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-emerald-700" /> {seasonalTip.ritu}
              </h5>
              <p className="text-xs text-stone-750 font-serif leading-relaxed">
                {seasonalTip.tip}
              </p>
              <p className="text-[10.5px] text-stone-500 font-serif leading-relaxed italic bg-emerald-50/40 p-2 border-l-2 border-emerald-700/30 rounded-r-md">
                {seasonalTip.advice}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-stone-400 font-mono text-[8px] uppercase tracking-wider">
            <Clock className="w-3 h-3 text-emerald-700" />
            <span>SOLAR INTERVAL CYCLE: JUNE TRANSIT</span>
          </div>
        </div>

      </div>
    </div>
  );
}
