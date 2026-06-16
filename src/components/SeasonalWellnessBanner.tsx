import React from 'react';
import { 
  Sun, 
  Wind, 
  Flame, 
  Droplets, 
  Sprout, 
  ShieldAlert, 
  Compass, 
  Info, 
  Calendar,
  X 
} from 'lucide-react';

interface SeasonalWellnessBannerProps {
  selectedSeason: string;
  onClearSeason: () => void;
}

interface SeasonAdvice {
  title: string;
  sanskritTitle: string;
  sanskritQuote: string;
  translation: string;
  doshaState: string;
  dietaryAdvice: string;
  lifestyleAdvice: string;
  keyHerbs: string[];
  bannerBg: string;
  borderCol: string;
  textCol: string;
  accentBg: string;
  accentText: string;
  icon: React.ReactNode;
}

const SEASON_ADVICE_MAP: Record<string, SeasonAdvice> = {
  all: {
    title: "Global Dinacharya: Year-Round Tridoshic Equilibrium",
    sanskritTitle: "स्वस्थवृत्त शासन",
    sanskritQuote: "स्वस्थस्य स्वास्थ्य रक्षणं आतुरस्य विकार प्रशमनं च ॥",
    translation: "To protect the health of the healthy and resolve the diseases of the ailing.",
    doshaState: "Vata, Pitta, and Kapha in balanced state based on individual Prakriti",
    dietaryAdvice: "Enjoy fresh, seasonal, locally sources whole foods. Avoid overeating and maintain a consistent interval of 4-6 hours between consecutive meals. Sip lukewarm water throughout the day.",
    lifestyleAdvice: "Formulate a steady daily regimen (Dinacharya). Awaken during Brahma Muhurta (1.5 hours before sunrise), scrape the tongue, perform moderate physical yoga, and meditate.",
    keyHerbs: ["Trifala", "Amalaki", "Chyawanprash", "Tulsi"],
    bannerBg: "bg-amber-50/40",
    borderCol: "border-amber-900/15",
    textCol: "text-stone-800",
    accentBg: "bg-amber-950/10",
    accentText: "text-amber-955",
    icon: <Compass className="w-5 h-5 text-amber-800" />
  },
  vasanta: {
    title: "Vasanta Ritucharya: Spring Purification & Renewal",
    sanskritTitle: "वसन्त ऋतुचर्या",
    sanskritQuote: "वसन्ते कफजान् रोगान् बाधते निष्कमिष्यति ॥",
    translation: "In Spring, accumulated Kapha liquefies due to solar intensity, creating congestion and metabolic stagnation.",
    doshaState: "Kapha Liquidation & High Susceptibility to Respiratory/Allergy Disorders",
    dietaryAdvice: "Warm, light, dry, bitter, and astringent foods are vital. Incorporate barley, millet, honey, and fresh bitter gourd. Strictly avoid sweet, heavy, cold, or oily items and dairy/yogurt.",
    lifestyleAdvice: "Perform gentle metabolic cleansing. Engage in invigorating dry powder body massages (Udvartana) to drain fluid, practice active Pranayama (Kapalabhati), and avoid daytime sleeping.",
    keyHerbs: ["Triphala", "Chandraprabha Vati", "Arogyavardhini", "Ginger"],
    bannerBg: "bg-emerald-50/50",
    borderCol: "border-emerald-250",
    textCol: "text-emerald-950",
    accentBg: "bg-emerald-950/10",
    accentText: "text-emerald-900",
    icon: <Sprout className="w-5 h-5 text-emerald-700 animate-pulse" />
  },
  grishma: {
    title: "Grishma Ritucharya: Cooling Pitta & Preserving Vitality",
    sanskritTitle: "ग्रीष्म ऋतुचर्या",
    sanskritQuote: "मयूखैर्जगतः स्नेहं ग्रष्मे हरतिं रविः ॥",
    translation: "In Summer, the intense sun depletes the moisture, strength, and soft protective 'Ojas' of the Earth.",
    doshaState: "High Pitta Accumulation, Agni Depletion, and Dehydration Liability",
    dietaryAdvice: "Favour cooling, liquid, sweet, and highly hydrating meals. Drink fresh coconut water, sweet lassi, and cow milk, and eat sweet melons. Avoid heavy spices, hot chilies, sour condiments, and alcohol.",
    lifestyleAdvice: "Spend time in cool, shaded spaces alongside plants or moving water. Apply standard sandalwood paste or rose water to skin pores. Keep workouts short, slow, and non-draining.",
    keyHerbs: ["Avipattikar Churna", "Brahmi Rasayana", "Shatavari", "Amla"],
    bannerBg: "bg-amber-50/70",
    borderCol: "border-amber-300",
    textCol: "text-amber-950",
    accentBg: "bg-amber-900/10",
    accentText: "text-amber-900",
    icon: <Sun className="w-5 h-5 text-amber-600 animate-spin-slow" />
  },
  varsha: {
    title: "Varsha Ritucharya: Kindle Agni & Taming Vata Winds",
    sanskritTitle: "वर्षा ऋतुचर्या",
    sanskritQuote: "वर्षोषु भूमिबाष्पाच्च वैद्युतादग्निसङ्गमात् ॥",
    translation: "In Monsoon, cold rain combined with geothermal floor vapor dampens digestion and excites Vata energy.",
    doshaState: "Highly Aggravated Vata, Weakened Digestive Power (Mandagni), and Joint Pain",
    dietaryAdvice: "Prioritize warm, freshly cooked, slightly oily, salty, and sour foods. Use digestive spices like cumin, ginger, and garlic. Strictly avoid cold beverages, stale food, salads, and atmospheric greens.",
    lifestyleAdvice: "Maintain dry skin and feet. Bathe with warm water, practice light warm oil self-massages (Abhyanga), protect joints from cold drafts, and drink only boiled/medicated water.",
    keyHerbs: ["Mahanarayan Taila", "Ashwagandharishta", "Triphala Churna", "Pippali"],
    bannerBg: "bg-indigo-50/70",
    borderCol: "border-indigo-200",
    textCol: "text-indigo-950",
    accentBg: "bg-indigo-950/10",
    accentText: "text-indigo-900",
    icon: <Droplets className="w-5 h-5 text-indigo-600" />
  },
  sharad: {
    title: "Sharad Ritucharya: Pacifying Post-Rain Pitta Flare-Ups",
    sanskritTitle: "शरद ऋतुचर्या",
    sanskritQuote: "वर्षाशीतोचिताङ्गानां सहसैवार्करश्मिभिः ॥",
    translation: "In Autumn, bodies adapted to monsoon cold are suddenly exposed to warm rays, causing deep-seated bile (Pitta) to overflow.",
    doshaState: "Pitta Aggravation (Bilis Overflow), Inflammatory Rash, Digestive Acidity",
    dietaryAdvice: "Choose bitter, sweet, and astringent compounds of easy digestion. Consume boiled cabbage, bitter gourd, fresh grapes, and cow ghee. Avoid heavy red meats, dry ginger, chilies, and sour curds.",
    lifestyleAdvice: "Walk under the cooling midnight moonlight (known as 'Moonbathing'). Practice deep yogic cooling breathing like Sitali Pranayama, and stay well hydrated. Avoid high-noon direct sun.",
    keyHerbs: ["Avipattikar Churna", "Kumaryasava Special", "Arogyavardhini Vati", "Triphala"],
    bannerBg: "bg-rose-50/60",
    borderCol: "border-rose-200",
    textCol: "text-rose-950",
    accentBg: "bg-rose-950/10",
    accentText: "text-rose-900",
    icon: <Flame className="w-5 h-5 text-rose-600" />
  },
  hemanta: {
    title: "Hemanta Ritucharya: Nutritive Resiliency & Agni Insulation",
    sanskritTitle: "हेमन्त ऋतुचर्या",
    sanskritQuote: "बली बलवान् हेमन्ते... मरुतः पुनः ॥",
    translation: "In Early Winter, the outer cold locks body heat inside, strengthening internal combustion (Agni). If unsupplied with fuel (rich foods), it starts consuming bodily tissues.",
    doshaState: "Peak Digestive Fire (Agni) with elevated Vata cold vulnerability",
    dietaryAdvice: "Satisfy your strong digestion with rich, warm, sweet, sour, and salty nourishing foods. Incorporate pure ghee, sesame oil, black lentils, dates, nuts, sugar cane juice, and hot cooked grains.",
    lifestyleAdvice: "Engage in active physical exercises, warm sesame oil whole-body massages (Abhyanga), take hot stream baths, and protect yourself with cozy woolens. Do not indulge in dry fasting.",
    keyHerbs: ["Chyawanprash Special", "Brahmi Rasayana", "Mahanarayan Taila", "Ashwagandha"],
    bannerBg: "bg-amber-50/50",
    borderCol: "border-amber-250",
    textCol: "text-amber-955",
    accentBg: "bg-amber-950/15",
    accentText: "text-amber-950",
    icon: <Calendar className="w-5 h-5 text-amber-700" />
  },
  shishira: {
    title: "Shishira Ritucharya: Inner Nourishment for Late Dry Winter",
    sanskritTitle: "शिशिर ऋतुचर्या",
    sanskritQuote: "शीते चातिबलमाग्निः... शिशिरे कफसञ्चयः ॥",
    translation: "In Late Winter, the cold and dryness intensify, calling for continues fortification and warmth while starting to collect the raw elements of Kapha.",
    doshaState: "Strong Agni, Dry Vata Risk, and Early Stages of Kapha Accumulation",
    dietaryAdvice: "Continue the rich nutritive diet of Early Winter. Savor fresh honey, steamed tubers, ginger tea, hot soups, and dishes infused with black pepper and heavy ghee. Avoid astringent, cold, or dry snacks.",
    lifestyleAdvice: "Maximize exposure to therapeutic sunlight. Rub warm medicated oils onto the scalp and soles. Stay shielded from severe wind gusts, and practice energizing Surya Namaskar yogas.",
    keyHerbs: ["Chyawanprash Special", "Ashwagandharishta", "Chandraprabha Vati", "Mahanarayan Taila"],
    bannerBg: "bg-yellow-50/50",
    borderCol: "border-yellow-200",
    textCol: "text-yellow-955",
    accentBg: "bg-yellow-950/10",
    accentText: "text-yellow-900",
    icon: <Wind className="w-5 h-5 text-yellow-700" />
  }
};

