import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  Sliders,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Slider from '../common/Slider';
import Button from '../common/Button';

export function TTSReaderTool() {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'en').split('-')[0];

  const trans = {
    en: {
      title: 'Text-to-Speech (TTS) Voice Reader',
      subtitle: 'Listen to any article or typed text with real-time synchronized word highlighting.',
      read_aloud: 'Read Aloud',
      resume: 'Resume Voice',
      pause: 'Pause',
      stop: 'Stop',
      voice_select: 'Synthesizer Voice',
      rate_label: 'Reading Rate / Speed',
      pitch_label: 'Voice Pitch',
      input_label: 'Type or Paste Content to Read:',
      sample_btn: 'Insert Sample Text',
      tracking_view: 'Synchronized Visual Tracking View:',
      unsupported_title: 'Web Speech API Not Supported',
      unsupported_body: 'Your current browser does not support the Web Speech Synthesis API. Please use Google Chrome, Microsoft Edge, or Safari for full speech synthesis support.',
      sample_text: 'Welcome to Sahay Assistive Technology. This is the built-in Text-to-Speech reader. It allows anyone with low vision, reading fatigue, or cognitive processing differences to listen to written content with real-time word highlighting.',
      legal_sample: 'The Rights of Persons with Disabilities Act 2016 guarantees accessible websites, barrier-free public buildings, and four percent employment reservations in Indian government offices.'
    },
    hi: {
      title: 'टेक्स्ट-टू-स्पीच (TTS) वॉइस रीडर',
      subtitle: 'रियल-टाइम शब्द हाइलाइटिंग के साथ किसी भी लेख या लिखे गए टेक्स्ट को प्राकृतिक आवाज़ में सुनें।',
      read_aloud: 'बोलकर सुनाएं',
      resume: 'पुनः शुरू करें',
      pause: 'रोकें',
      stop: 'समाप्त करें',
      voice_select: 'सिंथेसाइज़र आवाज़ (वॉइस)',
      rate_label: 'पठन गति (स्पीड)',
      pitch_label: 'आवाज़ का तारत्व (पिच)',
      input_label: 'सुनने के लिए टेक्स्ट यहाँ टाइप या पेस्ट करें:',
      sample_btn: 'नमूना टेक्स्ट डालें',
      tracking_view: 'सिंक्रोनाइज़्ड विज़ुअल वर्ड ट्रैकिंग:',
      unsupported_title: 'वेब स्पीच API असमर्थित है',
      unsupported_body: 'आपका वर्तमान ब्राउज़र वेब स्पीच सिंथेसिस API का समर्थन नहीं करता है। कृपया क्रोम या एज ब्राउज़र का उपयोग करें।',
      sample_text: 'सहाय (Sahay) सहायक प्रौद्योगिकी में आपका स्वागत है। यह हमारा इन-बिल्ट टेक्स्ट-टू-स्पीच वॉइस रीडर है। यह अल्प दृष्टि, पठन थकान या डिस्लेक्सिया वाले किसी भी व्यक्ति को वास्तविक समय में शब्दों को हाइलाइट करते हुए लिखित सामग्री सुनने की सुविधा देता है।',
      legal_sample: 'दिव्यांगजन अधिकार अधिनियम 2016 सरकारी कार्यालयों में 4% आरक्षण, सुगम्य वेबसाइटें और बाधारहित सार्वजनिक भवनों की कानूनी गारंटी देता है।'
    },
    te: {
      title: 'టెక్స్ట్-టు-స్పీచ్ (TTS) వాయిస్ రీడర్',
      subtitle: 'స్క్రీన్‌పై పదాలు హైలైట్ అవుతుండగా ఏదైనా టెక్స్ట్‌ను ఆడియో రూపంలో స్పష్టంగా వినండి.',
      read_aloud: 'చదివి వినిపించండి',
      resume: 'కొనసాగించండి',
      pause: 'పాజ్',
      stop: 'ఆపండి',
      voice_select: 'వాయిస్ ఎంపిక',
      rate_label: 'చదివే వేగం (స్పీడ్)',
      pitch_label: 'వాయిస్ పిచ్',
      input_label: 'చదవాల్సిన విషయాన్ని ఇక్కడ టైప్ చేయండి:',
      sample_btn: 'నమూనా టెక్స్ట్ ఉంచండి',
      tracking_view: 'రియల్-టైమ్ విజువల్ ట్రాకింగ్ వ్యూ:',
      unsupported_title: 'వెబ్ స్పీచ్ API సపోర్ట్ లేదు',
      unsupported_body: 'మీ బ్రౌజర్ వెబ్ స్పీచ్ API ని సపోర్ట్ చేయదు. దయచేసి క్రోమ్ లేదా ఎడ్జ్ వాడండి.',
      sample_text: 'సహాయ్ (Sahay) సహాయక సాంకేతికతకు స్వాగతం. ఇది మా అంతర్నిర్మిత టెక్స్ట్-టు-స్పీచ్ రీడర్. తక్కువ దృష్టి లేదా చదవడంలో అలసట ఉన్నవారు తెరపై హైలైట్ అయ్యే అక్షరాలను సులభంగా ఆడియో ద్వారా వినవచ్చు.',
      legal_sample: 'దివ్యాంగుల హక్కుల చట్టం 2016 ప్రభుత్వ ఉద్యోగాల్లో 4% రిజర్వేషన్లు మరియు సుగమ్య వెబ్‌సైట్లను నిర్దేశిస్తుంది.'
    }
  };

  const L = trans[currentLang] || trans.en;

  const [text, setText] = useState(L.sample_text);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [highlightWordIndex, setHighlightWordIndex] = useState(-1);

  const utteranceRef = useRef(null);
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Change default text when language changes if text is untouched
  useEffect(() => {
    setText(L.sample_text);
  }, [currentLang]);

  // Load available system voices and auto-select matching language voice
  useEffect(() => {
    if (!isSupported) return;

    const updateVoices = () => {
      const availVoices = window.speechSynthesis.getVoices();
      if (availVoices && availVoices.length > 0) {
        setVoices(availVoices);
        const langPrefix = currentLang === 'hi' ? 'hi' : (currentLang === 'te' ? 'te' : 'en');
        const matchVoice = availVoices.find((v) => v.lang.toLowerCase().startsWith(langPrefix)) ||
                           availVoices.find((v) => v.lang.startsWith('en')) ||
                           availVoices[0];
        if (matchVoice) {
          setSelectedVoice(matchVoice.name);
        }
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported, currentLang]);

  const handlePlay = () => {
    if (!isSupported) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();
    setHighlightWordIndex(-1);

    const utterance = new SpeechSynthesisUtterance(text);
    const chosenVoice = voices.find((v) => v.name === selectedVoice);
    if (chosenVoice) {
      utterance.voice = chosenVoice;
    } else {
      utterance.lang = currentLang === 'te' ? 'te-IN' : (currentLang === 'hi' ? 'hi-IN' : 'en-US');
    }

    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onboundary = (e) => {
      if (e.name === 'word') {
        const charIndex = e.charIndex;
        const wordsBefore = text.slice(0, charIndex).trim().split(/\s+/).length;
        setHighlightWordIndex(wordsBefore);
      }
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setHighlightWordIndex(-1);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setHighlightWordIndex(-1);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (isSupported && isPlaying) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      setHighlightWordIndex(-1);
    }
  };

  if (!isSupported) {
    return (
      <div className="p-8 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-3">
        <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-base mb-1">{L.unsupported_title}</h4>
          <p className="text-sm">{L.unsupported_body}</p>
        </div>
      </div>
    );
  }

  const words = text.split(/\s+/);

  return (
    <div className="space-y-8">
      {/* Configuration & Controls */}
      <div className="p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-[var(--bg-surface)]">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-blue-600" />
              <span>{L.title}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {L.subtitle}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {!isPlaying ? (
              <Button
                variant="primary"
                onClick={handlePlay}
                icon={Play}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isPaused ? L.resume : L.read_aloud}
              </Button>
            ) : (
              <Button variant="secondary" onClick={handlePause} icon={Pause}>
                {L.pause}
              </Button>
            )}

            <Button
              variant="outline"
              onClick={handleStop}
              icon={Square}
              disabled={!isPlaying && !isPaused}
            >
              {L.stop}
            </Button>
          </div>
        </div>

        {/* Sliders and Voice Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="voice-select" className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
              {L.voice_select} ({voices.length})
            </label>
            <select
              id="voice-select"
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus-visible:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {voices.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>

          <div>
            <Slider
              label={L.rate_label}
              min={0.5}
              max={2.0}
              step={0.1}
              value={rate}
              onChange={setRate}
              valueDisplay={`${rate}x`}
            />
          </div>

          <div>
            <Slider
              label={L.pitch_label}
              min={0.5}
              max={1.5}
              step={0.1}
              value={pitch}
              onChange={setPitch}
              valueDisplay={`${pitch}`}
            />
          </div>
        </div>
      </div>

      {/* Editable Text Area + Word Highlighting Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Box */}
        <div className="space-y-2">
          <label htmlFor="tts-text-input" className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>{L.input_label}</span>
            <button
              onClick={() => setText(L.legal_sample)}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-normal"
            >
              {L.sample_btn}
            </button>
          </label>
          <textarea
            id="tts-text-input"
            rows={8}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-4 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-[var(--bg-surface)] text-base leading-relaxed focus-visible:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Live Synchronized Highlighting Display */}
        <div className="space-y-2">
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{L.tracking_view}</span>
          </span>

          <div className="p-6 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 min-h-[220px] max-h-[300px] overflow-y-auto leading-loose text-lg text-slate-800 dark:text-slate-200">
            {words.map((w, idx) => {
              const isCurrentWord = isPlaying && highlightWordIndex === idx;

              return (
                <span
                  key={idx}
                  className={`inline-block mr-1.5 px-1 py-0.5 rounded transition-all duration-100 ${
                    isCurrentWord
                      ? 'bg-yellow-300 text-black font-extrabold shadow-sm scale-105'
                      : ''
                  }`}
                >
                  {w}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TTSReaderTool;
