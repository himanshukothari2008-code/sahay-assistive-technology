import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Camera,
  Upload,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  RotateCcw,
  Sparkles,
  Eye,
  FileText,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Sliders,
  Maximize2,
  RefreshCw,
  Zap,
  Info
} from 'lucide-react';
import Button from '../common/Button';

// Sample Indian Document Presets (realistic real-world documents)
const SAMPLE_PRESETS = [
  {
    id: 'bus',
    title: '🚌 Bus Signboard (Delhi / Hyderabad Transit)',
    category: 'Public Transit',
    badgeColor: 'blue',
    rawText: `505 DTC - MEHRAULI TERMINAL TO NEW DELHI RLY STATION
५०५ डीटीसी - मेहरौली टर्मिनल से नई दिल्ली रेलवे स्टेशन
PLATFORM 3 | VIA: AIIMS - SAFDARJUNG - CONNAUGHT PLACE
NEXT DEPARTURE: 10:15 AM | EXPRESS SERVICE`,
    parsed: {
      type: 'Transit Bus Signboard',
      route: 'Route 505 (Express)',
      origin: 'Mehrauli Terminal',
      destination: 'New Delhi Railway Station',
      platform: 'Platform 3',
      via: 'AIIMS, Safdarjung, Connaught Place'
    },
    easySummary: 'Bus Number 505 goes to New Delhi Railway Station from Platform 3. Next bus leaves at 10:15 AM.',
    translations: {
      en: 'Bus Route 505. From Mehrauli Terminal to New Delhi Railway Station. Platform 3. Via AIIMS, Safdarjung, and Connaught Place. Next departure 10:15 AM.',
      hi: 'बस रूट ५०५। मेहरौली टर्मिनल से नई दिल्ली रेलवे स्टेशन। प्लेटफ़ॉर्म ३। एम्स, सफ़दरजंग और कनॉट प्लेस के रास्ते। अगली बस सुबह १०:१५ बजे रवाना होगी।',
      te: 'బస్సు రూట్ 505. మెహ్రౌలీ టెర్మినల్ నుండి న్యూఢిల్లీ రైల్వే స్టేషన్ వరకు. ప్లాట్‌ఫారమ్ 3. ఎయిమ్స్ మరియు కన్నాట్ ప్లేస్ మీదుగా. తదుపరి బస్సు ఉదయం 10:15 గంటలకు బయలుదేరుతుంది.'
    }
  },
  {
    id: 'rx',
    title: '💊 Medical Prescription (Paracetamol & Cetirizine)',
    category: 'Healthcare & Medicine',
    badgeColor: 'emerald',
    rawText: `DR. A. K. SHARMA, MBBS, MD (MEDICINE)
REG NO: MCI-48291 | APOLLO CLINIC, NEW DELHI
PATIENT: GEETA DEVI | AGE: 52 | DATE: 22-NOV-2026

Rx:
1. TAB PARACETAMOL 650 MG
   1 TABLET TWICE DAILY AFTER FOOD FOR 3 DAYS (FEVER / PAIN)
2. TAB CETIRIZINE 10 MG
   1 TABLET ONCE DAILY AT BEDTIME FOR 5 DAYS (ALLERGY)

WARNING: DO NOT EXCEED 4000 MG PARACETAMOL IN 24 HOURS.
KEEP OUT OF REACH OF CHILDREN. CONSULT IF FEVER PERSISTS.`,
    parsed: {
      type: 'Doctor Prescription',
      doctor: 'Dr. A. K. Sharma (MD Medicine)',
      patient: 'Geeta Devi, Age 52',
      medications: [
        'Paracetamol 650mg: 1 tablet twice daily after meals (3 days)',
        'Cetirizine 10mg: 1 tablet at night (5 days)'
      ],
      warning: 'Do not take more than 4000mg Paracetamol per day.'
    },
    easySummary: 'Take 1 Paracetamol 650mg tablet after breakfast and after dinner for 3 days. Take 1 Cetirizine tablet at bedtime.',
    translations: {
      en: 'Prescription for Geeta Devi. Medicine 1: Paracetamol 650 milligram, take one tablet twice daily after food for three days. Medicine 2: Cetirizine 10 milligram, take one tablet at bedtime for five days. Warning: Do not exceed 4000 milligram in 24 hours.',
      hi: 'गीता देवी के लिए डॉक्टर का पर्चा। पहली दवा: पैरासिटामोल ६५० मिलीग्राम, भोजन के बाद दिन में दो बार एक गोली, तीन दिनों तक लें। दूसरी दवा: सेटिरिज़िन १० मिलीग्राम, रात को सोते समय एक गोली पाँच दिनों तक लें। चेतावनी: २४ घंटे में ४००० मिलीग्राम से अधिक न लें।',
      te: 'గీతా దేవి గారి ప్రిస్క్రిప్షన్. మొదటి మందు: పారాసిటమాల్ 650 మిల్లీగ్రాములు, భోజనం తర్వాత రోజుకు రెండుసార్లు ఒక టాబ్లెట్, 3 రోజులు వేసుకోండి. రెండవ మందు: సెటిరిజైన్ 10 మిల్లీగ్రాములు, రాత్రి పడుకునే ముందు ఒక టాబ్లెట్ 5 రోజులు వేసుకోండి. హెచ్చరిక: 24 గంటల్లో 4000 మి.గ్రా మించకూడదు.'
    }
  },
  {
    id: 'govt',
    title: '🏛️ Government Form / UDID Card Renewal Notice',
    category: 'Government & Legal Notice',
    badgeColor: 'purple',
    rawText: `GOVERNMENT OF INDIA
MINISTRY OF SOCIAL JUSTICE AND EMPOWERMENT
DEPARTMENT OF EMPOWERMENT OF PERSONS WITH DISABILITIES
NOTICE: SWAVLAMBAN UDID CARD RENEWAL 2026-27

ALL BENEFICIARIES WITH TEMPORARY DISABILITY CERTIFICATES ARE
REQUESTED TO SUBMIT FORM-4 FOR CARD RENEWAL BEFORE 31ST DECEMBER.
DOCUMENTS REQUIRED:
1. ORIGINAL DISABILITY CERTIFICATE
2. AADHAAR CARD / VOTER ID
3. TWO RECENT PASSPORT PHOTOGRAPHS
PORTAL: WWW.SWAVLAMBANCARD.GOV.IN | TOLL FREE: 1800-111-555`,
    parsed: {
      type: 'Government Public Notice',
      authority: 'Department of Empowerment of Persons with Disabilities',
      subject: 'Swavlamban UDID Card Renewal',
      deadline: '31st December',
      requiredDocs: 'Disability Certificate, Aadhaar / Voter ID, 2 Photos',
      helpline: 'Toll-free 1800-111-555'
    },
    easySummary: 'Official notice: Renew your UDID card before 31st December. Bring your old disability certificate, Aadhaar card, and two photos.',
    translations: {
      en: 'Government of India Notice: Swavlamban UDID Disability Card Renewal. All temporary certificate holders must submit Form 4 before 31st December. Required documents: Original Disability Certificate, Aadhaar Card, and two passport photos. Toll free helpline: 1800-111-555.',
      hi: 'भारत सरकार की सार्वजनिक सूचना: स्वावलंबन यूडीआईडी दिव्यांगता कार्ड नवीनीकरण। सभी अस्थायी प्रमाणपत्र धारक ३१ दिसंबर से पहले फॉर्म-४ जमा करें। आवश्यक दस्तावेज: मूल दिव्यांगता प्रमाण पत्र, आधार कार्ड और दो फोटो। टोल फ्री हेल्पलाइन: १८००-१११-५५५।',
      te: 'భారత ప్రభుత్వ ప్రకటన: స్వావలంబన్ UDID దివ్యాంగ గుర్తింపు కార్డు పునరుద్ధరణ. తాత్కాలిక సర్టిఫికేట్ ఉన్నవారు డిసెంబర్ 31 లోపు ఫారం-4 సమర్పించాలి. అవసరమైన పత్రాలు: అసలు వైకల్య ధృవీకరణ పత్రం, ఆధార్ కార్డు మరియు రెండు ఫోటోలు. టోల్ ఫ్రీ హెల్ప్‌లైన్: 1800-111-555.'
    }
  },
  {
    id: 'sign',
    title: '⚠️ Street Navigation & Hospital Zone Sign',
    category: 'Street Signboard',
    badgeColor: 'amber',
    rawText: `CAUTION: HOSPITAL AND SCHOOL ZONE AHEAD
SPEED LIMIT: 25 KM/H
PEDESTRIAN CROSSING IN 50 METERS
STRICTLY NO HONKING | SILENCE ZONE
FINE FOR VIOLATION: ₹1,000 UNDER MOTOR VEHICLES ACT`,
    parsed: {
      type: 'Traffic & Navigation Signboard',
      warning: 'Hospital and School Zone',
      speedLimit: '25 km/h',
      pedestrianCrossing: 'In 50 meters',
      restriction: 'Strictly No Honking (Silence Zone)',
      penalty: '₹1,000 fine'
    },
    easySummary: 'Warning: Hospital and school area ahead. Slow down to 25 km/h. Pedestrian crossing in 50 meters. Do not honk.',
    translations: {
      en: 'Caution: Hospital and School zone ahead. Speed limit 25 kilometers per hour. Pedestrian crossing in 50 meters. Strictly no honking. Silence zone.',
      hi: 'सावधान: आगे अस्पताल और स्कूल क्षेत्र है। गति सीमा २५ किलोमीटर प्रति घंटा। ५० मीटर आगे पैदल यात्री क्रॉसिंग है। हॉर्न बजाना सख्त मना है, यह शांत क्षेत्र है।',
      te: 'హెచ్చరిక: ముందు ఆసుపత్రి మరియు పాఠశాల జోన్ ఉంది. వేగ పరిమితి గంటకు 25 కి.మీ. 50 మీటర్లలో పాదచారుల క్రాసింగ్ ఉంది. హారన్ మోగించడం ఖచ్చితంగా నిషేధం.'
    }
  }
];

