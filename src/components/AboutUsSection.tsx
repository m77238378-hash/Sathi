import React from 'react';
import { 
  Heart, 
  Sparkles, 
  BookOpen, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Award,
  Users,
  Compass
} from 'lucide-react';

export default function AboutUsSection() {
  const valueCards = [
    {
      id: 'mab-about-value-authenticity',
      title: 'Pristine Authenticity (Sādhutā)',
      description: 'Every formulation and remedy we catalog is traced back directly to classical Sanskrit samhitās (Charaka, Sushruta, and Sarangadhara). We reject synthetic shortcuts in favor of pure, full-potency botanical compounding.',
      icon: <Sparkles className="w-5 h-5 text-amber-700" />,
      tag: 'VEDIC LINEAGE'
    },
    {
      id: 'mab-about-value-precision',
      title: 'Precision Personalization (Prakriti)',
      description: 'Ayur-informatics is not generalism. We integrate traditional pulse-diagnostics (Nadi Pariksha) philosophy with systematic Dravyaguna (pharmacology) profiles to align remedies to your unique Tri-dosha state.',
      icon: <Compass className="w-5 h-5 text-amber-700" />,
      tag: 'SCIENTIFIC PRECISION'
    },
    {
      id: 'mab-about-value-purity',
      title: 'Ethical Shodhana (Purification)',
      description: 'Raw materials undergo meticulous traditional purificatory sequences (Shodhana) to eliminate toxicity and elevate biochemical biodistribution. We source strictly from organic Himalayan forest gardens.',
      icon: <ShieldCheck className="w-5 h-5 text-amber-700" />,
      tag: 'COMPLIANT SAFETY'
    }
  ];

  const milestones = [
    {
      id: 'mab-milestone-1',
      year: 'Est. 2012',
      title: 'Sanskrit Manuscripts Digitization',
      desc: 'Collaborated with traditional gurukulams in Uttarakhand to digitize and cross-reference rare compounding remedies written in palm-leaf manuscripts.'
    },
    {
      id: 'mab-milestone-2',
      year: '2016',
      title: 'Himalayan Forest Cooperatives',
      desc: 'Established our primary sustainable, certified-wildcrafted harvesting network in high-altitude zones to preserve endangered medicinal flora.'
    },
    {
      id: 'mab-milestone-3',
      year: '2021',
      title: 'The Digital Ayur-Catalog Launch',
      desc: 'Engineered our premium digital repository of compound remedies with embedded diagnostic support schemas, bringing traditional intelligence to modern homes.'
    }
  ];

  const teamMembers = [
    {
      id: 'mab-team-1',
      name: 'Vaidya Harishankar Joshi',
      role: 'Principal Ayurveda Acharya & Compounding Guardian',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200',
      bio: 'Representing a continuous seven-generation lineage of Rasa Shastra expertise, Acharya Joshi supervises all botanical compounding ratios.'
    },
    {
      id: 'mab-team-2',
      name: 'Dr. Arundhati Sen, PhD',
      role: 'Head of Botanical Research & Pharmacognosy',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
      bio: 'With over 18 years in modern phyto-chemical analysis, Dr. Sen bridges ancient Charaka formulas with standard laboratory chromatography.'
    }
  ];

  return (
    <div id="mab-about-us-container" className="space-y-12 animate-fade-in text-stone-800 text-left">
      
      {/* 1. Brand Identity Overview Section */}
      <div id="mab-about-hero" className="bg-[#2d1b10] rounded-3xl border border-amber-900/10 p-8 md:p-12 relative overflow-hidden shadow-md text-white text-left flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950/40 via-stone-950/80 to-[#1a0f0a] -z-10" />
        
        {/* Abstract mandala line illustration */}
        <div id="mab-about-hero-mandala" className="absolute right-0 bottom-0 top-0 w-1/3 opacity-5 pointer-events-none hidden md:block">
          <svg viewBox="0 0 100 100" fill="currentColor" className="text-amber-500 w-full h-full">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" fill="none" strokeDasharray="3,3" />
            <polygon points="50,10 90,50 50,90 10,50" stroke="currentColor" strokeWidth="0.7" fill="none" />
            <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="0.3" fill="none" />
          </svg>
        </div>

        <div className="space-y-4 max-w-3xl">
          <span id="mab-about-badge" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-305 border border-amber-500/20">
            <Award className="w-3.5 h-3.5 text-amber-400" /> Mangalam Sanctuary of Wellness
          </span>
          <h1 id="mab-about-title" className="font-serif text-3xl md:text-5xl font-black text-[#faf2e6] tracking-tight leading-none">
            Our Noble Lineage &amp; Purpose
          </h1>
          <p id="mab-about-subtitle" className="text-[#eadbc8] text-base md:text-lg leading-relaxed font-serif italic">
            "आयुः कामायमानेन धर्मार्थसुखसाधनम्। आयुर्वेदविशारदैः उपदिष्टो हि सर्वथा॥" — To support the noble pursuit of life, righteousness, purpose, and spiritual freedom, Ayurveda represents the pristine primordial light.
          </p>
          <p className="text-stone-300 text-sm leading-relaxed max-w-2xl font-sans">
            At <strong>Mangalam Ayurveda</strong>, we work to curate, compound, and preserve the genuine knowledge of Vedic medicinal botany and Hatha respiratory disciplines. Our digital catalog is more than modern retail; it is a sacred bridge designed to keep humanity in resonance with Cosmic laws.
          </p>
        </div>
      </div>

      {/* 2. Three Pillars of Mangalam Ayurveda */}
      <div id="mab-about-pillars-section" className="space-y-6">
        <div className="text-center md:text-left space-y-1">
          <h2 id="mab-pillars-title" className="font-serif text-2xl font-black text-amber-950">
            Foundational Pillars of our Sanctuary
          </h2>
          <p className="text-xs text-stone-500 max-w-2xl">
            We operate in deep reverence to traditional Sanskrit texts, assuring that no clinical formulas are compromised.
          </p>
        </div>

        <div id="mab-about-values-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {valueCards.map((card) => (
            <div 
              key={card.id} 
              id={card.id}
              className="bg-white rounded-2xl border border-amber-950/15 p-6 shadow-3xs hover:shadow-xs transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4 text-left">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-900/10 flex items-center justify-center">
                  {card.icon}
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-black text-amber-800 tracking-widest block uppercase">
                    {card.tag}
                  </span>
                  <h3 className="font-serif font-bold text-base text-stone-900 leading-tight">
                    {card.title}
                  </h3>
                </div>
                <p className="text-xs text-stone-605 leading-relaxed font-sans">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Meet the Custodian Council */}
      <div id="mab-about-custodians" className="bg-[#fdfbf7] rounded-2xl border border-amber-950/15 p-6 md:p-8 space-y-6">
        <div className="border-b border-amber-900/10 pb-4">
          <h2 id="mab-custodians-title" className="font-serif text-xl md:text-2xl font-black text-amber-955 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-800" /> Gurus &amp; Custodians of the Lineage
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Our formulations and clinical ratios are carefully supervised by a devoted team of certified Acharyas and natural chemists.
          </p>
        </div>

        <div id="mab-custodians-cards" className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {teamMembers.map((member) => (
            <div 
              key={member.id} 
              id={member.id} 
              className="bg-white rounded-xl border border-stone-200 p-5 shadow-3xs flex flex-col sm:flex-row gap-5 items-start text-left"
            >
              <img 
                src={member.avatar} 
                alt={member.name}
                referrerPolicy="no-referrer"
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-full border-2 border-amber-900/20 object-cover shrink-0 mx-auto sm:mx-0 shadow-3xs" 
              />
              <div className="space-y-2">
                <div>
                  <h3 className="font-serif font-black text-sm md:text-base text-stone-900 leading-tight">
                    {member.name}
                  </h3>
                  <span className="text-[10px] font-mono text-amber-900 font-bold block uppercase mt-0.5">
                    {member.role}
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed font-sans font-normal">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Heritage Timeline / Milestones */}
      <div id="mab-about-timeline-section" className="space-y-6 text-left">
        <div>
          <h2 id="mab-timeline-title" className="font-serif text-xl md:text-2xl font-black text-amber-955 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-800" /> Our Path to Integration
          </h2>
          <p className="text-xs text-stone-500">
            A modest retro-perspective on our journey to preserve botanical pharmacology records.
          </p>
        </div>

        <div id="mab-timeline-container" className="relative pl-6 border-l-2 border-amber-900/15 space-y-8 py-2">
          {milestones.map((ms) => (
            <div key={ms.id} id={ms.id} className="relative space-y-1.5 text-left">
              {/* timeline bullet node */}
              <div className="absolute -left-9.5 top-1 w-5 h-5 rounded-full bg-amber-900 border-4 border-[#fafbf9] flex items-center justify-center shadow-3xs" />
              <span className="inline-block text-[10px] font-mono font-black text-amber-100 px-2.5 py-0.5 bg-amber-900 text-[#faf2e6] rounded uppercase tracking-wider">
                {ms.year}
              </span>
              <h4 className="font-serif font-black text-xs md:text-sm text-stone-900 leading-tight">
                {ms.title}
              </h4>
              <p className="text-xs text-stone-600 max-w-3xl leading-relaxed">
                {ms.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Clean, elegant information card layout */}
      <div id="mab-about-visit-card" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-dashed border-stone-200">
        <div className="bg-white p-4 rounded-xl border border-stone-200 flex flex-col justify-between">
          <span className="text-[8px] font-mono text-stone-400 font-bold uppercase tracking-widest block">Main Sanctuary:</span>
          <p className="text-xs font-serif font-black text-stone-800 mt-1.5 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-amber-700 shrink-0" /> Tapovan Forest Road, Rishikesh, Uttarakhand, India
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200 flex flex-col justify-between">
          <span className="text-[8px] font-mono text-stone-400 font-bold uppercase tracking-widest block">Compounding Lab:</span>
          <p className="text-xs font-serif font-black text-stone-800 mt-1.5 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-amber-700 shrink-0" /> Devprayag Phyto-pharmacology Center, Tehri Garhwal, India
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200 flex flex-col justify-between">
          <span className="text-[8px] font-mono text-stone-400 font-bold uppercase tracking-widest block">Connect With Us:</span>
          <p className="text-xs font-serif font-black text-stone-800 mt-1.5 flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-amber-700 shrink-0" /> lineage@mangalamayurveda.org
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200 flex flex-col justify-between">
          <span className="text-[8px] font-mono text-stone-400 font-bold uppercase tracking-widest block">Operating Hours:</span>
          <p className="text-xs font-serif font-black text-stone-800 mt-1.5 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-700 shrink-0" /> Sunrise to Sunset (As per traditional cycle standards)
          </p>
        </div>
      </div>

    </div>
  );
}
