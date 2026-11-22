import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Eye,
  Ear,
  Activity,
  BookOpen,
  Zap,
  AlertTriangle,
  Radio,
  Sparkles,
  Hand,
  MessageSquare,
  Heart,
  ArrowRight
} from 'lucide-react';
import Button from '../common/Button';

export function SimulationHubPage() {
  const { t } = useTranslation();

  const sims = [
    {
      id: 'vision',
      categorySlug: 'visual-impairment',
      title: t('sim_hub.sim_vision_title', 'Optical & Vision Simulator'),
      desc: t('sim_hub.sim_vision_desc', 'Simulate cataracts haze, glaucoma peripheral tunnel vision, macular degeneration central scotoma, and color blindness.'),
      category: t('sim_hub.sim_vision_cat', 'Visual Impairment'),
      icon: Eye
    },
    {
      id: 'smartcane',
      categorySlug: 'visual-impairment',
      title: t('sim_hub.sim_smartcane_title', 'Interactive 3D Smart Cane Simulator'),
      desc: t('sim_hub.sim_smartcane_desc', 'Virtual 3D simulation of dual ultrasonic obstacle detection modeled on the IIT Delhi SmartCane travel aid.'),
      category: t('sim_hub.sim_smartcane_cat', 'Visual Impairment'),
      icon: Radio
    },
    {
      id: 'braille',
      categorySlug: 'visual-impairment',
      title: t('sim_hub.sim_braille_title', 'Interactive Braille & Tactile Reading Lab'),
      desc: t('sim_hub.sim_braille_desc', 'Embossed 6-dot cell interactive matrix, Perkins Brailler keyboard, text-to-Braille translator, and virtual fingertip reading.'),
      category: t('sim_hub.sim_braille_cat', 'Visual Impairment'),
      icon: Sparkles
    },
    {
      id: 'hearing',
      categorySlug: 'hearing-impairment',
      title: t('sim_hub.sim_hearing_title', 'Hearing Frequency & Tinnitus Filter'),
      desc: t('sim_hub.sim_hearing_desc', 'Experience high-frequency auditory attenuation via Web Audio API and simulated tinnitus ringing frequencies.'),
      category: t('sim_hub.sim_hearing_cat', 'Hearing Impairment'),
      icon: Ear
    },
    {
      id: 'isl',
      categorySlug: 'hearing-impairment',
      title: t('sim_hub.sim_isl_title', 'Indian Sign Language (ISL) Interactive Lab'),
      desc: t('sim_hub.sim_isl_desc', 'ISLRTC-aligned conversational signs dictionary, A-Z fingerspelling explorer, and interactive live word-to-sign animator.'),
      category: t('sim_hub.sim_isl_cat', 'Hearing Impairment'),
      icon: Hand
    },
    {
      id: 'motor',
      categorySlug: 'mobility-physical',
      title: t('sim_hub.sim_motor_title', 'Motor Tremor Simulator'),
      desc: t('sim_hub.sim_motor_desc', 'Test fine-motor targeting with a simulated trembling mouse cursor and compare small versus accessible target sizes.'),
      category: t('sim_hub.sim_motor_cat', 'Mobility & Physical'),
      icon: Activity
    },
    {
      id: 'switch',
      categorySlug: 'mobility-physical',
      title: t('sim_hub.sim_switch_title', 'Single-Switch & Scanning Simulator'),
      desc: t('sim_hub.sim_switch_desc', 'Experience switch access with timed auto-scanning and step-scanning through on-screen keyboards and symbols.'),
      category: t('sim_hub.sim_switch_cat', 'Mobility & Physical'),
      icon: Zap
    },
    {
      id: 'aac',
      categorySlug: 'speech-language',
      title: t('sim_hub.sim_aac_title', 'AAC Symbol Board & Speech Synthesizer'),
      desc: t('sim_hub.sim_aac_desc', 'Construct messages using high-contrast pictogram symbols with multilingual speech synthesis and dysfluency filters.'),
      category: t('sim_hub.sim_aac_cat', 'Speech & Language'),
      icon: MessageSquare
    },
    {
      id: 'dyslexia',
      categorySlug: 'learning-disabilities',
      title: t('sim_hub.sim_dyslexia_title', 'Dyslexia Letter-Jitter Simulator'),
      desc: t('sim_hub.sim_dyslexia_desc', 'Watch text letters dynamically rotate, jitter, and swap positions, demonstrating cognitive reading fatigue and reading rulers.'),
      category: t('sim_hub.sim_dyslexia_cat', 'Learning Disabilities'),
      icon: BookOpen
    },
    {
      id: 'adhd',
      categorySlug: 'adhd',
      title: t('sim_hub.sim_adhd_title', 'ADHD Focus Mode vs Distraction Challenge'),
      desc: t('sim_hub.sim_adhd_desc', 'Compare reading comprehension in a chaotic environment with simulated popups versus a stripped-down Focus Mode reader.'),
      category: t('sim_hub.sim_adhd_cat', 'ADHD & Focus'),
      icon: Zap
    },
    {
      id: 'sensory',
      categorySlug: 'autism-spectrum',
      title: t('sim_hub.sim_sensory_title', 'Sensory Overload Awareness Experience'),
      desc: t('sim_hub.sim_sensory_desc', 'An educational simulation illustrating auditory and visual sensory sensitivities, with instant emergency stop control.'),
      category: t('sim_hub.sim_sensory_cat', 'Autism Spectrum'),
      icon: AlertTriangle
    },
    {
      id: 'mental_health',
      categorySlug: 'mental-health',
      title: t('sim_hub.sim_mental_health_title', '5-4-3-2-1 Sensory Grounding & Crisis Support'),
      desc: t('sim_hub.sim_mental_health_desc', 'Multi-sensory de-escalation exercise with Web Audio soundscapes, 4-4-4-4 box breathing pacer, and emergency card generator.'),
      category: t('sim_hub.sim_mental_health_cat', 'Mental Health & Wellbeing'),
      icon: Heart
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="pb-6 border-b-2 border-slate-200 dark:border-slate-800">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-2">
          {t('sim_hub.badge', 'Empathy Engineering')}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          {t('sim_hub.title', 'Interactive Disability Simulators')}
        </h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          {t('sim_hub.subtitle', 'These interactive experiences use pure CSS filters, Web Audio API synthesis, and SVG matrix transforms to approximate different perceptual and motor experiences.')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sims.map((sim) => {
          const Icon = sim.icon;
          return (
            <div
              key={sim.id}
              className="p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-[var(--bg-surface)] flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <Link
                    to={`/simulations/${sim.categorySlug}`}
                    className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-50 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 hover:underline"
                  >
                    {sim.category}
                  </Link>
                </div>

                <h2 className="text-xl font-bold mb-2 text-slate-900 dark:text-slate-100">
                  {sim.title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  {sim.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {t('sim_hub.preview', 'Interactive Preview')}
                </span>
                <Link to={`/simulations/${sim.categorySlug}?sim=${sim.id}`}>
                  <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
                    {t('sim_hub.launch', 'Launch')}
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SimulationHubPage;
