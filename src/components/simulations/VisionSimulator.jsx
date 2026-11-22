import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Eye,
  RotateCcw,
  Sliders,
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import Slider from '../common/Slider';
import Button from '../common/Button';

export function VisionSimulator() {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'en').split('-')[0];

  const [condition, setCondition] = useState('none');
  const [severity, setSeverity] = useState(70);
  const [activeTab, setActiveTab] = useState('webpage'); // 'webpage' | 'chart'

  const resetSimulation = () => {
    setCondition('none');
    setSeverity(70);
  };

  const getSimStyle = () => {
    const factor = severity / 100;

    switch (condition) {
      case 'cataracts':
        return {
          filter: `blur(${factor * 5}px) contrast(${1 - factor * 0.4}) brightness(${1 + factor * 0.2})`,
        };
      case 'glaucoma':
        const tunnelRadius = Math.max(15, 60 - factor * 45);
        return {
          maskImage: `radial-gradient(circle at center, black ${tunnelRadius}%, rgba(0,0,0,0.1) ${tunnelRadius + 15}%, transparent ${tunnelRadius + 25}%)`,
          WebkitMaskImage: `radial-gradient(circle at center, black ${tunnelRadius}%, rgba(0,0,0,0.1) ${tunnelRadius + 15}%, transparent ${tunnelRadius + 25}%)`
        };
      case 'macular':
        const spotRadius = Math.max(10, factor * 35);
        return {
          maskImage: `radial-gradient(circle at center, transparent 0%, transparent ${spotRadius * 0.6}%, rgba(0,0,0,0.85) ${spotRadius}%, black ${spotRadius + 20}%)`,
          WebkitMaskImage: `radial-gradient(circle at center, transparent 0%, transparent ${spotRadius * 0.6}%, rgba(0,0,0,0.85) ${spotRadius}%, black ${spotRadius + 20}%)`
        };
      case 'protanopia':
        return { filter: 'url(#protanopia-filter)' };
      case 'deuteranopia':
        return { filter: 'url(#deuteranopia-filter)' };
      case 'tritanopia':
        return { filter: 'url(#tritanopia-filter)' };
      case 'achromatopsia':
        return { filter: `grayscale(${factor * 100}%)` };
      default:
        return {};
    }
  };

  const transData = {
    en: {
      title: 'Interactive Vision & Color Blindness Simulator',
      subtitle: 'Select an optical condition below to apply real-time filters onto the sample interface.',
      reset: 'Reset Filter',
      grp_low_vision: 'Low Vision & Optical Conditions:',
      grp_cvd: 'Color Vision Deficiencies (CVD):',
      cond_none: 'Clear Vision (Normal)',
      cond_cataracts: 'Cataracts (Blur & Glare)',
      cond_glaucoma: 'Glaucoma (Tunnel Vision)',
      cond_macular: 'Macular Degeneration (Central Blindness)',
      cond_protanopia: 'Protanopia (Red-Blind)',
      cond_deuteranopia: 'Deuteranopia (Green-Blind)',
      cond_tritanopia: 'Tritanopia (Blue-Yellow Blind)',
      cond_achromatopsia: 'Achromatopsia (Total Monochrome)',
      severity_label: 'Condition Severity',
      desc_none: 'Standard 20/20 vision without filters. Select a condition above to begin.',
      desc_cataracts: 'Clouding of the natural lens causing blurry vision, faded colors, and increased glare sensitivity.',
      desc_glaucoma: 'Optic nerve damage causing loss of peripheral (side) vision, resulting in extreme "tunnel vision".',
      desc_macular: 'Deterioration of central retina causing a blurry or dark blind spot right where the person is looking.',
      desc_protanopia: 'Red-blind color vision deficiency. Red colors appear dark brown or green; difficulty telling red from green.',
      desc_deuteranopia: 'Green-blind color vision deficiency (most common). Greens appear beige/khaki; reds appear brownish-yellow.',
      desc_tritanopia: 'Blue-blind color vision deficiency. Difficulty distinguishing blues from greens, and yellows from violets.',
      desc_achromatopsia: 'Total color blindness. The world is seen strictly in shades of grey, with heightened light sensitivity.',
      preview_heading: 'Live Preview Target (Filter Applied in Real-Time):',
      tab_doc: 'Document View',
      tab_chart: 'Color Chart View',
      portal_title: 'City Hospital Patient Portal',
      presc_ready: 'Prescription Ready',
      alert_title: 'Urgent Medication Alert:',
      alert_body: 'Please take Tablet A (Red Capsule) twice daily before food. Do not confuse with Tablet B (Green Capsule).',
      tab_a_title: 'Tablet A (Red)',
      tab_a_time: 'Morning 8:00 AM',
      tab_b_title: 'Tablet B (Green)',
      tab_b_time: 'Night 9:00 PM',
      appt_info: 'Appointment scheduled with Dr. Sharma for Monday at 10:30 AM in Room 304, Third Floor.',
      emergency_info: 'Important: Dial 108 for ambulance emergency assistance.'
    },
    hi: {
      title: 'इंटरैक्टिव दृष्टि व वर्णांधता सिम्युलेटर',
      subtitle: 'नमूना दस्तावेज़ पर वास्तविक समय में फ़िल्टर देखने के लिए नीचे दी गई स्थिति चुनें।',
      reset: 'फ़िल्टर रीसेट करें',
      grp_low_vision: 'अल्प दृष्टि एवं नेत्र स्थितियां:',
      grp_cvd: 'वर्णांधता (कलर विज़न डेफिशिएंसी - CVD):',
      cond_none: 'सामान्य दृष्टि (Normal)',
      cond_cataracts: 'मोतियाबिंद (धुंधलापन व चमक)',
      cond_glaucoma: 'ग्लूकोमा (टनल विज़न)',
      cond_macular: 'मैक्यूलर डिजनरेशन (केंद्रीय अंध बिंदु)',
      cond_protanopia: 'प्रोटानोपिया (लाल वर्णांधता)',
      cond_deuteranopia: 'ड्यूटेरानोपिया (हरी वर्णांधता)',
      cond_tritanopia: 'ट्राइटानोपिया (नीली-पीली वर्णांधता)',
      cond_achromatopsia: 'एक्रोमैटोप्सिया (पूर्ण रंग अंधता)',
      severity_label: 'स्थिति की तीव्रता',
      desc_none: 'बिना किसी फ़िल्टर के सामान्य 20/20 दृष्टि। शुरू करने के लिए ऊपर से कोई स्थिति चुनें।',
      desc_cataracts: 'प्राकृतिक लेंस का धुंधलापन जिससे दृष्टि धुंधली, रंग फीके और तेज़ चमक में परेशानी होती है।',
      desc_glaucoma: 'ऑप्टिक तंत्रिका की क्षति जिससे परिधीय (किनारों की) दृष्टि समाप्त होकर केवल संकीर्ण टनल विज़न बचती है।',
      desc_macular: 'रेटिना के केंद्र का क्षरण जिससे ठीक सामने काला या विकृत अंध बिंदु बन जाता है।',
      desc_protanopia: 'लाल रंग की पहचान न होना। लाल रंग गहरा भूरा या हरा दिखता है; लाल और हरे में अंतर कठिन होता है।',
      desc_deuteranopia: 'हरे रंग की पहचान न होना (सबसे आम)। हरा रंग खाकी और लाल रंग भूरा-पीला दिखाई देता है।',
      desc_tritanopia: 'नीले-पीले रंग का अंधापन। नीले व हरे, तथा पीले व बैंगनी रंगों में अंतर करने में कठिनाई।',
      desc_achromatopsia: 'पूर्ण वर्णांधता। दुनिया केवल श्वेत-श्याम (ग्रेस्केल) रंगों में दिखती है, प्रकाश के प्रति संवेदनशीलता बढ़ जाती है।',
      preview_heading: 'लाइव पूर्वावलोकन (रियल-टाइम में फ़िल्टर लागू):',
      tab_doc: 'दस्तावेज़ देखें',
      tab_chart: 'रंग चार्ट देखें',
      portal_title: 'नगर अस्पताल - रोगी स्वास्थ्य पोर्टल',
      presc_ready: 'दवा पर्चा तैयार है',
      alert_title: 'महत्वपूर्ण दवा चेतावनी:',
      alert_body: 'कृपया गोली A (लाल कैप्सूल) दिन में दो बार भोजन से पहले लें। गोली B (हरे कैप्सूल) के साथ इसे न मिलाएं।',
      tab_a_title: 'गोली A (लाल)',
      tab_a_time: 'सुबह 8:00 बजे',
      tab_b_title: 'गोली B (हरा)',
      tab_b_time: 'रात 9:00 बजे',
      appt_info: 'डॉ. शर्मा के साथ अपॉइंटमेंट सोमवार सुबह 10:30 बजे, कमरा 304, तीसरी मंजिल पर निर्धारित है।',
      emergency_info: 'महत्वपूर्ण: आपातकालीन एम्बुलेंस सहायता के लिए 108 डायल करें।'
    },
    te: {
      title: 'ఇంటరాక్టివ్ దృష్టి & రంగు అంధత్వం సిమ్యులేటర్',
      subtitle: 'స్క్రీన్‌పై రియల్-టైమ్ ఫిల్టర్లను పరీక్షించడానికి క్రింది దృష్టి లోపాలను ఎంచుకోండి.',
      reset: 'రీసెట్ చేయండి',
      grp_low_vision: 'తక్కువ దృష్టి మరియు కంటి పరిస్థితులు:',
      grp_cvd: 'రంగు అంధత్వం (CVD లోపాలు):',
      cond_none: 'సాధారణ దృష్టి (Normal)',
      cond_cataracts: 'శుక్లాలు (మసక & కాంతి)',
      cond_glaucoma: 'గ్లాకోమా (టన్నెల్ విజన్)',
      cond_macular: 'మ్యాక్యులర్ డీజెనరేషన్ (కేంద్ర మచ్చ)',
      cond_protanopia: 'ప్రొటానోపియా (ఎరుపు అంధత్వం)',
      cond_deuteranopia: 'డ్యూటెరానోపియా (ఆకుపచ్చ అంధత్వం)',
      cond_tritanopia: 'ట్రిటానోపియా (నీలం-పసుపు అంధత్వం)',
      cond_achromatopsia: 'ఎక్రోమాటోప్సియా (పూర్తి నలుపు-తెలుపు)',
      severity_label: 'తీవ్రత స్థాయి',
      desc_none: 'ఎలాంటి ఫిల్టర్లు లేని సాధారణ 20/20 దృష్టి. ప్రారంభించడానికి పై వర్గాన్ని ఎంచుకోండి.',
      desc_cataracts: 'లెన్స్ మసకబారడం వల్ల దృష్టి అస్పష్టంగా కనిపించడం మరియు అధిక కాంతిని తట్టుకోలేకపోవడం.',
      desc_glaucoma: 'పరిధీయ దృష్టి కోల్పోవడం వల్ల కేవలం మధ్యలో మాత్రమే కనిపించే టన్నెల్ విజన్.',
      desc_macular: 'రెటీనా మధ్య భాగం దెబ్బతినడం వల్ల నేరుగా చూసే చోట నల్లటి మచ్చ ఏర్పడటం.',
      desc_protanopia: 'ఎరుపు రంగు లోపం. ఎరుపు రంగు ముదురు గోధుమ లేదా ఆకుపచ్చగా కనిపిస్తుంది.',
      desc_deuteranopia: 'ఆకుపచ్చ రంగు లోపం (అత్యంత సాధారణం). ఆకుపచ్చ రంగులు లేత పసుపు రంగులో కనిపిస్తాయి.',
      desc_tritanopia: 'నీలం-పసుపు రంగుల మధ్య తేడాలను గుర్తించలేకపోవడం.',
      desc_achromatopsia: 'సంపూర్ణ రంగు అంధత్వం. ప్రపంచం మొత్తం కేవలం నలుపు, తెలుపు, బూడిద రంగుల్లోనే కనిపిస్తుంది.',
      preview_heading: 'లైవ్ ప్రివ్యూ (నిజ-సమయంలో వర్తించే ఫిల్టర్లు):',
      tab_doc: 'డాక్యుమెంట్ ప్రివ్యూ',
      tab_chart: 'రంగుల చార్ట్',
      portal_title: 'సిటీ హాస్పిటల్ పేషెంట్ పోర్టల్',
      presc_ready: 'ప్రిస్క్రిప్షన్ సిద్ధంగా ఉంది',
      alert_title: 'అత్యవసర మందుల హెచ్చరిక:',
      alert_body: 'దయచేసి టాబ్లెట్ A (ఎరుపు క్యాప్సూల్) భోజనానికి ముందు రోజుకు రెండుసార్లు తీసుకోండి. టాబ్లెట్ B (ఆకుపచ్చ) తో పొరబడకండి.',
      tab_a_title: 'టాబ్లెట్ A (ఎరుపు)',
      tab_a_time: 'ఉదయం 8:00 గంటలకు',
      tab_b_title: 'టాబ్లెట్ B (ఆకుపచ్చ)',
      tab_b_time: 'రాత్రి 9:00 గంటలకు',
      appt_info: 'సోమవారం ఉదయం 10:30 గంటలకు డాక్టర్ శర్మతో రూమ్ 304 లో అపాయింట్‌మెంట్ నిర్ణయించబడింది.',
      emergency_info: 'ముఖ్య గమనిక: అంబులెన్స్ అత్యవసర సహాయం కొరకు 108 కు డయల్ చేయండి.'
    }
  };

  const L = transData[currentLang] || transData.en;

  const lowVisionConditions = [
    { id: 'none', label: L.cond_none },
    { id: 'cataracts', label: L.cond_cataracts },
    { id: 'glaucoma', label: L.cond_glaucoma },
    { id: 'macular', label: L.cond_macular }
  ];

  const cvdConditions = [
    { id: 'protanopia', label: L.cond_protanopia },
    { id: 'deuteranopia', label: L.cond_deuteranopia },
    { id: 'tritanopia', label: L.cond_tritanopia },
    { id: 'achromatopsia', label: L.cond_achromatopsia }
  ];

  const currentDesc = L[`desc_${condition}`] || L.desc_none;

  return (
    <div className="space-y-8">
      {/* Hidden SVG Color Matrix Filters */}
      <svg className="hidden" aria-hidden="true">
        <defs>
          <filter id="protanopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.567, 0.433, 0, 0, 0
                      0.558, 0.442, 0, 0, 0
                      0, 0.242, 0.758, 0, 0
                      0, 0, 0, 1, 0"
            />
          </filter>
          <filter id="deuteranopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.625, 0.375, 0, 0, 0
                      0.7, 0.3, 0, 0, 0
                      0, 0.3, 0.7, 0, 0
                      0, 0, 0, 1, 0"
            />
          </filter>
          <filter id="tritanopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.95, 0.05, 0, 0, 0
                      0, 0.433, 0.567, 0, 0
                      0, 0.475, 0.525, 0, 0
                      0, 0, 0, 1, 0"
            />
          </filter>
        </defs>
      </svg>

      {/* Simulator Control Header */}
      <div className="p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-[var(--bg-surface)]">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              <span>{L.title}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {L.subtitle}
            </p>
          </div>

          <Button variant="ghost" size="sm" onClick={resetSimulation} icon={RotateCcw}>
            {L.reset}
          </Button>
        </div>

        {/* Condition Selector Chips */}
        <div className="space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              {L.grp_low_vision}
            </span>
            <div className="flex flex-wrap gap-2">
              {lowVisionConditions.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCondition(c.id)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold border-2 transition-all touch-target ${
                    condition === c.id
                      ? 'border-blue-600 bg-blue-50 text-blue-900 dark:bg-blue-900/60 dark:text-blue-100 ring-2 ring-blue-300'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              {L.grp_cvd}
            </span>
            <div className="flex flex-wrap gap-2">
              {cvdConditions.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCondition(c.id)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold border-2 transition-all touch-target ${
                    condition === c.id
                      ? 'border-purple-600 bg-purple-50 text-purple-900 dark:bg-purple-900/60 dark:text-purple-100 ring-2 ring-purple-300'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Severity Slider (if condition selected) */}
          {condition !== 'none' && !['protanopia', 'deuteranopia', 'tritanopia'].includes(condition) && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 max-w-md">
              <Slider
                label={L.severity_label}
                value={severity}
                onChange={setSeverity}
                valueDisplay={`${severity}%`}
              />
            </div>
          )}

          {/* Description of current condition */}
          <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-slate-800/80 border border-blue-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5 capitalize">{condition.replace('-', ' ')}</span>
              {currentDesc}
            </div>
          </div>
        </div>
      </div>

      {/* Simulation Viewport */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
            {L.preview_heading}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('webpage')}
              className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                activeTab === 'webpage' ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-300'
              }`}
            >
              {L.tab_doc}
            </button>
            <button
              onClick={() => setActiveTab('chart')}
              className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                activeTab === 'chart' ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-300'
              }`}
            >
              {L.tab_chart}
            </button>
          </div>
        </div>

        <div className="rounded-2xl border-4 border-slate-400 dark:border-slate-700 overflow-hidden shadow-2xl relative bg-slate-900 min-h-[360px]">
          {/* Simulated Screen with Filters */}
          <div
            style={getSimStyle()}
            className="p-8 bg-white text-slate-900 transition-all duration-300 min-h-[360px]"
          >
            {activeTab === 'webpage' ? (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                      H
                    </div>
                    <span className="font-bold text-lg">{L.portal_title}</span>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    {L.presc_ready}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm">
                  <strong>{L.alert_title}</strong> {L.alert_body}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-red-100 border-2 border-red-500 text-red-900 text-center">
                    <span className="font-bold block">{L.tab_a_title}</span>
                    <span className="text-xs">{L.tab_a_time}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-green-100 border-2 border-green-500 text-green-900 text-center">
                    <span className="font-bold block">{L.tab_b_title}</span>
                    <span className="text-xs">{L.tab_b_time}</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-slate-700">
                  <p>{L.appt_info}</p>
                  <p className="text-xs text-slate-500">{L.emergency_info}</p>
                </div>
              </div>
            ) : (
              <div className="max-w-xl mx-auto space-y-6 text-center">
                <h4 className="font-bold text-lg">Ishihara-Style Color Contrast Palette</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div className="h-20 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold">Red</div>
                  <div className="h-20 rounded-xl bg-green-600 text-white flex items-center justify-center font-bold">Green</div>
                  <div className="h-20 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">Blue</div>
                  <div className="h-20 rounded-xl bg-yellow-400 text-black flex items-center justify-center font-bold">Yellow</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VisionSimulator;
