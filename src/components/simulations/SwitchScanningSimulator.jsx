import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Activity,
  Sliders,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Zap,
  CheckCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import Button from '../common/Button';

export function SwitchScanningSimulator() {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'en').split('-')[0];

  const [scanSpeed, setScanSpeed] = useState(1200); // ms per item
  const [isScanning, setIsScanning] = useState(false);
  const [activeRow, setActiveRow] = useState(0);
  const [activeCol, setActiveCol] = useState(-1);
  const [scanLevel, setScanLevel] = useState('row'); // 'row', 'item'
  const [typedMessage, setTypedMessage] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [switchPressCount, setSwitchPressCount] = useState(0);

  const audioCtxRef = useRef(null);

  const grid = [
    ['A', 'B', 'C', 'D', 'E', 'F'],
    ['G', 'H', 'I', 'J', 'K', 'L'],
    ['M', 'N', 'O', 'P', 'Q', 'R'],
    ['S', 'T', 'U', 'V', 'W', 'X'],
    ['Y', 'Z', 'SPACE', 'DELETE', 'YES', 'NO']
  ];

  const playClickSound = (freq = 600) => {
    if (!soundEnabled) return;
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

      osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
      gain.gain.setValueAtTime(0.001, audioCtxRef.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.15, audioCtxRef.current.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);

      osc.start();
      osc.stop(audioCtxRef.current.currentTime + 0.09);
    } catch (e) {}
  };

  // Scanning Timer Loop
  useEffect(() => {
    if (!isScanning) return;

    const interval = setInterval(() => {
      playClickSound(480);
      if (scanLevel === 'row') {
        setActiveRow((prev) => (prev + 1) % grid.length);
      } else {
        setActiveCol((prev) => (prev + 1) % grid[activeRow].length);
      }
    }, scanSpeed);

    return () => clearInterval(interval);
  }, [isScanning, scanLevel, activeRow, scanSpeed, soundEnabled]);

  // Pressing the Switch (Buddy Button or Spacebar)
  const handleSwitchPress = () => {
    setSwitchPressCount((c) => c + 1);
    playClickSound(880);

    if (!isScanning) {
      setIsScanning(true);
      setScanLevel('row');
      setActiveRow(0);
      setActiveCol(-1);
      return;
    }

    if (scanLevel === 'row') {
      // Locked in row, now scan items within this row
      setScanLevel('item');
      setActiveCol(0);
    } else {
      // Selected the item
      const selectedItem = grid[activeRow][activeCol];
      if (selectedItem === 'SPACE') {
        setTypedMessage((m) => m + ' ');
      } else if (selectedItem === 'DELETE') {
        setTypedMessage((m) => m.slice(0, -1));
      } else if (selectedItem === 'YES') {
        setTypedMessage((m) => m + ' [YES] ');
      } else if (selectedItem === 'NO') {
        setTypedMessage((m) => m + ' [NO] ');
      } else {
        setTypedMessage((m) => m + selectedItem);
      }

      // Return to row scanning
      setScanLevel('row');
      setActiveCol(-1);
    }
  };

  // Listen to keyboard spacebar as a switch input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        handleSwitchPress();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isScanning, scanLevel, activeRow, activeCol]);

  const handleReset = () => {
    setIsScanning(false);
    setActiveRow(0);
    setActiveCol(-1);
    setScanLevel('row');
    setTypedMessage('');
    setSwitchPressCount(0);
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="p-6 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 bg-[var(--bg-surface)] shadow-sm">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
          <Activity className="w-4 h-4" />
          <span>{t('sim_switch.badge', 'Physical Mobility & Assistive Input Lab')}</span>
        </div>
        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          {t('sim_switch.title', 'Single-Switch & Row-Column Scanning Access Simulator')}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
          {t(
            'sim_switch.desc',
            'Learn how individuals with severe motor limitations (quadriplegia, ALS, cerebral palsy) type and navigate computer interfaces using only a single switch button, chin nudge, or Sip-and-Puff straw. The box scans row-by-row; tap your switch (or press Spacebar) to lock in.'
          )}
        </p>

        {/* Speed & Audio Controls */}
        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sliders className="w-4 h-4 text-slate-400" />
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              {t('sim_switch.speed_label', 'Scan Speed:')} {scanSpeed}ms
            </label>
            <input
              type="range"
              min={600}
              max={2500}
              step={100}
              value={scanSpeed}
              onChange={(e) => setScanSpeed(Number(e.target.value))}
              className="w-36 accent-emerald-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-600" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
              <span>{soundEnabled ? 'Audio: On' : 'Audio: Off'}</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Virtual Giant Buddy Button & Status */}
      <div className="p-6 rounded-2xl bg-emerald-50/50 dark:bg-slate-900 border-2 border-emerald-300 dark:border-emerald-700 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            {isScanning
              ? scanLevel === 'row'
                ? 'Step 1: Scanning Rows (Press Switch when desired row highlights)'
                : 'Step 2: Scanning Letters (Press Switch to choose letter)'
              : 'Switch Inactive (Press big button or Spacebar to begin)'}
          </span>
          <div className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Switch Presses: <strong className="text-emerald-700 dark:text-emerald-300">{switchPressCount}</strong>
          </div>
        </div>

        {/* Big Touch-Target Switch Button */}
        <button
          type="button"
          onClick={handleSwitchPress}
          className="w-48 h-20 sm:w-60 sm:h-24 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-lg sm:text-xl shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-transform cursor-pointer border-4 border-white dark:border-slate-800 ring-4 ring-emerald-300 focus:outline-none"
        >
          <Zap className="w-7 h-7 animate-pulse text-amber-300" />
          <span>{isScanning ? 'PRESS SWITCH' : 'START SCAN'}</span>
        </button>
      </div>

      {/* Typed Output Display */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400 uppercase">Composed Text:</span>
          <span className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">
            {typedMessage || <span className="text-slate-400 font-normal italic text-sm">Nothing typed yet...</span>}
          </span>
        </div>
        {typedMessage && (
          <button
            type="button"
            onClick={() => setTypedMessage('')}
            className="text-xs font-bold text-red-500 hover:underline"
          >
            Clear Text
          </button>
        )}
      </div>

      {/* 2D Scanning Grid */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 space-y-3">
        {grid.map((row, rIdx) => {
          const isRowActive = isScanning && activeRow === rIdx;

          return (
            <div
              key={rIdx}
              className={`grid grid-cols-6 gap-2 sm:gap-3 p-2 rounded-xl transition-all ${
                isRowActive
                  ? scanLevel === 'row'
                    ? 'bg-amber-100 dark:bg-amber-950/60 ring-4 ring-amber-400'
                    : 'bg-blue-50 dark:bg-blue-950/40 ring-2 ring-blue-400'
                  : 'bg-transparent'
              }`}
            >
              {row.map((cell, cIdx) => {
                const isCellActive = isScanning && activeRow === rIdx && activeCol === cIdx && scanLevel === 'item';

                return (
                  <div
                    key={cIdx}
                    className={`h-14 sm:h-16 rounded-xl flex items-center justify-center font-black text-sm sm:text-lg transition-all border-2 ${
                      isCellActive
                        ? 'bg-emerald-600 text-white border-emerald-400 scale-105 shadow-lg ring-4 ring-emerald-300'
                        : isRowActive && scanLevel === 'row'
                        ? 'bg-amber-200/60 dark:bg-amber-900/60 text-slate-900 dark:text-slate-100 border-amber-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {cell}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SwitchScanningSimulator;