export default function SeasonalWellnessBanner({ selectedSeason, onClearSeason }: SeasonalWellnessBannerProps) {
  const currentSeasonId = selectedSeason;
  const currAdvice = SEASON_ADVICE_MAP[currentSeasonId] || SEASON_ADVICE_MAP.all;

  return (
    <div 
      id="mab-ritucharya-banner"
      className={`rounded-2xl border ${currAdvice.borderCol} ${currAdvice.bannerBg} p-5 md:p-6 transition-all duration-350 shadow-xs relative overflow-hidden`}
    >
      {/* Decorative Traditional Floral Border Accent */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-5 pointer-events-none">
        <svg viewBox="0 0 100 100" fill="currentColor" className={currAdvice.textCol}>
          <path d="M50 0 C40 30, 30 40, 0 50 C30 60, 40 70, 50 100 C60 70, 70 60, 100 50 C70 40, 60 30, 50 0 Z" />
        </svg>
      </div>

      <div className="flex flex-col gap-4">
        {/* Header Ribbon */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${currAdvice.accentBg} flex items-center justify-center shrink-0`}>
              {currAdvice.icon}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-mono text-[9px] font-black uppercase tracking-widest bg-amber-900/10 text-amber-900 px-2 py-0.5 rounded-sm">
                  Ritucharya • ऋतुचर्या
                </span>
                {currentSeasonId !== 'all' && (
                  <span className="font-sans text-[9px] font-bold bg-amber-950 text-white px-2 py-0.5 rounded-full uppercase tracking-wide">
                    Filtered
                  </span>
                )}
              </div>
              <h2 className={`font-serif text-base md:text-xl font-extrabold tracking-tight ${currAdvice.textCol} mt-1`}>
                {currAdvice.title}
              </h2>
            </div>
          </div>

          {currentSeasonId !== 'all' && (
            <button
              onClick={onClearSeason}
              className="text-stone-400 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 p-1 rounded-full p-1.5 transition-colors duration-150 cursor-pointer border-none"
              title="Reset Season Filter to All"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sanskrit sloka spotlight */}
        <div className="p-3.5 rounded-xl bg-white/70 border border-amber-900/5 backdrop-blur-xs text-left">
          <div className="font-serif font-black text-amber-900 text-xs md:text-sm tracking-wide text-center uppercase md:leading-relaxed">
            "{currAdvice.sanskritQuote}"
          </div>
          <div className="text-[10.5px] leading-relaxed text-stone-500 font-serif italic text-center mt-1.5 max-w-2xl mx-auto">
            <span className="font-bold text-amber-800 not-italic">Sutra translation:</span> {currAdvice.translation}
          </div>
        </div>

        {/* Layout details */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-left">
          {/* Column 1: Dosha / System Influence */}
          <div className="md:col-span-4 space-y-1">
            <span className="text-[10px] font-mono text-stone-500 font-black uppercase tracking-widest block">
              Dosha & Body state:
            </span>
            <p className="text-xs font-serif leading-relaxed font-bold text-amber-950">
              {currAdvice.doshaState}
            </p>
          </div>

          {/* Column 2: Diet (Ahar) */}
          <div className="md:col-span-4 space-y-1">
            <span className="text-[10px] font-mono text-stone-500 font-black uppercase tracking-widest block">
              Dietary regimen (Ahar):
            </span>
            <p className="text-xs text-stone-600 leading-relaxed">
              {currAdvice.dietaryAdvice}
            </p>
          </div>

          {/* Column 3: Lifestyle (Vihar) */}
          <div className="md:col-span-4 space-y-1">
            <span className="text-[10px] font-mono text-stone-500 font-black uppercase tracking-widest block">
              Lifestyle regimen (Vihar):
            </span>
            <p className="text-xs text-stone-600 leading-relaxed">
              {currAdvice.lifestyleAdvice}
            </p>
          </div>
        </div>

        {/* Recommended herbs row */}
        <div className="border-t border-dashed border-amber-900/10 pt-3.5 flex flex-wrap items-center gap-2 text-left">
          <span className="text-[10px] font-mono text-stone-400 font-black uppercase tracking-widest">
            Recommended Synergy Elements:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {currAdvice.keyHerbs.map((herb, i) => (
              <span 
                key={i} 
                className={`text-[10.5px] font-serif font-bold px-2.5 py-0.5 rounded-full border bg-white/95 text-[#8a5a36] border-amber-800/10 shadow-3xs`}
              >
                ✦ {herb}
              </span>
            ))}
          </div>

          {currentSeasonId === 'all' && (
            <div className="ml-auto text-[10px] font-medium text-stone-400 italic">
              *Choose a Ritu on the left menu to customize this guidance
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
