import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Mic,
  MicOff,
  Navigation,
  Compass,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import Button from '../common/Button';

export function VoiceNavTool() {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'en').split('-')[0];

  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState(null);

  const { toggleDrawer } = useAccessibility();
  const navigate = useNavigate();
  const recognitionRef = useRef(null);

  const SpeechRecognition = typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

  const commandRules = [
    {
      triggers: ['vision', 'visual', 'blindness', 'दृष्टि', 'आंख', 'दोष', 'అంధత్వం', 'దృష్టి', 'చూపు'],
      action: () => {
        navigate('/category/visual-impairment');
        return t('tools.voicenav_nav_vision', 'Navigating to Visual Impairments section');
      }
    },
    {
      triggers: ['hearing', 'deaf', 'auditory', 'sound', 'श्रवण', 'बधिर', 'सुनना', 'వినికిడి', 'చెవులు'],
      action: () => {
        navigate('/category/hearing-impairment');
        return t('tools.voicenav_nav_hearing', 'Navigating to Hearing Impairments section');
      }
    },
    {
      triggers: ['mobility', 'motor', 'physical', 'wheelchair', 'शारीरिक', 'गामक', 'మోటారు', 'శారీరక', 'వీల్ చైర్'],
      action: () => {
        navigate('/category/mobility-physical');
        return t('tools.voicenav_nav_mobility', 'Navigating to Mobility section');
      }
    },
    {
      triggers: ['simulation', 'simulator', 'experience', 'सिम्युलेटर', 'अनुभव', 'సిమ్యులేటర్', 'అనుభవం'],
      action: () => {
        navigate('/simulations');
        return t('tools.voicenav_nav_sim', 'Opening Disability Simulators suite');
      }
    },
    {
      triggers: ['tool', 'tools', 'assistive', 'टूल्स', 'उपकरण', 'సాధనాలు', 'టూల్స్'],
      action: () => {
        navigate('/tools');
        return t('tools.voicenav_nav_tools', 'Opening Assistive Tools hub');
      }
    },
    {
      triggers: ['rights', 'scheme', 'law', 'act', 'अधिकार', 'योजना', 'कानून', 'హక్కులు', 'పథకాలు', 'చట్టం'],
      action: () => {
        navigate('/rights-and-schemes');
        return t('tools.voicenav_nav_rights', 'Opening RPwD Rights & Schemes guide');
      }
    },
    {
      triggers: ['settings', 'accessibility', 'contrast', 'सेटिंग्स', 'सुगमता', 'సెట్టింగులు', 'కాంట్రాస్ట్'],
      action: () => {
        toggleDrawer();
        return t('tools.voicenav_nav_settings', 'Toggling Accessibility Controls panel');
      }
    },
    {
      triggers: ['home', 'main', 'start', 'होम', 'मुख्य', 'హోమ్', 'ప్రారంభం'],
      action: () => {
        navigate('/');
        return t('tools.voicenav_nav_home', 'Returning to Home Page');
      }
    }
  ];

  useEffect(() => {
    if (!SpeechRecognition) {
      setError(t('tools.voicenav_unsupported', 'Web Speech Recognition API is not supported in this browser. Please use Chrome or Edge for voice navigation.'));
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = currentLang === 'te' ? 'te-IN' : (currentLang === 'hi' ? 'hi-IN' : 'en-US');

    recognition.onresult = (event) => {
      const latest = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
      setLastCommand(latest);

      // Match against command rules
      let matched = false;
      for (const rule of commandRules) {
        if (rule.triggers.some((t) => latest.includes(t))) {
          const status = rule.action();
          setFeedback(status);
          matched = true;
          break;
        }
      }

      if (!matched) {
        setFeedback(t('tools.voicenav_unrecognized', 'Unrecognized command: "{{cmd}}". Try e.g. "vision", "hearing", "simulations", or "home".', { cmd: latest }));
      }
    };

    recognition.onerror = (e) => {
      if (e.error !== 'no-speech') {
        setError(`Voice listener alert: ${e.error}`);
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
    };
  }, [SpeechRecognition, currentLang]);

  const toggleVoiceNav = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setError(null);
      setFeedback(t('tools.voicenav_listening', 'Listening... Speak a destination command.'));
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start voice nav:', err);
      }
    }
  };

  const cheatSheetCommands = currentLang === 'hi' ? [
    { cmd: '"दृष्टि"', dest: 'दृष्टि दिव्यांगता' },
    { cmd: '"श्रवण"', dest: 'श्रवण दिव्यांगता' },
    { cmd: '"शारीरिक"', dest: 'शारीरिक गतिशीलता' },
    { cmd: '"सिम्युलेटर"', dest: 'अनुभव सिमुलेटर' },
    { cmd: '"टूल्स"', dest: 'सहायक टूल्स' },
    { cmd: '"अधिकार"', dest: 'RPwD अधिकार व योजनाएं' },
    { cmd: '"सुगमता"', dest: 'सुगमता सेटिंग्स' },
    { cmd: '"होम"', dest: 'मुख्य पृष्ठ' }
  ] : currentLang === 'te' ? [
    { cmd: '"దృష్టి"', dest: 'దృష్టి లోపం విభాగం' },
    { cmd: '"వినికిడి"', dest: 'వినికిడి వైకల్యం' },
    { cmd: '"మోటారు"', dest: 'శారీరక చలనశీలత' },
    { cmd: '"సిమ్యులేటర్లు"', dest: 'సిమ్యులేటర్ల సూట్' },
    { cmd: '"సాధనాలు"', dest: 'సహాయక సాధనాలు' },
    { cmd: '"హక్కులు"', dest: 'RPwD హక్కుల గైడ్' },
    { cmd: '"సెట్టింగులు"', dest: 'యాక్సెసిబిలిటీ ప్యానెల్' },
    { cmd: '"హోమ్"', dest: 'హోమ్ పేజీ' }
  ] : [
    { cmd: '"Go to vision"', dest: 'Visual Impairments' },
    { cmd: '"Go to hearing"', dest: 'Hearing Impairments' },
    { cmd: '"Go to mobility"', dest: 'Mobility & Physical' },
    { cmd: '"Open simulations"', dest: 'Experience Simulators' },
    { cmd: '"Open tools"', dest: 'Assistive Tools' },
    { cmd: '"Open rights"', dest: 'RPwD Rights Guide' },
    { cmd: '"Open settings"', dest: 'Accessibility Drawer' },
    { cmd: '"Go home"', dest: 'Home Page' }
  ];

  return (
    <div className="space-y-8">
      {/* Voice Nav Card */}
      <div className="p-8 rounded-3xl border-2 border-slate-200 dark:border-slate-700 bg-[var(--bg-surface)] shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800 mb-6">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Navigation className="w-5 h-5 text-blue-600" />
              <span>{t('tools.voicenav_title', 'Hands-Free Voice Command Navigation')}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t('tools.voicenav_desc', 'Speak natural commands into your microphone to navigate between sections hands-free.')}
            </p>
          </div>

          <Button
            variant={isListening ? 'danger' : 'primary'}
            onClick={toggleVoiceNav}
            icon={isListening ? MicOff : Mic}
            disabled={!SpeechRecognition}
            className={isListening ? 'animate-pulse' : 'bg-blue-600 hover:bg-blue-700 text-white'}
          >
            {isListening ? t('tools.voicenav_stop', 'Stop Voice Listener') : t('tools.voicenav_start', 'Activate Voice Navigation')}
          </Button>
        </div>

        {error && (
          <div className="mb-4 p-4 rounded-xl bg-amber-50 text-amber-900 border border-amber-300 text-xs sm:text-sm">
            {error}
          </div>
        )}

        {/* Status & Feedback */}
        <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 flex flex-col justify-center min-h-[120px]">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
            {t('tools.voicenav_status_label', 'Status & Heard Command:')}
          </span>
          <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {lastCommand ? `"${lastCommand}"` : t('tools.voicenav_awaiting', 'Awaiting voice input...')}
          </div>
          {feedback && (
            <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}
        </div>

        {/* Command Cheat Sheet */}
        <div className="mt-8">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">
            {t('tools.voicenav_supported', 'Supported Voice Commands:')}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {cheatSheetCommands.map((c) => (
              <div key={c.cmd} className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                <span className="font-bold text-blue-600 dark:text-blue-400 block mb-0.5">{c.cmd}</span>
                <span className="text-slate-500">→ {c.dest}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoiceNavTool;
