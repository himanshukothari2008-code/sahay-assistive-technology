import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MessageSquare,
  Volume2,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Heart,
  Smile,
  Droplets,
  Utensils,
  DoorOpen,
  AlertTriangle,
  Phone,
  VolumeX,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import Button from '../common/Button';
import Modal from '../common/Modal';

const iconMap = {
  CheckCircle,
  XCircle,
  Heart,
  Smile,
  Droplets,
  Utensils,
  DoorOpen,
  AlertTriangle,
  Phone,
  VolumeX,
  MessageSquare,
  HelpCircle
};

const defaultSymbolsData = [
  {
    id: 'aac-1',
    icon: 'CheckCircle',
    groupKey: 'Basics',
    color: 'emerald',
    en: { label: 'Yes', phrase: 'Yes, I agree.' },
    hi: { label: 'हाँ', phrase: 'हाँ, मैं सहमत हूँ।' },
    te: { label: 'అవును', phrase: 'అవును, నేను అంగీకరిస్తున్నాను.' }
  },
  {
    id: 'aac-2',
    icon: 'XCircle',
    groupKey: 'Basics',
    color: 'red',
    en: { label: 'No', phrase: 'No, thank you.' },
    hi: { label: 'नहीं', phrase: 'नहीं, धन्यवाद।' },
    te: { label: 'కాదు', phrase: 'కాదు, ధన్యవాదాలు.' }
  },
  {
    id: 'aac-3',
    icon: 'Heart',
    groupKey: 'Basics',
    color: 'pink',
    en: { label: 'Please', phrase: 'Please help me.' },
    hi: { label: 'कृपया', phrase: 'कृपया मेरी सहायता करें।' },
    te: { label: 'దయచేసి', phrase: 'దయచేసి నాకు సహాయం చేయండి.' }
  },
  {
    id: 'aac-4',
    icon: 'Smile',
    groupKey: 'Basics',
    color: 'amber',
    en: { label: 'Thank You', phrase: 'Thank you very much.' },
    hi: { label: 'धन्यवाद', phrase: 'आपका बहुत-बहुत धन्यवाद।' },
    te: { label: 'ధన్యవాదాలు', phrase: 'చాలా ధన్యవాదాలు.' }
  },
  {
    id: 'aac-5',
    icon: 'Droplets',
    groupKey: 'Needs',
    color: 'blue',
    en: { label: 'Water', phrase: 'I need a glass of water, please.' },
    hi: { label: 'पानी', phrase: 'मुझे पीने के लिए पानी चाहिए।' },
    te: { label: 'నీరు', phrase: 'నాకు మంచి నీళ్ళు కావాలి.' }
  },
  {
    id: 'aac-6',
    icon: 'Utensils',
    groupKey: 'Needs',
    color: 'orange',
    en: { label: 'Food / Hungry', phrase: 'I am hungry and need food.' },
    hi: { label: 'भोजन / भूख', phrase: 'मुझे भूख लगी है, खाना चाहिए।' },
    te: { label: 'ఆహారం / ఆకలి', phrase: 'నాకు ఆకలిగా ఉంది, భోజనం కావాలి.' }
  },
  {
    id: 'aac-7',
    icon: 'DoorOpen',
    groupKey: 'Needs',
    color: 'purple',
    en: { label: 'Restroom', phrase: 'I need to use the restroom.' },
    hi: { label: 'शौचालय', phrase: 'मुझे शौचालय जाना है।' },
    te: { label: 'వాష్‌రూమ్', phrase: 'నేను వాష్‌రూమ్‌కు వెళ్ళాలి.' }
  },
  {
    id: 'aac-8',
    icon: 'AlertTriangle',
    groupKey: 'Emergency',
    color: 'rose',
    en: { label: 'Pain / Hurt', phrase: 'I am in pain. Please assist me.' },
    hi: { label: 'दर्द / चोट', phrase: 'मुझे दर्द हो रहा है, कृपया मदद करें।' },
    te: { label: 'నొప్పి / బాధ', phrase: 'నాకు నొప్పిగా ఉంది. దయచేసి సహాయం చేయండి.' }
  },
  {
    id: 'aac-9',
    icon: 'Phone',
    groupKey: 'Emergency',
    color: 'rose',
    en: { label: 'Call Family', phrase: 'Please call my emergency family contact.' },
    hi: { label: 'परिवार को कॉल', phrase: 'कृपया मेरे परिवार के आपातकालीन नंबर पर कॉल करें।' },
    te: { label: 'కుటుంబానికి కాల్', phrase: 'దయచేసి నా కుటుంబ సభ్యులకు కాల్ చేయండి.' }
  },
  {
    id: 'aac-10',
    icon: 'VolumeX',
    groupKey: 'Feelings',
    color: 'teal',
    en: { label: 'Quiet Space', phrase: 'I feel overwhelmed. I need a calm and quiet space.' },
    hi: { label: 'शांत स्थान', phrase: 'मुझे घबराहट हो रही है, मुझे शांत जगह चाहिए।' },
    te: { label: 'ప్రశాంతమైన స్థలం', phrase: 'నాకు ప్రశాంతమైన స్థలం కావాలి.' }
  }
];

