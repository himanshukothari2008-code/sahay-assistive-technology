import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  ChevronRight,
  ChevronLeft,
  Award,
  HelpCircle,
  CheckCircle2,
  BookOpen,
  Hand,
  Search,
  Sliders,
  Info
} from 'lucide-react';
import Button from '../common/Button';

// Comprehensive ISL Vocabulary Aligned with ISLRTC (New Delhi) Standards
export const ISL_SIGNS = [
  {
    id: 'namaste',
    english: 'Namaste (Greetings)',
    hindi: 'नमस्ते (अभिवादन)',
    telugu: 'నమస్కారం (శుభాకాంక్షలు)',
    category: 'basics',
    handshape: 'Two flat open hands, palms together with fingers pointing up.',
    movement: 'Bring palms together at chest level in front of the sternum, followed by a slight respectful bow of the head.',
    facial: 'Gentle, respectful smile with direct eye contact.',
    iconType: 'hands_together'
  },
  {
    id: 'thank_you',
    english: 'Thank You',
    hindi: 'धन्यवाद / शुक्रिया',
    telugu: 'ధన్యవాదాలు',
    category: 'basics',
    handshape: 'Dominant hand flat with fingers together, palm facing inward.',
    movement: 'Touch fingertips lightly to your chin, then move the hand forward and slightly downward toward the other person.',
    facial: 'Warm smile showing genuine gratitude.',
    iconType: 'chin_forward'
  },
  {
    id: 'please',
    english: 'Please',
    hindi: 'कृपया',
    telugu: 'దయచేసి',
    category: 'basics',
    handshape: 'Dominant hand flat open with palm facing chest.',
    movement: 'Place palm flat against the center of your chest and rub in a gentle clockwise circle 2-3 times.',
    facial: 'Soft, polite, requesting expression.',
    iconType: 'chest_rub'
  },
  {
    id: 'help',
    english: 'Help / Support',
    hindi: 'मदद / सहायता',
    telugu: 'సహాయం',
    category: 'emergency',
    handshape: 'Non-dominant hand flat facing upward; dominant hand forms a fist with thumb pointing upright ("thumbs-up").',
    movement: 'Place the dominant fist on the open flat palm, and lift both hands upward together, symbolizing lifting someone up.',
    facial: 'Earnest or urgent expression depending on context.',
    iconType: 'lift_fist'
  },
  {
    id: 'water',
    english: 'Water',
    hindi: 'पानी',
    telugu: 'నీరు',
    category: 'needs',
    handshape: 'Dominant hand forms a "W" shape (index, middle, and ring fingers extended, pinky and thumb touching) or curved cup.',
    movement: 'Tap the index finger of the "W" hand against the chin or lower lip twice.',
    facial: 'Neutral or thirsty questioning expression.',
    iconType: 'water_tap'
  },
  {
    id: 'food',
    english: 'Food / Eat',
    hindi: 'भोजन / खाना',
    telugu: 'ఆహారం / తిను',
    category: 'needs',
    handshape: 'Dominant hand forms a flattened "O" or bunched fingertips pointing inward.',
    movement: 'Bring bunched fingertips toward your mouth 2-3 times as if placing morsels of food into mouth.',
    facial: 'Neutral expression, lips slightly relaxed.',
    iconType: 'eat_mouth'
  },
  {
    id: 'yes',
    english: 'Yes',
    hindi: 'हाँ / सहमत',
    telugu: 'అవును',
    category: 'basics',
    handshape: 'Dominant hand forms a closed fist with knuckles facing forward.',
    movement: 'Tilt the fist up and down from the wrist twice, mimicking the physical nodding of a head.',
    facial: 'Affirmative nod and pleasant expression.',
    iconType: 'fist_nod'
  },
  {
    id: 'no',
    english: 'No',
    hindi: 'नहीं / असहमत',
    telugu: 'కాదు',
    category: 'basics',
    handshape: 'Dominant hand with index finger extended upright or index and middle finger closing against thumb.',
    movement: 'Wag the upright index finger side to side twice, or quickly snap index and middle finger down onto the thumb.',
    facial: 'Slight head shake side to side, firm expression.',
    iconType: 'index_shake'
  },
  {
    id: 'friend',
    english: 'Friend / Friendship',
    hindi: 'दोस्त / मित्र',
    telugu: 'స్నేహితుడు',
    category: 'social',
    handshape: 'Both hands form hook shapes with index fingers curved like links of a chain.',
    movement: 'Hook the right index finger over the left, release, then reverse and hook the left index finger over the right.',
    facial: 'Warm, affectionate smile.',
    iconType: 'hook_clasped'
  },
  {
    id: 'doctor',
    english: 'Doctor / Medical',
    hindi: 'डॉक्टर / चिकित्सक',
    telugu: 'వైద్యుడు / డాక్టర్',
    category: 'emergency',
    handshape: 'Dominant hand extends index and middle finger ("bent V"); non-dominant hand extends arm with palm up.',
    movement: 'Tap the dominant fingertips onto the radial artery / pulse point of the non-dominant wrist twice.',
    facial: 'Serious or clinical inquisitive expression.',
    iconType: 'pulse_tap'
  },
  {
    id: 'emergency',
    english: 'Emergency / Urgent',
    hindi: 'आपातकाल / तुरंत',
    telugu: 'అత్యవసరం',
    category: 'emergency',
    handshape: 'Both hands open with fingers spread or forming "E" shape.',
    movement: 'Wave both hands rapidly side-to-side or cross wrists in front of chest moving outward swiftly.',
    facial: 'Alert, wide eyes, serious expression denoting urgency.',
    iconType: 'emergency_wave'
  },
  {
    id: 'school',
    english: 'School / Study',
    hindi: 'विद्यालय / पढ़ाई',
    telugu: 'పాఠశాల / చదువు',
    category: 'social',
    handshape: 'Both hands flat open, palms facing each other.',
    movement: 'Clap the flat dominant palm down onto the non-dominant palm twice in a horizontal motion.',
    facial: 'Curious, focused expression.',
    iconType: 'clap_book'
  }
];

