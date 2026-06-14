export interface Ingredient {
  name: string;
  proportion: string;
  benefit: string;
}

export interface Product {
  id: string;
  name: string;
  sanskritName: string;
  category: 'Asava-Arishta' | 'Vati-Gutika' | 'Churna' | 'Rasayana-Lehya' | 'Taila-Ghrita' | 'Bhasma';
  price: number;
  description: string;
  indications: string[];
  ingredients: Ingredient[];
  dosage: string;
  administration: string;
  sizeOptions: string[];
  stock: number;
  colorTheme: 'amber' | 'emerald' | 'crimson' | 'gold' | 'brown' | 'indigo';
  iconType: 'leaf' | 'pill' | 'flask' | 'droplet' | 'pouch' | 'gem';
  featured?: boolean;
}

export const CATEGORIES = [
  { id: 'all', name: 'All Products', count: 10 },
  { id: 'Rasayana-Lehya', name: 'Lehya & Rasayana', desc: 'Rejuvenating herbal jams and pastes' },
  { id: 'Vati-Gutika', name: 'Vati & Gutika', desc: 'Traditional compressed herbal tablets & pills' },
  { id: 'Churna', name: 'Churnas (Powders)', desc: 'Finely milled single and multi-herb formulations' },
  { id: 'Asava-Arishta', name: 'Asava & Arishta', desc: 'Naturally fermented liquid tonics' },
  { id: 'Taila-Ghrita', name: 'Oils & Medicated Ghee', desc: 'External & internal therapeutic lipid agents' },
  { id: 'Bhasma', name: 'Bhasma & Pishti', desc: 'Calcined mineral, metallic, and gem essences' }
];

