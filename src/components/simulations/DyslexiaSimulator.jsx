import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BookOpen,
  RotateCcw,
  Sparkles,
  Sliders,
  Eye,
  CheckCircle2,
  Maximize2
} from 'lucide-react';
import Slider from '../common/Slider';
import Toggle from '../common/Toggle';
import Button from '../common/Button';

export function DyslexiaSimulator() {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'en').split('-')[0];

  const [severity, setSeverity] = useState(60);
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [readingRuler, setReadingRuler] = useState(true);
  const [expandedSpacing, setExpandedSpacing] = useState(false);
  const [isSimulating, setIsSimulating] = useState(true);
  const [rulerTop, setRulerTop] = useState(120);

  const containerRef = useRef(null);

  const trans = {
    en: {
      title: 'Dyslexia Letter-Jitter & Reading Accommodation Simulator',
      subtitle: 'Demonstrates letter inversion, positional swapping, and how assistive accommodations restore reading ease.',
      active: 'ACTIVE',
      paused: 'PAUSED',
      intensity_label: 'Letter Shifting Intensity',
      try_accommodations: 'Try Assistive Accommodations:',
      ruler_label: 'Reading Ruler Overlay',
      ruler_desc: 'Isolates single line of text under your mouse',
      ruler_tag: 'Reading Ruler',
      font_label: 'Dyslexia Font (Lexend)',
      font_desc: 'Heavy bottom-weighted letters',
      spacing_label: 'Expanded Line & Word Spacing',
      spacing_desc: 'Prevents visual crowding',
      guide_mouse: 'Move your mouse over the reading area to guide the reading ruler',
      font_active: 'Lexend Font Active',
      font_standard: 'Standard Sans Active',
      insight_title: '💡 Key Inclusive Design Lesson:',
      insight_body: 'Notice how turning on the Reading Ruler and Dyslexia Font instantly anchors the eye. Simple CSS typography rules make reading accessible for millions of neurodivergent individuals!',
      text: 'Dyslexia is a neurobiological learning difference that affects how the brain processes written symbols and phonological sounds. It is entirely unrelated to intelligence or intellectual capability. For a person with dyslexia, letters can seem to dance, reverse, swap positions, or crowd together on the page. Simple accommodations such as heavier bottom-weighted fonts, generous line spacing, and a focused reading ruler drastically reduce visual crowding and cognitive fatigue.'
    },
    hi: {
      title: 'डिस्लेक्सिया पठन एवं जिटर सिम्युलेटर',
      subtitle: 'अक्षरों के उलटने, क्रम बदलने और रीडिंग रूलर द्वारा पठन सुगमता बहाल करने का प्रत्यक्ष अनुभव।',
      active: 'सक्रिय',
      paused: 'विराम',
      intensity_label: 'अक्षर विस्थापन की तीव्रता',
      try_accommodations: 'सहायक सुविधाओं को आज़माएं:',
      ruler_label: 'रीडिंग रूलर ओवरले',
      ruler_desc: 'माउस के नीचे केवल एक पंक्ति पर ध्यान केंद्रित करता है',
      ruler_tag: 'रीडिंग रूलर',
      font_label: 'डिस्लेक्सिया-अनुकूल फ़ॉन्ट (Lexend)',
      font_desc: 'नीचे से भारी संतुलित अक्षर',
      spacing_label: 'विस्तृत पंक्ति एवं शब्द रिक्ति',
      spacing_desc: 'अक्षरों को आपस में उलझने से रोकता है',
      guide_mouse: 'रीडिंग रूलर को चलाने के लिए माउस को टेक्स्ट पर घुमाएं',
      font_active: 'Lexend फ़ॉन्ट सक्रिय',
      font_standard: 'सामान्य फ़ॉन्ट सक्रिय',
      insight_title: '💡 समावेशी डिज़ाइन का मुख्य सबक:',
      insight_body: 'देखें कि रीडिंग रूलर और खुला फ़ॉन्ट चालू करते ही आंखों को कितना ठहराव मिलता है। सरल CSS टाइपोग्राफी नियमों से पढ़ना लाखों लोगों के लिए सुगम बन जाता है!',
      text: 'डिस्लेक्सिया मस्तिष्क द्वारा लिखित अक्षरों और ध्वनियों को संसाधित करने के तरीके में एक स्वाभाविक भिन्नता है। इसका व्यक्ति की बुद्धिमत्ता या बौद्धिक क्षमता से कोई संबंध नहीं है। डिस्लेक्सिया से प्रभावित व्यक्ति के लिए स्क्रीन पर अक्षर नाचते, उल्टे होते या आपस में उलझते हुए प्रतीत हो सकते हैं। नीचे से भारी फ़ॉन्ट, खुली पंक्ति रिक्ति और रीडिंग रूलर जैसी सरल सुविधाएं इस पठन तनाव को पूरी तरह कम कर देती हैं।'
    },
    te: {
      title: 'డైస్లెక్సియా లెటర్-జిట్టర్ & రీడింగ్ సిమ్యులేటర్',
      subtitle: 'అక్షరాలు తారుమారవ్వడం మరియు రీడింగ్ రూలర్ ద్వారా చదవడం ఎంత సులభమో పరీక్షించండి.',
      active: 'యాక్టివ్',
      paused: 'ఆగింది',
      intensity_label: 'అక్షరాల కదలికల తీవ్రత',
      try_accommodations: 'సహాయక సాధనాలను పరీక్షించండి:',
      ruler_label: 'రీడింగ్ రూలర్ ఓవర్‌లే',
      ruler_desc: 'మౌస్ ఉన్న సింగిల్ లైన్ పై మాత్రమే దృష్టి పెడుతుంది',
      ruler_tag: 'రీడింగ్ రూలర్',
      font_label: 'డైస్లెక్సియా ఫాంట్ (Lexend)',
      font_desc: 'అక్షరాలు స్పష్టంగా కనిపించేలా దిగువ బరువున్న ఫాంట్',
      spacing_label: 'విశాలమైన లైన్ & పదాల స్పేసింగ్',
      spacing_desc: 'అక్షరాలు ఒకదానిపై ఒకటి పడకుండా నిరోధిస్తుంది',
      guide_mouse: 'రూలర్‌ను నడపడానికి మౌస్‌ను పేరాగ్రాఫ్‌పై కదపండి',
      font_active: 'Lexend ఫాంట్ యాక్టివ్',
      font_standard: 'సాధారణ ఫాంట్',
      insight_title: '💡 సమ్మిళిత డిజైన్ పాఠం:',
      insight_body: 'రీడింగ్ రూలర్ మరియు సరైన ఫాంట్ ఆన్ చేయగానే చదవడం ఎంత తేలికవుతుందో గమనించండి. సరైన CSS నియమాలు లక్షలాది మందికి చదువును సులభతరం చేస్తాయి!',
      text: 'డైస్లెక్సియా అనేది మెదడు లిఖిత చిహ్నాలు మరియు శబ్దాలను ప్రాసెస్ చేసే విధానంలో ఉండే సహజమైన వ్యత్యాసం. దీనికి తెలివితేటలతో ఎలాంటి సంబంధం లేదు. డైస్లెక్సియా ఉన్న వ్యక్తులకు పేజీపై అక్షరాలు కదులుతున్నట్లు, స్థానాలు మారుతున్నట్లు లేదా ఒకదానిపై ఒకటి పడుతున్నట్లు అనిపిస్తాయి. ప్రత్యేక ఫాంట్లు, లైన్ స్పేసింగ్ మరియు రీడింగ్ రూలర్ వంటి సహాయక ఉపయోగాలు చదవడంలో అలసటను తగ్గిస్తాయి.'
    }
  };

  const L = trans[currentLang] || trans.en;
  const baseText = L.text;

  const [scrambledWords, setScrambledWords] = useState(baseText.split(' '));

  useEffect(() => {
    setScrambledWords(baseText.split(' '));
  }, [baseText]);

  useEffect(() => {
    if (!isSimulating || severity === 0) {
      setScrambledWords(baseText.split(' '));
      return;
    }

    const intervalTime = Math.max(120, 500 - severity * 4);

    const interval = setInterval(() => {
      const words = baseText.split(' ');
      const probability = severity / 100;

      const newWords = words.map((word) => {
        if (word.length <= 3 || Math.random() > probability) return word;

        const chars = word.split('');
        const midIdx = Math.floor(Math.random() * (chars.length - 2)) + 1;
        const targetIdx = midIdx + 1 < chars.length - 1 ? midIdx + 1 : midIdx - 1;

        if (targetIdx > 0 && targetIdx < chars.length - 1) {
          const temp = chars[midIdx];
          chars[midIdx] = chars[targetIdx];
          chars[targetIdx] = temp;
        }

        return chars.join('');
      });

      setScrambledWords(newWords);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isSimulating, severity, baseText]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    if (relativeY >= 0 && relativeY <= rect.height) {
      setRulerTop(relativeY);
    }
  };

  return (
    <div className="space-y-8">
      {/* Controls Bar */}
      <div className="p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-[var(--bg-surface)]">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span>{L.title}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {L.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
              isSimulating ? 'bg-indigo-600 text-white border-indigo-700' : 'border-slate-300'
            }`}
          >
            {isSimulating ? L.active : L.paused}
          </button>
        </div>

        {/* Accommodation Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <Slider
              label={L.intensity_label}
              value={severity}
              onChange={setSeverity}
              valueDisplay={`${severity}%`}
              disabled={!isSimulating}
            />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              {L.try_accommodations}
            </span>
            <Toggle
              label={L.ruler_label}
              description={L.ruler_desc}
              checked={readingRuler}
              onChange={setReadingRuler}
            />
          </div>

          <div className="space-y-2 pt-4 md:pt-0">
            <Toggle
              label={L.font_label}
              description={L.font_desc}
              checked={dyslexicFont}
              onChange={setDyslexicFont}
            />
            <Toggle
              label={L.spacing_label}
              description={L.spacing_desc}
              checked={expandedSpacing}
              onChange={setExpandedSpacing}
            />
          </div>
        </div>
      </div>

      {/* Interactive Reading Viewport with Optional Reading Ruler */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span>{L.guide_mouse}</span>
          <span>{dyslexicFont ? L.font_active : L.font_standard}</span>
        </div>

        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          className={`relative p-8 sm:p-12 rounded-3xl border-4 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xl overflow-hidden min-h-[300px] cursor-pointer select-none transition-all ${
            dyslexicFont ? 'font-dyslexic' : ''
          }`}
          style={{
            lineHeight: expandedSpacing ? 2.4 : 1.7,
            letterSpacing: expandedSpacing ? '0.08em' : 'normal',
            wordSpacing: expandedSpacing ? '0.2em' : 'normal'
          }}
        >
          {/* Dynamic Reading Ruler Overlay */}
          {readingRuler && (
            <div
              className="absolute left-0 right-0 pointer-events-none transition-transform duration-75"
              style={{
                top: `${rulerTop - 25}px`,
                height: '50px',
                background: 'rgba(254, 240, 138, 0.35)',
                borderTop: '2px solid rgba(234, 179, 8, 0.8)',
                borderBottom: '2px solid rgba(234, 179, 8, 0.8)',
                boxShadow: '0 0 20px rgba(0,0,0,0.1)'
              }}
            >
              <span className="absolute right-3 top-1 text-[10px] font-mono font-bold text-amber-800 bg-yellow-200/80 px-2 py-0.5 rounded">
                {L.ruler_tag}
              </span>
            </div>
          )}

          {/* Text paragraph with animated word changes */}
          <p className="text-xl sm:text-2xl font-medium max-w-3xl mx-auto">
            {scrambledWords.map((word, idx) => (
              <span key={idx} className="inline-block mr-2 transition-all duration-150">
                {word}
              </span>
            ))}
          </p>
        </div>
      </div>

      {/* Takeaway Insight */}
      <div className="p-5 rounded-2xl bg-indigo-50/80 dark:bg-slate-800/80 border border-indigo-200 dark:border-slate-700 text-xs sm:text-sm text-indigo-950 dark:text-slate-300">
        <strong>{L.insight_title} </strong>{L.insight_body}
      </div>
    </div>
  );
}

export default DyslexiaSimulator;