// ISL Standard Manual Alphabet (A-Z) Fingerspelling Map
export const ISL_ALPHABET = {
  A: { letter: 'A', desc: 'Left palm flat facing chest; right index finger touches the tip of the left thumb.', twoHanded: true, hint: 'Touch left thumb tip' },
  B: { letter: 'B', desc: 'Both hands form "O" rings with thumb and index fingers, touching at fingertips to form the two loops of "B".', twoHanded: true, hint: 'Two circles touching' },
  C: { letter: 'C', desc: 'Dominant hand curved in a half-circle "C" shape facing outward.', twoHanded: false, hint: 'Curved C shape' },
  D: { letter: 'D', desc: 'Left index finger upright; right thumb and index form a semicircle against the left index.', twoHanded: true, hint: 'Left index straight, right curve' },
  E: { letter: 'E', desc: 'Left palm open; right index finger touches the tip of the left index finger.', twoHanded: true, hint: 'Touch left index tip' },
  F: { letter: 'F', desc: 'Left index and middle fingers extended; right index and middle lay across them in a hash grid.', twoHanded: true, hint: 'Crossing two fingers' },
  G: { letter: 'G', desc: 'Both hands clenched in fists, placed one on top of the other.', twoHanded: true, hint: 'Fist on fist' },
  H: { letter: 'H', desc: 'Left flat hand facing forward; right flat palm sweeps across the left palm from wrist to fingertips.', twoHanded: true, hint: 'Right palm wipes left palm' },
  I: { letter: 'I', desc: 'Left palm open; right index finger touches the tip of the left middle finger.', twoHanded: true, hint: 'Touch left middle finger' },
  J: { letter: 'J', desc: 'Right index touches left middle finger tip, then traces a curved "J" hook down to the palm.', twoHanded: true, hint: 'Trace J hook down palm' },
  K: { letter: 'K', desc: 'Left index upright; right index finger forms a bent angle touching the left index middle.', twoHanded: true, hint: 'Bent finger on left index' },
  L: { letter: 'L', desc: 'Dominant hand forms an "L" with thumb and index finger extended at 90 degrees.', twoHanded: false, hint: 'Thumb & index 90 degrees' },
  M: { letter: 'M', desc: 'Right index, middle, and ring fingers laid flat across the left open palm.', twoHanded: true, hint: 'Three fingers on left palm' },
  N: { letter: 'N', desc: 'Right index and middle fingers laid flat across the left open palm.', twoHanded: true, hint: 'Two fingers on left palm' },
  O: { letter: 'O', desc: 'Left palm open; right index finger touches the tip of the left ring finger.', twoHanded: true, hint: 'Touch left ring finger tip' },
  P: { letter: 'P', desc: 'Left index finger upright; right thumb and index form a small circle touching the top of the left index.', twoHanded: true, hint: 'Circle at top of index' },
  Q: { letter: 'Q', desc: 'Left thumb and index form a circle; right index finger hooks into the circle.', twoHanded: true, hint: 'Circle with hook' },
  R: { letter: 'R', desc: 'Right index finger curved like a hook laid on the left flat palm.', twoHanded: true, hint: 'Curved hook on palm' },
  S: { letter: 'S', desc: 'Both little fingers hooked together in a clasp.', twoHanded: true, hint: 'Hook pinky fingers' },
  T: { letter: 'T', desc: 'Left flat palm; right index finger touches the side / edge of the left hand near thumb base.', twoHanded: true, hint: 'Touch side of hand' },
  U: { letter: 'U', desc: 'Left palm open; right index finger touches the tip of the left little finger (pinky).', twoHanded: true, hint: 'Touch left pinky tip' },
  V: { letter: 'V', desc: 'Right hand forms a "V" (peace sign) with index and middle fingers laid on left palm.', twoHanded: true, hint: 'V shape on left palm' },
  W: { letter: 'W', desc: 'Both hands interlock fingers with straight wrists, palms facing chest.', twoHanded: true, hint: 'Interlocked fingers' },
  X: { letter: 'X', desc: 'Both index fingers crossed at the middle joints in an "X" shape.', twoHanded: true, hint: 'Cross index fingers' },
  Y: { letter: 'Y', desc: 'Left hand flat; right thumb and index form a "V" across the left index finger.', twoHanded: true, hint: 'Y shape on left index' },
  Z: { letter: 'Z', desc: 'Left flat palm vertical; right hand bent at right angles resting on left palm.', twoHanded: true, hint: 'Bent hand against palm' }
};

