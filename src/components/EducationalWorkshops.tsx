import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  GraduationCap, 
  Activity, 
  Compass, 
  Award,
  ChevronDown,
  Brain,
  Layers,
  Layout,
  MessageSquareCode,
  Users2,
  AlertCircle,
  HelpCircle,
  Paintbrush,
  Languages,
  Plus,
  HeartHandshake
} from 'lucide-react';

interface TopicItem {
  id: number;
  title: string;
  details: string;
  badge?: string;
  icon?: any;
}

export default function EducationalWorkshops() {
  const [activeTab, setActiveTab] = useState<'core' | 'specialized'>('core');
  const [expandedTopic, setExpandedTopic] = useState<number | null>(1); // default expand first element

  const coreTopics: TopicItem[] = [
    {
      id: 1,
      title: "Child Psychology",
      details: "Principles of child development, key biological and psychological milestones of growth, and the crucial interactive roles played by family units, peer groups, and school environments.",
      badge: "Behavioral Sciences",
      icon: Brain
    },
    {
      id: 2,
      title: "Needs of Children & Developmental Security",
      details: "Comprehensive analysis of children's foundational physical and psychological triggers using Maslow's hierarchical model. Explores internalization of security, peer bonding patterns, socialization mechanisms, and its overarching developmental significance.",
      badge: "Foundations",
      icon: Layers
    },
    {
      id: 3,
      title: "School as a Living Organization",
      details: "Advanced classroom management, subtle dynamics of classroom interactions, behavioral reinforcement models, and professional pedagogical ethics for modern educators.",
      badge: "Institutional Management",
      icon: Layout
    },
    {
      id: 4,
      title: "NEP 2020 Pedagogical Frameworks",
      details: "Detailed practical overview of domains of learning, micro-teaching skill development, and multi-disciplinary educational models proposed under India's National Education Policy.",
      badge: "National Standards",
      icon: Award
    },
    {
      id: 5,
      title: "Expertise in the Skill of Explanation",
      details: "The classical art of storytelling paired with active classroom questioning techniques to capture attention, stimulate curiosity, and improve memory retention.",
      badge: "Delivery Skills",
      icon: MessageSquareCode
    },
    {
      id: 6,
      title: "Introduction to Teaching Techniques",
      details: "Structuring interactive learning loops, formulating clear pedagogical queries, and establishing dynamic response systems to keep students engaged.",
      badge: "Methodologies",
      icon: Sparkles
    },
    {
      id: 7,
      title: "Strategic Lesson Planning",
      details: "Formulating clear, goal-oriented lesson progressions, time-bracket management templates, and integrating active inquiry-based student tasks perfectly.",
      badge: "Curriculum Design",
      icon: BookOpen
    },
    {
      id: 8,
      title: "Find YOUR Purpose of Life (Ikigai Integration)",
      details: "A dedicated holistic seminar directed toward both educators and students. Focuses on alignment of personal core values, individual inner motivation triggers, and ethical duty (Dharma) in modern education.",
      badge: "Self-Actualization",
      icon: Compass
    }
  ];

  const specializedTopics: TopicItem[] = [
    {
      id: 9,
      title: "Identifying & Supporting Slow Learners",
      details: "Employing adaptive differentiated learning configurations, sensory-rich multi-path methods, and empathetic, non-stigmatizing correction models for neuro-diverse classrooms.",
      badge: "Inclusive Methodologies",
      icon: HeartHandshake
    },
    {
      id: 10,
      title: "Exam Anxiety & Stress Management",
      details: "Empowering students with mindful breathing controls (Pranayama), psychological anchoring strategies, cognitive restructuring of performance stress, and exam-day wellness techniques.",
      badge: "Mental Resilience",
      icon: Activity
    },
    {
      id: 11,
      title: "Contemporary Career Guidance",
      details: "Practical methodologies to map students' inherent interests and skills to modern multi-disciplinary fields, mentoring models, and holistic vocational paths.",
      badge: "Mentorship",
      icon: Compass
    },
    {
      id: 12,
      title: "Art & Craft Integration in Classrooms",
      details: "Harnessing visual association, fine-motor memory retention, tactile learning aids, and neuro-developmental art therapy exercises to simplify complex topics.",
      badge: "Active Learning",
      icon: Paintbrush
    },
    {
      id: 13,
      title: "Spoken English & Communication Drills",
      details: "Phonetic articulation training, interactive speaking exercises, peer-to-peer dialogues, and building confident public speaking skills for both teachers and students.",
      badge: "Linguistics",
      icon: Languages
    },
    {
      id: 14,
      title: "Alternative Math Pedagogy & Concept Relief",
      details: "Introducing alternative conceptual models, visual spatial math boards, and anxiety-reduction games to dispel general fear around numerical calculations.",
      badge: "Cognitive Relief",
      icon: Sparkles
    },
    {
      id: 15,
      title: "Inclusive Education Implementation",
      details: "Direct guidelines for physical, social, and structural adjustments in typical classrooms. Implementing Universal Designs for Learning (UDL) for students of all abilities.",
      badge: "Universal Access",
      icon: Users2
    },
    {
      id: 16,
      title: "AI & Digital Tools in Modern Classrooms",
      details: "Smart AI assistance mapping, personalizing homework parameters, generating interactive quizzes, and navigating the ethics of AI generation responsibly in intermediate environments.",
      badge: "Future Ready",
      icon: Brain
    },
    {
      id: 17,
      title: "Adolescent Workshops: Menstrual Hygiene & Growth",
      details: "A safe, respectful environment de-stigmatizing biological milestones, promoting physical wellness, and building sustainable institutional healthcare support systems.",
      badge: "Youth Wellness",
      icon: HelpCircle
    },
    {
      id: 18,
      title: "Advanced Storytelling as a Pedagogical Tool",
      details: "Harnessing classical Indian narrative architectures, emotional (Rasa) connection triggers, and memory anchors to translate abstract curriculum chapters into unforgettable stories.",
      badge: "Pedagogy Arts",
      icon: BookOpen
    }
  ];

  const currentTopics = activeTab === 'core' ? coreTopics : specializedTopics;

  const handleTopicClick = (id: number) => {
    setExpandedTopic(expandedTopic === id ? null : id);
  };

  return (
    <div id="educational-training-section" className="bg-white rounded-xl border border-amber-900/15 p-6 md:p-8 space-y-6 text-left">
      
      {/* Section Header */}
      <div className="border-b border-amber-900/10 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-mono tracking-widest text-[#8a5a36] uppercase block font-semibold">
            GURUKUL COMMUNITY INITIATIVES &amp; PEDAGOGY
          </span>
          <h3 className="text-xl md:text-2xl font-serif font-black text-amber-950">
            Educational &amp; Psychological Training Workshops
          </h3>
          <p className="text-stone-500 text-xs font-serif leading-relaxed">
            Drawing inspiration from <strong className="text-amber-900 font-bold">Gurukul Kangri Haridwar</strong>, we conduct specialized professional workshops for educators, school institutions, and student focus zones to merge classical holistic ethics with modern scientific child psychology.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#faf8f4] p-1 rounded-lg border border-amber-900/10 self-start md:self-auto shrink-0">
          <button
            onClick={() => {
              setActiveTab('core');
              setExpandedTopic(1);
            }}
            className={`px-3.5 py-1.5 rounded-md text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'core'
                ? 'bg-amber-900 text-amber-50 shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            CORE TRAINING
          </button>
          <button
            onClick={() => {
              setActiveTab('specialized');
              setExpandedTopic(9);
            }}
            className={`px-3.5 py-1.5 rounded-md text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'specialized'
                ? 'bg-amber-900 text-amber-50 shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            ELECTIVES &amp; OUTREACH
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive List & Callout panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Interactive accordions list */}
        <div className="lg:col-span-8 space-y-2.5">
          {currentTopics.map((item) => {
            const IconComponent = item.icon || BookOpen;
            const isExpanded = expandedTopic === item.id;
            
            return (
              <div 
                key={item.id}
                className={`overflow-hidden rounded-lg border transition-all duration-300 ${
                  isExpanded 
                    ? 'border-amber-900/25 bg-[#faf8f4]/60' 
                    : 'border-stone-200 bg-white hover:border-amber-900/15'
                }`}
              >
                {/* Accordion Trigger Header */}
                <button
                  type="button"
                  onClick={() => handleTopicClick(item.id)}
                  className="w-full px-4 py-3.5 flex items-center justify-between text-left cursor-pointer select-none gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className={`p-2 rounded-lg transition-colors shrink-0 ${
                        isExpanded ? 'bg-amber-900 text-white' : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h4 className="font-serif font-black text-[13px] md:text-sm text-stone-900 uppercase tracking-tight">
                          {item.title}
                        </h4>
                        <span className="text-[8px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded-full uppercase bg-stone-150 bg-stone-100 text-stone-500 border border-stone-200">
                          {item.badge}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <ChevronDown 
                    className={`w-4 h-4 text-stone-500 transition-transform duration-300 shrink-0 ${
                      isExpanded ? 'rotate-180 text-amber-900' : ''
                    }`} 
                  />
                </button>

                {/* Accordion Content Panel */}
                <div 
                  className={`transition-all duration-300 ease-in-out ${
                    isExpanded ? 'max-h-[300px] opacity-100 border-t border-stone-100' : 'max-h-0 opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="p-4 bg-white/70">
                    <p className="text-xs md:text-[13px] text-stone-600 font-serif leading-relaxed pr-2">
                      {item.details}
                    </p>
                    
                    {/* Schedule Badge details inside description */}
                    <div className="mt-3 flex items-center gap-2 pt-2 border-t border-dashed border-stone-200 text-[10px] text-amber-800 font-mono font-bold">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping" />
                      AVAILABLE FOR INSTITUTIONAL BOOKINGS &amp; CERTIFICATION
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Dynamic Callout Panel */}
        <div className="lg:col-span-4 bg-gradient-to-b from-[#faf8f4] to-white p-5 rounded-xl border border-amber-900/15 text-stone-700 space-y-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-950 font-sans font-black px-2.5 py-0.5 rounded-full text-[8px] uppercase tracking-wider border border-amber-300/30">
              ✦ Pedagogy Seminar Features ✦
            </span>
            <h4 className="font-serif font-black text-amber-950 text-sm uppercase leading-tight">
              Bring Pedagogy Excellence to Your Institution
            </h4>
            <p className="text-[11.5px] leading-relaxed text-stone-600 font-serif">
              Our chief expert, trained under the legacy of Gurukul Kangri Haridwar, compiles these syllabi to raise teaching standards and address growing youth stress and emotional challenges.
            </p>
          </div>

          <div className="space-y-3 pt-2 text-[11px] font-mono font-bold text-stone-600 border-t border-amber-900/5">
            <div className="flex items-center gap-2">
              <span className="text-amber-800 text-sm">✓</span>
              <span>Fully Aligned with NEP 2020 Domains</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-800 text-sm">✓</span>
              <span>Classroom Actionable Frameworks</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-800 text-sm">✓</span>
              <span>Stress, Anxiety &amp; Focus Therapies</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-800 text-sm">✓</span>
              <span>Interactive Storytelling Guides</span>
            </div>
          </div>

          <div className="bg-[#4a3525]/5 rounded-lg p-3.5 border border-[#4a3525]/10 space-y-2.5">
            <div>
              <span className="text-[9px] font-mono text-stone-400 uppercase font-black block">
                DIRECT INQURY &amp; COORDINATION
              </span>
              <span className="text-xs font-serif font-bold text-amber-950 block">
                Educational Consultation Helpline
              </span>
            </div>
            <p className="text-[10px] leading-relaxed font-serif text-stone-600">
              For reserving dates for teacher workshops, seminars, or obtaining printed syllabi:
            </p>
            <div className="p-2 bg-white rounded border border-amber-900/10 text-center font-mono font-black text-xs text-amber-900 hover:scale-102 transition-all">
              📞 9258240603
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
