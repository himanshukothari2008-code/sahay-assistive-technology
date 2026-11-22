import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { cleanMarkdownForSpeech } from './MarkdownRenderer';

export function SpeakButton({ textToRead, label = 'Read aloud' }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { prefs } = useAccessibility();

  const isSpeechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    return () => {
      if (isSpeechSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSpeechSupported]);

  const handleToggleSpeak = () => {
    if (!isSpeechSupported) {
      alert('Your browser does not support Web Speech Synthesis.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel(); // Stop any other speech
      const cleanText = cleanMarkdownForSpeech(textToRead);
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = prefs.ttsSpeed || 1.0;
      utterance.lang = 'en-US';

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  if (!isSpeechSupported) return null;

  return (
    <button
      type="button"
      onClick={handleToggleSpeak}
      aria-label={`${isSpeaking ? 'Stop reading' : 'Read aloud'}: ${label}`}
      title={isSpeaking ? 'Stop speech' : 'Listen with text-to-speech'}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all touch-target focus-visible:outline-none ${
        isSpeaking
          ? 'bg-rose-100 text-rose-800 border-2 border-rose-400 dark:bg-rose-950 dark:text-rose-200 animate-pulse'
          : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 dark:bg-slate-800 dark:text-blue-300 dark:border-slate-700'
      }`}
    >
      {isSpeaking ? (
        <>
          <VolumeX className="w-4 h-4 text-rose-600" aria-hidden="true" />
          <span>Stop Voice</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <span>Listen</span>
        </>
      )}
    </button>
  );
}

export default SpeakButton;