// Hand SVG Illustration Renderer based on iconType
function HandSignVisual({ type, className = 'w-36 h-36' }) {
  return (
    <div className={`flex items-center justify-center p-4 rounded-3xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 border-2 border-indigo-200 dark:border-indigo-800 shadow-inner ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full text-indigo-600 dark:text-indigo-400">
        {/* Dynamic hand shape graphics */}
        {type === 'hands_together' && (
          <g stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Left and Right Palms joined (Namaste) */}
            <path d="M 45 80 L 45 40 C 45 35 48 30 50 25 C 52 30 55 35 55 40 L 55 80 Z" fill="currentColor" fillOpacity="0.2" />
            <path d="M 38 75 L 43 45 C 44 40 47 32 50 22 C 53 32 56 40 57 45 L 62 75" />
            <path d="M 32 70 L 40 50" />
            <path d="M 68 70 L 60 50" />
            {/* Respectful Rays */}
            <line x1="50" y1="12" x2="50" y2="18" strokeDasharray="1,1" />
            <line x1="38" y1="16" x2="42" y2="20" strokeDasharray="1,1" />
            <line x1="62" y1="16" x2="58" y2="20" strokeDasharray="1,1" />
          </g>
        )}

        {type === 'chin_forward' && (
          <g stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Face outline profile */}
            <path d="M 25 30 Q 35 30 40 40 L 42 55 Q 35 60 25 60" strokeDasharray="2,2" strokeOpacity="0.5" />
            {/* Hand at chin moving outward */}
            <rect x="42" y="48" width="16" height="22" rx="4" fill="currentColor" fillOpacity="0.2" />
            <path d="M 58 52 L 78 52" markerEnd="url(#arrow)" />
            <path d="M 72 46 L 78 52 L 72 58" />
            <path d="M 45 70 L 52 82" />
          </g>
        )}

        {type === 'chest_rub' && (
          <g stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Torso */}
            <path d="M 20 85 L 25 35 Q 50 25 75 35 L 80 85" strokeOpacity="0.4" />
            {/* Hand flat on chest */}
            <circle cx="50" cy="55" r="14" fill="currentColor" fillOpacity="0.15" />
            {/* Circular movement arrow */}
            <path d="M 50 38 A 17 17 0 1 1 35 55" strokeWidth="2" strokeDasharray="3,2" />
            <path d="M 38 48 L 35 55 L 43 57" fill="currentColor" />
          </g>
        )}

        {type === 'lift_fist' && (
          <g stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Lower flat hand palm up */}
            <path d="M 20 75 Q 50 78 78 72 L 78 78 Q 50 84 20 80 Z" fill="currentColor" fillOpacity="0.3" />
            {/* Upper fist with thumb up */}
            <rect x="38" y="45" width="24" height="22" rx="6" fill="currentColor" fillOpacity="0.2" />
            <path d="M 42 45 L 42 30 Q 45 25 48 30 L 48 45" />
            {/* Lifting upward arrows */}
            <path d="M 75 55 L 75 32" strokeWidth="2" />
            <path d="M 70 38 L 75 32 L 80 38" />
          </g>
        )}

        {type === 'water_tap' && (
          <g stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Lips / Mouth outline */}
            <path d="M 30 35 Q 45 42 60 35" strokeOpacity="0.4" />
            {/* W Handshape near mouth */}
            <path d="M 45 75 L 45 48" />
            <path d="M 52 75 L 52 44" />
            <path d="M 59 75 L 59 48" />
            <path d="M 40 75 Q 35 68 40 60 L 45 60" />
            {/* Tap indicator drops */}
            <circle cx="52" cy="32" r="3" fill="currentColor" />
            <path d="M 52 24 L 52 28" />
          </g>
        )}

        {type === 'pulse_tap' && (
          <g stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Wrist */}
            <path d="M 15 65 L 85 65 L 85 78 L 15 78 Z" fill="currentColor" fillOpacity="0.2" />
            {/* Two fingers tapping pulse */}
            <path d="M 46 25 L 46 60" />
            <path d="M 54 25 L 54 60" />
            <circle cx="50" cy="65" r="4" fill="currentColor" />
            {/* Pulse heartbeat waves */}
            <path d="M 68 45 L 72 40 L 76 50 L 80 45" strokeWidth="2" />
          </g>
        )}

        {/* Fallback default hand graphic */}
        {!['hands_together', 'chin_forward', 'chest_rub', 'lift_fist', 'water_tap', 'pulse_tap'].includes(type) && (
          <g stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="35" y="48" width="30" height="32" rx="6" fill="currentColor" fillOpacity="0.2" />
            <path d="M 40 48 L 40 28" />
            <path d="M 48 48 L 48 22" />
            <path d="M 56 48 L 56 25" />
            <path d="M 64 48 L 64 32" />
            <path d="M 35 56 Q 25 50 32 42 L 35 46" />
          </g>
        )}
      </svg>
    </div>
  );
}

export function ISLSimulator() {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'en').split('-')[0];

  const [activeTab, setActiveTab] = useState('dictionary'); // 'dictionary' | 'fingerspell' | 'animator' | 'quiz' | 'grammar'
  
  // Tab 1: Dictionary filter
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSign, setSelectedSign] = useState(ISL_SIGNS[0]);

  // Tab 2 & 3: Fingerspelling Animator
  const [spellInput, setSpellInput] = useState('SAHAY');
  const [spellIndex, setSpellIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1000); // 1000ms per letter

  // Tab 4: Quiz Challenge
  const [quizSign, setQuizSign] = useState(ISL_SIGNS[0]);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [quizStreak, setQuizStreak] = useState(0);

  // Filtered dictionary signs
  const filteredSigns = ISL_SIGNS.filter((s) => {
    const matchesCat = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesQuery = s.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.hindi.includes(searchQuery) ||
      s.telugu.includes(searchQuery);
    return matchesCat && matchesQuery;
  });

  // Automated Fingerspeller loop
  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setSpellIndex((prev) => {
          const cleanText = spellInput.toUpperCase().replace(/[^A-Z]/g, '');
          if (cleanText.length === 0) return 0;
          if (prev >= cleanText.length - 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, playSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, playSpeed, spellInput]);

  // Speak synthesized voice description
  const speakText = (text) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLang === 'te' ? 'te-IN' : (currentLang === 'hi' ? 'hi-IN' : 'en-US');
    window.speechSynthesis.speak(utterance);
  };

  // Next Quiz question
  const initNextQuiz = () => {
    const random = ISL_SIGNS[Math.floor(Math.random() * ISL_SIGNS.length)];
    setQuizSign(random);
    setQuizFeedback(null);
  };

  const handleQuizAnswer = (chosenId) => {
    if (chosenId === quizSign.id) {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
      setQuizFeedback({
        correct: true,
        text: `Correct! In Indian Sign Language, this is "${quizSign.english}".`
      });
      setQuizScore((prev) => prev + 1);
      setQuizStreak((prev) => prev + 1);
      setTimeout(initNextQuiz, 1400);
    } else {
      setQuizFeedback({
        correct: false,
        text: `Not quite. This sign is "${quizSign.english}" (${quizSign.movement}).`
      });
      setQuizStreak(0);
    }
  };

  const currentSpelledLetter = spellInput.toUpperCase().replace(/[^A-Z]/g, '')[spellIndex] || 'A';
  const currentLetterData = ISL_ALPHABET[currentSpelledLetter] || ISL_ALPHABET.A;

  return (
    <div className="space-y-8">
      {/* Simulation Header */}
      <div className="p-6 sm:p-8 rounded-3xl border-2 border-slate-200 dark:border-slate-700 bg-[var(--bg-surface)] shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 mb-2">
              <Sparkles className="w-4 h-4" />
              <span>{t('isl_sim.badge', 'Visual-Spatial Linguistic Simulator')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {t('isl_sim.title', 'Indian Sign Language (ISL) Interactive Lab')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {t('isl_sim.subtitle', 'Explore authentic Indian Sign Language gestures standardized by ISLRTC (New Delhi). Learn conversational signs, fingerspell your name, and master visual non-manual expressions.')}
            </p>
          </div>

          <div className="shrink-0">
            <Button
              variant="outline"
              size="sm"
              icon={Volume2}
              onClick={() => speakText(selectedSign.english + '. ' + selectedSign.movement)}
            >
              {t('isl_sim.listen_action', 'Read Aloud')}
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8" role="tablist">
          {[
            { id: 'dictionary', label: t('isl_sim.tab_dict', '1. Essential ISL Signs'), icon: BookOpen },
            { id: 'fingerspell', label: t('isl_sim.tab_abc', '2. ISL Alphabet (A-Z)'), icon: Hand },
            { id: 'animator', label: t('isl_sim.tab_animator', '3. Fingerspelling Animator'), icon: Play },
            { id: 'quiz', label: t('isl_sim.tab_quiz', '4. Sign Recognition Game'), icon: Award },
            { id: 'grammar', label: t('isl_sim.tab_grammar', '5. Deaf Culture & Grammar'), icon: Info }
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all touch-target focus-visible:outline-none ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: ESSENTIAL ISL SIGNS DICTIONARY */}
        {activeTab === 'dictionary' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'all', label: t('isl_sim.cat_all', 'All Signs') },
                  { id: 'basics', label: t('isl_sim.cat_basics', 'Greetings') },
                  { id: 'needs', label: t('isl_sim.cat_needs', 'Daily Needs') },
                  { id: 'emergency', label: t('isl_sim.cat_emergency', 'Emergency') },
                  { id: 'social', label: t('isl_sim.cat_social', 'Social') }
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCategory(c.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all touch-target ${
                      selectedCategory === c.id
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('isl_sim.search_placeholder', 'Filter signs...')}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                />
              </div>
            </div>

            {/* Split View: Left List, Right Sign Detail */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Sign List Chips */}
              <div className="lg:col-span-5 space-y-2 max-h-[480px] overflow-y-auto pr-2">
                {filteredSigns.map((sign) => {
                  const isSelected = selectedSign.id === sign.id;
                  return (
                    <button
                      key={sign.id}
                      type="button"
                      onClick={() => {
                        setSelectedSign(sign);
                        speakText(sign.english);
                      }}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between touch-target ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 shadow-md ring-1 ring-blue-300'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-400'
                      }`}
                    >
                      <div>
                        <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                          {currentLang === 'hi' ? sign.hindi : currentLang === 'te' ? sign.telugu : sign.english}
                        </h4>
                        <span className="text-xs text-slate-500 block mt-0.5">
                          {currentLang === 'en' ? sign.hindi : sign.english}
                        </span>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Active Sign Interactive Detail Card */}
              <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                    <HandSignVisual type={selectedSign.iconType} className="w-32 h-32 shrink-0" />
                    <div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 inline-block mb-2">
                        ISLRTC Standard Sign
                      </span>
                      <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                        {currentLang === 'hi' ? selectedSign.hindi : currentLang === 'te' ? selectedSign.telugu : selectedSign.english}
                      </h3>
                      <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                        <span>Hindi: <strong>{selectedSign.hindi}</strong></span>
                        <span>•</span>
                        <span>Telugu: <strong>{selectedSign.telugu}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs sm:text-sm">
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-blue-600 dark:text-blue-400 block mb-1">
                        {t('isl_sim.handshape_label', '1. Handshape & Orientation:')}
                      </span>
                      <p className="text-slate-700 dark:text-slate-300">{selectedSign.handshape}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-blue-600 dark:text-blue-400 block mb-1">
                        {t('isl_sim.movement_label', '2. Dynamic Movement & Gesture:')}
                      </span>
                      <p className="text-slate-700 dark:text-slate-300">{selectedSign.movement}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-blue-600 dark:text-blue-400 block mb-1">
                        {t('isl_sim.facial_label', '3. Non-Manual Marker (Facial Expression):')}
                      </span>
                      <p className="text-slate-700 dark:text-slate-300">{selectedSign.facial}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Source: Indian Sign Language Research & Training Centre (ISLRTC)
                  </span>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Volume2}
                    onClick={() => speakText(`${selectedSign.english}. ${selectedSign.movement}`)}
                  >
                    {t('isl_sim.pronounce_action', 'Pronounce Description')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ISL MANUAL ALPHABET (A TO Z) */}
        {activeTab === 'fingerspell' && (
          <div className="space-y-6">
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {t('isl_sim.abc_intro', 'Indian Sign Language uses a standardized two-handed manual alphabet (with select one-handed forms) for spelling proper nouns, technical terms, and names.')}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {Object.entries(ISL_ALPHABET).map(([letter, data]) => (
                <div
                  key={letter}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex flex-col justify-between hover:border-blue-500 transition-colors shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                      {letter}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500">
                      {data.twoHanded ? '2 Hands' : '1 Hand'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug mb-3">
                    {data.hint}
                  </p>

                  <button
                    type="button"
                    onClick={() => speakText(`Letter ${letter}: ${data.desc}`)}
                    className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-auto"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Explain</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: INTERACTIVE FINGERSPELLING ANIMATOR */}
        {activeTab === 'animator' && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border-2 border-blue-200 dark:border-blue-800 shadow-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-2">
                {t('isl_sim.animator_badge', 'Live Word-to-Sign Animator')}
              </span>
              <h3 className="text-xl font-bold mb-4">
                {t('isl_sim.animator_title', 'Type Any Word to Watch It Fingerspelled in ISL:')}
              </h3>

              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={spellInput}
                  maxLength={16}
                  onChange={(e) => {
                    setSpellInput(e.target.value.replace(/[^a-zA-Z]/g, ''));
                    setSpellIndex(0);
                    setIsPlaying(false);
                  }}
                  placeholder="e.g. SAHAY, INDIA, ISL"
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-extrabold text-lg uppercase tracking-wider focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400"
                />
              </div>

              {/* Visual Active Letter Card */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-950 border-2 border-blue-300 dark:border-blue-700 text-center mb-6">
                <span className="text-7xl font-black text-blue-600 dark:text-blue-400 block mb-2">
                  {currentSpelledLetter}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 inline-block mb-3">
                  Letter {spellIndex + 1} of {spellInput.length || 1}
                </span>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 max-w-md mx-auto leading-relaxed">
                  {currentLetterData.desc}
                </p>
              </div>

              {/* Word Letters Step Navigator */}
              <div className="flex items-center justify-center gap-2 mb-6">
                {spellInput.toUpperCase().split('').map((char, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setSpellIndex(i);
                      setIsPlaying(false);
                      speakText(`Letter ${char}`);
                    }}
                    className={`w-9 h-9 rounded-xl font-extrabold text-sm transition-all touch-target ${
                      spellIndex === i
                        ? 'bg-blue-600 text-white shadow-md scale-110'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {char}
                  </button>
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  icon={ChevronLeft}
                  disabled={spellIndex === 0}
                  onClick={() => setSpellIndex((prev) => Math.max(0, prev - 1))}
                >
                  Prev
                </Button>

                <Button
                  variant="primary"
                  size="md"
                  icon={isPlaying ? Pause : Play}
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? 'Pause' : 'Play Sequence'}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  icon={ChevronRight}
                  disabled={spellIndex >= spellInput.length - 1}
                  onClick={() => setSpellIndex((prev) => Math.min(spellInput.length - 1, prev + 1))}
                >
                  Next
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  icon={RotateCcw}
                  onClick={() => {
                    setSpellIndex(0);
                    setIsPlaying(false);
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ISL RECOGNITION CHALLENGE QUIZ */}
        {activeTab === 'quiz' && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border-2 border-blue-200 dark:border-blue-800 text-center shadow-lg">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t('isl_sim.quiz_badge', 'ISL Gesture Recognition Game')}
                </span>
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                    Score: {quizScore}
                  </div>
                  <div className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                    🔥 {quizStreak} Streak
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-bold mb-4">
                {t('isl_sim.quiz_prompt', 'Which meaning corresponds to this ISL hand sign?')}
              </h3>

              <div className="flex justify-center mb-6">
                <HandSignVisual type={quizSign.iconType} className="w-36 h-36" />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 mb-6">
                <strong>Clue (Movement): </strong>
                <span>{quizSign.movement}</span>
              </div>

              {/* 4 Choices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {(() => {
                  const others = ISL_SIGNS.filter((s) => s.id !== quizSign.id)
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 3);
                  const choices = [quizSign, ...others].sort(() => 0.5 - Math.random());

                  return choices.map((choice) => (
                    <button
                      key={choice.id}
                      type="button"
                      onClick={() => handleQuizAnswer(choice.id)}
                      className="p-4 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:border-blue-600 dark:hover:border-blue-400 font-bold text-sm sm:text-base transition-all touch-target focus-visible:outline-none"
                    >
                      {currentLang === 'hi' ? choice.hindi : currentLang === 'te' ? choice.telugu : choice.english}
                    </button>
                  ));
                })()}
              </div>

              {quizFeedback && (
                <div
                  className={`p-4 rounded-xl text-sm font-bold mb-4 flex items-center justify-center gap-2 ${
                    quizFeedback.correct
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-rose-100 text-rose-900 border border-rose-300'
                  }`}
                >
                  {quizFeedback.correct ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <HelpCircle className="w-5 h-5 text-rose-600" />}
                  <span>{quizFeedback.text}</span>
                </div>
              )}

              <Button variant="outline" size="sm" onClick={initNextQuiz}>
                Skip to Next Sign
              </Button>
            </div>
          </div>
        )}

        {/* TAB 5: DEAF CULTURE & GRAMMAR */}
        {activeTab === 'grammar' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-2">
                  Linguistic Structure
                </span>
                <h3 className="text-xl font-bold mb-2">ISL is a Full, Natural Language</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  Indian Sign Language is not a visual code for English or Hindi; it is an independent natural visual-spatial language with its own grammar, spatial syntax, and vocabulary. In ISL, sentence structure frequently follows <strong>Topic-Comment</strong> or <strong>Time-Subject-Object-Verb</strong> order.
                </p>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs text-slate-500">
                  Example: Instead of "I am going to school tomorrow", ISL structure signs: <em>TOMORROW SCHOOL I GO</em> with forward eye gaze.
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-2">
                  Non-Manual Markers (NMM)
                </span>
                <h3 className="text-xl font-bold mb-2">The Face is the Grammar</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  In sign language, hands produce words, but the face produces grammar. Raising your eyebrows turns a statement into a Yes/No question; furrowing eyebrows indicates Wh-questions (Who, Where, Why); and head nods indicate affirmation or conditional logic.
                </p>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs text-slate-500">
                  Standardized by the Indian Sign Language Research and Training Centre (ISLRTC), New Delhi under the RPwD Act 2016.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ISLSimulator;
