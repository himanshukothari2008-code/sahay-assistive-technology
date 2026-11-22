import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Zap,
  Bell,
  Eye,
  CheckCircle2,
  X,
  Sparkles,
  Sliders
} from 'lucide-react';
import Button from '../common/Button';

export function ADHDSimulator() {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'en').split('-')[0];

  const [mode, setMode] = useState('distracted'); // 'distracted' vs 'focus'
  const [distractionCount, setDistractionCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');
  const [comprehensionChecked, setComprehensionChecked] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const trans = {
    en: {
      title: 'ADHD Cognitive Overwhelm vs Focus Mode',
      subtitle: 'Compare your reading comprehension in a noisy digital environment versus a decluttered focus reader.',
      btn_distracted: 'Distraction Mode',
      btn_focus: '✨ Focus Mode',
      desc_distracted: 'Distraction Mode: Animated side notifications, visual noise, and attention interruptions.',
      desc_focus: 'Focus Mode: Minimal layout, subdued lighting, and zero external motion.',
      banner_ad: '🔥 SPECIAL OFFER: CLICK HERE TO WIN A FREE TABLET! 10 SECONDS LEFT! 🔥',
      focus_badge: 'Focus Reader Mode Active • Distractions Blocked',
      article_title: 'The Deep Ocean Ecosystem: The Abyssal Zone',
      article_p1: 'The abyssal zone extends from 4,000 meters down to 6,000 meters below the ocean surface. It is perpetually shrouded in total darkness and experiences pressures exceeding 600 atmospheres.',
      article_p2: 'Despite these extreme pressures, fascinating bioluminescent organisms thrive here, relying heavily on marine snow—organic debris falling from the upper water layers—as their primary nutrient source.',
      quiz_heading: 'Quick Comprehension Check:',
      quiz_prompt: 'What is the primary nutrient source for organisms in the abyssal zone?',
      opt_algae: 'Sunlight & surface algae',
      opt_snow: 'Marine snow (organic debris)',
      opt_volcano: 'Thermal volcanic lava',
      quiz_correct: '✓ Correct! Marine snow provides the primary nutrients.',
      quiz_wrong: '✗ Incorrect. Notice how much harder it was to retain information with notifications popping up!',
      notifications: [
        "🔔 WhatsApp: Hey, are you free this evening?!",
        "⚡ Breaking News: Space mission launch delayed!",
        "SALE: 50% off on all sneakers today only!",
        "⚠️ System: You have 14 tabs open in background",
        "📩 Email: Meeting rescheduled to 4:00 PM"
      ]
    },
    hi: {
      title: 'एडीएचडी ध्यान भटकाव बनाम फोकस मोड',
      subtitle: 'शोरगुल वाले डिजिटल वातावरण और शांत फोकस रीडर के बीच अपने पठन ध्यान की तुलना करें।',
      btn_distracted: 'ध्यान भटकाव मोड',
      btn_focus: '✨ फोकस मोड',
      desc_distracted: 'भटकाव मोड: अचानक आने वाले नोटिफिकेशन, विचलित करने वाले विज्ञापन और ध्यान का बिखराव।',
      desc_focus: 'फोकस मोड: सरल लेआउट, शांत रोशनी और अनावश्यक मोशन से पूरी तरह मुक्त।',
      banner_ad: '🔥 बंपर छूट: मुफ़्त टैबलेट जीतने के लिए यहाँ क्लिक करें! केवल 10 सेकंड शेष! 🔥',
      focus_badge: 'फोकस रीडर मोड सक्रिय • सभी भटकाव अवरुद्ध',
      article_title: 'गहरे समुद्र का पारिस्थितिकी तंत्र: एबिसल ज़ोन',
      article_p1: 'एबिसल ज़ोन समुद्र की सतह से 4,000 मीटर से 6,000 मीटर नीचे तक फैला हुआ है। यह क्षेत्र हमेशा पूर्ण अंधकार में रहता है और यहाँ का जल दबाव 600 वायुमंडल से अधिक होता है।',
      article_p2: 'इस अत्यधिक दबाव के बावजूद, कई जैव-संदीप्ति (बायोल्यूमिनसेंट) जीव यहाँ जीवित रहते हैं, जो मुख्य रूप से "समुद्री हिम" (ऊपरी जल परतों से गिरने वाले जैविक मलबे) पर निर्भर करते हैं।',
      quiz_heading: 'त्वरित पठन बोध परीक्षण:',
      quiz_prompt: 'एबिसल ज़ोन के जीवों का प्राथमिक पोषक स्रोत क्या है?',
      opt_algae: 'सूर्य का प्रकाश और शैवाल',
      opt_snow: 'समुद्री हिम (ऊपर से गिरने वाला जैविक मलबा)',
      opt_volcano: 'ज्वालामुखी का गर्म लावा',
      quiz_correct: '✓ सही उत्तर! समुद्री हिम प्राथमिक पोषक तत्व प्रदान करता है।',
      quiz_wrong: '✗ गलत उत्तर। ध्यान दें कि नोटिफिकेशन पॉप-अप होने पर जानकारी याद रखना कितना कठिन हो जाता है!',
      notifications: [
        "🔔 व्हाट्सएप: अरे, क्या तुम आज शाम खाली हो?!",
        "⚡ ताज़ा ख़बर: अंतरिक्ष मिशन का प्रक्षेपण टला!",
        "बंपर छूट: केवल आज सभी जूतों पर 50% छूट!",
        "⚠️ सिस्टम: बैकग्राउंड में 14 टैब खुले हैं",
        "📩 ईमेल: बैठक का समय बदलकर 4:00 PM कर दिया गया है"
      ]
    },
    te: {
      title: 'ADHD దృష్టి కేంద్రీకరణ వర్సెస్ గందరగోళం',
      subtitle: 'అనేక నోటిఫికేషన్లు ఉన్నప్పుడు మరియు ప్రశాంతమైన ఫోకస్ రీడర్‌లో చదవడం మధ్య వ్యత్యాసాన్ని చూడండి.',
      btn_distracted: 'గందరగోళ మోడ్',
      btn_focus: '✨ ఫోకస్ మోడ్',
      desc_distracted: 'గందరగోళ మోడ్: స్క్రీన్‌పై పాప్-అప్స్, రంగురంగుల బ్యానర్లు మరియు దృష్టి చెదిరిపోవడం.',
      desc_focus: 'ఫోకస్ మోడ్: ఎటువంటి ప్రకటనలు లేని ప్రశాంతమైన డిజిటల్ స్క్రీన్.',
      banner_ad: '🔥 బంపర్ ఆఫర్: ఉచిత టాబ్లెట్ గెలవడానికి ఇప్పుడే క్లిక్ చేయండి! 10 సెకన్లు మాత్రమే! 🔥',
      focus_badge: 'ఫోకస్ రీడర్ మోడ్ యాక్టివ్ • అన్ని పాప్-అప్స్ నిలిపివేయబడ్డాయి',
      article_title: 'లోతైన సముద్ర పర్యావరణ వ్యవస్థ: అబిసల్ జోన్',
      article_p1: 'అబిసల్ జోన్ సముద్ర మట్టానికి 4,000 మీటర్ల నుండి 6,000 మీటర్ల లోతు వరకు విస్తరించి ఉంది. ఇది ఎల్లప్పుడూ పూర్తి చీకటిలో ఉంటుంది మరియు ఇక్కడ నీటి పీడనం చాలా తీవ్రంగా ఉంటుంది.',
      article_p2: 'ఇంత తీవ్రమైన పరిస్థితుల్లో కూడా అనేక జీవులు ఇక్కడ జీవిస్తాయి, ఇవి పై నీటి పొరల నుండి రాలిపడే సేంద్రీయ పదార్థాలపై (మెరైన్ స్నో) ఆధారపడి ఉంటాయి.',
      quiz_heading: 'త్వరిత అవగాహన పరీక్ష:',
      quiz_prompt: 'అబిసల్ జోన్ లోని జీవులకు ప్రధాన ఆహార వనరు ఏది?',
      opt_algae: 'సూర్యరశ్మి మరియు నాచు',
      opt_snow: 'మెరైన్ స్నో (పైనుండి రాలే సేంద్రీయ వ్యర్థాలు)',
      opt_volcano: 'అగ్నిపర్వత లావా',
      quiz_correct: '✓ సరైన సమాధానం! మెరైన్ స్నో ప్రధాన ఆహారంగా ఉపయోగపడుతుంది.',
      quiz_wrong: '✗ తప్పు సమాధానం. నోటిఫికేషన్లు వస్తున్నప్పుడు చదివిన విషయాన్ని గుర్తుంచుకోవడం ఎంత కష్టమో గమనించండి!',
      notifications: [
        "🔔 వాట్సాప్: హాయ్, ఈ సాయంత్రం ఖాళీగా ఉన్నారా?!",
        "⚡ తాజా వార్త: అంతరిక్ష ప్రయోగం వాయిదా!",
        "ఆఫర్: కేవలం ఈ రోజే షూస్ పై 50% తగ్గింపు!",
        "⚠️ సిస్టమ్: బ్యాక్‌గ్రౌండ్‌లో 14 ట్యాబ్‌లు తెరిచి ఉన్నాయి",
        "📩 ఈమెయిల్: మీటింగ్ సమయం సాయంత్రం 4:00 కి మార్చబడింది"
      ]
    }
  };

  const L = trans[currentLang] || trans.en;
  const notifications = L.notifications;

  useEffect(() => {
    if (mode !== 'distracted') {
      setShowNotification(false);
      return;
    }

    const interval = setInterval(() => {
      const randMsg = notifications[Math.floor(Math.random() * notifications.length)];
      setNotificationMsg(randMsg);
      setShowNotification(true);
      setDistractionCount((prev) => prev + 1);

      setTimeout(() => setShowNotification(false), 3500);
    }, 4000);

    return () => clearInterval(interval);
  }, [mode, notifications]);

  return (
    <div className="space-y-8">
      {/* Control Switcher */}
      <div className="p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-[var(--bg-surface)]">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span>{L.title}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {L.subtitle}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setMode('distracted'); setComprehensionChecked(false); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold border-2 ${
                mode === 'distracted'
                  ? 'border-red-500 bg-red-50 text-red-900 ring-2 ring-red-300'
                  : 'border-slate-300'
              }`}
            >
              {L.btn_distracted}
            </button>
            <button
              type="button"
              onClick={() => { setMode('focus'); setComprehensionChecked(false); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold border-2 ${
                mode === 'focus'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-300'
                  : 'border-slate-300'
              }`}
            >
              {L.btn_focus}
            </button>
          </div>
        </div>

        <div className="text-xs text-slate-500">
          {mode === 'distracted' ? L.desc_distracted : L.desc_focus}
        </div>
      </div>

      {/* Reading Viewport */}
      <div className="relative min-h-[380px] rounded-3xl border-4 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden shadow-xl p-8 sm:p-12">
        {/* Distraction Mode Overlays */}
        {mode === 'distracted' && (
          <>
            {/* Blinking Top Ad Banner */}
            <div className="mb-6 p-3 rounded-xl bg-gradient-to-r from-red-500 to-amber-500 text-white font-extrabold text-xs text-center animate-pulse">
              {L.banner_ad}
            </div>

            {/* Simulated Push Notification Popup */}
            {showNotification && (
              <div className="absolute top-8 right-6 z-30 p-4 rounded-xl bg-slate-900 text-white border-2 border-amber-400 shadow-2xl max-w-xs animate-bounce">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold">{notificationMsg}</span>
                  <button onClick={() => setShowNotification(false)} className="text-slate-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Focus Mode Clean Badge */}
        {mode === 'focus' && (
          <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{L.focus_badge}</span>
          </div>
        )}

        {/* The Reading Article */}
        <article className="max-w-2xl mx-auto space-y-4 text-slate-800 dark:text-slate-200">
          <h4 className="text-2xl font-bold tracking-tight">
            {L.article_title}
          </h4>
          <p className="text-base sm:text-lg leading-relaxed">
            {L.article_p1}
          </p>
          <p className="text-base sm:text-lg leading-relaxed">
            {L.article_p2}
          </p>
        </article>

        {/* Quick Comprehension Check */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 max-w-2xl mx-auto">
          <h5 className="font-bold text-sm mb-3">{L.quiz_heading}</h5>
          <p className="text-xs text-slate-500 mb-3">
            {L.quiz_prompt}
          </p>

          <div className="flex flex-wrap gap-2">
            {[
              { id: 'algae', label: L.opt_algae, correct: false },
              { id: 'snow', label: L.opt_snow, correct: true },
              { id: 'volcano', label: L.opt_volcano, correct: false }
            ].map((ans) => (
              <button
                key={ans.id}
                type="button"
                onClick={() => { setSelectedAnswer(ans.id); setComprehensionChecked(true); }}
                className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                  selectedAnswer === ans.id
                    ? ans.correct
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-900'
                      : 'bg-red-100 border-red-500 text-red-900'
                    : 'border-slate-300'
                }`}
              >
                {ans.label}
              </button>
            ))}
          </div>

          {comprehensionChecked && (
            <div className={`mt-3 text-xs font-bold ${selectedAnswer === 'snow' ? 'text-emerald-600' : 'text-red-500'}`}>
              {selectedAnswer === 'snow' ? L.quiz_correct : L.quiz_wrong}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ADHDSimulator;
