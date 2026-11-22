import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Mic,
  MicOff,
  Copy,
  Trash2,
  Sliders,
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import Button from '../common/Button';

export function LiveCaptionsTool() {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'en').split('-')[0];

  const trans = {
    en: {
      title: 'Speech-to-Text Live Captions (Accessible Display)',
      subtitle: 'Transforms live spoken speech into high-contrast captions for deaf or hard-of-hearing users.',
      start_btn: 'Start Live Captions',
      stop_btn: 'Stop Captions',
      caption_size: 'Caption Size:',
      size_std: 'Standard (20px)',
      size_lg: 'Large (24px)',
      size_xl: 'Extra Large (36px)',
      contrast_label: 'Contrast Palette:',
      theme_dark: 'Dark Slate',
      theme_yellow: 'Yellow on Black',
      mic_active: 'MICROPHONE ACTIVE - SPEAK FREELY',
      mic_paused: 'MICROPHONE PAUSED',
      copy: 'Copy',
      copied: 'Copied!',
      clear: 'Clear',
      listening: 'Listening for speech...',
      prompt_start: 'Click "Start Live Captions" and speak into your microphone.',
      speech_lang: 'en-US',
      footer_privacy: 'Zero audio data uploaded to external servers'
    },
    hi: {
      title: 'भाषण-से-टेक्स्ट लाइव कैप्शन (सुगम्य डिस्प्ले)',
      subtitle: 'बधिर एवं कम सुनने वाले उपयोगकर्ताओं के लिए लाइव बोली को उच्च-कंट्रास्ट सबटाइटल में बदलें।',
      start_btn: 'लाइव कैप्शन शुरू करें',
      stop_btn: 'कैप्शन बंद करें',
      caption_size: 'कैप्शन आकार:',
      size_std: 'सामान्य (20px)',
      size_lg: 'बड़ा (24px)',
      size_xl: 'अतिरिक्त बड़ा (36px)',
      contrast_label: 'कंट्रास्ट थीम:',
      theme_dark: 'डार्क स्लेट',
      theme_yellow: 'ब्लैक पर पीला',
      mic_active: 'माइक्रोफ़ोन चालू है - कृपया बोलें',
      mic_paused: 'माइक्रोफ़ोन रुका हुआ है',
      copy: 'कॉपी करें',
      copied: 'कॉपी हो गया!',
      clear: 'साफ़ करें',
      listening: 'आवाज़ सुनी जा रही है...',
      prompt_start: '"लाइव कैप्शन शुरू करें" पर क्लिक करें और अपने माइक में बोलें।',
      speech_lang: 'hi-IN',
      footer_privacy: 'कोई भी ऑडियो डेटा बाहरी सर्वर पर नहीं भेजा जाता है'
    },
    te: {
      title: 'లైవ్ వాయిస్ క్యాప్షన్లు (స్పీచ్-టు-టెక్స్ట్)',
      subtitle: 'వినికిడి లోపం ఉన్నవారి కోసం మాట్లాడే ప్రతి మాటను పెద్ద అక్షరాల్లో తెరపై చూపే సాధనం.',
      start_btn: 'లైవ్ క్యాప్షన్లు ప్రారంభించండి',
      stop_btn: 'క్యాప్షన్లు ఆపండి',
      caption_size: 'అక్షరాల పరిమాణం:',
      size_std: 'సాధారణం (20px)',
      size_lg: 'పెద్దది (24px)',
      size_xl: 'చాలా పెద్దది (36px)',
      contrast_label: 'కాంట్రాస్ట్ థీమ్:',
      theme_dark: 'డార్క్ స్లేట్',
      theme_yellow: 'నలుపుపై పసుపు',
      mic_active: 'మైక్రోఫోన్ ఆన్ - దయచేసి మాట్లాడండి',
      mic_paused: 'మైక్రోఫోన్ నిలిపివేయబడింది',
      copy: 'కాపీ చేయండి',
      copied: 'కాపీ అయ్యింది!',
      clear: 'క్లియర్ చేయండి',
      listening: 'మాటల కోసం వింటోంది...',
      prompt_start: '"లైవ్ క్యాప్షన్లు ప్రారంభించండి" బటన్ నొక్కి మైక్రోఫోన్‌లో మాట్లాడండి.',
      speech_lang: 'te-IN',
      footer_privacy: 'ఆడియో డేటా ఏదీ బాహ్య సర్వర్లకు వెళ్ళదు'
    }
  };

  const L = trans[currentLang] || trans.en;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [fontSize, setFontSize] = useState('text-2xl');
  const [theme, setTheme] = useState('dark');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  const SpeechRecognition = typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

  useEffect(() => {
    if (!SpeechRecognition) {
      setError('Web Speech Recognition API is not supported in this browser. Please use Chrome or Edge for live dictation.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = L.speech_lang;

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
        setTranscript((prev) => prev + finalTranscript);
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setError('Microphone permission denied. Please allow microphone access in your browser settings.');
      } else if (event.error === 'no-speech') {
        // Normal silence timeout
      } else {
        setError(`Recognition alert: ${event.error}`);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, [SpeechRecognition, currentLang]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setError(null);
      try {
        recognitionRef.current.lang = L.speech_lang;
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start recognition:', err);
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setTranscript('');
    setInterimTranscript('');
  };

  return (
    <div className="space-y-8">
      {/* Controls & Configuration */}
      <div className="p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-[var(--bg-surface)]">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Mic className="w-5 h-5 text-emerald-600" />
              <span>{L.title}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {L.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant={isListening ? 'danger' : 'primary'}
              onClick={toggleListening}
              icon={isListening ? MicOff : Mic}
              disabled={!SpeechRecognition}
              className={isListening ? 'animate-pulse' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}
            >
              {isListening ? L.stop_btn : L.start_btn}
            </Button>
          </div>
        </div>

        {/* Display Format Options */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 uppercase tracking-wider">{L.caption_size}</span>
            <button
              onClick={() => setFontSize('text-xl')}
              className={`px-3 py-1.5 rounded-lg border ${fontSize === 'text-xl' ? 'bg-blue-600 text-white font-bold' : 'border-slate-300'}`}
            >
              {L.size_std}
            </button>
            <button
              onClick={() => setFontSize('text-2xl')}
              className={`px-3 py-1.5 rounded-lg border ${fontSize === 'text-2xl' ? 'bg-blue-600 text-white font-bold' : 'border-slate-300'}`}
            >
              {L.size_lg}
            </button>
            <button
              onClick={() => setFontSize('text-4xl')}
              className={`px-3 py-1.5 rounded-lg border ${fontSize === 'text-4xl' ? 'bg-blue-600 text-white font-bold' : 'border-slate-300'}`}
            >
              {L.size_xl}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 uppercase tracking-wider">{L.contrast_label}</span>
            <button
              onClick={() => setTheme('dark')}
              className={`px-3 py-1.5 rounded-lg border ${theme === 'dark' ? 'bg-slate-900 text-white font-bold border-slate-900' : 'border-slate-300'}`}
            >
              {L.theme_dark}
            </button>
            <button
              onClick={() => setTheme('hc-yellow')}
              className={`px-3 py-1.5 rounded-lg border bg-black text-yellow-300 ${theme === 'hc-yellow' ? 'border-yellow-400 ring-2 ring-yellow-400 font-bold' : 'border-slate-700'}`}
            >
              {L.theme_yellow}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm">{error}</p>
        </div>
      )}

      {/* High-Contrast Live Captions Viewport */}
      <div
        className={`p-8 sm:p-12 rounded-3xl border-4 min-h-[320px] max-h-[480px] overflow-y-auto flex flex-col justify-between shadow-2xl transition-colors ${
          theme === 'hc-yellow'
            ? 'bg-black text-yellow-300 border-yellow-400'
            : 'bg-slate-900 text-slate-100 border-slate-700'
        }`}
      >
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs font-mono mb-4 text-slate-400">
            <span className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${isListening ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`}></span>
              <span>{isListening ? L.mic_active : L.mic_paused}</span>
            </span>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCopy}
                disabled={!transcript}
                className="hover:text-white disabled:opacity-40 flex items-center gap-1"
                title="Copy"
              >
                <Copy className="w-4 h-4" />
                <span>{copied ? L.copied : L.copy}</span>
              </button>
              <button
                onClick={handleClear}
                disabled={!transcript && !interimTranscript}
                className="hover:text-red-400 disabled:opacity-40 flex items-center gap-1"
                title="Clear"
              >
                <Trash2 className="w-4 h-4" />
                <span>{L.clear}</span>
              </button>
            </div>
          </div>

          {/* Transcript Render */}
          <div className={`font-bold leading-relaxed space-y-2 ${fontSize}`}>
            {transcript ? (
              <span>{transcript}</span>
            ) : (
              <span className="opacity-40 italic font-normal">
                {isListening ? L.listening : L.prompt_start}
              </span>
            )}

            {/* Interim live text */}
            {interimTranscript && (
              <span className="opacity-60 underline decoration-dashed ml-2">
                {interimTranscript}
              </span>
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 text-xs opacity-60 flex items-center justify-between">
          <span>Web Speech Recognition API</span>
          <span>{L.footer_privacy}</span>
        </div>
      </div>
    </div>
  );
}

export default LiveCaptionsTool;
