import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  RotateCcw,
  Volume2,
  CheckCircle2,
  Award,
  HelpCircle,
  Copy,
  Check,
  Keyboard,
  Hand,
  BookOpen,
  Sliders,
  ArrowRight,
  Info
} from 'lucide-react';
import Button from '../common/Button';

// Standard 6-Dot Braille Alphabet Map (Dots 1 to 6)
// Dot 1=top-left, 2=mid-left, 3=bottom-left, 4=top-right, 5=mid-right, 6=bottom-right
export const BRAILLE_MAP = {
  A: { dots: [1], unicode: '⠁', hindi: 'अ', telugu: 'అ', name: 'A' },
  B: { dots: [1, 2], unicode: '⠃', hindi: 'ब', telugu: 'బ', name: 'B' },
  C: { dots: [1, 4], unicode: '⠉', hindi: 'च', telugu: 'చ', name: 'C' },
  D: { dots: [1, 4, 5], unicode: '⠙', hindi: 'द', telugu: 'ద', name: 'D' },
  E: { dots: [1, 5], unicode: '⠑', hindi: 'ए', telugu: 'ఎ', name: 'E' },
  F: { dots: [1, 2, 4], unicode: '⠋', hindi: 'फ', telugu: 'ఫ', name: 'F' },
  G: { dots: [1, 2, 4, 5], unicode: '⠛', hindi: 'ग', telugu: 'గ', name: 'G' },
  H: { dots: [1, 2, 5], unicode: '⠓', hindi: 'ह', telugu: 'హ', name: 'H' },
  I: { dots: [2, 4], unicode: '⠊', hindi: 'इ', telugu: 'ఇ', name: 'I' },
  J: { dots: [2, 4, 5], unicode: '⠚', hindi: 'ज', telugu: 'జ', name: 'J' },
  K: { dots: [1, 3], unicode: '⠅', hindi: 'क', telugu: 'క', name: 'K' },
  L: { dots: [1, 2, 3], unicode: '⠇', hindi: 'ल', telugu: 'ల', name: 'L' },
  M: { dots: [1, 3, 4], unicode: '⠍', hindi: 'म', telugu: 'మ', name: 'M' },
  N: { dots: [1, 3, 4, 5], unicode: '⠝', hindi: 'न', telugu: 'న', name: 'N' },
  O: { dots: [1, 3, 5], unicode: '⠕', hindi: 'ओ', telugu: 'ఒ', name: 'O' },
  P: { dots: [1, 2, 3, 4], unicode: '⠏', hindi: 'प', telugu: 'ప', name: 'P' },
  Q: { dots: [1, 2, 3, 4, 5], unicode: '⠟', hindi: 'क़', telugu: 'ఖ', name: 'Q' },
  R: { dots: [1, 2, 3, 5], unicode: '⠗', hindi: 'र', telugu: 'ర', name: 'R' },
  S: { dots: [2, 3, 4], unicode: '⠎', hindi: 'स', telugu: 'స', name: 'S' },
  T: { dots: [2, 3, 4, 5], unicode: '⠞', hindi: 'त', telugu: 'త', name: 'T' },
  U: { dots: [1, 3, 6], unicode: '⠥', hindi: 'उ', telugu: 'ఉ', name: 'U' },
  V: { dots: [1, 2, 3, 6], unicode: '⠧', hindi: 'व', telugu: 'వ', name: 'V' },
  W: { dots: [2, 4, 5, 6], unicode: '⠺', hindi: 'वा', telugu: 'వా', name: 'W' },
  X: { dots: [1, 3, 4, 6], unicode: '⠭', hindi: 'क्ष', telugu: 'క్ష', name: 'X' },
  Y: { dots: [1, 3, 4, 5, 6], unicode: '⠽', hindi: 'य', telugu: 'య', name: 'Y' },
  Z: { dots: [1, 3, 5, 6], unicode: '⠵', hindi: 'ज़', telugu: 'ఝ', name: 'Z' }
};

// Generates Unicode Braille symbol from array of dot numbers [1..6]
export function dotsToUnicode(dots = []) {
  if (!dots || dots.length === 0) return '⠀';
  let mask = 0;
  if (dots.includes(1)) mask |= 0x01;
  if (dots.includes(2)) mask |= 0x02;
  if (dots.includes(3)) mask |= 0x04;
  if (dots.includes(4)) mask |= 0x08;
  if (dots.includes(5)) mask |= 0x10;
  if (dots.includes(6)) mask |= 0x20;
  return String.fromCharCode(0x2800 + mask);
}