export function AACBoardTool() {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'en').split('-')[0];

  const trans = {
    en: {
      title: 'AAC Picture-to-Speech Communication Board',
      subtitle: 'Tap cards to vocalize needs or build full communicative sentences.',
      add_phrase: 'Add Custom Phrase',
      active_builder: 'Active Sentence Builder:',
      tap_cards_prompt: 'Tap cards below to assemble a sentence...',
      speak_sentence: 'Speak Full Sentence',
      clear: 'Clear',
      group_all: 'All',
      group_basics: 'Basics',
      group_needs: 'Needs',
      group_emergency: 'Emergency',
      group_feelings: 'Feelings',
      modal_title: 'Add Custom AAC Phrase',
      modal_desc: 'Create a personalized communication card that vocalizes your specific routine or phrase.',
      card_label_lbl: 'Card Label (Short Button Text)',
      card_phrase_lbl: 'Spoken Audio Phrase',
      card_group_lbl: 'Category Group',
      cancel: 'Cancel',
      save: 'Save Card',
      speech_lang: 'en-US'
    },
    hi: {
      title: 'एएसी चित्र-से-वाणी संप्रेषण बोर्ड',
      subtitle: 'अपनी जरूरतें बोलकर व्यक्त करने या पूरा वाक्य बनाने के लिए कार्ड पर क्लिक करें।',
      add_phrase: 'नया कार्ड जोड़ें',
      active_builder: 'सक्रिय वाक्य निर्माता:',
      tap_cards_prompt: 'वाक्य बनाने के लिए नीचे दिए गए कार्ड्स पर क्लिक करें...',
      speak_sentence: 'पूरा वाक्य बोलें',
      clear: 'साफ़ करें',
      group_all: 'सभी',
      group_basics: 'सामान्य',
      group_needs: 'आवश्यकताएं',
      group_emergency: 'आपातकाल',
      group_feelings: 'भावनाएं',
      modal_title: 'कस्टम एएसी कार्ड जोड़ें',
      modal_desc: 'अपनी व्यक्तिगत दिनचर्या या विशेष वाक्यांश का नया कार्ड बनाएं।',
      card_label_lbl: 'कार्ड का नाम (बटन पर दिखने वाला शब्द)',
      card_phrase_lbl: 'बोला जाने वाला पूरा वाक्य',
      card_group_lbl: 'श्रेणी समूह',
      cancel: 'रद्द करें',
      save: 'कार्ड सहेजें',
      speech_lang: 'hi-IN'
    },
    te: {
      title: 'AAC పిక్చర్-టు-స్పీచ్ కమ్యూనికేషన్ బోర్డ్',
      subtitle: 'అవసరాలను వాయిస్ ద్వారా తెలియజేయడానికి కార్డులను క్లిక్ చేయండి.',
      add_phrase: 'కొత్త కార్డు జోడించండి',
      active_builder: 'వాక్య రూపకల్పన పట్టిక:',
      tap_cards_prompt: 'వాక్యం రూపొందించడానికి క్రింది కార్డులను ఎంచుకోండి...',
      speak_sentence: 'పూర్తి వాక్యం పలకండి',
      clear: 'క్లియర్ చేయండి',
      group_all: 'అన్నీ',
      group_basics: 'ప్రాథమిక',
      group_needs: 'అవసరాలు',
      group_emergency: 'అత్యవసరం',
      group_feelings: 'భావాలు',
      modal_title: 'కస్టమ్ AAC కార్డు జోడించండి',
      modal_desc: 'మీ స్వంత అవసరాల కోసం ప్రత్యేక కార్డును రూపొందించండి.',
      card_label_lbl: 'కార్డు పేరు (బటన్ పై కనిపించే అక్షరాలు)',
      card_phrase_lbl: 'వాయిస్ ద్వారా పలికే వాక్యం',
      card_group_lbl: 'వర్గం',
      cancel: 'రద్దు చేయండి',
      save: 'సేవ్ చేయండి',
      speech_lang: 'te-IN'
    }
  };

  const L = trans[currentLang] || trans.en;

  const [activeGroupKey, setActiveGroupKey] = useState('All');
  const [sentenceStrip, setSentenceStrip] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newPhrase, setNewPhrase] = useState('');
  const [newGroupKey, setNewGroupKey] = useState('Needs');

  const [customSymbols, setCustomSymbols] = useState(() => {
    try {
      const saved = localStorage.getItem('sahay_custom_aac');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const allSymbols = [
    ...defaultSymbolsData.map((d) => ({
      id: d.id,
      icon: d.icon,
      groupKey: d.groupKey,
      color: d.color,
      label: d[currentLang]?.label || d.en.label,
      phrase: d[currentLang]?.phrase || d.en.phrase
    })),
    ...customSymbols
  ];

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = L.speech_lang;
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCardClick = (symbol) => {
    speakText(symbol.phrase);
    setSentenceStrip((prev) => [...prev, symbol]);
  };

  const handleSpeakFullSentence = () => {
    if (sentenceStrip.length === 0) return;
    const combinedSpeech = sentenceStrip.map((s) => s.phrase).join(' ');
    speakText(combinedSpeech);
  };

  const handleClearSentence = () => {
    setSentenceStrip([]);
  };

  const handleAddCustomSymbol = (e) => {
    e.preventDefault();
    if (!newLabel.trim() || !newPhrase.trim()) return;

    const newCard = {
      id: `custom-${Date.now()}`,
      label: newLabel.trim(),
      icon: 'MessageSquare',
      phrase: newPhrase.trim(),
      groupKey: newGroupKey,
      color: 'indigo',
      isCustom: true
    };

    const updated = [...customSymbols, newCard];
    setCustomSymbols(updated);

    try {
      localStorage.setItem('sahay_custom_aac', JSON.stringify(updated));
    } catch (err) {
      console.warn('Could not save custom card:', err);
    }

    setNewLabel('');
    setNewPhrase('');
    setIsAddModalOpen(false);
  };

  const groupTabs = [
    { key: 'All', label: L.group_all },
    { key: 'Basics', label: L.group_basics },
    { key: 'Needs', label: L.group_needs },
    { key: 'Emergency', label: L.group_emergency },
    { key: 'Feelings', label: L.group_feelings }
  ];

  const filteredSymbols = activeGroupKey === 'All'
    ? allSymbols
    : allSymbols.filter((s) => s.groupKey === activeGroupKey);

  return (
    <div className="space-y-8">
      {/* Header & Sentence Builder Bar */}
      <div className="p-6 rounded-3xl border-2 border-slate-200 dark:border-slate-700 bg-[var(--bg-surface)] shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              <span>{L.title}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {L.subtitle}
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            icon={Plus}
          >
            {L.add_phrase}
          </Button>
        </div>

        {/* Sentence Strip (Visual Assembly) */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
            {L.active_builder}
          </span>

          <div className="min-h-[72px] p-3 rounded-2xl border-2 border-dashed border-purple-300 dark:border-purple-800 bg-purple-50/40 dark:bg-purple-950/20 flex flex-wrap items-center gap-2">
            {sentenceStrip.length > 0 ? (
              sentenceStrip.map((item, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border-2 border-purple-400 font-bold text-sm shadow-sm flex items-center gap-2 animate-fadeIn"
                >
                  <span>{item.label}</span>
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-400 italic px-2">
                {L.tap_cards_prompt}
              </span>
            )}
          </div>

          {/* Sentence Action Controls */}
          <div className="flex items-center gap-3 mt-4">
            <Button
              variant="primary"
              size="md"
              onClick={handleSpeakFullSentence}
              disabled={sentenceStrip.length === 0}
              icon={Volume2}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {L.speak_sentence}
            </Button>

            <Button
              variant="ghost"
              size="md"
              onClick={handleClearSentence}
              disabled={sentenceStrip.length === 0}
              icon={Trash2}
            >
              {L.clear}
            </Button>
          </div>
        </div>
      </div>

      {/* Category Group Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {groupTabs.map((grp) => (
          <button
            key={grp.key}
            onClick={() => setActiveGroupKey(grp.key)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all touch-target whitespace-nowrap ${
              activeGroupKey === grp.key
                ? 'bg-purple-600 text-white border-purple-600 shadow-md ring-2 ring-purple-300'
                : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            {grp.label}
          </button>
        ))}
      </div>

      {/* AAC Symbol Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredSymbols.map((s) => {
          const IconComp = iconMap[s.icon] || MessageSquare;

          return (
            <button
              key={s.id}
              type="button"
              onClick={() => handleCardClick(s)}
              className="p-5 rounded-3xl border-2 border-slate-200 dark:border-slate-700 bg-[var(--bg-surface)] hover:border-purple-600 dark:hover:border-purple-400 hover:shadow-lg transition-all active:scale-95 flex flex-col items-center justify-center text-center touch-target group focus-visible:outline-none"
            >
              <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <IconComp className="w-8 h-8" />
              </div>

              <span className="font-extrabold text-base text-slate-900 dark:text-slate-100 block mb-1">
                {s.label}
              </span>

              <span className="text-[11px] text-slate-500 line-clamp-1">
                "{s.phrase}"
              </span>
            </button>
          );
        })}
      </div>

      {/* Add Custom Symbol Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={L.modal_title}
        description={L.modal_desc}
      >
        <form onSubmit={handleAddCustomSymbol} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              {L.card_label_lbl}
            </label>
            <input
              type="text"
              required
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:ring-2 focus:ring-purple-500 focus-visible:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              {L.card_phrase_lbl}
            </label>
            <input
              type="text"
              required
              value={newPhrase}
              onChange={(e) => setNewPhrase(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:ring-2 focus:ring-purple-500 focus-visible:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              {L.card_group_lbl}
            </label>
            <select
              value={newGroupKey}
              onChange={(e) => setNewGroupKey(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:ring-2 focus:ring-purple-500 focus-visible:outline-none bg-white dark:bg-slate-800"
            >
              <option value="Needs">{L.group_needs}</option>
              <option value="Basics">{L.group_basics}</option>
              <option value="Emergency">{L.group_emergency}</option>
              <option value="Feelings">{L.group_feelings}</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              {L.cancel}
            </Button>
            <Button type="submit" variant="primary" className="bg-purple-600 hover:bg-purple-700 text-white">
              {L.save}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default AACBoardTool;
