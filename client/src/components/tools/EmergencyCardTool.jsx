import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ShieldAlert,
  PhoneCall,
  Printer,
  Save,
  CheckCircle,
  AlertCircle,
  Heart,
  User,
  Activity,
  FileText
} from 'lucide-react';
import Button from '../common/Button';

const STORAGE_KEY = 'sahay_emergency_card_v1';

const defaultCardDataByLang = {
  en: {
    fullName: 'Aarav Sharma',
    age: '24',
    bloodGroup: 'B+ Positive',
    primaryCondition: 'Sensory Sensitivity (Autism Spectrum) & Low Vision',
    allergies: 'Penicillin, Peanuts',
    medications: 'None required urgently',
    iceName: 'Priya Sharma',
    iceRelation: 'Mother / Legal Guardian',
    icePhone: '+91 98765 43210',
    secondaryPhone: '+91 91234 56789',
    assistanceNotes: '1. I am sensitive to sudden loud noises or being touched unexpectedly.\n2. Please speak in a calm, clear tone.\n3. I use my smartphone or written text to communicate effectively during sensory distress.'
  },
  hi: {
    fullName: 'आरव शर्मा',
    age: '24',
    bloodGroup: 'B+ पॉजिटिव',
    primaryCondition: 'संवेदी संवेदनशीलता (ऑटिज्म स्पेक्ट्रम) एवं अल्प दृष्टि',
    allergies: 'पेनिसिलिन, मूंगफली',
    medications: 'कोई आपातकालीन नहीं',
    iceName: 'प्रिया शर्मा',
    iceRelation: 'माता / कानूनी अभिभावक',
    icePhone: '+91 98765 43210',
    secondaryPhone: '+91 91234 56789',
    assistanceNotes: '1. मैं अचानक होने वाले तेज शोर और अचानक छूने से घबरा जाता हूँ।\n2. कृपया शांत और स्पष्ट आवाज़ में बात करें।\n3. संवेदी तनाव के समय मैं स्मार्टफोन या लिखकर संवाद करता हूँ।'
  },
  te: {
    fullName: 'ఆరవ్ శర్మ',
    age: '24',
    bloodGroup: 'B+ పాజిటివ్',
    primaryCondition: 'సెన్సరీ సున్నితత్వం (ఆటిజం స్పెక్ట్రమ్) & తక్కువ దృష్టి',
    allergies: 'పెన్సిలిన్, వేరుశెనగ',
    medications: 'అత్యవసర మందులు లేవు',
    iceName: 'ప్రియా శర్మ',
    iceRelation: 'తల్లి / సంరక్షకురాలు',
    icePhone: '+91 98765 43210',
    secondaryPhone: '+91 91234 56789',
    assistanceNotes: '1. ఆకస్మిక తీవ్రమైన శబ్దాలు మరియు ఆకస్మిక స్పర్శలను తట్టుకోలేను.\n2. దయచేసి ప్రశాంతంగా, స్పష్టంగా మాట్లాడండి.\n3. ఆందోళన కలిగినప్పుడు స్మార్ట్‌ఫోన్ లేదా అక్షరాల ద్వారా మాట్లాడతాను.'
  }
};

