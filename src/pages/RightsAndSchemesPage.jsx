import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Scale,
  ShieldCheck,
  FileCheck,
  Building2,
  ExternalLink,
  Award,
  PhoneCall,
  Download
} from 'lucide-react';
import Accordion from '../components/common/Accordion';
import SpeakButton from '../components/common/SpeakButton';

export function RightsAndSchemesPage() {
  const { t } = useTranslation();
  const speechSummary = t('rights_page.subtitle', `The Rights of Persons with Disabilities Act 2016 protects the civil rights, employment reservations, and accessibility guarantees of persons with disabilities in India. Under the act, 21 disabilities are legally recognized, and 4 percent of government employment is reserved for persons with benchmark disabilities.`);

  const pillars = [
    { num: '1', title: t('rights_page.p1_title', 'Expanded Coverage (21 Disabilities)'), desc: t('rights_page.p1_desc', 'Increased legally recognized conditions from 7 to 21, including Specific Learning Disabilities (Dyslexia), Autism Spectrum Disorder, Cerebral Palsy, Multiple Sclerosis, Acid Attack Survivors, and Parkinson\'s Disease.') },
    { num: '2', title: t('rights_page.p2_title', 'Government Job & Education Quotas'), desc: t('rights_page.p2_desc', 'Mandates a minimum of 4% reservation in government establishments for persons with benchmark disabilities (≥40% disability), and a minimum of 5% reservation in government higher educational institutions.') },
    { num: '3', title: t('rights_page.p3_title', 'Universal Digital & Physical Accessibility'), desc: t('rights_page.p3_desc', 'Mandates barrier-free access in all public buildings, public transport systems, and consumer ICT services. Requires all Indian Government Websites to adhere strictly to GIGW (aligned with WCAG 2.1 Level AA).') },
    { num: '4', title: t('rights_page.p4_title', 'Legal Penalties for Discrimination'), desc: t('rights_page.p4_desc', 'Enacts strict punitive measures (fines and imprisonment up to 5 years) for acts of violence, insults to dignity, discrimination, or exploitation against persons with disabilities.') },
  ];

  const udidSteps = [
    { step: '1', title: t('rights_page.udid_s1_title', 'Register Online'), desc: t('rights_page.udid_s1_desc', 'Visit swavlambancard.gov.in and click "Apply for Disability Certificate & UDID Card".') },
    { step: '2', title: t('rights_page.udid_s2_title', 'Upload Documents'), desc: t('rights_page.udid_s2_desc', 'Upload Aadhaar card, proof of address, passport photo, and any prior clinical diagnosis papers.') },
    { step: '3', title: t('rights_page.udid_s3_title', 'Medical Assessment'), desc: t('rights_page.udid_s3_desc', 'Visit your designated District Civil Hospital or Medical Board for assessment on the scheduled date.') },
    { step: '4', title: t('rights_page.udid_s4_title', 'Download e-UDID'), desc: t('rights_page.udid_s4_desc', 'Track your application status online; download your digital e-UDID card and receive the plastic card by post.') }
  ];

  const institutes = [
    {
      abbr: 'ISLRTC',
      name: t('rights_page.inst_islrtc_name', 'Indian Sign Language Research and Training Centre'),
      city: t('rights_page.city_delhi', 'New Delhi'),
      desc: t('rights_page.inst_islrtc_desc', 'Standardizes Indian Sign Language dictionary and develops bilingual educational resources.'),
      url: 'https://islrtc.nic.in'
    },
    {
      abbr: 'NIVH / NIEPVD',
      name: t('rights_page.inst_nivh_name', 'National Institute for the Visually Handicapped'),
      city: t('rights_page.city_dehradun', 'Dehradun'),
      desc: t('rights_page.inst_nivh_desc', 'Braille printing presses, vocational skill training, and smart cane distribution.'),
      url: 'https://nivh.gov.in'
    },
    {
      abbr: 'AYJNISHD',
      name: t('rights_page.inst_ayj_name', 'Ali Yavar Jung National Institute of Speech and Hearing Disabilities'),
      city: t('rights_page.city_mumbai', 'Mumbai'),
      desc: t('rights_page.inst_ayj_desc', 'Audiological evaluations, speech therapy, and pediatric cochlear implant guidance.'),
      url: 'http://ayjnihh.nic.in'
    },
    {
      abbr: 'NILD',
      name: t('rights_page.inst_nild_name', 'National Institute for Locomotor Disabilities'),
      city: t('rights_page.city_kolkata', 'Kolkata'),
      desc: t('rights_page.inst_nild_desc', 'Orthotic and prosthetic manufacturing, rehabilitation surgery, and wheelchair ergonomics.'),
      url: 'http://www.nioh.in'
    },
    {
      abbr: 'NIEPID',
      name: t('rights_page.inst_niepid_name', 'National Institute for the Empowerment of Persons with Intellectual Disabilities'),
      city: t('rights_page.city_secunderabad', 'Secunderabad'),
      desc: t('rights_page.inst_niepid_desc', 'Cognitive behavioral therapies, inclusive curriculum planning, and parent counseling.'),
      url: 'https://niepid.nic.in'
    },
    {
      abbr: 'ALIMCO',
      name: t('rights_page.inst_alimco_name', 'Artificial Limbs Manufacturing Corporation of India'),
      city: t('rights_page.city_kanpur', 'Kanpur'),
      desc: t('rights_page.inst_alimco_desc', 'Manufacturer and supplier of motorized tricycles, wheelchairs, and smart assistive aids under ADIP.'),
      url: 'https://www.alimco.in'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="pb-8 border-b-2 border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-xs uppercase tracking-wider">
            <Scale className="w-5 h-5" />
            <span>{t('rights_page.badge', 'National Legal Framework (India)')}</span>
          </div>
          <SpeakButton textToRead={speechSummary} label="RPwD Act Overview" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          {t('rights_page.title', 'Rights & Government Schemes Guide')}
        </h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          {t('rights_page.subtitle', 'Comprehensive legal protections, Unique Disability ID (UDID) application steps, and welfare entitlements under India\'s Rights of Persons with Disabilities (RPwD) Act, 2016.')}
        </p>
      </div>

      {/* 4 Pillars of RPwD Act 2016 */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-purple-600" />
          <span>{t('rights_page.pillars_title', 'Core Provisions of the RPwD Act, 2016')}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((p) => (
            <div key={p.num} className="p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-[var(--bg-surface)]">
              <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-sm mb-3">
                {p.num}
              </span>
              <h3 className="text-xl font-bold mb-2">{p.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* UDID Application Guide */}
      <section className="p-8 rounded-3xl border-2 border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20">
        <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
          <FileCheck className="w-6 h-6 text-blue-600" />
          <span>{t('rights_page.udid_title', 'How to Apply for a UDID (Unique Disability ID) Card')}</span>
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
          {t('rights_page.udid_desc', 'The UDID card is a single, tamper-proof national identity card issued by DEPwD, Government of India, eliminating the need to carry multiple physical medical certificates.')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {udidSteps.map((s) => (
            <div key={s.step} className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 block mb-1">
                {t('rights_page.step_label', 'Step {{num}}', { num: s.step })}
              </span>
              <h3 className="font-bold text-base mb-1">{s.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <a
          href="https://www.swavlambancard.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm touch-target shadow-md"
        >
          <span>{t('rights_page.udid_btn', 'Open Official Swavlamban Portal')}</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </section>

      {/* National Institutes & Helplines */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-emerald-600" />
          <span>{t('rights_page.institutes_title', 'National Apex Institutes in India')}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {institutes.map((inst) => (
            <div key={inst.abbr} className="p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-[var(--bg-surface)] flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
                  {inst.city}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">{inst.abbr}</h3>
                <h4 className="text-xs font-medium text-slate-500 mb-2">{inst.name}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{inst.desc}</p>
              </div>
              <a
                href={inst.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                <span>{t('rights_page.visit_portal', 'Visit Institute Portal')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default RightsAndSchemesPage;
