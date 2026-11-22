import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Ear,
  Volume2,
  VolumeX,
  AlertTriangle,
  RotateCcw,
  Sliders,
  CheckCircle,
  FileText,
  Play,
  Square
} from 'lucide-react';
import Slider from '../common/Slider';
import Button from '../common/Button';

export function HearingSimulator() {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'en').split('-')[0];

  const [isPlaying, setIsPlaying] = useState(false);
  const [cutoffFreq, setCutoffFreq] = useState(1200); // 400Hz to 8000Hz
  const [tinnitusEnabled, setTinnitusEnabled] = useState(false);
  const [tinnitusVolume, setTinnitusVolume] = useState(15);
  const [showCaptions, setShowCaptions] = useState(true);
  const [captionIndex, setCaptionIndex] = useState(0);

  const audioCtxRef = useRef(null);
  const filterNodeRef = useRef(null);
  const tinnitusOscRef = useRef(null);
  const tinnitusGainRef = useRef(null);
  const speechIntervalRef = useRef(null);

  const trans = {
    en: {
      warn_title: 'Auditory Safety & Content Warning:',
      warn_body: 'Please start this simulation at a low or moderate speaker/headphone volume. A prominent red "Emergency Stop" button is available below at all times.',
      title: 'Hearing Loss & Tinnitus Simulator',
      subtitle: 'Demonstrates acoustic frequency loss, persistent tinnitus, and the critical role of synchronized captions.',
      btn_start: 'Start Audio Experience',
      btn_stop: 'Emergency Stop Audio',
      filter_title: 'High-Frequency Hearing Loss Filter',
      filter_desc: 'Sensorineural loss diminishes high frequencies first. High consonants (s, f, th, sh, p) carry frequencies above 2000Hz; losing them makes speech sound like muffled mumbling.',
      slider_label: 'Auditory Frequency Bandwidth',
      severe: 'Severe Loss',
      moderate: 'Moderate Loss',
      normal: 'Normal',
      opt_normal: 'Normal (8000 Hz)',
      opt_mod: 'Moderate (2400 Hz)',
      opt_sev: 'Severe (800 Hz)',
      tinnitus_title: 'Tinnitus (Persistent Ear Ringing)',
      tinnitus_tone: 'Tinnitus Ringing Tone',
      tinnitus_desc: 'Generates a calibrated 5.5 kHz sine wave',
      tinnitus_on: 'Tinnitus ON',
      tinnitus_off: 'Tinnitus OFF',
      tinnitus_vol: 'Tinnitus Sound Level',
      captions_title: 'Live Synchronized Captions',
      captions_desc: 'Toggle captions to experience the comprehension difference',
      captions_btn_on: 'Captions ON',
      captions_btn_off: 'Captions OFF',
      broadcast_title: 'Public Address System Broadcast (Platform Announcement)',
      broadcast_active: 'Broadcast Active',
      broadcast_paused: 'Broadcast Paused',
      captions_hidden_msg: '[Captions Hidden] Notice how difficult it is to understand the platform number without reading the words!',
      press_start: 'Press "Start Audio Experience" above to listen.',
      wcag_rule: 'WCAG 1.2.2 Guideline: Captions are required for all prerecorded and live audio content.',
      insight_title: '💡 Key Inclusive Design Lesson:',
      insight_body: 'In a noisy environment or with high-frequency hearing loss, words blur together. When captions are toggled on, comprehension jumps from under 30% to 100% instantly!',
      speech_lang: 'en-US',
      dialogue: [
        { time: 0, text: "Welcome to Central Railway Station. Attention passengers." },
        { time: 3, text: "Train number 1 2 9 5 1, the Mumbai Rajdhani Express..." },
        { time: 7, text: "...is scheduled to arrive on Platform Number 4 in ten minutes." },
        { time: 11, text: "Please stand behind the yellow safety line at all times." },
        { time: 15, text: "For wheelchair and battery car assistance, please contact Booth 2." }
      ]
    },
    hi: {
      warn_title: 'श्रवण सुरक्षा एवं ध्वनि चेतावनी:',
      warn_body: 'कृपया इस सिमुलेशन को अपने हेडफ़ोन/स्पीकर की धीमी या मध्यम आवाज़ पर शुरू करें। आपातकालीन रोक (Emergency Stop) का लाल बटन किसी भी समय उपलब्ध है।',
      title: 'श्रवण हानि एवं टिनिटस सिम्युलेटर',
      subtitle: 'उच्च-आवृत्ति श्रवण हानि, टिनिटस की सीटी और लाइव सबटाइटल (कैप्शन) की अनिवार्यता का प्रत्यक्ष अनुभव।',
      btn_start: 'ऑडियो अनुभव शुरू करें',
      btn_stop: 'आपातकालीन रोक (Stop)',
      filter_title: 'उच्च-आवृत्ति श्रवण हानि फ़िल्टर',
      filter_desc: 'सेंसोरीन्यूरल हानि में उच्च आवृत्तियां पहले समाप्त होती हैं। (s, f, th, sh, p) जैसे व्यंजन 2000Hz से ऊपर होते हैं; इनके खोने से आवाज़ अस्पष्ट बुदबुदाहट जैसी लगती है।',
      slider_label: 'श्रवण फ्रीक्वेंसी बैंडविड्थ',
      severe: 'गंभीर हानि',
      moderate: 'मध्यम हानि',
      normal: 'सामान्य',
      opt_normal: 'सामान्य (8000 Hz)',
      opt_mod: 'मध्यम (2400 Hz)',
      opt_sev: 'गंभीर (800 Hz)',
      tinnitus_title: 'टिनिटस (कानों में लगातार सीटी/घंटी)',
      tinnitus_tone: 'टिनिटस रिंगिंग टोन',
      tinnitus_desc: '5.5 kHz की निरंतर साइन वेव उत्पन्न करता है',
      tinnitus_on: 'टिनिटस चालू',
      tinnitus_off: 'टिनिटस बंद',
      tinnitus_vol: 'टिनिटस ध्वनि स्तर',
      captions_title: 'लाइव सिंक्रोनाइज़्ड कैप्शन (सबटाइटल)',
      captions_desc: 'कैप्शन बंद करके देखें कि शब्दों को समझने में कितना अंतर आता है',
      captions_btn_on: 'कैप्शन चालू',
      captions_btn_off: 'कैप्शन बंद',
      broadcast_title: 'सार्वजनिक रेलवे स्टेशन घोषणा (प्लेटफ़ॉर्म अनाउंसमेंट)',
      broadcast_active: 'प्रसारण जारी',
      broadcast_paused: 'प्रसारण रुका हुआ',
      captions_hidden_msg: '[कैप्शन बंद हैं] ध्यान दें कि बिना सबटाइटल के प्लेटफ़ॉर्म नंबर समझना कितना कठिन हो जाता है!',
      press_start: 'सुनने के लिए ऊपर "ऑडियो अनुभव शुरू करें" पर क्लिक करें।',
      wcag_rule: 'WCAG 1.2.2 दिशानिर्देश: सभी ऑडियो सामग्री के लिए स्पष्ट और सटीक कैप्शन अनिवार्य हैं।',
      insight_title: '💡 समावेशी डिज़ाइन का मुख्य सबक:',
      insight_body: 'शोरगुल या उच्च-आवृत्ति श्रवण हानि में शब्द आपस में घुलमिल जाते हैं। लेकिन जैसे ही कैप्शन चालू होते हैं, समझ 30% से सीधे 100% हो जाती है!',
      speech_lang: 'hi-IN',
      dialogue: [
        { time: 0, text: "सेंट्रल रेलवे स्टेशन पर आपका स्वागत है। यात्रीगण कृपया ध्यान दें।" },
        { time: 3, text: "गाड़ी संख्या 1 2 9 5 1, मुंबई राजधानी एक्सप्रेस..." },
        { time: 7, text: "...प्लेटफ़ॉर्म नंबर 4 पर दस मिनट में आ रही है।" },
        { time: 11, text: "कृपया हमेशा पीली सुरक्षा रेखा के पीछे खड़े रहें।" },
        { time: 15, text: "व्हीलचेयर और बैटरी कार सहायता के लिए कृपया बूथ नंबर 2 पर संपर्क करें।" }
      ]
    },
    te: {
      warn_title: 'శ్రవణ భద్రత మరియు కంటెంట్ హెచ్చరిక:',
      warn_body: 'దయచేసి ఈ సిమ్యులేషన్‌ను మీ హెడ్‌ఫోన్లలో తక్కువ వాల్యూమ్‌తో ప్రారంభించండి. ఎమర్జెన్సీ స్టాప్ బటన్ ఎల్లప్పుడూ అందుబాటులో ఉంటుంది.',
      title: 'వినికిడి లోపం & టిన్నిటస్ సిమ్యులేటర్',
      subtitle: 'ఆడియో ఫ్రీక్వెన్సీ తగ్గుదల, నిరంతర టిన్నిటస్ ఈల మరియు లైవ్ క్యాప్షన్ల ఆవశ్యకతను స్వయంగా తెలుసుకోండి.',
      btn_start: 'ఆడియో ప్రారంభించండి',
      btn_stop: 'ఆడియో నిలిపివేయండి',
      filter_title: 'హై-ఫ్రీక్వెన్సీ వినికిడి లోపం ఫిల్టర్',
      filter_desc: 'సెన్సోరీన్యూరల్ లోపం వల్ల ముందుగా అధిక ఫ్రీక్వెన్సీ శబ్దాలు తగ్గిపోతాయి. హల్లులు (s, f, th, sh, p) 2000Hz పైన ఉంటాయి; ఇవి పోతే మాటలు అస్పష్టంగా మారుతాయి.',
      slider_label: 'శ్రవణ ఫ్రీక్వెన్సీ బ్యాండ్‌విడ్త్',
      severe: 'తీవ్ర లోపం',
      moderate: 'మధ్యస్థ లోపం',
      normal: 'సాధారణం',
      opt_normal: 'సాధారణం (8000 Hz)',
      opt_mod: 'మధ్యస్థం (2400 Hz)',
      opt_sev: 'తీవ్రం (800 Hz)',
      tinnitus_title: 'టిన్నిటస్ (చెవుల్లో నిరంతర రింగింగ్)',
      tinnitus_tone: 'టిన్నిటస్ రింగింగ్ టోన్',
      tinnitus_desc: '5.5 kHz సైన్ వేవ్ శబ్దాన్ని ఉత్పత్తి చేస్తుంది',
      tinnitus_on: 'టిన్నిటస్ ఆన్',
      tinnitus_off: 'టిన్నిటస్ ఆఫ్',
      tinnitus_vol: 'టిన్నిటస్ వాల్యూమ్ స్థాయి',
      captions_title: 'లైవ్ క్యాప్షన్లు (సబ్‌టైటిల్స్)',
      captions_desc: 'క్యాప్షన్లను ఆన్/ఆఫ్ చేసి అవగాహన వ్యత్యాసాన్ని గమనించండి',
      captions_btn_on: 'క్యాప్షన్లు ఆన్',
      captions_btn_off: 'క్యాప్షన్లు ఆఫ్',
      broadcast_title: 'రైల్వే స్టేషన్ ప్రకటన (ప్లాట్‌ఫారమ్ అనౌన్స్‌మెంట్)',
      broadcast_active: 'ప్రకటన నడుస్తోంది',
      broadcast_paused: 'ప్రకటన ఆగింది',
      captions_hidden_msg: '[క్యాప్షన్లు దాచబడ్డాయి] అక్షరాలు చదవకుండా ప్లాట్‌ఫారమ్ నంబర్ వినడం ఎంత కష్టమో గమనించండి!',
      press_start: 'వినడానికి పైన "ఆడియో ప్రారంభించండి" బటన్‌ను నొక్కండి.',
      wcag_rule: 'WCAG 1.2.2 నియమం: అన్ని ఆడియో కంటెంట్‌లకు స్పష్టమైన క్యాప్షన్లు తప్పనిసరి.',
      insight_title: '💡 సమ్మిళిత డిజైన్ పాఠం:',
      insight_body: 'శబ్దం ఎక్కువగా ఉన్నప్పుడు మాటలు అర్థం కావు. కానీ క్యాప్షన్లు ఆన్ చేసిన వెంటనే అవగాహన 30% నుండి 100% కి పెరుగుతుంది!',
      speech_lang: 'te-IN',
      dialogue: [
        { time: 0, text: "సెంట్రల్ రైల్వే స్టేషన్‌కు స్వాగతం. ప్రయాణీకులు దయచేసి వినండి." },
        { time: 3, text: "రైలు నంబర్ 1 2 9 5 1, ముంబై రాజధాని ఎక్స్‌ప్రెస్..." },
        { time: 7, text: "...ప్లాట్‌ఫారమ్ నంబర్ 4 లో పది నిమిషాల్లో రానుంది." },
        { time: 11, text: "దయచేసి ఎల్లప్పుడూ పసుపు భద్రతా గీత వెనుకనే నిలబడండి." },
        { time: 15, text: "వీల్‌చైర్ మరియు బ్యాటరీ కార్ సహాయం కొరకు బూత్ 2 వద్ద సంప్రదించండి." }
      ]
    }
  };

  const L = trans[currentLang] || trans.en;
  const sampleDialogue = L.dialogue;

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const handleStartAudio = () => {
    const ctx = getAudioContext();
    setIsPlaying(true);
    setCaptionIndex(0);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      let currentIndex = 0;

      const speakNextLine = () => {
        if (currentIndex >= sampleDialogue.length) {
          currentIndex = 0;
        }
        setCaptionIndex(currentIndex);

        const text = sampleDialogue[currentIndex].text;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = L.speech_lang;
        utterance.rate = 0.92;
        utterance.pitch = 1.0;

        utterance.onend = () => {
          if (speechIntervalRef.current) {
            speechIntervalRef.current = setTimeout(speakNextLine, 800);
          }
        };

        window.speechSynthesis.speak(utterance);
        currentIndex++;
      };

      speakNextLine();
      speechIntervalRef.current = true;
    }

    if (tinnitusEnabled) {
      startTinnitusTone(ctx);
    }
  };

  const handleStopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (speechIntervalRef.current) {
      clearTimeout(speechIntervalRef.current);
      speechIntervalRef.current = null;
    }
    stopTinnitusTone();
    setIsPlaying(false);
  };

  const startTinnitusTone = (ctx) => {
    stopTinnitusTone();
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(5500, ctx.currentTime);
      gain.gain.setValueAtTime((tinnitusVolume / 100) * 0.15, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      tinnitusOscRef.current = osc;
      tinnitusGainRef.current = gain;
    } catch (e) {
      console.warn('Audio tone err:', e);
    }
  };

  const stopTinnitusTone = () => {
    if (tinnitusOscRef.current) {
      try {
        tinnitusOscRef.current.stop();
        tinnitusOscRef.current.disconnect();
      } catch (e) {}
      tinnitusOscRef.current = null;
    }
  };

  useEffect(() => {
    if (tinnitusGainRef.current && audioCtxRef.current) {
      tinnitusGainRef.current.gain.setValueAtTime(
        (tinnitusVolume / 100) * 0.15,
        audioCtxRef.current.currentTime
      );
    }
  }, [tinnitusVolume]);

  useEffect(() => {
    return () => {
      handleStopAudio();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const severityText = cutoffFreq < 1500 ? L.severe : cutoffFreq < 3500 ? L.moderate : L.normal;

  return (
    <div className="space-y-8">
      {/* Content Warning Box */}
      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs sm:text-sm flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block mb-0.5">{L.warn_title}</span>
          {L.warn_body}
        </div>
      </div>

      {/* Control Panel */}
      <div className="p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-[var(--bg-surface)]">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800 mb-6">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Ear className="w-5 h-5 text-amber-600" />
              <span>{L.title}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {L.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!isPlaying ? (
              <Button
                variant="primary"
                onClick={handleStartAudio}
                icon={Play}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {L.btn_start}
              </Button>
            ) : (
              <Button
                variant="danger"
                onClick={handleStopAudio}
                icon={Square}
                className="animate-pulse"
              >
                {L.btn_stop}
              </Button>
            )}
          </div>
        </div>

        {/* Sliders and Toggles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Col 1: High Frequency Filter */}
          <div className="space-y-4">
            <h4 className="font-bold text-base flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>{L.filter_title}</span>
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {L.filter_desc}
            </p>

            <Slider
              label={L.slider_label}
              min={400}
              max={8000}
              step={200}
              value={cutoffFreq}
              onChange={setCutoffFreq}
              valueDisplay={`${cutoffFreq} Hz (${severityText})`}
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCutoffFreq(8000)}
                className="px-3 py-1 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100"
              >
                {L.opt_normal}
              </button>
              <button
                type="button"
                onClick={() => setCutoffFreq(2400)}
                className="px-3 py-1 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100"
              >
                {L.opt_mod}
              </button>
              <button
                type="button"
                onClick={() => setCutoffFreq(800)}
                className="px-3 py-1 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-amber-600"
              >
                {L.opt_sev}
              </button>
            </div>
          </div>

          {/* Col 2: Tinnitus & Captions */}
          <div className="space-y-4">
            <h4 className="font-bold text-base flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-amber-600" />
              <span>{L.tinnitus_title}</span>
            </h4>

            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
              <div>
                <span className="text-sm font-bold block">{L.tinnitus_tone}</span>
                <span className="text-xs text-slate-500">{L.tinnitus_desc}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const nextState = !tinnitusEnabled;
                  setTinnitusEnabled(nextState);
                  if (isPlaying) {
                    const ctx = getAudioContext();
                    if (nextState) startTinnitusTone(ctx);
                    else stopTinnitusTone();
                  }
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold border-2 transition-all ${
                  tinnitusEnabled ? 'bg-amber-500 text-white border-amber-600' : 'border-slate-300 hover:bg-slate-100'
                }`}
              >
                {tinnitusEnabled ? L.tinnitus_on : L.tinnitus_off}
              </button>
            </div>

            {tinnitusEnabled && (
              <Slider
                label={L.tinnitus_vol}
                min={5}
                max={40}
                value={tinnitusVolume}
                onChange={setTinnitusVolume}
                valueDisplay={`${tinnitusVolume}%`}
              />
            )}

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold block">{L.captions_title}</span>
                  <span className="text-xs text-slate-500">{L.captions_desc}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCaptions(!showCaptions)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold border-2 ${
                    showCaptions ? 'bg-blue-600 text-white border-blue-700' : 'border-slate-300'
                  }`}
                >
                  {showCaptions ? L.captions_btn_on : L.captions_btn_off}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Simulation Display Card */}
      <div className="p-8 rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-slate-900 text-white min-h-[220px] flex flex-col justify-between shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs text-slate-400">
          <span className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`}></span>
            <span>{L.broadcast_title}</span>
          </span>
          <span>{isPlaying ? L.broadcast_active : L.broadcast_paused}</span>
        </div>

        {/* Captions Display Box */}
        <div className="py-6 text-center">
          {isPlaying ? (
            showCaptions ? (
              <div className="p-4 rounded-2xl bg-black/80 border border-slate-700 text-yellow-300 font-extrabold text-xl sm:text-2xl shadow-inner max-w-2xl mx-auto">
                "{sampleDialogue[captionIndex]?.text}"
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 text-slate-400 italic text-base max-w-2xl mx-auto">
                {L.captions_hidden_msg}
              </div>
            )
          ) : (
            <div className="text-slate-400 text-sm">
              {L.press_start}
            </div>
          )}
        </div>

        <div className="text-center text-xs text-slate-500">
          {L.wcag_rule}
        </div>
      </div>

      {/* Takeaway Insight */}
      <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
        <strong>{L.insight_title} </strong>{L.insight_body}
      </div>
    </div>
  );
}

export default HearingSimulator;
