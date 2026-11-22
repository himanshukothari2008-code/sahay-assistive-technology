import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MessageSquare,
  Volume2,
  Trash2,
  Play,
  RotateCcw,
  Sparkles,
  Heart,
  Smile,
  AlertCircle,
  HelpCircle,
  Clock,
  Check
} from 'lucide-react';
import Button from '../common/Button';

export function SpeechAACSimulator() {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'en').split('-')[0];

  const [sentence, setSentence] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [dysfluencyMode, setDysfluencyMode] = useState('normal'); // 'normal', 'dysarthria', 'stutter', 'apraxia'
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastSpokenText, setLastSpokenText] = useState('');

  // AAC Vocabulary Grid
  const aacTiles = [
    // Greetings & Social
    { id: 'hello', cat: 'social', icon: '👋', en: 'Hello', hi: 'नमस्ते', te: 'హలో', phrase: { en: 'Hello, how are you?', hi: 'नमस्ते, आप कैसे हैं?', te: 'హలో, మీరు ఎలా ఉన్నారు?' } },
    { id: 'yes', cat: 'social', icon: '👍', en: 'Yes', hi: 'हाँ', te: 'అవును', phrase: { en: 'Yes', hi: 'हाँ', te: 'అవును' } },
    { id: 'no', cat: 'social', icon: '👎', en: 'No', hi: 'नहीं', te: 'కాదు', phrase: { en: 'No', hi: 'नहीं', te: 'కాదు' } },
    { id: 'thanks', cat: 'social', icon: '🙏', en: 'Thank you', hi: 'धन्यवाद', te: 'ధన్యవాదాలు', phrase: { en: 'Thank you very much', hi: 'बहुत बहुत धन्यवाद', te: 'చాలా ధన్యవాదాలు' } },
    { id: 'please', cat: 'social', icon: '🤝', en: 'Please', hi: 'कृपया', te: 'దయచేసి', phrase: { en: 'Please', hi: 'कृपया', te: 'దయచేసి' } },

    // Needs & Essentials
    { id: 'water', cat: 'needs', icon: '💧', en: 'Water', hi: 'पानी', te: 'నీరు', phrase: { en: 'I need water to drink', hi: 'मुझे पीने के लिए पानी चाहिए', te: 'నాకు తాగడానికి నీరు కావాలి' } },
    { id: 'food', cat: 'needs', icon: '🍲', en: 'Food', hi: 'खाना', te: 'ఆహారం', phrase: { en: 'I am hungry, I need food', hi: 'मुझे भूख लगी है, मुझे खाना चाहिए', te: 'నాకు ఆకలిగా ఉంది, ఆహారం కావాలి' } },
    { id: 'restroom', cat: 'needs', icon: '🚻', en: 'Restroom', hi: 'वॉशरूम', te: 'వాష్‌రూమ్', phrase: { en: 'I need to use the restroom', hi: 'मुझे वॉशरूम जाना है', te: 'నేను వాష్‌రూమ్‌కి వెళ్లాలి' } },
    { id: 'help', cat: 'needs', icon: '🆘', en: 'Help', hi: 'मदद', te: 'సహాయం', phrase: { en: 'I need assistance, please help me', hi: 'कृपया मेरी मदद करें', te: 'దయచేసి నాకు సహాయం చేయండి' } },
    { id: 'pain', cat: 'needs', icon: '🩹', en: 'Pain', hi: 'दर्द', te: 'నొప్పి', phrase: { en: 'I am experiencing physical pain here', hi: 'मुझे यहाँ दर्द हो रहा है', te: 'నాకు ఇక్కడ నొప్పిగా ఉంది' } },
    { id: 'medicine', cat: 'needs', icon: '💊', en: 'Medicine', hi: 'दवाई', te: 'మందులు', phrase: { en: 'I need my prescribed medication', hi: 'मुझे मेरी दवाई चाहिए', te: 'నాకు నా మందులు కావాలి' } },

    // Feelings & States
    { id: 'happy', cat: 'feelings', icon: '😊', en: 'Happy', hi: 'खुश', te: 'సంతోషం', phrase: { en: 'I feel happy', hi: 'मैं बहुत खुश हूँ', te: 'నేను చాలా సంతోషంగా ఉన్నాను' } },
    { id: 'tired', cat: 'feelings', icon: '😴', en: 'Tired', hi: 'थका हुआ', te: 'అలసట', phrase: { en: 'I feel tired and need rest', hi: 'मैं थक गया हूँ, मुझे आराम चाहिए', te: 'నేను అలసిపోయాను, విశ్రాంతి కావాలి' } },
    { id: 'anxious', cat: 'feelings', icon: '😰', en: 'Anxious', hi: 'चिंतित', te: 'ఆందోళన', phrase: { en: 'I feel overwhelmed and anxious', hi: 'मुझे घबराहट हो रही है', te: 'నాకు ఆందోళనగా ఉంది' } },
    { id: 'comfortable', cat: 'feelings', icon: '🛋️', en: 'Comfortable', hi: 'आरामदायक', te: 'హాయిగా', phrase: { en: 'I am comfortable now', hi: 'मैं अब ठीक महसूस कर रहा हूँ', te: 'నేను ఇప్పుడు బాగున్నాను' } },

    // Actions & Desires
    { id: 'want', cat: 'actions', icon: '👉', en: 'I want', hi: 'मुझे चाहिए', te: 'నాకు కావాలి', phrase: { en: 'I want', hi: 'मुझे चाहिए', te: 'నాకు కావాలి' } },
    { id: 'go', cat: 'actions', icon: '🚶', en: 'Go outside', hi: 'बाहर जाना', te: 'బయటకు వెళ్లాలి', phrase: { en: 'I want to go outside', hi: 'मुझे बाहर जाना है', te: 'నాకు బయటకు వెళ్లాలని ఉంది' } },
    { id: 'stop', cat: 'actions', icon: '🛑', en: 'Stop', hi: 'रोकें', te: 'ఆపండి', phrase: { en: 'Please stop this now', hi: 'कृपया इसे यहीं रोक दें', te: 'దయచేసి దీన్ని ఇప్పుడే ఆపండి' } },
    { id: 'wait', cat: 'actions', icon: '⏳', en: 'Wait', hi: 'रुकें', te: 'వేచి ఉండండి', phrase: { en: 'Please wait a moment for me', hi: 'कृपया एक क्षण प्रतीक्षा करें', te: 'దయచేసి ఒక నిమిషం వేచి ఉండండి' } }
  ];

  const categories = [
    { id: 'all', label: { en: 'All Symbols', hi: 'सभी प्रतीक', te: 'అన్ని చిహ్నాలు' } },
    { id: 'social', label: { en: 'Social & Greetings', hi: 'अभिवादन', te: 'మర్యాదలు' } },
    { id: 'needs', label: { en: 'Needs & Help', hi: 'आवश्यकताएं', te: 'అవసరాలు' } },
    { id: 'feelings', label: { en: 'Feelings', hi: 'भावनाएं', te: 'భావోద్వేగాలు' } },
    { id: 'actions', label: { en: 'Actions', hi: 'क्रियाएं', te: 'చర్యలు' } }
  ];

  const filteredTiles = activeCategory === 'all'
    ? aacTiles
    : aacTiles.filter((t) => t.cat === activeCategory);

  // Add tile to sentence bar
  const handleAddTile = (tile) => {
    setSentence((prev) => [...prev, tile]);
    // Single tile preview speech
    speakText(tile.phrase[currentLang] || tile.phrase.en, 1.0);
  };

  // Remove tile
  const handleRemoveTile = (index) => {
    setSentence((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Clear sentence
  const handleClearSentence = () => {
    setSentence([]);
  };

  // Speak synthesized voice with dysfluency modeling
  const speakText = (text, customRate = 1.0) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();
    setIsPlaying(true);
    setLastSpokenText(text);

    let processedText = text;
    let rate = customRate;
    let pitch = 1.0;

    if (dysfluencyMode === 'dysarthria') {
      // Slower, lowered rate simulating muscle weakness
      rate = 0.65;
      pitch = 0.85;
    } else if (dysfluencyMode === 'stutter') {
      // Repetition of initial sounds
      const words = text.split(' ');
      processedText = words
        .map((w) => (w.length > 3 ? `${w.slice(0, 2)}-${w.slice(0, 2)}-${w}` : w))
        .join(' ');
      rate = 0.8;
    } else if (dysfluencyMode === 'apraxia') {
      // Motor planning delays between syllables
      rate = 0.6;
      pitch = 1.1;
    }

    const utterance = new SpeechSynthesisUtterance(processedText);
    utterance.lang = currentLang === 'hi' ? 'hi-IN' : currentLang === 'te' ? 'te-IN' : 'en-US';
    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  // Speak full composed sentence
  const handleSpeakSentence = () => {
    if (sentence.length === 0) return;
    const fullText = sentence.map((item) => item.phrase[currentLang] || item.phrase.en).join('. ');
    speakText(fullText);
  };

  return (
    <div className="space-y-8">
      {/* Overview & Instructions Banner */}
      <div className="p-6 rounded-2xl border-2 border-blue-200 dark:border-blue-800 bg-[var(--bg-surface)] shadow-sm">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider mb-2">
          <MessageSquare className="w-4 h-4" />
          <span>{t('sim_speech.badge', 'Augmentative & Alternative Communication (AAC) Lab')}</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          {t('sim_speech.title', 'Interactive AAC Board & Speech Generating Simulator')}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
          {t(
            'sim_speech.desc',
            'Experience how non-verbal individuals, people with aphasia, cerebral palsy, or speech apraxia communicate using pictographic symbol grids and synthetic voice output. Compose sentences and test speech dysfluency conditions.'
          )}
        </p>

        {/* Dysfluency Mode Selector */}
        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            {t('sim_speech.mode_label', 'Speech Output Simulation Mode:')}
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'normal', label: t('sim_speech.mode_normal', 'Clear Synthetic Voice') },
              { id: 'dysarthria', label: t('sim_speech.mode_dysarthria', 'Dysarthria (Slow & Muscle Weakness)') },
              { id: 'stutter', label: t('sim_speech.mode_stutter', 'Dysfluency / Sound Repetition') },
              { id: 'apraxia', label: t('sim_speech.mode_apraxia', 'Apraxia (Motor Planning Delays)') }
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setDysfluencyMode(m.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  dysfluencyMode === m.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Composed Sentence Strip */}
      <div className="p-5 sm:p-6 rounded-2xl border-2 border-indigo-300 dark:border-indigo-700 bg-indigo-50/50 dark:bg-slate-900 shadow-md">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-indigo-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
            <Sparkles className="w-4 h-4" />
            <span>{t('sim_speech.sentence_strip', 'Composed Message Strip')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="primary"
              size="sm"
              disabled={sentence.length === 0 || isPlaying}
              onClick={handleSpeakSentence}
              icon={Volume2}
            >
              {isPlaying ? t('sim_speech.speaking', 'Speaking...') : t('sim_speech.speak_all', 'Speak Sentence')}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={sentence.length === 0}
              onClick={handleClearSentence}
              icon={Trash2}
            >
              {t('sim_speech.clear', 'Clear')}
            </Button>
          </div>
        </div>

        {/* Message Items Carousel / List */}
        <div className="min-h-[72px] flex flex-wrap items-center gap-2 p-2 rounded-xl bg-white dark:bg-slate-950 border border-indigo-200 dark:border-slate-800">
          {sentence.length === 0 ? (
            <span className="text-sm text-slate-400 italic px-2">
              {t('sim_speech.empty_strip_hint', 'Click symbols below to construct a message, then press Speak Sentence.')}
            </span>
          ) : (
            sentence.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-700 font-bold text-sm shadow-xs animate-in fade-in"
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item[currentLang] || item.en}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTile(idx)}
                  className="text-slate-400 hover:text-red-600 ml-1 cursor-pointer"
                  title="Remove word"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {lastSpokenText && (
          <div className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 italic">
            {t('sim_speech.vocalized', 'Vocalized audio: ')} "{lastSpokenText}"
          </div>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActiveCategory(c.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all touch-target ${
              activeCategory === c.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {c.label[currentLang] || c.label.en}
          </button>
        ))}
      </div>

      {/* Symbol Tiles Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filteredTiles.map((tile) => (
          <button
            key={tile.id}
            type="button"
            onClick={() => handleAddTile(tile)}
            className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-500 hover:bg-blue-50/60 dark:hover:bg-blue-950/30 transition-all touch-target shadow-xs group cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95"
          >
            <span className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform">
              {tile.icon}
            </span>
            <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100 text-center">
              {tile[currentLang] || tile.en}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">
              {tile.cat}
            </span>
          </button>
        ))}
      </div>

      {/* Educational Etiquette Callout */}
      <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-xs sm:text-sm text-amber-900 dark:text-amber-200 space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
          <Clock className="w-4 h-4 shrink-0" />
          <span>{t('sim_speech.etiquette_title', 'Respectful AAC Communication Etiquette:')}</span>
        </div>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li>
            {t(
              'sim_speech.rule1',
              'Do not finish sentences or guess words prematurely; give AAC users ample time to locate symbols or type their message.'
            )}
          </li>
          <li>
            {t(
              'sim_speech.rule2',
              'Address the individual directly and maintain normal eye contact, rather than looking only at their device or aide.'
            )}
          </li>
          <li>
            {t(
              'sim_speech.rule3',
              'Under India’s RPwD Act 2016, Speech and Language Disability is legally recognized, granting individuals the right to reasonable communication accommodations.'
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SpeechAACSimulator;