export function EmergencyCardTool() {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'en').split('-')[0];

  const trans = {
    en: {
      title: 'Digital Emergency Medical ID Card',
      subtitle: 'Stores critical emergency information, one-tap ICE calling, and instructions for first responders.',
      edit_info: 'Edit Information',
      cancel_edit: 'Cancel Editing',
      print_btn: 'Print / Save PDF',
      save_success: 'Emergency card saved to your browser!',
      form_title: 'Edit Medical ID Information',
      lbl_name: 'Full Name',
      lbl_age: 'Age',
      lbl_blood: 'Blood Group',
      lbl_condition: 'Primary Condition / Disability',
      lbl_allergies: 'Known Allergies',
      lbl_ice_name: 'Emergency Contact (ICE Name)',
      lbl_relation: 'Relationship',
      lbl_phone: 'Phone Number',
      lbl_notes: 'Instructions for First Responders ("How to Assist Me")',
      cancel: 'Cancel',
      save_card: 'Save Medical ID',
      badge_header: 'EMERGENCY MEDICAL IDENTIFICATION',
      badge_sub: 'ICE Profile',
      call_ice: 'Call ICE ({{name}})',
      age_prefix: 'Age:',
      blood_prefix: 'Blood Group:',
      condition_heading: 'Primary Condition / Disability:',
      allergies_heading: 'Known Allergies:',
      none_reported: 'None reported',
      assist_heading: 'How to Assist Me in an Emergency:',
      primary_contact_lbl: 'Primary Contact:',
      created_by: 'Created via Sahay Accessibility Suite'
    },
    hi: {
      title: 'डिजिटल आपातकालीन मेडिकल आईडी कार्ड',
      subtitle: 'आपातकालीन जानकारी, एक-क्लिक ICE कॉलिंग और आपातकालीन सहायता निर्देशों का डिजिटल कार्ड।',
      edit_info: 'जानकारी बदलें',
      cancel_edit: 'बदलाव रद्द करें',
      print_btn: 'प्रिंट / PDF सहेजें',
      save_success: 'आपातकालीन कार्ड आपके ब्राउज़र में सहेज लिया गया है!',
      form_title: 'मेडिकल आईडी जानकारी संपादित करें',
      lbl_name: 'पूरा नाम',
      lbl_age: 'आयु',
      lbl_blood: 'रक्त समूह (ब्लड ग्रुप)',
      lbl_condition: 'प्रमुख स्थिति / दिव्यांगता',
      lbl_allergies: 'एलर्जी (यदि कोई हो)',
      lbl_ice_name: 'आपातकालीन संपर्क (ICE नाम)',
      lbl_relation: 'संबंध (रिश्ता)',
      lbl_phone: 'फ़ोन नंबर',
      lbl_notes: 'सहायता निर्देश ("आपातकाल में मेरी सहायता कैसे करें")',
      cancel: 'रद्द करें',
      save_card: 'आईडी कार्ड सहेजें',
      badge_header: 'आपातकालीन चिकित्सा पहचान पत्र (MEDICAL ID)',
      badge_sub: 'ICE प्रोफाइल',
      call_ice: 'कॉल करें ({{name}})',
      age_prefix: 'आयु:',
      blood_prefix: 'रक्त समूह:',
      condition_heading: 'प्रमुख स्थिति / दिव्यांगता:',
      allergies_heading: 'ज्ञात एलर्जी:',
      none_reported: 'कोई नहीं',
      assist_heading: 'आपातकाल में मेरी सहायता कैसे करें:',
      primary_contact_lbl: 'प्रमुख संपर्क:',
      created_by: 'सहाय (Sahay) सुगम्यता सूट द्वारा निर्मित'
    },
    te: {
      title: 'డిజిటల్ ఎమర్జెన్సీ మెడికల్ ID కార్డు',
      subtitle: 'అత్యవసర సమాచారం, ఒకే క్లిక్‌తో ICE కాల్ మరియు సహాయక సూచనల కార్డు.',
      edit_info: 'సవరించండి',
      cancel_edit: 'రద్దు చేయండి',
      print_btn: 'ప్రింట్ / PDF సేవ్',
      save_success: 'ఎమర్జెన్సీ కార్డు మీ బ్రౌజర్‌లో సేవ్ చేయబడింది!',
      form_title: 'మెడికల్ ID సమాచారాన్ని మార్చండి',
      lbl_name: 'పూర్తి పేరు',
      lbl_age: 'వయస్సు',
      lbl_blood: 'రక్త గ్రూప్',
      lbl_condition: 'ప్రధాన పరిస్థితి / వైకల్యం',
      lbl_allergies: 'అలెర్జీలు',
      lbl_ice_name: 'అత్యవసర సంప్రదింపు వ్యక్తి (ICE పేరు)',
      lbl_relation: 'సంబంధం',
      lbl_phone: 'ఫోన్ నంబర్',
      lbl_notes: 'అత్యవసర సహాయ మార్గదర్శకాలు ("నాకు ఎలా సహాయపడాలి")',
      cancel: 'రద్దు',
      save_card: 'సేవ్ చేయండి',
      badge_header: 'అత్యవసర వైద్య గుర్తింపు కార్డు (MEDICAL ID)',
      badge_sub: 'ICE ప్రొఫైల్',
      call_ice: 'కాల్ చేయండి ({{name}})',
      age_prefix: 'వయస్సు:',
      blood_prefix: 'రక్త గ్రూప్:',
      condition_heading: 'ప్రధాన పరిస్థితి / వైకల్యం:',
      allergies_heading: 'అలెర్జీలు:',
      none_reported: 'లేవు',
      assist_heading: 'అత్యవసర పరిస్థితుల్లో నాకు సహాయపడే విధానం:',
      primary_contact_lbl: 'ప్రధాన సంప్రదింపు:',
      created_by: 'సహాయ్ (Sahay) వేదిక ద్వారా సృష్టించబడింది'
    }
  };

  const L = trans[currentLang] || trans.en;
  const currentDefaultData = defaultCardDataByLang[currentLang] || defaultCardDataByLang.en;

  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : currentDefaultData;
    } catch {
      return currentDefaultData;
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setSaveStatus(L.save_success);
      setIsEditing(false);
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Controls Bar */}
      <div className="p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-[var(--bg-surface)] flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <span>{L.title}</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {L.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? L.cancel_edit : L.edit_info}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handlePrint}
            icon={Printer}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {L.print_btn}
          </Button>
        </div>
      </div>

      {saveStatus && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Edit Form or Visual Emergency ID Display */}
      {isEditing ? (
        <form onSubmit={handleSave} className="p-8 rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-[var(--bg-surface)] space-y-6">
          <h4 className="text-lg font-bold border-b pb-2">{L.form_title}</h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">{L.lbl_name}</label>
              <input
                type="text"
                required
                value={data.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">{L.lbl_age}</label>
              <input
                type="text"
                value={data.age}
                onChange={(e) => handleChange('age', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">{L.lbl_blood}</label>
              <input
                type="text"
                value={data.bloodGroup}
                onChange={(e) => handleChange('bloodGroup', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">{L.lbl_condition}</label>
              <input
                type="text"
                required
                value={data.primaryCondition}
                onChange={(e) => handleChange('primaryCondition', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">{L.lbl_allergies}</label>
              <input
                type="text"
                value={data.allergies}
                onChange={(e) => handleChange('allergies', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">{L.lbl_ice_name}</label>
              <input
                type="text"
                required
                value={data.iceName}
                onChange={(e) => handleChange('iceName', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">{L.lbl_relation}</label>
              <input
                type="text"
                value={data.iceRelation}
                onChange={(e) => handleChange('iceRelation', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">{L.lbl_phone}</label>
              <input
                type="tel"
                required
                value={data.icePhone}
                onChange={(e) => handleChange('icePhone', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              {L.lbl_notes}
            </label>
            <textarea
              rows={3}
              value={data.assistanceNotes}
              onChange={(e) => handleChange('assistanceNotes', e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 text-sm resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsEditing(false)}>{L.cancel}</Button>
            <Button type="submit" variant="primary" icon={Save}>{L.save_card}</Button>
          </div>
        </form>
      ) : (
        /* The Printed & Screen Emergency ID Badge */
        <div className="max-w-3xl mx-auto rounded-3xl border-4 border-rose-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xl overflow-hidden">
          {/* Top Urgent Bar */}
          <div className="bg-rose-600 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
              <span className="font-extrabold text-lg tracking-wide uppercase">
                {L.badge_header}
              </span>
            </div>
            <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full uppercase">
              {L.badge_sub}
            </span>
          </div>

          {/* Details Grid */}
          <div className="p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h4 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                  {data.fullName}
                </h4>
                <span className="text-sm font-semibold text-slate-500">
                  {L.age_prefix} {data.age} • {L.blood_prefix} <strong className="text-rose-600">{data.bloodGroup}</strong>
                </span>
              </div>

              {/* One-Tap Emergency Call Button */}
              <a
                href={`tel:${data.icePhone.replace(/\s+/g, '')}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-base shadow-lg active:scale-95 transition-all touch-target"
              >
                <PhoneCall className="w-5 h-5" />
                <span>{L.call_ice.replace('{{name}}', data.iceName)}</span>
              </a>
            </div>

            {/* Medical Alert Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300 block mb-1">
                  {L.condition_heading}
                </span>
                <span className="font-extrabold text-base text-rose-950 dark:text-rose-100">
                  {data.primaryCondition}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 block mb-1">
                  {L.allergies_heading}
                </span>
                <span className="font-extrabold text-base text-amber-950 dark:text-amber-100">
                  {data.allergies || L.none_reported}
                </span>
              </div>
            </div>

            {/* Assistance Instructions for First Responders */}
            <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-blue-600" />
                <span>{L.assist_heading}</span>
              </span>
              <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed font-medium">
                {data.assistanceNotes}
              </p>
            </div>

            {/* Emergency Contacts Breakdown */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-4">
              <div>
                <strong>{L.primary_contact_lbl}</strong> {data.iceName} ({data.iceRelation}) — {data.icePhone}
              </div>
              <div>
                <strong>{L.created_by}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmergencyCardTool;
