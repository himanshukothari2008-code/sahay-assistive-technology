import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Activity,
  RotateCcw,
  Target,
  CheckCircle,
  XCircle,
  Sliders,
  Award,
  MousePointer
} from 'lucide-react';
import Slider from '../common/Slider';
import Button from '../common/Button';

export function MotorTremorSimulator() {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'en').split('-')[0];

  const [tremorIntensity, setTremorIntensity] = useState(50);
  const [targetSize, setTargetSize] = useState('small'); // 'small' (20px) vs 'accessible' (48px)
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [targets, setTargets] = useState([
    { id: 1, x: 20, y: 30, hit: false },
    { id: 2, x: 70, y: 25, hit: false },
    { id: 3, x: 45, y: 65, hit: false },
    { id: 4, x: 80, y: 70, hit: false },
    { id: 5, x: 15, y: 75, hit: false }
  ]);

  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [jitterOffset, setJitterOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const trans = {
    en: {
      title: 'Motor Tremor & Target Precision Challenge',
      subtitle: 'Experience the frustration of involuntary muscle tremors when clicking tiny web buttons.',
      reset: 'Reset Targets',
      slider_label: 'Tremor Involuntary Jitter',
      severe: 'Severe',
      moderate: 'Moderate',
      mild: 'Mild',
      btn_size_comp: 'Button Size Comparison (WCAG 2.2 AA):',
      tiny_btn: 'Tiny Target (20px - Inaccessible)',
      accessible_btn: 'Accessible Target (48px - WCAG AA)',
      targets_hit: 'Targets Hit:',
      missed_clicks: 'Missed Clicks:',
      all_hit: '🎉 All targets hit! Now try with Tiny Targets.',
      instruction: 'Click the numbers 1 through 5. Your cursor suffers from simulated involuntary tremor.',
      insight_title: '💡 Key Inclusive Design Lesson:',
      insight_body: 'Notice how many times you accidentally missed the 20px button compared to the 48px button! This is why WCAG 2.2 explicitly mandates a minimum touch target size of 44x44 CSS pixels.'
    },
    hi: {
      title: 'मोटर कंपन (ट्रेमर) एवं लक्ष्य सटीकता चुनौती',
      subtitle: 'वेबसाइटों पर छोटे बटनों को क्लिक करते समय हाथ के अनैच्छिक कंपन की कठिनाई को महसूस करें।',
      reset: 'लक्ष्य रीसेट करें',
      slider_label: 'कंपन (जिटर) की तीव्रता',
      severe: 'अत्यधिक',
      moderate: 'मध्यम',
      mild: 'हल्का',
      btn_size_comp: 'बटन आकार तुलना (WCAG 2.2 AA):',
      tiny_btn: 'अत्यंत छोटा बटन (20px - असुगम्य)',
      accessible_btn: 'सुगम्य बड़ा बटन (48px - WCAG AA)',
      targets_hit: 'सफल क्लिक:',
      missed_clicks: 'चूके हुए क्लिक:',
      all_hit: '🎉 सभी 5 लक्ष्य पूरे हुए! अब छोटे बटनों के साथ प्रयास करें।',
      instruction: '1 से 5 तक के नंबरों पर क्लिक करें। आपका माउस कर्सर कंपन से प्रभावित है।',
      insight_title: '💡 समावेशी डिज़ाइन का मुख्य सबक:',
      insight_body: 'ध्यान दें कि 48px के बड़े बटन की तुलना में 20px के छोटे बटन पर कितने गलत क्लिक हुए! यही कारण है कि WCAG 2.2 कम से कम 44x44 पिक्सल टच टारगेट अनिवार्य करता है।'
    },
    te: {
      title: 'మోటారు వణుకు (ట్రెమర్) & ఖచ్చితత్వ సవాలు',
      subtitle: 'చిన్న వెబ్ బటన్లను క్లిక్ చేసేటప్పుడు చేతి వణుకు వల్ల కలిగే అసౌకర్యాన్ని అనుభవించండి.',
      reset: 'రీసెట్ చేయండి',
      slider_label: 'వణుకు తీవ్రత స్థాయి',
      severe: 'తీవ్రం',
      moderate: 'మధ్యస్థం',
      mild: 'స్వల్పం',
      btn_size_comp: 'బటన్ పరిమాణ పోలిక (WCAG 2.2 AA):',
      tiny_btn: 'చిన్న బటన్ (20px - ఇబ్బందికరం)',
      accessible_btn: 'సుగమ్య బటన్ (48px - సౌకర్యవంతం)',
      targets_hit: 'విజయవంతమైన క్లిక్‌లు:',
      missed_clicks: 'తప్పిపోయిన క్లిక్‌లు:',
      all_hit: '🎉 అన్ని లక్ష్యాలు పూర్తయ్యాయి! ఇప్పుడు చిన్న బటన్లతో ప్రయత్నించండి.',
      instruction: '1 నుండి 5 వరకు సంఖ్యలను క్లిక్ చేయండి. మీ మౌస్ కర్జర్ వణుకుతోంది.',
      insight_title: '💡 సమ్మిళిత డిజైన్ పాఠం:',
      insight_body: '48px బటన్ కంటే 20px చిన్న బటన్ పై క్లిక్ చేయడం ఎంత కష్టమో గమనించండి! అందుకే WCAG 2.2 కనీసం 44x44 పిక్సెల్స్ పరిమాణాన్ని నిర్దేశిస్తుంది.'
    }
  };

  const L = trans[currentLang] || trans.en;

  useEffect(() => {
    let animationFrame;
    let t = 0;

    const animateTremor = () => {
      t += 0.15;
      const factor = tremorIntensity / 100;
      const jx = (Math.sin(t * 8) * 12 + Math.cos(t * 14) * 8 + (Math.random() - 0.5) * 10) * factor;
      const jy = (Math.cos(t * 9) * 12 + Math.sin(t * 13) * 8 + (Math.random() - 0.5) * 10) * factor;

      setJitterOffset({ x: jx, y: jy });
      animationFrame = requestAnimationFrame(animateTremor);
    };

    animationFrame = requestAnimationFrame(animateTremor);
    return () => cancelAnimationFrame(animationFrame);
  }, [tremorIntensity]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleBoxClick = (e) => {
    if (e.target === containerRef.current) {
      setMisses((prev) => prev + 1);
    }
  };

  const handleTargetClick = (targetId, e) => {
    e.stopPropagation();
    setTargets((prev) =>
      prev.map((t) => (t.id === targetId ? { ...t, hit: true } : t))
    );
    setScore((prev) => prev + 1);
  };

  const handleReset = () => {
    setScore(0);
    setMisses(0);
    setTargets([
      { id: 1, x: 20, y: 30, hit: false },
      { id: 2, x: 70, y: 25, hit: false },
      { id: 3, x: 45, y: 65, hit: false },
      { id: 4, x: 80, y: 70, hit: false },
      { id: 5, x: 15, y: 75, hit: false }
    ]);
  };

  const severityText = tremorIntensity > 60 ? L.severe : tremorIntensity > 30 ? L.moderate : L.mild;

  return (
    <div className="space-y-8">
      {/* Controls Bar */}
      <div className="p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-[var(--bg-surface)]">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              <span>{L.title}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {L.subtitle}
            </p>
          </div>

          <Button variant="ghost" size="sm" onClick={handleReset} icon={RotateCcw}>
            {L.reset}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Slider
              label={L.slider_label}
              value={tremorIntensity}
              onChange={setTremorIntensity}
              valueDisplay={`${tremorIntensity}% (${severityText})`}
            />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              {L.btn_size_comp}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setTargetSize('small'); handleReset(); }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 ${
                  targetSize === 'small'
                    ? 'border-red-600 bg-red-50 text-red-900 ring-2 ring-red-300'
                    : 'border-slate-300'
                }`}
              >
                {L.tiny_btn}
              </button>
              <button
                type="button"
                onClick={() => { setTargetSize('accessible'); handleReset(); }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 ${
                  targetSize === 'accessible'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-300'
                    : 'border-slate-300'
                }`}
              >
                {L.accessible_btn}
              </button>
            </div>
          </div>
        </div>

        {/* Live Scorecard */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> {L.targets_hit} {score} / 5
            </span>
            <span className="font-bold text-red-500 flex items-center gap-1">
              <XCircle className="w-4 h-4" /> {L.missed_clicks} {misses}
            </span>
          </div>

          {score === 5 && (
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
              {L.all_hit}
            </span>
          )}
        </div>
      </div>

      {/* Interactive Target Canvas */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onClick={handleBoxClick}
        className="relative h-96 rounded-3xl border-4 border-slate-400 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 overflow-hidden shadow-2xl cursor-none select-none"
      >
        <div className="absolute top-3 left-4 text-xs font-bold text-slate-500 pointer-events-none">
          {L.instruction}
        </div>

        {/* Target Buttons */}
        {targets.map((t) => {
          const isSmall = targetSize === 'small';
          const sizePx = isSmall ? '24px' : '48px';

          return (
            <button
              key={t.id}
              type="button"
              onClick={(e) => !t.hit && handleTargetClick(t.id, e)}
              disabled={t.hit}
              style={{
                left: `${t.x}%`,
                top: `${t.y}%`,
                width: sizePx,
                height: sizePx
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full font-extrabold flex items-center justify-center transition-transform shadow-lg ${
                t.hit
                  ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-default scale-90'
                  : isSmall
                  ? 'bg-red-600 hover:bg-red-700 text-white text-xs ring-2 ring-red-300'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white text-base ring-4 ring-emerald-300'
              }`}
            >
              {t.hit ? '✓' : t.id}
            </button>
          );
        })}

        {/* Tremor Jittered Cursor Crosshair */}
        <div
          className="absolute pointer-events-none z-30 transition-transform duration-75"
          style={{
            left: `${cursorPos.x + jitterOffset.x}px`,
            top: `${cursorPos.y + jitterOffset.y}px`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="relative">
            <MousePointer className="w-6 h-6 text-blue-600 fill-blue-600 drop-shadow-md" />
            <div className="w-12 h-12 -translate-x-3 -translate-y-6 rounded-full border-2 border-dashed border-red-500/60 pointer-events-none animate-spin" />
          </div>
        </div>
      </div>

      {/* Takeaway Insight */}
      <div className="p-5 rounded-2xl bg-emerald-50/80 dark:bg-slate-800/80 border border-emerald-200 dark:border-slate-700 text-xs sm:text-sm text-emerald-950 dark:text-slate-300">
        <strong>{L.insight_title} </strong>{L.insight_body}
      </div>
    </div>
  );
}

export default MotorTremorSimulator;
