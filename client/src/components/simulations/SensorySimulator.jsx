import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle,
  VolumeX,
  Play,
  Square,
  Sparkles,
  Heart,
  ShieldCheck
} from 'lucide-react';
import Button from '../common/Button';

export function SensorySimulator() {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'en').split('-')[0];

  const [isRunning, setIsRunning] = useState(false);
  const [sensoryMode, setSensoryMode] = useState('overload'); // 'overload' vs 'calm'
  const [hasAcknowledgedWarning, setHasAcknowledgedWarning] = useState(false);

  const trans = {
    en: {
      warn_heading: 'Content & Sensory Sensitivity Advisory:',
      warn_body: 'This educational simulation demonstrates sensory hypersensitivity (intense auditory chatter, visual contrast shifts, and sensory crowding) experienced by many neurodivergent individuals on the autism spectrum.',
      warn_alert: '⚠️ If you have photosensitive epilepsy, migraines, or anxiety triggers, please proceed with caution or test the Sensory-Friendly mode instead.',
      warn_ack: 'I understand and wish to proceed with the educational simulation.',
      warn_popup: 'Please read and acknowledge the content warning first.',
      btn_overload: 'Sensory Overload Mode',
      btn_calm: '✨ Sensory-Friendly Calm Mode',
      btn_start: 'Start Sensory Demonstration',
      btn_stop: 'Immediate Emergency Stop',
      crowding_tag: '[Sensory Crowding in Progress]',
      overload_title: 'Cognitive Overload in a Crowded Supermarket',
      overload_body: 'Multiple background conversations overlap with grocery carts squeaking, scanner beeps echoing, and bright overhead fluorescent tubes flickering.',
      overload_note: 'When sensory processing differences exist, the brain cannot filter out the background noise—every sensory input competes for attention with equal intensity.',
      calm_badge: 'Sensory-Friendly Space',
      calm_title: 'Low-Stimulation, Predictable Environment',
      calm_body: 'Muted warm lighting, zero unexpected sounds or animated flashes, clean visual hierarchy, and predictable spacing allow the nervous system to relax and focus.',
      start_prompt: 'Acknowledge the content warning above and press "Start Sensory Demonstration".',
      insight_title: '💡 Key Inclusive Design Lesson:',
      insight_body: 'Autistic and neurodivergent individuals thrive when digital and physical environments provide "quiet hours", dark/muted themes, and no unexpected auto-playing sounds!'
    },
    hi: {
      warn_heading: 'संवेदी संवेदनशीलता एवं सामग्री परामर्श:',
      warn_body: 'यह शैक्षिक सिमुलेशन ऑटिज्म स्पेक्ट्रम पर कई न्यूरोडाइवर्जेंट व्यक्तियों द्वारा अनुभव की जाने वाली संवेदी अतिसंवेदनशीलता (तीव्र शोर, रोशनी के झटके और संवेदी भीड़) को दर्शाता है।',
      warn_alert: '⚠️ यदि आपको प्रकाश संवेदी मिर्गी, माइग्रेन या घबराहट की समस्या है, तो कृपया सावधानी बरतें या इसके स्थान पर संवेदी-अनुकूल शांत मोड का परीक्षण करें।',
      warn_ack: 'मैं समझता/समझती हूँ और इस शैक्षिक सिमुलेशन को आगे बढ़ाना चाहता/चाहती हूँ।',
      warn_popup: 'कृपया पहले सामग्री चेतावनी को पढ़ें और स्वीकार करें।',
      btn_overload: 'संवेदी अधिभार (Overload) मोड',
      btn_calm: '✨ संवेदी-अनुकूल शांत (Calm) मोड',
      btn_start: 'संवेदी प्रदर्शन शुरू करें',
      btn_stop: 'आपातकालीन रोक (Emergency Stop)',
      crowding_tag: '[संवेदी भीड़ जारी है]',
      overload_title: 'भीड़भाड़ वाले सुपरमार्केट में संज्ञानात्मक अधिभार',
      overload_body: 'ग्राहकों की कई बातचीत, ट्रॉलियों की आवाज, स्कैनर की बीप और छत पर टिमटिमाती फ्लोरोसेंट ट्यूब लाइटें एक साथ दिमाग पर हावी होती हैं।',
      overload_note: 'संवेदी प्रसंस्करण भिन्नता होने पर मस्तिष्क पृष्ठभूमि के शोर को फ़िल्टर नहीं कर पाता—प्रत्येक इनपुट समान तीव्रता से ध्यान खींचने की कोशिश करता है।',
      calm_badge: 'संवेदी-अनुकूल स्थान',
      calm_title: 'कम उत्तेजक, निश्चित एवं शांत वातावरण',
      calm_body: 'मद्धम रोशनी, कोई अप्रत्याशित तेज़ आवाज़ या चमक नहीं, और साफ़ लेआउट तंत्रिका तंत्र को तनावमुक्त और एकाग्र होने में मदद करता है।',
      start_prompt: 'ऊपर दी गई चेतावनी को स्वीकार करें और "संवेदी प्रदर्शन शुरू करें" पर क्लिक करें।',
      insight_title: '💡 समावेशी डिज़ाइन का मुख्य सबक:',
      insight_body: 'ऑटिस्टिक व्यक्ति तब सबसे अच्छा कार्य करते हैं जब डिजिटल और भौतिक वातावरण में शांत थीम, कम शोर और बिना अनुमति स्वतः बजने वाली आवाज़ें न हों!'
    },
    te: {
      warn_heading: 'కంటెంట్ & సెన్సరీ సున్నితత్వ సలహా:',
      warn_body: 'ఈ విద్యా సిమ్యులేషన్ ఆటిజం ఉన్నవారు ఎదుర్కొనే ఇంద్రియాల సున్నితత్వాన్ని (తీవ్రమైన శబ్దాలు, విపరీతమైన వెలుగులు) తెలియజేస్తుంది.',
      warn_alert: '⚠️ మీకు మైగ్రేన్ లేదా తీవ్రమైన ఆందోళన వంటి సమస్యలు ఉంటే దయచేసి జాగ్రత్త వహించండి లేదా సెన్సరీ-ఫ్రెండ్లీ కామ్ మోడ్‌ను పరీక్షించండి.',
      warn_ack: 'నేను అర్థం చేసుకున్నాను మరియు ఈ ప్రదర్శనను చూడాలనుకుంటున్నాను.',
      warn_popup: 'దయచేసి ముందుగా హెచ్చరికను చదివి అంగీకరించండి.',
      btn_overload: 'సెన్సరీ ఓవర్‌లోడ్ మోడ్',
      btn_calm: '✨ సెన్సరీ ఫ్రెండ్లీ కామ్ మోడ్',
      btn_start: 'ప్రదర్శన ప్రారంభించండి',
      btn_stop: 'అత్యవసర స్టాప్ (Stop)',
      crowding_tag: '[ఇంద్రియాల రద్దీ నడుస్తోంది]',
      overload_title: 'రద్దీగా ఉండే మార్కెట్లో మానసిక ఒత్తిడి',
      overload_body: 'ప్రజల మాటలు, బండ్ల శబ్దాలు, స్కానర్ల బీప్‌లు మరియు మెరిసే లైట్లు ఒకేసారి మెదడుపై తీవ్ర ఒత్తిడిని కలిగిస్తాయి.',
      overload_note: 'సెన్సరీ వ్యత్యాసాలు ఉన్నప్పుడు మెదడు వెనుక శబ్దాలను విస్మరించలేదు—ప్రతి చిన్న శబ్దం ఒకే తీవ్రతతో వినిపిస్తుంది.',
      calm_badge: 'ప్రశాంతమైన సెన్సరీ స్పేస్',
      calm_title: 'తక్కువ ఉద్రిక్తత, ప్రశాంతమైన వాతావరణం',
      calm_body: 'మృదువైన వెలుతురు, ఆకస్మిక శబ్దాలు లేకపోవడం మరియు స్పష్టమైన లేఅవుట్ నాడీ వ్యవస్థను ప్రశాంతపరుస్తాయి.',
      start_prompt: 'పై హెచ్చరికను అంగీకరించి "ప్రదర్శన ప్రారంభించండి" బటన్ నొక్కండి.',
      insight_title: '💡 సమ్మిళిత డిజైన్ పాఠం:',
      insight_body: 'డిజిటల్ వెబ్‌సైట్లలో ఆటోమేటిక్ సౌండ్లు లేకుండా మరియు ప్రశాంతమైన రంగులు వాడినప్పుడు న్యూరోడైవర్జెంట్ వ్యక్తులు ఎంతో సౌకర్యంగా ఉంటారు!'
    }
  };

  const L = trans[currentLang] || trans.en;

  useEffect(() => {
    return () => {
      setIsRunning(false);
    };
  }, []);

  const handleStart = () => {
    if (!hasAcknowledgedWarning) {
      alert(L.warn_popup);
      return;
    }
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  return (
    <div className="space-y-8">
      {/* Mandatory Safety Content Warning */}
      <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-200">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h4 className="font-extrabold text-base">
              {L.warn_heading}
            </h4>
            <p className="text-xs sm:text-sm leading-relaxed">
              {L.warn_body}
            </p>
            <p className="text-xs font-bold text-red-600 dark:text-red-400">
              {L.warn_alert}
            </p>

            <label className="flex items-center gap-2 mt-3 cursor-pointer">
              <input
                type="checkbox"
                checked={hasAcknowledgedWarning}
                onChange={(e) => setHasAcknowledgedWarning(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 border-amber-400 focus:ring-amber-500"
              />
              <span className="text-xs font-bold">
                {L.warn_ack}
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Control Actions */}
      <div className="p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-[var(--bg-surface)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSensoryMode('overload')}
            className={`px-4 py-2 rounded-xl text-xs font-bold border-2 ${
              sensoryMode === 'overload'
                ? 'border-rose-600 bg-rose-50 text-rose-900 ring-2 ring-rose-300'
                : 'border-slate-300'
            }`}
          >
            {L.btn_overload}
          </button>

          <button
            type="button"
            onClick={() => setSensoryMode('calm')}
            className={`px-4 py-2 rounded-xl text-xs font-bold border-2 ${
              sensoryMode === 'calm'
                ? 'border-teal-600 bg-teal-50 text-teal-900 ring-2 ring-teal-300'
                : 'border-slate-300'
            }`}
          >
            {L.btn_calm}
          </button>
        </div>

        <div>
          {!isRunning ? (
            <Button
              variant="primary"
              onClick={handleStart}
              icon={Play}
              disabled={!hasAcknowledgedWarning}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {L.btn_start}
            </Button>
          ) : (
            <Button
              variant="danger"
              onClick={handleStop}
              icon={Square}
              className="animate-pulse"
            >
              {L.btn_stop}
            </Button>
          )}
        </div>
      </div>

      {/* Sensory Viewport */}
      <div
        className={`relative min-h-[380px] rounded-3xl border-4 overflow-hidden shadow-2xl p-8 sm:p-12 transition-all duration-300 ${
          isRunning && sensoryMode === 'overload'
            ? 'border-rose-500 bg-slate-900 text-white'
            : sensoryMode === 'calm'
            ? 'border-teal-400 bg-teal-950/20 text-slate-800 dark:text-slate-200'
            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200'
        }`}
      >
        {isRunning && sensoryMode === 'overload' ? (
          <div className="space-y-6 relative">
            <div className="absolute top-0 right-4 p-3 rounded-xl bg-amber-400 text-black font-extrabold text-xs shadow-lg animate-bounce">
              ⚡ CLOCK TICKING LOUDLY: TICK... TICK... TICK...
            </div>
            <div className="absolute bottom-2 left-6 p-2 rounded-xl bg-red-600 text-white font-bold text-xs shadow animate-pulse">
              FLUORESCENT LIGHT BUZZING: BZZZZZZZZZZZZ
            </div>

            <div className="max-w-xl mx-auto space-y-4">
              <span className="text-rose-400 font-mono text-xs uppercase tracking-widest block">
                {L.crowding_tag}
              </span>
              <h4 className="text-2xl font-extrabold text-rose-300">
                {L.overload_title}
              </h4>
              <p className="text-sm sm:text-base leading-relaxed text-slate-300">
                {L.overload_body}
              </p>
              <div className="p-4 rounded-xl bg-black/60 border border-rose-500/50 text-xs text-rose-200 font-mono">
                {L.overload_note}
              </div>
            </div>
          </div>
        ) : sensoryMode === 'calm' ? (
          <div className="max-w-xl mx-auto space-y-4 text-center py-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{L.calm_badge}</span>
            </span>
            <h4 className="text-2xl font-bold text-teal-900 dark:text-teal-200">
              {L.calm_title}
            </h4>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {L.calm_body}
            </p>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            {L.start_prompt}
          </div>
        )}
      </div>

      {/* Respectful Note */}
      <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
        <strong>{L.insight_title} </strong>{L.insight_body}
      </div>
    </div>
  );
}

export default SensorySimulator;