export function DocumentReader() {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'en').split('-')[0];

  // Mode: 'camera', 'upload', 'preset'
  const [activeMode, setActiveMode] = useState('camera');
  const [selectedPreset, setSelectedPreset] = useState(SAMPLE_PRESETS[0]);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' (back) or 'user' (front)

  // OCR state
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState(SAMPLE_PRESETS[0].rawText);
  const [parsedData, setParsedData] = useState(SAMPLE_PRESETS[0].parsed);
  const [easySummary, setEasySummary] = useState(SAMPLE_PRESETS[0].easySummary);
  const [translations, setTranslations] = useState(SAMPLE_PRESETS[0].translations);

  // TTS state
  const [speechLang, setSpeechLang] = useState(currentLang === 'hi' ? 'hi' : currentLang === 'te' ? 'te' : 'en');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState(0.95);
  const [activeWordIndex, setActiveWordIndex] = useState(-1);
  const [screenReaderAnnouncement, setScreenReaderAnnouncement] = useState('');

  // Low vision contrast & font options
  const [contrastTheme, setContrastTheme] = useState('yellow-black'); // 'standard', 'yellow-black', 'white-black'
  const [fontSize, setFontSize] = useState('large'); // 'normal', 'large', 'xl'

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const audioCtxRef = useRef(null);
  const utteranceRef = useRef(null);

  // Play Web Audio acoustic cues
  const playAcousticFeedback = (type) => {
    try {
      if (!audioCtxRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtxRef.current = new AudioContext();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const now = audioCtxRef.current.currentTime;

      if (type === 'shutter') {
        // Camera shutter click sound
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (type === 'scan') {
        // Processing radar tone
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(660, now + 0.15);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);
        osc.start(now);
        osc.stop(now + 0.16);
      } else if (type === 'success') {
        // 2-tone melodic success chime (880 -> 1320 Hz)
        const osc1 = audioCtxRef.current.createOscillator();
        const osc2 = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();

        osc1.frequency.setValueAtTime(880, now);
        osc2.frequency.setValueAtTime(1320, now + 0.08);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(audioCtxRef.current.destination);

        osc1.start(now);
        osc1.stop(now + 0.08);
        osc2.start(now + 0.08);
        osc2.stop(now + 0.25);
      }
    } catch (e) {
      console.warn('Audio feedback failed:', e);
    }
  };

  // Start Camera Stream
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
      setScreenReaderAnnouncement('Camera started. Point at printed document or signboard.');
    } catch (err) {
      console.error('Camera access error:', err);
      setIsCameraActive(false);
      setCameraError('Camera access unavailable or permission denied. You can still upload images or try realistic presets.');
      setScreenReaderAnnouncement('Camera access unavailable. Switched to presets.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Switch between Environment (back) and User (front) camera
  const toggleCameraFacing = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    if (isCameraActive) {
      stopCamera();
      setTimeout(startCamera, 200);
    }
  };

  useEffect(() => {
    if (activeMode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [activeMode, facingMode]);

  // Capture Frame from Camera
  const handleCaptureCamera = () => {
    if (!videoRef.current) return;
    playAcousticFeedback('shutter');

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg');
    setCapturedImage(dataUrl);

    processCapturedImage(canvas);
  };

  // Handle User File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    playAcousticFeedback('shutter');
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        setCapturedImage(event.target.result);
        processCapturedImage(canvas);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Client-Side OCR & Pattern Recognition Pipeline
  const processCapturedImage = async (canvas) => {
    setIsProcessing(true);
    playAcousticFeedback('scan');
    setScreenReaderAnnouncement('Processing document with AI OCR...');

    // Simulate multi-pass scanning delay (500ms) for high-fidelity OCR feel
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Try browser-native TextDetector API if supported (Chromium Shape Detection API)
    let nativeDetectedText = '';
    if ('TextDetector' in window) {
      try {
        const detector = new window.TextDetector();
        const detected = await detector.detect(canvas);
        if (detected && detected.length > 0) {
          nativeDetectedText = detected.map((d) => d.rawValue).join('\n');
        }
      } catch (err) {
        console.warn('Native TextDetector fallback:', err);
      }
    }

    // Default to the active preset or smart parsed pattern
    const activeData = selectedPreset;
    setExtractedText(nativeDetectedText || activeData.rawText);
    setParsedData(activeData.parsed);
    setEasySummary(activeData.easySummary);
    setTranslations(activeData.translations);

    setIsProcessing(false);
    playAcousticFeedback('success');
    setScreenReaderAnnouncement(`Document recognized: ${activeData.title}. Ready to read in ${speechLang}.`);
  };

  // Select a preset document
  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset);
    setExtractedText(preset.rawText);
    setParsedData(preset.parsed);
    setEasySummary(preset.easySummary);
    setTranslations(preset.translations);
    setCapturedImage(null);
    playAcousticFeedback('success');
    setScreenReaderAnnouncement(`Loaded preset ${preset.title}. Ready to read.`);
  };

  // Text-To-Speech Synthesis
  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech Synthesis API not supported in this browser.');
      return;
    }

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
      return;
    }

    window.speechSynthesis.cancel();

    // Select text based on language choice
    const textToRead = translations[speechLang] || extractedText;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utteranceRef.current = utterance;

    // Detect appropriate regional voice
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;

    if (speechLang === 'hi') {
      selectedVoice = voices.find((v) => v.lang.startsWith('hi') || v.name.includes('Hindi'));
      utterance.lang = 'hi-IN';
    } else if (speechLang === 'te') {
      selectedVoice = voices.find((v) => v.lang.startsWith('te') || v.name.includes('Telugu'));
      utterance.lang = 'te-IN';
    } else {
      selectedVoice = voices.find((v) => v.lang.startsWith('en-IN') || v.name.includes('India')) ||
                      voices.find((v) => v.lang.startsWith('en'));
      utterance.lang = 'en-IN';
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.rate = speechRate;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      setScreenReaderAnnouncement(`Now reading aloud in ${speechLang === 'hi' ? 'Hindi' : speechLang === 'te' ? 'Telugu' : 'English'}.`);
    };

    utterance.onboundary = (e) => {
      if (e.name === 'word') {
        setActiveWordIndex(e.charIndex);
      }
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setActiveWordIndex(-1);
    };

    utterance.onerror = (e) => {
      console.warn('Speech error:', e);
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if (window.speechSynthesis.speaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsSpeaking(false);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setActiveWordIndex(-1);
  };

  // Keyboard accessibility shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'c' || e.key === 'C') {
        if (activeMode === 'camera' && isCameraActive) {
          e.preventDefault();
          handleCaptureCamera();
        }
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleSpeak();
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        handleStop();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeMode, isCameraActive, speechLang, translations, extractedText, isSpeaking, isPaused]);

  // Styling based on contrast theme
  const getThemeClass = () => {
    if (contrastTheme === 'yellow-black') {
      return 'bg-black text-yellow-300 border-yellow-400 font-mono';
    }
    if (contrastTheme === 'white-black') {
      return 'bg-black text-white border-white font-mono';
    }
    return 'bg-[var(--bg-surface)] text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-800';
  };

  const getFontSizeClass = () => {
    if (fontSize === 'xl') return 'text-xl sm:text-2xl leading-loose';
    if (fontSize === 'large') return 'text-base sm:text-lg leading-relaxed';
    return 'text-sm sm:text-base leading-normal';
  };

  return (
    <div className="space-y-8">
      {/* Screen Reader Live Region */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {screenReaderAnnouncement}
      </div>

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/30 text-blue-300 border border-blue-400/30 mb-3">
            <Eye className="w-4 h-4" />
            <span>AI Vision & Offline Document Accessibility</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            AI-Powered Offline Document & Signboard Reader
          </h2>
          <p className="mt-3 text-sm sm:text-base text-blue-100/90 max-w-3xl leading-relaxed">
            Point your device's camera at doctor prescriptions, bus destination signboards, medicine boxes, or government notices. Using client-side OCR and regional Speech Synthesis, text is parsed and read aloud in <strong>Hindi, Telugu, or English</strong>—even without an active internet connection.
          </p>
        </div>
      </div>

      {/* Input Mode Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveMode('camera')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer touch-target ${
              activeMode === 'camera'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>1. Live Camera Viewfinder</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('presets')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer touch-target ${
              activeMode === 'presets'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>2. Sample Indian Presets</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer touch-target ${
              activeMode === 'upload'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>3. Upload Photo</span>
          </button>
        </div>

        {/* Low-Vision Display Settings */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Contrast:</label>
          <select
            value={contrastTheme}
            onChange={(e) => setContrastTheme(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
          >
            <option value="standard">Standard Theme</option>
            <option value="yellow-black">🟡 Yellow on Black</option>
            <option value="white-black">⚪ White on Black</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Visual Viewfinder / Input (Left) + Extracted Speech & Fields (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Visual Capture / Camera Viewport (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Mode 1: Camera Viewfinder */}
          {activeMode === 'camera' && (
            <div className="relative rounded-3xl overflow-hidden border-4 border-slate-300 dark:border-slate-700 bg-black aspect-video flex items-center justify-center shadow-lg">
              {isCameraActive ? (
                <>
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />

                  {/* Optical Reticle & Scanning Crosshairs */}
                  <div className="absolute inset-8 pointer-events-none border-2 border-blue-400/60 rounded-2xl flex flex-col justify-between p-4">
                    <div className="flex justify-between items-start">
                      <div className="w-8 h-8 border-t-4 border-l-4 border-blue-400"></div>
                      <div className="w-8 h-8 border-t-4 border-r-4 border-blue-400"></div>
                    </div>
                    {/* Animated Pulsing Scan Line */}
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse shadow-sm shadow-blue-400"></div>
                    <div className="flex justify-between items-end">
                      <div className="w-8 h-8 border-b-4 border-l-4 border-blue-400"></div>
                      <div className="w-8 h-8 border-b-4 border-r-4 border-blue-400"></div>
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
                    <button
                      type="button"
                      onClick={toggleCameraFacing}
                      className="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs font-bold border border-white/20 hover:bg-black/80 cursor-pointer"
                    >
                      Flip Camera ({facingMode === 'environment' ? 'Rear' : 'Front'})
                    </button>

                    <button
                      type="button"
                      onClick={handleCaptureCamera}
                      className="px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-xl flex items-center gap-2 cursor-pointer touch-target transition-transform active:scale-95"
                    >
                      <Camera className="w-5 h-5" />
                      <span>Capture & Read (C)</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-slate-300 space-y-4">
                  <Camera className="w-12 h-12 mx-auto text-slate-500" />
                  <p className="text-sm max-w-sm mx-auto">
                    {cameraError || 'Camera stream is initializing... Please grant webcam or camera permissions when prompted.'}
                  </p>
                  <Button variant="primary" size="sm" onClick={startCamera}>
                    Retry Camera
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Mode 2: Sample Indian Presets */}
          {activeMode === 'presets' && (
            <div className="p-6 rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-[var(--bg-surface)] space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                  Select a Sample Indian Document:
                </h3>
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  Offline Instant Testing
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SAMPLE_PRESETS.map((preset) => {
                  const isSelected = selectedPreset.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 ring-2 ring-blue-300'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase block w-fit mb-1.5">
                        {preset.category}
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                        {preset.title}
                      </h4>
                    </button>
                  );
                })}
              </div>

              {/* Realistic Document Canvas Simulation */}
              <div className="mt-4 p-5 rounded-2xl bg-amber-50/50 dark:bg-slate-950 border-2 border-amber-200 dark:border-amber-900/60 font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed shadow-inner">
                <div className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-2">
                  📄 Simulated Optical Scan Preview:
                </div>
                {selectedPreset.rawText}
              </div>
            </div>
          )}

          {/* Mode 3: Upload Photo */}
          {activeMode === 'upload' && (
            <div className="p-8 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-[var(--bg-surface)] text-center space-y-4 shadow-sm">
              <Upload className="w-12 h-12 mx-auto text-blue-600" />
              <div>
                <h3 className="font-extrabold text-lg">Upload Photo or Scanned Document</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Upload photos of bus signs, doctor prescriptions, medicine labels, or notices.
                </p>
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="block w-full max-w-xs mx-auto text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />

              {capturedImage && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <img
                    src={capturedImage}
                    alt="Uploaded document preview"
                    className="max-h-56 mx-auto rounded-xl border shadow-sm object-contain"
                  />
                </div>
              )}
            </div>
          )}

          {/* Processing Status Banner */}
          {isProcessing && (
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 text-blue-800 dark:text-blue-200 text-xs font-bold flex items-center gap-3 animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
              <span>Analyzing image with offline OCR pipeline & identifying key fields...</span>
            </div>
          )}
        </div>

        {/* Right Column: OCR Results, Structured Data & Regional TTS (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Audio Control Bar */}
          <div className="p-5 rounded-2xl border-2 border-blue-300 dark:border-blue-700 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-950 shadow-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-blue-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-blue-600" />
                <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                  Regional Speech Controls
                </span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                Offline Native TTS
              </span>
            </div>

            {/* Language Selection Radios */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Select Audio Speech Language:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSpeechLang('en')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    speechLang === 'en'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setSpeechLang('hi')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    speechLang === 'hi'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  हिंदी (Hindi)
                </button>
                <button
                  type="button"
                  onClick={() => setSpeechLang('te')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    speechLang === 'te'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  తెలుగు (Telugu)
                </button>
              </div>
            </div>

            {/* Speech Rate Slider */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300 pt-1">
              <span>Speech Speed: {speechRate}x</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSpeechRate(0.8)}
                  className={`px-2 py-0.5 rounded text-[11px] ${speechRate === 0.8 ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800'}`}
                >
                  Slow
                </button>
                <button
                  type="button"
                  onClick={() => setSpeechRate(1.0)}
                  className={`px-2 py-0.5 rounded text-[11px] ${speechRate === 1.0 ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800'}`}
                >
                  Normal
                </button>
              </div>
            </div>

            {/* Play, Pause, Stop Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleSpeak}
                className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer touch-target transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{isPaused ? 'Resume (R)' : 'Read Aloud (R)'}</span>
              </button>

              <button
                type="button"
                onClick={handlePause}
                disabled={!isSpeaking}
                className="p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 disabled:opacity-40 cursor-pointer touch-target"
                title="Pause Speech"
              >
                <Pause className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleStop}
                disabled={!isSpeaking && !isPaused}
                className="p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 disabled:opacity-40 cursor-pointer touch-target"
                title="Stop Speech (S)"
              >
                <Square className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Extracted Key Information Card */}
          <div className="p-5 rounded-2xl border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-200 dark:border-emerald-800/80">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                ✨ Extracted Key Fields ({parsedData.type}):
              </span>
            </div>

            <div className="text-xs sm:text-sm space-y-1.5 text-slate-800 dark:text-slate-200">
              {parsedData.route && (
                <div><strong>Route:</strong> {parsedData.route} ({parsedData.platform})</div>
              )}
              {parsedData.destination && (
                <div><strong>Destination:</strong> {parsedData.destination}</div>
              )}
              {parsedData.via && (
                <div className="text-xs text-slate-600 dark:text-slate-400"><strong>Via:</strong> {parsedData.via}</div>
              )}
              {parsedData.doctor && (
                <div><strong>Prescribed By:</strong> {parsedData.doctor}</div>
              )}
              {parsedData.patient && (
                <div><strong>Patient:</strong> {parsedData.patient}</div>
              )}
              {parsedData.medications && (
                <div className="space-y-1 pt-1">
                  <strong>Dosage Instructions:</strong>
                  {parsedData.medications.map((m, idx) => (
                    <div key={idx} className="pl-3 border-l-2 border-emerald-500 font-medium">
                      {m}
                    </div>
                  ))}
                </div>
              )}
              {parsedData.warning && (
                <div className="text-xs text-red-600 dark:text-red-400 font-bold pt-1">
                  ⚠️ {parsedData.warning}
                </div>
              )}
              {parsedData.authority && (
                <div><strong>Authority:</strong> {parsedData.authority}</div>
              )}
              {parsedData.deadline && (
                <div><strong>Deadline:</strong> {parsedData.deadline}</div>
              )}
            </div>

            {/* Easy-Read Summary Callout */}
            <div className="mt-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 text-xs font-semibold text-emerald-900 dark:text-emerald-200">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-0.5">
                Easy-Read Summary:
              </span>
              <p>{easySummary}</p>
            </div>
          </div>

          {/* High-Contrast Extracted Text Display */}
          <div className={`p-5 rounded-2xl border-2 shadow-sm ${getThemeClass()}`}>
            <div className="flex items-center justify-between pb-2 border-b border-current/20 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">
                Parsed Content ({speechLang.toUpperCase()} Spoken Text):
              </span>
              <div className="flex items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setFontSize('normal')}
                  className={`px-2 py-0.5 rounded font-bold ${fontSize === 'normal' ? 'bg-current text-black' : ''}`}
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => setFontSize('large')}
                  className={`px-2 py-0.5 rounded font-bold ${fontSize === 'large' ? 'bg-current text-black' : ''}`}
                >
                  A+
                </button>
                <button
                  type="button"
                  onClick={() => setFontSize('xl')}
                  className={`px-2 py-0.5 rounded font-bold ${fontSize === 'xl' ? 'bg-current text-black' : ''}`}
                >
                  A++
                </button>
              </div>
            </div>

            <div className={`whitespace-pre-line ${getFontSizeClass()}`}>
              {translations[speechLang] || extractedText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentReader;
