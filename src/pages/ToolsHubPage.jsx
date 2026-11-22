import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Wrench,
  Volume2,
  Mic,
  MessageSquare,
  Navigation,
  ShieldAlert,
  Sparkles,
  Camera
} from 'lucide-react';
import TTSReaderTool from '../components/tools/TTSReaderTool';
import LiveCaptionsTool from '../components/tools/LiveCaptionsTool';
import AACBoardTool from '../components/tools/AACBoardTool';
import VoiceNavTool from '../components/tools/VoiceNavTool';
import EmergencyCardTool from '../components/tools/EmergencyCardTool';
import DocumentReader from '../components/tools/DocumentReader';

export function ToolsHubPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get('tab') || searchParams.get('tool');
  const [activeTool, setActiveTool] = useState(requestedTab || 'tts');

  useEffect(() => {
    if (requestedTab) {
      setActiveTool(requestedTab);
    }
  }, [requestedTab]);

  const tools = [
    { id: 'tts', label: t('tools.tab_tts', '1. Text-to-Speech Reader'), icon: Volume2 },
    { id: 'captions', label: t('tools.tab_captions', '2. Live Speech Captions'), icon: Mic },
    { id: 'aac', label: t('tools.tab_aac', '3. AAC Picture Board'), icon: MessageSquare },
    { id: 'voicenav', label: t('tools.tab_voicenav', '4. Voice Navigation'), icon: Navigation },
    { id: 'emergency', label: t('tools.tab_emergency', '5. Emergency Medical ID'), icon: ShieldAlert },
    { id: 'docreader', label: t('tools.tab_docreader', '6. AI Document & Signboard Reader (OCR + TTS)'), icon: Camera }
  ];

  const handleSelectTool = (toolId) => {
    setActiveTool(toolId);
    setSearchParams({ tab: toolId });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="pb-6 border-b-2 border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 mb-3">
          <Sparkles className="w-4 h-4" />
          <span>{t('tools.badge', 'Working Assistive Technologies')}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          {t('tools.title', 'Assistive Utilities Suite')}
        </h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          {t('tools.subtitle', 'Free, browser-native assistive utilities designed to support communication, reading, captioning, and emergency safety—without requiring paid APIs or special software.')}
        </p>
      </div>

      {/* Tool Selector Tabs */}
      <div
        role="tablist"
        aria-orientation="horizontal"
        className="flex flex-wrap items-center gap-2 pb-3 border-b-2 border-slate-200 dark:border-slate-800"
      >
        {tools.map((t) => {
          const isSelected = activeTool === t.id;
          const Icon = t.icon;

          return (
            <button
              key={t.id}
              role="tab"
              id={`tool-tab-${t.id}`}
              aria-selected={isSelected}
              aria-controls={`tool-panel-${t.id}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => handleSelectTool(t.id)}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 font-bold text-xs sm:text-sm rounded-xl transition-all touch-target shrink-0 focus-visible:outline-none cursor-pointer ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tool Viewport */}
      <div
        id={`tool-panel-${activeTool}`}
        role="tabpanel"
        aria-labelledby={`tool-tab-${activeTool}`}
        className="pt-2 focus-visible:outline-none"
      >
        {activeTool === 'tts' && <TTSReaderTool />}
        {activeTool === 'captions' && <LiveCaptionsTool />}
        {activeTool === 'aac' && <AACBoardTool />}
        {activeTool === 'voicenav' && <VoiceNavTool />}
        {activeTool === 'emergency' && <EmergencyCardTool />}
        {activeTool === 'docreader' && <DocumentReader />}
      </div>
    </div>
  );
}

export default ToolsHubPage;
