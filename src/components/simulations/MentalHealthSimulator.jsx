import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Heart,
  Wind,
  ShieldAlert,
  PhoneCall,
  CheckCircle,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  FileText,
  Printer,
  Info,
  Smile,
  Compass
} from 'lucide-react';
import Button from '../common/Button';

export function MentalHealthSimulator() {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'en').split('-')[0];

  const [activeTool, setActiveTool] = useState('grounding'); // 'grounding', 'breathing', 'card'
  const [groundingStep, setGroundingStep] = useState(0); // 0 to 4
  const [completedGrounding, setCompletedGrounding] = useState([false, false, false, false, false]);

  // Breathing Pacer State
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState('Inhale'); // 'Inhale', 'Hold', 'Exhale', 'Hold'
  const [breathCount, setBreathCount] = useState(4);
  const [isAudioChime, setIsAudioChime] = useState(true);

  // Emergency Card State
  const [cardData, setCardData] = useState({
    name: 'Priya Sharma',
    condition: 'Anxiety & Sensory Overload',
    emergencyContact: 'Rohan Sharma (+91 98765-43210)',
    doctorContact: 'Dr. V. Mehta (Psychiatrist, +91 91234-56789)',
    whatHelps: 'Give me personal space, speak in a gentle tone, dim harsh lights, offer water.',
    whatAvoid: 'Do not grab me, do not crowd around me, avoid loud sudden sirens.',
    medications: 'Prescribed SOS as needed in pouch.'
  });

  // Sound generator using Web Audio API for grounding and breathing
  const audioCtxRef = useRef(null);

  const playChime = (freq = 432, duration = 0.8) => {
    if (!isAudioChime) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtxRef.current = new AudioContext();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);

      gain.gain.setValueAtTime(0.001, audioCtxRef.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.2, audioCtxRef.current.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);

      osc.start();
      osc.stop(audioCtxRef.current.currentTime + duration + 0.05);
    } catch (e) {
      // AudioContext policy
    }
  };

  // Breathing Pacer Cycle (Box Breathing: 4-4-4-4)
  useEffect(() => {
    if (!isBreathingActive) return;

    const interval = setInterval(() => {
      setBreathCount((prev) => {
        if (prev > 1) {
          return prev - 1;
        } else {
          // Switch phase
          setBreathPhase((currentPhase) => {
            if (currentPhase === 'Inhale') {
              playChime(528, 0.6); // Solfeggio 528Hz
              return 'Hold 1';
            } else if (currentPhase === 'Hold 1') {
              playChime(396, 0.6);
              return 'Exhale';
            } else if (currentPhase === 'Exhale') {
              playChime(432, 0.6); // 432Hz grounding
              return 'Hold 2';
            } else {
              playChime(528, 0.6);
              return 'Inhale';
            }
          });
          return 4;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isBreathingActive, isAudioChime]);

  const groundingSteps = [
    {
      num: 5,
      sense: t('sim_mh.step5_sense', 'SEE'),
      title: t('sim_mh.step5_title', 'Acknowledge 5 things you can SEE around you'),
      desc: t('sim_mh.step5_desc', 'Look for small details: the corner of a table, the color of a pen, light reflection, a ceiling pattern, or a shadow.'),
      items: [
        t('sim_mh.s5_1', 'A soft patch of light or shadow'),
        t('sim_mh.s5_2', 'A distinct color in your room'),
        t('sim_mh.s5_3', 'The edges of a desk or screen'),
        t('sim_mh.s5_4', 'A plant, leaf, or picture frame'),
        t('sim_mh.s5_5', 'Your own fingers or clothing texture')
      ]
    },
    {
      num: 4,
      sense: t('sim_mh.step4_sense', 'TOUCH'),
      title: t('sim_mh.step4_title', 'Acknowledge 4 things you can physically FEEL'),
      desc: t('sim_mh.step4_desc', 'Focus on tactile physical touch: the firm ground beneath your feet, the fabric of your sleeves, or the coolness of a desk.'),
      items: [
        t('sim_mh.s4_1', 'Feet resting firmly on the solid floor'),
        t('sim_mh.s4_2', 'The texture of cloth against your skin'),
        t('sim_mh.s4_3', 'The smooth surface of a desk or chair'),
        t('sim_mh.s4_4', 'The temperature of the air on your hands')
      ]
    },
    {
      num: 3,
      sense: t('sim_mh.step3_sense', 'HEAR'),
      title: t('sim_mh.step3_title', 'Acknowledge 3 distinct sounds you can HEAR'),
      desc: t('sim_mh.step3_desc', 'Listen closely past your racing thoughts: distant traffic, computer fan hum, distant voices, or your own slow breath.'),
      items: [
        t('sim_mh.s3_1', 'Gentle hum of air or background electronics'),
        t('sim_mh.s3_2', 'Distant street or outdoor ambient sounds'),
        t('sim_mh.s3_3', 'The rhythmic sound of your own steady breathing')
      ]
    },
    {
      num: 2,
      sense: t('sim_mh.step2_sense', 'SMELL'),
      title: t('sim_mh.step2_title', 'Acknowledge 2 scents you can SMELL'),
      desc: t('sim_mh.step2_desc', 'Notice the air around you: coffee, soap, rain, fresh fabric, or take a gentle slow breath through your nose.'),
      items: [
        t('sim_mh.s2_1', 'Fresh air, coffee aroma, or pleasant scent in the room'),
        t('sim_mh.s2_2', 'Clean fabric of your clothing')
      ]
    },
    {
      num: 1,
      sense: t('sim_mh.step1_sense', 'TASTE'),
      title: t('sim_mh.step1_title', 'Acknowledge 1 sensation you can TASTE or swallow'),
      desc: t('sim_mh.step1_desc', 'Take a sip of cool water, notice the taste in your mouth, or gently relax your jaw and swallow.'),
      items: [
        t('sim_mh.s1_1', 'A sip of cool water or minty freshness, bringing you fully into the present moment')
      ]
    }
  ];

  const handleCompleteStep = (idx) => {
    playChime(440 + idx * 40, 0.5);
    setCompletedGrounding((prev) => {
      const next = [...prev];
      next[idx] = true;
      return next;
    });
    if (idx < groundingSteps.length - 1) {
      setGroundingStep(idx + 1);
    }
  };

  const handleResetGrounding = () => {
    setGroundingStep(0);
    setCompletedGrounding([false, false, false, false, false]);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl border-2 border-rose-200 dark:border-rose-900 bg-[var(--bg-surface)] shadow-sm">
        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider mb-2">
          <Heart className="w-4 h-4" />
          <span>{t('sim_mh.badge', 'Cognitive De-escalation & Wellbeing Lab')}</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          {t('sim_mh.title', 'Anxiety De-escalation, Grounding & Crisis Card Simulator')}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
          {t(
            'sim_mh.desc',
            'Interactive tools designed to model cognitive fatigue, panic de-escalation, and sensory grounding. Use the 5-4-3-2-1 sensory grounding engine, guided box-breathing pacer, and customize an Emergency Assistance Crisis Card.'
          )}
        </p>

        {/* Tool Switcher Tabs */}
        <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTool('grounding')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTool === 'grounding'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>{t('sim_mh.tab_grounding', '1. 5-4-3-2-1 Sensory Grounding')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('breathing')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTool === 'breathing'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Wind className="w-4 h-4" />
            <span>{t('sim_mh.tab_breathing', '2. Box Breathing Pacer')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('card')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTool === 'card'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{t('sim_mh.tab_card', '3. Emergency Crisis Card')}</span>
          </button>
        </div>
      </div>

      {/* Tool 1: 5-4-3-2-1 Sensory Grounding Engine */}
      {activeTool === 'grounding' && (
        <div className="p-6 sm:p-8 rounded-2xl border-2 border-rose-300 dark:border-rose-800 bg-rose-50/40 dark:bg-slate-900 space-y-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-rose-200 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                {t('sim_mh.grounding_sub', 'Panic & High-Anxiety Interrupt')}
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {t('sim_mh.grounding_heading', 'Interactive 5-4-3-2-1 Sensory Grounding Sequence')}
              </h3>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResetGrounding}
              icon={RotateCcw}
            >
              {t('sim_mh.reset_sequence', 'Reset Sequence')}
            </Button>
          </div>

          {/* Stepper Progress */}
          <div className="flex items-center justify-between max-w-xl mx-auto gap-2">
            {groundingSteps.map((st, i) => {
              const isDone = completedGrounding[i];
              const isCurrent = groundingStep === i;
              return (
                <button
                  key={st.num}
                  type="button"
                  onClick={() => setGroundingStep(i)}
                  className={`flex-1 flex flex-col items-center p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isDone
                      ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-400 dark:bg-emerald-950 dark:text-emerald-200'
                      : isCurrent
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span className="text-lg">{st.num}</span>
                  <span className="text-[10px] uppercase">{st.sense}</span>
                </button>
              );
            })}
          </div>

          {/* Active Step Card */}
          {(() => {
            const currentStepData = groundingSteps[groundingStep];
            const isStepCompleted = completedGrounding[groundingStep];

            return (
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border-2 border-rose-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 flex items-center justify-center text-2xl font-black shrink-0">
                    {currentStepData.num}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {currentStepData.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      {currentStepData.desc}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  {currentStepData.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm flex items-center gap-3"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-slate-800 dark:text-slate-200">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex items-center justify-between flex-wrap gap-3">
                  <span className="text-xs text-slate-500">
                    {t('sim_mh.grounding_hint', 'Engaging each sense anchors awareness into present reality, deactivating amygdala panic triggers.')}
                  </span>
                  <Button
                    type="button"
                    variant={isStepCompleted ? 'secondary' : 'primary'}
                    size="md"
                    onClick={() => handleCompleteStep(groundingStep)}
                    icon={CheckCircle}
                  >
                    {isStepCompleted
                      ? t('sim_mh.step_done', 'Step Completed ✓')
                      : t('sim_mh.complete_step', 'I Have Sensed These (Next)')}
                  </Button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Tool 2: Guided Box Breathing Pacer */}
      {activeTool === 'breathing' && (
        <div className="p-6 sm:p-8 rounded-2xl border-2 border-sky-300 dark:border-sky-800 bg-sky-50/40 dark:bg-slate-900 space-y-6 text-center">
          <div className="max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">
              {t('sim_mh.vagal_title', 'Vagal Nerve Relaxation')}
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
              {t('sim_mh.breathing_title', 'Box Breathing Pacer (4-4-4-4 Technique)')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              {t(
                'sim_mh.breathing_desc',
                'Slows autonomic heart rate spikes and calms racing thoughts. Follow the circle as it expands (Inhale), pauses (Hold), contracts (Exhale), and rests (Hold).'
              )}
            </p>
          </div>

          {/* Visual Breathing Circle */}
          <div className="py-12 flex flex-col items-center justify-center">
            <div
              className={`w-64 h-64 sm:w-72 sm:h-72 rounded-full border-8 flex flex-col items-center justify-center transition-all duration-1000 shadow-xl ${
                breathPhase.startsWith('Inhale')
                  ? 'scale-110 bg-sky-100 border-sky-500 text-sky-900 dark:bg-sky-950 dark:border-sky-400 dark:text-sky-100'
                  : breathPhase === 'Hold 1'
                  ? 'scale-110 bg-indigo-100 border-indigo-500 text-indigo-900 dark:bg-indigo-950 dark:border-indigo-400'
                  : breathPhase.startsWith('Exhale')
                  ? 'scale-90 bg-emerald-100 border-emerald-500 text-emerald-900 dark:bg-emerald-950 dark:border-emerald-400'
                  : 'scale-90 bg-amber-100 border-amber-500 text-amber-900 dark:bg-amber-950 dark:border-amber-400'
              }`}
            >
              <Wind className="w-8 h-8 mb-2 animate-bounce opacity-80" />
              <span className="text-2xl sm:text-3xl font-black uppercase tracking-wider">
                {breathPhase === 'Hold 1' || breathPhase === 'Hold 2' ? 'Hold' : breathPhase}
              </span>
              <span className="text-4xl sm:text-5xl font-black mt-1">{breathCount}</span>
              <span className="text-xs font-semibold uppercase tracking-widest mt-2 opacity-75">
                {isBreathingActive ? 'Breathe with rhythm' : 'Paused'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            <Button
              type="button"
              variant={isBreathingActive ? 'secondary' : 'primary'}
              size="lg"
              onClick={() => {
                setIsBreathingActive(!isBreathingActive);
                playChime(528, 0.5);
              }}
            >
              {isBreathingActive
                ? t('sim_mh.pause_breathing', 'Pause Exercise')
                : t('sim_mh.start_breathing', 'Start Guided Breathing')}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => setIsAudioChime(!isAudioChime)}
              icon={isAudioChime ? Volume2 : VolumeX}
            >
              {isAudioChime ? 'Sound: On' : 'Sound: Off'}
            </Button>
          </div>
        </div>
      )}

      {/* Tool 3: Emergency Assistance / Crisis Card */}
      {activeTool === 'card' && (
        <div className="p-6 sm:p-8 rounded-2xl border-2 border-purple-300 dark:border-purple-800 bg-purple-50/40 dark:bg-slate-900 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-purple-200 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
                {t('sim_mh.card_sub', 'Non-Verbal Crisis Communicator')}
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {t('sim_mh.card_heading', 'Personalized Emergency Assistance Card')}
              </h3>
            </div>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => window.print()}
              icon={Printer}
            >
              {t('sim_mh.print_card', 'Print / Save Card')}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Live Card Preview */}
            <div className="p-6 rounded-2xl border-2 border-purple-400 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-3 border-b-2 border-purple-200 dark:border-purple-900">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-6 h-6 text-rose-600" />
                  <span className="font-black text-sm uppercase tracking-wider text-rose-600">
                    Emergency Assistance Card
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                  RPwD Act 2016
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block uppercase font-bold">Holder Name</span>
                <span className="text-lg font-black">{cardData.name}</span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block uppercase font-bold">Condition</span>
                <span className="text-sm font-bold text-purple-700 dark:text-purple-300">
                  {cardData.condition}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-slate-500 block mb-1">Emergency Contact:</span>
                  <span className="font-extrabold text-blue-600">{cardData.emergencyContact}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-slate-500 block mb-1">Doctor / Clinic:</span>
                  <span className="font-semibold">{cardData.doctorContact}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-xs text-emerald-900 dark:text-emerald-200">
                <span className="font-bold block mb-1">✓ What Helps Me (De-escalation):</span>
                <span>{cardData.whatHelps}</span>
              </div>

              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 text-xs text-rose-900 dark:text-rose-200">
                <span className="font-bold block mb-1">✗ What to Avoid:</span>
                <span>{cardData.whatAvoid}</span>
              </div>
            </div>

            {/* Customizer Form */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
              <span className="font-bold text-sm block border-b pb-2">Customize Your Crisis Card</span>

              <div>
                <label className="font-bold block mb-1">Full Name</label>
                <input
                  type="text"
                  value={cardData.name}
                  onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Condition Description</label>
                <input
                  type="text"
                  value={cardData.condition}
                  onChange={(e) => setCardData({ ...cardData, condition: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Emergency Contact (Name & Phone)</label>
                <input
                  type="text"
                  value={cardData.emergencyContact}
                  onChange={(e) => setCardData({ ...cardData, emergencyContact: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">What to Do (Calming Steps)</label>
                <textarea
                  rows={2}
                  value={cardData.whatHelps}
                  onChange={(e) => setCardData({ ...cardData, whatHelps: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-xs"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">What to Avoid</label>
                <textarea
                  rows={2}
                  value={cardData.whatAvoid}
                  onChange={(e) => setCardData({ ...cardData, whatAvoid: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 24x7 National Helpline Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl border-2 border-rose-300 dark:border-rose-900 bg-rose-50/70 dark:bg-rose-950/20 flex items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300 block mb-1">
              National Mental Health Helpline (DEPwD)
            </span>
            <h4 className="text-xl font-black text-slate-900 dark:text-slate-100">KIRAN 24x7</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">13 languages, psychological first aid</p>
          </div>
          <a
            href="tel:18005990019"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 text-white font-extrabold text-sm shadow-md hover:bg-rose-700 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>1800-599-0019</span>
          </a>
        </div>

        <div className="p-5 rounded-2xl border-2 border-sky-300 dark:border-sky-900 bg-sky-50/70 dark:bg-sky-950/20 flex items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300 block mb-1">
              Tele-MANAS (MoHFW, Govt of India)
            </span>
            <h4 className="text-xl font-black text-slate-900 dark:text-slate-100">Tele-MANAS 24x7</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">20+ languages, free mental health counselling</p>
          </div>
          <a
            href="tel:14416"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 text-white font-extrabold text-sm shadow-md hover:bg-sky-700 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>14416</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default MentalHealthSimulator;