export const INDICATIONS = [
  'Immunity Booster',
  'Digestive Health',
  'Urinary Care',
  'Nerve & Brain Tonic',
  'Joint & Muscle Pain',
  'Detoxification',
  'Stress Relief',
  'Liver Support',
  'Respiratory Support',
  'Physical Strength'
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Mangalam Chyawanprash Special',
    sanskritName: 'च्यवनप्राश विशेष',
    category: 'Rasayana-Lehya',
    price: 380,
    description: 'A classic immune-boosting elixir prepared using the fresh wild Amla, pure cow ghee, wild honey, and forty-two potent herbs. Rich in Vitamin C, it strengthens respiratory defenses and repairs cellular vitality.',
    indications: ['Immunity Booster', 'Respiratory Support', 'Physical Strength'],
    ingredients: [
      { name: 'Amalaki (Amla)', proportion: '60%', benefit: 'Potent vitamin C source, cellular antioxidant' },
      { name: 'Ashwagandha', proportion: '5%', benefit: 'Relieves stress, enhances physical endurance' },
      { name: 'Shatavari', proportion: '5%', benefit: 'Nourishes deep tissues, supports vitality' },
      { name: 'Pipali (Long Pepper)', proportion: '3%', benefit: 'Clears respitratory path, boosts bioavailability' },
      { name: 'Goghrita (Cow Ghee)', proportion: '12%', benefit: 'Bio-carrier for lipophilic herbs' },
      { name: 'Madhu (Honey)', proportion: '15%', benefit: 'Natural preservative and soothing vehicle' }
    ],
    dosage: '1 to 2 Teaspoonfuls (approx. 10g-20g)',
    administration: 'With warm water or warm milk, preferably on an empty stomach in the morning.',
    sizeOptions: ['500g', '1kg'],
    stock: 24,
    colorTheme: 'brown',
    iconType: 'leaf',
    featured: true
  },
  {
    id: 'p2',
    name: 'Chandraprabha Vati',
    sanskritName: 'चन्द्रप्रभा वटी',
    category: 'Vati-Gutika',
    price: 185,
    description: 'A stellar rejuvenative pill highly celebrated for supporting the urinary tract, kidneys, and reproductive system. It corrects metabolic errors, aids sugar levels, and cleanses the urinary micro-channels.',
    indications: ['Urinary Care', 'Detoxification', 'Physical Strength'],
    ingredients: [
      { name: 'Shuddha Shilajit', proportion: '25%', benefit: 'Draining mineral binder, kidney tonic' },
      { name: 'Shuddha Guggulu', proportion: '25%', benefit: 'Anti-inflammatory resin, clears blockage' },
      { name: 'Chandraprabha (Camphor)', proportion: '8%', benefit: 'Cooling analgesic, antiseptic diuretic' },
      { name: 'Haridra (Turmeric)', proportion: '10%', benefit: 'Fights local inflammation & infections' },
      { name: 'Lauh Bhasma', proportion: '12%', benefit: 'Bioavailable iron, counteracts general weakness' }
    ],
    dosage: '1 to 2 Tablets (250mg - 500mg)',
    administration: 'Twice daily with warm lukewarm milk, water, or Punarnavadi decoction, post meals.',
    sizeOptions: ['60 Tablets', '120 Tablets'],
    stock: 42,
    colorTheme: 'emerald',
    iconType: 'pill',
    featured: true
  },
  {
    id: 'p3',
    name: 'Premium Triphala Churna',
    sanskritName: 'त्रिफला चूर्ण',
    category: 'Churna',
    price: 120,
    description: 'The golden triad of Indian botany. This finely milled coarse powder is a gentle bowel regulatory formula that cleanses the digestive tract without forming habit-dependency, supports eye sight, and balances Tridosha (Vata, Pitta, Kapha).',
    indications: ['Digestive Health', 'Detoxification'],
    ingredients: [
      { name: 'Amalaki (Phyllanthus emblica)', proportion: '33.3%', benefit: 'Pitta pacification, high vitamin C' },
      { name: 'Bibhitaki (Terminalia bellirica)', proportion: '33.3%', benefit: 'Kapha pacification, purifies blood' },
      { name: 'Haritaki (Terminalia chebula)', proportion: '33.3%', benefit: 'Vata pacification, natural mild laxative' }
    ],
    dosage: '3g to 6g (Half to one teaspoon)',
    administration: 'At bed-time with warm water, or in early morning context as advised.',
    sizeOptions: ['100g', '250g'],
    stock: 50,
    colorTheme: 'gold',
    iconType: 'pouch',
    featured: true
  },
  {
    id: 'p4',
    name: 'Ashwagandharishta Premium',
    sanskritName: 'अश्वगन्धारिष्ट',
    category: 'Asava-Arishta',
    price: 240,
    description: 'A traditional fermented liquid decoction serving as a premier nerve-balancer and sleep supporter. Ideal for nervous breakdown, persistent fatigue, anxiety, and sleeplessness, as well as reviving lost concentration.',
    indications: ['Nerve & Brain Tonic', 'Stress Relief', 'Physical Strength'],
    ingredients: [
      { name: 'Ashwagandha Root', proportion: '40%', benefit: 'Adaptogen, improves nervous resilience' },
      { name: 'Mushli', proportion: '10%', benefit: 'Spermatogenic, cellular rejuvenator' },
      { name: 'Manjishtha', proportion: '8%', benefit: 'Calming lymphatic purifier' },
      { name: 'Madhuka (Yashtimadhu)', proportion: '8%', benefit: 'Soothes gastrointestinal lining and nerves' },
      { name: 'Dhataki Flower', proportion: '12%', benefit: 'Natural fermenting enzyme promoter' }
    ],
    dosage: '15ml to 30ml (1 to 2 tablespoons)',
    administration: 'Twice daily with an equal quantity of lukewarm water after meals.',
    sizeOptions: ['450ml'],
    stock: 18,
    colorTheme: 'amber',
    iconType: 'flask',
    featured: false
  },
  {
    id: 'p5',
    name: 'Kumaryasava Special',
    sanskritName: 'कुमार्यासव विशेष',
    category: 'Asava-Arishta',
    price: 260,
    description: 'Naturally fermented tonic prepared using pure fresh Aloe Vera juice, honey, and cardamoms. It provides potent support to liver pathways, clears gallbladder blockages, relieves bloating, and boosts female endocrine wellness.',
    indications: ['Liver Support', 'Digestive Health'],
    ingredients: [
      { name: 'Kumari (Aloe Vera)', proportion: '45%', benefit: 'Coolest agent for liver and bile regulation' },
      { name: 'Haritaki', proportion: '10%', benefit: 'Encourages proper peristalsis motion' },
      { name: 'Lauh Bhasma', proportion: '5%', benefit: 'Addresses iron deficiency and liver anemia' },
      { name: 'Jatiphala (Nutmeg)', proportion: '4%', benefit: 'Relieves spasm and intestinal gas' },
      { name: 'Dhataki Flowers', proportion: '10%', benefit: 'Enables natural continuous fermentation' }
    ],
    dosage: '15ml to 30ml (1 - 2 tablespoons)',
    administration: 'With equal amount of water, twice daily after lunch and dinner.',
    sizeOptions: ['450ml'],
    stock: 22,
    colorTheme: 'amber',
    iconType: 'flask',
    featured: false
  },
  {
    id: 'p6',
    name: 'Arogyavardhini Vati',
    sanskritName: 'आरोग्यवर्धिनी वटी',
    category: 'Vati-Gutika',
    price: 195,
    description: 'A classic herbomineral formulation whose name translates to "increaser of good health." It functions as an ultimate liver stimulant, digestive enabler, and systemic blood purifier—best suited for acne and hepatic congestion.',
    indications: ['Liver Support', 'Digestive Health', 'Detoxification'],
    ingredients: [
      { name: 'Shuddha Parada & Gandhaka', proportion: '20%', benefit: 'Catalytic Rasayana synergy base' },
      { name: 'Katuki (Picrorhiza kurroa)', proportion: '50%', benefit: 'Highly bitter cholagogue, wipes liver fat' },
      { name: 'Triphala & Shilajit', proportion: '20%', benefit: 'Reinforces gentle detox and assimilation' },
      { name: 'Shuddha Guggulu', proportion: '10%', benefit: 'Scavenges metabolic waste from cellular tissue' }
    ],
    dosage: '1 to 2 Tablets (approx. 250mg)',
    administration: 'In morning and evening hours with warm water or ginger-honey mixture after feeding.',
    sizeOptions: ['80 Tablets'],
    stock: 35,
    colorTheme: 'emerald',
    iconType: 'pill',
    featured: false
  },
  {
    id: 'p7',
    name: 'Premium Shodhita Lauh Bhasma',
    sanskritName: 'लौह भस्म',
    category: 'Bhasma',
    price: 320,
    description: 'Purified and calcined iron filings, subjected to 100 intense therapeutic Puta (firing cycles) with Triphala extract. Restores red blood count, treats splenomegaly, removes pale eyes and skin, and grants stamina.',
    indications: ['Physical Strength', 'Liver Support'],
    ingredients: [
      { name: 'Shodhita Lauha (Calcined Iron)', proportion: '100%', benefit: 'Extremely microscopic iron particles absorbable at the cellular level' }
    ],
    dosage: '125mg to 250mg (Under expert monitoring only)',
    administration: 'Always alongside wild honey, fresh ginger juice, or butter, strictly after food.',
    sizeOptions: ['10g'],
    stock: 3,
    colorTheme: 'crimson',
    iconType: 'gem',
    featured: false
  },
  {
    id: 'p8',
    name: 'Mahanarayan Taila',
    sanskritName: 'महानारायण तेल',
    category: 'Taila-Ghrita',
    price: 290,
    description: 'An elite medicated herbal oil containing extract of fifty divine roots in a deep-processed black sesame oil base. Reconditions rigid joints, soothens dry cartilage, alleviates pain from arthritis, and releases muscular spasm.',
    indications: ['Joint & Muscle Pain', 'Nerve & Brain Tonic'],
    ingredients: [
      { name: 'Tila Taila (Sesame Oil)', proportion: '100% base', benefit: 'Penetrates deep down into structural marrow' },
      { name: 'Shatavari Juice', proportion: '20% extract', benefit: 'Lubricates synovial joints, pacifies Vata' },
      { name: 'Dashamula (10 roots)', proportion: '25% decoction', benefit: 'Unbeatable natural anti-inflammatory complex' },
      { name: 'Karpura (Camphor) & Saffron', proportion: '2%', benefit: 'Improves micro-circulation and heating relief' }
    ],
    dosage: 'Apply 5ml - 10ml locally',
    administration: 'Warm the oil slightly and massage gently onto affected joint/back, followed by light fermentation.',
    sizeOptions: ['100ml', '200ml'],
    stock: 30,
    colorTheme: 'gold',
    iconType: 'droplet',
    featured: true
  },
  {
    id: 'p9',
    name: 'Cooling Avipattikar Churna',
    sanskritName: 'अविपत्तिकर चूर्ण',
    category: 'Churna',
    price: 140,
    description: 'An exquisite herbal formulation aimed specifically at fire-based (Pitta) gastric anomalies. Extremely active to halt burning esophagus, sour eructation, acid reflux, peptic ulcers, and burning sensation in hands and feet.',
    indications: ['Digestive Health', 'Stress Relief'],
    ingredients: [
      { name: 'Trivrit Root', proportion: '20%', benefit: 'Enables mild laxative escape to high thermal bile' },
      { name: 'Clove (Lavanga)', proportion: '10%', benefit: 'Stops gastric gas and works as anesthetic to mucosal tissue' },
      { name: 'Triphala Complex', proportion: '15%', benefit: 'Stabilizes regular digestion and nutrient balance' },
      { name: 'Sarkara (Purified sugar crystal)', proportion: '45%', benefit: 'Provides immediate cooling relief for internal heat' }
    ],
    dosage: '3g to 6g (Approx. 1 teaspoon)',
    administration: 'With cold water or fresh coconut water, just before lunch and dinner, or post-meal.',
    sizeOptions: ['100g', '250g'],
    stock: 40,
    colorTheme: 'indigo',
    iconType: 'pouch',
    featured: false
  },
  {
    id: 'p10',
    name: 'Brahmi Rasayana Special',
    sanskritName: 'ब्राह्मी रसायन',
    category: 'Rasayana-Lehya',
    price: 450,
    description: 'An divine intellect-rejuvenator (Medhya Rasayana) blended in pure cow ghee and forest sugar crystals. Clears gray fog from memory, boosts intelligence, balances fluctuating serotonin, and prevents fatigue in high-stress professionals.',
    indications: ['Nerve & Brain Tonic', 'Stress Relief', 'Physical Strength'],
    ingredients: [
      { name: 'Brahmi (Bacopa monnieri)', proportion: '40%', benefit: 'Improves synaptic reaction and cognitive retention' },
      { name: 'Shankhpushpi', proportion: '15%', benefit: 'Extinguishes high psychological anxiety' },
      { name: 'Vacha (Sweet Flag)', proportion: '5%', benefit: 'Enhances speech power and vocal cord resonance' },
      { name: 'Bilva & Dashamula', proportion: '15%', benefit: 'Pacifies active erratic Vata pulses near the head' }
    ],
    dosage: '5g to 10g (Half to One Tablespoon)',
    administration: 'In morning hours (ideally 5:00 AM) with fresh warm raw milk, or as directed.',
    sizeOptions: ['250g', '500g'],
    stock: 4,
    colorTheme: 'brown',
    iconType: 'leaf',
    featured: true
  }
];