// Convert text string to array of braille cells
export function textToBrailleCells(text = '') {
  return text.toUpperCase().split('').map((char) => {
    if (char === ' ') {
      return { char: ' ', dots: [], unicode: '⠀', hindi: ' ', telugu: ' ' };
    }
    const match = BRAILLE_MAP[char];
    if (match) {
      return { char, ...match };
    }
    return { char, dots: [], unicode: '⠀', hindi: char, telugu: char };
  });
}

// Web Audio API tactile haptic sound generator
function playHapticClick(frequency = 240, duration = 0.04) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + duration);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(20);
    }
  } catch (e) {
    // AudioContext blocked or not supported
  }
}

export function BrailleSimulator() {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'en').split('-')[0];

  const [activeTab, setActiveTab] = useState('cell'); // 'cell' | 'translator' | 'quiz' | 'guide'
  
  // Mode 1: Interactive Cell
  const [activeDots, setActiveDots] = useState([1]); // default 'A'
  const [perkinsStatus, setPerkinsStatus] = useState('');

  // Mode 2: Text to Braille Translator
  const [inputText, setInputText] = useState('SAHAY');
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [copied, setCopied] = useState(false);

  // Mode 3: Quiz Challenge
  const [quizTarget, setQuizTarget] = useState('B');
  const [quizScore, setQuizScore] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [quizStreak, setQuizStreak] = useState(0);

  // Toggle single dot in cell
  const toggleDot = (dotNumber) => {
    playHapticClick(activeDots.includes(dotNumber) ? 180 : 340);
    setActiveDots((prev) => {
      if (prev.includes(dotNumber)) {
        return prev.filter((d) => d !== dotNumber);
      } else {
        return [...prev, dotNumber].sort((a, b) => a - b);
      }
    });
  };

  // Find matching letter for activeDots
  const matchingEntry = Object.entries(BRAILLE_MAP).find(([_, data]) => {
    if (data.dots.length !== activeDots.length) return false;
    const sorted = [...data.dots].sort();
    const current = [...activeDots].sort();
    return sorted.every((d, i) => d === current[i]);
  });

  const recognizedLetter = matchingEntry ? matchingEntry[0] : null;
  const recognizedData = matchingEntry ? matchingEntry[1] : null;

  // Speak synthesized letter
  const speakLetter = (text) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLang === 'te' ? 'te-IN' : (currentLang === 'hi' ? 'hi-IN' : 'en-US');
    window.speechSynthesis.speak(utterance);
  };

  // Perkins Brailler Keyboard Listener (Keys S, D, F, J, K, L)
  useEffect(() => {
    if (activeTab !== 'cell') return;

    const handleKeyDown = (e) => {
      // Ignore if typing inside input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const key = e.key.toLowerCase();
      const perkinsKeyMap = {
        f: 1, // Dot 1 (top-left)
        d: 2, // Dot 2 (mid-left)
        s: 3, // Dot 3 (bottom-left)
        j: 4, // Dot 4 (top-right)
        k: 5, // Dot 5 (mid-right)
        l: 6  // Dot 6 (bottom-right)
      };

      if (perkinsKeyMap[key]) {
        e.preventDefault();
        toggleDot(perkinsKeyMap[key]);
        setPerkinsStatus(`Key '${key.toUpperCase()}' toggled Dot ${perkinsKeyMap[key]}`);
      } else if (key === ' ' || key === 'space') {
        e.preventDefault();
        setActiveDots([]);
        setPerkinsStatus('Space pressed: Cell cleared');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, activeDots]);

  // Quiz setup
  const initNextQuiz = () => {
    const letters = Object.keys(BRAILLE_MAP);
    const random = letters[Math.floor(Math.random() * letters.length)];
    setQuizTarget(random);
    setQuizFeedback(null);
  };

  const handleQuizAnswer = (chosenLetter) => {
    if (chosenLetter === quizTarget) {
      playHapticClick(520, 0.1);
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
      setQuizFeedback({ correct: true, text: `Correct! ${quizTarget} uses dots [${BRAILLE_MAP[quizTarget].dots.join(', ')}]` });
      setQuizScore((prev) => prev + 1);
      setQuizStreak((prev) => prev + 1);
      setTimeout(initNextQuiz, 1200);
    } else {
      playHapticClick(140, 0.15);
      setQuizFeedback({ correct: false, text: `Not quite. ${quizTarget} is correct (${BRAILLE_MAP[quizTarget].dots.join(', ')})` });
      setQuizStreak(0);
    }
  };

  const handleCopyUnicode = () => {
    const cells = textToBrailleCells(inputText);
    const unicodeString = cells.map((c) => c.unicode).join('');
    navigator.clipboard.writeText(unicodeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const translatedCells = textToBrailleCells(inputText);

  return (
    <div className="space-y-8">
      {/* Simulation Header */}
      <div className="p-6 sm:p-8 rounded-3xl border-2 border-slate-200 dark:border-slate-700 bg-[var(--bg-surface)] shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300 mb-2">
              <Sparkles className="w-4 h-4" />
              <span>{t('braille_sim.badge', 'Tactile Literacy & Assistive Tech')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {t('braille_sim.title', 'Interactive Braille & Tactile Reading Simulator')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {t('braille_sim.subtitle', 'Experience the 6-dot tactile code invented by Louis Braille. Tap embossed dots, use Perkins Brailler keyboard keys, translate text into tactile Unicode, and practice fingertip reading.')}
            </p>
          </div>

          {/* Quick Audio Speech Button */}
          <div className="shrink-0 flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Volume2}
              onClick={() => speakLetter(recognizedLetter ? `Letter ${recognizedLetter}` : 'Braille Simulator')}
            >
              {t('braille_sim.speak_button', 'Listen')}
            </Button>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8" role="tablist">
          {[
            { id: 'cell', label: t('braille_sim.tab_cell', '1. Interactive 6-Dot Cell & Perkins'), icon: Keyboard },
            { id: 'translator', label: t('braille_sim.tab_translator', '2. Text-to-Braille & Tactile Sweep'), icon: Hand },
            { id: 'quiz', label: t('braille_sim.tab_quiz', '3. Braille Decoder Challenge'), icon: Award },
            { id: 'guide', label: t('braille_sim.tab_guide', '4. Bharati Braille & Displays'), icon: BookOpen }
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all touch-target focus-visible:outline-none ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: INTERACTIVE 6-DOT BRAILLE CELL & PERKINS BRAILLER */}
        {activeTab === 'cell' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Visual 6-Dot Cell Matrix */}
              <div className="lg:col-span-6 flex flex-col items-center justify-center p-8 rounded-3xl bg-slate-100 dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 block">
                  {t('braille_sim.matrix_label', 'Standard 6-Dot Braille Cell (Click dots to toggle)')}
                </span>

                {/* 2 Columns x 3 Rows Tactile Embossed Cell */}
                <div
                  className="grid grid-cols-2 gap-x-8 gap-y-6 p-8 rounded-3xl bg-white dark:bg-slate-800 border-4 border-slate-300 dark:border-slate-700 shadow-xl"
                  role="group"
                  aria-label="6-dot Braille Cell"
                >
                  {/* Left Column: Dots 1, 2, 3 */}
                  <div className="flex flex-col gap-6">
                    {[1, 2, 3].map((dotNum) => {
                      const isRaised = activeDots.includes(dotNum);
                      return (
                        <button
                          key={dotNum}
                          type="button"
                          onClick={() => toggleDot(dotNum)}
                          aria-pressed={isRaised}
                          aria-label={`Dot ${dotNum}, ${isRaised ? 'Raised' : 'Flat'}`}
                          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full font-extrabold text-lg flex items-center justify-center transition-all duration-150 touch-target focus-visible:outline-none ${
                            isRaised
                              ? 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-[0_6px_16px_rgba(79,70,229,0.5)] scale-105 border-2 border-indigo-300'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600'
                          }`}
                        >
                          <span>{dotNum}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Right Column: Dots 4, 5, 6 */}
                  <div className="flex flex-col gap-6">
                    {[4, 5, 6].map((dotNum) => {
                      const isRaised = activeDots.includes(dotNum);
                      return (
                        <button
                          key={dotNum}
                          type="button"
                          onClick={() => toggleDot(dotNum)}
                          aria-pressed={isRaised}
                          aria-label={`Dot ${dotNum}, ${isRaised ? 'Raised' : 'Flat'}`}
                          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full font-extrabold text-lg flex items-center justify-center transition-all duration-150 touch-target focus-visible:outline-none ${
                            isRaised
                              ? 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-[0_6px_16px_rgba(79,70,229,0.5)] scale-105 border-2 border-indigo-300'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600'
                          }`}
                        >
                          <span>{dotNum}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Dot Controls */}
                <div className="flex items-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={RotateCcw}
                    onClick={() => {
                      setActiveDots([]);
                      playHapticClick(150);
                    }}
                  >
                    {t('braille_sim.clear_cell', 'Clear Cell')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const all = [1, 2, 3, 4, 5, 6];
                      setActiveDots((prev) => all.filter((d) => !prev.includes(d)));
                      playHapticClick(300);
                    }}
                  >
                    {t('braille_sim.invert_dots', 'Invert Dots')}
                  </Button>
                </div>
              </div>

              {/* Right Column: Recognition Status & Bharati Braille Info */}
              <div className="lg:col-span-6 space-y-6">
                <div className="p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border-2 border-indigo-200 dark:border-indigo-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 block mb-2">
                    {t('braille_sim.decoder_status', 'Real-Time Braille Recognition')}
                  </span>

                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-baseline gap-3">
                      <span className="text-6xl font-black text-slate-900 dark:text-slate-100">
                        {recognizedLetter || '?'}
                      </span>
                      <span className="text-4xl font-normal text-indigo-600 dark:text-indigo-400">
                        {dotsToUnicode(activeDots)}
                      </span>
                    </div>

                    {recognizedLetter && (
                      <Button
                        variant="primary"
                        size="md"
                        icon={Volume2}
                        onClick={() => speakLetter(recognizedLetter)}
                      >
                        {t('braille_sim.hear_sound', 'Pronounce')}
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900">
                      <span className="text-slate-500 block">{t('braille_sim.raised_dots', 'Raised Dots:')}</span>
                      <strong className="text-slate-900 dark:text-slate-100">
                        {activeDots.length > 0 ? activeDots.join(', ') : t('braille_sim.none', 'None (Empty Cell)')}
                      </strong>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900">
                      <span className="text-slate-500 block">{t('braille_sim.unicode_val', 'Unicode Point:')}</span>
                      <strong className="text-slate-900 dark:text-slate-100 font-mono">
                        U+{dotsToUnicode(activeDots).charCodeAt(0).toString(16).toUpperCase()}
                      </strong>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900">
                      <span className="text-slate-500 block">Bharati Hindi (भारती ब्रेल):</span>
                      <strong className="text-slate-900 dark:text-slate-100 text-base">
                        {recognizedData?.hindi || '—'}
                      </strong>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900">
                      <span className="text-slate-500 block">Bharati Telugu (తెలుగు బ్రెయిలీ):</span>
                      <strong className="text-slate-900 dark:text-slate-100 text-base">
                        {recognizedData?.telugu || '—'}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Perkins Brailler Physical Keyboard Layout Guide */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
                    <Keyboard className="w-4 h-4 text-indigo-600" />
                    <span>{t('braille_sim.perkins_heading', 'Perkins Brailler Keyboard Shortcuts')}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                    {t('braille_sim.perkins_desc', 'Use your computer keyboard just like a real mechanical Perkins Brailler machine:')}
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                    {[
                      { key: 'S', dot: 'Dot 3' },
                      { key: 'D', dot: 'Dot 2' },
                      { key: 'F', dot: 'Dot 1' },
                      { key: 'Space', dot: 'Clear' },
                      { key: 'J', dot: 'Dot 4' },
                      { key: 'K', dot: 'Dot 5' },
                      { key: 'L', dot: 'Dot 6' }
                    ].map((k) => (
                      <div
                        key={k.key}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-center border border-slate-300 dark:border-slate-600 min-w-[50px]"
                      >
                        <span className="font-mono font-bold text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 block">{k.key}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">{k.dot}</span>
                      </div>
                    ))}
                  </div>

                  {perkinsStatus && (
                    <div className="mt-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400 text-center animate-fade-in">
                      {perkinsStatus}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TEXT-TO-BRAILLE TRANSLATOR & TACTILE SWEEP READER */}
        {activeTab === 'translator' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800">
              <label htmlFor="braille-input" className="block text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                {t('braille_sim.translator_label', 'Enter English Word to Convert to Embossed Braille:')}
              </label>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  id="braille-input"
                  value={inputText}
                  maxLength={24}
                  onChange={(e) => setInputText(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
                  placeholder="e.g. SAHAY, BRAILLE, INCLUSION"
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold uppercase tracking-wider text-base focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400"
                />

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    icon={copied ? Check : Copy}
                    onClick={handleCopyUnicode}
                  >
                    {copied ? t('braille_sim.copied', 'Copied!') : t('braille_sim.copy_unicode', 'Copy Braille')}
                  </Button>
                </div>
              </div>

              {/* Preset Chips */}
              <div className="flex flex-wrap items-center gap-2 mt-3 text-xs font-semibold">
                <span className="text-slate-500">{t('braille_sim.quick_examples', 'Quick Samples:')}</span>
                {['SAHAY', 'BRAILLE', 'INCLUSION', 'ACCESS', 'INDIA'].map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => setInputText(sample)}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-indigo-500 text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>

            {/* Embossed Braille Output with Fingertip Reading Mode */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border-2 border-indigo-200 dark:border-indigo-900/60 shadow-lg">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700 mb-6">
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Hand className="w-5 h-5 text-indigo-600" />
                    <span>{t('braille_sim.feel_dots_title', 'Virtual Fingertip Reading (Tactile Sweep Mode)')}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {t('braille_sim.feel_dots_desc', 'Sweep your cursor or finger left-to-right over the cells. Each active dot triggers a synthesized tactile audio click and voice announcement.')}
                  </p>
                </div>

                <div className="text-3xl font-normal text-indigo-600 dark:text-indigo-400 select-all font-mono">
                  {translatedCells.map((c) => c.unicode).join('')}
                </div>
              </div>

              {/* Horizontal Braille Line */}
              <div className="overflow-x-auto pb-4 pt-2">
                <div className="flex items-center gap-3 sm:gap-4 min-w-max">
                  {translatedCells.map((cell, idx) => {
                    const isHovered = hoveredIndex === idx;

                    return (
                      <div
                        key={idx}
                        onMouseEnter={() => {
                          setHoveredIndex(idx);
                          playHapticClick(cell.dots.length > 0 ? 320 : 150);
                          if (cell.char !== ' ') speakLetter(cell.char);
                        }}
                        onMouseLeave={() => setHoveredIndex(null)}
                        className={`p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center cursor-pointer touch-target ${
                          isHovered
                            ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 shadow-lg scale-110 -translate-y-1'
                            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50'
                        }`}
                      >
                        {/* 6-dot miniature cell */}
                        <div className="grid grid-cols-2 gap-x-3 gap-y-2 mb-3">
                          {/* Col 1: dots 1, 2, 3 */}
                          <div className="flex flex-col gap-2">
                            {[1, 2, 3].map((d) => (
                              <div
                                key={d}
                                className={`w-3.5 h-3.5 rounded-full transition-all ${
                                  cell.dots.includes(d)
                                    ? 'bg-indigo-600 dark:bg-indigo-400 shadow-[0_2px_6px_rgba(79,70,229,0.6)] scale-110'
                                    : 'bg-slate-300 dark:bg-slate-700'
                                }`}
                              />
                            ))}
                          </div>
                          {/* Col 2: dots 4, 5, 6 */}
                          <div className="flex flex-col gap-2">
                            {[4, 5, 6].map((d) => (
                              <div
                                key={d}
                                className={`w-3.5 h-3.5 rounded-full transition-all ${
                                  cell.dots.includes(d)
                                    ? 'bg-indigo-600 dark:bg-indigo-400 shadow-[0_2px_6px_rgba(79,70,229,0.6)] scale-110'
                                    : 'bg-slate-300 dark:bg-slate-700'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Letter and Unicode */}
                        <span className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                          {cell.char}
                        </span>
                        <span className="text-xs text-indigo-600 dark:text-indigo-400 font-mono mt-0.5">
                          {cell.unicode}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BRAILLE DECODER CHALLENGE QUIZ */}
        {activeTab === 'quiz' && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border-2 border-indigo-200 dark:border-indigo-800 text-center shadow-lg">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t('braille_sim.challenge_mode', 'Braille Speed Recognition Game')}
                </span>
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                    {t('braille_sim.score', 'Score:')} {quizScore}
                  </div>
                  <div className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                    🔥 {quizStreak} {t('braille_sim.streak', 'Streak')}
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-bold mb-4">
                {t('braille_sim.quiz_prompt', 'Which letter does this Braille cell represent?')}
              </h3>

              {/* Display Target Braille Cell */}
              <div className="inline-flex p-6 rounded-2xl bg-slate-100 dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 mb-6">
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  {/* Left Column (1, 2, 3) */}
                  <div className="flex flex-col gap-4">
                    {[1, 2, 3].map((d) => (
                      <div
                        key={d}
                        className={`w-6 h-6 rounded-full transition-all ${
                          BRAILLE_MAP[quizTarget]?.dots.includes(d)
                            ? 'bg-indigo-600 shadow-md scale-110'
                            : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  {/* Right Column (4, 5, 6) */}
                  <div className="flex flex-col gap-4">
                    {[4, 5, 6].map((d) => (
                      <div
                        key={d}
                        className={`w-6 h-6 rounded-full transition-all ${
                          BRAILLE_MAP[quizTarget]?.dots.includes(d)
                            ? 'bg-indigo-600 shadow-md scale-110'
                            : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* 4 Choices */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {(() => {
                  const letters = Object.keys(BRAILLE_MAP);
                  const wrong = letters.filter((l) => l !== quizTarget).sort(() => 0.5 - Math.random()).slice(0, 3);
                  const choices = [quizTarget, ...wrong].sort();

                  return choices.map((choice) => (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => handleQuizAnswer(choice)}
                      className="p-4 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/80 hover:border-indigo-600 dark:hover:border-indigo-400 hover:bg-indigo-50 font-black text-2xl text-slate-800 dark:text-slate-200 transition-all touch-target focus-visible:outline-none"
                    >
                      {choice}
                    </button>
                  ));
                })()}
              </div>

              {quizFeedback && (
                <div
                  className={`p-4 rounded-xl text-sm font-bold mb-4 flex items-center justify-center gap-2 ${
                    quizFeedback.correct
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-rose-100 text-rose-900 border border-rose-300'
                  }`}
                >
                  {quizFeedback.correct ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <HelpCircle className="w-5 h-5 text-rose-600" />}
                  <span>{quizFeedback.text}</span>
                </div>
              )}

              <Button variant="outline" size="sm" onClick={initNextQuiz}>
                {t('braille_sim.skip_letter', 'Skip to Next Letter')}
              </Button>
            </div>
          </div>
        )}

        {/* TAB 4: BHARATI BRAILLE & ASSISTIVE HARDWARE GUIDE */}
        {activeTab === 'guide' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-2">
                  Unified Indian Standard
                </span>
                <h3 className="text-xl font-bold mb-2">What is Bharati Braille?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  Bharati Braille is a unified 6-dot Braille script developed for writing Indian languages (Hindi, Telugu, Tamil, Marathi, Bengali, Urdu, Kannada, etc.). Rather than creating different dot mappings for every regional alphabet, Bharati Braille maps dots to phonetic phonemes. A dot combination that sounds like 'K' represents 'K' in English, 'क' in Hindi, and 'క' in Telugu!
                </p>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs text-slate-500">
                  Standardized by the National Institute for the Visually Handicapped (NIVH / NIEPVD), Dehradun under the Ministry of Social Justice and Empowerment.
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-2">
                  Electronic Assistive Hardware
                </span>
                <h3 className="text-xl font-bold mb-2">Refreshable Braille Displays</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  A Refreshable Braille Display connects to smartphones and computers via Bluetooth or USB. Instead of embossed paper, it uses micro-pins driven by piezoelectric crystals that dynamically pop up and drop down in real time as the user reads code, documents, or websites with screen readers like NVDA or VoiceOver.
                </p>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs text-slate-500">
                  Government schemes like ADIP in India provide subsidies for electronic Braille note-takers and tactile displays to students with benchmark visual disabilities.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BrailleSimulator;
