import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Radio, ExternalLink, Maximize2, Minimize2, Info } from 'lucide-react';

export function SmartCane3DSimulator() {
  const { t } = useTranslation();
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className={`relative transition-all ${isFullscreen ? 'fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-2 sm:p-6 backdrop-blur-sm' : 'w-full'}`}>
      <div className={`w-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl border-2 border-blue-300 dark:border-blue-700 p-2 sm:p-4 shadow-xl ${isFullscreen ? 'h-[94vh] flex flex-col' : ''}`}>
        {/* Header Toolbar */}
        <div className="flex items-center justify-between px-2 py-2 mb-2 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
              <Radio className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100">
                {t('smart_cane.title', 'Smart Stick for the Blind (3D Simulation)')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('smart_cane.subtitle', 'Interactive Three.js physics & dual-sensor ultrasonic travel aid')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/smart-stick-sim.html"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
              title="Open standalone 3D simulation in a new tab"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">{t('smart_cane.open_fullpage', 'Open Standalone Tab')}</span>
            </a>
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
              title={isFullscreen ? t('smart_cane.exit_fullscreen', 'Exit Fullscreen') : t('smart_cane.fullscreen', 'Fullscreen view')}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{isFullscreen ? t('smart_cane.exit_fullscreen', 'Exit Fullscreen') : t('smart_cane.fullscreen', 'Fullscreen')}</span>
            </button>
          </div>
        </div>

        {/* Embedded Standalone Simulation Iframe */}
        <div className={`w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-950 ${isFullscreen ? 'flex-1' : ''}`}>
          <iframe
            src="/smart-stick-sim.html"
            title={t('smart_cane.title', 'Smart Stick for the Blind 3D Simulation')}
            className="w-full border-0 block"
            style={{ height: isFullscreen ? '100%' : '880px', minHeight: '800px' }}
            allow="autoplay"
          />
        </div>

        {/* Real-World Context Callout */}
        <div className="mt-3 p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">{t('smart_cane.context_title', 'Real-World Assistive Technology in India:')} </span>
            {t('smart_cane.context_desc', 'This simulation models the SmartCane™ device developed by IIT Delhi (in partnership with Saksham Trust and Phoenix Medical Systems). While traditional white canes only detect obstacles by physical touch on the ground, dual ultrasonic electronic travel aids detect waist/knee-level obstacles and ground drop-offs/potholes 1.5–2 meters in advance via acoustic beeps and haptic vibrations.')}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SmartCane3DSimulator;
